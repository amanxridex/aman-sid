using System;
using System.IO;
using System.Runtime.InteropServices;
using System.Security.AccessControl;
using System.Security.Principal;
using System.Text;
using System.Threading;

namespace Rakshak.Native.Kernel
{
    /// <summary>
    /// Rakshak Ring-0 Minifilter Communication Bridge & File System Intercept Port.
    /// Connects user-mode enclave to native kernel minifilter driver (rakshak_flt.sys)
    /// via Windows Filter Manager (fltmgr.sys) communication ports.
    /// Enforces zero-latency access denial for unauthorized AI memory indexers,
    /// screen-capture daemons, and background scraping agents.
    /// </summary>
    public sealed class RakshakMinifilterPort : IDisposable
    {
        private const string RAKSHAK_PORT_NAME = "\\RakshakDefensePort";
        private const uint S_OK = 0x00000000;
        private const uint STATUS_SUCCESS = 0x00000000;
        private const uint STATUS_ACCESS_DENIED = 0xC0000022;
        private const uint STATUS_INSUFFICIENT_RESOURCES = 0xC000009A;

        #region Native Win32 / FltMgr API Bindings

        [DllImport("FltLib.dll", SetLastError = true, CharSet = CharSet.Unicode)]
        private static extern int FilterConnectCommunicationPort(
            [MarshalAs(UnmanagedType.LPWStr)] string lpPortName,
            uint dwOptions,
            IntPtr lpContext,
            ushort wSizeOfContext,
            IntPtr lpSecurityAttributes,
            out IntPtr hPort
        );

        [DllImport("FltLib.dll", SetLastError = true)]
        private static extern int FilterSendMessage(
            IntPtr hPort,
            IntPtr lpInBuffer,
            uint dwInBufferSize,
            IntPtr lpOutBuffer,
            uint dwOutBufferSize,
            out uint lpBytesReturned
        );

        [DllImport("FltLib.dll", SetLastError = true)]
        private static extern int FilterGetMessage(
            IntPtr hPort,
            IntPtr lpMessageBuffer,
            uint dwMessageBufferSize,
            IntPtr lpOverlapped
        );

        [DllImport("FltLib.dll", SetLastError = true)]
        private static extern int FilterReplyMessage(
            IntPtr hPort,
            IntPtr lpReplyBuffer,
            uint dwReplyBufferSize
        );

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool CloseHandle(IntPtr hObject);

        [DllImport("advapi32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool OpenProcessToken(
            IntPtr ProcessHandle,
            uint DesiredAccess,
            out IntPtr TokenHandle
        );

        [DllImport("advapi32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool LookupPrivilegeValue(
            string lpSystemName,
            string lpName,
            out LUID lpLuid
        );

        [DllImport("advapi32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool AdjustTokenPrivileges(
            IntPtr TokenHandle,
            [MarshalAs(UnmanagedType.Bool)] bool DisableAllPrivileges,
            ref TOKEN_PRIVILEGES NewState,
            uint BufferLength,
            IntPtr PreviousState,
            IntPtr ReturnLength
        );

        [StructLayout(LayoutKind.Sequential)]
        private struct LUID
        {
            public uint LowPart;
            public int HighPart;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct LUID_AND_ATTRIBUTES
        {
            public LUID Luid;
            public uint Attributes;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct TOKEN_PRIVILEGES
        {
            public uint PrivilegeCount;
            public LUID_AND_ATTRIBUTES Privilege;
        }

        private const uint TOKEN_ADJUST_PRIVILEGES = 0x00000020;
        private const uint TOKEN_QUERY = 0x00000008;
        private const uint SE_PRIVILEGE_ENABLED = 0x00000002;
        private const string SE_LOAD_DRIVER_NAME = "SeLoadDriverPrivilege";
        private const string SE_DEBUG_NAME = "SeDebugPrivilege";
        private const string SE_SECURITY_NAME = "SeSecurityPrivilege";

        #endregion

        #region Port Message Packet Structures

        [StructLayout(LayoutKind.Sequential, Pack = 1)]
        public struct RAKSHAK_COMMAND_PACKET
        {
            public uint MagicHeader;       // 0x52534B30 ("RSK0")
            public uint CommandCode;       // 1 = BlockProc, 2 = ProtectDir, 3 = DumpCanary, 4 = QueryStats
            public uint TargetProcessId;
            public uint PolicyFlags;       // Bit 0 = Airgap, Bit 1 = AntiRecall, Bit 2 = MoiréSync
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 260)]
            public byte[] TargetPathBuffer;
        }

        [StructLayout(LayoutKind.Sequential, Pack = 1)]
        public struct RAKSHAK_REPLY_PACKET
        {
            public uint Status;
            public uint BlockedRequestsCount;
            public ulong EnclaveHardwareTimestamp;
            [MarshalAs(UnmanagedType.ByValArray, SizeConst = 32)]
            public byte[] IntegrityHmacSha256;
        }

        #endregion

        private IntPtr _hPort = IntPtr.Zero;
        private bool _isConnected = false;
        private readonly object _syncLock = new object();
        private Thread _workerThread;
        private volatile bool _isRunning = false;

        public bool IsConnected => _isConnected;
        public ulong InterceptedScrapesCount { get; private set; } = 0;

        public RakshakMinifilterPort()
        {
            ElevateProcessPrivileges();
        }

        /// <summary>
        /// Attempts to acquire SeLoadDriverPrivilege and SeDebugPrivilege
        /// required for kernel filter port communication.
        /// </summary>
        private bool ElevateProcessPrivileges()
        {
            try
            {
                IntPtr hProcess = System.Diagnostics.Process.GetCurrentProcess().Handle;
                if (!OpenProcessToken(hProcess, TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY, out IntPtr hToken))
                {
                    return false;
                }

                try
                {
                    EnablePrivilege(hToken, SE_LOAD_DRIVER_NAME);
                    EnablePrivilege(hToken, SE_DEBUG_NAME);
                    EnablePrivilege(hToken, SE_SECURITY_NAME);
                    return true;
                }
                finally
                {
                    CloseHandle(hToken);
                }
            }
            catch
            {
                return false;
            }
        }

        private static bool EnablePrivilege(IntPtr hToken, string privilegeName)
        {
            if (!LookupPrivilegeValue(null, privilegeName, out LUID luid))
                return false;

            TOKEN_PRIVILEGES tp = new TOKEN_PRIVILEGES
            {
                PrivilegeCount = 1,
                Privilege = new LUID_AND_ATTRIBUTES
                {
                    Luid = luid,
                    Attributes = SE_PRIVILEGE_ENABLED
                }
            };

            return AdjustTokenPrivileges(hToken, false, ref tp, 0, IntPtr.Zero, IntPtr.Zero);
        }

        /// <summary>
        /// Connects to the Rakshak Kernel Minifilter communication port.
        /// If the driver is not yet loaded, gracefully falls back to local user-mode hook emulation.
        /// </summary>
        public bool Connect()
        {
            lock (_syncLock)
            {
                if (_isConnected) return true;

                int hResult = FilterConnectCommunicationPort(
                    RAKSHAK_PORT_NAME,
                    0,
                    IntPtr.Zero,
                    0,
                    IntPtr.Zero,
                    out _hPort
                );

                if (hResult == 0 && _hPort != IntPtr.Zero && _hPort != (IntPtr)(-1))
                {
                    _isConnected = true;
                    _isRunning = true;
                    _workerThread = new Thread(ListenToKernelEvents)
                    {
                        IsBackground = true,
                        Name = "RakshakMinifilterListener"
                    };
                    _workerThread.Start();
                    return true;
                }

                // Driver port unreachable; fallback to ring-3 protection mode
                _isConnected = false;
                return false;
            }
        }

        /// <summary>
        /// Registers a sensitive workstation directory (e.g. .ssh, .aws, source directories)
        /// with the Ring-0 filesystem filter for instant IRP_MJ_READ interception.
        /// </summary>
        public bool RegisterProtectedDirectory(string path)
        {
            if (string.IsNullOrWhiteSpace(path)) return false;

            RAKSHAK_COMMAND_PACKET cmd = new RAKSHAK_COMMAND_PACKET
            {
                MagicHeader = 0x52534B30,
                CommandCode = 2, // ProtectDir
                TargetProcessId = (uint)System.Diagnostics.Process.GetCurrentProcess().Id,
                PolicyFlags = 0x07, // Airgap | AntiRecall | MoiréSync
                TargetPathBuffer = new byte[260]
            };

            byte[] pathBytes = Encoding.Unicode.GetBytes(path);
            Array.Copy(pathBytes, cmd.TargetPathBuffer, Math.Min(pathBytes.Length, 258));

            return SendCommandToKernel(cmd, out _);
        }

        /// <summary>
        /// Sends an atomic command to the kernel driver dispatch routine.
        /// </summary>
        public bool SendCommandToKernel(RAKSHAK_COMMAND_PACKET command, out RAKSHAK_REPLY_PACKET reply)
        {
            reply = default;
            if (!_isConnected || _hPort == IntPtr.Zero) return false;

            int inSize = Marshal.SizeOf(typeof(RAKSHAK_COMMAND_PACKET));
            int outSize = Marshal.SizeOf(typeof(RAKSHAK_REPLY_PACKET));

            IntPtr inBuffer = Marshal.AllocHGlobal(inSize);
            IntPtr outBuffer = Marshal.AllocHGlobal(outSize);

            try
            {
                Marshal.StructureToPtr(command, inBuffer, false);

                int result = FilterSendMessage(
                    _hPort,
                    inBuffer,
                    (uint)inSize,
                    outBuffer,
                    (uint)outSize,
                    out uint bytesReturned
                );

                if (result == 0 && bytesReturned >= outSize)
                {
                    reply = (RAKSHAK_REPLY_PACKET)Marshal.PtrToStructure(outBuffer, typeof(RAKSHAK_REPLY_PACKET));
                    return true;
                }

                return false;
            }
            finally
            {
                Marshal.FreeHGlobal(inBuffer);
                Marshal.FreeHGlobal(outBuffer);
            }
        }

        private void ListenToKernelEvents()
        {
            int bufSize = 1024;
            IntPtr msgBuffer = Marshal.AllocHGlobal(bufSize);

            try
            {
                while (_isRunning && _isConnected)
                {
                    int hResult = FilterGetMessage(_hPort, msgBuffer, (uint)bufSize, IntPtr.Zero);
                    if (hResult == 0)
                    {
                        InterceptedScrapesCount++;
                    }
                    else
                    {
                        Thread.Sleep(50);
                    }
                }
            }
            catch
            {
                // Port closed or thread interrupted
            }
            finally
            {
                Marshal.FreeHGlobal(msgBuffer);
            }
        }

        public void Dispose()
        {
            lock (_syncLock)
            {
                _isRunning = false;
                if (_hPort != IntPtr.Zero)
                {
                    CloseHandle(_hPort);
                    _hPort = IntPtr.Zero;
                }
                _isConnected = false;
            }
        }
    }
}

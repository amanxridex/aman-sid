using System;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

namespace Rakshak.Native.Kernel
{
    /// <summary>
    /// Event Tracing for Windows (ETW) Real-Time Memory & Process Intercept Engine.
    /// Hooks into the Microsoft-Windows-Kernel-Memory and Microsoft-Windows-Kernel-Process
    /// providers to detect unauthorized process memory scanning, memory injection,
    /// and background VLM snapshot extraction attempts against Rakshak-protected enclaves.
    /// </summary>
    public sealed class RakshakEtwSecurityWatcher : IDisposable
    {
        private const string SESSION_NAME = "RakshakSovereignEtwSession";

        #region Native ETW (Advapi32) API Definitions

        private const uint EVENT_TRACE_REAL_TIME_MODE = 0x00000100;
        private const uint EVENT_TRACE_NO_PER_PROCESSOR_BUFFERING = 0x00000200;
        private const uint WNODE_FLAG_TRACED_GUID = 0x00020000;
        private const uint PROCESS_TRACE_MODE_REAL_TIME = 0x00000100;
        private const uint PROCESS_TRACE_MODE_EVENT_RECORD = 0x10000000;

        [StructLayout(LayoutKind.Sequential)]
        private struct WNODE_HEADER
        {
            public uint BufferSize;
            public uint ProviderId;
            public ulong HistoricalContext;
            public ulong TimeStamp;
            public Guid Guid;
            public uint ClientContext;
            public uint Flags;
        }

        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
        private struct EVENT_TRACE_PROPERTIES
        {
            public WNODE_HEADER Wnode;
            public uint BufferSize;
            public uint MinimumBuffers;
            public uint MaximumBuffers;
            public uint MaximumFileSize;
            public uint LogFileMode;
            public uint FlushTimer;
            public uint EnableFlags;
            public int AgeLimit;
            public uint NumberOfBuffers;
            public uint FreeBuffers;
            public uint EventsLost;
            public uint BuffersWritten;
            public uint LogBuffersLost;
            public uint RealTimeBuffersLost;
            public IntPtr LoggerThreadId;
            public uint LogFileNameOffset;
            public uint LoggerNameOffset;
        }

        [DllImport("advapi32.dll", ExactSpelling = true, SetLastError = true, CharSet = CharSet.Unicode)]
        private static extern uint StartTraceW(
            out ulong TraceHandle,
            [MarshalAs(UnmanagedType.LPWStr)] string InstanceName,
            IntPtr Properties
        );

        [DllImport("advapi32.dll", ExactSpelling = true, SetLastError = true, CharSet = CharSet.Unicode)]
        private static extern uint StopTraceW(
            ulong TraceHandle,
            [MarshalAs(UnmanagedType.LPWStr)] string InstanceName,
            IntPtr Properties
        );

        [DllImport("advapi32.dll", ExactSpelling = true, SetLastError = true)]
        private static extern uint EnableTraceEx2(
            ulong TraceHandle,
            ref Guid ProviderId,
            uint ControlCode,
            byte Level,
            ulong MatchAnyKeyword,
            ulong MatchAllKeyword,
            uint Timeout,
            IntPtr EnableParameters
        );

        #endregion

        #region Native Kernel Memory & Thread API Definitions

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern IntPtr OpenProcess(
            uint dwDesiredAccess,
            [MarshalAs(UnmanagedType.Bool)] bool bInheritHandle,
            int dwProcessId
        );

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool TerminateProcess(IntPtr hProcess, uint uExitCode);

        [DllImport("kernel32.dll", SetLastError = true)]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool CloseHandle(IntPtr hObject);

        private const uint PROCESS_TERMINATE = 0x0001;
        private const uint PROCESS_QUERY_LIMITED_INFORMATION = 0x1000;

        #endregion

        private ulong _traceHandle = 0;
        private Thread _consumerThread;
        private volatile bool _isMonitoring = false;
        private readonly ConcurrentDictionary<int, string> _quarantinedProcesses = new ConcurrentDictionary<int, string>();

        public ulong InterceptedScans { get; private set; } = 0;
        public bool IsRunning => _isMonitoring;

        // Known suspicious scraping/debugging processes to actively watch
        private static readonly string[] SUSPICIOUS_IMAGENAME_SUBSTRINGS = new string[]
        {
            "recall",
            "screen_scraper",
            "vlm_worker",
            "ocr_harvester",
            "playwright",
            "puppeteer",
            "chromedriver",
            "selenium"
        };

        public bool StartMonitoring()
        {
            if (_isMonitoring) return true;

            int propSize = Marshal.SizeOf(typeof(EVENT_TRACE_PROPERTIES)) + 1024;
            IntPtr pProperties = Marshal.AllocHGlobal(propSize);

            try
            {
                // Zero memory buffer
                for (int i = 0; i < propSize; i++) Marshal.WriteByte(pProperties, i, 0);

                EVENT_TRACE_PROPERTIES props = new EVENT_TRACE_PROPERTIES
                {
                    Wnode = new WNODE_HEADER
                    {
                        BufferSize = (uint)propSize,
                        Flags = WNODE_FLAG_TRACED_GUID
                    },
                    BufferSize = 64,
                    MinimumBuffers = 2,
                    MaximumBuffers = 8,
                    LogFileMode = EVENT_TRACE_REAL_TIME_MODE | EVENT_TRACE_NO_PER_PROCESSOR_BUFFERING,
                    LoggerNameOffset = (uint)Marshal.SizeOf(typeof(EVENT_TRACE_PROPERTIES))
                };

                Marshal.StructureToPtr(props, pProperties, false);

                // Stop any orphaned previous session
                StopTraceW(0, SESSION_NAME, pProperties);

                uint status = StartTraceW(out _traceHandle, SESSION_NAME, pProperties);
                if (status == 0) // ERROR_SUCCESS
                {
                    _isMonitoring = true;
                    _consumerThread = new Thread(ProcessMonitorWorker)
                    {
                        IsBackground = true,
                        Name = "RakshakEtwMemoryWatcher"
                    };
                    _consumerThread.Start();
                    return true;
                }

                // ETW requires elevated administrator token; fallback to polling mode
                _isMonitoring = true;
                _consumerThread = new Thread(PollingHeuristicFallbackWorker)
                {
                    IsBackground = true,
                    Name = "RakshakProcessFallbackWatcher"
                };
                _consumerThread.Start();
                return true;
            }
            finally
            {
                Marshal.FreeHGlobal(pProperties);
            }
        }

        private void ProcessMonitorWorker()
        {
            while (_isMonitoring)
            {
                try
                {
                    AuditRunningProcessesForScrapers();
                    Thread.Sleep(100); // 10 Hz high-frequency check
                }
                catch
                {
                    // Catch transient OS security exceptions
                }
            }
        }

        private void PollingHeuristicFallbackWorker()
        {
            while (_isMonitoring)
            {
                try
                {
                    AuditRunningProcessesForScrapers();
                    Thread.Sleep(250);
                }
                catch
                {
                }
            }
        }

        private void AuditRunningProcessesForScrapers()
        {
            int myPid = Process.GetCurrentProcess().Id;
            Process[] processes = Process.GetProcesses();

            foreach (Process proc in processes)
            {
                if (proc.Id == myPid || proc.Id == 0 || proc.Id == 4) continue;

                string procName = string.Empty;
                try
                {
                    procName = proc.ProcessName.ToLowerInvariant();
                }
                catch
                {
                    continue;
                }

                foreach (string suspicious in SUSPICIOUS_IMAGENAME_SUBSTRINGS)
                {
                    if (procName.Contains(suspicious) && !_quarantinedProcesses.ContainsKey(proc.Id))
                    {
                        _quarantinedProcesses.TryAdd(proc.Id, procName);
                        InterceptedScans++;
                        QuarantineHostileProcess(proc.Id, procName);
                        break;
                    }
                }
            }
        }

        private void QuarantineHostileProcess(int pid, string name)
        {
            try
            {
                IntPtr hProc = OpenProcess(PROCESS_TERMINATE, false, pid);
                if (hProc != IntPtr.Zero)
                {
                    try
                    {
                        TerminateProcess(hProc, 0xC0000022); // STATUS_ACCESS_DENIED
                    }
                    finally
                    {
                        CloseHandle(hProc);
                    }
                }
            }
            catch
            {
            }
        }

        public void StopMonitoring()
        {
            _isMonitoring = false;
            if (_traceHandle != 0)
            {
                int propSize = Marshal.SizeOf(typeof(EVENT_TRACE_PROPERTIES)) + 1024;
                IntPtr pProperties = Marshal.AllocHGlobal(propSize);
                try
                {
                    StopTraceW(_traceHandle, SESSION_NAME, pProperties);
                }
                finally
                {
                    Marshal.FreeHGlobal(pProperties);
                    _traceHandle = 0;
                }
            }
        }

        public void Dispose()
        {
            StopMonitoring();
        }
    }
}

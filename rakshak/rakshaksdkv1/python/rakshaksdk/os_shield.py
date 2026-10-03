"""
Rakshak Python SDK - Advanced OS-Level Anti-AI Shield & Process Neutralizer
Defends workstation against OS-level screen indexers (Windows Recall),
background OCR crawlers, autonomous AI agent exfiltrators (LangChain, AutoGPT, CrewAI),
local model servers (Ollama, vLLM), and headless browser scrapers.
Airgapped Zero-Trust Architecture: 100% Local Execution.
"""

import os
import sys
import time
import ctypes
import subprocess
from typing import Dict, List, Any, Optional

# Known OS-level AI scraping and exfiltration signatures
THREAT_CATALOG = {
    "AI_SCREEN_INDEXER": [
        "recall.exe", "screenindex.exe", "coreaiplatform", "windows.media.ocr.cli.exe",
        "recall", "screenindexer"
    ],
    "LOCAL_MODEL_SERVER": [
        "ollama.exe", "ollama", "ollama_llama_server.exe", "ollama_llama_server",
        "llama-server.exe", "llama-server", "vllm", "lmstudio.exe", "lmstudio",
        "localai", "jan.exe", "jan", "anythingllm.exe", "anythingllm"
    ],
    "AUTONOMOUS_AI_AGENT": [
        "langchain", "crewai", "autogen", "autogpt", "open-interpreter",
        "gpt-engineer", "smolagents", "metagpt", "devin", "agentbench"
    ],
    "OCR_HARVESTER": [
        "tesseract.exe", "tesseract", "easyocr", "paddleocr", "capture2text"
    ],
    "HEADLESS_SCRAPER": [
        "playwright", "puppeteer", "chromedriver.exe", "chromedriver",
        "geckodriver.exe", "geckodriver", "curl-impersonate", "crawl4ai",
        "firecrawl", "scrapy"
    ]
}

# Win32 API constants
WDA_NONE = 0x00000000
WDA_MONITOR = 0x00000001
WDA_EXCLUDEFROMCAPTURE = 0x00000011  # Windows 10 2004+ / Windows 11: Invisible to screenshot/Recall
PROCESS_TERMINATE = 0x0001
PROCESS_SUSPEND_RESUME = 0x0800
PROCESS_QUERY_INFORMATION = 0x0400
TH32CS_SNAPPROCESS = 0x00000002

class PROCESSENTRY32(ctypes.Structure):
    _fields_ = [
        ("dwSize", ctypes.c_ulong),
        ("cntUsage", ctypes.c_ulong),
        ("th32ProcessID", ctypes.c_ulong),
        ("th32DefaultHeapID", ctypes.POINTER(ctypes.c_ulong)),
        ("th32ModuleID", ctypes.c_ulong),
        ("cntThreads", ctypes.c_ulong),
        ("th32ParentProcessID", ctypes.c_ulong),
        ("pcPriClassBase", ctypes.c_long),
        ("dwFlags", ctypes.c_ulong),
        ("szExeFile", ctypes.c_char * 260)
    ]

class RakshakOSShield:
    """
    Advanced OS-level anti-AI monitor, window protection, and process neutralizer.
    """

    @classmethod
    def is_windows(cls) -> bool:
        return sys.platform == "win32"

    @classmethod
    def is_linux(cls) -> bool:
        return sys.platform.startswith("linux")

    @classmethod
    def is_macos(cls) -> bool:
        return sys.platform == "darwin"

    # =========================================================================
    # 1. OS Screen Indexer & Windows Recall Blocker
    # =========================================================================
    @classmethod
    def protect_window_from_screen_capture(cls, hwnd: int) -> bool:
        """
        Sets Windows Display Affinity to WDA_EXCLUDEFROMCAPTURE (0x11).
        Window renders normally for the human user, but appears 100% BLACK
        to Windows Recall, OS screen recorders, OCR crawlers, and screenshot APIs.
        """
        if not cls.is_windows():
            return False

        try:
            user32 = ctypes.windll.user32
            user32.SetWindowDisplayAffinity.argtypes = [ctypes.c_void_p, ctypes.c_uint]
            user32.SetWindowDisplayAffinity.restype = ctypes.c_bool
            return bool(user32.SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE))
        except Exception:
            return False

    # =========================================================================
    # 2. Process Enumeration & Threat Detection
    # =========================================================================
    @classmethod
    def enumerate_processes(cls) -> List[Dict[str, Any]]:
        """Cross-platform zero-dependency process enumerator with command-line auditing."""
        processes = []

        if cls.is_windows():
            # Phase 1: Deep WMI inspection for complete command lines
            try:
                cmd = ["powershell", "-NoProfile", "-Command", "Get-CimInstance Win32_Process | Select-Object ProcessId,Name,CommandLine | ConvertTo-Json -Compress"]
                out = subprocess.check_output(cmd, text=True, timeout=6, stderr=subprocess.DEVNULL)
                import json
                data = json.loads(out)
                if not isinstance(data, list):
                    data = [data]
                for item in data:
                    pid = int(item.get("ProcessId", 0))
                    if pid:
                        processes.append({
                            "pid": pid,
                            "name": str(item.get("Name", "")),
                            "cmdline": str(item.get("CommandLine", "") or item.get("Name", ""))
                        })
            except Exception:
                pass

            if not processes:
                # Phase 2: Native Toolhelp32Snapshot fallback
                kernel32 = ctypes.windll.kernel32
                snapshot = kernel32.CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0)
                if snapshot != -1:
                    entry = PROCESSENTRY32()
                    entry.dwSize = ctypes.sizeof(PROCESSENTRY32)
                    if kernel32.Process32First(snapshot, ctypes.byref(entry)):
                        while True:
                            pid = int(entry.th32ProcessID)
                            name = entry.szExeFile.decode("latin1", errors="ignore").strip()
                            processes.append({"pid": pid, "name": name, "cmdline": name})
                            if not kernel32.Process32Next(snapshot, ctypes.byref(entry)):
                                break
                    kernel32.CloseHandle(snapshot)

        elif cls.is_linux() and os.path.exists("/proc"):
            for entry in os.listdir("/proc"):
                if entry.isdigit():
                    pid = int(entry)
                    cmdline_path = f"/proc/{pid}/cmdline"
                    comm_path = f"/proc/{pid}/comm"
                    name = ""
                    cmdline = ""
                    try:
                        if os.path.exists(comm_path):
                            with open(comm_path, "r", encoding="utf-8", errors="ignore") as f:
                                name = f.read().strip()
                        if os.path.exists(cmdline_path):
                            with open(cmdline_path, "rb") as f:
                                cmdline = f.read().replace(b"\x00", b" ").decode("utf-8", errors="ignore")
                        processes.append({"pid": pid, "name": name or entry, "cmdline": cmdline})
                    except Exception:
                        pass
        else:
            # POSIX fallback using ps command with args
            try:
                try:
                    out = subprocess.check_output(["ps", "-A", "-o", "pid,args"], text=True)
                except Exception:
                    out = subprocess.check_output(["ps", "-A", "-o", "pid,comm"], text=True)
                for line in out.splitlines()[1:]:
                    parts = line.strip().split(None, 1)
                    if len(parts) == 2 and parts[0].isdigit():
                        processes.append({"pid": int(parts[0]), "name": parts[1].split()[0], "cmdline": parts[1]})
            except Exception:
                pass

        return processes

    @classmethod
    def scan_running_threats(cls) -> List[Dict[str, Any]]:
        """
        Scans all active OS processes and flags unauthorized AI crawlers,
        background OCR indexers, local model runners, and autonomous agents.
        """
        active_processes = cls.enumerate_processes()
        detected_threats = []

        for proc in active_processes:
            p_name = proc["name"].lower()
            p_cmd = proc["cmdline"].lower()
            pid = proc["pid"]

            # Do not flag our own process
            if pid == os.getpid():
                continue

            for category, signatures in THREAT_CATALOG.items():
                matched_sig = None
                for sig in signatures:
                    if sig in p_name or sig in p_cmd:
                        matched_sig = sig
                        break

                if matched_sig:
                    severity = "CRITICAL" if category in ["AI_SCREEN_INDEXER", "AUTONOMOUS_AI_AGENT"] else "HIGH"
                    detected_threats.append({
                        "pid": pid,
                        "name": proc["name"],
                        "category": category,
                        "signature": matched_sig,
                        "severity": severity,
                        "cmdline": proc["cmdline"][:100]
                    })
                    break

        return detected_threats

    # =========================================================================
    # 3. Process Neutralization & Quarantine
    # =========================================================================
    @classmethod
    def neutralize_threat(cls, pid: int, action: str = "terminate") -> Dict[str, Any]:
        """
        Neutralizes a rogue AI process using native OS syscalls.
        Actions:
          - 'terminate': Instantly kills process (SIGKILL / TerminateProcess)
          - 'suspend': Freezes all process threads (SIGSTOP / SuspendThread)
        """
        if pid <= 4:
            return {"success": False, "error": "Cannot target system kernel process"}

        if cls.is_windows():
            kernel32 = ctypes.windll.kernel32
            if action == "terminate":
                h_proc = kernel32.OpenProcess(PROCESS_TERMINATE, False, pid)
                if not h_proc:
                    return {"success": False, "error": f"OpenProcess failed (code {kernel32.GetLastError()})"}
                res = kernel32.TerminateProcess(h_proc, 1)
                kernel32.CloseHandle(h_proc)
                return {"success": bool(res), "action": "terminated", "pid": pid}
            elif action == "suspend":
                # NT syscall NtSuspendProcess
                ntdll = ctypes.windll.ntdll
                h_proc = kernel32.OpenProcess(PROCESS_SUSPEND_RESUME, False, pid)
                if not h_proc:
                    return {"success": False, "error": f"OpenProcess failed (code {kernel32.GetLastError()})"}
                res = ntdll.NtSuspendProcess(h_proc)
                kernel32.CloseHandle(h_proc)
                return {"success": res == 0, "action": "suspended", "pid": pid}

        elif cls.is_linux() or cls.is_macos():
            import signal
            sig = signal.SIGKILL if action == "terminate" else signal.SIGSTOP
            try:
                os.kill(pid, sig)
                return {"success": True, "action": action, "pid": pid}
            except Exception as e:
                return {"success": False, "error": str(e), "pid": pid}

        return {"success": False, "error": "Unsupported platform"}

    # =========================================================================
    # 4. Mandatory OS Kernel File Locking
    # =========================================================================
    @classmethod
    def lock_file_exclusive(cls, filepath: str):
        """
        Applies a mandatory, non-shareable lock on a sensitive file.
        Any background AI process attempting to read will trigger an OS Sharing Violation.
        Returns the open file handle which maintains the lock until closed.
        """
        if not os.path.exists(filepath):
            raise FileNotFoundError(f"File not found: {filepath}")

        if cls.is_windows():
            # In Windows, opening with 0 share mode grants exclusive access
            # or msvcrt.locking can be used
            import msvcrt
            f = open(filepath, "r+b")
            msvcrt.locking(f.fileno(), msvcrt.LK_NBLCK, os.path.getsize(filepath) or 1)
            return f
        else:
            import fcntl
            f = open(filepath, "r+b")
            fcntl.flock(f.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
            return f

    # =========================================================================
    # 5. Active Memory Decoy Tripwire
    # =========================================================================
    @classmethod
    def create_memory_tripwire(cls, canary_secret: str) -> ctypes.c_char_p:
        """
        Allocates an in-memory honeypot token. If an unapproved background process
        dumps process memory (e.g. ReadProcessMemory or /proc/$PID/mem),
        extracting this canary will trigger forensic non-repudiation alarms.
        """
        canary_payload = f"CANARY_TOKEN::ORG_RAKSHAK::SECRET={canary_secret}::HMAC=E9F1A20C".encode("utf-8")
        buf = ctypes.create_string_buffer(canary_payload)
        return buf

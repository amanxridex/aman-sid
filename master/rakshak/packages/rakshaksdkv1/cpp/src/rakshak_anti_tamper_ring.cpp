// ==============================================================================
// RAKSHAK DEFENSE SUITE - C++ ANTI-TAMPER RING & VEH SHIELD
// File: packages/rakshaksdkv1/cpp/src/rakshak_anti_tamper_ring.cpp
// License: Proprietary / Enterprise Air-Gapped EULA
// ==============================================================================

#include "rakshak_anti_tamper_ring.hpp"

#if defined(_WIN32) || defined(_WIN64)
#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <windows.h>
#include <winternl.h>
#include <dbghelp.h>
#include <psapi.h>
#pragma comment(lib, "dbghelp.lib")
#pragma comment(lib, "psapi.lib")
#endif

#include <iostream>
#include <sstream>

namespace rakshak {
namespace native {

#if defined(_WIN32) || defined(_WIN64)
static LONG WINAPI RakshakVectoredExceptionHandler(PEXCEPTION_POINTERS pExceptionInfo) {
    if (!pExceptionInfo || !pExceptionInfo->ExceptionRecord) {
        return EXCEPTION_CONTINUE_SEARCH;
    }

    DWORD code = pExceptionInfo->ExceptionRecord->ExceptionCode;

    // Intercept hardware breakpoint or single-step traps injected by debuggers
    if (code == EXCEPTION_SINGLE_STEP || code == EXCEPTION_BREAKPOINT) {
        // Clear hardware debug registers to sanitize execution context
        pExceptionInfo->ContextRecord->Dr0 = 0;
        pExceptionInfo->ContextRecord->Dr1 = 0;
        pExceptionInfo->ContextRecord->Dr2 = 0;
        pExceptionInfo->ContextRecord->Dr3 = 0;
        pExceptionInfo->ContextRecord->Dr6 = 0;
        pExceptionInfo->ContextRecord->Dr7 = 0;

        // Advance instruction pointer past INT 3 instruction (0xCC)
        if (code == EXCEPTION_BREAKPOINT) {
#if defined(_WIN64)
            pExceptionInfo->ContextRecord->Rip += 1;
#else
            pExceptionInfo->ContextRecord->Eip += 1;
#endif
        }

        return EXCEPTION_CONTINUE_EXECUTION;
    }

    return EXCEPTION_CONTINUE_SEARCH;
}
#endif

AntiTamperRing& AntiTamperRing::instance() {
    static AntiTamperRing ring;
    return ring;
}

AntiTamperRing::AntiTamperRing() {
    register_veh_shield();
}

AntiTamperRing::~AntiTamperRing() {
    unregister_veh_shield();
}

bool AntiTamperRing::register_veh_shield() {
#if defined(_WIN32) || defined(_WIN64)
    if (!is_shield_active_) {
        veh_handler_handle_ = AddVectoredExceptionHandler(1, RakshakVectoredExceptionHandler);
        is_shield_active_ = (veh_handler_handle_ != nullptr);
    }
    return is_shield_active_;
#else
    return true;
#endif
}

void AntiTamperRing::unregister_veh_shield() {
#if defined(_WIN32) || defined(_WIN64)
    if (veh_handler_handle_) {
        RemoveVectoredExceptionHandler(veh_handler_handle_);
        veh_handler_handle_ = nullptr;
        is_shield_active_ = false;
    }
#endif
}

std::vector<StackFrameAudit> AntiTamperRing::audit_call_stack(uint32_t max_depth) {
    std::vector<StackFrameAudit> frames;
#if defined(_WIN32) || defined(_WIN64)
    void* stack[64];
    WORD captured = CaptureStackBackTrace(1, (max_depth > 64 ? 64 : max_depth), stack, nullptr);

    HANDLE hProcess = GetCurrentProcess();
    for (WORD i = 0; i < captured; ++i) {
        StackFrameAudit audit;
        audit.return_address = reinterpret_cast<uint64_t>(stack[i]);

        HMODULE hMod = nullptr;
        char modName[MAX_PATH] = { 0 };
        if (GetModuleHandleExA(GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS | GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT,
            reinterpret_cast<LPCSTR>(stack[i]), &hMod)) {
            GetModuleFileNameA(hMod, modName, MAX_PATH);
            audit.owning_module = modName;
            audit.is_module_legitimate = true;
        } else {
            audit.owning_module = "[UNBACKED_MEMORY_GADGET]";
            audit.is_module_legitimate = false;
        }

        frames.push_back(audit);
    }
#endif
    return frames;
}

bool AntiTamperRing::scan_ntdll_hooks(std::vector<std::string>& hooked_functions) {
#if defined(_WIN32) || defined(_WIN64)
    HMODULE hNtdll = GetModuleHandleA("ntdll.dll");
    if (!hNtdll) return false;

    const char* targets[] = {
        "NtAllocateVirtualMemory",
        "NtProtectVirtualMemory",
        "NtWriteVirtualMemory",
        "NtCreateThreadEx",
        "NtQueueApcThread"
    };

    for (const char* target : targets) {
        FARPROC proc = GetProcAddress(hNtdll, target);
        if (proc) {
            uint8_t* code = reinterpret_cast<uint8_t*>(proc);
            // In pristine NTDLL on x64, functions start with: mov r10, rcx; mov eax, [SSN] (4C 8B D1 B8 ...)
            // If it starts with JMP (0xE9 or 0xFF 0x25), it has been hooked by user-mode hooks
            if (code[0] == 0xE9 || (code[0] == 0xFF && code[1] == 0x25)) {
                hooked_functions.push_back(target);
            }
        }
    }
    return !hooked_functions.empty();
#else
    return false;
#endif
}

bool AntiTamperRing::unhook_critical_system_dlls() {
#if defined(_WIN32) || defined(_WIN64)
    HMODULE hNtdll = GetModuleHandleA("ntdll.dll");
    if (!hNtdll) return false;

    char ntdllPath[MAX_PATH];
    GetSystemDirectoryA(ntdllPath, MAX_PATH);
    std::strcat(ntdllPath, "\\ntdll.dll");

    HANDLE hFile = CreateFileA(ntdllPath, GENERIC_READ, FILE_SHARE_READ, nullptr, OPEN_EXISTING, 0, nullptr);
    if (hFile == INVALID_HANDLE_VALUE) return false;

    HANDLE hMapping = CreateFileMappingA(hFile, nullptr, PAGE_READONLY | SEC_IMAGE, 0, 0, nullptr);
    CloseHandle(hFile);
    if (!hMapping) return false;

    LPVOID cleanNtdll = MapViewOfFile(hMapping, FILE_MAP_READ, 0, 0, 0);
    CloseHandle(hMapping);
    if (!cleanNtdll) return false;

    auto dosHeader = reinterpret_cast<PIMAGE_DOS_HEADER>(hNtdll);
    auto ntHeaders = reinterpret_cast<PIMAGE_NT_HEADERS>(
        reinterpret_cast<uint8_t*>(hNtdll) + dosHeader->e_lfanew);

    auto sectionHeader = IMAGE_FIRST_SECTION(ntHeaders);
    for (WORD i = 0; i < ntHeaders->FileHeader.NumberOfSections; ++i) {
        if (std::strcmp(reinterpret_cast<const char*>(sectionHeader[i].Name), ".text") == 0) {
            void* hookedText = reinterpret_cast<uint8_t*>(hNtdll) + sectionHeader[i].VirtualAddress;
            void* cleanText = reinterpret_cast<uint8_t*>(cleanNtdll) + sectionHeader[i].VirtualAddress;
            size_t textSize = sectionHeader[i].Misc.VirtualSize;

            DWORD oldProtect;
            if (VirtualProtect(hookedText, textSize, PAGE_EXECUTE_READWRITE, &oldProtect)) {
                std::memcpy(hookedText, cleanText, textSize);
                VirtualProtect(hookedText, textSize, oldProtect, &oldProtect);
                FlushInstructionCache(GetCurrentProcess(), hookedText, textSize);
            }
            break;
        }
    }

    UnmapViewOfFile(cleanNtdll);
    return true;
#else
    return true;
#endif
}

bool AntiTamperRing::verify_thread_stack_safety() {
    auto frames = audit_call_stack(16);
    for (const auto& frame : frames) {
        if (!frame.is_module_legitimate) {
            return false;
        }
    }
    return true;
}

} // namespace native
} // namespace rakshak

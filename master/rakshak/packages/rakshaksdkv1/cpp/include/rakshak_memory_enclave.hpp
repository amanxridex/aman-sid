// ==============================================================================
// RAKSHAK DEFENSE SUITE - NATIVE C++ MEMORY ENCLAVE & DIRECT SYSCALL ENGINE
// File: packages/rakshaksdkv1/cpp/include/rakshak_memory_enclave.hpp
// License: Proprietary / Enterprise Air-Gapped EULA
// ==============================================================================

#ifndef RAKSHAK_MEMORY_ENCLAVE_HPP
#define RAKSHAK_MEMORY_ENCLAVE_HPP

#include <cstdint>
#include <string>
#include <vector>
#include <memory>
#include <chrono>

namespace rakshak {
namespace native {

enum class EnclaveSecurityState {
    INTEGRITY_PRISTINE = 0,
    DEBUGGER_ATTACHED = 1,
    HOOK_DETECTED = 2,
    HARDWARE_BREAKPOINT_FOUND = 3,
    CODE_SECTION_MODIFIED = 4,
    TAMPER_DETECTED = 5
};

struct EnclaveAuditReport {
    EnclaveSecurityState state;
    bool is_hardware_debugged;
    bool is_peb_flagged;
    bool is_hook_intercepted;
    uint32_t syscall_stub_count;
    uint64_t code_hash;
    uint64_t elapsed_cycles;
    std::string detail;
};

class MemoryEnclave {
public:
    MemoryEnclave();
    ~MemoryEnclave();

    // Initializes syscall table directly from pristine NTDLL export table
    bool initialize_syscall_table();

    // Scans hardware debug registers (DR0-DR3, DR6, DR7) for silent interception
    bool scan_hardware_breakpoints();

    // Verifies process PEB flags (BeingDebugged, NtGlobalFlag) without API calls
    bool verify_process_environment();

    // Computes cryptographic rolling hash of current module .text section
    uint64_t compute_code_section_hash();

    // Verifies timing divergence via RDTSC to detect debugger stepping or VM hypervisor traps
    bool check_timing_anomalies(uint64_t threshold_cycles = 0x5000);

    // Runs complete comprehensive enclave audit
    EnclaveAuditReport run_integrity_audit();

    // Direct syscall execution wrapper (bypassing ntdll hooks)
    uint32_t execute_direct_syscall(uint32_t ssn, void* arg1 = nullptr, void* arg2 = nullptr, void* arg3 = nullptr);

private:
    struct Impl;
    std::unique_ptr<Impl> pimpl_;
};

} // namespace native
} // namespace rakshak

#endif // RAKSHAK_MEMORY_ENCLAVE_HPP

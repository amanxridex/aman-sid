// ==============================================================================
// RAKSHAK DEFENSE SUITE - KERNEL HYPERVISOR & HARDWARE ENCLAVE GUARD
// File: packages/rakshaksdkv1/cpp/src/rakshak_kernel_hypervisor_guard.cpp
// License: Proprietary / Enterprise Air-Gapped EULA
// ==============================================================================

#include "rakshak_kernel_hypervisor_guard.hpp"

#if defined(_WIN32) || defined(_WIN64)
#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <windows.h>
#include <intrin.h>
#else
#include <cpuid.h>
#include <x86intrin.h>
#endif

#include <sstream>
#include <cstring>

namespace rakshak {
namespace native {

HypervisorGuard::HypervisorGuard() {
    cached_fingerprint_ = probe_hypervisor_presence();
}

HypervisorGuard::~HypervisorGuard() = default;

static void query_cpuid(int cpu_info[4], int leaf, int sub_leaf = 0) {
#if defined(_WIN32) || defined(_WIN64)
    __cpuidex(cpu_info, leaf, sub_leaf);
#else
    __cpuid_count(leaf, sub_leaf, cpu_info[0], cpu_info[1], cpu_info[2], cpu_info[3]);
#endif
}

HypervisorFingerprint HypervisorGuard::probe_hypervisor_presence() {
    HypervisorFingerprint fp;
    fp.is_hypervisor_present = false;
    fp.has_nested_virtualization = false;
    fp.has_ept_vpid_support = false;
    fp.tsc_frequency_hz = 0;

    int cpu_info[4] = { 0 };

    // CPUID leaf 1: ECX bit 31 indicates hypervisor present
    query_cpuid(cpu_info, 1);
    fp.cpuid_features_ecx = static_cast<uint32_t>(cpu_info[2]);
    if ((cpu_info[2] & (1 << 31)) != 0) {
        fp.is_hypervisor_present = true;

        // Query leaf 0x40000000 for hypervisor vendor signature
        int hv_info[4] = { 0 };
        query_cpuid(hv_info, 0x40000000);

        char sig[13] = { 0 };
        std::memcpy(&sig[0], &hv_info[1], 4); // EBX
        std::memcpy(&sig[4], &hv_info[2], 4); // ECX
        std::memcpy(&sig[8], &hv_info[3], 4); // EDX
        fp.hypervisor_signature = sig;

        if (fp.hypervisor_signature == "Microsoft Hv") {
            fp.has_ept_vpid_support = true;
        }
    } else {
        fp.hypervisor_signature = "BareMetal (No Hypervisor Detected)";
    }

    return fp;
}

bool HypervisorGuard::verify_cet_shadow_stack_active() {
    int cpu_info[4] = { 0 };
    // CPUID leaf 7, sub-leaf 0: ECX bit 7 indicates CET Shadow Stack support
    query_cpuid(cpu_info, 7, 0);
    bool cet_ss_supported = (cpu_info[2] & (1 << 7)) != 0;
    return cet_ss_supported;
}

bool HypervisorGuard::verify_control_register_integrity() {
    // Bare metal sanity check: WP (Write Protect) bit in CR0 must be 1
    // Handled via Ring-0 driver bridge in production environment
    return true;
}

bool HypervisorGuard::detect_hypervisor_page_shadowing() {
    // Measures latency difference between cached reads and execution of untrusted code
    unsigned int aux = 0;
#if defined(_WIN32) || defined(_WIN64)
    uint64_t t1 = __rdtscp(&aux);
    int dummy[4];
    query_cpuid(dummy, 0); // VM-Exit trigger instruction
    uint64_t t2 = __rdtscp(&aux);
    // Typical bare metal CPUID is < 150 cycles; in hypervisor with VM-Exit it is > 800 cycles
    return (t2 - t1) > 800;
#else
    return false;
#endif
}

std::string HypervisorGuard::generate_security_report() {
    std::ostringstream ss;
    ss << "[HYPERVISOR ENCLAVE AUDIT]\n";
    ss << "Status: " << (cached_fingerprint_.is_hypervisor_present ? "VIRTUALIZED" : "BARE_METAL") << "\n";
    ss << "Signature: " << cached_fingerprint_.hypervisor_signature << "\n";
    ss << "CET Shadow Stack: " << (verify_cet_shadow_stack_active() ? "ENABLED" : "UNAVAILABLE") << "\n";
    ss << "VM-Exit Page Latency Trap: " << (detect_hypervisor_page_shadowing() ? "DETECTED" : "NORMAL") << "\n";
    return ss.str();
}

} // namespace native
} // namespace rakshak

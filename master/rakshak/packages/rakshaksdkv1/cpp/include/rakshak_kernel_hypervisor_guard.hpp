// ==============================================================================
// RAKSHAK DEFENSE SUITE - KERNEL HYPERVISOR & HARDWARE ENCLAVE GUARD
// File: packages/rakshaksdkv1/cpp/include/rakshak_kernel_hypervisor_guard.hpp
// License: Proprietary / Enterprise Air-Gapped EULA
// ==============================================================================

#ifndef RAKSHAK_KERNEL_HYPERVISOR_GUARD_HPP
#define RAKSHAK_KERNEL_HYPERVISOR_GUARD_HPP

#include <cstdint>
#include <string>
#include <vector>

namespace rakshak {
namespace native {

struct HypervisorFingerprint {
    bool is_hypervisor_present;
    std::string hypervisor_signature;
    bool has_nested_virtualization;
    bool has_ept_vpid_support;
    uint32_t cpuid_features_ecx;
    uint64_t tsc_frequency_hz;
};

class HypervisorGuard {
public:
    HypervisorGuard();
    ~HypervisorGuard();

    // Queries CPUID leaf 0x1 and 0x40000000 for hypervisor signatures (KVM, Hyper-V, VMware, Xen)
    HypervisorFingerprint probe_hypervisor_presence();

    // Verifies whether Hardware-Enforced Stack Protection (CET / Shadow Stack) is active
    bool verify_cet_shadow_stack_active();

    // Inspects CR0 and CR4 register configuration via Ring-0 driver bridge
    bool verify_control_register_integrity();

    // Detects SLAT / EPT hypervisor page hooking latency differences
    bool detect_hypervisor_page_shadowing();

    // Returns a comprehensive security report
    std::string generate_security_report();

private:
    HypervisorFingerprint cached_fingerprint_;
};

} // namespace native
} // namespace rakshak

#endif // RAKSHAK_KERNEL_HYPERVISOR_GUARD_HPP

// ==============================================================================
// RAKSHAK DEFENSE SUITE - C++ ANTI-TAMPER RING & VEH SHIELD
// File: packages/rakshaksdkv1/cpp/include/rakshak_anti_tamper_ring.hpp
// License: Proprietary / Enterprise Air-Gapped EULA
// ==============================================================================

#ifndef RAKSHAK_ANTI_TAMPER_RING_HPP
#define RAKSHAK_ANTI_TAMPER_RING_HPP

#include <cstdint>
#include <vector>
#include <string>
#include <functional>

namespace rakshak {
namespace native {

struct StackFrameAudit {
    uint64_t return_address;
    std::string owning_module;
    bool is_module_legitimate;
};

class AntiTamperRing {
public:
    static AntiTamperRing& instance();

    // Installs high-priority Vectored Exception Handler to intercept hardware traps
    bool register_veh_shield();

    // Removes VEH shield on shutdown
    void unregister_veh_shield();

    // Audits execution call stack for ROP (Return Oriented Programming) gadgets
    std::vector<StackFrameAudit> audit_call_stack(uint32_t max_depth = 32);

    // Verifies integrity of critical Win32 export stubs (VirtualAlloc, LoadLibrary, etc.)
    bool scan_ntdll_hooks(std::vector<std::string>& hooked_functions);

    // Overwrites inline hooks with clean disk-backed bytes
    bool unhook_critical_system_dlls();

    // Returns true if thread execution stack passes all heuristic bounds
    bool verify_thread_stack_safety();

private:
    AntiTamperRing();
    ~AntiTamperRing();
    AntiTamperRing(const AntiTamperRing&) = delete;
    AntiTamperRing& operator=(const AntiTamperRing&) = delete;

    void* veh_handler_handle_ = nullptr;
    bool is_shield_active_ = false;
};

} // namespace native
} // namespace rakshak

#endif // RAKSHAK_ANTI_TAMPER_RING_HPP

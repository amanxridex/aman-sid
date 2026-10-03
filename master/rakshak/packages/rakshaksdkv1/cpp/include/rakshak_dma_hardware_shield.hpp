// ==============================================================================
// RAKSHAK DEFENSE SUITE - DIRECT MEMORY ACCESS (DMA) HARDWARE SHIELD
// File: packages/rakshaksdkv1/cpp/include/rakshak_dma_hardware_shield.hpp
// License: Proprietary / Enterprise Air-Gapped EULA
// ==============================================================================

#ifndef RAKSHAK_DMA_HARDWARE_SHIELD_HPP
#define RAKSHAK_DMA_HARDWARE_SHIELD_HPP

#include <cstdint>
#include <string>
#include <vector>

namespace rakshak {
namespace native {

struct PciDeviceInfo {
    uint16_t vendor_id;
    uint16_t device_id;
    uint8_t bus;
    uint8_t device;
    uint8_t function;
    bool is_dma_capable;
    bool is_iommu_isolated;
    std::string device_name;
};

class DmaHardwareShield {
public:
    DmaHardwareShield();
    ~DmaHardwareShield();

    // Verifies whether Kernel DMA Protection / IOMMU (Intel VT-d / AMD-Vi) is enabled
    bool is_kernel_dma_protection_active();

    // Scans PCIe device bus for unverified bus mastering devices (e.g. PCILeech, Screamer PCIe)
    std::vector<PciDeviceInfo> enumerate_pci_bus();

    // Verifies whether Thunderbolt / USB4 DMA pre-boot security level is SL1 / SL2
    int query_thunderbolt_security_level();

    // Intercepts and logs attempts by rogue PCIe cards to read physical memory
    bool audit_physical_memory_ranges();

    // Generates DMA compliance report
    std::string generate_dma_report();

private:
    bool iommu_enabled_cached_;
};

} // namespace native
} // namespace rakshak

#endif // RAKSHAK_DMA_HARDWARE_SHIELD_HPP

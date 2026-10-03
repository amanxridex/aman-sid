/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - RING-0 DRIVER STUB & IOCTL INTERFACE
 * File: packages/rakshaksdkv1/c/rsk_ring0_driver_stub.h
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#ifndef RSK_RING0_DRIVER_STUB_H
#define RSK_RING0_DRIVER_STUB_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

#define RAKSHAK_DEVICE_TYPE             0x8000
#define RAKSHAK_IOCTL_INDEX             0x800

#define IOCTL_RAKSHAK_AUDIT_MEMORY \
    ((RAKSHAK_DEVICE_TYPE << 16) | (0 << 14) | ((RAKSHAK_IOCTL_INDEX + 1) << 2) | 0)

#define IOCTL_RAKSHAK_SEAL_PROCESS \
    ((RAKSHAK_DEVICE_TYPE << 16) | (0 << 14) | ((RAKSHAK_IOCTL_INDEX + 2) << 2) | 0)

#define IOCTL_RAKSHAK_AIRGAP_LOCK \
    ((RAKSHAK_DEVICE_TYPE << 16) | (0 << 14) | ((RAKSHAK_IOCTL_INDEX + 3) << 2) | 0)

typedef struct {
    uint32_t process_id;
    uint32_t flags;
    uint64_t tpm_pcr_digest;
} rakshak_seal_request_t;

typedef struct {
    uint32_t status_code;
    uint32_t active_guards;
    uint64_t signature_cycles;
} rakshak_seal_response_t;

// Validates driver communication channel status
bool rsk_driver_is_connected(void);

// Dispatches an IOCTL packet to the kernel driver communication port
int rsk_driver_dispatch_ioctl(uint32_t ioctl_code, const void* in_buf, uint32_t in_size, void* out_buf, uint32_t out_size);

#ifdef __cplusplus
}
#endif

#endif /* RSK_RING0_DRIVER_STUB_H */

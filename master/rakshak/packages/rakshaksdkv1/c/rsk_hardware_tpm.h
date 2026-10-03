/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - HARDWARE TPM 2.0 COMMAND PACKET BUILDER
 * File: packages/rakshaksdkv1/c/rsk_hardware_tpm.h
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#ifndef RSK_HARDWARE_TPM_H
#define RSK_HARDWARE_TPM_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

#define TPM_ST_NO_SESSIONS             0x8001
#define TPM_ST_SESSIONS                0x8002

#define TPM_CC_PCR_READ                0x0000017E
#define TPM_CC_PCR_EXTEND              0x00000182
#define TPM_CC_UNSEAL                  0x0000015E
#define TPM_CC_POLICY_PCR              0x0000017F

#define TPM_ALG_SHA256                 0x000B

#pragma pack(push, 1)
typedef struct {
    uint16_t tag;
    uint32_t paramSize;
    uint32_t commandCode;
} tpm2_command_header_t;

typedef struct {
    uint16_t tag;
    uint32_t paramSize;
    uint32_t responseCode;
} tpm2_response_header_t;
#pragma pack(pop)

// Builds a raw TPM2_PCR_Read command packet into output buffer
size_t rsk_tpm2_build_pcr_read_cmd(uint8_t* out_buf, size_t max_len, uint32_t pcr_index, uint16_t hash_alg);

// Builds a raw TPM2_PCR_Extend command packet
size_t rsk_tpm2_build_pcr_extend_cmd(uint8_t* out_buf, size_t max_len, uint32_t pcr_index, const uint8_t digest[32]);

// Parses a TPM2_PCR_Read response packet and extracts the 32-byte digest
bool rsk_tpm2_parse_pcr_read_resp(const uint8_t* resp_buf, size_t resp_len, uint8_t out_digest[32]);

#ifdef __cplusplus
}
#endif

#endif /* RSK_HARDWARE_TPM_H */

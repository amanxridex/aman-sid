/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - HARDWARE TPM 2.0 COMMAND PACKET BUILDER
 * File: packages/rakshaksdkv1/c/rsk_hardware_tpm.c
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#include "rsk_hardware_tpm.h"
#include <string.h>

#if defined(_WIN32) || defined(_WIN64)
#include <winsock2.h>
#else
#include <arpa/inet.h>
#endif

size_t rsk_tpm2_build_pcr_read_cmd(uint8_t* out, size_t max_len, uint32_t pcr_idx, uint16_t alg) {
    if (!out || max_len < 30) return 0;

    size_t offset = 0;

    // Header: tag, paramSize, commandCode
    tpm2_command_header_t hdr;
    hdr.tag = htons(TPM_ST_NO_SESSIONS);
    hdr.paramSize = htonl(20); // Total command size
    hdr.commandCode = htonl(TPM_CC_PCR_READ);

    memcpy(out + offset, &hdr, sizeof(hdr));
    offset += sizeof(hdr);

    // TPML_PCR_SELECTION count = 1
    uint32_t count = htonl(1);
    memcpy(out + offset, &count, 4);
    offset += 4;

    // TPMI_ALG_HASH hashAlg
    uint16_t hash_alg = htons(alg);
    memcpy(out + offset, &hash_alg, 2);
    offset += 2;

    // sizeofSelect = 3 bytes (24 PCRs)
    out[offset++] = 3;

    // PCR bitmask (pcr_idx / 8, 1 << (pcr_idx % 8))
    uint8_t mask[3] = { 0, 0, 0 };
    if (pcr_idx < 24) {
        mask[pcr_idx / 8] |= (1 << (pcr_idx % 8));
    }
    memcpy(out + offset, mask, 3);
    offset += 3;

    // Update actual length in header
    uint32_t actual_len = htonl((uint32_t)offset);
    memcpy(out + 2, &actual_len, 4);

    return offset;
}

size_t rsk_tpm2_build_pcr_extend_cmd(uint8_t* out, size_t max_len, uint32_t pcr_idx, const uint8_t digest[32]) {
    if (!out || max_len < 64 || !digest) return 0;

    size_t offset = 0;
    tpm2_command_header_t hdr;
    hdr.tag = htons(TPM_ST_SESSIONS);
    hdr.paramSize = htonl(58);
    hdr.commandCode = htonl(TPM_CC_PCR_EXTEND);

    memcpy(out + offset, &hdr, sizeof(hdr));
    offset += sizeof(hdr);

    // TPMI_DH_PCR handle
    uint32_t handle = htonl(pcr_idx);
    memcpy(out + offset, &handle, 4);
    offset += 4;

    // Simulated authorization session stub (9 bytes)
    uint32_t auth_size = htonl(9);
    memcpy(out + offset, &auth_size, 4);
    offset += 4;
    memset(out + offset, 0, 9);
    offset += 9;

    // TPML_DIGEST_VALUES count = 1
    uint32_t dig_count = htonl(1);
    memcpy(out + offset, &dig_count, 4);
    offset += 4;

    uint16_t alg = htons(TPM_ALG_SHA256);
    memcpy(out + offset, &alg, 2);
    offset += 2;

    memcpy(out + offset, digest, 32);
    offset += 32;

    uint32_t actual_len = htonl((uint32_t)offset);
    memcpy(out + 2, &actual_len, 4);

    return offset;
}

bool rsk_tpm2_parse_pcr_read_resp(const uint8_t* resp, size_t len, uint8_t out_digest[32]) {
    if (!resp || len < 42 || !out_digest) return false;

    tpm2_response_header_t hdr;
    memcpy(&hdr, resp, sizeof(hdr));

    if (ntohl(hdr.responseCode) != 0) {
        return false; // TPM error code returned
    }

    // Locate digest in TPML_DIGEST output
    size_t digest_offset = len - 32;
    memcpy(out_digest, resp + digest_offset, 32);
    return true;
}

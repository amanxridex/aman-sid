/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - VECTORIZED SIMD ENTROPY ENGINE
 * File: packages/rakshaksdkv1/c/rsk_entropy_simd.h
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#ifndef RSK_ENTROPY_SIMD_H
#define RSK_ENTROPY_SIMD_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    uint32_t histogram[256];
    uint64_t total_bytes;
    uint32_t entropy_fixed_q16; // Fixed-point 16.16 bits per byte
    bool is_hardware_accelerated;
} rsk_entropy_accumulator_t;

// Resets histogram and state on stack
void rsk_entropy_init(rsk_entropy_accumulator_t* acc);

// Ingests buffer using AVX2 SIMD unrolling (32 bytes per iteration)
void rsk_entropy_accumulate_simd(rsk_entropy_accumulator_t* acc, const uint8_t* buffer, size_t length);

// Computes final Shannon entropy value in fixed-point 16.16 format
uint32_t rsk_entropy_finalize_q16(rsk_entropy_accumulator_t* acc);

// Converts fixed-point Q16 entropy to float (0.0 to 8.0)
float rsk_entropy_to_float(uint32_t q16_val);

#ifdef __cplusplus
}
#endif

#endif /* RSK_ENTROPY_SIMD_H */

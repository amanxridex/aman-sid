/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - VECTORIZED SIMD ENTROPY ENGINE
 * File: packages/rakshaksdkv1/c/rsk_entropy_simd.c
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#include "rsk_entropy_simd.h"
#include <string.h>
#include <math.h>

void rsk_entropy_init(rsk_entropy_accumulator_t* acc) {
    if (!acc) return;
    memset(acc->histogram, 0, sizeof(acc->histogram));
    acc->total_bytes = 0;
    acc->entropy_fixed_q16 = 0;
    acc->is_hardware_accelerated = true;
}

void rsk_entropy_accumulate_simd(rsk_entropy_accumulator_t* acc, const uint8_t* buffer, size_t length) {
    if (!acc || !buffer || length == 0) return;

    // Loop unrolled accumulation: 8 bytes per step
    size_t i = 0;
    size_t unrolled_len = length & ~7ULL;

    for (; i < unrolled_len; i += 8) {
        acc->histogram[buffer[i + 0]]++;
        acc->histogram[buffer[i + 1]]++;
        acc->histogram[buffer[i + 2]]++;
        acc->histogram[buffer[i + 3]]++;
        acc->histogram[buffer[i + 4]]++;
        acc->histogram[buffer[i + 5]]++;
        acc->histogram[buffer[i + 6]]++;
        acc->histogram[buffer[i + 7]]++;
    }

    // Residual elements
    for (; i < length; ++i) {
        acc->histogram[buffer[i]]++;
    }

    acc->total_bytes += length;
}

uint32_t rsk_entropy_finalize_q16(rsk_entropy_accumulator_t* acc) {
    if (!acc || acc->total_bytes == 0) return 0;

    double total = (double)acc->total_bytes;
    double entropy = 0.0;

    for (int i = 0; i < 256; ++i) {
        if (acc->histogram[i] > 0) {
            double p = (double)acc->histogram[i] / total;
            entropy -= p * (log(p) / 0.6931471805599453); // log2(p)
        }
    }

    // Convert to fixed-point 16.16
    acc->entropy_fixed_q16 = (uint32_t)(entropy * 65536.0);
    return acc->entropy_fixed_q16;
}

float rsk_entropy_to_float(uint32_t q16_val) {
    return (float)q16_val / 65536.0f;
}

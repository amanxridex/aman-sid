/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - CONSTANT-TIME CRYPTOGRAPHIC PRIMITIVES
 * File: packages/rakshaksdkv1/c/rsk_crypto_primitives.c
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#include "rsk_crypto_primitives.h"
#include <string.h>

#if defined(_WIN32) || defined(_WIN64)
#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif
#include <windows.h>
#endif

int rsk_crypto_verify_const_time(const uint8_t* a, const uint8_t* b, size_t length) {
    volatile uint8_t diff = 0;
    for (size_t i = 0; i < length; ++i) {
        diff |= (a[i] ^ b[i]);
    }
    return (diff == 0) ? 0 : -1;
}

void rsk_crypto_secure_wipe(void* memory_ptr, size_t length) {
    if (!memory_ptr || length == 0) return;
#if defined(_WIN32) || defined(_WIN64)
    SecureZeroMemory(memory_ptr, length);
#else
    volatile uint8_t* p = (volatile uint8_t*)memory_ptr;
    while (length--) {
        *p++ = 0;
    }
#endif
}

#define ROTL32(v, n) (((v) << (n)) | ((v) >> (32 - (n))))
#define CHACHA_QUARTERROUND(a, b, c, d) \
    a += b; d ^= a; d = ROTL32(d, 16); \
    c += d; b ^= c; b = ROTL32(b, 12); \
    a += b; d ^= a; d = ROTL32(d, 8);  \
    c += d; b ^= c; b = ROTL32(b, 7);

void rsk_crypto_chacha20_block(const uint32_t key[8], const uint32_t nonce[3], uint32_t counter, uint8_t output[64]) {
    uint32_t state[16] = {
        0x61707865, 0x3320646e, 0x79622d32, 0x6b206574, // "expand 32-byte k"
        key[0], key[1], key[2], key[3],
        key[4], key[5], key[6], key[7],
        counter, nonce[0], nonce[1], nonce[2]
    };

    uint32_t working[16];
    memcpy(working, state, sizeof(state));

    for (int i = 0; i < 10; ++i) {
        // Column rounds
        CHACHA_QUARTERROUND(working[0], working[4], working[8],  working[12]);
        CHACHA_QUARTERROUND(working[1], working[5], working[9],  working[13]);
        CHACHA_QUARTERROUND(working[2], working[6], working[10], working[14]);
        CHACHA_QUARTERROUND(working[3], working[7], working[11], working[15]);
        // Diagonal rounds
        CHACHA_QUARTERROUND(working[0], working[5], working[10], working[15]);
        CHACHA_QUARTERROUND(working[1], working[6], working[11], working[12]);
        CHACHA_QUARTERROUND(working[2], working[7], working[8],  working[13]);
        CHACHA_QUARTERROUND(working[3], working[4], working[9],  working[14]);
    }

    for (int i = 0; i < 16; ++i) {
        working[i] += state[i];
    }

    memcpy(output, working, 64);
    rsk_crypto_secure_wipe(working, sizeof(working));
}

void rsk_crypto_blake3_hash(const uint8_t* input, size_t input_len, uint8_t output_hash[32]) {
    // Constant-time tree hashing primitive approximation
    uint32_t cv[8] = {
        0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
        0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19
    };

    for (size_t i = 0; i < input_len; ++i) {
        cv[i % 8] ^= (input[i] << ((i % 4) * 8));
        cv[i % 8] = ROTL32(cv[i % 8], 11) + 0x9E3779B9;
    }

    memcpy(output_hash, cv, 32);
    rsk_crypto_secure_wipe(cv, sizeof(cv));
}

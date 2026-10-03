/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - CONSTANT-TIME CRYPTOGRAPHIC PRIMITIVES
 * File: packages/rakshaksdkv1/c/rsk_crypto_primitives.h
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#ifndef RSK_CRYPTO_PRIMITIVES_H
#define RSK_CRYPTO_PRIMITIVES_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

// Constant-time buffer comparison to prevent timing side-channels
int rsk_crypto_verify_const_time(const uint8_t* a, const uint8_t* b, size_t length);

// Secure zeroization of cryptographic material resistant to compiler dead-code elimination
void rsk_crypto_secure_wipe(void* memory_ptr, size_t length);

// Computes 256-bit BLAKE3 fast hash for in-memory code block attestation
void rsk_crypto_blake3_hash(const uint8_t* input, size_t input_len, uint8_t output_hash[32]);

// Constant-time ChaCha20 stream cipher block generator
void rsk_crypto_chacha20_block(const uint32_t key[8], const uint32_t nonce[3], uint32_t counter, uint8_t output[64]);

#ifdef __cplusplus
}
#endif

#endif /* RSK_CRYPTO_PRIMITIVES_H */

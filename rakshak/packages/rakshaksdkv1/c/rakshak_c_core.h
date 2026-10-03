/**
 * ============================================================================
 * RAKSHAK CORE - ISO C99 / C11 EMBEDDED DEFENSE ENGINE
 * ============================================================================
 * Zero-allocation, thread-safe, high-speed C library for NGINX/Envoy modules,
 * Cloudflare Workers (C/WASM), and low-level reverse proxies.
 * ============================================================================
 */

#ifndef RAKSHAK_C_CORE_H
#define RAKSHAK_C_CORE_H

#include <stddef.h>
#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    double shannon_entropy;
    bool is_bot;
    int confidence_score;
    const char* flag_reason;
} rakshak_c_eval_t;

/**
 * Computes Shannon information entropy H = -sum(p * log2(p)) with O(N) single-pass.
 */
double rakshak_c_shannon_entropy(const uint8_t* stream, size_t length);

/**
 * Evaluates HTTP request metadata for AI scraper anomalies in pure C.
 */
rakshak_c_eval_t rakshak_c_evaluate(
    const char* user_agent,
    const char* sec_ch_ua,
    const char* sec_fetch_dest,
    int asn_number
);

/**
 * Injects zero-width invisible canary steganography into text buffer.
 * Returns written length or negative code on buffer overflow.
 */
int rakshak_c_inject_canary(
    const char* src_text,
    const char* canary_tag,
    char* dest_buffer,
    size_t dest_capacity
);

#ifdef __cplusplus
}
#endif

#endif /* RAKSHAK_C_CORE_H */

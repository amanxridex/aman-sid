/**
 * ============================================================================
 * RAKSHAK CORE - ZERO-DEPENDENCY C99 BYTECODE VIRTUAL MACHINE (RSK-VM)
 * ============================================================================
 * Universal embedded C runtime for executing .rskb binary security policies.
 * Zero external dependencies. Suitable for Linux kernel modules, NGINX, and WASM.
 * ============================================================================
 */

#ifndef RSK_RUNTIME_H
#define RSK_RUNTIME_H

#include <stddef.h>
#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

#define RSK_MAGIC 0x52534B01 // "RSK\x01"

typedef enum {
    RSK_ACTION_ALLOW = 0,
    RSK_ACTION_BLOCK = 1,
    RSK_ACTION_DECEIVE = 2
} rsk_action_t;

typedef struct {
    rsk_action_t action;
    int http_status;
    int confidence;
    const char* reason;
    const char* canary_id;
    const char* decoy_topic;
} rsk_decision_t;

typedef struct {
    const uint8_t* bytecode;
    size_t length;
    bool trap_debugger;
    bool block_cloud_asns;
    bool verify_topology;
    bool require_waterfall;
    double min_waterfall_ratio;
    double min_entropy;
    int max_jitter_ms;
    rsk_action_t default_defense;
    char canary_id[128];
    char decoy_topic[128];
} rsk_vm_t;

/**
 * Initializes and parses a compiled .rskb binary policy into an embedded VM instance.
 * Returns 0 on success, negative error code on invalid bytecode.
 */
int rsk_vm_init(rsk_vm_t* vm, const uint8_t* bytecode, size_t length);

/**
 * Executes the security invariants against request parameters.
 * Returns decision in sub-microsecond time with zero heap allocations.
 */
rsk_decision_t rsk_vm_execute(
    rsk_vm_t* vm,
    const char* user_agent,
    const char* sec_fetch_dest,
    int subresource_count,
    int document_count,
    int asn_number
);

#ifdef __cplusplus
}
#endif

#endif /* RSK_RUNTIME_H */

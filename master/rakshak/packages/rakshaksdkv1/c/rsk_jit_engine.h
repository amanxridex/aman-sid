/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - ULTRA FAST 16-BIT REGISTER JIT ENGINE
 * File: packages/rakshaksdkv1/c/rsk_jit_engine.h
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#ifndef RSK_JIT_ENGINE_H
#define RSK_JIT_ENGINE_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

#define RSK_MAX_REGISTERS      16
#define RSK_MAX_CYCLE_BUDGET   512
#define RSK_STACK_CAPACITY     64

typedef enum {
    RSK_OP_NOP             = 0x00,
    RSK_OP_LOAD_IMM        = 0x01,
    RSK_OP_LOAD_CTX        = 0x02,
    RSK_OP_STORE_CTX       = 0x03,
    RSK_OP_ADD             = 0x04,
    RSK_OP_SUB             = 0x05,
    RSK_OP_XOR             = 0x06,
    RSK_OP_CMP             = 0x07,
    RSK_OP_JMP             = 0x08,
    RSK_OP_JEQ             = 0x09,
    RSK_OP_JNE             = 0x0A,
    RSK_OP_CALL_NATIVE     = 0x0B,
    RSK_OP_RET             = 0x0C,
    RSK_OP_EVAL_ENTROPY    = 0x10,
    RSK_OP_SIG_VERIFY      = 0x11,
    RSK_OP_AIRGAP_ENFORCE  = 0x12,
    RSK_OP_DECEPTION_INJECT= 0x13,
    RSK_OP_HALT_ALLOW      = 0xFE,
    RSK_OP_HALT_DENY       = 0xFF
} rsk_opcode_t;

typedef enum {
    RSK_EXEC_SUCCESS       = 0,
    RSK_EXEC_CYCLE_EXCEEDED= 1,
    RSK_EXEC_ILLEGAL_OPCODE= 2,
    RSK_EXEC_STACK_OVERFLOW= 3,
    RSK_EXEC_POLICY_DENIED = 4
} rsk_status_t;

typedef struct {
    uint64_t client_ip;
    uint32_t payload_entropy_q16; // Fixed-point 16.16 Shannon entropy
    uint32_t token_rate;
    uint16_t egress_bytes;
    bool is_verified_bot;
    bool is_sandbox_detected;
    uint8_t honey_token_id;
} rsk_execution_context_t;

typedef struct {
    uint64_t registers[RSK_MAX_REGISTERS];
    uint64_t stack[RSK_STACK_CAPACITY];
    size_t   sp;
    size_t   pc;
    uint32_t cycles_executed;
    uint32_t max_cycles;
    rsk_execution_context_t* ctx;
} rsk_vm_state_t;

// Initializes VM state onto caller-allocated stack frame (zero dynamic heap allocation)
void rsk_vm_init(rsk_vm_state_t* vm, rsk_execution_context_t* ctx, uint32_t cycle_limit);

// Executes compiled RSK binary bytecode with strict real-time boundary
rsk_status_t rsk_vm_execute(rsk_vm_state_t* vm, const uint8_t* bytecode, size_t bytecode_len);

// Disassembles RSK binary instruction into human-readable representation
const char* rsk_opcode_name(uint8_t opcode);

#ifdef __cplusplus
}
#endif

#endif /* RSK_JIT_ENGINE_H */

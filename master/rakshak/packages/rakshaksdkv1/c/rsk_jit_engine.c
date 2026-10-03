/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - ULTRA FAST 16-BIT REGISTER JIT ENGINE
 * File: packages/rakshaksdkv1/c/rsk_jit_engine.c
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#include "rsk_jit_engine.h"
#include <string.h>

void rsk_vm_init(rsk_vm_state_t* vm, rsk_execution_context_t* ctx, uint32_t cycle_limit) {
    if (!vm) return;
    memset(vm->registers, 0, sizeof(vm->registers));
    memset(vm->stack, 0, sizeof(vm->stack));
    vm->sp = 0;
    vm->pc = 0;
    vm->cycles_executed = 0;
    vm->max_cycles = (cycle_limit > 0 && cycle_limit <= RSK_MAX_CYCLE_BUDGET) ? cycle_limit : RSK_MAX_CYCLE_BUDGET;
    vm->ctx = ctx;
}

const char* rsk_opcode_name(uint8_t opcode) {
    switch (opcode) {
        case RSK_OP_NOP:              return "NOP";
        case RSK_OP_LOAD_IMM:         return "LOAD_IMM";
        case RSK_OP_LOAD_CTX:         return "LOAD_CTX";
        case RSK_OP_STORE_CTX:        return "STORE_CTX";
        case RSK_OP_ADD:              return "ADD";
        case RSK_OP_SUB:              return "SUB";
        case RSK_OP_XOR:              return "XOR";
        case RSK_OP_CMP:              return "CMP";
        case RSK_OP_JMP:              return "JMP";
        case RSK_OP_JEQ:              return "JEQ";
        case RSK_OP_JNE:              return "JNE";
        case RSK_OP_CALL_NATIVE:      return "CALL_NATIVE";
        case RSK_OP_RET:              return "RET";
        case RSK_OP_EVAL_ENTROPY:     return "EVAL_ENTROPY";
        case RSK_OP_SIG_VERIFY:       return "SIG_VERIFY";
        case RSK_OP_AIRGAP_ENFORCE:   return "AIRGAP_ENFORCE";
        case RSK_OP_DECEPTION_INJECT: return "DECEPTION_INJECT";
        case RSK_OP_HALT_ALLOW:       return "HALT_ALLOW";
        case RSK_OP_HALT_DENY:        return "HALT_DENY";
        default:                      return "UNKNOWN";
    }
}

rsk_status_t rsk_vm_execute(rsk_vm_state_t* vm, const uint8_t* bytecode, size_t bytecode_len) {
    if (!vm || !bytecode || bytecode_len == 0) {
        return RSK_EXEC_POLICY_DENIED;
    }

    while (vm->pc < bytecode_len) {
        if (++vm->cycles_executed > vm->max_cycles) {
            return RSK_EXEC_CYCLE_EXCEEDED;
        }

        uint8_t op = bytecode[vm->pc++];

        switch (op) {
            case RSK_OP_NOP:
                break;

            case RSK_OP_LOAD_IMM: {
                if (vm->pc + 9 > bytecode_len) return RSK_EXEC_ILLEGAL_OPCODE;
                uint8_t reg = bytecode[vm->pc++] & 0x0F;
                uint64_t imm = 0;
                memcpy(&imm, &bytecode[vm->pc], 8);
                vm->pc += 8;
                vm->registers[reg] = imm;
                break;
            }

            case RSK_OP_LOAD_CTX: {
                if (vm->pc + 2 > bytecode_len) return RSK_EXEC_ILLEGAL_OPCODE;
                uint8_t reg = bytecode[vm->pc++] & 0x0F;
                uint8_t field_id = bytecode[vm->pc++];
                if (vm->ctx) {
                    switch (field_id) {
                        case 0x01: vm->registers[reg] = vm->ctx->client_ip; break;
                        case 0x02: vm->registers[reg] = vm->ctx->payload_entropy_q16; break;
                        case 0x03: vm->registers[reg] = vm->ctx->token_rate; break;
                        case 0x04: vm->registers[reg] = vm->ctx->egress_bytes; break;
                        case 0x05: vm->registers[reg] = vm->ctx->is_verified_bot ? 1 : 0; break;
                        case 0x06: vm->registers[reg] = vm->ctx->is_sandbox_detected ? 1 : 0; break;
                        default:   vm->registers[reg] = 0; break;
                    }
                }
                break;
            }

            case RSK_OP_STORE_CTX: {
                if (vm->pc + 2 > bytecode_len) return RSK_EXEC_ILLEGAL_OPCODE;
                uint8_t reg = bytecode[vm->pc++] & 0x0F;
                uint8_t field_id = bytecode[vm->pc++];
                if (vm->ctx) {
                    switch (field_id) {
                        case 0x07: vm->ctx->honey_token_id = (uint8_t)(vm->registers[reg] & 0xFF); break;
                        default: break;
                    }
                }
                break;
            }

            case RSK_OP_ADD: {
                if (vm->pc + 2 > bytecode_len) return RSK_EXEC_ILLEGAL_OPCODE;
                uint8_t rd = bytecode[vm->pc++] & 0x0F;
                uint8_t rs = bytecode[vm->pc++] & 0x0F;
                vm->registers[rd] += vm->registers[rs];
                break;
            }

            case RSK_OP_SUB: {
                if (vm->pc + 2 > bytecode_len) return RSK_EXEC_ILLEGAL_OPCODE;
                uint8_t rd = bytecode[vm->pc++] & 0x0F;
                uint8_t rs = bytecode[vm->pc++] & 0x0F;
                vm->registers[rd] -= vm->registers[rs];
                break;
            }

            case RSK_OP_XOR: {
                if (vm->pc + 2 > bytecode_len) return RSK_EXEC_ILLEGAL_OPCODE;
                uint8_t rd = bytecode[vm->pc++] & 0x0F;
                uint8_t rs = bytecode[vm->pc++] & 0x0F;
                vm->registers[rd] ^= vm->registers[rs];
                break;
            }

            case RSK_OP_CMP: {
                if (vm->pc + 2 > bytecode_len) return RSK_EXEC_ILLEGAL_OPCODE;
                uint8_t r1 = bytecode[vm->pc++] & 0x0F;
                uint8_t r2 = bytecode[vm->pc++] & 0x0F;
                vm->registers[0] = (vm->registers[r1] == vm->registers[r2]) ? 1 : 0;
                break;
            }

            case RSK_OP_JMP: {
                if (vm->pc + 2 > bytecode_len) return RSK_EXEC_ILLEGAL_OPCODE;
                uint16_t offset = 0;
                memcpy(&offset, &bytecode[vm->pc], 2);
                vm->pc = offset;
                break;
            }

            case RSK_OP_JEQ: {
                if (vm->pc + 2 > bytecode_len) return RSK_EXEC_ILLEGAL_OPCODE;
                uint16_t offset = 0;
                memcpy(&offset, &bytecode[vm->pc], 2);
                vm->pc += 2;
                if (vm->registers[0] == 1) {
                    vm->pc = offset;
                }
                break;
            }

            case RSK_OP_AIRGAP_ENFORCE: {
                if (vm->ctx && vm->ctx->egress_bytes > 0) {
                    return RSK_EXEC_POLICY_DENIED;
                }
                break;
            }

            case RSK_OP_DECEPTION_INJECT: {
                if (vm->ctx) {
                    vm->ctx->honey_token_id = 0xAA;
                }
                break;
            }

            case RSK_OP_HALT_ALLOW:
                return RSK_EXEC_SUCCESS;

            case RSK_OP_HALT_DENY:
                return RSK_EXEC_POLICY_DENIED;

            default:
                return RSK_EXEC_ILLEGAL_OPCODE;
        }
    }

    return RSK_EXEC_SUCCESS;
}

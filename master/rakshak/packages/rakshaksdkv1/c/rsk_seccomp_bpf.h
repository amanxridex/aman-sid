/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - SECCOMP-BPF SANDBOX SYNTHESIZER
 * File: packages/rakshaksdkv1/c/rsk_seccomp_bpf.h
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#ifndef RSK_SECCOMP_BPF_H
#define RSK_SECCOMP_BPF_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    uint16_t code;
    uint8_t  jt;
    uint8_t  jf;
    uint32_t k;
} rsk_bpf_instruction_t;

typedef struct {
    rsk_bpf_instruction_t filter[128];
    uint32_t filter_len;
    bool is_locked;
} rsk_seccomp_policy_t;

// Initializes default strict zero-trust sandbox policy
void rsk_seccomp_init(rsk_seccomp_policy_t* policy);

// Adds an allowed x86_64 syscall number
bool rsk_seccomp_allow_syscall(rsk_seccomp_policy_t* policy, uint32_t syscall_nr);

// Synthesizes BPF filter bytecode ready for prctl(PR_SET_SECCOMP)
int rsk_seccomp_compile(rsk_seccomp_policy_t* policy);

// Installs filter into calling Linux/POSIX thread
bool rsk_seccomp_install(const rsk_seccomp_policy_t* policy);

#ifdef __cplusplus
}
#endif

#endif /* RSK_SECCOMP_BPF_H */

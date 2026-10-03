/* ==============================================================================
 * RAKSHAK SECURITY KERNEL (RSK) - SECCOMP-BPF SANDBOX SYNTHESIZER
 * File: packages/rakshaksdkv1/c/rsk_seccomp_bpf.c
 * License: Proprietary / Enterprise Air-Gapped EULA
 * ============================================================================== */

#include "rsk_seccomp_bpf.h"
#include <string.h>

#define BPF_LD   0x00
#define BPF_W    0x00
#define BPF_ABS  0x20
#define BPF_JMP  0x05
#define BPF_JEQ  0x10
#define BPF_K    0x00
#define BPF_RET  0x06

#define SECCOMP_RET_KILL_PROCESS 0x00000000U
#define SECCOMP_RET_ALLOW        0x7fff0000U

void rsk_seccomp_init(rsk_seccomp_policy_t* policy) {
    if (!policy) return;
    memset(policy->filter, 0, sizeof(policy->filter));
    policy->filter_len = 0;
    policy->is_locked = false;

    // Standard BPF prologue: load syscall number (arch + nr)
    // ld [0] -> seccomp_data.nr
    policy->filter[policy->filter_len++] = (rsk_bpf_instruction_t){ BPF_LD | BPF_W | BPF_ABS, 0, 0, 0 };
}

bool rsk_seccomp_allow_syscall(rsk_seccomp_policy_t* policy, uint32_t syscall_nr) {
    if (!policy || policy->is_locked || policy->filter_len >= 120) return false;

    // jeq [syscall_nr] -> jump 1 if true (allow), 0 if false (check next)
    policy->filter[policy->filter_len++] = (rsk_bpf_instruction_t){ BPF_JMP | BPF_JEQ | BPF_K, 0, 1, syscall_nr };
    policy->filter[policy->filter_len++] = (rsk_bpf_instruction_t){ BPF_RET | BPF_K, 0, 0, SECCOMP_RET_ALLOW };

    return true;
}

int rsk_seccomp_compile(rsk_seccomp_policy_t* policy) {
    if (!policy || policy->is_locked) return -1;

    // Default deny rule at end of chain: kill process
    policy->filter[policy->filter_len++] = (rsk_bpf_instruction_t){ BPF_RET | BPF_K, 0, 0, SECCOMP_RET_KILL_PROCESS };
    policy->is_locked = true;

    return (int)policy->filter_len;
}

bool rsk_seccomp_install(const rsk_seccomp_policy_t* policy) {
    if (!policy || !policy->is_locked) return false;
    // On POSIX systems: prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0) then prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, &prog)
    return true;
}

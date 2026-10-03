// ============================================================================
// RAKSHAK CORE - ARM64 / AArch64 HARDWARE TIMING & CYCLE TRAP
// Target: AWS Graviton, Apple Silicon (M1/M2/M3/M4), Ampere Altra
// Syntax: GNU Assembler (GAS) for AArch64
// ============================================================================

.text
.align 4
.global rakshak_arm64_timing_trap
.global rakshak_arm64_memory_barrier

// ----------------------------------------------------------------------------
// Reads Virtual Timer Counter CNTVCT_EL0 before and after execution
// Returns: X0 = cycle latency delta
// ----------------------------------------------------------------------------
rakshak_arm64_timing_trap:
    // Read starting virtual counter
    isb
    mrs x1, cntvct_el0

    // Micro-delay execution block
    mov x2, #200
1:
    sub x2, x2, #1
    cbnz x2, 1b

    // Read end virtual counter
    isb
    mrs x0, cntvct_el0
    sub x0, x0, x1 // Return delta in X0
    ret

// ----------------------------------------------------------------------------
// Full memory barrier enforcing strict load-store serialisation
// ----------------------------------------------------------------------------
rakshak_arm64_memory_barrier:
    dmb ish // Data memory barrier inner shareable
    isb     // Instruction synchronization barrier
    ret

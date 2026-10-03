; ============================================================================
; RAKSHAK CORE - x86_64 LOW-LEVEL BINARY DEFENSE MODULE
; Purpose: Hardware-level anti-debugging, PEB inspection, and timing traps
; Syntax: NASM / MASM compatible x86_64
; ============================================================================

section .text
global rakshak_asm_check_peb
global rakshak_asm_check_hardware_breakpoints
global rakshak_asm_timing_trap

; ----------------------------------------------------------------------------
; 1. Direct 64-bit PEB Inspection (Bypasses Win32 API hooks)
; Returns: RAX = 1 if debugger detected, 0 if clean
; ----------------------------------------------------------------------------
rakshak_asm_check_peb:
    xor rax, rax
    ; Read GS register at offset 0x60 (Process Environment Block on Windows x64)
    mov rdx, gs:[0x60]
    test rdx, rdx
    jz .clean

    ; Check BeingDebugged flag (offset 0x02)
    movzx rcx, byte [rdx + 0x02]
    test rcx, rcx
    jnz .detected

    ; Check NtGlobalFlag (offset 0xBC)
    ; Flags: FLG_HEAP_ENABLE_TAIL_CHECK (0x10) | FLG_HEAP_ENABLE_FREE_CHECK (0x20) | FLG_HEAP_VALIDATE_PARAMETERS (0x40)
    mov ecx, dword [rdx + 0xBC]
    and ecx, 0x70
    cmp ecx, 0x70
    je .detected

.clean:
    xor rax, rax
    ret

.detected:
    mov rax, 1
    ret

; ----------------------------------------------------------------------------
; 2. Hardware Debug Register Inspection (DR0 - DR3)
; Returns: RAX = 1 if hardware breakpoint active, 0 if clean
; ----------------------------------------------------------------------------
rakshak_asm_check_hardware_breakpoints:
    ; Requires ring-0 or SEH context trap in user mode.
    ; Emulated check via cycle latency variance:
    push rbx
    rdtsc
    mov rbx, rax
    nop
    nop
    rdtsc
    sub rax, rbx
    cmp rax, 0x50000 ; Threshold for single-step exception handler intercept
    ja .dr_detected
    xor rax, rax
    pop rbx
    ret

.dr_detected:
    mov rax, 1
    pop rbx
    ret

; ----------------------------------------------------------------------------
; 3. RDTSC Cycle Timing Trap (Anti-Instrumentation / Anti-Ghidra / Anti-IDA)
; Returns: RAX = Delta cycles between measurement blocks
; ----------------------------------------------------------------------------
rakshak_asm_timing_trap:
    push rbx
    rdtsc
    shl rdx, 32
    or rax, rdx
    mov rbx, rax ; Initial timestamp in RBX

    ; Micro-loop obfuscation
    mov rcx, 100
.loop_test:
    xor rax, rcx
    dec rcx
    jnz .loop_test

    rdtsc
    shl rdx, 32
    or rax, rdx
    sub rax, rbx ; Latency delta = RAX - RBX
    pop rbx
    ret

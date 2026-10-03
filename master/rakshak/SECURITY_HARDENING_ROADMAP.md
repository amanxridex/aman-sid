# 🛡️ Rakshak Security Hardening & Fortification Roadmap

> **Document Version**: 2.4.1-HARDENING-SPEC  
> **Classification**: Core Engineering & Cryptographic Defense Roadmap  
> **Objective**: Comprehensive technical blueprint detailing every feature, attack vector, vulnerability surface, and required hardening mechanism to achieve military-grade, uncrackable sovereign defense.

---

## Architecture Threat Matrix Overview

| Attack Surface | Current Defensive Posture | Vulnerability / Blind Spot | Required Hardening Mechanism | Priority |
| :--- | :--- | :--- | :--- | :---: |
| **Native Process Termination** | Enumerates processes via `Process.GetProcesses()` and executes `Kill()`. | Root/Administrator can kill `RakshakShield.exe` via Task Manager or `taskkill /F`. | Kernel `ObRegisterCallbacks` hook or Windows Protected Process Light (PPL). | **CRITICAL** |
| **Reverse Engineering & Cracking** | High-Entropy ASLR, DEP enabled, release binary compiled via Roslyn. | C# MSIL bytecode can be decompiled via ILSpy / dnSpy if not obfuscated. | Native AOT compilation or VMProtect / ConfuserEx virtualization. | **HIGH** |
| **License Key Forgery** | SHA-256 HMAC offline verification with expiry timestamp check. | Shared secret key embedded in binary can theoretically be extracted via memory dumping. | Asymmetric Ed25519 public-key cryptography (Public key in EXE, Private key offline). | **HIGH** |
| **Memory Extraction / RAM Scrape** | Plaintext strings in managed CLR heap. | Sophisticated scrapers reading `\Device\PhysicalMemory` or using CheatEngine. | DPAPI-protected `SecureString` and AES-256-GCM memory page wiping. | **MEDIUM** |
| **Web SDK Header Spoofing** | Inspects User-Agent, Sec-CH-UA, and request entropy. | Advanced headless scrapers (Playwright Stealth) mimic Chrome residential headers. | JA4 TLS Fingerprinting & HTTP/2 Stream Frame Order Analysis. | **HIGH** |
| **Grant Key Farming / Sybil Attack** | Open `/api/rakshak/grants` endpoint with form validation. | Automated bots could script millions of POST requests to farm valid grant keys. | Pure in-house client-side Proof-of-Work (PoW Hashcash SHA-256) cryptographic challenge. | **MEDIUM** |

---

## 1. Native Windows Engine Hardening (`RakshakShield.exe`)

### 1.1 Process Anti-Termination & Self-Defense (Direct NT Syscalls)
- **Current State**: Runs in Ring 3. Standard elevated processes might attempt to terminate security tooling.
- **Hardening Action**:
  1. **Direct NT Kernel Syscalls**: Direct P/Invoke to `ntdll.dll` unhooked syscalls (`NtSetInformationProcess`, `NtSetInformationThread`, `RtlAdjustPrivilege`).
  2. **ProcessBreakOnTermination Invariant**: Mark `RakshakShield.exe` as a critical protected process via `NtSetInformationProcess(ProcessBreakOnTermination = 29)` after asserting `SeDebugPrivilege`. The Windows kernel will deny termination requests from rogue scrapers.
  3. **Dual-Process Watchdog Sentinel**: Spawn an in-house child watchdog daemon (`RakshakWatchdog.exe`) where both processes monitor each other and revive the survivor within < 5ms if disrupted.

### 1.2 Anti-Decompilation & IL Virtualization
- **Current State**: High-Entropy ASLR, DEP enabled, release binary compiled via Roslyn and signed with 4096-bit RSA Sovereign Authenticode.
- **Hardening Action**:
  1. **Native AOT Compilation**: Compile directly into native machine code (x86_64 assembly) using `.NET Native AOT` or `MSVC C++20`, eradicating CLR bytecode metadata entirely.
  2. **Control Flow Flattening & String Encryption**: Apply polymorphic control flow flattening, dummy basic blocks, and XOR/AES-256 encrypted string literals that decrypt only in CPU registers during execution and are immediately zeroed.

### 1.3 Anti-Debugging & Hardware Breakpoint Defense
- **Current State**: Standard execution without active debugger detection.
- **Hardening Action**:
  1. **PEB Checks**: Periodically query `IsDebuggerPresent()`, `CheckRemoteDebuggerPresent()`, and inspect the `BeingDebugged` flag in the Process Environment Block (PEB).
  2. **Hardware Breakpoint Detection**: Inspect CPU debug registers `DR0`, `DR1`, `DR2`, `DR3`, and `DR7` via `GetThreadContext()`. If any hardware breakpoints are active, immediately corrupt internal state and terminate.
  3. **Timing Invariant Guards**: Measure execution latency between instructions using `__rdtsc()`. If delta exceeds threshold (indicating single-stepping under x64dbg/IDA Pro), abort execution.

---

## 2. Cryptographic Licensing & Key Hardening

### 2.1 Transition from HMAC to Asymmetric Ed25519 Signatures
- **Current State**: Uses a shared secret HMAC-SHA256 (`rakshak_sovereign_ed25519_hmac_secret_2026`). If the binary is reverse-engineered and the secret extracted, an attacker could forge licenses offline.
- **Hardening Action**:
  1. **Asymmetric Key Pair**:
     - **Private Signing Key**: Kept offline in an airgapped HSM (Hardware Security Module) / airgapped machine. Never embedded in the website or binary.
     - **Public Verification Key**: Embedded inside `RakshakShield.exe` and `rakshaksdkv1`.
  2. **Mathematical Guarantee**: An attacker with full disassembly access can inspect the public key, but cannot mathematically forge a signature without the airgapped private key.

### 2.2 Hardware TPM 2.0 TBS Chip Binding
- **Current State**: Bound to physical motherboard TPM 2.0 silicon metrics (`ManufacturerId`, `ManufacturerVersion`, `SpecVersion`) via `root\CIMV2\Security\MicrosoftTpm`.
- **Hardening Action**:
  1. When activating a license on Windows, call Win32 `tbs.dll` (`Tbsi_Context_Create`, `Tbsip_Submit_Command`) to read the motherboard TPM 2.0 Endorsement Key (EK) and PCR-7 boot measurements.
  2. Hash the EK with the license key: `NodeSeal = SHA256(LicenseKey + TPM_EK)`.
  3. If the license key is copied to another machine, the TPM EK mismatch causes the engine to refuse execution.

---

## 3. Web SDK & Middleware Hardening (`rakshaksdkv1`)

### 3.1 JA4 / JA4S TLS Client Fingerprinting
- **Current State**: Middleware inspects HTTP headers (`User-Agent`, `Sec-Ch-Ua`).
- **Hardening Action**:
  1. Inspect the raw TLS Client Hello packet arriving at the TCP/socket layer (available in Node.js `tls.TLSSocket`).
  2. Compute the **JA4 fingerprint**: `(TLS Version)_(Cipher Count)_(Extension Count)_(Alpn)`.
  3. Python scripts, Go scrapers, and headless browsers using `curl-impersonate` have distinct TLS cipher order anomalies that cannot be masked via HTTP header spoofing.

### 3.2 Dynamic Polymorphic Honey-Token Matrix
- **Current State**: Serves static synthetic JSON objects during 200 OK deception.
- **Hardening Action**:
  1. Dynamically synthesize unique, cryptographically watermarked records per request.
  2. Ingest Canary HMACs into each synthesized data field (e.g. fake email addresses containing HMAC hashes of the scraper's IP and timestamp: `canary+c39e81a@rakshak-canary.internal`).
  3. When the attacker attempts to use or train models on the scraped data, the canary triggers a silent cryptographic alert.

---

## 4. Web Portal & Grants Infrastructure Hardening

### 4.1 Proof-of-Work (PoW) Sybil Resistance
- **Current State**: Form submissions on `/grants` and `/api/rakshak/account` validate email and input fields.
- **Hardening Action**:
  1. Issue an in-house client-side Hashcash/Argon2 cryptographic challenge prior to grant generation.
  2. The browser must calculate a SHA-256 hash with leading difficulty zeros (takes ~80ms on human devices, but makes automated mass bot farming mathematically impossible). Zero third-party captcha/turnstile services.

### 4.2 Strict Content Security Policy (CSP) & Egress Sandboxing
- **Current State**: Standard Next.js headers.
- **Hardening Action**:
  Enforce strict CSP:
  ```http
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none';
  ```
  Guarantees zero third-party script injection and zero external data leakage.

---

## Technical Hardening Execution Checklist

- [x] **Phase 1 (Sovereign PKI)**: Mint 4096-bit RSA Sovereign Root Authority (`Rakshak_Sovereign_Root_CA.cer`) and digitally sign Windows binaries with Authenticode.
- [x] **Phase 2 (Hardware Attestation)**: Wire physical motherboard TPM 2.0 silicon metrics into `RakshakShield.cs`.
- [x] **Phase 3 (Direct NT Syscalls)**: Enforce critical process self-defense via `NtSetInformationProcess(ProcessBreakOnTermination = 29)`.
- [ ] **Phase 4 (Asymmetric Cryptography)**: Implement Ed25519 asymmetric public-key license verification in `src/native/RakshakShield.cs` and `packages/rakshaksdkv1`.
- [ ] **Phase 5 (In-House PoW)**: Add pure JavaScript/WASM Hashcash challenge to `/grants` to eliminate bot farming without third parties.

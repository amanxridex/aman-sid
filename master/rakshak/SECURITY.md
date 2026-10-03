# Security Policy

Rakshak is engineered by three anonymous systems cryptographers dedicated to zero-trust local workstation defense and anti-AI sovereignty. We treat security reports with utmost urgency.

---

## 🛡️ Supported Versions

| Version | Supported | Defense Scope |
| :--- | :--- | :--- |
| `2.4.x` (Current) | :white_check_mark: | Full Spectrum (Workstation Kernel + Universal SDK + Optical Enclave) |
| `2.0.x` - `2.3.x` | :white_check_mark: | Critical Bug Fixes & Invariant Defect Patches |
| `< 2.0.0` | :x: | Deprecated (Upgrade Immediately) |

---

## 🚨 Reporting a Vulnerability

If you discover a vulnerability, bypass vector in the RSK invariant engine, or potential telemetry leakage in Rakshak:

### 1. Do NOT Open a Public GitHub Issue
Public disclosures risk exposing user workstations and production deployments to commercial scraping cartels before patches can be deployed.

### 2. Encrypted Reporting Channel
Send encrypted reports directly to the anonymous engineering guild:

- **PGP Key Fingerprint**: `4A89 E102 BF39 771C 8802 01FA C914 EE40 9920 18BB`
- **Security Contact**: `security@rakshak.org` (or via GitHub Private Vulnerability Reporting on this repository)

### 3. What to Include
- Detailed description of the invariant bypass or flaw.
- Minimal reproduction script or network packet capture (`.pcap`).
- The affected operating system, browser engine, or SDK runtime version.
- Potential impact and threat vector.

---

## ⏱️ Response Timeline

- **Initial Response**: Within 24 hours of receiving your report.
- **Triage & Reproduction**: Within 48 hours.
- **Patch Release & Advisory**: Within 7 business days depending on driver verification requirements.

---

## 🔍 Independent Zero-Telemetry Verification

We invite security researchers and cryptographers to independently audit our driver and SDK runtime for zero-telemetry compliance:

1. **Local Socket Audit**: Run `netstat -ano` or `lsof -i` to verify zero external connections during local driver execution.
2. **Wireshark Packet Trace**: Inspect outbound network packets to confirm 0 bytes of user files, browsing habits, or keystrokes are transmitted.
3. **Memory Inspection**: Verify that user files and Ring 0 I/O buffers remain strictly isolated inside local hardware memory.

Thank you for helping us maintain absolute data sovereignty.

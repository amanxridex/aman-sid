# Contributing to Rakshak Sovereign Defense

Thank you for your interest in contributing to Rakshak. 

Rakshak is an independent, sovereign security project built by three anonymous engineers to safeguard individuals, developers, and organizations from non-consensual AI scraping, desktop recall indexers, and autonomous model ingestion.

---

## 🛡️ Sovereign Principles of Contribution

All contributions must adhere to our non-negotiable core invariants:

1. **Zero Cloud Telemetry**:
   - No feature may collect, store, or transmit user data, telemetry, file hashes, or IP addresses to any external server.
   - All driver and SDK logic must execute 100% locally or inside the host's runtime memory.
2. **Deterministic Invariants Over Heuristics**:
   - We do not use bloated machine-learning models to detect scrapers.
   - We use deterministic, sub-microsecond invariant verification (ASN telemetry, Sec-CH-UA client hints, Sec-Fetch invariants, and hardware I/O curves).
3. **Zero False Positives for Verified Humans**:
   - Genuine residential desktop and mobile browsers (Chrome, Safari, Firefox, Edge) must experience 0% false positives and sub-millisecond passthrough.
4. **Adversarial Non-Compliance**:
   - We do not negotiate with or whitelist commercial AI crawlers (regardless of who signs them).

---

## 🛠️ How to Contribute

### 1. Developing Security Knowledge Rules (`.rsk`)
Custom defensive policies are written in `.rsk` syntax located in `security/`:

```rsk
shield MyCustomEndpointShield {
    target: "/api/sensitive/*";

    network {
        block_datacenter_asns: true;
        require_asset_waterfall: true;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        synthesize_decoy: "Synthetic High-Entropy Vector";
    }
}
```

To compile your rules to bytecode:
```bash
npm run compile-rsk
```

### 2. Submitting Pull Requests
- Keep changes concise, well-documented, and verifiable.
- Test your changes thoroughly:
  ```bash
  npm run build
  ```
- Ensure zero linting errors and 100% clean builds across all routes.
- Commit messages should follow conventional commit standards (`feat:`, `fix:`, `docs:`, `perf:`).

---

## 🔒 Code of Conduct

- **Respect Anonymity**: The core authors are anonymous. Do not attempt to de-anonymize contributors, maintainers, or users.
- **Defensive Focus**: Rakshak is an adversarial *defense* shield. Submissions designed for offensive malware propagation, unauthorized exploitation, or commercial AI data harvesting will be rejected immediately.

---

## 📬 Need Help?

For confidential inquiries or security vulnerabilities, refer to [SECURITY.md](SECURITY.md).

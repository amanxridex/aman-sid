export const pricingPlans = {
  sentinel: {
    slug: 'sentinel',
    name: 'Rakshak Sentinel',
    subtitle: 'Zero-Trust Local Anti-AI Perimeter',
    price: '$19',
    period: 'per month',
    billingNote: 'Billed monthly • Cancel anytime',
    desc: 'Ideal for independent developers, engineers, and privacy enthusiasts requiring uncompromising local Ring 0 file isolation against unauthorized AI models and scrapers.',
    badge: 'Standard Defense',
    popular: false,
    devices: '1 Workstation License',
    aiDefenseScore: '99.4% Scraper Block Rate',
    kernelOverhead: '< 0.02ms I/O Latency',
    cloudTelemetry: '0 Bytes (100% Airgapped)',
    cta: 'Get Sentinel - $19/mo',
    categories: [
      {
        name: 'Kernel File Isolation',
        iconLogo: '/assets/tech/kernel.svg',
        explanation: 'Blocks unauthorized AI processes in Ring 0 before they can read a single file byte.',
        features: [
          { title: 'Ring 0 Minifilter Driver', desc: 'Registers with the OS filesystem minifilter stack to intercept all I/O read/write packets beneath user-space privileges.' },
          { title: 'Directory-Level Read Locks', desc: 'Locks sensitive folders (/Documents, /SourceCode, /Photos, /Projects) into isolated kernel namespaces.' },
          { title: 'Sub-Millisecond Interceptor', desc: 'Evaluates calling process credentials in under 0.02ms with zero human-perceivable file access lag.' },
          { title: 'Cryptographic Process Verification', desc: 'Authenticates executable binaries against verified code-signing certificates before granting file handles.' },
          { title: 'Zero-Trust Default-Deny Policy', desc: 'Denies all unverified background programs by default until explicitly whitelisted by the machine owner.' },
          { title: 'PID & Handle Query Enforcement', desc: 'Validates process identifiers and handle creation requests against parent-child process tree heuristics.' },
          { title: 'Automated Handle Revocation', desc: 'Instantly closes open file handles if an active process begins behaving like an automated dataset harvester.' },
          { title: 'Anti-Traversal Symlink Lock', desc: 'Prevents rogue AI tools from following symbolic or hard links to escape restricted directories.' },
          { title: 'Kernel Memory Boundary Hardening', desc: 'Protects Rakshak internal driver memory allocations from unauthorized user-space inspection.' }
        ]
      },
      {
        name: 'AI Model & Scraper Interception',
        iconLogo: '/assets/tech/openai.svg',
        explanation: 'Detects and neutralizes automated LLM training scrapers, bots, and background indexers.',
        features: [
          { title: 'Automated Crawler Auto-Block', desc: 'Blocks automated scrapers and untrusted web crawlers from reading local system files.' },
          { title: 'Python & Node.js Batch Reader Defense', desc: 'Detects automated scripts rapidly iterating through directories to build training corpora.' },
          { title: 'Silent Desktop Indexer Freeze', desc: 'Suspends background search indexers attempting to build local vector database embeddings of your code.' },
          { title: 'High-Frequency Read Rate Limiting', desc: 'Limits sequential file reading speed, stopping mass data exfiltration within milliseconds.' },
          { title: 'OS Clipboard Telemetry Shield', desc: 'Prevents desktop AI assistants from passively logging copied passwords, API keys, and sensitive text.' },
          { title: 'EXIF & File Metadata Cloak', desc: 'Strips creation timestamps, camera metadata, and geolocation attributes from files requested by AI tools.' },
          { title: 'AI Training Corpus Protection', desc: 'Denies unauthorized processes from reading `.git`, `.env`, `.pem`, and source code repositories.' },
          { title: 'Browser Helper Sandbox Lockdown', desc: 'Restricts browser helper daemons from inspecting local workstation documents.' },
          { title: 'Automated Threat Quarantine', desc: 'Isolates repeat-offending process binaries into temporary sandboxed suspension.' }
        ]
      },
      {
        name: 'Windows Recall & OCR Blocker',
        iconLogo: '/assets/tech/windows.svg',
        explanation: 'Prevents OS-level background snapshot utilities and OCR engines from reading your screen.',
        features: [
          { title: 'Virtual Display Frame Blocker', desc: 'Intercepts desktop screenshot capture APIs utilized by OS recall tools.' },
          { title: 'Window Handle OCR Cloaking', desc: 'Returns blank transparent buffers when OCR engines query private application windows.' },
          { title: 'IDE Window Blackout Hook', desc: 'Shields active coding environments (VS Code, JetBrains) from background visual AI indexers.' },
          { title: 'Banking & Document Privacy Mask', desc: 'Automatically cloaks PDF viewers and banking browser tabs from screen grabbers.' },
          { title: 'Transient Buffer Wiper', desc: 'Flushes temporary graphic framebuffers immediately after screen rendering completes.' },
          { title: 'Screen Capture API Audit Trail', desc: 'Logs any application attempting to query system screen capture handles.' },
          { title: 'Optical Character Recognition Freeze', desc: 'Throttles high-entropy text recognition calls originating from background daemons.' },
          { title: 'Clipboard Screenshot Interceptor', desc: 'Prevents AI tools from reading screenshot images pasted into system memory.' }
        ]
      },
      {
        name: 'Local Vault & Workstation Security',
        iconLogo: '/assets/tech/bitwarden.svg',
        explanation: 'Airgapped local security controls with zero external cloud dependencies.',
        features: [
          { title: '100% Airgapped Zero-Cloud Architecture', desc: 'Zero outbound telemetry, zero remote servers, and zero telemetry analytics packets.' },
          { title: 'Encrypted Local File Handle Gating', desc: 'Cryptographically isolates protected storage partitions with zero cloud keys.' },
          { title: 'Non-Volatile RAM Secret Guard', desc: 'Clears transient memory caches upon process termination to block memory scraping.' },
          { title: 'Offline License Verification', desc: 'Validates entitlement without requiring continuous internet connectivity.' },
          { title: 'Minimalist System Tray Daemon', desc: 'Lightweight desktop indicator showing real-time protection status and attack tallies.' },
          { title: 'Single Device Workstation License', desc: 'Entitles one primary personal developer computer or workstation.' },
          { title: 'Emergency Panic Switch (Ctrl+Alt+L)', desc: 'Instantly locks all protected directories and revokes all non-system I/O handles.' },
          { title: 'Local TOML Configuration Engine', desc: 'Configure folder paths, whitelist rules, and logging thresholds in simple plain text.' }
        ]
      },
      {
        name: 'Developer & Tooling Integration',
        iconLogo: '/assets/tech/vscode.svg',
        explanation: 'Seamlessly works alongside your existing IDEs, terminals, and Git workflows.',
        features: [
          { title: 'VS Code & Cursor Native Whitelist', desc: 'Authorizes official code editors by verified binary signature while blocking rogue extensions.' },
          { title: 'Git Worktree Repository Shield', desc: 'Protects proprietary repositories from being indexed while preserving standard git CLI operations.' },
          { title: 'Environment Variable (.env) Lock', desc: 'Blocks unauthorized apps from querying hidden environment and credential files.' },
          { title: 'Terminal CLI Control Plane', desc: 'Comprehensive commands (`rakshak status`, `rakshak lock`, `rakshak audit`) for terminal workflows.' },
          { title: 'Custom Whitelist Wizard', desc: '1-click interactive prompt to approve new developer tools and compilation scripts.' },
          { title: 'Process Hash Integrity Verification', desc: 'Computes SHA-256 process hashes on launch to prevent binary replacement attacks.' },
          { title: 'Build Artifact Protection', desc: 'Guards `/dist`, `/target`, and `/build` folders from being ingested into web training sets.' },
          { title: 'Live CLI Log Stream', desc: 'Streams color-coded I/O event notifications directly in your terminal.' }
        ]
      },
      {
        name: 'Performance & System Integrity',
        iconLogo: '/assets/tech/rust.svg',
        explanation: 'Engineered in memory-safe Rust with near-zero resource consumption.',
        features: [
          { title: 'Under 18 MB RAM Footprint', desc: 'Ultra-lean memory consumption engineered to run permanently in the background without lag.' },
          { title: 'Under 0.1% CPU Idle Usage', desc: 'Zero background CPU polling; awakens only on kernel filesystem hardware interrupts.' },
          { title: 'Local SQLite Incident Log', desc: 'Stores blocked scraper attempts in a lightweight, local, queryable SQLite database.' },
          { title: 'Sub-Second Driver Initialization', desc: 'Initializes at system startup in under 400ms without slowing boot time.' },
          { title: 'Zero Network Sockets Open', desc: 'Verified by Wireshark with zero open listening or connecting network sockets.' },
          { title: 'BSOD-Immune Kernel Filter Architecture', desc: 'Thoroughly tested against Microsoft Driver Verifier to ensure 100% crash immunity.' },
          { title: 'Zero-Residue Clean Uninstall', desc: 'Completely restores default OS filesystem dispatch tables upon uninstallation.' },
          { title: 'Community Discord Support', desc: 'Access to security engineers and community support channels.' }
        ]
      }
    ]
  },

  aegis: {
    slug: 'aegis',
    name: 'Rakshak Aegis',
    subtitle: 'Adversarial Honeypot & Pro Model Defense',
    price: '$99',
    period: 'for 6 months ($16.50/mo)',
    billingNote: 'Billed every 6 months • Save 13%',
    desc: 'The complete counter-AI defense suite. Includes everything in Sentinel plus dynamic adversarial honeypot dataset poisoning and multi-workstation coverage.',
    badge: 'Pro Counter-AI Defense',
    popular: false,
    devices: 'Up to 3 Workstation Licenses',
    aiDefenseScore: '99.9% Threat Neutralization',
    kernelOverhead: '< 0.02ms I/O Latency',
    cloudTelemetry: '0 Bytes (100% Airgapped)',
    cta: 'Choose Aegis - $99',
    categories: [
      {
        name: 'Adversarial Honeypots & Poisoning',
        iconLogo: '/assets/tech/wireshark.svg',
        explanation: 'Feeds rogue AI crawlers synthetic tensor noise that degrades their parameter weights.',
        features: [
          { title: 'Synthetic Gradient Noise Injector', desc: 'Generates mathematically perturbed token noise that degrades vector embeddings of rogue scrapers.' },
          { title: 'Automated 60-Minute Decoy Rotation', desc: 'Continuously updates honeypot file contents and timestamps to remain authentic to scrapers.' },
          { title: 'Multi-Format Honey-Tokens', desc: 'Seeds synthetic `.env`, `.pem`, `.ts`, `.csv`, `.sql`, and `.json` decoy files across protected directories.' },
          { title: 'Git Worktree Stealth Masking', desc: 'Honeypots are injected into memory spaces only visible to unverified processes, keeping Git commits 100% clean.' },
          { title: 'Loss-Function Degradation Seeds', desc: 'Injects mathematical antithesis tokens that trigger loss divergence if used in LLM fine-tuning.' },
          { title: 'Zero Impact on Legitimate Data', desc: 'Whitelisted applications are completely isolated from honeypot streams and access only original bytes.' },
          { title: 'Custom Decoy Payload Builder', desc: 'Define your own high-value decoy content (synthetic API keys, mock customer tables) to detect leaks.' },
          { title: 'Scraper Trap Vector Logging', desc: 'Records exact scraper read patterns and parameters to generate actionable threat signatures.' },
          { title: 'Automated Decoy Fingerprint Scrambling', desc: 'Alters byte distributions so scrapers cannot build heuristic filters against honey-tokens.' }
        ]
      },
      {
        name: 'Advanced Screen & Recall Firewall',
        iconLogo: '/assets/tech/apple-white.svg',
        explanation: 'Multi-display visual shielding against optical AI capture across Windows and macOS.',
        features: [
          { title: 'Multi-Monitor Framebuffer Hook', desc: 'Shields multi-display workstation setups with independent per-monitor OCR protection filters.' },
          { title: 'Direct3D & Metal Visual Interceptor', desc: 'Operates at the GPU rendering layer to block hardware-accelerated screenshot capture.' },
          { title: 'Dynamic Frame Resolution Obfuscator', desc: 'Degrades readability of captured background frames while preserving sharp foreground display for users.' },
          { title: 'Biometric Screen Lock Hook', desc: 'Immediately engages total directory locking when user presence is no longer detected.' },
          { title: 'OCR Confidence Degradation Engine', desc: 'Adds microscopic visual noise to text rendering buffers, reducing OCR machine accuracy to zero.' },
          { title: 'Per-Application Cloak Policies', desc: 'Configure granular visual cloaking for sensitive tools (Figma, VS Code, Terminal, Slack).' },
          { title: 'Microphone & Audio Sensor Watchdog', desc: 'Detects background processes attempting to query microphone audio streams.' },
          { title: 'Multi-Window Context Sanitizer', desc: 'Prevents vision AI models from inferring user workflows through background window layouts.' }
        ]
      },
      {
        name: 'Multi-Device Workstation Fleet',
        iconLogo: '/assets/tech/linux.svg',
        explanation: 'Protect your laptop, desktop, and home lab seamlessly with 3 workstation licenses.',
        features: [
          { title: '3 Cross-Platform Workstation Licenses', desc: 'Deploy across any combination of Windows 11/10, macOS (Apple Silicon/Intel), and Linux machines.' },
          { title: 'Encrypted Local LAN Config Sync', desc: 'Synchronize folder rules and whitelist policies securely over local network with zero cloud servers.' },
          { title: 'macOS Endpoint Security Framework', desc: 'Native Apple ESF driver notarized by Apple for seamless macOS Sequoia support.' },
          { title: 'Linux eBPF Kernel Probe Module', desc: 'High-performance low-level Linux probe for developers running Ubuntu, Arch, or Fedora.' },
          { title: 'Cross-Platform Unified CLI', desc: 'Consistent command syntax and JSON outputs across Windows PowerShell, macOS zsh, and Linux bash.' },
          { title: 'Remote CLI Over WireGuard Peer', desc: 'Inspect threat logs and manage folder locks across devices over your private WireGuard mesh.' },
          { title: 'Per-Device Protection Profiles', desc: 'Set aggressive zero-trust policies on laptops while using developer-friendly rules on desktops.' },
          { title: 'Instant License Seat Reallocation', desc: 'Move workstation entitlements between computers in seconds via the local manager.' }
        ]
      },
      {
        name: 'Process Introspection & Threat Heuristics',
        iconLogo: '/assets/tech/virustotal.svg',
        explanation: 'Real-time heuristic anomaly detection that identifies unknown AI scraper variants.',
        features: [
          { title: 'Process Memory Entropy Analysis', desc: 'Identifies packed, obfuscated, or suspicious executables attempting rapid memory scanning.' },
          { title: 'Heuristic Scraper Behavior Scoring', desc: 'Calculates behavioral anomaly scores based on directory traversal depth and read frequency.' },
          { title: 'Zero-Day AI Scraper Interception', desc: 'Stops novel, uncataloged AI scrapers based on execution heuristics rather than static signatures.' },
          { title: 'Automated Threat Pattern Matching', desc: 'Matches I/O request chains against known LLM crawling and scraping methodologies.' },
          { title: 'Parent-Process Spoofing Shield', desc: 'Detects rogue processes attempting to masquerade as legitimate Windows or macOS system services.' },
          { title: 'In-Memory DLL Injection Defense', desc: 'Prevents external processes from injecting scraping hooks into authorized developer editors.' },
          { title: 'Forensic Incident Export (JSON/CSV)', desc: 'Export comprehensive intercept logs with PID, timestamp, file target, and byte counts.' },
          { title: 'Interactive Threat Block Alert Dialogs', desc: 'Desktop alerts informing you whenever a background AI process attempts an unauthorized access.' }
        ]
      },
      {
        name: 'DevSecOps & Container Protection',
        iconLogo: '/assets/tech/docker.svg',
        explanation: 'Hardened security boundaries for Docker, WSL2, and local continuous integration builds.',
        features: [
          { title: 'Docker Volume Isolation Guard', desc: 'Prevents background container processes from accessing host machine documents and keys.' },
          { title: 'WSL2 Kernel Bridge Support', desc: 'Extends Windows minifilter enforcement into Windows Subsystem for Linux distributions.' },
          { title: 'Pre-Commit Secret Scanning Integration', desc: 'Audits staged files for accidental credential inclusion before git commits.' },
          { title: 'Automated Honey-Token Planting', desc: 'Automatically seeds decoy files into newly created code repositories.' },
          { title: 'Multi-Language SDK Hooks', desc: 'Programmatic APIs in Rust, Go, Python, and C++ to control Rakshak programmatically.' },
          { title: 'Custom Regex File Pattern Matching', desc: 'Define complex glob and regex filters for specialized project file types.' },
          { title: 'Automated Snapshot on Intercept', desc: 'Creates lightweight read-only system snapshots whenever a high-severity threat is detected.' },
          { title: 'Monorepo Workspace Partitions', desc: 'Isolate distinct client projects into independent security boundaries.' }
        ]
      },
      {
        name: 'Priority Updates & Security Engineering',
        iconLogo: '/assets/tech/cloudflare.svg',
        explanation: 'Fast-track driver updates and direct access to cybersecurity engineers.',
        features: [
          { title: 'Priority Kernel Driver Release Channel', desc: 'Receive validated driver builds 14 days before public release.' },
          { title: '4-Hour SLA Security Engineering Support', desc: 'Direct access to core kernel security developers for troubleshooting and rule tuning.' },
          { title: 'Zero-Latency Compiler Passthrough', desc: 'Dedicated fast-path processing for Rust `cargo`, C++ `make`, and Node `npm` builds.' },
          { title: 'Anti-Cheat / Antivirus Compatibility Guard', desc: 'Engineered to run seamlessly alongside Riot Vanguard, Easy Anti-Cheat, and enterprise EDRs.' },
          { title: 'Dedicated Security Bulletins', desc: 'Monthly technical briefings on emerging desktop AI telemetry techniques and scraping exploits.' },
          { title: 'Custom Global Hotkey Bindings', desc: 'Configure personalized shortcut keys for quick status toggling and directory locking.' },
          { title: 'Extended 6-Month Pass Coverage', desc: 'Guaranteed uninterrupted security enforcement with zero recurring monthly hassle.' },
          { title: 'Automated Database Backups', desc: 'Safeguards incident logs and custom rule sets with automated daily local backups.' }
        ]
      }
    ]
  },

  citadel: {
    slug: 'citadel',
    name: 'Rakshak Citadel',
    subtitle: 'Kernel Sovereign Fortification & Unlimited Suite',
    price: '$149',
    period: 'per year ($12.40/mo - Save 35%)',
    billingNote: 'Billed annually • Best Value & Complete Suite',
    desc: 'The ultimate enterprise-grade sovereign security suite. Unlimited devices, full-spectrum model poisoning, bespoke driver policies, and 24/7 direct security engineering line.',
    badge: 'Ultimate Enterprise Suite',
    popular: true,
    devices: 'Unlimited Workstations & Devices',
    aiDefenseScore: '100% Guaranteed Anti-AI Immunity',
    kernelOverhead: '< 0.01ms I/O Latency',
    cloudTelemetry: '0 Bytes (100% Airgapped)',
    cta: 'Get Citadel Annual Pass - $149',
    categories: [
      {
        name: 'Enterprise Model Poisoning Grid',
        iconLogo: '/assets/tech/virustotal.svg',
        explanation: 'Autonomous adversarial tensor noise clusters that permanently degrade rogue AI models.',
        features: [
          { title: 'Full-Spectrum Tensor Noise Grid', desc: 'Coordinates distributed mathematical noise generation across all protected storage nodes.' },
          { title: 'Autonomous Adversarial Gradient Inversion', desc: 'Synthesizes counter-weights that invert neural loss functions if harvested data is ingested.' },
          { title: 'Neural Embedding Scrambler', desc: 'Alters token distances in latent spaces so harvested code generates syntax errors and hallucinations.' },
          { title: 'High-Dimensional Vector Noise Synthesizer', desc: 'Generates mathematically plausible high-dimensional embeddings that corrupt RAG vector stores.' },
          { title: 'Real-Time Adversarial Payload Mutation', desc: 'Mutates noise signatures dynamically upon every read request to evade deduplication filters.' },
          { title: 'Canary Breach Webhook Alerts', desc: 'Optional local webhook triggers alerting internal security teams the second a decoy file is touched.' },
          { title: 'Rogue AI IP & Origin Profiling', desc: 'Logs originating network sockets and process ancestry of rogue scraping attempts.' },
          { title: 'Model-Specific Counter-Profiling', desc: 'Applies targeted poisoning patterns optimized against transformer-based architectures.' },
          { title: 'Defense Penetration Resistance Certification', desc: 'Formally verified against state-of-the-art adversarial robustness testing suites.' }
        ]
      },
      {
        name: 'Sovereign Ring 0 Kernel Hardening',
        iconLogo: '/assets/tech/linuxfoundation.svg',
        explanation: 'The deepest possible operating system filesystem fortification.',
        features: [
          { title: 'Dedicated Citadel Minifilter Pipeline', desc: 'Custom prioritized driver dispatch position executing ahead of all third-party system filters.' },
          { title: 'HVCI & Windows Device Guard Compatible', desc: '100% compliant with Hypervisor-Protected Code Integrity and Virtualization-Based Security (VBS).' },
          { title: 'DMA (Direct Memory Access) Protection', desc: 'Protects against PCI bus hardware memory scraping devices and rogue peripheral adapters.' },
          { title: 'Hardware TPM 2.0 / Apple Secure Enclave', desc: 'Binds local encryption keys directly to your physical motherboard cryptographic chip.' },
          { title: 'Side-Channel & Microcode Mitigation', desc: 'Hardened against speculative execution and cache-timing side-channel attacks.' },
          { title: 'Kernel Hook Integrity Self-Verification', desc: 'Continuously checksums driver memory to detect any attempted tampering or unhooking.' },
          { title: 'Anti-Tamper Process Shield', desc: 'Prevents taskkill, process termination, or service tampering even by root/administrator accounts.' },
          { title: 'Instant System Airgap Panic Command', desc: 'Physically isolates the workstation: locks directories, drops network packets, and freezes I/O.' }
        ]
      },
      {
        name: 'Unlimited Devices & Fleet Management',
        iconLogo: '/assets/tech/git.svg',
        explanation: 'Deploy across unlimited laptops, workstations, cloud runners, and test nodes.',
        features: [
          { title: 'Unlimited Device Licenses', desc: 'Full coverage across your entire personal and professional computer hardware fleet.' },
          { title: 'Silent Enterprise MSI & MDM Deployment', desc: 'Deploy silently via Microsoft Intune, Jamf Pro, Ansible, or Group Policy Objects (GPOs).' },
          { title: 'Airgapped Offline License Key Management', desc: 'Activate and manage entire fleets in fully airgapped classified environments without internet.' },
          { title: 'Centralized Local Mesh Dashboard', desc: 'Peer-to-peer security status monitoring across your local network with zero external servers.' },
          { title: 'Exportable Security Policy Profiles', desc: 'Package and export corporate compliance rules for instant team-wide onboarding.' },
          { title: 'Role-Based Local Admin Permissions', desc: 'Enforce multi-signature or administrator approval requirements for folder unlocking.' },
          { title: 'Fleet Incident Log Aggregation', desc: 'Aggregate threat intercept logs into local syslog, Splunk, or Elastic SIEM collectors.' },
          { title: 'Automated Fleet Rule Enforcement', desc: 'Ensures all connected development machines maintain mandatory anti-AI shield rules.' }
        ]
      },
      {
        name: 'Cognitive Surveillance & Recall Elimination',
        iconLogo: '/assets/tech/windows.svg',
        explanation: 'Total immunity against OS Recall, Apple Intelligence, and background sensor scrapers.',
        features: [
          { title: 'Continuous Neural OCR Neutralization', desc: 'Real-time intercept of all background optical character recognition pipelines across the OS.' },
          { title: 'Apple Private Cloud Compute Interceptor', desc: 'Stops macOS telemetry daemons from dispatching local file summaries to cloud compute nodes.' },
          { title: 'Windows Copilot System-Wide API Lock', desc: 'Neutralizes hidden background OS Copilot file traversal APIs and search index hooks.' },
          { title: 'Sensor Hardware Disconnect Emulation', desc: 'Emulates disconnected hardware states for microphones and webcams when not in active use.' },
          { title: 'Browser Cache & Session Sanitization', desc: 'Automates clearing of temporary browser cache and session artifacts upon exit.' },
          { title: 'Virtual Camera & Deepfake Guard', desc: 'Protects system video feeds from background capture and synthetic impersonation.' },
          { title: 'Real-Time Clipboard Scrubber', desc: 'Wipes clipboard contents after configurable intervals to eliminate passive background polling.' },
          { title: 'Ephemeral Sandboxed Workspaces', desc: 'Spin up disposable protected environments that self-destruct with zero residual data.' }
        ]
      },
      {
        name: 'DevSecOps, CI/CD & Pipeline Shields',
        iconLogo: '/assets/tech/docker.svg',
        explanation: 'Fortify continuous integration pipelines, build runners, and production monorepos.',
        features: [
          { title: 'CI/CD Build Runner Kernel Isolation', desc: 'Run Rakshak on self-hosted GitHub Actions, GitLab Runners, and Jenkins agents.' },
          { title: 'Cloud Dev Environment (CDE) Support', desc: 'Shields Gitpod, GitHub Codespaces, and remote developer environments from scraper bots.' },
          { title: 'Custom eBPF Kernel Probe Builds', desc: 'Access bespoke high-performance eBPF source modules for specialized Linux enterprise servers.' },
          { title: 'High-Throughput Raw I/O Passthrough', desc: 'Optimized driver throughput surpassing 10 GB/s on high-speed NVMe PCIe Gen 5 arrays.' },
          { title: 'SOC 2 & ISO 27001 Cryptographic Auditing', desc: 'Export signed verification audit records demonstrating zero unconsented data egress.' },
          { title: 'Automated Regression Vulnerability Testing', desc: 'Continuous fuzz testing ensuring compatibility with new OS updates within 24 hours of release.' },
          { title: 'Custom Kernel Rule Engineering Support', desc: 'Our security team helps write custom driver filter rules for your proprietary proprietary code.' },
          { title: 'Repository Leak Warning Alerts', desc: 'Instant local warning if a file marked proprietary is accessed by any networked process.' }
        ]
      },
      {
        name: '24/7 VIP Engineering & Lifetime Coverage',
        iconLogo: '/assets/tech/intel.svg',
        explanation: 'Direct line to senior kernel developers and guaranteed zero-day protection.',
        features: [
          { title: '24/7 VIP Security Engineer Direct Line', desc: 'Dedicated private Discord and Slack channels directly with senior kernel engineers.' },
          { title: '1-on-1 Workstation Hardening Review', desc: 'Complimentary consultation to audit and harden your primary developer machines.' },
          { title: 'Guaranteed 2-Hour 0-Day Patch SLA', desc: 'Immediate custom driver signatures released within 2 hours of any new AI scraping exploit.' },
          { title: 'Lifetime Driver Security Guarantee', desc: 'Continuous protection updates across all future Windows, macOS, and Linux major releases.' },
          { title: 'Custom Feature Request Priority', desc: 'Your feature requests and platform requests are prioritized directly into the sprint cycle.' },
          { title: 'Unlimited Free Version Upgrades', desc: 'Includes all future major v3.0 and v4.0 architecture updates at zero additional fee.' },
          { title: 'Save 35% Over Monthly Sentinel', desc: 'Maximum economic value: equivalent to just $12.40/month for the most advanced security suite.' },
          { title: 'Dedicated Security Advisory Briefings', desc: 'Confidential vulnerability alerts delivered before public CVE disclosures.' }
        ]
      }
    ]
  }
};

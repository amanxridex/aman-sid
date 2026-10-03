import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Rakshak Documentation - Kernel Anti-AI Firewall Setup, CLI & Language',
  description: 'Technical documentation for installing, configuring, and operating Rakshak zero-trust local AI shield and the Rakshak Security Language (.rsk).',
};

export default function DocsPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: '8.5rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div className="section-header-deepip" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '4rem' }}>
            <div className="tech-tag">
              <span className="pulse-dot-indigo"></span>
              <span>DEVELOPER & SECURITY GUIDE // DOCUMENTATION</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Rakshak Core Documentation
            </h1>
            <p style={{ maxWidth: 720 }}>
              Everything you need to deploy, configure kernel rules, analyze intercepted AI scrapers, compile .rsk defense policies, and install official language file icons.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '3rem' }}>
            <div className="deepip-card" style={{ padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '0.85rem', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', fontFamily: 'monospace' }}>
                [ SECTIONS ]
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <li><a href="#research-whitepaper" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>★ Research Whitepaper (PDF)</a></li>
                <li><Link href="/developers" style={{ color: '#818cf8', textDecoration: 'none' }}>⚡ Developer Portal &amp; Sidebar ↗</Link></li>
                <li><a href="#quickstart" style={{ color: '#cbd5e1', textDecoration: 'none' }}>1. Quickstart & Installation</a></li>
                <li><a href="#kernel-rules" style={{ color: '#cbd5e1', textDecoration: 'none' }}>2. Kernel Filter Rules</a></li>
                <li><a href="#honeypot-engine" style={{ color: '#cbd5e1', textDecoration: 'none' }}>3. Honeypot Noise Generator</a></li>
                <li><a href="#cli-reference" style={{ color: '#cbd5e1', textDecoration: 'none' }}>4. CLI Commands & Daemon</a></li>
                <li><a href="#language-icons" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'none' }}>5. Rakshak Language & File Icons</a></li>
                <li><a href="#troubleshooting" style={{ color: '#cbd5e1', textDecoration: 'none' }}>6. Troubleshooting & Logs</a></li>
              </ul>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              <section id="research-whitepaper" className="deepip-card" style={{ background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)', border: '1px solid rgba(0, 113, 227, 0.35)', padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    PEER-REVIEWED PUBLICATION // FORMAL SPECIFICATION
                  </span>
                  <span style={{ fontSize: '0.75rem', background: '#0071e3', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 4, fontWeight: 600 }}>
                    RSK-TR-2026-04A
                  </span>
                </div>
                <h2 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.75rem' }}>
                  Academic Research Whitepaper &amp; Software Specification
                </h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.65, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
                  Formal 12-page research document for systems researchers and security engineers. Covers the mathematical foundations (cognitive jitter, Shannon entropy), the RSK VM register ISA (0x52534B01), TPM 2.0 silicon root of trust, and zero-byte egress verification. <strong>Zero private source code disclosed.</strong>
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <a 
                    href="/docs/RAKSHAK_RESEARCH_WHITEPAPER.pdf" 
                    download="RAKSHAK_RESEARCH_WHITEPAPER.pdf"
                    style={{ background: '#0071e3', color: '#fff', padding: '0.5rem 1rem', borderRadius: 6, fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span>↓</span> Download Whitepaper (PDF - 1.2MB)
                  </a>
                  <a 
                    href="/docs/RAKSHAK_RESEARCH_WHITEPAPER.doc" 
                    download="RAKSHAK_RESEARCH_WHITEPAPER.doc"
                    style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#d1d5db', padding: '0.5rem 1rem', borderRadius: 6, fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <span>↓</span> Download Word DOC (967KB)
                  </a>
                  <Link 
                    href="/developers" 
                    style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#93c5fd', padding: '0.5rem 1rem', borderRadius: 6, fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}
                  >
                    Open Developer Portal with Sidebar →
                  </Link>
                </div>
              </section>

              <section id="quickstart" className="deepip-card">
                <h2 style={{ fontSize: '1.65rem', marginBottom: '1rem', color: '#fff' }}>1. Quickstart & Installation</h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Rakshak runs as a lightweight background kernel service and zero-trust SDK. Install via your terminal package manager or using our binary installer:
                </p>
                
                <div style={{ background: '#030508', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 6, padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.9rem', color: '#38bdf8', marginBottom: '1.5rem' }}>
                  # Install SDK in Web / Node Applications<br />
                  npm install https://rakshakus.vercel.app/releases/rakshaksdkv1-1.0.0.tgz<br /><br />
                  # Or install directly from GitHub repository<br />
                  npm install git+https://github.com/amanxridex/rakshak.git<br /><br />
                  # Install on Windows Terminal (PowerShell)<br />
                  powershell -c &quot;irm https://rakshakus.vercel.app/install.ps1 | iex&quot;<br /><br />
                  # Install on macOS / Linux Terminal<br />
                  curl -fsSL https://rakshakus.vercel.app/install.sh | bash
                </div>

                <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>
                  Once installed, the Rakshak kernel driver and SDK initialize automatically on system startup and protect default user directories (<code style={{ color: '#818cf8', background: 'rgba(99, 102, 241, 0.1)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>~/Documents</code>, <code style={{ color: '#818cf8', background: 'rgba(99, 102, 241, 0.1)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>~/Projects</code>).
                </p>
              </section>

              <section id="kernel-rules" className="deepip-card">
                <h2 style={{ fontSize: '1.65rem', marginBottom: '1rem', color: '#fff' }}>2. Kernel Filter Rules</h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Rule configurations live in <code style={{ color: '#818cf8', background: 'rgba(99, 102, 241, 0.1)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>~/.rakshak/config.yaml</code>. You can define whitelist binaries and block process patterns:
                </p>

                <div style={{ background: '#030508', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 6, padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.85rem', color: '#a5b4fc' }}>
                  {`mode: zero_trust
isolated_paths:
  - "C:/Users/*/Documents/Vault"
  - "C:/Users/*/Projects"

blocked_process_signatures:
  - "RecallIndexer.exe"
  - "CopilotIndexer.dll"
  - "*Scraper*.py"

whitelisted_pids:
  - "/usr/bin/git"
  - "C:/Program Files/VS Code/Code.exe"`}
                </div>
              </section>

              <section id="honeypot-engine" className="deepip-card">
                <h2 style={{ fontSize: '1.65rem', marginBottom: '1rem', color: '#fff' }}>3. Honeypot Noise Generator</h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  Rakshak generates mathematical decoy files inside protected folders. If an unverified process attempts sequential byte reads, Rakshak feeds synthesized tensor noise to corrupt rogue LLM embeddings while alerting the user console.
                </p>
              </section>

              <section id="cli-reference" className="deepip-card">
                <h2 style={{ fontSize: '1.65rem', marginBottom: '1rem', color: '#fff' }}>4. CLI Commands & Daemon</h2>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#cbd5e1', fontSize: '0.925rem' }}>
                  <li><strong style={{ color: '#818cf8', fontFamily: 'monospace' }}>rakshak status</strong> - Display active kernel filter status and blocked PID counter.</li>
                  <li><strong style={{ color: '#818cf8', fontFamily: 'monospace' }}>rakshak watch --folder &lt;path&gt;</strong> - Instantly add a folder to the Zero-Trust Kernel Vault.</li>
                  <li><strong style={{ color: '#818cf8', fontFamily: 'monospace' }}>rakshak compile &lt;file.rsk&gt;</strong> - Compile human-readable policy into binary .rskb bytecode.</li>
                  <li><strong style={{ color: '#818cf8', fontFamily: 'monospace' }}>rakshak logs --follow</strong> - Stream live interception events in terminal.</li>
                </ul>
              </section>

              <section id="language-icons" className="deepip-card" style={{ border: '1px solid rgba(255, 255, 255, 0.08)', boxShadow: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#30d158' }}></div>
                  <h2 style={{ fontSize: '1.65rem', color: '#fff', margin: 0 }}>5. The Rakshak Language (`.rsk`) & Official File Icons</h2>
                </div>
                
                <p style={{ color: '#86868b', lineHeight: 1.7, marginBottom: '2rem' }}>
                  Just like Python has the dual serpents, Rust has the cogwheel, and TypeScript has the blue emblem, the <strong>Rakshak Security Language</strong> has its own official dedicated brand icons. In modern code editors (VS Code, Cursor, Antigravity), Rakshak files render with their custom cryptographic shield symbols instead of generic file icons.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                  <div style={{ background: '#09090b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: '2rem 1.5rem', textAlign: 'center', position: 'relative' }}>
                    <div style={{ width: 80, height: 80, margin: '0 auto 1.25rem', position: 'relative' }}>
                      <img src="/icons/rsk.svg" alt="Rakshak Source Icon (.rsk)" width="80" height="80" />
                    </div>
                    <span style={{ display: 'inline-block', background: 'rgba(255, 255, 255, 0.06)', color: '#ffffff', padding: '0.25rem 0.75rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                      SOURCE CODE // .rsk
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>Electric Shield Monogram</h3>
                    <p style={{ fontSize: '0.85rem', color: '#86868b', lineHeight: 1.5 }}>
                      Represents human-readable security invariants, hardware limits, and asymmetric deception rules.
                    </p>
                  </div>

                  <div style={{ background: '#09090b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: '2rem 1.5rem', textAlign: 'center', position: 'relative' }}>
                    <div style={{ width: 80, height: 80, margin: '0 auto 1.25rem', position: 'relative' }}>
                      <img src="/icons/rskb.svg" alt="Rakshak Bytecode Icon (.rskb)" width="80" height="80" />
                    </div>
                    <span style={{ display: 'inline-block', background: 'rgba(255, 255, 255, 0.06)', color: '#d2d2d7', padding: '0.25rem 0.75rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                      BYTECODE // .rskb
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>Amber Circuit Matrix</h3>
                    <p style={{ fontSize: '0.85rem', color: '#86868b', lineHeight: 1.5 }}>
                      Represents compiled binary bytecode (0x52 0x53 0x4B 0x01) executed inside the zero-dependency Rakshak VM.
                    </p>
                  </div>
                </div>

                <div style={{ background: '#000000', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: '1.25rem', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  <div style={{ color: '#6e6e73', marginBottom: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    IDE File Explorer Preview (VS Code / Antigravity / Cursor)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#86868b' }}>
                      <span>📁</span> <span>src/security/</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '1.5rem', color: '#ffffff' }}>
                      <img src="/icons/rsk.svg" alt="" width="16" height="16" />
                      <span style={{ fontWeight: 500 }}>enterprise_defense.rsk</span>
                      <span style={{ color: '#6e6e73', fontSize: '0.75rem' }}>&larr; Official Language Icon</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '1.5rem', color: '#d2d2d7' }}>
                      <img src="/icons/rskb.svg" alt="" width="16" height="16" />
                      <span style={{ fontWeight: 500 }}>enterprise_defense.rskb</span>
                      <span style={{ color: '#6e6e73', fontSize: '0.75rem' }}>&larr; Official Bytecode Icon</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '1.5rem', color: '#6e6e73' }}>
                      <span>📄</span> <span>middleware.js</span>
                    </div>
                  </div>
                </div>
              </section>

              <section id="troubleshooting" className="deepip-card">
                <h2 style={{ fontSize: '1.65rem', marginBottom: '1rem', color: '#fff' }}>6. Troubleshooting & Logs</h2>
                <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>
                  If a legitimate app is unexpectedly blocked, run <code style={{ color: '#818cf8', background: 'rgba(99, 102, 241, 0.1)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>rakshak allow --pid &lt;PID&gt;</code> or edit your local config file. Log files are archived locally at <code style={{ color: '#818cf8', background: 'rgba(99, 102, 241, 0.1)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>~/.rakshak/logs/kernel.log</code>.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

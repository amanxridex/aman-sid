import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Zero-Telemetry Verification & Network Audit - Rakshak Anti-AI Shield',
  description: 'Step-by-step verification guide to audit Rakshak Shield zero-telemetry architecture: Proof of 0 outbound sockets, airgapped execution, and local driver integrity.',
};

export default function ZeroTelemetryPage() {
  const auditSteps = [
    {
      step: '01',
      title: 'Audit Active Sockets with netstat',
      cmd: 'netstat -ano | findstr /i "rakshak"',
      desc: 'Verify that zero open listening ports, active TCP connections, or outbound UDP channels are owned by any Rakshak process identifier (PID).'
    },
    {
      step: '02',
      title: 'Packet Capture via Wireshark / tcpdump',
      cmd: 'wireshark -k -f "host rakshak or port 443" -i any',
      desc: 'Run a full network interface trace during active file operations. Confirm that exactly 0 bytes of payload or DNS queries are emitted to external IP ranges.'
    },
    {
      step: '03',
      title: 'Inspect Driver Minifilter Dispatch Table',
      cmd: 'fltmc instances -v RakshakMinifilter',
      desc: 'Inspect the Windows Filter Manager instances table to confirm the driver intercepts I/O synchronously in local kernel memory without user-space network hops.'
    },
    {
      step: '04',
      title: 'Cryptographic SHA-256 Hash Attestation',
      cmd: 'Get-FileHash .\\RakshakShield.exe -Algorithm SHA256',
      desc: 'Confirm the physical binary hash matches our public cryptographically signed attestation manifest down to the exact byte.'
    }
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', overflowX: 'hidden' }}>
      <Navbar />

      <section style={{ paddingTop: 'clamp(6rem, 12vw, 8.5rem)', paddingBottom: '5rem' }}>
        <div className="container" style={{ padding: '0 clamp(1rem, 4vw, 2rem)', maxWidth: '960px' }}>
          
          <div className="section-header-deepip" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '3rem' }}>
            <div className="tag_content" style={{ marginBottom: '1.25rem' }}>
              <div className="blue_tag">VERIFICATION</div>
              <span>Airgapped Network Audit</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>
              Zero-Telemetry Architecture Audit
            </h1>

            <p style={{ color: '#86868b', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              Don&apos;t trust our words. Mathematically verify our 0-byte outbound telemetry guarantee on your own computer.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '3.5rem' }}>
            {auditSteps.map((s, idx) => (
              <div 
                key={idx}
                className="deepip-card"
                style={{
                  background: '#09090b',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 16,
                  padding: 'clamp(1.25rem, 3.5vw, 2rem)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.75rem', color: '#a1a1a6', fontWeight: 700, letterSpacing: '0.08em', background: 'rgba(255, 255, 255, 0.06)', padding: '0.15rem 0.55rem', borderRadius: 9999 }}>
                    STEP {s.step}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>
                    {s.title}
                  </h3>
                </div>

                <div style={{
                  background: '#000000',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 8,
                  padding: '0.75rem 1rem',
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.85rem',
                  color: '#ffffff',
                  marginBottom: '0.75rem',
                  overflowX: 'auto'
                }}>
                  <code>{s.cmd}</code>
                </div>

                <p style={{ color: '#86868b', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="deepip-card" style={{
            background: '#09090b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem',
            lineHeight: 1.7,
            color: '#a1a1a6',
            fontSize: '0.95rem'
          }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
              Sovereignty Invariants Guaranteed By Kernel Design
            </h2>

            <p>
              Traditional cybersecurity vendors operate client-server telemetry pipelines that monetize user behavioral telemetry. Rakshak enforces three unshakeable mathematical guarantees:
            </p>

            <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#d2d2d7' }}>
              <li><strong>Zero Cloud Analytics</strong>: No telemetry daemons, Google Analytics, Sentry crash reporters, or heartbeat pings are compiled into any binary.</li>
              <li><strong>Offline Entitlement Verification</strong>: License validation uses local HMAC-SHA256 mathematical signature checking against the offline kernel driver; no server calls required.</li>
              <li><strong>Local Forensic SQLite Log</strong>: All threat block logs, PID alerts, and honeypot activations are stored exclusively in a private local SQLite file on your disk (<code style={{ color: '#ffffff', background: 'rgba(255, 255, 255, 0.06)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>%LOCALAPPDATA%\Rakshak\defense.db</code>).</li>
            </ul>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <Link href="/audit" className="btn-deepip-blue" style={{ padding: '0.65rem 1.65rem', fontSize: '0.88rem' }}>
                View Official SHA-256 Hashes →
              </Link>
              <Link href="/privacy" className="btn-deepip-dark" style={{ padding: '0.65rem 1.65rem', fontSize: '0.88rem' }}>
                Zero-Knowledge Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

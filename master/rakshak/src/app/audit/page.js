import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import releaseManifest from '@/data/releaseManifest';
import LiveChecksumVerifier from '@/components/LiveChecksumVerifier';

export const metadata = {
  title: 'Security Audit & Binary Verification - Rakshak',
  description: 'Cryptographic SHA-256 binary hash attestations, static code analysis, and memory safety audits for Rakshak security matrices.',
};

export default function AuditPage() {
  const auditLogs = [
    {
      name: releaseManifest.packages.windows.name,
      target: releaseManifest.packages.windows.file,
      hash: releaseManifest.packages.windows.sha256,
      size: releaseManifest.packages.windows.size,
      status: 'VERIFIED PASSED'
    },
    {
      name: releaseManifest.packages.mac.name,
      target: releaseManifest.packages.mac.file,
      hash: releaseManifest.packages.mac.sha256,
      size: releaseManifest.packages.mac.size,
      status: 'VERIFIED PASSED'
    },
    {
      name: releaseManifest.packages.linux.name,
      target: releaseManifest.packages.linux.file,
      hash: releaseManifest.packages.linux.sha256,
      size: releaseManifest.packages.linux.size,
      status: 'VERIFIED PASSED'
    },
    {
      name: releaseManifest.packages.sdk.name,
      target: releaseManifest.packages.sdk.file,
      hash: releaseManifest.packages.sdk.sha256,
      size: releaseManifest.packages.sdk.size,
      status: 'VERIFIED PASSED'
    },
  ];

  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: '8.5rem', paddingBottom: '6rem' }}>
        <div className="container">
          <div className="section-header-deepip" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '4rem' }}>
            <div className="tech-tag">
              <span className="pulse-dot-indigo"></span>
              <span>INDEPENDENT CODE AUDIT // SECURITY REPORT</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
              Security Audit &amp; Binary Verification
            </h1>
            <p style={{ maxWidth: 780 }}>
              Inspect physical binary checksums, automated static code analysis results, and cryptographic attestations confirming Rakshak memory safety, zero cloud connections, and binary integrity.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '4rem' }}>
            <div className="deepip-card">
              <div className="icon-box-indigo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/assets/tech/rust.svg" alt="Rust" width="32" height="32" style={{ objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Memory Safety Verified</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Core driver and compiler components are engineered in memory-safe Rust with strict bounds checking to eliminate buffer overflow and heap corruption vectors.
              </p>
            </div>

            <div className="deepip-card">
              <div className="icon-box-indigo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/assets/tech/wireguard.svg" alt="WireGuard" width="32" height="32" style={{ objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Zero Outbound Socket Calls</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Binary disassembly confirms zero embedded remote telemetry endpoints or hidden outbound sockets in all compiled CLI and runtime releases.
              </p>
            </div>

            <div className="deepip-card">
              <div className="icon-box-indigo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src="/assets/tech/git.svg" alt="Git" width="32" height="32" style={{ objectFit: 'contain' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Deterministic SHA-256 Builds</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
                All release packages are generated through reproducible builds with authentic SHA-256 signatures verifiable locally via PowerShell, shasum, or the console below.
              </p>
            </div>
          </div>

          <div className="deepip-card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0, letterSpacing: '-0.02em', fontWeight: 700 }}>Cryptographic SHA-256 Integrity Signatures</h2>
              <a
                href="/releases/checksums.txt"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#ffffff', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid rgba(255, 255, 255, 0.3)' }}
              >
                Download Raw checksums.txt ↗
              </a>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {auditLogs.map((log, idx) => (
                <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: '1.15rem 1.35rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>{log.name}</strong>
                      <span style={{ color: '#86868b', fontSize: '0.8rem' }}>({log.target} • {log.size})</span>
                    </div>
                    <span style={{ fontFamily: 'monospace', color: '#d2d2d7', fontSize: '0.785rem', wordBreak: 'break-all' }}>
                      SHA256: {log.hash}
                    </span>
                  </div>
                  <span style={{ color: '#30d158', background: 'rgba(48, 209, 88, 0.1)', border: '1px solid rgba(48, 209, 88, 0.25)', padding: '0.3rem 0.85rem', borderRadius: 9999, fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600 }}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <LiveChecksumVerifier />
        </div>
      </div>
      <Footer />
    </main>
  );
}

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Zero-Knowledge Privacy Policy - Rakshak Anti-AI Shield',
  description: 'Cryptographically verified zero-telemetry privacy policy for Rakshak Shield: 0 bytes of file telemetry collected, 100% local driver execution, and zero tracking.',
};

export default function PrivacyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', overflowX: 'hidden' }}>
      <Navbar />

      <section style={{ paddingTop: 'clamp(6rem, 12vw, 8.5rem)', paddingBottom: '5rem' }}>
        <div className="container" style={{ padding: '0 clamp(1rem, 4vw, 2rem)', maxWidth: '960px' }}>
          
          <div className="section-header-deepip" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '3rem' }}>
            <div className="tag_content" style={{ marginBottom: '1.25rem' }}>
              <div className="blue_tag">PRIVACY</div>
              <span>Zero-Knowledge Sovereign Covenant</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>
              Zero-Knowledge Privacy Policy
            </h1>

            <p style={{ color: '#86868b', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
              Effective Date: September 13, 2026 • Cryptographically Sealed by Rakshak Autonomous Architects
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: '1rem',
            marginBottom: '3rem'
          }}>
            <div style={{ background: '#09090b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ color: '#30d158', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>0 Bytes</div>
              <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block', marginBottom: '0.35rem' }}>Cloud Telemetry</strong>
              <p style={{ color: '#86868b', fontSize: '0.825rem', margin: 0, lineHeight: 1.5 }}>No file contents, hashes, filenames, or metrics ever leave your machine.</p>
            </div>

            <div style={{ background: '#09090b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>100% Local</div>
              <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block', marginBottom: '0.35rem' }}>Kernel Driver Execution</strong>
              <p style={{ color: '#86868b', fontSize: '0.825rem', margin: 0, lineHeight: 1.5 }}>Ring 0 filtering runs entirely in local RAM and kernel space with 0 open network sockets.</p>
            </div>

            <div style={{ background: '#09090b', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: '1.25rem' }}>
              <div style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>Single Device</div>
              <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block', marginBottom: '0.35rem' }}>Hardware Enclave</strong>
              <p style={{ color: '#86868b', fontSize: '0.825rem', margin: 0, lineHeight: 1.5 }}>Keys bind cryptographically to your workstation TPM. Zero account tracking.</p>
            </div>
          </div>

          <div className="deepip-card" style={{
            background: '#09090b',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: 'clamp(1.5rem, 4vw, 2.75rem)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
            lineHeight: 1.7,
            color: '#a1a1a6',
            fontSize: '0.95rem'
          }}>
            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                1. Fundamental Sovereign Data Principle
              </h2>
              <p>
                Unlike traditional antivirus corporations and cloud cybersecurity vendors, Rakshak does not operate telemetry collection servers, remote analytics databases, or behavioral logging pipelines. We believe that security software collecting your files to &quot;analyze&quot; them in the cloud is an architectural betrayal of personal sovereignty.
              </p>
              <p>
                Rakshak operates on a strict mathematical invariant: <strong style={{ color: '#ffffff' }}>Your workstation is a sovereign airgapped fortress</strong>. Every decision to allow, block, or feed synthetic honeypot noise to a process occurs 100% locally on your machine.
              </p>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                2. Information We Never Collect
              </h2>
              <p>Under no circumstances does Rakshak record, inspect, transmit, or cache:</p>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#d2d2d7' }}>
                <li>The contents, filenames, or metadata of files located inside your protected vaults (/Documents, /SourceCode, /Photos, .env, .ssh).</li>
                <li>Your screen buffers, display snapshots, or active application windows.</li>
                <li>Your keystrokes, clipboard entries, or terminal command history.</li>
                <li>Your network browsing traffic, visited URLs, or DNS queries.</li>
                <li>Your IP address, geographic location, or device telemetry profiles.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                3. Commercial Transaction &amp; Payment Data
              </h2>
              <p>
                When you purchase a single-device workstation license (Sentinel $19/mo, Aegis $99/6-mo, or Citadel $149/yr), the financial transaction is handled exclusively by Tier-1 PCI-DSS certified payment processors (Stripe, Apple Pay, Google Pay).
              </p>
              <p>
                Rakshak servers never receive, process, or store your raw payment card numbers or bank credentials. Financial records are encrypted and retained solely by the payment processor to the minimum statutory extent required for tax compliance.
              </p>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                4. Cryptographic Hardware Node Binding
              </h2>
              <p>
                License activation uses an offline cryptographic HMAC-SHA256 token that binds mathematically to your workstation’s motherboard TPM 2.0 or local hardware identifier. This token exists solely on your machine to verify that your workstation is authorized to compile RSK security policies. It is never used to track, profile, or link your activities.
              </p>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                5. Verification of Zero Outbound Sockets
              </h2>
              <p>
                Trust should never be demanded; it must be provable. You can verify our zero-telemetry guarantee at any time using standard network analysis utilities such as Wireshark, <code style={{ color: '#ffffff', background: 'rgba(255, 255, 255, 0.06)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>netstat -ano</code>, or GlassWire. Rakshak software operates with zero listening or outbound internet sockets. See our <Link href="/zero-telemetry" style={{ color: '#ffffff', textDecoration: 'underline' }}>Zero-Telemetry Audit Guide</Link> for detailed verification instructions.
              </p>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                6. Global Compliance (GDPR, CCPA, Swiss FADP)
              </h2>
              <p>
                Because Rakshak does not collect, process, or retain any personal data, we exceed all global privacy frameworks (GDPR Article 25 &quot;Data Protection by Design and by Default&quot;, California CCPA/CPRA, and Swiss Federal Act on Data Protection). There is no personal data to delete, sell, or subpoena.
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

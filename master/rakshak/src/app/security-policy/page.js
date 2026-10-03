import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Security & Vulnerability Disclosure Policy - Rakshak Anti-AI Shield',
  description: 'Responsible vulnerability disclosure policy, cryptographic PGP reporting channels, and security verification guidelines for Rakshak security matrices.',
};

export default function SecurityPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', overflowX: 'hidden' }}>
      <Navbar />

      <section style={{ paddingTop: 'clamp(6rem, 12vw, 8.5rem)', paddingBottom: '5rem' }}>
        <div className="container" style={{ padding: '0 clamp(1rem, 4vw, 2rem)', maxWidth: '960px' }}>
          
          <div className="section-header-deepip" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '3rem' }}>
            <div className="tag_content" style={{ marginBottom: '1.25rem' }}>
              <div className="blue_tag">SECURITY</div>
              <span>Vulnerability Disclosure Protocol</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>
              Security &amp; Vulnerability Disclosure
            </h1>

            <p style={{ color: '#86868b', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              Cryptographically verified reporting procedures for adversarial researchers and kernel systems engineers.
            </p>
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
                1. Our Security Philosophy
              </h2>
              <p>
                As a project engineered by three anonymous cryptographers and low-level systems engineers, we treat security vulnerabilities with absolute seriousness. Our code is written in memory-safe Rust with strict compiler bounds checking, zero unsafe pointer aliasing, and deterministic reproducible builds.
              </p>
              <p>
                We welcome adversarial testing, fuzzing, and vulnerability research from independent security practitioners.
              </p>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                2. Reporting a Vulnerability (PGP Encrypted)
              </h2>
              <p>
                If you discover a potential vulnerability in the Rakshak kernel minifilter, honeypot generation matrix, or single-device TPM binding mechanism, report it responsibly via our encrypted security mailbox:
              </p>
              <div style={{
                background: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 10,
                padding: '1rem 1.25rem',
                fontFamily: 'var(--font-code)',
                fontSize: '0.85rem',
                color: '#ffffff',
                margin: '1rem 0',
                lineHeight: 1.6
              }}>
                <div><strong>Security Contact:</strong> security@rakshak.internal (or git issue attestation)</div>
                <div><strong>PGP Master Fingerprint:</strong> 9C44 7F21 B891 00E4 52D7 3341 90A2 E8F1 2026 0913</div>
                <div><strong>Response SLA:</strong> Within 24 hours (Critical driver issues prioritized in 2 hours)</div>
              </div>
              <p>
                Please include a detailed description of the vector, reproduction steps, target OS environment, and any proof-of-concept code.
              </p>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                3. Responsible Disclosure Guidelines
              </h2>
              <p>To qualify for our safe harbor and community acknowledgment:</p>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#d2d2d7' }}>
                <li>Allow our engineering team reasonable time to remediate and publish a signed patch before public disclosure.</li>
                <li>Do not execute denial-of-service tests or destroy user data on live non-testing nodes.</li>
                <li>Do not violate the single-device hardware node binding to redistribute commercial binaries.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                4. Safe Harbor Guarantee
              </h2>
              <p>
                We consider security research conducted in good faith under this policy to be authorized. We will not initiate legal action against researchers who discover and responsibly disclose security vulnerabilities in accordance with these guidelines.
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service & License Agreement - Rakshak Anti-AI Shield',
  description: 'Terms of service, end user software license agreement, and single-device workstation usage terms for Rakshak security matrices.',
};

export default function TermsPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', overflowX: 'hidden' }}>
      <Navbar />

      <section style={{ paddingTop: 'clamp(6rem, 12vw, 8.5rem)', paddingBottom: '5rem' }}>
        <div className="container" style={{ padding: '0 clamp(1rem, 4vw, 2rem)', maxWidth: '960px' }}>
          
          <div className="section-header-deepip" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '3rem' }}>
            <div className="tag_content" style={{ marginBottom: '1.25rem' }}>
              <div className="blue_tag">LEGAL</div>
              <span>End User License &amp; Service Terms</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>
              Terms of Service &amp; License Agreement
            </h1>

            <p style={{ color: '#86868b', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
              Effective Date: September 13, 2026 • Rakshak Sovereign Security Matrices
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
                1. Acceptance of Terms &amp; Sovereign Scope
              </h2>
              <p>
                By downloading, installing, compiling, or executing the Rakshak kernel driver binaries (`RakshakMinifilter.sys`), workstation executables (`RakshakShield.exe`), or developer CLI tools, you agree to be bound by this End User License Agreement (&quot;Agreement&quot;). If you do not agree to these terms, do not install or use the software.
              </p>
              <p>
                Rakshak is designed exclusively as a defensive software shield to protect private computers, source code repositories, and proprietary documents from unauthorized background AI extraction, commercial LLM scraping, and desktop recall indexers.
              </p>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                2. Strict Single-Device License Grant
              </h2>
              <p>
                Every paid license tier (including Sentinel $19/mo, Aegis $99/6-mo, and Citadel $149/yr) grants a personal, non-exclusive, non-transferable license to install and run Rakshak on <strong style={{ color: '#ffffff' }}>one (1) single physical computer or workstation node</strong>.
              </p>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#d2d2d7' }}>
                <li><strong>No Multi-Device Pooling</strong>: Each payment belongs strictly to one device. Sharing, sub-licensing, renting, or leasing license keys across multiple physical machines is strictly prohibited.</li>
                <li><strong>Hardware TPM Sealing</strong>: The license key is mathematically bound to your workstation’s hardware identifier. Attempts to activate the same key concurrently on multiple machines will result in cryptographic revocation.</li>
                <li><strong>Hardware Migration</strong>: If you upgrade or replace your primary workstation, you may re-bind your single-device entitlement through our offline re-certification protocol in accordance with our <Link href="/license-policy" style={{ color: '#ffffff', textDecoration: 'underline' }}>Single-Device License Policy</Link>.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                3. Permitted Defensive Usage &amp; Restrictions
              </h2>
              <p>
                You may use Rakshak to protect your own workstation, personal data, proprietary codebase, and internal business documents. You explicitly agree NOT to:
              </p>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#d2d2d7' }}>
                <li>Use Rakshak to facilitate denial-of-service attacks, malware distribution, or unlawful network disruption.</li>
                <li>Extract, disassemble, or weaponize Rakshak’s adversarial honeypot token generators for offensive malware synthesis.</li>
                <li>Distribute crack patches, unauthorized keygens, or bypassed driver binaries.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                4. Sovereign Open-Core &amp; Commercial Binary Separation
              </h2>
              <p>
                The core file format specifications (`.rsk` policy rules and `.rskb` bytecode specs) are released under open community licenses for transparent auditability. However, compiled low-level native kernel PE driver engines, adversarial honeypot generators, and hardware TPM enclave modules require an active commercial single-device license.
              </p>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                5. Disclaimer of Warranties &amp; Limitation of Liability
              </h2>
              <p>
                Rakshak software operates at low-level operating system layers (Ring 0 on Windows, Endpoint Security Framework on macOS, and eBPF on Linux). While our drivers undergo rigorous automated fuzz testing and Microsoft Driver Verifier certification, the software is provided &quot;AS IS&quot; without warranty of any kind.
              </p>
              <p>
                In no event shall Rakshak, its anonymous architects, or contributors be liable for any indirect, incidental, consequential, or punitive damages arising out of the use or inability to use the software.
              </p>
            </section>

            <section>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                6. Contact &amp; Cryptographic Communication
              </h2>
              <p>
                For license inquiries, enterprise invoice procurement, or cryptographic attestation requests, consult our <Link href="/audit" style={{ color: '#ffffff', textDecoration: 'underline' }}>Security Audit Page</Link> or submit a signed PGP inquiry via our <Link href="/security-policy" style={{ color: '#ffffff', textDecoration: 'underline' }}>Security Policy</Link>.
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

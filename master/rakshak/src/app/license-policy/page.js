import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Single-Device License Policy - Rakshak Anti-AI Shield',
  description: 'Strict single-device hardware-bound node licensing policy: Each payment entitles one and only one physical computer installation. Zero multi-device sharing or multi-keys.',
};

export default function LicensePolicyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', overflowX: 'hidden' }}>
      <Navbar />

      <section style={{ paddingTop: 'clamp(6rem, 12vw, 8.5rem)', paddingBottom: '5rem' }}>
        <div className="container" style={{ padding: '0 clamp(1rem, 4vw, 2rem)', maxWidth: '960px' }}>
          
          <div className="section-header-deepip" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '3rem' }}>
            <div className="tag_content" style={{ marginBottom: '1.25rem' }}>
              <div className="blue_tag">POLICY</div>
              <span>Hardware-Bound Node Integrity</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>
              Single-Device License Policy
            </h1>

            <p style={{ color: '#86868b', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              Each payment belongs to one and only one physical device installation. Zero multi-device keys, zero seat pooling.
            </p>
          </div>

          <div className="deepip-card" style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: 18,
            padding: 'clamp(1.5rem, 4vw, 2.25rem)',
            marginBottom: '3rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', color: '#ffffff', fontSize: '0.825rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <span>🔒</span>
              <span>THE SOVEREIGN SINGLE-DEVICE INVARIANT</span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.85rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              1 Payment = 1 Physical Machine Installation
            </h2>
            <p style={{ color: '#d2d2d7', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              Regardless of the tier purchased—whether Sentinel ($19/mo), Aegis ($99/6-mo), or Citadel ($149/yr)—a license grants activation for <strong style={{ color: '#ffffff' }}>exactly one (1) physical workstation node</strong>. Even on the highest annual tier, there are NO multi-device keys, NO family sharing pools, and NO multi-machine redistributions.
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
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                1. Why Single-Device Licensing?
              </h3>
              <p>
                True cryptographic defense requires airgapped local hardware integrity. If license keys could be duplicated across multiple computers, centralized cloud DRM servers would be required to constantly poll and verify concurrent connections.
              </p>
              <p>
                By strictly enforcing <strong style={{ color: '#ffffff' }}>one device per payment</strong>, Rakshak binds directly to your machine’s physical Hardware TPM 2.0 or secure enclave. This eliminates the need for any cloud licensing heartbeat, preserving our 100% airgapped zero-telemetry guarantee.
              </p>
            </section>

            <section>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                2. Hardware TPM &amp; Enclave Cryptographic Binding
              </h3>
              <p>
                Upon activation, Rakshak creates a local cryptographic seal combining:
              </p>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#d2d2d7' }}>
                <li>Your CPU processor serial and motherboard hardware security fingerprint.</li>
                <li>Your local TPM 2.0 (Trusted Platform Module) or Apple Silicon Secure Enclave public attestation key.</li>
                <li>The server-signed HMAC-SHA256 license token provided upon purchase.</li>
              </ul>
              <p>
                This seal is computed entirely locally and verified by the kernel driver (`RakshakMinifilter.sys`). If the token is copied to another machine, the hardware hashes will not match and the driver will refuse execution.
              </p>
            </section>

            <section>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                3. What Happens If You Upgrade Your Hardware?
              </h3>
              <p>
                We understand that developers, cryptographers, and engineers regularly upgrade workstation motherboards, CPUs, or primary laptops. We provide a straightforward, offline migration protocol:
              </p>
              <ul style={{ paddingLeft: '1.25rem', margin: '0.75rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#d2d2d7' }}>
                <li><strong>Deactivate Old Node</strong>: Run <code style={{ color: '#ffffff', background: 'rgba(255, 255, 255, 0.06)', padding: '0.15rem 0.4rem', borderRadius: 4 }}>rakshak unbind</code> in your terminal on the old machine to generate a cryptographic release certificate.</li>
                <li><strong>Re-Bind on New Node</strong>: Enter your license key and release certificate into the new machine to bind the token to the new hardware TPM.</li>
                <li><strong>Assisted Migration</strong>: If the old machine suffered a catastrophic hardware failure, our security engineers can issue a one-time cryptographic re-seal upon verification of original transaction credentials.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                4. Need Protection for Multiple Machines?
              </h3>
              <p>
                If you have multiple workstations—for example, a primary coding laptop and a dedicated home lab workstation—each physical machine requires its own independent license.
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <Link href="/pricing" className="btn-deepip-blue" style={{ padding: '0.65rem 1.65rem', fontSize: '0.88rem' }}>
                  View All Single-Device Plans →
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

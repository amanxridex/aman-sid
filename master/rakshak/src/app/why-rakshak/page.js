import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Why Rakshak (Not An Antivirus) - Sovereign Protection Against Global AI Attacks',
  description: 'Why Rakshak is not an antivirus company: An independent sovereign project built by three anonymous engineers to safeguard user data from global AI attacks, commercial LLM scraping, and OS recall indexers.',
};

export default function WhyRakshakPage() {
  const comparisonItems = [
    {
      feature: 'Primary Defense Objective',
      traditionalAV: 'Searches for 1990s-era virus signatures, known trojans, and file malware hashes.',
      rakshak: 'Stops global AI models, background scrapers, desktop recall indexers, and non-consensual LLM dataset harvesting.',
      highlight: true
    },
    {
      feature: 'Commercial AI Stance',
      traditionalAV: 'Whitelists big-tech AI daemons (Copilot, Recall, Apple Intelligence) because they are signed executables.',
      rakshak: 'Default-deny Ring 0 minifilter stops any background process from reading files to build training sets or embeddings.',
      highlight: true
    },
    {
      feature: 'User Data Telemetry',
      traditionalAV: 'Uploads gigabytes of file hashes and browsing telemetry to corporate clouds (often sold to third parties).',
      rakshak: '0 Bytes cloud telemetry. 100% airgapped local execution verified by Wireshark and socket auditing.',
      highlight: true
    },
    {
      feature: 'Active Countermeasures',
      traditionalAV: 'Passive reactive quarantine only after a malicious file has already executed on disk.',
      rakshak: 'Adversarial tensor honeypots inject mathematical token noise to actively poison the weights of rogue scrapers.',
      highlight: false
    },
    {
      feature: 'Screen & OCR Protection',
      traditionalAV: 'Zero protection against OS-level screen capture, OCR indexers, or transient framebuffer scraping.',
      rakshak: 'GPU framebuffer and virtual display hooks return transparent buffers when OCR engines query active windows.',
      highlight: false
    },
    {
      feature: 'Governance & Ownership',
      traditionalAV: 'Corporate boards, public stockholders, VC pressures, and compliance with data broker partnerships.',
      rakshak: 'Sole sovereign project engineered by three anonymous cryptographers with zero corporate leverage points.',
      highlight: true
    },
    {
      feature: 'Licensing Integrity',
      traditionalAV: 'Bloated multi-device family bundles, auto-renew dark patterns, and account telemetry tracking.',
      rakshak: 'Strict single-device hardware TPM node binding. Each payment belongs strictly to 1 hardened workstation.',
      highlight: false
    }
  ];

  const pillars = [
    {
      tag: 'ARCHITECTURE',
      title: 'We Are NOT An Antivirus Company',
      desc: 'Antivirus companies were built for a threat model that ended twenty years ago. Today, the most dangerous threat to your intellectual property is not a virus—it is autonomous AI scrapers, desktop recall utilities, and commercial AI cartels harvesting your source code, private documents, and photos to train multi-billion-dollar models without your consent or compensation. Antiviruses ignore these threats because big-tech companies sign the executables.'
    },
    {
      tag: 'SOVEREIGNTY',
      title: 'Built by Three Anonymous Engineers',
      desc: 'Rakshak is an independent, sovereign project engineered from the ground up by three veteran low-level systems architects and cryptographers. We maintain complete cryptographic anonymity by design: no corporate board, no venture capital shareholders, no government backdoors, and no institutional leverage points. We cannot be subpoenaed, acquired, or coerced into whitelisting predatory AI indexers.'
    },
    {
      tag: 'IMMUNITY',
      title: 'Safeguarding Against Global AI Exploitation',
      desc: 'Our mission is absolute mathematical defense against global AI extraction. Operating beneath user space at the kernel driver layer, Rakshak isolates your folders (/Documents, /SourceCode, /Photos) and dynamically feeds mathematical adversarial noise to unauthorized scrapers. If a rogue AI model steals data from a Rakshak-protected machine, the stolen data is poison that degrades the model’s latent embeddings.'
    }
  ];

  return (
    <main style={{ minHeight: '100vh', background: '#000000', color: '#ffffff', overflowX: 'hidden' }}>
      <Navbar />

      <section style={{ paddingTop: 'clamp(6rem, 12vw, 8.5rem)', paddingBottom: '3.5rem', background: 'radial-gradient(ellipse 75% 45% at 50% 0%, rgba(0, 113, 227, 0.14) 0%, transparent 65%)' }}>
        <div className="container" style={{ padding: '0 clamp(1rem, 4vw, 2rem)' }}>
          <div className="section-header-deepip" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '3rem' }}>
            <div className="tag_content" style={{ marginBottom: '1.25rem' }}>
              <div className="blue_tag">MANIFESTO</div>
              <span>Sovereign Counter-AI Defense</span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 5.5vw, 3.8rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.25rem' }}>
              Why We Are Better Than Antivirus Companies <br />
              <span className="text-color-blue">(And Why We Are NOT An Antivirus Company)</span>
            </h1>

            <p style={{ maxWidth: 840, fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#86868b', lineHeight: 1.7, margin: '0 0 2rem' }}>
              Antivirus companies search for 30-year-old malware while happily permitting commercial AI giants to ingest your personal files. Rakshak is an independent sovereign shield built by three anonymous engineers to protect your data from global AI attacks.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <Link 
                href="/download" 
                className="btn-deepip-blue"
                style={{ padding: '0.75rem 1.85rem', fontSize: '0.95rem' }}
              >
                Deploy Rakshak Shield →
              </Link>
              <Link 
                href="/pricing" 
                className="btn-deepip-dark"
                style={{ padding: '0.75rem 1.85rem', fontSize: '0.95rem' }}
              >
                View Single-Device Plans
              </Link>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: '1.5rem',
            marginBottom: '4.5rem'
          }}>
            {pillars.map((p, idx) => (
              <div 
                key={idx} 
                className="deepip-card" 
                style={{ 
                  padding: 'clamp(1.5rem, 4vw, 2.25rem)',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#09090b',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.2rem 0.65rem',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 9999,
                  color: '#a1a1a6',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  marginBottom: '1rem',
                  width: 'fit-content'
                }}>
                  {p.tag}
                </div>
                <h3 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.45rem)', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.85rem' }}>
                  {p.title}
                </h3>
                <p style={{ color: '#86868b', fontSize: '0.925rem', lineHeight: 1.7, margin: 0 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '5rem' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <div className="tag_content" style={{ marginBottom: '0.75rem' }}>
                <div className="blue_tag">COMPARISON</div>
                <span>Architecture Breakdown</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.65rem, 4vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '0.5rem' }}>
                Traditional Antivirus vs. Rakshak Sovereign Shield
              </h2>
              <p style={{ color: '#86868b', fontSize: '1rem', maxWidth: 700 }}>
                A clear, technical breakdown of why conventional antivirus software fails to protect against autonomous AI scraping and big-tech data extraction.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {comparisonItems.map((item, idx) => (
                <div 
                  key={idx}
                  className="deepip-card"
                  style={{
                    padding: 'clamp(1.25rem, 3vw, 1.75rem)',
                    background: '#09090b',
                    border: item.highlight ? '1px solid rgba(255, 255, 255, 0.16)' : '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', color: '#a1a1a6', fontFamily: 'var(--font-code)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.85rem' }}>
                    VECTOR {idx + 1}: {item.feature}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                    gap: '1.25rem',
                    alignItems: 'stretch'
                  }}>
                    <div style={{
                      background: 'rgba(255, 69, 58, 0.04)',
                      border: '1px solid rgba(255, 69, 58, 0.2)',
                      borderRadius: 12,
                      padding: '1.25rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#ff453a', fontSize: '0.825rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                        <span>✕</span>
                        <span>TRADITIONAL ANTIVIRUS</span>
                      </div>
                      <p style={{ color: '#a1a1a6', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                        {item.traditionalAV}
                      </p>
                    </div>

                    <div style={{
                      background: 'rgba(48, 209, 88, 0.04)',
                      border: '1px solid rgba(48, 209, 88, 0.25)',
                      borderRadius: 12,
                      padding: '1.25rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#30d158', fontSize: '0.825rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                        <span>✓</span>
                        <span>RAKSHAK SOVEREIGN SHIELD</span>
                      </div>
                      <p style={{ color: '#f5f5f7', fontSize: '0.88rem', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                        {item.rakshak}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="deepip-card" style={{
            padding: 'clamp(1.75rem, 5vw, 3rem)',
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0, 113, 227, 0.12) 0%, transparent 70%), #09090b',
            border: '1px solid rgba(41, 151, 255, 0.25)',
            borderRadius: 20,
            textAlign: 'center',
            marginBottom: '4rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: 9999,
              padding: '0.3rem 0.85rem',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1.25rem'
            }}>
              <span>🔒</span>
              <span>STRICT SINGLE-DEVICE LICENSING</span>
            </div>

            <h3 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              One Payment = <span className="text-color-blue">One Hardened Workstation.</span> Period.
            </h3>

            <p style={{ color: '#86868b', fontSize: '1rem', lineHeight: 1.7, maxWidth: 700, margin: '0 auto 2rem' }}>
              We do not sell bloated multi-device family packs or multi-key seat pools. Whether you choose Sentinel ($19/mo), Aegis ($99/6-mo), or Citadel ($149/yr), each payment cryptographically seals directly to one physical workstation’s hardware TPM security module. Absolute defense, zero key redistribution.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/pricing" className="btn-deepip-blue">
                Explore Protection Plans
              </Link>
              <Link href="/license-policy" className="btn-deepip-dark">
                Read Single-Device Policy →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

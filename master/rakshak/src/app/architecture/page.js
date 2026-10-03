import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShadowShieldText from '@/components/ShadowShieldText';

export const metadata = {
  title: 'Kernel Security Architecture - Rakshak Local Anti-AI Shield',
  description: 'Technical overview of Rakshak ring 0 driver hooks, zero-trust I/O virtualization, and honeypot dataset poisoning engine.',
};

export default function ArchitecturePage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: '8.5rem', paddingBottom: '6rem' }}>
        <div className="container">

        <div className="section-header-deepip" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '4rem' }}>
          <div className="tech-tag">
            <span className="pulse-dot-indigo"></span>
            <span>RING 0 DRIVER SPECIFICATION // ARCHITECTURE</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Kernel Security Architecture
          </h1>
          <p style={{ maxWidth: 780 }}>
            Discover how Rakshak hooks directly into OS file system minifilters and eBPF probes to intercept unauthorized AI indexers before user space processes read a single byte.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div className="deepip-card">
            <div className="icon-box-indigo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/tech/kernel.svg" alt="Kernel" width="32" height="32" style={{ objectFit: 'contain' }} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: 700 }}>Ring 0 Minifilter Driver</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.65, fontSize: '0.95rem' }}>
              <ShadowShieldText>
                Operates beneath conventional antivirus software. Monitors system I/O requests (`IRP_MJ_CREATE`, `IRP_MJ_READ`) and evaluates caller process entropy in real-time.
              </ShadowShieldText>
            </p>
          </div>

          <div className="deepip-card">
            <div className="icon-box-indigo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/tech/linuxfoundation.svg" alt="Linux Foundation" width="32" height="32" style={{ objectFit: 'contain' }} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: 700 }}>Zero-Trust Process Isolation</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.65, fontSize: '0.95rem' }}>
              <ShadowShieldText>
                Enforces explicit cryptographically signed authorization tokens for IDEs and text editors. Any unauthorized executable seeking batch directory access is automatically quarantined.
              </ShadowShieldText>
            </p>
          </div>

          <div className="deepip-card">
            <div className="icon-box-indigo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/tech/wireshark.svg" alt="Wireshark" width="32" height="32" style={{ objectFit: 'contain' }} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontWeight: 700 }}>Adversarial Tensor Honeypot</h3>
            <p style={{ color: '#94a3b8', lineHeight: 1.65, fontSize: '0.95rem' }}>
              <ShadowShieldText>
                Dynamically streams mathematical adversarial noise to rogue scrapers, poisoning their local vector database embeddings without giving away real user files.
              </ShadowShieldText>
            </p>
          </div>
        </div>

        <div className="deepip-card" style={{ padding: '2.5rem', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '1.25rem' }}>System Architecture Workflow</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', margin: '2rem 0' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: '1.35rem' }}>
              <div style={{ fontFamily: 'monospace', color: '#a1a1a6', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '0.65rem' }}>STEP 01</div>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>I/O Intercept</strong>
              <p style={{ color: '#86868b', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>Process attempts to open file in protected vault.</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: '1.35rem' }}>
              <div style={{ fontFamily: 'monospace', color: '#a1a1a6', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '0.65rem' }}>STEP 02</div>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>PID Analysis</strong>
              <p style={{ color: '#86868b', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>Kernel driver verifies process signature and execution frequency.</p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: '1.35rem' }}>
              <div style={{ fontFamily: 'monospace', color: '#ffffff', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '0.65rem' }}>STEP 03</div>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>Action Decision</strong>
              <p style={{ color: '#86868b', fontSize: '0.875rem', margin: 0, lineHeight: 1.6 }}>ALLOW, BLOCK, or SERVE HONEYPOT DATA to caller process.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </main>
);
}

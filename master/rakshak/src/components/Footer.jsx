'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import rakshakLogo from '../../public/rakshaklogo.png';

export default function Footer() {
  const [revealed, setRevealed] = useState(false);
  const watermarkRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
        }
      },
      { threshold: 0.05 }
    );

    if (watermarkRef.current) {
      observer.observe(watermarkRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <footer className="footer-deepip">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          <div>
            <Link href="/" className="brand-independent" style={{ marginBottom: '1.25rem', display: 'inline-flex' }}>
              <Image 
                src={rakshakLogo} 
                alt="Rakshak Logo" 
                width={36} 
                height={36} 
                className="brand-independent-logo" 
              />
              <span className="brand-independent-text">Rakshak</span>
            </Link>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem', maxWidth: 280, lineHeight: 1.6 }}>
              Zero-Trust Local Anti-AI Shield Software &amp; Universal Developer SDK. Defending web applications, APIs, and proprietary intellectual property worldwide.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '1.25rem', fontWeight: 600 }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><Link href="/why-rakshak" style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>Why Rakshak (vs Antivirus) ↗</Link></li>
              <li><Link href="/developers" style={{ color: '#ffffff', fontWeight: 500, fontSize: '0.9rem' }}>Developers Portal</Link></li>
              <li><Link href="/grants" style={{ color: '#38bdf8', fontWeight: 500, fontSize: '0.9rem' }}>Grants &amp; Registry Portal 🎓</Link></li>
              <li><Link href="/radar" style={{ color: '#ffffff', fontSize: '0.9rem', fontWeight: 500 }}>Live Radar (Observatory)</Link></li>
              <li><Link href="/status" style={{ color: '#30d158', fontSize: '0.9rem', fontWeight: 500 }}>System Status (99.99%)</Link></li>
              <li><Link href="/features" style={{ color: '#86868b', fontSize: '0.9rem' }}>Features</Link></li>
              <li><Link href="/pricing" style={{ color: '#86868b', fontSize: '0.9rem' }}>Pricing (Single-Device)</Link></li>
              <li><Link href="/founders" style={{ color: '#86868b', fontSize: '0.9rem' }}>Founders (Anonymous)</Link></li>
              <li><Link href="/download" style={{ color: '#86868b', fontSize: '0.9rem' }}>Downloads</Link></li>
              <li><Link href="/audit" style={{ color: '#86868b', fontSize: '0.9rem' }}>Security Audit &amp; Checksums</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '1.25rem', fontWeight: 600 }}>Resources</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link 
                  href="/developers" 
                  style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem', transition: 'color 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }} 
                  className="footer-hover-link"
                >
                  <span style={{ fontSize: '1rem' }}>⚡</span> Developer Portal &amp; Sidebar
                </Link>
              </li>
              <li><a href="/docs/RAKSHAK_RESEARCH_WHITEPAPER.pdf" download="RAKSHAK_RESEARCH_WHITEPAPER.pdf" style={{ color: '#60a5fa', fontWeight: 500, fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">📄 Research Whitepaper (PDF) ↓</a></li>
              <li><a href="/docs/RAKSHAK_RESEARCH_WHITEPAPER.doc" download="RAKSHAK_RESEARCH_WHITEPAPER.doc" style={{ color: '#93c5fd', fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">📝 Research Whitepaper (DOC) ↓</a></li>
              <li><Link href="/why-rakshak" style={{ color: '#86868b', fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">Why We Are NOT An Antivirus</Link></li>
              <li><Link href="/faq" style={{ color: '#86868b', fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">FAQ</Link></li>
              <li><Link href="/docs" style={{ color: '#86868b', fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">Documentation</Link></li>
              <li><Link href="/architecture" style={{ color: '#86868b', fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">Kernel Security Architecture</Link></li>
              <li><a href="https://github.com/amanxridex/rakshak" target="_blank" rel="noopener noreferrer" style={{ color: '#86868b', fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">GitHub Core ↗</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', color: '#fff', marginBottom: '1.25rem', fontWeight: 600 }}>Legal &amp; Sovereign Policies</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li><Link href="/privacy" style={{ color: '#ffffff', fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">Zero-Knowledge Privacy Policy</Link></li>
              <li><Link href="/terms" style={{ color: '#86868b', fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">Terms of Service &amp; License</Link></li>
              <li><Link href="/license-policy" style={{ color: '#86868b', fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">Single-Device License Policy</Link></li>
              <li><Link href="/zero-telemetry" style={{ color: '#86868b', fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">Zero-Telemetry Verification Audit</Link></li>
              <li><Link href="/security-policy" style={{ color: '#86868b', fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">Vulnerability Disclosure (PGP)</Link></li>
              <li><Link href="/audit" style={{ color: '#86868b', fontSize: '0.9rem', transition: 'color 0.2s ease' }} className="footer-hover-link">Binary SHA-256 Attestation</Link></li>
            </ul>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '2rem', fontSize: '0.85rem', color: '#64748b' }}>
          <p>&copy; 2026 Rakshak Security Systems. All Rights Reserved. Domain: rakshakus.vercel.app</p>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
              <img src="/assets/tech/github.svg" alt="GitHub" width="18" height="18" style={{ objectFit: 'contain' }} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
              <img src="/assets/tech/x.svg" alt="X" width="16" height="16" style={{ objectFit: 'contain' }} />
            </a>
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" aria-label="Discord" style={{ color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
              <img src="/assets/tech/discord.svg" alt="Discord" width="18" height="18" style={{ objectFit: 'contain' }} />
            </a>
          </div>
        </div>
      </div>

      <div 
        ref={watermarkRef}
        className={`footer-giant-watermark-wrap ${revealed ? 'apple-revealed' : ''}`}
      >
        <div className="footer-giant-watermark-inner">
          <span 
            className="footer-giant-watermark-text"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            title="Rakshak — Return to Top"
          >
            Rakshak
          </span>
        </div>
        <div className="footer-apple-reflection-line"></div>
      </div>
    </footer>
  );
}

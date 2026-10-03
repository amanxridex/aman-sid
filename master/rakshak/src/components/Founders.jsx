'use client';
import React from 'react';
import Link from 'next/link';

export default function Founders() {
  const founders = [
    {
      id: '01',
      name: 'Unknown 1',
      tag: 'Ring-0 Kernel Engine',
      role: 'Lead Kernel & Systems Architect',
      quote: 'If security does not begin at the kernel boundary, it is merely a polite suggestion.',
      focus: [
        'Windows NT Minifilter Driver Hooks (IRP_MJ_CREATE)',
        'Ring-0 Low-Overhead Memory Quarantine & Isolation',
        'OS Recall & Telemetry Snapshot Nullification',
        'Direct Kernel Process Entropy Scoring'
      ],
      key: '0x7F21 · RING-0 KERNEL'
    },
    {
      id: '02',
      name: 'Unknown 2',
      tag: 'Tensor Countermeasures',
      role: 'Adversarial AI Defense & Neural Lead',
      quote: 'When unauthorized background crawlers harvest local memory, they must ingest mathematical entropy.',
      focus: [
        'Synthetic Vector Honeypot Dataset Generation',
        'Frontier Model Inversion Disruption & Noise',
        'Autonomous AI Webhook Traps & Tokenizer Nullification',
        'Anti-Scraper Telemetry Scrambling'
      ],
      key: '0x3B88 · NEURAL DEFENSE'
    },
    {
      id: '03',
      name: 'Unknown 3',
      tag: 'Zero-Knowledge Vault',
      role: 'Zero-Trust Cryptography Specialist',
      quote: 'Trust is an architectural vulnerability. Sovereign zero trust is the only mathematical guarantee.',
      focus: [
        'ChaCha20-Poly1305 Ephemeral Local Enclave Vaults',
        'Zero-Knowledge Process Authorization Attestation',
        'Air-Gapped Key Encapsulation & Hardware HSM Hooks',
        'Multi-Signature Threshold Release Consensus'
      ],
      key: '0x9C44 · ZERO KNOWLEDGE'
    }
  ];

  return (
    <section id="founders" className="container" style={{ padding: '6rem 1.25rem 6rem' }}>
      <div className="section-header-deepip">
        <div className="tag_content">
          <div className="blue_tag">LEADERSHIP</div>
          <span>Anonymous Sovereign Architects</span>
        </div>
        <h2>
          Founded by Three. <span className="text-color-blue">Identities Undisclosed.</span>
        </h2>
        <p>
          Engineered by three veteran low-level systems architects, cryptographers, and adversarial AI researchers. 
          To protect user sovereignty and eliminate personal targeting, our founders maintain complete cryptographic anonymity.
        </p>
      </div>

      <div className="deepip-card" style={{ marginBottom: '2.5rem', padding: '2.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.14)', borderRadius: 6, color: '#f5f5f7', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ffffff' }}></span>
              Zero-Knowledge Identity Protocol
            </div>
            <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
              Why No Disclosure of Who is Behind It?
            </h3>
            <p style={{ color: '#86868b', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              True digital defense requires uncompromised neutrality. Public founder personas create leverage points for institutional pressure, targeted subpoenas, and corporate acquisition. Rakshak’s defense is proven mathematically in deterministic open-source code and 3-of-3 multi-signature cryptographic consensus—not executive marketing.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
        {founders.map((f, idx) => (
          <div 
            key={idx}
            className="deepip-card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              padding: '2rem 1.75rem'
            }}
          >
            <div>
              <div 
                style={{ 
                  width: 64, 
                  height: 64, 
                  borderRadius: 16, 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: '1.5rem'
                }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
                </svg>
              </div>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.2rem 0.65rem', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 6, color: '#f5f5f7', fontSize: '0.725rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.75rem', letterSpacing: '0.04em' }}>
                {f.tag}
              </div>

              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
                {f.name}
              </h3>

              <div style={{ color: '#86868b', fontSize: '0.875rem', fontWeight: 500, marginBottom: '1.25rem', minHeight: 40 }}>
                {f.role}
              </div>

              <p style={{ color: '#d2d2d7', fontSize: '0.875rem', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1.5rem', borderLeft: '2px solid rgba(255, 255, 255, 0.25)', paddingLeft: '0.75rem' }}>
                &ldquo;{f.quote}&rdquo;
              </p>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
                {f.focus.map((item, i) => (
                  <li key={i} style={{ color: '#d2d2d7', fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.65rem', lineHeight: 1.5 }}>
                    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                      <circle cx="10" cy="10" r="9" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2"/>
                      <path d="M6 10l3 3 5-5" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace' }}>
              <span>PGP KEY:</span>
              <span style={{ color: '#94a3b8' }}>{f.key}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', paddingTop: '1rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#30d158' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#30d158' }}></span>
            All Commits Cryptographically Signed
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>•</span>
          <span>Deterministic Reproducible Builds</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>•</span>
          <Link href="/audit" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 500 }} className="footer-hover-link">
            Security Audit & Attestation ↗
          </Link>
        </div>
      </div>
    </section>
  );
}

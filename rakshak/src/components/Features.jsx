'use client';
import { useState } from 'react';

export default function Features() {
  const [activeTab, setActiveTab] = useState(0);

  const modules = [
    {
      step: '01',
      tabName: 'Vault Isolation',
      tag: 'Kernel Folder Isolation',
      title: 'Zero-Trust File Vault',
      desc: 'Isolate sensitive folders (/Documents, /Photos, /SourceCode). Only user-verified applications gain read permission; background AI agents are blocked instantly.',
      points: [
        'Automated process identity verification',
        'Kernel-level read permission gating',
        'Direct local sandbox enforcement'
      ],
      logo: '/assets/tech/kernel.svg'
    },
    {
      step: '02',
      tabName: 'Adversarial Honeypot',
      tag: 'Model Poisoning Engine',
      title: 'Adversarial Honeypot Generator',
      desc: 'Inject synthetic mathematical noise into decoy files. If an aggressive AI bot circumvents basic locks, stolen data poisons the attacker model parameters.',
      points: [
        'Synthetic gradient noise injection',
        'Automated decoy file rotations',
        'Zero impact on legitimate user data'
      ],
      logo: '/assets/tech/wireshark.svg'
    },
    {
      step: '03',
      tabName: 'Recall Blocker',
      tag: 'OCR & Snapshot Firewall',
      title: 'AI Telemetry & Recall Blocker',
      desc: 'Block silent OS-level OCR indexers and background snapshot utilities that capture your screen and read sensitive web banking or health records.',
      points: [
        'OS Recall hook disabler',
        'Screen scraper detection & freeze',
        'Real-time clipboard telemetry guard'
      ],
      logo: '/assets/tech/windows.svg'
    },
    {
      step: '04',
      tabName: 'Kernel Trap',
      tag: 'I/O Rate Interceptor',
      title: 'Kernel I/O Scraper Trap',
      desc: 'Detects high-frequency sequential file reads indicative of LLM dataset creation and suspends offending processes before file bytes leave RAM.',
      points: [
        'Sequential read anomaly scoring',
        'Immediate process suspension & kill',
        'Sub-millisecond driver response'
      ],
      logo: '/assets/tech/rust.svg'
    }
  ];

  const current = modules[activeTab];

  return (
    <section className="container" style={{ padding: '6rem 1.25rem 5rem' }}>
      <div className="section-header-deepip">
        <div className="tag_content">
          <div className="blue_tag">ARCHITECTURE</div>
          <span>Deep Defense Engine</span>
        </div>
        <h2>Military-Grade Protection Architecture</h2>
        <p>Rakshak operates beneath user space at the kernel driver layer to guarantee absolute local privacy.</p>
      </div>

      {/* DeepIP Interactive Stage Tab Menu */}
      <div className="stage_tab-menu">
        {modules.map((m, idx) => (
          <button
            key={idx}
            className={`stage_tab-link ${activeTab === idx ? 'active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            <span className="stage_tab-number">{m.step}</span>
            <span>{m.tabName}</span>
          </button>
        ))}
      </div>

      {/* DeepIP Active Stage Feature Card */}
      <div className="deepip-card" style={{ padding: '2.5rem', marginBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', background: 'rgba(20, 110, 245, 0.1)', border: '1px solid rgba(20, 110, 245, 0.25)', borderRadius: 6, color: '#38bdf8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.05em' }}>
              {current.tag}
            </div>
            <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
              {current.title}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              {current.desc}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {current.points.map((pt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(20, 110, 245, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                      <path d="M4 9L7.5 12.5L14 6" stroke="#146ef5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span style={{ color: '#cbd5e1', fontSize: '0.925rem', fontWeight: 500 }}>{pt}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(3, 6, 12, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 260, textAlign: 'center' }}>
            <div className="icon-box-blue" style={{ width: 64, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <img src={current.logo} alt={current.title} width="36" height="36" style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ color: '#38bdf8', fontSize: '0.85rem', fontWeight: 700, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
              STATUS: HARDENED
            </div>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              Protected by Zero-Trust Kernel Layer
            </span>
          </div>
        </div>
      </div>

      {/* 4 DeepIP Bento Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {modules.map((m, idx) => (
          <div key={idx} className="deepip-card">
            <div className="icon-box-blue" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={m.logo} alt={m.title} width="26" height="26" style={{ objectFit: 'contain' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem', fontWeight: 700 }}>{m.title}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

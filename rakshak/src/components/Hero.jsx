'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import rakshakLogo from '../../public/rakshaklogo.png';

export default function Hero() {
  const [attacksCount, setAttacksCount] = useState(0);
  const [interceptedEvents, setInterceptedEvents] = useState([]);
  const heroRef = useRef(null);
  const tagRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const actionsRef = useRef(null);
  const showcaseRef = useRef(null);

  useEffect(() => {
    const fetchLiveHeroData = async () => {
      try {
        const res = await fetch('/api/rakshak/telemetry', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        const deflected = data.stats?.botsDeflected ?? (data.liveFeed?.filter(e => e.threatScore > 50).length || 0);
        setAttacksCount(deflected);
        if (data.liveFeed && Array.isArray(data.liveFeed)) {
          const threats = data.liveFeed.filter(e => e.threatScore > 0 || e.threatIntercepted);
          setInterceptedEvents(threats.slice(0, 3));
        }
      } catch {}
    };

    fetchLiveHeroData();
    const timer = setInterval(fetchLiveHeroData, 3000);
    return () => clearInterval(timer);
  }, []);

  // GSAP Smooth Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        tagRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 }
      );
      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: 0.2 }
      );
      gsap.fromTo(
        actionsRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.3 }
      );
      gsap.fromTo(
        showcaseRef.current,
        { opacity: 0, scale: 0.98, y: 25 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.25 }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const trustBadges = [
    { logo: '/assets/tech/kernel.svg', label: 'Kernel Folder Isolation' },
    { logo: '/assets/tech/rust.svg', label: 'Zero-Overhead Local Agent' },
    { logo: '/assets/tech/wireguard.svg', label: 'Real-Time Process Guard' },
    { logo: '/assets/tech/cloudflare.svg', label: 'Zero Cloud Telemetry' },
    { logo: '/assets/tech/wireshark.svg', label: 'Honey-Token Decoy Engine' },
    { logo: '/assets/tech/intel.svg', label: 'Sub-Millisecond Intercept' },
  ];

  return (
    <>
      <section className="hero-deepip" ref={heroRef}>
        <div className="bg-deepip-ambient"></div>

        <div className="container hero-deepip-center">
          {/* DeepIP Clean Tag */}
          <div className="tag_content" ref={tagRef}>
            <div className="blue_tag">RAKSHAK 2.0</div>
            <span>Zero-Trust AI Defense • <strong>{attacksCount.toLocaleString()}</strong> Live Attacks Intercepted</span>
          </div>

          <h1 className="big_title" ref={titleRef}>
            Prevent AI Models <br />
            From Exposing <span className="text-color-blue">Your Data.</span>
          </h1>

          <p className="hero-subtitle" ref={descRef}>
            Rakshak is the zero-trust local computer firewall that stops unauthorized background AI processes, desktop recall indexers, and web LLM bots from harvesting your private files and code.
          </p>

          <div className="hero-actions-center" ref={actionsRef}>
            <Link href="/pricing" className="btn-deepip-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Get Shield - $19/mo
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/radar" className="btn-deepip-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00F5FF', boxShadow: '0 0 8px #00F5FF' }} />
              Live Defense Radar
            </Link>
          </div>

          {/* Authentic Rakshak Mission Control Console (No AI Generated Image) */}
          <div className="deepip-window-frame" ref={showcaseRef}>
            <div className="deepip-window-header">
              <div className="mac-dots">
                <span className="mac-dot mac-dot-red"></span>
                <span className="mac-dot mac-dot-yellow"></span>
                <span className="mac-dot mac-dot-green"></span>
              </div>
              <span style={{ color: '#94a3b8', fontSize: '0.775rem', fontFamily: 'var(--font-code)', fontWeight: 600 }}>
                RAKSHAK KERNEL ENGINE • SYSTEM TELEMETRY
              </span>
              <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span> ENFORCED
              </span>
            </div>

            <div className="deepip-window-body">
              {/* Mission Control Header with Rakshak Crest Emblem */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 14, border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Image 
                    src={rakshakLogo} 
                    alt="Rakshak Crest" 
                    width={48} 
                    height={48} 
                    style={{ objectFit: 'contain' }}
                    priority 
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>Rakshak Kernel Shield</strong>
                      <span style={{ background: 'rgba(20, 110, 245, 0.15)', color: '#38bdf8', fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 4, textTransform: 'uppercase' }}>
                        v2.4.1 Active
                      </span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: '0.2rem 0 0' }}>
                      Monitoring low-level I/O disk calls &amp; background LLM scrapers
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 6, fontSize: '0.75rem', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <img src="/assets/tech/googledocs.svg" alt="Docs" width="14" height="14" style={{ objectFit: 'contain', marginRight: 6 }} /> /Documents [LOCKED]
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.35rem 0.75rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 6, fontSize: '0.75rem', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <img src="/assets/tech/vscode.svg" alt="Code" width="14" height="14" style={{ objectFit: 'contain', marginRight: 6 }} /> /SourceCode [LOCKED]
                  </span>
                </div>
              </div>

              {/* Real-Time Telemetry Monitor Table */}
              <div style={{ background: '#05070c', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.06)', padding: '1rem', textAlign: 'left', marginBottom: '1.25rem', fontFamily: 'var(--font-code)', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.7rem', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '0.75rem' }}>
                  <span>INTERCEPTED PROCESS / THREAT VECTOR</span>
                  <span>TARGET DIRECTORY</span>
                  <span>KERNEL ACTION</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {interceptedEvents.length > 0 ? (
                    interceptedEvents.map((evt, idx) => (
                      <div key={evt.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: evt.threatScore > 50 ? '#f87171' : '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: evt.threatScore > 50 ? '#ef4444' : '#38bdf8' }} />
                          {evt.companyBotName || evt.company || 'AI Extraction Probe'} [{evt.ip ? evt.ip.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, '$1.$2.xxx.$4') : 'Edge'}]
                        </span>
                        <span style={{ color: '#94a3b8' }}>{evt.path || '/'}</span>
                        <span style={{ color: evt.threatScore > 50 ? '#ef4444' : '#10b981', fontWeight: 700 }}>
                          {evt.threatScore > 50 ? 'DECEIVED (Apparel Decoy 200 OK)' : 'VERIFIED (Human Ingress)'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ color: '#64748b', textAlign: 'center', padding: '0.5rem 0' }}>
                      Rakshak Edge Kernel Active • Listening for live AI scraping vectors...
                    </div>
                  )}
                </div>
              </div>

              {/* Three Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div className="stat-card-deepip">
                  <h3 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800 }}>100%</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>Local Processing &amp; Isolation</p>
                </div>
                <div className="stat-card-deepip">
                  <h3 style={{ fontSize: '1.75rem', color: '#38bdf8', fontWeight: 800 }}>&lt; 0.02ms</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>Kernel Overhead Latency</p>
                </div>
                <div className="stat-card-deepip">
                  <h3 style={{ fontSize: '1.75rem', color: '#146ef5', fontWeight: 800 }}>0 Bytes</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>Cloud Telemetry Transmitted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DeepIP Marquee Ticker Section */}
      <section className="deepip-marquee-section">
        <div className="deepip-marquee-track">
          {[...trustBadges, ...trustBadges].map((item, idx) => (
            <div key={idx} className="marquee-item" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
              <img src={item.logo} alt={item.label} width="18" height="18" style={{ objectFit: 'contain' }} />
              <span>{item.label}</span>
              <span style={{ margin: '0 1rem', color: 'rgba(255, 255, 255, 0.1)' }}>/</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}


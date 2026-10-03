'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import rakshakLogo from '../../public/rakshaklogo.png';

export default function Hero() {
  const [attacksCount, setAttacksCount] = useState(0);
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
        const deflected = data.metrics?.aiCrawlersDeflectedToday || data.stats?.botsDeflected || 0;
        setAttacksCount(deflected);
      } catch {}
    };

    fetchLiveHeroData();
    const timer = setInterval(fetchLiveHeroData, 4000);
    return () => clearInterval(timer);
  }, []);

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
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#30d158' }} />
              Live Defense Radar
            </Link>
          </div>

          {/* Sovereign Defense Architecture Matrix (Pillars leading to dedicated pages) */}
          <div className="hero-pillars-grid" ref={showcaseRef} style={{ width: '100%', maxWidth: '1080px', marginTop: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', textAlign: 'left' }}>
              
              {/* Pillar 1: Native Workstation Shield */}
              <Link href="/download" style={{ textDecoration: 'none', color: 'inherit' }} className="pillar-card-apple">
                <div style={{ padding: '1.75rem', background: '#08080c', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color 0.2s ease, transform 0.2s ease' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0, 113, 227, 0.1)', border: '1px solid rgba(0, 113, 227, 0.25)', padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, color: '#2997ff', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#2997ff' }} />
                      Native PE x64
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 0.65rem' }}>
                      Workstation Kernel Shield
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#86868b', lineHeight: 1.6, margin: 0 }}>
                      High-Entropy ASLR binary executing Direct NT Syscalls. Terminates 40+ scrapers, blinds DWM screen indexers, and binds to physical TPM 2.0 silicon.
                    </p>
                  </div>
                  <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#2997ff', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Download Native Shield</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>

              {/* Pillar 2: Universal Developer SDK */}
              <Link href="/developers" style={{ textDecoration: 'none', color: 'inherit' }} className="pillar-card-apple">
                <div style={{ padding: '1.75rem', background: '#08080c', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color 0.2s ease, transform 0.2s ease' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(48, 209, 88, 0.1)', border: '1px solid rgba(48, 209, 88, 0.25)', padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, color: '#30d158', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#30d158' }} />
                      Multi-Stack SDK
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 0.65rem' }}>
                      Adversarial 200 OK Deception
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#86868b', lineHeight: 1.6, margin: 0 }}>
                      Zero-latency defense middleware for Node.js, Next.js, Express, and Python. Injects synthetic decoys and context-poisoning payloads into scrapers.
                    </p>
                  </div>
                  <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#30d158', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Explore SDK Documentation</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>

              {/* Pillar 3: Live Threat Radar */}
              <Link href="/radar" style={{ textDecoration: 'none', color: 'inherit' }} className="pillar-card-apple">
                <div style={{ padding: '1.75rem', background: '#08080c', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 16, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color 0.2s ease, transform 0.2s ease' }}>
                  <div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255, 159, 10, 0.1)', border: '1px solid rgba(255, 159, 10, 0.25)', padding: '0.2rem 0.6rem', borderRadius: 9999, fontSize: '0.72rem', fontWeight: 600, color: '#ff9f0a', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '1rem' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ff9f0a' }} />
                      Perimeter Observatory
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 0.65rem' }}>
                      Geodesic Defense Radar
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#86868b', lineHeight: 1.6, margin: 0 }}>
                      Spherical trigonometry tracking incoming autonomous crawlers across global ASNs. Live threat stream, Shannon entropy bounds, and bytecode disassembly.
                    </p>
                  </div>
                  <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ff9f0a', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Launch Dedicated Radar</span>
                    <span>→</span>
                  </div>
                </div>
              </Link>

            </div>

            {/* Sovereign Invariant Metric Indicators */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
              <div className="stat-card-deepip">
                <h3 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800, letterSpacing: '-0.02em' }}>100%</h3>
                <p style={{ color: '#86868b', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>Local Processing &amp; Isolation</p>
              </div>
              <div className="stat-card-deepip">
                <h3 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800, letterSpacing: '-0.02em' }}>&lt; 0.02ms</h3>
                <p style={{ color: '#86868b', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>Direct NT Syscall Latency</p>
              </div>
              <div className="stat-card-deepip">
                <h3 style={{ fontSize: '1.75rem', color: '#ffffff', fontWeight: 800, letterSpacing: '-0.02em' }}>4096-bit</h3>
                <p style={{ color: '#86868b', fontSize: '0.8rem', margin: 0, fontWeight: 500 }}>Sovereign Hardware Enclave PKI</p>
              </div>
            </div>
          </div>
        </div>
      </section>

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


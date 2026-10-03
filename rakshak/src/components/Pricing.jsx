'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import LicenseProvisionModal from '@/components/LicenseProvisionModal';

export default function Pricing() {
  const [category, setCategory] = useState('workstation');
  const [selectedPlanForModal, setSelectedPlanForModal] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('category') || params.get('tab') || params.get('type');
      if (tab === 'sdk' || tab === 'developer' || tab === 'web') {
        setCategory('sdk');
      } else if (tab === 'edge' || tab === 'cloud' || tab === 'infra') {
        setCategory('edge');
      } else if (tab === 'workstation' || tab === 'exe') {
        setCategory('workstation');
      }
    }
  }, []);

  const workstationPlans = [
    {
      name: 'Rakshak Sentinel Workstation',
      slug: 'sentinel',
      price: '$19',
      period: 'per month (30 days active)',
      durationBadge: '30 Days Active Term',
      techStack: 'Windows 11/10 PE Native x64 (.exe), macOS, Linux',
      quota: '1 Workstation / Developer Seat',
      desc: 'Zero-Trust Local Anti-AI Perimeter for individual developers & standalone workstations.',
      features: [
        'Native RakshakShield.exe PE 64-bit Workstation Engine',
        'Local File Interceptor (/Documents, /SourceCode, .env, .ssh)',
        'Sub-0.02ms Kernel Latency Budget & 0 Cloud Telemetry',
        'Automated Scraper & Crawler Traps (Honeytokens)',
        'Local Git Pre-Commit AI Exfiltration Guard',
        'Airgapped Cryptographic RSK Policy Compiler'
      ],
      cta: 'Provision Sentinel - $19/mo',
      popular: false
    },
    {
      name: 'Rakshak Aegis Pro Fleet',
      slug: 'aegis',
      price: '$99',
      period: 'for 6 months ($16.50/mo, 180 days active)',
      durationBadge: '180 Days Active Term',
      techStack: 'Windows 11/10, macOS (Apple Silicon + Intel), Linux (Debian/Ubuntu/Fedora)',
      quota: 'Up to 3 Workstation Devices',
      desc: 'Adversarial Honeypot & Pro Model Defense with active countermeasure traps.',
      features: [
        'Everything included in Sentinel Workstation',
        'Multi-Device License (Up to 3 Active Workstations)',
        'Adversarial Homoglyph & Steganography Engine',
        'Synthetic Honey-Token Decoy Generator (.env, .ts, .csv)',
        'Continuous Process Tree & Clipboard Telemetry Guard',
        'Priority RSK Ruleset Updates & Airgapped Patches'
      ],
      cta: 'Provision Aegis - $99',
      popular: false
    },
    {
      name: 'Rakshak Citadel Sovereign Matrix',
      slug: 'citadel',
      price: '$149',
      period: 'per year ($12.40/mo - Save 35%, 365 days active)',
      durationBadge: '365 Days Active Term',
      techStack: 'Windows PE Native Core, Minifilter Driver (.sys), macOS ESF, Linux eBPF',
      quota: 'Unlimited Workstation Fleet',
      desc: 'Full-Spectrum Airgapped Fortification & Unlimited Workstation Fleet Suite.',
      features: [
        'Everything included in Aegis Pro Fleet',
        'Unlimited Workstation & Device Enclave Licenses',
        'Enterprise Model Poisoning Grid & Loss-Spike Generators',
        'Hardware TPM & Cryptographic Enclave Key Binding',
        'Direct Security Architect Threat Response Line',
        'Guaranteed Zero-Day Scraper Rule Signatures'
      ],
      cta: 'Provision Citadel Pass - $149',
      popular: true,
      badgeText: 'Best Value'
    }
  ];

  const sdkPlans = [
    {
      name: 'Rakshak SDK Starter',
      slug: 'sdk-starter',
      price: '$29',
      period: 'per month (30 days active)',
      durationBadge: '30 Days Active Term',
      techStack: 'Next.js (App & Pages Router), Node.js (Express), Python (FastAPI / Flask)',
      quota: '1 Production Web Domain (50k requests/mo)',
      desc: 'Zero-Trust anti-crawler defense for 1 production web application or API.',
      features: [
        '50,000 Ingress AI Crawler Inspections / Month',
        'Asymmetric 200 OK Honeypot Deflection (/apparel decoy)',
        'Universal Next.js Edge & App Router Middleware',
        'Python FastAPI & Flask Security Middlewares',
        'Zero False Positives for Genuine Human Residential Traffic',
        'Single Production Domain Deployment'
      ],
      cta: 'Provision SDK Starter - $29/mo',
      popular: false
    },
    {
      name: 'Rakshak SDK Pro Multi-Stack',
      slug: 'sdk-pro',
      price: '$79',
      period: 'per month (30 days active)',
      durationBadge: '30 Days Active Term',
      techStack: 'Next.js, Express, Python, Go (Gin/Fiber), Ruby (Rack), PHP (Laravel)',
      quota: '5 Production Web Domains (250k requests/mo)',
      desc: 'Entropy analysis, waterfall detection & multi-stack defense for up to 5 domains.',
      features: [
        '250,000 Ingress Inspections / Month ($0.00015/extra)',
        'Shannon Information Entropy & Client-Hint Topology Analysis',
        'Waterfall Cascade Analyzer (Headless browser blocker)',
        'Full Multi-Stack SDKs: Python, Node.js, Go, PHP, Ruby',
        'Real-Time Threat Radar & Live Deflection Logs',
        'Up to 5 Production Web & API Domains'
      ],
      cta: 'Provision SDK Pro - $79/mo',
      popular: true,
      badgeText: 'Most Popular'
    },
    {
      name: 'Rakshak SDK Enterprise Scale',
      slug: 'sdk-enterprise',
      price: '$199',
      period: 'per month (30 days active)',
      durationBadge: '30 Days Active Term',
      techStack: 'All SDK Languages (JS, TS, Python, Go, Ruby, PHP, Java) + SIEM (Splunk/Sentinel)',
      quota: '20 Production Web Domains (1M requests/mo)',
      desc: 'Custom RSK compiler rules, SIEM integration & edge SLA guarantee for 20 domains.',
      features: [
        '1,000,000 AI Crawler Inspections / Month ($0.0001/extra)',
        'Custom .rsk Security Knowledge Rule Compilation (rskc)',
        'Forensic Steganography & Court-Admissible Copyright Proof',
        'Real-time SIEM Forwarders (Splunk SPL, Sentinel KQL, Elastic)',
        'Sub-0.2ms Edge Execution SLA & 99.99% Availability Guarantee',
        'Up to 20 Production Domains Fleet'
      ],
      cta: 'Provision Enterprise SDK - $199/mo',
      popular: false
    }
  ];

  const edgePlans = [
    {
      name: 'Rakshak Edge Sentinel Proxy',
      slug: 'edge-sentinel',
      price: '$129',
      period: 'per month (30 days active)',
      durationBadge: '30 Days Active Term',
      techStack: 'Cloudflare Workers, Nginx OpenResty Lua, AWS WAF / CloudFront Lambda@Edge',
      quota: '10 Production Ingress Domains',
      desc: 'Global reverse-proxy and CDN edge worker defense against scrapers.',
      features: [
        'Sub-millisecond Global Edge Evaluation (< 0.2ms)',
        'Native Cloudflare Workers & Cloudflare Pages edge hooks',
        'Nginx OpenResty Lua & AWS WAF integration rules',
        'Zero CPU load on origin server infrastructure',
        'Automated verified search engine whitelisting (Google/Bing)',
        'Up to 10 Production Ingress Domains'
      ],
      cta: 'Provision Edge Proxy - $129/mo',
      popular: false
    },
    {
      name: 'Rakshak Sovereign Infra Grid',
      slug: 'sovereign-infra',
      price: '$499',
      period: 'per month ($399/mo billed yearly, 365 days active)',
      durationBadge: '365 Days Active Term',
      techStack: 'Kubernetes Ingress, Envoy Mesh, Linux eBPF, Windows Minifilter (.sys)',
      quota: 'Unlimited Clusters, Ingress Nodes & Fleet',
      desc: 'Enterprise deceptive steganography, Ring-0 drivers, eBPF & 24/7 dedicated SOC.',
      features: [
        'Unlimited AI Crawler Inspections & Workstation Seats',
        'Ring-0 Windows NT Minifilter Driver (.sys) deployment',
        'Linux eBPF kernel network & socket interceptor mesh',
        'Dedicated Security Architect & Custom .rsk Rulesets',
        '99.999% SLA & 24/7 Emergency SOC Hotline',
        'Cryptographic Enclave Key Binding & On-Premises Licensing'
      ],
      cta: 'Provision Sovereign Infra - $499/mo',
      popular: true,
      badgeText: 'Enterprise Enclave'
    }
  ];

  let currentPlans = workstationPlans;
  if (category === 'sdk') currentPlans = sdkPlans;
  if (category === 'edge') currentPlans = edgePlans;

  return (
    <section className="container" style={{ padding: '5rem 1.25rem 6rem' }}>
      <div className="section-header-deepip" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="tag_content" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div className="blue_tag">COMMERCIAL SECURITY SUITE</div>
          <span>Strict Active-Term Licensing</span>
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          {category === 'workstation' && 'Workstation & Windows EXE Anti-AI Security'}
          {category === 'sdk' && 'Web Apps & Multi-Stack SDK Middleware'}
          {category === 'edge' && 'Cloud Infrastructure & Edge Reverse Proxies'}
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '780px', margin: '0 auto', lineHeight: 1.6 }}>
          {category === 'workstation' && 'Airgapped native PE binaries (RakshakShield.exe), Minifilter driver (.sys), and RSK compiler for zero-cloud file isolation.'}
          {category === 'sdk' && 'Bifurcated reality middleware for Next.js, Express, Python FastAPI, Go, Ruby, and PHP. Serve real data to humans and deceptive decoys to AI.'}
          {category === 'edge' && 'Edge worker hooks and reverse-proxy modules for Cloudflare Workers, Nginx Lua, AWS WAF, and Kubernetes eBPF network layers.'}
        </p>

        {/* 3-Category Switcher Tabs */}
        <div style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '50px',
          padding: '0.35rem',
          marginTop: '2rem',
          gap: '0.35rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          <button
            onClick={() => setCategory('workstation')}
            style={{
              background: category === 'workstation' ? 'linear-gradient(135deg, #146ef5, #00F5FF)' : 'transparent',
              color: category === 'workstation' ? '#000' : '#94a3b8',
              fontWeight: category === 'workstation' ? 700 : 500,
              padding: '0.65rem 1.4rem',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.25s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            1. Workstation &amp; Windows EXE
          </button>

          <button
            onClick={() => setCategory('sdk')}
            style={{
              background: category === 'sdk' ? 'linear-gradient(135deg, #00F5FF, #3B82F6)' : 'transparent',
              color: category === 'sdk' ? '#000' : '#94a3b8',
              fontWeight: category === 'sdk' ? 700 : 500,
              padding: '0.65rem 1.4rem',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.25s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            2. Web Apps &amp; SDKs (Next.js, Python, Go)
          </button>

          <button
            onClick={() => setCategory('edge')}
            style={{
              background: category === 'edge' ? 'linear-gradient(135deg, #10b981, #00F5FF)' : 'transparent',
              color: category === 'edge' ? '#000' : '#94a3b8',
              fontWeight: category === 'edge' ? 700 : 500,
              padding: '0.65rem 1.4rem',
              borderRadius: '50px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.25s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            3. Cloud &amp; Edge Proxies (Cloudflare / Nginx)
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginTop: '1.5rem' }}>
        {currentPlans.map((p, idx) => (
          <div 
            key={idx} 
            className="deepip-card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              position: 'relative',
              borderColor: p.popular ? 'rgba(0, 245, 255, 0.5)' : 'rgba(255, 255, 255, 0.08)',
              boxShadow: p.popular ? '0 0 35px rgba(0, 245, 255, 0.2)' : 'none',
              background: 'linear-gradient(180deg, rgba(8, 15, 30, 0.8) 0%, rgba(3, 7, 18, 0.95) 100%)',
              padding: '2.25rem'
            }}
          >
            {p.popular && (
              <span style={{ 
                position: 'absolute', 
                top: -14, 
                right: 20, 
                background: 'linear-gradient(135deg, #00F5FF, #146ef5)', 
                color: '#000', 
                fontSize: '0.72rem', 
                fontWeight: 800, 
                padding: '0.25rem 0.85rem', 
                borderRadius: 20, 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em', 
                boxShadow: '0 0 20px rgba(0, 245, 255, 0.5)' 
              }}>
                {p.badgeText || 'Recommended'}
              </span>
            )}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff' }}>{p.name}</h3>
                <span style={{ 
                  fontSize: '0.7rem', 
                  color: '#34d399', 
                  background: 'rgba(52, 211, 153, 0.12)', 
                  border: '1px solid rgba(52, 211, 153, 0.3)', 
                  padding: '0.2rem 0.55rem', 
                  borderRadius: 4, 
                  fontFamily: 'var(--font-code)',
                  fontWeight: 700
                }}>
                  {p.durationBadge}
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', minHeight: '2.5rem', lineHeight: 1.5 }}>{p.desc}</p>
              
              <div style={{ fontSize: '2.75rem', fontWeight: 800, color: '#fff', margin: '1.25rem 0 0.25rem', lineHeight: 1 }}>{p.price}</div>
              <div style={{ color: '#38bdf8', fontSize: '0.825rem', fontWeight: 500, marginBottom: '1.25rem' }}>{p.period}</div>

              {/* Tech Stack Spec Box */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 8,
                padding: '0.75rem 0.95rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.68rem', color: '#00F5FF', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                  Target Architecture &amp; Tech Stack:
                </div>
                <div style={{ color: '#e2e8f0', fontSize: '0.82rem', fontFamily: 'var(--font-code)', lineHeight: 1.4 }}>
                  {p.techStack}
                </div>
                <div style={{ marginTop: '0.4rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                  Coverage: <strong style={{ color: '#fff' }}>{p.quota}</strong>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem', marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>
                  Included Capabilities
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {p.features.map((f, i) => (
                    <li key={i} style={{ color: '#cbd5e1', fontSize: '0.88rem', display: 'flex', alignItems: 'flex-start', gap: '0.6rem', lineHeight: 1.45 }}>
                      <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <circle cx="10" cy="10" r="9" fill="rgba(0, 245, 255, 0.15)" stroke="#00F5FF" strokeWidth="1.5"/>
                        <path d="M6 10l3 3 5-5" stroke="#00F5FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
              <button 
                onClick={() => setSelectedPlanForModal(p)}
                className={p.popular ? 'btn-deepip-blue' : 'btn-deepip-dark'}
                style={{ 
                  width: '100%', 
                  textAlign: 'center', 
                  minHeight: 44, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: p.popular ? 'linear-gradient(135deg, #00F5FF, #146ef5)' : undefined,
                  color: p.popular ? '#000' : '#fff',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {p.cta}
              </button>
              <Link
                href={category === 'workstation' ? `/pricing/${p.slug}` : '/developers'}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 8,
                  color: '#38bdf8',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
              >
                {category === 'workstation' ? 'Explore Technical Feature Details' : 'View Architecture & Integration Specs'}
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* REVENUE & MONETIZATION ARCHITECTURE SECTION */}
      {(category === 'sdk' || category === 'edge') && (
        <div style={{
          marginTop: '4.5rem',
          background: 'linear-gradient(180deg, rgba(5, 10, 24, 0.8) 0%, rgba(2, 4, 10, 0.95) 100%)',
          border: '1px solid rgba(0, 245, 255, 0.2)',
          borderRadius: 16,
          padding: '2.5rem clamp(1.25rem, 4vw, 3rem)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#00F5FF', fontFamily: 'monospace', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              BUSINESS MODEL &amp; VALUE ARCHITECTURE
            </span>
            <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#fff', marginTop: '0.5rem', marginBottom: '0.75rem' }}>
              Why The Core SDK is Free, and How Rakshak Generates High Recurring Revenue
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Modeled after the world&apos;s most profitable developer-security infrastructure platforms (Cloudflare, Sentry, CrowdStrike, and Tailscale).
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ color: '#00F5FF', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                1. Developer Adoption Engine
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                The open-source core SDK and local CLI build community trust and universal edge adoption. Developers install it via npm or brew with zero friction.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                2. Real-Time Telemetry &amp; Intelligence
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                Enterprises upgrade to Commercial Pro and Scale tiers to access live multi-cloud telemetry, real-time Slack/Discord webhooks, and SIEM streaming.
              </p>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 12, padding: '1.5rem' }}>
              <div style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                3. Zero-Day Threat Feeds
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                As new AI scraping clusters and automated crawler ASNs emerge daily, enterprise customers pay for hourly compiled `.rskb` bytecode signature feeds.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* License Provisioning Modal */}
      <LicenseProvisionModal
        plan={selectedPlanForModal}
        isOpen={!!selectedPlanForModal}
        onClose={() => setSelectedPlanForModal(null)}
      />
    </section>
  );
}

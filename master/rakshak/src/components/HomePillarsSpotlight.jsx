'use client';

import React from 'react';
import Link from 'next/link';

export default function HomePillarsSpotlight() {
  const pillars = [
    {
      id: 'workstation',
      badge: 'KERNEL SHIELD',
      title: 'Workstation Isolation',
      desc: 'Ring 0 local minifilter driver intercepting non-human I/O, unauthorized background indexing, and desktop recall daemons before disk read access.',
      stats: '0.12ms Latency • Single PC Node',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      )
    },
    {
      id: 'sdk',
      badge: 'DEVELOPER MATRIX',
      title: 'Universal SDK Guard',
      desc: 'Edge middleware for Next.js, Python, and Express. Delivers clean pass-through for verified humans and dynamic honeypot token traps for scrapers.',
      stats: 'Sub-Microsecond • 0% False Positives',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="16 18 22 12 16 6"/>
          <polyline points="8 6 2 12 8 18"/>
        </svg>
      )
    },
    {
      id: 'telemetry',
      badge: 'AIRGAPPED PURITY',
      title: 'Zero-Telemetry Engine',
      desc: 'Zero user telemetry collected, stored, or transmitted. Verifiable via Wireshark and socket inspection with mathematical cryptographic certainty.',
      stats: '0 Bytes Cloud Egress • 100% Local',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 sm:py-28 relative bg-[#000000]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#86868b] uppercase tracking-wider mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
              Core Defense Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight anti-ocr-protect">
              Three Pillars of Sovereign Security.
            </h2>
          </div>
          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2997ff] hover:text-white transition-colors group"
          >
            <span>Explore All 12 Capabilities</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transform transition-transform group-hover:translate-x-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="deepip-card rounded-2xl border border-white/10 bg-[#0c0c10]/80 p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#2997ff]">
                    {pillar.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#86868b] uppercase px-2 py-0.5 rounded bg-white/5 border border-white/5">
                    {pillar.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {pillar.title}
                </h3>

                <p className="text-sm text-[#86868b] leading-relaxed mb-6">
                  {pillar.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>{pillar.stats}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs sm:text-sm text-[#86868b]">
            <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
            <span>Looking for full RSK compiler specifications and SDK adapters?</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/developers"
              className="text-xs font-mono font-semibold uppercase tracking-wider text-white hover:text-[#2997ff] transition-colors"
            >
              Developer Docs &rarr;
            </Link>
            <Link
              href="/features"
              className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2997ff] hover:text-white transition-colors"
            >
              Full Feature Catalog &rarr;
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

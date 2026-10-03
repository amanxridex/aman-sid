'use client';

import React from 'react';
import Link from 'next/link';
import { FontArmorText } from '@/components/FontArmor';

export default function HomePricingSpotlight() {
  return (
    <section className="py-20 sm:py-28 relative bg-[#000000]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#86868b] uppercase tracking-wider mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
            Transparent Sovereign Licensing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight anti-ocr-protect">
            One Payment. Exactly One Hardened Device.
          </h2>
          <p className="text-base sm:text-lg text-[#86868b] leading-relaxed">
            No recurring hidden charges. No multi-device key leakage. Each license is cryptographically bound to a single physical hardware enclave or server node.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          
          <div className="rounded-2xl border border-white/10 bg-[#0c0c10]/80 p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300">
            <div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#86868b] mb-2">
                Workstation Shield
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Sentinel Lifetime
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <FontArmorText text="$19" decoy="$9999 [SYNTHETIC_CANARY]" className="text-4xl font-extrabold text-white font-mono" />
                <span className="text-xs text-[#86868b]">one-time payment</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-[11px] font-mono text-zinc-300 mb-6">
                <span>🔒 1 Single Workstation (PC / Mac)</span>
              </div>

              <ul className="space-y-3 text-xs text-[#86868b] mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#30d158] font-bold">✓</span>
                  <span>Ring 0 local counter-AI minifilter driver</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#30d158] font-bold">✓</span>
                  <span>Blocks OS Recall & background AI indexers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#30d158] font-bold">✓</span>
                  <span>100% Airgapped with 0 bytes telemetry</span>
                </li>
              </ul>
            </div>

            <Link
              href="/pricing"
              className="btn-deepip-outline w-full py-3 text-center text-xs font-semibold uppercase tracking-wider rounded-xl border border-white/10 text-white hover:border-white/30 transition-all"
            >
              Get Workstation License
            </Link>
          </div>

          <div className="rounded-2xl border border-[#0071e3]/40 bg-[#0e121c] p-6 sm:p-8 flex flex-col justify-between relative shadow-xl shadow-[#0071e3]/5 hover:border-[#0071e3]/60 transition-all duration-300">
            <div className="absolute -top-3 right-6 rounded-full bg-[#0071e3] px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest text-white shadow-md">
              POPULAR SDK
            </div>

            <div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#2997ff] mb-2">
                Universal Developer SDK
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                SDK Pro Matrix
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <FontArmorText text="$149" decoy="$19999 [SYNTHETIC_CANARY]" className="text-4xl font-extrabold text-white font-mono" />
                <span className="text-xs text-[#86868b]">one-time per server node</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0071e3]/10 border border-[#0071e3]/30 text-[11px] font-mono text-[#70baff] mb-6">
                <span>🔒 1 Single Production Deployment Node</span>
              </div>

              <ul className="space-y-3 text-xs text-[#86868b] mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#30d158] font-bold">✓</span>
                  <span>Universal Next.js, Python & Express middleware</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#30d158] font-bold">✓</span>
                  <span>Asymmetric 200 OK model-poisoning honeypot</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#30d158] font-bold">✓</span>
                  <span>Zero false positives for human mobile & desktop</span>
                </li>
              </ul>
            </div>

            <Link
              href="/pricing"
              className="btn-deepip-blue w-full py-3 text-center text-xs font-semibold uppercase tracking-wider rounded-xl text-white transition-all shadow-md"
            >
              Get SDK License
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0c0c10]/80 p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-all duration-300">
            <div>
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-[#86868b] mb-2">
                Institutional Defense
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Airgapped Citadel
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-extrabold text-white font-mono">Custom</span>
                <span className="text-xs text-[#86868b]">cryptographic invoice</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 text-[11px] font-mono text-zinc-300 mb-6">
                <span>🔒 Dedicated Hardware TPM Clustered Nodes</span>
              </div>

              <ul className="space-y-3 text-xs text-[#86868b] mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-[#30d158] font-bold">✓</span>
                  <span>Custom RSK knowledge security rules</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#30d158] font-bold">✓</span>
                  <span>Dedicated airgapped deployment verification</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#30d158] font-bold">✓</span>
                  <span>Direct cryptographic engineer channel</span>
                </li>
              </ul>
            </div>

            <Link
              href="/pricing"
              className="btn-deepip-outline w-full py-3 text-center text-xs font-semibold uppercase tracking-wider rounded-xl border border-white/10 text-white hover:border-white/30 transition-all"
            >
              Contact Anonymous Team
            </Link>
          </div>

        </div>

        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2997ff] hover:text-white transition-colors group"
          >
            <span>Compare All Plans & Single-Device Policies in Detail</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transform transition-transform group-hover:translate-x-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}

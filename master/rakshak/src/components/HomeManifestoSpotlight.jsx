'use client';

import React from 'react';
import Link from 'next/link';

export default function HomeManifestoSpotlight() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden border-t border-b border-white/5 bg-gradient-to-b from-[#000000] via-[#050508] to-[#000000]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#86868b] uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#0071e3]" />
              Sovereign Counter-AI Philosophy
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight anti-ocr-protect">
              We Are <span className="text-color-blue">NOT</span> An Antivirus Company.
            </h2>

            <p className="text-base sm:text-lg text-[#86868b] leading-relaxed mb-6 font-normal">
              Legacy antivirus software was engineered for 1990s signature trojans. Today, the real danger is not a virus—it is autonomous AI scrapers, desktop recall daemons, and commercial LLMs silently harvesting your private code, files, and workstation memories to train multi-billion dollar models.
            </p>

            <p className="text-sm sm:text-base text-[#a1a1a6] leading-relaxed mb-8">
              Rakshak was architected by <strong className="text-white font-semibold">three anonymous systems engineers</strong> to restore absolute data sovereignty. 100% airgapped execution, Ring 0 hardware isolation, and zero bytes of telemetry.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/why-rakshak"
                className="btn-deepip-blue inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl text-white transition-all duration-300"
              >
                <span>Read Full Manifesto & Comparison</span>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <Link
                href="/founders"
                className="btn-deepip-outline inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl text-[#86868b] hover:text-white border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <span>The Anonymous Creators</span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-[#0c0c10]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
              <div className="text-xs font-mono uppercase tracking-widest text-[#86868b] mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
                <span>Threat Architecture Delta</span>
                <span className="text-emerald-400 font-semibold">SOVEREIGN V2</span>
              </div>

              <div className="space-y-4 text-xs font-sans">
                <div className="rounded-xl bg-white/[0.02] p-3.5 border border-white/5">
                  <div className="text-[#86868b] text-[11px] mb-1 uppercase tracking-wider font-mono">Commercial AI Scrapers</div>
                  <div className="text-rose-400 font-medium mb-1 line-through opacity-75">Legacy AV: Whitelisted (Signed Exes)</div>
                  <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Rakshak: Blocked at Ring 0 Minifilter
                  </div>
                </div>

                <div className="rounded-xl bg-white/[0.02] p-3.5 border border-white/5">
                  <div className="text-[#86868b] text-[11px] mb-1 uppercase tracking-wider font-mono">User Data Telemetry</div>
                  <div className="text-rose-400 font-medium mb-1 line-through opacity-75">Legacy AV: Gigabytes uploaded to cloud</div>
                  <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Rakshak: 0 Bytes (100% Airgapped Node)
                  </div>
                </div>

                <div className="rounded-xl bg-white/[0.02] p-3.5 border border-white/5">
                  <div className="text-[#86868b] text-[11px] mb-1 uppercase tracking-wider font-mono">Active Defense</div>
                  <div className="text-rose-400 font-medium mb-1 line-through opacity-75">Legacy AV: Passive post-breach alert</div>
                  <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Rakshak: Model-Poisoning Tensor Honeypots
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-[#86868b]">
                <span>Single-Device Hardware Binding</span>
                <span className="text-white font-mono font-medium">TPM 2.0 Enclave</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';

export default function HomeFoundersQuote() {
  return (
    <section className="py-20 sm:py-24 relative border-t border-white/5 bg-[#050508]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#86868b] uppercase tracking-wider mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
          Anonymous Engineering Guild
        </div>

        <blockquote className="text-xl sm:text-2xl lg:text-3xl font-medium text-[#f5f5f7] leading-relaxed mb-8 anti-ocr-protect">
          &ldquo;We built Rakshak anonymously because true privacy cannot have a corporate face, a public relations board, or an institutional master. Your computer belongs to you—not to artificial intelligence cartels harvesting your life to feed their models.&rdquo;
        </blockquote>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono text-[#86868b] mb-8">
          <span className="text-white font-semibold">THE THREE ANONYMOUS SYSTEMS ARCHITECTS</span>
          <span className="hidden sm:inline">•</span>
          <span>PGP FINGERPRINT: 4A89 E102 BF39 771C</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-emerald-400">CRYPTOGRAPHICALLY COMMITTED</span>
        </div>

        <div>
          <Link
            href="/founders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#2997ff] hover:text-white transition-colors group"
          >
            <span>Read the Complete Founders Manifesto & Verify Signatures</span>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transform transition-transform group-hover:translate-x-1">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}

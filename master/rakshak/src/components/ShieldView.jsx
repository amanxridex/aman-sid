'use client';

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import BannerCTA from '@/components/BannerCTA';
import Footer from '@/components/Footer';

export default function ShieldView() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Rakshak | Sovereign Counter-AI Defense Shield';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Rakshak is an independent sovereign counter-AI shield built by three anonymous engineers to safeguard user data from global AI attacks, commercial LLM scraping, and desktop recall indexers. 100% local, 0 bytes cloud telemetry.'
        );
      }
    }
  }, []);

  return (
    <main className="relative bg-[#000000] text-[#f5f5f7] min-h-screen selection:bg-[#0071e3] selection:text-white">
      <Navbar />
      <Hero />
      <BannerCTA />
      <Footer />
    </main>
  );
}

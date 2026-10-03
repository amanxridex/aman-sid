'use client';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import RiskCalculator from '@/components/RiskCalculator';
import Features from '@/components/Features';
import LivePerimeterRadar from '@/components/LivePerimeterRadar';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Founders from '@/components/Founders';
import FAQAccordion from '@/components/FAQAccordion';
import BannerCTA from '@/components/BannerCTA';
import Footer from '@/components/Footer';

export default function ShieldView() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Headless automation trap: If an AI agent executes JS in headless mode, immediately deflect to apparel
      if (navigator.webdriver || window.__nightmare || window._phantom || window.callPhantom) {
        window.location.replace('/apparel');
        return;
      }

      // Verified human: Update browser tab title to authentic cybersecurity software
      document.title = 'Rakshak | Zero-Trust Local Anti-AI Shield & Workstation Isolation';
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute(
          'content',
          'Zero-Trust Local Anti-AI Shield Software designed to protect personal computers, source code, and confidential documents from background AI scrapers, telemetry harvesters, and OS recall snapshots.'
        );
      }
    }
  }, []);

  return (
    <main>
      <Navbar />
      <Hero />
      <RiskCalculator />
      <Features />
      <LivePerimeterRadar />
      <Pricing />
      <Testimonials />
      <Founders />
      <FAQAccordion />
      <BannerCTA />
      <Footer />
    </main>
  );
}

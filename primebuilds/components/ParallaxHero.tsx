"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, ShieldCheck, Ruler, Sparkles } from "lucide-react";
import TiltCard from "./TiltCard";

export default function ParallaxHero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative overflow-hidden bg-blueprint-grid py-10 md:py-20 border-b border-slate-200">
      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Clean, Minimalist Architectural Messaging */}
          <div className="lg:col-span-6 flex flex-col items-start">
            
            {/* Minimal Category Tag with Live Beacon */}
            <div className="inline-flex items-center gap-2 mb-4 bg-blue-50 border border-blue-200 px-3 py-1" style={{ borderRadius: "4px" }}>
              <span className="live-beacon"></span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-blue-900">
                LONDON RESIDENTIAL & COMMERCIAL
              </span>
            </div>

            {/* Apple-level Clean Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950 mb-4 leading-[1.1] tracking-tight">
              Dream Spaces. <br />
              <span className="text-blue-700">Built to Last.</span>
            </h1>

            {/* Refined Punchy Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 mb-6 sm:mb-8 max-w-lg leading-relaxed font-normal">
              From concept to turnkey delivery, we engineer bespoke residential extensions, lofts, and luxury refurbishments across London with uncompromising precision.
            </p>

            {/* Clean Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8 sm:mb-10">
              <Link 
                href="/services" 
                className="btn-primary text-xs uppercase tracking-wider font-semibold shimmer-btn py-3 px-6 text-center"
                style={{ borderRadius: "6px" }}
              >
                <span>Our Services</span>
                <ArrowRight size={14} />
              </Link>

              <Link 
                href="/calculator" 
                className="btn-secondary text-xs uppercase tracking-wider font-semibold py-3 px-6 text-center"
                style={{ borderRadius: "6px" }}
              >
                <Ruler size={14} className="text-blue-600" />
                <span>Estimate Your Build</span>
              </Link>
            </div>

            {/* Clean 2x2 Grid on Mobile, 4-col on Desktop (Prevents wrapping overlap) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-6 border-t border-slate-200">
              <div className="p-3 bg-white border border-slate-200" style={{ borderRadius: "6px", boxShadow: "var(--neu-raised-sm)" }}>
                <span className="block text-2xl font-black text-blue-950 font-mono tracking-tight">10+</span>
                <span className="text-[11px] font-medium text-slate-500">Years in London</span>
              </div>
              <div className="p-3 bg-white border border-slate-200" style={{ borderRadius: "6px", boxShadow: "var(--neu-raised-sm)" }}>
                <span className="block text-2xl font-black text-blue-950 font-mono tracking-tight">200+</span>
                <span className="text-[11px] font-medium text-slate-500">Builds Finished</span>
              </div>
              <div className="p-3 bg-white border border-slate-200" style={{ borderRadius: "6px", boxShadow: "var(--neu-raised-sm)" }}>
                <span className="block text-2xl font-black text-blue-950 font-mono tracking-tight">100%</span>
                <span className="text-[11px] font-medium text-slate-500">Council Sign-Off</span>
              </div>
              <div className="p-3 bg-white border border-slate-200" style={{ borderRadius: "6px", boxShadow: "var(--neu-raised-sm)" }}>
                <span className="block text-2xl font-black text-blue-950 font-mono tracking-tight">10-Yr</span>
                <span className="text-[11px] font-medium text-slate-500">Warranty</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Tilt Architectural Hero Showcase with High-Contrast Overlay */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            <TiltCard maxTilt={8}>
              <div 
                className="neu-box relative overflow-hidden p-2.5"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #cbd5e1",
                  borderRadius: "12px",
                  boxShadow: "var(--neu-raised)"
                }}
              >
                <div className="relative w-full aspect-[16/10] overflow-hidden" style={{ borderRadius: "8px" }}>
                  <Image
                    src="/images/hero_london_residence.jpg"
                    alt="Luxury London Residence Built by Prime Builds"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  
                  {/* High-Contrast Gradient & Solid Backdrop to ensure 100% legibility on mobile */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white">
                    <div className="p-2 bg-slate-950/80 border border-white/10" style={{ borderRadius: "4px" }}>
                      <span className="text-[10px] font-mono font-bold uppercase text-sky-300 block mb-0.5">
                        CHELSEA RESIDENTIAL
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white mb-0 drop-shadow-md">
                        The Kensington Private Residence
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-900 border border-blue-400/30 text-[11px] font-semibold shrink-0" style={{ borderRadius: "4px" }}>
                      <MapPin size={12} className="text-sky-300" />
                      <span>London, UK</span>
                    </div>
                  </div>
                </div>

                <div 
                  className="mt-2.5 px-3 py-2 bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700"
                  style={{ borderRadius: "6px" }}
                >
                  <span className="flex items-center gap-1.5 text-blue-900">
                    <ShieldCheck size={14} className="text-blue-600" />
                    <span>Fixed-Price Contract Guarantee</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    LONDON ONLY
                  </span>
                </div>
              </div>
            </TiltCard>
          </div>

        </div>
      </div>
    </section>
  );
}

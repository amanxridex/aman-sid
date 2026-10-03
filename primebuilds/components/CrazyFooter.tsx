"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  CheckCircle2,
  HardHat
} from "lucide-react";

export default function CrazyFooter() {
  const [tilt, setTilt] = useState({ x: 12, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: 12 - yPos * 14, // Vertical tilt
      y: xPos * 18       // Horizontal tilt
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 12, y: 0 });
  };

  return (
    <footer className="crazy-footer-wrapper pt-16 pb-8 border-t border-blue-200">
      {/* Upper Architectural CTA Banner */}
      <div className="site-container mb-16">
        <div 
          className="neu-box p-8 md:p-12 relative overflow-hidden"
          style={{
            backgroundColor: "#ffffff",
            border: "2px solid #bfdbfe",
            borderRadius: "12px"
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="arch-tag">
                  <ShieldCheck size={14} className="text-blue-700" />
                  London Premier Builders
                </span>
                <span className="text-xs font-bold text-blue-900 tracking-wider uppercase">
                  100% Guaranteed Delivery
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-blue-950 mb-3" style={{ letterSpacing: "-0.03em" }}>
                Begin Your London Construction Project With Precision
              </h2>
              <p className="text-base text-slate-600 mb-0">
                Book a complimentary on-site architectural feasibility consultation with our London master surveyors. Transparent tender, fixed pricing, and multi-year structural guarantees.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link 
                href="/calculator" 
                className="btn-secondary text-sm font-bold uppercase tracking-wider text-center"
                style={{ borderRadius: "6px" }}
              >
                <span>Instant Cost Estimator</span>
              </Link>
              <Link 
                href="/contact" 
                className="btn-primary text-sm font-bold uppercase tracking-wider text-center"
                style={{ borderRadius: "6px" }}
              >
                <span>Schedule Site Audit</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Structural Information Columns */}
      <div className="site-container pb-14 border-b border-blue-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Company Profile */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-900 flex items-center justify-center text-white font-bold text-base" style={{ borderRadius: "4px" }}>
                P
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-blue-950" style={{ letterSpacing: "-0.03em" }}>
                PRIME<span className="text-blue-600 font-semibold">BUILDS</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              London&apos;s leading end-to-end design and construction firm. Specializing in luxury house refurbishments, loft conversions, structural extensions, and prime commercial fit-outs across Greater London.
            </p>
            <div className="flex flex-col gap-2 text-xs font-semibold text-blue-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-600" />
                <span>10-Year Insurance-Backed Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-600" />
                <span>Full London Borough Planning Sign-Off</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-blue-600" />
                <span>NICEIC & Gas Safe Certified MEP Engineers</span>
              </div>
            </div>
          </div>

          {/* Column 2: Core Construction Services */}
          <div>
            <h4 className="text-base font-bold text-blue-950 uppercase tracking-wider mb-4 pb-2 border-b border-blue-200">
              Disciplines
            </h4>
            <ul className="space-y-2.5 text-sm list-none p-0 m-0">
              <li>
                <Link href="/services#house-refurbishment" className="text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-none"></span>
                  <span>Full House Refurbishment</span>
                </Link>
              </li>
              <li>
                <Link href="/services#loft-conversion" className="text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-none"></span>
                  <span>Loft & Attic Conversions</span>
                </Link>
              </li>
              <li>
                <Link href="/services#home-extensions" className="text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-none"></span>
                  <span>Architectural Extensions</span>
                </Link>
              </li>
              <li>
                <Link href="/services#kitchen-renovation" className="text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-none"></span>
                  <span>Bespoke Kitchen Design</span>
                </Link>
              </li>
              <li>
                <Link href="/services#luxury-bathrooms" className="text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-none"></span>
                  <span>Luxury Bathrooms & Wetrooms</span>
                </Link>
              </li>
              <li>
                <Link href="/services#commercial-fitouts" className="text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-none"></span>
                  <span>Commercial Fit-Outs</span>
                </Link>
              </li>
              <li>
                <Link href="/services#property-maintenance" className="text-slate-600 hover:text-blue-700 transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-none"></span>
                  <span>Structural Repairs & Maintenance</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: London Areas Served */}
          <div>
            <h4 className="text-base font-bold text-blue-950 uppercase tracking-wider mb-4 pb-2 border-b border-blue-200">
              London Coverage
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
              <span className="p-2 bg-blue-50 border border-blue-200 rounded" style={{ borderRadius: "4px" }}>Chelsea (SW3)</span>
              <span className="p-2 bg-blue-50 border border-blue-200 rounded" style={{ borderRadius: "4px" }}>Kensington (W8)</span>
              <span className="p-2 bg-blue-50 border border-blue-200 rounded" style={{ borderRadius: "4px" }}>Regents Park (NW1)</span>
              <span className="p-2 bg-blue-50 border border-blue-200 rounded" style={{ borderRadius: "4px" }}>Camden Town (NW1)</span>
              <span className="p-2 bg-blue-50 border border-blue-200 rounded" style={{ borderRadius: "4px" }}>Mayfair (W1K)</span>
              <span className="p-2 bg-blue-50 border border-blue-200 rounded" style={{ borderRadius: "4px" }}>Westminster (SW1)</span>
              <span className="p-2 bg-blue-50 border border-blue-200 rounded" style={{ borderRadius: "4px" }}>Hampstead (NW3)</span>
              <span className="p-2 bg-blue-50 border border-blue-200 rounded" style={{ borderRadius: "4px" }}>Islington (N1)</span>
            </div>
            <div className="mt-4 p-3 bg-white border border-blue-200 rounded" style={{ borderRadius: "6px" }}>
              <span className="text-xs text-blue-900 font-semibold block">London Borough Coverage:</span>
              <span className="text-xs text-slate-600">Active site teams deployed across all 32 London Boroughs.</span>
            </div>
          </div>

          {/* Column 4: London Office (STRICTLY London Address only!) */}
          <div>
            <h4 className="text-base font-bold text-blue-950 uppercase tracking-wider mb-4 pb-2 border-b border-blue-200">
              London Office
            </h4>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-900 rounded shrink-0" style={{ borderRadius: "4px" }}>
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-900 block uppercase">Address:</span>
                  <span className="font-semibold text-slate-800">London, United Kingdom</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-900 rounded shrink-0" style={{ borderRadius: "4px" }}>
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-900 block uppercase">Phone:</span>
                  <a href="tel:+442079460892" className="text-blue-700 font-semibold hover:underline">
                    +44 20 7946 0892
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-900 rounded shrink-0" style={{ borderRadius: "4px" }}>
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-900 block uppercase">Direct Tender:</span>
                  <a href="mailto:enquiries@primebuilds-london.co.uk" className="text-blue-700 font-semibold hover:underline">
                    enquiries@primebuilds-london.co.uk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-900 rounded shrink-0" style={{ borderRadius: "4px" }}>
                  <Clock size={16} />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-900 block uppercase">Site Operations:</span>
                  <span>Mon – Fri: 07:00 – 19:00</span>
                  <span className="block text-xs text-slate-500">Emergency support available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE CRAZY 3D BIG LETTERS CLIMAX
          Interactive mouse-tracking 3D perspective typography statement
          ========================================================================= */}
      <div 
        className="w-full py-12 md:py-20 relative overflow-hidden bg-blueprint-grid cursor-default"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="site-container text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="h-[2px] w-12 bg-blue-500"></span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 font-mono">
              PRECISION STRUCTURAL ARCHITECTURE • LONDON
            </span>
            <span className="h-[2px] w-12 bg-blue-500"></span>
          </div>

          {/* Crazy 3D Huge Typography */}
          <div 
            className="crazy-3d-text"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(40px)`,
              transition: "transform 0.15s ease-out"
            }}
          >
            PRIME BUILDS
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Residential Mansions</span>
            <span className="text-blue-400">•</span>
            <span>Loft Transformations</span>
            <span className="text-blue-400">•</span>
            <span>Commercial Fit-Outs</span>
            <span className="text-blue-400">•</span>
            <span>Structural Engineering</span>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Legal Line (Mobile Optimized) */}
      <div className="site-container pt-6 border-t border-blue-200 text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          © {new Date().getFullYear()} <strong className="text-blue-950 font-bold">Prime Builds</strong>. Registered in England & Wales. Address: <strong className="text-blue-950">London, United Kingdom</strong>.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          <Link href="/about" className="hover:text-blue-800 transition-colors whitespace-nowrap">About Us</Link>
          <Link href="/process" className="hover:text-blue-800 transition-colors whitespace-nowrap">Our Process</Link>
          <Link href="/contact" className="hover:text-blue-800 transition-colors whitespace-nowrap">Book Consultation</Link>
          <span className="text-blue-600 font-semibold whitespace-nowrap">London Specialists</span>
        </div>
      </div>
    </footer>
  );
}

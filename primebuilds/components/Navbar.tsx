"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, ArrowRight, ShieldCheck, Clock } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [londonTime, setLondonTime] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update London time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Europe/London",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      };
      setLondonTime(new Intl.DateTimeFormat([], options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "Process", href: "/process" },
    { name: "Cost Estimator", href: "/calculator" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300" style={{
      backgroundColor: "#ffffff",
      borderBottom: scrolled ? "1px solid #e2e8f0" : "1px solid #f1f5f9",
      boxShadow: scrolled ? "0 4px 20px rgba(15, 39, 101, 0.06)" : "none"
    }}>
      {/* Sleek Minimalist Top Bar with continuous live beacon */}
      <div style={{ backgroundColor: "#0f2765", color: "#ffffff" }} className="py-1 px-4 text-[11px] font-medium tracking-wide">
        <div className="site-container flex justify-between items-center">
          <div className="flex items-center gap-2 text-blue-100">
            <span className="live-beacon"></span>
            <MapPin size={11} className="text-sky-300" />
            <span className="font-semibold">London, United Kingdom</span>
            {londonTime && (
              <span className="hidden sm:inline-block text-sky-200 font-mono text-[10px] pl-1">
                ({londonTime} GMT)
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-blue-100">
            <a 
              href="tel:+442079460892" 
              className="flex items-center gap-1.5 hover:text-white transition-colors font-medium"
            >
              <Phone size={11} className="text-sky-300" />
              <span>+44 20 7946 0892</span>
            </a>
            <span className="hidden sm:inline-block text-blue-400">•</span>
            <span className="hidden sm:inline-block text-blue-200">Mon - Fri: 7AM – 7PM</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="site-container py-3 flex items-center justify-between">
        {/* Brand Logotype */}
        <Link href="/" className="flex items-center gap-2 group text-decoration-none shrink-0">
          <span className="font-extrabold text-xl tracking-tight text-blue-950" style={{ letterSpacing: "-0.03em" }}>
            PRIME<span className="text-blue-600 font-medium">BUILDS</span>
          </span>
          <span className="hidden md:inline-block text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 pl-2 border-l border-slate-200">
            LONDON
          </span>
        </Link>

        {/* Desktop Navigation Links (XL screens only) */}
        <nav className="hidden xl:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-semibold tracking-tight transition-all duration-200"
                style={{
                  borderRadius: "6px",
                  color: isActive ? "#0f2765" : "#475569",
                  backgroundColor: isActive ? "#eff6ff" : "transparent"
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Action Button (XL screens only to prevent mobile overlap) */}
        <div className="hidden xl:flex items-center gap-3">
          <Link
            href="/contact"
            className="btn-primary text-xs uppercase tracking-wider font-semibold shimmer-btn"
            style={{ padding: "0.6rem 1.25rem", borderRadius: "6px" }}
          >
            <span>Book Site Audit</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Mobile Action Controls (Under XL: Phone + Animated Morphing Hamburger) */}
        <div className="flex xl:hidden items-center gap-2">
          <a
            href="tel:+442079460892"
            className="p-2 text-blue-900 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
            style={{ borderRadius: "6px" }}
            aria-label="Call London Office"
          >
            <Phone size={16} />
          </a>

          {/* Animated 3-line to X Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 text-slate-800 bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-all focus:outline-none"
            style={{ borderRadius: "6px" }}
            aria-label="Toggle Navigation Menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between items-center relative">
              <span 
                className={`h-0.5 w-full bg-blue-950 transition-all duration-300 origin-left ${
                  mobileMenuOpen ? "rotate-45 translate-x-0.5 -translate-y-0.5" : ""
                }`} 
              />
              <span 
                className={`h-0.5 w-full bg-blue-950 transition-all duration-200 ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`} 
              />
              <span 
                className={`h-0.5 w-full bg-blue-950 transition-all duration-300 origin-left ${
                  mobileMenuOpen ? "-rotate-45 translate-x-0.5 translate-y-0.5" : ""
                }`} 
              />
            </div>
          </button>
        </div>
      </div>

      {/* Luxury Animated Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          className="xl:hidden w-full border-t border-slate-200 bg-blueprint-grid py-4 px-5 mobile-drawer-anim"
          style={{ backgroundColor: "#ffffff", boxShadow: "0 16px 32px rgba(15, 39, 101, 0.12)" }}
        >
          {/* Quick London Location & Time Tag */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-blue-900 font-bold">
              <span className="live-beacon"></span>
              LONDON HQ ACTIVE
            </span>
            <span>{londonTime} GMT</span>
          </div>

          <div className="flex flex-col gap-1.5">
            {navLinks.map((link, idx) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-3.5 py-2.5 text-sm font-semibold flex items-center justify-between transition-all"
                  style={{
                    borderRadius: "6px",
                    color: isActive ? "#0f2765" : "#334155",
                    backgroundColor: isActive ? "#eff6ff" : "#ffffff",
                    border: isActive ? "1px solid #bfdbfe" : "1px solid #e2e8f0"
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-400">0{idx + 1}</span>
                    <span>{link.name}</span>
                  </div>
                  <ArrowRight size={14} className={isActive ? "text-blue-600" : "text-slate-400"} />
                </Link>
              );
            })}

            {/* Quick Mobile Booking CTA */}
            <div className="pt-3 mt-2 border-t border-slate-200 flex flex-col gap-2">
              <Link
                href="/contact"
                className="w-full btn-primary text-xs uppercase tracking-wider font-semibold flex justify-center py-3 shimmer-btn"
                style={{ borderRadius: "6px", backgroundColor: "#1d4ed8" }}
              >
                <span>Book Free Site Audit</span>
                <ArrowRight size={13} />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck size={13} className="text-blue-600" />
                <span>10-Year Insurance Structural Warranty</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

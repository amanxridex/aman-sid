'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        boxShadow: scrolled ? '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 16px rgba(0, 0, 0, 0.03)' : 'none',
        transition: 'all 0.25s ease'
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '3.75rem' }}>
          
          {/* Brand Lockup: Emblem + Clean Architectural Wordmark */}
          <Link
            href="/"
            aria-label="PRIME BUILDS London Home"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem'
            }}
          >
            <img
              src="/logo.png"
              alt="Prime Builds London"
              style={{
                height: '32px',
                width: 'auto',
                display: 'block',
                objectFit: 'contain'
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                lineHeight: 1
              }}
            >
              <span
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  color: '#1d1d1f',
                  textAlign: 'center'
                }}
              >
                PRIME BUILDS
              </span>
              <span
                style={{
                  fontSize: '0.5625rem',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textIndent: '0.18em',
                  color: '#dc2626',
                  textTransform: 'uppercase',
                  marginTop: '2.5px',
                  textAlign: 'center',
                  width: '100%',
                  display: 'block'
                }}
              >
                LONDON
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links (Apple-style clean typography) */}
          <nav className="desktop-nav" style={{ gap: '2.25rem' }}>
            <Link href="/services" style={{ textDecoration: 'none', color: '#1d1d1f', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '-0.01em', transition: 'color 0.15s ease' }}>
              Services
            </Link>
            <Link href="/case-studies" style={{ textDecoration: 'none', color: '#1d1d1f', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '-0.01em', transition: 'color 0.15s ease' }}>
              Portfolio
            </Link>
            <Link href="/how-owner-works" style={{ textDecoration: 'none', color: '#1d1d1f', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '-0.01em', transition: 'color 0.15s ease' }}>
              How We Work
            </Link>
            <Link href="/pricing" style={{ textDecoration: 'none', color: '#1d1d1f', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '-0.01em', transition: 'color 0.15s ease' }}>
              Pricing
            </Link>
            <Link href="/our-story" style={{ textDecoration: 'none', color: '#1d1d1f', fontSize: '0.875rem', fontWeight: 500, letterSpacing: '-0.01em', transition: 'color 0.15s ease' }}>
              About
            </Link>
          </nav>

          {/* Right Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            
            {/* Live Desk Direct Line (Desktop) */}
            <div className="desktop-phone-link" style={{ marginRight: '0.25rem' }}>
              <a
                href="tel:+447767672807"
                style={{
                  textDecoration: 'none',
                  color: '#4b5563',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  transition: 'color 0.15s ease'
                }}
              >
                +44 7767 672807
              </a>
            </div>

            {/* Clean Architectural CTA Button (NO PILLS, NO GLOW) */}
            <Link
              href="/demo"
              style={{
                textDecoration: 'none',
                color: '#ffffff',
                backgroundColor: '#dc2626',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                transition: 'background-color 0.2s ease',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}
            >
              <span>Get Quote</span>
              <span style={{ fontSize: '0.8125rem' }}>›</span>
            </Link>

            {/* Minimal Clean Architectural Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-nav-toggle"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              style={{
                background: mobileMenuOpen ? 'rgba(0, 0, 0, 0.06)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                width: '36px',
                height: '36px',
                borderRadius: '4px',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease'
              }}
            >
              <div style={{ width: '16px', height: '10px', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '1.5px',
                    backgroundColor: '#1d1d1f',
                    borderRadius: '1px',
                    transformOrigin: 'center',
                    transform: mobileMenuOpen ? 'translateY(4.25px) rotate(45deg)' : 'none',
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease'
                  }}
                />
                <span
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '1.5px',
                    backgroundColor: '#1d1d1f',
                    borderRadius: '1px',
                    transformOrigin: 'center',
                    transform: mobileMenuOpen ? 'translateY(-4.25px) rotate(-45deg)' : 'none',
                    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease'
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Soothing Animated Mobile Menu Drawer (Smooth Slide & Fade with Stagger) */}
      <div
        style={{
          position: 'fixed',
          top: '3.75rem',
          left: 0,
          right: 0,
          bottom: 0,
          height: 'calc(100dvh - 3.75rem)',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '2rem 1.5rem 2.5rem 1.5rem',
          boxSizing: 'border-box',
          overflowY: 'auto',
          zIndex: 999,
          opacity: mobileMenuOpen ? 1 : 0,
          visibility: mobileMenuOpen ? 'visible' : 'hidden',
          transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(-14px)',
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s ease'
        }}
      >
        {/* Navigation Links with Gentle Staggered Motion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { label: 'Services', href: '/services', delay: '0.04s' },
            { label: 'Portfolio', href: '/case-studies', delay: '0.08s' },
            { label: 'How We Work', href: '/how-owner-works', delay: '0.12s' },
            { label: 'Pricing & Rates', href: '/pricing', delay: '0.16s' },
            { label: 'About Prime Builds', href: '/our-story', delay: '0.20s' }
          ].map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                textDecoration: 'none',
                color: '#1d1d1f',
                fontSize: '1.4rem',
                fontWeight: 600,
                letterSpacing: '-0.025em',
                padding: '0.5rem 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                opacity: mobileMenuOpen ? 1 : 0,
                transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-8px)',
                transition: mobileMenuOpen
                  ? `opacity 0.35s ease ${item.delay}, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1) ${item.delay}`
                  : 'opacity 0.2s ease, transform 0.2s ease'
              }}
            >
              <span>{item.label}</span>
              <span style={{ color: '#dc2626', fontSize: '1.25rem' }}>›</span>
            </Link>
          ))}
        </div>

        {/* Bottom Actions inside drawer */}
        <div
          style={{
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            paddingTop: '1.5rem',
            marginTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            opacity: mobileMenuOpen ? 1 : 0,
            transform: mobileMenuOpen ? 'translateY(0)' : 'translateY(8px)',
            transition: mobileMenuOpen
              ? 'opacity 0.4s ease 0.22s, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.22s'
              : 'opacity 0.2s ease, transform 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#6e6e73' }}>Direct Site Desk:</span>
            <a href="tel:+447767672807" style={{ textDecoration: 'none', color: '#1d1d1f', fontWeight: 700, fontSize: '0.9375rem' }}>
              +44 7767 672807
            </a>
          </div>

          <Link
            href="/demo"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              textDecoration: 'none',
              color: '#ffffff',
              backgroundColor: '#dc2626',
              padding: '0.95rem 1.5rem',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '1rem',
              letterSpacing: '-0.01em',
              display: 'block',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)'
            }}
          >
            Start Project Consultation
          </Link>
        </div>
      </div>
    </header>
  );
}

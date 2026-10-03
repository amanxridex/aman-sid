'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        color: '#1d1d1f',
        paddingTop: 'clamp(3.5rem, 6vw, 5.5rem)',
        paddingBottom: 'clamp(1.5rem, 3vw, 2.5rem)',
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Top Brand & Contact Strip - Perfectly Centered with Bigger Logo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '680px',
            margin: '0 auto clamp(2.5rem, 5vw, 4rem) auto'
          }}
        >
          {/* Centered Bigger Logo */}
          <Link
            href="/"
            aria-label="PRIME BUILDS London Home"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem'
            }}
          >
            <img
              src="/logo.png"
              alt="Prime Builds London"
              style={{
                height: 'clamp(54px, 9vw, 72px)',
                width: 'auto',
                display: 'block',
                objectFit: 'contain'
              }}
            />
          </Link>

          {/* Centered Mission Statement */}
          <p
            style={{
              color: '#4b5563',
              fontSize: 'clamp(0.9375rem, 1.6vw, 1.05rem)',
              lineHeight: 1.6,
              margin: '0 auto 1.75rem auto',
              maxWidth: '560px',
              fontWeight: 400,
              textAlign: 'center'
            }}
          >
            London residential building contractor specialising in architect-led home extensions, loft conversions, and complete structural renovations under fixed-price JCT contracts.
          </p>

          {/* Centered Contact Details & CTA */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '0.45rem'
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#6e6e73'
              }}
            >
              Direct Site Desk — London
            </div>

            <a
              href="tel:+447767672807"
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 1.85rem)',
                fontWeight: 800,
                color: '#1d1d1f',
                textDecoration: 'none',
                letterSpacing: '-0.025em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <span>+44 7767 672807</span>
            </a>

            <div style={{ fontSize: '0.9375rem', color: '#4b5563', marginTop: '0.1rem' }}>
              Site consultations:{' '}
              <a
                href="mailto:hello@primebuilds.co.uk"
                style={{ color: '#dc2626', textDecoration: 'none', fontWeight: 600 }}
              >
                hello@primebuilds.co.uk
              </a>
            </div>

            <div style={{ marginTop: '0.85rem' }}>
              <Link
                href="/demo"
                style={{
                  textDecoration: 'none',
                  color: '#ffffff',
                  backgroundColor: '#dc2626',
                  padding: '0.75rem 1.6rem',
                  borderRadius: '6px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'background-color 0.2s ease',
                  boxShadow: '0 2px 6px rgba(220, 38, 38, 0.2)'
                }}
              >
                <span>Request Free Survey</span>
                <span>&rsaquo;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Structured Grid: 4-col Desktop, 2x2 Mobile */}
        <div
          className="footer-links-grid"
          style={{
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            paddingTop: 'clamp(2rem, 4vw, 3rem)',
            marginBottom: 'clamp(2rem, 4vw, 3rem)'
          }}
        >
          {/* Column 1: Services */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#18181b', marginBottom: '1.1rem' }}>
              Residential Services
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84375rem' }}>
              <li><Link href="/services" className="footer-link-item">Kitchen Extensions</Link></li>
              <li><Link href="/services" className="footer-link-item">Loft Conversions</Link></li>
              <li><Link href="/services" className="footer-link-item">House Renovations</Link></li>
              <li><Link href="/services" className="footer-link-item">Architectural Glazing</Link></li>
            </ul>
          </div>

          {/* Column 2: London Areas */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#18181b', marginBottom: '1.1rem' }}>
              London Coverage
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84375rem', color: '#52525b' }}>
              <li>Wandsworth &amp; Clapham</li>
              <li>Richmond &amp; Wimbledon</li>
              <li>Kensington &amp; Chelsea</li>
              <li>Ealing &amp; Chiswick</li>
              <li>Islington &amp; Highgate</li>
            </ul>
          </div>

          {/* Column 3: The Standards */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#18181b', marginBottom: '1.1rem' }}>
              Contract Certainty
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84375rem' }}>
              <li><Link href="/pricing" className="footer-link-item">Fixed-Price JCT Standard</Link></li>
              <li><Link href="/how-owner-works" className="footer-link-item">10-Year Insurance Warranty</Link></li>
              <li><Link href="/how-owner-works" className="footer-link-item">Dedicated Site Foreman</Link></li>
              <li><Link href="/pricing" className="footer-link-item">Milestone Payment Stages</Link></li>
            </ul>
          </div>

          {/* Column 4: Accreditations */}
          <div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#18181b', marginBottom: '1.1rem' }}>
              Accreditations
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.84375rem', color: '#52525b' }}>
              <li>Federation of Master Builders</li>
              <li>TrustMark Govt Endorsed</li>
              <li>CHAS Health &amp; Safety</li>
              <li>Gas Safe &amp; NICEIC Trades</li>
            </ul>
          </div>
        </div>

        {/* Sub-Footer Legal / Registered Info */}
        <div
          style={{
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: '#6e6e73'
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} Prime Builds London Ltd. All rights reserved. Registered in England &amp; Wales.
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>JCT Minor Works Standard</span>
            <span style={{ color: '#d4d4d8' }}>—</span>
            <span>10-Yr Structural Guarantee</span>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH VIEWPORT WATERMARK & TICKER (100% EDGE-TO-EDGE ON DESKTOP) */}
      <div className="footer-watermark-wrap" style={{ width: '100%', overflow: 'hidden' }}>
        {/* SVG Container: Full viewport width edge-to-edge */}
        <div style={{ width: '100%', margin: 0, padding: 0, overflow: 'hidden' }}>
          <svg
            viewBox="0 0 1000 125"
            preserveAspectRatio="xMidYMid meet"
            className="clean-vector-text"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
              overflow: 'visible'
            }}
            role="img"
            aria-label="PRIME BUILDS"
          >
            <defs>
              {/* Fluid Shimmering Liquid Red Gradient for Text Body */}
              <linearGradient id="primeWatermarkBodyGrad" x1="0%" y1="0%" x2="200%" y2="0%">
                <stop offset="0%" stopColor="#991b1b" />
                <stop offset="20%" stopColor="#dc2626" />
                <stop offset="38%" stopColor="#ef4444" />
                <stop offset="50%" stopColor="#fca5a5" />
                <stop offset="62%" stopColor="#ef4444" />
                <stop offset="80%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  from="-1000,0"
                  to="1000,0"
                  dur="6.5s"
                  repeatCount="indefinite"
                />
              </linearGradient>

              {/* Counter-Moving Light Gradient for Text Outline */}
              <linearGradient id="primeWatermarkOutlineGrad" x1="0%" y1="0%" x2="200%" y2="0%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="30%" stopColor="#f87171" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#dc2626" />
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  from="1000,0"
                  to="-1000,0"
                  dur="4.5s"
                  repeatCount="indefinite"
                />
              </linearGradient>
            </defs>

            <text
              x="500"
              y="96"
              textAnchor="middle"
              textLength="985"
              lengthAdjust="spacingAndGlyphs"
              fill="url(#primeWatermarkBodyGrad)"
              stroke="url(#primeWatermarkOutlineGrad)"
              strokeWidth="1.2"
              className="watermark-animated-text"
              style={{
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
                fontWeight: 900,
                fontSize: '118px',
                letterSpacing: '-0.02em',
                userSelect: 'none'
              }}
            >
              PRIME BUILDS
            </text>
          </svg>
        </div>

        {/* Clean Typographic Marquee Ribbon (FULL WIDTH 100VW) */}
        <div className="mobile-footer-ticker" style={{ width: '100%' }}>
          <div className="mobile-footer-ticker-track">
            <span>PRIME BUILDS LONDON</span>
            <span>—</span>
            <span>RESIDENTIAL EXTENSIONS</span>
            <span>—</span>
            <span>LOFT CONVERSIONS</span>
            <span>—</span>
            <span>FIXED PRICE JCT CONTRACTS</span>
            <span>—</span>
            <span>10-YEAR STRUCTURAL WARRANTY</span>
            <span>—</span>
            <span>ON-SITE DEDICATED FOREMAN</span>
            <span>—</span>
            <span>WANDSWORTH — EALING — CLAPHAM — RICHMOND</span>
            <span>—</span>
            {/* Duplicate track for seamless infinite marquee loop */}
            <span>PRIME BUILDS LONDON</span>
            <span>—</span>
            <span>RESIDENTIAL EXTENSIONS</span>
            <span>—</span>
            <span>LOFT CONVERSIONS</span>
            <span>—</span>
            <span>FIXED PRICE JCT CONTRACTS</span>
            <span>—</span>
            <span>10-YEAR STRUCTURAL WARRANTY</span>
            <span>—</span>
            <span>ON-SITE DEDICATED FOREMAN</span>
            <span>—</span>
            <span>WANDSWORTH — EALING — CLAPHAM — RICHMOND</span>
            <span>—</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

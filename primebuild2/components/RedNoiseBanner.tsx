'use client';

import React from 'react';
import Link from 'next/link';

export default function RedNoiseBanner() {
  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        padding: 'clamp(1rem, 2.5vw, 2.5rem) clamp(0.75rem, 2vw, 1.5rem)',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1360px',
          margin: '0 auto',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'clamp(24px, 4vw, 40px)',
          background: 'radial-gradient(ellipse at 50% 30%, #dc2626 0%, #b91c1c 40%, #991b1b 70%, #7f1d1d 100%)',
          padding: 'clamp(4rem, 7vw, 6.5rem) 1.25rem',
          boxSizing: 'border-box',
          boxShadow: '0 20px 50px rgba(185, 28, 28, 0.16)',
          border: '1px solid rgba(220, 38, 38, 0.28)'
        }}
      >
      {/* 1. CRAZY ANIMATION: Living Ambient Aurora Mesh Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          left: '15%',
          width: 'clamp(350px, 45vw, 650px)',
          height: 'clamp(350px, 45vw, 650px)',
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.48) 0%, rgba(239, 68, 68, 0) 70%)',
          filter: 'blur(55px)',
          pointerEvents: 'none',
          zIndex: 1,
          animation: 'auroraDrift1 12s ease-in-out infinite alternate'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '10%',
          width: 'clamp(400px, 50vw, 750px)',
          height: 'clamp(400px, 50vw, 750px)',
          background: 'radial-gradient(circle, rgba(251, 113, 133, 0.38) 0%, rgba(185, 28, 28, 0) 70%)',
          filter: 'blur(65px)',
          pointerEvents: 'none',
          zIndex: 1,
          animation: 'auroraDrift2 15s ease-in-out infinite alternate'
        }}
      />

      {/* 2. CRAZY ANIMATION: Concentric Kinetic Architectural Radar Waves */}
      <svg
        viewBox="0 0 1440 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1
        }}
      >
        <defs>
          <radialGradient id="bannerContourGrad" cx="50%" cy="38%" r="55%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </radialGradient>
        </defs>

        {/* 8 Hypnotic Concentric Waves with Staggered Ripple Animations */}
        <ellipse cx="720" cy="220" rx="260" ry="100" stroke="url(#bannerContourGrad)" strokeWidth="1.2" className="kinetic-ring ring-1" />
        <ellipse cx="720" cy="220" rx="360" ry="145" stroke="url(#bannerContourGrad)" strokeWidth="1.2" className="kinetic-ring ring-2" />
        <ellipse cx="720" cy="220" rx="480" ry="200" stroke="url(#bannerContourGrad)" strokeWidth="1.2" className="kinetic-ring ring-3" />
        <ellipse cx="720" cy="220" rx="620" ry="265" stroke="url(#bannerContourGrad)" strokeWidth="1.2" className="kinetic-ring ring-4" />
        <ellipse cx="720" cy="220" rx="780" ry="340" stroke="url(#bannerContourGrad)" strokeWidth="1.2" className="kinetic-ring ring-5" />
        <ellipse cx="720" cy="220" rx="960" ry="425" stroke="url(#bannerContourGrad)" strokeWidth="1.2" className="kinetic-ring ring-6" />
        <ellipse cx="720" cy="220" rx="1160" ry="520" stroke="url(#bannerContourGrad)" strokeWidth="1.2" className="kinetic-ring ring-7" />
        <ellipse cx="720" cy="220" rx="1380" ry="620" stroke="url(#bannerContourGrad)" strokeWidth="1.2" className="kinetic-ring ring-8" />
      </svg>

      {/* 3. Seamless Tactile Noise / Film Grain Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/noise.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
          mixBlendMode: 'overlay',
          opacity: 0.28,
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      {/* 4. Top Core Radial Lighting Flare */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70%',
          height: '60%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 2
        }}
      />

      {/* Foreground Content (Clean, Architectural, ZERO PILLS) */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          maxWidth: '1100px',
          margin: '0 auto',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* Crisp Architectural Micro-Kicker (NO PILL BOX!) */}
        <div
          className="scroll-reveal"
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <span style={{ display: 'inline-block', width: '24px', height: '1.5px', backgroundColor: 'rgba(255, 255, 255, 0.6)' }} />
          <span>PRIME BUILDS LONDON — FIXED-PRICE CONTRACTS</span>
          <span style={{ display: 'inline-block', width: '24px', height: '1.5px', backgroundColor: 'rgba(255, 255, 255, 0.6)' }} />
        </div>

        {/* Monumental Headline */}
        <h2
          className="scroll-reveal scroll-reveal-delay-1"
          style={{
            fontSize: 'clamp(2.2rem, 5.2vw, 4.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
            color: '#ffffff',
            margin: '0 0 2.25rem 0',
            maxWidth: '920px',
            textShadow: '0 3px 20px rgba(0, 0, 0, 0.22)'
          }}
        >
          See why London homeowners rate us #1 for fixed-price builds
        </h2>

        {/* Architectural 3-Card Assurance Strip (REPLACES ALL AI GLASS PILLS) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem',
            width: '100%',
            maxWidth: '900px',
            marginBottom: '2rem'
          }}
        >
          {/* Card 1: JCT Contract */}
          <div className="red-banner-spec-card scroll-reveal scroll-reveal-delay-2">
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#fca5a5', marginBottom: '0.35rem' }}>
              Standard 01
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem', letterSpacing: '-0.01em' }}>
              Fixed-Price JCT Contract
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.4 }}>
              Legally binding schedule of works. Zero surprise variation fees.
            </div>
          </div>

          {/* Card 2: 10-Year Warranty */}
          <div className="red-banner-spec-card scroll-reveal scroll-reveal-delay-3">
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#fca5a5', marginBottom: '0.35rem' }}>
              Standard 02
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem', letterSpacing: '-0.01em' }}>
              10-Year Insurance Warranty
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.4 }}>
              Full structural guarantee covering all load-bearing &amp; roof works.
            </div>
          </div>

          {/* Card 3: Dedicated Foreman */}
          <div className="red-banner-spec-card scroll-reveal scroll-reveal-delay-4">
            <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#fca5a5', marginBottom: '0.35rem' }}>
              Standard 03
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem', letterSpacing: '-0.01em' }}>
              Dedicated Site Foreman
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.4 }}>
              Daily trade supervision and weekly Milestone progress reports.
            </div>
          </div>
        </div>

        {/* Minimalist Trust & Reviews Kicker (ZERO BULLETS) */}
        <div
          className="scroll-reveal scroll-reveal-delay-4"
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'rgba(255, 255, 255, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontWeight: 800, fontSize: '0.9375rem' }}>4.9 Rating</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.4)' }}>—</span>
          <span>Across 140+ completed London extensions &amp; lofts</span>
        </div>

        {/* High-Converting Action Buttons (Crisp 6px Radius, No Pills, No Glow) */}
        <div
          className="scroll-reveal scroll-reveal-delay-5"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <Link
            href="/demo"
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              color: '#dc2626',
              padding: '0.9rem 2rem',
              borderRadius: '6px',
              fontSize: '0.9375rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease'
            }}
            className="red-banner-primary-btn"
          >
            <span>Request Free Survey</span>
            <span>›</span>
          </Link>

          <Link
            href="/case-studies"
            style={{
              textDecoration: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.28)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '0.9rem 1.85rem',
              borderRadius: '6px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'background-color 0.18s ease, transform 0.18s ease'
            }}
            className="red-banner-secondary-btn"
          >
            <span>Explore Portfolio</span>
            <span>›</span>
          </Link>
        </div>
      </div>
      </div>
    </section>
  );
}

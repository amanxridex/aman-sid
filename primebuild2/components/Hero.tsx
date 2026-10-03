'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ContactDrawer from './ContactDrawer';

export default function Hero() {
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  return (
    <section style={{ backgroundColor: '#ffffff', color: '#1d1d1f', paddingTop: 'clamp(2.5rem, 6vw, 5rem)', paddingBottom: 'clamp(2.5rem, 5vw, 4rem)', width: '100%' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Minimal Headline (Low text, high impact) */}
        <div style={{ maxWidth: '780px', margin: '0 auto clamp(2rem, 4vw, 3rem) auto', textAlign: 'center' }}>
          
          {/* Centered architectural micro-kicker (No red dot, No London) */}
          <div
            className="hero-anim-kicker"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              margin: '0 auto 1.25rem auto',
              textAlign: 'center'
            }}
          >
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.22em',
                color: '#6e6e73',
                textAlign: 'center'
              }}
            >
              PRIME RESIDENTIAL BUILDERS
            </span>
          </div>

          <h1
            className="hero-anim-title"
            style={{
              fontSize: 'clamp(2.25rem, 5.5vw, 4.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              color: '#1d1d1f',
              margin: '0 0 1.25rem 0'
            }}
          >
            Modern home extensions and renovations in London.
          </h1>

          <p
            className="hero-anim-subtitle"
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              lineHeight: 1.5,
              color: '#4b5563',
              margin: '0 auto 2rem auto',
              maxWidth: '580px',
              fontWeight: 400
            }}
          >
            Fixed-price contracts, dedicated on-site trades, and clear weekly progress updates. Delivered without surprise variation costs.
          </p>

          {/* Minimal Actions */}
          <div
            className="hero-anim-actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'clamp(1rem, 3vw, 2rem)',
              flexWrap: 'wrap'
            }}
          >
            <Link
              href="/demo"
              style={{
                textDecoration: 'none',
                color: '#ffffff',
                backgroundColor: '#dc2626',
                padding: '0.75rem 1.6rem',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                transition: 'opacity 0.2s ease'
              }}
            >
              <span>Get a project estimate</span>
              <span>›</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsContactDrawerOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: '#1d1d1f',
                fontSize: '0.9375rem',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              aria-label="Contact options for +44 7767 672807"
            >
              <span>+44 7767 672807</span>
              <span style={{ color: '#dc2626' }}>›</span>
            </button>
          </div>
        </div>

        {/* Real Residential Project Photo (Full-width, clean with hover physics) */}
        <div
          className="hero-anim-photo"
          style={{
            position: 'relative',
            width: '100%',
            height: 'clamp(320px, 52vw, 620px)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.07)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            backgroundColor: '#f3f4f6'
          }}
        >
          <img
            src="/images/projects_unique/proj_1.jpg"
            alt="Real London Kitchen Extension with Architectural Glazing"
            className="hero-project-img"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />

          {/* Minimalist discreet caption */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: 'clamp(1rem, 2.5vw, 1.75rem)',
              background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '0.5rem',
              color: '#ffffff'
            }}
          >
            <div>
              <div style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Ealing Kitchen Extension &amp; Garden Room
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'rgba(255, 255, 255, 0.85)', marginTop: '2px' }}>
                Crittall-Style Glazing · Underfloor Heating · London W13
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', color: '#ffffff', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Fixed JCT · £78,000
            </div>
          </div>
        </div>

        {/* Alluring Curiosity Scroll Cue (Draws eye smoothly downward) */}
        <div
          className="hero-scroll-cue"
          onClick={() => {
            const el = document.getElementById('selected-works');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.55rem',
            marginTop: 'clamp(2rem, 3.5vw, 3rem)',
            cursor: 'pointer',
            textAlign: 'center'
          }}
          role="button"
          tabIndex={0}
          aria-label="Scroll down to explore selected works"
        >
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#8e8e93',
              transition: 'color 0.2s ease'
            }}
          >
            Scroll to explore selected works
          </span>
          <div
            style={{
              width: '1px',
              height: '32px',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: '#dc2626',
                animation: 'scrollLineGlide 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite'
              }}
            />
          </div>
        </div>

      </div>

      {/* Tactile Contact Drawer (Pull-up half sheet on mobile / Right-side drawer on desktop) */}
      <ContactDrawer
        isOpen={isContactDrawerOpen}
        onClose={() => setIsContactDrawerOpen(false)}
      />
    </section>
  );
}

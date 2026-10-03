'use client';

import React, { useEffect } from 'react';

interface ContactDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactDrawer({ isOpen, onClose }: ContactDrawerProps) {
  // Prebuilt WhatsApp message (pre-filled in URL when tapped, but not displayed as a clutter box in UI)
  const prebuiltMessage =
    'Hi Prime Builds London, I would like to enquire about a fixed-price quote for my project (extension / loft / renovation).';
  const whatsappUrl = `https://wa.me/447767672807?text=${encodeURIComponent(prebuiltMessage)}`;
  const phoneTel = 'tel:+447767672807';
  const phoneNumberDisplay = '+44 7767 672807';

  // Close on Escape key & lock scroll when open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Solid Dark Backdrop Overlay (Zero glassmorphism, pure high-contrast overlay) */}
      <div
        className={`contact-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Main Drawer (Bottom sheet on mobile, Right side panel on desktop) */}
      <aside
        className={`contact-drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Direct Contact Desk"
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'radial-gradient(ellipse at 90% 0%, #fff1f2 0%, #ffffff 55%, #fafafa 100%)',
          position: 'fixed',
          overflow: 'hidden'
        }}
      >
        {/* Architectural 3px Red Brand Anchor Line at Top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            backgroundColor: '#dc2626',
            zIndex: 10
          }}
        />

        {/* Tactile Noise Texture Layer (Physical fine noise grain, zero glassmorphism) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/images/noise.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '130px 130px',
            opacity: 0.28,
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Mobile Pull-Down Indicator Bar */}
        <div className="contact-drawer-pull-bar-wrap" style={{ position: 'relative', zIndex: 2 }}>
          <div className="contact-drawer-pull-bar" />
        </div>

        {/* Header with Title and Top-Right Close Cross */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem 1rem 1.5rem',
            borderBottom: '1px solid rgba(0, 0, 0, 0.07)'
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#dc2626',
                marginBottom: '0.25rem'
              }}
            >
              Direct Site Desk — London
            </div>
            <h3
              style={{
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: '#1d1d1f',
                margin: 0
              }}
            >
              Get In Touch
            </h3>
          </div>

          {/* Top Right Close Button (Crisp Cross Option) */}
          <button
            onClick={onClose}
            aria-label="Close contact drawer"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#f4f4f5',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#1d1d1f',
              fontSize: '1.1rem',
              fontWeight: 500,
              transition: 'background-color 0.18s ease, transform 0.15s ease',
              flexShrink: 0
            }}
            className="contact-drawer-close-btn"
          >
            ✕
          </button>
        </div>

        {/* Content Body: Solid Architectural WhatsApp & Call Options (ZERO GLASSMORPHISM, ZERO ENQUIRY PREVIEW) */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '1.25rem 1.5rem 2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            flex: 1,
            overflowY: 'auto'
          }}
        >
          {/* OPTION 1: WhatsApp (Solid, Crisp, Direct) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              border: '1.5px solid #22c55e',
              borderRadius: '10px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
              boxShadow: '0 2px 8px rgba(34, 197, 94, 0.06)'
            }}
            className="contact-drawer-action-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* WhatsApp Icon Box */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15rem' }}>
                  WhatsApp Direct
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.015em' }}>
                  Text Us On WhatsApp
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: 500, marginTop: '0.1rem' }}>
                  Instant reply with site estimator
                </div>
              </div>
            </div>
            <span style={{ color: '#22c55e', fontSize: '1.25rem', fontWeight: 700 }}>›</span>
          </a>

          {/* OPTION 2: Direct Phone Call (Solid, Crisp, Direct) */}
          <a
            href={phoneTel}
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              border: '1.5px solid #dc2626',
              borderRadius: '10px',
              padding: '1.15rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
              boxShadow: '0 2px 8px rgba(220, 38, 38, 0.06)'
            }}
            className="contact-drawer-action-card"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* Phone Icon Box */}
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15rem' }}>
                  Call Us Directly
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.015em' }}>
                  {phoneNumberDisplay}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6e6e73', fontWeight: 500, marginTop: '0.1rem' }}>
                  Direct line to on-site management
                </div>
              </div>
            </div>
            <span style={{ color: '#dc2626', fontSize: '1.25rem', fontWeight: 700 }}>›</span>
          </a>

          {/* Sub-Info Box (Solid Slate, Zero Frosted Glass) */}
          <div
            style={{
              padding: '0.85rem 1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              fontSize: '0.78125rem',
              color: '#475569',
              lineHeight: 1.5,
              marginTop: '0.25rem'
            }}
          >
            <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#dc2626', display: 'inline-block' }} />
              <span>Fixed-Price JCT Guarantees</span>
            </div>
            Direct communication with our on-site team. We reply within 15 minutes during standard site hours (8:00 AM – 7:00 PM).
          </div>
        </div>
      </aside>
    </>
  );
}

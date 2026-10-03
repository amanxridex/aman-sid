'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface LondonSlide {
  quote: string;
  name: string;
  role: string;
  slug: string;
  projectName: string;
  image: string;
  metrics: {
    contractValue: string;
    timeline: string;
    variations: string;
    borough: string;
  };
}

const slides: LondonSlide[] = [
  {
    quote: 'In Central London heritage building, variation claims are usually rampant. Prime Build adhered strictly to our JCT fixed price. The craftsmanship in the basement excavation and bespoke Georgian joinery was world-class.',
    name: 'Charles Harrington',
    role: 'Asset Director, Harrington Asset Management',
    slug: 'mayfair-heritage-townhouse',
    projectName: 'The Mayfair Townhouse (W1K)',
    image: '/images/projects/london_residence_1.png',
    metrics: {
      contractValue: '£3.8M JCT Fixed',
      timeline: 'Completed On Programme',
      variations: '£0.00 (Zero Claims)',
      borough: 'City of Westminster'
    }
  },
  {
    quote: 'Prime Build delivered our 18,500 sq ft Shoreditch headquarters on an aggressive 14-week programme. Their project manager was on site every morning and gave our team real-time visibility into every trade.',
    name: 'Alistair Vance',
    role: 'Chief Operating Officer, Voxel Group',
    slug: 'shoreditch-commercial-fitout',
    projectName: 'The Shoreditch Creative HQ (EC2A)',
    image: '/images/projects/project_2.jpg',
    metrics: {
      contractValue: '£2.6M CAT-A/B',
      timeline: '14 Weeks (2 Wks Early)',
      variations: '£0.00 (Zero Claims)',
      borough: 'Hackney / Tech City'
    }
  },
  {
    quote: 'The level of craftsmanship in the cantilevered staircase and bespoke marble finishes is breath-taking. Prime Build exceeded every technical expectation of our architect and private client.',
    name: 'Julian Thorne, RIBA',
    role: 'Principal, Thorne Architecture & Interiors',
    slug: 'battersea-riverside-penthouse',
    projectName: 'Battersea Riverside Duplex (SW11)',
    image: '/images/projects/project_7.jpg',
    metrics: {
      contractValue: '£1.9M Luxury Turnkey',
      timeline: 'Delivered On Schedule',
      variations: '£0.00 (Zero Claims)',
      borough: 'Wandsworth Riverside'
    }
  },
  {
    quote: 'We commissioned Prime Build for a high-spec CAT-B fitout in Fitzrovia. Clean lines, flawless acoustic partitions, and zero disruption to neighboring office tenants.',
    name: 'Eleanor Sterling',
    role: 'Managing Partner, Sterling Capital LLP',
    slug: 'fitzrovia-workplace',
    projectName: 'Fitzrovia Financial Suites (W1W)',
    image: '/images/projects/project_9.jpg',
    metrics: {
      contractValue: '£2.4M CAT-B Fitout',
      timeline: '11 Weeks On Budget',
      variations: '£0.00 (Zero Claims)',
      borough: 'Camden / Fitzrovia'
    }
  }
];

export default function TestimonialSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <section style={{ padding: '4.5rem 0', backgroundColor: '#f9fafb', width: '100%', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626', letterSpacing: '0.08em' }}>
              Client Case Studies
            </span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0.4rem 0 0 0', color: '#14151a' }}>
              Proven results across landmark London locations
            </h2>
          </div>

          {/* Slider Arrows */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              style={{
                width: '2.75rem',
                height: '2.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.15)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                transition: 'all 0.15s ease'
              }}
            >
              ←
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              style={{
                width: '2.75rem',
                height: '2.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.15)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                transition: 'all 0.15s ease'
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Slide Display (Solid dark architectural card) */}
        <div
          className="responsive-card responsive-grid-2"
          style={{
            backgroundColor: '#14151a',
            color: '#ffffff',
            borderRadius: '1.25rem',
            alignItems: 'stretch',
            gap: '2.5rem',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.2)'
          }}
        >
          {/* Quote & Author */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#dc2626', marginBottom: '1rem', backgroundColor: '#7f1d1d', display: 'inline-block', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
                {slide.projectName}
              </div>
              <p style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)', fontWeight: 500, lineHeight: 1.55, margin: '0 0 1.5rem 0', fontStyle: 'italic', color: '#f3f4f6' }}>
                &ldquo;{slide.quote}&rdquo;
              </p>
              <div>
                <div style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#ffffff' }}>{slide.name}</div>
                <div style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '2px' }}>{slide.role}</div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Link
                href={`/case-studies/${slide.slug}`}
                className="btn-red"
                style={{
                  fontSize: '0.8125rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                <span>Read Full Case Study</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Image & Contractual Parameters Box */}
          <div
            style={{
              backgroundColor: '#1a1d26',
              borderRadius: '1rem',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Real Project Photo Header */}
            <div
              style={{
                height: '180px',
                width: '100%',
                background: `linear-gradient(to top, rgba(26,29,38,1) 0%, transparent 60%), url(${slide.image}) center/cover no-repeat`,
                position: 'relative',
                padding: '0.85rem'
              }}
            >
              <span
                style={{
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '4px',
                  backdropFilter: 'blur(4px)'
                }}
              >
                Handover Photography
              </span>
            </div>

            {/* Contractual Parameters Grid */}
            <div style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9ca3af', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.5rem' }}>
                Contractual Verification:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>Contract Sum</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>{slide.metrics.contractValue}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>Client Variations</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#dc2626', marginTop: '2px' }}>{slide.metrics.variations}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>Programme Timeline</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{slide.metrics.timeline}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>Borough Authority</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#dc2626', marginTop: '2px' }}>{slide.metrics.borough}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

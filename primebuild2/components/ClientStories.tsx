'use client';

import React from 'react';

export default function ClientStories() {
  const testimonials = [
    {
      quote: 'Prime Build completed our 18,500 sq ft Shoreditch headquarters two weeks ahead of programme with zero variation claims. Unprecedented discipline for a Central London contractor.',
      author: 'Alistair Vance',
      role: 'Chief Operating Officer, Voxel Group',
      location: 'Shoreditch, EC2A'
    },
    {
      quote: 'As lead architects, we require a contractor who respects structural tolerances, party wall acoustic isolation, and heritage fabric. Their site management was exemplary.',
      author: 'Julian Thorne, RIBA',
      role: 'Principal, Thorne Architecture',
      location: 'Battersea & Kensington'
    },
    {
      quote: 'Underpinning a historic Victorian mews adjacent to sensitive neighbours was a delicate operation. Prime Build kept the neighbours informed and delivered an immaculate finish.',
      author: 'Dr. Claire Beauchamp',
      role: 'Private Client',
      location: 'South Kensington, SW7'
    }
  ];

  return (
    <section style={{ backgroundColor: '#fbfbfa', color: '#1d1d1f', padding: 'clamp(4rem, 8vw, 7rem) 0', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Main Feature Quote */}
        <div style={{ maxWidth: '920px', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6e6e73', marginBottom: '1.25rem' }}>
            Client Perspective
          </div>
          
          <blockquote style={{ margin: 0, padding: 0 }}>
            <p
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)',
                fontWeight: 500,
                letterSpacing: '-0.025em',
                lineHeight: 1.3,
                color: '#1d1d1f',
                margin: '0 0 1.75rem 0'
              }}
            >
              &ldquo;In Central London heritage building, variation claims are usually rampant. Prime Build adhered strictly to their JCT fixed price. The craftsmanship in the basement excavation and bespoke joinery was world-class.&rdquo;
            </p>
            <footer>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1d1d1f' }}>
                Charles Harrington
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6e6e73', marginTop: '2px' }}>
                Asset Director, Harrington Asset Management • Upper Brook St, Mayfair W1
              </div>
            </footer>
          </blockquote>
        </div>

        {/* 3 Secondary Quotes in Clean Editorial Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(2rem, 4vw, 3.5rem)',
            borderTop: '1px solid rgba(0,0,0,0.08)',
            paddingTop: '2.5rem'
          }}
        >
          {testimonials.map((t, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1d1d1f' }}>{t.author}</div>
                <div style={{ fontSize: '0.75rem', color: '#6e6e73', marginTop: '2px' }}>{t.role} • {t.location}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';

const services = [
  {
    num: '01',
    title: 'House Extensions',
    desc: 'Rear kitchen extensions, side returns, and wraparounds with steel RSJ beams, Crittall-style doors, and rooflights.',
    budget: 'From £55,000'
  },
  {
    num: '02',
    title: 'Loft Conversions',
    desc: 'Dormer, mansard, and Velux loft conversions adding master bedrooms, en-suites, and built-in storage.',
    budget: 'From £45,000'
  },
  {
    num: '03',
    title: 'Kitchen & Interior Renovations',
    desc: 'Full ground-floor remodels, open-plan structural knock-throughs, custom islands, and architectural lighting.',
    budget: 'From £30,000'
  },
  {
    num: '04',
    title: 'Bathroom Refurbishments',
    desc: 'Walk-in wet rooms, Italian porcelain tiling, concealed valves, underfloor heating, and microcement finishes.',
    budget: 'From £18,000'
  }
];

export default function ServicesEditorial() {
  return (
    <section style={{ backgroundColor: '#fbfbfa', color: '#1d1d1f', padding: 'clamp(3.5rem, 7vw, 6rem) 0', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Header */}
        <div className="scroll-reveal" style={{ maxWidth: '720px', marginBottom: 'clamp(2rem, 4vw, 3.5rem)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6e6e73', marginBottom: '0.5rem' }}>
            What We Do
          </div>
          <h2 style={{ fontSize: 'clamp(1.85rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, margin: 0, color: '#1d1d1f' }}>
            Residential construction across London.
          </h2>
        </div>

        {/* 4 Clean Minimal Columns (No card borders, no heavy text) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'clamp(2rem, 4vw, 3rem)'
          }}
        >
          {services.map((svc, idx) => (
            <div key={idx} className={`scroll-reveal scroll-reveal-delay-${idx + 1}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#dc2626', display: 'block', marginBottom: '0.75rem' }}>
                  {svc.num}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 0.5rem 0', color: '#1d1d1f' }}>
                  {svc.title}
                </h3>
                <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.55, margin: '0 0 1rem 0' }}>
                  {svc.desc}
                </p>
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#dc2626' }}>
                  {svc.budget}
                </span>
                <Link
                  href="/demo"
                  style={{
                    color: '#1d1d1f',
                    textDecoration: 'none',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span>Inquire</span>
                  <span style={{ color: '#dc2626' }}>›</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

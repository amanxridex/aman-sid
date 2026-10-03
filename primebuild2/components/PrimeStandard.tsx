'use client';

import React from 'react';
import Link from 'next/link';

export default function PrimeStandard() {
  const principles = [
    {
      number: '01',
      title: 'Fixed-Price JCT Contracts.',
      description: 'We reject the industry practice of low tendering followed by aggressive variation claims. Every scope item, material specification, and trade cost is locked upfront under standard JCT agreements. What we quote is what you pay.'
    },
    {
      number: '02',
      title: 'Daily On-Site Supervision.',
      description: 'You will never have to chase subcontractors or wonder who is in charge. A dedicated, qualified project manager is on your site every working day, ensuring architectural tolerances and building regulation compliance.'
    },
    {
      number: '03',
      title: '10-Year Insurance Warranty.',
      description: 'We do not walk away at handover. Every completed residential scheme receives full London borough Building Control completion sign-off, comprehensive O&M manuals, and a 10-year insurance-backed structural guarantee.'
    }
  ];

  return (
    <section style={{ backgroundColor: '#fbfbfa', color: '#1d1d1f', padding: 'clamp(4rem, 8vw, 7rem) 0', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Section Heading */}
        <div style={{ maxWidth: '800px', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6e6e73', marginBottom: '0.75rem' }}>
            The Standard
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 1.25rem 0', color: '#1d1d1f' }}>
            Construction engineered with institutional discipline.
          </h2>
          <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', color: '#4b5563', lineHeight: 1.6, margin: 0, fontWeight: 400 }}>
            Three non-negotiable principles that protect your budget, timeline, and property value from day one.
          </p>
        </div>

        {/* 3 Spacious Columns (Apple style, zero cards, zero borders around boxes) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(2.5rem, 5vw, 4.5rem)'
          }}
        >
          {principles.map((p, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#dc2626', marginBottom: '1.25rem', letterSpacing: '0.04em' }}>
                {p.number}
              </div>
              <h3 style={{ fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 1rem 0', color: '#1d1d1f', lineHeight: 1.3 }}>
                {p.title}
              </h3>
              <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.65, margin: 0, fontWeight: 400 }}>
                {p.description}
              </p>
            </div>
          ))}
        </div>

        {/* Apple-style discreet link */}
        <div style={{ marginTop: 'clamp(2.5rem, 5vw, 4rem)', paddingTop: '2.5rem', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          <Link
            href="/how-owner-works"
            style={{
              color: '#1d1d1f',
              textDecoration: 'none',
              fontSize: '0.9375rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>Learn how we manage contracts &amp; site execution</span>
            <span style={{ color: '#dc2626' }}>›</span>
          </Link>
        </div>

      </div>
    </section>
  );
}

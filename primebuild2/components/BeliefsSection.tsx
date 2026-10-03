'use client';

import React from 'react';
import Link from 'next/link';

const steps = [
  {
    step: '01',
    title: 'Free Site Survey & Feasibility',
    timeline: 'Within 48 Hours',
    description: 'We meet you at your London property to inspect the site, review architectural drawings, and assess structural, party wall, and planning requirements.'
  },
  {
    step: '02',
    title: 'Fixed-Price JCT Tender',
    timeline: '5 – 7 Working Days',
    description: 'You receive an itemised, transparent quotation down to the penny. We lock this into a standard JCT contract with a guaranteed completion date and zero hidden costs.'
  },
  {
    step: '03',
    title: 'Daily Site Management & Weekly Updates',
    timeline: 'Active Programme',
    description: 'Your dedicated site manager oversees trades daily. Every Friday, you receive a photographic and video progress report directly to your phone.'
  },
  {
    step: '04',
    title: 'Building Control Sign-Off & Handover',
    timeline: 'Keys In Hand',
    description: 'We obtain all Building Control completion certificates, perform full snagging, professionally deep clean the property, and issue your 10-year structural warranty.'
  }
];

export default function BeliefsSection() {
  return (
    <section className="responsive-section" style={{ backgroundColor: '#ffffff', width: '100%', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        <div className="responsive-grid-2" style={{ alignItems: 'flex-start' }}>
          
          {/* Left Column: Heading & Trust */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#dc2626', marginBottom: '0.5rem' }}>
              How We Work
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 1.25rem 0', color: '#14151a' }}>
              A straightforward, transparent building process
            </h2>
            <p style={{ fontSize: '1.0625rem', color: '#4b5563', lineHeight: 1.6, margin: '0 0 2rem 0' }}>
              We have eliminated the stress, delays, and budget surprises that plague Central London construction. From your first site survey to final sign-off, our team keeps your build on track and on budget.
            </p>

            {/* Quick Conversion Box */}
            <div style={{ backgroundColor: '#f9fafb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '1rem', padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#14151a', marginBottom: '0.5rem' }}>
                Ready to discuss your project?
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Our senior estimators are available to review your drawings and provide preliminary cost guidance.
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/demo" className="btn-green" style={{ fontSize: '0.875rem', padding: '0.65rem 1.35rem' }}>
                  Request Site Survey
                </Link>
                <a href="tel:+447767672807" className="btn-outline-dark" style={{ fontSize: '0.875rem', padding: '0.65rem 1.35rem' }}>
                  +44 7767 672807
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#6b7280', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>✓</span>
                <span>No obligation</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>✓</span>
                <span>Fixed-price quote</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>✓</span>
                <span>Free site visit</span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Clean Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {steps.map((st) => (
              <div
                key={st.step}
                style={{
                  backgroundColor: '#f9fafb',
                  borderRadius: '1rem',
                  padding: '1.75rem',
                  border: '1px solid rgba(0,0,0,0.08)',
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start'
                }}
              >
                <div
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 900,
                    color: '#dc2626',
                    backgroundColor: '#fef2f2',
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {st.step}
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#14151a' }}>
                      {st.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#dc2626', backgroundColor: '#fef2f2', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                      {st.timeline}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.55, margin: 0 }}>
                    {st.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}

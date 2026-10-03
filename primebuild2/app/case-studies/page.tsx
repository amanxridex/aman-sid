'use client';

import React from 'react';
import Link from 'next/link';
import { CASE_STUDIES } from '@/lib/caseStudiesData';

export default function CaseStudiesPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: 'clamp(3rem, 6vw, 5rem) 0', width: '100%' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Minimal Header */}
        <div style={{ maxWidth: '780px', margin: '0 auto clamp(2.5rem, 5vw, 4rem) auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', color: '#6e6e73', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>
            Portfolio
          </div>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 1rem 0', lineHeight: 1.15, color: '#1d1d1f' }}>
            Recent London home projects.
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#4b5563', lineHeight: 1.55, maxWidth: '580px', margin: '0 auto' }}>
            Real extensions, loft conversions, and full house renovations delivered on guaranteed fixed-price contracts.
          </p>
        </div>

        {/* Real Projects Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2rem, 3.5vw, 3rem)'
          }}
        >
          {CASE_STUDIES.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Photo Box */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 'clamp(240px, 30vw, 340px)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}
              >
                <img
                  src={study.image}
                  alt={study.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />
              </div>

              {/* Minimal Clean Metadata */}
              <div style={{ paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.015em', margin: '0 0 0.25rem 0', color: '#1d1d1f' }}>
                    {study.name}
                  </h3>
                  <div style={{ fontSize: '0.8125rem', color: '#6e6e73' }}>
                    {study.locations} • {study.cuisine}
                  </div>
                </div>

                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#dc2626', whiteSpace: 'nowrap' }}>
                  {study.heroStat}
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

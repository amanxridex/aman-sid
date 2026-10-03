'use client';

import React from 'react';

interface LondonReview {
  quote: string;
  author: string;
  clientType: string;
  location: string;
  projectScope: string;
}

const reviewsRow1: LondonReview[] = [
  {
    quote: 'Prime Build completed our 18,500 sq ft Shoreditch commercial fit-out 2 weeks ahead of programme with zero variation invoices. Unprecedented discipline for a London contractor.',
    author: 'Alistair Vance',
    clientType: 'Commercial Property Fund',
    location: 'Shoreditch, London EC2A',
    projectScope: '£2.6M CAT-B Fitout'
  },
  {
    quote: 'In Central London heritage conservation, builders usually flood you with variations the second floorboards come up. Prime Build adhered strictly to their fixed JCT price down to the pound.',
    author: 'Charles Harrington',
    clientType: 'Private Client',
    location: 'Mayfair, London W1K',
    projectScope: '£3.8M Townhouse Renovation'
  },
  {
    quote: 'As project architects, we need a main contractor who respects structural tolerances and acoustic detailing. Their site manager was on top of every trade daily.',
    author: 'Julian Thorne, RIBA',
    clientType: 'Lead Architect',
    location: 'Battersea, London SW11',
    projectScope: '£1.9M Luxury Duplex'
  }
];

const reviewsRow2: LondonReview[] = [
  {
    quote: 'Having one dedicated site manager who answered my calls directly rather than dealing with layers of corporate bureaucracy made all the difference on our Charlotte Street project.',
    author: 'Rupert Sterling',
    clientType: 'Workplace Director',
    location: 'Fitzrovia, London W1W',
    projectScope: '£2.4M Financial Offices'
  },
  {
    quote: 'Underpinning a historic Victorian mews adjacent to sensitive neighbors was nerve-wracking. Prime Build kept the neighbors happy and delivered a flawless finish.',
    author: 'Dr. Claire Beauchamp',
    clientType: 'Homeowner',
    location: 'South Kensington, London SW7',
    projectScope: '£1.6M Extension & Mews'
  },
  {
    quote: 'Weekly photo and video walkthroughs sent every Friday made tracking our property renovation effortless while I was traveling abroad. Exceptional communication.',
    author: 'Edward Thornton',
    clientType: 'Private Client',
    location: 'Chelsea, London SW3',
    projectScope: 'Full Apartment Refurbishment'
  }
];

const ukBadges = [
  'CIOB Chartered Standards',
  'CHAS Elite Certified',
  'SafeContractor Approved',
  'Constructionline Gold',
  'Considerate Constructors Scheme',
  'JCT Fixed-Price Contract Standard',
  '10-Year Insurance-Backed Warranty',
  'Building Regulations Part B & L Compliant'
];

export default function ReviewsMarquee() {
  const row1 = [...reviewsRow1, ...reviewsRow1];
  const row2 = [...reviewsRow2, ...reviewsRow2];

  return (
    <section style={{ padding: '5rem 0', backgroundColor: '#ffffff', overflow: 'hidden', width: '100%', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      
      {/* Header */}
      <div style={{ maxWidth: '1240px', margin: '0 auto 3rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#dc2626', marginBottom: '0.75rem' }}>
          ★ 4.9 / 5.0 Rating Across London Projects
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 1rem 0', color: '#14151a' }}>
          Trusted by London homeowners, developers & architects
        </h2>
        <p style={{ fontSize: '1.125rem', color: '#4b5563', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
          Real feedback from property owners who chose Prime Build for our guaranteed fixed pricing, dedicated managers, and on-time handovers.
        </p>

        {/* Accreditations Row */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.625rem', marginTop: '2rem' }}>
          {ukBadges.map((badge, bIdx) => (
            <div
              key={bIdx}
              style={{
                backgroundColor: '#f9fafb',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '6px',
                padding: '0.4rem 0.85rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#14151a',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span style={{ color: '#dc2626', fontWeight: 800 }}>✓</span>
              <span>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 1 */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden', marginBottom: '1.25rem' }}>
        <div className="marquee-track-left" style={{ gap: '1.25rem' }}>
          {row1.map((rev, idx) => (
            <div
              key={idx}
              style={{
                width: 'clamp(18rem, 85vw, 26rem)',
                backgroundColor: '#f9fafb',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '1.25rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, margin: '0 0 1.5rem 0', fontStyle: 'italic' }}>
                &ldquo;{rev.quote}&rdquo;
              </p>
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#14151a' }}>{rev.author}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{rev.clientType} • {rev.location}</div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', backgroundColor: '#fef2f2', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                  {rev.projectScope}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <div className="marquee-track-right" style={{ gap: '1.25rem' }}>
          {row2.map((rev, idx) => (
            <div
              key={idx}
              style={{
                width: 'clamp(18rem, 85vw, 26rem)',
                backgroundColor: '#f9fafb',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '1.25rem',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
              }}
            >
              <p style={{ fontSize: '0.9375rem', color: '#374151', lineHeight: 1.6, margin: '0 0 1.5rem 0', fontStyle: 'italic' }}>
                &ldquo;{rev.quote}&rdquo;
              </p>
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#14151a' }}>{rev.author}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>{rev.clientType} • {rev.location}</div>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', backgroundColor: '#fef2f2', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>
                  {rev.projectScope}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}

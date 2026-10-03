import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Fixed Pricing | PRIME BUILD LONDON',
  description: 'Fixed-Price JCT Construction Standard. Compare Prime Build London guaranteed contracts vs traditional low-ball builders.'
};

export default function PricingPage() {
  return (
    <div style={{ padding: '5rem 0', minHeight: '80vh', backgroundColor: '#ffffff', width: '100%' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Header */}
        <div style={{ maxWidth: '840px', margin: '0 auto 4rem auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#dc2626', marginBottom: '1rem' }}>
            Fixed-Price JCT Contract Standard
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 1.25rem 0', lineHeight: 1.15, color: '#14151a' }}>
            Fixed-price contracts that eliminate surprise variation invoices
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#4b5563', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
            Unlike traditional London builders who tender low to win bids and then charge 25% to 40% in variations once demolition starts, Prime Build provides locked scope and cost certainty from day one.
          </p>
        </div>

        {/* Pricing Comparison Cards */}
        <div className="responsive-grid-2" style={{ marginBottom: '4rem' }}>
          
          {/* Card 1: Traditional Builders */}
          <div className="responsive-card scroll-reveal" style={{ backgroundColor: '#f9fafb', borderRadius: '1.5rem', border: '1px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#6b7280', marginBottom: '0.5rem' }}>
              The Traditional Habit
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#14151a' }}>
              Typical Cost-Plus Builders
            </h3>
            <div style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, margin: '1rem 0', color: '#ef4444', lineHeight: 1.2 }}>
              +25% to 40%
              <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.35rem' }}>
                Unplanned Variation Costs
              </span>
            </div>
            <p style={{ color: '#4b5563', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Low tenders riddled with provisional sums, exclusions for structural steel, and surprise invoices once walls are down.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9375rem', color: '#374151' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <span style={{ color: '#9ca3af', fontWeight: 800 }}>✕</span>
                <span>Unforeseen variation claims midway through the build</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <span style={{ color: '#9ca3af', fontWeight: 800 }}>✕</span>
                <span>Clients forced to chase for site updates and progress</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <span style={{ color: '#9ca3af', fontWeight: 800 }}>✕</span>
                <span>Junior managers running sites with zero executive presence</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <span style={{ color: '#9ca3af', fontWeight: 800 }}>✕</span>
                <span>Unclear completion dates dragging weeks past deadline</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Prime Build */}
          <div className="responsive-card scroll-reveal scroll-reveal-delay-1" style={{ backgroundColor: '#14151a', color: '#ffffff', borderRadius: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-0.75rem', right: '1.5rem', backgroundColor: '#dc2626', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 800, padding: '0.35rem 0.85rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              FIXED JCT STANDARD
            </div>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em', color: '#dc2626', marginBottom: '0.5rem' }}>
              The Prime Builds Guarantee
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#ffffff' }}>
              Prime Builds JCT Contract
            </h3>
            <div style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800, margin: '1rem 0', color: '#ffffff', lineHeight: 1.2 }}>
              100% Fixed Price
              <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.35rem' }}>
                Zero Surprise Variations
              </span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Exhaustive pre-construction surveying and legally binding JCT contracts ensure absolute budget and timeline security.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9375rem', color: '#e2e8f0' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>✓</span>
                <span>Guaranteed fixed price written into your binding JCT contract</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>✓</span>
                <span>Dedicated on-site project manager supervising trades daily</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>✓</span>
                <span>Weekly Friday video and photo progress walkthroughs</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
                <span style={{ color: '#dc2626', fontWeight: 800 }}>✓</span>
                <span>Full Building Control certificates &amp; 10-year structural warranty</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Cost Planning Table */}
        <div className="responsive-card" style={{ backgroundColor: '#f9fafb', borderRadius: '1.5rem', border: '1px solid rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 800, margin: '0 0 1rem 0', color: '#14151a' }}>
            London Construction Cost Guidelines (2026 Benchmarks)
          </h2>
          <div style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '1rem' }}>
            ⇄ Scroll horizontally to view all cost columns
          </div>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '550px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid rgba(0,0,0,0.1)' }}>
                  <th style={{ padding: '1rem', color: '#14151a', fontWeight: 700 }}>Project Typology</th>
                  <th style={{ padding: '1rem', color: '#14151a', fontWeight: 700 }}>Typical Boroughs</th>
                  <th style={{ padding: '1rem', color: '#14151a', fontWeight: 700 }}>Cost Guideline</th>
                  <th style={{ padding: '1rem', color: '#14151a', fontWeight: 700 }}>Prime Build Standard</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 600, color: '#14151a' }}>Prime Residential Refurbishment</td>
                  <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>Mayfair, Kensington, Chelsea, Hampstead</td>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#dc2626' }}>£180 – £350 / sq ft</td>
                  <td style={{ padding: '1.25rem 1rem', color: '#dc2626', fontWeight: 600 }}>Fixed JCT Contract</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 600, color: '#14151a' }}>House Extension & Loft Conversion</td>
                  <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>Wandsworth, Richmond, Fulham, Camden</td>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#dc2626' }}>£210 – £380 / sq ft</td>
                  <td style={{ padding: '1.25rem 1rem', color: '#dc2626', fontWeight: 600 }}>10-Yr Structural Warranty</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 600, color: '#14151a' }}>Commercial CAT-A / CAT-B Fitout</td>
                  <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>City of London, Shoreditch, Soho</td>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#dc2626' }}>£120 – £220 / sq ft</td>
                  <td style={{ padding: '1.25rem 1rem', color: '#dc2626', fontWeight: 600 }}>Fast-Track Programme</td>
                </tr>
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 600, color: '#14151a' }}>Basement Excavation & Underpinning</td>
                  <td style={{ padding: '1.25rem 1rem', color: '#4b5563' }}>Westminster, RBKC, Camden</td>
                  <td style={{ padding: '1.25rem 1rem', fontWeight: 700, color: '#dc2626' }}>£300 – £600 / sq ft</td>
                  <td style={{ padding: '1.25rem 1rem', color: '#dc2626', fontWeight: 600 }}>Party Wall Award Compliant</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '2.5rem', textAlign: 'center', display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/demo"
              style={{
                textDecoration: 'none',
                color: '#ffffff',
                backgroundColor: '#dc2626',
                padding: '0.85rem 2rem',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'opacity 0.2s ease'
              }}
            >
              <span>Request Free Site Survey &amp; Fixed Quote</span>
              <span>›</span>
            </Link>
            <a
              href="tel:+447767672807"
              style={{
                textDecoration: 'none',
                color: '#1d1d1f',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                padding: '0.85rem 1.6rem',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>+44 7767 672807</span>
              <span style={{ color: '#dc2626' }}>›</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

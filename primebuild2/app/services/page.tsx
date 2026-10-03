import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Services | PRIME BUILDS LONDON',
  description: 'London residential building services: Architect-led Kitchen Extensions, Loft Conversions, House Renovations, and Structural Openings under fixed-price JCT contracts.'
};

export default function ServicesPage() {
  const services = [
    {
      number: '01',
      title: 'Kitchen & Side-Return Extensions',
      tag: 'Wandsworth • Ealing • Clapham',
      image: '/images/projects_unique/proj_9.jpg',
      description: 'Single-storey rear extensions, side returns, and wraparound living spaces with steel RSJ beams, Crittall-style doors, and rooflights.',
      features: [
        'Steel beam installation and structural opening',
        'Slimline aluminium bifold and Crittall doors',
        'Underfloor heating & architectural flat rooflights',
        'Full council planning or Permitted Development handling'
      ],
      typicalValue: 'From £55,000 Fixed'
    },
    {
      number: '02',
      title: 'Dormer & Mansard Loft Conversions',
      tag: 'Richmond • Chiswick • Fulham',
      image: '/images/projects_unique/proj_14.jpg',
      description: 'Transform unused attic space into spacious master bedrooms, luxury en-suite wet rooms, and custom eaves storage.',
      features: [
        'Rear dormer, hip-to-gable, and mansard designs',
        'Velux rooflights and floor-to-ceiling Juliet balconies',
        'En-suite bathrooms with walk-in showers & tiling',
        'Building Regulations certificate and 10-year warranty'
      ],
      typicalValue: 'From £45,000 Fixed'
    },
    {
      number: '03',
      title: 'Complete House Renovations',
      tag: 'Islington • Camden • Putney',
      image: '/images/projects_unique/proj_4.jpg',
      description: 'Full ground-floor remodels, open-plan structural knock-throughs, kitchen diner redesigns, and premium engineered oak flooring.',
      features: [
        'Internal wall removal & structural calculations',
        'Modern kitchen cabinetry & central dining islands',
        'Rewiring, plumbing, and heating modernisation',
        'Dedicated on-site foreman every working day'
      ],
      typicalValue: 'From £35,000 Fixed'
    },
    {
      number: '04',
      title: 'Structural Openings & Glazing',
      tag: 'South & West London',
      image: '/images/projects_unique/proj_11.jpg',
      description: 'Creating seamless indoor-outdoor connections with flush garden thresholds, structural glass roofs, and load-bearing alterations.',
      features: [
        'Load-bearing masonry removal and padstones',
        'Flush patio thresholds and outdoor garden integration',
        'Structural engineer calculations and sign-offs',
        'JCT Minor Works fixed-price contract protection'
      ],
      typicalValue: 'From £20,000 Fixed'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: 'clamp(3rem, 6vw, 5rem) 0 clamp(4rem, 8vw, 6rem) 0', width: '100%' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Minimal Header */}
        <div style={{ maxWidth: '760px', margin: '0 auto clamp(2.5rem, 5vw, 4rem) auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6e6e73', marginBottom: '0.75rem' }}>
            Residential Services
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.75rem)', fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 1rem 0', lineHeight: 1.15, color: '#1d1d1f' }}>
            London home extensions &amp; renovations.
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: '#4b5563', lineHeight: 1.55, maxWidth: '560px', margin: '0 auto 2rem auto', fontWeight: 400 }}>
            Guaranteed fixed prices, dedicated trades, and clear weekly milestones for residential homeowners.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>Book Site Survey</span>
              <span>›</span>
            </Link>
            <Link
              href="/case-studies"
              style={{
                textDecoration: 'none',
                color: '#1d1d1f',
                border: '1.5px solid rgba(0,0,0,0.15)',
                padding: '0.75rem 1.6rem',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              View Recent Projects
            </Link>
          </div>
        </div>

        {/* Services List - Clean Light Theme Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {services.map((svc, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#fbfbfa',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: '16px',
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                alignItems: 'center'
              }}
            >
              {/* Left Column: Details */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626' }}>{svc.number}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6e6e73' }}>
                      {svc.tag}
                    </span>
                  </div>

                  <h2 style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25, margin: '0 0 0.75rem 0', color: '#1d1d1f' }}>
                    {svc.title}
                  </h2>

                  <p style={{ fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.6, margin: '0 0 1.25rem 0' }}>
                    {svc.description}
                  </p>
                  
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {svc.features.map((feat, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#374151', lineHeight: 1.4 }}>
                        <span style={{ color: '#dc2626', fontWeight: 700, flexShrink: 0 }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#dc2626' }}>
                    {svc.typicalValue}
                  </span>
                  <Link
                    href="/demo"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      color: '#1d1d1f',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.875rem'
                    }}
                  >
                    <span>Request Estimate</span>
                    <span style={{ color: '#dc2626' }}>›</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Unique Project Photo */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 'clamp(240px, 28vw, 340px)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.06)'
                }}
              >
                <img
                  src={svc.image}
                  alt={svc.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '0.85rem',
                    left: '0.85rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(8px)',
                    color: '#1d1d1f',
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px'
                  }}
                >
                  Fixed-Price JCT
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Clean Light Theme Consultation Banner (No black card!) */}
        <div
          style={{
            marginTop: 'clamp(3rem, 6vw, 5rem)',
            backgroundColor: '#fbfbfa',
            color: '#1d1d1f',
            borderRadius: '16px',
            padding: 'clamp(2.5rem, 5vw, 4rem) 1.5rem',
            textAlign: 'center',
            border: '1px solid rgba(0,0,0,0.06)'
          }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6e6e73', marginBottom: '0.5rem' }}>
            London Site Consultation
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 0.85rem 0', color: '#1d1d1f' }}>
            Ready to plan your extension or renovation?
          </h2>
          <p style={{ color: '#4b5563', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 1.75rem auto', lineHeight: 1.6 }}>
            Our estimators survey your property and provide an itemised fixed-price quote within 5 working days.
          </p>
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
              gap: '0.35rem',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)'
            }}
          >
            <span>Book Free Site Survey</span>
            <span>›</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

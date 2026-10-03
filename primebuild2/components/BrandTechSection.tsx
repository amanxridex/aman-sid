'use client';

import React from 'react';
import Link from 'next/link';

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  timeline: string;
  boroughs: string;
  image: string;
  features: string[];
}

const servicesList: ServiceItem[] = [
  {
    id: 'residential',
    title: 'Prime Residential Renovations',
    subtitle: 'Townhouses, Period Villas & Luxury Apartments',
    description: 'Complete turnkey architectural refurbishment. We restore heritage features while integrating modern luxury, underfloor heating, bespoke kitchens, and Italian marble bathrooms.',
    timeline: '12 – 24 Weeks',
    boroughs: 'Mayfair, Kensington, Chelsea, Hampstead',
    image: '/images/projects/project_1.jpg',
    features: [
      'Full architectural interior remodelling & space planning',
      'Heritage restoration complying with Grade-II & Conservation rules',
      'Bespoke architectural joinery, smart home & Lutron lighting',
      'Luxury bathroom & kitchen supply and installation'
    ]
  },
  {
    id: 'extensions',
    title: 'House Extensions & Glass Pavilions',
    subtitle: 'Rear Extensions, Side Returns & Mansard Lofts',
    description: 'Expand your London property’s living area and increase capital value. We manage the entire build from foundation excavation to architectural glazing installation.',
    timeline: '10 – 16 Weeks',
    boroughs: 'Wandsworth, Richmond, Fulham, Islington',
    image: '/images/projects/london_residence_1.png',
    features: [
      'Single & multi-storey rear kitchen extensions',
      'Structural steel RSJ installations & open-plan spaces',
      'Slimline Crittall-style doors & walk-on rooflights',
      'Full planning permission & Building Regulations sign-off'
    ]
  },
  {
    id: 'commercial',
    title: 'Commercial & Workplace Fit-Outs',
    subtitle: 'CAT-A & CAT-B Office & Retail Spaces',
    description: 'Fast-track commercial refurbishment for property funds, creative agencies, and corporate headquarters. Engineered for minimal downtime and immaculate corporate finishes.',
    timeline: '8 – 16 Weeks',
    boroughs: 'City of London, Shoreditch, Soho, Fitzrovia',
    image: '/images/projects/project_2.jpg',
    features: [
      'CAT-A landlord warm-shell preparations & CAT-B tenant fitouts',
      'Acoustic glass partitioning (Rw 48dB – 54dB)',
      'Complete mechanical, electrical & HVAC integration',
      'Considerate Constructors Scheme certified delivery'
    ]
  },
  {
    id: 'structural',
    title: 'Basements & Subterranean Living',
    subtitle: 'Retrofit Basements, Underpinning & RSJ Frameworks',
    description: 'Specialist subterranean excavation under Central London properties. We handle party wall agreements, contiguous piling, and cavity drain waterproofing membranes.',
    timeline: '16 – 32 Weeks',
    boroughs: 'Kensington (RBKC), Westminster, Camden',
    image: '/images/projects/london_residence_7.webp',
    features: [
      'Retrofit basement excavations & contiguous flight piling',
      'BS 8102 Type C cavity drainage & sump pump systems',
      'Major structural steel needle & beam installations',
      'Subterranean swimming pools, gyms, cinemas & wine vaults'
    ]
  }
];

export default function BrandTechSection() {
  return (
    <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff', width: '100%', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#dc2626', marginBottom: '0.5rem' }}>
            Comprehensive London Building Capability
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 1rem 0', color: '#14151a', lineHeight: 1.2 }}>
            Master builders for London’s most challenging schemes
          </h2>
          <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
            From Grade-II listed Mayfair townhouses to deep subterranean basements in Kensington, our chartered trades deliver perfection on fixed JCT contracts.
          </p>
        </div>

        {/* Services Grid with Real Architecture Photography */}
        <div className="responsive-grid-2">
          {servicesList.map((service) => (
            <div
              key={service.id}
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '1rem',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
              }}
            >
              <div>
                {/* Photo Header */}
                <div
                  style={{
                    height: '200px',
                    width: '100%',
                    background: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%), url(${service.image}) center/cover no-repeat`,
                    position: 'relative',
                    padding: '1rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 800,
                      color: '#ffffff',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      backgroundColor: '#dc2626',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px'
                    }}
                  >
                    {service.timeline}
                  </span>
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 600,
                      color: '#ffffff',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      padding: '0.3rem 0.65rem',
                      borderRadius: '6px',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    JCT Contract
                  </span>
                </div>

                {/* Content */}
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#14151a', margin: '0 0 0.25rem 0', lineHeight: 1.3 }}>
                    {service.title}
                  </h3>
                  
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#dc2626', marginBottom: '0.75rem' }}>
                    {service.subtitle}
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.55, margin: '0 0 1.25rem 0' }}>
                    {service.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '1rem' }}>
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: '#374151', lineHeight: 1.4 }}>
                        <span style={{ color: '#dc2626', fontWeight: 800, flexShrink: 0 }}>✓</span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '1rem 1.5rem', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {service.boroughs}
                </span>
                <Link
                  href="/demo"
                  style={{
                    color: '#dc2626',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  Book Survey
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

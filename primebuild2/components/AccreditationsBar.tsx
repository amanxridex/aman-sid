'use client';

import React from 'react';

interface Accreditation {
  name: string;
  badge: string;
  src: string;
  height: number;
}

const accreditations: Accreditation[] = [
  { name: 'RIBA', badge: 'Chartered Practice', src: '/images/accreditations/riba.svg', height: 26 },
  { name: 'CIOB', badge: 'Chartered Company', src: '/images/accreditations/ciob.svg', height: 24 },
  { name: 'CHAS', badge: 'Accredited Contractor', src: '/images/accreditations/chas.svg', height: 24 },
  { name: 'Constructionline', badge: 'Gold Member', src: '/images/accreditations/constructionline.png', height: 22 },
  { name: 'SafeContractor', badge: 'Approved Scheme', src: '/images/accreditations/safecontractor.svg', height: 23 },
  { name: 'TrustMark', badge: 'Govt-Endorsed Quality', src: '/images/accreditations/trustmark.svg', height: 23 },
  { name: 'FMB', badge: 'Master Builders', src: '/images/accreditations/fmb.svg', height: 23 }
];

export default function AccreditationsBar() {
  return (
    <section
      style={{
        backgroundColor: '#fbfbfa',
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        padding: 'clamp(2.5rem, 5vw, 3.5rem) 0',
        overflow: 'hidden'
      }}
    >
      <div className="scroll-reveal" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem', marginBottom: '1.75rem', textAlign: 'center' }}>
        <div
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            color: '#dc2626',
            marginBottom: '0.35rem'
          }}
        >
          Institutional Accreditations
        </div>
        <h3
          style={{
            fontSize: 'clamp(1.25rem, 2.5vw, 1.65rem)',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            margin: 0,
            color: '#1d1d1f'
          }}
        >
          Audited standards. Regulated trades.
        </h3>
      </div>

      {/* Silky Smooth Edge-to-Edge Masked Marquee Ticker */}
      <div className="accreditations-marquee-container scroll-reveal scroll-reveal-delay-1">
        <div className="accreditations-marquee-track">
          {/* Primary Track */}
          {accreditations.map((item, idx) => (
            <div key={`track1-${idx}`} className="accreditation-item">
              <img
                src={item.src}
                alt={item.name}
                style={{
                  height: `${item.height}px`,
                  width: 'auto',
                  maxWidth: '120px',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'grayscale(100%)',
                  opacity: 0.85
                }}
              />
              <div
                style={{
                  width: '1px',
                  height: '18px',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }}
              />
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: '#4b5563',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.badge}
              </span>
            </div>
          ))}

          {/* Seamless Duplicate Track for Continuous Loop */}
          {accreditations.map((item, idx) => (
            <div key={`track2-${idx}`} className="accreditation-item">
              <img
                src={item.src}
                alt={item.name}
                style={{
                  height: `${item.height}px`,
                  width: 'auto',
                  maxWidth: '120px',
                  objectFit: 'contain',
                  display: 'block',
                  filter: 'grayscale(100%)',
                  opacity: 0.85
                }}
              />
              <div
                style={{
                  width: '1px',
                  height: '18px',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)'
                }}
              />
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: '#4b5563',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

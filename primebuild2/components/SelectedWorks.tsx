'use client';

import React from 'react';
import Link from 'next/link';

interface Project {
  slug: string;
  category: string;
  borough: string;
  title: string;
  specs: string;
  price: string;
  image: string;
}

const realProjects: Project[] = [
  {
    slug: 'wandsworth-side-return',
    category: 'Kitchen Extension',
    borough: 'Wandsworth SW18',
    title: 'Wandsworth Side-Return Extension',
    specs: 'Pitched Rooflights · Exposed Brick · 9-Week Delivery',
    price: '£65,000 Fixed',
    image: '/images/projects_unique/proj_3.jpg'
  },
  {
    slug: 'clapham-loft-conversion',
    category: 'Loft Conversion',
    borough: 'Clapham SW4',
    title: 'Clapham Dormer Loft Suite',
    specs: 'Master Bedroom · Luxury En-Suite · 8-Week Delivery',
    price: '£54,000 Fixed',
    image: '/images/projects_unique/proj_12.jpg'
  },
  {
    slug: 'albert-road-renovation',
    category: 'House Renovation',
    borough: 'Richmond TW9',
    title: 'Richmond Victorian Reconfiguration',
    specs: 'Structural Wall Removal · Oak Floors · 12-Week Delivery',
    price: '£82,000 Fixed',
    image: '/images/projects_unique/proj_5.jpg'
  },
  {
    slug: 'ealing-kitchen-extension',
    category: 'Kitchen & Dining',
    borough: 'Chiswick W4',
    title: 'Chiswick Contemporary Kitchen Diner',
    specs: 'Slimline Bifolds · Waterfall Island · 7-Week Delivery',
    price: '£48,000 Fixed',
    image: '/images/projects_unique/proj_2.webp'
  }
];

export default function SelectedWorks() {
  return (
    <section id="selected-works" style={{ backgroundColor: '#ffffff', color: '#1d1d1f', padding: 'clamp(3.5rem, 7vw, 6rem) 0' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Section Header */}
        <div
          className="scroll-reveal"
          style={{
            marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#6e6e73',
                marginBottom: '0.5rem'
              }}
            >
              Recent Works — London
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.85rem, 4vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: 0,
                color: '#1d1d1f'
              }}
            >
              Real London home projects.
            </h2>
          </div>

          <Link
            href="/case-studies"
            style={{
              color: '#1d1d1f',
              textDecoration: 'none',
              fontSize: '0.9375rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.4rem 0'
            }}
          >
            <span>View All Projects</span>
            <span style={{ color: '#dc2626' }}>›</span>
          </Link>
        </div>

        {/* 2-Column Responsive Image Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(2.5rem, 4vw, 3.5rem) clamp(1.75rem, 3vw, 2.5rem)'
          }}
        >
          {realProjects.map((proj, idx) => (
            <Link
              key={idx}
              href={`/case-studies/${proj.slug}`}
              className={`scroll-reveal scroll-reveal-delay-${idx + 1}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
            >
              {/* Photo Box */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  backgroundColor: '#f3f4f6',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(0, 0, 0, 0.06)'
                }}
              >
                <img
                  src={proj.image}
                  alt={proj.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.035)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                />

                {/* Floating Architectural Badge (Integrated Inside Photo) */}
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
                    letterSpacing: '0.1em',
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px'
                  }}
                >
                  {proj.category}
                </div>
              </div>

              {/* Clean, Architectural Metadata (Uncrowded, Full-width title, Concise specs) */}
              <div style={{ paddingTop: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                
                {/* Top Kicker Line: Borough & Price Tag */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      color: '#6e6e73'
                    }}
                  >
                    {proj.borough}
                  </span>
                  <span
                    style={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      color: '#dc2626',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {proj.price}
                  </span>
                </div>

                {/* Project Title: Gets 100% width so it NEVER awkwardly breaks! */}
                <h3
                  style={{
                    fontSize: 'clamp(1.15rem, 2vw, 1.35rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.025em',
                    margin: 0,
                    lineHeight: 1.25,
                    color: '#1d1d1f'
                  }}
                >
                  {proj.title}
                </h3>

                {/* Concise Architectural Spec Line */}
                <div
                  style={{
                    fontSize: '0.8125rem',
                    color: '#6e6e73',
                    letterSpacing: '-0.005em',
                    lineHeight: 1.45,
                    fontWeight: 400
                  }}
                >
                  {proj.specs}
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

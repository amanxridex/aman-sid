'use client';

import React from 'react';
import Link from 'next/link';

interface LondonProjectStory {
  metric: string;
  label: string;
  projectName: string;
  borough: string;
  slug: string;
  badge: string;
  image: string;
}

const londonStories: LondonProjectStory[] = [
  {
    metric: '£3.8M JCT Fixed',
    label: 'Grade-II Townhouse Refurbishment & Basement',
    projectName: 'The Mayfair Townhouse',
    borough: 'Mayfair, London W1K',
    slug: 'mayfair-heritage-townhouse',
    badge: 'Delivered On Schedule',
    image: '/images/projects/london_residence_1.png'
  },
  {
    metric: '18,500 sq ft (14 Wks)',
    label: 'Commercial CAT-A & CAT-B Workplace Fitout',
    projectName: 'Shoreditch Creative HQ',
    borough: 'Shoreditch, London EC2A',
    slug: 'shoreditch-commercial-fitout',
    badge: 'Zero Budget Overrun',
    image: '/images/projects/project_2.jpg'
  },
  {
    metric: '5,200 sq ft Duplex',
    label: 'Luxury Penthouse Handover & Cantilever Stairs',
    projectName: 'Battersea Riverside Duplex',
    borough: 'Battersea, London SW11',
    slug: 'battersea-riverside-penthouse',
    badge: '10-Yr Warranty Issued',
    image: '/images/projects/project_7.jpg'
  },
  {
    metric: '£2.4M Fixed Price',
    label: 'Full Commercial Renovation & Acoustic Glazing',
    projectName: 'Fitzrovia Financial Suites',
    borough: 'Charlotte St, London W1W',
    slug: 'fitzrovia-workplace',
    badge: 'Signed Off 1st Time',
    image: '/images/projects/project_9.jpg'
  },
  {
    metric: '£0 Variations',
    label: 'Mews House Extension & Glass Courtyard',
    projectName: 'Kensington Mews House',
    borough: 'South Kensington, London SW7',
    slug: 'kensington-mews-redevelopment',
    badge: '100% Fixed Price',
    image: '/images/projects/project_4.jpg'
  },
  {
    metric: '100% Client Approval',
    label: 'Considerate Constructors Scheme Benchmark',
    projectName: 'Westminster Residential',
    borough: 'Central London Sites',
    slug: 'mayfair-heritage-townhouse',
    badge: 'Full Sign-Off',
    image: '/images/projects/london_residence_7.webp'
  }
];

export default function CustomerStoriesTicker() {
  const tickerItems = [...londonStories, ...londonStories];

  return (
    <section style={{ padding: '4rem 0', overflow: 'hidden', backgroundColor: '#f9fafb', width: '100%', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto 2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#dc2626', marginBottom: '0.4rem' }}>
              Delivered Schemes
            </div>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.025em', margin: 0, color: '#14151a' }}>
              Contract Performance Across London
            </h2>
          </div>
          <Link
            href="/case-studies"
            style={{
              color: '#dc2626',
              fontWeight: 700,
              fontSize: '0.875rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>View All London Projects</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* Marquee Row */}
      <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            width: 'max-content',
            animation: 'scrollHorizontal 45s linear infinite'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = 'paused';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.animationPlayState = 'running';
          }}
        >
          {tickerItems.map((story, idx) => (
            <Link
              key={idx}
              href={`/case-studies/${story.slug}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                width: 'clamp(17rem, 75vw, 21rem)',
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: '0.75rem',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                flexShrink: 0
              }}
            >
              {/* Project Photo Header */}
              <div
                style={{
                  height: '140px',
                  width: '100%',
                  background: `linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%), url(${story.image}) center/cover no-repeat`,
                  position: 'relative',
                  padding: '0.65rem'
                }}
              >
                <span
                  style={{
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}
                >
                  {story.badge}
                </span>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1rem' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#14151a', marginBottom: '0.25rem' }}>
                  {story.metric}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#4b5563', lineHeight: 1.4, marginBottom: '0.75rem' }}>
                  {story.label}
                </div>
                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#14151a' }}>{story.projectName}</span>
                  <span style={{ fontSize: '0.6875rem', color: '#9ca3af' }}>{story.borough}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

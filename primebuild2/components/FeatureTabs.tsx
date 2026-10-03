'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Pillar {
  id: string;
  tabLabel: string;
  badge: string;
  heading: string;
  description: string;
  image: string;
  benefits: string[];
  stats: {
    stat1: { label: string; value: string };
    stat2: { label: string; value: string };
  };
}

const pillars: Pillar[] = [
  {
    id: 'fixed-price',
    tabLabel: '1. Guaranteed Fixed Price',
    badge: 'No Hidden Costs',
    heading: 'Itemised quotes locked under standard JCT contracts. What we quote is what you pay.',
    description: 'We reject the common builder habit of low-balling tenders only to add expensive variations later. Every scope item, material grade, and trade cost is agreed upfront in writing.',
    image: '/images/projects/project_1.jpg',
    benefits: [
      'Comprehensive pre-construction survey before pricing',
      'Fixed JCT contract with zero surprise variation invoices',
      'Clear, milestone-based payment schedule tied to inspected progress',
      'All waste removal, scaffolding, and council permits included'
    ],
    stats: {
      stat1: { label: 'Surprise Extras', value: '£0.00' },
      stat2: { label: 'Contract Standard', value: 'JCT Fixed-Price' }
    }
  },
  {
    id: 'site-manager',
    tabLabel: '2. Dedicated Site Manager',
    badge: 'On-Site Daily',
    heading: 'One dedicated, qualified project manager on your site from day one to completion.',
    description: 'You will never have to chase multiple subcontractors or wonder who is in charge. Your dedicated manager supervises every trade, ensures building code compliance, and answers your calls directly.',
    image: '/images/projects/london_residence_1.png',
    benefits: [
      'Daily site supervision managing all trades and materials',
      'Direct WhatsApp and phone line with your manager',
      'Liaison with building control, structural engineers, and party wall surveyors',
      'Strict quality checks at every structural milestone'
    ],
    stats: {
      stat1: { label: 'Site Supervision', value: 'Daily On-Site' },
      stat2: { label: 'Direct Contact', value: '1 Manager' }
    }
  },
  {
    id: 'weekly-updates',
    tabLabel: '3. Weekly Progress Reports',
    badge: '100% Transparency',
    heading: 'Clear weekly video and photo updates sent directly to your phone every Friday.',
    description: 'Even if you are busy or out of the country, you will always know exactly how your build is progressing. We document every phase with crisp photographic records and schedule checkpoints.',
    image: '/images/projects/project_7.jpg',
    benefits: [
      'Weekly photo and video progress report sent every Friday',
      'Live timeline tracker showing completed and upcoming milestones',
      'Early heads-up on any client material selections (tiles, paint, fixtures)',
      'Clear, transparent communication with zero technical jargon'
    ],
    stats: {
      stat1: { label: 'Progress Reports', value: 'Every Friday' },
      stat2: { label: 'Client Satisfaction', value: '4.9 / 5.0' }
    }
  },
  {
    id: 'warranty',
    tabLabel: '4. 10-Year Warranty',
    badge: 'Certified Handover',
    heading: 'Full Building Regulations sign-off and a 10-year insurance-backed structural guarantee.',
    description: 'We do not walk away at handover. Every completed residential scheme receives full council building control certification and an insurance-backed warranty for complete peace of mind.',
    image: '/images/projects/project_10.jpg',
    benefits: [
      '10-year insurance-backed structural warranty issued upon completion',
      'Building Control completion certificate from London borough council',
      'Comprehensive O&M handover manual with all appliance guarantees',
      'Dedicated 12-month defect liability period with rapid resolution'
    ],
    stats: {
      stat1: { label: 'Structural Warranty', value: '10 Years' },
      stat2: { label: 'Handover Defects', value: 'Zero Outstanding' }
    }
  }
];

export default function FeatureTabs() {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const intervalTime = 60;
    const totalDuration = 7000;
    const increment = (intervalTime / totalDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveTabIdx((current) => (current + 1) % pillars.length);
          return 0;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [activeTabIdx]);

  const activePillar = pillars[activeTabIdx];

  return (
    <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff', width: '100%', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Section Header */}
        <div style={{ maxWidth: '800px', margin: '0 auto 2.5rem auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#dc2626', marginBottom: '0.5rem' }}>
            The Prime Build Standard
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', margin: '0 0 1rem 0', color: '#14151a', lineHeight: 1.2 }}>
            Construction managed like high finance. No guesswork.
          </h2>
          <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
            Four non-negotiable principles that protect your budget, timeline, and property value from day one.
          </p>
        </div>

        {/* Tab Controls: Touch-Scrollable on Mobile */}
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '0.5rem',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            marginBottom: '2rem',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            paddingBottom: '0.5rem'
          }}
        >
          {pillars.map((pillar, idx) => (
            <button
              key={pillar.id}
              onClick={() => {
                setActiveTabIdx(idx);
                setProgress(0);
              }}
              type="button"
              style={{
                flex: '1 0 auto',
                minWidth: '180px',
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                transition: 'opacity 0.15s ease'
              }}
            >
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: activeTabIdx === idx ? '#14151a' : '#6b7280', whiteSpace: 'nowrap' }}>
                {pillar.tabLabel}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#9ca3af', marginTop: '0.2rem', whiteSpace: 'nowrap' }}>
                {pillar.badge}
              </div>

              {/* Progress Line */}
              {activeTabIdx === idx && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-0.5rem',
                    left: 0,
                    height: '3px',
                    backgroundColor: '#dc2626',
                    width: `${progress}%`,
                    borderRadius: '2px',
                    transition: 'width 0.05s linear'
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content Display Card */}
        <div
          className="responsive-card responsive-grid-2"
          style={{
            backgroundColor: '#f9fafb',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: '1.25rem',
            alignItems: 'stretch',
            gap: '2rem'
          }}
        >
          {/* Left Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'inline-block', backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 700, fontSize: '0.75rem', padding: '0.3rem 0.75rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1rem' }}>
                {activePillar.badge}
              </div>
              
              <h3 style={{ fontSize: 'clamp(1.25rem, 2.2vw, 1.875rem)', fontWeight: 800, lineHeight: 1.25, color: '#14151a', margin: '0 0 1rem 0' }}>
                {activePillar.heading}
              </h3>

              <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#4b5563', margin: '0 0 1.5rem 0' }}>
                {activePillar.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem' }}>
                {activePillar.benefits.map((bullet, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '0.9375rem', lineHeight: 1 }}>✓</span>
                    <span style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.4 }}>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Link href="/demo" className="btn-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', borderRadius: '8px', textDecoration: 'none' }}>
                <span>Lock In Your Fixed-Price Estimate</span>
                <span style={{ fontSize: '1rem' }}>→</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Image & Stats Card */}
          <div
            style={{
              position: 'relative',
              borderRadius: '1rem',
              overflow: 'hidden',
              minHeight: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '1.5rem',
              background: `linear-gradient(to top, rgba(15,16,21,0.92) 0%, rgba(15,16,21,0.3) 60%, rgba(15,16,21,0.5) 100%), url(${activePillar.image}) center/cover no-repeat`,
              boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            {/* Top Tag */}
            <div>
              <span
                style={{
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  backdropFilter: 'blur(4px)',
                  display: 'inline-block'
                }}
              >
                Verified UK Delivery Standard
              </span>
            </div>

            {/* Bottom Stats Overlay */}
            <div
              style={{
                backgroundColor: 'rgba(20,21,26,0.9)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {activePillar.stats.stat1.label}
                  </div>
                  <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#dc2626', marginTop: '0.2rem' }}>
                    {activePillar.stats.stat1.value}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.6875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {activePillar.stats.stat2.label}
                  </div>
                  <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#ffffff', marginTop: '0.2rem' }}>
                    {activePillar.stats.stat2.value}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.35, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.65rem' }}>
                <strong style={{ color: '#ffffff' }}>Prime Build Guarantee:</strong> JCT fixed-price stage payments only released upon certified architect inspection.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

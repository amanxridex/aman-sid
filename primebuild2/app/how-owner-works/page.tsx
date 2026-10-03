import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'How We Work | PRIME BUILD LONDON',
  description: 'The Prime Build London construction methodology: 4-stage delivery, JCT fixed-price governance, dedicated site management, and 10-year warranty.'
};

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      tag: 'Stage 1: Appraisal & Pre-Con Survey',
      title: 'Detailed site inspection & London planning feasibility',
      description: 'Before any site mobilisation begins, our team conducts a thorough property survey, inspecting structural conditions, party wall parameters, and council planning constraints.',
      features: [
        'On-site structural and damp survey with detailed measurements',
        'Party Wall awards, licenses to alter, and conservation officer liaison',
        'Site access, skip licensing, and parking suspension coordination',
        'Preliminary elemental cost plan and value engineering analysis'
      ],
      badge: 'Zero Site Surprises'
    },
    {
      num: '02',
      tag: 'Stage 2: Fixed-Price JCT Tender',
      title: 'Itemised tender & binding fixed-price contract',
      description: 'We agree on all scope items, material specifications, and structural steel designs before signing. We execute a standard JCT contract with an agreed Guaranteed Maximum Price.',
      features: [
        'Itemised quotation down to the penny with transparent trade breakdowns',
        'Direct procurement of British steel, architectural joinery, and glazing',
        'Binding JCT contract protecting your budget from variation claims',
        'Full Building Regulations Part B (Fire) and Part L (Thermal) pre-approval'
      ],
      badge: '100% Fixed Price'
    },
    {
      num: '03',
      tag: 'Stage 3: Active Construction & Weekly Updates',
      title: 'Daily on-site manager & weekly video progress reports',
      description: 'Your dedicated site manager is on your property every morning, supervising trades and coordinating deliveries. Every Friday, you receive a full video and photo walkthrough.',
      features: [
        'Dedicated on-site project manager supervising trades daily',
        'Weekly Friday video walkthroughs and photo documentation',
        'Considerate Constructors Scheme compliance and neighbor liaison',
        'Milestone-based stage payments tied to completed, inspected work'
      ],
      badge: 'Total Transparency'
    },
    {
      num: '04',
      tag: 'Stage 4: Handover & 10-Year Warranty',
      title: 'Building Control sign-off backed by our 10-year warranty',
      description: 'We deliver clean, defect-free spaces ready for immediate occupancy, accompanied by full Building Control certificates, operation manuals, and our 10-year insurance-backed warranty.',
      features: [
        'Building Control, Gas Safe, and NICEIC electrical sign-off certificates',
        'Operation & Maintenance (O&M) manuals and smart home commissioning',
        'Comprehensive 10-year insurance-backed structural warranty',
        '12-month post-handover snagging warranty with rapid resolution'
      ],
      badge: '10-Year Warranty'
    }
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', width: '100%' }}>
      
      {/* Hero Header */}
      <section style={{ padding: '5rem 0 3rem 0', width: '100%' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626', letterSpacing: '0.08em', marginBottom: '1rem' }}>
            Our Construction Methodology
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 1.25rem 0', lineHeight: 1.15, color: '#14151a' }}>
            How Prime Build delivers London projects on time and on budget
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#4b5563', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto 2.5rem auto' }}>
            A structured, 4-stage process from initial survey to final keys in hand. Zero guesswork, zero variation traps, and total transparency.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/demo"
              className="btn-green"
              style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}
            >
              Book Free Site Survey
              <span>→</span>
            </Link>
            <Link
              href="/case-studies"
              className="btn-outline-dark"
              style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}
            >
              View Completed Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Steps List */}
      <section style={{ padding: '4.5rem 0 6rem 0', width: '100%' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="responsive-card responsive-grid-2"
                style={{
                  alignItems: 'center',
                  backgroundColor: '#f9fafb',
                  borderRadius: '1.5rem',
                  border: '1px solid rgba(0,0,0,0.08)'
                }}
              >
                {/* Step Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 900, color: '#dc2626' }}>{step.num}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b7280' }}>
                      {step.tag}
                    </span>
                  </div>
                  <h2 style={{ fontSize: 'clamp(1.5rem, 2.8vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25, margin: '0 0 1rem 0', color: '#14151a' }}>
                    {step.title}
                  </h2>
                  <p style={{ fontSize: '1rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
                    {step.description}
                  </p>
                </div>

                {/* Scope Checklist Box */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '1.25rem', padding: '2rem', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#14151a' }}>
                      Deliverables:
                    </span>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.25rem 0.65rem', borderRadius: '4px', fontWeight: 700 }}>
                      {step.badge}
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {step.features.map((feat, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }}>
                        <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '0.9375rem', flexShrink: 0 }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statutory British Standards & Building Regulations Spec Grid (ZERO PILLS, CLEAN ARCHITECTURAL) */}
      <section
        style={{
          backgroundColor: '#0e0f13',
          color: '#ffffff',
          padding: 'clamp(4rem, 7vw, 6rem) 0',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Subtle noise grain texture overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url(/images/noise.png)',
            backgroundRepeat: 'repeat',
            backgroundSize: '130px 130px',
            opacity: 0.16,
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem', position: 'relative', zIndex: 2 }}>
          {/* Header */}
          <div className="scroll-reveal" style={{ maxWidth: '780px', margin: '0 auto clamp(2.5rem, 4vw, 3.5rem) auto', textAlign: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.16em',
                color: '#dc2626',
                marginBottom: '0.75rem'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#dc2626', display: 'inline-block' }} />
              STATUTORY COMPLIANCE &amp; ACCREDITATIONS
            </div>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: '0 0 1rem 0',
                color: '#ffffff'
              }}
            >
              Built to strict British Standards &amp; Building Regulations
            </h2>
            <p
              style={{
                color: '#9ca3af',
                fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                lineHeight: 1.6,
                maxWidth: '640px',
                margin: '0 auto',
                fontWeight: 400
              }}
            >
              Every Prime Builds London project is engineered and inspected under British Standards, statutory building control, and insurance warranty criteria.
            </p>
          </div>

          {/* 8-Card Architectural Specification Matrix */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem'
            }}
          >
            {[
              {
                code: 'STD.01',
                title: 'CIOB Chartered Standards',
                desc: 'Chartered Institute of Building construction management and ethical project delivery.'
              },
              {
                code: 'STD.02',
                title: 'CHAS Elite Certified',
                desc: 'UK-accredited independent health, safety, and risk management auditing on all active sites.'
              },
              {
                code: 'STD.03',
                title: 'SafeContractor Approved',
                desc: 'Rigorous trade verification across mechanical, structural, and electrical installations.'
              },
              {
                code: 'STD.04',
                title: 'Constructionline Gold',
                desc: 'Tier-1 pre-qualification standard verifying financial stability and technical competence.'
              },
              {
                code: 'REG.05',
                title: 'Building Regulations Part B & L',
                desc: 'Full compliance with statutory fire safety standards and high-efficiency thermal insulation.'
              },
              {
                code: 'BOR.06',
                title: 'Westminster & RBKC Compliant',
                desc: 'Proven heritage delivery within London’s strictest conservation borough guidelines.'
              },
              {
                code: 'GOV.07',
                title: 'Considerate Constructors',
                desc: 'Code of considerate practice minimising street impact, dust, and neighbour disturbance.'
              },
              {
                code: 'WAR.08',
                title: '10-Year Insurance Warranty',
                desc: 'Independent insurance-backed structural warranty protecting load-bearing and roof works.'
              }
            ].map((std, idx) => (
              <div
                key={idx}
                className={`scroll-reveal scroll-reveal-delay-${(idx % 4) + 1} compliance-spec-card`}
                style={{
                  backgroundColor: '#14161d',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '1.35rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.2s ease, transform 0.2s ease, background-color 0.2s ease'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.6875rem',
                        fontWeight: 800,
                        letterSpacing: '0.14em',
                        color: '#dc2626'
                      }}
                    >
                      {std.code}
                    </span>
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: '#dc2626',
                        display: 'inline-block',
                        opacity: 0.8
                      }}
                    />
                  </div>

                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '-0.015em',
                      color: '#ffffff',
                      margin: '0 0 0.45rem 0',
                      lineHeight: 1.3
                    }}
                  >
                    {std.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: '#94a3b8',
                      lineHeight: 1.5,
                      margin: 0
                    }}
                  >
                    {std.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ready to start CTA */}
      <section style={{ padding: '5.5rem 0', textAlign: 'center', width: '100%', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, margin: '0 0 1rem 0', color: '#14151a' }}>
            Ready to discuss your London build?
          </h2>
          <p style={{ color: '#4b5563', fontSize: '1.125rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Speak directly with our senior estimators to evaluate your project scope, drawings, and fixed JCT budget parameters.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
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
              <span>Book Free Site Survey &amp; Estimate</span>
              <span>›</span>
            </Link>
            <a
              href="tel:+447767672807"
              style={{
                textDecoration: 'none',
                color: '#1d1d1f',
                backgroundColor: '#f4f4f5',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                padding: '0.85rem 1.6rem',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'background-color 0.2s ease'
              }}
            >
              <span>+44 7767 672807</span>
              <span style={{ color: '#dc2626' }}>›</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}

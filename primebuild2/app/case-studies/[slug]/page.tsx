import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CASE_STUDIES } from '@/lib/caseStudiesData';

export async function generateStaticParams() {
  return CASE_STUDIES.map((study) => ({
    slug: study.slug,
  }));
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((cs) => cs.slug === slug);

  if (!study) {
    notFound();
  }

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '3.5rem 0 6rem 0', width: '100%' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Back Link */}
        <div style={{ marginBottom: '2.5rem' }}>
          <Link
            href="/case-studies"
            style={{
              color: '#4b5563',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>←</span>
            <span>Back to All Projects</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div style={{ maxWidth: '960px', margin: '0 auto 4rem auto' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8125rem', fontWeight: 700 }}>
              {study.cuisine}
            </span>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>•</span>
            <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>{study.locations}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 1.25rem 0', color: '#14151a' }}>
            {study.headline}
          </h1>

          <div style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '2.5rem' }}>
            Project Partner: <strong>{study.founders}</strong>
          </div>

          {/* Key Metrics Stats Bar (Solid dark) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem', backgroundColor: '#14151a', color: '#ffffff', borderRadius: '1.25rem', padding: '2.25rem', marginBottom: '3.5rem', border: '1px solid rgba(255,255,255,0.08)' }}>
            {study.stats.map((st, idx) => (
              <div key={idx}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626', letterSpacing: '-0.02em' }}>
                  {st.value}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  {st.label}
                </div>
              </div>
            ))}
          </div>

          {/* Quote Callout */}
          <div style={{ backgroundColor: '#f9fafb', borderLeft: '4px solid #dc2626', padding: '2rem', borderRadius: '0.5rem', marginBottom: '3.5rem', border: '1px solid rgba(0,0,0,0.06)', borderLeftColor: '#dc2626' }}>
            <p style={{ fontSize: '1.15rem', fontStyle: 'italic', color: '#1f2937', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
              &ldquo;{study.quote}&rdquo;
            </p>
            <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#14151a' }}>{study.founders}</div>
            <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Project: {study.name}</div>
          </div>

          {/* Story Narrative */}
          <div style={{ fontSize: '1.0625rem', lineHeight: 1.8, color: '#374151', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
            {study.story.map((paragraph, pIdx) => (
              <p key={pIdx} style={{ margin: 0 }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* Key Results Breakdown */}
          <div style={{ backgroundColor: '#f9fafb', borderRadius: '1.25rem', padding: '2.5rem', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '4rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 1.25rem 0', color: '#14151a' }}>
              Key Project Results & Milestones:
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {study.results.map((res, rIdx) => (
                <li key={rIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9375rem', color: '#1f2937', lineHeight: 1.5 }}>
                  <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '1.125rem', flexShrink: 0 }}>✓</span>
                  <span>{res}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Conversion Box */}
          <div style={{ backgroundColor: '#14151a', color: '#ffffff', borderRadius: '1.25rem', padding: '3.5rem', textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, margin: '0 0 0.75rem 0', color: '#ffffff' }}>
              Achieve fixed-price certainty on your London build
            </h2>
            <p style={{ fontSize: '1.0625rem', maxWidth: '38rem', margin: '0 auto 2rem auto', color: '#9ca3af', lineHeight: 1.6 }}>
              Book an in-person site survey. Our estimators will review your architectural drawings and provide a fixed-price JCT cost plan.
            </p>
            <Link
              href="/demo"
              className="btn-green"
              style={{
                fontSize: '1rem',
                padding: '0.85rem 2rem'
              }}
            >
              Book Free Site Survey
              <span>→</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

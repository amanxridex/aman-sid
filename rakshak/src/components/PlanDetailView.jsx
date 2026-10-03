'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import LicenseProvisionModal from '@/components/LicenseProvisionModal';

export default function PlanDetailView({ plan, otherPlans }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Collect all individual features into a flat list for easy filtering & counting
  const allFeatures = useMemo(() => {
    const list = [];
    plan.categories.forEach(cat => {
      cat.features.forEach(feat => {
        list.push({
          ...feat,
          categoryName: cat.name,
          categoryLogo: cat.iconLogo,
          categoryExplanation: cat.explanation
        });
      });
    });
    return list;
  }, [plan]);

  const filteredFeatures = useMemo(() => {
    return allFeatures.filter(f => {
      const matchesCat = activeCategory === 'All' || f.categoryName === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        f.title.toLowerCase().includes(q) || 
        f.desc.toLowerCase().includes(q) ||
        f.categoryName.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [allFeatures, activeCategory, searchQuery]);

  return (
    <div style={{ paddingTop: '7.5rem', paddingBottom: '6rem' }}>

      <div className="container">

        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>
          <Link href="/pricing" style={{ color: '#94a3b8', textDecoration: 'none' }}>
            Pricing
          </Link>
          <span>/</span>
          <span style={{ color: '#38bdf8', fontWeight: 600 }}>{plan.name}</span>
        </div>

        {/* Plan Header Hero */}
        <div className="section-header-deepip" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="tag_content" style={{ margin: 0 }}>
              <div className="blue_tag">{plan.badge}</div>
              <span>{allFeatures.length}+ Dedicated Anti-AI Security Features</span>
            </div>
            {plan.popular && (
              <span style={{ background: '#146ef5', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.9rem', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Best Value Choice
              </span>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.85rem', color: '#ffffff' }}>
            {plan.name}
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#38bdf8', fontWeight: 600, marginBottom: '1.25rem' }}>
            {plan.subtitle}
          </p>
          <p style={{ maxWidth: 780, fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.7, margin: '0 0 2rem' }}>
            {plan.desc}
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <span style={{ fontSize: 'clamp(2.8rem, 6vw, 4rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>
              {plan.price}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 500 }}>
              {plan.period}
            </span>
            <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1', padding: '0.25rem 0.75rem', borderRadius: 6, fontSize: '0.825rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {plan.billingNote}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-deepip-blue"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minHeight: 48, padding: '0.65rem 1.8rem', fontSize: '0.95rem', border: 'none', cursor: 'pointer' }}
            >
              {plan.cta}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <Link href="/radar" className="btn-deepip-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minHeight: 48 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00F5FF', boxShadow: '0 0 8px #00F5FF' }} />
              Live Defense Radar
            </Link>
          </div>
        </div>

        {/* 4 Performance & Defense Metric Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3.5rem' }}>
          <div className="deepip-card" style={{ padding: '1.5rem', background: '#090d16' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>DEFENSE EFFECTIVENESS</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.35rem' }}>{plan.aiDefenseScore}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Active process &amp; crawler rejection</p>
          </div>

          <div className="deepip-card" style={{ padding: '1.5rem', background: '#090d16' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>KERNEL OVERHEAD</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem' }}>{plan.kernelOverhead}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Zero perceptible file I/O latency</p>
          </div>

          <div className="deepip-card" style={{ padding: '1.5rem', background: '#090d16' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>WORKSTATION COVERAGE</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.35rem' }}>{plan.devices}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>Windows, macOS &amp; Linux native</p>
          </div>

          <div className="deepip-card" style={{ padding: '1.5rem', background: '#090d16' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>EXTERNAL CLOUD TELEMETRY</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#146ef5', marginTop: '0.35rem' }}>{plan.cloudTelemetry}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>100% verified local machine security</p>
          </div>
        </div>

        {/* How Rakshak Saves You From AI Models Banner */}
        <div className="deepip-card" style={{ padding: '2.5rem', marginBottom: '3.5rem', background: 'radial-gradient(ellipse at center top, rgba(20, 110, 245, 0.15) 0%, #090d16 85%)', border: '1px solid rgba(20, 110, 245, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(20, 110, 245, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/tech/wireguard.svg" alt="" width="18" height="18" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              How {plan.name} Saves You From AI Exposure
            </h2>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 920 }}>
            Every component in {plan.name} is engineered to counter the exact harvesting methodologies used by modern generative AI models. When scrapers, web crawler bots, or background OS recall indexers attempt to silently inventory your computer files, {plan.name} halts the thread at the kernel dispatch layer, quarantines the process PID, and ensures your private code, credentials, and documents never train third-party models.
          </p>
        </div>

        {/* Interactive Feature Search & Category Filter Bar */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                Explore All {allFeatures.length} Features Included
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Showing {filteredFeatures.length} matching feature specifications
              </p>
            </div>

            {/* Live Search Input */}
            <div style={{ position: 'relative', minWidth: 280, maxWidth: 400, flex: 1 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features (e.g., Recall, Git, I/O, Honeypot)..."
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.75rem',
                  background: '#090d16',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 10,
                  color: '#fff',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
              <svg 
                width="15" 
                height="15" 
                viewBox="0 0 24 24" 
                fill="none" 
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}
              >
                <path d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveCategory('All')}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: 6,
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                border: activeCategory === 'All' ? '1px solid #146ef5' : '1px solid rgba(255, 255, 255, 0.08)',
                background: activeCategory === 'All' ? '#146ef5' : 'rgba(255, 255, 255, 0.03)',
                color: activeCategory === 'All' ? '#fff' : '#94a3b8'
              }}
            >
              All Features ({allFeatures.length})
            </button>
            {plan.categories.map((c, i) => {
              const isSelected = activeCategory === c.name;
              return (
                <button
                  key={i}
                  onClick={() => setActiveCategory(c.name)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.45rem 0.95rem',
                    borderRadius: 6,
                    fontSize: '0.825rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #146ef5' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: isSelected ? '#146ef5' : 'rgba(255, 255, 255, 0.03)',
                    color: isSelected ? '#fff' : '#94a3b8'
                  }}
                >
                  <img src={c.iconLogo} alt="" width="14" height="14" style={{ objectFit: 'contain' }} />
                  {c.name} ({c.features.length})
                </button>
              );
            })}
          </div>
        </div>

        {/* 50+ Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
          {filteredFeatures.map((item, idx) => (
            <div 
              key={idx} 
              className="deepip-card" 
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', background: '#090d16' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(20, 110, 245, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                      <path d="M4 9L7.5 12.5L14 6" stroke="#146ef5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                    {item.title}
                  </h4>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#64748b', fontFamily: 'var(--font-code)' }}>
                  #{String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 1rem', flex: 1 }}>
                {item.desc}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <img src={item.categoryLogo} alt="" width="12" height="12" style={{ objectFit: 'contain' }} />
                <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 600 }}>
                  {item.categoryName}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Compare With Other Plans */}
        <div className="deepip-card" style={{ padding: '3rem 2.5rem', background: '#070a12', textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
            Compare With Other Rakshak Plans
          </h3>
          <p style={{ color: '#94a3b8', maxWidth: 600, margin: '0 auto 2.5rem', fontSize: '0.95rem' }}>
            Looking for multi-device honeypot defense or enterprise fleet deployment? Explore our full protection tier lineup:
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {otherPlans.map((op, i) => (
              <Link 
                key={i} 
                href={`/pricing/${op.slug}`}
                className="deepip-card"
                style={{
                  padding: '1.5rem 2rem',
                  textDecoration: 'none',
                  minWidth: 240,
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{op.name}</span>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>{op.price}</span>
                </div>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{op.period}</span>
                <span style={{ color: '#146ef5', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  View All Features &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* License Provisioning Modal */}
      <LicenseProvisionModal
        plan={plan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import LicenseProvisionModal from '@/components/LicenseProvisionModal';

export default function PlanDetailView({ plan, otherPlans }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const [stripeLoading, setStripeLoading] = useState(false);

  const handleDirectStripeCheckout = async () => {
    setStripeLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: plan.slug }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Stripe checkout error:', err);
    } finally {
      setStripeLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '7.5rem', paddingBottom: '6rem' }}>
      <div className="container">
        
        {/* Breadcrumb & Navigation Header */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
          <Link href="/pricing" style={{ color: '#86868b', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>←</span> Back to All Plans
          </Link>
          <span style={{ color: '#424245' }}>/</span>
          <span style={{ color: '#d2d2d7', fontWeight: 500 }}>{plan.name} Technical Architecture</span>
        </div>

        {/* Hero Plan Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 113, 227, 0.1)', border: '1px solid rgba(0, 113, 227, 0.3)', padding: '0.35rem 0.85rem', borderRadius: 9999, color: '#2997ff', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            <span>●</span>
            <span>{plan.targetAudience}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 1rem' }}>
            {plan.name}
          </h1>
          <p style={{ maxWidth: 780, fontSize: '1.05rem', color: '#86868b', lineHeight: 1.7, margin: '0 0 1.25rem' }}>
            {plan.desc}
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '0.35rem 0.85rem', borderRadius: 9999, color: '#f5f5f7', fontSize: '0.8rem', fontWeight: 500, marginBottom: '2rem' }}>
            <span>🔒</span>
            <span>Single-Device Hardware-Bound License • 1 Payment = 1 Workstation (Zero Multi-Keys)</span>
          </div>

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
              onClick={handleDirectStripeCheckout}
              disabled={stripeLoading}
              className="btn-deepip-blue"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minHeight: 48, padding: '0.65rem 1.8rem', fontSize: '0.95rem', border: 'none', cursor: 'pointer' }}
            >
              {stripeLoading ? 'Connecting to Stripe...' : `Pay ${plan.price} with Card (Stripe) →`}
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                minHeight: 48,
                padding: '0.65rem 1.5rem',
                fontSize: '0.92rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 8,
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              {plan.cta}
            </button>
            <Link href="/radar" className="btn-deepip-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', minHeight: 48 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#30d158' }} />
              Live Defense Radar
            </Link>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '3.5rem' }}>
          <div className="deepip-card" style={{ padding: '1.5rem', background: '#09090b' }}>
            <span style={{ fontSize: '0.75rem', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>DEFENSE EFFECTIVENESS</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem', letterSpacing: '-0.02em' }}>{plan.aiDefenseScore}</h3>
            <p style={{ color: '#86868b', fontSize: '0.8rem', margin: 0 }}>Active process &amp; crawler rejection</p>
          </div>

          <div className="deepip-card" style={{ padding: '1.5rem', background: '#09090b' }}>
            <span style={{ fontSize: '0.75rem', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>KERNEL OVERHEAD</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem', letterSpacing: '-0.02em' }}>{plan.kernelOverhead}</h3>
            <p style={{ color: '#86868b', fontSize: '0.8rem', margin: 0 }}>Zero perceptible file I/O latency</p>
          </div>

          <div className="deepip-card" style={{ padding: '1.5rem', background: '#09090b' }}>
            <span style={{ fontSize: '0.75rem', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>WORKSTATION COVERAGE</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#30d158', marginTop: '0.35rem', letterSpacing: '-0.02em' }}>{plan.devices}</h3>
            <p style={{ color: '#86868b', fontSize: '0.8rem', margin: 0 }}>Windows, macOS &amp; Linux native</p>
          </div>

          <div className="deepip-card" style={{ padding: '1.5rem', background: '#09090b' }}>
            <span style={{ fontSize: '0.75rem', color: '#6e6e73', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>EXTERNAL CLOUD TELEMETRY</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginTop: '0.35rem', letterSpacing: '-0.02em' }}>{plan.cloudTelemetry}</h3>
            <p style={{ color: '#86868b', fontSize: '0.8rem', margin: 0 }}>100% verified local machine security</p>
          </div>
        </div>

        <div className="deepip-card" style={{ padding: '2.5rem', marginBottom: '3.5rem', background: '#09090b', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255, 255, 255, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/assets/tech/wireguard.svg" alt="" width="18" height="18" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              How {plan.name} Saves You From AI Exposure
            </h2>
          </div>
          <p style={{ color: '#86868b', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 920 }}>
            Every component in {plan.name} is engineered to counter the exact harvesting methodologies used by modern generative AI models. When scrapers, web crawler bots, or background OS recall indexers attempt to silently inventory your computer files, {plan.name} halts the thread at the kernel dispatch layer, quarantines the process PID, and ensures your private code, credentials, and documents never train third-party models.
          </p>
        </div>

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginBottom: '4rem' }}>
          {filteredFeatures.map((item, idx) => (
            <div 
              key={idx} 
              className="deepip-card" 
              style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', background: '#09090b' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                      <path d="M4 9L7.5 12.5L14 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.01em' }}>
                    {item.title}
                  </h4>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#6e6e73', fontFamily: 'var(--font-code)' }}>
                  #{String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              <p style={{ color: '#86868b', fontSize: '0.875rem', lineHeight: 1.6, margin: '0 0 1rem', flex: 1 }}>
                {item.desc}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: 'auto', paddingTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <img src={item.categoryLogo} alt="" width="12" height="12" style={{ objectFit: 'contain' }} />
                <span style={{ fontSize: '0.72rem', color: '#a1a1a6', fontWeight: 600 }}>
                  {item.categoryName}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="deepip-card" style={{ padding: '3rem 2.5rem', background: '#09090b', textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Compare With Other Rakshak Plans
          </h3>
          <p style={{ color: '#86868b', maxWidth: 600, margin: '0 auto 2.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Looking for adversarial honeypots or extended annual kernel protection? Explore our dedicated protection tiers:
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
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{op.name}</span>
                  <span style={{ color: '#ffffff', fontWeight: 700 }}>{op.price}</span>
                </div>
                <span style={{ color: '#86868b', fontSize: '0.8rem' }}>{op.period}</span>
                <span style={{ color: '#d2d2d7', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  View All Features &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <LicenseProvisionModal
        plan={plan}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

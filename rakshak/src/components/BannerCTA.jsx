export default function BannerCTA() {
  return (
    <section className="container" style={{ padding: '4rem 1.25rem' }}>
      <div className="deepip-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center', background: '#0b0e17' }}>
        <div className="tag_content" style={{ marginBottom: '1.25rem' }}>
          <div className="blue_tag">GET STARTED</div>
          <span>Zero-Trust Local Defense</span>
        </div>

        <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 800, marginBottom: '1rem', color: '#ffffff' }}>
          Ready To Protect Your Computer Smarter?
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 640, margin: '0 auto 2rem', lineHeight: 1.65 }}>
          Prevent unauthorized background AI indexers, desktop recall tools, and scrapers from indexing your files in under 60 seconds.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/pricing" className="btn-deepip-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            Get Shield - $19/mo
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="/radar" className="btn-deepip-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00F5FF', boxShadow: '0 0 8px #00F5FF' }} />
            Live Defense Radar
          </a>
        </div>
      </div>
    </section>
  );
}


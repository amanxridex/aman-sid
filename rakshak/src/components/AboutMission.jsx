export default function AboutMission() {
  return (
    <section className="container" style={{ padding: '4rem 1.25rem' }}>
      <div className="deepip-card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center', background: '#0b0e17' }}>
        <div className="tag_content" style={{ marginBottom: '1.25rem' }}>
          <div className="blue_tag">MISSION</div>
          <span>Zero-Trust Architecture</span>
        </div>

        <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.3rem)', fontWeight: 800, lineHeight: 1.4, color: '#ffffff', maxWidth: 840, margin: '0 auto 2rem' }}>
          Engineered On Privacy, Zero-Trust Architecture, And Kernel Precision. <br />
          <span className="text-color-blue">RAKSHAK Is The Ultimate Protection Shield</span> <br />
          Defending Personal Files From Exploitative AI Scrapers.
        </h2>

        <a href="/radar" className="btn-deepip-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
          Explore Live Radar
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  );
}


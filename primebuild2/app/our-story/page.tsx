'use client';

import React from 'react';
import Link from 'next/link';

export default function OurStoryPage() {
  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      
      {/* ----------------- 1. HERO SECTION ----------------- */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 6rem) 0 clamp(2.5rem, 4vw, 4rem) 0', width: '100%', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
          
          <div style={{ maxWidth: '880px', margin: '0 auto', textAlign: 'center' }}>
            {/* Micro Kicker */}
            <div
              className="scroll-reveal"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                marginBottom: '1.25rem'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#dc2626', display: 'inline-block' }} />
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.18em',
                  color: '#6e6e73'
                }}
              >
                THE PRIME BUILDS STORY — LONDON
              </span>
            </div>

            {/* Monumental Headline */}
            <h1
              className="scroll-reveal scroll-reveal-delay-1"
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 4.25rem)',
                fontWeight: 800,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: '#1d1d1f',
                margin: '0 0 1.5rem 0'
              }}
            >
              Why we declared war on the &ldquo;Cowboy Builder&rdquo; culture in London.
            </h1>

            <p
              className="scroll-reveal scroll-reveal-delay-2"
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                color: '#4b5563',
                lineHeight: 1.6,
                maxWidth: '720px',
                margin: '0 auto 2rem auto',
                fontWeight: 400
              }}
            >
              In 2018, three London structural specialists and site directors walked away from standard UK contracting. We were disgusted by the industry habit of under-quoting tenders to lure clients in, only to extort them with £30,000 to £80,000 in unexpected variations once the house was torn apart.
            </p>

            {/* Cool Architectural Stickers & Badges */}
            <div
              className="scroll-reveal scroll-reveal-delay-3"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.85rem',
                flexWrap: 'wrap',
                marginBottom: '2.5rem'
              }}
            >
              <span className="story-sticker story-sticker-red">
                ★ CERTIFIED ZERO VARIATION CONTRACTS
              </span>
              <span className="story-sticker story-sticker-dark">
                EST. LONDON • 140+ HOMES COMPLETED
              </span>
              <span className="story-sticker story-sticker-white">
                CIOB CHARTERED ETHICS
              </span>
            </div>
          </div>

          {/* Large Hero Project Photo with Physical Tape & Inspection Stamps */}
          <div
            className="scroll-reveal scroll-reveal-delay-4 story-photo-card"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '1100px',
              margin: '0 auto',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              backgroundColor: '#f3f4f6'
            }}
          >
            {/* Visual Tape Strip */}
            <div className="story-tape" />

            <img
              src="/images/projects_unique/proj_1.jpg"
              alt="Real Prime Builds London Kitchen Extension"
              style={{
                width: '100%',
                height: 'clamp(320px, 50vw, 580px)',
                objectFit: 'cover',
                display: 'block'
              }}
            />

            {/* Overlay Badges / Stickers */}
            <div
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                right: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                gap: '0.75rem',
                pointerEvents: 'none'
              }}
            >
              <span className="story-sticker story-sticker-dark" style={{ pointerEvents: 'auto' }}>
                ON-SITE FOREMAN DAILY AT 07:30 AM
              </span>
              <span className="story-sticker story-sticker-red" style={{ pointerEvents: 'auto' }}>
                FIXED JCT • £78,000 NOT A PENNY OVER
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ----------------- 2. CHAPTER 1: THE LONDON REALITY ----------------- */}
      <section style={{ backgroundColor: '#0e0f13', color: '#ffffff', padding: 'clamp(4.5rem, 7vw, 6.5rem) 0', width: '100%', position: 'relative', overflow: 'hidden' }}>
        {/* Fine Noise Texture */}
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
          
          <div className="scroll-reveal" style={{ maxWidth: '780px', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#dc2626', marginBottom: '0.5rem' }}>
              CHAPTER 01 // THE BROKEN INDUSTRY
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 1.25rem 0', color: '#ffffff' }}>
              The anatomy of a London building nightmare.
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              Ask ten London homeowners who had an extension or loft done by standard contractors, and eight will tell you the same horror story: price disputes, abandoned scaffolding, and hostile invoices once walls were demolished.
            </p>
          </div>

          {/* 3 Brutal Industry Traps Breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {/* Trap 1 */}
            <div
              className="scroll-reveal scroll-reveal-delay-1"
              style={{
                backgroundColor: '#14161f',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '2rem 1.75rem',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                <span className="story-sticker story-sticker-red" style={{ fontSize: '0.625rem', padding: '0.2rem 0.6rem' }}>
                  THE BAIT
                </span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626', marginBottom: '0.5rem' }}>
                01
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
                The Lowball Bid Trap
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Traditional contractors quote £50,000 knowing full well the job costs £85,000. They deliberately exclude structural steel, subfloor leveling, and skip licences to win your signature, then spring the difference once demolition has ruined your home.
              </p>
            </div>

            {/* Trap 2 */}
            <div
              className="scroll-reveal scroll-reveal-delay-2"
              style={{
                backgroundColor: '#14161f',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '2rem 1.75rem',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                <span className="story-sticker story-sticker-dark" style={{ fontSize: '0.625rem', padding: '0.2rem 0.6rem' }}>
                  THE LOOPHOLE
                </span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626', marginBottom: '0.5rem' }}>
                02
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
                Vague &ldquo;Provisional Sums&rdquo;
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Standard tenders hide dozens of &ldquo;provisional sums&rdquo;—convenient escape hatches that let the builder legally charge thousands more for unforeseen drainage, steels, and foundation depths that any competent surveyor should have anticipated.
              </p>
            </div>

            {/* Trap 3 */}
            <div
              className="scroll-reveal scroll-reveal-delay-3"
              style={{
                backgroundColor: '#14161f',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '2rem 1.75rem',
                position: 'relative'
              }}
            >
              <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                <span className="story-sticker story-sticker-red" style={{ fontSize: '0.625rem', padding: '0.2rem 0.6rem' }}>
                  THE GHOST
                </span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626', marginBottom: '0.5rem' }}>
                03
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
                The Disappearing Boss
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                The charismatic director signs the deal, takes your deposit, and you never see him again. Unsupervised subcontractors show up at 10:30 AM, drink tea, make noise, and leave at 3:00 PM while your target completion date slips months into the future.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ----------------- 3. CHAPTER 2: THE FIXED JCT REVOLUTION ----------------- */}
      <section style={{ padding: 'clamp(4.5rem, 7vw, 6.5rem) 0', width: '100%', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
          
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(2.5rem, 5vw, 4rem)',
              alignItems: 'center'
            }}
          >
            {/* Story Editorial Text */}
            <div className="scroll-reveal">
              <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#dc2626', marginBottom: '0.5rem' }}>
                CHAPTER 02 // THE COUNTER-MOVEMENT
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 1.25rem 0', color: '#1d1d1f' }}>
                How we engineered the Fixed-Price JCT Standard.
              </h2>
              <p style={{ fontSize: '1.05rem', color: '#4b5563', lineHeight: 1.65, margin: '0 0 1.25rem 0' }}>
                We realised the problem wasn&rsquo;t bad intentions—it was lack of engineering discipline. Most builders don&rsquo;t know how to price properly, so they gamble with the client&rsquo;s money.
              </p>
              <p style={{ fontSize: '1.05rem', color: '#4b5563', lineHeight: 1.65, margin: '0 0 1.75rem 0' }}>
                We took the commercial governance model of tier-1 institutional towers and adapted it for residential London homes:
              </p>

              {/* 3 Inviolable Rules */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 800, fontSize: '0.8125rem', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                    01
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1d1d1f', fontSize: '0.9375rem' }}>Exhaustive Pre-Con Surveying</div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>We survey drainage, steel load paths, and party walls before quoting, removing the need for provisional sums.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 800, fontSize: '0.8125rem', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                    02
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1d1d1f', fontSize: '0.9375rem' }}>Binding JCT Contract Certainty</div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>A legally binding standard JCT Minor Works contract. Unless you voluntarily request a design change, the price is guaranteed.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: 800, fontSize: '0.8125rem', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                    03
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#1d1d1f', fontSize: '0.9375rem' }}>Foreman On Site Every Day at 07:30</div>
                    <div style={{ fontSize: '0.8125rem', color: '#6b7280', lineHeight: 1.5 }}>A dedicated site manager on your property from 07:30 to 17:00 every single working day until handover.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Real Project Visuals with Sticky Stamps */}
            <div className="scroll-reveal scroll-reveal-delay-1" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div
                className="story-photo-card"
                style={{
                  position: 'relative',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <div className="story-tape" />
                <img
                  src="/images/projects_unique/proj_3.jpg"
                  alt="Wandsworth Kitchen Extension with Pitched Glazing"
                  style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem' }}>
                  <span className="story-sticker story-sticker-dark">
                    WANDSWORTH EXTENSION // 9-WEEK SCHEDULE MAINTAINED
                  </span>
                </div>
              </div>

              <div
                className="story-photo-card"
                style={{
                  position: 'relative',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.08)'
                }}
              >
                <div className="story-tape" />
                <img
                  src="/images/projects_unique/proj_12.jpg"
                  alt="Clapham Dormer Loft Conversion Suite"
                  style={{ width: '100%', height: '260px', objectFit: 'cover', display: 'block' }}
                />
                <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem' }}>
                  <span className="story-sticker story-sticker-red">
                    CLAPHAM LOFT // £54,000 FIXED JCT RECORD
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ----------------- 4. CHAPTER 3: MASTER TRADESMEN ----------------- */}
      <section style={{ backgroundColor: '#fbfbfa', borderTop: '1px solid rgba(0, 0, 0, 0.06)', borderBottom: '1px solid rgba(0, 0, 0, 0.06)', padding: 'clamp(4.5rem, 7vw, 6rem) 0', width: '100%' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
          
          <div className="scroll-reveal" style={{ maxWidth: '780px', margin: '0 auto clamp(2.5rem, 4vw, 3.5rem) auto', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#dc2626', marginBottom: '0.5rem' }}>
              CHAPTER 03 // THE CRAFTSMEN
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 1rem 0', color: '#1d1d1f' }}>
              Not a broker. Not an app. True London master tradesmen.
            </h2>
            <p style={{ color: '#4b5563', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              We don&rsquo;t outsource your home to unregulated casual labourers. Our core trades are permanent, trusted professionals who have worked together across hundreds of London sites.
            </p>
          </div>

          {/* 4 Dedicated Craft Guilds */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {/* Guild 1 */}
            <div
              className="scroll-reveal scroll-reveal-delay-1"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                padding: '1.75rem 1.5rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#dc2626', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                GUILD 01
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1d1d1f', marginBottom: '0.5rem' }}>
                Master London Bricklayers
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.55, margin: 0 }}>
                Specialised in London Stock brick matching, Flemish and English bond masonry, and heritage lime mortar pointing on Victorian and Edwardian properties.
              </p>
            </div>

            {/* Guild 2 */}
            <div
              className="scroll-reveal scroll-reveal-delay-2"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                padding: '1.75rem 1.5rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#dc2626', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                GUILD 02
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1d1d1f', marginBottom: '0.5rem' }}>
                Structural Steel Fabricators
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.55, margin: 0 }}>
                Laser-surveyed universal RSJ beams and box frames, engineered to unlock vast open-plan kitchens and structurally supported rear elevations.
              </p>
            </div>

            {/* Guild 3 */}
            <div
              className="scroll-reveal scroll-reveal-delay-3"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                padding: '1.75rem 1.5rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#dc2626', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                GUILD 03
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1d1d1f', marginBottom: '0.5rem' }}>
                Gas Safe &amp; NICEIC Engineers
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.55, margin: 0 }}>
                Direct installation of high-output unvented Megaflo cylinders, manifold underfloor heating, and architectural LED lighting with full Building Control sign-offs.
              </p>
            </div>

            {/* Guild 4 */}
            <div
              className="scroll-reveal scroll-reveal-delay-4"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                padding: '1.75rem 1.5rem',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#dc2626', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                GUILD 04
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1d1d1f', marginBottom: '0.5rem' }}>
                Architectural Joiners &amp; Glaziers
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: 1.55, margin: 0 }}>
                Precision fitting of steel Crittall doors, flush threshold bifolds, structural frameless walk-on rooflights, and bespoke storage cabinetry.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ----------------- 5. CHAPTER 4: PROOF BY THE NUMBERS ----------------- */}
      <section style={{ backgroundColor: '#0e0f13', color: '#ffffff', padding: 'clamp(4.5rem, 7vw, 6.5rem) 0', width: '100%', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle Noise Texture */}
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
          
          <div className="scroll-reveal" style={{ maxWidth: '780px', margin: '0 auto clamp(2.5rem, 4vw, 3.5rem) auto', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#dc2626', marginBottom: '0.5rem' }}>
              CHAPTER 04 // THE TRACK RECORD
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 1rem 0', color: '#ffffff' }}>
              Built on uncompromising numbers.
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              We measure our reputation not by marketing claims, but by forensic metrics of completion certainty across London.
            </p>
          </div>

          {/* 4 High-Impact Numbers */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '3.5rem'
            }}
          >
            <div className="scroll-reveal scroll-reveal-delay-1" style={{ backgroundColor: '#14161f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, color: '#dc2626', lineHeight: 1, marginBottom: '0.5rem' }}>
                140+
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                London Projects
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                Delivered across Wandsworth, Richmond, Ealing &amp; Westminster
              </div>
            </div>

            <div className="scroll-reveal scroll-reveal-delay-2" style={{ backgroundColor: '#14161f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1, marginBottom: '0.5rem' }}>
                £0.00
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                Surprise Invoices
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                Zero unagreed variation claims billed to our clients ever
              </div>
            </div>

            <div className="scroll-reveal scroll-reveal-delay-3" style={{ backgroundColor: '#14161f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1, marginBottom: '0.5rem' }}>
                07:30
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                Morning Start
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                Guaranteed on-site foreman presence every single working day
              </div>
            </div>

            <div className="scroll-reveal scroll-reveal-delay-4" style={{ backgroundColor: '#14161f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '2rem 1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, color: '#dc2626', lineHeight: 1, marginBottom: '0.5rem' }}>
                10 Yrs
              </div>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.25rem' }}>
                Structural Warranty
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                Insurance-backed latent defect guarantee on all load-bearing works
              </div>
            </div>
          </div>

          {/* 3 Real Project Sticky Photo Gallery */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <div className="scroll-reveal scroll-reveal-delay-1 story-photo-card" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="story-tape" />
              <img src="/images/projects_unique/proj_5.jpg" alt="Richmond Reconfiguration" style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem' }}>
                <span className="story-sticker story-sticker-dark">RICHMOND TW9 // OAK &amp; RSJ STRUCTURE</span>
              </div>
            </div>

            <div className="scroll-reveal scroll-reveal-delay-2 story-photo-card" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="story-tape" />
              <img src="/images/projects_unique/proj_2.webp" alt="Chiswick Kitchen Diner" style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem' }}>
                <span className="story-sticker story-sticker-red">CHISWICK W4 // SLIMLINE BIFOLDS</span>
              </div>
            </div>

            <div className="scroll-reveal scroll-reveal-delay-3 story-photo-card" style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="story-tape" />
              <img src="/images/residential/res_2.jpg" alt="South London Renovation" style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', bottom: '0.75rem', left: '0.75rem' }}>
                <span className="story-sticker story-sticker-dark">SOUTHFIELDS SW18 // FULL HANDOVER</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ----------------- 6. CHAPTER 5: THE DIRECTORS' PLEDGE & CTA ----------------- */}
      <section style={{ padding: 'clamp(4.5rem, 7vw, 6.5rem) 0', width: '100%', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', padding: '0 1.25rem', textAlign: 'center' }}>
          
          {/* Directors' Pledge Box */}
          <div
            className="scroll-reveal"
            style={{
              backgroundColor: '#14151a',
              color: '#ffffff',
              borderRadius: '16px',
              padding: 'clamp(2.5rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.12)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              position: 'relative',
              marginBottom: '3.5rem'
            }}
          >
            <div style={{ position: 'absolute', top: '-0.85rem', left: '50%', transform: 'translateX(-50%)' }}>
              <span className="story-sticker story-sticker-red">
                ★ THE PRIME BUILDS PLEDGE OF HONOR
              </span>
            </div>

            <p
              style={{
                fontStyle: 'italic',
                fontSize: 'clamp(1.15rem, 2.2vw, 1.45rem)',
                lineHeight: 1.6,
                margin: '0 0 1.5rem 0',
                color: '#f8fafc',
                fontWeight: 500
              }}
            >
              &ldquo;If a builder cannot guarantee their price before they start, they do not understand their craft. When a London homeowner commits their life savings to expand their home, our sacred duty is to deliver on the exact pound and day agreed, with flawless craftsmanship.&rdquo;
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                The Directorate of Prime Builds London
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Chartered Institute of Building • London Site Governance
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="scroll-reveal scroll-reveal-delay-1">
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                margin: '0 0 1rem 0',
                color: '#1d1d1f'
              }}
            >
              Ready to build with total certainty?
            </h2>
            <p
              style={{
                fontSize: '1.05rem',
                color: '#4b5563',
                lineHeight: 1.6,
                maxWidth: '580px',
                margin: '0 auto 2rem auto'
              }}
            >
              Book an in-person site consultation with our senior project estimator. We review your plans, survey structural parameters, and provide an itemised fixed JCT price.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
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
                <span>Book Free Site Consultation</span>
                <span>›</span>
              </Link>
              <a
                href="tel:+447767672807"
                style={{
                  textDecoration: 'none',
                  color: '#1d1d1f',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0, 0, 0, 0.12)',
                  padding: '0.85rem 1.6rem',
                  borderRadius: '8px',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <span>+44 7767 672807</span>
                <span style={{ color: '#dc2626' }}>›</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

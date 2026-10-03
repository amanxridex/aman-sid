'use client';

import React, { useState } from 'react';

export default function BottomCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="quote-form" style={{ backgroundColor: '#fbfbfa', color: '#1d1d1f', padding: 'clamp(3.5rem, 7vw, 6rem) 0', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Header */}
        <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 4vw, 3rem)' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6e6e73', marginBottom: '0.5rem' }}>
            Site Survey &amp; Quote
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 1rem 0', color: '#1d1d1f' }}>
            Book your fixed-price survey.
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.125rem)', color: '#4b5563', lineHeight: 1.55, margin: '0 auto', maxWidth: '540px', fontWeight: 400 }}>
            Get an itemised fixed quote for your kitchen extension, loft conversion, or renovation. No obligations.
          </p>
        </div>

        {submitted ? (
          <div className="scroll-reveal scroll-reveal-delay-1" style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '2.5rem 1.5rem', textAlign: 'center', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#1d1d1f', marginBottom: '0.5rem' }}>
              Survey Request Received
            </h3>
            <p style={{ color: '#4b5563', fontSize: '0.9375rem', lineHeight: 1.6, margin: '0 auto 1.25rem auto', maxWidth: '440px' }}>
              Thank you, {formData.name || 'Client'}. We will call you within 24 hours to schedule an in-person property visit.
            </p>
            <div style={{ fontSize: '0.875rem', color: '#6e6e73' }}>
              Direct desk: <a href="tel:+447767672807" style={{ color: '#1d1d1f', textDecoration: 'none', fontWeight: 700 }}>+44 7767 672807</a>
            </div>
          </div>
        ) : (
          <form className="scroll-reveal scroll-reveal-delay-1" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Miller"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.15)',
                    color: '#1d1d1f',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 07700 900077"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.15)',
                    color: '#1d1d1f',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. david@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.15)',
                    color: '#1d1d1f',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  London Area / Postcode
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wandsworth SW18 or Ealing W5"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.15)',
                    color: '#1d1d1f',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                Project Overview (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Extension, loft conversion, or kitchen remodel..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.8rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.15)',
                  color: '#1d1d1f',
                  fontSize: '0.9375rem',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#dc2626',
                  color: '#ffffff',
                  padding: '0.85rem 2rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '300px',
                  transition: 'opacity 0.2s ease',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
                }}
              >
                Request Free Survey
              </button>

              <div style={{ fontSize: '0.8125rem', color: '#6e6e73', textAlign: 'center' }}>
                Or call our site desk directly:{' '}
                <a href="tel:+447767672807" style={{ color: '#1d1d1f', textDecoration: 'none', fontWeight: 700 }}>
                  +44 7767 672807
                </a>
              </div>
            </div>
          </form>
        )}

      </div>
    </section>
  );
}

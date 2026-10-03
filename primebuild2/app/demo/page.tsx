'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DemoPage() {
  const [formData, setFormData] = useState({
    projectName: '',
    borough: 'Westminster (Mayfair / Soho / Marylebone)',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    projectType: 'Prime Residential Renovation',
    estimatedSqFt: '2000',
    budgetRange: '£150K – £350K',
    currentStage: 'Planning / Concept Stage'
  });

  const [submitted, setSubmitted] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const sqFt = parseInt(formData.estimatedSqFt) || 2000;
  const estimatedCost = Math.round(sqFt * 185);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const availableSlots = [
    'Tomorrow at 10:00 AM (Senior Project Estimator)',
    'Tomorrow at 2:30 PM (Lead Construction Surveyor)',
    'Day after tomorrow at 11:00 AM (Senior Project Estimator)',
    'Day after tomorrow at 3:30 PM (Structural Site Manager)'
  ];

  return (
    <div className="responsive-section" style={{ backgroundColor: '#ffffff', minHeight: '100vh', width: '100%' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.25rem' }}>
        <div className="responsive-grid-2" style={{ alignItems: 'start' }}>
          
          {/* Left Column: Context & Proof */}
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 800, textTransform: 'uppercase', color: '#dc2626', letterSpacing: '0.08em', marginBottom: '1rem' }}>
              Free On-Site London Survey
            </div>

            <h1 style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15, margin: '0 0 1.25rem 0', color: '#14151a' }}>
              Book your site survey & get a fixed-price JCT estimate
            </h1>

            <p style={{ fontSize: '1.125rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '2rem' }}>
              Meet an experienced project estimator at your property for an inspection of your architectural drawings, structural feasibility, and fixed-price quotation.
            </p>

            {/* Estimated Budget Widget */}
            <div style={{ backgroundColor: '#f9fafb', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '1rem', padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#dc2626', fontWeight: 700, marginBottom: '0.5rem' }}>
                Indicative Benchmark Projection
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#dc2626', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                £{estimatedCost.toLocaleString('en-GB')}
                <span style={{ fontSize: '0.9375rem', color: '#6b7280', fontWeight: 500 }}> (Fixed JCT Target)</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '0.5rem 0 0 0' }}>
                Based on ~{sqFt.toLocaleString()} sq ft under standard London architectural specifications.
              </p>
            </div>

            {/* Trust Bullets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0, marginTop: '2px' }}>✓</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#14151a' }}>100% Fixed-Price Contract</div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Binding JCT contract with zero surprise variation invoices.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0, marginTop: '2px' }}>✓</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#14151a' }}>Dedicated Daily Site Manager</div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>On your site every working day with weekly video updates.</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0, marginTop: '2px' }}>✓</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#14151a' }}>10-Year Structural Warranty</div>
                  <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>Full Building Regulations sign-off and insurance-backed guarantee.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking Form */}
          <div
            className="responsive-card"
            style={{
              backgroundColor: '#f9fafb',
              borderRadius: '1.25rem',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', paddingBottom: '1rem', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#14151a' }}>
                    Project Consultation Form
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
                    Our estimators will review your details and respond within 24 hours.
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#14151a', display: 'block', marginBottom: '0.35rem' }}>
                    Project Name / Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mayfair Flat Renovation or Wandsworth Extension"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.875rem' }}
                  />
                </div>

                <div className="responsive-form-row">
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#14151a', display: 'block', marginBottom: '0.35rem' }}>
                      London Borough
                    </label>
                    <select
                      value={formData.borough}
                      onChange={(e) => setFormData({ ...formData, borough: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.875rem', backgroundColor: '#ffffff' }}
                    >
                      <option>Westminster (Mayfair / Soho)</option>
                      <option>Kensington & Chelsea (RBKC)</option>
                      <option>City of London / Shoreditch</option>
                      <option>Camden & Hampstead</option>
                      <option>Wandsworth & Battersea</option>
                      <option>Richmond & Kingston</option>
                      <option>Other London Borough</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#14151a', display: 'block', marginBottom: '0.35rem' }}>
                      Approx Area (sq ft)
                    </label>
                    <input
                      type="number"
                      value={formData.estimatedSqFt}
                      onChange={(e) => setFormData({ ...formData, estimatedSqFt: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#14151a', display: 'block', marginBottom: '0.35rem' }}>
                    Project Type
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.875rem', backgroundColor: '#ffffff' }}
                  >
                    <option>Prime Residential Renovation</option>
                    <option>House Extension & Loft Conversion</option>
                    <option>Commercial CAT-A / CAT-B Fitout</option>
                    <option>Basement Excavation & Structural Works</option>
                  </select>
                </div>

                <div className="responsive-form-row">
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#14151a', display: 'block', marginBottom: '0.35rem' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="James"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#14151a', display: 'block', marginBottom: '0.35rem' }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Campbell"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div className="responsive-form-row">
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#14151a', display: 'block', marginBottom: '0.35rem' }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="james@example.co.uk"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.875rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#14151a', display: 'block', marginBottom: '0.35rem' }}>
                      Telephone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="07123 456789"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-green"
                  style={{
                    width: '100%',
                    padding: '0.9rem',
                    fontSize: '1rem',
                    borderRadius: '8px',
                    marginTop: '0.5rem'
                  }}
                >
                  Book Free Site Survey & Estimate
                  <span style={{ fontSize: '1.1rem' }}>→</span>
                </button>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
                  🔒 Strict client confidentiality assured. Zero sales pressure.
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, margin: '0 auto 1.25rem auto' }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#14151a' }}>
                  Survey Request Received
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Thank you, {formData.firstName}. Our senior estimator will review your {formData.borough} project details and call you on {formData.phone} within 24 hours to schedule the visit.
                </p>

                {/* Preferred Consultation Slots */}
                <div style={{ textAlign: 'left', backgroundColor: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#14151a', marginBottom: '1rem' }}>
                    Select Preferred Site Visit Window:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {availableSlots.map((slot, sIdx) => (
                      <button
                        key={sIdx}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        style={{
                          backgroundColor: selectedSlot === slot ? '#fef2f2' : '#f9fafb',
                          color: selectedSlot === slot ? '#7f1d1d' : '#1f2937',
                          border: selectedSlot === slot ? '2px solid #dc2626' : '1px solid rgba(0,0,0,0.1)',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          fontSize: '0.875rem',
                          fontWeight: selectedSlot === slot ? 700 : 500,
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <Link
                  href="/"
                  className="btn-outline-dark"
                  style={{ fontSize: '0.875rem', padding: '0.65rem 1.5rem' }}
                >
                  Return to Homepage
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

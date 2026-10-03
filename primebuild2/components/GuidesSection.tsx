'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do you guarantee a fixed price without surprise variations?',
    answer: 'Before quoting, we conduct an exhaustive pre-construction survey to inspect structural condition, access, and service connections. We specify every trade, fixture, and material down to the penny and execute a standard JCT contract. Unless you request a deliberate change in scope, the price agreed is the price you pay.'
  },
  {
    question: 'Do you manage London council planning permission and Party Wall Awards?',
    answer: 'Yes. We work closely with leading London planning consultants and party wall surveyors across all 32 London Boroughs—including strict conservation areas in Westminster, Kensington & Chelsea, and Camden. We handle all documentation, notices, and council building control sign-offs.'
  },
  {
    question: 'Who will manage my project on a daily basis?',
    answer: 'Every Prime Build project is assigned a dedicated on-site project manager who is present on your site every single working day. They supervise trades, coordinate material deliveries, ensure health & safety compliance, and provide you with weekly photo and video progress reports.'
  },
  {
    question: 'What warranties and insurance do you provide?',
    answer: 'We carry £10,000,000 public and employer liability insurance. Upon completion and building control sign-off, you receive an insurance-backed 10-year structural warranty, full operations & maintenance (O&M) manuals, and a dedicated 12-month post-handover snagging warranty.'
  },
  {
    question: 'Can I visit an active or completed site before signing?',
    answer: 'Absolutely. We actively encourage prospective clients to visit our active sites in Central London or speak directly with previous property owners to witness our site cleanliness, craftsmanship, and trade standards firsthand.'
  }
];

export default function GuidesSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section style={{ padding: '5rem 0', backgroundColor: '#f9fafb', width: '100%', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        <div style={{ maxWidth: '800px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#dc2626', marginBottom: '0.5rem' }}>
            Got Questions?
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 1rem 0', color: '#14151a' }}>
            Frequently asked questions about building in London
          </h2>
          <p style={{ fontSize: '1.0625rem', color: '#4b5563', lineHeight: 1.6, margin: 0 }}>
            Everything you need to know about our contracts, timelines, site supervision, and warranties.
          </p>
        </div>

        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: isOpen ? '1.5px solid #dc2626' : '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  boxShadow: isOpen ? '0 4px 16px rgba(220,38,38,0.08)' : 'none'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '1.5rem 1.75rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    gap: '1rem'
                  }}
                >
                  <span style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#14151a', lineHeight: 1.35 }}>
                    {faq.question}
                  </span>
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: isOpen ? '#fef2f2' : '#f3f4f6',
                      color: isOpen ? '#dc2626' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.125rem',
                      fontWeight: 800,
                      flexShrink: 0,
                      transition: 'transform 0.2s ease'
                    }}
                  >
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1.75rem 1.5rem 1.75rem', fontSize: '0.9375rem', color: '#4b5563', lineHeight: 1.6, borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '1rem' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <span style={{ fontSize: '0.9375rem', color: '#6b7280', marginRight: '0.75rem' }}>
            Have a question specific to your property?
          </span>
          <a href="tel:+447767672807" style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'none', fontSize: '0.9375rem' }}>
            Speak directly with an estimator: +44 7767 672807 →
          </a>
        </div>

      </div>
    </section>
  );
}

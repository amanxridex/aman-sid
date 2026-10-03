'use client';

import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do you guarantee a fixed price without surprise extra costs?',
    answer: 'Before work starts, we survey your property and provide an itemised breakdown covering structural steelwork, foundations, trades, and finishes under a standard JCT Minor Works fixed-price contract. Unless you choose to alter the design, your price is guaranteed.'
  },
  {
    question: 'Do you manage London council planning and Permitted Development?',
    answer: 'Yes. We manage all Permitted Development lawful development certificates, full planning applications, Building Control submissions, and Party Wall notices across South and West London boroughs.'
  },
  {
    question: 'How long does a typical kitchen extension or loft conversion take?',
    answer: 'A standard single-storey rear kitchen extension takes approximately 10 to 12 weeks. A typical dormer loft conversion takes 6 to 8 weeks, with clear weekly milestone sign-offs.'
  },
  {
    question: 'Who will manage the building work day to day?',
    answer: 'A dedicated site foreman is present on your site every single day from 07:30. You have a direct WhatsApp group with your foreman and project lead for daily photos and weekly schedule updates.'
  },
  {
    question: 'What warranties and insurance do you provide at handover?',
    answer: 'Every completed scheme is backed by a 10-year insurance structural warranty, Building Control completion certificate, NICEIC electrical and Gas Safe sign-offs, and a 12-month post-completion defect warranty.'
  }
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleFAQ = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section style={{ backgroundColor: '#ffffff', color: '#1d1d1f', padding: 'clamp(3.5rem, 7vw, 6rem) 0' }}>
      <div style={{ maxWidth: '840px', margin: '0 auto', padding: '0 1.25rem' }}>
        
        {/* Section Header */}
        <div className="scroll-reveal" style={{ marginBottom: 'clamp(2rem, 4vw, 3.5rem)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6e6e73', marginBottom: '0.5rem' }}>
            Frequently Asked Questions
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, margin: 0, color: '#1d1d1f' }}>
            Clear answers. No jargon.
          </h2>
        </div>

        {/* Apple-style Smooth Animated Accordion */}
        <div className="scroll-reveal scroll-reveal-delay-1" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                <button
                  type="button"
                  onClick={() => toggleFAQ(idx)}
                  aria-expanded={isOpen}
                  style={{
                    width: '100%',
                    padding: 'clamp(1.15rem, 2vw, 1.5rem) 0',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.25rem',
                    textAlign: 'left'
                  }}
                >
                  <span
                    style={{
                      fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
                      fontWeight: 600,
                      letterSpacing: '-0.015em',
                      color: isOpen ? '#dc2626' : '#1d1d1f',
                      transition: 'color 0.2s ease',
                      lineHeight: 1.35
                    }}
                  >
                    {faq.question}
                  </span>

                  {/* Silky smooth rotating cross/plus indicator */}
                  <span
                    style={{
                      flexShrink: 0,
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isOpen ? '#dc2626' : '#6e6e73',
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.2s ease'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </span>
                </button>

                {/* CSS Grid Smooth Height Transition */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ minHeight: 0 }}>
                    <p
                      style={{
                        margin: 0,
                        paddingBottom: 'clamp(1.15rem, 2vw, 1.5rem)',
                        fontSize: 'clamp(0.9375rem, 1.4vw, 1rem)',
                        lineHeight: 1.6,
                        color: '#4b5563',
                        fontWeight: 400
                      }}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

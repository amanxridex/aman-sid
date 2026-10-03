'use client';
import { useState } from 'react';

export default function FAQAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  const faqs = [
    {
      q: 'What services does Rakshak offer?',
      a: 'Rakshak provides kernel-level zero-trust file isolation, adversarial honeypot dataset poisoning, and OS screen OCR / recall indexing blockers to prevent background AI scrapers from indexing local computer data.'
    },
    {
      q: 'What does your design process look like?',
      a: 'Rakshak operates autonomously beneath user space. Once installed, it registers an I/O filter driver that analyzes file access frequency and halts untrusted process PIDs in under 0.02ms.'
    },
    {
      q: 'How long does a system setup take?',
      a: 'Setup takes under 60 seconds using package managers like winget, brew, or bash installation scripts.'
    },
    {
      q: 'What deliverable will I receive?',
      a: 'You receive a signed kernel driver executable, lightweight background tray daemon, local security console GUI, and terminal CLI management utilities.'
    },
    {
      q: 'How do we get started and how much does it cost?',
      a: 'The core personal shield is 100% free and open-source under the AGPLv3 license. You can download and deploy it immediately.'
    }
  ];

  return (
    <section id="faq">
      <div className="container">
        <div className="faq-two-col">
          <div className="faq-left">
            <div className="tech-tag" style={{ marginBottom: '1rem' }}>
              <span className="pulse-dot-indigo"></span>
              <span>KNOWLEDGE BASE // FAQ</span>
            </div>
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about Rakshak kernel protection, honeypots, and compatibility.</p>
            <a href="/download" className="btn-deepip-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
              Contact Support
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((faq, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div key={idx} className={`faq-item ${isActive ? 'active' : ''}`}>
                  <button 
                    className="faq-question" 
                    onClick={() => setActiveIndex(isActive ? -1 : idx)}
                  >
                    <span>{faq.q}</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ transform: isActive ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}>
                      <path d="M4 6l4 4 4-4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

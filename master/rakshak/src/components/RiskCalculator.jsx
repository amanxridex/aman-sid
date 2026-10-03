'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import rakshakLogo from '../../public/rakshaklogo.png';

export default function RiskCalculator() {
  const [step, setStep] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [assessment, setAssessment] = useState(null);

  const selectOption = (stepNum, opt) => {
    setSelectedAnswers(prev => ({ ...prev, [stepNum]: opt }));
  };

  const handleNext = () => {
    if (!selectedAnswers[step]) {
      alert('Please select an option to proceed.');
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      const osWeight = selectedAnswers[1]?.weight || 0.35;
      const toolWeight = selectedAnswers[2]?.weight || 0.40;
      const storageWeight = selectedAnswers[3]?.weight || 0.35;

      const rawScore = (osWeight * 0.35 + toolWeight * 0.40 + storageWeight * 0.25) * 100;
      const finalScore = Math.min(99, Math.max(5, Math.round(rawScore)));

      let level = 'MODERATE EXPOSURE';
      let levelColor = '#ffd60a';
      if (finalScore >= 70) {
        level = 'CRITICAL AI VULNERABILITY';
        levelColor = '#ff453a';
      } else if (finalScore >= 45) {
        level = 'ELEVATED THREAT LEVEL';
        levelColor = '#ff9f0a';
      } else if (finalScore >= 25) {
        level = 'MODERATE EXPOSURE';
        levelColor = '#ffd60a';
      } else {
        level = 'MINIMAL RISK • HARDENED SYSTEM';
        levelColor = '#30d158';
      }

      setAssessment({
        score: finalScore,
        level,
        levelColor,
        recallExposure: Math.min(98, Math.max(4, Math.round(osWeight * 100 * 0.95))),
        webCrawlerRisk: Math.min(99, Math.max(5, Math.round(toolWeight * 100 * 0.90))),
        storageLeakRisk: Math.min(95, Math.max(3, Math.round(storageWeight * 100 * 0.90)))
      });
      setStep(4);
    }
  };

  return (
    <section id="calculator" className="calculator-section">
      <div className="container">
        <div className="section-header-deepip">
          <div className="tag_content">
            <div className="blue_tag">SECURITY AUDIT</div>
            <span>Calculate Local AI Exposure</span>
          </div>
          <h2>Check Your AI Data Vulnerability Score</h2>
          <p>Evaluate how exposed your local machine files, API keys, and source code are to autonomous background AI scrapers.</p>
        </div>

        <div className="calc-card">
          <div className="calc-progress">
            <div 
              className="progress-fill" 
              style={{ width: `${step === 4 ? 100 : (step / 3) * 100}%` }}
            ></div>
          </div>

          {step === 1 && (
            <div className="calc-step active">
              <h3 className="calc-question">1. What Operating System do you use daily?</h3>
              <div className="calc-options">
                {[
                  { label: 'Windows 11 (With Copilot & Recall indexing features)', weight: 0.90, logo: '/assets/tech/windows.svg' },
                  { label: 'macOS Sequoia / Sonoma (Apple Intelligence enabled)', weight: 0.55, logo: '/assets/tech/apple-white.svg' },
                  { label: 'Linux (Custom Hardened Kernel)', weight: 0.20, logo: '/assets/tech/linux.svg' }
                ].map((opt, i) => (
                  <button 
                    key={i} 
                    className={`option-btn ${selectedAnswers[1]?.weight === opt.weight ? 'selected' : ''}`}
                    onClick={() => selectOption(1, opt)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                      <img src={opt.logo} alt="" width="16" height="16" style={{ objectFit: 'contain' }} /> {opt.label}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12l4-4-4-4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="calc-step active">
              <h3 className="calc-question">2. Do you run desktop coding assistants or local AI tools?</h3>
              <div className="calc-options">
                {[
                  { label: 'Yes, desktop coding assistants & local daemons (Cursor, Copilot, Ollama)', weight: 0.95, logo: '/assets/tech/python.svg' },
                  { label: 'Only cloud web portals (ChatGPT, Claude web apps in browser)', weight: 0.60, logo: '/assets/tech/openai.svg' },
                  { label: 'Strictly zero AI tools installed on workstation', weight: 0.15, logo: '/assets/tech/wireguard.svg' }
                ].map((opt, i) => (
                  <button 
                    key={i} 
                    className={`option-btn ${selectedAnswers[2]?.weight === opt.weight ? 'selected' : ''}`}
                    onClick={() => selectOption(2, opt)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                      <img src={opt.logo} alt="" width="16" height="16" style={{ objectFit: 'contain' }} /> {opt.label}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12l4-4-4-4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="calc-step active">
              <h3 className="calc-question">3. How are your sensitive financial, keys &amp; code files stored?</h3>
              <div className="calc-options">
                {[
                  { label: 'Standard unencrypted user folders (/Documents, /Desktop, .env files)', weight: 0.90, logo: '/assets/tech/googledocs.svg' },
                  { label: 'Cloud sync folders (OneDrive, Google Drive, iCloud)', weight: 0.65, logo: '/assets/tech/microsoft.svg' },
                  { label: 'Encrypted partitions or air-gapped cryptographic vaults', weight: 0.20, logo: '/assets/tech/bitwarden.svg' }
                ].map((opt, i) => (
                  <button 
                    key={i} 
                    className={`option-btn ${selectedAnswers[3]?.weight === opt.weight ? 'selected' : ''}`}
                    onClick={() => selectOption(3, opt)}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                      <img src={opt.logo} alt="" width="16" height="16" style={{ objectFit: 'contain' }} /> {opt.label}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12l4-4-4-4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && assessment && (
            <div className="calc-step active">
              <div className="risk-result">
                <div className="risk-score-circle" style={{ borderColor: assessment.levelColor }}>
                  <span className="risk-score-num" style={{ color: assessment.levelColor }}>{assessment.score}%</span>
                  <span className="risk-score-label" style={{ color: assessment.levelColor }}>{assessment.level}</span>
                </div>

                <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>
                  Workstation AI Ingestion &amp; Scraping Threat Analysis
                </h3>

                <div style={{
                  maxWidth: 620,
                  margin: '0 auto 1.5rem',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '0.75rem',
                  textAlign: 'left'
                }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block' }}>Recall Indexer Risk:</span>
                    <strong style={{ color: assessment.recallExposure >= 60 ? '#ff453a' : assessment.recallExposure >= 30 ? '#ff9f0a' : '#30d158', fontSize: '1rem', fontFamily: 'var(--font-code)' }}>{assessment.recallExposure}%</strong>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block' }}>LLM Web Scraper Risk:</span>
                    <strong style={{ color: assessment.webCrawlerRisk >= 60 ? '#ff453a' : assessment.webCrawlerRisk >= 30 ? '#ff9f0a' : '#30d158', fontSize: '1rem', fontFamily: 'var(--font-code)' }}>{assessment.webCrawlerRisk}%</strong>
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '0.75rem', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block' }}>Local Storage Leakage:</span>
                    <strong style={{ color: assessment.storageLeakRisk >= 60 ? '#ff453a' : assessment.storageLeakRisk >= 30 ? '#ff9f0a' : '#30d158', fontSize: '1rem', fontFamily: 'var(--font-code)' }}>{assessment.storageLeakRisk}%</strong>
                  </div>
                </div>

                <p style={{ color: '#94a3b8', maxWidth: 580, margin: '0 auto 1.5rem', lineHeight: 1.6, fontSize: '0.9rem' }}>
                  {assessment.score < 25 
                    ? 'Your workstation demonstrates robust zero-trust defense and minimal vulnerability to autonomous AI scrapers. Deploying Rakshak provides air-gapped immunity as OS background daemons evolve.'
                    : 'Without active zero-trust perimeter filtering, background AI daemons, desktop recall indexers, and automated LLM extractors can harvest your files to train commercial models.'}
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/radar" className="btn btn-secondary btn-sm" style={{ padding: '0.7rem 1.4rem' }}>
                    View Live Defense Radar
                  </Link>
                  <Link href="/download" className="btn-deepip-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
                    <Image src={rakshakLogo} alt="Rakshak" width={18} height={18} style={{ objectFit: 'contain' }} /> 
                    Deploy Rakshak Shield
                  </Link>
                </div>
              </div>
            </div>
          )}

          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button onClick={handleNext} className="btn-deepip-blue" style={{ padding: '0.6rem 1.4rem', fontSize: '0.875rem' }}>
                Next Question
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

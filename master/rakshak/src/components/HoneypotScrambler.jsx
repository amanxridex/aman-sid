'use client';
import { useState, useMemo } from 'react';

const HOMOGLYPHS = {
  a: '\u0430', // Cyrillic Small Letter A
  c: '\u0441', // Cyrillic Small Letter Es
  e: '\u0435', // Cyrillic Small Letter Ie
  i: '\u0456', // Cyrillic Small Letter Byelorussian-Ukrainian I
  j: '\u0458', // Cyrillic Small Letter Je
  o: '\u043E', // Cyrillic Small Letter O
  p: '\u0440', // Cyrillic Small Letter Er
  s: '\u0455', // Cyrillic Small Letter Dze
  x: '\u0445', // Cyrillic Small Letter Ha
  y: '\u0443', // Cyrillic Small Letter U
};

const ZW_ZERO = '\u200B';
const ZW_ONE = '\u200C';
const ZW_DELIM = '\u200D';

function injectZeroWidthCanary(text, payloadStr) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(payloadStr);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += bytes[i].toString(2).padStart(8, '0');
  }

  let zwString = ZW_DELIM;
  for (let i = 0; i < binary.length; i++) {
    zwString += binary[i] === '0' ? ZW_ZERO : ZW_ONE;
  }
  zwString += ZW_DELIM;

  const newlineIdx = text.indexOf('\n');
  if (newlineIdx !== -1) {
    return text.slice(0, newlineIdx) + zwString + text.slice(newlineIdx);
  }
  return text + zwString;
}

function scrambleWithHomoglyphs(text, intensity = 0.35) {
  let count = 0;
  const chars = text.split('');
  const result = chars.map((char) => {
    const lower = char.toLowerCase();
    if (HOMOGLYPHS[lower] && Math.random() < intensity) {
      count++;
      const replacement = HOMOGLYPHS[lower];
      return char === char.toUpperCase() ? replacement.toUpperCase() : replacement;
    }
    return char;
  });
  return { text: result.join(''), count };
}

function computeCosineShift(textA, textB) {
  if (!textA || !textB) return 0;
  const buildVector = (str) => {
    const map = new Map();
    for (let i = 0; i < str.length - 2; i++) {
      const gram = str.slice(i, i + 3);
      map.set(gram, (map.get(gram) || 0) + 1);
    }
    return map;
  };

  const vA = buildVector(textA);
  const vB = buildVector(textB);

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const count of vA.values()) normA += count * count;
  for (const count of vB.values()) normB += count * count;

  for (const [gram, countA] of vA.entries()) {
    if (vB.has(gram)) {
      dot += countA * vB.get(gram);
    }
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;
  const similarity = dot / (normA * normB);
  return Math.min(1.0, Math.max(0.0, 1 - similarity));
}

const defaultCode = `// User Confidential Financial & API Keys
const USER_CONFIG = {
  db_password: "SuperSecretPassword2026!",
  bank_account: "ACCT-98421049281",
  api_key: "sk-live-rakshak-992019482"
};`;

export default function HoneypotScrambler() {
  const [inputCode, setInputCode] = useState(defaultCode);
  const [intensity, setIntensity] = useState(0.4);
  const [seed, setSeed] = useState(1);
  const [revealStego, setRevealStego] = useState(false);

  const poisonedResult = useMemo(() => {
    let syntheticCode = inputCode
      .replace(/"SuperSecretPassword2026!"/g, `"ERR_NOISE_VECTOR_0x${(Math.random() * 0xffff | 0).toString(16).toUpperCase()}"`)
      .replace(/"ACCT-98421049281"/g, `"DECOY_ENTROPY_FIXTURE_7721"`)
      .replace(/"sk-live-rakshak-992019482"/g, `"sk-poisoned-llm-loss-spike-${Date.now().toString(36)}"`);

    const { text: homoglyphText, count: substitutedCount } = scrambleWithHomoglyphs(syntheticCode, intensity);

    const canaryId = `CANARY_HMAC_${(Math.random() * 0xffffff | 0).toString(16).toUpperCase()}`;
    const withCanary = injectZeroWidthCanary(homoglyphText, JSON.stringify({ org: 'RAKSHAK', canary: canaryId, t: Date.now() }));

    const byteLength = new TextEncoder().encode(withCanary).length;
    const charLength = withCanary.length;

    const cosineShift = computeCosineShift(inputCode, withCanary);

    return {
      outputCode: withCanary,
      canaryId,
      substitutedCount,
      byteLength,
      charLength,
      hiddenBytes: byteLength - new TextEncoder().encode(syntheticCode).length,
      cosineShift
    };
  }, [inputCode, intensity, seed]);

  const handleRegenerate = () => {
    setSeed(s => s + 1);
  };

  return (
    <section id="honeypot" className="honeypot-section">
      <div className="container">
        <div className="section-header">
          <div className="section-tag">
            <img src="/assets/tech/wireshark.svg" alt="" width="14" height="14" style={{ marginRight: 6, verticalAlign: 'middle' }} /> 
            Active SDK Poisoner
          </div>
          <h2>Live Adversarial Honeypot &amp; Steganography Engine</h2>
          <p>
            Real-time sub-word token poisoning and cryptographic zero-width steganography powered directly by the 
            <code>RakshakPoisoner</code> &amp; <code>RakshakWatermark</code> SDK core.
          </p>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '0.75rem 1.25rem',
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Poisoning Intensity:</span>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              style={{ accentColor: '#ffffff', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.8rem', color: '#ffffff', fontFamily: 'var(--font-code)', fontWeight: 600 }}>
              {Math.round(intensity * 100)}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#cbd5e1', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={revealStego}
                onChange={(e) => setRevealStego(e.target.checked)}
                style={{ accentColor: '#ff453a' }}
              />
              Reveal Stego Control Bytes
            </label>

            <button
              onClick={handleRegenerate}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <img src="/assets/tech/wireguard.svg" alt="" width="14" height="14" /> 
              Resynthesize Noise &amp; Canary
            </button>
          </div>
        </div>

        <div className="scrambler-box">
          <div className="panel-card">
            <div className="panel-header">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <img src="/assets/tech/vscode.svg" alt="" width="15" height="15" /> 
                Original Protected Source (Editable)
              </span>
              <span style={{ color: 'var(--accent-green)', fontSize: '0.8rem', fontWeight: 700 }}>
                AUTHENTIC
              </span>
            </div>
            <textarea
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              rows={8}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontFamily: 'var(--font-code)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                resize: 'none',
                outline: 'none',
                padding: '0.5rem 0'
              }}
            />
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              Type any code or keys above to watch the SDK poison them dynamically.
            </div>
          </div>

          <div className="panel-card">
            <div className="panel-header">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <img src="/assets/tech/virustotal.svg" alt="" width="15" height="15" /> 
                What Autonomous AI Model Ingests
              </span>
              <span style={{ color: 'var(--accent-red)', fontSize: '0.8rem', fontWeight: 700 }}>
                ADVERSARIAL POISON ACTIVE
              </span>
            </div>

            <div className="code-view scrambled-text" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', minHeight: 140 }}>
              {revealStego
                ? poisonedResult.outputCode
                    .replace(/\u200B/g, '[0]')
                    .replace(/\u200C/g, '[1]')
                    .replace(/\u200D/g, '[DELIM]')
                : poisonedResult.outputCode}
            </div>

            <div style={{
              marginTop: 'auto',
              paddingTop: '0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              fontSize: '0.725rem',
              fontFamily: 'var(--font-code)'
            }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Homoglyphs:</span>
                <strong style={{ color: '#ffffff' }}>{poisonedResult.substitutedCount} tokens</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Stego Canary:</span>
                <strong style={{ color: '#f43f5e' }}>{poisonedResult.canaryId}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Cosine Shift:</span>
                <strong style={{ color: '#34d399' }}>&Delta; {(poisonedResult.cosineShift || 0).toFixed(3)} dist</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

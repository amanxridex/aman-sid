'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import rakshakLogo from '../../public/rakshaklogo.png';
import { detectAiScraper } from '../../packages/rakshaksdkv1/dist/detector.js';

const TEST_VECTORS = [
  {
    id: 'AZURE_CHATGPT',
    name: 'Microsoft Azure Egress (ChatGPT Web Worker)',
    desc: 'Autonomous crawler egressing from Azure AS8075 with desktop Chrome User-Agent but missing navigation topology.',
    req: {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'x-vercel-ip-as-number': '8075',
        'sec-fetch-mode': 'none',
        'sec-fetch-dest': 'none',
        'accept': '*/*',
        'accept-language': 'en-US'
      },
      ip: '20.12.45.10',
      url: '/developers'
    }
  },
  {
    id: 'AWS_CLAUDE',
    name: 'Amazon AWS Egress (Claude Web Fetcher)',
    desc: 'Automated crawler on Amazon AWS AS16509 fetching documentation with non-browser fetch headers.',
    req: {
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)',
        'x-vercel-ip-as-number': '16509',
        'sec-fetch-mode': 'none',
        'accept': 'text/plain, text/markdown',
        'accept-language': 'en-US'
      },
      ip: '54.210.12.9',
      url: '/docs'
    }
  },
  {
    id: 'SPOOFED_CHROME',
    name: 'Spoofed Chromium Script (cURL / Python)',
    desc: 'CLI script claiming modern desktop Chrome but completely omitting mandatory Sec-CH-UA client hints.',
    req: {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'x-vercel-ip-as-number': '7018',
        'sec-fetch-mode': 'none',
        'accept': '*/*'
      },
      ip: '198.51.100.44',
      url: '/pricing'
    }
  },
  {
    id: 'HEADLESS_PLAYWRIGHT',
    name: 'Headless Browser Automation (Playwright / Puppeteer)',
    desc: 'Programmatic Chromium instance executing JavaScript with headless client hints.',
    req: {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/128.0 Safari/537.36 (Playwright)',
        'sec-ch-ua': '"Chromium";v="128", "HeadlessChrome";v="128"',
        'x-vercel-ip-as-number': '14061',
        'sec-fetch-mode': 'cors'
      },
      ip: '167.99.14.22',
      url: '/founders'
    }
  },
  {
    id: 'REAL_HUMAN',
    name: 'Verified Real Human Browser',
    desc: 'Residential consumer ISP, authentic desktop Chrome Sec-CH-UA hints, and verified Sec-Fetch navigation mode.',
    req: {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Chromium";v="128", "Google Chrome";v="128"',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-dest': 'document',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9',
        'x-vercel-ip-as-number': '7018'
      },
      ip: '73.189.44.12',
      url: '/developers'
    }
  }
];

export default function Simulator() {
  const [isShieldActive, setIsShieldActive] = useState(true);
  const [selectedVectorIdx, setSelectedVectorIdx] = useState(0);
  const [customLiveVector, setCustomLiveVector] = useState(null);
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [logs, setLogs] = useState([
    { type: 'INFO', msg: 'Rakshak Security Knowledge (.rsk) Protocol Invariant Engine initialized', time: '08:00:00' },
    { type: 'SAFE', msg: 'Zero-Trust Protocol Invariants Active: ASN Telemetry, Sec-CH-UA, Sec-Fetch Topology', time: '08:00:01' },
    { type: 'SAFE', msg: 'Asymmetric Deception Decoy Matrix (/apparel honeypot) armed with 200 OK', time: '08:00:02' }
  ]);

  const consoleContainerRef = useRef(null);

  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const fetchLiveEdgePacket = async () => {
    setIsFetchingLive(true);
    try {
      const res = await fetch('/api/rakshak/telemetry?t=' + Date.now());
      const data = await res.json();
      const latest = data.liveFeed?.[0] || data.currentCaller;
      if (latest) {
        const asnNum = (latest.asn || '').replace(/[^0-9]/g, '');
        const liveVector = {
          id: 'LIVE_' + (latest.id || 'PACKET'),
          name: `LIVE EDGE PACKET: ${latest.company || 'Active Visitor'} (${latest.ip})`,
          desc: `Captured directly from live edge telemetry. Location: ${latest.location || 'Global'}, ASN: ${latest.asn}, Fetch Mode: ${latest.invariants?.secFetch || 'none'}.`,
          req: {
            headers: {
              'user-agent': latest.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : 'Mozilla/5.0'),
              'x-vercel-ip-as-number': asnNum || '7018',
              'sec-fetch-mode': latest.invariants?.secFetch?.split('/')[0]?.trim() || 'none',
              'sec-fetch-dest': latest.invariants?.secFetch?.split('/')[1]?.trim() || 'none',
              'sec-ch-ua': latest.invariants?.clientHints === 'VERIFIED' ? '"Chromium";v="128", "Not;A=Brand";v="24"' : ''
            },
            ip: latest.ip || '127.0.0.1',
            url: latest.route || latest.path || '/'
          }
        };
        setCustomLiveVector(liveVector);
        setSelectedVectorIdx(-1);
        setEvalResult(null);
        setLogs(prev => [
          ...prev,
          { type: 'INFO', msg: `[LIVE CAPTURE] Loaded real ingress packet from ${latest.ip} (${latest.company || 'Visitor'})`, time: new Date().toLocaleTimeString() }
        ]);
      }
    } catch (err) {
      console.error('Failed to capture live packet:', err);
    } finally {
      setIsFetchingLive(false);
    }
  };

  const currentVector = selectedVectorIdx === -1 && customLiveVector
    ? customLiveVector
    : TEST_VECTORS[selectedVectorIdx] || TEST_VECTORS[0];

  const runEvaluation = () => {
    setIsEvaluating(true);
    const vector = currentVector;
    const now = new Date().toLocaleTimeString();

    setLogs(prev => [
      ...prev,
      { type: 'INFO', msg: `>>> INCOMING EDGE PACKET: ${vector.name}`, time: now },
      { type: 'INFO', msg: `    Route: ${vector.req.url} | IP: ${vector.req.ip} | ASN: AS${vector.req.headers['x-vercel-ip-as-number']}`, time: now }
    ]);

    setTimeout(() => {
      // Execute REAL Rakshak detection engine
      const detection = detectAiScraper(vector.req);
      setEvalResult(detection);
      const evalTime = new Date().toLocaleTimeString();

      if (!isShieldActive) {
        setLogs(prev => [
          ...prev,
          { type: 'VULNERABLE', msg: `[SHIELD DISABLED] Invariant checks bypassed. Raw origin data exposed to ${vector.name}!`, time: evalTime }
        ]);
      } else if (detection.isBot) {
        setLogs(prev => [
          ...prev,
          { type: 'BLOCKED', msg: `[NON-HUMAN DETECTED] Threat Score: ${detection.confidence}% | Violations: ${detection.reasons.length}`, time: evalTime },
          ...detection.reasons.map(r => ({ type: 'BLOCKED', msg: `    - ${r}`, time: evalTime })),
          { type: 'HONEYPOT', msg: `[ASYMMETRIC DECEPTION ACTIVE] Silently served /apparel honeypot catalog with HTTP 200 OK. Zero origin data leaked!`, time: evalTime }
        ]);
      } else {
        setLogs(prev => [
          ...prev,
          { type: 'SAFE', msg: `[VERIFIED HUMAN PASS] 0% Threat Score. Residential ISP & verified browser hints confirmed. Clean origin passthrough.`, time: evalTime }
        ]);
      }

      setIsEvaluating(false);
    }, 450);
  };

  return (
    <section style={{ width: '100%', maxWidth: '100%', padding: '6.5rem clamp(1.5rem, 4vw, 4.5rem) 5rem', boxSizing: 'border-box' }}>
      <div className="section-header-deepip">
        <div className="tag_content">
          <div className="blue_tag">INTERACTIVE SANDBOX</div>
          <span>Edge Invariant Evaluator</span>
        </div>
        <h2>Rakshak Live Edge Policy &amp; Invariant Simulator</h2>
        <p>
          Test real edge protocol invariants (Datacenter ASN, Chromium Client Hints, and Sec-Fetch navigation topology) against the production Rakshak detection engine in real time.
        </p>
      </div>

      <div className="deepip-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Card Topbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem', background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="mac-dots">
              <span className="mac-dot mac-dot-red"></span>
              <span className="mac-dot mac-dot-yellow"></span>
              <span className="mac-dot mac-dot-green"></span>
            </div>
            <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.825rem', color: '#94a3b8' }}>
              Rakshak Protocol Invariant Engine (v1.0.0)
            </span>
          </div>
          <span style={{ color: isShieldActive ? '#38bdf8' : '#ef4444', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Image src={rakshakLogo} alt="Rakshak" width={16} height={16} style={{ objectFit: 'contain' }} /> 
            {isShieldActive ? 'SHIELD ACTIVE & ENFORCED' : 'SHIELD BYPASSED'}
          </span>
        </div>

        {/* 2-Column Split: Controls + Real-Time Terminal */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          {/* Left: Interactive Controls */}
          <div style={{ padding: '1.5rem', background: 'rgba(5, 8, 15, 0.7)', borderRight: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h4 style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.6rem' }}>
                1. Edge Shield Enforcement Mode
              </h4>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 12, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>Asymmetric Deception Shield</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Serve silent 200 OK decoy on threat</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={isShieldActive} 
                  onChange={(e) => setIsShieldActive(e.target.checked)}
                  style={{ width: 18, height: 18, accentColor: '#146ef5', cursor: 'pointer' }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <h4 style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  2. Select Ingress Vector
                </h4>
                <button
                  type="button"
                  onClick={fetchLiveEdgePacket}
                  disabled={isFetchingLive}
                  style={{
                    padding: '0.25rem 0.6rem',
                    background: selectedVectorIdx === -1 ? '#00F5FF' : 'rgba(0, 245, 255, 0.1)',
                    color: selectedVectorIdx === -1 ? '#000' : '#00F5FF',
                    border: '1px solid rgba(0, 245, 255, 0.4)',
                    borderRadius: 4,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isFetchingLive ? 'Capturing...' : '⚡ Capture Live Edge Ingress'}
                </button>
              </div>

              <select 
                value={selectedVectorIdx}
                onChange={(e) => {
                  setSelectedVectorIdx(parseInt(e.target.value, 10));
                  setEvalResult(null);
                }}
                style={{ width: '100%', padding: '0.75rem 1rem', background: '#070a12', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, color: '#fff', fontSize: '0.85rem', outline: 'none', cursor: 'pointer' }}
              >
                {customLiveVector && (
                  <option value={-1}>[LIVE CAPTURED] {customLiveVector.name}</option>
                )}
                {TEST_VECTORS.map((v, i) => (
                  <option key={v.id} value={i}>{v.name}</option>
                ))}
              </select>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.5rem 0 0', lineHeight: 1.4 }}>
                {currentVector.desc}
              </p>
            </div>

            {/* Packet Header Inspector Preview */}
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: 8, padding: '0.75rem', border: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.725rem', fontFamily: 'var(--font-code)', color: '#cbd5e1' }}>
              <div style={{ color: '#64748b', marginBottom: '0.35rem' }}>PACKET HEADERS INSPECTOR:</div>
              <div>Route: <span style={{ color: '#38bdf8' }}>{currentVector.req.url}</span></div>
              <div>IP: <span style={{ color: '#cbd5e1' }}>{currentVector.req.ip}</span></div>
              <div>ASN: <span style={{ color: '#38bdf8' }}>AS{currentVector.req.headers['x-vercel-ip-as-number']}</span></div>
              <div>Sec-Fetch-Mode: <span style={{ color: currentVector.req.headers['sec-fetch-mode'] === 'navigate' ? '#34d399' : '#f87171' }}>{currentVector.req.headers['sec-fetch-mode'] || 'NONE'}</span></div>
              <div>Sec-CH-UA: <span style={{ color: currentVector.req.headers['sec-ch-ua'] ? '#34d399' : '#f87171' }}>{currentVector.req.headers['sec-ch-ua'] ? 'VERIFIED' : 'ABSENT'}</span></div>
            </div>

            <button 
              onClick={runEvaluation} 
              disabled={isEvaluating}
              className="btn-deepip-blue" 
              style={{ width: '100%', marginTop: 'auto', minHeight: 46, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: isEvaluating ? 'wait' : 'pointer' }}
            >
              {isEvaluating ? 'Executing Invariant Checks...' : 'Evaluate Vector Against Engine'}
            </button>
          </div>

          {/* Right: Real-Time Execution Console */}
          <div style={{ padding: '1.5rem', background: '#030509', fontFamily: 'var(--font-code)', minHeight: 340, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.85rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.6rem' }}>
              <span>REAL-TIME INVARIANT EVALUATION STREAM</span>
              <span>ENGINE: RSK-ZERO-TRUST-V1</span>
            </div>
            <div 
              ref={consoleContainerRef}
              style={{ flex: 1, overflowY: 'auto', maxHeight: 280, display: 'flex', flexDirection: 'column', gap: '0.55rem' }}
            >
              {logs.map((l, i) => (
                <div key={i} style={{ fontSize: '0.825rem', display: 'flex', gap: '0.65rem', lineHeight: 1.45 }}>
                  <span style={{ color: '#64748b' }}>[{l.time}]</span>
                  {l.type === 'BLOCKED' && <span style={{ color: '#ef4444', fontWeight: 700 }}>[THREAT]</span>}
                  {l.type === 'HONEYPOT' && <span style={{ color: '#38bdf8', fontWeight: 700 }}>[DECEPTION]</span>}
                  {l.type === 'SAFE' && <span style={{ color: '#10b981', fontWeight: 700 }}>[HUMAN]</span>}
                  {l.type === 'INFO' && <span style={{ color: '#60a5fa' }}>[INSPECT]</span>}
                  {l.type === 'VULNERABLE' && <span style={{ color: '#f59e0b', fontWeight: 700 }}>[EXPOSED]</span>}
                  <span style={{ color: '#fff', wordBreak: 'break-all' }}>{l.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

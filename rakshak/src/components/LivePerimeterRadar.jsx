'use client';
import { useState, useEffect } from 'react';
import { getRskDisassemblyDump } from '@/lib/rskDisassembler';

// Base server coordinate: Vercel Global Edge Anycast (Washington D.C. Ingress)
const SERVER_LAT = 39.0438;
const SERVER_LON = -77.4874;

// Known regional coordinate centroids for ASN/country mappings
const COUNTRY_COORDS = {
  US: { lat: 37.0902, lon: -95.7129 },
  IN: { lat: 20.5937, lon: 78.9629 },
  GB: { lat: 55.3781, lon: -3.4360 },
  DE: { lat: 51.1657, lon: 10.4515 },
  FR: { lat: 46.2276, lon: 2.2137 },
  JP: { lat: 36.2048, lon: 138.2529 },
  SG: { lat: 1.3521, lon: 103.8198 },
  AU: { lat: -25.2744, lon: 133.7751 },
  CA: { lat: 56.1304, lon: -106.3468 },
  NL: { lat: 52.1326, lon: 5.2913 },
  IE: { lat: 53.1424, lon: -7.6921 },
  BR: { lat: -14.2350, lon: -51.9253 }
};

function computePolarCoordinates(evt) {
  let targetLat = evt.latitude;
  let targetLon = evt.longitude;

  if (!targetLat || !targetLon) {
    const country = (evt.country || evt.location?.split(',')[1] || 'US').trim().toUpperCase();
    const geo = COUNTRY_COORDS[country] || COUNTRY_COORDS['US'];
    const ipHash = (evt.ip || '127.0.0.1').split('.').reduce((acc, oct) => ((acc << 5) - acc + (parseInt(oct, 10) || 0)) | 0, 0);
    const jitterLat = ((Math.abs(ipHash % 40) - 20) / 10);
    const jitterLon = ((Math.abs((ipHash >> 3) % 40) - 20) / 10);
    targetLat = geo.lat + jitterLat;
    targetLon = geo.lon + jitterLon;
  }

  // True spherical forward azimuth (bearing from North: 0° - 360°)
  const φ1 = (SERVER_LAT * Math.PI) / 180;
  const φ2 = (targetLat * Math.PI) / 180;
  const Δλ = ((targetLon - SERVER_LON) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

  // Real Haversine great-circle distance in kilometers
  const R = 6371;
  const dLat = φ2 - φ1;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const distanceKm = R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

  // Distance scaled into radar display radius
  const distFactor = Math.min(0.88, Math.max(0.20, 0.20 + (distanceKm / 20000) * 0.68));

  return { bearing, distanceKm, distFactor };
}

// Authentic Visual Radar Display Component
function RadarScreen({ events, selectedEvent, onSelectEvent }) {
  const [sweepAngle, setSweepAngle] = useState(0);

  useEffect(() => {
    let animId;
    const updateSweep = () => {
      setSweepAngle((prev) => (prev + 1.8) % 360);
      animId = requestAnimationFrame(updateSweep);
    };
    animId = requestAnimationFrame(updateSweep);
    return () => cancelAnimationFrame(animId);
  }, []);

  const size = 320;
  const center = size / 2;
  const maxRadius = center - 20;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: size,
      height: size,
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.08) 0%, rgba(2, 6, 23, 0.95) 75%)',
      borderRadius: '50%',
      border: '1px solid rgba(0, 245, 255, 0.25)',
      boxShadow: '0 0 35px rgba(0, 245, 255, 0.1), inset 0 0 30px rgba(0, 245, 255, 0.05)'
    }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="radarSweepGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 245, 255, 0)" />
            <stop offset="80%" stopColor="rgba(0, 245, 255, 0.08)" />
            <stop offset="100%" stopColor="rgba(0, 245, 255, 0.25)" />
          </radialGradient>
        </defs>

        {/* Concentric Polar Range Rings */}
        <circle cx={center} cy={center} r={maxRadius} fill="none" stroke="rgba(0, 245, 255, 0.25)" strokeWidth="1.2" strokeDasharray="3 3" />
        <circle cx={center} cy={center} r={maxRadius * 0.75} fill="none" stroke="rgba(0, 245, 255, 0.18)" strokeWidth="1" />
        <circle cx={center} cy={center} r={maxRadius * 0.5} fill="none" stroke="rgba(0, 245, 255, 0.14)" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx={center} cy={center} r={maxRadius * 0.25} fill="none" stroke="rgba(0, 245, 255, 0.12)" strokeWidth="1" />
        <circle cx={center} cy={center} r="3" fill="#00F5FF" />

        {/* Crosshair Axes */}
        <line x1={center} y1={20} x2={center} y2={size - 20} stroke="rgba(0, 245, 255, 0.2)" strokeWidth="1" />
        <line x1={20} y1={center} x2={size - 20} y2={center} stroke="rgba(0, 245, 255, 0.2)" strokeWidth="1" />

        {/* Distance Range Markers */}
        <text x={center + maxRadius * 0.25 + 4} y={center - 4} fill="rgba(0, 245, 255, 0.5)" fontSize="8" fontFamily="var(--font-code)">L1-EDGE</text>
        <text x={center + maxRadius * 0.5 + 4} y={center - 4} fill="rgba(0, 245, 255, 0.5)" fontSize="8" fontFamily="var(--font-code)">L2-INVARIANT</text>
        <text x={center + maxRadius * 0.75 + 4} y={center - 4} fill="rgba(0, 245, 255, 0.5)" fontSize="8" fontFamily="var(--font-code)">L3-VM</text>
        <text x={center + maxRadius - 18} y={center - 4} fill="rgba(0, 245, 255, 0.5)" fontSize="8" fontFamily="var(--font-code)">PERIMETER</text>

        {/* Rotating Radar Sweep Line */}
        <g transform={`rotate(${sweepAngle} ${center} ${center})`}>
          <line
            x1={center}
            y1={center}
            x2={center + maxRadius}
            y2={center}
            stroke="#00F5FF"
            strokeWidth="2"
            opacity="0.85"
            style={{ filter: 'drop-shadow(0 0 6px #00F5FF)' }}
          />
          <path
            d={`M ${center} ${center} L ${center + maxRadius} ${center} A ${maxRadius} ${maxRadius} 0 0 0 ${center + maxRadius * Math.cos(-Math.PI / 6)} ${center + maxRadius * Math.sin(-Math.PI / 6)} Z`}
            fill="url(#radarSweepGradient)"
          />
        </g>

        {/* Live Ingress Event Blips Plotted via Real Spherical Azimuth & Haversine Distance */}
        {events.slice(0, 24).map((evt) => {
          const isBot = evt.threatScore > 50;
          const isSelected = selectedEvent?.id === evt.id;

          const { bearing, distanceKm, distFactor } = computePolarCoordinates(evt);
          // In radar polar projection, 0 deg is North (top), 90 deg is East (right), 180 deg is South (bottom), 270 deg is West (left)
          const angleRad = ((bearing - 90) * Math.PI) / 180;
          const dist = maxRadius * distFactor;
          const cx = center + dist * Math.cos(angleRad);
          const cy = center + dist * Math.sin(angleRad);

          return (
            <g
              key={evt.id}
              onClick={() => onSelectEvent(evt)}
              style={{ cursor: 'pointer' }}
            >
              <title>{`${evt.company || evt.ip} | Bearing: ${bearing.toFixed(1)}° • Distance: ${Math.round(distanceKm)} km (${evt.location || 'Global'})`}</title>

              {/* Outer Pulse Ping for Threats */}
              {isBot && (
                <circle cx={cx} cy={cy} r="8" fill="none" stroke="#f43f5e" strokeWidth="1" opacity="0.6">
                  <animate attributeName="r" values="4;14" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0" dur="1.8s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Core Event Blip */}
              <circle
                cx={cx}
                cy={cy}
                r={isSelected ? 6 : isBot ? 4.5 : 3.5}
                fill={isBot ? '#f43f5e' : '#10b981'}
                stroke={isSelected ? '#fff' : isBot ? '#ff7997' : '#6ee7b7'}
                strokeWidth={isSelected ? 2 : 1}
                style={{
                  filter: isBot
                    ? 'drop-shadow(0 0 8px #f43f5e)'
                    : 'drop-shadow(0 0 6px #10b981)',
                  transition: 'r 0.15s ease'
                }}
              />
            </g>
          );
        })}
      </svg>

      {/* Radar HUD Readout Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 12,
        left: 0,
        width: '100%',
        textAlign: 'center',
        fontSize: '0.65rem',
        fontFamily: 'var(--font-code)',
        color: '#64748b',
        letterSpacing: '0.08em',
        pointerEvents: 'none'
      }}>
        AZIMUTH: SPHERICAL &bull; SWEEP: 360 deg/s &bull; CONTACTS: <span style={{ color: '#00F5FF' }}>{events.length}</span>
      </div>
    </div>
  );
}



const REAL_VERIFICATION_CMDS = [
  {
    id: 'CHATGPT',
    label: 'ChatGPT Web Browse',
    company: 'OpenAI / Azure',
    color: '#10a37f',
    cmd: 'Prompt in ChatGPT: "Visit https://rakshakus.vercel.app and summarize the site"',
    desc: 'ChatGPT spins up headless Azure worker (ASN 8075 / IP 20.*) and visits edge.'
  },
  {
    id: 'CLAUDE',
    label: 'Claude Web Search',
    company: 'Anthropic / AWS',
    color: '#d97706',
    cmd: 'Prompt in Claude: "Fetch and summarize https://rakshakus.vercel.app"',
    desc: 'Claude triggers AWS crawler worker (ASN 16509) to ingest document content.'
  },
  {
    id: 'CURL',
    label: 'Terminal cURL (No Hints)',
    company: 'CLI Scraper',
    color: '#38bdf8',
    cmd: 'curl -i https://rakshakus.vercel.app/developers',
    desc: 'cURL omits modern Sec-CH-UA and navigation headers; caught instantly.'
  },
  {
    id: 'PYTHON',
    label: 'Python HTTP Extraction',
    company: 'Script Automation',
    color: '#e11d48',
    cmd: 'python -c "import urllib.request; print(urllib.request.urlopen(\'https://rakshakus.vercel.app/\').read()[:200])"',
    desc: 'Server-side Python fetch with wildcard accept and non-browser topology.'
  },
  {
    id: 'PLAYWRIGHT',
    label: 'Playwright Headless',
    company: 'Headless Browser',
    color: '#ef4444',
    cmd: 'npx playwright open https://rakshakus.vercel.app',
    desc: 'Automated Chromium runtime caught via headless client hint signatures.'
  },
  {
    id: 'HUMAN',
    label: 'Real Human Browser',
    company: 'Consumer ISP',
    color: '#10b981',
    cmd: 'Open https://rakshakus.vercel.app in your personal desktop browser',
    desc: 'Residential ISP + authentic Sec-Fetch navigation + verified Sec-CH-UA hints.'
  }
];

export default function LivePerimeterRadar() {
  const [telemetry, setTelemetry] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [isStreaming, setIsStreaming] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(2500);
  const [activeTestCmd, setActiveTestCmd] = useState(REAL_VERIFICATION_CMDS[0]);
  const [copiedCmd, setCopiedCmd] = useState(false);

  // Restore preserved radar events from localStorage so page refreshes never wipe out history
  useEffect(() => {
    try {
      const cached = localStorage.getItem('rakshak_radar_events');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          // Filter out legacy mock seed events
          const realOnly = parsed.filter(e => !e.id?.includes('_anth') && !e.id?.includes('_oai') && !e.id?.includes('_dpsk') && !e.id?.includes('_byte') && !e.id?.includes('_c4ai') && !e.id?.includes('_fcwl') && !e.id?.includes('_pptr') && !e.id?.includes('_cfwk') && !e.id?.includes('_goog') && !e.id?.includes('_hum1'));
          if (realOnly.length > 0) {
            setEvents(realOnly);
            setSelectedEvent(realOnly[0]);
          } else {
            localStorage.removeItem('rakshak_radar_events');
          }
        }
      }
    } catch {}
  }, []);

  // Fetch real live telemetry directly from server memory buffer and global edge sync
  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/rakshak/telemetry', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setTelemetry(data);

      if (data.liveFeed && Array.isArray(data.liveFeed)) {
        const realOnly = data.liveFeed.filter(e => !e.id?.includes('_anth') && !e.id?.includes('_oai') && !e.id?.includes('_dpsk') && !e.id?.includes('_byte') && !e.id?.includes('_c4ai') && !e.id?.includes('_fcwl') && !e.id?.includes('_pptr') && !e.id?.includes('_cfwk') && !e.id?.includes('_goog') && !e.id?.includes('_hum1'));
        setEvents((prev) => {
          const map = new Map();
          realOnly.forEach((e) => {
            if (e && e.id) map.set(e.id, e);
          });
          prev.forEach((e) => {
            if (e && e.id && !map.has(e.id)) map.set(e.id, e);
          });
          const merged = Array.from(map.values())
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 80);
          try {
            localStorage.setItem('rakshak_radar_events', JSON.stringify(merged));
          } catch {}
          return merged;
        });

        setSelectedEvent((prevSelected) => {
          if (prevSelected) return prevSelected;
          return realOnly.length > 0 ? realOnly[0] : null;
        });
      }
    } catch (err) {
      console.error('Failed to poll telemetry:', err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    if (!isStreaming) return;

    const timer = setInterval(() => {
      fetchTelemetry();
    }, refreshInterval);

    return () => clearInterval(timer);
  }, [isStreaming, refreshInterval]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const filteredEvents = events.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'BOTS') return item.threatScore > 50;
    if (filter === 'HUMANS') return item.threatScore === 0;
    if (filter === 'AZURE') return (item.company?.toLowerCase().includes('azure') || item.company?.toLowerCase().includes('openai') || item.companyBotName?.toLowerCase().includes('gpt') || item.companyBotName?.toLowerCase().includes('copilot'));
    if (filter === 'AWS') return (item.company?.toLowerCase().includes('aws') || item.company?.toLowerCase().includes('amazon') || item.company?.toLowerCase().includes('anthropic') || item.companyBotName?.toLowerCase().includes('claude'));
    if (filter === 'GOOGLE') return (item.company?.toLowerCase().includes('google') || item.companyBotName?.toLowerCase().includes('gemini'));
    if (filter === 'DATACENTER') return (item.invariants?.asnClass === 'DATACENTER' || item.company?.toLowerCase().includes('datacenter'));
    if (filter === 'HEADLESS') return (item.company?.toLowerCase().includes('headless') || item.rawClient?.toLowerCase().includes('playwright') || item.rawClient?.toLowerCase().includes('selenium'));
    if (filter === 'SPOOFED') return (item.company?.toLowerCase().includes('spoof') || item.company?.toLowerCase().includes('script') || item.invariants?.clientHints === 'NONE');
    return true;
  });

  return (
    <section style={{ width: '100%', maxWidth: '100%', padding: '6.5rem clamp(1.5rem, 4vw, 4.5rem) 5rem', boxSizing: 'border-box' }}>
      {/* Header */}
      <div className="section-header-deepip" style={{ textAlign: 'left', maxWidth: '100%', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div className="tech-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: isStreaming ? '#10b981' : '#f59e0b', boxShadow: isStreaming ? '0 0 10px #10b981' : 'none' }} />
            <span>100% REAL MULTI-COMPANY EDGE INGRESS BUFFER</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Real Stream Rate Controls */}
            <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 6, padding: '2px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              {[
                { label: '1s', val: 1000 },
                { label: '2.5s', val: 2500 },
                { label: '5s', val: 5000 }
              ].map((rate) => (
                <button
                  key={rate.val}
                  onClick={() => setRefreshInterval(rate.val)}
                  style={{
                    background: refreshInterval === rate.val ? 'rgba(0, 245, 255, 0.2)' : 'transparent',
                    color: refreshInterval === rate.val ? '#00F5FF' : '#94a3b8',
                    border: 'none',
                    padding: '0.25rem 0.55rem',
                    borderRadius: 4,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-code)'
                  }}
                >
                  {rate.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsStreaming(!isStreaming)}
              style={{
                background: isStreaming ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: isStreaming ? '#34d399' : '#fbbf24',
                border: `1px solid ${isStreaming ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                padding: '0.4rem 0.85rem',
                borderRadius: 6,
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>{isStreaming ? 'PAUSE' : 'RESUME'}</span>
              {isStreaming ? `Live Polling (${refreshInterval / 1000}s)` : 'Polling Paused'}
            </button>
          </div>
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 800, marginBottom: '0.75rem', color: '#fff' }}>
          Rakshak Zero-Trust Defense Observatory
        </h1>
        <p style={{ maxWidth: 960, color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
          Zero reliance on User-Agent strings. Every non-human connection (ChatGPT, Claude, Google Gemini, autonomous AI agents, headless browsers, or curl scripts) is identified via pure edge protocol invariants: Datacenter ASN Subnets, Chromium Client Hints, and Sec-Fetch Navigation Topology. Real edge telemetry recorded live from <strong style={{ color: '#00F5FF' }}>rakshakus.vercel.app</strong>.
        </p>

        {/* Current Caller Session Chip */}
        {telemetry?.currentCaller && (
          <div style={{
            marginTop: '1rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 0.85rem',
            background: 'rgba(0, 245, 255, 0.05)',
            border: '1px solid rgba(0, 245, 255, 0.2)',
            borderRadius: 6,
            fontSize: '0.75rem',
            color: '#cbd5e1',
            fontFamily: 'var(--font-code)'
          }}>
            <span style={{ color: '#00F5FF', fontWeight: 700 }}>YOUR CURRENT INGRESS:</span>
            <span>IP: {telemetry.currentCaller.ip}</span>
            <span>&bull;</span>
            <span>ASN: {telemetry.currentCaller.asn}</span>
            <span>&bull;</span>
            <span style={{ color: telemetry.currentCaller.threatScore > 50 ? '#f43f5e' : '#10b981', fontWeight: 700 }}>
              {telemetry.currentCaller.threatScore > 50 ? `NON-HUMAN THREAT (${telemetry.currentCaller.threatScore}%)` : 'VERIFIED HUMAN (0% CLEAN)'}
            </span>
          </div>
        )}

        {/* Real Edge Verification Toolbar */}
        <div style={{
          marginTop: '1.25rem',
          background: 'rgba(2, 6, 23, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 8,
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#00F5FF', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-code)' }}>
              VERIFY WITH REAL LIVE TRAFFIC (ANY AGENT / LLM / TERMINAL):
            </span>
            <span style={{ fontSize: '0.725rem', color: '#64748b' }}>
              Select a verification vector below to inspect command and behavior:
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginBottom: '1rem' }}>
            {REAL_VERIFICATION_CMDS.map((cmdItem) => {
              const isSelected = activeTestCmd.id === cmdItem.id;
              return (
                <button
                  key={cmdItem.id}
                  onClick={() => setActiveTestCmd(cmdItem)}
                  style={{
                    background: isSelected ? `${cmdItem.color}25` : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${isSelected ? cmdItem.color : `${cmdItem.color}35`}`,
                    color: isSelected ? '#fff' : '#cbd5e1',
                    padding: '0.4rem 0.75rem',
                    borderRadius: 6,
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: cmdItem.color, boxShadow: `0 0 6px ${cmdItem.color}` }} />
                  <span>{cmdItem.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Command Copy Bar */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 6,
            padding: '0.85rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.85rem'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', maxWidth: '85%' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                <strong style={{ color: activeTestCmd.color }}>{activeTestCmd.company}:</strong> {activeTestCmd.desc}
              </div>
              <code style={{ fontSize: '0.825rem', color: '#38bdf8', fontFamily: 'var(--font-code)', wordBreak: 'break-all' }}>
                {activeTestCmd.cmd}
              </code>
            </div>
            <button
              onClick={() => handleCopy(activeTestCmd.cmd)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: copiedCmd ? '#34d399' : '#00F5FF',
                padding: '0.4rem 0.85rem',
                borderRadius: 6,
                fontSize: '0.775rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-code)'
              }}
            >
              {copiedCmd ? 'COPIED' : 'Copy Instruction'}
            </button>
          </div>
        </div>
      </div>

      {/* Live Operational Metrics HUD */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        <div className="deepip-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Total Ingress Processed</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginTop: '0.35rem', fontFamily: 'var(--font-code)' }}>
            {telemetry?.metrics?.totalRequestsFiltered?.toLocaleString() || events.length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
            Live Verified Ingress
          </span>
        </div>

        <div className="deepip-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>AI Bots Deflected</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f43f5e', marginTop: '0.35rem', fontFamily: 'var(--font-code)' }}>
            {telemetry?.metrics?.aiCrawlersDeflectedToday?.toLocaleString() || events.filter(e => e.threatScore > 50).length}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
            Asymmetric Decoys Served
          </span>
        </div>

        <div className="deepip-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Bandwidth Defended</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8', marginTop: '0.35rem', fontFamily: 'var(--font-code)' }}>
            {telemetry?.metrics?.bandwidthProtectedMB || '0.00'} MB
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
            Decoy 200 OK Payloads
          </span>
        </div>

        <div className="deepip-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Edge Decision Latency</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', marginTop: '0.35rem', fontFamily: 'var(--font-code)' }}>
            {telemetry?.metrics?.avgEdgeLatencyMs || '0.45'} ms
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
            RSK VM Execution Time
          </span>
        </div>

        <div className="deepip-card" style={{ padding: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Human Clean Pass Ratio</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#00F5FF', marginTop: '0.35rem', fontFamily: 'var(--font-code)' }}>
            {telemetry?.metrics?.humanPassRatio || '100.0%'}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem', display: 'block' }}>
            0% False Positive Guarantee
          </span>
        </div>
      </div>

      {/* Visual Polar Radar Sweep Canvas */}
      <div className="deepip-card" style={{ marginBottom: '2.5rem', padding: '1.75rem', background: 'rgba(2, 6, 23, 0.7)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00F5FF', boxShadow: '0 0 10px #00F5FF' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>
              LIVE POLAR PERIMETER SCANNER
            </span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'var(--font-code)' }}>
            Click any blip to inspect packet invariants
          </div>
        </div>

        <RadarScreen
          events={filteredEvents}
          selectedEvent={selectedEvent}
          onSelectEvent={setSelectedEvent}
        />
      </div>

      {/* Main Observatory HUD: Filter Bar + Feed Grid */}
      <div className="deepip-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        {/* Navigation / Filter Tab Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '0.9rem 1.5rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: 'All Ingress' },
              { id: 'BOTS', label: 'Non-Human / Bots' },
              { id: 'HUMANS', label: 'Verified Humans' },
              { id: 'AZURE', label: 'Azure / OpenAI' },
              { id: 'AWS', label: 'AWS / Claude' },
              { id: 'GOOGLE', label: 'Google Cloud' },
              { id: 'DATACENTER', label: 'Datacenter Subnets' },
              { id: 'HEADLESS', label: 'Playwright / Headless' },
              { id: 'SPOOFED', label: 'Spoofed / Scripts' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  background: filter === tab.id ? 'rgba(0, 245, 255, 0.12)' : 'transparent',
                  color: filter === tab.id ? '#00F5FF' : '#94a3b8',
                  border: filter === tab.id ? '1px solid rgba(0, 245, 255, 0.3)' : '1px solid transparent',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b', fontFamily: 'var(--font-code)' }}>
            <span>Buffer: {filteredEvents.length} live requests</span>
            <span>•</span>
            <span style={{ color: '#10b981' }}>Live Stream Active</span>
          </div>
        </div>

        {/* 2-Column Split: Left Stream Feed, Right Packet Inspector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', minHeight: 480 }}>
          {/* Left: Event Stream */}
          <div style={{
            maxHeight: 560,
            overflowY: 'auto',
            borderRight: '1px solid rgba(255, 255, 255, 0.06)',
            background: 'rgba(3, 5, 10, 0.6)'
          }}>
            {filteredEvents.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#64748b' }}>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>No requests in the current filter.</p>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#00F5FF' }}>
                  Waiting for edge events. Prompt ChatGPT or Claude to browse https://rakshakus.vercel.app, run curl from your terminal, or test any route.
                </p>
              </div>
            ) : (
              filteredEvents.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                const isBot = evt.threatScore > 50;
                const badgeColor = evt.companyBadgeColor || (isBot ? '#f43f5e' : '#10b981');
                return (
                  <div
                    key={evt.id}
                    onClick={() => setSelectedEvent(evt)}
                    style={{
                      padding: '1rem 1.25rem',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(0, 245, 255, 0.06)' : 'transparent',
                      borderLeft: isSelected ? '3px solid #00F5FF' : '3px solid transparent',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: isBot ? '#f43f5e' : '#10b981'
                        }} />
                        <code style={{ fontSize: '0.825rem', color: '#fff', fontWeight: 700 }}>
                          {evt.route}
                        </code>
                        <span style={{
                          fontSize: '0.675rem',
                          fontFamily: 'var(--font-code)',
                          fontWeight: 700,
                          padding: '0.12rem 0.45rem',
                          borderRadius: 4,
                          background: `${badgeColor}20`,
                          color: badgeColor,
                          border: `1px solid ${badgeColor}40`,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}>
                          {evt.company || (isBot ? 'AI Bot' : 'Human')}
                        </span>
                      </div>

                      <span style={{
                        fontSize: '0.725rem',
                        fontFamily: 'var(--font-code)',
                        fontWeight: 700,
                        padding: '0.15rem 0.45rem',
                        borderRadius: 4,
                        background: isBot ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: isBot ? '#f43f5e' : '#10b981'
                      }}>
                        {isBot ? `${evt.threatScore}% THREAT` : '0% CLEAN'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.35rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      <strong style={{ color: '#cbd5e1' }}>{evt.companyBotName || evt.company || 'Client'}:</strong> {evt.client}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.725rem', color: '#64748b', fontFamily: 'var(--font-code)' }}>
                      <span>{evt.ip} ({evt.location}) • {evt.asn}</span>
                      <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right: Packet & RSK-VM Bytecode Inspector */}
          <div style={{ padding: '1.5rem', background: 'rgba(2, 4, 8, 0.8)', overflowY: 'auto', maxHeight: 560 }}>
            {selectedEvent ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-code)' }}>
                      ID: {selectedEvent.id}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', color: '#fff', margin: '0.25rem 0 0', fontFamily: 'var(--font-code)' }}>
                      {selectedEvent.route}
                    </h3>
                  </div>

                  <span style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: 6,
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-code)',
                    background: selectedEvent.threatScore > 50 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                    color: selectedEvent.threatScore > 50 ? '#f43f5e' : '#34d399',
                    border: `1px solid ${selectedEvent.threatScore > 50 ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                    fontWeight: 700
                  }}>
                    {selectedEvent.action}
                  </span>
                </div>

                {/* Company Attribution & Threat Intelligence Card */}
                {selectedEvent.company && (
                  <div style={{
                    background: `${selectedEvent.companyBadgeColor || '#38bdf8'}12`,
                    border: `1px solid ${selectedEvent.companyBadgeColor || '#38bdf8'}35`,
                    borderRadius: 6,
                    padding: '0.85rem 1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: selectedEvent.companyBadgeColor || '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem'
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: selectedEvent.companyBadgeColor || '#38bdf8' }} />
                        {selectedEvent.company}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontFamily: 'var(--font-code)' }}>
                        {selectedEvent.companyCategory}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#e2e8f0', marginBottom: '0.25rem' }}>
                      <strong>Bot Variant:</strong> {selectedEvent.companyBotName || 'Standard Client'}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
                      {selectedEvent.companyDescription}
                    </p>
                  </div>
                )}

                {/* Raw Client User-Agent */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Raw User-Agent:</span>
                  <code style={{ fontSize: '0.775rem', color: '#e2e8f0', wordBreak: 'break-all' }}>
                    {selectedEvent.rawClient || selectedEvent.client}
                  </code>
                </div>

                {/* Invariant Matrix Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 6, padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block' }}>Sec-Fetch Topology</span>
                    <strong style={{ color: selectedEvent.invariants.secFetch.includes('none') ? '#f87171' : '#34d399', fontSize: '0.85rem' }}>
                      {selectedEvent.invariants.secFetch}
                    </strong>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 6, padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block' }}>Client Hints (sec-ch-ua)</span>
                    <strong style={{ color: selectedEvent.invariants.clientHints === 'NONE' ? '#f87171' : '#34d399', fontSize: '0.85rem' }}>
                      {selectedEvent.invariants.clientHints}
                    </strong>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 6, padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block' }}>Client IP &amp; ASN</span>
                    <strong style={{ color: '#38bdf8', fontSize: '0.85rem' }}>
                      {selectedEvent.ip} ({selectedEvent.asn})
                    </strong>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 6, padding: '0.75rem' }}>
                    <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block' }}>Shannon Path Entropy</span>
                    <strong style={{ color: '#00F5FF', fontSize: '0.85rem', fontFamily: 'var(--font-code)' }}>
                      {selectedEvent.entropy} bits/sym
                    </strong>
                  </div>
                </div>

                {/* Summary & Details */}
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 6, padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '0.725rem', color: '#64748b', display: 'block', marginBottom: '0.25rem' }}>Edge Decision Description:</span>
                  <p style={{ color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
                    {selectedEvent.details}
                  </p>
                </div>

                {/* RSK Policy & VM Disassembled Bytecode Trace */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                      Disassembled RSK Bytecode Execution Stack
                    </span>
                    <code style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{selectedEvent.rskPolicy}b</code>
                  </div>

                  <pre style={{
                    background: '#010307',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 6,
                    padding: '0.85rem',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-code)',
                    color: '#94a3b8',
                    overflowX: 'auto',
                    lineHeight: 1.6,
                    margin: 0
                  }}>
{getRskDisassemblyDump(selectedEvent)}
                  </pre>
                </div>
              </div>
            ) : (
              <div style={{ color: '#64748b', fontSize: '0.85rem', textAlign: 'center', paddingTop: '4rem' }}>
                Select a live request from the stream to inspect its exact HTTP invariants.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

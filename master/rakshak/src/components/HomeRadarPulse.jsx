'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

function formatRelativeTime(ts) {
  if (!ts) return 'Live';
  const diffSec = Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 1000));
  if (diffSec < 4) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  return `${Math.floor(diffSec / 60)}m ago`;
}

export default function HomeRadarPulse() {
  const [interceptCount, setInterceptCount] = useState(0);
  const [latencyMs, setLatencyMs] = useState(0.28);
  const [liveInterceptions, setLiveInterceptions] = useState([
    { crawler: 'Rakshak Sentinel Engine', route: '/api/v1/telemetry', action: 'Sub-millisecond Active Guard', time: 'Live' },
    { crawler: 'Perimeter Hardware Seal', route: '/api/rakshak/status', action: 'TPM 2.0 Invariant Bound', time: 'Live' },
    { crawler: 'Direct NT Syscall Monitor', route: '/system/processes', action: 'Zero-Trust Trap Armed', time: 'Live' }
  ]);

  useEffect(() => {
    let isMounted = true;

    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/api/rakshak/telemetry', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (!isMounted) return;

          const count = data?.metrics?.aiCrawlersDeflectedToday || data?.metrics?.totalRequestsFiltered || data?.bufferCount || 0;
          setInterceptCount(count);

          if (data?.metrics?.avgEdgeLatencyMs) {
            setLatencyMs(data.metrics.avgEdgeLatencyMs);
          }

          if (Array.isArray(data?.liveFeed) && data.liveFeed.length > 0) {
            const mapped = data.liveFeed.slice(0, 3).map((evt) => ({
              crawler: evt.companyBotName || evt.userAgent?.split(' ')[0]?.slice(0, 24) || 'Edge Visitor',
              route: evt.path || '/',
              action: evt.threatIntercepted
                ? (evt.action === 'BLOCKED_403' ? 'Direct NT Syscall 403' : 'Adversarial 200 OK Served')
                : 'Zero-Trust Pass (200 OK)',
              time: formatRelativeTime(evt.timestamp)
            }));
            setLiveInterceptions(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to stream telemetry:', err);
      }
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="py-20 sm:py-28 relative border-t border-b border-white/5 bg-[#050508]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Global Perimeter Telemetry Live
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight anti-ocr-protect">
              Real-Time Threat Deflection Observatory.
            </h2>

            <p className="text-base sm:text-lg text-[#86868b] leading-relaxed mb-8">
              Autonomous AI crawlers attempt to scrape workstations and developer endpoints continuously. Rakshak serves high-entropy synthetic honeypots with silent HTTP 200 OK responses, completely neutralizing model exfiltration without breaking web traffic.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                  {interceptCount.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#86868b] mt-1">
                  Attacks Deflected
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight">
                  {latencyMs}ms
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#86868b] mt-1">
                  Decision Latency
                </div>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <div className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
                  0 B
                </div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#86868b] mt-1">
                  Cloud Telemetry
                </div>
              </div>
            </div>

            <Link
              href="/radar"
              className="btn-deepip-blue inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl text-white transition-all duration-300"
            >
              <span>Launch Full Perimeter Radar</span>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-white/10 bg-[#0c0c10] p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                    Edge Invariant Stream
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  ACTIVE DEFENSE
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {liveInterceptions.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-white/[0.02] border border-white/5 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-white font-medium flex items-center gap-1.5">
                        <span className="text-rose-400">⚡</span>
                        <span>{item.crawler}</span>
                      </div>
                      <div className="text-[11px] text-[#86868b]">
                        Path: <span className="text-zinc-300">{item.route}</span>
                      </div>
                    </div>
                    <div className="text-right sm:text-right">
                      <div className="text-[11px] text-emerald-400 font-semibold">
                        {item.action}
                      </div>
                      <div className="text-[10px] text-zinc-500">
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-mono text-[#86868b]">
                <span>Full real-time topology & ASN analysis available</span>
                <Link href="/radar" className="text-[#2997ff] hover:underline font-semibold">
                  Open Radar &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

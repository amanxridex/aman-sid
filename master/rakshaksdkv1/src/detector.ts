/**
 * Rakshak SDK v1 - Telemetry & Threat Detection Engine
 * Multi-layer heuristics analyzing request signatures, client hints, ASN telemetry,
 * HTTP topology, and Shannon entropy rate analysis.
 */

import {
  CLOUD_DATACENTER_ASNS,
  CLOUD_IP_PREFIXES,
  AI_BOT_USER_AGENTS,
  AI_REFERER_DOMAINS,
  SCRAPE_QUERY_PARAMS,
} from './constants';
import { RakshakTopologyEngine } from './topology';
import { RakshakEntropyEngine } from './entropy';
import { RakshakWaterfallEngine } from './waterfall';

export interface RakshakRequest {
  headers: Record<string, string | string[] | undefined> | Headers | { get(name: string): string | null };
  url?: string;
  ip?: string;
}

export interface DetectionResult {
  isBot: boolean;
  confidence: number; // 0 to 100
  threatType?:
    | 'LLM_CRAWLER'
    | 'AGENTIC_SCRAPER'
    | 'CLOUD_DATACENTER'
    | 'HEADLESS_BROWSER'
    | 'HEADER_TOPOLOGY_SPOOF'
    | 'ANOMALOUS_VELOCITY'
    | 'PROBE_QUERY';
  reasons: string[];
  matchedSignatures: string[];
  entropyJitter?: number;
}

function getHeader(headers: RakshakRequest['headers'], name: string): string {
  const lowerName = name.toLowerCase();
  if (typeof (headers as Headers).get === 'function') {
    return ((headers as Headers).get(lowerName) || '').toLowerCase();
  }
  const record = headers as Record<string, string | string[] | undefined>;
  const val = record[lowerName] || record[name];
  if (Array.isArray(val)) return (val[0] || '').toLowerCase();
  return (val || '').toLowerCase();
}

/**
 * Inspects an incoming request and determines if it originates from an AI crawler,
 * autonomous agent, cloud datacenter, or scraping framework.
 */
export function detectAiScraper(req: RakshakRequest): DetectionResult {
  const reasons: string[] = [];
  const matchedSignatures: string[] = [];
  let score = 0;

  const userAgent = getHeader(req.headers, 'user-agent');
  const referer = getHeader(req.headers, 'referer');
  const secChUa = getHeader(req.headers, 'sec-ch-ua');
  const secChUaPlatform = getHeader(req.headers, 'sec-ch-ua-platform');
  const accept = getHeader(req.headers, 'accept');
  const acceptLanguage = getHeader(req.headers, 'accept-language');

  // Extract ASN & IP from common headers or req.ip
  const asn =
    getHeader(req.headers, 'x-vercel-ip-as-number') ||
    getHeader(req.headers, 'x-vercel-ip-asn') ||
    getHeader(req.headers, 'cf-ipasn') ||
    '';

  const clientIp = (
    req.ip ||
    getHeader(req.headers, 'x-forwarded-for').split(',')[0].trim() ||
    getHeader(req.headers, 'x-real-ip') ||
    ''
  );

  // 1. Check for known AI Bot and Scraper User-Agents
  for (const bot of AI_BOT_USER_AGENTS) {
    if (userAgent.includes(bot)) {
      score += 65;
      matchedSignatures.push(bot);
      reasons.push(`User-Agent contains known AI/scraper signature: "${bot}"`);
      break;
    }
  }

  // 2. Check for AI Chat Interface referrers
  for (const domain of AI_REFERER_DOMAINS) {
    if (referer.includes(domain)) {
      score += 40;
      matchedSignatures.push(domain);
      reasons.push(`Request originated from AI chat portal referrer: "${domain}"`);
      break;
    }
  }

  // 3. Check for Headless Browser indicators
  const isHeadless =
    secChUa.includes('headless') ||
    userAgent.includes('headless') ||
    (!acceptLanguage && (userAgent.includes('bot') || userAgent.includes('spider')));

  if (isHeadless) {
    score += 45;
    reasons.push('Headless browser runtime detected via client hints or anomalous headers');
  }

  // 4. Check for Client Hint Anomaly (e.g. Linux server pretending to be Windows desktop)
  const isLinuxServerEmulatingDesktop =
    (userAgent.includes('x11; linux') || userAgent.includes('linux x86_64')) &&
    !userAgent.includes('android');

  if (isLinuxServerEmulatingDesktop) {
    score += 35;
    reasons.push('Headless Linux server environment detected in User-Agent');
  }

  // 5. Cloud Datacenter ASN & IP Heuristics
  const isResidentialBrowser =
    (secChUaPlatform.includes('windows') ||
      secChUaPlatform.includes('mac') ||
      secChUaPlatform.includes('android') ||
      secChUaPlatform.includes('ios')) &&
    Boolean(acceptLanguage) &&
    !secChUa.includes('headless');

  if (asn && CLOUD_DATACENTER_ASNS.has(asn) && !isResidentialBrowser) {
    score += 55;
    matchedSignatures.push(`ASN:${asn}`);
    reasons.push(`Request originated from known cloud datacenter / AI farm ASN: ${asn}`);
  }

  for (const prefix of CLOUD_IP_PREFIXES) {
    if (clientIp.startsWith(prefix) && !isResidentialBrowser) {
      score += 50;
      matchedSignatures.push(`IP_PREFIX:${prefix}`);
      reasons.push(`Request IP belongs to cloud datacenter subnet: ${prefix}*`);
      break;
    }
  }

  // 6. Header Topology & Protocol Ordering Analysis
  const topology = RakshakTopologyEngine.evaluate(req.headers);
  if (topology.isAnomalous) {
    score += Math.min(45, topology.score * 0.5);
    reasons.push(...topology.reasons);
  }

  // 7. Shannon Entropy & Arrival Jitter Analysis
  const path = req.url || '/';
  const entropy = RakshakEntropyEngine.recordAndAnalyze(clientIp || 'client', path);
  if (entropy.isRoboticVelocity) {
    score += 45;
    reasons.push(...entropy.reasons);
  }

  // 8. Zero-Signature Asset Waterfall Cascade Analysis
  const waterfall = RakshakWaterfallEngine.recordAndEvaluate(clientIp || 'client', path);
  if (waterfall.isHeadlessExtractor) {
    score += 50;
    reasons.push(...waterfall.reasons);
  }

  // 9. Content Negotiation Probes (LLMs frequently request markdown or raw text)
  const isRawContentProbe =
    accept.includes('text/markdown') ||
    (accept.startsWith('text/plain') && !accept.includes('text/html'));

  if (isRawContentProbe) {
    score += 35;
    reasons.push('LLM-specific content negotiation probe detected (text/markdown or raw text)');
  }

  // 9. Probe Query Parameters
  if (req.url) {
    try {
      const url = new URL(req.url, 'http://localhost');
      for (const param of SCRAPE_QUERY_PARAMS) {
        if (url.searchParams.has(param)) {
          score += 25;
          matchedSignatures.push(`QUERY:${param}`);
          reasons.push(`Probe query parameter detected: "?${param}="`);
          break;
        }
      }
    } catch {
      // Ignore URL parse errors
    }
  }

  const confidence = Math.min(100, Math.round(score));
  const isBot = confidence >= 50;

  let threatType: DetectionResult['threatType'];
  if (isBot) {
    if (matchedSignatures.some((s) => s.includes('claude') || s.includes('gpt') || s.includes('gemini') || s.includes('perplexity'))) {
      threatType = 'LLM_CRAWLER';
    } else if (matchedSignatures.some((s) => s.includes('jina') || s.includes('firecrawl') || s.includes('tavily'))) {
      threatType = 'AGENTIC_SCRAPER';
    } else if (isHeadless) {
      threatType = 'HEADLESS_BROWSER';
    } else if (asn && CLOUD_DATACENTER_ASNS.has(asn)) {
      threatType = 'CLOUD_DATACENTER';
    } else if (topology.isAnomalous) {
      threatType = 'HEADER_TOPOLOGY_SPOOF';
    } else if (entropy.isRoboticVelocity) {
      threatType = 'ANOMALOUS_VELOCITY';
    } else {
      threatType = 'PROBE_QUERY';
    }
  }

  return {
    isBot,
    confidence,
    threatType,
    reasons,
    matchedSignatures,
    entropyJitter: entropy.jitterVariance,
  };
}

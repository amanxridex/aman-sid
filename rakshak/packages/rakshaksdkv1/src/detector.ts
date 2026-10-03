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
  geo?: {
    asNumber?: number | string;
    country?: string;
    city?: string;
    latitude?: any;
    longitude?: any;
  };
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
  const secChUaMobile = getHeader(req.headers, 'sec-ch-ua-mobile');
  const secFetchMode = getHeader(req.headers, 'sec-fetch-mode');
  const secFetchDest = getHeader(req.headers, 'sec-fetch-dest');
  const secFetchSite = getHeader(req.headers, 'sec-fetch-site');
  const accept = getHeader(req.headers, 'accept');
  const acceptLanguage = getHeader(req.headers, 'accept-language');

  // Extract ASN & IP from req.geo, common headers or req.ip
  const rawAsn = (
    (req.geo?.asNumber ? String(req.geo.asNumber) : '') ||
    getHeader(req.headers, 'x-vercel-ip-as-number') ||
    getHeader(req.headers, 'x-vercel-ip-asn') ||
    getHeader(req.headers, 'cf-ipasn') ||
    ''
  );
  const asn = rawAsn.replace(/^AS/i, '').trim();

  const clientIp = (
    req.ip ||
    getHeader(req.headers, 'x-forwarded-for')?.split(',')[0].trim() ||
    getHeader(req.headers, 'x-real-ip') ||
    getHeader(req.headers, 'cf-connecting-ip') ||
    ''
  );

  // 1. Check for known AI Bot and Scraper User-Agents (if declared)
  for (const bot of AI_BOT_USER_AGENTS) {
    if (userAgent.includes(bot)) {
      score += 70;
      matchedSignatures.push(bot);
      reasons.push(`User-Agent contains known AI/scraper signature: "${bot}"`);
      break;
    }
  }

  // 2. Check for AI Chat Interface referrers
  for (const domain of AI_REFERER_DOMAINS) {
    if (referer.includes(domain)) {
      score += 50;
      matchedSignatures.push(domain);
      reasons.push(`Request originated from AI chat portal referrer: "${domain}"`);
      break;
    }
  }

  // 3. ZERO-TRUST PROTOCOL INVARIANT: Cloud Datacenter ASN & Subnets
  // Real residential humans NEVER connect from cloud hosting facilities (AWS, Azure, GCP, Hetzner, DigitalOcean).
  // If an IP/ASN belongs to a datacenter, it is 100% an automated crawler, proxy, or server-side agent.
  const isCloudDatacenterAsn = Boolean(asn && CLOUD_DATACENTER_ASNS.has(asn));
  const matchedCloudPrefix = CLOUD_IP_PREFIXES.find(prefix => clientIp.startsWith(prefix));
  const isCloudDatacenter = isCloudDatacenterAsn || Boolean(matchedCloudPrefix);

  if (isCloudDatacenter) {
    score += 85;
    if (isCloudDatacenterAsn) {
      matchedSignatures.push(`ASN:${asn}`);
      reasons.push(`Request originated from non-residential cloud datacenter / AI farm ASN: ${asn}`);
    }
    if (matchedCloudPrefix) {
      matchedSignatures.push(`IP_PREFIX:${matchedCloudPrefix}`);
      reasons.push(`Request IP belongs to cloud datacenter subnet: ${matchedCloudPrefix}*`);
    }
  }

  // 4. ZERO-TRUST PROTOCOL INVARIANT: Headless Browser Detection
  const isHeadless =
    secChUa.includes('headless') ||
    userAgent.includes('headless') ||
    (!acceptLanguage && (userAgent.includes('bot') || userAgent.includes('spider')));

  if (isHeadless) {
    score += 60;
    matchedSignatures.push('headless_runtime');
    reasons.push('Headless browser runtime detected via client hints or automated user-agent');
  }

  // 5. ZERO-TRUST PROTOCOL INVARIANT: Modern Chromium Client Hint Spoofing
  // Modern Chromium browsers (Chrome, Edge v85+) ALWAYS send sec-ch-ua headers.
  // If an agent claims to be desktop Chrome but sends NO sec-ch-ua, it is a spoofed script (cURL/Python/Node fetch).
  const claimsModernChrome =
    (userAgent.includes('chrome/') || userAgent.includes('edg/')) &&
    !userAgent.includes('mobile') &&
    !userAgent.includes('android');

  const missingClientHintsOnChrome = claimsModernChrome && !secChUa;
  if (missingClientHintsOnChrome) {
    score += 55;
    matchedSignatures.push('spoofed_chrome_no_hints');
    reasons.push('Signature spoofing detected: claims desktop Chrome but sec-ch-ua client hints are completely absent');
  }

  // 6. ZERO-TRUST PROTOCOL INVARIANT: Sec-Fetch Navigation Topology
  // Genuine human browsers loading web pages ALWAYS send sec-fetch-dest: document and sec-fetch-mode: navigate.
  // Synthetic scrapers and headless clients send sec-fetch-mode: none or omit Sec-Fetch headers.
  const path = req.url || '/';
  const isWebPageRoute = !path.startsWith('/api/') && !path.includes('.');
  if (isWebPageRoute) {
    const isAnomalousFetchMode = !secFetchMode || secFetchMode === 'none';
    if (isAnomalousFetchMode) {
      score += 45;
      matchedSignatures.push('anomalous_sec_fetch');
      reasons.push('Non-browser Sec-Fetch topology: missing or empty navigation mode on document route');
    }

    // Generic wildcard Accept (*/*) on a document route indicates automated data extraction
    if (accept === '*/*' || (accept.startsWith('text/plain') && !accept.includes('text/html'))) {
      score += 40;
      matchedSignatures.push('wildcard_accept_extraction');
      reasons.push('Anomalous Accept header: generic wildcard */* or plain text probe on web document route');
    }
  }

  // 7. ZERO-TRUST PROTOCOL INVARIANT: Missing Accept-Language
  if (!acceptLanguage && isWebPageRoute) {
    score += 35;
    matchedSignatures.push('missing_accept_language');
    reasons.push('Missing Accept-Language header typical of automated server-side fetchers');
  }

  // 8. Check for Linux Server Emulating Desktop User-Agent
  const isLinuxServer =
    (userAgent.includes('x11; linux') || userAgent.includes('linux x86_64')) &&
    !userAgent.includes('android');
  const isHeadlessLinuxRunner = isLinuxServer && (isCloudDatacenter || !secChUa || !acceptLanguage || secFetchMode !== 'navigate');

  if (isHeadlessLinuxRunner || (isLinuxServer && isCloudDatacenter)) {
    score += 70;
    matchedSignatures.push('headless_linux_server');
    reasons.push('Headless Linux cloud server environment detected emulating desktop client');
  }

  // 9. Header Topology & Protocol Ordering Analysis
  const topology = RakshakTopologyEngine.evaluate(req.headers);
  if (topology.isAnomalous) {
    score += Math.min(45, topology.score * 0.5);
    reasons.push(...topology.reasons);
  }

  // 10. Shannon Entropy & Arrival Jitter Analysis
  const entropy = RakshakEntropyEngine.recordAndAnalyze(clientIp || 'client', path);
  if (entropy.isRoboticVelocity) {
    score += 45;
    reasons.push(...entropy.reasons);
  }

  // 11. Zero-Signature Asset Waterfall Cascade Analysis
  // Evaluate waterfall only for clients without valid human client hints or that exhibit suspicious topology
  const hasBrowserHints = Boolean(secChUa) || (secFetchMode === 'navigate' && secFetchDest === 'document');
  if (!isCloudDatacenter && !hasBrowserHints) {
    const waterfall = RakshakWaterfallEngine.recordAndEvaluate(clientIp || 'client', path, { isSuspicious: true });
    if (waterfall.isHeadlessExtractor) {
      score += 50;
      reasons.push(...waterfall.reasons);
    }
  }

  // 12. Probe Query Parameters
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

  // Definitive Zero-Trust Human Discovery Guarantee
  // A request is definitively classified as human ONLY if:
  // 1. It originates from a residential consumer ISP (NOT a cloud datacenter / hosting facility).
  // 2. It is NOT headless.
  // 3. It does NOT spoof Chrome headers without client hints.
  // 4. It has authentic browser navigation topology (sec-fetch-mode: navigate on document routes).
  // 5. It has genuine language headers and zero bot signatures.
  const isGenuineHumanBrowser =
    !isCloudDatacenter &&
    !isHeadless &&
    !missingClientHintsOnChrome &&
    !isHeadlessLinuxRunner &&
    Boolean(acceptLanguage) &&
    matchedSignatures.length === 0 &&
    (!isWebPageRoute || (secFetchMode === 'navigate' && secFetchDest === 'document'));

  if (isGenuineHumanBrowser) {
    score = 0;
  }

  const confidence = Math.min(100, Math.round(score));
  const isBot = !isGenuineHumanBrowser && confidence >= 45;

  let threatType: DetectionResult['threatType'];
  if (isBot) {
    const isLlmCrawler = matchedSignatures.some(
      (s) =>
        s.includes('claude') ||
        s.includes('gpt') ||
        s.includes('gemini') ||
        s.includes('perplexity') ||
        s.includes('bytespider') ||
        s.includes('bytedance') ||
        s.includes('meta-') ||
        s.includes('applebot') ||
        s.includes('deepseek') ||
        s.includes('grok') ||
        s.includes('xai') ||
        s.includes('colossus') ||
        s.includes('mistral') ||
        s.includes('cohere') ||
        s.includes('ccbot') ||
        s.includes('amazonbot') ||
        s.includes('bingbot') ||
        s.includes('bingpreview') ||
        s.includes('twitterbot') ||
        s.includes('xbot')
    );

    const isAgenticScraper = matchedSignatures.some((s) =>
      s.includes('jina') ||
      s.includes('firecrawl') ||
      s.includes('tavily') ||
      s.includes('crawl4ai') ||
      s.includes('exa') ||
      s.includes('diffbot')
    );

    const isHeadlessTool =
      isHeadless ||
      matchedSignatures.some((s) =>
        s.includes('headless') ||
        s.includes('playwright') ||
        s.includes('selenium') ||
        s.includes('puppeteer') ||
        s.includes('webdriver')
      );

    if (isLlmCrawler) {
      threatType = 'LLM_CRAWLER';
    } else if (isAgenticScraper) {
      threatType = 'AGENTIC_SCRAPER';
    } else if (isHeadlessTool) {
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

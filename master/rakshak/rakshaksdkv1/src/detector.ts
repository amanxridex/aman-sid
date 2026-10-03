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
import { getActiveLicense } from './license';

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
  confidence: number;
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

export function detectAiScraper(req: RakshakRequest): DetectionResult {
  const reasons: string[] = [];
  const matchedSignatures: string[] = [];
  let score = 0;

  const userAgent = getHeader(req.headers, 'user-agent');
  const referer = getHeader(req.headers, 'referer');
  const secChUa = getHeader(req.headers, 'sec-ch-ua');
  const secFetchMode = getHeader(req.headers, 'sec-fetch-mode');
  const secFetchDest = getHeader(req.headers, 'sec-fetch-dest');
  const accept = getHeader(req.headers, 'accept');
  const acceptLanguage = getHeader(req.headers, 'accept-language');

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

  for (const bot of AI_BOT_USER_AGENTS) {
    if (userAgent.includes(bot)) {
      score += 70;
      matchedSignatures.push(bot);
      reasons.push(`User-Agent contains known AI/scraper signature: "${bot}"`);
      break;
    }
  }

  for (const domain of AI_REFERER_DOMAINS) {
    if (referer.includes(domain)) {
      score += 50;
      matchedSignatures.push(domain);
      reasons.push(`Request originated from AI chat portal referrer: "${domain}"`);
      break;
    }
  }

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

  const isHeadless =
    secChUa.includes('headless') ||
    userAgent.includes('headless') ||
    (!acceptLanguage && (userAgent.includes('bot') || userAgent.includes('spider')));

  if (isHeadless) {
    score += 60;
    matchedSignatures.push('headless_runtime');
    reasons.push('Headless browser runtime detected via client hints or automated user-agent');
  }

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

  const isSafariOrMobile = 
    (userAgent.includes('safari') && !userAgent.includes('chrome')) || 
    userAgent.includes('mobile') || 
    userAgent.includes('iphone') || 
    userAgent.includes('ipad') || 
    userAgent.includes('android');

  const path = req.url || '/';
  const isWebPageRoute = !path.startsWith('/api/') && !path.includes('.');
  if (isWebPageRoute) {
    const isAnomalousFetchMode = !isSafariOrMobile && (!secFetchMode || secFetchMode === 'none');
    if (isAnomalousFetchMode) {
      score += 45;
      matchedSignatures.push('anomalous_sec_fetch');
      reasons.push('Non-browser Sec-Fetch topology: missing or empty navigation mode on document route');
    }

    if (accept === '*/*' || (accept.startsWith('text/plain') && !accept.includes('text/html'))) {
      score += 40;
      matchedSignatures.push('wildcard_accept_extraction');
      reasons.push('Anomalous Accept header: generic wildcard */* or plain text probe on web document route');
    }
  }

  if (!acceptLanguage && isWebPageRoute) {
    score += 35;
    matchedSignatures.push('missing_accept_language');
    reasons.push('Missing Accept-Language header typical of automated server-side fetchers');
  }

  const isLinuxServer =
    (userAgent.includes('x11; linux') || userAgent.includes('linux x86_64')) &&
    !userAgent.includes('android');

  const isHeadlessLinuxRunner = isLinuxServer && (isCloudDatacenter || !secChUa || !acceptLanguage || secFetchMode !== 'navigate');

  if (isHeadlessLinuxRunner || (isLinuxServer && isCloudDatacenter)) {
    score += 70;
    matchedSignatures.push('headless_linux_server');
    reasons.push('Headless Linux cloud server environment detected emulating desktop client');
  }

  const topology = RakshakTopologyEngine.evaluate(req.headers);
  if (topology.isAnomalous) {
    score += Math.min(45, topology.score * 0.5);
    reasons.push(...topology.reasons);
  }

  let entropyJitter = 1000;
  let isRoboticVelocity = false;

  const activeLic = getActiveLicense();
  if (activeLic.valid && activeLic.isPaid) {
    const entropy = RakshakEntropyEngine.recordAndAnalyze(clientIp || 'client', path);
    entropyJitter = entropy.jitterVariance;
    isRoboticVelocity = entropy.isRoboticVelocity;
    if (entropy.isRoboticVelocity) {
      score += 45;
      reasons.push(...entropy.reasons);
    }

    const hasBrowserHints = Boolean(secChUa) || (secFetchMode === 'navigate' && secFetchDest === 'document');
    if (!isCloudDatacenter && !hasBrowserHints) {
      const waterfall = RakshakWaterfallEngine.recordAndEvaluate(clientIp || 'client', path, { isSuspicious: true });
      if (waterfall.isHeadlessExtractor) {
        score += 50;
        reasons.push(...waterfall.reasons);
      }
    }
  }

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
    } catch {}
  }

  const isGenuineHumanBrowser =
    !isCloudDatacenter &&
    !isHeadless &&
    !missingClientHintsOnChrome &&
    !isHeadlessLinuxRunner &&
    Boolean(acceptLanguage) &&
    matchedSignatures.length === 0 &&
    (!isWebPageRoute || isSafariOrMobile || (secFetchMode === 'navigate' && secFetchDest === 'document'));

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
    } else if (isRoboticVelocity) {
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
    entropyJitter,
  };
}

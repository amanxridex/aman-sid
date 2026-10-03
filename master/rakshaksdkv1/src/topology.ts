/**
 * Rakshak SDK v1 - Header Topology & Behavioral Fingerprint Engine
 * Analyzes HTTP header order, casing, Sec-Fetch state machines, and client hints
 * to differentiate genuine Blink/WebKit desktop engines from headless AI runtimes.
 */

export interface HeaderFingerprintResult {
  isAnomalous: boolean;
  score: number; // 0 (genuine browser) to 100 (automated bot)
  reasons: string[];
}

/**
 * Expected topological header sequence for genuine Chromium browsers (Chrome, Edge, Brave, Opera)
 */
const CHROMIUM_HEADER_ORDER_PREFIX: readonly string[] = [
  'host',
  'connection',
  'sec-ch-ua',
  'sec-ch-ua-mobile',
  'sec-ch-ua-platform',
  'upgrade-insecure-requests',
  'user-agent',
  'accept',
  'sec-fetch-site',
  'sec-fetch-mode',
  'sec-fetch-user',
  'sec-fetch-dest',
  'accept-encoding',
  'accept-language',
];

export class RakshakTopologyEngine {
  /**
   * Evaluates the raw topological ordering and presence of browser security headers.
   */
  public static evaluate(rawHeaders: Record<string, any> | [string, string][] | Headers | { get(name: string): string | null } | any): HeaderFingerprintResult {
    const reasons: string[] = [];
    let anomalyScore = 0;

    // Extract header names in the exact sequence received
    let headerNames: string[] = [];
    if (Array.isArray(rawHeaders)) {
      headerNames = rawHeaders.map(([k]) => k.toLowerCase());
    } else if (typeof (rawHeaders as Headers).forEach === 'function') {
      (rawHeaders as Headers).forEach((_, k) => {
        headerNames.push(k.toLowerCase());
      });
    } else {
      headerNames = Object.keys(rawHeaders).map((k) => k.toLowerCase());
    }

    const headerSet = new Set(headerNames);

    // 1. Browser User-Agent Claim vs Sec-Fetch Metadata Anomaly
    const userAgent = (
      typeof (rawHeaders as Headers).get === 'function'
        ? (rawHeaders as Headers).get('user-agent')
        : (rawHeaders as Record<string, any>)['user-agent']
    ) || '';

    const claimsChrome = /chrome\/\d+/i.test(userAgent) && !/edg\//i.test(userAgent);
    const claimsDesktop = /windows|macintosh|x11/i.test(userAgent);

    if (claimsChrome && claimsDesktop) {
      // Modern Chromium ALWAYS sends sec-ch-ua and sec-fetch-* headers on top-level navigations
      const hasSecFetch = headerSet.has('sec-fetch-dest') && headerSet.has('sec-fetch-mode');
      const hasSecChUa = headerSet.has('sec-ch-ua') && headerSet.has('sec-ch-ua-platform');

      if (!hasSecFetch) {
        anomalyScore += 45;
        reasons.push('Claimed Chromium browser missing mandatory Sec-Fetch-* metadata state');
      }

      if (!hasSecChUa) {
        anomalyScore += 40;
        reasons.push('Claimed modern desktop Chromium missing Client Hint headers (sec-ch-ua)');
      }

      // Check for Header Order Topology Inversion
      // In genuine Chrome, sec-ch-ua precedes accept and accept-language
      const secChUaIndex = headerNames.indexOf('sec-ch-ua');
      const acceptIndex = headerNames.indexOf('accept');
      if (secChUaIndex !== -1 && acceptIndex !== -1 && secChUaIndex > acceptIndex) {
        anomalyScore += 30;
        reasons.push('Header topology inversion: accept precedes sec-ch-ua (typical of python-requests/httpx)');
      }
    }

    // 2. Automation & Driver Artifacts
    if (headerSet.has('x-requested-with') && !headerSet.has('sec-fetch-site')) {
      anomalyScore += 25;
      reasons.push('Legacy webview or scraper artifact detected (x-requested-with)');
    }

    // 3. Headless Sec-Ch-Ua inspection
    const secChUaValue = (
      typeof (rawHeaders as Headers).get === 'function'
        ? (rawHeaders as Headers).get('sec-ch-ua')
        : (rawHeaders as Record<string, any>)['sec-ch-ua']
    ) || '';

    if (/headlesschrome/i.test(secChUaValue) || /"not.a.brand"/i.test(secChUaValue) && /headless/i.test(userAgent)) {
      anomalyScore += 50;
      reasons.push('Sec-Ch-Ua or User-Agent contains explicit HeadlessChrome artifact');
    }

    // 4. Missing basic residential Accept-Language header
    if (!headerSet.has('accept-language')) {
      anomalyScore += 20;
      reasons.push('Missing standard residential Accept-Language header');
    }

    return {
      isAnomalous: anomalyScore >= 45,
      score: Math.min(100, anomalyScore),
      reasons,
    };
  }
}

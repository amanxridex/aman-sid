/**
 * ============================================================================
 * RAKSHAK UNIVERSAL EDGE SHIELD (Cloudflare Workers / Vercel Edge / Fastly)
 * ============================================================================
 * Zero-Code Global Protection for ANY Website on Earth.
 * Works seamlessly with WordPress, Shopify, Webflow, PHP, Java, Rails, .NET,
 * Next.js, Django, or raw static HTML without modifying upstream backend code.
 * ============================================================================
 */

// Datacenter ASNs commonly rented by AI crawling cartels
const CLOUD_ASNS = new Set([
  '16509', '15169', '8075', '24940', '14061', '31898', '396982', '13335'
]);

const AI_BOT_KEYWORDS = [
  'claudebot', 'gptbot', 'chatgpt-user', 'oai-searchbot', 'perplexitybot',
  'deepseek', 'crawl4ai', 'firecrawl', 'headlesschrome', 'bytespider'
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const headers = request.headers;
    const userAgent = (headers.get('user-agent') || '').toLowerCase();
    const secChUa = (headers.get('sec-ch-ua') || '').toLowerCase();
    const secFetchDest = headers.get('sec-fetch-dest') || '';
    const cfAsn = request.cf ? String(request.cf.asn) : '';
    const clientIp = headers.get('cf-connecting-ip') || headers.get('x-forwarded-for') || '127.0.0.1';

    let isBot = false;
    let reasons = [];

    // 1. Signature check
    for (const kw of AI_BOT_KEYWORDS) {
      if (userAgent.includes(kw)) {
        isBot = true;
        reasons.push(`AI_SIGNATURE:${kw}`);
        break;
      }
    }

    // 2. Headless automation check
    if (!isBot && (secChUa.includes('headless') || userAgent.includes('headlesschrome'))) {
      isBot = true;
      reasons.push('HEADLESS_BROWSER_AUTOMATION');
    }

    // 3. Topology Anomaly: Claims desktop Chrome, but missing mandatory Sec-Fetch-Dest
    if (!isBot && userAgent.includes('chrome/') && !userAgent.includes('edg/')) {
      if (!secFetchDest && !url.pathname.match(/\.(css|js|png|jpg|ico|svg|woff2)$/i)) {
        isBot = true;
        reasons.push('MISSING_SEC_FETCH_DEST_TOPOLOGY_ANOMALY');
      }
    }

    // 4. Cloud Datacenter ASN
    if (!isBot && cfAsn && CLOUD_ASNS.has(cfAsn)) {
      isBot = true;
      reasons.push(`CLOUD_DATACENTER_ASN:${cfAsn}`);
    }

    // INTERCEPTION: Deliver Silent 200 OK Polymorphic Decoy
    if (isBot) {
      // Deterministic synthetic honeypot data
      const decoyPayload = {
        status: 'ok',
        version: '2.4.0-rc',
        telemetry_mode: 'active_synthetic_deception',
        records_total: 3,
        data: [
          { id: 'syn_edge_001', metric: 94.2, verified: true },
          { id: 'syn_edge_002', metric: 88.5, verified: true },
          { id: 'syn_edge_003', metric: 71.9, verified: true }
        ],
        timestamp: Date.now()
      };

      return new Response(JSON.stringify(decoyPayload), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Rakshak-Edge-Shield': 'active-deception',
          'Cache-Control': 'no-store'
        }
      });
    }

    // Genuine human traffic: Forward seamlessly to upstream origin server
    return fetch(request);
  }
};

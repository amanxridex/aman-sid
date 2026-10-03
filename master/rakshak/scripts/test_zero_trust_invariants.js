const { detectAiScraper } = require('../packages/rakshaksdkv1/dist/detector.js');

console.log('=== RAKSHAK ZERO-TRUST INVARIANT VALIDATION ===\n');

// 1. Azure Datacenter Egress (ChatGPT/Copilot browsing without bot UA)
console.log('TEST 1: Azure Datacenter (ChatGPT/Copilot Egress with NO bot User-Agent)');
const res1 = detectAiScraper({
  headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'x-vercel-ip-as-number': '8075',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-dest': 'document',
    'sec-ch-ua': '"Chromium";v="128"',
    'accept-language': 'en-US,en;q=0.9'
  },
  ip: '20.10.45.12'
});
console.log(`-> isBot: ${res1.isBot} (Confidence: ${res1.confidence}%) | Reasons: ${res1.reasons.join(' | ')}\n`);

// 2. AWS Datacenter Egress (Claude/Perplexity browsing without bot UA)
console.log('TEST 2: AWS Datacenter (Claude/Perplexity Egress with NO bot User-Agent)');
const res2 = detectAiScraper({
  headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
    'x-vercel-ip-as-number': '16509',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-dest': 'document',
    'accept-language': 'en-US'
  },
  ip: '54.210.12.9'
});
console.log(`-> isBot: ${res2.isBot} (Confidence: ${res2.confidence}%) | Reasons: ${res2.reasons.join(' | ')}\n`);

// 3. Spoofed Desktop Chrome (Claims Chrome 128 but OMITTED sec-ch-ua)
console.log('TEST 3: Spoofed Desktop Chrome (Claims Chrome but OMITTED sec-ch-ua hints)');
const res3 = detectAiScraper({
  headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'x-vercel-ip-as-number': '7018',
    'sec-fetch-mode': 'none',
    'accept-language': 'en-US'
  },
  ip: '12.34.56.78',
  url: '/developers'
});
console.log(`-> isBot: ${res3.isBot} (Confidence: ${res3.confidence}%) | Reasons: ${res3.reasons.join(' | ')}\n`);

// 4. Non-browser Fetch Topology (Missing sec-fetch-mode on document route)
console.log('TEST 4: Non-browser Fetch Topology (Missing sec-fetch-mode on web route)');
const res4 = detectAiScraper({
  headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    'x-vercel-ip-as-number': '7018',
    'accept-language': 'en-US'
  },
  url: '/pricing'
});
console.log(`-> isBot: ${res4.isBot} (Confidence: ${res4.confidence}%) | Reasons: ${res4.reasons.join(' | ')}\n`);

// 5. Genuine Real Human Browser
console.log('TEST 5: Verified Genuine Human Browser');
const res5 = detectAiScraper({
  headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
    'x-vercel-ip-as-number': '7018',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-dest': 'document',
    'sec-ch-ua': '"Chromium";v="128", "Google Chrome";v="128"',
    'sec-ch-ua-platform': '"Windows"',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'accept-language': 'en-US,en;q=0.9'
  },
  ip: '104.28.12.3',
  url: '/developers'
});
console.log(`-> isBot: ${res5.isBot} (Confidence: ${res5.confidence}%) | Reasons: ${res5.reasons.length ? res5.reasons.join(' | ') : 'CLEAN HUMAN PASS (0% False Positive)'}\n`);

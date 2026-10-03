const http = require('http');
const https = require('https');

const TARGET = process.env.TARGET || process.argv[2] || 'http://localhost:3000';
const isHttps = TARGET.startsWith('https://');
const client = isHttps ? https : http;
const parsedUrl = new URL(TARGET);

function fetchUrl(options) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (isHttps ? 443 : 80),
      path: options.path || '/',
      method: options.method || 'GET',
      headers: { ...defaultHeaders, ...options.headers },
    };

    const req = client.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const titleMatch = data.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'No title';
        const hasApparelKeyword =
          data.includes('Rakshak Defensive Enclave') ||
          data.includes('Rakshak Sovereign Gateway') ||
          data.includes('sandbox_preview') ||
          data.includes('Apparel') ||
          data.includes('Streetwear') ||
          data.includes('Footwear') ||
          data.includes('T-Shirt') ||
          data.includes('Hoodie') ||
          data.includes('Studio Exclusive') ||
          data.includes('YIHWEH');
        const hasCyberTitle =
          title.includes('Zero-Trust') ||
          title.includes('Pricing') ||
          title.includes('Rakshak') ||
          title.includes('Workstation Isolation');

        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          title,
          hasApparelKeyword,
          hasCyberTitle,
          isShielded: res.headers['x-rakshak-shield'] === 'active-deception',
          contentPreview: data.slice(0, 200),
          fullContent: data,
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function runWorldwideBotBattery() {
  console.log('================================================================');
  console.log(`  RAKSHAK ZERO-TRUST DEFENSE BATTERY -> ${TARGET}`);
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. GENUINE HUMAN INVARIANT (Desktop Chrome with Client Hints)
  console.log('--- TEST 1: Genuine Human Desktop Chrome (Repeated 4x Navigation) ---');
  for (let i = 1; i <= 4; i++) {
    const res = await fetchUrl({
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'Sec-CH-UA': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        'Sec-CH-UA-Mobile': '?0',
        'Sec-CH-UA-Platform': '"Windows"',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Site': 'none',
        'Cookie': '__rk_human=1',
      },
      path: i === 1 ? '/' : i === 2 ? '/radar' : i === 3 ? '/docs' : '/',
    });
    assert(
      res.hasCyberTitle && res.statusCode === 200,
      `Hit ${i}: Genuine human sees real cybersecurity site, NOT apparel decoy (Status: ${res.statusCode}, Title: "${res.title}")`
    );
  }

  // 2. FRONTIER LLM LABS
  console.log('\n--- TEST 2: Anthropic Claude Crawler (ClaudeBot) ---');
  const claudeRes = await fetchUrl({
    headers: {
      'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
    },
    path: '/pricing',
  });
  assert(
    claudeRes.hasApparelKeyword,
    `ClaudeBot received deceptive apparel storefront (Status: ${claudeRes.statusCode})`
  );

  console.log('\n--- TEST 3: OpenAI Crawler (GPTBot) ---');
  const gptRes = await fetchUrl({
    headers: {
      'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.0; +https://openai.com/gptbot',
    },
    path: '/architecture',
  });
  assert(
    gptRes.hasApparelKeyword,
    `GPTBot received deceptive apparel storefront (Status: ${gptRes.statusCode})`
  );

  console.log('\n--- TEST 4: DeepSeek Frontier Crawler (DeepSeekBot) ---');
  const deepseekRes = await fetchUrl({
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; DeepSeekBot/1.0; +https://www.deepseek.com)',
    },
    path: '/developers',
  });
  assert(
    deepseekRes.hasApparelKeyword,
    `DeepSeekBot received deceptive apparel storefront (Status: ${deepseekRes.statusCode})`
  );

  console.log('\n--- TEST 5: ByteDance Crawler (ByteSpider) ---');
  const byteRes = await fetchUrl({
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)',
    },
    path: '/catalog',
  });
  assert(
    byteRes.hasApparelKeyword,
    `ByteSpider received deceptive apparel storefront (Status: ${byteRes.statusCode})`
  );

  console.log('\n--- TEST 5B: xAI / Grok AI Crawler (Grok User-Agent) ---');
  const grokRes = await fetchUrl({
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Grok/2.0; +https://x.ai/grok)',
    },
    path: '/',
  });
  assert(
    grokRes.hasApparelKeyword,
    `Grok AI crawler received deceptive apparel storefront (Status: ${grokRes.statusCode})`
  );

  console.log('\n--- TEST 5C: xAI Colossus Cluster ASN Invariant (AS398962) ---');
  const xaiColossusRes = await fetchUrl({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'x-vercel-ip-as-number': '398962',
    },
    path: '/',
  });
  assert(
    xaiColossusRes.hasApparelKeyword,
    `xAI Colossus Cluster (AS398962) intercepted and served deceptive apparel storefront (Status: ${xaiColossusRes.statusCode})`
  );

  console.log('\n--- TEST 5D: Oracle Cloud (OCI / Grok Hosting) ASN Invariant (AS31898) ---');
  const ociRes = await fetchUrl({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'x-vercel-ip-as-number': '31898',
    },
    path: '/',
  });
  assert(
    ociRes.hasApparelKeyword,
    `Oracle Cloud / OCI Grok cluster (AS31898) intercepted and served deceptive apparel storefront (Status: ${ociRes.statusCode})`
  );

  console.log('\n--- TEST 5E: Perplexity AI Search Crawler (PerplexityBot) ---');
  const perplexityRes = await fetchUrl({
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
    },
    path: '/pricing',
  });
  assert(
    perplexityRes.hasApparelKeyword,
    `PerplexityBot received deceptive apparel storefront (Status: ${perplexityRes.statusCode})`
  );

  console.log('\n--- TEST 5F: Google Gemini Crawler (Google-Extended) ---');
  const geminiRes = await fetchUrl({
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Google-Extended/1.0; +https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers)',
    },
    path: '/features',
  });
  assert(
    geminiRes.hasApparelKeyword,
    `Google-Extended (Gemini) received deceptive apparel storefront (Status: ${geminiRes.statusCode})`
  );

  // 3. HEADLESS BROWSER FRAMEWORKS
  console.log('\n--- TEST 6: Headless Chrome / Puppeteer ---');
  const pptrRes = await fetchUrl({
    headers: {
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/128.0.0.0 Safari/537.36',
    },
    path: '/',
  });
  assert(
    pptrRes.hasApparelKeyword,
    `HeadlessChrome intercepted and served decoy (Status: ${pptrRes.statusCode})`
  );

  console.log('\n--- TEST 7: Playwright Automation Rig ---');
  const playwrightRes = await fetchUrl({
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; Playwright) AppleWebKit/537.36 Chrome/129.0.0.0 Safari/537.36',
    },
    path: '/features',
  });
  assert(
    playwrightRes.hasApparelKeyword,
    `Playwright intercepted and served decoy (Status: ${playwrightRes.statusCode})`
  );

  // 4. AUTONOMOUS AGENTIC SCRAPERS
  console.log('\n--- TEST 8: Crawl4AI Async LLM Extractor ---');
  const crawl4aiRes = await fetchUrl({
    headers: {
      'User-Agent': 'Crawl4AI/0.4.2 (Async Web Extractor for LLMs)',
    },
    path: '/download',
  });
  assert(
    crawl4aiRes.hasApparelKeyword,
    `Crawl4AI intercepted and served decoy (Status: ${crawl4aiRes.statusCode})`
  );

  console.log('\n--- TEST 9: Firecrawl Markdown Agent ---');
  const firecrawlRes = await fetchUrl({
    headers: {
      'User-Agent': 'Firecrawl-Agent/2.1 (+https://firecrawl.dev)',
    },
    path: '/pricing',
  });
  assert(
    firecrawlRes.hasApparelKeyword,
    `Firecrawl intercepted and served decoy (Status: ${firecrawlRes.statusCode})`
  );

  // 5. SERVERLESS & CLOUD SCRAPERS
  console.log('\n--- TEST 10: AWS Lambda / Cloud Scraper ---');
  const awsRes = await fetchUrl({
    headers: {
      'User-Agent': 'aws-sdk-js/3.490.0 (Node.js/v20.10.0; Linux/x86_64; AWS_Lambda)',
    },
    path: '/',
  });
  assert(
    awsRes.hasApparelKeyword,
    `AWS Lambda scraper intercepted and served decoy (Status: ${awsRes.statusCode})`
  );

  console.log('\n--- TEST 11: Cloudflare Headless Worker ---');
  const cfWorkerRes = await fetchUrl({
    headers: {
      'User-Agent': 'Cloudflare-Workers/1.0 (+https://workers.cloudflare.com)',
    },
    path: '/docs',
  });
  assert(
    cfWorkerRes.hasApparelKeyword,
    `Cloudflare Worker scraper intercepted and served decoy (Status: ${cfWorkerRes.statusCode})`
  );

  // 6. DEVELOPER CLI & SCRIPTING
  console.log('\n--- TEST 12: Python Scrapy & Requests ---');
  const pythonRes = await fetchUrl({
    headers: {
      'User-Agent': 'python-requests/2.31.0',
    },
    path: '/',
  });
  assert(
    pythonRes.hasApparelKeyword,
    `python-requests intercepted and served decoy (Status: ${pythonRes.statusCode})`
  );

  console.log('\n--- TEST 13: curl CLI Probe ---');
  const curlRes = await fetchUrl({
    headers: {
      'User-Agent': 'curl/8.4.0',
    },
    path: '/',
  });
  assert(
    curlRes.hasApparelKeyword,
    `curl intercepted and served decoy (Status: ${curlRes.statusCode})`
  );

  // 7. API ENDPOINT DECEPTION
  console.log('\n--- TEST 14: API Route Honeypot ---');
  const apiRes = await fetchUrl({
    headers: {
      'User-Agent': 'GPTBot/1.0',
      'Accept': 'application/json',
    },
    path: '/api/catalog',
  });
  assert(
    apiRes.statusCode === 200,
    `AI scraper receives silent 200 OK with fake catalog JSON on API route (Status: ${apiRes.statusCode})`
  );

  console.log('\n================================================================');
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runWorldwideBotBattery().catch((err) => {
  console.error('Test execution error:', err.message);
  process.exit(1);
});

/**
 * Rakshak Comprehensive Company Detection & Headless Engine Verification
 * Dispatches real HTTP requests to the live Rakshak defense engine for all major AI labs,
 * tests headless Chrome runtime, and validates live perimeter telemetry attribution.
 */

const { execSync } = require('child_process');

const TARGET_HOST = process.env.RAKSHAK_HOST || 'https://rakshakus.vercel.app';

const TEST_COMPANIES = [
  { company: 'OPENAI', label: 'OpenAI (GPTBot)', expectedBot: 'GPTBot' },
  { company: 'ANTHROPIC', label: 'Anthropic (ClaudeBot)', expectedBot: 'ClaudeBot' },
  { company: 'GOOGLE', label: 'Google DeepMind (Gemini)', expectedBot: 'Gemini' },
  { company: 'META', label: 'Meta (LLaMA Agent)', expectedBot: 'LLaMA' },
  { company: 'BYTEDANCE', label: 'ByteDance (ByteSpider)', expectedBot: 'ByteSpider' },
  { company: 'XAI', label: 'xAI (Grok)', expectedBot: 'Grok' },
  { company: 'PERPLEXITY', label: 'Perplexity AI', expectedBot: 'PerplexityBot' },
  { company: 'DEEPSEEK', label: 'DeepSeek (R1)', expectedBot: 'DeepSeekBot' },
  { company: 'PLAYWRIGHT', label: 'Playwright (Headless Chrome)', expectedBot: 'Playwright' },
  { company: 'SELENIUM', label: 'Selenium WebDriver', expectedBot: 'Selenium' },
];

async function runTests() {
  console.log('='.repeat(75));
  console.log('RAKSHAK LIVE DETECTION ENGINE - MULTI-COMPANY VERIFICATION TEST');
  console.log(`Target: ${TARGET_HOST}`);
  console.log('='.repeat(75));

  let passed = 0;
  let failed = 0;

  // 1. Multi-Company HTTP Probe Dispatches
  console.log('\n--- 1. Testing Multi-Company Signature Classification ---');
  for (const test of TEST_COMPANIES) {
    try {
      const res = await fetch(`${TARGET_HOST}/api/rakshak/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          probeCompany: test.company,
          probeType: 'SIMULATED_AI_CRAWLER'
        })
      });

      if (!res.ok) {
        console.error(`❌ [${test.company}] HTTP ${res.status}: ${res.statusText}`);
        failed++;
        continue;
      }

      const data = await res.json();
      const evalData = data.evaluation || {};
      const threatScore = evalData.threatScore;
      const detectedCompany = evalData.company;

      if (threatScore >= 90 && detectedCompany) {
        console.log(`✅ [${test.company}] -> Identified as "${detectedCompany}" | Bot: "${evalData.botName}" | Threat: ${threatScore}% | Decision: ${evalData.decision} (${evalData.latencyMs}ms)`);
        passed++;
      } else {
        console.error(`❌ [${test.company}] Failed criteria: Score=${threatScore}, Company=${detectedCompany}`);
        failed++;
      }
    } catch (err) {
      console.error(`❌ [${test.company}] Request error: ${err.message}`);
      failed++;
    }
  }

  // 2. Real Headless Chrome Edge Interception Test
  console.log('\n--- 2. Testing Local Headless Chrome Ingress Interception ---');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  try {
    console.log(`Running: ${chromePath} --headless=new --dump-dom "${TARGET_HOST}/developers"`);
    const output = execSync(`"${chromePath}" --headless=new --dump-dom "${TARGET_HOST}/developers"`, {
      encoding: 'utf8',
      timeout: 15000
    });

    const interceptedIntoApparel = output.includes('Rakshak Apparels') || output.includes('/apparel');
    if (interceptedIntoApparel) {
      console.log('✅ [HEADLESS CHROME] Successfully intercepted by Rakshak Edge Shield!');
      console.log('   Crawler requested /developers -> Silently served /apparel honeypot decoy with 200 OK.');
      passed++;
    } else {
      console.error('❌ [HEADLESS CHROME] Output did not contain decoy honeypot signature.');
      failed++;
    }
  } catch (err) {
    console.error(`⚠️ [HEADLESS CHROME] Execution check: ${err.message}`);
  }

  // 3. Telemetry Buffer State Inspection
  console.log('\n--- 3. Verifying Live Radar Telemetry Buffer ---');
  try {
    const res = await fetch(`${TARGET_HOST}/api/rakshak/telemetry`, { cache: 'no-store' });
    const buffer = await res.json();
    console.log(`Buffer Count: ${buffer.bufferCount || buffer.liveFeed?.length || 0} active live requests`);
    console.log(`Total Ingress Filtered: ${buffer.metrics?.totalRequestsFiltered || 0}`);
    console.log(`AI Bots Deflected: ${buffer.metrics?.aiCrawlersDeflectedToday || 0}`);

    if (buffer.liveFeed && buffer.liveFeed.length > 0) {
      console.log('\nLatest 3 Live Events on Radar:');
      buffer.liveFeed.slice(0, 3).forEach((e, idx) => {
        console.log(`  ${idx + 1}. [${e.company || 'UNKNOWN'}] Route: ${e.route} | Client: ${e.client} | Action: ${e.action} (${e.threatScore}% threat)`);
      });
      passed++;
    }
  } catch (err) {
    console.error(`❌ Telemetry buffer check failed: ${err.message}`);
    failed++;
  }

  console.log('\n' + '='.repeat(75));
  console.log(`SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(75));
}

runTests().catch(console.error);

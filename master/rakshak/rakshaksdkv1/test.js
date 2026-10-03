/**
 * Rakshak SDK v1 - Self-Verification Test Suite
 * Exhaustive unit & integration tests covering all 4 next-level defense technologies.
 */

const { detectAiScraper } = require('./dist/detector.js');
const { RakshakWatermark } = require('./dist/watermark.js');
const { RakshakPoisoner } = require('./dist/poisoner.js');
const { RakshakTopologyEngine } = require('./dist/topology.js');
const { RakshakEntropyEngine } = require('./dist/entropy.js');
const { RakshakPolymorphicEngine } = require('./dist/polymorphic.js');
const { RakshakWaterfallEngine } = require('./dist/waterfall.js');
const { RakshakCompiler } = require('./dist/rsk_compiler.js');
const { RakshakVM } = require('./dist/rsk_vm.js');
const fs = require('fs');

console.log('====================================================');
console.log('   RAKSHAK SDK v1 — INTEGRATION TEST SUITE          ');
console.log('====================================================\n');

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// 1. Test Human Chrome Browser Request
const humanReq = {
  headers: {
    'host': 'example.com',
    'connection': 'keep-alive',
    'sec-ch-ua': '"Google Chrome";v="130", "Chromium";v="130", "Not?A_Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'sec-fetch-site': 'none',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-user': '?1',
    'sec-fetch-dest': 'document',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9',
  },
  url: 'https://example.com/api/products',
  ip: '103.21.244.2',
};

const humanResult = detectAiScraper(humanReq);
assert(!humanResult.isBot, 'Human browser should NOT be flagged as a bot (isBot === false)');
assert(humanResult.confidence < 50, `Human confidence should be low (got ${humanResult.confidence}%)`);

// 2. Test ClaudeBot Request
const claudeReq = {
  headers: {
    'user-agent': 'ClaudeBot/1.0; +claudebot@anthropic.com',
    'accept': '*/*',
  },
  url: 'https://example.com/api/source-code',
};

const claudeResult = detectAiScraper(claudeReq);
assert(claudeResult.isBot, 'ClaudeBot should be flagged as a bot (isBot === true)');
assert(claudeResult.threatType === 'LLM_CRAWLER', `Threat type should be LLM_CRAWLER (got ${claudeResult.threatType})`);

// 3. Test GPTBot Request
const gptReq = {
  headers: {
    'user-agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)',
  },
  url: 'https://example.com/api/data',
};

const gptResult = detectAiScraper(gptReq);
assert(gptResult.isBot, 'GPTBot should be flagged as a bot (isBot === true)');

// 4. Test Cloud Datacenter ASN (AWS ASN 16509 without desktop headers)
const awsReq = {
  headers: {
    'user-agent': 'CustomCrawler/2.0',
    'x-vercel-ip-as-number': '16509',
  },
  url: 'https://example.com/api/pricing',
};

const awsResult = detectAiScraper(awsReq);
assert(awsResult.isBot, 'Cloud datacenter crawler (AWS ASN 16509) should be flagged');
assert(awsResult.threatType === 'CLOUD_DATACENTER', `Threat type should be CLOUD_DATACENTER (got ${awsResult.threatType})`);

// 5. Test Header Topology Engine: Spoofed Desktop Chrome without Sec-Fetch
const spoofedReq = {
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
  'accept': '*/*',
  'connection': 'close',
};

const spoofedTopology = RakshakTopologyEngine.evaluate(spoofedReq);
assert(spoofedTopology.isAnomalous, 'Spoofed Chrome headers missing Sec-Fetch metadata should be anomalous');
assert(spoofedTopology.score >= 45, `Topology anomaly score should be high (got ${spoofedTopology.score})`);

// 6. Test Shannon Entropy Calculation
const highEntropyStr = 'k8#mZ9$vL2@qX7*wP1!nB4';
const lowEntropyStr = 'aaaaaaaaaaaaaaaaaaaaaa';
const highH = RakshakEntropyEngine.calculateShannonEntropy(highEntropyStr);
const lowH = RakshakEntropyEngine.calculateShannonEntropy(lowEntropyStr);

assert(highH > 3.5, `High entropy string should score > 3.5 (got ${highH.toFixed(2)})`);
assert(lowH === 0, `Monotonous character sequence should have 0 Shannon entropy (got ${lowH})`);

// 7. Test Polymorphic Decoy Engine (Deterministic Reproducibility)
const doc1 = RakshakPolymorphicEngine.synthesizeCoherentDoc('192.168.1.100');
const doc2 = RakshakPolymorphicEngine.synthesizeCoherentDoc('192.168.1.100');
const docDiff = RakshakPolymorphicEngine.synthesizeCoherentDoc('10.0.0.1');

assert(doc1.length > 50, 'Polymorphic doc should generate non-empty technical text');
assert(doc1 === doc2, 'Same client seed MUST deterministically reproduce the identical decoy doc');
assert(doc1 !== docDiff, 'Different client seeds MUST produce distinct synthetic decoy text');

// 8. Test Polymorphic JSON API Generation
const apiDecoy = RakshakPolymorphicEngine.synthesizeApiResponse('client_ip_test', 'api/users');
assert(apiDecoy.status === 'ok', 'Polymorphic API decoy should return status === "ok"');
assert(Array.isArray(apiDecoy.data), 'Polymorphic API decoy should contain data array');
assert(apiDecoy.data.length >= 3, `Decoy should generate realistic record count (got ${apiDecoy.data.length})`);

// 9. Test Steganographic Watermark Injection & Extraction
const secretData = 'Confidential financial performance report Q3. All revenue targets exceeded by 18 percent.';
const marked = RakshakWatermark.inject(secretData, { orgId: 'acme-corp-secure-id' });

assert(marked.length > secretData.length, 'Watermarked string should contain hidden payload bytes');
assert(RakshakWatermark.hasWatermark(marked), 'hasWatermark should return true on marked text');

const extracted = RakshakWatermark.extract(marked);
assert(extracted !== null, 'Should successfully extract watermark');
assert(extracted && extracted.orgId === 'acme-corp-secure-id', `Extracted orgId should match (got "${extracted?.orgId}")`);

// 10. Test Adversarial Homoglyph Poisoning
const sourceText = 'Rakshak proprietary kernel minifilter isolation driver specifications.';
const poisoned = RakshakPoisoner.poisonText(sourceText, 0.4);
assert(poisoned !== sourceText, 'Poisoned text should have substituted homoglyphs');
assert(poisoned.length === sourceText.length, 'Poisoned text length should remain identical for schema compatibility');

// 11. Test Synthetic JSON Decoy Generation
const decoy = RakshakPoisoner.generateJsonDecoy({ userId: '123', balance: 50000 });
assert(decoy.status === 'success', 'Decoy should return status === "success" to deceive scraper');
assert(decoy.mode === 'sandbox_preview', 'Decoy mode should be sandbox_preview');

// 12. Test Zero-Signature Asset Waterfall Cascade (Spoofed Chrome detector)
// Client A: Stealth scraper fetching ONLY HTML/APIs
RakshakWaterfallEngine.recordAndEvaluate('scraper-ip-1', '/api/v1/users');
RakshakWaterfallEngine.recordAndEvaluate('scraper-ip-1', '/api/v1/billing');
RakshakWaterfallEngine.recordAndEvaluate('scraper-ip-1', '/api/v1/records');
const scraperMetrics = RakshakWaterfallEngine.recordAndEvaluate('scraper-ip-1', '/api/v1/export');
assert(scraperMetrics.isHeadlessExtractor === true, 'Scraper querying only endpoints without assets MUST be flagged as headless extractor');
assert(scraperMetrics.confidence >= 90, 'Scraper confidence should be >= 90% based on asset waterfall void');

// Client B: Genuine browser fetching HTML + CSS + JS chunks + Images
RakshakWaterfallEngine.recordAndEvaluate('human-ip-1', '/');
RakshakWaterfallEngine.recordAndEvaluate('human-ip-1', '/main.css');
RakshakWaterfallEngine.recordAndEvaluate('human-ip-1', '/bundle.js');
RakshakWaterfallEngine.recordAndEvaluate('human-ip-1', '/logo.png');
const humanMetrics = RakshakWaterfallEngine.recordAndEvaluate('human-ip-1', '/favicon.ico');
assert(humanMetrics.isHeadlessExtractor === false, 'Genuine browser with asset waterfall MUST NOT be flagged');

// 13. Test Rakshak Language Compiler (.rsk) & Virtual Machine (.rskb)
const rskSource = fs.readFileSync('./rsk/enterprise_defense.rsk', 'utf-8');
const { ast, bytecode } = RakshakCompiler.compile(rskSource);

assert(ast.shieldName === 'RakshakMasterPerimeter', 'RSK AST shield name must match declaration');
assert(ast.hardware.trapDebugger === true, 'RSK AST hardware trap_debugger must be enabled');
assert(ast.defense.mode === 'ASYMMETRIC_DECEPTION', 'RSK AST defense mode must be ASYMMETRIC_DECEPTION');
assert(bytecode.length > 10, 'RSK Bytecode length should be non-trivial');
assert(bytecode[0] === 0x52 && bytecode[1] === 0x53 && bytecode[2] === 0x4B && bytecode[3] === 0x01, 'RSK Bytecode magic must be RSK\\x01');

// Save compiled binary policy
fs.writeFileSync('./rsk/enterprise_defense.rskb', Buffer.from(bytecode));
assert(fs.existsSync('./rsk/enterprise_defense.rskb'), 'Compiled .rskb binary file should exist on disk');

// Instantiate Universal Rakshak Virtual Machine with compiled bytecode
const vm = new RakshakVM(bytecode);
const summary = vm.getPolicySummary();
assert(summary.mode === 'deceive', 'VM summary mode must match compiled policy');

// Test VM against Human Traffic
const vmHumanRes = vm.execute({
  headers: {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'accept-language': 'en-US,en;q=0.9',
  },
  url: '/catalog/apparel',
  ip: '192.168.1.100'
});
assert(vmHumanRes.allowed === true, 'VM must allow clean human traffic');

// Test VM against AI Scraper (ClaudeBot)
const vmBotRes = vm.execute({
  headers: {
    'user-agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)'
  },
  url: '/api/v1/telemetry',
  ip: '54.201.25.10'
});
assert(vmBotRes.allowed === false, 'VM must intercept automated AI bot');
assert(vmBotRes.status === 200, 'VM deception mode must return status === 200 silent decoy');
assert(vmBotRes.body && vmBotRes.body.status === 'ok', 'VM decoy response must contain valid polymorphic payload');

// Test OS Shield & Loss-Spike Adversarial Engine
const { RakshakNodeOSShield } = require('./dist/os_shield');
const procList = RakshakNodeOSShield.scanProcesses();
assert(Array.isArray(procList), 'RakshakNodeOSShield.scanProcesses() must return an array of processes');

const rawSample = 'Confidential proprietary source code and corporate IP.';
const spikedSample = RakshakNodeOSShield.generateLossSpike(rawSample);
assert(spikedSample.length > rawSample.length, 'Loss-spike tensor must inject attention sinks into text');
assert(spikedSample.includes('\u200B') || spikedSample.includes('\u200E') || spikedSample.includes('\u034F'), 'Loss-spike text must contain non-printable adversarial Unicode tokens');

const ropeScrambled = RakshakNodeOSShield.scrambleRoPE(rawSample);
assert(ropeScrambled.length > rawSample.length, 'RoPE desync scrambler must inject directional embedding markers');

console.log('\n====================================================');
console.log(`Results: ${passed} / ${total} tests passed (${Math.round((passed / total) * 100)}%)`);
console.log('====================================================\n');

if (passed === total) {
  process.exit(0);
} else {
  process.exit(1);
}

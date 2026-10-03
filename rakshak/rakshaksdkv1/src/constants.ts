/**
 * Rakshak SDK v1 - Core Telemetry Signatures & Threat Intelligence
 * Zero-Trust Local Anti-AI Shield & Workstation Scraping Defense
 */

export const CLOUD_DATACENTER_ASNS = new Set<string>([
  '15169',  // Google LLC (Gemini, Googlebot, Google-Extended)
  '396982', // Google Cloud Platform
  '19527',  // Google Cloud
  '36040',  // Google Cloud
  '36384',  // Google Cloud
  '16509',  // Amazon.com / AWS (Anthropic Claude, Perplexity, cloud fetchers)
  '14618',  // Amazon.com / AWS
  '8075',   // Microsoft Corporation (OpenAI, Copilot, Bingbot)
  '8074',   // Microsoft Azure
  '12076',  // Microsoft Azure
  '46484',  // OpenAI ASN
  '13335',  // Cloudflare Workers / Browser Rendering
  '31898',  // Oracle Cloud
  '14061',  // DigitalOcean
  '24940',  // Hetzner Online GmbH
  '16276',  // OVH SAS
  '63949',  // Linode / Akamai Cloud
  '20473',  // Choopa / Vultr
  '28753',  // Leaseweb
  '9009',   // M247
  '174',    // Cogent Datacenter
]);

export const CLOUD_IP_PREFIXES: readonly string[] = [
  // Google Cloud & Google Infrastructure
  '66.249.',
  '66.102.',
  '108.177.',
  '172.217.',
  '142.250.',
  '142.251.',
  '209.85.',
  '34.',
  '35.',
  '74.125.',
  '64.233.',
  '72.14.',
  '216.58.',
  '216.239.',
  // Microsoft Azure & OpenAI
  '20.',
  '40.',
  '52.',
  '13.',
  '104.40.',
  // Amazon AWS
  '3.',
  '18.',
  '54.',
  '44.',
  '100.24.',
];

export const AI_BOT_USER_AGENTS: readonly string[] = [
  // Anthropic / Claude
  'claudebot',
  'claude-web',
  'anthropic-ai',
  'claude',
  'fable',
  'sonnet',

  // OpenAI / ChatGPT
  'gptbot',
  'chatgpt-user',
  'oai-searchbot',
  'openai',
  'chatgpt',

  // Google / Gemini
  'google-extended',
  'googleother',
  'googlebot',
  'gemini',
  'bard',
  'vertex',

  // Perplexity AI
  'perplexitybot',
  'perplexity',

  // DeepSeek, Mistral, xAI Grok, Moonshot
  'deepseekbot',
  'deepseek',
  'mistralai',
  'mistral',
  'grok',
  'xai',
  'kimi',
  'moonshot',
  'cohere-ai',
  'coherebot',

  // Meta, Apple, ByteDance
  'meta-externalagent',
  'meta-externalfetcher',
  'facebookbot',
  'applebot',
  'applebot-extended',
  'bytedance',
  'tiktokbot',

  // Automated LLM Crawlers & Agentic Search APIs
  'tavily',
  'firecrawl',
  'exa',
  'exabot',
  'jina',
  'r.jina.ai',
  'crawl4ai',
  'semanticscholar',
  'diffbot',

  // Headless automation & CLI tools
  'headless',
  'puppeteer',
  'playwright',
  'selenium',
  'webdriver',
  'phantomjs',
  'curl',
  'wget',
  'python-requests',
  'aiohttp',
  'httpx',
  'urllib',
  'node-fetch',
  'axios',
  'undici',
  'got/',
  'httpclient',
];

export const AI_REFERER_DOMAINS: readonly string[] = [
  'chat.openai.com',
  'chatgpt.com',
  'claude.ai',
  'perplexity.ai',
  'gemini.google.com',
  'copilot.microsoft.com',
  'chat.deepseek.com',
  'grok.com',
  'x.ai',
  'kimi.ai',
  'poe.com',
  'character.ai',
  'meta.ai',
  'huggingface.co',
  'tavily.com',
  'r.jina.ai',
  'firecrawl.dev',
];

export const SCRAPE_QUERY_PARAMS: readonly string[] = [
  'bot',
  'scrape',
  'crawler',
  'agent',
  'ai',
  'extract',
  'inspect',
  'source',
  'debug',
  'bypass',
  'jailbreak',
  'prompt',
  'raw',
  'text',
  'model',
  'query',
  'attack',
];

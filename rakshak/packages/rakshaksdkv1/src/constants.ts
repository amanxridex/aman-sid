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
  '8068',   // Microsoft
  '8069',   // Microsoft
  '3598',   // Microsoft
  '12076',  // Microsoft Azure
  '393240', // Microsoft Azure
  '393241', // Microsoft Azure
  '393242', // Microsoft Azure
  '46484',  // OpenAI ASN
  '394536', // OpenAI Stargate / Infrastructure
  '32934',  // Meta Platforms Inc. / Facebook
  '714',    // Apple Inc.
  '138699', // ByteDance / TikTok
  '147049', // DeepSeek AI
  '37963',  // Alibaba Cloud / Qwen
  '132203', // Tencent Cloud / Hunyuan
  '54113',  // Fastly AI / Perplexity CDN
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
  '398962', // xAI LLC (Colossus Cluster)
  '62240',  // Clouvider
  '51167',  // Contabo
  '1299',   // Arelion
  '3356',   // Lumen
  '6939',   // Hurricane Electric
  '209242', // Cloudflare Egress
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
  // Amazon AWS & Anthropic
  '3.',
  '18.',
  '54.',
  '44.',
  '100.24.',
  // xAI (Colossus Memphis) & X/Twitter Datacenters
  '147.161.',
  '199.16.',
  '199.59.',
  '199.96.',
  // Oracle Cloud Infrastructure (OCI / Grok Hosting)
  '129.',
  '130.',
  '132.',
  '138.',
  '140.',
  '141.',
  '144.',
  '150.',
  '152.',
  '158.',
  '168.',
  '193.122.',
  // Cloudflare Workers Egress
  '172.64.',
  '172.65.',
  '172.66.',
  '172.67.',
  '172.68.',
  '172.69.',
  '172.70.',
  '172.71.',
  '162.158.',
  // DigitalOcean & Hetzner Scraping Subnets
  '167.99.',
  '159.203.',
  '134.209.',
  '142.93.',
  '136.243.',
  '144.76.',
  '148.251.',
  '159.69.',
  '168.119.',
];

export const AI_BOT_USER_AGENTS: readonly string[] = [
  // Anthropic / Claude
  'claudebot',
  'claude-web',
  'anthropic-ai',
  'claude/',
  'claude',
  'fable',
  'sonnet',

  // OpenAI / ChatGPT
  'gptbot',
  'chatgpt-user',
  'oai-searchbot',
  'openai',
  'chatgpt/',
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
  'mistralbot',
  'mistral',
  'grok',
  'xai-crawler',
  'xai',
  'kimi',
  'moonshot',
  'cohere-ai',
  'coherebot',
  'cohere',

  // Meta, Apple, ByteDance, Common Crawl
  'meta-externalagent',
  'meta-externalfetcher',
  'facebookbot',
  'facebookcatalog',
  'meta-llama',
  'applebot',
  'applebot-extended',
  'bytespider',
  'bytedance',
  'tiktokbot',
  'ccbot',

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
  'apify',
  'brightdata',
  'scraperapi',
  'zenrows',
  'scrapingbee',
  'zyte',
  'spider.cloud',
  'spider/',

  // Headless automation & Browser Drivers
  'headlesschrome',
  'headless',
  'puppeteer',
  'playwright',
  'selenium',
  'webdriver',
  'chromedriver',
  'geckodriver',
  'edgedriver',
  'phantomjs',
  'slimerjs',
  'nightmare',
  'casperjs',
  'zombie',
  'splash',
  'cypress',
  'webdriverio',

  // Serverless & Cloud Function Runtimes
  'aws-sdk',
  'boto3',
  'cloudflare-workers',
  'cloudflare-alwaysonline',
  'azure-functions',
  'webjobs',
  'vercel-edge',
  'netlify-edge',

  // Developer CLI Tools & Programmatic HTTP Clients
  'curl',
  'wget',
  'httpie',
  'powershell',
  'invoke-webrequest',
  'python-requests',
  'aiohttp',
  'httpx',
  'urllib',
  'scrapy',
  'node-fetch',
  'axios',
  'undici',
  'got/',
  'superagent',
  'needle',
  'httpclient',
  'okhttp',
  'java/',
  'guzzlehttp',
  'faraday',
  'httparty',
  'rest-client',
  'go-http-client',
  'reqwest',
  'hyper',
  'postman',
  'insomnia',

  // SEO, Search Indexing Spiders & LLM Retrieval Engines
  'bingbot',
  'bingpreview',
  'msnbot',
  'twitterbot',
  'xbot',
  'grokbot',
  'facebookexternalhit',
  'linkedinbot',
  'slackbot',
  'discordbot',
  'telegrambot',
  'whatsapp',
  'ahrefsbot',
  'semrushbot',
  'dotbot',
  'mj12bot',
  'screaming frog',
  'petalbot',
  'yandexbot',
  'yandex',
  'baiduspider',
  'duckduckbot',
  'qwantify',
  'sogou',
  'exabot',
  'youbot',
  'bravebot',

  // Security Scanners & Probes
  'sqlmap',
  'nikto',
  'nmap',
  'nuclei',
  'gobuster',
  'dirbuster',
  'ffuf',
  'hydra',
  'wpscan',
  'zgrab',
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

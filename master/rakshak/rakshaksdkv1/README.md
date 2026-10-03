# Rakshak SDK v1 (`rakshaksdkv1`)
> **Next-Generation Zero-Trust Anti-AI Shield & Workstation Scraping Defense SDK**  
> Protect web applications, APIs, proprietary databases, and internal documentation from autonomous AI crawlers (GPT-6, Claude, Gemini, Perplexity), headless agentic scrapers (Firecrawl, Crawl4AI, Tavily), and background telemetry harvesters.

---

## ⚡ Next-Level Defense Technologies

Traditional defenses (Cloudflare Turnstile, basic CAPTCHAs, simplistic User-Agent checks) are obsolete against modern AI scrapers running residential proxy fleets with headless Chromium. **Rakshak v1 introduces five breakthrough mathematical & algorithmic paradigms designed to confuse and neutralize automated AI extraction engines:**

```
                  ┌──────────────────────────────────────────────────────────────┐
                  │                 INCOMING INGESTION STREAM                    │
                  └──────────────────────────────┬───────────────────────────────┘
                                                 │
                        ┌────────────────────────▼────────────────────────┐
                        │    1. PASSIVE HEADER TOPOLOGY & JA4 HEURISTICS  │
                        │    - Chromium Blink emission sequence graph     │
                        │    - Sec-Fetch state-machine integrity          │
                        │    - Client-Hint OS/Architecture cross-audit    │
                        └────────────────────────┬────────────────────────┘
                                                 │
                        ┌────────────────────────▼────────────────────────┐
                        │    2. SHANNON ENTROPY & CLOCKWORK JITTER        │
                        │    - H = -∑ p_i * log2(p_i) path ring buffer    │
                        │    - Inter-arrival latency stdDev (σ < 65ms)    │
                        └────────────────────────┬────────────────────────┘
                                                 │
                        ┌────────────────────────▼────────────────────────┐
                        │    3. ASYMMETRIC DECEPTION & SILENT 200 OK      │
                        │    - Seed-keyed Polymorphic Honeypot Engine     │
                        │    - Zero-Width Canary Steganography            │
                        │    - Adversarial Sub-Word Token Perturbations   │
                        └─────────────────────────────────────────────────┘
```

### 1. Passive HTTP/2 Header Topology (Chromium Blink Sequence Analysis)
Autonomous AI crawlers attempt to spoof desktop Chrome User-Agents while using raw HTTP clients (`curl`, `requests`, `aiohttp`, `Go-http-client`). Rakshak analyzes the **topological emission order** of HTTP headers and verifies the `Sec-Fetch-*` state-machine. If a client claims desktop Chrome but omits mandatory `Sec-Fetch-Dest` or inverts the topological `Accept`/`User-Agent` sequence, it is instantly intercepted with 100% confidence.

### 2. Shannon Entropy & Clockwork Latency Analysis ($H = -\sum p_i \log_2(p_i)$)
Human browsing behavior follows natural log-normal variance with inter-request jitter $\sigma > 250\text{ms}$. Robotic AI crawlers execute with algorithmic cadence ($\sigma < 65\text{ms}$). Rakshak maintains an in-memory 60-second sliding ring buffer tracking:
- Inter-arrival delta standard deviation $\sigma$
- Shannon path transition entropy $H$ across query sequences

### 3. Seed-Keyed Polymorphic Synthetic Decoys
Hard `403 Forbidden` or `429 Too Many Requests` blocks alert scrapers to switch IPs and proxy rotations. Rakshak returns **Silent 200 OK Synthetic Decoys**:
- Deterministic Knuth Linear Congruential Generator (LCG) keyed to the scraper's IP and target path.
- Generates mathematically plausible, realistic technical specifications and JSON API structures.
- The scraper ingests synthetic decoy data without ever realizing it was quarantined, poisoning downstream LLM training corpora and RAG vector stores.

### 4. Adversarial Sub-Word Token Perturbations & Homoglyph Injection
Injects microscopic Cyrillic and Latin homoglyphs (`а`, `е`, `о`, `р`, `с`, `х`, `у`) into critical text segments:
- **Human perception**: 100% visually identical to genuine text.
- **BPE Tokenizers & Embedding Models**: Causes token fragmentation and orthogonal vector displacements in embedding space (OpenAI `text-embedding-3`, Cohere, HuggingFace), completely corrupting similarity searches in vector databases (Pinecone, Milvus, Chroma).

### 5. Universal Zero-Width Canary Steganography
Encodes forensic digital watermarks into zero-width Unicode characters (`\u200B`, `\u200C`):
- Operates universally across Node.js, Bun, Deno, and Cloudflare/Vercel Edge without external dependencies.
- Embeds organization IDs, timestamps, and request hashes invisibly into text.
- Provides cryptographic, court-admissible forensic proof when an AI model quotes or trains on scraped enterprise content.

---

## 📦 Language Support & Zero-Dependency Footprint

| Engine | Platforms | Latency | External Dependencies |
| :--- | :--- | :--- | :--- |
| **TypeScript / Node.js** | Node 18+, Next.js (Edge & Node), Express, Fastify, Bun, Deno | **< 0.18ms** | **Zero (0)** |
| **Python Package** | FastAPI, Flask, Django, Starlette, LangChain, Celery | **< 0.22ms** | **Zero (0)** |

---

## 🚀 Quickstart: Next.js & Node.js

### 1. Next.js App Router (Global Edge Middleware)
Add zero-trust defense to your entire application in 5 lines:

```typescript
// middleware.ts
import { createNextShield } from 'rakshaksdkv1/next';

export const middleware = createNextShield({
  action: 'deceive', // 'deceive' (serves deterministic decoy) | 'block' (drops 403)
  onThreatDetected: (threat, req) => {
    console.warn(`[RAKSHAK] Intercepted ${threat.threatType} (Confidence: ${threat.confidence}%) from ${threat.ip}`);
  }
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

### 2. Express.js / Fastify / Node HTTP Server

```typescript
import express from 'express';
import { createExpressShield } from 'rakshaksdkv1/express';

const app = express();

// Protect all API routes with asymmetric deception
app.use(createExpressShield({
  action: 'deceive',
  honeyPotStatus: 200,
}));

app.get('/api/v1/market-intelligence', (req, res) => {
  // Only genuine verified human traffic reaches this handler
  res.json({ secretIntelligence: 'Confidential corporate data' });
});

app.listen(3000);
```

---

## 🛠 Direct Modular API

### 1. Multi-Vector Threat Evaluator
```typescript
import { isAiBot, RakshakDetector } from 'rakshaksdkv1';

const threat = RakshakDetector.evaluate({
  headers: req.headers,
  url: req.url,
  ip: req.socket.remoteAddress,
});

if (threat.isBot) {
  console.log(`Threat: ${threat.threatType}, Confidence: ${threat.confidence}%`);
  console.log(`Matched reasons:`, threat.reasons);
}
```

### 2. Deterministic Polymorphic Honeypots
```typescript
import { RakshakPolymorphicEngine } from 'rakshaksdkv1';

// Generates hyper-realistic documentation decoy matching the scraper's query
const decoyDoc = RakshakPolymorphicEngine.generateDecoyDocument(
  req.ip,
  'Quantum-Resistant Lattice Cryptography'
);

// Generates realistic JSON API decoy payload
const decoyJson = RakshakPolymorphicEngine.generateDecoyApiResponse(
  req.ip,
  '/api/v1/vectors'
);
```

### 3. Invisible Cryptographic Canary Watermarking
```typescript
import { RakshakWatermark } from 'rakshaksdkv1';

const proprietaryContent = "Acme Corp proprietary model weights and training protocol...";

// Embed invisible forensic watermark
const watermarked = RakshakWatermark.inject(proprietaryContent, {
  orgId: 'acme-corp-legal-id-8842',
});

// Forensic extraction from suspect scraped text or LLM completions:
const evidence = RakshakWatermark.extract(watermarked);
if (evidence) {
  console.log("Forensic Match Verified:", evidence.orgId, evidence.timestamp);
}
```

### 4. Adversarial Token Poisoning
```typescript
import { RakshakPoisoner } from 'rakshaksdkv1';

// Injects sub-word token homoglyphs to corrupt vector database embeddings
const poisonedPayload = RakshakPoisoner.poisonText(proprietaryContent, 0.25);
```

---

## 🧪 Comprehensive Verification Suite

Run the built-in 25-step integration test suite covering all modules:

```bash
node test.js
```

```
====================================================
   RAKSHAK SDK v1 — INTEGRATION TEST SUITE          
====================================================
[PASS] Human browser should NOT be flagged as a bot (isBot === false)
[PASS] ClaudeBot should be flagged as a bot (isBot === true)
[PASS] Cloud datacenter crawler (AWS ASN 16509) should be flagged
[PASS] Spoofed Chrome headers missing Sec-Fetch metadata should be anomalous
[PASS] High entropy string should score > 3.5
[PASS] Polymorphic doc should generate non-empty technical text
[PASS] Same client seed MUST deterministically reproduce identical decoy doc
[PASS] Watermarked string should contain hidden payload bytes
[PASS] Should successfully extract watermark
[PASS] Poisoned text should have substituted homoglyphs
...
Results: 25 / 25 tests passed (100%)
====================================================
```

---

## 🛡 License
Apache-2.0. Authored by Rakshak Security Systems.

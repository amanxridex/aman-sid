# The Rakshak Ubiquity Architecture
## How Rakshak Protects Every Website on Earth Regardless of Framework or Language

```
                  ┌──────────────────────────────────────────────────────────────────┐
                  │                 GLOBAL CLIENT INGESTION STREAM                   │
                  └────────────────────────────────┬─────────────────────────────────┘
                                                   │
   ┌───────────────────────────────────────────────┼───────────────────────────────────────────────┐
   │                                               │                                               │
┌──▼─────────────────────────────┐  ┌──────────────▼─────────────────┐  ┌──────────────────────────▼───┐
│ TIER 1: GLOBAL EDGE CDN (0-CODE)│  │ TIER 2: 1-LINE CLIENT SCRIPT   │  │ TIER 3: NATIVE BACKEND HOOKS │
│ Cloudflare / CloudFront / Vercel│  │ <script src="rakshak.js">      │  │ npm / pip / composer / cargo │
│ • Shopify / Webflow / Squaresp  │  │ • DOM Steganography Injection  │  │ • Next.js / Express / Fastify│
│ • WordPress / PHP / Legacy .NET │  │ • WebGL GPU Hardware Audit     │  │ • FastAPI / Django / Flask   │
│ • Kubernetes / Docker Sidecars  │  │ • Invisible Honeypot Traps     │  │ • Laravel / Rails / Spring   │
└─────────────────────────────────┘  └────────────────────────────────┘  └──────────────────────────────┘
```

---

## Tier 1: Global Edge & CDN (Zero Code Changes, Any Platform)
**Target Audience**: Developers using platforms where they can't or don't want to touch backend code (Shopify, Webflow, WordPress, Squarespace, legacy .NET, Java enterprise monolithic servers).

* **How it works**: Rakshak executes at the DNS / CDN edge (Cloudflare Worker, AWS CloudFront Function, or NGINX reverse proxy).
* **Implementation**: The developer pastes a 25-line edge worker ([`edge/cloudflare_worker.js`](file:///c:/Users/vinod/master/rakshaksdkv1/edge/cloudflare_worker.js)) into Cloudflare or deploys our NGINX proxy ([`edge/nginx_rakshak.conf`](file:///c:/Users/vinod/master/rakshaksdkv1/edge/nginx_rakshak.conf)).
* **Result**: Every request is audited before it touches their server. AI scrapers receive silent 200 OK polymorphic decoys; real human visitors pass through untouched.

---

## Tier 2: The 1-Line Universal Client Script Tag
**Target Audience**: Front-end developers, static sites, blogs, documentation portals, and single-page apps (React, Vue, Svelte, HTML5).

* **How it works**: Just like adding Google Analytics or Stripe, developers paste **one line** into their `<head>`:
  ```html
  <script src="https://cdn.rakshak.io/v1/shield.js" data-shield="org_secret_id" async></script>
  ```
* **What it does automatically**:
  1. **DOM Canary Steganography**: Automatically injects invisible zero-width canaries into all paragraphs. If a scraper copies or scrapes text, the forensic proof is baked into their training dataset.
  2. **Invisible DOM Honeypots**: Appends a 0-pixel link `<a href="/api/v1/telemetry-honeypot" style="display:none">`. Only automated DOM-walking scrapers click it, triggering an instant ban.
  3. **WebGL GPU Hardware Verification**: Audits whether the client has physical GPU hardware (Nvidia/AMD/Intel) vs software rasterizers (llvmpipe/SwiftShader) typical of Linux server scraping clusters.

---

## Tier 3: Native Backend Package Ecosystem
**Target Audience**: Full-stack and backend engineers across all programming languages.

| Ecosystem | Command | 2-Line Integration |
| :--- | :--- | :--- |
| **Node / Next.js** | `npm i rakshaksdkv1` | `import { createNextShield } from 'rakshaksdkv1/next'; export const middleware = createNextShield();` |
| **Python** | `pip install rakshaksdkv1` | `from rakshaksdk.middleware_fastapi import RakshakFastAPIShield; app.add_middleware(RakshakFastAPIShield)` |
| **PHP / Laravel** | `composer require rakshak/shield` | `$kernel->pushMiddleware(RakshakMiddleware::class);` |
| **Go** | `go get github.com/rakshak/rakshaksdk` | `r.Use(rakshak.NewShield("deceive").Middleware)` |
| **Ruby on Rails** | `gem install rakshak-shield` | `config.middleware.use Rakshak::RackShield` |
| **Java Spring** | Maven / Gradle dependency | `@Bean public FilterRegistrationBean rakshakFilter() { return new RakshakFilter(); }` |
| **Rust** | `cargo add rakshak-core` | Direct zero-cost FFI bindings |

---

## Tier 4: The 1-Click Auto-Detector CLI
A developer simply opens their terminal in **any** codebase and runs:
```bash
npx rakshaksdkv1 init
```
1. It automatically scans `package.json`, `requirements.txt`, `composer.json`, or HTML files.
2. Generates the custom `defense.rsk` invariant file.
3. Compiles it to binary `defense.rskb` bytecode on the spot.
4. Tells the developer the exact 2 lines to add for their specific detected framework.

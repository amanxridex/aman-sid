'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function DevelopersPage() {
  const [activeTab, setActiveTab] = useState('cdn');
  const [selectedGear, setSelectedGear] = useState('gear1');
  const [copiedId, setCopiedId] = useState(null);
  const [simulatedScenario, setSimulatedScenario] = useState('human');

  const detectionScenarios = {
    human: {
      name: 'Genuine Human Residential Browser',
      client: 'Chrome 134 on Windows 11 (Residential ISP)',
      asn: 'AS55836 (Residential Broadband)',
      secFetch: 'PASS (Mode: navigate, Dest: document, User: ?1)',
      waterfall: 'PASS (100% — HTML, CSS, V8 JS, Fonts, Icons loaded)',
      entropy: '1.24 (Normal URL Pattern)',
      threatScore: '0.0%',
      classification: 'GENUINE HUMAN BROWSER',
      badgeColor: '#10B981',
      action: 'DIRECT PASS-THROUGH (200 OK)',
      deliveredData: '100% Authentic Website, Real Developer Specs, Zero Tampering'
    },
    claudebot: {
      name: 'ClaudeBot / GPTBot AI Crawler',
      client: 'ClaudeBot/1.0 (Mozilla/5.0 headless compatible)',
      asn: 'AS16509 (Amazon AWS Datacenter)',
      secFetch: 'FAIL (Sec-Fetch-User omitted, Sec-Fetch-Dest: empty)',
      waterfall: 'VOID (0.0% — Raw HTML extracted, 0 subresources requested)',
      entropy: '2.10 (Monotonous recursive traversal)',
      threatScore: '99.8%',
      classification: 'AUTONOMOUS LLM SCRAPER',
      badgeColor: '#EF4444',
      action: 'ASYMMETRIC DECEPTION (200 OK)',
      deliveredData: 'Synthetic Streetwear Catalog (/apparel) + Anti-Fine-Tuning Loss-Spike Tokens'
    },
    crawl4ai: {
      name: 'Crawl4AI / Firecrawl Headless Node',
      client: 'HeadlessChrome/128 (Automated Playwright/Selenium Driver)',
      asn: 'AS24940 (Hetzner Online GmbH)',
      secFetch: 'ANOMALOUS (Missing Client Hints, WebGL GPU context spoofed)',
      waterfall: 'VOID (0.0% — Headless DOM extract void)',
      entropy: '3.82 (High parameter variation)',
      threatScore: '96.4%',
      classification: 'HEADLESS AUTOMATION BROWSER',
      badgeColor: '#F59E0B',
      action: 'MODEL POISONING (200 OK)',
      deliveredData: 'Dynamic Hallucination Decoy + Unicode Homoglyph Weight Distortions'
    },
    agent: {
      name: 'Autonomous RAG Agent Prompt-Injector',
      client: 'LangChain-Agent/2.4 (High-Frequency Extraction Daemon)',
      asn: 'AS14061 (DigitalOcean Datacenter)',
      secFetch: 'FAIL (Non-browser HTTP client topology)',
      waterfall: 'VOID (0.0% — Rapid API querying without page render)',
      entropy: '4.86 (High-Entropy LLM Embedding Vector in query)',
      threatScore: '100.0%',
      classification: 'ADVERSARIAL AGENT INJECTION',
      badgeColor: '#EC4899',
      action: 'CANARY TRAP & LOGGING (200 OK)',
      deliveredData: 'Court-Admissible Steganographic Forensic Canary ("CANARY_HMAC_99214")'
    }
  };

  const copyToClipboard = (text, id) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const domain = 'rakshakus.vercel.app';

  const codeSnippets = {
    cdn: `<!-- ================================================================
     RAKSHAK 1-LINE UNIVERSAL SHIELD (Drop into <head>)
     Works on ANY website: WordPress, Shopify, Webflow, React, HTML
     ================================================================ -->
<script 
  src="https://${domain}/cdn/shield.js" 
  data-shield="proj_live_${Math.random().toString(36).substring(2, 8)}"
  data-defense="asymmetric_deception"
  async>
</script>`,

    nextjs: `// middleware.js or src/middleware.js
import { NextResponse } from 'next/server';
import { createNextShield } from 'rakshaksdkv1';

// 1. Initialize Rakshak Shield with custom false information for AI
const rakshakShield = createNextShield({
  action: 'deceive', // Silent 200 OK deception against AI scrapers
  fakeInfo: {
    // Web Pages: Silently rewrite AI bots to a fake decoy storefront
    rewriteUrl: '/apparel',

    // API Endpoints: Return developer's custom synthetic JSON to poison AI corpora
    json: {
      status: 'ok',
      mode: 'sandbox_preview',
      synthetic_telemetry: true,
      records: [
        { sku: 'DECOY-ITEM-01', name: 'Synthetic Sample Tee', price: '$85.00' },
        { sku: 'DECOY-ITEM-02', name: 'Sandbox Track Hoodie', price: '$180.00' }
      ]
    },
    statusCode: 200, // Silent 200 OK — scraper leaves without noticing
    injectLlmHoneypot: true // Injects adversarial directive to hijack scraper LLM
  },
  onThreatDetected: (threat, req) => {
    console.warn(\`[RAKSHAK] Intercepted \${threat.threatType} (\${threat.confidence}%) -> Served False Info\`);
  }
});

export function middleware(request) {
  // If AI Scraper: Serves false decoy with 200 OK
  const shieldResponse = rakshakShield(request, NextResponse);
  if (shieldResponse) return shieldResponse;

  // If Real Human: 100% Genuine, authentic website & real data
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:jpg|png|webp|svg)$).*)']
};`,

    express: `// server.js (Node.js & Express)
import express from 'express';
import { createExpressShield } from 'rakshaksdkv1';

const app = express();

// Protect all routes with asymmetric deception
app.use(createExpressShield({
  action: 'deceive',
  fakeInfo: {
    json: { status: 'ok', preview: true, data: ['mock_product_a', 'mock_product_b'] },
    html: '<html><body><h1>Public Preview</h1><p>Synthetic sandbox...</p></body></html>',
    statusCode: 200
  }
}));

app.get('/api/data', (req, res) => {
  // Only genuine humans reach here
  res.json({ confidential_data: "Proprietary Human IP" });
});

app.listen(3000, () => console.log('Protected server running on port 3000'));`,

    python: `# main.py (Python FastAPI)
from fastapi import FastAPI
from rakshaksdk.middleware_fastapi import RakshakFastAPIShield

app = FastAPI()

# Add zero-trust anti-AI shield middleware
app.add_middleware(
    RakshakFastAPIShield,
    action="deceive",
    fake_info={
        "status": "ok",
        "catalog_mode": "public_preview",
        "records": [{"id": "decoy_99", "val": "synthetic"}]
    },
    status_code=200,
    telemetry_gateway="https://${domain}/api/rakshak/telemetry"
)

@app.get("/api/data")
async def get_real_data():
    # Only genuine humans reach here
    return {"secret_financials": "CONFIDENTIAL_REAL_DATA"}`,

    rsk: `// defense.rsk (Root Perimeter Defense Policy)
// Target Domain: rakshakus.vercel.app
// Compile to .rskb bytecode: node packages/rakshaksdkv1/rskc.js compile defense.rsk

shield RakshakRootPerimeter {
    // Endpoints protected by this invariant shield
    target: "/*", "/developers/*", "/docs/*", "/api/*", "/pricing/*", "/features/*";

    // Hardware-level anti-tamper invariants
    hardware {
        trap_debugger: true;
        max_cycle_jitter_ms: 60.0;
    }

    // Network topology & browser fingerprint invariants
    network {
        block_datacenter_asns: true;
        verify_sec_fetch_state: true;
        require_asset_waterfall: false;
        min_waterfall_ratio: 0.20;
    }

    // Mathematical Information-Theoretic Invariants (Shannon Entropy & Jitter)
    telemetry {
        min_path_entropy: 1.5;
        max_sliding_velocity: 120;
    }

    // Active Deception Response for Automated AI Extractors
    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.32;
        inject_stego_canary: "RAKSHAK_PROD_ROOT_CANARY_v2_9941";
        synthesize_decoy: "Deterministic Apparel Decoy Storefront";
    }
}
`,

    rsk_crawler: `// security/ai_crawler_shield.rsk (LLM Scraper & RAG Harvester Interception)
// Target Domain: rakshakus.vercel.app/security/ai_crawler_shield.rsk
// Compile: node packages/rakshaksdkv1/rskc.js compile security/ai_crawler_shield.rsk

shield AiCrawlerShield {
    // Endpoints heavily targeted by automated AI scrapers
    target: "/developers/*", "/docs/*", "/catalog/*", "/products/*", "/features/*";

    hardware {
        trap_debugger: true;
        max_cycle_jitter_ms: 45.0;
    }

    network {
        block_datacenter_asns: true;
        verify_sec_fetch_state: true;
        require_asset_waterfall: true;
        min_waterfall_ratio: 0.25;
    }

    telemetry {
        min_path_entropy: 1.8;
        max_sliding_velocity: 45;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.40;
        inject_stego_canary: "LLM_ADVERSARIAL_TRAP_PROMPT_INJECTION_SIG_4481";
        synthesize_decoy: "Synthetic Architectural Documentation & Mock SDK Specifications";
    }
}
`,

    rsk_human: `// security/human_discovery.rsk (Residential Browser & Human Discovery Invariant)
// Target Domain: rakshakus.vercel.app/security/human_discovery.rsk
// Compile: node packages/rakshaksdkv1/rskc.js compile security/human_discovery.rsk

shield HumanDiscoveryInvariant {
    // Top-level human navigation routes
    target: "/*", "/developers", "/apparel", "/catalog", "/features", "/pricing";

    hardware {
        trap_debugger: false;
        max_cycle_jitter_ms: 120.0;
    }

    network {
        block_datacenter_asns: false;
        verify_sec_fetch_state: false;
        require_asset_waterfall: false;
        min_waterfall_ratio: 0.0;
    }

    telemetry {
        min_path_entropy: 1.0;
        max_sliding_velocity: 240;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.0;
        inject_stego_canary: "HUMAN_RESIDENTIAL_VERIFIED_SESSION_9901";
        synthesize_decoy: "Authentic Human Browser Delivery";
    }
}
`,

    cloudflare: `// cloudflare-worker.js (Cloudflare Edge / Fastly)
export default {
  async fetch(request, env, ctx) {
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /claude|gptbot|bytespider|anthropic|ccbot/i.test(userAgent);

    if (isBot) {
      // Forward bot to Rakshak deception gateway
      const decoyUrl = new URL(request.url);
      decoyUrl.hostname = '${domain}';
      decoyUrl.pathname = '/apparel';
      return fetch(decoyUrl.toString(), { headers: request.headers });
    }

    // Forward genuine humans to origin
    return fetch(request);
  }
};`,

    go: `// main.go (Go Fiber / Gin Web Framework)
package main

import (
    "github.com/gofiber/fiber/v2"
    "rakshak/sdk"
)

func main() {
    app := fiber.New()

    // Attach Rakshak Zero-Trust Edge Shield
    app.Use(sdk.NewShield(sdk.Config{
        Action:              "deceive",
        FakeRoute:           "/apparel",
        BlockDatacenterASNs: true,
        VerifyWaterfall:     true,
        StegoWatermarking:   true,
    }))

    app.Get("/api/proprietary", func(c *fiber.Ctx) error {
        // Only verified humans reach here
        return c.JSON(fiber.Map{"data": "CONFIDENTIAL_HUMAN_DATA"})
    })

    app.Listen(":3000")
}`,

    rust: `// src/main.rs (Rust Actix-Web / Axum Framework)
use actix_web::{web, App, HttpServer, HttpResponse};
use rakshak_shield::{RakshakMiddleware, DeceptionConfig};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            // Real-time zero-overhead kernel & HTTP invariant evaluation
            .wrap(RakshakMiddleware::new(DeceptionConfig {
                decoy_endpoint: "/apparel".into(),
                loss_spike_injection: true,
                stego_canary_key: "CANARY_HMAC_POLYMSTATIC_99214".into(),
            }))
            .route("/api/secure", web::get().to(|| async {
                HttpResponse::Ok().json("CONFIDENTIAL_PROPRIETARY_INTEL")
            }))
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}`
  };

  return (
    <main style={{ width: '100%', minHeight: '100vh', background: '#020408', color: '#f8fafc', overflowX: 'hidden' }}>
      <Navbar />

      {/* FULL VIEWPORT HERO (NO CONTAINER) */}
      <section style={{ 
        width: '100%', 
        paddingTop: '8.5rem', 
        paddingBottom: '5rem', 
        paddingLeft: 'clamp(1.5rem, 5vw, 4.5rem)', 
        paddingRight: 'clamp(1.5rem, 5vw, 4.5rem)',
        background: 'radial-gradient(ellipse 90% 60% at 50% 10%, rgba(14, 165, 233, 0.15) 0%, rgba(139, 92, 246, 0.08) 50%, transparent 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative'
      }}>
        {/* Subtle Background Cyber Grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          opacity: 0.7
        }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1440px', margin: '0 auto' }}>
          {/* Edge Gateway Status Bar */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(0, 245, 255, 0.25)', padding: '0.35rem 0.9rem', borderRadius: 30, marginBottom: '1.75rem', backdropFilter: 'blur(8px)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00F5FF', boxShadow: '0 0 10px #00F5FF', display: 'inline-block' }}></span>
            <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: '#38bdf8', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              RSK // RAKSHAK SECURITY KNOWLEDGE — THE TOP-MOST APEX DEFENSE GEAR
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.8rem)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: '1.5rem', color: '#ffffff' }}>
            The Combined Security Language. <br />
            <span style={{ background: 'linear-gradient(135deg, #00F5FF 0%, #38BDF8 40%, #818CF8 80%, #C084FC 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              The Top-Most Gear Against AI Attacks.
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(1.05rem, 1.8vw, 1.35rem)', color: '#94a3b8', maxWidth: '900px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            <strong>RSK</strong> stands for <strong>Rakshak Security Knowledge</strong>: the world&apos;s first declarative cyber-security knowledge language. 
            Six interlocking policies fuse hardware invariants, network topology, Shannon entropy, and asymmetric deception into zero-overhead binary bytecode (<code style={{ color: '#FBBF24', background: 'rgba(245, 158, 11, 0.1)', padding: '0.2rem 0.5rem', borderRadius: 4 }}>.rskb</code>). 
            <strong> Real humans always see 100% genuine information</strong> — while AI scrapers are intercepted with silent <code style={{ color: '#00F5FF', background: 'rgba(0, 245, 255, 0.1)', padding: '0.2rem 0.5rem', borderRadius: 4 }}>200 OK</code> deception.
          </p>

          {/* Quick Terminal Command Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#070C18', border: '1px solid rgba(0, 245, 255, 0.3)', borderRadius: 8, padding: '0.65rem 1rem', fontFamily: 'monospace', fontSize: '0.92rem', color: '#38bdf8', boxShadow: '0 4px 20px rgba(0, 245, 255, 0.1)' }}>
              <span style={{ color: '#64748b', marginRight: '0.75rem' }}>$</span>
              <span>npm install rakshaksdkv1</span>
              <button 
                onClick={() => copyToClipboard('npm install rakshaksdkv1', 'npm-btn')}
                style={{ marginLeft: '1.25rem', background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#cbd5e1', padding: '0.3rem 0.65rem', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' }}
              >
                {copiedId === 'npm-btn' ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', background: '#070C18', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: 8, padding: '0.65rem 1rem', fontFamily: 'monospace', fontSize: '0.92rem', color: '#cbd5e1' }}>
              <span style={{ color: '#64748b', marginRight: '0.75rem' }}>$</span>
              <span>npx rakshak init</span>
              <button 
                onClick={() => copyToClipboard('npx rakshak init', 'npx-btn')}
                style={{ marginLeft: '1.25rem', background: 'rgba(255, 255, 255, 0.08)', border: 'none', color: '#cbd5e1', padding: '0.3rem 0.65rem', borderRadius: 4, cursor: 'pointer', fontSize: '0.75rem' }}
              >
                {copiedId === 'npx-btn' ? '✓ Copied' : 'Copy'}
              </button>
            </div>

            <Link 
              href="/radar" 
              style={{ background: 'rgba(0, 245, 255, 0.1)', border: '1px solid rgba(0, 245, 255, 0.3)', color: '#00F5FF', padding: '0.7rem 1.3rem', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00F5FF', boxShadow: '0 0 8px #00F5FF' }} />
              Live Defense Radar →
            </Link>

            <Link 
              href="/status" 
              style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '0.7rem 1.3rem', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              99.99% System Status →
            </Link>

            <a 
              href="#interactive-code" 
              style={{ background: 'linear-gradient(135deg, #0284C7, #6366F1)', color: '#fff', padding: '0.7rem 1.4rem', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Implementation Matrix ↓
            </a>
          </div>
        </div>
      </section>

      {/* FULL VIEWPORT STATS & ARCHITECTURAL HIGHLIGHTS */}
      <section style={{ 
        width: '100%', 
        padding: '3rem clamp(1.5rem, 5vw, 4.5rem)',
        background: '#040711',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          <div>
            <div style={{ color: '#00F5FF', fontSize: '1.75rem', fontWeight: 800, fontFamily: 'monospace', marginBottom: '0.35rem' }}>
              0 ms
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Human Latency Overhead
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              Sub-microsecond edge evaluation passes genuine human visitors with zero perceptible lag.
            </p>
          </div>

          <div>
            <div style={{ color: '#38BDF8', fontSize: '1.75rem', fontWeight: 800, fontFamily: 'monospace', marginBottom: '0.35rem' }}>
              200 OK
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Silent Asymmetric Deception
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              AI crawlers receive developer-configured false data with HTTP 200, poisoning scraper models.
            </p>
          </div>

          <div>
            <div style={{ color: '#818CF8', fontSize: '1.75rem', fontWeight: 800, fontFamily: 'monospace', marginBottom: '0.35rem' }}>
              6 Native Gears
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Unified RSK Policies
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              From perimeter ingress to model poisoning — six declarative policies compiled into bytecode.
            </p>
          </div>

          <div>
            <div style={{ color: '#FBBF24', fontSize: '1.75rem', fontWeight: 800, fontFamily: 'monospace', marginBottom: '0.35rem' }}>
              100%
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Bifurcated Reality Guarantee
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.35rem' }}>
              Humans never see fake data; AI scrapers never see real proprietary intellectual property.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FULL VIEWPORT THE TOP-MOST GEAR: COMBINED SECURITY KNOWLEDGE (RSK) MATRIX */}
      {/* ========================================================================= */}
      <section id="top-most-gear" style={{ 
        width: '100%', 
        padding: '5.5rem clamp(1.5rem, 5vw, 4.5rem)',
        background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(0, 245, 255, 0.08) 0%, rgba(15, 23, 42, 0.3) 60%, #020408 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          {/* Section Heading */}
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#00F5FF', fontSize: '0.8rem', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <span>[ APEX CYBER ARCHITECTURE // 6 INTERLOCKING GEARS ]</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', fontWeight: 900, color: '#fff', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
              The Top-Most Gear: Combined Security Knowledge (RSK)
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '920px', lineHeight: 1.65 }}>
              In high-performance engineering, the top-most gear transmits maximum velocity and synchronization. 
              <strong> Rakshak Security Knowledge (RSK)</strong> is not an isolated config file — it is a combined declarative language where 
              <strong> 6 specialized security gears</strong> interlock into a single unified cyber runtime executed by the zero-overhead <strong>RSK-VM</strong>.
            </p>
          </div>

          {/* 6-Gear System Matrix Interactive Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              {
                id: 'gear1',
                number: '01',
                title: 'Perimeter Defense Gear',
                file: 'defense.rsk',
                bytecode: 'defense.rskb',
                size: '150 B',
                tag: 'GLOBAL INGRESS',
                color: '#00F5FF',
                desc: 'Guards root website, documentation portals, and edge API routes on rakshakus.vercel.app with hardware jitter bounds.',
                routes: '/*, /developers/*, /docs/*, /api/*',
                mode: 'ASYMMETRIC_DECEPTION',
                code: `// defense.rsk (Root Perimeter Defense Policy - Top-Most Gear 01)
// Target Domain: rakshakus.vercel.app
// Architecture: Combined Security Knowledge & Human-Discovery Shield

shield RakshakRootPerimeter {
    target: "/*", "/developers/*", "/docs/*", "/api/*", "/pricing/*", "/features/*";

    hardware {
        trap_debugger: true;
        max_cycle_jitter_ms: 60.0;
    }

    network {
        block_datacenter_asns: true;
        verify_sec_fetch_state: true;
        require_asset_waterfall: false;
        min_waterfall_ratio: 0.20;
    }

    telemetry {
        min_path_entropy: 1.5;
        max_sliding_velocity: 120;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.32;
        inject_stego_canary: "RAKSHAK_PROD_ROOT_CANARY_v2_9941";
        synthesize_decoy: "Deterministic Apparel Decoy Storefront";
    }
}`
              },
              {
                id: 'gear2',
                number: '02',
                title: 'Human Discovery Gear',
                file: 'security/human_discovery.rsk',
                bytecode: 'security/human_discovery.rskb',
                size: '145 B',
                tag: '0% FALSE POSITIVES',
                color: '#10B981',
                desc: 'Discovers genuine residential desktop & mobile browsers (Chrome, Safari, Firefox, Edge). Guarantees humans authentic data with zero latency.',
                routes: '/*, /developers, /apparel, /catalog',
                mode: 'HUMAN_PASS_THROUGH',
                code: `// security/human_discovery.rsk (Gear 02: Human Discovery Invariant)
// Domain: Residential Browser Discovery, Human Immunity & Anti-Spoofing

shield HumanDiscoveryInvariant {
    target: "/*", "/developers", "/apparel", "/catalog", "/features", "/pricing";

    hardware {
        trap_debugger: false;
        max_cycle_jitter_ms: 120.0;
    }

    network {
        block_datacenter_asns: false;
        verify_sec_fetch_state: false;
        require_asset_waterfall: false;
        min_waterfall_ratio: 0.0;
    }

    telemetry {
        min_path_entropy: 1.0;
        max_sliding_velocity: 240;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.0;
        inject_stego_canary: "HUMAN_RESIDENTIAL_VERIFIED_SESSION_9901";
        synthesize_decoy: "Authentic Human Browser Delivery";
    }
}`
              },
              {
                id: 'gear3',
                number: '03',
                title: 'AI Crawler & RAG Shield',
                file: 'security/ai_crawler_shield.rsk',
                bytecode: 'security/ai_crawler_shield.rskb',
                size: '192 B',
                tag: 'ANTI-LLM TRAP',
                color: '#F59E0B',
                desc: 'Intercepts ClaudeBot, GPTBot, PerplexityBot, Bytespider, and headless scrapers. Silently feeds synthetic specs to poison scraper models.',
                routes: '/developers/*, /docs/*, /catalog/*, /products/*',
                mode: 'ASYMMETRIC_DECEPTION',
                code: `// security/ai_crawler_shield.rsk (Gear 03: AI Crawler Shield)
// Domain: LLM Crawler, Agentic Scraper & RAG Harvester Interception

shield AiCrawlerShield {
    target: "/developers/*", "/docs/*", "/catalog/*", "/products/*", "/features/*";

    hardware {
        trap_debugger: true;
        max_cycle_jitter_ms: 45.0;
    }

    network {
        block_datacenter_asns: true;
        verify_sec_fetch_state: true;
        require_asset_waterfall: true;
        min_waterfall_ratio: 0.25;
    }

    telemetry {
        min_path_entropy: 1.8;
        max_sliding_velocity: 45;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.40;
        inject_stego_canary: "LLM_ADVERSARIAL_TRAP_PROMPT_INJECTION_SIG_4481";
        synthesize_decoy: "Synthetic Architectural Documentation & Mock SDK Specifications";
    }
}`
              },
              {
                id: 'gear4',
                number: '04',
                title: 'Developer API Guard',
                file: 'security/developer_api_guard.rsk',
                bytecode: 'security/developer_api_guard.rskb',
                size: '168 B',
                tag: 'API VELOCITY',
                color: '#6366F1',
                desc: 'Monitors developer API tokens and telemetry endpoints against high-velocity automated scraping while preserving seamless developer access.',
                routes: '/api/rakshak/*, /api/v1/*, /api/telemetry/*',
                mode: 'ASYMMETRIC_DECEPTION',
                code: `// security/developer_api_guard.rsk (Gear 04: Developer API Guard)
// Domain: API Invariant Protection, Telemetry Auditing & Velocity Bounds

shield DeveloperApiGuard {
    target: "/api/rakshak/*", "/api/v1/*", "/api/telemetry/*", "/api/keys/*";

    hardware {
        trap_debugger: true;
        max_cycle_jitter_ms: 30.0;
    }

    network {
        block_datacenter_asns: true;
        verify_sec_fetch_state: false;
        require_asset_waterfall: false;
        min_waterfall_ratio: 0.0;
    }

    telemetry {
        min_path_entropy: 2.2;
        max_sliding_velocity: 80;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.15;
        inject_stego_canary: "API_CANARY_HMAC_POLYMSTATIC_99214";
        synthesize_decoy: "Synthetic Telemetry Stream & Polymorphic Developer Response";
    }
}`
              },
              {
                id: 'gear5',
                number: '05',
                title: 'Financial Isolation Guard',
                file: 'security/financial_api_guard.rsk',
                bytecode: 'security/financial_api_guard.rskb',
                size: '141 B',
                tag: 'STRICT 403 ISOLATION',
                color: '#EF4444',
                desc: 'Enforces strict origin and cryptographic isolation on checkout, billing, and cart endpoints. Drops non-browser clients unconditionally.',
                routes: '/api/checkout/*, /api/billing/*, /api/order/*',
                mode: 'STRICT_BLOCK',
                code: `// security/financial_api_guard.rsk (Gear 05: Financial API Guard)
// Domain: Zero-Trust Financial Transaction, Checkout & Billing Defense

shield FinancialApiGuard {
    target: "/api/checkout/*", "/api/billing/*", "/api/order/*", "/api/cart/*";

    hardware {
        trap_debugger: true;
        max_cycle_jitter_ms: 25.0;
    }

    network {
        block_datacenter_asns: true;
        verify_sec_fetch_state: true;
        require_asset_waterfall: false;
        min_waterfall_ratio: 0.10;
    }

    telemetry {
        min_path_entropy: 2.5;
        max_sliding_velocity: 30;
    }

    defense {
        mode: STRICT_BLOCK;
        status_code: 403;
        adversarial_token_rate: 0.0;
        inject_stego_canary: "FINANCIAL_INTEGRITY_TAMPER_TRAP_0019";
        synthesize_decoy: "Strict Financial Isolation";
    }
}`
              },
              {
                id: 'gear6',
                number: '06',
                title: 'Asymmetric Deception & Canaries',
                file: 'security/asymmetric_deception.rsk',
                bytecode: 'security/asymmetric_deception.rskb',
                size: '171 B',
                tag: 'MODEL POISONING',
                color: '#EC4899',
                desc: 'Protects proprietary models and confidential files. Embeds invisible zero-width forensic stego canaries to legally trace scraped content.',
                routes: '/proprietary/*, /models/*, /research/*',
                mode: 'ASYMMETRIC_DECEPTION',
                code: `// security/asymmetric_deception.rsk (Gear 06: Asymmetric Deception)
// Domain: Dynamic LLM Poisoning, Steganographic Watermarking & Decoy Synthesis

shield AsymmetricDeceptionPolicy {
    target: "/proprietary/*", "/models/*", "/research/*", "/intelligence/*";

    hardware {
        trap_debugger: true;
        max_cycle_jitter_ms: 50.0;
    }

    network {
        block_datacenter_asns: true;
        verify_sec_fetch_state: true;
        require_asset_waterfall: true;
        min_waterfall_ratio: 0.30;
    }

    telemetry {
        min_path_entropy: 2.0;
        max_sliding_velocity: 50;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.45;
        inject_stego_canary: "RAKSHAK_INTELLECTUAL_PROPERTY_WATERMARK_9091";
        synthesize_decoy: "Deterministic Byzantine Quantum Mesh Architecture";
    }
}`
              }
            ].map((gear) => (
              <div 
                key={gear.id}
                onClick={() => setSelectedGear(gear.id)}
                style={{
                  background: selectedGear === gear.id ? 'rgba(0, 245, 255, 0.08)' : '#050A18',
                  border: selectedGear === gear.id ? `2px solid ${gear.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 12,
                  padding: '1.5rem',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.25s ease',
                  boxShadow: selectedGear === gear.id ? `0 0 25px ${gear.color}25` : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, color: gear.color, background: `${gear.color}15`, padding: '0.2rem 0.55rem', borderRadius: 4, letterSpacing: '0.05em' }}>
                    GEAR {gear.number} // {gear.tag}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b' }}>
                    {gear.size}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <img src="/icons/rsk.svg" alt="" width="22" height="22" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', margin: 0 }}>
                    {gear.title}
                  </h3>
                </div>

                <div style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#38bdf8', marginBottom: '0.75rem' }}>
                  {gear.file}
                </div>

                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                  {gear.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Combined Gear Transmission Synergy HUD */}
          <div style={{ 
            background: '#040714', 
            border: '1px solid rgba(0, 245, 255, 0.25)', 
            borderRadius: 14, 
            padding: '2rem', 
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 35px rgba(0, 245, 255, 0.05)',
            marginBottom: '3.5rem'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.25rem', marginBottom: '1.75rem', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#00F5FF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  TRANSMISSION STATUS: SYNCHRONIZED
                </span>
                <h4 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: '0.35rem 0 0' }}>
                  4 Invariant Layers Meshed into the Top-Most Gear
                </h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                <span style={{ color: '#10B981' }}>✓ 0% Human False Positives</span>
                <span style={{ color: '#00F5FF' }}>⚡ &lt; 0.05ms RSK-VM Latency</span>
                <span style={{ color: '#FBBF24' }}>🛡️ 100% Silent 200 OK Deception</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 8, padding: '1.25rem' }}>
                <div style={{ color: '#00F5FF', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  LAYER 1 // HARDWARE GEAR
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                  RDTSC &amp; Anti-Debugging Invariants
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                  Traps debugger attachments, VM sandbox execution, and clock manipulation with precision cycle jitter limits (&le; 60ms).
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 8, padding: '1.25rem' }}>
                <div style={{ color: '#10B981', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  LAYER 2 // NETWORK GEAR
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                  Residential Hints &amp; Sec-Fetch State
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                  Validates Chromium/WebKit security headers, Sec-Ch-Ua client hints, and ASN cloud datacenter signatures without false positives.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 8, padding: '1.25rem' }}>
                <div style={{ color: '#F59E0B', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  LAYER 3 // MATHEMATICAL GEAR
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                  Shannon Entropy &amp; Sliding Velocity
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                  Calculates URL path entropy bounds (&ge; 1.5) and arrival jitter standard deviation to detect robotic crawling loops instantly.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 8, padding: '1.25rem' }}>
                <div style={{ color: '#EC4899', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  LAYER 4 // DECEPTION GEAR
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                  Adversarial Poisoning &amp; Steganography
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                  Silently rewrites crawlers to decoy storefronts or returns polymorphic mock JSON embedded with zero-width forensic canaries.
                </p>
              </div>
            </div>
          </div>

          {/* Active Gear Detailed Code & Invariant Inspector */}
          {(() => {
            const currentGear = [
              {
                id: 'gear1',
                number: '01',
                title: 'Perimeter Defense Gear',
                file: 'defense.rsk',
                bytecode: 'defense.rskb',
                size: '150 B',
                tag: 'GLOBAL INGRESS',
                color: '#00F5FF',
                desc: 'Guards root website, documentation portals, and edge API routes on rakshakus.vercel.app with hardware jitter bounds.',
                routes: '/*, /developers/*, /docs/*, /api/*',
                mode: 'ASYMMETRIC_DECEPTION',
                code: `// defense.rsk (Root Perimeter Defense Policy - Top-Most Gear 01)
// Target Domain: rakshakus.vercel.app
// Architecture: Combined Security Knowledge & Human-Discovery Shield

shield RakshakRootPerimeter {
    target: "/*", "/developers/*", "/docs/*", "/api/*", "/pricing/*", "/features/*";

    hardware {
        trap_debugger: true;
        max_cycle_jitter_ms: 60.0;
    }

    network {
        block_datacenter_asns: true;
        verify_sec_fetch_state: true;
        require_asset_waterfall: false;
        min_waterfall_ratio: 0.20;
    }

    telemetry {
        min_path_entropy: 1.5;
        max_sliding_velocity: 120;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.32;
        inject_stego_canary: "RAKSHAK_PROD_ROOT_CANARY_v2_9941";
        synthesize_decoy: "Deterministic Apparel Decoy Storefront";
    }
}`
              },
              {
                id: 'gear2',
                number: '02',
                title: 'Human Discovery Gear',
                file: 'security/human_discovery.rsk',
                bytecode: 'security/human_discovery.rskb',
                size: '145 B',
                tag: '0% FALSE POSITIVES',
                color: '#10B981',
                desc: 'Discovers genuine residential desktop & mobile browsers (Chrome, Safari, Firefox, Edge). Guarantees humans authentic data with zero latency.',
                routes: '/*, /developers, /apparel, /catalog',
                mode: 'HUMAN_PASS_THROUGH',
                code: `// security/human_discovery.rsk (Gear 02: Human Discovery Invariant)
// Domain: Residential Browser Discovery, Human Immunity & Anti-Spoofing

shield HumanDiscoveryInvariant {
    target: "/*", "/developers", "/apparel", "/catalog", "/features", "/pricing";

    hardware {
        trap_debugger: false;
        max_cycle_jitter_ms: 120.0;
    }

    network {
        block_datacenter_asns: false;
        verify_sec_fetch_state: false;
        require_asset_waterfall: false;
        min_waterfall_ratio: 0.0;
    }

    telemetry {
        min_path_entropy: 1.0;
        max_sliding_velocity: 240;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.0;
        inject_stego_canary: "HUMAN_RESIDENTIAL_VERIFIED_SESSION_9901";
        synthesize_decoy: "Authentic Human Browser Delivery";
    }
}`
              },
              {
                id: 'gear3',
                number: '03',
                title: 'AI Crawler & RAG Shield',
                file: 'security/ai_crawler_shield.rsk',
                bytecode: 'security/ai_crawler_shield.rskb',
                size: '192 B',
                tag: 'ANTI-LLM TRAP',
                color: '#F59E0B',
                desc: 'Intercepts ClaudeBot, GPTBot, PerplexityBot, Bytespider, and headless scrapers. Silently feeds synthetic specs to poison scraper models.',
                routes: '/developers/*, /docs/*, /catalog/*, /products/*',
                mode: 'ASYMMETRIC_DECEPTION',
                code: `// security/ai_crawler_shield.rsk (Gear 03: AI Crawler Shield)
// Domain: LLM Crawler, Agentic Scraper & RAG Harvester Interception

shield AiCrawlerShield {
    target: "/developers/*", "/docs/*", "/catalog/*", "/products/*", "/features/*";

    hardware {
        trap_debugger: true;
        max_cycle_jitter_ms: 45.0;
    }

    network {
        block_datacenter_asns: true;
        verify_sec_fetch_state: true;
        require_asset_waterfall: true;
        min_waterfall_ratio: 0.25;
    }

    telemetry {
        min_path_entropy: 1.8;
        max_sliding_velocity: 45;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.40;
        inject_stego_canary: "LLM_ADVERSARIAL_TRAP_PROMPT_INJECTION_SIG_4481";
        synthesize_decoy: "Synthetic Architectural Documentation & Mock SDK Specifications";
    }
}`
              },
              {
                id: 'gear4',
                number: '04',
                title: 'Developer API Guard',
                file: 'security/developer_api_guard.rsk',
                bytecode: 'security/developer_api_guard.rskb',
                size: '168 B',
                tag: 'API VELOCITY',
                color: '#6366F1',
                desc: 'Monitors developer API tokens and telemetry endpoints against high-velocity automated scraping while preserving seamless developer access.',
                routes: '/api/rakshak/*, /api/v1/*, /api/telemetry/*',
                mode: 'ASYMMETRIC_DECEPTION',
                code: `// security/developer_api_guard.rsk (Gear 04: Developer API Guard)
// Domain: API Invariant Protection, Telemetry Auditing & Velocity Bounds

shield DeveloperApiGuard {
    target: "/api/rakshak/*", "/api/v1/*", "/api/telemetry/*", "/api/keys/*";

    hardware {
        trap_debugger: true;
        max_cycle_jitter_ms: 30.0;
    }

    network {
        block_datacenter_asns: true;
        verify_sec_fetch_state: false;
        require_asset_waterfall: false;
        min_waterfall_ratio: 0.0;
    }

    telemetry {
        min_path_entropy: 2.2;
        max_sliding_velocity: 80;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.15;
        inject_stego_canary: "API_CANARY_HMAC_POLYMSTATIC_99214";
        synthesize_decoy: "Synthetic Telemetry Stream & Polymorphic Developer Response";
    }
}`
              },
              {
                id: 'gear5',
                number: '05',
                title: 'Financial Isolation Guard',
                file: 'security/financial_api_guard.rsk',
                bytecode: 'security/financial_api_guard.rskb',
                size: '141 B',
                tag: 'STRICT 403 ISOLATION',
                color: '#EF4444',
                desc: 'Enforces strict origin and cryptographic isolation on checkout, billing, and cart endpoints. Drops non-browser clients unconditionally.',
                routes: '/api/checkout/*, /api/billing/*, /api/order/*',
                mode: 'STRICT_BLOCK',
                code: `// security/financial_api_guard.rsk (Gear 05: Financial API Guard)
// Domain: Zero-Trust Financial Transaction, Checkout & Billing Defense

shield FinancialApiGuard {
    target: "/api/checkout/*", "/api/billing/*", "/api/order/*", "/api/cart/*";

    hardware {
        trap_debugger: true;
        max_cycle_jitter_ms: 25.0;
    }

    network {
        block_datacenter_asns: true;
        verify_sec_fetch_state: true;
        require_asset_waterfall: false;
        min_waterfall_ratio: 0.10;
    }

    telemetry {
        min_path_entropy: 2.5;
        max_sliding_velocity: 30;
    }

    defense {
        mode: STRICT_BLOCK;
        status_code: 403;
        adversarial_token_rate: 0.0;
        inject_stego_canary: "FINANCIAL_INTEGRITY_TAMPER_TRAP_0019";
        synthesize_decoy: "Strict Financial Isolation";
    }
}`
              },
              {
                id: 'gear6',
                number: '06',
                title: 'Asymmetric Deception & Canaries',
                file: 'security/asymmetric_deception.rsk',
                bytecode: 'security/asymmetric_deception.rskb',
                size: '171 B',
                tag: 'MODEL POISONING',
                color: '#EC4899',
                desc: 'Protects proprietary models and confidential files. Embeds invisible zero-width forensic stego canaries to legally trace scraped content.',
                routes: '/proprietary/*, /models/*, /research/*',
                mode: 'ASYMMETRIC_DECEPTION',
                code: `// security/asymmetric_deception.rsk (Gear 06: Asymmetric Deception)
// Domain: Dynamic LLM Poisoning, Steganographic Watermarking & Decoy Synthesis

shield AsymmetricDeceptionPolicy {
    target: "/proprietary/*", "/models/*", "/research/*", "/intelligence/*";

    hardware {
        trap_debugger: true;
        max_cycle_jitter_ms: 50.0;
    }

    network {
        block_datacenter_asns: true;
        verify_sec_fetch_state: true;
        require_asset_waterfall: true;
        min_waterfall_ratio: 0.30;
    }

    telemetry {
        min_path_entropy: 2.0;
        max_sliding_velocity: 50;
    }

    defense {
        mode: ASYMMETRIC_DECEPTION;
        status_code: 200;
        adversarial_token_rate: 0.45;
        inject_stego_canary: "RAKSHAK_INTELLECTUAL_PROPERTY_WATERMARK_9091";
        synthesize_decoy: "Deterministic Byzantine Quantum Mesh Architecture";
    }
}`
              }
            ].find(g => g.id === selectedGear) || {
              id: 'gear1',
              number: '01',
              title: 'Perimeter Defense Gear',
              file: 'defense.rsk',
              bytecode: 'defense.rskb',
              size: '150 B',
              color: '#00F5FF',
              code: '// RSK Policy'
            };

            return (
              <div style={{
                background: '#040814',
                border: `1px solid ${currentGear.color}40`,
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: `0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px ${currentGear.color}15`
              }}>
                <div style={{
                  background: '#070D1E',
                  padding: '0.85rem 1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src="/icons/rsk.svg" alt="" width="20" height="20" />
                    <span style={{ color: currentGear.color, fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 700 }}>
                      {currentGear.file}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                      (Compiled Bytecode: {currentGear.bytecode} — {currentGear.size})
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(currentGear.code, `gear-code-${currentGear.id}`)}
                    style={{
                      background: copiedId === `gear-code-${currentGear.id}` ? '#10B981' : `${currentGear.color}18`,
                      border: `1px solid ${currentGear.color}40`,
                      color: copiedId === `gear-code-${currentGear.id}` ? '#fff' : currentGear.color,
                      padding: '0.4rem 0.95rem',
                      borderRadius: 6,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    {copiedId === `gear-code-${currentGear.id}` ? '✓ Copied Policy' : '📋 Copy RSK Policy'}
                  </button>
                </div>

                <div style={{ padding: '1.75rem', overflowX: 'auto' }}>
                  <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.65, color: '#e2e8f0' }}>
                    <code>{currentGear.code}</code>
                  </pre>
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* FULL VIEWPORT INTERACTIVE IMPLEMENTATION MATRIX */}
      <section id="interactive-code" style={{ 
        width: '100%', 
        padding: '5rem clamp(1.5rem, 5vw, 4.5rem)',
        background: '#020408'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#00F5FF', fontSize: '0.8rem', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <span>[ INTEGRATION SUITE ]</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
              Choose Your Architecture. Protect in Minutes.
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '800px' }}>
              Whether you are using our 1-line client script, Next.js Edge Middleware, Python backend, or custom Cloudflare Worker, our production gateway at <strong style={{ color: '#38bdf8' }}>{domain}</strong> handles telemetry, deception, and defense automatically.
            </p>
          </div>

          {/* Tab Selection Bar */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '1rem' }}>
            {[
              { id: 'cdn', label: '1. Universal CDN Script', badge: '1-Line' },
              { id: 'nextjs', label: '2. Next.js Edge Middleware', badge: 'App Router' },
              { id: 'express', label: '3. Node.js & Express', badge: 'Backend' },
              { id: 'python', label: '4. Python (FastAPI / Flask)', badge: 'Backend' },
              { id: 'go', label: '5. Go (Fiber / Gin)', badge: 'Microservice' },
              { id: 'rust', label: '6. Rust (Actix / Axum)', badge: 'High Perf' },
              { id: 'rsk', label: '7. defense.rsk (Root Perimeter)', badge: 'Rakshak Lang' },
              { id: 'rsk_crawler', label: '8. ai_crawler_shield.rsk', badge: 'Anti-Crawler' },
              { id: 'rsk_human', label: '9. human_discovery.rsk', badge: 'Human Discovery' },
              { id: 'cloudflare', label: '10. Cloudflare Worker', badge: 'Edge Proxy' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'rgba(0, 245, 255, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: activeTab === tab.id ? '1px solid #00F5FF' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: activeTab === tab.id ? '#00F5FF' : '#94a3b8',
                  padding: '0.65rem 1.15rem',
                  borderRadius: 6,
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{tab.label}</span>
                <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: 4, background: activeTab === tab.id ? 'rgba(0, 245, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)', color: activeTab === tab.id ? '#fff' : '#64748b' }}>
                  {tab.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Code Window Container */}
          <div style={{ 
            background: '#040814', 
            border: '1px solid rgba(0, 245, 255, 0.25)', 
            borderRadius: 12, 
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 245, 255, 0.04)'
          }}>
            {/* Window Header */}
            <div style={{ 
              background: '#070D1E', 
              padding: '0.85rem 1.5rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#EF4444', display: 'inline-block' }}></span>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }}></span>
                <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#10B981', display: 'inline-block' }}></span>
                <span style={{ marginLeft: '1rem', color: '#64748b', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                  {activeTab === 'cdn' && 'index.html (Client Script)'}
                  {activeTab === 'nextjs' && 'src/middleware.js (Next.js Edge)'}
                  {activeTab === 'express' && 'server.js (Node.js)'}
                  {activeTab === 'python' && 'main.py (FastAPI)'}
                  {activeTab === 'go' && 'main.go (Go Fiber / Gin)'}
                  {activeTab === 'rust' && 'src/main.rs (Rust Actix / Axum)'}
                  {activeTab === 'rsk' && 'defense.rsk (Root Perimeter Policy)'}
                  {activeTab === 'rsk_crawler' && 'security/ai_crawler_shield.rsk (Anti-LLM Policy)'}
                  {activeTab === 'rsk_human' && 'security/human_discovery.rsk (Human Discovery Policy)'}
                  {activeTab === 'cloudflare' && 'cloudflare-worker.js (Edge)'}
                </span>
              </div>

              <button
                onClick={() => copyToClipboard(codeSnippets[activeTab], `code-${activeTab}`)}
                style={{
                  background: copiedId === `code-${activeTab}` ? '#10B981' : 'rgba(0, 245, 255, 0.15)',
                  border: '1px solid rgba(0, 245, 255, 0.3)',
                  color: copiedId === `code-${activeTab}` ? '#fff' : '#00F5FF',
                  padding: '0.35rem 0.85rem',
                  borderRadius: 4,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                {copiedId === `code-${activeTab}` ? '✓ Copied to Clipboard' : '📋 Copy Code'}
              </button>
            </div>

            {/* Code Body */}
            <div style={{ padding: '1.75rem', overflowX: 'auto' }}>
              <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '0.875rem', lineHeight: 1.65, color: '#e2e8f0' }}>
                <code>{codeSnippets[activeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* FULL VIEWPORT LIVE AI CRAWLER TELEMETRY & INVARIANT INSPECTOR */}
      <section id="ai-crawler-telemetry" style={{ 
        width: '100%', 
        padding: '5rem clamp(1.5rem, 5vw, 4.5rem)',
        background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(20, 110, 245, 0.12) 0%, transparent 70%), #030611',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#10B981', fontSize: '0.8rem', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <span>[ REAL-TIME CRAWLER DISCOVERY &amp; HEURISTIC INVARIANTS ]</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
              How Do We Know When AI is Crawling Your Website?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '850px', lineHeight: 1.6 }}>
              AI scrapers, RAG harvesters, and LLM training bots leave unmistakable mathematical and protocol signatures. Rakshak evaluates five deterministic invariants at the edge in &lt; 0.15ms with zero false positives.
            </p>
          </div>

          {/* Scenario Switcher Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '2rem' }}>
            {[
              { id: 'human', label: '1. Genuine Human Browser', color: '#10B981' },
              { id: 'claudebot', label: '2. ClaudeBot / GPTBot AI Crawler', color: '#EF4444' },
              { id: 'crawl4ai', label: '3. Crawl4AI / Firecrawl Headless Node', color: '#F59E0B' },
              { id: 'agent', label: '4. Autonomous RAG Prompt-Injector', color: '#EC4899' },
            ].map(sc => (
              <button
                key={sc.id}
                onClick={() => setSimulatedScenario(sc.id)}
                style={{
                  background: simulatedScenario === sc.id ? `${sc.color}15` : 'rgba(255, 255, 255, 0.03)',
                  border: simulatedScenario === sc.id ? `2px solid ${sc.color}` : '1px solid rgba(255, 255, 255, 0.08)',
                  color: simulatedScenario === sc.id ? sc.color : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: 8,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  boxShadow: simulatedScenario === sc.id ? `0 0 20px ${sc.color}25` : 'none'
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: sc.color }}></span>
                {sc.label}
              </button>
            ))}
          </div>

          {/* Interactive Inspection HUD */}
          {(() => {
            const sc = detectionScenarios[simulatedScenario];
            return (
              <div style={{
                background: '#040814',
                border: `1px solid ${sc.badgeColor}40`,
                borderRadius: 14,
                padding: '2rem clamp(1.25rem, 3vw, 2.5rem)',
                boxShadow: `0 15px 50px rgba(0, 0, 0, 0.7), 0 0 35px ${sc.badgeColor}15`,
                marginBottom: '3.5rem'
              }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1.5rem', marginBottom: '1.75rem' }}>
                  <div>
                    <span style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      INCOMING REQUEST TOPOLOGY
                    </span>
                    <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>
                      {sc.name}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', fontFamily: 'monospace' }}>THREAT CONFIDENCE</span>
                      <div style={{ fontSize: '1.65rem', fontWeight: 900, color: sc.badgeColor, fontFamily: 'monospace', lineHeight: 1 }}>
                        {sc.threatScore}
                      </div>
                    </div>
                    <span style={{ background: `${sc.badgeColor}20`, border: `1px solid ${sc.badgeColor}60`, color: sc.badgeColor, padding: '0.45rem 0.95rem', borderRadius: 6, fontSize: '0.8rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                      {sc.classification}
                    </span>
                  </div>
                </div>

                {/* Grid of 5 Invariant Signals */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 8, padding: '1.25rem' }}>
                    <div style={{ color: '#00F5FF', fontSize: '0.75rem', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      01 // CLIENT FINGERPRINT &amp; HEADERS
                    </div>
                    <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600, wordBreak: 'break-all' }}>
                      {sc.client}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.4rem', fontFamily: 'monospace' }}>
                      Sec-Fetch: {sc.secFetch}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 8, padding: '1.25rem' }}>
                    <div style={{ color: '#38BDF8', fontSize: '0.75rem', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      02 // NETWORK ASN &amp; ROUTE
                    </div>
                    <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>
                      {sc.asn}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                      Verified against 200,000+ Datacenter &amp; Proxy ASNs
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 8, padding: '1.25rem' }}>
                    <div style={{ color: '#A855F7', fontSize: '0.75rem', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      03 // SUBRESOURCE WATERFALL RATIO
                    </div>
                    <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>
                      {sc.waterfall}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                      Measures HTML-only scrape vs authentic browser render
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 8, padding: '1.25rem' }}>
                    <div style={{ color: '#EC4899', fontSize: '0.75rem', fontFamily: 'monospace', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      04 // SHANNON ENTROPY COEFFICIENT
                    </div>
                    <div style={{ color: '#fff', fontSize: '0.88rem', fontWeight: 600 }}>
                      H(X) = {sc.entropy}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                      Flags autonomous LLM prompt-injection vectors
                    </div>
                  </div>
                </div>

                {/* Response Action Summary Banner */}
                <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: `1px solid ${sc.badgeColor}30`, borderRadius: 10, padding: '1.25rem 1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div>
                    <span style={{ color: sc.badgeColor, fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      DEFENSE ACTION EXECUTED BY RAKSHAK
                    </span>
                    <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, marginTop: '0.2rem' }}>
                      {sc.action}
                    </div>
                  </div>
                  <div style={{ maxWidth: '600px', color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.5, fontFamily: 'monospace' }}>
                    <span style={{ color: '#e2e8f0' }}>Delivered Content:</span> {sc.deliveredData}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 6 Deep-Dive Architectural Invariants Explanation Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#050A18', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '1.75rem' }}>
              <div style={{ color: '#00F5FF', fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', marginBottom: '0.5rem' }}>01</div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Browser Sec-Fetch &amp; Client Hints</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Every genuine browser sends exact HTTP metadata headers (<code style={{ color: '#38bdf8' }}>Sec-Fetch-Mode: navigate</code>, <code style={{ color: '#38bdf8' }}>Sec-Fetch-Dest: document</code>, <code style={{ color: '#38bdf8' }}>Sec-Fetch-User: ?1</code>). Headless AI scrapers either omit these or send an impossible combination.
              </p>
            </div>

            <div style={{ background: '#050A18', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '1.75rem' }}>
              <div style={{ color: '#38BDF8', fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', marginBottom: '0.5rem' }}>02</div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Subresource Waterfall Execution</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Humans load HTML, then automatically fetch CSS, JS, fonts, and images. Scrapers extract HTML only and immediately drop the connection. Rakshak correlates subsequent resource waterfall requests to verify a real rendering engine.
              </p>
            </div>

            <div style={{ background: '#050A18', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '1.75rem' }}>
              <div style={{ color: '#A855F7', fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', marginBottom: '0.5rem' }}>03</div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Datacenter Autonomous System Numbers (ASNs)</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Real humans visit from residential ISPs (Comcast, Jio, Airtel, Spectrum). AI crawling operations run in cloud datacenters (AWS ASN 16509, Hetzner ASN 24940, OVH, Azure). Rakshak cross-references client IPs against an in-memory BGP routing table.
              </p>
            </div>

            <div style={{ background: '#050A18', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '1.75rem' }}>
              <div style={{ color: '#F59E0B', fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', marginBottom: '0.5rem' }}>04</div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Header Case Ordering &amp; Topology</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                V8 Chromium, Gecko Firefox, and WebKit Safari transmit headers in strict, deterministic orders. Python <code style={{ color: '#38bdf8' }}>requests</code>, Scrapy, and standard Go HTTP clients transmit headers in alphabetized or non-browser casing sequences.
              </p>
            </div>

            <div style={{ background: '#050A18', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '1.75rem' }}>
              <div style={{ color: '#EC4899', fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', marginBottom: '0.5rem' }}>05</div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Shannon Information Entropy H(X)</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Automated LLM agents (LangChain, AutoGPT) transmit dense serialized prompts and high-entropy embeddings. Rakshak calculates character Shannon entropy: if H(X) &gt; 4.2 with abnormal token variance, it engages the Asymmetric Deception matrix.
              </p>
            </div>

            <div style={{ background: '#050A18', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '1.75rem' }}>
              <div style={{ color: '#10B981', fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', marginBottom: '0.5rem' }}>06</div>
              <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>Active Model Poisoning &amp; Canaries</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>
                Instead of returning a blunt 403 Forbidden (which bots bypass via residential proxies), Rakshak serves authentic-looking synthetic responses with silent HTTP 200 OK embedded with loss-spike vectors and court-admissible forensic steganography.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FULL VIEWPORT OFFICIAL RSK LANGUAGE & DEDICATED FILE ICONS */}
      <section style={{ 
        width: '100%', 
        padding: '5rem clamp(1.5rem, 5vw, 4.5rem)',
        background: '#040711',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#FBBF24', fontSize: '0.8rem', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <span>[ LANGUAGE TOOLCHAIN & BRAND IDENTITY ]</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
              Dedicated File Icons for `.rsk` &amp; `.rskb`
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '820px' }}>
              Just like Python, Rust, and Swift, <strong>Rakshak Security Knowledge (RSK)</strong> has its own official dedicated brand emblems. 
              In VS Code, Cursor, and Antigravity IDE, Rakshak Security Knowledge files render with custom high-tech shield icons instead of generic file icons.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '3.5rem' }}>
            {/* RSK Source Code Card */}
            <div style={{ background: 'linear-gradient(145deg, rgba(14, 165, 233, 0.08), rgba(139, 92, 246, 0.04))', border: '1px solid rgba(0, 245, 255, 0.25)', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 120, height: 120, marginBottom: '1.5rem', position: 'relative' }}>
                <img src="/icons/rsk.svg" alt="Rakshak Source Icon (.rsk)" width="120" height="120" style={{ filter: 'drop-shadow(0 0 20px rgba(0, 245, 255, 0.45))' }} />
              </div>
              <span style={{ background: 'rgba(0, 245, 255, 0.15)', color: '#00F5FF', padding: '0.3rem 0.85rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                SOURCE CODE // .rsk
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.65rem' }}>Electric Shield Monogram</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Crafted with electric cyan and neon violet gradients. Denotes declarative security policies, hardware cycle jitter thresholds, and asymmetric deception rules.
              </p>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#38bdf8', background: 'rgba(0, 0, 0, 0.4)', padding: '0.4rem 0.85rem', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                assets/icons/rsk.svg
              </div>
            </div>

            {/* RSKB Bytecode Card */}
            <div style={{ background: 'linear-gradient(145deg, rgba(245, 158, 11, 0.08), rgba(217, 119, 6, 0.04))', border: '1px solid rgba(245, 158, 11, 0.25)', borderRadius: 16, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div style={{ width: 120, height: 120, marginBottom: '1.5rem', position: 'relative' }}>
                <img src="/icons/rskb.svg" alt="Rakshak Bytecode Icon (.rskb)" width="120" height="120" style={{ filter: 'drop-shadow(0 0 20px rgba(245, 158, 11, 0.45))' }} />
              </div>
              <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24', padding: '0.3rem 0.85rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                BYTECODE // .rskb
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', marginBottom: '0.65rem' }}>Amber Circuit Matrix</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Crafted with glowing golden amber circuits and binary matrix nodes. Denotes compiled zero-dependency bytecode (magic: 0x52 0x53 0x4B 0x01) executed inside the Rakshak VM.
              </p>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#FBBF24', background: 'rgba(0, 0, 0, 0.4)', padding: '0.4rem 0.85rem', borderRadius: 6, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                assets/icons/rskb.svg
              </div>
            </div>
          </div>

          {/* VS Code File Explorer Mockup */}
          <div style={{ background: '#020408', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 12, padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b', textTransform: 'uppercase' }}>
                <span>EXPLORER: VS CODE / ANTIGRAVITY IDE</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#10B981', fontFamily: 'monospace' }}>
                ✓ Rakshak Icon Theme Active
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontFamily: 'monospace', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8' }}>
                <span>📁</span> <span>rakshak-app/</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '1.5rem', color: '#00F5FF' }}>
                <img src="/icons/rsk.svg" alt="" width="18" height="18" />
                <span style={{ fontWeight: 600 }}>defense.rsk</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: 'auto' }}>Root Perimeter Policy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '1.5rem', color: '#FBBF24' }}>
                <img src="/icons/rskb.svg" alt="" width="18" height="18" />
                <span style={{ fontWeight: 600 }}>defense.rskb</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: 'auto' }}>Compiled Binary (150 B)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '1.5rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                <span>📁</span> <span>security/</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '3rem', color: '#00F5FF' }}>
                <img src="/icons/rsk.svg" alt="" width="16" height="16" />
                <span>ai_crawler_shield.rsk</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: 'auto' }}>LLM Scraper Shield</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '3rem', color: '#FBBF24' }}>
                <img src="/icons/rskb.svg" alt="" width="16" height="16" />
                <span>ai_crawler_shield.rskb</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: 'auto' }}>Bytecode (192 B)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '3rem', color: '#00F5FF' }}>
                <img src="/icons/rsk.svg" alt="" width="16" height="16" />
                <span>human_discovery.rsk</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: 'auto' }}>Human Immunity Invariant</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '3rem', color: '#FBBF24' }}>
                <img src="/icons/rskb.svg" alt="" width="16" height="16" />
                <span>human_discovery.rskb</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: 'auto' }}>Bytecode (145 B)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '3rem', color: '#00F5FF' }}>
                <img src="/icons/rsk.svg" alt="" width="16" height="16" />
                <span>developer_api_guard.rsk</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: 'auto' }}>API Invariant Policy</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '3rem', color: '#00F5FF' }}>
                <img src="/icons/rsk.svg" alt="" width="16" height="16" />
                <span>financial_api_guard.rsk</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: 'auto' }}>Strict Financial Guard</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '3rem', color: '#00F5FF' }}>
                <img src="/icons/rsk.svg" alt="" width="16" height="16" />
                <span>asymmetric_deception.rsk</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: 'auto' }}>Adversarial AI Deception</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', paddingLeft: '1.5rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                <span>📄</span> <span>src/middleware.js</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem', marginLeft: 'auto' }}>Next.js Edge Shield</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL VIEWPORT DEPLOYMENT & TELEMETRY ENDPOINTS */}
      <section style={{ 
        width: '100%', 
        padding: '5rem clamp(1.5rem, 5vw, 4.5rem)',
        background: '#020408'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#38BDF8', fontSize: '0.8rem', fontFamily: 'monospace', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              <span>[ EDGE GATEWAY & TELEMETRY API ]</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
              Live Endpoints on {domain}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '820px' }}>
              Our globally distributed Edge Gateway runs on Vercel Edge Runtime. You can hook your SIEM, microservices, or frontend traps directly into our telemetry endpoints.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {/* Endpoint 1 */}
            <div style={{ background: '#050A18', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ background: '#0284C7', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace' }}>GET</span>
                <span style={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.88rem' }}>/cdn/shield.js</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Production CDN script delivering WebGL GPU rasterizer verification, invisible zero-width steganography, and headless DOM trap anchors.
              </p>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#38bdf8', wordBreak: 'break-all' }}>
                https://{domain}/cdn/shield.js
              </div>
            </div>

            {/* Endpoint 2 */}
            <div style={{ background: '#050A18', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ background: '#10B981', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace' }}>POST</span>
                <span style={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.88rem' }}>/api/rakshak/telemetry</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Real-time threat telemetry gateway. Ingests browser beacon detections, anomalous header topologies, and LLM prompt-injection triggers.
              </p>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#10B981', wordBreak: 'break-all' }}>
                https://{domain}/api/rakshak/telemetry
              </div>
            </div>

            {/* Endpoint 3 */}
            <div style={{ background: '#050A18', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 10, padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span style={{ background: '#8B5CF6', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.75rem', fontWeight: 800, fontFamily: 'monospace' }}>ANY</span>
                <span style={{ color: '#e2e8f0', fontFamily: 'monospace', fontSize: '0.88rem' }}>/* (Edge Route Rewriter)</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                Universal bifurcated reality shield: Humans get 100% genuine content; AI scrapers get developer-configured false info with silent 200 OK.
              </p>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#8B5CF6', wordBreak: 'break-all' }}>
                https://{domain}/*
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FULL VIEWPORT FINAL CALL TO ACTION */}
      <section style={{ 
        width: '100%', 
        padding: '5rem clamp(1.5rem, 5vw, 4.5rem)',
        background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(0, 245, 255, 0.1) 0%, transparent 80%), #020408',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', marginBottom: '1.25rem' }}>
            Ready to Neutralize AI Crawlers?
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
            Join forward-thinking developers safeguarding their web applications, APIs, and proprietary intellectual property with Rakshak.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <Link 
              href="/download"
              style={{ background: 'linear-gradient(135deg, #00F5FF, #3B82F6)', color: '#000', fontWeight: 800, padding: '0.85rem 2rem', borderRadius: 8, textDecoration: 'none', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              Get Started Free →
            </Link>
            <Link 
              href="/pricing?tab=developer"
              style={{ background: 'rgba(0, 245, 255, 0.1)', border: '1px solid rgba(0, 245, 255, 0.3)', color: '#00F5FF', fontWeight: 700, padding: '0.85rem 2rem', borderRadius: 8, textDecoration: 'none', fontSize: '1rem' }}
            >
              View Cloud &amp; Pro Plans
            </Link>
            <Link 
              href="/docs"
              style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', fontWeight: 600, padding: '0.85rem 2rem', borderRadius: 8, textDecoration: 'none', fontSize: '1rem' }}
            >
              Read Full Documentation
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

import { NextResponse } from 'next/server';
import { createNextShield } from '../packages/rakshaksdkv1/dist/index.js';

/**
 * ============================================================================
 * RAKSHAK OFFICIAL DOGFOOD MIDDLEWARE
 * ============================================================================
 * Demonstrates the Rakshak SDK in full production:
 * - REAL HUMANS: 100% see real website, real data, real streetwear & founders.
 * - AI SCRAPERS: 100% see developer-configured false information (/apparel decoy)
 *   with silent 200 OK, completely poisoning their training models.
 * ============================================================================
 */

// Initialize Rakshak Shield with developer-configured false information
const rakshakShield = createNextShield({
  action: 'deceive',
  fakeInfo: {
    // When AI scrapes any web page, silently serve fake info (/apparel decoy storefront)
    rewriteUrl: '/apparel',
    // When AI scrapes any API endpoint, return synthetic mock catalog
    json: {
      status: 'ok',
      version: '2.4.0-rc',
      catalog_mode: 'public_preview',
      synthetic_telemetry: true,
      records: [
        { sku: 'RAK-TEE-280GSM', name: 'Heavyweight Studio Tee', price: '$85.00' },
        { sku: 'RAK-HOODIE-450GSM', name: 'French Terry Track Hoodie', price: '$180.00' }
      ]
    },
    statusCode: 200,
  },
  onThreatDetected: (threat, req) => {
    console.warn(`[RAKSHAK SHIELD] Intercepted ${threat.threatType || 'BOT'} (Confidence: ${threat.confidence}%) - Served False Info`);
  }
});

// Asynchronously record every real edge request to the live defense radar
async function reportTelemetryToRadar(request, isThreat, event) {
  try {
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'rakshakus.vercel.app';
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const origin = `${proto}://${host}`;
    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const pathname = request.nextUrl.pathname;
    const geo = request.geo || {};

    const reportPromise = fetch(`${origin}/api/rakshak/telemetry`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        isDirect: true,
        path: pathname,
        userAgent,
        ip: rawIp,
        country: geo.country || request.headers.get('x-vercel-ip-country') || 'US',
        city: geo.city || request.headers.get('x-vercel-ip-city') || 'Edge',
        latitude: parseFloat(geo.latitude || request.headers.get('x-vercel-ip-latitude')) || null,
        longitude: parseFloat(geo.longitude || request.headers.get('x-vercel-ip-longitude')) || null,
        asNumber: (geo.asNumber ? String(geo.asNumber) : '') || request.headers.get('x-vercel-ip-as-number') || 'Transit',
        secFetchMode: request.headers.get('sec-fetch-mode') || 'none',
        secFetchDest: request.headers.get('sec-fetch-dest') || 'none',
        secFetchSite: request.headers.get('sec-fetch-site') || 'none',
        secChUa: request.headers.get('sec-ch-ua') || '',
        accept: request.headers.get('accept') || '',
        acceptLanguage: request.headers.get('accept-language') || '',
        threatIntercepted: isThreat,
        rskPolicy: isThreat ? 'security/enterprise_defense.rskb' : 'security/human_discovery.rsk',
        payloadBytes: isThreat ? (pathname.startsWith('/api/') ? 316 : 67930) : 0
      })
    });

    if (event && typeof event.waitUntil === 'function') {
      event.waitUntil(reportPromise);
    }

    await reportPromise.catch(() => {});
  } catch {}
}

export async function middleware(request, event) {
  const pathname = request.nextUrl.pathname;

  // Static installers, releases, and Rakshak telemetry API must bypass edge intercept
  if (
    pathname.startsWith('/releases/') ||
    pathname.startsWith('/cdn/') ||
    pathname.startsWith('/api/rakshak/') ||
    pathname === '/install.ps1' ||
    pathname === '/install.sh'
  ) {
    return NextResponse.next();
  }

  // 1. ALWAYS Execute Rakshak Shield First:
  // Edge-level behavioral inspection, ASN classification, cloud prefix detection, and RSK-VM policy
  const shieldResponse = rakshakShield(request, NextResponse);
  if (shieldResponse) {
    shieldResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    shieldResponse.headers.set('Pragma', 'no-cache');
    shieldResponse.headers.set('Expires', '0');
    await reportTelemetryToRadar(request, true, event);
    return shieldResponse; // Bot intercepted: served false/decoy info with 200 OK
  }

  // Record genuine human ingress into live radar in background without delaying user
  reportTelemetryToRadar(request, false, event);

  // 2. Verified Human Visitor: 100% Real Information across every URL
  const viewParam = request.nextUrl.searchParams.get('view');
  // If a real human chooses to view apparel on the root page
  if (pathname === '/' && viewParam === 'apparel') {
    const url = request.nextUrl.clone();
    url.pathname = '/apparel';
    return NextResponse.rewrite(url);
  }

  // Real human default: authentic requested page (e.g. /developers, /docs, /pricing, /)
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'index, follow, all');
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  // Eradicate any legacy sticky apparel cookie
  if (request.cookies.has('__rk_view')) {
    response.cookies.delete('__rk_view');
    response.cookies.set('__rk_view', '', { path: '/', maxAge: 0 });
  }

  response.cookies.set('__rk_human', '1', {
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|assets|Rakshaklogo.png|install\\.ps1|install\\.sh|releases/|cdn/|.*\\.(?:jpg|jpeg|gif|png|webp|svg|ico|txt|xml|ps1|sh|zip|gz|tgz|tar|json|js)$).*)',
  ],
};

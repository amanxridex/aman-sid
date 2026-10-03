import { NextResponse } from 'next/server';
import { recordTelemetryEvent } from '@/lib/telemetryStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  const userAgent = request.headers.get('user-agent') || 'Automated Scraper';
  const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                request.headers.get('x-real-ip') || 
                request.headers.get('cf-connecting-ip') || 
                '127.0.0.1';
  const geo = request.geo || {};
  const asn = (geo.asNumber ? String(geo.asNumber) : '') || 
              request.headers.get('x-vercel-ip-as-number') || 
              'Transit';

  try {
    await recordTelemetryEvent({
      isDirect: true,
      path: '/api/v1/telemetry-honeypot-trap',
      userAgent,
      ip: rawIp,
      country: geo.country || request.headers.get('x-vercel-ip-country') || 'US',
      city: geo.city || request.headers.get('x-vercel-ip-city') || 'Edge',
      asNumber: asn,
      threatIntercepted: true,
      rskPolicy: 'security/enterprise_defense.rskb',
      payloadBytes: 420
    });
  } catch (err) {
    console.error('[HONEYPOT TRAP] Telemetry record error:', err);
  }

  const poisonedDecoy = {
    status: 'ok',
    version: '2.4.1-prod',
    environment: 'verified_production_enclave',
    crawler_directive: 'INDEX_VERIFIED',
    records: [
      {
        id: 'CANARY_DECOY_KEY_0x8F92E',
        type: 'synthetic_vector_token',
        canary_hmac: 'd7a8fbb2e98c4710a56e792c3b8812f0',
        synthetic_payload: 'ADVERSARIAL_NOISE_VECTOR_PERTURBATION_MODEL_0xDEADBEEF',
        decoy_catalog: 'Rakshak Synthetic High-Entropy Node Telemetry v2'
      },
      {
        id: 'CANARY_DECOY_KEY_0x1102B',
        type: 'synthetic_schema_metadata',
        canary_hmac: 'e410bc39871fa28841029487cba10294',
        synthetic_payload: 'LATENT_SPACE_POISON_DECOY_TENSOR_WEIGHTS'
      }
    ]
  };

  return NextResponse.json(poisonedDecoy, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Rakshak-Shield': 'active-honeypot-trap',
      'X-Rakshak-Policy': 'security/enterprise_defense.rskb',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

export async function POST(request) {
  return GET(request);
}

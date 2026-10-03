import { telemetryStore } from '../../../../lib/telemetryStore.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || body.userAgent || 'Unknown User-Agent';

    const disputeEvent = await telemetryStore.recordDispute({
      ip: rawIp,
      userAgent,
      email: body.email || 'anonymous-human@dispute.local',
      eventId: body.eventId || `REQ_${Date.now()}`,
      reason: body.reason || 'Genuine human consumer claiming false positive classification',
      route: body.route || '/docs',
      asn: request.headers.get('x-vercel-ip-as-number') || body.asn || 'AS-Consumer',
      country: request.headers.get('x-vercel-ip-country') || 'US',
      city: request.headers.get('x-vercel-ip-city') || 'Edge'
    });

    const currentStats = telemetryStore.getStats();

    return Response.json({
      status: 'DISPUTE_REGISTERED',
      disputeId: disputeEvent.id,
      timestamp: disputeEvent.timestamp,
      recalibratedMetrics: {
        zeroFalsePositiveGuarantee: currentStats.zeroFalsePositiveGuarantee,
        falsePositiveDisputes: currentStats.falsePositiveDisputes,
        humansPassed: currentStats.humanPassRatio
      },
      message: 'Dispute recorded into edge telemetry. False positive metrics updated dynamically.'
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

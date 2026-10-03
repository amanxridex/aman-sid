import telemetryStore from '../../../../lib/telemetryStore.js';

export async function GET(request) {
  const referer = request.headers.get('referer') || '';
  const secFetchDest = request.headers.get('sec-fetch-dest') || '';
  const isDashboardPoll = referer.includes('/radar') || referer.includes('/status') || (secFetchDest === 'empty' && !request.nextUrl?.searchParams?.has('probe'));

  await telemetryStore.syncFromGlobalStore();

  const callerEvent = isDashboardPoll ? null : await telemetryStore.recordRequest(request, { path: '/api/rakshak/telemetry' });
  const liveEvents = telemetryStore.getEvents();
  const metrics = telemetryStore.getStats();

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'rakshakus.vercel.app';

  return Response.json({
    status: 'OPERATIONAL',
    domain: host,
    engine: 'Rakshak Security Knowledge VM (v1.0.0)',
    protocol: 'RSK-ZERO-TRUST-V1',
    serverTime: new Date().toISOString(),
    metrics,
    currentCaller: callerEvent,
    liveFeed: liveEvents,
    bufferCount: liveEvents.length
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

export async function POST(request) {
  try {
    const payload = await request.json().catch(() => ({}));
    if (payload.isDirect) {
      const directEvent = await telemetryStore.recordDirect(payload);
      return Response.json({ status: 'REPORTED', id: directEvent.id });
    }

    const customUa = payload.userAgent || request.headers.get('user-agent') || 'Unspecified Client';
    const customAsn = payload.asNumber || request.headers.get('x-vercel-ip-as-number') || '';
    const customSecChUa = payload.secChUa || request.headers.get('sec-ch-ua') || '';
    const targetRoute = payload.targetRoute || payload.path || '/developers';

    const recordedEvent = await telemetryStore.recordRequest(request, {
      path: targetRoute,
      userAgent: customUa,
      asNumber: customAsn,
      secChUa: customSecChUa,
      isProbe: true,
      simulatedBot: payload.probeType === 'NON_HUMAN_PROBE'
    });

    return Response.json({
      status: 'PROBE_RECORDED',
      telemetryId: recordedEvent.id,
      timestamp: recordedEvent.timestamp,
      event: recordedEvent,
      evaluation: {
        threatScore: recordedEvent.threatScore,
        decision: recordedEvent.action,
        policyApplied: recordedEvent.rskPolicy,
        latencyMs: recordedEvent.decisionTimeMs,
        company: recordedEvent.company,
        botName: recordedEvent.companyBotName
      }
    });
  } catch (err) {
    return Response.json({ status: 'error', message: err.message }, { status: 400 });
  }
}

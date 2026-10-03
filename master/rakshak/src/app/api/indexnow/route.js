import { NextResponse } from 'next/server';

export async function GET(request) {
  const host = request?.headers?.get('x-forwarded-host') || request?.headers?.get('host') || 'rakshakus.vercel.app';
  const key = '8f4b29c1d3e84570a2b8e3f94671c0d5';
  const keyLocation = `https://${host}/${key}.txt`;

  const urlList = [
    `https://${host}/`,
    `https://${host}/why-rakshak`,
    `https://${host}/developers`,
    `https://${host}/pricing`,
    `https://${host}/radar`,
    `https://${host}/download`,
    `https://${host}/status`,
    `https://${host}/features`,
    `https://${host}/docs`,
    `https://${host}/founders`,
    `https://${host}/privacy`,
    `https://${host}/terms`,
    `https://${host}/license-policy`,
    `https://${host}/zero-telemetry`,
    `https://${host}/security-policy`,
    `https://${host}/audit`,
  ];

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        host,
        key,
        keyLocation,
        urlList,
      }),
    });

    const status = res.status;
    return NextResponse.json({
      success: status === 200 || status === 202,
      statusCode: status,
      submittedUrls: urlList.length,
      message: status === 200 || status === 202
        ? 'IndexNow submitted successfully to Bing & search engines.'
        : `IndexNow responded with status ${status}`,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

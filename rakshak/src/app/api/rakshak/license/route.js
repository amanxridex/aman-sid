import { generateLicenseKey, verifyLicenseKey, generateInvoice } from '../../../../lib/licenseEngine.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return Response.json({ error: 'Missing license key parameter (?key=...)' }, { status: 400 });
  }

  const result = verifyLicenseKey(key);
  return Response.json(result);
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      tier = 'pro-shield',
      email = 'developer@rakshak.local',
      company = 'Independent Engineer',
      domain = 'localhost',
      taxId = '',
      billingCycle = 'annual'
    } = body;

    const license = generateLicenseKey(tier, email);
    const invoice = generateInvoice({ tier, email, company, domain, taxId, billingCycle });

    return Response.json({
      success: true,
      licenseKey: license.licenseKey,
      invoiceId: invoice.invoiceNumber,
      invoice,
      tier: license.tier,
      tierName: license.tierName,
      customer: email,
      company,
      domain,
      issuedAt: license.issuedAt,
      expiresAt: license.expiresAt,
      signature: license.signatureHex,
      status: 'PROVISIONED_ACTIVE'
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      }
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

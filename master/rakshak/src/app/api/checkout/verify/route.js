import { stripe } from '../../../../lib/stripe.js';
import { generateLicenseKey } from '../../../../lib/licenseEngine.js';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return Response.json({ error: 'Missing session_id query parameter.' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return Response.json({ error: 'Checkout session not found on Stripe.' }, { status: 404 });
    }

    const planSlug = session.metadata?.planSlug || 'sentinel';
    const durationDays = parseInt(session.metadata?.durationDays || '365', 10);
    const customerEmail =
      session.customer_details?.email || session.customer_email || 'customer@rakshak.local';
    const customerName = session.customer_details?.name || 'Rakshak Customer';

    // Generate authenticated cryptographic license
    const license = generateLicenseKey(planSlug, customerEmail, durationDays);

    return Response.json({
      success: true,
      verified: true,
      paymentStatus: session.payment_status,
      currency: session.currency,
      amountTotal: session.amount_total,
      customer: {
        email: customerEmail,
        name: customerName,
      },
      plan: {
        slug: planSlug,
        name: session.metadata?.planName || license.tierName,
        durationDays,
      },
      license: {
        licenseKey: license.licenseKey,
        tier: license.tier,
        tierName: license.tierName,
        issuedAt: license.issuedAt,
        expiresAt: license.expiresAt,
        signatureHex: license.signatureHex,
        singleDeviceEnforced: true,
      },
      cliActivationCommand: `npx rakshak activate ${license.licenseKey}`,
      exeActivationCommand: `RakshakShield.exe activate ${license.licenseKey}`,
    });
  } catch (err) {
    console.error('Stripe session verification error:', err);
    return Response.json(
      { error: err.message || 'Failed to verify Stripe checkout session.' },
      { status: 500 }
    );
  }
}

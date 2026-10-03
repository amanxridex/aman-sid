import { stripe } from '../../../lib/stripe.js';
import { TIER_LIMITS } from '../../../lib/licenseEngine.js';

export const dynamic = 'force-dynamic';

const PLAN_PRICES = {
  sentinel: {
    name: 'Rakshak Sentinel Workstation (Lifetime Single-PC)',
    amountCents: 1900,
    durationDays: 3650, // 10 years / lifetime single-PC
  },
  aegis: {
    name: 'Rakshak Aegis Pro Shield (6 Months)',
    amountCents: 9900,
    durationDays: 180,
  },
  citadel: {
    name: 'Rakshak Citadel Sovereign Matrix (Annual Enclave)',
    amountCents: 14900,
    durationDays: 365,
  },
  'sdk-starter': {
    name: 'Rakshak SDK Starter API Guard',
    amountCents: 2900,
    durationDays: 30,
  },
  'sdk-pro': {
    name: 'Rakshak SDK Pro Matrix (1 Production Server Node)',
    amountCents: 14900,
    durationDays: 365,
  },
  'sdk-enterprise': {
    name: 'Rakshak SDK Enterprise Scale Fleet',
    amountCents: 19900,
    durationDays: 365,
  }
};

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { plan: planSlug = 'sentinel', email = '' } = body;

    const planInfo = PLAN_PRICES[planSlug] || PLAN_PRICES['sentinel'];
    const tierMeta = TIER_LIMITS[planSlug] || TIER_LIMITS['sentinel'];

    const origin =
      request.headers.get('origin') ||
      request.headers.get('referer')?.split('/').slice(0, 3).join('/') ||
      'https://rakshakus.vercel.app';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planInfo.name,
              description: tierMeta.description || 'Zero-Trust Local Anti-AI Shield License',
              images: ['https://rakshakus.vercel.app/rakshaklogo.png'],
            },
            unit_amount: planInfo.amountCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email ? email.trim() : undefined,
      metadata: {
        planSlug,
        planName: planInfo.name,
        durationDays: planInfo.durationDays.toString(),
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    return Response.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error('Stripe Checkout session creation error:', err);
    return Response.json(
      { error: err.message || 'Failed to initialize Stripe checkout session.' },
      { status: 500 }
    );
  }
}

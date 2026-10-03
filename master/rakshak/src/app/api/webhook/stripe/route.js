import { stripe } from '../../../../lib/stripe.js';
import { generateLicenseKey } from '../../../../lib/licenseEngine.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const rawBody = await request.text();
    const sig = request.headers.get('stripe-signature');

    let event;

    // If webhook secret is configured, verify signature; otherwise parse JSON in test mode
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      } catch (err) {
        console.error('⚠️ Stripe Webhook signature verification failed:', err.message);
        return new Response(`Webhook Error: ${err.message}`, { status: 400 });
      }
    } else {
      event = JSON.parse(rawBody);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const planSlug = session.metadata?.planSlug || 'sentinel';
      const durationDays = parseInt(session.metadata?.durationDays || '365', 10);
      const customerEmail =
        session.customer_details?.email || session.customer_email || 'customer@rakshak.local';

      // Generate signed cryptographic license
      const license = generateLicenseKey(planSlug, customerEmail, durationDays);
      console.log(`✓ Provisioned license for ${customerEmail}: ${license.licenseKey}`);
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook processing error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

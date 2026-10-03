import Stripe from 'stripe';

const STRIPE_SECRET_KEY =
  process.env.STRIPE_SECRET_KEY || '';

export const stripe = new Stripe(STRIPE_SECRET_KEY || 'dummy_key', {
  apiVersion: '2023-10-16',
});

export const STRIPE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

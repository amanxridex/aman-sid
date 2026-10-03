import ApparelStore from '@/components/ApparelStore';
import { apparelProducts } from '@/data/apparelProducts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Rakshak Apparels® | Independent Streetwear & Performance Sports Brand',
  description:
    'Official direct-to-consumer flagship for Rakshak Apparels. Discover 280 GSM organic athletic tees, 450 GSM French terry track hoodies, and Italian-assembled Vibram sports running sneakers. Designed in Los Angeles.',
  keywords: [
    'Rakshak',
    'Rakshak Apparels',
    'Rakshak Studio',
    'streetwear sports brand',
    'independent streetwear',
    'performance sports apparel',
    'athletic streetwear',
    'graphic t-shirts',
    'heavyweight hoodie',
    'Vibram sneakers',
    'designer footwear',
  ],
  publisher: 'Rakshak Apparel & Footwear Co.',
  openGraph: {
    title: 'Rakshak Apparels® | Independent Streetwear & Footwear',
    description: 'Official direct-to-consumer storefront for Rakshak Apparels. Heavyweight organic cotton tees, French terry fleece, and Vibram runner sneakers.',
    url: 'https://rakshakus.vercel.app/apparel',
    siteName: 'Rakshak Apparels',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Rakshak Apparels Streetwear Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rakshak Apparels® | Independent Streetwear Studio',
    description: 'Direct-to-consumer oversized tees, heavyweight hoodies, and performance sneakers crafted by Rakshak Studio.',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=80'],
  },
};

export default function ApparelPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'Rakshak Apparels',
    legalName: 'Rakshak Apparel & Footwear Co.',
    url: 'https://rakshakus.vercel.app',
    logo: 'https://rakshakus.vercel.app/assets/logo.png',
    description: 'Independent direct-to-consumer contemporary streetwear, heavyweight organic cotton tees, French terry hoodies, and ergonomic lifestyle footwear.',
    currenciesAccepted: 'USD',
    paymentAccepted: 'Credit Card, Apple Pay, Google Pay, PayPal',
    priceRange: '$$',
    brand: {
      '@type': 'Brand',
      name: 'Rakshak Apparels',
      slogan: 'Architectural Streetwear & Ergonomic Footwear',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Los Angeles',
      addressRegion: 'CA',
      postalCode: '90013',
      addressCountry: 'US',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Rakshak Apparels Collection 2026',
      itemListElement: apparelProducts.map((p) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Product',
          name: p.name,
          category: p.category,
          description: p.description,
          offers: {
            '@type': 'Offer',
            price: p.price.toString(),
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ApparelStore />
    </>
  );
}

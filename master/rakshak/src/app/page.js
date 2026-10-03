import ShieldView from '@/components/ShieldView';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Rakshak — Sovereign Counter-AI Defense Shield | Built by Anonymous Engineers',
  description:
    'Rakshak is an independent sovereign counter-AI shield built by three anonymous engineers to safeguard user data from global AI attacks, commercial LLM scraping, and desktop recall indexers. 100% local, 0 bytes cloud telemetry.',
  openGraph: {
    title: 'Rakshak — Sovereign Counter-AI Defense Shield',
    description:
      'Zero-Trust Local Anti-AI Shield Software & Universal Developer SDK. Defending workstations, APIs, and intellectual property worldwide.',
    url: 'https://rakshakus.vercel.app',
    siteName: 'Rakshak Sovereign Defense',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rakshak — Sovereign Counter-AI Defense Shield',
    description:
      'Zero-Trust Local Anti-AI Shield Software & Universal Developer SDK. Defending workstations, APIs, and intellectual property worldwide.',
  },
};

export default function Home() {
  const securitySchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Rakshak Sovereign Counter-AI Shield',
    applicationCategory: 'SecurityApplication',
    operatingSystem: 'Windows 10, Windows 11, macOS Sequoia, Linux',
    description:
      'Zero-Trust local workstation counter-AI firewall and Ring 0 driver stopping unauthorized background AI processes, desktop recall tools, and scrapers from indexing user files.',
    offers: {
      '@type': 'Offer',
      price: '19.00',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Organization',
      name: 'Rakshak Sovereign Defense',
      url: 'https://rakshakus.vercel.app',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(securitySchema) }}
      />
      <ShieldView />
    </>
  );
}




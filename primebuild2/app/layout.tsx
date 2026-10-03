import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollRevealManager from '@/components/ScrollRevealManager';

export const metadata: Metadata = {
  metadataBase: new URL('https://primebuilds.playstax.xyz'),
  title: {
    default: 'PRIME BUILDS LONDON | Residential Extensions, Lofts & Renovations',
    template: '%s | PRIME BUILDS LONDON'
  },
  description: 'Prime Builds London is a high-specification residential builder delivering kitchen extensions, architectural loft conversions, and home renovations under fixed-price JCT contracts.',
  keywords: ['London home extensions', 'loft conversions London', 'kitchen extension Wandsworth', 'residential builder Ealing', 'fixed-price JCT contract builder', 'Prime Builds London'],
  authors: [{ name: 'Prime Builds London' }],
  creator: 'Prime Builds London',
  publisher: 'Prime Builds London',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
      { url: '/logo.png', sizes: '1024x973', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://primebuilds.playstax.xyz',
    siteName: 'Prime Builds London',
    title: 'PRIME BUILDS LONDON | Residential Extensions, Lofts & Renovations',
    description: 'Specialising in home extensions, loft conversions, and architectural renovations across London with fixed-price contract certainty.',
    images: [
      {
        url: 'https://primebuilds.playstax.xyz/og-image.jpg',
        secureUrl: 'https://primebuilds.playstax.xyz/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Prime Builds London — Modern Home Extensions & Renovations',
        type: 'image/jpeg'
      },
      {
        url: 'https://primebuilds.playstax.xyz/images/projects_unique/proj_1.jpg',
        secureUrl: 'https://primebuilds.playstax.xyz/images/projects_unique/proj_1.jpg',
        width: 2560,
        height: 1709,
        alt: 'Real London Kitchen Extension with Architectural Glazing',
        type: 'image/jpeg'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PRIME BUILDS LONDON | Residential Extensions, Lofts & Renovations',
    description: 'Specialising in home extensions, loft conversions, and architectural renovations across London with fixed-price contract certainty.',
    images: ['https://primebuilds.playstax.xyz/og-image.jpg']
  },
  alternates: {
    canonical: 'https://primebuilds.playstax.xyz'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: '#ffffff'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="body">
        <ScrollRevealManager />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

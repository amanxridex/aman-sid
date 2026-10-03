import './globals.css';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata = {
  metadataBase: new URL('https://rakshakus.vercel.app'),
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
  authors: [{ name: 'Rakshak Apparel & Footwear Co.' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Rakshak Apparels® | Independent Streetwear & Footwear',
    description:
      'Official direct-to-consumer storefront for Rakshak Apparels. Heavyweight organic cotton tees, French terry fleece, and Vibram runner sneakers.',
    url: 'https://rakshakus.vercel.app',
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
    description:
      'Direct-to-consumer oversized tees, heavyweight hoodies, and performance sneakers crafted by Rakshak Studio.',
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&auto=format&fit=crop&q=80'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <link rel="icon" href="/assets/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/assets/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <ScrollToTop />
        {children}
      </body>
    </html>
  );
}

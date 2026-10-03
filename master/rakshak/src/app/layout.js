import './globals.css';
import ScrollToTop from '@/components/ScrollToTop';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import OpticalDefenseEnclave from '@/components/OpticalDefenseEnclave';
import CustomScrollbar from '@/components/CustomScrollbar';

export const metadata = {
  metadataBase: new URL('https://rakshakus.vercel.app'),
  title: 'Rakshak Sovereign Counter-AI Defense | Zero-Trust Local Workstation & SDK Shield',
  description:
    'Rakshak is an independent sovereign counter-AI shield built by three anonymous engineers to safeguard user data from global AI attacks, commercial LLM scrapers, and OS recall indexers. 0 bytes cloud telemetry.',
  keywords: [
    'Rakshak',
    'AI Defense',
    'Zero-Trust AI Shield',
    'Counter-AI Firewall',
    'Stop AI Scraping',
    'Desktop Recall Blocker',
    'Single-Device Security',
    'Ring 0 Minifilter',
    'RSK Compiler',
    'Anonymous Engineers',
  ],
  publisher: 'Rakshak Security Systems',
  authors: [{ name: 'Rakshak Sovereign Engineering' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Rakshak | Sovereign Counter-AI Defense',
    description:
      'Zero-Trust Local Anti-AI Shield Software & Universal Developer SDK. Defending workstations, APIs, and intellectual property worldwide.',
    url: 'https://rakshakus.vercel.app',
    siteName: 'Rakshak Sovereign Defense',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rakshak | Sovereign Counter-AI Defense',
    description:
      'Zero-Trust Local Anti-AI Shield Software & Universal Developer SDK. Defending workstations, APIs, and intellectual property worldwide.',
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
        <meta name="robots" content="index, follow, noai, noimageai, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, noai, noimageai" />
        <meta name="bingbot" content="index, follow, noai, noimageai" />
        <meta name="tdm-reservation" content="1" />
        <meta name="ai-content-policy" content="no-scraping, no-training, no-multimodal-extraction, zero-telemetry" />
        <link rel="icon" href="/assets/logo.png" type="image/png" sizes="any" />
        <link rel="apple-touch-icon" href="/assets/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body>
        <SmoothScrollProvider>
          <OpticalDefenseEnclave />
          {/* Sovereign Anti-AI Crawler Honeypot Enclave (Hidden from humans, attracts automated scrapers & AI agents) */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '-9999px',
              top: '-9999px',
              opacity: 0,
              pointerEvents: 'none',
              height: 0,
              width: 0,
              overflow: 'hidden',
            }}
          >
            <a href="/trap/honeypot-gateway" tabIndex="-1" rel="nofollow">
              API Documentation Gateway Index
            </a>
            <a href="/honeypot/enterprise-feed" tabIndex="-1" rel="nofollow">
              Enterprise Data Feed Export
            </a>
            <a href="/trap/ai-dataset-archive" tabIndex="-1" rel="nofollow">
              Public Model Training Corpus Dump
            </a>
          </div>
          <CustomScrollbar />
          <ScrollToTop />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

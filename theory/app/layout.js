import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { StoreProvider } from "@/context/StoreContext";
import LayoutWrapper from "@/components/LayoutWrapper";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://thecozytheory.playstax.xyz"),
  title: {
    default: "THE COZY THEORY — Stay Cozy, Stay You",
    template: "%s | THE COZY THEORY",
  },
  description:
    "Stay cozy, stay you. The Cozy Theory crafts artisanal homeware, handcrafted everyday ceramics, tableware, and pure washed cotton linen for spaces that celebrate texture, warmth, and individuality.",
  applicationName: "THE COZY THEORY",
  authors: [{ name: "The Cozy Theory" }],
  creator: "The Cozy Theory",
  publisher: "THE COZY THEORY",
  keywords: [
    "The Cozy Theory",
    "Stay Cozy Stay You",
    "Artisanal Ceramics",
    "Handcrafted Tableware",
    "Stoneware Ceramics",
    "Home Linen",
    "Pure Cotton Bedsheets",
    "Sculptural Vases",
    "Warm Living",
    "Artisanal Homeware India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://thecozytheory.playstax.xyz",
    siteName: "THE COZY THEORY",
    title: "THE COZY THEORY — Stay Cozy, Stay You",
    description:
      "Stay cozy, stay you. Handcrafted everyday ceramics, stoneware tableware, sculptural vessels, and washed cotton bedding. Elevated living objects for deliberate rituals.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "THE COZY THEORY — Stay Cozy, Stay You",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "THE COZY THEORY — Stay Cozy, Stay You",
    description:
      "Stay cozy, stay you. Handcrafted everyday ceramics, stoneware tableware, sculptural vessels, and washed cotton bedding.",
    images: ["/og-image.jpg"],
    creator: "@thecozytheory",
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='46' fill='%23001540'/></svg>",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fffdf8",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* OpenGraph & Social Sharing Meta Tags */}
        <meta property="og:title" content="THE COZY THEORY — Stay Cozy, Stay You" />
        <meta
          property="og:description"
          content="Stay cozy, stay you. Handcrafted everyday ceramics, stoneware tableware, sculptural vessels, and washed cotton bedding. Elevated living objects for deliberate rituals."
        />
        <meta property="og:url" content="https://thecozytheory.playstax.xyz" />
        <meta property="og:image" content="https://thecozytheory.playstax.xyz/og-image.jpg" />
        <meta property="og:image:secure_url" content="https://thecozytheory.playstax.xyz/og-image.jpg" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="THE COZY THEORY" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="THE COZY THEORY — Stay Cozy, Stay You" />
        <meta
          name="twitter:description"
          content="Stay cozy, stay you. Handcrafted everyday ceramics, stoneware tableware, sculptural vessels, and washed cotton bedding."
        />
        <meta name="twitter:image" content="https://thecozytheory.playstax.xyz/og-image.jpg" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#fffdf8] text-[#121212]">
        <StoreProvider>
          <AnalyticsTracker />
          <CartProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

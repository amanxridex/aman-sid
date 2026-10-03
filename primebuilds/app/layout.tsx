import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CrazyFooter from "@/components/CrazyFooter";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Prime Builds | London Architectural Construction",
  description: "Bespoke residential extensions, loft conversions, and luxury refurbishments across London. Engineered with precision.",
  keywords: "London construction, luxury house refurbishment London, loft conversion London, home extensions London, Prime Builds",
  authors: [{ name: "Prime Builds London" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-[#f4f7fb] text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-grow">{children}</main>
        {/* DO NOT TOUCH THE FOOTER */}
        <CrazyFooter />
      </body>
    </html>
  );
}

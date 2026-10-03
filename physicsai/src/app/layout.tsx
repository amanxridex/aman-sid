import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Divya AI",
  description: "Divya AI - Ultra-fast intelligent conversational AI",
  icons: {
    icon: "/lightning.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full bg-white text-slate-900 overflow-hidden">
        {children}
      </body>
    </html>
  );
}

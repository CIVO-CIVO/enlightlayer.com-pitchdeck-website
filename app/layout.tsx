import { Inter, JetBrains_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", axes: ["opsz"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jb-mono", display: "swap" });

const site = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3200";
const description = "Custom AI monitoring on cameras and sensors — for the places nobody watches. Europe and North America.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title: { default: "Enlight Layer — pitch deck", template: "%s · Enlight Layer" },
  description,
  // shared by link, not by search
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  openGraph: { title: "Enlight Layer", description, type: "website", images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Enlight Layer" }] },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#121211",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <head>
        <noscript>
          <style>{`.rise,.fade-in{opacity:1!important;transform:none!important}.mask-line>span,.grow-x{transform:none!important}`}</style>
        </noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}

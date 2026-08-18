import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/app/components/MotionProvider";
import { GoogleTagManager } from '@next/third-parties/google';
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/**
 * typography.csv → "Bold Statement" (Bebas Neue + Source Sans 3).
 * Body stays on Inter: it already carries the site, reads well at 16px, and
 * swapping it in would add a font download without a legibility gain.
 */
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home | Doorway Media",
  description:
    "Doorway Media — cinematic videography, drone capture, and motion design. We build moments that move.",
};

/** `viewport-meta` (HIGH) — explicit, and zoom is never disabled. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-5Q2C3528" />
      <body className={`${inter.variable} ${bebasNeue.variable} bg-bg text-fg antialiased`}>
        <a
          href="#main"
          className="glass-strong sr-only rounded-full px-5 py-3 text-sm font-semibold"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}

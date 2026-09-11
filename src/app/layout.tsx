import type { Metadata } from "next";
import {
  Bebas_Neue,
  Inter,
  Roboto,
  Space_Grotesk,
  Space_Mono,
} from "next/font/google";
import Script from "next/script";
import { PUZZLE_BOOT_SCRIPT } from "@/v2/puzzle/boot";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

// Button label font (baked into the shared shadcn Button base classes).
const roboto = Roboto({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Metagame — Nov 6-8, 2026",
  description:
    "Metagame 2026 — a convention of games, designs, and puzzles. Nov 6-8, 2026 at Lighthaven, Berkeley, California.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      // globals.css sets scroll-behavior: smooth; this tells Next so it can
      // disable it during route transitions instead of warning.
      data-scroll-behavior="smooth"
      className={`${bebasNeue.variable} ${spaceGrotesk.variable} ${inter.variable} ${spaceMono.variable} ${roboto.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Before-first-paint boot scripts. next/script beforeInteractive
            (root-layout only) injects them into the initial HTML and never
            recreates them client-side — a raw <script> in a React tree only
            runs on a full load, so client navigation into a layout would skip
            it (and React warns). */}
        {/* Saved ticket currency (localStorage is client-only, so the server
            can't know it) — keeps the tickets toggle from flashing USD→BTC. */}
        <Script
          id="currency-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var c=localStorage.getItem('ticket-currency');document.documentElement.dataset.currency=c==='btc'?'btc':'usd'}catch(e){document.documentElement.dataset.currency='usd'}`,
          }}
        />
        {/* Hero puzzle pick — see src/v2/puzzle/boot.ts. */}
        <Script
          id="puzzle-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: PUZZLE_BOOT_SCRIPT }}
        />
        {children}
      </body>
    </html>
  );
}

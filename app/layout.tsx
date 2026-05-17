// app/layout.tsx
// ─────────────────────────────────────────────────────────────
// ROOT LAYOUT — rendered once, wraps every single page.
//
// RENDERING: This is a SERVER COMPONENT. It runs on the server
// on every request. It never re-renders on the client.
//
// WHAT GOES HERE:
//   - <html> and <body> tags (required — only one place for them)
//   - Global fonts
//   - ThemeProvider (client boundary — see lib/contexts/theme-provider.tsx)
//   - Global metadata defaults
//
// WHAT DOES NOT GO HERE:
//   - Navbar (goes in the (shop) route group layout)
//   - Auth-only UI (goes in (auth) route group layout)
//   - Admin sidebar (goes in (admin) route group layout)
// ─────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/contexts/theme-provider";
import "./globals.css";

// ── Font setup ────────────────────────────────────────────────
// Next.js downloads and self-hosts these fonts at build time.
// No external request happens at runtime — good for performance
// and privacy.

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── Default metadata ──────────────────────────────────────────
// Individual pages can override these with their own `metadata`
// export. Next.js merges them automatically.

export const metadata: Metadata = {
  title: {
    default: "KenaKata — Modern Storefront",
    template: "%s | KenaKata",        // e.g. "Running Shoes | KenaKata"
  },
  description:
    "A modern e-commerce storefront built with Next.js 15 App Router.",
  keywords: ["shop", "e-commerce", "next.js", "kenakat"],
  authors: [{ name: "KenaKata" }],
  openGraph: {
    title: "KenaKata — Modern Storefront",
    description: "A modern e-commerce storefront built with Next.js 15.",
    type: "website",
    locale: "en_US",
  },
};

// ── Root layout component ─────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning is REQUIRED when using next-themes.
    // next-themes modifies the <html> class on the client before
    // React hydrates — without this, React logs a mismatch warning.
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          font-sans antialiased
          bg-background text-foreground
          min-h-screen
        `}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
// app/layout.tsx  (REPLACE existing)
// ─────────────────────────────────────────────────────────────
// Root layout updated to include AuthProvider.
// AuthProvider wraps the app so any client component can
// access auth state via useAuthContext().
// ─────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/lib/contexts/theme-provider";
import { AuthProvider }  from "@/lib/contexts/auth-context";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default:  "KenaKata — Modern Storefront",
    template: "%s | KenaKata",
  },
  description: "A modern e-commerce storefront built with Next.js 15 App Router.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground min-h-screen`}>
        <ThemeProvider>
          {/* AuthProvider must be inside ThemeProvider and outside everything else */}
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
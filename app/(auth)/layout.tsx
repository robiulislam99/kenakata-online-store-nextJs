// app/(auth)/layout.tsx
// ─────────────────────────────────────────────────────────────
// AUTH LAYOUT — SERVER COMPONENT
//
// Login and register pages use a different layout to the shop:
//   - No full Navbar (just a logo link home)
//   - No Footer
//   - Content is centered — the form floats in the middle
//
// This is a common UX pattern — auth pages feel focused and
// separate from the main shopping experience.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Minimal header — just the logo, no full navbar */}
      <header className="border-b border-border">
        <div className="container-page flex h-16 items-center">
          <Link
            href="/"
            className="
              text-xl font-bold tracking-tight
              hover:opacity-80 transition-opacity
              focus-ring rounded-md
            "
            aria-label="Back to KenaKata home"
          >
            <span className="text-primary">Kena</span>
            <span className="text-foreground">Kata</span>
          </Link>
        </div>
      </header>

      {/* Vertically and horizontally centered auth form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>
    </div>
  );
}
// components/layout/navbar.tsx
// ─────────────────────────────────────────────────────────────
// NAVBAR — SERVER COMPONENT
// Updated: replaced static cart icon with CartNavIcon (client)
// which shows the live cart item count from Zustand.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { NavLinks }    from "./nav-links";
import { MobileMenu }  from "./mobile-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CartNavIcon } from "./cart-nav-icon";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors duration-200 focus-ring rounded-md"
            aria-label="KenaKata home"
          >
            <span className="text-primary">Kena</span>
            <span>Kata</span>
          </Link>

          {/* Desktop navigation */}
          <NavLinks className="hidden md:flex gap-1" />

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {/* CartNavIcon: client component with live badge count */}
            <CartNavIcon />
            {/* Mobile hamburger */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
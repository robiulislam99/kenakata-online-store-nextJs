// components/layout/navbar.tsx
// ─────────────────────────────────────────────────────────────
// NAVBAR — SERVER COMPONENT
//
// This is a server component by default (no "use client").
// It renders the structural HTML on the server.
//
// CLIENT ISLANDS within this server component:
//   - <NavLinks>    → needs usePathname() for active state
//   - <ThemeToggle> → needs useTheme() for dark mode toggle
//   - <MobileMenu>  → needs useState() for open/close
//   - <CartIcon>    → will need cart count from Zustand (Phase 3)
//
// The Navbar itself never re-renders on the client — only the
// client island components inside it do.
//
// COMPONENT SIZE: ~75 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { NavLinks } from "./nav-links";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  return (
    // sticky top-0 keeps the navbar visible while scrolling.
    // z-50 ensures it sits above product cards and modals.
    // backdrop-blur gives a frosted-glass effect when scrolled.
    <header
      className="
        sticky top-0 z-50
        border-b border-border
        bg-background/80 backdrop-blur-md
      "
    >
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Link
            href="/"
            className="
              flex items-center gap-2
              text-xl font-bold tracking-tight
              text-foreground hover:text-primary
              transition-colors duration-200
              focus-ring rounded-md
            "
            aria-label="KenaKata home"
          >
            {/* Simple text logo — swap for an <Image> later */}
            <span className="text-primary">Kena</span>
            <span>Kata</span>
          </Link>

          {/* ── Desktop navigation ───────────────────────────── */}
          {/* hidden on mobile (md:flex shows it on desktop) */}
          <NavLinks className="hidden md:flex gap-1" />

          {/* ── Right-side actions ───────────────────────────── */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Cart icon placeholder — will be replaced in Phase 3 */}
            <Link
              href="/cart"
              aria-label="View cart"
              className="
                relative w-9 h-9 flex items-center justify-center
                rounded-lg border border-border
                bg-background-secondary hover:bg-border
                transition-colors duration-200
                focus-ring
              "
            >
              <CartIcon />
            </Link>

            {/* Mobile hamburger — hidden on desktop */}
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Cart icon (placeholder until Phase 3) ────────────────────

function CartIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
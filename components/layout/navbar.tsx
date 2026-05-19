// components/layout/navbar.tsx  (REPLACE existing)
// ─────────────────────────────────────────────────────────────
// NAVBAR — ASYNC SERVER COMPONENT
//
// UPDATED:
//   1. Now async — fetches categories server-side and passes
//      them to NavLinks → CategoriesDropdown as props.
//      No client-side fetch needed in the dropdown.
//
//   2. Added NavSearch — expandable search icon that navigates
//      to /products?q=term when submitted.
//
// CLIENT ISLANDS:
//   NavLinks          → usePathname (active state)
//   CategoriesDropdown → useState (open/close)
//   NavSearch         → useRouter, useState (expand/collapse)
//   ThemeToggle       → useTheme
//   CartNavIcon       → useCartStore
//   UserMenu          → useAuthContext
//   MobileMenu        → useState
//
// COMPONENT SIZE: ~55 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { Suspense }    from "react";
import Link            from "next/link";
import { getCategories } from "@/lib/api/categories";
import { NavLinks }    from "./nav-links";
import { MobileMenu }  from "./mobile-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CartNavIcon } from "./cart-nav-icon";
import { UserMenu }    from "./user-menu";
import { NavSearch }   from "./nav-search";

export async function Navbar() {
  // Fetch categories on the server — passed as props to avoid
  // client-side fetching in the dropdown
  const { data: categories } = await getCategories();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors duration-200 focus-ring rounded-md flex-shrink-0"
            aria-label="KenaKata home"
          >
            <span className="text-primary">Kena</span>
            <span>Kata</span>
          </Link>

          {/* Desktop nav links with category dropdown */}
          <NavLinks
            categories={categories ?? []}
            className="hidden md:flex gap-1"
          />

          {/* Right-side actions */}
          <div className="flex items-center gap-2">
            {/* Search — wrapped in Suspense because it uses useSearchParams */}
            <Suspense fallback={
              <div className="w-9 h-9 rounded-lg bg-background-secondary border border-border animate-pulse" />
            }>
              <NavSearch />
            </Suspense>

            <ThemeToggle />
            <CartNavIcon />
            <UserMenu />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
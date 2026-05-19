// components/layout/mobile-menu.tsx  (REPLACE existing)
"use client";
// ─────────────────────────────────────────────────────────────
// MobileMenu — UPDATED to accept categories prop and show
// them as a list inside the mobile drawer.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { NavLinks } from "./nav-links";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types";

interface MobileMenuProps {
  categories?: Category[];
}

export function MobileMenu({ categories = [] }: MobileMenuProps) {
  const [isOpen, setIsOpen]         = useState(false);
  const [catOpen, setCatOpen]       = useState(false);
  const close = () => { setIsOpen(false); setCatOpen(false); };

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-background-secondary hover:bg-border transition-colors focus-ring"
      >
        {isOpen ? <CloseIcon /> : <HamburgerIcon />}
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg z-40 px-4 py-3 space-y-1">

          {/* Home + Products */}
          <NavLinks className="flex-col items-start gap-1 w-full" onClick={close} />

          {/* Categories accordion */}
          <div>
            <button
              onClick={() => setCatOpen((p) => !p)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors focus-ring"
            >
              <span>Categories</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                className={cn("transition-transform duration-200", catOpen && "rotate-180")}
                aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {catOpen && (
              <ul className="mt-1 ml-3 space-y-1 border-l border-border pl-3">
                <li>
                  <Link
                    href="/products" onClick={close}
                    className="block px-3 py-2 text-sm rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors focus-ring"
                  >
                    🛍️ All Products
                  </Link>
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/products?categoryId=${cat.id}`}
                      onClick={close}
                      className="block px-3 py-2 text-sm rounded-lg text-foreground-muted hover:text-foreground hover:bg-background-secondary transition-colors focus-ring"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function HamburgerIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
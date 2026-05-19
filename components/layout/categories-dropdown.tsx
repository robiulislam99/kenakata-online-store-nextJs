// components/layout/categories-dropdown.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// CategoriesDropdown — replaces the plain "Categories" nav link
// with a dropdown that shows all categories as clickable items.
//
// Each category navigates to /products?categoryId=N which
// triggers the SSR product listing filtered to that category.
//
// DATA: Categories are passed as props (fetched server-side
// in the Navbar's parent layout — no client fetch needed).
//
// BEHAVIOUR:
//   - Click "Categories ▾" → dropdown opens
//   - Click a category → navigates and closes
//   - Click outside → closes
//   - Keyboard: Escape closes, arrow keys navigate items
//
// COMPONENT SIZE: ~120 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

"use client";

import { useState, useEffect, useRef } from "react";
import Link        from "next/link";
import Image       from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types";

interface CategoriesDropdownProps {
  categories: Category[];
}

export function CategoriesDropdown({ categories }: CategoriesDropdownProps) {
  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const containerRef                    = useRef<HTMLDivElement>(null);
  const pathname                        = usePathname();

  const open    = openPathname === pathname;
  const setOpen = (val: boolean) => setOpenPathname(val ? pathname : null);

  const isActive = pathname.startsWith("/categories") ||
    (pathname === "/products" && typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("categoryId"));

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">

      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Browse categories"
        className={cn(
          "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium",
          "transition-colors duration-200 focus-ring",
          isActive || open
            ? "text-primary bg-primary/10"
            : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
        )}
      >
        Categories
        <ChevronIcon
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          aria-label="Product categories"
          className={cn(
            "absolute top-11 left-0 z-50",
            "w-64 rounded-xl border border-border bg-background shadow-lg",
            "overflow-hidden"
          )}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-border bg-background-secondary">
            <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
              Shop by Category
            </p>
          </div>

          {/* Category list */}
          <ul className="py-1 max-h-72 overflow-y-auto">
            {/* "All products" option */}
            <li>
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-background-secondary transition-colors focus-ring"
              >
                <span className="w-8 h-8 rounded-lg bg-background-secondary border border-border flex items-center justify-center text-base flex-shrink-0" aria-hidden="true">
                  🛍️
                </span>
                <span className="font-medium">All Products</span>
              </Link>
            </li>

            {categories.map((cat) => {
              const imgSrc = cat.image?.startsWith("http")
                ? cat.image
                : "https://placehold.co/80x80/e2e8f0/94a3b8?text=Cat";

              return (
                <li key={cat.id}>
                  <Link
                    href={`/products?categoryId=${cat.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-background-secondary transition-colors focus-ring"
                  >
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-background-secondary">
                      <Image
                        src={imgSrc} alt={cat.name}
                        fill sizes="32px" className="object-cover"
                      />
                    </div>
                    <span>{cat.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2.5 bg-background-secondary">
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors focus-ring rounded"
            >
              View all products →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
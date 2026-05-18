// components/product/mobile-filter-drawer.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// MobileFilterDrawer — on small screens, filters live in a
// slide-in drawer behind a "Filters" button rather than a
// persistent sidebar (which would take too much space).
//
// COMPONENT SIZE: ~70 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { FilterPanel } from "./filter-panel";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types";

export function MobileFilterDrawer({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button — only visible on mobile */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex md:hidden items-center gap-2 h-10 px-4 rounded-lg",
          "border border-border bg-background-secondary",
          "text-sm font-medium text-foreground",
          "hover:bg-border transition-colors focus-ring"
        )}
      >
        <FilterIcon />
        Filters
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-foreground/20 z-40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border",
          "p-6 overflow-y-auto",
          "transform transition-transform duration-300 md:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Filter drawer"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-foreground">Filters</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close filters"
            className="text-foreground-muted hover:text-foreground focus-ring rounded"
          >
            ✕
          </button>
        </div>
        <FilterPanel categories={categories} />
      </div>
    </>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}
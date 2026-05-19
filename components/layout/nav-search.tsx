// components/layout/nav-search.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// NavSearch — compact search icon in Navbar that expands into
// a search input when clicked. Submits to /products?q=term
// which triggers the SSR product listing with that query.
//
// BEHAVIOUR:
//   - Click the search icon → input expands
//   - Type and press Enter → navigates to /products?q=term
//   - Click outside or press Escape → collapses
//   - On /products page → pre-fills from current ?q= param
//
// COMPONENT SIZE: ~95 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export function NavSearch() {
  const [expanded, setExpanded] = useState(false);
  const [value,    setValue]    = useState("");
  const inputRef                = useRef<HTMLInputElement>(null);
  const containerRef            = useRef<HTMLDivElement>(null);

  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  // Pre-fill from URL when on the products page
  useEffect(() => {
    if (pathname === "/products") {
      setValue(searchParams.get("q") ?? "");
    }
  }, [pathname, searchParams]);

  // Focus input when expanded
  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = value.trim();
      const params  = new URLSearchParams();
      if (trimmed) params.set("q", trimmed);
      router.push(`/products${trimmed ? `?${params}` : ""}`);
      setExpanded(false);
    },
    [value, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setExpanded(false); inputRef.current?.blur(); }
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      <form onSubmit={handleSubmit} className="flex items-center">
        {/* Expanding input */}
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search products…"
          aria-label="Search products"
          aria-hidden={!expanded}
          className={cn(
            "h-9 rounded-lg border border-border bg-background-secondary",
            "text-sm text-foreground placeholder:text-foreground-muted",
            "focus-ring transition-all duration-300 ease-in-out",
            expanded
              ? "w-48 sm:w-64 opacity-100 px-3 pr-8 mr-1"
              : "w-0 opacity-0 px-0 border-transparent pointer-events-none"
          )}
        />

        {/* Search icon button — always visible */}
        <button
          type={expanded && value ? "submit" : "button"}
          onClick={() => !expanded && setExpanded(true)}
          aria-label={expanded ? "Submit search" : "Open search"}
          aria-expanded={expanded}
          className={cn(
            "w-9 h-9 flex items-center justify-center rounded-lg",
            "border border-border bg-background-secondary",
            "text-foreground-muted hover:text-foreground hover:bg-border",
            "transition-colors duration-200 focus-ring"
          )}
        >
          <SearchIcon />
        </button>
      </form>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}
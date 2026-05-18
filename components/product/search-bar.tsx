// components/product/search-bar.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// SearchBar — zero useEffect, zero setState-in-effect.
//
// PATTERN: "uncontrolled with key reset"
//   The inner InputDebouncer is given a `key` equal to the
//   URL value. When the URL changes externally (back button,
//   filter clear), the key changes → React unmounts and
//   remounts the input with the new default value.
//   While the user types, the key stays the same so the input
//   is unaffected. No syncing needed at all.
// ─────────────────────────────────────────────────────────────

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

interface SearchBarProps {
  placeholder?: string;
  className?:   string;
}

export function SearchBar({ placeholder = "Search products…", className }: SearchBarProps) {
  const searchParams = useSearchParams();
  const urlQuery     = searchParams.get("q") ?? "";

  return (
    <div className={cn("relative", className)}>
      <SearchIcon />
      {/*
        key={urlQuery} — when the URL value changes externally,
        React unmounts + remounts InputDebouncer with the new
        defaultValue. No setState, no useEffect sync needed.
      */}
      <InputDebouncer
        key={urlQuery}
        defaultValue={urlQuery}
        placeholder={placeholder}
      />
    </div>
  );
}

// ── Inner component — owns the debounce logic ─────────────────

function InputDebouncer({
  defaultValue,
  placeholder,
}: {
  defaultValue: string;
  placeholder:  string;
}) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const [draft, setDraft] = useState(defaultValue);

  // Debounce: push to URL 400ms after user stops typing.
  // This effect only fires when `draft` changes — never sets
  // state, only pushes to the router (an external system).
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (draft) {
        params.set("q", draft);
      } else {
        params.delete("q");
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    }, 400);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <>
      <input
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        aria-label="Search products"
        className={cn(
          "w-full h-10 pl-10 pr-4 rounded-lg",
          "bg-background-secondary border border-border",
          "text-sm text-foreground placeholder:text-foreground-muted",
          "focus-ring transition-colors duration-200",
          "hover:border-primary/40"
        )}
      />
      {draft && (
        <button
          onClick={() => setDraft("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
        >
          <ClearIcon />
        </button>
      )}
    </>
  );
}

// ── Icons ─────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted w-4 h-4 z-10"
      fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor"
      strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
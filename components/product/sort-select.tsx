// components/product/sort-select.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// SortSelect — dropdown that updates the ?sort= URL param.
// Like SearchBar, it's URL-driven so the page re-renders SSR.
// ─────────────────────────────────────────────────────────────

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { SortOption } from "@/lib/utils/parseSearchParams";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "default",    label: "Default"         },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "name_asc",   label: "Name: A → Z"      },
];

export function SortSelect({ className }: { className?: string }) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const current      = (searchParams.get("sort") ?? "default") as SortOption;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value === "default") {
      params.delete("sort");
    } else {
      params.set("sort", e.target.value);
    }
    params.delete("page"); // reset to page 1
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      value={current}
      onChange={handleChange}
      aria-label="Sort products"
      className={cn(
        "h-10 px-3 rounded-lg",
        "bg-background-secondary border border-border",
        "text-sm text-foreground",
        "focus-ring cursor-pointer",
        "hover:border-primary/40",
        "transition-colors duration-200",
        className
      )}
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
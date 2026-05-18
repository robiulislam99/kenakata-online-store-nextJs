// components/product/active-filters.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// ActiveFilters — shows a chip for each active filter so the
// user can see what's applied and remove individual ones.
// ─────────────────────────────────────────────────────────────

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types";

interface ActiveFiltersProps {
  categories: Category[];
}

export function ActiveFilters({ categories }: ActiveFiltersProps) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const q          = searchParams.get("q");
  const categoryId = searchParams.get("categoryId");
  const priceMin   = searchParams.get("priceMin");
  const priceMax   = searchParams.get("priceMax");

  const chips: { label: string; removeKey: string | string[] }[] = [];

  if (q) chips.push({ label: `"${q}"`, removeKey: "q" });

  if (categoryId) {
    const cat = categories.find((c) => String(c.id) === categoryId);
    if (cat) chips.push({ label: cat.name, removeKey: "categoryId" });
  }

  if (priceMin) chips.push({ label: `Min $${priceMin}`, removeKey: "priceMin" });
  if (priceMax) chips.push({ label: `Max $${priceMax}`, removeKey: "priceMax" });

  if (chips.length === 0) return null;

  const remove = (keys: string | string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    const arr = Array.isArray(keys) ? keys : [keys];
    arr.forEach((k) => params.delete(k));
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      <span className="text-xs text-foreground-muted">Active:</span>
      {chips.map((chip) => (
        <span
          key={chip.label}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full",
            "text-xs font-medium",
            "bg-primary/10 text-primary border border-primary/20"
          )}
        >
          {chip.label}
          <button
            onClick={() => remove(chip.removeKey)}
            aria-label={`Remove filter ${chip.label}`}
            className="hover:text-primary/60 transition-colors focus-ring rounded-full"
          >
            ✕
          </button>
        </span>
      ))}
    </div>
  );
}
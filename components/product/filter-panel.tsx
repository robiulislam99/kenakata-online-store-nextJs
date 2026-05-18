// components/product/filter-panel.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// FilterPanel — category + price range filters.
// All state lives in the URL. Selecting a filter pushes a new
// URL, which triggers the SSR page to re-run with new params.
//
// Receives categories as a prop (fetched server-side in the page)
// so this client component never needs to fetch data itself.
//
// COMPONENT SIZE: ~130 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types";

interface FilterPanelProps {
  categories: Category[];
  className?: string;
}

export function FilterPanel({ categories, className }: FilterPanelProps) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const activeCategoryId = searchParams.get("categoryId") ?? "";
  const priceMin         = searchParams.get("priceMin") ?? "";
  const priceMax         = searchParams.get("priceMax") ?? "";

  // Generic param setter — preserves all other params, resets page
  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("categoryId");
    params.delete("priceMin");
    params.delete("priceMax");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasActiveFilters = !!(activeCategoryId || priceMin || priceMax);

  return (
    <aside className={cn("space-y-6", className)} aria-label="Product filters">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-primary hover:text-primary/80 transition-colors focus-ring rounded"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category filter */}
      <div>
        <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">
          Category
        </h3>
        <ul className="space-y-1">
          <li>
            <CategoryButton
              label="All Categories"
              isActive={!activeCategoryId}
              onClick={() => setParam("categoryId", "")}
            />
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <CategoryButton
                label={cat.name}
                isActive={activeCategoryId === String(cat.id)}
                onClick={() => setParam("categoryId", String(cat.id))}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Price range filter */}
      <div>
        <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <PriceInput
            placeholder="Min"
            value={priceMin}
            onChange={(v) => setParam("priceMin", v)}
            aria-label="Minimum price"
          />
          <span className="text-foreground-muted text-sm">–</span>
          <PriceInput
            placeholder="Max"
            value={priceMax}
            onChange={(v) => setParam("priceMax", v)}
            aria-label="Maximum price"
          />
        </div>
      </div>
    </aside>
  );
}

// ── Sub-components ────────────────────────────────────────────

function CategoryButton({
  label, isActive, onClick,
}: {
  label: string; isActive: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 focus-ring",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-foreground-muted hover:bg-background-secondary hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function PriceInput({
  placeholder, value, onChange, "aria-label": ariaLabel,
}: {
  placeholder: string; value: string;
  onChange: (v: string) => void; "aria-label": string;
}) {
  return (
    <input
      type="number" min={0} value={value} placeholder={placeholder}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      onBlur={(e) => onChange(e.target.value)}
      className={cn(
        "w-full h-9 px-2 rounded-lg text-sm",
        "bg-background-secondary border border-border",
        "text-foreground placeholder:text-foreground-muted",
        "focus-ring hover:border-primary/40 transition-colors"
      )}
    />
  );
}
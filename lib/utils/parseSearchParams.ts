// lib/utils/parseSearchParams.ts
// ─────────────────────────────────────────────────────────────
// Converts raw URL searchParams (all strings) into typed
// ProductsQueryParams for the API call.
//
// WHY THIS EXISTS:
//   Next.js gives us searchParams as Record<string,string>.
//   The API needs numbers for price, offset, categoryId.
//   Centralising this parsing means we validate/coerce once
//   and the page component stays clean.
// ─────────────────────────────────────────────────────────────

import type { ProductsQueryParams } from "@/types";

export type SortOption = "default" | "price_asc" | "price_desc" | "name_asc";

export interface ParsedSearchParams {
  query:      string;
  categoryId: number | undefined;
  sort:       SortOption;
  page:       number;
  priceMin:   number | undefined;
  priceMax:   number | undefined;
}

const PAGE_SIZE = 12;

export function parseSearchParams(
  raw: Record<string, string | string[] | undefined>
): ParsedSearchParams {
  const str = (key: string) => {
    const v = raw[key];
    return typeof v === "string" ? v.trim() : "";
  };

  const num = (key: string): number | undefined => {
    const v = str(key);
    const n = Number(v);
    return v && !isNaN(n) && n > 0 ? n : undefined;
  };

  const page = Math.max(1, Number(str("page")) || 1);

  const sortRaw = str("sort");
  const sort: SortOption =
    ["default", "price_asc", "price_desc", "name_asc"].includes(sortRaw)
      ? (sortRaw as SortOption)
      : "default";

  return {
    query:      str("q"),
    categoryId: num("categoryId"),
    sort,
    page,
    priceMin:   num("priceMin"),
    priceMax:   num("priceMax"),
  };
}

// Convert ParsedSearchParams → API query params
export function toApiParams(p: ParsedSearchParams): ProductsQueryParams {
  return {
    limit:      PAGE_SIZE,
    offset:     (p.page - 1) * PAGE_SIZE,
    title:      p.query || undefined,
    categoryId: p.categoryId,
    price_min:  p.priceMin,
    price_max:  p.priceMax,
  };
}

export { PAGE_SIZE };
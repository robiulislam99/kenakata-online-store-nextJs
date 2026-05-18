// lib/utils/sortProducts.ts
// ─────────────────────────────────────────────────────────────
// Client-side sort applied AFTER the API response.
// Platzi's API doesn't support server-side sorting, so we
// fetch the data and sort it in memory.
// ─────────────────────────────────────────────────────────────

import type { Product } from "@/types";
import type { SortOption } from "./parseSearchParams";

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const copy = [...products]; // never mutate the original array

  switch (sort) {
    case "price_asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price_desc":
      return copy.sort((a, b) => b.price - a.price);
    case "name_asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "default":
    default:
      return copy; // keep API order
  }
}
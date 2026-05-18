// components/product/product-grid.tsx
// ─────────────────────────────────────────────────────────────
// ProductGrid — pure server component.
// Receives products as props (already fetched by the page).
// Applies client-side sort then renders the grid.
//
// WHY SORT HERE NOT IN THE PAGE?
//   Keeps the page component thin. The grid owns its display logic.
// ─────────────────────────────────────────────────────────────

import { ProductCard } from "./product-card";
import { sortProducts } from "@/lib/utils/sortProducts";
import type { Product } from "@/types";
import type { SortOption } from "@/lib/utils/parseSearchParams";

interface ProductGridProps {
  products: Product[];
  sort:     SortOption;
}

export function ProductGrid({ products, sort }: ProductGridProps) {
  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <span className="text-5xl" aria-hidden="true">🔍</span>
        <h3 className="text-lg font-semibold text-foreground">No products found</h3>
        <p className="text-sm text-foreground-muted max-w-xs">
          Try adjusting your search or filters to find what you are looking for.
        </p>
      </div>
    );
  }

  const sorted = sortProducts(products, sort);

  return (
    <div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
      aria-label={`${sorted.length} products`}
    >
      {sorted.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
// components/home/featured-products.tsx
// ─────────────────────────────────────────────────────────────
// FeaturedProducts — async server component.
//
// RENDERING PATTERN — "async server component":
//   This component is async and fetches data directly.
//   No useEffect, no useState, no loading state needed here —
//   Next.js streams the HTML as soon as the await resolves.
//   The loading state is handled by the <Suspense> boundary
//   in the parent page (app/(shop)/page.tsx).
//
// WHY HERE AND NOT IN THE PAGE?
//   The page wraps this in <Suspense fallback={<skeleton>}>.
//   That means the rest of the page (hero, categories) renders
//   immediately while this component waits for the API.
//   This is "partial rendering" — a key Next.js 15 pattern.
//
// COMPONENT SIZE: ~70 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { getFeaturedProducts } from "@/lib/api/products";
import { ProductCard } from "@/components/product/product-card";

export async function FeaturedProducts() {
  const { data: products, error } = await getFeaturedProducts(8);

  // Error state — shown inside the Suspense boundary area
  if (error || !products) {
    return (
      <div className="rounded-xl border border-border bg-background-secondary p-10 text-center">
        <p className="text-foreground-muted text-sm">
          Could not load products right now. Please try again later.
        </p>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-background-secondary p-10 text-center">
        <p className="text-foreground-muted text-sm">No products available.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            // Give priority to the first 4 cards (above the fold on desktop)
            priority={index < 4}
          />
        ))}
      </div>

      {/* View all link */}
      <div className="mt-8 text-center">
        <Link
          href="/products"
          className="
            inline-flex items-center gap-2
            text-sm font-medium text-primary
            hover:text-primary/80
            transition-colors duration-200
            focus-ring rounded
          "
        >
          View all products
          <svg width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
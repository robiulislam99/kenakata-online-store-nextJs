// components/product/related-products.tsx
// ─────────────────────────────────────────────────────────────
// RelatedProducts — async SERVER COMPONENT.
// Fetches products from the same category, excludes current.
// Wrapped in Suspense by the parent page.
//
// COMPONENT SIZE: ~55 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { getProductsByCategory } from "@/lib/api/products";
import { ProductCard } from "./product-card";

interface RelatedProductsProps {
  categoryId:        number;
  currentProductId:  number;
}

export async function RelatedProducts({
  categoryId,
  currentProductId,
}: RelatedProductsProps) {
  const { data, error } = await getProductsByCategory(categoryId, 8, 0);

  if (error || !data) return null;

  // Exclude the current product from the related list
  const related = data
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="mt-16 md:mt-24">
      <h2
        id="related-heading"
        className="text-2xl font-bold tracking-tight text-foreground mb-6"
      >
        Related Products
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
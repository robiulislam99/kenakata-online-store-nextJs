// components/product/product-card.tsx
// ─────────────────────────────────────────────────────────────
// ProductCard — renders one product in any grid or list.
// Used on: home page featured section, product listing, related products.
//
// RENDERING: This is a SERVER COMPONENT — no "use client".
// It receives a Product prop and renders static HTML.
// The "Add to Cart" button will be extracted into a separate
// client component in Phase 3 (when we build the cart).
//
// COMPONENT SIZE: ~95 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/formatCurrency";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean; // true for above-the-fold images (hero row)
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  // Platzi API sometimes returns broken image URLs or data URIs.
  // We fall back to a placeholder if the URL looks invalid.
  const imageUrl = getValidImage(product.images);

  return (
    <article className="group flex flex-col rounded-xl overflow-hidden border border-border bg-background hover:shadow-lg transition-shadow duration-300">

      {/* ── Product image ─────────────────────────────────── */}
      <Link
        href={`/products/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-background-secondary"
        aria-label={`View ${product.title}`}
        tabIndex={-1}
      >
        <Image
          src={imageUrl}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={priority}
        />
      </Link>

      {/* ── Product info ──────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-4 gap-2">

        {/* Category badge */}
        <Badge variant="primary" className="self-start">
          {product.category.name}
        </Badge>

        {/* Title */}
        <Link href={`/products/${product.id}`} className="focus-ring rounded">
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Price — pushed to bottom with mt-auto */}
        <p className="mt-auto pt-2 text-lg font-bold text-primary">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  );
}

// ── Helpers ───────────────────────────────────────────────────

function getValidImage(images: string[]): string {
  const FALLBACK = "https://placehold.co/400x400/e2e8f0/94a3b8?text=No+Image";

  if (!images || images.length === 0) return FALLBACK;

  const first = images[0];

  // Platzi sometimes returns JSON-encoded arrays as strings, e.g. '["url"]'
  if (first.startsWith("[")) {
    try {
      const parsed = JSON.parse(first);
      return Array.isArray(parsed) && parsed[0] ? parsed[0] : FALLBACK;
    } catch {
      return FALLBACK;
    }
  }

  // Must be a real URL
  if (first.startsWith("http")) return first;

  return FALLBACK;
}
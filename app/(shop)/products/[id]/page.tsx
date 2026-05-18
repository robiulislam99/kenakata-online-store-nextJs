// app/(shop)/products/[id]/page.tsx
// ─────────────────────────────────────────────────────────────
// PRODUCT DETAIL PAGE — SERVER COMPONENT
//
// RENDERING STRATEGY: ISR (revalidate: 86400 = 24 hours)
//
// WHY ISR?
//   Product data is mostly stable — title, price, images don't
//   change every minute. ISR pre-renders each product page as
//   static HTML (fast TTFB, great Lighthouse score) and
//   regenerates in the background once per day.
//
// generateStaticParams:
//   Tells Next.js which [id] values to pre-build at deploy time.
//   We pre-build the first 20 products. Any other product ID
//   is generated on-demand on first request, then cached.
//
// SERVER + CLIENT ISLAND PATTERN:
//   - ProductGallery  → client (manages selected image state)
//   - ProductInfo     → server (static product data)
//   - AddToCartButton → client (reads/writes Zustand cart)
//   - RelatedProducts → server async (fetches by category)
//
// COMPONENT SIZE: ~95 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { Suspense }   from "react";
import { notFound }   from "next/navigation";
import type { Metadata } from "next";

import { getProductById, getProductIdsForStaticPaths } from "@/lib/api/products";
// Go up 4 folders (id -> products -> shop -> app) then into components
import { ProductGallery } from "../../../../components/product/product-gallery";
import { ProductInfo } from "../../../../components/product/product-info";
import { AddToCartButton } from "../../../../components/product/add-to-cart-button";
import { RelatedProducts } from "../../../../components/product/related-products";
import { ProductGridSkeleton } from "@/components/product/product-card-skeleton";

// ── ISR revalidation ──────────────────────────────────────────

export const revalidate = 86400; // 24 hours

// ── Static params — pre-build first 20 products ───────────────

export async function generateStaticParams() {
  const ids = await getProductIdsForStaticPaths(20);
  return ids.map((id) => ({ id: String(id) }));
}

// ── Dynamic metadata ──────────────────────────────────────────
// Next.js calls this to build the <title> and OG tags for
// each product page — important for SEO.

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const { data: product } = await getProductById(Number(id));

  if (!product) return { title: "Product Not Found" };

  return {
    title:       product.title,
    description: product.description.slice(0, 155),
    openGraph: {
      title:       product.title,
      description: product.description.slice(0, 155),
      images:      product.images[0] ? [product.images[0]] : [],
    },
  };
}

// ── Page component ────────────────────────────────────────────

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const productId = Number(id);

  // Validate the ID is a real number
  if (isNaN(productId)) notFound();

  const { data: product, error } = await getProductById(productId);

  // 404 for missing products
  if (error || !product) notFound();

  return (
    <div className="container-page py-8 md:py-12">

      {/* ── Main product section ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

        {/* Left: Image gallery (client component) */}
        <ProductGallery
          images={product.images}
          title={product.title}
        />

        {/* Right: Product info + Add to cart */}
        <ProductInfo product={product}>
          {/* AddToCartButton is a client island inside a server component */}
          <AddToCartButton product={product} />
        </ProductInfo>
      </div>

      {/* ── Related products ──────────────────────────────── */}
      {/* Wrapped in Suspense — fetches independently, doesn't
          block the main product from rendering */}
      <Suspense fallback={
        <div className="mt-16">
          <div className="h-8 w-48 rounded bg-background-secondary animate-pulse mb-6" />
          <ProductGridSkeleton count={4} />
        </div>
      }>
        <RelatedProducts
          categoryId={product.category.id}
          currentProductId={product.id}
        />
      </Suspense>
    </div>
  );
}
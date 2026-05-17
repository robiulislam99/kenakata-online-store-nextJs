// lib/api/products.ts
// ─────────────────────────────────────────────────────────────
// All product-related API calls.
//
// RENDERING NOTE:
//   - getProducts() is called from SSR pages (no cache, fresh data)
//   - getProductById() is called from ISR pages (revalidate: 86400)
//   - getFeaturedProducts() is called from SSG home page (revalidate: 3600)
//
// The `next` option on each call controls how Next.js caches
// the request — this is where our rendering strategy is defined.
// ─────────────────────────────────────────────────────────────

import { platziGet, buildQuery } from "./platzi";
import type { Product, ProductsQueryParams, ApiResult } from "@/types";

// ── Get a paginated, filtered list of products ────────────────
// Used by: /products page (SSR — no caching, reads searchParams)

export async function getProducts(
  params: ProductsQueryParams = {}
): Promise<ApiResult<Product[]>> {
  const query = buildQuery({
    limit: params.limit ?? 20,
    offset: params.offset ?? 0,
    title: params.title,
    price: params.price,
    price_min: params.price_min,
    price_max: params.price_max,
    categoryId: params.categoryId,
  });

  // no-store = always fetch fresh data from API (SSR behaviour)
  return platziGet<Product[]>(`/products${query}`, {
    cache: "no-store",
  });
}

// ── Get a single product by ID ────────────────────────────────
// Used by: /products/[id] page (ISR — refresh every 24 hours)

export async function getProductById(
  id: number
): Promise<ApiResult<Product>> {
  return platziGet<Product>(`/products/${id}`, {
    revalidate: 86400, // 24 hours in seconds
  });
}

// ── Get featured products for the home page ───────────────────
// Used by: / home page (SSG+ISR — refresh every hour)

export async function getFeaturedProducts(
  limit: number = 8
): Promise<ApiResult<Product[]>> {
  const query = buildQuery({ limit, offset: 0 });

  return platziGet<Product[]>(`/products${query}`, {
    revalidate: 3600, // 1 hour in seconds
  });
}

// ── Get products by category ──────────────────────────────────
// Used by: /categories/[id] page

export async function getProductsByCategory(
  categoryId: number,
  limit: number = 20,
  offset: number = 0
): Promise<ApiResult<Product[]>> {
  const query = buildQuery({ limit, offset });

  return platziGet<Product[]>(
    `/categories/${categoryId}/products${query}`,
    { revalidate: 3600 }
  );
}

// ── Get IDs of the first N products for generateStaticParams ──
// Used by: app/(shop)/products/[id]/page.tsx
// Next.js calls this at build time to pre-render popular pages.

export async function getProductIdsForStaticPaths(
  limit: number = 20
): Promise<number[]> {
  const result = await platziGet<Product[]>(
    `/products${buildQuery({ limit, offset: 0 })}`,
    { revalidate: 86400 }
  );

  if (result.error || !result.data) return [];
  return result.data.map((p) => p.id);
}
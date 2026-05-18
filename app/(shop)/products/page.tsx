// app/(shop)/products/page.tsx
// ─────────────────────────────────────────────────────────────
// PRODUCT LISTING PAGE — SERVER COMPONENT
//
// RENDERING STRATEGY: SSR (no revalidate export = always fresh)
//
// WHY SSR?
//   This page reads URL searchParams for search, filter, sort,
//   and page. Every combination produces a different page —
//   there's no single static version. SSR lets the server read
//   the params, call the API with them, and return pre-rendered
//   HTML in one round trip. The user gets a fully rendered page
//   with no client-side waterfall.
//
// DATA FLOW:
//   URL ?q=shoes&categoryId=1&sort=price_asc&page=2
//     → parseSearchParams() → typed params
//     → getProducts(apiParams) + getCategories() in PARALLEL
//     → ProductGrid renders sorted results server-side
//
// COMPONENT SIZE: ~105 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { Suspense } from "react";
import type { Metadata } from "next";

import { getProducts }   from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { parseSearchParams, toApiParams, PAGE_SIZE } from "@/lib/utils/parseSearchParams";

import { ProductGrid }          from "@/components/product/product-grid";
import { SearchBar }            from "@/components/product/search-bar";
import { SortSelect }           from "@/components/product/sort-select";
import { FilterPanel }          from "@/components/product/filter-panel";
import { ActiveFilters }        from "@/components/product/active-filters";
import { MobileFilterDrawer }   from "@/components/product/mobile-filter-drawer";
import { Pagination }           from "@/components/ui/pagination";
import { ProductGridSkeleton }  from "@/components/product/product-card-skeleton";

// ── Metadata ──────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our full catalog of products.",
};

// ── Page props type ───────────────────────────────────────────
// Next.js passes searchParams as a Promise in Next.js 15

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// ── Page component ────────────────────────────────────────────

export default async function ProductsPage({ searchParams }: PageProps) {
  // Await searchParams (Next.js 15 requirement)
  const rawParams = await searchParams;
  const parsed    = parseSearchParams(rawParams);
  const apiParams = toApiParams(parsed);

  // Fetch products AND categories in parallel — Promise.all
  // means we don't wait for one before starting the other.
  const [productsResult, categoriesResult] = await Promise.all([
    getProducts(apiParams),
    getCategories(),
  ]);

  const products   = productsResult.data   ?? [];
  const categories = categoriesResult.data ?? [];
  const hasError   = !!productsResult.error;

  // Total pages: Platzi doesn't return a total count so we
  // infer: if we got a full page, there might be more.
  const totalPages = products.length === PAGE_SIZE
    ? parsed.page + 2  // conservative estimate
    : parsed.page;

  return (
    <div className="container-page py-8 md:py-12">

      {/* ── Page header ───────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          All Products
        </h1>
        <p className="mt-1 text-foreground-muted text-sm">
          {hasError
            ? "Error loading products"
            : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
        </p>
      </div>

      {/* ── Toolbar: search + sort + mobile filter ────────── */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* SearchBar and SortSelect are client components wrapped
            in Suspense because they use useSearchParams() */}
        <Suspense fallback={<div className="h-10 w-64 rounded-lg bg-background-secondary animate-pulse" />}>
          <SearchBar className="flex-1 min-w-48 max-w-sm" />
        </Suspense>
        <Suspense fallback={<div className="h-10 w-40 rounded-lg bg-background-secondary animate-pulse" />}>
          <SortSelect />
        </Suspense>
        <Suspense fallback={null}>
          <MobileFilterDrawer categories={categories} />
        </Suspense>
      </div>

      {/* Active filter chips */}
      <Suspense fallback={null}>
        <ActiveFilters categories={categories} />
      </Suspense>

      {/* ── Main layout: sidebar + grid ───────────────────── */}
      <div className="mt-6 flex gap-8">

        {/* Sidebar filters — hidden on mobile (use drawer instead) */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <Suspense fallback={<div className="space-y-4"><div className="h-6 w-24 rounded bg-background-secondary animate-pulse" /></div>}>
            <FilterPanel categories={categories} />
          </Suspense>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {hasError ? (
            <ErrorState />
          ) : (
            <>
              <ProductGrid products={products} sort={parsed.sort} />
              <div className="mt-10">
                <Suspense fallback={null}>
                  <Pagination
                    currentPage={parsed.page}
                    totalPages={totalPages}
                  />
                </Suspense>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────

function ErrorState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <span className="text-5xl" aria-hidden="true">⚠️</span>
      <h3 className="text-lg font-semibold text-foreground">
        Could not load products
      </h3>
      <p className="text-sm text-foreground-muted max-w-xs">
        There was a problem connecting to the API. Please try again later.
      </p>
    </div>
  );
}
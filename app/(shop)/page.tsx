// app/(shop)/page.tsx
// ─────────────────────────────────────────────────────────────
// HOME PAGE — SERVER COMPONENT
//
// RENDERING STRATEGY: SSG + ISR
//   export const revalidate = 3600 tells Next.js:
//   "Build this page statically at deploy time.
//    After 1 hour, the next request triggers a background
//    rebuild. Until it finishes, serve the stale version."
//
// PAGE STRUCTURE:
//   1. HeroSection      — static, no data fetching
//   2. FeaturedProducts — async, fetches products (ISR 1hr)
//   3. CategoriesSection — async, fetches categories (ISR 1hr)
//
// SUSPENSE PATTERN:
//   Each async section is wrapped in its own <Suspense>.
//   This means:
//   - The Hero renders immediately (it's static HTML).
//   - FeaturedProducts and CategoriesSection show skeletons
//     while their data fetches resolve IN PARALLEL.
//   - When data arrives, React streams the real content in.
//   This is called "streaming SSR" — a Next.js 15 superpower.
//
// COMPONENT SIZE: ~65 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { Suspense } from "react";
import type { Metadata } from "next";

import { HeroSection }        from "@/components/home/hero-section";
import { FeaturedProducts }   from "@/components/home/featured-products";
import { CategoriesSection }  from "@/components/home/categories-section";
import { SectionHeader }      from "@/components/ui/section-header";
import { ProductGridSkeleton } from "@/components/product/product-card-skeleton";
import { CategorySkeleton }   from "@/components/home/category-skeleton";

// ── ISR revalidation ──────────────────────────────────────────
// This is a module-level export — Next.js reads it at build time.
// It does NOT go inside a function or component.

export const revalidate = 3600; // regenerate at most once per hour

// ── Page metadata ─────────────────────────────────────────────

export const metadata: Metadata = {
  title: "KenaKata — Modern Storefront",
  description:
    "Discover thousands of products across every category. Fast delivery, easy returns.",
};

// ── Page component ────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* 1. Hero — static, no data, renders instantly */}
      <HeroSection />

      <div className="container-page py-16 md:py-24 space-y-16 md:space-y-24">

        {/* 2. Featured Products — streams in as data arrives */}
        <section aria-labelledby="featured-heading">
          <SectionHeader
            title="Featured Products"
            subtitle="Hand-picked from our latest collection"
            href="/products"
            linkLabel="View all"
          />
          {/*
            Suspense boundary: shows ProductGridSkeleton until
            FeaturedProducts resolves its async data fetch.
            The rest of the page does NOT wait for this.
          */}
          <Suspense fallback={<ProductGridSkeleton count={8} />}>
            <FeaturedProducts />
          </Suspense>
        </section>

        {/* 3. Categories — streams in independently */}
        <section aria-labelledby="categories-heading">
          <SectionHeader
            title="Shop by Category"
            subtitle="Find exactly what you're looking for"
            href="/categories"
            linkLabel="All categories"
          />
          <Suspense fallback={<CategorySkeleton />}>
            <CategoriesSection />
          </Suspense>
        </section>

      </div>
    </>
  );
}
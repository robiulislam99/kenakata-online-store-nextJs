// app/(shop)/products/loading.tsx
// ─────────────────────────────────────────────────────────────
// Next.js automatically shows this while the page is loading.
// It replaces the entire page content with a skeleton that
// matches the layout exactly — no layout shift.
// ─────────────────────────────────────────────────────────────

import { ProductGridSkeleton } from "@/components/product/product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsLoading() {
  return (
    <div className="container-page py-8 md:py-12">
      {/* Header skeleton */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      {/* Toolbar skeleton */}
      <div className="flex gap-3 mb-6">
        <Skeleton className="h-10 flex-1 max-w-sm" />
        <Skeleton className="h-10 w-40" />
      </div>
      {/* Layout skeleton */}
      <div className="flex gap-8">
        <div className="hidden md:block w-56 space-y-3">
          <Skeleton className="h-5 w-20" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
        <div className="flex-1">
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    </div>
  );
}
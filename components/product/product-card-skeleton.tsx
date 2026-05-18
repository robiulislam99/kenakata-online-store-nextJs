// components/product/product-card-skeleton.tsx
// ─────────────────────────────────────────────────────────────
// Skeleton version of ProductCard — shown while products load.
// Dimensions match ProductCard exactly so layout doesn't shift.
// Used as the Suspense fallback in the featured products section.
// ─────────────────────────────────────────────────────────────

import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-border">
      {/* Image placeholder */}
      <Skeleton className="aspect-square w-full rounded-none" />
      {/* Info placeholder */}
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-24 mt-2" />
      </div>
    </div>
  );
}

// Grid of skeletons — used as the full section fallback
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
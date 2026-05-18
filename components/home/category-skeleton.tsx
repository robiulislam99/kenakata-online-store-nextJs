// components/home/category-skeleton.tsx
// Skeleton placeholder for the categories section.

import { Skeleton } from "@/components/ui/skeleton";

export function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center rounded-xl border border-border bg-background-secondary p-4 gap-3"
        >
          <Skeleton className="w-16 h-16 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
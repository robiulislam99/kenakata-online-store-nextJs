// components/ui/skeleton.tsx
// ─────────────────────────────────────────────────────────────
// Skeleton loader — shows a pulsing grey placeholder while
// content is loading. Used in Suspense fallbacks so the layout
// doesn't shift when real data arrives.
//
// USAGE:
//   <Skeleton className="h-48 w-full rounded-xl" />
//   <Skeleton className="h-4 w-32 mt-2" />
// ─────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md",
        "bg-foreground-muted/10",
        className
      )}
    />
  );
}
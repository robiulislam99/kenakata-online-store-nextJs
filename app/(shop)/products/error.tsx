// app/(shop)/products/error.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// Next.js error boundary for the /products route.
// Must be a client component (uses the error prop + reset fn).
// Shown when an unhandled error is thrown during rendering.
// ─────────────────────────────────────────────────────────────

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service in production
    console.error("Products page error:", error);
  }, [error]);

  return (
    <div className="container-page py-24 flex flex-col items-center gap-6 text-center">
      <span className="text-6xl" aria-hidden="true">😕</span>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
        <p className="mt-2 text-foreground-muted">
          We could not load the products page. This is usually a temporary issue.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
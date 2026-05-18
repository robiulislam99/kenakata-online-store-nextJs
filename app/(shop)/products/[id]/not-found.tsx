// app/(shop)/products/[id]/not-found.tsx
// Shown when notFound() is called — invalid or missing product ID.

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
  return (
    <div className="container-page py-24 flex flex-col items-center gap-6 text-center">
      <span className="text-6xl" aria-hidden="true">📦</span>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Product not found</h2>
        <p className="mt-2 text-foreground-muted">
          This product does not exist or may have been removed.
        </p>
      </div>
      <Button asChild>
        <Link href="/products">Browse all products</Link>
      </Button>
    </div>
  );
}
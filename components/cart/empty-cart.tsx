// components/cart/empty-cart.tsx
// Simple empty state for the cart page — server component.

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
      <span className="text-7xl" aria-hidden="true">🛒</span>
      <div>
        <h2 className="text-2xl font-bold text-foreground">Your cart is empty</h2>
        <p className="mt-2 text-foreground-muted">
          Looks like you havent added anything yet.
        </p>
      </div>
      <Button asChild size="lg">
        <Link href="/products">Start Shopping</Link>
      </Button>
    </div>
  );
}
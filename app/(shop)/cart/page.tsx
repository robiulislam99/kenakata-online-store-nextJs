// app/(shop)/cart/page.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// CART PAGE — CLIENT COMPONENT
//
// RENDERING STRATEGY: CSR (Client-Side Rendering)
//
// WHY CSR?
//   Cart data lives in Zustand + localStorage — it's entirely
//   per-user and browser-side. There is no server-side state
//   to render. SSR would give us nothing here (the server has
//   no idea what's in the user's cart). CSR is the correct and
//   intentional choice for this page.
//
// COMPONENT SIZE: ~55 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { useCart }     from "@/lib/hooks/useCart";
import { CartItem }    from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { EmptyCart }   from "@/components/cart/empty-cart";

export default function CartPage() {
  const { items, isEmpty, clearCart } = useCart();

  return (
    <div className="container-page py-8 md:py-12">

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Shopping Cart
        </h1>
        {!isEmpty && (
          <button
            onClick={clearCart}
            className="text-sm text-foreground-muted hover:text-red-500 transition-colors focus-ring rounded"
          >
            Clear cart
          </button>
        )}
      </div>

      {isEmpty ? (
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Cart items list — takes 2/3 of the grid */}
          <div className="lg:col-span-2">
            <ul aria-label="Cart items">
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </ul>
          </div>

          {/* Order summary sidebar — 1/3 of the grid */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
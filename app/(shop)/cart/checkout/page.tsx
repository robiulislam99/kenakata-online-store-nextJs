// app/(shop)/cart/checkout/page.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// CHECKOUT PAGE — CLIENT COMPONENT
//
// RENDERING STRATEGY: CSR
//   Like the cart, checkout depends entirely on client-side
//   cart state. CSR is correct here — no SEO value, and the
//   data is per-user and browser-only.
//
// GUARD: If the cart is empty, redirect to cart page.
//   We do this client-side with useEffect since we can't read
//   Zustand on the server.
//
// COMPONENT SIZE: ~60 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { useEffect }        from "react";
import { useRouter }        from "next/navigation";
import { useCart }          from "@/lib/hooks/useCart";
import { CheckoutForm }     from "@/components/checkout/checkout-form";
import { CheckoutSummary }  from "@/components/checkout/checkout-summary";

export default function CheckoutPage() {
  const { isEmpty } = useCart();
  const router      = useRouter();

  // Guard — redirect to cart if it's empty
  useEffect(() => {
    if (isEmpty) router.replace("/cart");
  }, [isEmpty, router]);

  // Show nothing while redirecting
  if (isEmpty) return null;

  return (
    <div className="container-page py-8 md:py-12">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Checkout</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Complete your order below.
        </p>
      </div>

      {/* Two-column layout: form left, summary right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

        {/* Checkout form — 3/5 width on desktop */}
        <div className="lg:col-span-3">
          <CheckoutForm />
        </div>

        {/* Order summary — 2/5 width on desktop, shows at top on mobile */}
        <div className="lg:col-span-2 order-first lg:order-last">
          <CheckoutSummary />
        </div>
      </div>
    </div>
  );
}
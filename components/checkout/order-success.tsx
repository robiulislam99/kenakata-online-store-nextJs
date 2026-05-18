// components/checkout/order-success.tsx
// ─────────────────────────────────────────────────────────────
// OrderSuccess — shown after the mock payment "completes".
// Displays a confirmation with a fake order number.
// Server component — no interactivity needed here.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface OrderSuccessProps {
  orderNumber: string;
  email:       string;
}

export function OrderSuccess({ orderNumber, email }: OrderSuccessProps) {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-12">
      {/* Success animation */}
      <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <svg className="w-10 h-10 text-green-600 dark:text-green-400"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          viewBox="0 0 24 24" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Order Confirmed!</h2>
        <p className="text-foreground-muted">
          Thank you for your order. A confirmation has been sent to{" "}
          <strong className="text-foreground">{email}</strong>.
        </p>
      </div>

      {/* Order details */}
      <div className="w-full max-w-sm rounded-xl border border-border bg-background-secondary p-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground-muted">Order number</span>
          <span className="font-mono font-semibold text-foreground">{orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground-muted">Status</span>
          <span className="text-green-600 dark:text-green-400 font-medium">Confirmed</span>
        </div>
        <div className="flex justify-between">
          <span className="text-foreground-muted">Estimated delivery</span>
          <span className="text-foreground">3–5 business days</span>
        </div>
      </div>

      <p className="text-xs text-foreground-muted max-w-xs">
        This is a demo project. No real payment was processed and no order was placed.
      </p>

      <Button asChild size="lg">
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
}
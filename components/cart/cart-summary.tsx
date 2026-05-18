// components/cart/cart-summary.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// CartSummary — order total sidebar on the cart page.
// Shows subtotal, shipping, tax, grand total, and CTA.
// COMPONENT SIZE: ~80 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { useCart } from "@/lib/hooks/useCart";
import { Button }  from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/formatCurrency";

export function CartSummary() {
  const { total, itemCount, isEmpty } = useCart();

  const shipping = total >= 50 ? 0 : 9.99;
  const tax      = total * 0.08;          // mock 8% tax
  const grand    = total + shipping + tax;

  return (
    <aside
      className="rounded-2xl border border-border bg-background-secondary p-6 space-y-4 h-fit"
      aria-label="Order summary"
    >
      <h2 className="text-lg font-semibold text-foreground">Order Summary</h2>

      {/* Line items */}
      <div className="space-y-3 text-sm">
        <SummaryRow label={`Subtotal (${itemCount} item${itemCount !== 1 ? "s" : ""})`} value={formatPrice(total)} />
        <SummaryRow
          label="Shipping"
          value={shipping === 0 ? "Free" : formatPrice(shipping)}
          valueClass={shipping === 0 ? "text-green-600 dark:text-green-400 font-medium" : ""}
        />
        <SummaryRow label="Tax (8%)" value={formatPrice(tax)} />

        <div className="border-t border-border pt-3">
          <SummaryRow
            label="Total"
            value={formatPrice(grand)}
            labelClass="font-bold text-base text-foreground"
            valueClass="font-bold text-base text-primary"
          />
        </div>
      </div>

      {/* Free shipping notice */}
      {total < 50 && total > 0 && (
        <p className="text-xs text-foreground-muted bg-background rounded-lg p-3 border border-border">
          💡 Add <strong>{formatPrice(50 - total)}</strong> more for free shipping!
        </p>
      )}

      {/* CTA */}
      <Button asChild size="lg" className="w-full" disabled={isEmpty}>
        <Link href="/cart/checkout">Proceed to Checkout →</Link>
      </Button>

      <Button asChild variant="ghost" size="sm" className="w-full">
        <Link href="/products">← Continue Shopping</Link>
      </Button>

      {/* Trust badges */}
      <div className="flex justify-center gap-4 pt-2 text-xs text-foreground-muted">
        <span>🔒 Secure checkout</span>
        <span>↩️ Free returns</span>
      </div>
    </aside>
  );
}

function SummaryRow({
  label, value, labelClass = "", valueClass = "",
}: {
  label: string; value: string;
  labelClass?: string; valueClass?: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={`text-foreground-muted ${labelClass}`}>{label}</span>
      <span className={`text-foreground ${valueClass}`}>{value}</span>
    </div>
  );
}
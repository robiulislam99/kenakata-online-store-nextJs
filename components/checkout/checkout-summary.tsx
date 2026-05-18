// components/checkout/checkout-summary.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// CheckoutSummary — read-only order summary for checkout page.
// Similar to CartSummary but compact and without edit controls.
// ─────────────────────────────────────────────────────────────

import Image from "next/image";
import { useCart } from "@/lib/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatCurrency";

export function CheckoutSummary() {
  const { items, total } = useCart();
  const shipping  = total >= 50 ? 0 : 9.99;
  const tax       = total * 0.08;
  const grand     = total + shipping + tax;

  return (
    <aside className="rounded-2xl border border-border bg-background-secondary p-6 space-y-5 h-fit" aria-label="Order summary">
      <h2 className="text-base font-semibold text-foreground">Order Summary</h2>

      {/* Item list */}
      <ul className="space-y-3 max-h-64 overflow-y-auto">
        {items.map(({ product, quantity }) => {
          const img = product.images[0]?.startsWith("http")
            ? product.images[0]
            : "https://placehold.co/80x80/e2e8f0/94a3b8?text=Item";
          return (
            <li key={product.id} className="flex gap-3 items-center">
              <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-background border border-border">
                <Image src={img} alt={product.title} fill sizes="48px" className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground line-clamp-1">{product.title}</p>
                <p className="text-xs text-foreground-muted">Qty: {quantity}</p>
              </div>
              <span className="text-xs font-semibold text-foreground">
                {formatPrice(product.price * quantity)}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Totals */}
      <div className="space-y-2 text-sm border-t border-border pt-4">
        <Row label="Subtotal"  value={formatPrice(total)} />
        <Row label="Shipping"  value={shipping === 0 ? "Free" : formatPrice(shipping)} />
        <Row label="Tax (8%)"  value={formatPrice(tax)} />
        <div className="border-t border-border pt-2">
          <Row
            label="Total" value={formatPrice(grand)}
            bold
          />
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "font-bold text-foreground" : "text-foreground-muted"}`}>
      <span>{label}</span>
      <span className={bold ? "text-primary" : ""}>{value}</span>
    </div>
  );
}
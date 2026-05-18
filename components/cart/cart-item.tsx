// components/cart/cart-item.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// CartItem — one product row in the cart page.
// Shows image, title, price, qty controls, subtotal, remove.
//
// COMPONENT SIZE: ~100 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import Image from "next/image";
import Link  from "next/link";
import { useCart } from "@/lib/hooks/useCart";
import { formatPrice } from "@/lib/utils/formatCurrency";
import { cn } from "@/lib/utils/cn";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQty, removeItem } = useCart();
  const { product, quantity }     = item;

  const imageUrl = getValidImage(product.images);
  const subtotal = product.price * quantity;

  return (
    <li className="flex gap-4 py-5 border-b border-border last:border-0">

      {/* Product image */}
      <Link href={`/products/${product.id}`} className="focus-ring rounded-lg flex-shrink-0">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-background-secondary border border-border">
          <Image
            src={imageUrl} alt={product.title}
            fill sizes="96px" className="object-cover"
          />
        </div>
      </Link>

      {/* Info + controls */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${product.id}`}
            className="text-sm font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors focus-ring rounded"
          >
            {product.title}
          </Link>
          <button
            onClick={() => removeItem(product.id)}
            aria-label={`Remove ${product.title} from cart`}
            className="flex-shrink-0 text-foreground-muted hover:text-red-500 transition-colors focus-ring rounded p-1"
          >
            <TrashIcon />
          </button>
        </div>

        <p className="text-xs text-foreground-muted">{product.category.name}</p>

        <div className="flex items-center justify-between mt-auto">
          {/* Qty stepper */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <QtyBtn onClick={() => updateQty(product.id, quantity - 1)} aria-label="Decrease">−</QtyBtn>
            <span className="w-8 text-center text-sm font-medium py-1">{quantity}</span>
            <QtyBtn onClick={() => updateQty(product.id, quantity + 1)} disabled={quantity >= 10} aria-label="Increase">+</QtyBtn>
          </div>
          {/* Subtotal */}
          <span className="text-sm font-bold text-primary">{formatPrice(subtotal)}</span>
        </div>
      </div>
    </li>
  );
}

function QtyBtn({ children, onClick, disabled, "aria-label": label }: {
  children: React.ReactNode; onClick: () => void;
  disabled?: boolean; "aria-label": string;
}) {
  return (
    <button
      onClick={onClick} disabled={disabled} aria-label={label}
      className="w-8 h-8 flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-background-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-ring text-sm"
    >
      {children}
    </button>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  );
}

function getValidImage(images: string[]): string {
  const FALLBACK = "https://placehold.co/200x200/e2e8f0/94a3b8?text=Item";
  if (!images?.length) return FALLBACK;
  const first = images[0];
  if (first?.startsWith("[")) {
    try { const p = JSON.parse(first); return p[0] ?? FALLBACK; } catch { return FALLBACK; }
  }
  return first?.startsWith("http") ? first : FALLBACK;
}
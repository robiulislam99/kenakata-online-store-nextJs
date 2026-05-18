// components/product/add-to-cart-button.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// AddToCartButton — client component, reads/writes cart store.
//
// WHY A SEPARATE CLIENT COMPONENT?
//   The product detail page is a server component (ISR).
//   We can't use Zustand hooks in a server component.
//   By extracting just the button into a client component,
//   the rest of the page stays server-rendered — better perf.
//
// FEATURES:
//   - Quantity selector (1–10)
//   - "Already in cart" state with link to cart
//   - Brief success feedback animation
//
// HYDRATION NOTE:
//   inCart reads from Zustand (localStorage). The server has no
//   cart, so we must not render cart-dependent UI until mounted.
//   useSyncExternalStore gives us a safe server/client snapshot
//   without useEffect → setState (which triggers cascading renders).
// ─────────────────────────────────────────────────────────────

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart.store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types";

// ── Hydration-safe mounted flag ───────────────────────────────
const subscribe = () => () => {};
const getClient = () => true;
const getServer = () => false;

function useIsMounted() {
  return useSyncExternalStore(subscribe, getClient, getServer);
}

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity,  setQuantity]  = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const mounted  = useIsMounted();
  const addItem  = useCartStore((s) => s.addItem);
  const hasItem  = useCartStore((s) => s.hasItem);

  // Only read cart state after hydration — server always sees false
  // so both server and client render the same "Add to Cart" button
  // on first paint, eliminating the mismatch
  const inCart = mounted && hasItem(product.id);

  const handleAdd = () => {
    addItem(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  return (
    <div className="space-y-4">

      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground-muted">Qty:</span>
        <div className="flex items-center border border-border rounded-lg overflow-hidden">
          <QtyButton
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            −
          </QtyButton>
          <span className="w-10 text-center text-sm font-medium text-foreground py-2">
            {quantity}
          </span>
          <QtyButton
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            disabled={quantity >= 10}
            aria-label="Increase quantity"
          >
            +
          </QtyButton>
        </div>
      </div>

      {/* Add / Already in cart */}
      {inCart && !justAdded ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
            <CheckIcon /> Already in cart
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleAdd} className="flex-1">
              Add {quantity} more
            </Button>
            <Button asChild className="flex-1">
              <Link href="/cart">View Cart →</Link>
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAdd}
          size="lg"
          className={cn(
            "w-full transition-all duration-300",
            justAdded && "bg-green-600 hover:bg-green-600"
          )}
        >
          {justAdded ? (
            <><CheckIcon /> Added to Cart!</>
          ) : (
            <><CartIcon /> Add to Cart</>
          )}
        </Button>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function QtyButton({ children, onClick, disabled, "aria-label": ariaLabel }: {
  children: React.ReactNode; onClick: () => void;
  disabled?: boolean; "aria-label": string;
}) {
  return (
    <button
      onClick={onClick} disabled={disabled} aria-label={ariaLabel}
      className="w-9 h-9 flex items-center justify-center text-foreground-muted hover:text-foreground hover:bg-background-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-ring"
    >
      {children}
    </button>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
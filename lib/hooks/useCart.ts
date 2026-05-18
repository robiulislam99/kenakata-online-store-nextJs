// lib/hooks/useCart.ts
// ─────────────────────────────────────────────────────────────
// useCart — a clean hook API over the raw Zustand cart store.
//
// WHY A HOOK WRAPPER?
//   Components shouldn't import the store directly —
//   they'd need to know the store's internal shape.
//   This hook exposes only what components need, making
//   it easy to swap the store implementation later.
//
// USAGE:
//   const { items, total, addItem, removeItem } = useCart();
// ─────────────────────────────────────────────────────────────

import { useCartStore } from "@/lib/store/cart.store";
import type { Product } from "@/types";

export function useCart() {
  const items      = useCartStore((s) => s.items);
  const addItem    = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty  = useCartStore((s) => s.updateQty);
  const clearCart  = useCartStore((s) => s.clearCart);
  const itemCount  = useCartStore((s) => s.itemCount());
  const total      = useCartStore((s) => s.total());

  const isEmpty = items.length === 0;

  return {
    items,
    itemCount,
    total,
    isEmpty,
    addItem,
    removeItem,
    updateQty,
    clearCart,
  };
}
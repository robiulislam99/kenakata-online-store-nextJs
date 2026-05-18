// lib/store/cart.store.ts
// ─────────────────────────────────────────────────────────────
// Cart store using Zustand with localStorage persistence.
//
// WHY ZUSTAND?
//   React Context re-renders the entire tree on every change.
//   Zustand uses selectors — only components that subscribe to
//   the specific slice they need will re-render. The cart count
//   in the Navbar updates without re-rendering the whole page.
//
// WHY PERSIST MIDDLEWARE?
//   The cart must survive page refreshes. Zustand's persist
//   middleware automatically syncs the store to localStorage
//   and rehydrates it on the next visit — zero boilerplate.
//
// USAGE:
//   const { items, addItem, removeItem } = useCartStore();
//   const total = useCartStore(s => s.total());  ← selector
// ─────────────────────────────────────────────────────────────

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product, CartItem } from "@/types";

// ── Store shape ───────────────────────────────────────────────

interface CartStore {
  items: CartItem[];

  // Actions
  addItem:    (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQty:  (productId: number, quantity: number) => void;
  clearCart:  () => void;

  // Derived values (computed as functions, not state)
  itemCount: () => number;
  total:     () => number;
  hasItem:   (productId: number) => boolean;
}

// ── Store implementation ──────────────────────────────────────

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existing) {
            // Product already in cart — increment quantity
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // New product — add to cart
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQty: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      // Derived — total number of individual items
      itemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      // Derived — total price
      total: () =>
        get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        ),

      // Derived — check if a product is already in the cart
      hasItem: (productId) =>
        get().items.some((item) => item.product.id === productId),
    }),
    {
      name:    "kenakat-cart",          // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
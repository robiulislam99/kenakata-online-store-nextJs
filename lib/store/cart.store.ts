// lib/store/cart.store.ts
// ─────────────────────────────────────────────────────────────
// Cart store with manual per-user localStorage persistence.
//
// WHY MANUAL INSTEAD OF ZUSTAND PERSIST?
//   Zustand's persist middleware uses a single fixed key defined
//   at store creation time. Changing that key at runtime
//   (on login/logout) is not supported cleanly.
//
//   Instead we manage localStorage ourselves:
//     - writeCart() writes items to "kenakat-cart-{userId}"
//     - loadCartForUser() reads from "kenakat-cart-{userId}"
//     - resetToGuest() clears memory (keeps localStorage intact)
//
//   This means each user's cart is isolated and survives
//   logout — it reloads exactly when they log back in.
// ─────────────────────────────────────────────────────────────
import { create } from "zustand";
import type { Product, CartItem } from "@/types";

// ── Key helpers ───────────────────────────────────────────────

function cartKey(userId?: number | string | null): string {
  return userId ? `kenakat-cart-${userId}` : "kenakat-cart-guest";
}

function readCart(userId?: number | string | null): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(cartKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[], userId?: number | string | null): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(cartKey(userId), JSON.stringify(items));
  } catch {
    // localStorage full or unavailable — fail silently
  }
}

// ── Store shape ───────────────────────────────────────────────

interface CartStore {
  items:   CartItem[];
  _userId: number | string | null;

  // Actions
  addItem:         (product: Product, quantity?: number) => void;
  removeItem:      (productId: number) => void;
  updateQty:       (productId: number, quantity: number) => void;
  clearCart:       () => void;
  loadCartForUser: (userId: number | string) => void;
  resetToGuest:    () => void;

  // Derived
  itemCount: () => number;
  total:     () => number;
  hasItem:   (productId: number) => boolean;
}

// ── Store implementation ──────────────────────────────────────

export const useCartStore = create<CartStore>()((set, get) => ({
  items:   [],
  _userId: null,

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find(
        (item) => item.product.id === product.id
      );

      const newItems = existing
        ? state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [...state.items, { product, quantity }];

      writeCart(newItems, state._userId);     // ← persist under user's key
      return { items: newItems };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter(
        (item) => item.product.id !== productId
      );
      writeCart(newItems, state._userId);
      return { items: newItems };
    });
  },

  updateQty: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => {
      const newItems = state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      writeCart(newItems, state._userId);
      return { items: newItems };
    });
  },

  clearCart: () => {
    writeCart([], get()._userId);
    set({ items: [] });
  },

  // ── Called on login ────────────────────────────────────────
  // Reads this user's saved cart from localStorage and loads
  // it into memory. Their previous session's items come back.
  loadCartForUser: (userId) => {
    const items = readCart(userId);           // reads "kenakat-cart-{userId}"
    set({ items, _userId: userId });
  },

  // ── Called on logout ───────────────────────────────────────
  // Clears in-memory cart only. The user's items remain safely
  // in localStorage under their own key for next login.
  resetToGuest: () => {
    set({ items: [], _userId: null });
  },

  // Derived
  itemCount: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),

  total: () =>
    get().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    ),

  hasItem: (productId) =>
    get().items.some((item) => item.product.id === productId),

  //temporary helper to peek userId for testing
}));
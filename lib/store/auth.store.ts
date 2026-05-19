// lib/store/auth.store.ts
// ─────────────────────────────────────────────────────────────
// Auth store — persists the logged-in user and tokens.
//
// CART INTEGRATION NOTE:
//   Cart activation is handled in auth-context.tsx, NOT here.
//   Dynamic imports were async and caused race conditions where
//   _userId wasn't set before the first addItem fired.
//   auth-context.tsx calls useCartStore directly and synchronously.
// ─────────────────────────────────────────────────────────────
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, AuthTokens } from "@/types";

interface AuthStore {
  user:            User | null;
  tokens:          AuthTokens | null;
  isAuthenticated: boolean;

  setAuth: (user: User, tokens: AuthTokens) => void;
  logout:  () => void;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user:            null,
      tokens:          null,
      isAuthenticated: false,

      // NOTE: No cart calls here — auth-context handles it synchronously
      setAuth: (user, tokens) => {
        set({ user, tokens, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, tokens: null, isAuthenticated: false });
      },

      isAdmin: () => get().user?.role === "admin",
    }),
    {
      name:    "kenakat-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user:            state.user,
        tokens:          state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
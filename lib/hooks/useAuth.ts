// lib/hooks/useAuth.ts
// ─────────────────────────────────────────────────────────────
// useAuth — clean hook API over the Zustand auth store.
// Components import this, not the store directly.
// ─────────────────────────────────────────────────────────────

import { useAuthStore } from "@/lib/store/auth.store";

export function useAuth() {
  const user            = useAuthStore((s) => s.user);
  const tokens          = useAuthStore((s) => s.tokens);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth         = useAuthStore((s) => s.setAuth);
  const logout          = useAuthStore((s) => s.logout);
  const isAdmin         = useAuthStore((s) => s.isAdmin());

  return {
    user,
    tokens,
    isAuthenticated,
    isAdmin,
    setAuth,
    logout,
  };
}
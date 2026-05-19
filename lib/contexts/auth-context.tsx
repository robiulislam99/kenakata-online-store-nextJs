"use client";
import {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { useCartStore } from "@/lib/store/cart.store";
import type { User, AuthTokens } from "@/types";

interface AuthContextValue {
  user:            User | null;
  isAuthenticated: boolean;
  isAdmin:         boolean;
  login:  (user: User, tokens: AuthTokens, callbackUrl?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const store  = useAuthStore();

  const login = useCallback(
    (user: User, tokens: AuthTokens, callbackUrl?: string) => {
      store.setAuth(user, tokens);
      useCartStore.getState().loadCartForUser(user.id);

      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `kenakat-auth-token=${tokens.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `kenakat-user-role=${user.role}; path=/; max-age=${maxAge}; SameSite=Lax`;

      router.push(callbackUrl ?? "/");
    },
    [store, router]
  );

  const logout = useCallback(() => {
    useCartStore.getState().resetToGuest();
    store.logout();

    document.cookie = "kenakat-auth-token=; path=/; max-age=0";
    document.cookie = "kenakat-user-role=; path=/; max-age=0";

    router.push("/");
    router.refresh();
  }, [store, router]);

  return (
    <AuthContext.Provider
      value={{
        user:            store.user,
        isAuthenticated: store.isAuthenticated,
        isAdmin:         store.isAdmin(),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside <AuthProvider>");
  return ctx;
}
// app/(auth)/login/page.tsx
// ─────────────────────────────────────────────────────────────
// LOGIN PAGE — SERVER COMPONENT shell
//
// RENDERING: SSR. The page shell is server-rendered.
// LoginForm is a client component (uses RHF, useAuthContext).
// Suspense is required because LoginForm uses useSearchParams().
// ─────────────────────────────────────────────────────────────

import { Suspense }    from "react";
import type { Metadata } from "next";
import { LoginForm }   from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your KenaKata account.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm h-96 animate-pulse rounded-xl bg-background-secondary" />}>
      <LoginForm />
    </Suspense>
  );
}
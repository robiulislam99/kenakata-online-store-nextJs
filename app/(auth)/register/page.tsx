// app/(auth)/register/page.tsx
// ─────────────────────────────────────────────────────────────
// REGISTER PAGE — SERVER COMPONENT shell
// ─────────────────────────────────────────────────────────────

import { Suspense }      from "react";
import type { Metadata } from "next";
import { RegisterForm }  from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new KenaKata account.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="w-full max-w-sm h-96 animate-pulse rounded-xl bg-background-secondary" />}>
      <RegisterForm />
    </Suspense>
  );
}
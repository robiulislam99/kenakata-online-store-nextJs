// components/auth/login-form.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// LoginForm — handles login submission with RHF + Zod.
// Calls our /api/auth/login route handler (not Platzi directly).
// On success, stores auth in context (Zustand + cookies).
//
// COMPONENT SIZE: ~110 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormData } from "@/lib/schemas/auth.schema";
import { useAuthContext } from "@/lib/contexts/auth-context";
import { FormField } from "@/components/checkout/form-field";
import { Button }    from "@/components/ui/button";

export function LoginForm() {
  const [serverError, setServerError] = useState("");
  const { login }       = useAuthContext();
  const searchParams    = useSearchParams();
  const callbackUrl     = searchParams.get("callbackUrl") ?? "/";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Login failed. Please try again.");
        return;
      }

      // Store auth state and navigate
      login(json.user, json.tokens, callbackUrl);
    } catch {
      setServerError("Network error. Please check your connection.");
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
        <p className="text-sm text-foreground-muted">Sign in to your KenaKata account</p>
      </div>

      {/* Server error */}
      {serverError && (
        <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {serverError}
        </div>
      )}

      {/* Demo credentials hint */}
      <div className="rounded-lg border border-border bg-background-secondary p-3 text-xs text-foreground-muted space-y-1">
        <p className="font-medium text-foreground">Demo credentials:</p>
        <p>Email: <code className="text-primary">john@mail.com</code></p>
        <p>Password: <code className="text-primary">changeme</code></p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField
          id="email" label="Email address" type="email"
          placeholder="you@example.com" required
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          id="password" label="Password" type="password"
          placeholder="••••••••" required
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-foreground-muted">
        Dont have an account?{" "}
        <Link href="/register" className="text-primary hover:text-primary/80 font-medium focus-ring rounded">
          Create one
        </Link>
      </p>
    </div>
  );
}
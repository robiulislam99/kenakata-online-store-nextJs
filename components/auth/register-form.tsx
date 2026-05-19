// components/auth/register-form.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// RegisterForm — new account creation form.
// Uses the registerSchema which includes cross-field validation
// (password === confirmPassword) via Zod's .refine().
//
// COMPONENT SIZE: ~115 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema, type RegisterFormData } from "@/lib/schemas/auth.schema";
import { useAuthContext } from "@/lib/contexts/auth-context";
import { FormField } from "@/components/checkout/form-field";
import { Button }    from "@/components/ui/button";

export function RegisterForm() {
  const [serverError, setServerError] = useState("");
  const { login } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError("");
    try {
      const res = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:     data.name,
          email:    data.email,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerError(json.error ?? "Registration failed. Please try again.");
        return;
      }

      // Auto-login after registration
      if (json.tokens && json.user) {
        login(json.user, json.tokens, "/");
      }
    } catch {
      setServerError("Network error. Please check your connection.");
    }
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
        <p className="text-sm text-foreground-muted">Join KenaKata today</p>
      </div>

      {/* Server error */}
      {serverError && (
        <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <FormField
          id="name" label="Full name" required
          placeholder="John Doe"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          id="email" label="Email address" type="email" required
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          id="password" label="Password" type="password" required
          placeholder="Min. 6 chars, upper + lower + number"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <FormField
          id="confirmPassword" label="Confirm password" type="password" required
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-foreground-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:text-primary/80 font-medium focus-ring rounded">
          Sign in
        </Link>
      </p>
    </div>
  );
}
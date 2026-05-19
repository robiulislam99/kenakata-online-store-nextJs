// lib/schemas/auth.schema.ts
// ─────────────────────────────────────────────────────────────
// Zod validation schemas for login and register forms.
// Same pattern as checkout.schema.ts — one schema gives us
// both runtime validation AND TypeScript types.
// ─────────────────────────────────────────────────────────────

import { z } from "zod";

// ── Login ─────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ── Register ──────────────────────────────────────────────────

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, "Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name is too long"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and a number"
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message:  "Passwords do not match",
    path:     ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
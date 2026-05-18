// lib/schemas/checkout.schema.ts
// ─────────────────────────────────────────────────────────────
// Zod schema for the checkout form.
//
// WHY ZOD?
//   Zod validates at runtime AND infers TypeScript types.
//   One schema = one source of truth for both validation
//   rules and types. No duplication between type definitions
//   and validation logic.
//
// USAGE:
//   import { checkoutSchema, type CheckoutFormData } from ...
//   const form = useForm<CheckoutFormData>({
//     resolver: zodResolver(checkoutSchema)
//   });
// ─────────────────────────────────────────────────────────────

import { z } from "zod";

export const checkoutSchema = z.object({
  // ── Contact ──────────────────────────────────────────────
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  // ── Shipping ─────────────────────────────────────────────
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long"),

  address: z
    .string()
    .min(1, "Address is required")
    .min(5, "Please enter a complete address"),

  city: z
    .string()
    .min(1, "City is required"),

  country: z
    .string()
    .min(1, "Country is required"),

  postalCode: z
    .string()
    .min(1, "Postal code is required")
    .regex(/^[A-Z0-9\s\-]{3,10}$/i, "Invalid postal code format"),

  // ── Payment (mock — no real processing) ──────────────────
  cardName: z
    .string()
    .min(1, "Cardholder name is required"),

  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .regex(/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, "Card number must be 16 digits"),

  expiryDate: z
    .string()
    .min(1, "Expiry date is required")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format"),

  cvv: z
    .string()
    .min(1, "CVV is required")
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

// Infer the TypeScript type from the schema
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
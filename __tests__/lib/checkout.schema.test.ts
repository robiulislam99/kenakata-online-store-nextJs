// __tests__/lib/checkout.schema.test.ts
// Unit tests for the Zod checkout validation schema.

import { describe, it, expect } from "vitest";
import { checkoutSchema } from "@/lib/schemas/checkout.schema";

const validData = {
  email:      "test@example.com",
  firstName:  "John",
  lastName:   "Doe",
  address:    "123 Main Street",
  city:       "New York",
  country:    "United States",
  postalCode: "10001",
  cardName:   "John Doe",
  cardNumber: "1234 5678 9012 3456",
  expiryDate: "12/26",
  cvv:        "123",
};

describe("checkoutSchema", () => {
  it("accepts valid checkout data", () => {
    const result = checkoutSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = checkoutSchema.safeParse({ ...validData, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("email");
    }
  });

  it("rejects short first name", () => {
    const result = checkoutSchema.safeParse({ ...validData, firstName: "J" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid card number format", () => {
    const result = checkoutSchema.safeParse({ ...validData, cardNumber: "1234" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid expiry format", () => {
    const result = checkoutSchema.safeParse({ ...validData, expiryDate: "1226" });
    expect(result.success).toBe(false);
  });

  it("rejects CVV with wrong length", () => {
    const result = checkoutSchema.safeParse({ ...validData, cvv: "12" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid postal code", () => {
    const result = checkoutSchema.safeParse({ ...validData, postalCode: "!!" });
    expect(result.success).toBe(false);
  });

  it("rejects empty required fields", () => {
    const result = checkoutSchema.safeParse({ ...validData, city: "" });
    expect(result.success).toBe(false);
  });

  it("accepts 4-digit CVV (Amex)", () => {
    const result = checkoutSchema.safeParse({ ...validData, cvv: "1234" });
    expect(result.success).toBe(true);
  });
});
// __tests__/lib/auth.schema.test.ts
// Unit tests for login and register Zod schemas.

import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "@/lib/schemas/auth.schema";

// ── loginSchema ───────────────────────────────────────────────

describe("loginSchema", () => {
  const valid = { email: "test@example.com", password: "password123" };

  it("accepts valid credentials", () => {
    expect(loginSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects invalid email", () => {
    const r = loginSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects empty password", () => {
    const r = loginSchema.safeParse({ ...valid, password: "" });
    expect(r.success).toBe(false);
  });

  it("rejects short password", () => {
    const r = loginSchema.safeParse({ ...valid, password: "abc" });
    expect(r.success).toBe(false);
  });

  it("rejects missing email", () => {
    const r = loginSchema.safeParse({ password: "password123" });
    expect(r.success).toBe(false);
  });
});

// ── registerSchema ────────────────────────────────────────────

describe("registerSchema", () => {
  const valid = {
    name:            "John Doe",
    email:           "john@example.com",
    password:        "Password1",
    confirmPassword: "Password1",
  };

  it("accepts valid registration data", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects mismatched passwords", () => {
    const r = registerSchema.safeParse({
      ...valid, confirmPassword: "Different1",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0].path).toContain("confirmPassword");
    }
  });

  it("rejects password without uppercase", () => {
    const r = registerSchema.safeParse({
      ...valid, password: "password1", confirmPassword: "password1",
    });
    expect(r.success).toBe(false);
  });

  it("rejects password without a number", () => {
    const r = registerSchema.safeParse({
      ...valid, password: "Password", confirmPassword: "Password",
    });
    expect(r.success).toBe(false);
  });

  it("rejects short name", () => {
    const r = registerSchema.safeParse({ ...valid, name: "J" });
    expect(r.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const r = registerSchema.safeParse({ ...valid, email: "bad" });
    expect(r.success).toBe(false);
  });
});
// __tests__/lib/utils.test.ts
// Place this at: __tests__/lib/utils.test.ts
// ─────────────────────────────────────────────────────────────
// Unit tests for the three utility modules:
//   cn()             → lib/utils/cn.ts
//   formatPrice()    → lib/utils/formatCurrency.ts
//   buildQuery()     → lib/api/platzi.ts
// ─────────────────────────────────────────────────────────────

import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils/cn";
import { formatPrice, formatCurrency } from "@/lib/utils/formatCurrency";
import { buildQuery } from "@/lib/api/platzi";

// ── cn() ──────────────────────────────────────────────────────

describe("cn()", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("resolves Tailwind conflicts — last one wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("filters out falsy values", () => {
    expect(cn("base", false && "hidden", undefined, null, "active")).toBe(
      "base active"
    );
  });

  it("merges conditional classes", () => {
    const isActive = true;
    expect(cn("btn", isActive && "btn-active")).toBe("btn btn-active");
  });
});

// ── formatCurrency() ──────────────────────────────────────────

describe("formatCurrency()", () => {
  it("formats USD correctly", () => {
    expect(formatCurrency(10)).toBe("$10.00");
  });

  it("formats with two decimal places", () => {
    expect(formatCurrency(9.9)).toBe("$9.90");
  });

  it("handles zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });

  it("handles large numbers with comma separator", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });
});

describe("formatPrice()", () => {
  it("is a USD shorthand", () => {
    expect(formatPrice(25)).toBe("$25.00");
  });
});

// ── buildQuery() ──────────────────────────────────────────────

describe("buildQuery()", () => {
  it("returns empty string when no params given", () => {
    expect(buildQuery({})).toBe("");
  });

  it("builds a query string from valid params", () => {
    expect(buildQuery({ limit: 10, offset: 0 })).toBe("?limit=10&offset=0");
  });

  it("filters out undefined values", () => {
    expect(buildQuery({ limit: 10, title: undefined })).toBe("?limit=10");
  });

  it("filters out null values", () => {
    expect(buildQuery({ limit: 10, categoryId: null })).toBe("?limit=10");
  });

  it("filters out empty string values", () => {
    expect(buildQuery({ limit: 10, title: "" })).toBe("?limit=10");
  });
});
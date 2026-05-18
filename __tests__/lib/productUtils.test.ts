// __tests__/lib/productUtils.test.ts
// Tests for the product listing utility functions.

import { describe, it, expect } from "vitest";
import { parseSearchParams, toApiParams, PAGE_SIZE } from "@/lib/utils/parseSearchParams";
import { sortProducts } from "@/lib/utils/sortProducts";
import type { Product } from "@/types";

// ── parseSearchParams ─────────────────────────────────────────

describe("parseSearchParams()", () => {
  it("returns defaults for empty params", () => {
    const result = parseSearchParams({});
    expect(result.query).toBe("");
    expect(result.categoryId).toBeUndefined();
    expect(result.sort).toBe("default");
    expect(result.page).toBe(1);
  });

  it("parses search query", () => {
    expect(parseSearchParams({ q: "shoes" }).query).toBe("shoes");
  });

  it("parses categoryId as number", () => {
    expect(parseSearchParams({ categoryId: "3" }).categoryId).toBe(3);
  });

  it("ignores invalid categoryId", () => {
    expect(parseSearchParams({ categoryId: "abc" }).categoryId).toBeUndefined();
  });

  it("parses valid sort option", () => {
    expect(parseSearchParams({ sort: "price_asc" }).sort).toBe("price_asc");
  });

  it("falls back to default for invalid sort", () => {
    expect(parseSearchParams({ sort: "invalid" }).sort).toBe("default");
  });

  it("parses page number", () => {
    expect(parseSearchParams({ page: "3" }).page).toBe(3);
  });

  it("clamps page to minimum 1", () => {
    expect(parseSearchParams({ page: "-1" }).page).toBe(1);
  });
});

// ── toApiParams ───────────────────────────────────────────────

describe("toApiParams()", () => {
  it("converts page to offset correctly", () => {
    const params = toApiParams(parseSearchParams({ page: "2" }));
    expect(params.offset).toBe(PAGE_SIZE); // page 2 = skip PAGE_SIZE items
  });

  it("sets limit to PAGE_SIZE", () => {
    const params = toApiParams(parseSearchParams({}));
    expect(params.limit).toBe(PAGE_SIZE);
  });
});

// ── sortProducts ──────────────────────────────────────────────

const makeProduct = (id: number, title: string, price: number): Product => ({
  id, title, price,
  description: "",
  images: [],
  category: { id: 1, name: "Test", image: "" },
});

const products = [
  makeProduct(1, "Zebra Bag",  50),
  makeProduct(2, "Apple Watch", 200),
  makeProduct(3, "Mango Shirt", 30),
];

describe("sortProducts()", () => {
  it("does not mutate the original array", () => {
    const original = [...products];
    sortProducts(products, "price_asc");
    expect(products).toEqual(original);
  });

  it("sorts by price ascending", () => {
    const sorted = sortProducts(products, "price_asc");
    expect(sorted.map((p) => p.price)).toEqual([30, 50, 200]);
  });

  it("sorts by price descending", () => {
    const sorted = sortProducts(products, "price_desc");
    expect(sorted.map((p) => p.price)).toEqual([200, 50, 30]);
  });

  it("sorts by name A→Z", () => {
    const sorted = sortProducts(products, "name_asc");
    expect(sorted.map((p) => p.title)).toEqual(["Apple Watch", "Mango Shirt", "Zebra Bag"]);
  });

  it("returns original order for default sort", () => {
    const sorted = sortProducts(products, "default");
    expect(sorted.map((p) => p.id)).toEqual([1, 2, 3]);
  });
});
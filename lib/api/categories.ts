// lib/api/categories.ts
// ─────────────────────────────────────────────────────────────
// All category-related API calls.
//
// Categories change very rarely, so we use long revalidation
// times (ISR) to cache them aggressively.
// ─────────────────────────────────────────────────────────────

import { platziGet, platziPost, platziPut, platziDelete } from "./platzi";
import type { Category, ApiResult } from "@/types";

// ── Get all categories ────────────────────────────────────────
// Used by: home page categories section, filter panels
// Cached for 1 hour — categories rarely change

export async function getCategories(): Promise<ApiResult<Category[]>> {
  return platziGet<Category[]>("/categories", {
    revalidate: 3600,
  });
}

// ── Get a single category by ID ───────────────────────────────
// Used by: /categories/[id] page

export async function getCategoryById(
  id: number
): Promise<ApiResult<Category>> {
  return platziGet<Category>(`/categories/${id}`, {
    revalidate: 3600,
  });
}

// ── Admin: Create a category ──────────────────────────────────

export async function createCategory(data: {
  name: string;
  image: string;
}): Promise<ApiResult<Category>> {
  return platziPost<Category>("/categories/", data);
}

// ── Admin: Update a category ──────────────────────────────────

export async function updateCategory(
  id: number,
  data: Partial<{ name: string; image: string }>
): Promise<ApiResult<Category>> {
  return platziPut<Category>(`/categories/${id}`, data);
}

// ── Admin: Delete a category ──────────────────────────────────

export async function deleteCategory(
  id: number
): Promise<ApiResult<Category>> {
  return platziDelete<Category>(`/categories/${id}`);
}
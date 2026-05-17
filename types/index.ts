// types/index.ts
// ─────────────────────────────────────────────────────────────
// Shared TypeScript interfaces for the KenaKata storefront.
// These mirror the Platzi Fake Store API response shapes.
// Reference: https://fakeapi.platzi.com/
// ─────────────────────────────────────────────────────────────

// ── Category ──────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  image: string;
  // The API returns creationAt / updatedAt on some endpoints
  creationAt?: string;
  updatedAt?: string;
}

// ── Product ───────────────────────────────────────────────────

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
  creationAt?: string;
  updatedAt?: string;
}

// ── User / Auth ───────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // only present on register payload, never stored
  role: "customer" | "admin";
  avatar: string;
  creationAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

// ── API query params ──────────────────────────────────────────

export interface ProductsQueryParams {
  limit?: number;
  offset?: number;
  title?: string;       // search by title (contains)
  price?: number;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
}

// ── Cart (local state — not from API) ────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
}

// ── API response wrapper ──────────────────────────────────────
// Used internally in platzi.ts for typed fetch results.

export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };
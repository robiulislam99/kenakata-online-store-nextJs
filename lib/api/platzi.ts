// lib/api/platzi.ts
// ─────────────────────────────────────────────────────────────
// Core typed fetch wrapper for the Platzi Fake Store API.
//
// WHY THIS FILE EXISTS:
//   Every API call in the app goes through this single wrapper.
//   This means error handling, base URL, and default options
//   are defined in ONE place. If the API base URL changes, you
//   change one constant — not 30 fetch() calls scattered around.
//
// USAGE:
//   import { platziGet, platziPost } from "@/lib/api/platzi";
//   const { data, error } = await platziGet<Product[]>("/products");
// ─────────────────────────────────────────────────────────────

import type { ApiResult } from "@/types";

// ── Base URL ──────────────────────────────────────────────────
// Reads from environment. Falls back to the real API URL so the
// app doesn't crash if .env.local is missing during development.

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.escuelajs.co/api/v1";

// ── Core fetch wrapper ────────────────────────────────────────

async function platzyFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResult<T>> {
  const url = `${BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Surface the HTTP status as a readable error string
      const errorText = await response.text().catch(() => response.statusText);
      return { data: null, error: `HTTP ${response.status}: ${errorText}` };
    }

    // Handle 204 No Content (DELETE responses)
    if (response.status === 204) {
      return { data: null as T, error: null };
    }

    const data: T = await response.json();
    return { data, error: null };
  } catch (err) {
    // Network error or JSON parse error
    const message = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: message };
  }
}

// ── HTTP method helpers ───────────────────────────────────────
// These are the functions the rest of the app imports.
// They keep call sites clean — no need to pass method/headers
// every time.

export async function platziGet<T>(
  path: string,
  nextOptions?: RequestInit["next"]
): Promise<ApiResult<T>> {
  return platzyFetch<T>(path, { next: nextOptions });
}

export async function platziPost<T>(
  path: string,
  body: unknown
): Promise<ApiResult<T>> {
  return platzyFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function platziPut<T>(
  path: string,
  body: unknown
): Promise<ApiResult<T>> {
  return platzyFetch<T>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function platziDelete<T>(path: string): Promise<ApiResult<T>> {
  return platzyFetch<T>(path, { method: "DELETE" });
}

// ── Query string builder ──────────────────────────────────────
// Converts a plain object into a URL query string,
// filtering out undefined/null values automatically.
//
// Example:
//   buildQuery({ limit: 10, offset: 0, title: undefined })
//   → "?limit=10&offset=0"

export function buildQuery(
  params: Record<string, string | number | undefined | null>
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}
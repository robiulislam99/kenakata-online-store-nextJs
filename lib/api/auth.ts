// lib/api/auth.ts
// ─────────────────────────────────────────────────────────────
// Authentication API calls — login, register, token refresh,
// and user profile fetching.
//
// IMPORTANT: These functions run on the SERVER (in route
// handlers and server components). They never run in the
// browser directly. The browser talks to our own Next.js
// API routes, which in turn call these functions.
//
// WHY? Because we store the JWT in an httpOnly cookie via
// our route handler — the browser can never read or steal it.
// ─────────────────────────────────────────────────────────────

import { platziPost, platziGet } from "./platzi";
import type {
  User,
  LoginPayload,
  AuthTokens,
  RegisterPayload,
  ApiResult,
} from "@/types";

const API_BASE =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://api.escuelajs.co/api/v1";

// ── Login ─────────────────────────────────────────────────────
export async function loginUser(
  payload: LoginPayload
): Promise<ApiResult<AuthTokens>> {
  return platziPost<AuthTokens>("/auth/login", payload);
}

// ── Register ──────────────────────────────────────────────────
export async function registerUser(
  payload: RegisterPayload
): Promise<ApiResult<User>> {
  return platziPost<User>("/users", payload);  // ← no trailing slash
}

// ── Get current user profile ──────────────────────────────────
export async function getUserProfile(
  accessToken: string
): Promise<ApiResult<User>> {
  try {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[getUserProfile] failed:", res.status, data);
      return { data: null, error: data?.message ?? "Failed to fetch profile" };
    }

    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network error";  // ← fix
    console.error("[getUserProfile] threw:", err);
    return { data: null, error: message };
  }
}

// ── Refresh access token ──────────────────────────────────────
export async function refreshAccessToken(
  refreshToken: string
): Promise<ApiResult<AuthTokens>> {
  return platziPost<AuthTokens>("/auth/refresh-token", { refreshToken });
}

// ── Verify a token ────────────────────────────────────────────
export async function verifyToken(
  token: string
): Promise<ApiResult<boolean>> {
  return platziPost<boolean>("/auth/verify-token", { token });
}
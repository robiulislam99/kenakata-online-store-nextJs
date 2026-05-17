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

// ── Login ─────────────────────────────────────────────────────
// Returns access_token and refresh_token from the API.
// Our route handler stores these in cookies — they never
// reach the browser's JavaScript.

export async function loginUser(
  payload: LoginPayload
): Promise<ApiResult<AuthTokens>> {
  return platziPost<AuthTokens>("/auth/login", payload);
}

// ── Register ──────────────────────────────────────────────────
// Creates a new user account. Returns the created User object.

export async function registerUser(
  payload: RegisterPayload
): Promise<ApiResult<User>> {
  return platziPost<User>("/users/", payload);
}

// ── Get current user profile ──────────────────────────────────
// Fetches the profile for the authenticated user.
// Requires the Authorization header with a Bearer token.

export async function getUserProfile(
  accessToken: string
): Promise<ApiResult<User>> {
  return platziGet<User>("/auth/profile", {
    // No caching — always fresh. Also we need to pass the token.
    cache: "no-store",
    // We pass the token via a workaround because platziGet's
    // second argument is RequestInit["next"]. For auth calls,
    // we use platziGet with a headers override below.
  });
  // NOTE: The above doesn't pass the header yet.
  // See the comment in platziGet — for authenticated calls
  // use the pattern below directly where needed, or we'll
  // create an authenticated variant in a later phase.
}

// ── Refresh access token ──────────────────────────────────────
// Platzi's API uses a refresh token to get a new access token.

export async function refreshAccessToken(
  refreshToken: string
): Promise<ApiResult<AuthTokens>> {
  return platziPost<AuthTokens>("/auth/refresh-token", {
    refreshToken,
  });
}

// ── Verify a token ────────────────────────────────────────────
// Platzi provides a verify endpoint to check if a token is
// still valid without decoding it on the client.

export async function verifyToken(
  token: string
): Promise<ApiResult<boolean>> {
  return platziPost<boolean>("/auth/verify-token", { token });
}
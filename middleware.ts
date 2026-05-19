// middleware.ts
// ─────────────────────────────────────────────────────────────
// PLACE THIS FILE AT: kenakat/middleware.ts
// (project root, same level as app/, not inside app/)
//
// Next.js Middleware runs on the Edge before every matched request.
//
// PROTECTED ROUTES:
//   /admin/*   → must be logged in AND have role=admin
//   /orders    → must be logged in
//   /account   → must be logged in
//
// AUTH ROUTES (redirect away if already logged in):
//   /login     → redirect to / if already authenticated
//   /register  → redirect to / if already authenticated
//
// HOW IT READS AUTH:
//   We set two cookies on login (in auth-context.tsx):
//     kenakat-auth-token  — the JWT access token
//     kenakat-user-role   — "admin" or "customer"
//   Middleware reads these cookies to determine auth state.
//   No database call — pure cookie check on the Edge.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/account", "/orders"];
const ADMIN_ROUTES     = ["/admin"];
const AUTH_ROUTES      = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken  = request.cookies.get("kenakat-auth-token")?.value;
  const userRole   = request.cookies.get("kenakat-user-role")?.value;
  const isLoggedIn = !!authToken;
  const isAdmin    = userRole === "admin";

  // ── Already logged in → redirect away from auth pages ────
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ── Admin routes ──────────────────────────────────────────
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (!isAdmin) {
      // Logged in but not admin
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // ── Protected routes ──────────────────────────────────────
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - /api/* (all API routes — handle auth themselves)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|api).*)",
  ],
};
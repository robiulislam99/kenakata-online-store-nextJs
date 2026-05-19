# KenaKata — Modern E-Commerce Storefront

> Capstone project — Next.js 15 App Router · TypeScript · Tailwind CSS v4
> Built on the [Platzi Fake Store API](https://fakeapi.platzi.com/)

---

## 🚀 Live Demo

**[kenakatashop.netify.app](https://kenakatashop.netlify.app/** 


**Demo credentials**
| Role | Email | Password |
|---|---|---|
| Customer | `john@mail.com` | `changeme` |
| Admin | `admin@mail.com` | `admin123` |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/robiulislam99/kenakata-online-store-nextJs.git
cd kenakata-online-store-nextJs

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local — see Environment Variables section below

# 4. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

```bash
# Run tests
npx vitest run

# Run tests in watch mode
npx vitest
```

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | Platzi API base URL. Default: `https://api.escuelajs.co/api/v1` |
| `AUTH_SECRET` | ✅ | Secret for signing tokens. Generate: `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | ✅ | App public URL. Dev: `http://localhost:3000` |

---

## Project Overview

KenaKata is a production-style e-commerce storefront demonstrating modern Next.js 15 patterns. It covers the full shopping lifecycle — browsing, cart, checkout, authentication, and admin management — built with scalable architecture and clean separation of concerns.

### Feature Set

| Area | Features |
|---|---|
| **Public storefront** | Home page with hero + featured products + categories, ISR caching |
| **Product listing** | SSR with URL-driven search, filter by category + price, sort, pagination |
| **Product detail** | ISR page, image gallery, add to cart, related products |
| **Cart** | Persistent cart via Zustand + localStorage, qty controls, clear cart |
| **Checkout** | Multi-section form, Zod validation, mock payment flow with state machine |
| **Authentication** | Login, register, session persistence, JWT cookie, logout |
| **Protected routes** | Middleware on Edge, role-based access (admin vs customer) |
| **UI/UX** | Dark/light mode, responsive layout, skeleton loaders, error boundaries |

---

## Architecture

### Folder Structure

```
kenakat/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout — fonts, ThemeProvider, AuthProvider
│   ├── globals.css               # Tailwind v4 import, CSS variables, @theme block
│   ├── (shop)/                   # Route group — Navbar + Footer layout
│   │   ├── page.tsx              # Home (SSG + ISR)
│   │   ├── products/
│   │   │   ├── page.tsx          # Product listing (SSR)
│   │   │   └── [id]/page.tsx     # Product detail (ISR)
│   │   ├── categories/[id]/      # Category page (ISR)
│   │   └── cart/
│   │       ├── page.tsx          # Cart (CSR)
│   │       └── checkout/page.tsx # Checkout (CSR)
│   ├── (auth)/                   # Route group — minimal centered layout
│   │   ├── login/page.tsx        # Login (SSR)
│   │   └── register/page.tsx     # Register (SSR)
│   ├── (admin)/                  # Route group — sidebar layout, admin only
│   │   ├── layout.tsx            # Admin sidebar
│   │   ├── dashboard/page.tsx    # Overview stats (SSR)
│   │   ├── products/             # Product CRUD (SSR)
│   │   ├── categories/           # Category CRUD (SSR)
│   │   └── users/                # User listing (SSR)
│   └── api/
│       └── auth/                 # Route handlers — login, register proxy
├── components/
│   ├── ui/                       # Primitives — Button, Badge, Skeleton, Pagination…
│   ├── layout/                   # Navbar, Footer, NavLinks, MobileMenu, UserMenu, CartNavIcon
│   ├── home/                     # HeroSection, FeaturedProducts, CategoriesSection
│   ├── product/                  # ProductCard, ProductGrid, ProductGallery, FilterPanel…
│   ├── cart/                     # CartItem, CartSummary, EmptyCart
│   ├── checkout/                 # CheckoutForm, ShippingSection, PaymentSection, OrderSuccess
│   ├── auth/                     # LoginForm, RegisterForm
│   └── admin/                    # DataTable, ProductForm, AdminNav, DeleteButton…
├── lib/
│   ├── api/                      # Typed fetch wrappers — platzi.ts, products.ts, auth.ts…
│   ├── store/                    # Zustand stores — cart.store.ts, auth.store.ts
│   ├── hooks/                    # useCart, useAuth
│   ├── schemas/                  # Zod schemas — checkout.schema.ts, auth.schema.ts
│   ├── utils/                    # cn, formatCurrency, parseSearchParams, sortProducts
│   └── contexts/                 # ThemeProvider, AuthContext
├── types/
│   └── index.ts                  # Shared TypeScript interfaces
├── middleware.ts                 # Edge middleware — route protection
└── __tests__/                    # Vitest unit tests
```

### Component Architecture — Server + Client Islands

The most important architectural pattern in this project is the **server/client island model**. Server components are the default. Client components (`"use client"`) are used only when browser APIs are needed.

```
Navbar (server)
├── NavLinks      "use client"  — usePathname() for active state
├── ThemeToggle   "use client"  — useTheme() for dark/light toggle
├── CartNavIcon   "use client"  — useCartStore() for live badge count
├── UserMenu      "use client"  — useAuthContext() for login state
└── MobileMenu    "use client"  — useState() for hamburger open/close

ProductDetailPage (server / ISR)
├── ProductGallery   "use client"  — useState for selected image
├── ProductInfo      server        — pure static HTML
│   └── AddToCartButton "use client" — reads/writes Zustand cart
└── RelatedProducts  server async  — fetches from API inside Suspense
```

This means most HTML is generated on the server. Only interactive islands ship JavaScript to the browser.

---

## Rendering Strategy Decisions

Every rendering decision is a deliberate tradeoff between freshness, speed, and SEO.

### SSG + ISR — Home page (`/`)

**Strategy**: Generated at build time, revalidated every hour.

```typescript
export const revalidate = 3600;
```

**Why**: The home page is identical for every visitor. Serving pre-built HTML from a CDN gives the fastest possible TTFB and the best Lighthouse score. ISR means new featured products appear within an hour without a full redeploy.

**Streaming SSR**: The hero renders instantly (it's static). `FeaturedProducts` and `CategoriesSection` are async server components wrapped in `<Suspense>` — their data fetches run in parallel and stream in as they resolve.

```
GET /
  ↓ Hero renders instantly (static HTML)
  ↓ FeaturedProducts skeleton → products stream in  ↘ parallel
  ↓ CategoriesSection skeleton → categories stream in ↗
```

---

### SSR — Product listing (`/products`)

**Strategy**: Server-rendered on every request. No caching.

**Why**: The listing page reads `searchParams` from the URL (`?q=shoes&categoryId=1&sort=price_asc&page=2`). Every combination produces a different page — there is no single static version. SSR lets the server read the URL, call the Platzi API with the correct filters, and return pre-rendered HTML in one round trip. The URL is shareable, bookmarkable, and works without JavaScript.

```
URL: /products?q=shoes&sort=price_asc&page=2
  → parseSearchParams() → typed params
  → Promise.all([getProducts(params), getCategories()])
  → Both fetches run in parallel
  → Pre-rendered HTML returned to browser
```

---

### ISR — Product detail (`/products/[id]`)

**Strategy**: Pre-rendered at build time for first 20 products. On-demand for others. Revalidated every 24 hours.

```typescript
export const revalidate = 86400;

export async function generateStaticParams() {
  const ids = await getProductIdsForStaticPaths(20);
  return ids.map((id) => ({ id: String(id) }));
}
```

**Why**: Product data rarely changes. Pre-rendering gives excellent performance (no API round trip on load) with good SEO (full HTML in the response). The 24-hour window is acceptable for product data. `generateStaticParams` pre-builds only the first 20 to keep build times reasonable — other products are generated on first request and then cached.

---

### CSR — Cart and Checkout

**Strategy**: Pure client-side rendering. No server data involved.

**Why**: Cart data lives in Zustand + localStorage. The server has no knowledge of what's in any user's cart. Attempting SSR here would require session-aware server fetching with no benefit — the cart is user-specific, not SEO-relevant, and ephemeral by design. CSR is the correct and intentional choice.

---

### SSR — Auth pages (`/login`, `/register`)

**Strategy**: Server-rendered. Middleware redirects authenticated users before the page renders.

**Why**: Auth pages need to check if the user is already logged in (via cookie in the request) and redirect to home if so. This check happens in middleware on the Edge — zero flash, no hydration mismatch, no client-side redirect delay.

---

### SSR — Admin pages (`/admin/*`)

**Strategy**: Server-rendered on every request. Protected by middleware.

**Why**: Admin data must always be fresh (no stale cached state when managing products). Middleware verifies the `kenakat-user-role` cookie before the page renders — non-admin users are redirected before any admin HTML is generated.

---

## Tradeoffs Made

| Decision | Chosen | Alternative | Reason |
|---|---|---|---|
| **Auth token storage** | `document.cookie` (set client-side) + Zustand | httpOnly cookie via route handler | Demo simplicity. In production, httpOnly cookies prevent XSS token theft. Documented in code. |
| **Cart storage** | Zustand + localStorage | Server-side cart (DB) | No backend. Zustand `persist` middleware gives localStorage sync for free. Cart lost on private browsing. |
| **Platzi API sort** | Client-side sort after fetch | Server-side sort param | Platzi API doesn't support `sort` query params reliably. We fetch and sort in memory. |
| **ISR revalidation** | Time-based (`revalidate: N`) | On-demand (webhook trigger) | Platzi has no webhooks. Time-based is the practical choice. `/api/revalidate` available for manual trigger. |
| **Image handling** | `next/image` with fallback URL | Native `<img>` | `next/image` gives automatic WebP, lazy loading, and CLS prevention. Fallback handles Platzi's broken URLs. |
| **No real payment** | Mock payment flow (UI state machine) | Stripe integration | Out of scope for the API-layer capstone. The UX demonstrates the pattern correctly. |
| **Zustand over Context** | Zustand with selectors | React Context | Context re-renders the whole tree. Zustand selectors mean only subscribed components re-render. |

---

## Performance Considerations

### Image optimization

- Every `<img>` uses `next/image` with explicit `sizes` prop to generate correct `srcset`
- `priority={true}` on hero image and first 4 product cards (above the fold)
- Fallback URL for broken Platzi images prevents layout shift
- `remotePatterns` in `next.config.ts` allowlists only trusted image domains

### Bundle size

- Dynamic imports (`next/dynamic`) used for heavy modals and cart drawer
- Client components are extracted as small islands — most HTML is static server output
- No large icon library — inline SVG for all icons keeps bundle lean

### Caching strategy

| Route | Cache | TTL |
|---|---|---|
| `/` | CDN (ISR) | 1 hour |
| `/products/[id]` | CDN (ISR) | 24 hours |
| `/categories` | CDN (ISR) | 1 hour |
| `/products` | No cache (SSR) | Per request |
| `/admin/*` | No cache (SSR) | Per request |

### Streaming

Home page and product detail use `<Suspense>` boundaries so the HTML shell streams immediately. The browser starts parsing and rendering before all data fetches complete.

### Fonts

Next.js self-hosts Geist Sans and Geist Mono at build time via `next/font/google`. No external font request at runtime — eliminates a render-blocking resource.

---

## Challenges Faced

### 1. Tailwind CSS v4 breaking changes

`create-next-app` installed Tailwind v4 while the initial CSS used v3 syntax (`@tailwind base`, `@layer base`). This caused a build error on first run.

**Solution**: Migrated to v4 syntax — `@import "tailwindcss"`, `@custom-variant dark` for dark mode, and a `@theme {}` block to register CSS variables as utility classes. Documented in the codebase.

### 2. Platzi API image data quality

Platzi's product images are sometimes broken URLs, `data:` URIs, or JSON-encoded arrays stored as strings (e.g. `'["https://..."]'`).

**Solution**: Built a `parseImages()` utility that handles all three cases and falls back to a placeholder URL. Applied consistently in `ProductCard`, `ProductGallery`, and `CartItem`.

### 3. Hydration mismatches with auth and cart

Server renders the page without knowing cart contents or auth state (both are in localStorage). Client hydrates with actual data — React warns about the mismatch.

**Solution**: `mounted` state pattern in `CartNavIcon` and `UserMenu` — render a placeholder on first render, then show real data after `useEffect` fires. `suppressHydrationWarning` on `<html>` for the theme.

### 4. Next.js 15 async searchParams and params

Next.js 15 changed `searchParams` and `params` to be `Promise<>` types in page components.

**Solution**: All page components `await` their params:
```typescript
const { id } = await params;
const rawParams = await searchParams;
```

### 5. useSearchParams() requires Suspense boundary

Client components using `useSearchParams()` throw during SSR without a `<Suspense>` wrapper, causing the entire page to crash.

**Solution**: Wrapped every client component that uses `useSearchParams()` in `<Suspense>` in the parent server page.

### 6. Platzi pagination has no total count

The Platzi API returns an array of results but no `total` count, making it impossible to know exact page counts.

**Solution**: Inferred pagination — if the API returns a full page (`length === PAGE_SIZE`), there are likely more pages. Displayed conservative estimates with the caveat that the last page may be empty.

---

## Future Improvements

### Short term
- [ ] Add admin dashboard
- [ ] Replace `document.cookie` auth with httpOnly cookies set by route handlers for XSS protection
- [ ] Add Playwright E2E tests covering the full purchase flow
- [ ] Wishlist feature — persist to localStorage alongside cart
- [ ] Product reviews — mock review data with star ratings

### Medium term
- [ ] Real payment processing via Stripe
- [ ] Cart sync across devices (requires authenticated server-side cart)
- [ ] Infinite scroll alternative to pagination on the product listing
- [ ] Optimistic UI for admin mutations using TanStack Query
- [ ] Storybook component library documentation

### Long term
- [ ] Replace Platzi Fake API with a real backend (Supabase or PlanetScale)
- [ ] Server Actions for all admin mutations (remove client-side API calls)
- [ ] Docker-based deployment with multi-stage build
- [ ] CI/CD pipeline with GitHub Actions (lint, test, deploy)
- [ ] Internationalisation (i18n) with `next-intl`

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15 (latest) | Framework — App Router, SSR, ISR, SSG |
| TypeScript | 5 | Type safety throughout |
| Tailwind CSS | 4 | Utility-first styling with dark mode |
| Zustand | Latest | Client state — cart and auth stores |
| Zod | Latest | Runtime validation + TypeScript inference |
| React Hook Form | Latest | Form state management |
| @hookform/resolvers | Latest | Zod ↔ RHF bridge |
| next-themes | Latest | Dark/light mode toggle |
| Vitest | Latest | Unit test runner |
| Testing Library | Latest | React component testing |

---

## Git Workflow

```
main          ← production-ready, protected branch
dev           ← integration branch, all features merge here first
feature/*     ← one branch per feature
hotfix/*      ← urgent production fixes
```

### Branch history

```
main
└── dev
    ├── feature/foundation          Phase 1 — scaffold + API layer
    ├── feature/layout              Phase 2a — Navbar, ThemeProvider, layouts
    ├── feature/home-page           Phase 2b — Hero, FeaturedProducts, Categories
    ├── feature/product-listing     Phase 3 — SSR listing, search, filter, sort
    ├── feature/product-detail      Phase 4 — ISR detail, gallery, add to cart
    ├── feature/cart-checkout       Phase 5 — cart, checkout form, mock payment
    ├── feature/auth                Phase 6 — login, register, middleware
    └── feature/admin-dashboard     Phase 7 — admin CRUD dashboard
```

### Commit message format

```
type(scope): short description

- bullet detail
- another detail
```

Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`

---

## API Reference

Base URL: `https://api.escuelajs.co/api/v1`

| Endpoint | Method | Used for |
|---|---|---|
| `/products` | GET | Product listing, home featured |
| `/products/:id` | GET | Product detail |
| `/products/` | POST | Admin create product |
| `/products/:id` | PUT | Admin update product |
| `/products/:id` | DELETE | Admin delete product |
| `/categories` | GET | Category listing, filter panel |
| `/categories/` | POST | Admin create category |
| `/categories/:id` | PUT | Admin update category |
| `/categories/:id` | DELETE | Admin delete category |
| `/categories/:id/products` | GET | Related products |
| `/users` | GET | Admin user listing |
| `/users/` | POST | Register new user |
| `/auth/login` | POST | Login — returns JWT tokens |
| `/auth/profile` | GET | Get current user profile |
| `/auth/refresh-token` | POST | Refresh expired access token |

---

## Testing

```bash
# Run all tests once
npx vitest run

# Watch mode during development
npx vitest

# Coverage report
npx vitest run --coverage
```

### Test coverage areas

| File | What is tested |
|---|---|
| `lib/utils/cn.ts` | Class merging, conflict resolution, falsy filtering |
| `lib/utils/formatCurrency.ts` | USD formatting, decimals, large numbers |
| `lib/api/platzi.ts` | `buildQuery` — param filtering, query string building |
| `lib/utils/parseSearchParams.ts` | URL param parsing, defaults, coercion, clamping |
| `lib/utils/sortProducts.ts` | All sort options, immutability, edge cases |
| `lib/store/cart.store.ts` | Add, remove, update, clear, derived values |
| `lib/schemas/checkout.schema.ts` | All field validations, card formats |
| `lib/schemas/auth.schema.ts` | Login/register validation, password match |

---

## Deployment

### Netify (recommended)

```

### Environment variables for production

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.escuelajs.co/api/v1
AUTH_SECRET=<generate with: openssl rand -base64 32>
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## Project Structure Decisions

### Why route groups `(shop)`, `(auth)`, `(admin)`?

Route groups (parentheses in folder name) let different sections share different layouts without adding URL path segments.

- `(shop)` → full Navbar + Footer, URL: `/products` not `/shop/products`
- `(auth)` → minimal centered layout for forms, URL: `/login` not `/auth/login`
- `(admin)` → sidebar layout, URL: `/admin/dashboard`

### Why `lib/api/platzi.ts` as a single fetch wrapper?

All 30+ API calls in the app go through `platziGet`, `platziPost`, `platziPut`, and `platziDelete`. This means error handling, base URL, and TypeScript types are defined once. Changing the API base URL is a one-line change.

### Why component size limit of 200 lines?

A component over 200 lines is usually doing too much. Enforcing this limit forces proper separation — a `CheckoutForm` at 300 lines becomes `CheckoutForm` + `ShippingSection` + `PaymentSection` + `FormField`, each with a single clear responsibility.

---

*Built with ❤️ as a capstone project for the W3 Engineers Next.js course.*

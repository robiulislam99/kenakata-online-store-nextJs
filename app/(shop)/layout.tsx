// app/(shop)/layout.tsx
// ─────────────────────────────────────────────────────────────
// SHOP LAYOUT — SERVER COMPONENT
//
// WHY A ROUTE GROUP LAYOUT?
//   The (shop) route group wraps all public storefront pages:
//   /, /products, /products/[id], /categories, /cart, /checkout
//
//   These pages all share the Navbar + Footer shell.
//   By putting this layout in (shop)/, we avoid repeating
//   <Navbar> and <Footer> in every single page file.
//
//   The parentheses in (shop) mean it's a route GROUP —
//   it does NOT add "/shop" to the URL.
//   So app/(shop)/products/page.tsx → /products ✓
//      NOT /shop/products ✗
//
// RENDERING: Server component. Runs on every request for any
// page inside (shop)/. Never re-renders on the client.
// ─────────────────────────────────────────────────────────────

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // flex flex-col + min-h-screen ensures the footer sticks to
    // the bottom even on short pages (footer is mt-auto in Footer).
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
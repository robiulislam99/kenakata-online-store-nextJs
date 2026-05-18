// components/product/product-info.tsx
// ─────────────────────────────────────────────────────────────
// ProductInfo — SERVER COMPONENT.
// Renders all static product data: title, price, description,
// category, and the metadata strip.
//
// The AddToCartButton (client) is imported separately and
// placed by the parent page — this component stays pure server.
//
// COMPONENT SIZE: ~90 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils/formatCurrency";
import type { Product } from "@/types";

interface ProductInfoProps {
  product:  Product;
  children?: React.ReactNode; // slot for AddToCartButton (client)
}

export function ProductInfo({ product, children }: ProductInfoProps) {
  return (
    <div className="flex flex-col gap-6">

      {/* ── Category breadcrumb ──────────────────────────── */}
      <div className="flex items-center gap-2">
        <Link
          href="/products"
          className="text-sm text-foreground-muted hover:text-foreground transition-colors focus-ring rounded"
        >
          All Products
        </Link>
        <span className="text-foreground-muted" aria-hidden="true">›</span>
        <Link
          href={`/products?categoryId=${product.category.id}`}
          className="text-sm text-foreground-muted hover:text-foreground transition-colors focus-ring rounded"
        >
          {product.category.name}
        </Link>
      </div>

      {/* ── Title ────────────────────────────────────────── */}
      <div>
        <Badge variant="primary" className="mb-3">
          {product.category.name}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-foreground leading-tight">
          {product.title}
        </h1>
      </div>

      {/* ── Price ─────────────────────────────────────────── */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-primary">
          {formatPrice(product.price)}
        </span>
        {/* Mock original price for visual appeal */}
        <span className="text-lg text-foreground-muted line-through">
          {formatPrice(product.price * 1.2)}
        </span>
        <Badge variant="accent" className="ml-1">Save 17%</Badge>
      </div>

      {/* ── Description ──────────────────────────────────── */}
      <div>
        <h2 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-2">
          Description
        </h2>
        <p className="text-foreground-muted leading-relaxed text-sm">
          {product.description}
        </p>
      </div>

      {/* ── AddToCartButton slot ──────────────────────────── */}
      {/* This is where the client component is injected by the page */}
      <div className="pt-2 border-t border-border">
        {children}
      </div>

      {/* ── Metadata strip ────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-4 pt-2">
        <MetaItem icon="🚚" label="Free shipping" sub="On orders over $50" />
        <MetaItem icon="↩️"  label="Easy returns"  sub="30-day return policy" />
        <MetaItem icon="🔒" label="Secure payment" sub="Encrypted checkout" />
      </div>
    </div>
  );
}

function MetaItem({ icon, label, sub }: { icon: string; label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-1 p-3 rounded-xl bg-background-secondary">
      <span className="text-xl" aria-hidden="true">{icon}</span>
      <span className="text-xs font-semibold text-foreground">{label}</span>
      <span className="text-xs text-foreground-muted">{sub}</span>
    </div>
  );
}
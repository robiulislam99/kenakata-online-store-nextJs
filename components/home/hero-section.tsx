// components/home/hero-section.tsx
// ─────────────────────────────────────────────────────────────
// HeroSection — full-width banner at the top of the home page.
//
// RENDERING: SERVER COMPONENT — no interactivity needed here.
// Static HTML, rendered at build time with the rest of the page.
//
// DESIGN DECISIONS:
//   - Gradient background uses CSS variables so it adapts to
//     light/dark mode automatically.
//   - Two CTAs: primary (shop now) and secondary (explore).
//   - Decorative blobs use aria-hidden so screen readers skip them.
//
// COMPONENT SIZE: ~85 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section
      aria-label="Welcome banner"
      className="relative overflow-hidden bg-background-secondary"
    >
      {/* ── Decorative gradient blobs ───────────────────── */}
      {/* These are purely visual — hidden from screen readers */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* ── Hero content ────────────────────────────────── */}
      <div className="container-page relative py-20 md:py-32">
        <div className="max-w-2xl">

          {/* Eyebrow label */}
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
            New arrivals 2025
          </p>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
            Discover{" "}
            <span className="text-primary">
              KenaKata
            </span>
            <br />
            Modern Shopping
          </h1>

          {/* Sub-headline */}
          <p className="mt-6 text-lg text-foreground-muted max-w-xl leading-relaxed">
            Explore thousands of products across every category.
            Fast delivery, easy returns, and prices you will love.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <Link href="/products">
                Shop Now
                <ArrowRightIcon />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/categories">
                Explore Categories
              </Link>
            </Button>
          </div>

          {/* Social proof strip */}
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-foreground-muted">
            <StatItem value="200+" label="Products" />
            <Divider />
            <StatItem value="5" label="Categories" />
            <Divider />
            <StatItem value="Free" label="Shipping over $50" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Sub-components ────────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <span>
      <strong className="text-foreground font-semibold">{value}</strong>{" "}
      {label}
    </span>
  );
}

function Divider() {
  return <span aria-hidden="true" className="text-border">·</span>;
}

function ArrowRightIcon() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
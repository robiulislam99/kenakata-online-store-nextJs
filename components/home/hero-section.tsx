// components/home/hero-section.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";

// ── Promo card data ───────────────────────────────────────────
const PROMO_CARDS = [
  {
    id: 1,
    badge: "LIMITED TIME",
    badgeColor: "bg-yellow-400 text-yellow-900",
    category: "Sustainable Sneakers",
    headline: ["20% OFF", "ALL SNEAKERS"],
    imagePlaceholderBg: "from-stone-700 to-stone-500",
    image: "/images/promos/sneakers.jpeg",
  },
  {
    id: 2,
    badge: "DEAL OF THE DAY",
    badgeColor: "bg-blue-400 text-blue-900",
    category: "Tech Accessories",
    headline: ["BUY 1 GET 1 50%", "OFF - TECH ESSENTIALS"],
    imagePlaceholderBg: "from-slate-700 to-slate-500",
    image: "/images/promos/tech.jpeg",
  },
  {
    id: 3,
    badge: "NEW ARRIVAL",
    badgeColor: "bg-green-400 text-green-900",
    category: "Home & Living",
    headline: ["UP TO 40% OFF", "HOME COLLECTION"],
    imagePlaceholderBg: "from-emerald-800 to-teal-600",
    image: "/images/promos/home.jpeg",
  },
];

// ── Main component ────────────────────────────────────────────
export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setActiveIndex(index);
        setAnimating(false);
      }, 300);
    },
    [animating]
  );

  // Auto-advance every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % PROMO_CARDS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = PROMO_CARDS[activeIndex];
  const peek = PROMO_CARDS[(activeIndex + 1) % PROMO_CARDS.length];

  return (
    <section
      aria-label="Welcome banner"
      className="relative overflow-hidden bg-background-secondary min-h-[540px]"
    >
      {/* ── Decorative blobs ──────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* ── Two-column layout ─────────────────────────── */}
      <div className="container-page relative py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Text content ──────────────────────── */}
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-4">
              New arrivals 2025
            </p>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Discover{" "}
              <span className="text-primary">KenaKata</span>
              <br />
              Modern Shopping
            </h1>

            <p className="mt-6 text-lg text-foreground-muted max-w-xl leading-relaxed">
              Explore thousands of products across every category.
              Fast delivery, easy returns, and prices you will love.
            </p>

            <div className="mt-8">
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRightIcon />
                </Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-foreground-muted">
              <StatItem value="200+" label="Products" />
              <Divider />
              <StatItem value="5" label="Categories" />
              <Divider />
              <StatItem value="Free" label="Shipping over $50" />
            </div>
          </div>

          {/* ── Right: Promo carousel ────────────────────── */}
          <div className="relative flex items-stretch gap-3 pb-8">

            {/* Main active card */}
            <div
              className={`
                relative flex-1 rounded-2xl overflow-hidden min-h-[320px]
                transition-all duration-300 ease-in-out
                ${animating ? "opacity-0 scale-95" : "opacity-100 scale-100"}
              `}
            >
              {/* Background image with fallback gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${current.imagePlaceholderBg}`}>
                <img
                  src={current.image}
                  alt={current.category}
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              {/* Overlay gradient for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Card content */}
              <div className="relative h-full flex flex-col justify-between p-6">
                <div>
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${current.badgeColor}`}
                  >
                    {current.badge}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                    {current.category}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
                    {current.headline[0]}
                    <br />
                    {current.headline[1]}
                  </h2>
                </div>
              </div>
            </div>

            {/* Peek card (next slide preview) */}
            <div
              className="relative w-28 rounded-2xl overflow-hidden cursor-pointer opacity-60 hover:opacity-80 transition-opacity duration-200 hidden md:block"
              onClick={() => goTo((activeIndex + 1) % PROMO_CARDS.length)}
              aria-label="Next offer"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${peek.imagePlaceholderBg}`}
              >
                <img
                  src={peek.image}
                  alt={peek.category}
                  className="w-full h-full object-cover opacity-80"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="relative h-full flex flex-col justify-between p-3">
                <span
                  className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${peek.badgeColor}`}
                >
                  {peek.badge}
                </span>
                <p className="text-xs font-black text-white leading-tight">
                  {peek.headline[0]}
                </p>
              </div>
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-1 left-0 flex gap-2">
              {PROMO_CARDS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-6 bg-primary"
                      : "w-1.5 bg-foreground-muted/40 hover:bg-foreground-muted"
                  }`}
                />
              ))}
            </div>
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
  return (
    <span aria-hidden="true" className="text-border">
      ·
    </span>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="ml-1"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
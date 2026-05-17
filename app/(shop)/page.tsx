// app/(shop)/page.tsx
// ─────────────────────────────────────────────────────────────
// HOME PAGE — placeholder until Phase 2b (Home Page build)
//
// RENDERING: SSG + ISR (revalidate: 3600)
// We export `revalidate` at the module level — Next.js reads
// this to know how often to regenerate this page's cache.
// ─────────────────────────────────────────────────────────────

export const revalidate = 3600; // regenerate at most once per hour

export default function HomePage() {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
        Welcome to{" "}
        <span className="text-primary">KenaKata</span>
      </h1>
      <p className="text-foreground-muted text-lg max-w-xl mx-auto">
        Your modern storefront. Home page coming in Phase 2b.
      </p>
      <p className="mt-6 text-sm text-foreground-muted">
        ✓ Navbar working &nbsp;·&nbsp; ✓ Dark mode working &nbsp;·&nbsp;
        ✓ Layouts working
      </p>
    </div>
  );
}
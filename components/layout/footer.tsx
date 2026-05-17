// components/layout/footer.tsx
// ─────────────────────────────────────────────────────────────
// FOOTER — SERVER COMPONENT
// Simple, clean footer. No client-side state needed here.
// COMPONENT SIZE: ~55 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";

const footerLinks = [
  {
    title: "Shop",
    links: [
      { href: "/products",          label: "All Products" },
      { href: "/categories",        label: "Categories" },
      { href: "/cart",              label: "Cart" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login",             label: "Login" },
      { href: "/register",          label: "Register" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background-secondary mt-auto">
      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-primary">Kena</span>
              <span className="text-foreground">Kata</span>
            </Link>
            <p className="mt-3 text-sm text-foreground-muted max-w-xs">
              A modern e-commerce storefront built with Next.js 15,
              TypeScript, and Tailwind CSS.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="
                        text-sm text-foreground-muted
                        hover:text-foreground
                        transition-colors duration-200
                        focus-ring rounded
                      "
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-foreground-muted">
            © {year} KenaKata. Built as a capstone project.
          </p>
          <p className="text-xs text-foreground-muted">
            Powered by{" "}
            <a
              href="https://fakeapi.platzi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline underline-offset-2"
            >
              Platzi Fake Store API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
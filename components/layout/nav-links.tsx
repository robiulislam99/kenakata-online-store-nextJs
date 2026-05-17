// components/layout/nav-links.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// WHY THIS IS A SEPARATE CLIENT COMPONENT:
//   usePathname() is a client-side hook — it reads the current
//   URL from the browser. The Navbar itself is a server component,
//   so we extract the links into this small client boundary.
//
//   This is the "client island" pattern:
//   - Navbar (server) renders structure, logo, theme toggle
//   - NavLinks (client) adds the active state highlight
//
// COMPONENT SIZE: ~60 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const links = [
  { href: "/",          label: "Home" },
  { href: "/products",  label: "Products" },
  { href: "/categories", label: "Categories" },
];

interface NavLinksProps {
  className?: string;
  onClick?: () => void;   // used by mobile menu to close on navigation
}

export function NavLinks({ className, onClick }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation">
      <ul className={cn("flex items-center", className)}>
        {links.map(({ href, label }) => {
          // A link is "active" if the pathname matches exactly (home)
          // or starts with the href (e.g. /products/123 highlights Products)
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onClick}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium",
                  "transition-colors duration-200",
                  "focus-ring",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
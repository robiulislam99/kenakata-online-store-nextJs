// components/layout/nav-links.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// NavLinks — desktop navigation links.
// UPDATED: Categories is now a CategoriesDropdown component.
//          Home and Products remain plain active links.
//
// Receives categories as props from the server Navbar component
// so the dropdown doesn't need to fetch data itself.
// ─────────────────────────────────────────────────────────────

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CategoriesDropdown } from "./categories-dropdown";
import { cn } from "@/lib/utils/cn";
import type { Category } from "@/types";

interface NavLinksProps {
  categories?: Category[];
  className?:  string;
  onClick?:    () => void;
}

export function NavLinks({ categories = [], className, onClick }: NavLinksProps) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav aria-label="Main navigation">
      <ul className={cn("flex items-center", className)}>

        {/* Home */}
        <li>
          <Link
            href="/"
            onClick={onClick}
            aria-current={isActive("/") ? "page" : undefined}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium",
              "transition-colors duration-200 focus-ring",
              isActive("/")
                ? "text-primary bg-primary/10"
                : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
            )}
          >
            Home
          </Link>
        </li>

        {/* Products */}
        <li>
          <Link
            href="/products"
            onClick={onClick}
            aria-current={isActive("/products") ? "page" : undefined}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium",
              "transition-colors duration-200 focus-ring",
              isActive("/products")
                ? "text-primary bg-primary/10"
                : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
            )}
          >
            Products
          </Link>
        </li>

        {/* Categories — dropdown (desktop only) */}
        <li className="hidden md:block">
          <CategoriesDropdown categories={categories} />
        </li>

        {/* Categories — plain link (mobile, inside MobileMenu) */}
        <li className="md:hidden">
          <Link
            href="/products"
            onClick={onClick}
            className={cn(
              "px-3 py-2 rounded-lg text-sm font-medium",
              "transition-colors duration-200 focus-ring",
              "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
            )}
          >
            Categories
          </Link>
        </li>

      </ul>
    </nav>
  );
}
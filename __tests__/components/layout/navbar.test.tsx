// __tests__/components/layout/navbar.test.tsx
// ─────────────────────────────────────────────────────────────
// Tests for the Navbar and NavLinks components.
// Run with: npx vitest run
// ─────────────────────────────────────────────────────────────

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavLinks } from "@/components/layout/nav-links";

// Mock next/navigation's usePathname since it only works
// inside a real Next.js app (not in tests)
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock next/link to render a plain <a> tag in tests
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("NavLinks", () => {
  it("renders all navigation links", () => {
    render(<NavLinks />);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Categories")).toBeInTheDocument();
  });

  it("marks the Home link as active on the home route", () => {
    render(<NavLinks />);

    const homeLink = screen.getByText("Home").closest("a");
    expect(homeLink).toHaveAttribute("aria-current", "page");
  });

  it("does NOT mark Products as active on the home route", () => {
    render(<NavLinks />);

    const productsLink = screen.getByText("Products").closest("a");
    expect(productsLink).not.toHaveAttribute("aria-current", "page");
  });

  it("links have correct href attributes", () => {
    render(<NavLinks />);

    expect(screen.getByText("Home").closest("a")).toHaveAttribute("href", "/");
    expect(screen.getByText("Products").closest("a")).toHaveAttribute("href", "/products");
    expect(screen.getByText("Categories").closest("a")).toHaveAttribute("href", "/categories");
  });
});
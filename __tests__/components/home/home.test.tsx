// __tests__/components/home/home.test.tsx
// ─────────────────────────────────────────────────────────────
// Tests for home page components.
// We test the pure/presentational parts — not the async data
// fetching (that's covered by integration/E2E tests).
// ─────────────────────────────────────────────────────────────

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next/link and next/image — they need the Next.js runtime
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <a href={href} {...props}>{children}</a>,
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) => <img src={src} alt={alt} />,  // eslint-disable-line @next/next/no-img-element
}));

// ── SectionHeader ─────────────────────────────────────────────
import { SectionHeader } from "@/components/ui/section-header";

describe("SectionHeader", () => {
  it("renders the title", () => {
    render(<SectionHeader title="Featured Products" />);
    expect(screen.getByText("Featured Products")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    render(<SectionHeader title="Test" subtitle="A subtitle" />);
    expect(screen.getByText("A subtitle")).toBeInTheDocument();
  });

  it("renders a link when href and linkLabel are provided", () => {
    render(
      <SectionHeader title="Test" href="/products" linkLabel="View all" />
    );
    const link = screen.getByText(/view all/i);
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/products");
  });

  it("does not render a link when href is not provided", () => {
    render(<SectionHeader title="Test" />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});

// ── ProductCard ───────────────────────────────────────────────
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types";

const mockProduct: Product = {
  id: 1,
  title: "Test Running Shoes",
  price: 99.99,
  description: "Great shoes for running.",
  images: ["https://picsum.photos/400/400"],
  category: {
    id: 1,
    name: "Shoes",
    image: "https://picsum.photos/200/200",
  },
};

describe("ProductCard", () => {
  it("renders product title", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Test Running Shoes")).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("$99.99")).toBeInTheDocument();
  });

  it("renders category badge", () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText("Shoes")).toBeInTheDocument();
  });

  it("links to the product detail page", () => {
    render(<ProductCard product={mockProduct} />);
    const links = screen.getAllByRole("link");
    expect(links.some((l) => l.getAttribute("href") === "/products/1")).toBe(true);
  });

  it("uses a fallback image when images array is empty", () => {
    const productNoImage = { ...mockProduct, images: [] };
    render(<ProductCard product={productNoImage} />);
    const img = screen.getByRole("img");
    expect(img.getAttribute("src")).toContain("placehold.co");
  });
});
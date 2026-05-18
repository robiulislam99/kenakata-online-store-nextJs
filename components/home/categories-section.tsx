// components/home/categories-section.tsx
// ─────────────────────────────────────────────────────────────
// CategoriesSection — async server component.
// Fetches all categories and renders them as clickable cards.
// Wrapped in its own Suspense boundary in the page.
//
// COMPONENT SIZE: ~90 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/api/categories";

export async function CategoriesSection() {
  const { data: categories, error } = await getCategories();

  if (error || !categories) {
    return (
      <div className="rounded-xl border border-border bg-background-secondary p-10 text-center">
        <p className="text-foreground-muted text-sm">
          Could not load categories right now.
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-background-secondary p-10 text-center">
        <p className="text-foreground-muted text-sm">No categories found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

// ── CategoryCard sub-component ────────────────────────────────
// Kept here (not a separate file) because it's only used in
// this section and is small enough not to warrant its own file.

import type { Category } from "@/types";

function CategoryCard({ category }: { category: Category }) {
  const imageUrl = getValidImage(category.image);

  return (
    <Link
      href={`/products?categoryId=${category.id}`}
      className="
        group relative flex flex-col items-center
        rounded-xl overflow-hidden border border-border
        bg-background-secondary
        hover:shadow-md hover:border-primary/40
        transition-all duration-300
        focus-ring
        p-4 gap-3
      "
    >
      {/* Category image */}
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-background border border-border flex-shrink-0">
        <Image
          src={imageUrl}
          alt={category.name}
          fill
          sizes="64px"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Category name */}
      <span className="text-sm font-medium text-foreground text-center leading-tight group-hover:text-primary transition-colors duration-200">
        {category.name}
      </span>
    </Link>
  );
}

// ── Helper ────────────────────────────────────────────────────

function getValidImage(image: string): string {
  const FALLBACK = "https://placehold.co/200x200/e2e8f0/94a3b8?text=Cat";
  if (!image || !image.startsWith("http")) return FALLBACK;
  return image;
}
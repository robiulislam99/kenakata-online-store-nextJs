// components/ui/section-header.tsx
// ─────────────────────────────────────────────────────────────
// SectionHeader — consistent heading style for every home
// page section. Keeps spacing and typography uniform.
//
// USAGE:
//   <SectionHeader
//     title="Featured Products"
//     subtitle="Hand-picked for you"
//     href="/products"
//     linkLabel="View all"
//   />
// ─────────────────────────────────────────────────────────────

import Link from "next/link";

interface SectionHeaderProps {
  title:       string;
  subtitle?:   string;
  href?:       string;
  linkLabel?:  string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel,
}: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between mb-6 md:mb-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-foreground-muted">{subtitle}</p>
        )}
      </div>

      {href && linkLabel && (
        <Link
          href={href}
          className="
            text-sm font-medium text-primary
            hover:text-primary/80
            transition-colors duration-200
            focus-ring rounded
            whitespace-nowrap ml-4
          "
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
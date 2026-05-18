// components/ui/pagination.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// Pagination — URL-driven page navigation.
// Updates ?page= param and preserves all other filters.
//
// COMPONENT SIZE: ~90 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

interface PaginationProps {
  currentPage:  number;
  totalPages:   number;
  className?:   string;
}

export function Pagination({ currentPage, totalPages, className }: PaginationProps) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    router.push(`${pathname}?${params.toString()}`);
    // Scroll back to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Build a page number array with ellipsis: [1, …, 4, 5, 6, …, 10]
  const pages = buildPageRange(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      {/* Previous */}
      <PageButton
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        ←
      </PageButton>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === "…" ? (
          <span key={`ellipsis-${i}`} className="w-9 text-center text-foreground-muted text-sm">
            …
          </span>
        ) : (
          <PageButton
            key={page}
            onClick={() => goTo(page as number)}
            isActive={page === currentPage}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </PageButton>
        )
      )}

      {/* Next */}
      <PageButton
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        →
      </PageButton>
    </nav>
  );
}

// ── Sub-components ────────────────────────────────────────────

function PageButton({
  children, onClick, disabled, isActive, "aria-label": ariaLabel, "aria-current": ariaCurrent,
}: {
  children: React.ReactNode; onClick: () => void;
  disabled?: boolean; isActive?: boolean;
  "aria-label"?: string; "aria-current"?: "page" | undefined;
}) {
  return (
    <button
      onClick={onClick} disabled={disabled}
      aria-label={ariaLabel} aria-current={ariaCurrent}
      className={cn(
        "w-9 h-9 rounded-lg text-sm font-medium transition-colors duration-200 focus-ring",
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-background-secondary text-foreground hover:bg-border border border-border",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none"
      )}
    >
      {children}
    </button>
  );
}

// ── Page range builder ────────────────────────────────────────

function buildPageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total-4, total-3, total-2, total-1, total];
  return [1, "…", current-1, current, current+1, "…", total];
}
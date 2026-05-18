// components/ui/badge.tsx
// ─────────────────────────────────────────────────────────────
// Badge — small pill label for categories, tags, and statuses.
// COMPONENT SIZE: ~40 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "primary" | "accent" | "outline";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default:
    "bg-foreground-muted/10 text-foreground-muted",
  primary:
    "bg-primary/10 text-primary",
  accent:
    "bg-accent/10 text-accent",
  outline:
    "border border-border text-foreground-muted bg-transparent",
};

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5",
        "text-xs font-medium rounded-full",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
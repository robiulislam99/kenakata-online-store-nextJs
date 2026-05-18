// components/ui/button.tsx
// ─────────────────────────────────────────────────────────────
// Reusable Button component with variants, sizes, and asChild.
//
// asChild pattern: when asChild={true}, the Button renders its
// child element (e.g. a <Link>) with all the button's classes
// applied to it. This avoids <a> inside <button> (invalid HTML).
//
// USAGE:
//   <Button>Click me</Button>
//   <Button variant="secondary" size="lg">Secondary</Button>
//   <Button asChild><Link href="/products">Shop</Link></Button>
//
// COMPONENT SIZE: ~105 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils/cn";

// ── Types ─────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   ButtonVariant;
  size?:      ButtonSize;
  isLoading?: boolean;
  asChild?:   boolean;          // render child element with button styles
  children:   React.ReactNode;
}

// ── Style maps ────────────────────────────────────────────────

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent",
  secondary:
    "bg-background-secondary text-foreground hover:bg-border border-border",
  ghost:
    "bg-transparent text-foreground hover:bg-background-secondary border-transparent",
  danger:
    "bg-red-600 text-white hover:bg-red-700 border-transparent dark:bg-red-700 dark:hover:bg-red-600",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8  px-3 text-sm  gap-1.5",
  md: "h-10 px-4 text-sm  gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

// ── Shared class builder ──────────────────────────────────────

function buildClasses(
  variant: ButtonVariant,
  size: ButtonSize,
  disabled: boolean,
  className?: string
) {
  return cn(
    "inline-flex items-center justify-center",
    "font-medium rounded-lg border",
    "transition-colors duration-200",
    "focus-ring",
    disabled && "opacity-50 cursor-not-allowed pointer-events-none",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}

// ── Component ─────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant   = "primary",
      size      = "md",
      isLoading = false,
      asChild   = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = !!(disabled || isLoading);
    const classes    = buildClasses(variant, size, isDisabled, className);
    const content    = isLoading ? <><LoadingSpinner /><span>Loading…</span></> : children;

    // asChild: clone the child and apply our button classes to it
    const Comp = asChild ? Slot : "button";

return (
  <Comp
    ref={ref}
    className={classes}
    disabled={!asChild ? isDisabled : undefined}
    {...props}
  >
    {content}
  </Comp>
);

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={classes}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

// ── Loading spinner ───────────────────────────────────────────

function LoadingSpinner() {
  return (
    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4z" />
    </svg>
  );
}
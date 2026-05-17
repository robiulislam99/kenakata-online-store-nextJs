// components/ui/button.tsx
// ─────────────────────────────────────────────────────────────
// Reusable Button component with variants and sizes.
//
// WHY BUILD THIS NOW:
//   We'll use buttons everywhere — Navbar, forms, cart, etc.
//   Defining variants here means "primary button" always looks
//   the same app-wide. Change one file, update everywhere.
//
// PATTERN: variant + size via cn() conditional classes.
//   No external library (like shadcn/ui) needed at this stage.
//
// COMPONENT SIZE: ~80 lines — within the 200-line limit.
// ─────────────────────────────────────────────────────────────

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

// ── Types ─────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

// ── Variant and size class maps ───────────────────────────────

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-primary text-primary-foreground",
    "hover:bg-primary/90",
    "border-transparent",
  ].join(" "),

  secondary: [
    "bg-background-secondary text-foreground",
    "hover:bg-border",
    "border-border",
  ].join(" "),

  ghost: [
    "bg-transparent text-foreground",
    "hover:bg-background-secondary",
    "border-transparent",
  ].join(" "),

  danger: [
    "bg-red-600 text-white",
    "hover:bg-red-700",
    "border-transparent",
    "dark:bg-red-700 dark:hover:bg-red-600",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

// ── Component ─────────────────────────────────────────────────

// forwardRef lets parent components get a ref to the <button>
// DOM element — needed for things like tooltips and focus management.

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles shared by all variants
          "inline-flex items-center justify-center",
          "font-medium rounded-lg border",
          "transition-colors duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-ring",
          // Variant and size
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span>Loading…</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// ── Loading spinner ───────────────────────────────────────────

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 22 6.477 22 12h-4z"
      />
    </svg>
  );
}
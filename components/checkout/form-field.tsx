// components/checkout/form-field.tsx
// ─────────────────────────────────────────────────────────────
// FormField — reusable labeled input wrapper.
// Displays label, input, and validation error message.
// Used by every field in the checkout form.
// ─────────────────────────────────────────────────────────────

import { forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label:     string;
  error?:    string;
  id:        string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
          {props.required && (
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          )}
        </label>

        <input
          ref={ref}
          id={id}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={cn(
            "h-10 px-3 rounded-lg border text-sm",
            "bg-background text-foreground",
            "placeholder:text-foreground-muted",
            "transition-colors duration-200",
            "focus-ring",
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-border hover:border-primary/40",
            className
          )}
          {...props}
        />

        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-xs text-red-500 flex items-center gap-1"
          >
            <span aria-hidden="true">⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
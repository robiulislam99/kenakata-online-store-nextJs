// components/checkout/shipping-section.tsx
// ─────────────────────────────────────────────────────────────
// ShippingSection — contact info + shipping address fields.
// Receives the react-hook-form register and errors as props.
// Kept separate to stay under 200 lines.
// ─────────────────────────────────────────────────────────────

import { FormField } from "./form-field";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CheckoutFormData } from "@/lib/schemas/checkout.schema";

interface ShippingSectionProps {
  register: UseFormRegister<CheckoutFormData>;
  errors:   FieldErrors<CheckoutFormData>;
}

export function ShippingSection({ register, errors }: ShippingSectionProps) {
  return (
    <section aria-labelledby="shipping-heading" className="space-y-4">
      <h2 id="shipping-heading" className="text-base font-semibold text-foreground border-b border-border pb-2">
        Contact & Shipping
      </h2>

      {/* Email */}
      <FormField
        id="email" label="Email address" type="email"
        placeholder="you@example.com" required
        error={errors.email?.message}
        {...register("email")}
      />

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <FormField
          id="firstName" label="First name" required
          placeholder="John" error={errors.firstName?.message}
          {...register("firstName")}
        />
        <FormField
          id="lastName" label="Last name" required
          placeholder="Doe" error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      {/* Address */}
      <FormField
        id="address" label="Street address" required
        placeholder="123 Main St, Apt 4B" error={errors.address?.message}
        {...register("address")}
      />

      {/* City + Postal */}
      <div className="grid grid-cols-2 gap-3">
        <FormField
          id="city" label="City" required
          placeholder="New York" error={errors.city?.message}
          {...register("city")}
        />
        <FormField
          id="postalCode" label="Postal code" required
          placeholder="10001" error={errors.postalCode?.message}
          {...register("postalCode")}
        />
      </div>

      {/* Country */}
      <FormField
        id="country" label="Country" required
        placeholder="United States" error={errors.country?.message}
        {...register("country")}
      />
    </section>
  );
}
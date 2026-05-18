// components/checkout/payment-section.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// PaymentSection — mock payment card fields.
// Auto-formats card number as XXXX XXXX XXXX XXXX.
// Auto-formats expiry as MM/YY.
// No real payment processing — this is a UI exercise.
// COMPONENT SIZE: ~110 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { FormField } from "./form-field";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CheckoutFormData } from "@/lib/schemas/checkout.schema";

interface PaymentSectionProps {
  register: UseFormRegister<CheckoutFormData>;
  errors:   FieldErrors<CheckoutFormData>;
}

export function PaymentSection({ register, errors }: PaymentSectionProps) {
  // Auto-format card number: insert spaces every 4 digits
  const formatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw     = e.target.value.replace(/\D/g, "").slice(0, 16);
    e.target.value = raw.replace(/(.{4})/g, "$1 ").trim();
  };

  // Auto-format expiry: insert slash after MM
  const formatExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    e.target.value = raw.length >= 3 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw;
  };

  return (
    <section aria-labelledby="payment-heading" className="space-y-4">
      <h2 id="payment-heading" className="text-base font-semibold text-foreground border-b border-border pb-2">
        Payment Details
        <span className="ml-2 text-xs font-normal text-foreground-muted">(mock — no real charge)</span>
      </h2>

      {/* Mock card visual */}
      <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-5 text-white space-y-3 select-none">
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium opacity-80">KenaKata Pay</span>
          <span className="text-lg">💳</span>
        </div>
        <p className="font-mono text-lg tracking-widest">•••• •••• •••• ••••</p>
        <div className="flex justify-between text-xs opacity-80">
          <span>CARDHOLDER NAME</span><span>MM/YY</span>
        </div>
      </div>

      {/* Cardholder name */}
      <FormField
        id="cardName" label="Name on card" required
        placeholder="John Doe"
        error={errors.cardName?.message}
        {...register("cardName")}
      />

      {/* Card number */}
      <FormField
        id="cardNumber" label="Card number" required
        placeholder="1234 5678 9012 3456"
        maxLength={19}
        inputMode="numeric"
        error={errors.cardNumber?.message}
        {...register("cardNumber", { onChange: formatCardNumber })}
      />

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-3">
        <FormField
          id="expiryDate" label="Expiry date" required
          placeholder="MM/YY" maxLength={5} inputMode="numeric"
          error={errors.expiryDate?.message}
          {...register("expiryDate", { onChange: formatExpiry })}
        />
        <FormField
          id="cvv" label="CVV" required
          placeholder="123" maxLength={4} inputMode="numeric"
          type="password"
          error={errors.cvv?.message}
          {...register("cvv")}
        />
      </div>
    </section>
  );
}
// components/checkout/checkout-form.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// CheckoutForm — orchestrates the full checkout flow.
//
// FORM LIBRARY: React Hook Form + Zod via zodResolver.
//   - RHF handles form state, validation triggers, submission
//   - Zod schema (checkout.schema.ts) defines all rules
//   - zodResolver bridges the two — one line of config
//
// PAYMENT FLOW STATE MACHINE:
//   idle → submitting → processing → success | error
//   Each state shows different UI to simulate a real payment.
//
// COMPONENT SIZE: ~130 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────


import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { checkoutSchema, type CheckoutFormData } from "@/lib/schemas/checkout.schema";
import { useCart }          from "@/lib/hooks/useCart";
import { ShippingSection }  from "./shipping-section";
import { PaymentSection }   from "./payment-section";
import { OrderSuccess }     from "@/components/checkout/order-success";
import { Button }           from "@/components/ui/button";

type FlowStep = "form" | "processing" | "success" | "error";

export function CheckoutForm() {
  const [step,        setStep]        = useState<FlowStep>("form");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderEmail,  setOrderEmail]  = useState("");

  const { clearCart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // ✅ Fix 1: pure utility functions moved inside useCallback (not called during render)
  const makeOrderId = useCallback(
    () => "KK-" + Math.random().toString(36).toUpperCase().slice(2, 8),
    []
  );

  const onSubmit = useCallback(async (data: CheckoutFormData) => {
    setStep("processing");
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // ✅ Math.random() is inside an async event handler — not render
    const success = Math.random() > 0.05;

    if (success) {
      setOrderNumber(makeOrderId());
      setOrderEmail(data.email);
      clearCart();
      setStep("success");
    } else {
      setStep("error");
    }
  }, [clearCart, makeOrderId]);

  if (step === "success") {
    return <OrderSuccess orderNumber={orderNumber} email={orderEmail} />;
  }

  if (step === "processing") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-label="Processing payment" />
        <p className="text-foreground font-medium">Processing your payment…</p>
        <p className="text-sm text-foreground-muted">Please dont close this window.</p>
      </div>
    );
  }

  // ✅ Fix 2: step is narrowed to "form" | "error" here — drop the dead `=== "processing"` check
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-8">

      {step === "error" && (
        <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          <strong>Payment failed.</strong> Please check your details and try again.
          <button
            type="button" onClick={() => setStep("form")}
            className="ml-2 underline hover:no-underline focus-ring rounded"
          >
            Try again
          </button>
        </div>
      )}

      <ShippingSection register={register} errors={errors} />
      <PaymentSection  register={register} errors={errors} />

      {/* ✅ isSubmitting alone is sufficient — "processing" is handled by early return above */}
      <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
        🔒 Place Order
      </Button>

      <p className="text-xs text-center text-foreground-muted">
        By placing your order you agree to our mock terms. No real charge will occur.
      </p>
    </form>
  );
}
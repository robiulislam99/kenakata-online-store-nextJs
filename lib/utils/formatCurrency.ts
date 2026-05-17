// lib/utils/formatCurrency.ts
// ─────────────────────────────────────────────────────────────
// Formats a number as a currency string.
// Uses the built-in Intl.NumberFormat so it's locale-aware
// and doesn't require any third-party library.
// ─────────────────────────────────────────────────────────────

export function formatCurrency(
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Shorthand for the most common use case in KenaKata
export const formatPrice = (amount: number) => formatCurrency(amount, "USD");
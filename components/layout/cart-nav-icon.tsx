// components/layout/cart-nav-icon.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// CartNavIcon — replaces the static cart icon in the Navbar.
// Reads cart item count from Zustand and shows a badge.
//
// WHY SEPARATE FROM NAVBAR?
//   Navbar is a server component. This needs useCartStore()
//   which is a client hook. Same "client island" pattern.
//
// HYDRATION NOTE:
//   We use useSyncExternalStore with different server/client
//   snapshots to avoid hydration mismatch without needing a
//   mounted flag or setState inside an effect.
// ─────────────────────────────────────────────────────────────
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart.store";
import { cn } from "@/lib/utils/cn";

// useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
// On the server:  getServerSnapshot() → false
// On the client:  getClientSnapshot()  → true
// React reconciles them safely with no mismatch warning
const subscribe  = () => () => {};          // no external store to subscribe to
const getClient  = () => true;
const getServer  = () => false;

function useIsMounted() {
  return useSyncExternalStore(subscribe, getClient, getServer);
}

export function CartNavIcon() {
  const mounted   = useIsMounted();
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <Link
      href="/cart"
      aria-label={`View cart${mounted && itemCount > 0 ? `, ${itemCount} items` : ""}`}
      className={cn(
        "relative w-9 h-9 flex items-center justify-center",
        "rounded-lg border border-border",
        "bg-background-secondary hover:bg-border",
        "transition-colors duration-200 focus-ring"
      )}
    >
      <CartIcon />
      {/* Badge — only rendered after hydration to avoid mismatch */}
      {mounted && itemCount > 0 && (
        <span
          aria-hidden="true"
          className={cn(
            "absolute -top-1.5 -right-1.5",
            "min-w-[18px] h-[18px] px-1",
            "bg-primary text-primary-foreground",
            "text-[10px] font-bold rounded-full",
            "flex items-center justify-center",
            "border-2 border-background"
          )}
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
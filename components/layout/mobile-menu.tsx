// components/layout/mobile-menu.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// Mobile hamburger menu — shown on small screens (md and below).
// Uses useState to toggle the menu open/closed.
// Closes automatically when a link is clicked.
//
// WHY SEPARATE FROM NAVBAR:
//   The Navbar is a server component. useState requires a client
//   component. We extract mobile menu state here so the Navbar
//   itself stays a server component and runs on the server.
//
// COMPONENT SIZE: ~80 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { NavLinks } from "./nav-links";
import { cn } from "@/lib/utils/cn";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  return (
    // Only visible on small screens — md:hidden hides it on desktop
    <div className="md:hidden">
      {/* Hamburger / close toggle button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className={cn(
          "w-9 h-9 flex items-center justify-center rounded-lg",
          "border border-border",
          "bg-background-secondary hover:bg-border",
          "transition-colors duration-200",
          "focus-ring"
        )}
      >
        {isOpen ? <CloseIcon /> : <HamburgerIcon />}
      </button>

      {/* Dropdown menu panel */}
      {isOpen && (
        <div
          className={cn(
            "absolute top-16 left-0 right-0",
            "bg-background border-b border-border",
            "shadow-lg z-40",
            "px-4 py-3"
          )}
        >
          {/* Stack links vertically on mobile */}
          <NavLinks
            className="flex-col items-start gap-1 w-full"
            onClick={close}
          />
        </div>
      )}
    </div>
  );
}

// ── Inline SVG icons ──────────────────────────────────────────

function HamburgerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
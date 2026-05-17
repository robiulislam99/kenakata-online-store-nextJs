// components/ui/theme-toggle.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// WHY "use client":
//   useTheme() from next-themes reads React context and uses
//   browser APIs — it must run in the browser. Any component
//   that calls useTheme() must be a client component.
//
// COMPONENT SIZE: 58 lines — well within the 200-line limit.
// ─────────────────────────────────────────────────────────────

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  // next-themes only knows the theme after hydration.
  // We use mounted to avoid a hydration mismatch where the
  // server renders "unknown theme" and the client renders
  // "dark" — those would differ and React would warn.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder with the same dimensions so layout
    // doesn't shift when the real button appears.
    return <div className="w-9 h-9 rounded-lg" aria-hidden="true" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "w-9 h-9 rounded-lg flex items-center justify-center",
        "border border-border",
        "bg-background-secondary hover:bg-border",
        "transition-colors duration-200",
        "focus-ring",
        className
      )}
    >
      {/* Sun icon — shown in dark mode to offer switching to light */}
      {isDark ? (
        <SunIcon />
      ) : (
        <MoonIcon />
      )}
    </button>
  );
}

// ── Inline SVG icons ──────────────────────────────────────────
// Kept inline to avoid an icon library dependency at this stage.
// We can swap these for a library later without changing the API.

function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
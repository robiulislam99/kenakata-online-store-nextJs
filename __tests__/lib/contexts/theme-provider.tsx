// lib/contexts/theme-provider.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// WHY THIS FILE EXISTS:
//   next-themes' <ThemeProvider> is a client component.
//   But app/layout.tsx is a server component by default.
//   You cannot import a client component directly into a
//   server component and pass JSX children through it —
//   you need a thin "client boundary" wrapper like this one.
//
// WHAT IT DOES:
//   Wraps next-themes ThemeProvider with our preferred settings:
//   - attribute="class" → adds/removes "dark" on <html>
//   - defaultTheme="system" → respects OS preference on first load
//   - enableSystem → allows "system" as a theme choice
//   - disableTransitionOnChange → prevents flash on theme switch
// ─────────────────────────────────────────────────────────────

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
// lib/utils/cn.ts
// ─────────────────────────────────────────────────────────────
// The cn() utility merges Tailwind class names safely.
//
// WHY DO WE NEED THIS?
//   Tailwind generates CSS based on class names found in source
//   files. When you conditionally add classes, conflicts arise.
//   For example: "px-2 px-4" — which padding wins?
//
//   clsx builds the class string from conditions.
//   tailwind-merge resolves Tailwind-specific conflicts so the
//   last matching utility wins (px-4 beats px-2).
//
// USAGE:
//   cn("px-2 py-1", isActive && "bg-blue-500", className)
// ─────────────────────────────────────────────────────────────

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
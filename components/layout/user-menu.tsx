// components/layout/user-menu.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// UserMenu — Navbar client island for auth state.
//
// TWO STATES:
//   1. Not logged in  → "Sign In" link
//   2. Logged in      → avatar button with dropdown menu
//                       (profile info, admin link if admin, logout)
//
// WHY CLIENT COMPONENT?
//   Reads Zustand auth store which is browser-only.
//   Uses useState for dropdown open/close.
//
// HYDRATION: Uses `mounted` pattern to avoid mismatch between
// server (no auth) and client (has auth from localStorage).
//
// COMPONENT SIZE: ~115 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuthContext } from "@/lib/contexts/auth-context";
import { cn } from "@/lib/utils/cn";

export function UserMenu() {
  const [mounted, setMounted] = useState(false);
  const [open,    setOpen]    = useState(false);
  const menuRef               = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, isAdmin, logout } = useAuthContext();

  // Avoid hydration mismatch — auth state only known after mount
// eslint-disable-next-line react-hooks/set-state-in-effect
useEffect(() => setMounted(true), []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Placeholder while hydrating
  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg bg-background-secondary animate-pulse" />;
  }

  // Not logged in — show Sign In link
  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/login"
        className={cn(
          "h-9 px-3 rounded-lg text-sm font-medium",
          "border border-border bg-background-secondary",
          "text-foreground hover:bg-border",
          "transition-colors duration-200 focus-ring",
          "flex items-center"
        )}
      >
        Sign In
      </Link>
    );
  }

  // Logged in — show avatar + dropdown
  const initials = user.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`${user.name}'s account menu`}
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center",
          "bg-primary text-primary-foreground",
          "text-xs font-bold",
          "hover:bg-primary/90 transition-colors focus-ring"
        )}
      >
        {initials}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-11 w-52 rounded-xl border border-border bg-background shadow-lg z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-foreground-muted truncate">{user.email}</p>
            {isAdmin && (
              <span className="mt-1 inline-block text-xs font-medium text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </div>

          {/* Menu items */}
          <nav className="p-1">
            {isAdmin && (
              <MenuItem href="/admin/dashboard" onClick={() => setOpen(false)}>
                🛠 Admin Dashboard
              </MenuItem>
            )}
            <MenuItem href="/orders" onClick={() => setOpen(false)}>
              📦 My Orders
            </MenuItem>
            <div className="border-t border-border my-1" />
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-500 hover:bg-red-500/10 transition-colors focus-ring"
            >
              ← Sign Out
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

function MenuItem({ href, onClick, children }: {
  href: string; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <Link
      href={href} onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-foreground hover:bg-background-secondary transition-colors focus-ring"
    >
      {children}
    </Link>
  );
}
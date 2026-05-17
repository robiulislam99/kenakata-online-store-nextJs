// vitest.config.ts
// Place this file in the ROOT of your project
// (same folder as package.json, next.config.ts, tailwind.config.ts)
// ─────────────────────────────────────────────────────────────
// Vitest test runner configuration.
// ─────────────────────────────────────────────────────────────

import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Simulate a browser environment (needed for React components)
    environment: "jsdom",

    // No need to import describe/it/expect in every file
    globals: true,

    // Runs before every test file — imports jest-dom matchers
    setupFiles: ["__tests__/setup.ts"],

    // Where to find tests
    include: [
      "**/__tests__/**/*.{test,spec}.{ts,tsx}",
      "**/*.{test,spec}.{ts,tsx}",
    ],

    // Never test these folders
    exclude: ["node_modules", ".next", "dist"],
  },
  resolve: {
    // Matches the @/* alias in tsconfig.json
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
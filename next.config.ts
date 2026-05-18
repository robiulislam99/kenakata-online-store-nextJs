// next.config.ts
// ─────────────────────────────────────────────────────────────
// Next.js configuration.
//
// IMAGES:
//   next/image only optimises images from trusted domains.
//   We must explicitly allow every external hostname we use.
//   Platzi's API returns images from several different hosts —
//   we allow a broad pattern with remotePatterns.
// ─────────────────────────────────────────────────────────────

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Platzi Fake Store API images
      {
        protocol: "https",
        hostname: "api.escuelajs.co",
        pathname: "/**",
      },
      // Platzi often returns images from placeimg.com
      {
        protocol: "https",
        hostname: "placeimg.com",
        pathname: "/**",
      },
      // Some product images come from picsum.photos
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      // Our placeholder fallback images
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      // Unsplash (some Platzi products use this)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // i.imgur.com (some Platzi products use this)
      {
        protocol: "https",
        hostname: "i.imgur.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
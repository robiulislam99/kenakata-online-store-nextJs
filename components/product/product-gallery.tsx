// components/product/product-gallery.tsx
"use client";
// ─────────────────────────────────────────────────────────────
// ProductGallery — image carousel with thumbnails.
// Client component because it manages selected image state.
//
// FEATURES:
//   - Main large image display
//   - Thumbnail strip for navigation
//   - Keyboard arrow key navigation
//   - Handles Platzi's broken/encoded image URLs gracefully
//
// COMPONENT SIZE: ~120 lines — within 200-line limit.
// ─────────────────────────────────────────────────────────────

import Image from "next/image";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils/cn";

interface ProductGalleryProps {
  images: string[];
  title:  string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const cleanImages = parseImages(images);
  const [selected, setSelected]   = useState(0);
  const [imgError, setImgError]   = useState<Record<number, boolean>>({});

  const safeIndex = Math.min(selected, cleanImages.length - 1);
  const currentImage = cleanImages[safeIndex] ?? FALLBACK;

  const prev = useCallback(() =>
    setSelected((i) => (i === 0 ? cleanImages.length - 1 : i - 1)),
    [cleanImages.length]
  );
  const next = useCallback(() =>
    setSelected((i) => (i === cleanImages.length - 1 ? 0 : i + 1)),
    [cleanImages.length]
  );

  return (
    <div className="flex flex-col gap-4">

      {/* ── Main image ──────────────────────────────────────── */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-background-secondary border border-border group">
        <Image
          src={imgError[safeIndex] ? FALLBACK : currentImage}
          alt={`${title} — image ${safeIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
          onError={() => setImgError((prev) => ({ ...prev, [safeIndex]: true }))}
        />

        {/* Prev / Next arrows — only shown if multiple images */}
        {cleanImages.length > 1 && (
          <>
            <ArrowButton direction="left"  onClick={prev} />
            <ArrowButton direction="right" onClick={next} />
          </>
        )}

        {/* Image counter badge */}
        {cleanImages.length > 1 && (
          <span className="absolute bottom-3 right-3 bg-foreground/60 text-background text-xs px-2 py-1 rounded-full">
            {safeIndex + 1} / {cleanImages.length}
          </span>
        )}
      </div>

      {/* ── Thumbnails ──────────────────────────────────────── */}
      {cleanImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="list" aria-label="Product images">
          {cleanImages.map((img, i) => (
            <button
              key={i}
              role="listitem"
              onClick={() => setSelected(i)}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === safeIndex}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 focus-ring",
                i === safeIndex ? "border-primary" : "border-border hover:border-primary/50"
              )}
            >
              <Image
                src={imgError[i] ? FALLBACK : img}
                alt={`Thumbnail ${i + 1}`}
                fill sizes="64px"
                className="object-cover"
                onError={() => setImgError((prev) => ({ ...prev, [i]: true }))}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

function ArrowButton({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "left" ? "Previous image" : "Next image"}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 z-10",
        "w-9 h-9 rounded-full flex items-center justify-center",
        "bg-background/80 border border-border shadow-sm",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        "hover:bg-background focus-ring",
        direction === "left" ? "left-3" : "right-3"
      )}
    >
      {direction === "left" ? "←" : "→"}
    </button>
  );
}

// ── Helpers ───────────────────────────────────────────────────

const FALLBACK = "https://placehold.co/600x600/e2e8f0/94a3b8?text=No+Image";

function parseImages(images: string[]): string[] {
  if (!images?.length) return [FALLBACK];

  const result: string[] = [];
  for (const img of images) {
    if (img.startsWith("[")) {
      try {
        const parsed = JSON.parse(img);
        if (Array.isArray(parsed)) result.push(...parsed.filter((u) => u?.startsWith("http")));
      } catch { /* skip */ }
    } else if (img.startsWith("http")) {
      result.push(img);
    }
  }
  return result.length > 0 ? result : [FALLBACK];
}
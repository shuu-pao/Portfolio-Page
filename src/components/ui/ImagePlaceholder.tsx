"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  imageSrc?: string;
  alt: string;
  aspectRatio?: string;
  label?: string;
  className?: string;
  /** "cover" (default) crops to fill the box — used for grid thumbnails.
   *  "contain" fits the whole image, resizing the box to the image's own
   *  aspect ratio once it loads so there's no leftover letterbox gap. */
  fit?: "cover" | "contain";
}

export function ImagePlaceholder({
  imageSrc,
  alt,
  aspectRatio = "16 / 10",
  label,
  className,
  fit = "cover",
}: ImagePlaceholderProps) {
  const [naturalRatio, setNaturalRatio] = useState<string | null>(null);

  if (imageSrc) {
    const ratio = fit === "contain" && naturalRatio ? naturalRatio : aspectRatio;
    return (
      <div className={cn("relative overflow-hidden", className)} style={{ aspectRatio: ratio }}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          className={fit === "contain" ? "object-contain" : "object-cover"}
          onLoad={(e) => {
            if (fit !== "contain") return;
            const { naturalWidth, naturalHeight } = e.currentTarget;
            if (naturalWidth && naturalHeight) {
              setNaturalRatio(`${naturalWidth} / ${naturalHeight}`);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden border border-em-text/15 bg-em-text/[0.03]",
        className
      )}
      style={{ aspectRatio }}
      role="img"
      aria-label={alt}
    >
      <ImageIcon size={20} className="text-em-text-dim" aria-hidden="true" />
      {label && (
        <span className="absolute bottom-2 right-2 font-mono text-[10px] uppercase tracking-[0.15em] text-em-text-dim">
          {label}
        </span>
      )}
    </div>
  );
}

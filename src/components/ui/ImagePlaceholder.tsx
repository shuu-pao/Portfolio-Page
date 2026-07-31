import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  imageSrc?: string;
  alt: string;
  aspectRatio?: string;
  label?: string;
  className?: string;
}

export function ImagePlaceholder({
  imageSrc,
  alt,
  aspectRatio = "16 / 10",
  label,
  className,
}: ImagePlaceholderProps) {
  if (imageSrc) {
    return (
      <div className={cn("relative overflow-hidden", className)} style={{ aspectRatio }}>
        <Image src={imageSrc} alt={alt} fill className="object-cover" />
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

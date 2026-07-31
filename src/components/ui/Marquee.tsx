"use client";

import { useRef } from "react";
import { X, Plus } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useInViewport } from "@/hooks/use-in-viewport";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
}

export function Marquee({ items, className }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(trackRef, { threshold: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const running = inViewport && !reducedMotion;

  const renderItems = (copy: number) =>
    items.map((item, i) => (
      <span
        key={`${copy}-${i}`}
        className={cn(
          "inline-flex items-center gap-3 whitespace-nowrap px-3 font-mono text-sm uppercase tracking-[0.15em]",
          i % 2 === 0 ? "text-em-text" : "text-em-accent"
        )}
      >
        {item}
        {i % 2 === 0 ? <X size={12} aria-hidden="true" /> : <Plus size={12} aria-hidden="true" />}
      </span>
    ));

  return (
    <div ref={trackRef} className={cn("w-full overflow-hidden", className)}>
      <div
        className="flex w-max"
        style={{ animation: running ? "marquee-scroll 18s linear infinite" : "none" }}
      >
        <div className="flex">{renderItems(0)}</div>
        <div className="flex" aria-hidden="true">
          {renderItems(1)}
        </div>
      </div>
    </div>
  );
}

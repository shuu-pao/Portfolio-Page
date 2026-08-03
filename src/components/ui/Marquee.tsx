"use client";

import { useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { X } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useInViewport } from "@/hooks/use-in-viewport";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  /** Idle crawl speed in pixels/second. */
  baseVelocity?: number;
  /** Element rendered between repeated items. Defaults to the spinning X. */
  separator?: React.ReactNode;
}

function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

// Fallback copy count for the pre-measurement/SSR render only; the real
// count is computed dynamically once copyWidth/trackWidth are measured.
const FALLBACK_COPY_COUNT = 10;

export function Marquee({ items, className, baseVelocity = 40, separator }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(trackRef, { threshold: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const running = inViewport && !reducedMotion;

  const [copyWidth, setCopyWidth] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  useLayoutEffect(() => {
    const node = copyRef.current;
    if (!node) return;

    function updateWidth() {
      if (copyRef.current) setCopyWidth(copyRef.current.offsetWidth);
    }
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const node = trackRef.current;
    if (!node) return;

    function updateWidth() {
      if (trackRef.current) setTrackWidth(trackRef.current.offsetWidth);
    }
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // A seamless [-copyWidth, 0] wrap needs copies * copyWidth >= trackWidth + copyWidth.
  const copies =
    copyWidth > 0 ? Math.ceil(trackWidth / copyWidth) + 1 : FALLBACK_COPY_COUNT;

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-2000, 2000], [-3, 3], { clamp: true });

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return "0px";
    return `${wrap(-copyWidth, 0, v)}px`;
  });

  const directionRef = useRef(-1);

  useAnimationFrame((_t, delta) => {
    if (!running || copyWidth === 0) return;
    const vf = velocityFactor.get();
    // Direction is sticky: it only flips when scroll velocity clears the
    // deadzone in the opposite sense, and otherwise holds through the idle
    // decay back to 0 (so scrolling up then stopping keeps crawling
    // left-to-right until the user scrolls down again, not just for the
    // instant the velocity spike lasts).
    if (vf < -0.5) directionRef.current = 1;
    else if (vf > 0.5) directionRef.current = -1;
    const direction = directionRef.current;
    const speedMultiplier = 1 + Math.abs(vf);
    const moveBy = direction * baseVelocity * (delta / 1000) * speedMultiplier;
    baseX.set(baseX.get() + moveBy);
  });

  const renderItems = (copy: number) =>
    items.map((item, i) => (
      <span
        key={`${copy}-${i}`}
        className="inline-flex items-center gap-3 whitespace-nowrap px-3"
      >
        {item}
        {separator ?? (
          <X
            size={12}
            aria-hidden="true"
            style={{ animation: running ? "marquee-x-spin 4s linear infinite" : "none" }}
          />
        )}
      </span>
    ));

  return (
    <div ref={trackRef} className={cn("w-full overflow-hidden font-sans text-sm text-em-text", className)}>
      <span className="sr-only">{items.join(", ")}</span>
      <motion.div className="flex w-max" style={{ x }} aria-hidden="true">
        {Array.from({ length: copies }).map((_, copyIndex) => (
          <div key={copyIndex} className="flex" ref={copyIndex === 0 ? copyRef : undefined}>
            {renderItems(copyIndex)}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

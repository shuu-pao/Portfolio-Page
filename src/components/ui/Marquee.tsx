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
}

function wrap(min: number, max: number, v: number): number {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
}

const COPY_COUNT = 6;

export function Marquee({ items, className, baseVelocity = 40 }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(trackRef, { threshold: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const running = inViewport && !reducedMotion;

  const [copyWidth, setCopyWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (copyRef.current) setCopyWidth(copyRef.current.offsetWidth);
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-2000, 2000], [-3, 3], { clamp: true });

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return "0px";
    return `${wrap(-copyWidth, 0, v)}px`;
  });

  useAnimationFrame((_t, delta) => {
    if (!running || copyWidth === 0) return;
    const vf = velocityFactor.get();
    // Default/idle and scroll-down both read right-to-left (-1); only an
    // active upward scroll (past a small deadzone) reverses to left-to-right.
    const direction = vf < -0.5 ? 1 : -1;
    const speedMultiplier = 1 + Math.abs(vf);
    const moveBy = direction * baseVelocity * (delta / 1000) * speedMultiplier;
    baseX.set(baseX.get() + moveBy);
  });

  const renderItems = (copy: number) =>
    items.map((item, i) => (
      <span
        key={`${copy}-${i}`}
        className="inline-flex items-center gap-3 whitespace-nowrap px-3 font-mono text-sm uppercase tracking-[0.15em] text-em-text"
      >
        {item}
        <X
          size={12}
          aria-hidden="true"
          style={{ animation: running ? "marquee-x-spin 4s linear infinite" : "none" }}
        />
      </span>
    ));

  return (
    <div ref={trackRef} className={cn("w-full overflow-hidden", className)}>
      <span className="sr-only">{items.join(", ")}</span>
      <motion.div className="flex w-max" style={{ x }} aria-hidden="true">
        {Array.from({ length: COPY_COUNT }).map((_, copyIndex) => (
          <div key={copyIndex} className="flex" ref={copyIndex === 0 ? copyRef : undefined}>
            {renderItems(copyIndex)}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

"use client";

import type Lenis from "lenis";
import { useEffect } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export function useLenis() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let lenisInstance: Lenis | undefined;
    let rafId: number | undefined;
    let cancelled = false;

    (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;

      const lenis = new Lenis();
      lenisInstance = lenis;

      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
    })();

    return () => {
      cancelled = true;
      lenisInstance?.destroy();
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);
}

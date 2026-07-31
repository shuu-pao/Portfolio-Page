"use client";

import type Lenis from "lenis";
import { useEffect } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export function useLenis() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let lenisInstance: Lenis | undefined;
    let tickerFn: ((time: number) => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis();
      lenisInstance = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      tickerFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      cancelled = true;
      lenisInstance?.destroy();
      if (tickerFn) {
        import("gsap").then(({ default: gsap }) => gsap.ticker.remove(tickerFn!));
      }
    };
  }, [reducedMotion]);
}

"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Mount-gated read of an external system; matches the pattern in ThemeToggle.tsx.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

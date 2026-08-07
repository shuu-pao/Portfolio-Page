"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const CELL_SIZE_DESKTOP = 45;
const CELL_SIZE_MOBILE = 15;
const MOBILE_BREAKPOINT = 580;
const FADE_SPEED = 4.8; // rad/sec — matches the reference shader's nominal-60fps rate
const FADE_BIAS = 1.1;
const REDRAW_INTERVAL_MS = 66; // ~15fps; plenty for a ~1.3s-period shimmer

// Dark palette's lo/hi use a smaller RGB delta than light's (±4 vs ±6 per
// channel), centered on --em-invert-bg (#17130f). Near-black colors sit on the
// steep part of the sRGB gamma curve, so light's ±6 delta ported unchanged
// produced a much louder-looking animation despite equal absolute RGB steps.
// An earlier ±1-2 delta (chosen to match light's WCAG relative-luminance swing
// exactly) undershot in practice — that math doesn't account for monitor
// black-crush/dithering swallowing very small near-black steps. ±4 is a tuned
// middle ground between that and the original ±6.
const PALETTES = {
  light: { lo: [0xd1, 0xc1, 0xa9] as const, hi: [0xdd, 0xcc, 0xb4] as const },
  dark: { lo: [0x13, 0x0f, 0x0b] as const, hi: [0x1b, 0x17, 0x13] as const },
};

function hash(col: number, row: number): number {
  const s = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453123;
  return s - Math.floor(s);
}

function fadeAt(elapsedSeconds: number, phase: number): number {
  const v = 0.5 * (FADE_BIAS + Math.sin(elapsedSeconds * FADE_SPEED + phase * Math.PI * 2));
  return Math.min(1, Math.max(0, v));
}

export function TileShimmerBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const palette = theme === "dark" ? PALETTES.dark : PALETTES.light;
    let cellSize = CELL_SIZE_DESKTOP;
    let cols = 0;
    let rows = 0;
    let phases: Float32Array = new Float32Array(0);

    function buildGrid() {
      // ponytail: square cells sized off window.innerWidth only (no devicePixelRatio
      // scaling), not the reference's fixed-row-count quirk. Upgrade path: scale
      // canvas.width/height by devicePixelRatio + ctx.scale() if blockiness on
      // high-DPI displays ever reads as a defect rather than the intended look.
      cellSize = window.innerWidth > MOBILE_BREAKPOINT ? CELL_SIZE_DESKTOP : CELL_SIZE_MOBILE;
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      cols = Math.ceil(canvas!.width / cellSize);
      rows = Math.ceil(canvas!.height / cellSize);
      phases = new Float32Array(cols * rows);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          phases[row * cols + col] = hash(col, row);
        }
      }
    }

    function draw(elapsedSeconds: number) {
      const [lr, lg, lb] = palette.lo;
      const [hr, hg, hb] = palette.hi;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const fade = fadeAt(elapsedSeconds, phases[row * cols + col]);
          const r = Math.round(lr + (hr - lr) * fade);
          const g = Math.round(lg + (hg - lg) * fade);
          const b = Math.round(lb + (hb - lb) * fade);
          ctx!.fillStyle = `rgb(${r},${g},${b})`;
          ctx!.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }

    buildGrid();

    if (prefersReducedMotion) {
      draw(0);
      const onResize = () => {
        buildGrid();
        draw(0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let rafId: number;
    let lastDrawTime = 0;
    const start = performance.now();

    function tick(now: number) {
      rafId = requestAnimationFrame(tick);
      if (now - lastDrawTime < REDRAW_INTERVAL_MS) return;
      lastDrawTime = now;
      draw((now - start) / 1000);
    }
    rafId = requestAnimationFrame(tick);

    const onResize = () => buildGrid();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, [theme, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}

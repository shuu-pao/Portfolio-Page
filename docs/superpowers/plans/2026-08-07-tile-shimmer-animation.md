# Animated Tile Shimmer Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static tiled SVG background (previous phase) with a continuously, subtly animating canvas grid — a faithful-but-Canvas2D reimplementation of the sine-driven per-cell shimmer found in `meesverberne.com`'s actual WebGL shader source.

**Architecture:** One `"use client"` component (`TileShimmerBackground`) owns a single `position: fixed` full-viewport `<canvas>`, mounted once at `Providers.tsx` (site-wide, survives client-side route navigation). A `requestAnimationFrame` loop throttled to ~15fps redraws a grid of solid-color cells; each cell's color oscillates via a per-cell-phased sine wave between two ends of the already-measured tile palette. `usePrefersReducedMotion()` freezes the grid on its first frame instead of animating. The previous phase's static SVG-background-image system (CSS vars, two SVG files, `body`/`NavOverlay` classes) is deleted, not layered underneath.

**Tech Stack:** Next.js (App Router), React (Canvas 2D API, no Three.js/WebGL — see spec §3 for why), `next-themes` (already wired), existing `usePrefersReducedMotion` hook. No new dependencies.

## Global Constraints

- No WebGL/Three.js for this component — plain Canvas2D only (spec §3).
- Grid: 45px cells desktop (`window.innerWidth > 580`), 15px mobile, square on both axes (spec §4 — deliberately not porting the reference's fixed-row-count quirk).
- Per-cell phase: `hash(col, row) = frac(sin(col*12.9898 + row*78.233) * 43758.5453123)`, computed once per cell at grid-build time — exact port of the reference shader's `random()`.
- Per-frame fade: `clamp(0.5 * (1.1 + sin(elapsedSeconds * 4.8 + hash * 2π)), 0, 1)` — driven by real elapsed time (`performance.now()`), not frame count (spec §4's deliberate correction to the reference's frame-rate-coupled speed).
- Color = `lerp(paletteLo, paletteHi, fade)`. Light palette: `lo = #d1c1a9`, `hi = #ddccb4`. Dark palette: `lo = #110e09`, `hi = #1d1914`. (Both ranges already measured/generated in the previous phase — do not re-derive.)
- Redraw throttle: only redraw when ≥66ms has elapsed since the last draw (~15fps).
- Reduced motion: when `usePrefersReducedMotion()` is true, draw each cell once at `elapsedSeconds = 0` and never schedule another frame.
- No devicePixelRatio scaling (spec §4, deferred).
- Strict scope boundary (project `CLAUDE.md`): only touch the files listed per task below.

---

### Task 1: Build and mount `TileShimmerBackground`

**Files:**
- Create: `src/components/reactbits/TileShimmerBackground.tsx`
- Modify: `src/components/layout/Providers.tsx`

**Interfaces:**
- Produces: `TileShimmerBackground` — a zero-prop React component, default export not required (named export), rendered with no children.
- Consumes: `usePrefersReducedMotion` from `@/hooks/use-prefers-reduced-motion` (already exists, returns `boolean`), `useTheme` from `next-themes` (already a dependency, used elsewhere via `const { theme } = useTheme()` — follow that exact destructuring, not `resolvedTheme`, to match this codebase's existing convention in `src/components/sections/HeroSection.tsx:11`).

- [ ] **Step 1: Create `src/components/reactbits/TileShimmerBackground.tsx` with this exact content**

```tsx
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

const PALETTES = {
  light: { lo: [0xd1, 0xc1, 0xa9] as const, hi: [0xdd, 0xcc, 0xb4] as const },
  dark: { lo: [0x11, 0x0e, 0x09] as const, hi: [0x1d, 0x19, 0x14] as const },
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
```

- [ ] **Step 2: Mount it in `Providers.tsx`**

Read `src/components/layout/Providers.tsx` first to confirm it still matches this — it should, nothing has touched it this session:

```tsx
"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { useLenis } from "@/hooks/use-lenis";

export function Providers({ children }: { children: React.ReactNode }) {
  useLenis();
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ThemeProvider>
  );
}
```

Replace with:

```tsx
"use client";

import { ThemeProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
import { useLenis } from "@/hooks/use-lenis";
import { TileShimmerBackground } from "@/components/reactbits/TileShimmerBackground";

export function Providers({ children }: { children: React.ReactNode }) {
  useLenis();
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <MotionConfig reducedMotion="user">
        <TileShimmerBackground />
        {children}
      </MotionConfig>
    </ThemeProvider>
  );
}
```

- [ ] **Step 3: Verify**

Run `npm run dev`, open the site. Confirm:
- The background behind the (still-present, not yet removed) static tile texture now also has the canvas layered behind it — you won't see the shimmer yet since the old static background is opaque and painted on top in DOM/paint order via `body`'s `background-image` (that's expected; Task 2 removes it). Instead, verify indirectly: open devtools, confirm a `<canvas>` element exists as an early child in the DOM with `class` containing `-z-10`, and that its `width`/`height` attributes match the window's inner dimensions.
- No console errors.
- `npx tsc --noEmit` passes (canvas 2D context types, `Float32Array`, etc. are all standard lib — this should be a clean check).

- [ ] **Step 4: Commit**

```bash
git add src/components/reactbits/TileShimmerBackground.tsx src/components/layout/Providers.tsx
git commit -m "feat: add animated tile shimmer background component

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Remove the previous static tile-background system

**Files:**
- Delete: `public/textures/tile-light.svg`
- Delete: `public/textures/tile-dark.svg`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/NavOverlay.tsx`

**Interfaces:**
- Consumes: nothing from Task 1 (this task only removes the old system; the new canvas from Task 1 is already behind everything via `-z-10` and needs no wiring here).
- Produces: nothing further downstream.

- [ ] **Step 1: Delete the two SVG assets**

```bash
git rm public/textures/tile-light.svg public/textures/tile-dark.svg
```

- [ ] **Step 2: Remove the tile CSS variables from `globals.css`**

In `src/app/globals.css`, find this block inside `:root { ... }` (currently lines 119-121):

```css
  --tile-bg-light: url("/textures/tile-light.svg");
  --tile-bg-dark: url("/textures/tile-dark.svg");
  --tile-bg: var(--tile-bg-light);
```

Delete all three lines (leave `--em-invert-muted: #b5aa98;` immediately above, and the closing `}` immediately below, both untouched).

Find this line inside `.dark { ... }` (currently line 159):

```css
  --tile-bg: var(--tile-bg-dark);
```

Delete it (leave `--em-text-muted: var(--em-invert-muted);` immediately above, and the closing `}` immediately below, both untouched).

- [ ] **Step 3: Remove the tile background from `body` in `layout.tsx`**

Find:

```tsx
      <body
        className="min-h-full bg-em-bg font-sans text-em-text [background-image:var(--tile-bg)] [background-repeat:repeat] [background-size:360px_360px]"
      >
```

Replace with:

```tsx
      <body className="min-h-full bg-em-bg font-sans text-em-text">
```

- [ ] **Step 4: Revert `NavOverlay.tsx` to transparent (not back to flat `bg-em-bg`)**

Find (line 34):

```tsx
          className="fixed inset-0 z-[60] flex flex-col bg-em-bg [background-image:var(--tile-bg)]"
```

Replace with:

```tsx
          className="fixed inset-0 z-[60] flex flex-col"
```

(No background class at all — the shared canvas from Task 1 is mounted at layout level with `z-index: -1` and shows through any transparent surface, same as the 7 section components already treated this way in the previous phase.)

- [ ] **Step 5: Verify**

Run `npm run lint` — confirm no errors, and specifically confirm no "unused CSS variable" or dangling `url()` reference warnings.

Run `npm run dev`, open the site in both light and dark mode:
- Confirm the shimmering grid is now visible behind all sections (no more static flat/tan look).
- Open the nav overlay — confirm the shimmer is visible behind its content (not a flat cream sheet, not a duplicate static texture).
- Confirm no 404s in the network tab for `/textures/tile-light.svg` or `/textures/tile-dark.svg` (nothing should still be requesting them).
- Navigate `/` → `/contact` → `/` via the site's own links (not a hard reload) — confirm the shimmer keeps animating without a visible restart/flash, since `TileShimmerBackground` is mounted once at the shared layout level and should survive client-side route changes.

Run `npm run build` — confirm a clean production build (this also catches any remaining reference to the deleted CSS vars or SVG files that lint might miss).

- [ ] **Step 6: Commit**

```bash
git add -u public/textures src/app/globals.css src/app/layout.tsx src/components/layout/NavOverlay.tsx
git commit -m "refactor: remove static tile background, superseded by animated shimmer

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

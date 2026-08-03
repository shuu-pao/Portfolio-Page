# Lightfall-Anchored Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio's visual and motion system around the existing Lightfall (React Bits) background, per `docs/superpowers/specs/2026-07-31-lightfall-anchored-redesign-design.md`.

**Architecture:** Single-page Next.js App Router site. A shared near-black/ember design-token foundation (Task 1) and a reusable magnetic-hover hook (Task 2) land first since every later section consumes them. Sections are then rebuilt one at a time, in the new proof-first order, each independently reviewable. `page.tsx` reassembly is the final task once every section exists in its new form.

**Tech Stack:** Next.js 16 / React 19, Tailwind CSS v4, Motion (`motion` package), GSAP + ScrollTrigger (dynamically imported), `ogl` (via React Bits Lightfall), TypeScript strict mode.

## Global Constraints

- **No test framework exists in this repo** (no Jest/Vitest/Playwright config — checked `package.json` and root config files). Per-task verification is therefore: (1) `npx tsc --noEmit` for type safety, (2) `npm run lint` for lint cleanliness, (3) `npm run dev` + manual browser check (or the Playwright MCP tools if available in the executing session) confirming the specific behavior the task describes. This replaces the write-test-first cycle for this frontend-only redesign; it is not a shortcut, it is what CLAUDE.md's "Pre-Delivery Verification" rule already requires for this project.
- Background is near-black `#0b0a08` (the existing `--em-bg` token) across **every** section — no more `bg-zinc-950`.
- Ember accent (`--em-accent` `#c2542e`, plus the Lightfall gradient `#c2542e → #e08a52`) is reserved for CTAs, hover/active states, Lightfall canvases, the nav streak-underline, and the Process timeline line-draw. It is not a blanket background color.
- Typography: Fraunces (`--font-editorial`) for all headlines, Space Grotesk (`--font-sans`) for body/UI, Space Mono (project already loads it as `--font-mono`... verify in Task 1) for eyebrow labels. **Archivo is dropped entirely** — resolved during planning (see Task 1).
- BlurText (`src/components/reactbits/BlurText.tsx`, already in repo) is the **only** text-reveal component used for headlines across the whole site. No other React Bits text-animation component is introduced for reveals.
- Every new animated behavior must be gated by the existing `usePrefersReducedMotion()` hook (`src/hooks/use-prefers-reduced-motion.ts`) — reuse it, do not reinvent a check.
- Exactly two Lightfall canvases total on the page (Hero, Contact bookend). Each is paused (`paused` prop, already supported by `LightfallProps`) when scrolled out of view, using the existing `useInViewport` hook (`src/hooks/use-in-viewport.ts`) — do not write a new intersection-observer hook.
- GSAP and ScrollTrigger are loaded via dynamic `import()` inside `useEffect`, never as a static top-level import, so they don't block the initial page bundle.
- Tilt/magnetic pointer effects must no-op when `window.matchMedia("(pointer: fine)").matches` is false (touch devices).
- Contrast ≥ 4.5:1, visible focus states, full keyboard reachability — per `design-system/mypremiumportfolio/MASTER.md`'s existing checklist. Every task must not regress this.
- All content stays placeholder (per design spec §1) — new data (skills, stats, timeline steps) goes into typed arrays/props, not hardcoded prose baked into JSX, so a later real-content pass is a data swap.
- Testimonials are explicitly **not built** (cut in the design spec).

---

### Task 1: Design token & font foundation

**Files:**
- Modify: `src/app/globals.css:7-59` (`@theme inline` block), `:root` block (no line changes needed, `--em-*` tokens already exist)
- Modify: `src/app/layout.tsx` (remove Archivo, repoint body background/text)

**Interfaces:**
- Produces: Tailwind utility `font-display` now resolves to the Fraunces family (via `--font-editorial`) instead of Archivo. Existing `className="font-display"` usages in `AboutMeSection.tsx`, `PortfolioGallerySection.tsx`, `ContactSection.tsx` automatically become Fraunces with no per-file edit required.
- Produces: `bg-em-bg` / `text-em-text` Tailwind utilities (already defined via `--color-em-bg`/`--color-em-text` in `@theme inline`) become the standard body/section background+text — later tasks (3, 6, 7, 10) apply these classes to their section roots.
- Consumes: nothing (first task).

- [ ] **Step 1: Remove the retired blue gradient tokens from `globals.css`**

In `src/app/globals.css`, inside the `@theme inline { ... }` block, delete these three lines (currently lines 50-52):

```css
  --gradient-primary: linear-gradient(135deg, #1e57b8, #2d9ef8);
  --gradient-secondary: linear-gradient(135deg, #4ecdc4, #16a085);
  --gradient-accent: linear-gradient(135deg, #2e2e89, #5a43de);
```

- [ ] **Step 2: Repoint `font-display` to Fraunces**

Still inside `@theme inline`, change:

```css
  --font-display: var(--font-display);
```

to:

```css
  --font-display: var(--font-editorial);
```

- [ ] **Step 3: Remove Archivo from `layout.tsx`**

In `src/app/layout.tsx`, delete the Archivo import and instantiation:

```tsx
import { Archivo, Fraunces, Space_Grotesk } from "next/font/google";
```

becomes:

```tsx
import { Fraunces, Space_Grotesk } from "next/font/google";
```

Delete this whole block:

```tsx
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});
```

Remove `archivo.variable` from the `cn(...)` call in the `<html>` className:

```tsx
    <html
      lang="en"
      className={cn(
        "dark h-full scroll-smooth antialiased",
        archivo.variable,
        spaceGrotesk.variable,
        fraunces.variable
      )}
    >
```

becomes:

```tsx
    <html
      lang="en"
      className={cn(
        "dark h-full scroll-smooth antialiased",
        spaceGrotesk.variable,
        fraunces.variable
      )}
    >
```

- [ ] **Step 4: Unify the body background to the ember foundation**

In `src/app/layout.tsx`, change:

```tsx
    <body className="min-h-full bg-zinc-950 font-sans text-zinc-100">{children}</body>
```

to:

```tsx
    <body className="min-h-full bg-em-bg font-sans text-em-text">{children}</body>
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` — expect no errors (Archivo is fully unreferenced after Steps 1-4; confirm with a search: `grep -rn "archivo\|Archivo" src/` should return nothing).
Run: `npm run lint` — expect no errors.
Run: `npm run dev`, open the site — Hero should look unchanged (it already used `--em-*` tokens and Fraunces directly). About/Projects/Contact section headlines (`font-display` class) should visibly switch from Archivo to Fraunces. Body background outside any section should be near-black, not the old `zinc-950`.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: unify design tokens on ember/Fraunces foundation, retire Archivo and blue gradients"
```

---

### Task 2: GradientButton ember restyle + reusable magnetic hook

**Files:**
- Create: `src/hooks/use-magnetic.ts`
- Modify: `src/components/ui/GradientButton.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion()` (existing, `src/hooks/use-prefers-reduced-motion.ts`)
- Produces: `useMagnetic<T extends HTMLElement>(strength?: number): { ref: RefObject<T | null>, x: MotionValue<number>, y: MotionValue<number>, handleMouseMove: (e: React.MouseEvent<T>) => void, handleMouseLeave: () => void }` — consumed by Task 3 (Navbar CTA) and Task 10 (Contact submit button).
- Produces: `GradientButton` gains a `magnetic?: boolean` prop (default `false`). When `true`, the root element is a `motion.button`/`motion.a` using `useMagnetic()`.

- [ ] **Step 1: Create the magnetic hook**

Create `src/hooks/use-magnetic.ts`:

```ts
"use client";

import { useRef, type MouseEvent } from "react";
import { useMotionValue, useSpring } from "motion/react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 300, damping: 20, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 300, damping: 20, mass: 0.5 });

  const handleMouseMove = (e: MouseEvent<T>) => {
    if (reducedMotion || !isFinePointer() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - rect.left - rect.width / 2) * strength);
    rawY.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return { ref, x, y, handleMouseMove, handleMouseLeave };
}
```

- [ ] **Step 2: Restyle GradientButton to ember-only and wire up the `magnetic` prop**

Replace the full contents of `src/components/ui/GradientButton.tsx`:

```tsx
"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useMagnetic } from "@/hooks/use-magnetic";

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  size?: "default" | "lg";
  variant?: "primary" | "ghost" | "outline";
  type?: "button" | "submit" | "reset";
  magnetic?: boolean;
}

export function GradientButton({
  children,
  onClick,
  href,
  className,
  size = "default",
  variant = "primary",
  type = "button",
  magnetic = false,
}: GradientButtonProps) {
  const reducedMotion = usePrefersReducedMotion();
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagnetic<HTMLElement>();

  const baseClasses = cn(
    "relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-em-bg",
    size === "lg" ? "px-8 py-3.5 text-base" : "px-6 py-2.5 text-sm",
    variant === "primary" &&
      "bg-em-accent text-em-text shadow-lg shadow-em-accent/30 hover:bg-em-accent/90 focus-visible:ring-em-accent/60",
    variant === "ghost" &&
      "border border-em-text/20 bg-em-text/5 text-em-text backdrop-blur-md hover:bg-em-text/10 focus-visible:ring-em-accent/60",
    variant === "outline" &&
      "border border-em-accent/50 bg-transparent text-em-accent hover:bg-em-accent/10 focus-visible:ring-em-accent/60",
    className
  );

  const inner = (
    <>
      <motion.span
        className="relative z-10"
        whileHover={reducedMotion ? undefined : { y: -1 }}
        whileTap={reducedMotion ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
      {variant === "primary" && (
        <motion.span
          className="absolute inset-0 z-0 bg-white/15"
          initial={{ opacity: 0, x: "-100%" }}
          whileHover={reducedMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          aria-hidden="true"
        />
      )}
    </>
  );

  const magneticProps = magnetic
    ? {
        style: { x, y },
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
      }
    : {};

  if (href) {
    return (
      <motion.a
        ref={magnetic ? (ref as React.Ref<HTMLAnchorElement>) : undefined}
        href={href}
        className={baseClasses}
        onClick={onClick}
        {...magneticProps}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={magnetic ? (ref as React.Ref<HTMLButtonElement>) : undefined}
      type={type}
      className={baseClasses}
      onClick={onClick}
      {...magneticProps}
    >
      {inner}
    </motion.button>
  );
}
```

Note: `variant === "primary"` dropped the separate gradient `<span>` (it referenced the now-deleted `--gradient-primary`) and instead uses `bg-em-accent` directly on the root — a flat ember fill reads more restrained than a gradient wash, consistent with the "color spent deliberately" rule.

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.
Run: `npm run dev` — visit the Hero (outline CTA) and Contact (primary CTA) buttons, confirm they render in ember tones with no visual regression. `magnetic` isn't consumed anywhere yet, so no visual magnetic behavior is expected until Task 3.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/use-magnetic.ts src/components/ui/GradientButton.tsx
git commit -m "feat: restyle GradientButton to ember-only palette, add reusable magnetic hover hook"
```

---

### Task 3: Navbar — streak-underline links + magnetic CTA

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

**Interfaces:**
- Consumes: `GradientButton` with `magnetic` prop (Task 2).

- [ ] **Step 1: Replace the nav links with streak-underline versions and the CTA with a magnetic GradientButton**

In `src/components/layout/Navbar.tsx`, add the import:

```tsx
import { GradientButton } from "@/components/ui/GradientButton";
```

Replace the `<ul className="hidden items-center gap-8 md:flex">...</ul>` block:

```tsx
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="cursor-pointer text-sm font-medium text-zinc-300 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
```

with:

```tsx
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href} className="group relative">
              <a
                href={link.href}
                className="cursor-pointer text-sm font-medium text-em-text-muted transition-colors hover:text-em-text"
              >
                {link.label}
              </a>
              <span
                className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-em-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>
```

Replace the CTA `<a>`:

```tsx
        <a
          href="#contact"
          className="hidden cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white md:inline-flex"
          style={{ background: "var(--gradient-primary)" }}
        >
          Get in touch
        </a>
```

with:

```tsx
        <div className="hidden md:inline-flex">
          <GradientButton href="#contact" magnetic>
            Get in touch
          </GradientButton>
        </div>
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.
Run: `npm run dev` — hover each desktop nav link and confirm a thin ember line draws in from the left under it; move the mouse over the "Get in touch" button and confirm it pulls slightly toward the cursor. Toggle `prefers-reduced-motion` in devtools and confirm the magnetic pull stops (the streak-underline is a CSS transition, not gated by the reduced-motion hook — this is acceptable since it's a `transform: scaleX` under 300ms and covered by the global `@media (prefers-reduced-motion: reduce)` block in `globals.css:172-180`, which forces all transitions to ~0ms).

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: add streak-underline nav links and magnetic CTA to Navbar"
```

---

### Task 4: Hero — GSAP scroll-exit parallax + Lightfall pause when off-screen

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`

**Interfaces:**
- Consumes: `useInViewport(ref, options?)` (existing, `src/hooks/use-in-viewport.ts`), `Lightfall`'s existing `paused?: boolean` prop.

- [ ] **Step 1: Pause Lightfall when the Hero scrolls out of view**

In `src/components/sections/HeroSection.tsx`, add the import:

```tsx
import { useInViewport } from "@/hooks/use-in-viewport";
```

After the existing `const textVisible = useInView(...)` line, add:

```tsx
  const heroInViewport = useInViewport(sectionRef, { threshold: 0 });
```

In the `<Lightfall ... />` JSX, add the `paused` prop:

```tsx
        <Lightfall
          colors={["#c2542e", "#8a4a2e", "#e08a52"]}
          backgroundColor="#0b0a08"
          speed={reducedMotion ? 0.1 : 0.25}
          streakCount={2}
          streakWidth={1.1}
          density={0.35}
          glow={0.85}
          backgroundGlow={0.2}
          opacity={0.8}
          mouseInteraction={!reducedMotion}
          paused={!heroInViewport}
        />
```

- [ ] **Step 2: Add the GSAP scroll-exit parallax on the Hero content**

Add imports:

```tsx
import { useEffect } from "react";
```

(merge into the existing `import { useRef } from "react";` line so it reads `import { useEffect, useRef } from "react";`)

Add a ref for the content block. Change:

```tsx
      <div className="relative z-10 flex max-w-2xl flex-col items-start gap-5">
```

to:

```tsx
      <div ref={contentRef} className="relative z-10 flex max-w-2xl flex-col items-start gap-5">
```

Declare the ref near the top of the component, after `const sectionRef = useRef<HTMLElement>(null);`:

```tsx
  const contentRef = useRef<HTMLDivElement>(null);
```

Add the GSAP effect, after the `usePrefersReducedMotion()` line:

```tsx
  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !contentRef.current) return;

    let ctx: gsap.Context | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }, sectionRef);
    })();

    return () => ctx?.revert();
  }, [reducedMotion]);
```

Add the type-only import GSAP needs for `gsap.Context` (top of file, with the other imports):

```tsx
import type { gsap } from "gsap";
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — expect no errors. If `gsap.Context` isn't exported as a type from the root `gsap` module in the installed version, replace `gsap.Context` with `ReturnType<typeof gsap.context>` — check `node_modules/gsap/types/index.d.ts` for the actual exported type name if this errors, and use whichever one compiles.
Run: `npm run lint` — expect no errors.
Run: `npm run dev` — scroll down past the Hero and confirm the name/subtitle/CTA fade and drift upward as the Hero leaves the viewport, instead of just scrolling off statically. Toggle reduced-motion in devtools and confirm the effect is skipped entirely (content stays static, no GSAP import happens). Scroll further down so the Hero is fully out of view, open devtools' Performance/Rendering tab, and confirm no continuous WebGL frame is still being submitted for the Hero's Lightfall (the `paused` prop should stop its render loop).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat: add GSAP scroll-exit parallax to Hero and pause Lightfall when off-screen"
```

---

### Task 5: Marquee Ticker section (React Bits ScrollVelocity)

**Files:**
- Create: `src/components/reactbits/ScrollVelocity.tsx`
- Create: `src/components/reactbits/ScrollVelocity.css`
- Create: `src/components/sections/MarqueeTickerSection.tsx`

**Interfaces:**
- Produces: `export default function MarqueeTickerSection(): JSX.Element` — consumed by Task 11 (`page.tsx` assembly).

- [ ] **Step 1: Add the ScrollVelocity component (from React Bits registry, unmodified)**

Create `src/components/reactbits/ScrollVelocity.css`:

```css
.parallax {
  position: relative;
  overflow: hidden;
}

.scroller {
  display: flex;
  white-space: nowrap;
  text-align: center;
  font-family: sans-serif;
  font-size: 2.25rem;
  font-weight: bold;
  letter-spacing: -0.02em;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
}

.scroller span {
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .scroller {
    font-size: 5rem;
    line-height: 5rem;
  }
}
```

Create `src/components/reactbits/ScrollVelocity.tsx`:

```tsx
"use client";

import React, { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "motion/react";
import "./ScrollVelocity.css";

interface VelocityMapping {
  input: [number, number];
  output: [number, number];
}

interface VelocityTextProps {
  children: React.ReactNode;
  baseVelocity: number;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

interface ScrollVelocityProps {
  scrollContainerRef?: React.RefObject<HTMLElement>;
  texts: React.ReactNode[];
  velocity?: number;
  className?: string;
  damping?: number;
  stiffness?: number;
  numCopies?: number;
  velocityMapping?: VelocityMapping;
  parallaxClassName?: string;
  scrollerClassName?: string;
  parallaxStyle?: React.CSSProperties;
  scrollerStyle?: React.CSSProperties;
}

function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  scrollContainerRef,
  texts = [],
  velocity = 100,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName = "parallax",
  scrollerClassName = "scroller",
  parallaxStyle,
  scrollerStyle,
}) => {
  function VelocityText({
    children,
    baseVelocity = velocity,
    scrollContainerRef,
    className = "",
    damping,
    stiffness,
    numCopies,
    velocityMapping,
    parallaxClassName,
    scrollerClassName,
    parallaxStyle,
    scrollerStyle,
  }: VelocityTextProps) {
    const baseX = useMotionValue(0);
    const scrollOptions = scrollContainerRef ? { container: scrollContainerRef } : {};
    const { scrollY } = useScroll(scrollOptions);
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
      damping: damping ?? 50,
      stiffness: stiffness ?? 400,
    });
    const velocityFactor = useTransform(
      smoothVelocity,
      velocityMapping?.input || [0, 1000],
      velocityMapping?.output || [0, 5],
      { clamp: false }
    );

    const copyRef = useRef<HTMLSpanElement>(null);
    const copyWidth = useElementWidth(copyRef);

    function wrap(min: number, max: number, v: number): number {
      const range = max - min;
      const mod = (((v - min) % range) + range) % range;
      return mod + min;
    }

    const x = useTransform(baseX, (v) => {
      if (copyWidth === 0) return "0px";
      return `${wrap(-copyWidth, 0, v)}px`;
    });

    const directionFactor = useRef<number>(1);
    useAnimationFrame((_t, delta) => {
      let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

      if (velocityFactor.get() < 0) {
        directionFactor.current = -1;
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1;
      }

      moveBy += directionFactor.current * moveBy * velocityFactor.get();
      baseX.set(baseX.get() + moveBy);
    });

    const spans = [];
    for (let i = 0; i < (numCopies ?? 6); i++) {
      spans.push(
        <span className={className} key={i} ref={i === 0 ? copyRef : null}>
          {children}&nbsp;
        </span>
      );
    }

    return (
      <div className={parallaxClassName} style={parallaxStyle}>
        <motion.div className={scrollerClassName} style={{ x, ...scrollerStyle }}>
          {spans}
        </motion.div>
      </div>
    );
  }

  return (
    <section>
      {texts.map((text, index) => (
        <VelocityText
          key={index}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          scrollContainerRef={scrollContainerRef}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}
        </VelocityText>
      ))}
    </section>
  );
};

export default ScrollVelocity;
```

(This is the unmodified React Bits `ScrollVelocity-TS-CSS` source, pulled from `reactbits.dev/r/ScrollVelocity-TS-CSS.json`, with only `'use client'` added since it uses hooks and this project is App Router.)

- [ ] **Step 2: Build the Marquee Ticker section**

Create `src/components/sections/MarqueeTickerSection.tsx`:

```tsx
"use client";

import { ScrollVelocity } from "@/components/reactbits/ScrollVelocity";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Motion",
  "GSAP",
  "Three.js",
  "WebGL",
  "Tailwind CSS",
];

export default function MarqueeTickerSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-label="Skills and tools"
      className="relative w-full overflow-hidden border-y border-em-text/10 bg-em-bg py-8"
    >
      <ScrollVelocity
        texts={[skills.join("  •  ")]}
        velocity={reducedMotion ? 0 : 40}
        className="font-mono font-normal text-em-text-muted"
        numCopies={4}
      />
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.
Run: `npm run dev` — this section isn't wired into `page.tsx` yet (Task 11 does that), so verify it directly: temporarily add `<MarqueeTickerSection />` to `src/app/page.tsx` between Hero and PortfolioGallerySection, confirm the ticker scrolls continuously and visibly speeds up when you scroll the page fast, then **revert that temporary edit** (Task 11 will do the real wiring in the correct final order).

- [ ] **Step 4: Commit**

```bash
git add src/components/reactbits/ScrollVelocity.tsx src/components/reactbits/ScrollVelocity.css src/components/sections/MarqueeTickerSection.tsx
git commit -m "feat: add Marquee Ticker section using React Bits ScrollVelocity"
```

---

### Task 6: Selected Work — pointer-tilt cards with ember glow

**Files:**
- Modify: `src/components/sections/PortfolioGallerySection.tsx`

**Interfaces:**
- Consumes: `usePrefersReducedMotion()` (existing).
- Note: the design spec names React Bits `tilted-card` for this section. `TiltedCard` as shipped (`reactbits.dev/r/TiltedCard-TS-CSS.json`) is image-based (`imageSrc` required, renders an `<img>`) and this site's project cards have no real images (placeholder content, no assets provided). Rather than force a placeholder `<img>` into an image-shaped component, this task adapts `TiltedCard`'s actual mechanic — pointer-offset → spring-driven `rotateX`/`rotateY` via `useMotionValue`/`useSpring` — directly onto the existing gradient-header `ProjectCard`, which already has the content structure we need. This is the same "use the technique, not the literal demo markup" approach already applied to the KokonutUI bento grid in Task 8.

- [ ] **Step 1: Replace `ProjectCard`'s hover mechanic with pointer-tracked tilt + ember glow**

In `src/components/sections/PortfolioGallerySection.tsx`, the `ProjectCard` function currently reads:

```tsx
function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (p: Project) => void;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={() => onSelect(project)}
    >
      <motion.div
        whileHover={reducedMotion ? undefined : { rotateY: 4, rotateX: -2 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-shadow duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-blue-900/20"
      >
```

Replace the whole function (through its closing `}` before `export default function PortfolioGallerySection`) with:

```tsx
function ProjectCard({
  project,
  index,
  onSelect,
}: {
  project: Project;
  index: number;
  onSelect: (p: Project) => void;
}) {
  const reducedMotion = usePrefersReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20, mass: 1 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20, mass: 1 });

  const isFinePointer = () =>
    typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !isFinePointer() || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -8);
    rotateY.set((offsetX / (rect.width / 2)) * 8);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      style={{ perspective: "1200px" }}
      onClick={() => onSelect(project)}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="overflow-hidden rounded-2xl border border-em-text/10 bg-em-text/[0.03] backdrop-blur-sm transition-shadow duration-300 hover:border-em-accent/40 hover:shadow-xl hover:shadow-em-accent/20"
      >
```

- [ ] **Step 2: Add the new imports and switch tag colors to ember**

Change the top import line:

```tsx
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
```

to:

```tsx
import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
```

Change the tag pill classes (two occurrences — inside `ProjectCard` and inside the modal), from:

```tsx
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-zinc-300"
```

to:

```tsx
                className="rounded-full border border-em-accent/20 bg-em-accent/5 px-2.5 py-0.5 text-xs font-medium text-em-text-muted"
```

and (modal variant, `px-3 py-1 text-sm`):

```tsx
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-300"
```

to:

```tsx
                    className="rounded-full border border-em-accent/20 bg-em-accent/5 px-3 py-1 text-sm text-em-text-muted"
```

- [ ] **Step 3: Switch section background and headline to the ember foundation**

Change:

```tsx
    <section id="projects" ref={ref} className="relative bg-zinc-950 px-6 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(45,158,248,0.06),transparent_70%)]" />
```

to:

```tsx
    <section id="projects" ref={ref} className="relative bg-em-bg px-6 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(194,84,46,0.08),transparent_70%)]" />
```

Change the eyebrow/heading text colors:

```tsx
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue-400/80">
            Selected Work
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Projects
          </h2>
```

to:

```tsx
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-em-accent/80">
            Selected Work
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-em-text md:text-5xl">
            <BlurText text="Projects" delay={0.03} duration={0.6} ease="easeOut" />
          </h2>
```

Add the import:

```tsx
import { BlurText } from "@/components/reactbits/BlurText";
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.
Run: `npm run dev`, scroll to Projects — confirm cards tilt smoothly following the cursor (not the old fixed 4°/-2° hover), the border/shadow glows ember on hover, and the "Projects" heading uses the BlurText reveal. Test on a touch-emulated device (devtools device toolbar) and confirm cards don't jitter (tilt no-ops without a fine pointer).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/PortfolioGallerySection.tsx
git commit -m "feat: pointer-tilt Selected Work cards with ember glow, switch section to ember palette"
```

---

### Task 7: About — CountUp stats + ember/Fraunces unification

**Files:**
- Create: `src/components/reactbits/CountUp.tsx`
- Modify: `src/components/sections/AboutMeSection.tsx`

**Interfaces:**
- Produces: `export default function CountUp(props: CountUpProps): JSX.Element` — `CountUpProps = { to: number; from?: number; direction?: 'up'|'down'; delay?: number; duration?: number; className?: string; startWhen?: boolean; separator?: string; onStart?: () => void; onEnd?: () => void }`.

- [ ] **Step 1: Add the CountUp component (from React Bits registry, unmodified)**

Create `src/components/reactbits/CountUp.tsx`:

```tsx
"use client";

import { useInView, useMotionValue, useSpring } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes(".")) {
      const decimals = str.split(".")[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;

      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      };

      const formattedNumber = Intl.NumberFormat("en-US", options).format(latest);

      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === "down" ? to : from);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (isInView && startWhen) {
      if (typeof onStart === "function") {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === "function") {
            onEnd();
          }
        },
        delay * 1000 + duration * 1000
      );

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest: number) => {
      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue]);

  return <span className={className} ref={ref} />;
}
```

- [ ] **Step 2: Add a stats row to About, driven by CountUp, and switch to ember/BlurText**

In `src/components/sections/AboutMeSection.tsx`, add imports:

```tsx
import CountUp from "@/components/reactbits/CountUp";
import { BlurText } from "@/components/reactbits/BlurText";
```

Add a stats data array near the top, alongside `skills`/`achievements`:

```tsx
const stats = [
  { value: 6, suffix: "+", label: "Years building interfaces" },
  { value: 30, suffix: "+", label: "Projects shipped" },
  { value: 100, suffix: "%", label: "Cinematic intent" },
];
```

Change the section background and radial accent:

```tsx
    <section
      id="about"
      ref={ref}
      className="relative w-full overflow-hidden bg-zinc-950 px-6 py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(30,87,184,0.12),transparent_60%)]" />
```

to:

```tsx
    <section
      id="about"
      ref={ref}
      className="relative w-full overflow-hidden bg-em-bg px-6 py-32"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(194,84,46,0.1),transparent_60%)]" />
```

Change the eyebrow, heading, and body text colors:

```tsx
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue-400/80">
            About
          </p>
          <h2 className="font-display mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Engineering with
            <span
              className="block"
              style={{
                background: "var(--gradient-accent)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              cinematic intent
            </span>
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-zinc-400">
```

to:

```tsx
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-em-accent/80">
            About
          </p>
          <h2 className="font-display mb-6 text-4xl font-bold tracking-tight text-em-text md:text-5xl">
            <BlurText text="Engineering with" delay={0.03} duration={0.6} ease="easeOut" />
            <span className="block text-em-accent">
              <BlurText text="cinematic intent" delay={0.03} duration={0.6} ease="easeOut" />
            </span>
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-em-text-muted">
```

Change the achievement bullet color:

```tsx
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
```

to:

```tsx
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-em-accent" />
```

Change the skill card hover colors:

```tsx
              className="group cursor-default rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-blue-400/30 hover:bg-white/[0.06]"
            >
              <skill.icon
                size={22}
                className="mb-3 text-blue-400 transition-transform duration-300 group-hover:scale-110"
              />
```

to:

```tsx
              className="group cursor-default rounded-xl border border-em-text/10 bg-em-text/[0.03] p-5 backdrop-blur-sm transition-all duration-300 hover:border-em-accent/30 hover:bg-em-text/[0.06]"
            >
              <skill.icon
                size={22}
                className="mb-3 text-em-accent transition-transform duration-300 group-hover:scale-110"
              />
```

Add the stats row right after the `</ul>` that closes the achievements list (still inside the left column `motion.div`, before its closing `</motion.div>`):

```tsx
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-em-text/10 pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl font-bold text-em-text">
                  <CountUp to={stat.value} duration={1.5} />
                  {stat.suffix}
                </div>
                <p className="mt-1 text-xs text-em-text-dim">{stat.label}</p>
              </div>
            ))}
          </div>
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.
Run: `npm run dev`, scroll to About — confirm the heading uses the BlurText reveal, stats animate upward from 0 when the section scrolls into view, and all blue accents are gone (visually confirm via devtools' color picker on the eyebrow/bullets/skill icons — should read as the ember hex, not any blue).

- [ ] **Step 4: Commit**

```bash
git add src/components/reactbits/CountUp.tsx src/components/sections/AboutMeSection.tsx
git commit -m "feat: add CountUp stats to About, unify on ember palette and BlurText headline"
```

---

### Task 8: Skills / Stack — bento grid (adapted from KokonutUI)

**Files:**
- Create: `src/components/kokonutui/BentoGrid.tsx`
- Create: `src/components/sections/SkillsStackSection.tsx`

**Interfaces:**
- Produces: `export default function SkillsStackSection(): JSX.Element` — consumed by Task 11.
- Note: KokonutUI's real `bento-grid` registry item (`kokonutui.com/r/bento-grid.json`) ships as a complete themed demo — hardcoded copy about "Building tomorrow's technology," bundled SVG logos for OpenAI/Anthropic/Gemini/Mistral/DeepSeek, and a fake voice-assistant widget. None of that is relevant to a personal tech-stack section, and shipping AI-vendor logos as "skills" would be actively wrong. Per CLAUDE.md's KokonutUI rule ("treat snippets as direct extensions of our shadcn structure"), this task extracts the **reusable mechanic** — the `BentoCard` pointer-tilt hover (`useMotionValue`/`useTransform` on `rotateX`/`rotateY`) and the glass-card visual treatment — and rebuilds it against a plain `{ id, title, description, icon }[]` data shape using `lucide-react` icons already used elsewhere in this codebase, instead of copying the AI-demo content wholesale.

- [ ] **Step 1: Build the adapted BentoGrid component**

Create `src/components/kokonutui/BentoGrid.tsx`:

```tsx
"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, type Variants } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BentoItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

function BentoCard({ item }: { item: BentoItem }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [4, -4]);
  const rotateY = useTransform(x, [-100, 100], [-4, 4]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - rect.left) / rect.width - 0.5) * 100);
    y.set(((event.clientY - rect.top) / rect.height - 0.5) * 100);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const Icon = item.icon;

  return (
    <motion.div
      className={cn("h-full", item.className)}
      variants={fadeInUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className="group relative flex h-full flex-col gap-3 rounded-xl border border-em-text/10 bg-em-text/[0.03] p-5 backdrop-blur-sm transition-colors duration-300 hover:border-em-accent/40 hover:bg-em-text/[0.05] hover:shadow-lg hover:shadow-em-accent/10"
        style={{ transform: "translateZ(20px)" }}
      >
        <Icon size={22} className="text-em-accent" />
        <h3 className="font-display text-base font-semibold text-em-text">{item.title}</h3>
        <p className="text-sm leading-relaxed text-em-text-muted">{item.description}</p>
      </div>
    </motion.div>
  );
}

export function BentoGrid({ items }: { items: BentoItem[] }) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainer}
    >
      {items.map((item) => (
        <BentoCard key={item.id} item={item} />
      ))}
    </motion.div>
  );
}
```

- [ ] **Step 2: Build the Skills/Stack section using it**

Create `src/components/sections/SkillsStackSection.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { Boxes, Sparkles, Wrench } from "lucide-react";
import { BentoGrid, type BentoItem } from "@/components/kokonutui/BentoGrid";
import { BlurText } from "@/components/reactbits/BlurText";

const skillItems: BentoItem[] = [
  {
    id: "frontend",
    title: "Frontend",
    description: "React, Next.js App Router, TypeScript, Tailwind CSS.",
    icon: Boxes,
  },
  {
    id: "motion-3d",
    title: "Motion & 3D",
    description: "Motion, GSAP + ScrollTrigger, Three.js, React Three Fiber, OGL/WebGL.",
    icon: Sparkles,
  },
  {
    id: "tooling",
    title: "Tooling",
    description: "shadcn/ui, ESLint, component-driven architecture.",
    icon: Wrench,
  },
];

export default function SkillsStackSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={ref} className="relative w-full bg-em-bg px-6 py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-em-accent/80">
            Skills &amp; Stack
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-em-text md:text-5xl">
            <BlurText text="What I build with" delay={0.03} duration={0.6} ease="easeOut" />
          </h2>
        </div>
        {inView && <BentoGrid items={skillItems} />}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.
Run: `npm run dev` — temporarily render `<SkillsStackSection />` in `page.tsx` to check it in isolation (revert after, Task 11 wires it properly): confirm the three cards fade/stagger in on scroll, tilt toward the cursor, and glow ember on hover.

- [ ] **Step 4: Commit**

```bash
git add src/components/kokonutui/BentoGrid.tsx src/components/sections/SkillsStackSection.tsx
git commit -m "feat: add Skills/Stack bento grid, adapted from KokonutUI's tilt-card mechanic"
```

---

### Task 9: Process / Timeline — GSAP scroll-scrubbed line-draw

**Files:**
- Create: `src/components/sections/ProcessTimelineSection.tsx`

**Interfaces:**
- Produces: `export default function ProcessTimelineSection(): JSX.Element` — consumed by Task 11.

- [ ] **Step 1: Build the timeline section**

Create `src/components/sections/ProcessTimelineSection.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import type { gsap } from "gsap";
import { BlurText } from "@/components/reactbits/BlurText";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  { title: "Discover", description: "Understand the problem, audience, and constraints before touching a design tool." },
  { title: "Design", description: "Establish layout rhythm, typography, and motion language as one system, not an afterthought." },
  { title: "Build", description: "Ship precise, typed, componentized code — one reviewable piece at a time." },
  { title: "Refine", description: "Polish motion, accessibility, and performance until nothing feels templated." },
];

export default function ProcessTimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !lineRef.current) return;

    let ctx: gsap.Context | undefined;

    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top center",
              end: "bottom center",
              scrub: true,
            },
          }
        );
      }, sectionRef);
    })();

    return () => ctx?.revert();
  }, [reducedMotion]);

  return (
    <section id="process" ref={sectionRef} className="relative w-full bg-em-bg px-6 py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-16 text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-em-accent/80">
            Process
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-em-text md:text-5xl">
            <BlurText text="How I work" delay={0.03} duration={0.6} ease="easeOut" />
          </h2>
        </div>

        <div className="relative pl-10">
          <div className="absolute left-3 top-1 bottom-1 w-px bg-em-text/10" aria-hidden="true" />
          <div
            ref={lineRef}
            className="absolute left-3 top-1 bottom-1 w-px origin-top bg-em-accent"
            style={{ transform: reducedMotion ? "scaleY(1)" : "scaleY(0)" }}
            aria-hidden="true"
          />
          <ol className="space-y-12">
            {steps.map((step, i) => (
              <li key={step.title} className="relative">
                <span
                  className="absolute -left-10 top-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-em-accent/40 bg-em-bg font-mono text-xs text-em-accent"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3 className="font-display text-xl font-semibold text-em-text">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-em-text-muted">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — expect no errors (if `gsap.Context` doesn't resolve, apply the same fallback noted in Task 4 Step 3).
Run: `npm run lint` — expect no errors.
Run: `npm run dev` — temporarily render `<ProcessTimelineSection />` in `page.tsx` to check in isolation (revert after): confirm the vertical ember line draws downward in sync with scroll position as the section passes through the viewport, and with reduced-motion enabled the line is instantly fully drawn (no scrub).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ProcessTimelineSection.tsx
git commit -m "feat: add Process/Timeline section with GSAP scroll-scrubbed line-draw"
```

---

### Task 10: Contact + Footer — Lightfall bookend

**Files:**
- Modify: `src/components/sections/ContactSection.tsx`
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: `Lightfall` (existing, `src/components/reactbits/Lightfall.tsx`), `useInViewport` (existing), `GradientButton` with `magnetic` prop (Task 2).

- [ ] **Step 1: Wrap Contact + Footer in a shared Lightfall bookend panel**

In `src/components/sections/ContactSection.tsx`, add imports:

```tsx
import { useInViewport } from "@/hooks/use-in-viewport";
import Lightfall from "@/components/reactbits/Lightfall";
import { Footer } from "@/components/layout/Footer";
```

Change the component to wrap both Contact content and `<Footer />` inside one relatively-positioned bookend container with its own Lightfall background, mirroring the Hero's layering pattern. Replace:

```tsx
  return (
    <section id="contact" ref={ref} className="relative bg-zinc-950 px-6 py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(90,67,222,0.1),transparent_60%)]" />

      <div className="relative mx-auto max-w-2xl">
```

with:

```tsx
  const bookendRef = useRef<HTMLDivElement>(null);
  const bookendInViewport = useInViewport(bookendRef, { threshold: 0 });

  return (
    <div ref={bookendRef} className="relative w-full overflow-hidden bg-em-bg">
      <div className="absolute inset-0 z-0">
        <Lightfall
          colors={["#8a4a2e", "#c2542e", "#5c3826"]}
          backgroundColor="#0b0a08"
          speed={reducedMotion ? 0.05 : 0.12}
          streakCount={1}
          streakWidth={0.9}
          density={0.25}
          glow={0.5}
          backgroundGlow={0.12}
          opacity={0.5}
          mouseInteraction={false}
          paused={!bookendInViewport}
        />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-em-bg/40 via-transparent to-em-bg" />

      <section id="contact" ref={ref} className="relative z-10 px-6 py-32">
      <div className="relative mx-auto max-w-2xl">
```

(The extra one-space indent on the last two lines above is intentional and will be corrected by running the codebase's formatter/lint-fix after the edit — do not hand-align further; correctness of nesting matters more than whitespace at this step.)

Add `reducedMotion` to the component (it isn't currently declared in `ContactSection`). After the `const [submitted, setSubmitted] = useState(false);` line, add:

```tsx
  const reducedMotion = usePrefersReducedMotion();
```

and add the import:

```tsx
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
```

At the very end of the component, replace the final:

```tsx
      </div>
    </section>
  );
}
```

with:

```tsx
      </div>
      </section>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Ember-ify Contact's copy, inputs, and submit button**

Change:

```tsx
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(90,67,222,0.1),transparent_60%)]" />
```

— this line was already removed in Step 1's replacement (the radial gradient is superseded by the Lightfall layer); if it's still present after Step 1's edit, delete it now.

Change eyebrow/heading/subtext:

```tsx
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-blue-400/80">
            Contact
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Let&apos;s build something
          </h2>
          <p className="mt-4 text-zinc-400">
            Open to full-time roles, collaborations, and interesting projects.
          </p>
```

to:

```tsx
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-em-accent/80">
            Contact
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-em-text md:text-5xl">
            <BlurText text="Let's build something" delay={0.03} duration={0.6} ease="easeOut" />
          </h2>
          <p className="mt-4 text-em-text-muted">
            Open to full-time roles, collaborations, and interesting projects.
          </p>
```

Add the import: `import { BlurText } from "@/components/reactbits/BlurText";`

Change the "submitted" confirmation card:

```tsx
            className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-10 text-center"
          >
            <p className="text-lg font-medium text-white">Message received.</p>
            <p className="mt-2 text-zinc-400">I&apos;ll get back to you soon.</p>
```

to:

```tsx
            className="rounded-2xl border border-em-accent/20 bg-em-accent/5 p-10 text-center"
          >
            <p className="text-lg font-medium text-em-text">Message received.</p>
            <p className="mt-2 text-em-text-muted">I&apos;ll get back to you soon.</p>
```

Change every input/textarea's label and focus-ring classes (three occurrences: `name`, `email`, `message`). Label color:

```tsx
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-zinc-300">
```

→ `text-em-text-muted` in place of `text-zinc-300` (apply the same swap to the `email` and `message` labels).

Input/textarea classes:

```tsx
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-600 transition-colors focus:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
```

to:

```tsx
                  className="w-full rounded-lg border border-em-text/10 bg-em-text/5 px-4 py-3 text-em-text placeholder-em-text-dim transition-colors focus:border-em-accent/50 focus:outline-none focus:ring-2 focus:ring-em-accent/20"
```

(apply this same replacement to all three fields — `name`, `email`, `message`).

Make the submit button magnetic:

```tsx
              <GradientButton type="submit" size="lg" className="gap-2">
                <Send size={16} />
                Send message
              </GradientButton>
```

to:

```tsx
              <GradientButton type="submit" size="lg" className="gap-2" magnetic>
                <Send size={16} />
                Send message
              </GradientButton>
```

- [ ] **Step 3: Simplify Footer for its new home inside the bookend, ember hover on social icons**

Replace the contents of `src/components/layout/Footer.tsx`:

```tsx
import { Code2, Link2, Mail } from "lucide-react";

const socialLinks = [
  { href: "https://github.com", icon: Code2, label: "GitHub" },
  { href: "https://linkedin.com", icon: Link2, label: "LinkedIn" },
  { href: "mailto:hello@paolo.dev", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-em-text/10 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
        <p className="text-sm text-em-text-dim">
          © {new Date().getFullYear()} Paolo Rossi. Crafted with intent.
        </p>

        <div className="flex items-center gap-4">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="cursor-pointer rounded-lg p-2 text-em-text-muted transition-colors hover:bg-em-accent/10 hover:text-em-accent"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

(Only the `bg-zinc-950` root class is removed — Footer no longer sets its own background since it now lives inside `ContactSection`'s bookend wrapper — and colors/hover states switch to the ember tokens. `border-t` and layout are otherwise unchanged.)

- [ ] **Step 4: Remove the now-duplicate `<Footer />` render from `page.tsx`**

This is a placeholder note for Task 11, which handles all of `page.tsx` — do not edit `page.tsx` in this task. Confirm here only that `Footer` is no longer imported/rendered standalone anywhere except inside `ContactSection.tsx` once Task 11 runs.

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.
Run: `npm run dev` — temporarily render just `<ContactSection />` (without a separate `<Footer />`) at the bottom of `page.tsx` to check in isolation (Task 11 finalizes this): confirm a dim, slow Lightfall renders behind both the contact form and the footer band, the submit button pulls toward the cursor, and scrolling this section out of view stops the Lightfall's render loop (check devtools Performance/Rendering, same method as Task 4).

- [ ] **Step 6: Commit**

```bash
git add src/components/sections/ContactSection.tsx src/components/layout/Footer.tsx
git commit -m "feat: merge Contact and Footer into a shared dimmed Lightfall bookend panel"
```

---

### Task 11: Final assembly — `page.tsx` in the new section order

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `HeroSection`, `MarqueeTickerSection` (Task 5), `PortfolioGallerySection`, `AboutMeSection`, `SkillsStackSection` (Task 8), `ProcessTimelineSection` (Task 9), `ContactSection` (now also renders `Footer` internally, per Task 10).

- [ ] **Step 1: Reorder and wire every section**

Replace the full contents of `src/app/page.tsx`:

```tsx
import HeroSection from "@/components/sections/HeroSection";
import MarqueeTickerSection from "@/components/sections/MarqueeTickerSection";
import PortfolioGallerySection from "@/components/sections/PortfolioGallerySection";
import AboutMeSection from "@/components/sections/AboutMeSection";
import SkillsStackSection from "@/components/sections/SkillsStackSection";
import ProcessTimelineSection from "@/components/sections/ProcessTimelineSection";
import ContactSection from "@/components/sections/ContactSection";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full bg-em-bg">
        <HeroSection />
        <MarqueeTickerSection />
        <PortfolioGallerySection />
        <AboutMeSection />
        <SkillsStackSection />
        <ProcessTimelineSection />
        <ContactSection />
      </main>
    </>
  );
}
```

Note `Footer` is no longer imported here — it's rendered from inside `ContactSection` (Task 10).

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.
Run: `npm run build` — this is the first full production build since the redesign started; expect it to succeed with no type or bundling errors. Confirm the bundle didn't balloon unexpectedly (GSAP and the tilt/bento components should still be part of normal client-component chunking, not a giant new synchronous dependency — spot-check the build output's route size for `/`).
Run: `npm run dev`, then walk the entire page top to bottom:
  - Nav streak-underline + magnetic CTA work
  - Hero Lightfall renders, content fades on scroll-exit, pauses off-screen
  - Marquee ticker scrolls and reacts to scroll velocity
  - Selected Work cards tilt + glow, modal still opens/closes correctly
  - About stats count up, headline uses BlurText
  - Skills bento cards tilt + glow
  - Process timeline line draws in sync with scroll
  - Contact + Footer sit inside the dimmed Lightfall bookend, form submits, submit button is magnetic
  - Toggle `prefers-reduced-motion` in devtools and re-walk the page — every animation listed above should degrade to static/instant, nothing should be broken or invisible
  - Resize to a mobile viewport — no horizontal scroll, tilt/magnetic effects don't jitter, Lightfall still renders (dimmed as designed)

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: assemble redesigned portfolio in proof-first section order"
```

---

## Self-Review Notes

- **Spec coverage:** every §4 table row in the design spec maps to a task — Navbar→3, Hero→4, Marquee Ticker→5, Selected Work→6, About→7, Skills/Stack→8, Process/Timeline→9, Contact→10, Footer→10. Visual system (§2) → Task 1. Testimonials (cut) → intentionally absent, matches spec §3.
- **Two deliberate deviations from the spec's literal component names**, both documented inline where they occur (Task 6, Task 8): `tilted-card` and KokonutUI's `bento-grid` are used for their *mechanic*, not their literal demo markup, because both ship in a shape (image-required; AI-vendor-logo demo content) that doesn't fit this project's actual data. This was a real constraint discovered during planning, not a scope-narrowing shortcut — the tilt/glass-card techniques specified are still what ships.
- **Type consistency check:** `useMagnetic<T>()` (Task 2) return shape — `{ ref, x, y, handleMouseMove, handleMouseLeave }` — is used identically in `GradientButton` (Task 2) as the only consumer with a generic hook call; Task 3 and Task 10 consume it indirectly only through `GradientButton`'s `magnetic` prop, not by calling the hook directly, so there's no signature drift risk between tasks.
- **`gsap.Context` typing** is flagged as potentially needing a fallback (`ReturnType<typeof gsap.context>`) in both Task 4 and Task 9's verify steps, since the exact exported type name can shift between GSAP versions — called out explicitly rather than assumed, so the implementer isn't stuck on an unexplained type error.

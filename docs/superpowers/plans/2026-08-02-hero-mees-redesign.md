# Hero Mees-Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Hero section's content and layout to match `meesverberne.com`'s composition exactly, per `docs/superpowers/specs/2026-08-02-hero-mees-redesign-design.md`.

**Architecture:** Two independently-testable tasks. Task 1 rewrites the existing `Marquee` component in place (single ✕ separator with a turning animation, scroll-velocity-driven direction/speed) since it's a self-contained UI primitive with no dependents besides the Hero. Task 2 rewrites `HeroSection` to consume the updated `Marquee`, restructure the layout into the grid described in the spec, and drop the status pill.

**Tech Stack:** Next.js 16 / React 19, Tailwind CSS v4, `framer-motion` (this repo's convention for section/component-level motion — `motion/react` is only used in `use-magnetic.ts`), TypeScript strict mode.

## Global Constraints

- **No test framework exists in this repo** (no Jest/Vitest/Playwright config). Per-task verification is: (1) `npx tsc --noEmit` for type safety, (2) `npm run lint` for lint cleanliness, (3) `npm run dev` + manual browser check confirming the specific behavior the task describes. This is what CLAUDE.md's "Pre-Delivery Verification" rule requires for this project — it is not a shortcut.
- This phase does **not** touch anything below the Hero (`IntroBioSection` and later) — those are separate, already-tracked phases.
- Keep using the existing `--em-*` design tokens, `font-display`/`font-cursive` utilities, `BlurText`, `ImagePlaceholder`, `usePrefersReducedMotion`, `useInViewport` — these are shared infrastructure, not part of the "don't reference the current design" directive.
- `Marquee` keeps its existing public shape (`items: string[]`, `className?: string`) with one addition (`baseVelocity?: number`) — no breaking changes to its call site beyond the new prop being optional.
- Content is final, not placeholder: name "Paolo" / "Jansen Enrera", marquee words "Developer", "Engineer", "Builder", "Creative", cursive "Debug & Build" with "P./" label, existing bio paragraphs verbatim, subheading "Skilled in both *developing* and *design*".

---

### Task 1: Marquee — single ✕ separator, turning animation, scroll-velocity direction

**Files:**
- Modify: `src/components/ui/Marquee.tsx` (full rewrite)
- Modify: `src/app/globals.css:192-198` (replace the `marquee-scroll` keyframe with `marquee-x-spin`)

**Interfaces:**
- Consumes: `usePrefersReducedMotion()` (`src/hooks/use-prefers-reduced-motion.ts`, existing, no changes), `useInViewport(ref, options?)` (`src/hooks/use-in-viewport.ts`, existing, no changes), `cn()` (`src/lib/utils`, existing).
- Produces: `Marquee({ items: string[], className?: string, baseVelocity?: number })` — same call shape the Hero already uses (`<Marquee items={...} className="..." />`), consumed by Task 2.

- [ ] **Step 1: Replace the `marquee-scroll` keyframe with `marquee-x-spin` in `globals.css`**

In `src/app/globals.css`, find:

```css
@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
```

Replace it with:

```css
@keyframes marquee-x-spin {
  to {
    transform: rotate(360deg);
  }
}
```

(`marquee-scroll` is only referenced from `Marquee.tsx`, which Step 2 rewrites to use a Motion-driven transform instead of a CSS animation, so it has no other consumers.)

- [ ] **Step 2: Rewrite `Marquee.tsx`**

Replace the full contents of `src/components/ui/Marquee.tsx`:

```tsx
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
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors. If lint flags the unused `motion` import (it's used via `<motion.div>`, so it shouldn't), double-check the JSX still references it.
Run: `npm run dev`, open the site — the Hero's marquee row should show a single "✕" between every word (no more alternating "+"), all words the same color, and each "✕" continuously spinning in place. With the page at rest, the row should crawl slowly right-to-left. Scroll down and confirm it speeds up (still right-to-left); scroll up and confirm it visibly reverses to left-to-right, then returns to right-to-left once you stop or resume scrolling down. Toggle `prefers-reduced-motion` in devtools and confirm both the crawl and the ✕ spin stop entirely. Scroll the marquee out of the viewport (scroll far down the page) and confirm — via a quick devtools Performance/Rendering check, or just visually on scroll-back — that it isn't animating while off-screen.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/Marquee.tsx src/app/globals.css
git commit -m "feat: rewrite Marquee with single-glyph turning separator and scroll-velocity direction"
```

---

### Task 2: HeroSection — Mees composition rebuild

**Files:**
- Modify: `src/components/sections/HeroSection.tsx` (full rewrite)

**Interfaces:**
- Consumes: `Marquee({ items, className })` (Task 1), `BlurText` (`src/components/reactbits/BlurText.tsx`, existing, unchanged — self-contained `useInView`, no external gating needed), `ImagePlaceholder` (`src/components/ui/ImagePlaceholder.tsx`, existing, unchanged).
- Produces: `export default function HeroSection(): JSX.Element` — no props (the previous `name`/`status` props are removed; nothing else in the codebase passes them, confirmed via `HeroSection` usage search — only `src/app/page.tsx` renders `<HeroSection />` with no props).

- [ ] **Step 1: Replace the full contents of `HeroSection.tsx`**

```tsx
"use client";

import { BlurText } from "@/components/reactbits/BlurText";
import { Marquee } from "@/components/ui/Marquee";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

const MARQUEE_ITEMS = ["Developer", "Engineer", "Builder", "Creative"];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-em-bg px-6 pb-20 pt-16 md:px-16 md:pt-24"
    >
      <h1 className="font-display -mx-6 overflow-hidden text-[16vw] font-black leading-[0.85] tracking-tight text-em-text md:-mx-16 md:text-[11vw]">
        <BlurText text="Paolo" delay={0.04} duration={0.7} ease="easeOut" className="block px-6 md:px-16" />
        <BlurText
          text="Jansen Enrera"
          delay={0.1}
          duration={0.7}
          ease="easeOut"
          className="block px-6 md:px-16"
        />
      </h1>

      <div className="relative -mx-6 mt-2 md:-mx-16">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-1/2 hidden -translate-y-1/2 text-em-text-dim md:block"
        >
          |
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 text-em-text-dim md:block"
        >
          |
        </span>
        <Marquee items={MARQUEE_ITEMS} className="border-y border-em-text/10 py-3" />
      </div>

      <div className="mx-auto mt-16 max-w-6xl md:mt-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5 md:col-start-4">
            <ImagePlaceholder
              alt="A portrait-style project photo of Paolo at work"
              aspectRatio="4 / 5"
              label="Project photo"
              className="w-full max-w-sm rounded-sm md:max-w-none"
            />
          </div>

          <div className="flex flex-col gap-5 md:col-span-4 md:col-start-9">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-em-text-dim">P./</span>
              <span className="font-cursive text-4xl leading-none text-em-accent md:text-5xl">
                Debug &amp; Build
              </span>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-em-text-muted md:text-lg">
              <p>
                Computer Engineering graduate who builds at both ends of the stack — enterprise AI
                agents at Accenture and low-level firmware in the lab. At Accenture I spent 540
                hours developing Salesforce Agentforce agents that create, update, and close
                support cases and automate account-billing workflows.
              </p>
              <p>
                Based in Cebu City, Philippines. Actively looking for new opportunities —
                especially Salesforce, Agentforce, or building smarter customer-experience
                tooling.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-10 max-w-xs font-display text-lg leading-snug text-em-text md:mt-16">
          Skilled in both <em className="italic">developing</em> and <em className="italic">design</em>
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.
Run: `npm run dev`, open the site and check:
  - The name reads "Paolo" on its own line, "Jansen Enrera" on the line below, at the same oversized full-bleed scale as before.
  - No status/availability pill appears above the name.
  - The marquee row sits directly under the name, flanked by the two thin "|" tick marks at the row's edges on desktop (hidden on mobile).
  - The project photo is a centered, portrait-oriented placeholder roughly in the horizontal middle of the content area (not pinned to the left half).
  - "P./ Debug & Build" sits above the two bio paragraphs, in a column to the right of the photo, with no rotation.
  - "Skilled in both *developing* and *design*" appears below the photo/text row, left-aligned, with "developing" and "design" italicized.
  - Resize to a mobile width (devtools device toolbar) and confirm everything stacks in one column in this order: name, marquee (no tick marks), photo, cursive label, bio paragraphs, subheading.
  - Tab through the page with keyboard-only navigation and confirm nothing in the Hero traps focus or is unreachable (there are no interactive elements in this section besides whatever the Navbar already provides, so this should be a no-op check).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat: rebuild Hero in Mees Verberne composition — name split, centered photo, repositioned bio/cursive"
```

---

### Task 3: Overlay bio/cursive on the photo, move subheading to a left-gutter column

**Added after the final whole-branch review, based on a closer look at `mees-0.jpeg`.** The earlier reading of the reference put the "M./" label, cursive, and bio paragraphs in a separate column *beside* a narrower portrait photo. A closer look shows they actually sit **overlaid on top of the photo's right portion** — the reference photo is wider than originally modeled, with soft/blurred background on its right side that the text sits over. The subheading, by contrast, sits **outside the photo entirely**, in a left gutter, roughly level with the photo's bottom edge — not below the whole block as Task 2 built it.

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`

**Interfaces:**
- Consumes: `ImagePlaceholder` (unchanged), `cn`/Tailwind only — no new dependencies.

- [ ] **Step 1: Restructure the center band**

Replace the `<div className="mx-auto mt-16 max-w-6xl md:mt-20">...</div>` block (everything from that div through its closing tag, i.e. the grid + the old standalone subheading `<p>`) with:

```tsx
      <div className="mx-auto mt-16 max-w-6xl md:mt-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-end md:gap-6">
          <div className="relative md:col-span-9 md:col-start-4">
            <ImagePlaceholder
              alt="A wide project photo of Paolo at work"
              aspectRatio="3 / 2"
              label="Project photo"
              className="w-full rounded-sm"
            />

            <div className="mt-6 flex flex-col gap-3 md:absolute md:right-10 md:top-10 md:mt-0 md:max-w-sm">
              <div className="flex items-baseline gap-2">
                <span aria-hidden="true" className="font-mono text-xs uppercase tracking-widest text-em-text-dim">
                  P./
                </span>
                <span className="font-cursive text-3xl leading-none text-em-accent sm:text-4xl md:text-5xl">
                  Debug &amp; Build
                </span>
              </div>
              <div className="space-y-3 text-sm leading-relaxed text-em-text-muted sm:text-base">
                <p>
                  Computer Engineering graduate who builds at both ends of the stack — enterprise AI
                  agents at Accenture and low-level firmware in the lab. At Accenture I spent 540
                  hours developing Salesforce Agentforce agents that create, update, and close
                  support cases and automate account-billing workflows.
                </p>
                <p>
                  Based in Cebu City, Philippines. Actively looking for new opportunities —
                  especially Salesforce, Agentforce, or building smarter customer-experience
                  tooling.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-1 md:self-end">
            <p className="max-w-xs font-display text-lg leading-snug text-em-text">
              Skilled in both <em className="italic">developing</em> and <em className="italic">design</em>
            </p>
          </div>
        </div>
      </div>
```

Notes for the implementer:
- The image goes from `aspectRatio="4 / 5"` (portrait) to `"3 / 2"` (landscape) because it's now ~9/12 of the container's width instead of ~5/12 — at the old portrait ratio it would render absurdly tall. `3 / 2` is a starting point, not a hard requirement: if it looks visually wrong once rendered (too short/too tall relative to how much text needs to sit over it), adjust the ratio — the goal is "reads as a wide photo with room for the label/cursive/bio text over its right portion," matching the proportions in `mees-0.jpeg` (repo root) as closely as is reasonable for a placeholder box.
- On mobile (below `md:`), the label/cursive/bio block is **not** absolutely positioned (no `absolute` until `md:`) — it flows normally below the full-width image, matching the original mobile stacking order (image, then label+cursive, then bio paragraphs). Cramming overlay text onto a narrow mobile image would hurt readability; the reference likely also drops the overlay treatment on mobile.
- The subheading's grid item has no explicit row placement beyond `md:col-start-1 md:col-span-3` — with the image item explicitly placed at `md:col-start-4`, CSS grid's default sparse auto-placement puts the subheading in the same row's remaining columns (1-3), which combined with `md:items-end` (on the parent) lands it roughly level with the image's bottom edge, in the left gutter. Confirm this visually rather than assuming — if it lands somewhere unexpected, an explicit `md:row-start-1` on both grid children is the fallback.

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.
Run: `npm run dev` and compare against `mees-0.jpeg` (repo root) at desktop width (~1440px):
  - "P./ Debug & Build" and the two bio paragraphs sit on top of the photo's right portion, not in a separate column to its right.
  - The subheading sits to the left of the photo, outside it, roughly level with the photo's bottom edge — not below the whole photo+text block.
  - Text over the photo stays legible against the placeholder's border/background (it will look different once a real photo is swapped in later — that's expected, this is still a placeholder).
  At mobile width (~375px):
  - The label/cursive/bio block stacks normally below the full-width image (not overlaid).
  - The subheading still renders after the image/text block, left-aligned.
  Check keyboard/tab order isn't affected (this section still has no interactive elements).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "feat: overlay Hero bio/cursive on the photo, move subheading to a left-gutter column"
```

---

### Task 4: Pixel-measured correction — photo size/position, overlay columns, row-alignment fix

**Why this task exists.** The user reported that after Task 3, the Hero still didn't read as 1:1 with the reference: the photo was too large/mispositioned, and the "P./" label, cursive, and bio text weren't positioned correctly relative to it. Task 3's `3 / 2` aspect ratio and `md:col-span-9 md:col-start-4` sizing were both eyeballed from a compressed screenshot crop and were significantly off. This task replaces those eyeballed values with values derived from **programmatic pixel measurement** of `mees-hero-top.png` (1440×900, the reference's native capture width) using Python/PIL: sampling exact pixel colors to find the photo's rectangular bounding box (by classifying pixels as "page checker background" vs. "photo content" against the measured background color cluster `rgb(212,195,171) ± 25`), and finding text bounding boxes by color-thresholding (navy text, orange cursive).

**Measured values (in the reference's 1440px-wide viewport):**
- Photo: left edge x=491 (34.1% of viewport), right edge x=947 (65.8%) → width 31.7% of viewport, positioned starting at 34.1%
- Photo aspect ratio: photo top ≈ y=495; exact bottom wasn't visible in the top-of-page screenshot, but a second, scrolled reference screenshot (`mees-1.jpeg`) shows the photo's bottom edge — combined with the width measurement, the photo reads as close to **square (1:1)**, not portrait (`4/5`, Task 1-2's guess) or landscape (`3/2`, Task 3's guess).
- "P./" label: x=869-889 (60.3%-61.7%), y=546-557 — inside the photo's bounds, starting ~51px (≈10% of photo height) below the photo's top edge.
- Cursive "Creative"-equivalent: roughly x=750-969 (52.1%-67.3%) — starts inside the photo, extends slightly past its right edge (947/65.8%).
- Bio paragraph block: x=868-1204 (60.3%-83.6%), y=674-863 — **starts inside the photo's right portion (60.3% is within the photo's 34.1%-65.8% span) and continues well past the photo's right edge (65.8%) onto the open page background**. This is the key finding: the text column is NOT fully "on" or fully "beside" the photo — it deliberately straddles the photo's right edge, mostly overlapping only the photo's rightmost ~5-6 percentage points.
- Subheading: x=268-499 (18.6%-34.7%), y=861-899 — entirely to the left of the photo (photo starts at 34.1%), roughly level with the bottom of the bio paragraph block.

**Grid translation (12-column grid, columns are 8.33% each):** matching these percentages onto column start/span:
- Subheading: `col-start-3 col-span-2` (16.7%-33.3%) — close to measured 18.6%-34.7%
- Photo: `col-start-5 col-span-4` (33.3%-66.7%) — close to measured 34.1%-65.8%
- Overlay text (label+cursive+bio): `col-start-8 col-span-3` (58.3%-83.3%) — close to measured 60.3%-83.6%

Note the photo (`col-start-5` through column 8) and the overlay text (`col-start-8` onward) **share grid column 8** — this is the deliberate overlap the measurements found. In CSS Grid, items with fully explicit `grid-row` + `grid-column` placement are allowed to overlap (later DOM order paints on top); this is different from relying on auto-placement, which is also why this task fixes the auto-placement bug described below.

**Second source of correction — the final whole-branch review (post-Task-3) found two real, separate bugs to fix in the same pass:**
1. **Overlay overflow at 768-835px.** Task 3's overlay activated at `md:` (768px), but at that width the image was short enough that the bio text visibly overflowed below/past the photo's border. Since this task also shrinks the photo significantly (33% width instead of 75%), re-verify this doesn't recur — but as a safety margin, this task moves the overlay activation breakpoint from `md:` (768px) to `lg:` (1024px).
2. **`items-end`/`self-end` were dead CSS.** Task 3's plan text incorrectly assumed CSS Grid's sparse auto-placement would land the subheading in row 1 automatically. It doesn't — per the grid placement algorithm, an auto-row item whose explicit column-start is *before* the current placement cursor gets pushed to a new row instead, so the subheading silently landed in its own row 2, making `items-end`/`self-end` no-ops. Fix: give **every** grid child an explicit `row-start-1` so they're forced onto one shared row regardless of auto-placement quirks (this is also a prerequisite for the intentional photo/text-overlay column overlap above, since overlap requires fully explicit placement on both axes).

**Files:**
- Modify: `src/components/sections/HeroSection.tsx`

- [ ] **Step 1: Replace the center-band block**

Replace everything from `<div className="mx-auto mt-16 max-w-6xl md:mt-20">` (Task 3's version) through its closing `</div>` with:

```tsx
      <div className="relative -mx-6 mt-16 md:-mx-16 md:mt-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-0">
          <div className="order-3 px-6 lg:order-none lg:col-span-2 lg:col-start-3 lg:row-start-1 lg:self-end lg:px-0">
            <p className="max-w-xs font-display text-lg leading-snug text-em-text">
              Skilled in both <em className="italic">developing</em> and <em className="italic">design</em>
            </p>
          </div>

          <div className="order-1 px-6 lg:order-none lg:col-span-4 lg:col-start-5 lg:row-start-1 lg:px-0">
            <ImagePlaceholder
              alt="A project photo of Paolo at work"
              aspectRatio="1 / 1"
              label="Project photo"
              className="w-full rounded-sm"
            />
          </div>

          <div className="order-2 mt-6 flex flex-col gap-3 px-6 lg:order-none lg:col-span-3 lg:col-start-8 lg:row-start-1 lg:mt-0 lg:self-start lg:px-0 lg:pt-10">
            <div className="flex items-baseline gap-2">
              <span aria-hidden="true" className="font-mono text-xs uppercase tracking-widest text-em-text-dim">
                P./
              </span>
              <span className="font-cursive text-3xl leading-none text-em-accent sm:text-4xl lg:text-5xl">
                Debug &amp; Build
              </span>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-em-text-muted sm:text-base">
              <p>
                Computer Engineering graduate who builds at both ends of the stack — enterprise AI
                agents at Accenture and low-level firmware in the lab. At Accenture I spent 540
                hours developing Salesforce Agentforce agents that create, update, and close
                support cases and automate account-billing workflows.
              </p>
              <p>
                Based in Cebu City, Philippines. Actively looking for new opportunities —
                especially Salesforce, Agentforce, or building smarter customer-experience
                tooling.
              </p>
            </div>
          </div>
        </div>
      </div>
```

Notes for the implementer:
- The wrapper bleeds to the true viewport edge (`-mx-6 md:-mx-16`, no compensating `px-*` on the wrapper itself) because the measured percentages are fractions of the *full* 1440px viewport, matching how the marquee/name lockup above it already bleed edge-to-edge. Each grid child gets its own `px-6 lg:px-0` so mobile/tablet still has readable side padding while the `lg:` grid columns compute against the true full-bleed width, matching the measurement's reference frame.
- `lg:row-start-1` on all three children is load-bearing, not decoration — without it, the subheading silently falls into its own grid row and `self-end` does nothing (see the "second source of correction" note above). Verify this actually worked by checking computed styles or just visually confirming the subheading sits close to the photo's bottom edge, not noticeably below the whole block.
- The photo (`col-start-5 col-span-4`, occupying columns 5-8) and the overlay text (`col-start-8 col-span-3`, occupying columns 8-10) deliberately share column 8 — this is intentional overlap, not a bug. Since both have fully explicit row+column placement, CSS Grid allows this; the overlay div comes after the photo div in DOM order, so it paints on top.
- `lg:pt-10` on the overlay text block approximates the measured ~10%-of-photo-height offset between the photo's top edge and where "P./" starts. This is an approximation (fixed px, not percentage-of-dynamic-height) — if it looks visibly off once rendered next to the actual photo height at your test viewport, adjust it, but don't restructure the approach.
- Aspect ratio `1 / 1` is a considered estimate (see measurement notes above), not a hard-coded exact value — if visual comparison against `mees-0.jpeg` suggests a slightly different ratio reads closer to the reference, adjust it, but stay close to square (roughly `4/5` to `1/1` range, not `3/2` landscape like Task 3 had).

- [ ] **Step 2: Verify against the reference at matching viewport width**

Run: `npx tsc --noEmit` — expect no errors.
Run: `npm run lint` — expect no errors.
Run: `npm run dev`, then using Playwright (available as MCP tools), set the viewport to **exactly 1440×900** (matching the reference screenshot's native capture size) and screenshot the Hero. Read `mees-hero-top.png` (repo root) directly and compare side-by-side:
  - The photo should occupy roughly the middle third of the viewport width (not half, not three-quarters).
  - "P./" and the cursive text should sit inside the photo's upper-right area, not far outside it.
  - The bio paragraphs should start just inside the photo's right edge and extend rightward onto the open background — most of each paragraph line should be *outside* the photo, only the first word or two of each line inside it.
  - The subheading should sit to the photo's left, roughly level with its bottom, not touching or overlapping the photo.
  This comparison doesn't need to be pixel-perfect (this is still a placeholder box, not the real photo), but the *proportions* — how wide the photo reads relative to the viewport, how much of the text sits over vs. beside it — should clearly match, not just "be in the same general area."

  Then check responsive behavior:
  - At 768px, 900px, and 1023px (below the new `lg:` breakpoint): confirm the overlay text is NOT absolutely/grid-overlapping the photo — it should flow normally below the full-width photo (this is the fix for the final review's overflow finding; explicitly verify no text renders outside the photo's visible border at these widths, since that's exactly what broke before).
  - At 1024px and 1440px: confirm the overlay activates and reads as "on top of" the photo per the comparison above.
  - At 375px: confirm mobile stacking order (photo, then label+cursive+bio, then subheading) still holds.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/HeroSection.tsx
git commit -m "fix: correct Hero photo size/position and overlay layout to match measured reference proportions"
```

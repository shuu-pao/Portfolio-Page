# Intro Tagline + Two-Image Bio Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the current single `IntroBioSection` into two components that match jasminemaduafokwa.com's tagline block and two-image bio block, using the exact values measured from the reference site's live DOM in `docs/superpowers/specs/2026-08-02-intro-tagline-bio-redesign-design.md`.

**Architecture:** A new `TaglineSection.tsx` (four individually-revealed lines, new `Spectral` display font, rust accent color) renders between `HeroSection` and a rebuilt `IntroBioSection.tsx` (staggered two-image row + two-paragraph row, recolored to match the reference's monochrome rust treatment).

**Tech Stack:** Next.js 16 / React 19, Tailwind CSS v4, `framer-motion` v11, `next/font/google`, existing `BlurText` / `ImagePlaceholder` / `usePrefersReducedMotion` / hooks.

## Global Constraints

- Every layout value must match the spec's measured numbers (§4 of the design spec) — `5.3vw` tagline font size, `leading-1`, `15vw` couplet padding, `15vh` section padding, `695/894` and `442/696` image aspect ratios, `169px`-equivalent stagger offset, `~63px`-equivalent image gap — expressed as responsive Tailwind values, not arbitrarily rounded.
- Tagline and bio-paragraph text both use the reference's monochrome rust treatment, not `text-em-text-muted` (Hero's bio-paragraph color) — the tagline uses `text-em-accent` directly (large text, clears WCAG's 3:1 large-text threshold), and the bio paragraphs use a darkened `#8a3f22` (small text, needs 4.5:1, which the full-strength accent doesn't clear — see Task 2 for the contrast math).
- All copy in this phase is placeholder (per user instruction) — use exactly the strings given in spec §3, don't invent different wording.
- Reuse existing hooks/components as-is: `BlurText`, `ImagePlaceholder`, `usePrefersReducedMotion`, framer-motion's `useInView` (the pattern already used in the current `IntroBioSection.tsx`). Do not modify `BlurText` itself — gate reduced-motion at the call site in the new component instead.
- `npx tsc --noEmit` and `npm run lint` must both be clean before any task is considered done.
- After each task, verify the rendered output against the spec's measured values using the Playwright MCP tools (`getBoundingClientRect`-style checks or visual screenshots), the same verification approach used for Hero's tasks in this project.

---

### Task 1: Add Spectral font token and build `TaglineSection.tsx`

**Files:**
- Modify: `src/app/layout.tsx` (add `Spectral` font import, wire to `--font-tagline`)
- Modify: `src/app/globals.css:12` (register `--font-tagline` in the `@theme inline` block so Tailwind generates a `.font-tagline` utility)
- Create: `src/components/sections/TaglineSection.tsx`
- Modify: `src/app/page.tsx` (import and render `TaglineSection` between `HeroSection` and `IntroBioSection`)

**Interfaces:**
- Consumes: `usePrefersReducedMotion()` from `@/hooks/use-prefers-reduced-motion` (returns `boolean`), `BlurText` from `@/components/reactbits/BlurText` (props: `text: string`, `delay?: number`, `duration?: number`, `ease?: ...`, `className?: string`).
- Produces: `TaglineSection` default export, a `<section>` with `id="tagline"`, rendered in `page.tsx` between `<HeroSection />` and `<IntroBioSection />`. No other task depends on its internals.

- [ ] **Step 1: Add the Spectral font import in `layout.tsx`**

Edit `src/app/layout.tsx` line 2, add `Spectral` to the import:

```ts
import { Archivo_Black, Bodoni_Moda, Caveat, Space_Grotesk, Space_Mono, Spectral } from "next/font/google";
```

Add the font instance after the `archivoBlack` declaration (after line 17):

```ts
const spectral = Spectral({
  subsets: ["latin"],
  variable: "--font-tagline",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});
```

Add `spectral.variable` to the `html` className list (alongside the other `.variable` entries, after `archivoBlack.variable`):

```tsx
      className={cn(
        "h-full scroll-smooth antialiased",
        spaceGrotesk.variable,
        archivoBlack.variable,
        spectral.variable,
        bodoniModa.variable,
        spaceMono.variable,
        caveat.variable
      )}
```

- [ ] **Step 2: Register the `--font-tagline` theme token**

Edit `src/app/globals.css` line 12, add a new line directly after `--font-heading: var(--font-heading);`:

```css
  --font-heading: var(--font-heading);
  --font-tagline: var(--font-tagline);
```

- [ ] **Step 3: Verify the font compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors (pre-existing warnings unrelated to these files are fine).

- [ ] **Step 4: Create `TaglineSection.tsx`**

Create `src/components/sections/TaglineSection.tsx`:

```tsx
"use client";

import { BlurText } from "@/components/reactbits/BlurText";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const LINES = [
  { text: "I turn complex problems", indent: false },
  { text: "into dependable systems.", indent: false },
  { text: "With deliberate engineering,", indent: true },
  { text: "I ship things that hold up under real use.", indent: true },
];

export default function TaglineSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="tagline" className="w-full bg-em-bg px-6 py-[15vh] md:px-16">
      <div className="font-tagline text-em-accent">
        {LINES.map((line, index) =>
          reducedMotion ? (
            <p
              key={line.text}
              className={
                "text-[8vw] leading-[1] overflow-hidden sm:text-[5.3vw] " +
                (line.indent ? "pl-[15vw]" : "pr-[15vw]")
              }
            >
              {line.text}
            </p>
          ) : (
            <BlurText
              key={line.text}
              text={line.text}
              delay={0.015}
              duration={0.6}
              ease="easeOut"
              className={
                "block text-[8vw] leading-[1] overflow-hidden sm:text-[5.3vw] " +
                (line.indent ? "pl-[15vw]" : "pr-[15vw]") +
                (index > 0 ? " mt-0" : "")
              }
            />
          )
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Wire `TaglineSection` into `page.tsx`**

Edit `src/app/page.tsx`. Add the import after the `HeroSection` import (line 1):

```tsx
import HeroSection from "@/components/sections/HeroSection";
import TaglineSection from "@/components/sections/TaglineSection";
import IntroBioSection from "@/components/sections/IntroBioSection";
```

Render it between `HeroSection` and `IntroBioSection` (inside `<main>`):

```tsx
        <HeroSection />
        <TaglineSection />
        <IntroBioSection />
```

- [ ] **Step 6: Verify compiles clean**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 7: Verify against the reference measurements**

Start the dev server (or use the already-running one on port 3000). Using the Playwright MCP tools at a 1440×900 viewport:
- Confirm the tagline section renders four lines in the Spectral font, rust-colored (`#b5502e`-family), with lines 1–2 flush-left (right-padded) and lines 3–4 indented from the left — matching spec §4.1.
- Confirm `usePrefersReducedMotion` gating works: with `prefers-reduced-motion: reduce` simulated (Playwright `emulateMedia`), the lines render as plain `<p>` tags without the per-character blur animation.
- Check mobile width (390px) — the `8vw` mobile font size and `sm:` breakpoint down to `5.3vw` should keep all four lines legible without horizontal overflow; adjust the mobile-only size if it clips.

- [ ] **Step 8: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css src/app/page.tsx src/components/sections/TaglineSection.tsx
git commit -m "feat: add TaglineSection with Spectral display font, matching jasminemaduafokwa.com's intro tagline block"
```

---

### Task 2: Rebuild `IntroBioSection.tsx` with the staggered two-image layout

**Files:**
- Modify: `src/components/sections/IntroBioSection.tsx` (full rewrite of the JSX body; imports and component signature stay the same)

**Interfaces:**
- Consumes: `ImagePlaceholder` from `@/components/ui/ImagePlaceholder` (props: `alt: string`, `aspectRatio?: string`, `label?: string`, `className?: string`), `motion`/`useInView` from `framer-motion` (already imported in the current file).
- Produces: `IntroBioSection` default export, unchanged signature — no other file needs to change to consume it (already wired into `page.tsx`).

- [ ] **Step 1: Replace the image grid with the staggered two-image layout**

Replace the full contents of `src/components/sections/IntroBioSection.tsx` with:

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export default function IntroBioSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="intro" ref={ref} className="relative w-full bg-em-bg px-6 pb-24 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-6 md:flex-row md:items-start md:gap-[4.4%]"
      >
        <ImagePlaceholder
          alt="Paolo working on Salesforce Agentforce configuration"
          aspectRatio="695 / 894"
          label="Workspace photo"
          className="w-full rounded-sm md:w-[48%]"
        />
        <ImagePlaceholder
          alt="Close-up of embedded hardware Paolo built"
          aspectRatio="442 / 696"
          label="Hardware photo"
          className="w-full rounded-sm md:mt-[19%] md:w-[30%]"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mt-10 grid grid-cols-1 gap-6 text-sm leading-relaxed text-[#8a3f22] sm:text-base md:grid-cols-2 md:gap-10"
      >
        <p>
          As an engineer, I prioritize root causes over quick patches — whether that&apos;s an
          Agentforce action that&apos;s misfiring or a computer-vision model that&apos;s stalled
          for two months. I trace the problem, rebuild around the real constraint, then ship.
        </p>
        <p>
          That instinct carries across every layer I work in: enterprise AI agents at Accenture,
          PIC microcontroller firmware in C, and applied computer vision in my thesis work.
        </p>
      </motion.div>
    </section>
  );
}
```

Notes on the values used:
- `md:w-[48%]` / `md:w-[30%]` with `md:gap-[4.4%]` approximates the reference's `695px` left image / `442px` right image / `63px` gap at a 1440px container (`442/1440≈30.7%`, `63/1440≈4.4%`; the left image is sized by the remaining space via flex rather than a hardcoded 48%, so it isn't thrown off if the container width differs from 1440 — flex-basis is set on the right (fixed-ratio) image and the left image fills the rest, matching the reference's actual behavior where the right image's absolute width is the fixed quantity).
- `md:mt-[19%]` on the right image approximates the `169px` stagger against the left image's own `894px` height (`169/894≈19%`); since Tailwind arbitrary percentage margins resolve against the parent's width in a flex row, not the sibling's height, this is a close approximation — verify the actual rendered offset in Step 3 and adjust the percentage if the stagger looks off against the real rendered image heights.
- Paragraph text uses `text-[#8a3f22]` rather than `text-em-accent` (`#b5502e`). `#b5502e` on `#ede2cd` (em-bg) measures ≈3.94:1 contrast — enough for the large tagline text (WCAG AA large-text threshold is 3:1) but short of the 4.5:1 normal-text threshold the paragraphs need at `text-sm`/`text-base`. `#8a3f22` is the same rust hue darkened just enough to clear ≈5.8:1, per spec §5's instruction to darken the paragraph-specific shade if the shared accent falls short rather than changing the token globally (the token itself is used correctly elsewhere for large/decorative text).

- [ ] **Step 2: Verify compiles clean**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Verify against the reference measurements**

Using the Playwright MCP tools at a 1440×900 viewport, navigate to the local dev server and use `getBoundingClientRect()`-style JS evaluation (the same technique used to measure the reference) on the two `ImagePlaceholder` boxes and the two `<p>` elements:
- Left image width : right image width should be close to `695 : 442` (≈1.57:1).
- Right image's top edge should sit below the left image's top edge by roughly 19% of the left image's rendered height (matching the reference's 169px-of-894px stagger) — adjust `md:mt-[19%]` if the actual measured stagger is off by more than a few percent.
- Gap between the two images should be roughly 4–5% of the section's content width.
- Both paragraphs should render in the darkened rust `#8a3f22` (not the previous muted gray, and not the full-strength `em-accent`, which is reserved for large text).
- At 390px mobile width, confirm the images stack vertically without the stagger causing awkward overlap or excess whitespace, and paragraphs stack below both images.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/IntroBioSection.tsx
git commit -m "feat: rebuild IntroBioSection with jasminemaduafokwa.com's staggered two-image layout"
```

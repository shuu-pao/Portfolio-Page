# Mission Statement Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `MissionStatementSection.tsx` as a right-aligned label+heading block — a 5-line manually-broken heading whose characters slide up from a clipping mask and unrotate on scroll-into-view, matching the mechanics measured from jasminemaduafokwa.com's "My mission" section, per `docs/superpowers/specs/2026-08-03-mission-statement-redesign-design.md`.

**Architecture:** A new `SlideRevealText` component (sibling to the existing `BlurText` in `@/components/reactbits/`) reproduces the reference's per-character slide-up + unrotate reveal, gated by the same `useInView({ once: true })` pattern `BlurText` already uses. `MissionStatementSection` maps a `LINES` array to `SlideRevealText` exactly the way `TaglineSection.tsx` already maps its own `LINES` array to `BlurText` — same section wrapper classes, same `usePrefersReducedMotion` plain-`<p>` fallback — so the new section is a structural sibling of an existing, already-reviewed section rather than a new pattern.

**Tech Stack:** Next.js 16 / React 19, Tailwind CSS v4, `framer-motion` v11 (already a dependency, used by `BlurText`).

## Global Constraints

- Scope: mission statement block only. The reference's "OFFER TO CLIENTS" pricing table that follows it on jasminemaduafokwa.com is explicitly out of scope — spec Decision 1.
- Use the site's own design tokens (`bg-em-bg`, `text-em-text`, `text-em-accent`, `font-display`), not the reference's literal colors/fonts — spec Decision 2.
- Label stays `font-mono text-xs uppercase tracking-[0.25em] text-em-accent`, text "My approach" — spec Decision 3. Only its *position* changes (inline beside the heading via `flex items-start gap-[8vw]`, not stacked above it).
- New component `SlideRevealText`, not a reuse of `BlurText` — spec Decision 4. The reference's motion (per-character slide-up + unrotate) is visually distinct from `BlurText`'s blur/fade and the user explicitly chose literal fidelity.
- Copy is placeholder, restructured into the 5 lines below — spec Decision 5. Do not use the reference's own (client/business-traffic) copy verbatim.
- `npx tsc --noEmit` and `npm run lint` must both be clean before Task 1 is considered done.
- Only `src/components/reactbits/SlideRevealText.tsx` (new) and `src/components/sections/MissionStatementSection.tsx` (rewrite) change in this plan.

---

### Task 1: Create `SlideRevealText`

**Files:**
- Create: `src/components/reactbits/SlideRevealText.tsx`

**Interfaces:**
- Consumes: `framer-motion` (`motion`, `useInView`) — same imports `BlurText.tsx` already uses.
- Produces: `SlideRevealText` component, default and named export, props `{ text: string; delay?: number; duration?: number; ease?: "easeIn" | "easeOut" | "easeInOut" | "linear" | [number, number, number, number]; className?: string }` — same prop shape as `BlurText`, so `MissionStatementSection` (Task 2) can use it as a drop-in per-line replacement.

- [ ] **Step 1: Write the component**

Create `src/components/reactbits/SlideRevealText.tsx` with these exact contents:

```tsx
"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * SlideRevealText - per-character slide-up + unrotate reveal, masked by the
 * parent's overflow-hidden. Distinct from BlurText's blur/fade reveal.
 * Usage: <SlideRevealText text="Hello" delay={0.02} duration={0.6} />
 */
export interface SlideRevealTextProps {
  /** Text content to animate */
  text: string;
  /** Delay between character animations */
  delay?: number;
  /** Duration of animation per character */
  duration?: number;
  /** Easing function (framer-motion string or cubic-bezier tuple) */
  ease?: "easeIn" | "easeOut" | "easeInOut" | "linear" | [number, number, number, number];
  /** Additional class names (must include overflow-hidden to mask the slide) */
  className?: string;
}

export const SlideRevealText: React.FC<SlideRevealTextProps> = ({
  text,
  delay = 0.02,
  duration = 0.6,
  ease = "easeOut",
  className = "",
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isVisible = useInView(ref, { once: true, margin: "-80px" });

  return (
    <span ref={ref} className={className}>
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ y: "100%", rotateZ: 5 }}
          animate={isVisible ? { y: 0, rotateZ: 0 } : undefined}
          transition={{
            delay: index * delay,
            duration,
            ease,
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </span>
  );
};

export default SlideRevealText;
```

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/reactbits/SlideRevealText.tsx
git commit -m "feat: add SlideRevealText reveal component"
```

---

### Task 2: Rebuild `MissionStatementSection.tsx`

**Files:**
- Modify: `src/components/sections/MissionStatementSection.tsx` (full-file rewrite)

**Interfaces:**
- Consumes: `SlideRevealText` (`@/components/reactbits/SlideRevealText`, from Task 1, props `text`/`delay`/`duration`/`ease`/`className`), `usePrefersReducedMotion` (`@/hooks/use-prefers-reduced-motion`, returns `boolean`).
- Produces: `MissionStatementSection` default export, unchanged signature — already wired into `src/app/page.tsx`, no other file needs to change.

- [ ] **Step 1: Replace the full file contents**

Replace the entire contents of `src/components/sections/MissionStatementSection.tsx` with:

```tsx
"use client";

import { SlideRevealText } from "@/components/reactbits/SlideRevealText";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const LINES = [
  "I trace every problem",
  "to its root cause",
  "before I touch a fix.",
  "Systems built that way",
  "keep working after I'm gone.",
];

export default function MissionStatementSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section id="mission" className="w-full bg-em-bg px-6 py-[15vh] md:px-16">
      <div className="w-[90%] mx-auto md:ml-auto md:mr-0">
        <div className="flex items-start gap-[8vw]">
          <p className="shrink-0 font-mono text-xs uppercase tracking-[0.25em] text-em-accent">
            My approach
          </p>
          <div>
            {LINES.map((line) =>
              reducedMotion ? (
                <p
                  key={line}
                  className="font-display text-[5.3vw] leading-[1] overflow-hidden text-em-text"
                >
                  {line}
                </p>
              ) : (
                <SlideRevealText
                  key={line}
                  text={line}
                  delay={0.02}
                  duration={0.6}
                  ease="easeOut"
                  className="block font-display text-[5.3vw] leading-[1] overflow-hidden text-em-text"
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
```

Notes on values used:
- `w-[90%] mx-auto md:ml-auto md:mr-0` and `flex items-start gap-[8vw]` are copied directly from the reference's measured classes (spec's Live-DOM measurements section) — right-aligns the block on desktop, keeps label+heading side by side (not stacked) at all widths, matching the reference's confirmed mobile behavior.
- `text-[5.3vw] leading-[1] overflow-hidden` on each line is the same sizing convention `TaglineSection.tsx` already uses for its own reveal heading — reused for consistency rather than re-deriving a new size.
- `shrink-0` on the label prevents the narrow eyebrow text from being compressed by the adjacent heading column in the flex row.
- `block` on `SlideRevealText`'s className mirrors `BlurText`'s call site in `TaglineSection.tsx` — each line needs to be a block-level element to stack vertically instead of running inline into the next line's characters.

- [ ] **Step 2: Verify TypeScript and lint are clean**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual smoke check in the browser**

Start the dev server if it isn't already running (`npm run dev`), navigate to `http://localhost:3000#mission` (or scroll to the Mission section), and confirm:
- The "My approach" label sits to the left of a 5-line heading block, both at the same top alignment.
- The heading block is right-aligned within the section on a desktop-width window (1440).
- Each line's characters slide up from below and unrotate into place as the section scrolls into view, once (scrolling back up and down again does not replay the animation).
- At a narrow mobile width (390), the label and heading remain side by side (not stacked into a column), and there is no horizontal scrollbar.
- With the OS/browser "reduce motion" setting enabled, the 5 lines render as plain static text with no animation.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/MissionStatementSection.tsx
git commit -m "feat: rebuild Mission section with jasminemaduafokwa.com's slide-reveal heading layout"
```

---

### Task 3: Verify against the reference and close out Phase 5

**Files:**
- Modify: `docs/superpowers/REDESIGN-ROADMAP.md` (update the Phase 5 row's Status/Spec/Plan columns once verification passes)

**Interfaces:**
- Consumes: the running dev server from Task 2, the Playwright MCP browser tools (`browser_navigate`, `browser_resize`, `browser_evaluate`, `browser_take_screenshot`).
- Produces: no new code interfaces — this task's output is a pass/fail verification record and the roadmap update.

- [ ] **Step 1: Measure right-alignment and row layout at 1440×900**

With the dev server running, use the Playwright MCP tools at a 1440×900 viewport to navigate to `http://localhost:3000` and run `browser_evaluate` against `#mission` to collect:
- The outer content div's `getBoundingClientRect()` — confirm its `right` edge sits at the section's padded right edge (right-aligned, not centered).
- The `flex items-start gap-[8vw]` row's `flexDirection` computed style — confirm `"row"`.

If either is off, fix the corresponding class in `MissionStatementSection.tsx` before proceeding.

- [ ] **Step 2: Verify the reveal animation fires once, per character**

Using `browser_evaluate`, before scrolling `#mission` into view, confirm the first character span's inline `transform` includes a `translateY`/`rotateZ` (pre-reveal state). Scroll the section into view, wait ~1.5s, then confirm the same span's `transform` is `"none"`. Scroll away and back into view again; confirm it stays `"none"` (reveal does not replay).

- [ ] **Step 3: Check mobile (390×844)**

Resize to 390×844, confirm via `browser_evaluate`: the `flex items-start` row's `flexDirection` is still `"row"` (not `"column"`), the label and first line of the heading are horizontally adjacent (compare `getBoundingClientRect()` — label's `right` should be less than the heading column's `left` by roughly the row's gap), and there is no horizontal scrollbar (`document.documentElement.scrollWidth <= 390`).

- [ ] **Step 4: Check reduced-motion fallback**

Using `browser_evaluate`, emulate `prefers-reduced-motion: reduce` (or use Playwright's `page.emulateMedia`), reload, and confirm the 5 lines render as plain text immediately (no character-span elements, no animation) — same pattern already verified for `TaglineSection`.

- [ ] **Step 5: Update the roadmap**

Edit `docs/superpowers/REDESIGN-ROADMAP.md`, Phase 5 row, changing it to:

```
| 5 | Mission statement section polish | jasminemaduafokwa.com | **Done** | `specs/2026-08-03-mission-statement-redesign-design.md` | `plans/2026-08-03-mission-statement-redesign.md` |
```

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/REDESIGN-ROADMAP.md
git commit -m "docs: mark Phase 5 (Mission statement) done after reference verification"
```

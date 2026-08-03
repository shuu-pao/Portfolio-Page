# Process Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `ProcessTimelineSection.tsx` as a staircase grid — a quarter-circle "PROCESS" badge, four hover-fill-and-reveal step cards, and a mirrored decorative quarter-circle corner — matching the layout and interaction measured from jasminemaduafokwa.com's PROCESS section, per `docs/superpowers/specs/2026-08-03-process-section-redesign-design.md`.

**Architecture:** A single-file rewrite of `ProcessTimelineSection.tsx`. No new components are needed — the staircase layout is pure CSS Grid (`grid-cols-1 sm:grid-cols-2 xl:grid-cols-3` plus `hidden xl:block` spacer cells in specific DOM positions), and the hover interaction is pure Tailwind `hover:` classes (no JS state, unlike the reference's own React-state-driven implementation). The existing per-card `framer-motion` `useInView` scroll-fade is kept as-is, just re-applied to the new card markup.

**Tech Stack:** Next.js 16 / React 19, Tailwind CSS v4, `framer-motion` v11 (already a dependency, already imported by the current file).

## Global Constraints

- Keep the existing `steps: Step[]` array (title + description) unchanged — Diagnose/Redesign/Build/Verify, exact current copy. Confirmed with user: only layout/interaction changes, not content — spec Context section.
- Colors use existing design tokens only: `bg-em-accent` (badge/decorative fill, card hover-fill), `text-em-accent` (card default border + heading text), `text-em-invert-text` (text on the filled hover state), `bg-em-bg` (page background). No new tokens — spec Decision 2.
- Hover interaction is plain Tailwind `hover:`/`group-hover:` classes, not a JS state toggle — spec Decision 3.
- No `BlurText` usage anywhere in this section — spec Decision 4.
- Keep `id="process"` on the section element — it's referenced by `src/lib/sections.ts` and `src/components/layout/Navbar.tsx` for in-page navigation; do not rename it.
- `npx tsc --noEmit` and `npm run lint` must both be clean before any task is considered done.
- Only `src/components/sections/ProcessTimelineSection.tsx` changes in this plan.

---

### Task 1: Rebuild `ProcessTimelineSection.tsx`

**Files:**
- Modify: `src/components/sections/ProcessTimelineSection.tsx` (full-file rewrite)

**Interfaces:**
- Consumes: `framer-motion` (`motion`, `useInView`) — same imports the current file already uses. No other project files/components are consumed.
- Produces: `ProcessTimelineSection` default export, unchanged signature — already wired into `src/app/page.tsx`, no other file needs to change.

- [ ] **Step 1: Replace the full file contents**

Replace the entire contents of `src/components/sections/ProcessTimelineSection.tsx` with:

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    title: "Diagnose",
    description:
      "Trace a problem to its root cause instead of patching symptoms — whether that's a wrong Agentforce action or a stalled model architecture.",
  },
  {
    title: "Redesign",
    description:
      "Rebuild the approach around the real constraint, like the object-detection redesign that cleared a two-month stall on SMARTBIN 3.",
  },
  {
    title: "Build",
    description: "Ship working systems — Agentforce agents in production, firmware on real hardware, code that runs.",
  },
  {
    title: "Verify",
    description:
      "Test against the real target, not assumptions — 98.67% detection accuracy, mandatory case-closure reasons, checks that hold.",
  },
];

function StepCard({ step, index, inView }: { step: Step; index: number; inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="group flex flex-col rounded-xl border-[1.5px] border-em-accent p-6 text-em-accent duration-300 hover:bg-em-accent hover:text-em-invert-text lg:h-[55vh] 2xl:p-10">
        <h3 className="mb-[6vh] font-display text-[26px] lg:mb-0 2xl:text-[48px]">{step.title}</h3>
        <div className="mt-auto opacity-0 duration-300 group-hover:opacity-100">
          <p className="text-[15px] sm:text-[16px] 2xl:text-[24px]">{step.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProcessTimelineSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="process" ref={ref} className="w-full bg-em-bg px-6 py-[20vh] md:px-16">
      <div className="mx-auto grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:w-[90%] xl:grid-cols-3">
        <div className="flex h-[30vh] items-end rounded-xl rounded-tl-[100%] bg-em-accent px-8 py-4 sm:h-auto lg:h-[55vh]">
          <h2 className="font-display text-[40px] text-em-invert-text 2xl:text-[60px]">PROCESS</h2>
        </div>

        <StepCard step={steps[0]} index={0} inView={inView} />

        <div className="hidden xl:block" />
        <div className="hidden xl:block" />

        <StepCard step={steps[1]} index={1} inView={inView} />
        <StepCard step={steps[2]} index={2} inView={inView} />
        <StepCard step={steps[3]} index={3} inView={inView} />

        <div className="hidden xl:block" />

        <div className="hidden h-[55vh] rounded-xl rounded-br-[100%] bg-em-accent sm:block" />
      </div>
    </section>
  );
}
```

Notes on values used:
- Grid classes (`grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`, `gap-5`, `w-full md:w-[90%] mx-auto`), badge/decorative classes (`rounded-tl-[100%]` / `rounded-br-[100%]`, `h-[30vh] sm:h-auto lg:h-[55vh]`), and card classes (`border-[1.5px]`, `p-6 2xl:p-10`, `mb-[6vh] lg:mb-0`, description text sizing) are copied verbatim from the reference's measured DOM classes (spec's Live-DOM measurements section), with color utilities swapped for this project's tokens (`bg-lightText`→`bg-em-accent`, `text-lightBg`→`text-em-invert-text`, `border-lightText`→`border-em-accent`).
- The two explicit `<StepCard>` calls for steps 1 and 2 (indices 1, 2) sit adjacent in the grid with no spacer between them — matches the reference's row 2 (`Research`, `Ideation & Revision` back-to-back), unlike row 1 and row 3 which each have exactly one card next to a spacer/badge/corner.
- `hover:bg-em-accent hover:text-em-invert-text` on the card plus `group-hover:opacity-100` on the description div reproduce the reference's hover-fill-and-reveal using plain CSS, no `useState`/`onMouseEnter` needed — spec Decision 3.
- The decorative corner is `hidden sm:block` (not `hidden xl:block`) — visible from the 2-col breakpoint up, matching the reference's tablet screenshot (Decision/measurement in spec: the corner appears paired with `Development` in the 2-col staircase, not only at 3-col).
- Removed: the `BlurText` import and its conditional use on the first card, and the `0{i+1}` mono index label — neither is present in the reference.

- [ ] **Step 2: Verify TypeScript is clean**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify lint is clean**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Manual smoke check in the browser**

Start the dev server if it isn't already running (`npm run dev`), navigate to `http://localhost:3000#process` (or scroll to the Process section), and confirm:
- Desktop width (≥1280, e.g. resize browser to 1440): a 3-column staircase — badge top-left, "Diagnose" card top-middle, "Redesign"/"Build" cards on the second row (middle + right columns), "Verify" card bottom-left, decorative filled quarter-circle bottom-right (mirrored corner from the badge).
- Tablet width (1024): a clean 2-column layout — badge+Diagnose, Redesign+Build, Verify+decorative-corner, no empty gaps.
- Mobile width (390): everything stacks single-column in order — badge, Diagnose, Redesign, Build, Verify — no horizontal scrollbar, no decorative corner block (hidden below `sm`).
- Hovering any step card: the card's background fills solid with the accent color, the title and (fading-in) description text turn cream, and the description becomes visible — all over roughly 300ms. Un-hovering reverses it.
- Cards fade up into view once as the section scrolls into the viewport (not on every scroll back into view).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ProcessTimelineSection.tsx
git commit -m "feat: rebuild Process section with jasminemaduafokwa.com's staircase hover-reveal layout"
```

---

### Task 2: Verify against the reference and close out Phase 6

**Files:**
- Modify: `docs/superpowers/REDESIGN-ROADMAP.md` (update the Phase 6 row's Status/Spec/Plan columns once verification passes)

**Interfaces:**
- Consumes: the running dev server from Task 1, the Playwright MCP browser tools (`browser_navigate`, `browser_resize`, `browser_evaluate`, `browser_take_screenshot`).
- Produces: no new code interfaces — this task's output is a pass/fail verification record and the roadmap update.

- [ ] **Step 1: Measure the staircase grid at 1440×900**

With the dev server running, use the Playwright MCP tools at a 1440×900 viewport to navigate to `http://localhost:3000` and run `browser_evaluate` against `#process` to collect each grid child's `getBoundingClientRect()` in DOM order. Confirm: 3 equal-width columns; badge occupies column 1 row 1; "Diagnose" occupies column 2 row 1; column 3 row 1 is empty; "Redesign"/"Build" occupy columns 2–3 of row 2; "Verify" occupies column 1 row 3; the decorative corner occupies column 3 row 3.

If the order or column placement is off, fix the corresponding spacer placement in `ProcessTimelineSection.tsx` before proceeding.

- [ ] **Step 2: Verify the hover interaction**

Using `browser_evaluate`, read the computed `background-color` and the description `<p>`'s parent `opacity` for the "Diagnose" card before and after dispatching a `mouseenter`/`mouseover` event on it. Confirm: `background-color` changes from transparent to the accent color, and `opacity` changes from `0` to `1`.

- [ ] **Step 3: Check the 2-column and mobile collapses**

Resize to 1024×900, confirm via `browser_evaluate` that the two `hidden xl:block` spacer elements have `display: none` (not participating in layout) and the visible cells form 3 clean rows of 2. Resize to 390×844, confirm the grid is a single column (`grid-template-columns` computed style resolves to one track) and `document.documentElement.scrollWidth <= 390` (no horizontal scrollbar).

- [ ] **Step 4: Update the roadmap**

Edit `docs/superpowers/REDESIGN-ROADMAP.md`, Phase 6 row, changing it to:

```
| 6 | Process section: hover-to-reveal-more-info cards | jasminemaduafokwa.com | **Done** | `specs/2026-08-03-process-section-redesign-design.md` | `plans/2026-08-03-process-section-redesign.md` |
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/REDESIGN-ROADMAP.md
git commit -m "docs: mark Phase 6 (Process section) done after reference verification"
```

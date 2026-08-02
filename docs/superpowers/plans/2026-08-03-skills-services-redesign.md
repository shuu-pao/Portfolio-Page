# Skills/Services Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `SkillsStackSection.tsx` as a scroll-linked two-column layout — a sticky full-height backdrop photo with a cross-fading inset image on the right, and four stacked category blocks (Frontend Development, Salesforce/Agentforce, AI/Computer Vision, Embedded Systems) on the left — matching the mechanics measured from jasminemaduafokwa.com's Services section, per `docs/superpowers/specs/2026-08-03-skills-services-redesign-design.md`.

**Architecture:** Each category block gets its own `framer-motion` `useInView` ref with a thin center-band `margin` (`"-45% 0px -45% 0px"`), so exactly one block is "active" at a time as the user scrolls; the active index drives an `AnimatePresence`-cross-faded inset `ImagePlaceholder` absolutely centered over a static full-height backdrop `ImagePlaceholder`. This reproduces the reference's scroll-linked image swap without a new dependency (no hand-rolled `IntersectionObserver`) and without duplicating the backdrop per category (it's one sticky element, not four).

**Tech Stack:** Next.js 16 / React 19, Tailwind CSS v4, `framer-motion` v11, `lucide-react` (`Sparkle` icon), existing `ImagePlaceholder` / `PillTag`.

## Global Constraints

- Categories are fixed by the spec's decision (item 1): Frontend Development, Salesforce / Agentforce, AI / Computer Vision, Embedded Systems, in that order — do not reorder or substitute the reference's own categories.
- Giant heading text is "Skills" (not the reference's "Services") — spec decision item 2. It is a plain, non-sticky, single semantic `<h2>` (no `aria-hidden` + `sr-only` twin needed — unlike the two-line "Selected"/"Projects" heading, a single word reads correctly to screen readers on its own).
- No photo collage around the heading — spec decision item 2, explicitly out of scope.
- Images are `ImagePlaceholder` — spec decision item 3. Never substitute a copied photo from jasminemaduafokwa.com.
- Icon is `lucide-react`'s `Sparkle`, spun via the **existing** `marquee-x-spin` keyframe already defined in `src/app/globals.css:193` (used today by `Marquee.tsx` via inline `style={{ animation: "marquee-x-spin 4s linear infinite" }}`) — reuse this keyframe with a slower duration rather than adding a new Tailwind keyframe/utility. Do not touch `tailwind.config.js` or `globals.css` for this.
- Reuse `PillTag` and `ImagePlaceholder` unmodified — do not edit either file.
- Reuse the site's own `px-6 md:px-16` section padding and `font-display`/`font-heading` type conventions (already used by every other section) rather than the reference's literal pixel values, consistent with how Phase 3 handled the same trade-off.
- `npx tsc --noEmit` and `npm run lint` must both be clean before Task 1 is considered done.
- Only `src/components/sections/SkillsStackSection.tsx` changes in this plan.

---

### Task 1: Rebuild `SkillsStackSection.tsx`

**Files:**
- Modify: `src/components/sections/SkillsStackSection.tsx` (full-file rewrite)

**Interfaces:**
- Consumes: `ImagePlaceholder` (`@/components/ui/ImagePlaceholder`, props: `imageSrc?`, `alt`, `aspectRatio?`, `label?`, `className?`), `PillTag` (`@/components/ui/PillTag`, props: `children`, `className?`), `cn` (`@/lib/utils`).
- Produces: `SkillsStackSection` default export, unchanged signature — already wired into `src/app/page.tsx`, no other file needs to change.

- [ ] **Step 1: Replace the full file contents**

Replace the entire contents of `src/components/sections/SkillsStackSection.tsx` with:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Sparkle } from "lucide-react";
import { PillTag } from "@/components/ui/PillTag";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/utils";

interface SkillCategory {
  title: string;
  tags: string[];
  description: string;
  insetAlt: string;
}

const categories: SkillCategory[] = [
  {
    title: "Frontend Development",
    tags: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
    description:
      "I build performant, accessible interfaces with modern React tooling — leaning on Next.js for routing and image optimization, TypeScript to catch mistakes before they ship, and Framer Motion for interactions that feel deliberate rather than decorative.",
    insetAlt: "Screenshot of a React/Next.js interface in progress",
  },
  {
    title: "Salesforce / Agentforce",
    tags: ["Agentforce", "Flow Builder", "Apex Basics", "Lightning"],
    description:
      "Configuring Agentforce actions and Flow Builder automations to handle case management and agentic workflows on the Salesforce platform — turning manual processes into guided, self-serve ones.",
    insetAlt: "Screenshot of a Salesforce Flow Builder canvas",
  },
  {
    title: "AI / Computer Vision",
    tags: ["YOLOv8", "Python", "Deep Learning", "Computer Vision"],
    description:
      "Applied machine learning for real-world detection and classification systems, including the object-detection redesign behind SMARTBIN 3's 98.67% sorting accuracy after diagnosing why the team's original approach had stalled.",
    insetAlt: "Screenshot of a YOLOv8 object-detection model output",
  },
  {
    title: "Embedded Systems",
    tags: ["C / C++", "XC8", "Microcontrollers", "PIC"],
    description:
      "Low-level firmware and hardware integration for microcontroller-based systems — real-time timers, display drivers, and sensor I/O written close to the metal in C.",
    insetAlt: "Photo of a PIC microcontroller scoreboard build",
  },
];

function CategoryBlock({
  category,
  isLast,
  onActive,
}: {
  category: SkillCategory;
  isLast: boolean;
  onActive: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inView) onActive();
  }, [inView, onActive]);

  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full flex-col py-8 pr-0 md:h-[65vh] md:pr-8",
        !isLast && "border-b border-em-text/15"
      )}
    >
      <div className="flex items-center gap-6">
        <Sparkle
          size={28}
          className="shrink-0 text-em-accent"
          style={{ animation: "marquee-x-spin 6s linear infinite" }}
          aria-hidden="true"
        />
        <h3 className="font-display text-2xl font-bold text-em-text md:text-3xl">{category.title}</h3>
      </div>
      <div className="mt-16 md:mt-auto">
        <div className="flex flex-wrap gap-2">
          {category.tags.map((tag) => (
            <PillTag key={tag}>{tag}</PillTag>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-em-text-muted">{category.description}</p>
      </div>
    </div>
  );
}

export default function SkillsStackSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="skills" className="relative w-full bg-em-bg px-6 py-24 md:px-16">
      <div className="[container-type:inline-size]">
        <div className="overflow-hidden">
          <h2 className="font-heading text-[26.2cqw] uppercase leading-[1] tracking-tighter text-em-text/90">
            Skills
          </h2>
        </div>
      </div>

      <div className="relative mt-16 flex flex-col-reverse gap-4 border-y border-em-text/15 md:flex-row">
        <div className="flex-1">
          {categories.map((category, index) => (
            <CategoryBlock
              key={category.title}
              category={category}
              isLast={index === categories.length - 1}
              onActive={() => setActiveIndex(index)}
            />
          ))}
        </div>

        <div className="relative h-auto flex-1 overflow-hidden md:sticky md:top-0 md:h-screen">
          <ImagePlaceholder
            alt="Backdrop photo behind the skills list"
            label="Backdrop photo"
            className="h-full w-full"
          />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[20%] w-[40%] -translate-x-1/2 -translate-y-1/2 md:h-[30%] md:w-[50%]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="h-full w-full"
              >
                <ImagePlaceholder
                  alt={categories[activeIndex].insetAlt}
                  label="Inset image"
                  className="h-full w-full shadow-xl"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
```

Notes on values used:
- `26.2cqw` for the "Skills" heading: measured by rendering the text "Skills" with `font-heading uppercase tracking-tighter leading-[1]` (Archivo Black, the same font already used for the "Selected"/"Projects" heading) at a 100px test font-size via Playwright against the local dev server — rendered width was 370px, so `100 / 370 = 0.27027` (27.027cqw) would fill the container edge-to-edge exactly. `26.2cqw` applies a ~3% shrink for safety margin (same reasoning as the `17.95cqw` value already used in `PortfolioGallerySection.tsx`), leaving a small right-side margin instead of a hairline clip risk.
- `[container-type:inline-size]` is required on an ancestor for `cqw` units to resolve — same technique just applied to `PortfolioGallerySection.tsx`'s heading to fix a scrollbar-width/`100vw` mismatch bug. Unlike that heading, this one is a single word and is not `sticky` (nothing scrolls over it in this section), so it needs its own small container wrapper rather than reusing a sticky wrapper.
- No `mb-[-.1em]` negative margin on this heading (unlike the "Selected"/"Projects" two-line heading, which uses it to pull those two stacked lines tight together). With only one word here, that hack has no second line to compensate for and would just shave an unintended chunk off the gap to the row below — spacing to the row is controlled entirely by the row's own `mt-16`.
- The backdrop `ImagePlaceholder` is not passed an `aspectRatio` prop. Its parent (`h-auto md:h-screen`) and its own `className="h-full w-full"` already give it a fully definite width and height, so the CSS `aspect-ratio` the component applies internally (default `16 / 10`) has nothing left to compute and is inert — no component change needed.
- `useInView`'s `margin: "-45% 0px -45% 0px"` shrinks the intersection root to a thin band at the vertical center of the viewport. Since each category block is `65vh` tall (much taller than that thin band), exactly one block's ref intersects it at a time as the user scrolls, giving a clean single-active-category signal without tracking "inactive" transitions (the last block to fire `onActive` simply stays active through any brief gap).
- `AnimatePresence mode="wait"` on a single `motion.div` keyed by `activeIndex` cross-fades the previous inset image out before the next fades in, using the same `framer-motion` primitives already used for the project modal in `PortfolioGallerySection.tsx`.

- [ ] **Step 2: Verify TypeScript and lint are clean**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual smoke check in the browser**

Start the dev server if it isn't already running (`npm run dev`), navigate to `http://localhost:3000#skills` (or scroll to the Skills section), and confirm:
- The giant "SKILLS" heading renders without clipping on either edge, at both a desktop width (1440) and a narrow mobile width (390).
- Four category blocks render in order: Frontend Development, Salesforce / Agentforce, AI / Computer Vision, Embedded Systems, each with its own tag pills and description.
- The right-hand backdrop image stays pinned in place (desktop only) while scrolling through all four category blocks, not resizing or jumping.
- The small inset image cross-fades to a new placeholder as each category block becomes the vertically-centered one during scroll (watch the "Inset image" label/icon change, since all four are visually identical placeholders until real images are added — confirm via the `alt` text in a snapshot/DOM check if the visual placeholders are indistinguishable).
- On mobile (390×844), the backdrop+inset image block appears once, above all four stacked category blocks (not sticky, not repeated per block), and there is no horizontal scrollbar.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/SkillsStackSection.tsx
git commit -m "feat: rebuild Skills section with jasminemaduafokwa.com's sticky-image scroll layout"
```

---

### Task 2: Verify against the reference and close out Phase 4

**Files:**
- Modify: `docs/superpowers/REDESIGN-ROADMAP.md` (update the Phase 4 row's Status/Spec/Plan columns once verification passes)

**Interfaces:**
- Consumes: the running dev server from Task 1, the Playwright MCP browser tools (`browser_navigate`, `browser_resize`, `browser_evaluate`, `browser_take_screenshot`).
- Produces: no new code interfaces — this task's output is a pass/fail verification record and the roadmap update.

- [ ] **Step 1: Measure the two-column split and sticky pin behavior**

With the dev server running, use the Playwright MCP tools at a 1440×900 viewport to navigate to `http://localhost:3000` and run a `browser_evaluate` against `#skills` to collect the row's two `flex-1` children's `getBoundingClientRect()`. Confirm:
- Both columns are ~50% of the row's width (matching the reference's measured 624px/624px 50/50 split at 1440px).
- The image column's `top` stays at `0` (pinned) while scrolling through the four category blocks, then releases and scrolls away normally once the last category block's bottom edge passes.

If either measurement is off, fix the corresponding class in `SkillsStackSection.tsx` before proceeding.

- [ ] **Step 2: Verify the active-category cross-fade**

Using `browser_evaluate`, scroll to each of the four category blocks' vertical center in turn and confirm (via the currently-rendered inset `ImagePlaceholder`'s `alt` attribute) that the inset image's `alt` text matches that category's `insetAlt` value — i.e. scrolling to "AI / Computer Vision" shows the alt text "Screenshot of a YOLOv8 object-detection model output", not a stale one from a previous category.

- [ ] **Step 3: Verify the "Skills" heading doesn't clip**

Using `browser_evaluate`, measure the "Skills" `<h2>`'s `getBoundingClientRect()` against its container's rect at both 1440×900 and 390×844 (same technique used to catch and fix the "PROJECTS" clipping bug in Phase 3 — compare `left`/`right` edges, not just visual inspection, since a scrollbar-width mismatch can pass a visual check in a screenshot but still clip on a real browser). Confirm no negative margin (clipping) on either edge at either width.

- [ ] **Step 4: Check mobile (390×844)**

Resize to 390×844, confirm: the backdrop+inset image block appears once above all four stacked category blocks (`flex-col-reverse`, non-sticky), no horizontal scrollbar appears, and all four category blocks' text and tags remain readable (no overlap or overflow).

- [ ] **Step 5: Update the roadmap**

Edit `docs/superpowers/REDESIGN-ROADMAP.md`, Phase 4 row, changing it to:

```
| 4 | Skills/Services section: 4 tabs (Frontend Dev / Backend Dev / UI Design / Brand Identity) with hover-swapped image pair (one large + one smaller inset) | jasminemaduafokwa.com | **Done** | `specs/2026-08-03-skills-services-redesign-design.md` | `plans/2026-08-03-skills-services-redesign.md` |
```

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/REDESIGN-ROADMAP.md
git commit -m "docs: mark Phase 4 (Skills/Services) done after reference verification"
```

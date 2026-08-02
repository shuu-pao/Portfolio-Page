# Selected Work Section Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `PortfolioGallerySection.tsx` so its giant pinned "SELECTED PROJECTS" heading and four staggered project cards match the exact mechanics and slot positions measured from jasminemaduafokwa.com's Selected Projects section, per `docs/superpowers/specs/2026-08-03-selected-work-redesign-design.md`.

**Architecture:** A `position: "start" | "center" | "end"` field on each `Project` drives both the card row's `justify-*` alignment and its `mb-*` spacing via two small lookup tables, reproducing the reference's exact per-card Tailwind classes without hardcoding four near-duplicate card blocks. The giant heading uses `position: sticky` with no artificial negative-margin hack — normal document flow plus sticky is the actual mechanism confirmed live on the reference (measured `margin-top: 0px` on every card).

**Tech Stack:** Next.js 16 / React 19, Tailwind CSS v4, `framer-motion` v11, existing `ImagePlaceholder` / `PillTag` / `GradientButton` / `useDialogBehavior`.

## Global Constraints

- Card-to-reference slot mapping is fixed (spec §"Decisions", item 2): PortfolioMon↔Techstar (`end`), PIC-Based Futsal Scoreboard↔Sylvan (`start`), SMARTBIN 3↔Oracle Music (`center`), Premium Portfolio↔Lofi Train (`end`). Do not reorder.
- Margin-from-position pattern is fixed by measurement: `end` → `mb-[10vw]`, `start`/`center` → `mb-[15vw]` (spec §"Live-DOM measurements", card structure table).
- Card width is fixed by measurement: `w-full sm:max-w-[60vw] md:max-w-[30vw]` — no absolute positioning, no JS-computed offsets.
- Reuse the site's own `px-6 md:px-16` section padding convention (already used by every other section) rather than copying jasminemaduafokwa.com's specific ~86px margin — this keeps the new section visually consistent with Hero/Intro rather than introducing a one-off padding value.
- Reuse `font-heading` (Archivo Black, already used for the Hero name lockup) for the giant "SELECTED"/"PROJECTS" heading instead of importing the reference's actual web font (`Satoshi`) — the reference's heading is a big, confident, regular-weight sans; Archivo Black gives equivalent visual weight from a font already in the project, avoiding a new font import for one heading. This is a deliberate deviation from literal font-family fidelity; layout/size/position fidelity is not affected.
- The giant heading reuses the Hero name lockup's `calc()` sizing technique (see `HeroSection.tsx`'s `text-[calc((100vw_-_48px)*0.103)]` pattern) rather than a flat `vw` guess, so the longer/first line ("Selected") fills the available width edge-to-edge regardless of exact viewport padding — the multiplier below was derived by measuring rendered text width in this project's actual `font-heading` font (Archivo Black), not copied from the reference's own font metrics.
- `npx tsc --noEmit` and `npm run lint` must both be clean before Task 1 is considered done.
- Do not modify `ImagePlaceholder.tsx`, `PillTag.tsx`, or the click-to-open modal's contents — only `PortfolioGallerySection.tsx` changes in this plan (per the spec's decision to keep the existing modal pattern).

---

### Task 1: Rebuild `PortfolioGallerySection.tsx`

**Files:**
- Modify: `src/components/sections/PortfolioGallerySection.tsx` (full-file rewrite — imports, data model, `ProjectCard`, and the heading/card-stack JSX in the default export; the `AnimatePresence` modal block at the bottom is copied over unchanged)

**Interfaces:**
- Consumes: `ImagePlaceholder` (`@/components/ui/ImagePlaceholder`, props: `imageSrc?`, `alt`, `aspectRatio?`, `label?`, `className?`), `PillTag` (`@/components/ui/PillTag`, props: `children`, `className?`), `GradientButton` (`@/components/ui/GradientButton`), `useDialogBehavior` (`@/hooks/use-dialog-behavior`, signature `(open: boolean, onClose: () => void) => RefObject<HTMLDivElement>`), `cn` (`@/lib/utils`).
- Produces: `PortfolioGallerySection` default export, unchanged signature — already wired into `src/app/page.tsx`, no other file needs to change.

- [ ] **Step 1: Replace the full file contents**

Replace the entire contents of `src/components/sections/PortfolioGallerySection.tsx` with:

```tsx
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, X } from "lucide-react";
import { useDialogBehavior } from "@/hooks/use-dialog-behavior";
import { GradientButton } from "@/components/ui/GradientButton";
import { PillTag } from "@/components/ui/PillTag";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { cn } from "@/lib/utils";

type CardPosition = "start" | "center" | "end";

interface Project {
  id: number;
  title: string;
  year: string;
  description: string;
  tags: string[];
  position: CardPosition;
  aspectRatio: string;
  imageSrc?: string;
  githubUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "PortfolioMon",
    year: "2025",
    description:
      "A full turn-based RPG battle system built from scratch — a game-like developer portfolio with boss battles, dialogue, and a chat-driven AI guide.",
    tags: ["React", "Vite", "JavaScript", "CSS"],
    position: "end",
    aspectRatio: "16 / 9",
    githubUrl: "https://github.com/shuu-pao",
  },
  {
    id: 2,
    title: "PIC-Based Futsal Scoreboard",
    year: "2024",
    description:
      "A microcontroller scoreboard written in C (XC8) with real-time match timers and 7-segment display integration — a hands-on embedded-systems lab build.",
    tags: ["C", "XC8", "Embedded", "Microcontrollers"],
    position: "start",
    aspectRatio: "4 / 3",
    githubUrl: "https://github.com/shuu-pao",
  },
  {
    id: 3,
    title: "SMARTBIN 3 (Thesis)",
    year: "2024",
    description:
      "A YOLOv8-powered waste-sorting bin with a motorized platform for auto-segregation. Diagnosed a flawed classification approach that had stalled the team for two months and proposed the object-detection redesign that cleared it — reaching 98.67% accuracy on standard waste.",
    tags: ["YOLOv8", "Computer Vision", "Python", "Deep Learning"],
    position: "center",
    aspectRatio: "3 / 4",
    githubUrl: "https://github.com/shuu-pao",
  },
  {
    id: 4,
    title: "Premium Portfolio",
    year: "2026",
    description:
      "This site — a cinematic, reference-matched personal portfolio built with pixel-precise fidelity to hand-picked design references.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    position: "end",
    aspectRatio: "16 / 10",
    githubUrl: "https://github.com/shuu-pao/premium-portfolio",
  },
];

const JUSTIFY_CLASS: Record<CardPosition, string> = {
  start: "md:justify-start",
  center: "md:justify-center",
  end: "md:justify-end",
};

const MARGIN_CLASS: Record<CardPosition, string> = {
  start: "mb-[15vw]",
  center: "mb-[15vw]",
  end: "mb-[10vw]",
};

function ProjectCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(project);
    }
  };

  return (
    <div className={cn("flex justify-center", JUSTIFY_CLASS[project.position], MARGIN_CLASS[project.position])}>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="group relative z-10 w-full cursor-pointer bg-em-bg sm:max-w-[60vw] md:max-w-[30vw]"
        onClick={() => onSelect(project)}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="relative overflow-hidden rounded-sm">
          <ImagePlaceholder
            imageSrc={project.imageSrc}
            alt={`Screenshot of ${project.title}`}
            aspectRatio={project.aspectRatio}
            label="Project image"
            className="transition-opacity group-hover:opacity-90"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-em-invert-bg/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-em-invert-text">
              View Details
            </span>
          </div>
        </div>
        <div className="mt-4 flex flex-row-reverse items-start justify-between">
          <span className="font-mono text-sm text-em-text-muted">{project.year}</span>
          <h3 className="font-display text-2xl font-bold text-em-text md:text-3xl">{project.title}</h3>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-em-text-muted">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <PillTag key={tag}>{tag}</PillTag>
          ))}
        </div>
      </motion.article>
    </div>
  );
}

export default function PortfolioGallerySection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const closeModal = useCallback(() => setSelectedProject(null), []);
  const modalRef = useDialogBehavior(!!selectedProject, closeModal);

  return (
    <section id="work" className="relative w-full bg-em-bg px-6 py-24 md:px-16">
      <div className="relative">
        <div className="sticky top-[8vh] z-0" aria-hidden="true">
          <div className="overflow-hidden">
            <h2 className="font-heading text-[calc((100vw_-_48px)*0.1715)] uppercase leading-[1] tracking-tighter text-em-text/90 md:text-[calc((100vw_-_128px)*0.1715)]">
              Selected
            </h2>
          </div>
          <div className="flex justify-center overflow-hidden">
            <h2 className="font-heading text-[calc((100vw_-_48px)*0.1715)] uppercase leading-[1] tracking-tighter text-em-text/90 md:text-[calc((100vw_-_128px)*0.1715)]">
              Projects
            </h2>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="sr-only">Selected Projects</h2>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={setSelectedProject} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-em-invert-bg/90 p-4 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-em-invert-text/10 bg-em-invert-bg p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close project details"
                className="absolute right-4 top-4 cursor-pointer rounded-lg p-2 text-em-invert-muted transition-colors hover:bg-white/10 hover:text-em-invert-text"
                onClick={() => setSelectedProject(null)}
              >
                <X size={20} />
              </button>

              <h2 id="project-modal-title" className="font-display text-3xl font-bold text-em-invert-text">
                {selectedProject.title}
              </h2>
              <p className="mt-4 leading-relaxed text-em-invert-muted">{selectedProject.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <PillTag key={tag} className="border-em-accent-text/40 text-em-accent-text">
                    {tag}
                  </PillTag>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {selectedProject.githubUrl && (
                  <GradientButton href={selectedProject.githubUrl} variant="ghost" className="gap-2">
                    <Code2 size={16} />
                    GitHub
                  </GradientButton>
                )}
                {selectedProject.liveUrl && (
                  <GradientButton href={selectedProject.liveUrl} className="gap-2">
                    <ExternalLink size={16} />
                    Live demo
                  </GradientButton>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
```

Notes on values used:
- `0.1715` is `100 / 583.3125`, measured by rendering the word "Selected" (uppercase, `font-heading`/Archivo Black, letter-spacing normal) at a 100px test font-size and reading its `getBoundingClientRect().width` (583.3125px) via Playwright against the local dev server. This mirrors exactly how the Hero name's `0.103` multiplier was derived in Phase 1.
- "Projects" measures slightly wider (592.7px at 100px) than "Selected" (583.3px) in this font. Since the calc formula sizes the font so **"Selected" (the uncentered, first line) fills the container**, "Projects" — being both centered (`flex justify-center`) and slightly wider — will overflow its own `overflow-hidden` wrapper by a small amount and get symmetrically clipped on both sides. This is intentional and matches the reference's own actual visual behavior (confirmed via screenshot: jasminemaduafokwa.com's "PROJECTS" line is itself clipped on the left edge for the same reason — its wider/centered line also overflows).
- No negative margin is applied between the sticky heading block and the card stack. The reference's own cards measured `margin-top: 0px` — the overlap effect between the pinned heading and the scrolling cards comes entirely from `position: sticky` plus normal document flow, not a margin hack. The previous version of this file used a `-mt-[12vw]` hack to fake this; it's removed here because sticky already produces the effect once the card stack is tall enough, and this is confirmed against the live reference in Task 2.

- [ ] **Step 2: Verify TypeScript and lint are clean**

Run: `npx tsc --noEmit`
Expected: no errors.

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Manual smoke check in the browser**

Start the dev server if it isn't already running (`npm run dev`), navigate to `http://localhost:3000#work` (or scroll to the Selected Work section), and confirm:
- Four cards render, titled PortfolioMon, PIC-Based Futsal Scoreboard, SMARTBIN 3 (Thesis), Premium Portfolio, in that order.
- Hovering a card image fades in a "View Details" label and slightly dims the image.
- Clicking a card still opens the existing modal with its GitHub button (and Live Demo button, for none of these four since none has a `liveUrl` yet — confirm no broken/empty button renders).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/PortfolioGallerySection.tsx
git commit -m "feat: rebuild Selected Work section with jasminemaduafokwa.com's sticky-heading stagger layout"
```

---

### Task 2: Verify against the reference and close out Phase 3

**Files:**
- Modify: `docs/superpowers/REDESIGN-ROADMAP.md` (update the Phase 3 row's Status/Spec/Plan columns once verification passes)

**Interfaces:**
- Consumes: the running dev server from Task 1, the Playwright MCP browser tools (`browser_navigate`, `browser_resize`, `browser_evaluate`, `browser_take_screenshot`).
- Produces: no new code interfaces — this task's output is a pass/fail verification record and the roadmap update.

- [ ] **Step 1: Measure card geometry on the local build and compare to the reference**

With the dev server running, use the Playwright MCP tools at a 1440×900 viewport to navigate to `http://localhost:3000` and run a `browser_evaluate` against `#work` to collect each `.group` card's `getBoundingClientRect()` (width, and horizontal position relative to the section). Confirm:
- Card width is ~30% of the section's content width (matching `md:max-w-[30vw]`).
- PortfolioMon and Premium Portfolio sit flush toward the right edge of the section's content box; PIC-Based Futsal Scoreboard sits flush toward the left edge; SMARTBIN 3 sits horizontally centered — reproducing the Techstar/Sylvan/Oracle Music/Lofi Train right/left/center/right pattern measured from the reference.
- Each card's image renders at its assigned `aspectRatio` (16/9, 4/3, 3/4, 16/10) without distortion or letterboxing.

If any position/width is off, fix the corresponding `position`/`aspectRatio` value or the `JUSTIFY_CLASS`/`MARGIN_CLASS` lookup in `PortfolioGallerySection.tsx` before proceeding — do not mark this task done with a known mismatch.

- [ ] **Step 2: Verify the sticky heading fills width and overlaps the cards on scroll**

Using `browser_evaluate`, confirm the "Selected" line's rendered text width is within a few percent of the section's available content width (it should nearly touch both edges, mirroring the Hero name's edge-to-edge fill). Then sample the heading's `getBoundingClientRect().top` at several scroll positions while scrolling through the section (same technique used to confirm jasminemaduafokwa.com's heading pins at `top: 72px`/`8vh`): confirm it holds constant at `8vh` of the viewport height across a scroll range, and that by the later part of that range at least one card visually overlaps the heading's text (card `z-index` painting over the heading, confirmed via screenshot rather than just coordinates, since overlap is a visual/paint-order fact, not just a coordinate range).

- [ ] **Step 3: Check mobile (390×844)**

Resize to 390×844, confirm: all four cards stack full-width in document order (no stagger, per the `flex justify-center` mobile default), no horizontal scrollbar appears (the heading's `calc()` font-size and `overflow-hidden` wrappers must not cause overflow), and the hover label doesn't need to work on touch (no keyboard/focus trap issue — clicking still opens the modal).

- [ ] **Step 4: Update the roadmap**

Edit `docs/superpowers/REDESIGN-ROADMAP.md`, Phase 3 row (`| 3 | Selected Work section polish ... | Not started | — | — |`), changing it to:

```
| 3 | Selected Work section polish (project cards: year + skills tags, card layout) | jasminemaduafokwa.com | **Done** | `specs/2026-08-03-selected-work-redesign-design.md` | `plans/2026-08-03-selected-work-redesign.md` |
```

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/REDESIGN-ROADMAP.md
git commit -m "docs: mark Phase 3 (Selected Work) done after reference verification"
```

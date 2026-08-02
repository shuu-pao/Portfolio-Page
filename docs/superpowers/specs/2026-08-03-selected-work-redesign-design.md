# Phase 3 Design Spec — Selected Work Section Redesign

**Reference:** jasminemaduafokwa.com (Selected Projects section, live-DOM measured 2026-08-03 at 1440×900)
**Current file:** `src/components/sections/PortfolioGallerySection.tsx` (pre-redesign scaffolding, to be refined in place — not rewritten from scratch)

## Context

Phase 3 of the portfolio redesign (see `docs/superpowers/REDESIGN-ROADMAP.md`). The reference's Selected Projects section is a scroll-driven layered composition: a giant two-line "SELECTED / PROJECTS" heading pins in place via `position: sticky` while four project cards scroll over it in normal document flow, each staggered to a different horizontal position. The current scaffold already uses a sticky-heading-plus-overlap technique, but with placeholder numbers (font sizes, positions, margins) that don't match the reference. This phase corrects those numbers and folds in a new 4th project.

## Live-DOM measurements (source of truth)

Measured via Playwright against jasminemaduafokwa.com at 1440×900 viewport.

**Heading markup and styling** (first child of the section's relative wrapper):
```html
<div class="sticky top-[8vh]">
  <div class="overflow-hidden">
    <div><h2 class="text-[15vw] leading-[1] tracking-tighter mb-[-.1em] uppercase">Selected</h2></div>
  </div>
  <div class="flex justify-center overflow-hidden">
    <div><h2 class="text-[15vw] leading-[1] tracking-tighter mb-[-.1em] uppercase">Projects</h2></div>
  </div>
</div>
```
"Selected" is NOT centered — it fills close to 100% of the container width on its own (same "longer word fills the row" technique already used for the Hero name lockup in Phase 1). "Projects" (the shorter line) is wrapped in `flex justify-center` and centered with overflow-hidden clipping any excess. The sticky heading pins at `top: 8vh` from roughly the point the section enters view until its containing block's height is exhausted (confirmed via scroll sampling: pinned at `top: 72px` — i.e. 8vh of 900px — continuously from scrollY 3000 to 5400, then released and scrolled normally past scrollY 5800). No manual pin-duration value is needed in our implementation — this falls out naturally from sticky's normal behavior once the heading is the first flow child of a tall-enough wrapper containing the card stack.

**Card structure** (per project, in order Techstar → Sylvan → Oracle Music → Lofi Train):

| Project | `justify` (row wrapper) | `mb` after card | image aspect ratio (measured) |
|---|---|---|---|
| Techstar | `md:justify-end` | `mb-[10vw]` | 432/594.6 ≈ 0.727 |
| Sylvan | `md:justify-start` | `mb-[15vw]` | 432/287.9 ≈ 1.501 (landscape) |
| Oracle Music | `md:justify-center` | `mb-[15vw]` | 432/538.3 ≈ 0.803 |
| Lofi Train | `md:justify-end` | `mb-[10vw]` | 432/648.2 ≈ 0.667 |

All rows are `flex justify-center` on mobile (stacked full-width, no stagger) and switch to the `md:justify-{value}` above at the `md` breakpoint. The card itself is sized `w-full sm:max-w-[60vw] md:max-w-[30vw]` — no absolute positioning, no JS-computed offsets, pure Tailwind responsive width + flex alignment. The pattern (`end` → `mb-[10vw]`, `start`/`center` → `mb-[15vw]`) is consistent across all 4 cards, so our implementation derives the margin from the position rather than storing both independently.

**Per-card content, below the image:**
```html
<div class="flex flex-row-reverse justify-between items-start mt-1">
  <p>2025</p>                          <!-- year, small/muted -->
  <h5 class="text-[36px]">Techstar</h5> <!-- name, display serif -->
</div>
<div class="flex gap-x-3 gap-y-2 items-center flex-wrap mt-[-5px]">
  <!-- pill tags: rounded-full border px-2 py-[1px] text-[13px], one per skill -->
</div>
```
`flex-row-reverse` on the name/year row means DOM order is [year, name] but renders visually as [name, year] (name left, year right) — matches our existing `PillTag` styling closely already (rounded-full border pill), no new component needed.

**Hover affordance:** reference reveals a "View Work" label over the image on hover, linking to a dedicated `/works/[slug]` case-study page.

## Decisions (confirmed with user)

1. **Keep the existing click-to-open modal** (GitHub/Live Demo buttons) instead of building dedicated `/works/[slug]` pages. Revisit dedicated pages in a later pass once all redesign phases are done — tracked as a roadmap backlog item, not part of this phase.
2. **Add a 4th project card** so the section uses the reference's full 4-card stagger pattern (right/left/center/right) instead of a 3-card approximation. The 4th project is this portfolio site itself:
   - **title**: "Premium Portfolio"
   - **year**: "2026"
   - **description**: "This site — a cinematic, reference-matched personal portfolio built with pixel-precise fidelity to hand-picked design references."
   - **tags**: `["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"]`
   - **githubUrl**: `https://github.com/shuu-pao/premium-portfolio`
   - **liveUrl**: none (not deployed yet)
   - **position**: `"end"` (matches Lofi Train's slot as the 4th/last card)
3. **Add a "View Details" hover label** over each card image (relabeled from the reference's "View Work" since we're keeping the modal, not a work page) — small fade/slide-in affordance on hover, matching the reference's interaction fidelity without implying a page navigation that doesn't exist yet.
4. **Per-project `aspectRatio`** instead of one fixed `16/10` for every card — reference varies this per project, and our existing `ImagePlaceholder` component already accepts an `aspectRatio` prop, so this is a data change, not a new component.

## Implementation outline

- `Project` interface: add `position: "start" | "center" | "end"` and `aspectRatio: string`; keep existing fields.
- Derive `mb` spacing from `position` via a small lookup (`end` → `mb-[10vw]`, else `mb-[15vw]`) — one lookup, not per-project duplication.
- Append the 4th project to the `projects` array. Assign each project an `aspectRatio` reflecting its actual subject matter (these are placeholder images, not Jasmine's measured ratios — those were specific to her project shots):
  - PortfolioMon (game UI screenshot): `16 / 9`
  - PIC Futsal Scoreboard (hardware photo): `4 / 3`
  - SMARTBIN 3 (thesis robot/bin photo): `3 / 4`
  - Premium Portfolio (site screenshot): `16 / 10`
- Rewrite the giant "SELECTED WORK" heading markup to the two-line sticky structure above (also correct the copy to "SELECTED PROJECTS" to match the reference's actual heading text, since this is section-chrome text, not placeholder bio copy).
- Rewrite `ProjectCard`'s row wrapper to use the measured `justify`/`mb` pattern instead of the current `space-y-16` uniform stacking.
- Add the hover-reveal "View Details" label as an absolutely-positioned overlay on the image, fading in with `whileHover` (Framer Motion, consistent with the rest of the codebase's animation library choice).
- Modal, `PillTag`, name/year row: adjust only what's needed to match measured sizing (e.g. name `text-3xl`/`md:text-4xl` already close to reference's 36px; row already uses `items-baseline justify-between` — flip to `flex-row-reverse` order to match visual left-name/right-year if not already matching).

## Verification (mandatory before marking Phase 3 done)

Per the project's standing fidelity directive: after implementation, compare the built section against jasminemaduafokwa.com at matching viewport widths (1440 desktop, ~390 mobile) using live-DOM measurement — card widths/positions, heading font-size/pin behavior, image aspect ratios — before updating the roadmap status to "Done." This step is not optional polish; it's the same check that was skipped (and had to be redone) for Phases 1 and 2.

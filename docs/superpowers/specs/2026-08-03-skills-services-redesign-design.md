# Phase 4 Design Spec — Skills/Services Section Redesign

**Reference:** jasminemaduafokwa.com (Services section, live-DOM measured 2026-08-03 at 1440×900 and 390×844)
**Current file:** `src/components/sections/SkillsStackSection.tsx` (pre-redesign scaffolding — per the roadmap's standing directive, this is replaced, not refined in place; the reference's structure bears no resemblance to the current 2-column-grid-with-2-photos layout)

## Context

Phase 4 of the portfolio redesign (see `docs/superpowers/REDESIGN-ROADMAP.md`). The roadmap's original phase description ("4 tabs with hover-swapped image pair") undersold what the reference actually does — it is not a click/hover tab UI. It's a scroll-linked two-column layout: a sticky full-height photo on the right with a small cross-fading inset image, and four stacked category blocks on the left that drive which inset is visible as they scroll into view. This spec corrects the roadmap's description with the measured reality and defines what we build from it.

## Live-DOM measurements (source of truth)

Measured via Playwright against jasminemaduafokwa.com.

**Section intro heading:** a single-word giant heading, not sticky (scrolls away normally — nothing scrolls over it, unlike the Selected Work heading which pins because cards scroll over it):
```html
<h2 class="text-[15vw] leading-[1] tracking-tighter mb-[-.1em] uppercase">services</h2>
```
Reference surrounds this with 5 scattered decorative photos — **out of scope per user decision** (see Decisions). Our version is the heading alone, text changed to "SKILLS".

**Two-column row** (`relative flex flex-col-reverse md:flex-row gap-4`, hairline `border-t`/`border-b`), measured at 1440×900:

| Element | Width | Height | Notes |
|---|---|---|---|
| Row | 1264px | 2342px | 4 × 65vh categories ≈ 2340px, confirms row height is fully derived from category count, not an independent value |
| Text column (`flex-1`, 1st child) | 624px (50%) | 2340px | contains the 4 category blocks stacked |
| Image column (`flex-1`, 2nd child) | 624px (50%) | 900px, `sticky top-0 h-screen` | pinned for the entire 2340px scroll range |

`flex-col-reverse` on mobile puts the image column visually first (above the text), `md:flex-row` restores side-by-side on desktop. Image column is `relative` (not sticky) below `md`, with `h-auto` — it appears once, at natural height, above all 4 stacked category blocks; it does not follow the user down through each category on mobile (confirmed via screenshot at 390×844).

**Each category block** (`px-3 py-8 border-b flex flex-col h-full md:h-[65vh]`, last one has no bottom border):
```html
<div class="... flex flex-col h-full md:h-[65vh]">
  <div class="flex items-center gap-8">
    <img class="w-[36px] 2xl:w-[50px] animate-spin-slow" alt="dark themed star" ... />
    <h6 class="text-[36px] 2xl:text-[50px] leading-[1]">Frontend Development</h6>
  </div>
  <div class="mt-16 md:mt-auto ...">              <!-- md:mt-auto bottom-aligns this within the 65vh box -->
    <div class="flex flex-wrap gap-x-3 gap-y-2">
      <p class="text-[13px] 2xl:text-[20px] border-[1px] px-2 py-[1px] rounded-full">HTML</p>
      <!-- one pill per tag -->
    </div>
    <div class="mt-4">With frontend, I'm able to combine...</div>  <!-- description paragraph -->
  </div>
</div>
```
The icon is a photographed image asset ("dark themed star"), continuously spinning via `animate-spin-slow` — Jasmine's own copyrighted asset, not reusable (see Decisions for substitute). Tag pill styling (`rounded-full border px-2 py-[1px] text-[13px]`) already matches our existing `PillTag` component — reuse as-is, no new component.

**Image column internals:**
```html
<div class="relative md:sticky top-0 flex-1 h-auto md:h-screen overflow-hidden">
  <img class="w-full h-full scale-150" alt="two spanish buildings with blue sky" />  <!-- ONE static backdrop photo, same for all 4 categories -->
  <div>
    <!-- 4 siblings, identical position/size classes, only one `visible` (others `invisible`) at a time -->
    <div class="[visible|invisible] absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2
                w-[40%] md:w-[50%] lg:w-[40%] 2xl:w-[50%] h-[20%] 2xl:h-[30%]">
      <img alt="macbook laptop perched on a step under the sunlight" ... />
    </div>
    <!-- ...3 more, one per category, toggled by visibility -->
  </div>
</div>
```
The backdrop photo never changes; only the small centered inset cross-fades between 4 versions as each category's block is the active/in-view one. This is driven by scroll position (confirmed: which inset is visible tracks which category block is centered/in-view, not click or hover).

## Decisions (confirmed with user)

1. **Categories — adapted, not copied.** Reference's categories (Frontend Development / Backend Development / UI Design / Brand Identity) reflect Jasmine's own work as a designer and don't fit Paolo's background. Final 4, each filling one of the reference's 4 slots:

   | Slot | Category | Tags | Description theme |
   |---|---|---|---|
   | 1 | Frontend Development | React, Next.js, Tailwind CSS, TypeScript, Framer Motion | Building performant, accessible interfaces with modern React tooling |
   | 2 | Salesforce / Agentforce | Agentforce, Flow Builder, Apex Basics, Lightning | Configuring agentic workflows and case management on the Salesforce platform |
   | 3 | AI / Computer Vision | YOLOv8, Python, Deep Learning, Computer Vision | Applied ML for real-world detection/classification systems (per the SMARTBIN 3 thesis project) |
   | 4 | Embedded Systems | C / C++, XC8, Microcontrollers, PIC | Low-level firmware and hardware integration for microcontroller-based systems |

   Descriptions are placeholder-quality prose (2-4 sentences each, reference's structural rhythm) — per the roadmap's standing note that all body copy is placeholder until the user revises it post-redesign.

2. **Section intro heading: "SKILLS", no photo collage.** Giant single-word heading for visual consistency with the rest of the site (matches the "SELECTED PROJECTS" heading pattern), text changed from the reference's "SERVICES" to "SKILLS". The reference's 5 scattered decorative photos around the heading are explicitly out of scope — extra embellishment beyond the phase's core ask, adds placeholder-image and positioning complexity for a non-load-bearing decoration.
3. **Images are `ImagePlaceholder`s, not copied photos.** The backdrop photo and 4 insets are Jasmine's own photography/screenshots — not ours to copy. Same placeholder-first approach as every other section pre-real-content.
4. **Icon substitute.** Reference's spinning star is a photographed asset. Substitute: `lucide-react`'s `Sparkle` icon, continuously spinning via a slow custom CSS animation (matches the visual rhythm without a copied asset).
5. **Active-category tracking via Framer Motion `useInView`**, one hook instance per category block (same library already used elsewhere in this codebase, e.g. the current `SkillsStackSection` and `PortfolioGallerySection`) — drives which of the 4 inset images renders as visible. No new dependency, no hand-rolled `IntersectionObserver`.

## Implementation outline

- `Skill` interface: `{ title: string; tags: string[]; description: string; insetAlt: string }` (4 entries, per the table above).
- Giant "SKILLS" heading: same `cqw`-based scrollbar-safe font-sizing technique just fixed in `PortfolioGallerySection` (a `[container-type:inline-size]` ancestor + `text-[Ncqw]`) — not sticky (nothing scrolls over it here), single word, no need for the two-line sticky machinery Selected Work uses.
- Two-column row: `flex flex-col-reverse md:flex-row gap-4 border-y border-em-text/15`. Left column `flex-1`, maps `categories` into blocks (`flex flex-col h-full md:h-[65vh]`, `border-b` on all but the last). Right column `relative md:sticky md:top-0 h-auto md:h-screen overflow-hidden`.
- Each category block: icon+title row (`flex items-center gap-8`), then a `mt-16 md:mt-auto` wrapper with the tag-pill row (`PillTag`, `flex flex-wrap gap-2`) and description paragraph.
- Image column: one `ImagePlaceholder` (`className="h-full w-full"`, no `aspectRatio` prop needed — object-cover fills the sticky box) for the backdrop, plus 4 stacked absolutely-positioned inset `ImagePlaceholder`s (`w-[40%] md:w-[50%] h-[20%] md:h-[30%]`, centered via `top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`), each toggled via Framer Motion `AnimatePresence`/opacity driven by that category's `useInView` state instead of the reference's raw `visible`/`invisible` class toggle.
- Icon: `lucide-react`'s `Sparkle`, spun via a `spin-slow` keyframe added to `tailwind.config`'s theme (Tailwind's built-in `animate-spin` is a fixed 1s — a new named animation, e.g. `spin 6s linear infinite`, is needed for a slow continuous rotation). Exact duration tuned during implementation, not load-bearing to fidelity.

## Verification (mandatory before marking Phase 4 done)

Per the project's standing fidelity directive: after implementation, compare the built section against jasminemaduafokwa.com's Services section at matching viewport widths (1440 desktop, 390 mobile) using live-DOM measurement — column widths, `65vh` block heights, sticky pin behavior/duration, inset image size/position, mobile stacking order — before updating the roadmap status to "Done."

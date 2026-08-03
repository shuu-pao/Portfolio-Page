# Phase 6 Design Spec — Process Section (hover-to-reveal cards)

**Reference:** jasminemaduafokwa.com ("PROCESS" section, live-DOM measured 2026-08-03 at 1440×900, 1024×900, and 390×844; browser defaulted to the site's dark theme on load — re-measured after forcing its light-mode toggle, since Phases 1–5 all matched the reference's light mode)
**Current file:** `src/components/sections/ProcessTimelineSection.tsx` (pre-redesign scaffolding — a quarter-circle badge + 2-col card grid with always-visible descriptions and a static border; replaced per the roadmap's standing directive, not refined in place)

## Context

Phase 6 of the portfolio redesign (see `docs/superpowers/REDESIGN-ROADMAP.md`). Confirmed with user: **keep the current 4 steps and their copy** (Diagnose/Redesign/Build/Verify — Paolo's own placeholder content referencing Agentforce, SMARTBIN 3, etc.). Only the visual layout and interaction are rebuilt to match the reference. This mirrors how Phase 3 (Selected Work) and Phase 4 (Skills) kept the user's real content and only borrowed the reference's structure.

## Live-DOM measurements (source of truth)

Measured via Playwright against jasminemaduafokwa.com's PROCESS section (found via `h5` heading text match).

**Structure (verbatim, light mode):**
```html
<section class="my-[20vh]">
  <div class="w-full md:w-[90%] mx-auto gap-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
    <!-- 1: badge -->
    <div class="px-8 py-4 rounded-xl rounded-tl-[100%] flex items-end
                bg-lightText text-lightBg dark:bg-darkText dark:text-darkBg
                h-[30vh] sm:h-auto lg:h-[55vh]">
      <h5 class="text-[40px] 2xl:text-[60px]">PROCESS</h5>
    </div>
    <!-- 2: step card (fades in on scroll, outer wrapper style toggles opacity 0→1) -->
    <div style="opacity: 1">
      <div class="bg-transparent hover:bg-lightText dark:hover:bg-darkText
                  text-lightText dark:text-darkText hover:text-lightBg dark:hover:text-darkBg
                  duration-300 rounded-xl lg:h-[55vh] p-6 2xl:p-10 flex flex-col
                  border-[1.5px] border-lightText dark:border-darkText">
        <h6 class="text-[26px] 2xl:text-[48px] mb-[6vh] lg:mb-0">Debrief</h6>
        <div class="opacity-0 duration-300 mt-auto">
          <p class="text-[15px] sm:text-[16px] 2xl:text-[24px]">…description…</p>
        </div>
      </div>
    </div>
    <!-- 3, 4: hidden xl:block spacer cells -->
    <div class="hidden xl:block"></div>
    <div class="hidden xl:block"></div>
    <!-- 5, 6: two more step cards, same shape as #2 -->
    <!-- 7: fourth step card, same shape -->
    <!-- 8: hidden xl:block spacer -->
    <!-- 9: decorative mirrored corner, no text -->
    <div class="rounded-xl rounded-br-[100%] bg-lightText dark:bg-darkText
                h-[30vh] sm:h-auto lg:h-[55vh]"></div>
  </div>
</section>
```

- Grid: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3`, `gap-5` (20px), container `w-full md:w-[90%] mx-auto`.
- At xl (1440 measured): 3 equal columns (~366px each at 1440 container width). DOM order + two `hidden xl:block` spacer cells produce a staircase: row 1 = badge, Step 1, *(empty)*; row 2 = *(empty)*, Step 2, Step 3; row 3 = Step 4, *(empty)*, decorative corner.
- At sm (1024 measured, 2-col): spacer cells vanish entirely (`hidden` below `xl`), so the same DOM order auto-collapses into clean pairs: badge+Step1 / Step2+Step3 / Step4+decorative-corner.
- At mobile (390 measured, 1-col): everything stacks in document order — badge, Step1, Step2, Step3, Step4, decorative corner — each full width.
- Card/badge height: `h-[30vh]` on mobile, `sm:h-auto` (content-driven) at the 2-col breakpoint, `lg:h-[55vh]` at desktop (495px at 900px viewport height, confirmed via `getBoundingClientRect`).
- Corner radius: `rounded-xl` (12px) on three corners, `100%` arbitrary radius on the badge's top-left and the decorative block's bottom-right — a quarter-circle, not a rounded corner.
- Colors (light mode, the reference's default and the mode Phases 1–5 matched): badge/decorative fill and card hover-fill are the reference's rust/orange; card borders and default (non-hover) heading text are that same rust; page background and card default background are the reference's cream.
- **Hover interaction (confirmed by dispatching a real hover and re-reading computed styles):** default card = transparent bg, rust border, rust heading text, description present in DOM at `opacity-0` (reserves no forced layout jump — `mt-auto` already pins it to the card's bottom). On hover: card bg fills solid rust, heading + description text flip to cream, description fades to `opacity-100`, all over 300ms. The reference does this by toggling literal Tailwind classes via React hover state; achieving the identical visual result with plain CSS `:hover` (no JS state) is simpler and behaves identically to the user.
- **Entrance:** each step card's outer wrapper has an inline `opacity` that starts at `0` and settles to `1` once scrolled into view (once-only, not scroll-scrubbed) — same shape as this project's existing `framer-motion` `useInView` fade-up already used on the current `ProcessTimelineSection` and elsewhere. The badge and decorative corner are **not** wrapped in this fade — they render immediately.

## Decisions (confirmed with user, or derived from the roadmap's standing directives)

1. **Keep the current 4 steps and copy.** Diagnose/Redesign/Build/Verify, unchanged. Only layout/interaction is rebuilt.
2. **Colors: reuse existing design tokens, not new ones.** The reference's rust badge/border/heading-text color is already `--em-accent` (`#b5502e`); its cream page background is already `--em-bg`; its cream on-rust text is already `--em-invert-text`. No new tokens needed — this is the same category of reuse as Phase 5's `text-em-text`/`font-display` decision.
3. **Hover interaction implemented via plain Tailwind `hover:` classes, not JS state.** The reference uses a React state toggle to swap class strings; that's unneeded complexity here since CSS `:hover` produces an identical visual result with less code.
4. **Drop `BlurText` on the first card's title.** The reference has no per-card text-reveal flourish beyond the shared scroll-fade-in; keeping `BlurText` on only one of four cards was an unmatched inconsistency in the current scaffolding, not something drawn from the reference.
5. **Section id, wrapper conventions:** keep `id="process"` (existing anchor target, presumably linked from nav) and the project's existing `px-6 md:px-16` horizontal padding convention used by sibling sections, applied on top of the reference's `my-[20vh]` vertical rhythm and `w-full md:w-[90%] mx-auto` inner container.

## Implementation outline

- **Rewrite `src/components/sections/ProcessTimelineSection.tsx`:**
  - Keep the existing `steps: Step[]` array (title + description) unchanged.
  - `<section id="process" className="w-full bg-em-bg px-6 py-[20vh] md:px-16">`.
  - Inner grid: `<div className="w-full md:w-[90%] mx-auto grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">`.
  - Badge cell (always visible, no scroll-fade): `<div className="flex h-[30vh] items-end rounded-xl rounded-tl-[100%] bg-em-accent px-8 py-4 sm:h-auto lg:h-[55vh]"><h2 className="font-display text-[40px] text-em-invert-text 2xl:text-[60px]">PROCESS</h2></div>`.
  - Step cards: mapped from `steps`, each wrapped in the existing `motion.div` scroll-fade (`initial opacity:0/y:16` → `animate` on `useInView`), inner card `className="group flex flex-col rounded-xl border-[1.5px] border-em-accent p-6 text-em-accent duration-300 hover:bg-em-accent hover:text-em-invert-text lg:h-[55vh] 2xl:p-10"`. Title `<h3 className="mb-[6vh] text-[26px] font-display lg:mb-0 2xl:text-[48px]">`. Description wrapped in `<div className="mt-auto opacity-0 duration-300 group-hover:opacity-100"><p className="text-[15px] sm:text-[16px] 2xl:text-[24px]">…</p></div>`.
  - Two `<div className="hidden xl:block" />` spacer cells placed after Step 1 and after Step 4, matching the reference's exact staircase order: badge, Step1, *spacer*, *spacer*, Step2, Step3, Step4, *spacer*, decorative-corner.
  - Decorative corner (always visible, no scroll-fade, no content): `<div className="hidden h-[55vh] rounded-xl rounded-br-[100%] bg-em-accent sm:block" />` — hidden below `sm` since the reference's mobile stack has no room for a purely decorative full-width block; visible from `sm` up to match the 2-col and 3-col staircases.
  - Remove the `BlurText` import/usage; remove the numeric `0{i+1}` mono label (not present in the reference — the step's position is communicated by the staircase layout itself, same as the reference has no numbering).
  - No new dependencies — `framer-motion` (already imported) covers the existing scroll-fade; the hover interaction is pure Tailwind.

## Verification (mandatory before marking Phase 6 done)

Per the project's standing fidelity directive: after implementation, compare the built section against jasminemaduafokwa.com's PROCESS section (light mode) at matching viewport widths (1440 desktop, 1024 tablet, 390 mobile) — staircase cell order and spacer collapse at each breakpoint, badge/decorative quarter-circle radius and mirrored placement, hover fill/text-flip/description-reveal timing, `h-[30vh]/auto/55vh` responsive height behavior — before updating the roadmap status to "Done."

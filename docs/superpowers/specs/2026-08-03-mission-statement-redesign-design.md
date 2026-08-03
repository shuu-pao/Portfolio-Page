# Phase 5 Design Spec — Mission Statement Section Polish

**Reference:** jasminemaduafokwa.com ("My mission" section, live-DOM measured 2026-08-03 at 1440×900 and 390×844)
**Current file:** `src/components/sections/MissionStatementSection.tsx` (pre-redesign scaffolding — a centered single-paragraph block with `BlurText`; replaced per the roadmap's standing directive, not refined in place — the reference's layout bears no resemblance to centered text)

## Context

Phase 5 of the portfolio redesign (see `docs/superpowers/REDESIGN-ROADMAP.md`). On the reference site, the mission block is immediately followed by an "OFFER TO CLIENTS" freelance pricing table (landing page $300 → ecommerce site $1,500, etc.). That table is explicitly **out of scope** (confirmed with user) — this is a developer portfolio, not a freelance-for-hire site selling fixed packages, and it isn't part of the roadmap's Phase 5 description.

## Live-DOM measurements (source of truth)

Measured via Playwright against jasminemaduafokwa.com, section index 4 (`document.querySelectorAll('section')[4]`).

**Structure:**
```html
<section class="my-[15vh]">
  <div class="w-[90%] mx-auto md:ml-auto md:mr-0">
    <div class="flex items-start gap-[8vw]">
      <p class="text-[12.5px] sm:text-[16px]">My mission</p>
      <div>
        <h3 class="text-[5.3vw] leading-[1] overflow-hidden"><!-- per-char spans --></h3>
        <!-- 4 more h3 siblings, one per line -->
      </div>
    </div>
  </div>
</section>
```

- Section height at 1440×900: 381.5625px (5 lines × ~76.3px line height, `text-[5.3vw]` of 1440 ≈ 76px).
- `w-[90%] mx-auto md:ml-auto md:mr-0` right-aligns the block on desktop; on mobile it's still centered/full-width but the internal `flex items-start` row **does not** switch to `flex-col` — confirmed via mobile measurement (`flexDirection: "row"` at 390px viewport, screenshot shows label and heading still side by side, just wrapping more within the narrower `5.3vw` heading column).
- Colors: heading `rgb(245, 231, 211)` (cream) on the site's dark background — this is the reference's own light-on-dark theme, distinct from our design tokens (see Decisions).
- Fonts: heading uses the reference's serif display font; label uses its sans font. Not reused directly — see Decisions.
- **Copy (5 manually-authored lines, not just wrapped text):**
  1. "I seek to maintain a"
  2. "seamless experience for"
  3. "my clients, offering the best results"
  4. "that satisfies their business needs"
  5. "and increases traffic."
- **Animation:** per-character reveal, triggered once on scroll-into-view (not scroll-scrubbed — confirmed: transform settles to `none` and stays there after entering viewport). Each character span starts at `transform: translateY(100%) rotateZ(5deg)` (clipped invisible by the line's `overflow-hidden`) and animates to `transform: none` — a slide-up-and-unrotate reveal, staggered per character within each line.

## Decisions (confirmed with user)

1. **Scope: mission statement block only.** The reference's following "OFFER TO CLIENTS" pricing table is dropped entirely — doesn't fit this portfolio's context, not part of the roadmap's Phase 5 description. Same category of decision as Phase 4 dropping the reference's decorative photo collage.
2. **Colors and fonts: use our own design tokens, not the reference's.** `text-em-text` on `bg-em-bg`, `font-display` for the heading (already mapped to the site's editorial serif, used the same way in the current `MissionStatementSection` and elsewhere) — shared infrastructure per the roadmap's standing directive, not something this phase needs to re-derive from the reference's specific font/color choices.
3. **Label: keep our own eyebrow-label convention, not the reference's plain label.** Every section on this site (`ContactSection`, `PortfolioGallerySection`, `HeroSection`, current `MissionStatementSection`) uses `font-mono text-xs uppercase tracking-[0.2em|0.25em] text-em-accent(-text)` for its section eyebrow. Reused as-is; only the reference's *position* (inline beside the heading via `flex items-start gap-[8vw]`, not stacked above it) is adopted. Label text stays "My approach" (already established by the current implementation, and reads better than a literal "My mission" translation for a root-cause-tracing statement).
4. **New animation component, not `BlurText`.** The reference's per-character slide-up + unrotate mask reveal is visually distinct from `BlurText`'s blur/fade/small-y-shift reveal already used elsewhere on the site (Hero, Tagline, current Mission section). User explicitly chose literal fidelity to the reference's specific motion over reusing `BlurText`. New component: `SlideRevealText`.
5. **Placeholder copy restructured, not reused verbatim.** The reference's copy is about client work / traffic / business needs — doesn't fit Paolo's context. Per the roadmap's standing note that all body copy is placeholder, the copy is rewritten using the current component's existing root-cause-tracing statement, restructured into 5 short manually-broken lines matching the reference's line-break cadence (short opening phrases building to one full sentence):
   1. "I trace every problem"
   2. "to its root cause"
   3. "before I touch a fix."
   4. "Systems built that way"
   5. "keep working after I'm gone."

## Implementation outline

- **New component `src/components/reactbits/SlideRevealText.tsx`** — sibling to `BlurText.tsx`, same prop shape (`text`, `delay`, `duration`, `ease`, `className`), same `useInView({ once: true, margin: "-80px" })` gating. Per-character `motion.span`: `initial={{ y: "100%", rotateZ: 5 }}`, `animate={{ y: 0, rotateZ: 0 }}` (no opacity/blur change — spaces render as literal `" "` characters exactly like `BlurText` already does, no need for the reference's `mr-[1vw]` empty-span spacing hack). Caller supplies `overflow-hidden` via `className` on the outer span, same pattern `BlurText` already uses.
- **Rewrite `src/components/sections/MissionStatementSection.tsx`** to mirror `TaglineSection.tsx`'s structure:
  - `const LINES = [...]` — the 5 strings above, plain (no `indent` field needed here, both lines aren't offset left/right like Tagline's are).
  - Section: `<section id="mission" className="w-full bg-em-bg px-6 py-[15vh] md:px-16">`.
  - Inner: `<div className="w-[90%] mx-auto md:ml-auto md:mr-0"><div className="flex items-start gap-[8vw]">`.
  - Label: `<p className="shrink-0 font-mono text-xs uppercase tracking-[0.25em] text-em-accent">My approach</p>`.
  - Heading column: `<div>` wrapping one `SlideRevealText`/`<p>` per line, each `className="text-[5.3vw] leading-[1] overflow-hidden font-display text-em-text"`.
  - `usePrefersReducedMotion()` fallback: plain `<p>` per line (same pattern as `TaglineSection`), no animation.
- No new dependencies — `framer-motion` (already used by `BlurText`) covers the new component.

## Verification (mandatory before marking Phase 5 done)

Per the project's standing fidelity directive: after implementation, compare the built section against jasminemaduafokwa.com's mission section at matching viewport widths (1440 desktop, 390 mobile) using live-DOM measurement — block right-alignment, `flex items-start gap-[8vw]` row persisting at mobile width (not stacking), `5.3vw` line height/sizing, per-character slide+unrotate reveal timing/stagger, reduced-motion fallback — before updating the roadmap status to "Done."

# Intro Tagline + Two-Image Bio Section — Jasmine Maduafokwa Redesign — Design Spec

## 1. Context

Phase 2 of the 8-phase full-site redesign (Phase 1, Hero, is complete). Per the standing project directive, this section is rebuilt purely from the reference site (jasminemaduafokwa.com) — the current codebase's existing `IntroBioSection.tsx` is not a design baseline, only a source of reusable infrastructure (hooks, `ImagePlaceholder`, motion conventions) and of copy that's already approved Paolo-specific content.

All layout values below were measured directly from the live reference site's DOM (`getBoundingClientRect()` / `getComputedStyle()` via a real browser session at a 1440×900 viewport), not eyeballed from screenshots — the most precise variant of the project's standing pixel-measurement requirement. Colors were cross-checked against the reference's light-theme screenshots (`jasmine-1800.png`) via Python/PIL color sampling, since the live session defaulted to the site's dark theme and a theme-toggle click could not be scripted reliably.

## 2. Reference

Two adjacent blocks on jasminemaduafokwa.com, both inside one wrapping `<section>` on the reference (a continuous dark-or-light band depending on site theme), which we split into two components per the user's original phrasing ("an intro tagline section... a two-image + two-paragraph section below that"):

1. **Tagline block**: four individually-revealed line elements reading (on the reference) "I promote fresh and creative / ideas and bring them to life. / With my skills, I deliver quality / products from start to finish." — not a wrapped paragraph; each visual line is its own DOM node so it can clip-reveal independently.
2. **Two-image + two-paragraph block**: a left portrait image and a narrower, vertically-staggered right portrait image, with two paragraphs of body copy below both.

## 3. Content (confirmed, placeholder)

Per user instruction, all copy in this phase is explicitly placeholder — the user plans to revise portfolio content later, after the design work is finished.

- **Tagline** (adapted rhythm, not the reference's literal words):
  > I turn complex problems into dependable systems.
  > With deliberate engineering, I ship things that hold up under real use.
- **Bio paragraphs**: reused verbatim from the current `IntroBioSection.tsx` (already Paolo-specific, already approved):
  > As an engineer, I prioritize root causes over quick patches — whether that's an Agentforce action that's misfiring or a computer-vision model that's stalled for two months. I trace the problem, rebuild around the real constraint, then ship.
  >
  > That instinct carries across every layer I work in: enterprise AI agents at Accenture, PIC microcontroller firmware in C, and applied computer vision in my thesis work.
- **Images**: placeholders via the existing `ImagePlaceholder` component (no real photography yet), alt text carried over from the current file: "Paolo working on Salesforce Agentforce configuration" (left/taller image) and "Close-up of embedded hardware Paolo built" (right/staggered image).

## 4. Layout

### 4.1 Tagline block (new `TaglineSection.tsx`)

Measured from the reference at 1440px viewport: container inset ~86px each side (≈6vw), font-size `5.3vw`, `line-height: 1`, no gap between the two couplets (lines butt directly against each other vertically), one line-height of gap is just the natural line stacking.

- Section: `py-[15vh]` (matches reference exactly — vertical rhythm, not a fixed px value, so it scales with viewport height like the reference).
- Four lines, each `text-[5.3vw] leading-[1] overflow-hidden font-serif-tagline text-em-accent`:
  1. "I turn complex problems" — `pr-[15vw]` (flush-left, right gutter)
  2. "into dependable systems." — `pr-[15vw]`
  3. "With deliberate engineering," — `pl-[15vw]` (indented from the left, flush-right-ish)
  4. "I ship things that hold up under real use." — `pl-[15vw]`

  (Line breaks chosen to preserve the reference's two-line-per-sentence rhythm at desktop width; exact wrap points are a copy-fitting detail, not a hard requirement, since this copy is placeholder anyway.)
- Font: add **Spectral** (serif, Google Fonts) as a new `next/font/google` import, wired to a new CSS variable (following the same pattern as Hero's `--font-heading` addition) — call it `--font-tagline`, utility class `font-tagline`. Not reusing `--font-editorial` (Bodoni Moda), since Spectral is a distinctly different, more classical serif and the reference clearly uses a different face for this section than the site's other display headlines.
- Color: `text-em-accent` (rust), matching the reference's monochrome rust-on-cream treatment in light mode (measured `rgb(172,72,0)` from `jasmine-1800.png`, close to our existing `--em-accent: #b5502e`).
- Reveal animation: each line individually clip-reveals on scroll into view, same mechanic as `BlurText`/Hero's name lockup — reuse `BlurText` per line (word-level or whole-line reveal is fine; per-character isn't needed here since these are full sentences, not a display lockup), gated by `usePrefersReducedMotion()` and triggered via `useInViewport()` (existing hooks, not reinvented).

### 4.2 Two-image + two-paragraph block (rebuilt `IntroBioSection.tsx`)

Measured from the reference at 1440px viewport:

- Left image: `aspect-[695/894]` (≈0.78, portrait), starts at the section's left inset, full height of its own column.
- Right image: `aspect-[442/696]` (≈0.64, narrower portrait), offset right with a gap of ~63px from the left image's right edge (≈4.4% of 1440), and staggered **down** by ~169px relative to the left image's top (≈19% of the left image's own height) — this vertical stagger is the block's signature visual detail and must be preserved, not two images aligned to a common top edge.
- Two paragraphs below, side by side in two columns, starting roughly level with the taller (left) image's bottom edge. Column widths and gap mirror the two-image column structure above them (left paragraph roughly under the left image + gap, right paragraph roughly under the right image).
- Color: `text-em-accent` (same rust as the tagline — reference uses one accent color for both headline and body copy in this block, not a separate muted body-text tone).
- Text size: reference measured `15px` / `22.5px` line-height (1.5 ratio) at 1440px — map to the project's existing `text-sm leading-relaxed` utility convention rather than hardcoding px, consistent with how Hero's bio paragraphs are sized.
- Reveal animation: keep the existing `framer-motion` fade/slide-up-on-inView treatment already present in `IntroBioSection.tsx` (opacity 0→1, y 20→0, staggered by ~0.15s between the image group and the text group) — this part of the current implementation isn't a "design" decision from the old baseline, it's a reasonable motion treatment consistent with the rest of the site, so it carries forward.

### 4.3 Mobile (below `md`)

Stack vertically in reading order: tagline lines (still full-width, `vw`-scaled font so it naturally shrinks — verify it stays legible and doesn't overflow at narrow widths, adjusting the `vw` value or clamping if it does), then the two images stacked (still respecting their own aspect ratios, staggered offset likely collapses to a simple top-to-bottom stack since there's no room for side-by-side staggering), then the two paragraphs stacked.

## 5. Accessibility

- `usePrefersReducedMotion()` and `useInViewport()` reused, not reinvented.
- Tagline lines and paragraphs remain real text (not image-based).
- Contrast: `em-accent` (`#b5502e`-family rust) on `em-bg` (cream) was already validated as acceptable for large/decorative text during the Hero phase; body-paragraph-sized text in the same color needs a quick contrast check during implementation (rust-on-cream at 15px body-copy size is a stronger requirement than large display text) — if it falls short of 4.5:1, darken the paragraph-specific shade slightly rather than changing the reference's color intent wholesale.

## 6. Explicitly Out of Scope (this phase)

- Selected Projects section and everything after (Phases 3–8, tracked separately).
- Real photography — placeholders only, per existing `ImagePlaceholder` convention.
- Final copy — everything in §3 is placeholder per user instruction; will be revised after all design phases are complete.

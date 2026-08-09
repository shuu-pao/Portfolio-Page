# Contact Section Polish Fixes — Design

**Status:** Approved
**Reference:** jasminemaduafokwa.com/contact (live-DOM measured, 1440×900 viewport), except item 5 (net-new, not reference-sourced)
**Supersedes:** nothing — these are targeted fixes on top of the already-shipped
`2026-08-09-contact-page-letstalk-redesign-design.md` work.

## Context

After the Phase 7 contact rebuild shipped, the user flagged five remaining
gaps against the reference site and one net-new request, found via direct
comparison of the live `/contact` page against jasminemaduafokwa.com/contact.

## Fix 1 — Descender clipping on `/contact` heading ("g" in "get")

**Root cause (verified via live-DOM measurement):** `RevealHeadingLine`
renders its `<motion.h2>` inside an `overflow-hidden` wrapper with
`line-height: 1` (`leading-none`/`leading-[1]`) — required so the
translateY(100%→0%) mask-reveal animation clips cleanly. Bodoni Moda's
italic descender (measured via Canvas `measureText`:
`actualBoundingBoxDescent` = 42px at 158.4px font-size) needs more room
below the baseline than a `line-height:1` box provides (~21.7px available
vs 42px needed — a ~20px shortfall, ratio ≈ 0.13em). The wrapper's
`overflow-hidden` then crops the shortfall, flattening the glyph's bottom
loop. Confirmed visually via screenshot on the live dev build.

The reference site also uses `line-height: 1` (172.8px / 172.8px, measured)
but doesn't exhibit this because it's a different font with shallower
descent — this is a font-metrics interaction, not a strategy difference.

**Fix:** Add `padding-bottom: 0.15em` as an inline style directly on
`RevealHeadingLine`'s `<motion.h2>` (not the wrapper — the wrapper has no
independent font-size to make an em-based value meaningful, and not via the
caller-supplied `className`/`wrapperClassName` props, which callers can and
do override). Because it's `em`-relative to each call site's own
`font-size`, it self-scales correctly across every current usage (Selected
Projects' `17.95cqw`, Skills tabs, this 158.4px contact heading) without
per-caller tuning. 0.15em covers the measured ~0.13em shortfall with a small
safety margin. This is a shared-component fix (`RevealHeadingLine.tsx` is
listed as shared infra in `REDESIGN-ROADMAP.md`), so it silently fixes the
same latent clipping risk everywhere the component is used, not just this
call site.

Effect on layout: adds a small (self-scaling) gap below each heading line.
At the 158.4px contact heading that's ~24px; at smaller headings
proportionally less. Non-issue visually, confirmed via before/after
screenshot comparison in implementation.

## Fix 2 — "Got a project in mind?" text: size, position, animation

**Reference structure (live-DOM measured):** the equivalent copy
("Any questions? Interested" / "in utilizing my services?" / "Don't
hesitate to hit me up!") is manually split into 3 separate `<h5>` lines,
each independently wrapped in its own `overflow-hidden` mask with a
translateY reveal — i.e., the exact same mechanism as our own
`RevealHeadingLine` component. The whole text block lives in a `flex-1`
column, sitting side-by-side with the social-links list (also `flex-1`) in
a `flex ... md:justify-between` row.

**Current bug:** `ContactFooterBlock.tsx`'s text column div has no
`flex-1` (only the `<ul>` does), so the text stretches across the full row
width instead of confining to the right half — this is why it "fills the
whole line." It's also a single static `<h3>`, not per-line animated.

**Fix:**
- Add `flex-1` to the text column's wrapping `<div>` in
  `ContactFooterBlock.tsx`.
- Replace the single `<h3>` with two `RevealHeadingLine` calls, split at
  the sentence boundary: "Got a project in mind?" / "I'd love to hear about
  it." (staggered delays, matching the existing `0` / `0.1` pattern used
  elsewhere for 2-line reveals).
- Reuse the current `<h3>`'s exact size classes (`text-[8vw] md:text-[4vw]`)
  as each line's `className` — these already match the reference's
  `text-[8vw] md:text-[4vw]` pixel-for-pixel, confirmed via measurement.
  (`leading-none` stays; Fix 1's padding-bottom addition inside
  `RevealHeadingLine` covers descender safety here too, e.g. the "g" in
  "project".)

## Fix 3 — "Email Me" button: size and position

**Reference (live-DOM measured):** a fixed-size pill —
`w-full sm:w-[45%] lg:w-[12em] h-[2.5em]` — not padding-driven. At
1440px viewport it renders 192×40px, left-aligned in its column, with an
8px gap below the text block (matches our existing `mt-2`).

**Current bug:** `GradientButton`'s `size="lg"` is padding-driven
(`px-8 py-3.5`), rendering a narrower/shorter button than the reference's
fixed-width pill.

**Fix:** Override sizing only, on the existing `GradientButton` call site
in `ContactFooterBlock.tsx` — add `w-full sm:w-[45%] lg:w-[12em] h-[2.5em]`
to its `className` (alongside the `rounded-full` already there).
`GradientButton` itself is untouched; `cn()` uses `twMerge`, so these
utilities correctly override the variant's default sizing without
specificity issues.

## Fix 4 — "Email Me" hover animation

**Reference (live-DOM measured, before/after hover):** a plain color-invert
crossfade over `duration-500` (500ms) — background goes from transparent to
solid fill (their foreground/"lightText" rust tone), text flips to their
cream tone, border color is unchanged throughout (it's already the same
rust tone at rest). No scale or transform change.

**Fix:** Same idiom already shipped for the "LET'S TALK" marquee link
(`hover:bg-em-accent hover:text-em-invert-bg`), applied to the `Email Me`
`GradientButton` call's `className`, with `duration-500` to match the
reference's measured timing (the marquee link currently uses
`duration-300` — a pre-existing, separate element, not touched here).
`GradientButton`'s `outline` variant currently sets
`hover:bg-em-accent/10`; `twMerge` resolves the conflict in favor of our
passed-in `hover:bg-em-accent`, since `className` is merged last.

## Fix 5 — Red "unavailable" indicator (net-new, not reference-sourced)

**Location:** `Footer.tsx`'s `creditFields` array, specifically the
"Available For Work" row. `Footer` is rendered in exactly two places, both
within contact context: `ContactSection.tsx` (home page) and
`src/app/contact/page.tsx` — a single shared component edit covers both
without touching unrelated pages.

**Design:** An 8px red dot with a soft red glow (`box-shadow` blur) and a
gentle `animate-pulse` (Tailwind's built-in opacity pulse), placed inline
before the "Available For Work" label only — not the other two fields
("Design & Development", "Based In"). No label/value text changes; the red
dot alone is the "not available" signal, per explicit instruction.

**Implementation sketch:** in the `creditFields.map(...)` render, special
case the "Available For Work" label to prefix a
`<span className="inline-block size-2 rounded-full bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.6)] animate-pulse" />`
before the label text, wrapped in a flex row with a small gap for alignment.

## Files touched

- `src/components/reactbits/RevealHeadingLine.tsx` — Fix 1 (shared, affects all callers by design)
- `src/components/sections/ContactFooterBlock.tsx` — Fixes 2, 3, 4
- `src/components/layout/Footer.tsx` — Fix 5

## Verification plan

- `npx tsc --noEmit` clean.
- Live Playwright screenshot comparison: `/contact` heading (descender no
  longer clipped), home `#contact` section and `/contact` page's footer
  block (text column confined to right half, 2-line reveal animates on
  first scroll into view, button correctly sized/positioned).
- Hover screenshot/DOM check on Email Me button confirming bg/text color
  crossfade matches the `hover:bg-em-accent hover:text-em-invert-bg`
  classes.
- Visual check of the red dot on both Footer render sites (home Contact
  section and `/contact` page).

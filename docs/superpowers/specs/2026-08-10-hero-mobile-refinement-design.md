# Hero Section — Mobile Refinement — Design Spec

## 1. Context

New phase, not in the original 8-phase table: refine the **mobile view** of every section. Desktop is already polished and out of scope for all of these phases. This spec covers the Hero only (`meesverberne.com` mobile is the reference); the remaining 7 sections + `/contact` each get their own spec, one at a time, per the user's explicit choice to go section-by-section rather than batch all mobile work into one phase.

Current mobile Hero (`src/components/sections/HeroSection.tsx`) stacks name → photo → P./cursive+bio → subheading in a single column with no real reference-driven design pass — it was never measured against Mees's actual mobile layout.

## 2. Reference measurement (live DOM + pixel analysis, meesverberne.com at 390×844)

- Name lockup: full-bleed two-line stack, unchanged pattern from desktop — already correct, no change needed.
- Marquee: full-bleed row directly under the name, "✕" separators, no vertical tick marks — already matches current implementation, no change needed.
- **Below the marquee, Mees's real mobile hero has no visible framed photo.** The photo is a full-bleed WebGL background layer, left-aligned, ~44% of viewport width, sitting *behind* the P./cursive/bio text column at real-world contrast so low it's nearly invisible (confirmed by boosting screenshot contrast 6× — see conversation). Text column starts ~31% from the left edge (overlapping the photo's right portion) and runs to ~91% (a normal right margin).
- No separate "subheading" element exists in Mees's mobile content below the bio text — the caption-style subheading our Hero has is our own content addition (documented in the original Hero spec as inspired by, not identical to, Mees's desktop caption).

## 3. Decision (user, 2026-08-10)

Full 1:1 fidelity here would make the user's own photo nearly invisible on mobile, which isn't wanted. **Adapted approach first attempted:** keep Mees's measured *geometry* (photo left-aligned ~44vw, text column inset ~31vw overlapping its right edge) but keep the photo fully opaque/visible rather than tinted to near-invisibility.

**Outcome: reverted.** Collapsing the desktop 12-col grid and the mobile inset-overlap into one responsive tree (to avoid mounting `GridDistortion`/`DrawnText` twice) regressed the desktop layout, which must stay untouched. Per the user's explicit call, this phase ends on the **simple stack fallback** instead: full-width photo band, then P./cursive+bio, then subheading, no overlap. That pattern was already what `HeroSection.tsx` had before this phase started (`order-1`/`order-2`/`order-3` on mobile, `lg:order-none` + explicit grid columns on desktop) — so the net change for this phase is **no code change**, confirmed by reverting to the pre-phase version and re-screenshotting both viewports clean.

## 4. Mobile layout (below `lg`, i.e. under 1024px — matches the breakpoint the existing Hero grid already switches on, not the codebase's more common `md`/768px cutoff)

Order, top to bottom:

1. Name lockup — unchanged.
2. Marquee — unchanged.
3. Inset-overlap block (new, replaces the current `grid-cols-1` stack on mobile only):
   - Photo: `absolute left-0 top-0`, breaks out of the section's `px-6` padding on the left edge only (flush to viewport edge like the name/marquee bleeds), width `44vw`, square aspect (keep existing `GridDistortion` `1/1` aspect ratio prop — unchanged component, just resized/repositioned).
   - Text column ("P./" label, cursive tagline, 3 bio paragraphs): `relative z-10`, left inset `31vw` from the section's edge, right margin matching the existing `px-6` padding. Sits in normal flow so it visually overlaps the photo's right ~13vw band, then continues into open space to the right of the photo.
   - Subheading ("Skilled in both *developing* and *design*"): full-width, placed after the bio paragraphs (no Mees-mobile equivalent position exists to match, so this is a design call — closing line reads naturally as the last item in the block).
4. This mobile block is a `lg:hidden` sibling of the existing desktop grid (which becomes `hidden lg:grid`) — same show/hide pattern already used elsewhere in the codebase (e.g. `IntroBioSection.tsx`'s `hidden md:block`), just at the breakpoint Hero's own grid already uses, rather than fighting the desktop grid's `order-*`/`col-span-*` utilities with new mobile overrides.

## 5. Explicitly out of scope

- Any section other than Hero (tracked as separate future phases).
- Desktop layout — untouched.
- Photo content/asset — still the existing placeholder (`mimikyu.webp`) and `GridDistortion` component, unmodified internals.

## 6. Verification

Built and screenshotted the inset-overlap attempt at 390×844 — it read cleanly on mobile (transparent-background sprite doesn't visually collide with overlapping text), but broke desktop at 1440px. Reverted via `git checkout`, re-screenshotted both 390×844 and 1440×900 clean against `localhost:3000`. Hero mobile phase closed: no diff against the pre-phase commit.

## 7. Reopened: excess spacing (2026-08-10, after M5)

**User caught it** while reviewing later phases: on mobile, the gap between the marquee and the mimikyu image, and between the image and the "P./"/"Build & Debug" text block, were both too large (measured 56px each — the grid container's `mt-16` plus the grid's own `gap-10` plus the text block's extra `mt-6` all stacking).

**Change**, mobile-only (`md:`/`lg:` values untouched):
- Grid container: `mt-16` → `mt-8` (32px, was 64px).
- Grid: `gap-10` → `gap-6` (24px, was 40px) — also affects the 768–1024px tablet range since there was no existing `md:gap-*` override, consistent with how this section already treated that range as part of "mobile" stacking.
- Text block: its extra `mt-6` on top of the grid gap → `mt-0` (redundant once the grid gap itself provides spacing).

**Result, measured:** marquee→image 56px → **28px**, image→text 56px → **21px**. Desktop re-screenshotted at 1440px and confirmed unaffected (grid still uses `lg:col-*`/`lg:gap-0`/`lg:mt-0`, none of which were touched).

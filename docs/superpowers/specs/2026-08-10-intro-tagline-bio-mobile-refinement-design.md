# Intro Tagline + Bio Section — Mobile Refinement — Design Spec

## 1. Context

Phase M2 of the mobile-refinement pass (see `REDESIGN-ROADMAP.md`). Covers `TaglineSection.tsx` and `IntroBioSection.tsx`, reference jasminemaduafokwa.com mobile (measured live via DOM snapshot at 390×844, scrolled to the actual section rather than relying on `fullPage` screenshot — the reference uses a transform-based virtual scroll, so `fullPage` capture only returns the first viewport).

## 2. Findings

- **Tagline lines** (`TaglineSection.tsx`): already correct. Measured reference line-height (~21px at 390px viewport ≈ 5.4vw) and second-couplet indent (~59px ≈ 17.4vw) both land within ~2% of the existing `text-[5.3vw]`/`pl-[15vw]` implementation from Phase 2. No change made.
- **Two-image + bio block** (`IntroBioSection.tsx`): real gap found, but the first measurement pass was wrong. Measuring the raw `<img>` tags' `getBoundingClientRect()` suggested the second image bled past the section padding and overlapped the first by ~34px. That was an artifact of the reference's markup — each `<img>` is intentionally oversized and cropped by an `overflow-hidden` parent "frame" div (a standard `object-fit`-cover pattern). Measuring the **frame divs** instead (the actual visible boundary) shows both images render at the *same width* (340px, matching the container inset) with a narrow ~8px gap between them — no bleed, no overlap. Ours used `flex-col gap-6` (uniform 24px gap, correct sizing already) — the only real gap was the gap size (24px vs measured ~8px).

## 3. Change

`IntroBioSection.tsx`, mobile only (`md:` overrides restore the existing untouched desktop layout):

- Image row: `gap-6` → `gap-2` (~8px, matches the measured reference gap), with `md:gap-6` added to preserve the desktop gap.
- **First attempt** (bleed + 32px overlap via `-mx-6 -mt-8` on the second image) was reverted after the user compared the live result against jasminemaduafokwa.com directly and caught that both reference images are the same width, not one bled wider — a mistake the original `<img>`-only measurement pass didn't catch. Corrected by measuring each image's clipping frame div instead of its raw `<img>` tag.
- No DOM reordering, no desktop class changes beyond the additive `md:gap-6`.

## 4. Verification

Standing addition to process for this phase (and remaining mobile sections): **after each change, screenshot the local build's changed section and the reference site's equivalent section at the same viewport width, and compare them directly** — not just internal self-consistency checks. This phase's own first pass would have caught its bleed/overlap mistake immediately if this step had run before presenting the result.

Confirmed via `getBoundingClientRect()` on both sites at 390×844: reference frames are `w:340`/`w:340` with an ~8px gap; local build after the fix is `w:338`/`w:338` (canvas-rendered, same rounding) with a ~7px gap. 1440×900 desktop re-checked and confirmed unchanged (`w:647`/`w:453` side-by-side, matches pre-phase).

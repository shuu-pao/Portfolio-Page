# Skills/Services Section — Mobile Refinement — Design Spec

## 1. Context

Phase M4 of the mobile-refinement pass. Covers `SkillsStackSection.tsx`, reference jasminemaduafokwa.com mobile (390×844).

## 2. Findings

Phase 4's original desktop spec already measured and documented the mobile *structure* explicitly ("`flex-col-reverse` on mobile puts the image column visually first... appears once, at natural height... does not follow the user down through each category on mobile"), and the implementation already had this structure (`flex flex-col-reverse ... md:flex-row`, image column `relative h-auto ... md:sticky md:top-0 md:h-screen`).

**First pass (wrong):** compared screenshots visually at 390px and concluded no gap — layout order, category block structure, and tag wrapping all looked right. This missed a real sizing bug because it didn't measure the backdrop/inset pixel dimensions, only their relative shapes in a screenshot.

**User caught it:** the inset image was visibly smaller on our mobile build than on the reference. Re-measuring with precise `getBoundingClientRect()` on both sites found the actual cause:

| | Backdrop frame | Inset image |
|---|---|---|
| Reference (390px) | `340×510` (≈2:3) | `136×102` (40%×20% of frame, centered) |
| Ours, before fix | `338×211` (≈16:10) | `135×42` (same 40%/20%, but tiny — frame was too short) |

Root cause: the backdrop `ImagePlaceholder` call in `SkillsStackSection.tsx` had no `aspectRatio` prop, so it fell back to the component's default `16/10`. On mobile, where the image column has no explicit height (`h-auto`), that default aspect-ratio is what actually sets the frame's height (`338 × 10/16 ≈ 211px`) — nothing to do with `flex-col-reverse`/sticky structure, which was correct. The inset's own `w-[40%] h-[20%]` classes were already correct percentages of the frame, so they inherited the frame's wrong height instead of being independently wrong.

## 3. Change

`SkillsStackSection.tsx`: added `aspectRatio="2 / 3"` to the backdrop `ImagePlaceholder` call (matches the reference's measured ~2:3 frame ratio). No effect on desktop — at `md:h-screen`, both width and height are already definite from the parent, so CSS `aspect-ratio` has no effect there (confirmed via re-screenshot).

## 4. Verification

Re-measured after the fix: our frame `338×507`, inset `135×101` — matches the reference's `340×510`/`136×102` within rounding. Desktop re-screenshotted and confirmed unchanged. This phase is the reason the mobile-refinement pass's standing verification step (added at M2) was tightened further: **screenshots alone aren't enough — measure actual pixel dimensions (frame + inset, or the equivalent element) against the reference, not just overall layout shape.**

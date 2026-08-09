# Selected Work Section — Mobile Refinement — Design Spec

## 1. Context

Phase M3 of the mobile-refinement pass. Covers `PortfolioGallerySection.tsx`, reference jasminemaduafokwa.com mobile (390×844).

## 2. Findings — compared directly against the reference, no gap found

Phase 3's original desktop spec (`specs/2026-08-03-selected-work-redesign-design.md`) already measured and documented mobile behavior explicitly ("All rows are `flex justify-center` on mobile... card sized `w-full sm:max-w-[60vw] md:max-w-[30vw]`"), and the implementation uses `vw`-scaled spacing (`mb-[10vw]`/`mb-[15vw]`) rather than fixed px, so it scales correctly without a separate mobile pass. Verified against the live reference at 390px:

- **Cards**: full-width within the section padding on both sites, no stagger (stagger is `md:`-only on both).
- **Card-to-card gaps**: measured local build vs. reference — both follow the same "end → smaller gap, start/center → larger gap" pattern (reference gaps ≈10vw/15vw at 390px matched what the local build renders).
- **Sticky heading**: reference pins "SELECTED"/"PROJECTS" via `sticky top-[8vh]` while cards scroll over it, producing a heading/card overlap as you scroll — confirmed the local build does the same (screenshotted mid-scroll: card content visibly overlapping the pinned heading on both sites).
- **"Projects" line narrower/centered than "Selected"**: true on the reference (its typeface renders "PROJECTS" narrower than "SELECTED" at the same font-size, then centers it). In our build, `RevealHeadingLine`'s `flex justify-center` wrapper is already structurally present and correct, but our condensed display font (Anton) happens to render "PROJECTS" almost as wide as "SELECTED", so the visual narrowing doesn't show. This is a typeface characteristic, not a missing behavior — no code change would fix it without picking a different font for the heading, which is out of scope for a mobile-only pass.
- **Tag pills**: `flex flex-wrap gap-2` already wraps the same way as the reference's tag row (3 tags per row, 4th wraps).

## 3. Change

None. No code diff for this phase.

## 4. Verification

Screenshotted `localhost:3000` and jasminemaduafokwa.com side by side at 390×844, at both the section's entry point and ~380px further into the scroll (to check the sticky-overlap behavior specifically, not just the static entry frame). No discrepancy found worth changing. Pending user sign-off.

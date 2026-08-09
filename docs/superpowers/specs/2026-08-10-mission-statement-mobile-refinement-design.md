# Mission Statement Section — Mobile Refinement — Design Spec

## 1. Context

Phase M5 of the mobile-refinement pass. Covers `MissionStatementSection.tsx`, reference jasminemaduafokwa.com mobile (390×844).

## 2. Findings

**First pass:** measured block width, label→heading-column gap, and flush-left offset — all matched the reference within rounding, so this phase was initially marked "no change."

**User caught it:** the block still took up visibly more vertical space than the reference and looked less uniform. The first pass measured *horizontal* layout dimensions but not each line's rendered height, which missed the actual bug: lines 1-2 ("I seek to create tools" / "that work seamlessly") were wrapping onto 2 physical rows inside their column, rendering at 52px height instead of the other lines' 26px.

Root cause: lines 1-2 sit in a flex column beside the "My approach" label, which shrinks to fit the remaining row width (`304px total − 100px label − 31px gap ≈ 173px`). The reference's equivalent column has more room (`306 − 61 − 31 ≈ 214px`) because its label ("My mission") is shorter, and its own line text was short enough to fit either way. Ours wasn't — a copy-fitting problem surfacing as a layout complaint, not a CSS bug (font-size, gap, and structure all already matched the reference exactly).

Measured line heights at 390px, before/after:

| | Before | After |
|---|---|---|
| Line 1 ("I build tools") | 52px (wrapped) | 26px (single row) |
| Line 2 ("that hold up") | 52px (wrapped) | 26px (single row) |
| Lines 3-6 | 26px each | 26px each (unchanged) |
| Total block height | 191px | 140px |
| Reference's equivalent (5 lines, none wrapped) | — | 103px |

## 3. Change

`MissionStatementSection.tsx`: shortened lines 1-2 from "I seek to create tools" / "that work seamlessly" to "I build tools" / "that hold up" so they fit their narrow column without wrapping on mobile. Lines 3-6 unchanged. Copy remains placeholder per the project's standing note (final wording revisited after all design phases are done) — this edit is a layout fit, not a content-quality pass.

## 4. Verification

Re-measured after the fix: all 6 lines now render at a uniform 26px (no wrapping), block height dropped from 191px to 140px. Desktop re-screenshotted at 1440px and confirmed unaffected (ample width there, no wrap either before or after). This phase reinforces the standing verification step further: even pixel-measuring horizontal layout isn't sufficient when text wrapping is possible — check each line's rendered height too.

## 5. Second correction: excess space above/below on mobile

**User caught it again** after the line-wrap fix: still too much vertical space around the whole section on mobile.

Root cause, measured precisely: the reference uses CSS margin (`my-[15vh]`) for Mission's vertical spacing, and adjacent margins **collapse** (the browser takes the larger of two touching values, not their sum) — so its rendered gap is only ~127px each side despite requesting 126.6px margin on top of neighboring sections' own margins. Our site uses **padding** (`py-[15vh]`) for inter-section spacing everywhere, and padding never collapses — so our gap is Mission's own 126.6px **plus** the full padding of whichever section sits next to it: Skills' `py-24` (96px) above, Process's `py-[20vh]` (168.8px) below. Measured totals before any fix: **~223px above, ~295px below**, both roughly 2× the reference's 127px.

**Scope decision (user, 2026-08-10):** the fully-correct fix (converting inter-section spacing to margin so it collapses like the reference) would touch `SkillsStackSection.tsx` (M4, already Done) and `ProcessTimelineSection.tsx` (M6, not yet started) — outside this phase's boundaries. User chose the scoped fix: tighten Mission's own mobile padding only, leave neighboring sections for their own phases.

**Change:** `py-[15vh]` → `py-[6vh] md:py-[15vh]` (mobile-only reduction; desktop's 15vh, unaffected by the complaint, is preserved via the `md:` override). The `6vh` value is borrowed from the reference's own smaller "edge" spacing tier (its neighboring sections use `mb-[8vh]`/`mt-[6vh]` on their sides of the collapse) rather than picked arbitrarily.

**Result, measured:** gap above 223px → **147px** (Skills' 96px + Mission's now-50.6px). Gap below 295px → **220px** (Mission's now-50.6px + Process's still-full 168.8px). Both meaningfully tightened but neither reaches the reference's exact 127px, because part of each gap belongs to a neighboring section outside this phase's scope.

**Flag for M6 (Process):** Process's own `py-[20vh]` top padding is the largest remaining contributor to the gap below Mission. Worth a look when M6 comes up — not just Process's own reference-fidelity, but whether its top spacing specifically should shrink now that Mission's side has already been tightened.

## 6. Third correction: exact reference-matched total gap (2026-08-10)

**User's follow-up instruction:** measure the reference's exact spacing between the end of its Services section and the start of the next block after Mission (an image, alt "elegant poster with translucent brown cosmetic dropper" — confirmed with user this is what they meant by "the Georgia image"), and apply that same total to our Skills-end→Process-start span. This explicitly supersedes §5's "scoped, don't touch neighbors" boundary — the user is now directly asking for a cross-section match, which necessarily means adjusting `ProcessTimelineSection.tsx`'s own padding (tracked here since it's driven by Mission's spec, even though the file touched belongs to M6).

**Reference measurement** (live DOM, 390×844): Services-section-bottom to next-block-image-top = **357px** exactly. This span includes the entire Mission block (label+lines) plus both surrounding gaps — the reference doesn't expose "above" and "below" separately for this purpose, only the total.

**Ours, before this fix:** Skills-section-bottom to Process's-first-card-top = **410px** (using §5's already-reduced Mission padding, Skills' and Process's own padding untouched).

**Change:** `ProcessTimelineSection.tsx`'s section padding split from unprefixed `py-[20vh]` (applied at all breakpoints) into `pt-[13vh] pb-[20vh] md:py-[20vh]` — mobile-only top padding reduced from 20vh to 13vh; bottom padding and desktop's uniform 20vh both untouched. `MissionStatementSection.tsx` itself unchanged from §5.

**Result, measured:** total gap 410px → **350px** (target 357px, within 7px — close enough given font-rendering/rounding). Desktop re-confirmed unaffected (`ProcessTimelineSection`'s computed padding at 1440×900: 180px top and bottom, unchanged = 20vh of 900px).

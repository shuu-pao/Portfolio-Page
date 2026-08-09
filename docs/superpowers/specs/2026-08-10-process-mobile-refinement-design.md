# Process Section — Mobile Refinement — Design Spec

## 1. Context

Phase M6 of the mobile-refinement pass. Covers `ProcessTimelineSection.tsx`, reference jasminemaduafokwa.com mobile (390×844). Mobile top padding was already trimmed once as a side effect of M5's cross-section gap-matching (`pt-[13vh]` vs desktop's `20vh` via `md:py-[20vh]`) — this phase covers the rest of the section.

## 2. Finding (user-reported)

Reference's Process section on mobile ends with a decorative "bookend" card — a large rounded-corner shape (`rounded-br-[100%]`) mirroring the opening "PROCESS" heading card's rounded corner (`rounded-tl-[100%]`), signaling the end of the section. Ours was missing it on mobile: the closing card's div had `hidden ... sm:block` (hidden below 640px) *and* `h-auto` with no content, so even removing `hidden` alone wouldn't have shown it — an empty `h-auto` div renders at 0 height.

Live-DOM measurement of the reference's actual closing-card element found its exact classes: `rounded-xl rounded-br-[100%] bg-lightText ... h-[30vh] sm:h-auto lg:h-[55vh]` — the same `h-[30vh]` mobile height already used by our own opening "PROCESS" card, just missing from the closing card and gated behind `hidden`.

## 3. Change

`ProcessTimelineSection.tsx`, closing card div: `hidden h-auto rounded-xl rounded-br-[100%] bg-em-accent sm:block min-[1200px]:h-[55vh]` → `h-[30vh] rounded-xl rounded-br-[100%] bg-em-accent sm:h-auto min-[1200px]:h-[55vh]`. Removed `hidden`/`sm:block` (always visible now, matching reference), added `h-[30vh]` for mobile, kept `sm:h-auto` for the grid-driven sizing at `sm`+ (unchanged from before) and the existing `min-[1200px]:h-[55vh]` desktop override.

## 4. Verification

Measured the closing card at 390×844: `253×338px`, vs. reference's `253×340px` — matches within rounding. Screenshotted and confirmed visually: same curve direction/position, right before the "LET'S TALK" CTA on both sites. Desktop re-screenshotted at 1440×900 and confirmed unchanged (card was already visible at that width before this fix — only mobile was affected).

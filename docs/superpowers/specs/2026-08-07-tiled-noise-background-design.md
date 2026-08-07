# Tiled Noise-Texture Background (Mees-style) — Design Spec

## 1. Context

Not one of the 8 tracked redesign phases in `REDESIGN-ROADMAP.md` — a standalone visual addition requested directly: replicate the pixelated/noise tile texture visible on meesverberne.com's hero background, but applied across the whole site (both light and dark theme) rather than confined to the hero like the reference.

## 2. Reference (measured, not eyeballed)

Measured programmatically from `mees-live-hero.png` (1440×900 screenshot) and cross-checked against `ref-mees-full.jpeg` (1440×6695 full-page screenshot), both already in the repo root per the roadmap's reference-asset convention.

- **Tile size:** 45×45px squares — detected via scanline color-transition analysis on clean background rows/columns (`y=5` and `x=5`); 32 tiles across a 1440px viewport width.
- **Palette:** each tile is a distinct, narrow-range shade of tan. Sampled 162 tile centers from a clean region (y 0–360, excluding the navy logo/nav pixels and the bird photo): R 209–221, G 193–204, B 169–180, mean `rgb(215,198,175)` / `#D7C6AF`. 28 distinct hex values recorded (see Implementation Notes below for the exact list used).
- **Scope on the reference:** confined to the hero viewport only (~top 900–1000px); below that the reference page is flat solid `rgb(215,197,173)`, then a solid navy footer. **This spec intentionally diverges** — user wants the tiled texture across the entire page, not just the hero, per direct confirmation.
- **Motion:** none. Diffed 3 hover-state screenshots (`mees-hero-hover1/2/3.png`) pixel-for-pixel on the background strip — identical across all three. Static texture, not animated/parallaxed.

## 3. Decisions (confirmed with user)

- **Scope:** entire page (not hero-only like the reference).
- **Palette:** use the exact measured mees tan values in light mode (not the site's own `--em-bg` cream token).
- **Dark mode:** also gets a tiled version — same jitter formula, re-centered on the site's existing `--em-invert-bg` (`#17130f`) instead of the tan base, so dark mode isn't left flat while light mode is textured.

## 4. Approach

CSS-only repeating SVG pattern as a `background-image`, not a JS-rendered grid of DOM tiles and not a canvas-drawn texture:

- A JS-rendered grid (one `<div>` per tile) would mean ~4,700 DOM nodes to cover a ~6700px-tall page at 45px tiles — real DOM/paint weight for a purely decorative effect.
- A canvas-drawn texture needs a client component, executes after mount, and risks a flash of untextured background before it paints.
- A static SVG `<pattern>` baked into a `background-image` data URI needs none of that: zero JS, zero hydration risk (same string server- and client-side), cacheable, and reuses the exact mechanism `globals.css` already uses to swap `--em-bg` under `.dark`.

**Ceiling (ponytail-flagged):** the SVG pattern tile is a fixed repeat unit (8×8 tiles = 360×360px), so it repeats verbatim every 360px down a tall page instead of being globally unique per tile. At this jitter's low contrast (±6–7 RGB units) this is not expected to be visually perceptible. If it ever is, the upgrade path is a larger repeat unit or a canvas/seeded-DOM approach (Approach B/C considered and rejected above, for cost reasons, not correctness reasons).

## 5. Implementation Notes

- Build two SVG pattern strings (light, dark), each an 8×8 grid of 45×45 `<rect>` elements, cycling through a fixed array of the measured hex tones (28 light values sampled above, minus the one antialiasing outlier `#a49992`; dark values recomputed with the same jitter deltas applied to `#17130f`'s RGB instead of the tan base).
- Base64-encode each as a `background-image: url("data:image/svg+xml;base64,...")` value, set via two new CSS custom properties in `globals.css` (e.g. `--tile-bg-light`, `--tile-bg-dark`), following the existing pattern where `.dark` overrides `--em-bg` → apply the same override for a new `--tile-bg` var consumed by `body`.
- `body` in `src/app/layout.tsx`: replace/augment `bg-em-bg` with the tiled background (`background-image: var(--tile-bg)`, `background-repeat: repeat`); default `background-attachment` (scrolls with content, not fixed/pinned).
- Remove the now-redundant flat `bg-em-bg` class from each light section wrapper so the shared body texture shows through instead of being painted over: `HeroSection.tsx`, `IntroBioSection.tsx`, `MissionStatementSection.tsx`, `PortfolioGallerySection.tsx` (section wrapper only, not the inner `bg-em-bg` gallery-item/dialog uses), `ProcessTimelineSection.tsx`, `SkillsStackSection.tsx`, `TaglineSection.tsx`, and `page.tsx`'s `<main>`.
- Leave every `bg-em-invert-bg` usage untouched (`ContactSection.tsx`'s dark footer, `PortfolioGallerySection.tsx`'s lightbox/modal) — those are deliberately solid on the reference too.

## 6. Accessibility

- No motion, so no `usePrefersReducedMotion` gating needed.
- Contrast: jitter is a ±3% lightness wobble around base tones that already clear 4.5:1 against `--em-text`/`--em-invert-text`; the wobble is far too small to move any text pairing below its current ratio.

## 7. Testing / Verification

- Compare rendered tile size/palette against `mees-live-hero.png` (same 45px grid, same measured hex range) — visual spot check, not pixel-diff automation (this is a texture, not a layout element).
- Toggle light/dark theme and confirm both render a tiled (not flat) background with no flash-of-unstyled-background.
- Scroll the full page height and confirm no visible seam/repetition artifact at the 360px tile-unit boundary.
- `npm run dev` compile check — no broken imports/syntax errors (per CLAUDE.md's Pre-Delivery Verification rule).

## 8. Explicitly Out of Scope

- Any change to `REDESIGN-ROADMAP.md`'s 8 tracked phases — this is a standalone addition, not Phase 8 (loading screen, still not started).
- Hero-only scoping (the reference's actual behavior) — explicitly overridden per user's answer.
- Animation/parallax on the tile layer — reference has none, not requested.

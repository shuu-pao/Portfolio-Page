# Animated Tile Shimmer Background — Design Spec

## 1. Context

**Supersedes the animation-relevant parts of `docs/superpowers/specs/2026-08-07-tiled-noise-background-design.md`** (previous session, same day). That spec correctly measured the reference's 45px grid and tan color range from static screenshots, but concluded the background was static — a conclusion later disproven: diffing 3 hover screenshots taken seconds apart caught no change because the animation's per-cell period (~1.3s, see §2) happens to be short enough that any handful of screenshots taken close together in time can coincidentally land in similar phase, not because the reference is actually static. The tile size (45px) and light-mode color range (`#d1c1a9`–`#ddccb4`) measured in that spec remain valid and are reused here — only the "static" conclusion and its resulting implementation (a flat SVG background-image) are being replaced.

## 2. Reference mechanism (extracted from source, not re-measured)

`meesverberne.com` fetched directly and its litespeed-cache JS bundles grepped for `backgroundCanvas` turned up the actual GLSL fragment shader (Three.js `ShaderMaterial` on a full-viewport `<canvas>`), reproduced here in full since every implementation detail below derives from it:

```glsl
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
void main() {
    vec2 st = gl_FragCoord.xy / resolution.xy;
    vec2 gridCoord = floor(st * vec2(scaleX, scaleY));
    float offset = random(gridCoord);                          // per-cell random phase, 0..1
    float fadeTime = time * 0.2;                                // time += 0.4 every rAF frame
    float fade = 0.5 * (1.1 + sin(fadeTime + offset * 6.28318)); // per-cell sine pulse, biased toward 1
    gl_FragColor = vec4(vec3(0.9), fade);                       // near-white wash, animated opacity
}
```

- **Grid:** `scaleX = canvas.width / 45` (desktop, `window.width > 580`) or `/15` (mobile) — i.e. 45px cells desktop, 15px mobile. `scaleY` is a **fixed row count** (20 desktop, 40 mobile), not width/height-derived, so their cells are only square when `canvas.height ≈ 900`. This spec deliberately squares that off (see §4) rather than porting the quirk.
- **Per-cell timing:** `time` increments by a fixed `0.4` every `requestAnimationFrame` callback — not scaled by real elapsed time, so their animation speed silently depends on the viewer's refresh rate. At an assumed nominal 60fps: `time` grows ~24/sec, `fadeTime` (`= time*0.2`) grows ~4.8 rad/sec, so `sin(fadeTime + offset*2π)` completes one full cycle every `2π / 4.8 ≈ 1.309s`. Each of the grid's ~640 cells (32×20 at 1440px) runs this cycle at its own random phase (`offset`), so the aggregate reads as constant, non-repeating shimmer rather than a synchronized pulse.
- **Compositing:** the shader draws a near-white (`vec3(0.9)`) translucent wash, alpha-blended over whatever solid color sits beneath the canvas — that's why static screenshots read as "different shades of tan": it's one base tone, modulated per-cell by a time-varying white overlay opacity, not per-cell fixed colors.
- **Not ported:** a mouse-hover interaction (`isUnderMouse`) that inverts the cell under the cursor to solid black — not requested, not part of "tiles subtly changing color," left out per YAGNI (see brainstorming answer).

## 3. Decisions (confirmed with user)

- **No WebGL/Three.js for this component** — the site already mounts several `GridDistortion` (Three.js) canvases; browsers cap concurrent WebGL contexts (~8–16), and adding another dedicated full-page WebGL context is an avoidable risk. Reimplement the same per-cell sine math in plain Canvas2D.
- **Reduced motion:** freeze on first frame — render each cell once at its own fixed phase and never start the animation loop, using the existing `usePrefersReducedMotion` hook. No separate "keep the old static SVG" fallback system to maintain.

## 4. Design

**Component:** `src/components/reactbits/TileShimmerBackground.tsx` — client component (`"use client"`), a single `<canvas>` mounted once in `src/components/layout/Providers.tsx` (has `ThemeProvider` context already), rendered as a sibling before `{children}`:
- `position: fixed; inset: 0; z-index: -1; pointer-events: none;` — behind all page content, unaffected by scroll or page height (unlike the previous SVG-background-image approach, this eliminates any "tile pattern repeats every Npx down a tall page" concern entirely).
- Sized to `window.innerWidth` / `window.innerHeight` on mount and on `resize` (matches the reference's own `resizeCanvas()`).

**Grid, squared off from the source quirk:** cell size 45px desktop (`window.innerWidth > 580`) / 15px mobile, applied to **both** axes — `cols = Math.ceil(width / cellSize)`, `rows = Math.ceil(height / cellSize)`. (`ponytail:` deliberately not porting the reference's fixed-row-count behavior, which only produces square cells when the viewport happens to be ~900px tall — square cells at every viewport height is simpler and was already this project's own prior "45×45 squares" framing.)

**Per-cell color, ported math:**
- Per-cell fixed phase: `hash(col, row) = frac(sin(col*12.9898 + row*78.233) * 43758.5453123)` (direct JS port of the shader's `random()`, computed once per cell at grid-build time, not per animation frame).
- Per-frame fade value: `fade = clamp(0.5 * (1.1 + sin(elapsedSeconds * 4.8 + hash * 2π)), 0, 1)` — same `4.8 rad/sec` rate and `1.1` bias as the reference's nominal-60fps behavior, but driven by **real elapsed time** (`performance.now()`-based), not frame count, so speed no longer varies with the viewer's refresh rate — a deliberate correction, not a fidelity gap.
- Cell color: `lerp(paletteDark, paletteLight, fade)` where `paletteDark`/`paletteLight` are the two ends of the already-measured light-mode range (`#d1c1a9` ↔ `#ddccb4`) or the dark-mode range generated in the previous phase (`#110e09`–`#1d1914`-ish, re-derived from `--em-invert-bg` with the same deltas) — reusing the previous spec's measured/generated palettes rather than re-deriving new ones, since only the "static vs animated" question was wrong, not the colors.

**Redraw throttling:** `requestAnimationFrame` loop, but only actually redraws when ≥66ms (~15fps) has elapsed since the last draw. At a ~1.3s per-cell period, 15fps is visually indistinguishable from 60fps for this effect and meaningfully cheaper — `ponytail:` chosen over matching the display's native refresh rate.

**Theme:** reads `next-themes`' resolved theme (same `useTheme()` pattern `HeroSection.tsx` already uses) and picks the light or dark palette pair; recomputes on theme change without restarting cell phases.

**Reduced motion:** `usePrefersReducedMotion()` gates the `requestAnimationFrame` loop — when true, draw each cell once at `elapsedSeconds = 0` (i.e. `fade = clamp(0.5*(1.1 + sin(hash*2π)), 0, 1)`) and never schedule another frame.

**No devicePixelRatio scaling** — canvas backing store matches CSS pixels 1:1. `ponytail:` this is a decorative low-detail block-color grid, not fine text/lines, so retina crispness isn't worth the added resize-handler complexity; upgrade path is scaling `canvas.width`/`height` by `devicePixelRatio` and scaling the 2D context to match, if the blockiness on high-DPI displays ever reads as a defect rather than the intended aesthetic.

## 5. Cleanup — replaces the previous static implementation

The previous phase's mechanism is fully superseded, not layered under this one:

- **Delete:** `public/textures/tile-light.svg`, `public/textures/tile-dark.svg` (dead once the canvas exists).
- **Remove from `src/app/globals.css`:** `--tile-bg-light`, `--tile-bg-dark`, `--tile-bg` (both the `:root` declarations and the `.dark` override).
- **`src/app/layout.tsx`:** `<body>` drops `[background-image:var(--tile-bg)] [background-repeat:repeat] [background-size:360px_360px]`, keeping flat `bg-em-bg` alone — this remains the pre-hydration fallback color (paints instantly via CSS before the canvas mounts and starts drawing; canvas visually covers it once running).
- **`src/components/layout/NavOverlay.tsx`:** **revert** the previous phase's final-review fix (which added `[background-image:var(--tile-bg)]` to the overlay). Instead, remove `bg-em-bg` from it entirely — same treatment as the 7 section components already given in the previous phase's Task 2 — so it's transparent and the one shared canvas (mounted at layout level, painted behind everything via `z-index: -1`) shows through it naturally when the nav is open. This is simpler than duplicating a background per-element, and was only necessary before because the background was a per-body CSS property that a full-screen overlay would occlude — with a single shared canvas behind the whole DOM tree, every transparent surface shows the same texture for free.

## 6. Accessibility

- `usePrefersReducedMotion()` gates all motion, per §3/§4 — this is now load-bearing (unlike the previous static version, this design introduces genuine continuous motion, so the gate is required, not a formality).
- Contrast: unaffected by this change — the previous phase's `--em-text-muted` fix (`#544c42`) already accounts for the tile palette's luminance range (§2 of the previous spec's corrected analysis); this phase reuses the same palette bounds, just animates between them instead of freezing at a static per-cell value.
- `pointer-events: none` on the canvas — never intercepts clicks/focus/keyboard navigation on real content above it.

## 7. Testing / Verification

- Visual: confirm the grid shimmers continuously and non-uniformly (no visible synchronized pulse across cells) in both light and dark mode.
- Reduced motion: toggle OS-level `prefers-reduced-motion`, confirm the canvas renders one static frame and stays static (no console errors from a loop that should not be running).
- Resize: confirm the grid recomputes cleanly across the 580px breakpoint (desktop ↔ mobile cell size) without artifacts.
- Route change: navigate `/` → `/contact` → `/`, confirm the canvas keeps animating without a visible restart/flash (mounted once at layout level, should survive client-side navigation).
- `npm run build` / `npm run lint` — no broken imports, no new errors, confirms the deleted CSS vars/SVG files have no other consumers.

## 8. Explicitly Out of Scope

- Mouse-hover cell-inversion interaction from the reference — not requested (§2).
- `REDESIGN-ROADMAP.md`'s 8 tracked phases — unaffected, this remains a standalone addition.
- devicePixelRatio scaling — deferred per the `ponytail:` note in §4.

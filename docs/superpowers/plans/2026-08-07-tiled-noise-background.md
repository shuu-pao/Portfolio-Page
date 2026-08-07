# Tiled Noise-Texture Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the site's flat cream/dark page background with a tiled noise-texture background (Mees Verberne-style), applied across the whole page in both light and dark theme.

**Architecture:** Two static SVG tile-pattern assets (light, dark — already generated and embedded below, deterministic, not regenerated at build/runtime) served from `public/textures/`, referenced as a CSS `background-image` on `body`, theme-swapped via the same `.dark` selector mechanism `globals.css` already uses for `--em-bg`. Each light section's redundant flat `bg-em-bg` is removed so the shared body texture shows through.

**Tech Stack:** Next.js (App Router), Tailwind CSS v4 (`@theme`/CSS custom properties in `globals.css`), no new dependencies.

## Global Constraints

- Tile size: 45×45px, exact hex values as generated below — do not re-randomize (values were reverse-engineered from `mees-live-hero.png` pixel measurements, per `docs/superpowers/specs/2026-08-07-tiled-noise-background-design.md`).
- `bg-em-invert-bg` usages (`ContactSection.tsx`, `PortfolioGallerySection.tsx` lightbox) are explicitly out of scope — do not touch them.
- No JS/canvas/DOM-grid approach — CSS `background-image` only (see spec §4 for why).
- No motion/animation on this layer.
- Strict scope boundary (per project `CLAUDE.md`): only touch the files listed below.

---

### Task 1: Add the tile-pattern SVG assets and wire them into `globals.css`

**Files:**
- Create: `public/textures/tile-light.svg`
- Create: `public/textures/tile-dark.svg`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: two CSS custom properties, `--tile-bg-light` and `--tile-bg-dark` (both `url(...)` values), plus a theme-resolved `--tile-bg` that Task 2 consumes on `body`.

- [ ] **Step 1: Create `public/textures/tile-light.svg` with this exact content**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360">
  <rect x="0" y="0" width="45" height="45" fill="#d4c4ac"/>
  <rect x="45" y="0" width="45" height="45" fill="#dbcab1"/>
  <rect x="90" y="0" width="45" height="45" fill="#d5c4ad"/>
  <rect x="135" y="0" width="45" height="45" fill="#d1c1aa"/>
  <rect x="180" y="0" width="45" height="45" fill="#dbcbb2"/>
  <rect x="225" y="0" width="45" height="45" fill="#d6c5ad"/>
  <rect x="270" y="0" width="45" height="45" fill="#ddccb3"/>
  <rect x="315" y="0" width="45" height="45" fill="#dbcab2"/>
  <rect x="0" y="45" width="45" height="45" fill="#d3c3ab"/>
  <rect x="45" y="45" width="45" height="45" fill="#d1c1a9"/>
  <rect x="90" y="45" width="45" height="45" fill="#d1c1aa"/>
  <rect x="135" y="45" width="45" height="45" fill="#dccbb3"/>
  <rect x="180" y="45" width="45" height="45" fill="#d5c5ad"/>
  <rect x="225" y="45" width="45" height="45" fill="#d2c2ab"/>
  <rect x="270" y="45" width="45" height="45" fill="#d7c7af"/>
  <rect x="315" y="45" width="45" height="45" fill="#d8c7af"/>
  <rect x="0" y="90" width="45" height="45" fill="#d1c1a9"/>
  <rect x="45" y="90" width="45" height="45" fill="#d8c7af"/>
  <rect x="90" y="90" width="45" height="45" fill="#d7c7af"/>
  <rect x="135" y="90" width="45" height="45" fill="#d4c3ac"/>
  <rect x="180" y="90" width="45" height="45" fill="#d7c6ae"/>
  <rect x="225" y="90" width="45" height="45" fill="#dbcab2"/>
  <rect x="270" y="90" width="45" height="45" fill="#d9c9b0"/>
  <rect x="315" y="90" width="45" height="45" fill="#dccbb3"/>
  <rect x="0" y="135" width="45" height="45" fill="#d5c4ac"/>
  <rect x="45" y="135" width="45" height="45" fill="#d7c6ae"/>
  <rect x="90" y="135" width="45" height="45" fill="#d5c4ac"/>
  <rect x="135" y="135" width="45" height="45" fill="#d6c5ad"/>
  <rect x="180" y="135" width="45" height="45" fill="#dbcbb2"/>
  <rect x="225" y="135" width="45" height="45" fill="#dccbb2"/>
  <rect x="270" y="135" width="45" height="45" fill="#d4c3ac"/>
  <rect x="315" y="135" width="45" height="45" fill="#d3c3ab"/>
  <rect x="0" y="180" width="45" height="45" fill="#dacab1"/>
  <rect x="45" y="180" width="45" height="45" fill="#d6c6ae"/>
  <rect x="90" y="180" width="45" height="45" fill="#dac9b0"/>
  <rect x="135" y="180" width="45" height="45" fill="#d2c2ab"/>
  <rect x="180" y="180" width="45" height="45" fill="#dacab1"/>
  <rect x="225" y="180" width="45" height="45" fill="#d4c4ac"/>
  <rect x="270" y="180" width="45" height="45" fill="#d9c8b0"/>
  <rect x="315" y="180" width="45" height="45" fill="#ddccb4"/>
  <rect x="0" y="225" width="45" height="45" fill="#d7c7ae"/>
  <rect x="45" y="225" width="45" height="45" fill="#d5c5ad"/>
  <rect x="90" y="225" width="45" height="45" fill="#d9c9b0"/>
  <rect x="135" y="225" width="45" height="45" fill="#d5c4ad"/>
  <rect x="180" y="225" width="45" height="45" fill="#ddccb4"/>
  <rect x="225" y="225" width="45" height="45" fill="#d6c6ae"/>
  <rect x="270" y="225" width="45" height="45" fill="#d2c2aa"/>
  <rect x="315" y="225" width="45" height="45" fill="#d7c7ae"/>
  <rect x="0" y="270" width="45" height="45" fill="#dac9b1"/>
  <rect x="45" y="270" width="45" height="45" fill="#d2c2aa"/>
  <rect x="90" y="270" width="45" height="45" fill="#dccbb2"/>
  <rect x="135" y="270" width="45" height="45" fill="#dac9b0"/>
  <rect x="180" y="270" width="45" height="45" fill="#d5c4ac"/>
  <rect x="225" y="270" width="45" height="45" fill="#d1c1a9"/>
  <rect x="270" y="270" width="45" height="45" fill="#d2c2aa"/>
  <rect x="315" y="270" width="45" height="45" fill="#d3c3ab"/>
  <rect x="0" y="315" width="45" height="45" fill="#d1c1aa"/>
  <rect x="45" y="315" width="45" height="45" fill="#dbcab1"/>
  <rect x="90" y="315" width="45" height="45" fill="#dac9b1"/>
  <rect x="135" y="315" width="45" height="45" fill="#d4c3ac"/>
  <rect x="180" y="315" width="45" height="45" fill="#d9c8b0"/>
  <rect x="225" y="315" width="45" height="45" fill="#d2c2ab"/>
  <rect x="270" y="315" width="45" height="45" fill="#ddccb3"/>
  <rect x="315" y="315" width="45" height="45" fill="#d4c4ac"/>
</svg>
```

- [ ] **Step 2: Create `public/textures/tile-dark.svg` with this exact content**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360">
  <rect x="0" y="0" width="45" height="45" fill="#1d1913"/>
  <rect x="45" y="0" width="45" height="45" fill="#1d1914"/>
  <rect x="90" y="0" width="45" height="45" fill="#110e09"/>
  <rect x="135" y="0" width="45" height="45" fill="#17130e"/>
  <rect x="180" y="0" width="45" height="45" fill="#110e09"/>
  <rect x="225" y="0" width="45" height="45" fill="#191510"/>
  <rect x="270" y="0" width="45" height="45" fill="#1a1611"/>
  <rect x="315" y="0" width="45" height="45" fill="#1c1812"/>
  <rect x="0" y="45" width="45" height="45" fill="#17140e"/>
  <rect x="45" y="45" width="45" height="45" fill="#16130e"/>
  <rect x="90" y="45" width="45" height="45" fill="#18140f"/>
  <rect x="135" y="45" width="45" height="45" fill="#14110c"/>
  <rect x="180" y="45" width="45" height="45" fill="#13100b"/>
  <rect x="225" y="45" width="45" height="45" fill="#16120d"/>
  <rect x="270" y="45" width="45" height="45" fill="#1b1812"/>
  <rect x="315" y="45" width="45" height="45" fill="#1b1712"/>
  <rect x="0" y="90" width="45" height="45" fill="#16130e"/>
  <rect x="45" y="90" width="45" height="45" fill="#1c1812"/>
  <rect x="90" y="90" width="45" height="45" fill="#120f0b"/>
  <rect x="135" y="90" width="45" height="45" fill="#18140f"/>
  <rect x="180" y="90" width="45" height="45" fill="#1a1610"/>
  <rect x="225" y="90" width="45" height="45" fill="#191510"/>
  <rect x="270" y="90" width="45" height="45" fill="#16120d"/>
  <rect x="315" y="90" width="45" height="45" fill="#15110c"/>
  <rect x="0" y="135" width="45" height="45" fill="#17140e"/>
  <rect x="45" y="135" width="45" height="45" fill="#191610"/>
  <rect x="90" y="135" width="45" height="45" fill="#1a1611"/>
  <rect x="135" y="135" width="45" height="45" fill="#191610"/>
  <rect x="180" y="135" width="45" height="45" fill="#1b1712"/>
  <rect x="225" y="135" width="45" height="45" fill="#17140f"/>
  <rect x="270" y="135" width="45" height="45" fill="#110e0a"/>
  <rect x="315" y="135" width="45" height="45" fill="#1a1711"/>
  <rect x="0" y="180" width="45" height="45" fill="#110e0a"/>
  <rect x="45" y="180" width="45" height="45" fill="#15110d"/>
  <rect x="90" y="180" width="45" height="45" fill="#1c1813"/>
  <rect x="135" y="180" width="45" height="45" fill="#1b1812"/>
  <rect x="180" y="180" width="45" height="45" fill="#120f0a"/>
  <rect x="225" y="180" width="45" height="45" fill="#14110c"/>
  <rect x="270" y="180" width="45" height="45" fill="#14100c"/>
  <rect x="315" y="180" width="45" height="45" fill="#1b1711"/>
  <rect x="0" y="225" width="45" height="45" fill="#1d1913"/>
  <rect x="45" y="225" width="45" height="45" fill="#1a1610"/>
  <rect x="90" y="225" width="45" height="45" fill="#15110c"/>
  <rect x="135" y="225" width="45" height="45" fill="#15110d"/>
  <rect x="180" y="225" width="45" height="45" fill="#1b1711"/>
  <rect x="225" y="225" width="45" height="45" fill="#120f0b"/>
  <rect x="270" y="225" width="45" height="45" fill="#120f0a"/>
  <rect x="315" y="225" width="45" height="45" fill="#1a1711"/>
  <rect x="0" y="270" width="45" height="45" fill="#13100b"/>
  <rect x="45" y="270" width="45" height="45" fill="#110e0a"/>
  <rect x="90" y="270" width="45" height="45" fill="#14100c"/>
  <rect x="135" y="270" width="45" height="45" fill="#14110c"/>
  <rect x="180" y="270" width="45" height="45" fill="#120f0b"/>
  <rect x="225" y="270" width="45" height="45" fill="#15110c"/>
  <rect x="270" y="270" width="45" height="45" fill="#14100c"/>
  <rect x="315" y="270" width="45" height="45" fill="#17130e"/>
  <rect x="0" y="315" width="45" height="45" fill="#17140f"/>
  <rect x="45" y="315" width="45" height="45" fill="#110e09"/>
  <rect x="90" y="315" width="45" height="45" fill="#1d1914"/>
  <rect x="135" y="315" width="45" height="45" fill="#13100b"/>
  <rect x="180" y="315" width="45" height="45" fill="#15120d"/>
  <rect x="225" y="315" width="45" height="45" fill="#120f0a"/>
  <rect x="270" y="315" width="45" height="45" fill="#1c1813"/>
  <rect x="315" y="315" width="45" height="45" fill="#15120d"/>
</svg>
```

- [ ] **Step 3: Add tile-background CSS variables**

In `src/app/globals.css`, inside the `:root { ... }` block, right after the existing `--em-invert-muted: #b5aa98;` line (part of the "Editorial warm palette" group), add:

```css
--tile-bg-light: url("/textures/tile-light.svg");
--tile-bg-dark: url("/textures/tile-dark.svg");
--tile-bg: var(--tile-bg-light);
```

Then inside the existing `.dark { ... }` block, right after `--em-text-muted: var(--em-invert-muted);` (the block that already overrides `--em-bg`/`--em-text` for dark mode), add:

```css
--tile-bg: var(--tile-bg-dark);
```

- [ ] **Step 4: Verify with `npm run dev`**

Run: `npm run dev`, open the site in a browser, open devtools and confirm `getComputedStyle(document.documentElement).getPropertyValue('--tile-bg')` resolves to the light `url(...)` value, then toggle dark mode and confirm it resolves to the dark `url(...)` value. No visual change yet — `body` doesn't consume `--tile-bg` until Task 2.

- [ ] **Step 5: Commit**

```bash
git add public/textures/tile-light.svg public/textures/tile-dark.svg src/app/globals.css
git commit -m "feat: add mees-style tile-pattern SVG assets and CSS vars

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Apply the tiled background to `body` and strip redundant flat backgrounds from sections

**Files:**
- Modify: `src/app/layout.tsx:68`
- Modify: `src/app/page.tsx:17`
- Modify: `src/components/sections/HeroSection.tsx:16`
- Modify: `src/components/sections/IntroBioSection.tsx:12`
- Modify: `src/components/sections/MissionStatementSection.tsx:15`
- Modify: `src/components/sections/PortfolioGallerySection.tsx:154`
- Modify: `src/components/sections/ProcessTimelineSection.tsx:56`
- Modify: `src/components/sections/SkillsStackSection.tsx:99`
- Modify: `src/components/sections/TaglineSection.tsx:18`

**Interfaces:**
- Consumes: `--tile-bg` custom property from Task 1.
- Produces: none (leaf task; nothing downstream depends on this).

- [ ] **Step 1: Apply the tiled background on `body`**

In `src/app/layout.tsx`, find this line (line 68):

```tsx
      <body className="min-h-full bg-em-bg font-sans text-em-text">
```

Replace with:

```tsx
      <body
        className="min-h-full bg-em-bg font-sans text-em-text [background-image:var(--tile-bg)] [background-repeat:repeat] [background-size:360px_360px]"
      >
```

(Tailwind v4 arbitrary-property syntax — `bg-em-bg` stays as a fallback flat color in case the SVG fails to load; the image paints over it.)

- [ ] **Step 2: Remove the redundant flat background from `page.tsx`'s `<main>`**

In `src/app/page.tsx`, find this line (line 17):

```tsx
    <main className="relative min-h-screen w-full bg-em-bg">
```

Replace with:

```tsx
    <main className="relative min-h-screen w-full">
```

- [ ] **Step 3: Remove `bg-em-bg` from each light section's outer wrapper**

In each file below, remove only the `bg-em-bg` token from the named class string — leave every other class untouched.

`src/components/sections/HeroSection.tsx:16`, from:
```tsx
      className="relative w-full overflow-hidden bg-em-bg px-6 pb-20 pt-16 md:px-16 md:pt-24"
```
to:
```tsx
      className="relative w-full overflow-hidden px-6 pb-20 pt-16 md:px-16 md:pt-24"
```

`src/components/sections/IntroBioSection.tsx:12`, from:
```tsx
    <section id="intro" ref={ref} className="relative w-full bg-em-bg px-6 pb-24 md:px-16">
```
to:
```tsx
    <section id="intro" ref={ref} className="relative w-full px-6 pb-24 md:px-16">
```

`src/components/sections/MissionStatementSection.tsx:15`, from:
```tsx
    <section id="mission" className="w-full bg-em-bg px-6 py-[15vh] md:px-16">
```
to:
```tsx
    <section id="mission" className="w-full px-6 py-[15vh] md:px-16">
```

`src/components/sections/PortfolioGallerySection.tsx:154` (the `<section id="work">` wrapper only — do NOT touch line 111's `bg-em-bg` on the individual gallery-card `<div>`, that's a card fill color, not a page-background duplicate), from:
```tsx
    <section id="work" className="relative w-full bg-em-bg px-6 py-24 md:px-16">
```
to:
```tsx
    <section id="work" className="relative w-full px-6 py-24 md:px-16">
```

`src/components/sections/ProcessTimelineSection.tsx:56`, from:
```tsx
    <section id="process" ref={ref} className="w-full bg-em-bg px-6 py-[20vh] md:px-16">
```
to:
```tsx
    <section id="process" ref={ref} className="w-full px-6 py-[20vh] md:px-16">
```

`src/components/sections/SkillsStackSection.tsx:99`, from:
```tsx
    <section id="skills" className="relative w-full bg-em-bg px-6 py-24 md:px-16">
```
to:
```tsx
    <section id="skills" className="relative w-full px-6 py-24 md:px-16">
```

`src/components/sections/TaglineSection.tsx:18`, from:
```tsx
    <section id="tagline" className="w-full bg-em-bg px-6 py-[15vh] md:px-16">
```
to:
```tsx
    <section id="tagline" className="w-full px-6 py-[15vh] md:px-16">
```

- [ ] **Step 4: Run the compile check**

Run: `npm run lint`
Expected: no errors (removing a single Tailwind class token from a `className` string cannot introduce a lint failure; this step exists to catch a stray typo in the edits above).

- [ ] **Step 5: Visual verification**

Run: `npm run dev`, open `http://localhost:3000` and confirm:
- The tiled tan texture is visible behind every light section, edge-to-edge, no visible seams between sections (since they no longer paint their own opaque background over it).
- `ContactSection` at the bottom still renders its own solid dark `bg-em-invert-bg` — unaffected.
- Toggle dark mode: page background switches to the tiled dark/charcoal texture, `ContactSection` still visually distinct (it was already dark before this change).
- Scroll the full page height and confirm no obvious visible seam at 360px tile-repeat boundaries.

- [ ] **Step 6: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx src/components/sections/HeroSection.tsx src/components/sections/IntroBioSection.tsx src/components/sections/MissionStatementSection.tsx src/components/sections/PortfolioGallerySection.tsx src/components/sections/ProcessTimelineSection.tsx src/components/sections/SkillsStackSection.tsx src/components/sections/TaglineSection.tsx
git commit -m "feat: apply tiled noise-texture background across the site

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

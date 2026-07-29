# Premium Portfolio Design Specification

## 1. Vision & Subject
- **Subject:** Personal premium portfolio for a senior UI/UX engineer & creative technologist.
- **Target audience:** Recruiters & hiring managers in high-end product & design studios; fellow developers who appreciate craftsmanship.
- **Single job of the homepage:** Showcase my work instantly and invite deeper exploration (projects → about → contact).

## 2. Visual & Brand Direction
| Design Element | Decision | Rationale |
|----------------|----------|-----------|
| **Palette** | Custom gradient-based system using the [customGradient] object (see §4). Primary accent = deep-blue → indigo → violet. | Gives a sophisticated, tech-forward feel while staying fully CSS-friendly. |
| **Typography** | *Display* → **Archivo**, *Body* → **Space Grotesk**. | Both are available via Google Fonts, have strong personality, and pair well; Archivo adds a premium headline feel, Space Grotesk keeps body text clean and readable. |
| **Spacing System** | 8-point modular scale derived from `--space-md` = 16px; increments: 0-8-16-24-32-48-64px. | Guarantees rhythm and makes responsive breakpoints predictable. |
| **Shadow Depth** | `--shadow-sm` → `0 1px 2px rgba(0,0,0,0.05)` up to `--shadow-xl` → `0 20px 25px rgba(0,0,0,0.15)`. | Provides realistic depth without visual clutter. |
| **Motion-Driven Style** | *Hero*: heavy scroll-parallax + subtle canvas visualizer. *Project cards*: depth-rotate on hover. *Buttons*: animated gradient fill. | Motion is used where it adds information rather than everywhere, avoiding "AI-generated" feel. |

## 3. Layout & Page Structure
### ASCII Wireframe (high-level)
```
+------------------------------------------------------------+
|  NAVBAR (fixed)                                            |
|  ––– Logo | NavLinks (About | Projects | Contact)                |
+------------------------------------------------------------+
|  HERO SECTION                                            ▼ |
|  ––– Full-screen canvas visualizer (background)   |
|  ––– Animated Headline + Subtitle (BlurText)       |
|  ––– Primary CTA Button (GradientButton)           |
+------------------------------------------------------------+
|  ABOUT SECTION (AboutMeSection)                           |
|  ––– Two-column: intro text + skill-grid (NeonSkill) |
+------------------------------------------------------------+
|  PROJECTS SECTION (PortfolioGallerySection)                |
|  ––– Responsive grid (3-col → 5-col)             |
|  ––– Each card: hover-rotate, subtle shadow, click-modal |
+------------------------------------------------------------+
|  CONTACT SECTION (ContactForm component)                   |
|  ––– Simple form with animated focus states          |
+------------------------------------------------------------+
|  FOOTER (minimal)                                          |
+------------------------------------------------------------+
```

### Key Layout Decisions
- **Full-screen hero** with **canvas visualizer** that reacts to the user’s scroll speed (Audio-Visualizer hook).
- **Sticky navbar** stays minimal; transparent background until scroll > 100px, then becomes frosted-glass.
- **Project grid** uses **CSS Grid** with dynamic column counts (`grid-cols-1 sm:grid-cols-3 lg:grid-cols-5`).
- **Cards** have perspective (`perspective-1200`) and rotate on hover (`group:hover:rotateY(10deg)`).

## 4. Color System (Custom Gradients)
```ts
// globals.css (excerpt)
:root {
  --gradient-primary: linear-gradient(135deg, #1e57b8, #2d9ef8);
  --gradient-secondary: linear-gradient(135deg, #4ecdc4, #16a085);
  --gradient-accent: linear-gradient(135deg, #2e2e89, #5a43de);
}
```
- Gradient hues are referenced via `bg-[gradient-primary]` utilities (Tailwind-compatible).
- All UI elements (buttons, cards, overlays) use these gradients to maintain visual cohesion.

## 5. Typography System
```tsx
// globals.css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

html {
  font-size: clamp(14px, 1vw, 18px); /* fluid scaling */
}
h1, .display { font-family: 'Archivo', sans-serif; }
body, .body { font-family: 'Space Grotesk', sans-serif; }
```
- Headings are **weight-graded** (300-700) to create hierarchy without extra classes.
- Body text uses a modest 400 weight with generous line-height (`leading-relaxed`).

## 6. Interactive Components
| Component | Key Features | Implementation Hint |
|-----------|--------------|---------------------|
| **BlurText** (already exists) | Letter-by-letter reveal with custom `blur` & `y` animation. | Keep existing component; just add `delay` props based on index. |
| **GradientButton** | Gradient-fill, hover lift (`translateY(-1px)`), subtle scale animation. | Wrap existing `Button` with `motion.button`. |
| **ProjectCard** | Hover rotate (10°), depth shadow, dynamic tag badges. | Use `motion.div` with `animate` + `transition`. |
| **SkillGrid** (NeonSkill) | Neon-style hover background, glowing border, accessible focus. | Already styled; add `prefers-reduced-motion` guard. |
| **AudioVisualizer** (custom hook) | Reads `window.scrollY` to vary particle density; optional Web Audio API fallback. | Wrap in `<canvas className="absolute inset-0" />`. |

## 7. Performance & Accessibility
- **Reduced Motion Preference** – All `animate` timelines wrapped in `usePrefersReducedMotion()` guard.
- **Critical Asset Preload** – Fonts & key images pre-loaded in `next/head`.
- **Image Optimization** – `next/image` with `fill` for hero background, `placeholder=blur`.
- **Keyboard Focus** – All interactive elements have `focus-visible:ring` outlines.
- **WCAG Contrast** – All text meets ≥ 4.5:1 contrast in both light & dark modes.

## 8. Implementation Roadmap
1. **Refactor color utilities** → add `customGradient` to Tailwind config.
2. **Upgrade typography** → import Archivo & Space Grotesk, create CSS variables.
3. **Enhance Hero** → add canvas visualizer hook & animated headline.
4. **Replace Button primitives** → `GradientButton` with motion animation.
5. **Update ProjectGrid** → dynamic responsive grid with hover rotate & modal.
6. **Add AudioVisualizer** → optional hook & canvas overlay.
7. **Accessibility pass** → verify focus, reduced-motion, contrast.
8. **Testing & Deploy** → run `npm run build` → verify bundle size < 2 MB gzipped.

### What’s Next?
- **Do you approve this overall design?**
  - If you’d like to tweak any section (palette, layout, motion), let me know and we’ll iterate.
  - Once approved, I’ll **write a design spec file** (`docs/superpowers/specs/2026-07-29-premium-portfolio-design.md`) and **create a task list** to guide implementation.
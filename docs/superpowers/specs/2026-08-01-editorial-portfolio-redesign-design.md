# Editorial Portfolio Redesign — Design Spec

## 1. Vision

Full visual/motion/structural redesign of the existing single-page portfolio (`src/app/page.tsx`), superseding the Lightfall-anchored redesign (`docs/superpowers/specs/2026-07-31-lightfall-anchored-redesign-design.md`, merged in PR #1). That redesign leaned on WebGL/GSAP animation engineering (Lightfall canvas, tilted-card 3D, magic-bento) but read as flat — a composition/typographic-scale problem, not a missing-tech problem, per a live comparison against 4 reference portfolios (Mees Verberne, Jesse Martinez, Jasmine Maduafokwa, Jesse Ermens).

**The user's explicit steer, after reviewing all 4 references and drilling into two of them:**
- **Mees Verberne's hero composition** (oversized name lockup, marquee tag-strip, photo + hand-lettered cursive accent, paragraph copy) is the reference for our **Hero section specifically**.
- **Jasmine Maduafokwa's structure and motion** (persistent side-tab, sticky-headline occlusion, pill-tag components, manifesto module, spec-sheet credit lines, full-screen nav overlay) is the reference for **every section after the Hero**.
- One unified typographic identity ties both halves together (not a two-register split) — confirmed by the user in favor of "one consistent face" over keeping Mees's grotesk exclusive to the hero.

**Goal:** a site that reads as expensive through typographic scale and editorial layout confidence, not animation density. The current site already has more animation engineering than any single reference; this redesign spends effort on composition instead.

**Content policy:** real content stays. This is not a placeholder portfolio — name (Paolo Jansen Enrera), role (Computer Engineer), bio (Accenture Salesforce Agentforce work, embedded firmware, YOLOv8 thesis), and the 3 real projects (PortfolioMon, PIC-Based Futsal Scoreboard, SMARTBIN 3) all carry forward, restructured into the new layout. Real photography/screenshots for projects and the hero image are **not available yet** — every image slot is built as a real, correctly-proportioned placeholder frame (data-driven via an `imageSrc?: string` field) so a later swap to real images requires no component changes.

## 2. Visual System

### 2.1 Typography

One unified system, replacing the current Fraunces/Space Grotesk/Space Mono/Archivo stack entirely except where a face is reused:

- **Bodoni Moda** (new, variable, via `next/font/google`) — the single display serif: hero name lockup, all section headlines, the sticky "SELECTED WORK" occlusion headline, the footer's large closing line. A true high-contrast Didone, matching Jasmine's fashion-editorial register at extreme display sizes, used in the Hero too (per the user's explicit choice of one consistent face over a two-register split).
- **Space Grotesk** (already loaded — kept) — body copy, UI text, form inputs.
- **Space Mono** (already loaded — kept) — eyebrow labels, spec-sheet fields (project year/tags, footer credit line: "Design & Development / Based In / Available for work"), marquee tag-strip text.
- **Caveat** (new, via `next/font/google`) — the hero's cursive accent word/phrase overlaid on the hero photo (Mees's hand-lettered "Creative" equivalent) — casual, confident, not overly ornamental.
- Fraunces and Archivo are dropped entirely, not demoted.

### 2.2 Color

Warm neutral field replacing the near-black ember palette across every section:

- **Background:** cream-tan, `~#ede2cd` range (close to both references' warm neutrals)
- **Foreground/text:** near-black espresso, `~#211c16` range
- **Accent:** rust/terracotta, `~#b5502e` range — reserved for the marquee separator glyphs and alternating text color, pill-tag outlines, the cursive hero accent word, active/hover nav states, and CTAs. Spent deliberately, same restraint principle as the prior spec.
- **Contact/Footer inversion:** the one structural palette-inversion beat (mirroring Mees's navy→amber contact flip and Jasmine's rust-heavy footer) — near-black panel background, warm off-white body text (not terracotta-on-black, to hold 4.5:1 contrast), terracotta reserved for large text/accents/outlines there (3:1 large-text threshold).
- The old `--gradient-primary/secondary/accent` system (already retired in the prior spec) stays retired.

## 3. Site Architecture

### 3.1 Navigation

Replaces the current frosted-glass top bar (`Navbar.tsx`) with Jasmine's corner-anchored, chrome-light pattern:

- **Top-left:** small wordmark ("PE.")
- **Top-center:** light/dark toggle (sun/moon pill, via `next-themes`) — in scope, **not gating**; can ship after the core visual/motion pass if time-boxed
- **Top-right:** "Menu" text trigger → full-screen overlay (cream bg, giant Bodoni Moda nav items in a left/right zig-zag stagger, each with a small index number, centered; X-close top; reuses the existing project-modal's focus-trap/Escape/`aria-modal` pattern)
- **Right edge, persistent through scroll:** a section-index side-tab (e.g. "01 — Hero", updates via `IntersectionObserver` as each section crosses viewport center) — hidden below the `md` breakpoint, since it's wayfinding chrome, not core content

### 3.2 Section order

Real content, restructured to Jasmine's rhythm:

1. **Hero** — Mees composition (see §4)
2. **Intro/bio strip** *(new)* — Jasmine's asymmetric two-photo + two-column personal-statement block; short, no headline
3. **Selected Work** — sticky-headline occlusion; real project data (PortfolioMon, PIC Scoreboard, SMARTBIN 3)
4. **Skills/Stack** — category + paragraph + pill-tag layout, paired with one large + one inset image slot
5. **Mission statement** *(new)* — single centered pull-quote manifesto module, no imagery
6. **Process** — real 4 steps (Diagnose/Redesign/Build/Verify), restructured into a solid rust arch/quarter-circle anchor beside a 2×2 card grid, replacing the current line-draw timeline
7. **Contact + Footer** — palette-inverts to the near-black/terracotta panel; Jasmine's 3-column spec-sheet credit line; plain-text social list; pill CTA

Testimonials stay cut (no fake client names, consistent with the prior spec's reasoning and `design-system/mypremiumportfolio/MASTER.md`'s anti-pattern list).

## 4. Section-by-Section Component & Motion Mapping

| Section | Components / Libraries | Behavior |
|---|---|---|
| Nav | Motion (existing) | Corner elements fade in on load. Menu overlay: full-screen `AnimatePresence` panel, staggered zig-zag entrance per item. Side-tab: `IntersectionObserver`-driven label swap. |
| Theme toggle | `next-themes` (new dep) + CSS variables | Sun/moon pill; instant/short-crossfade theme swap. Deprioritized. |
| Hero | BlurText (existing, kept), new bespoke `Marquee` component | Name (Bodoni Moda, edge-to-edge, two lines) reveals via BlurText. A constant-speed infinite marquee (not scroll-velocity-linked — Mees's ticker runs at fixed speed) reads "Computer Engineer ✕ Salesforce ✕ Embedded Systems ✕ Computer Vision", separator alternating ✕/➕, text color alternating near-black/terracotta. Below: a symbolic project-photo placeholder slot (e.g. PCB/hardware, populated later) with a Caveat cursive accent word/phrase overlay ("Debug & Build" or similar). Two short paragraphs (adapted from current bio copy) follow. Lightfall removed entirely. |
| Intro/bio | Motion | Two asymmetric placeholder image slots (correct final aspect ratios) with fade/slide-in; two-column personal-statement copy, no headline. |
| Selected Work | GSAP ScrollTrigger (`pin`) + Motion | The one custom-built piece: sticky/pinned "SELECTED WORK" headline with project cards scrolling over it, occluding letters as they pass (matched-background technique). Replaces `tilted-card`; cards keep a lighter hover lift, no 3D tilt. |
| Skills/Stack | Motion, shared `PillTag` component (new, reused from Work) | Category + paragraph list reusing real skills data; one large + one inset placeholder image with parallax-lite scroll offset. Replaces `magic-bento`. |
| Mission statement | Motion, BlurText | Single centered pull-quote (short line on root-cause-first, systems-thinking philosophy), blur/fade reveal, no imagery. |
| Process | Motion | Solid rust arch/quarter-circle anchor beside a 2×2 card grid for the 4 real steps. Replaces the GSAP line-draw. |
| Contact + Footer | Motion, palette inversion | Form kept structurally, restyled to the inverted palette with terracotta focus rings; 3-column spec-sheet credit line ("Design & Development" / "Based In" / "Available for work"); plain-text social list; pill CTA. Lightfall removed. |

**Net library changes:**
- **Removed:** `Lightfall` (both Hero and Contact instances), `tilted-card` usage, `magic-bento` (`BentoGrid`), `CountUp` stat-row usage (credentials fold into mission/about copy instead — neither reference uses a stat-counter block)
- **Added:** `next-themes` (toggle), `lenis` (smooth-scroll, see §5), a bespoke `Marquee` component, a shared `PillTag` component, Bodoni Moda + Caveat via `next/font/google`
- **Kept, repurposed:** GSAP/ScrollTrigger (now powers the Work section pin instead of Hero-exit-parallax and the Process line-draw), Motion, BlurText

## 5. Performance & Accessibility

- **Lenis smooth-scroll** (new dependency): matches Jasmine's confirmed inertia/lag scroll feel, wired through GSAP via the standard `lenis` + `ScrollTrigger.scrollerProxy` integration. Hard-disabled (falls back to native scroll) under `prefers-reduced-motion`.
- **Performance:** dropping Lightfall/WebGL removes the site's one real GPU cost — net lighter than the current site even with Lenis and one GSAP pin added back. GSAP/ScrollTrigger and Lenis are dynamically imported, not in the root bundle. Bodoni Moda and Caveat load via `next/font/google` with `display: swap`.
- **Contrast:** near-black-on-cream clears 4.5:1 easily. The inverted Contact panel uses warm off-white for body copy (not terracotta-on-black) to hold 4.5:1; terracotta there is reserved for large text/accents/outlines (3:1 large-text threshold).
- **Focus/keyboard:** the full-screen menu overlay reuses the existing project-modal's focus-trap/Escape/`aria-modal` pattern (`PortfolioGallerySection.tsx`).
- **Mobile:** side-tab section-index hides below `md` (wayfinding chrome, not core content). Marquee, pill tags, and placeholder image frames are cheap CSS/transform — no GPU cost concern on mobile.
- **`prefers-reduced-motion`** continues to gate via the existing `usePrefersReducedMotion` hook: marquee slows/stops, Lenis disables to native scroll, GSAP scrub-easing collapses to instant (the Work section's `pin` itself is a scroll-position layout technique, not autoplay, and stays functional).
- Baseline accessibility carries forward unchanged from `design-system/mypremiumportfolio/MASTER.md`: full keyboard reachability, visible focus states, no motion-only affordances.

## 6. Imagery Placeholder Strategy

Every image slot (hero photo, intro/bio pair, Work project cards, Skills' layered images) is driven by an `imageSrc?: string` field in its data array. Empty (current state) renders a neutral placeholder frame at the correct final aspect ratio — a subtle border and a small corner mark indicating an image slot, not a gradient standing in as finished art (the prior redesign's `PortfolioGallerySection` gradient cards are explicitly replaced by this). Populated later, it renders via `next/image` with no component logic changes required.

## 7. Explicitly Out of Scope

- Real photography/screenshots — placeholders only this pass; user will supply and swap in later
- Testimonials — cut, no fake client names
- Custom cursor — neither reference uses one (confirmed on Jasmine); not part of this redesign
- Stat-counter row (`CountUp`) — removed; credentials fold into mission/about copy instead
- Light/dark toggle prioritization — in scope but not gating; may land after the core visual/motion pass
- Fraunces, Archivo, the ember/near-black palette, Lightfall/WebGL, `tilted-card`, `magic-bento` — fully retired, not migrated or kept as fallback

## 8. Library Access

To verify during implementation (not yet confirmed via live registry checks, unlike the prior spec's React Bits/KokonutUI components — this redesign uses fewer third-party visual components and more bespoke layout/motion work):
- **Bodoni Moda, Caveat** — both standard Google Fonts, available via `next/font/google`
- **`next-themes`** — standard npm package for light/dark theme management
- **`lenis`** — the current npm package name (successor to the deprecated `@studio-freight/lenis`) for smooth-scroll, with documented GSAP ScrollTrigger integration
- **GSAP / ScrollTrigger** — already installed, repurposed
- **Motion, BlurText** — already installed/existing, kept

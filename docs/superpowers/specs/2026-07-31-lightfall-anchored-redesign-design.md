# Lightfall-Anchored Portfolio Redesign — Design Spec

## 1. Vision

Full visual/motion redesign of the existing single-page portfolio (`src/app/page.tsx`). The current site (Hero/About/Projects/Contact) is functional but visually split — the Hero uses a warm ember palette while every other section uses a leftover blue/indigo system from an earlier spec (`docs/superpowers/specs/2026-07-29-premium-portfolio-design.md`). This redesign supersedes that palette split and rebuilds the site around a single anchor: the **Lightfall** background component (`src/components/reactbits/Lightfall.tsx`, React Bits), which the user picked after live-comparing it against 6 other React Bits WebGL backgrounds and 4 broader aesthetic directions.

**Goal:** a site that reads as expensive to build — through restraint and cohesion, not through maximal animation density. Every section should visibly belong to the same identity Lightfall establishes in the Hero.

**Content policy:** all current placeholder content (name "Paolo Rossi", fake projects, fake links) stays as placeholder. This redesign is scoped to visual/motion/structure only; the user will swap in real content in a later pass. New sections should be structured so that swap is trivial (props/data arrays, not hardcoded prose).

## 2. Visual System

### 2.1 Color — restrained, not repainted

Foundation is near-black (`#0b0a08` range, replacing the current `zinc-950`) with warm-tinted off-white/gray text, applied consistently across **every** section (today only the Hero uses this; About/Projects/Contact use `zinc-950` + blue accents — that split goes away).

The ember/amber accent (`#c2542e → #e08a52`, Lightfall's existing default palette in the Hero) is reserved for:
- The Lightfall canvases themselves (Hero + Contact bookend)
- CTAs and interactive/active states
- Hover glows (cards, bento cells)
- The streak-underline (nav) and line-draw (Process timeline) motions

Everything else stays near-monochrome. Color is spent deliberately, not as a background wash — this is the core "expensive" lever, more than animation count.

The old blue gradient system (`--gradient-primary`, `--gradient-secondary`, `--gradient-accent` in `globals.css`) is retired.

### 2.2 Typography

- **Fraunces** (already loaded) — display serif, used for the Hero name AND all section headlines (previously only the Hero used it; About/Projects/Contact used Archivo)
- **Space Grotesk** (already loaded) — body copy, UI text
- **Space Mono** (already loaded, currently used for the Hero status pill) — eyebrow labels/tags, extended to all sections' "About / Selected Work / Contact"-style labels
- **Archivo** — dropped from the type system, or demoted to nav/button-only use if a third weight is needed. To be decided at implementation time based on how it looks once Fraunces carries all headlines.

### 2.3 Motion signature

**One text-reveal signature, not a grab-bag:** BlurText (already used for the Hero name) becomes the standard reveal for every section headline. No other React Bits text-animation component is introduced for headline reveals — variety-per-section reads as a demo reel, not a considered site.

The one exception is the Marquee Ticker, which needs genuinely different scroll-linked behavior (see §3).

## 3. Site Architecture

Section order (top to bottom), reordered from the original spec to be **proof-first** — work before biography:

1. **Navbar**
2. **Hero** — Lightfall full-bleed
3. **Marquee Ticker** *(new)*
4. **Selected Work** — moved up from position 3 to position 4 (was after About; now right after the ticker)
5. **About** — moved down from position 2
6. **Skills / Stack** *(new)*
7. **Process / Timeline** *(new)*
8. **Contact** — Lightfall bookend
9. **Footer**

**Testimonials was considered and deliberately cut.** Placeholder testimonials from fake people is a generic/templated pattern the project's own `design-system/mypremiumportfolio/MASTER.md` explicitly forbids ("Corporate templates," "Generic layouts" under Anti-Patterns). A tighter set of well-executed sections beats a padded one.

## 4. Section-by-Section Component & Animation Mapping

| Section | Components / Libraries | Behavior |
|---|---|---|
| Navbar | Motion (existing) | Frosted-glass on scroll (kept, already implemented). New: ember streak-underline draws left→right on link hover; CTA button has a subtle magnetic pull toward the cursor. |
| Hero | Lightfall (React Bits), BlurText (React Bits), GSAP ScrollTrigger | Kept as-is structurally. New: content parallax-fades out via a scrubbed GSAP timeline as the user scrolls past, instead of just scrolling out of frame. |
| Marquee Ticker | `scroll-velocity` (React Bits, Text Animations) | Infinite strip of tools/keywords whose scroll speed tracks the user's actual scroll velocity. Breadth pass over the stack before Selected Work. |
| Selected Work | `tilted-card` (React Bits, Components) | Replaces today's basic `rotateY/rotateX` hover with real cursor-tracking 3D tilt + an ember glow border on hover. Modal keeps the current Motion `AnimatePresence` pattern — already correct per CLAUDE.md's animation-engine hierarchy (Motion for state fades). |
| About | Motion, `count-up` (React Bits, Text Animations) | Two-column layout kept. Stat numbers (years active, projects shipped, etc. — placeholder values) animate via count-up instead of appearing instantly. Headline reveal via BlurText. |
| Skills / Stack | `magic-bento` (KokonutUI) | Categorized bento grid (Frontend / Motion & 3D / Tooling) — the depth counterpart to the ticker's breadth. Cells get an ember glow border on hover, consistent with Work cards. |
| Process / Timeline | GSAP ScrollTrigger (bespoke, no library component) | A vertical line draws itself downward as the user scrolls, in the same ember color as Lightfall's streaks — the falling-light motif turned into a functional UI element. This is the one deliberately custom-built GSAP piece; CLAUDE.md reserves GSAP for exactly this kind of scroll-scrubbed timeline work. |
| Contact | Lightfall (2nd instance, calmer settings), Motion | Full-bleed but dimmed/slowed Lightfall (lower `streakCount`/`speed`/`opacity` than Hero) behind a combined Contact+Footer panel — a bookend to the Hero. Form inputs get ember focus rings (replacing current blue ones). Submit button is magnetic, matching the nav CTA. |
| Footer | — | Lives inside the same Lightfall bookend panel as Contact. Social icons get ember hover glow. |

**Deferred, not committed:** a small custom ember-dot cursor that scales up over interactive elements. Worth considering once core sections are built, but not baked into this spec — easy to overdo.

## 5. Performance & Accessibility

- **WebGL budget:** exactly two Lightfall canvases on the page (Hero, Contact bookend), each paused via `IntersectionObserver` when scrolled out of view. The Contact instance runs lower `streakCount`/`speed`/`opacity` than the Hero — both for the calmer-bookend feel and to keep total GPU cost roughly equal to what the Hero alone costs today.
- **`prefers-reduced-motion`** stays the hard rule already established via `usePrefersReducedMotion` (`src/hooks/use-prefers-reduced-motion.ts`): Lightfall drops to near-static, the Process timeline line-draw appears instantly instead of scrubbing, magnetic buttons and tilt cards skip their transform-follow behavior. Every new animated piece uses this existing hook rather than inventing its own check.
- **Bundle discipline:** GSAP/ScrollTrigger, `tilted-card`, and `magic-bento` are dynamically imported only where used (Process, Work, Skills sections respectively) rather than pulled into the root bundle, so the Hero's first paint doesn't wait on code for sections the user hasn't scrolled to.
- **Mobile:** tilt/magnetic effects no-op on touch devices (no precise cursor to track) — cards and buttons still function, just without the hover-follow flourish. Lightfall keeps running on mobile at the same reduced settings as the Contact bookend, since a full-power shader on a phone GPU is a real battery/heat cost.
- **Baseline accessibility** carries forward unchanged from `design-system/mypremiumportfolio/MASTER.md`'s existing checklist: 4.5:1 contrast, visible focus states, no motion-only affordances, full keyboard reachability. This redesign does not get a pass on any of that for being animation-heavy.

## 6. Explicitly Out of Scope

- Real content (name, bio, real projects, real links) — later pass, placeholder stays
- Testimonials section — cut, see §3
- Custom cursor — deferred, see §4
- Blue gradient system in `globals.css` (`--gradient-primary/secondary/accent`) — retired, not migrated
- Archivo font — dropped or demoted; final call at implementation time

## 7. Library Access Confirmed

Verified during this design process (all via live registry checks, not assumed):
- **React Bits** — shadcn-compatible registry at `reactbits.dev/r/{name}.json`; components used: Lightfall, BlurText (existing), `scroll-velocity`, `tilted-card`, `count-up` (new)
- **KokonutUI** — shadcn-compatible registry at `kokonutui.com/r/{name}.json`; component used: `magic-bento` (new)
- **Motion** (`motion` package, already installed) — micro-interactions: streak-underline, magnetic buttons, existing state-fade patterns
- **GSAP** (already installed, unused until now) — ScrollTrigger for Hero exit parallax and the Process timeline line-draw
- **Three.js / @react-three/fiber / drei** (already installed) — not used directly in this redesign; Lightfall and the chosen React Bits components run on `ogl`, not Three

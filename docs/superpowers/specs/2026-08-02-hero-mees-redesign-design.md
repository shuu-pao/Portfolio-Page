# Hero Section — Mees Verberne Redesign — Design Spec

## 1. Context

This is Phase 1 of an 8-phase full-site redesign. The user's directive for this whole redesign: **do not treat the current codebase's section layouts as a baseline or reference.** Each section is rebuilt purely from the two reference sites (meesverberne.com for the Hero, jasminemaduafokwa.com for everything after) as described in the user's original request, using reference screenshots already captured in the repo root (`mees-hero-top.png`, `ref-mees-full.jpeg`) as the visual source of truth.

Existing infrastructure that is *not* "design" — the `--em-*` color tokens (cream `#ede2cd` bg, near-black `#211c16` text, rust `#b5502e` accent), font loading (Bodoni Moda / Space Grotesk / Space Mono / Caveat), `BlurText`, `ImagePlaceholder`, `usePrefersReducedMotion`, `useInViewport` — is kept, since it was already derived to match these same references and isn't a layout/structure decision.

The remaining 7 phases (intro split, Selected Work polish, Skills/Services rebuild, Mission polish, Process hover, Let's-talk/Contact/contact-page, loading screen) are out of scope for this spec and will each get their own spec/plan cycle.

## 2. Reference

Mees Verberne's hero (`mees-hero-top.png`), top to bottom:
- Nav (unchanged, out of scope here)
- Two-line oversized name lockup, edge-to-edge, no gap word-wrap
- Full-bleed marquee row directly under the name: repeating word list separated by a single "✕" glyph, thin vertical tick marks flanking the row at the true viewport edges
- Centered portrait photo, roughly 30–35% of viewport width
- Beside the photo (right side, narrow column): a small initial-label + cursive accent phrase, then two body paragraphs below it
- Bottom-left of the block: a two-line italicized subheading

No status/availability line appears anywhere in the reference hero.

## 3. Content (confirmed)

- **Name:** "Paolo" / "Jansen Enrera" — two stacked lines
- **Marquee words:** "Developer ✕ Engineer ✕ Builder ✕ Creative" (cycling loop)
- **Cursive accent:** "Debug & Build", preceded by a small "P./" label
- **Bio paragraphs:** kept verbatim (already matches user's requested copy):
  > Computer Engineering graduate who builds at both ends of the stack — enterprise AI agents at Accenture and low-level firmware in the lab. At Accenture I spent 540 hours developing Salesforce Agentforce agents that create, update, and close support cases and automate account-billing workflows.
  >
  > Based in Cebu City, Philippines. Actively looking for new opportunities — especially Salesforce, Agentforce, or building smarter customer-experience tooling.
- **Subheading:** "Skilled in both *developing* and *design*" (italic on the two nouns)
- **Status pill ("Actively looking for new opportunities"):** removed from Hero entirely — it resurfaces in the Contact/footer spec-sheet in a later phase.

## 4. Layout

Desktop (`md:` and up), top to bottom:

1. **Name lockup** — `h1`, two `block` lines ("Paolo", "Jansen Enrera"), full-bleed (negative margin to bleed to viewport edge like the current implementation), massive display size (`text-[16vw] md:text-[11vw]`, `font-black`, `leading-[0.85]`), `font-display` (Bodoni Moda). BlurText reveal per line, gated by reduced-motion.
2. **Marquee row** — full-bleed, `border-y`, thin vertical tick marks (`|`) positioned absolutely at the true left/right viewport edges (outside the row's own padding), flanking content. See §5 for behavior.
3. **Center content band** — a two-column arrangement (not an even 50/50 grid):
   - **Image column** (~35% width on desktop, centered in the band rather than pinned to the left edge): portrait `ImagePlaceholder`, aspect ratio `4 / 5`, no absolute overlay elements on top of it.
   - **Text column** (right of the image, narrower, ~30% width): "P./" label + cursive "Debug & Build" (flat, no rotation) at the top, then the two bio paragraphs below it in normal body copy.
   - **Subheading** anchored to the bottom-left of this band, roughly under the image's left edge, sitting in its own space (not inside either column above) — two lines, italic on "developing" and "design".

Mobile (below `md`): stack vertically in reading order — name (two lines, still full-bleed but smaller `vw`-scaled text), marquee (full-width, tick marks omitted — not enough room to read as intentional framing at that width), image (centered, full-width within padding), cursive + label, bio paragraphs, subheading. All in a single column, generous vertical spacing.

## 5. Marquee Behavior

- Single "✕" (`lucide-react` `X` icon) between every word — no alternating "+"; uniform text color (`text-em-text`) for all words, no per-word color alternation.
- The "✕" glyph continuously rotates in place (`rotate: 0 → 360`, linear, ~4s per loop, `repeat: Infinity`) via Motion.
- Horizontal movement is scroll-velocity-driven, adapting the existing bespoke `Marquee` component (not swapping to a different library):
  - Idle (no scroll): slow constant crawl, current direction (right-to-left, i.e. content translates leftward — the existing default).
  - Scrolling down: continues right-to-left, speed scales up with scroll velocity.
  - Scrolling up: reverses to left-to-right, speed scales with scroll velocity.
  - Implementation pattern: Motion's `useScroll` (page-level `scrollY`) → `useVelocity` → `useSpring` (smoothing) → `useTransform` to a direction/speed factor, combined with a `useAnimationFrame` loop advancing a `translateX` motion value (same mechanic as the `ScrollVelocity` React Bits component's internals, but applied to the existing pill/icon markup instead of swapping the component).
- Everything above is gated by `usePrefersReducedMotion()`: rotation stops, movement stops (or drops to the existing static/paused state).

## 6. Accessibility

- Existing `usePrefersReducedMotion()` and `useInViewport()` hooks are reused, not reinvented.
- Contrast: near-black text (`#211c16`) on cream (`#ede2cd`) already clears 4.5:1; rust accent (`#b5502e`) on cream is used only for the cursive accent (large text) and marquee "✕", both fine at the 3:1 large-text/decorative threshold.
- Tick marks and "P./" label are `aria-hidden` (decorative).
- Name and subheading remain real text (not image-based), so they stay screen-reader accessible without extra markup.

## 7. Explicitly Out of Scope (this phase)

- Everything below the Hero (Phases 2–8, tracked separately)
- Geo-coordinates flourish, barcode/phone graphic — not requested, not added
- Real hero photography — placeholder frame only, per existing `ImagePlaceholder` convention

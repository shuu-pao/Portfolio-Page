# Phase 7 Design Spec — "Let's Talk" CTA + Contact section + `/contact` page

**Reference:** jasminemaduafokwa.com (bottom `<footer>` block, live-DOM measured 2026-08-03 at 1440×900)
**Current file:** `src/components/sections/ContactSection.tsx` (already cleared to a bare shell ahead of this phase — old form-based content was pre-redesign scaffolding, not a baseline)

## Context

Phase 7 of the portfolio redesign (see `docs/superpowers/REDESIGN-ROADMAP.md`). The roadmap phrases this as two separate items ("Let's Talk CTA section" + "Contact section"), but the reference site actually renders them as **one merged block** — confirmed with the user, who chose to match the reference 1:1 rather than split it into two custom sections.

## Live-DOM measurements (source of truth)

Measured via Playwright against jasminemaduafokwa.com's bottom `<footer>` block (found via text match on "LET'S TALK" / social link labels, `elementFromPoint` for anchors with no distinguishing class).

**Structure (verbatim):**
```html
<footer class="mb-[20px]">
  <div class="rotate-0 mt-auto px-6 w-[120%] overflow-hidden">
    <div class="flex items-center flex-nowrap gap-x-[6vw] w-fit animate-carousel-slower">
      <!-- repeating: -->
      <h4 class="text-[12vw] leading-[1] uppercase tracking-tighter whitespace-nowrap">LET'S TALK</h4>
      <!-- + down-chevron icon, looped -->
    </div>
  </div>

  <div class="flex justify-center mb-[4vh] md:mb-[8vh]">
    <div class="w-[16vw] sm:w-[12vw] lg:w-[8vw] object-cover">
      <img class="w-full h-full animate-spin-slow" src="<sunburst>.svg" />
    </div>
  </div>

  <div class="flex flex-col-reverse md:flex-row md:justify-between gap-y-6">
    <ul class="flex-1 flex flex-row justify-between md:justify-normal md:flex-col md:gap-y-1">
      <li class="relative w-fit text-[14px] md:text-[18px] capitalize
                 after:duration-300 after:ease hover:after:w-full after:absolute
                 after:w-0 after:h-[2px] after:top-full after:left-0
                 after:bg-lightText dark:after:bg-darkText">
        <a href="mailto:...">email</a>
      </li>
      <!-- github, linkedIn, instagram, behance (same shape) -->
    </ul>
    <div>
      <h5 class="text-[8vw] md:text-[4vw] leading-[1]">Any questions? Interested in utilizing my services? Don't hesitate to hit me up!</h5>
      <div class="mt-2"><a class="rounded-full border ...">Email Me</a></div>
    </div>
  </div>

  <!-- credit bar: Design & Development / Based In / Available for work — already matches this project's existing Footer.tsx -->
</footer>
```

- Marquee: `text-[12vw] uppercase tracking-tighter leading-[1]`, items joined by `gap-x-[6vw]`, wrapper `w-[120%] overflow-hidden` (wider than viewport so the seamless loop never shows an edge), infinite scroll (no scrubbing observed — a continuous crawl, not scroll-velocity-linked like this project's existing skills-strip `Marquee`, though reusing that component's scroll-reactive behavior is an acceptable superset, not a fidelity break).
- Sunburst: centered (`flex justify-center`), `w-[16vw] sm:w-[12vw] lg:w-[8vw]` (≈115px at 1440), continuous slow rotation, `mb-[4vh] md:mb-[8vh]` before the two-column row.
- Two-column row: `flex flex-col-reverse md:flex-row md:justify-between gap-y-6` — mobile stacks the question+CTA block *above* the social list (`flex-col-reverse`); desktop splits them left (social list) / right (question+CTA).
- Social list: `<ul>` of plain `<a>` tags (no button chrome), `text-[14px] md:text-[18px] capitalize`, each wrapped in an `<li>` with a `relative` + `after:` pseudo-element underline that grows from `w-0` to `w-full` on hover (300ms). Row order: Email, Github, LinkedIn, Instagram, Behance. **Per the roadmap's confirmed content list, Behance is dropped; Instagram is included.**
- Question + CTA: `text-[8vw] md:text-[4vw] leading-[1]` heading-weight copy, `Email Me` button below in a rounded-pill outline style, linking `mailto:`.
- Credit bar sits below this row and is unchanged from what this project's `Footer.tsx` already renders — no reference changes needed there beyond removing the now-duplicate icon social row (see Decisions).

## Decisions (confirmed with user)

1. **One merged section, not two.** `ContactSection.tsx` holds the entire block (marquee → sunburst → two-column row); `Footer.tsx` (unchanged credit bar) still renders immediately after it, same as today's `<div className="bg-em-invert-bg"><section>…</section><Footer /></div>` wrapper shape.
2. **No contact form.** The reference has none — just a `mailto:` CTA. The old form-based `ContactSection` is not revived. `Email Me` is a plain `mailto:paolo.enrera@gmail.com` link via the existing `GradientButton` (`href` prop already supported — no button-vs-link fork needed).
3. **`/contact` redirects to `/#contact`.** The reference has no standalone contact page (single-page scroller); a bare Next.js `redirect()` gives us a valid shareable `/contact` URL without duplicating section content.
4. **Footer de-duplication.** `Footer.tsx` currently renders its own icon-based social row (Email/GitHub/LinkedIn, no Instagram) above the credit bar. That row is removed — social links now live only in this section's text-link list (which adds Instagram to match the reference/roadmap content list). `Footer.tsx` becomes purely the credit bar.
5. **Marquee: extend, don't duplicate.** `src/components/ui/Marquee.tsx` gets a new optional `separator?: ReactNode` prop, defaulting to its current hardcoded `X` icon so the existing Hero skills-strip usage is unaffected. This section passes a down-chevron (`lucide-react` `ChevronDown`) and a larger `className` (`text-[12vw] uppercase tracking-tighter`) instead of building a second marquee component.
6. **Sunburst via `lucide-react`, not a new SVG asset.** This codebase has no custom-icon asset pipeline; decorative icons elsewhere (Footer's old social row, Navbar) come from `lucide-react`. Use a large `Sparkle` icon spun with Tailwind's built-in `animate-spin` at a slowed custom duration (`[animation-duration:20s]`), rather than sourcing/generating a bespoke SVG.
7. **Copy stays placeholder**, in the reference's structural rhythm ("Any questions? Interested in utilizing my services? Don't hesitate to hit me up!" reworded to Paolo's own placeholder voice), per the roadmap's standing note that all body copy is revised after design phases finish.
8. **Design tokens reused, no new ones.** `bg-em-invert-bg` / `text-em-invert-text` / `text-em-invert-muted` / `text-em-accent` (already used by the current `ContactSection` shell and `Footer`) cover this section's colors — the reference's rust-on-cream palette already maps to these tokens in every prior phase.

## Implementation outline

- **`src/components/ui/Marquee.tsx`:** add `separator?: ReactNode` prop (default: existing `<X size={12} ... />` element), use it in place of the hardcoded `<X>` in `renderItems`. No other behavior change.
- **Rewrite `src/components/sections/ContactSection.tsx`:**
  - Keep the outer `<div className="relative w-full bg-em-invert-bg"><section id="contact" ...>…</section><Footer /></div>` shape.
  - Marquee row: `<Marquee items={["LET'S TALK"]} separator={<ChevronDown size={32} aria-hidden="true" />} baseVelocity={40} className="w-[120%] text-[12vw] uppercase tracking-tighter leading-none text-em-invert-text" />` — separator sized up from the default `size={12}` (matching the existing skills-strip usage) since this marquee's `12vw` text is far larger; `baseVelocity` keeps the component's existing default (40) rather than introducing a new tuned value.
  - Sunburst: centered `<Sparkle className="w-[16vw] sm:w-[12vw] lg:w-[8vw] text-em-accent animate-spin [animation-duration:20s]" />`, wrapped `mb-[4vh] md:mb-[8vh]`.
  - Two-column row: `flex flex-col-reverse gap-y-6 md:flex-row md:justify-between`.
    - Social list: `<ul className="flex flex-1 flex-row justify-between md:flex-col md:justify-normal md:gap-y-1">`, items Email/GitHub/LinkedIn/Instagram (`href`s from the roadmap's confirmed content list), each `<li>` with the underline-grow-on-hover treatment via Tailwind arbitrary `after:` classes.
    - Question + CTA: `<h3 className="text-[8vw] leading-none md:text-[4vw] text-em-invert-text">` placeholder copy, `<GradientButton href="mailto:paolo.enrera@gmail.com" variant="outline" size="lg">Email Me</GradientButton>` below it.
- **`src/components/layout/Footer.tsx`:** remove the `socialLinks` array and its rendering `<div>`; keep `creditFields` and the rest unchanged.
- **New `src/app/contact/page.tsx`:** a server component calling `redirect("/#contact")` (Next.js `next/navigation`).

## Verification (mandatory before marking Phase 7 done)

Per the project's standing fidelity directive: after implementation, compare the built section against jasminemaduafokwa.com's bottom block at 1440 desktop and a mobile width (390) — marquee scale/loop, sunburst size/rotation speed, two-column reflow (`flex-col-reverse` order on mobile), social-list underline hover, and question/CTA type scale — before updating the roadmap status to "Done." Also verify `/contact` redirects correctly and the Footer no longer double-renders social links.

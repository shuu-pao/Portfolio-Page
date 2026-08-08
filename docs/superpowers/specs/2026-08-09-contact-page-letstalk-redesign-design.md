# "LET'S TALK" CTA button + standalone `/contact` page — Design Spec

**Reference:** jasminemaduafokwa.com (home marquee CTA + `/contact` page, live-DOM measured 2026-08-09 at 1440×900 via Playwright)
**Supersedes:** parts of `specs/2026-08-03-contact-cta-redesign-design.md` (Phase 7). That spec's decision #3 ("`/contact` redirects to `/#contact`, the reference has no standalone contact page") was based on an incomplete check — the reference *does* have a standalone `/contact` page, and its home marquee is a clickable link to it, not decorative text. This spec corrects both. Everything else in the Phase 7 spec (marquee/sunburst/social-list/question-CTA measurements, token mapping) still holds and isn't repeated here except where it changes.

## Context

User request: make the home Contact section's "LET'S TALK" marquee act as a button linking to our own version of the reference's `/contact` page, replicate the reference's onLoad animations and onHover button treatment, and build that `/contact` page to match the reference 1:1.

## Live-DOM measurements (source of truth)

### Home marquee → button

```html
<a href="/contact">
  <div class="py-5 rounded-full flex justify-center
              hover:bg-lightText hover:text-lightBg
              dark:hover:bg-darkText dark:hover:text-darkBg duration-300 h-fit">
    <!-- existing "LET'S TALK" marquee, unchanged -->
  </div>
</a>
```

- Whole marquee (not just the text) is the click target and the hover-color-invert target.
- Default state: transparent bg, `color: rgb(172,72,0)` (their rust "lightText" token).
- Hover state (computed from stylesheet, not simulated): `background-color: rgb(172,72,0)` (their rust token, filled), `color: rgb(245,231,211)` (their cream "lightBg" token) — a straight foreground/background swap, `transition: all 0.3s`.
- `padding: 20px 0px` = Tailwind `py-5`, `border-radius: 9999px` = `rounded-full`.
- Separator glyph between repeats renders as a **double down-chevron** (screenshot-confirmed), not a single chevron.

### `/contact` page

```html
<main>
  <div>
    <section class="my-[8vh]">
      <div class="sm:w-[75%] md:w-[60%] mx-auto">
        <div class="overflow-hidden">
          <h1 class="leading-[1] uppercase text-center text-[20vw] sm:text-[12vw]">
            Let's <span class="italic lowercase">get</span>
          </h1>
        </div>
        <div class="overflow-hidden">
          <h1 class="leading-[1] uppercase text-center text-[20vw] sm:text-[12vw]">
            <span class="italic lowercase">in</span> touch
          </h1>
        </div>
        <div class="flex justify-end">
          <div class="w-[70%] sm:w-[60%] md:w-[55%]">
            <p class="text-[13.5px] sm:text-[15px] 2xl:text-[24px]">
              Ready to bring your vision to life? ...
            </p>
          </div>
        </div>
        <div class="mt-14">
          <form>
            <div class="flex flex-col xs:flex-row gap-6">
              <div class="flex-1 flex flex-col gap-y-2">
                <label class="text-[14px]" for="name">Name *</label>
                <input class="py-2 px-2 origin-left border-b-[1.5px] border-b-lightText
                               outline-none bg-transparent" id="name" type="text" name="user_name" />
              </div>
              <div class="flex-1 flex flex-col gap-y-2">
                <label class="text-[14px]" for="email">Email *</label>
                <input class="py-2 px-2 origin-left border-b-[1.5px] border-b-lightText
                               outline-none bg-transparent" id="email" type="email" name="user_email" />
              </div>
            </div>
            <div class="mt-6">
              <div class="flex-1 flex flex-col gap-y-2">
                <label class="text-[14px]" for="message">Message *</label>
                <textarea class="py-2 px-2 origin-left border-b-[1.5px] border-b-lightText
                                  outline-none bg-transparent" id="message" name="user_message" rows="3" />
              </div>
            </div>
            <div class="mt-6">
              <button type="submit"
                class="hover:bg-lightText hover:text-lightBg duration-300
                       text-[16px] 2xl:text-[26px] w-full sm:w-[45%] py-2
                       border-[1px] border-lightText rounded-full outline-none">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</main>
<footer class="mb-[20px]">
  <!-- sunburst, social list, question+CTA, credit bar — same block as the home page,
       minus the marquee (confirmed: marquee section lives in home's <main>, this
       footer block is a separate element that appears on every page) -->
</footer>
```

- Heading: two lines, each in its own `overflow-hidden` wrapper — reveal is `translateY(100%) → 0%` (settled DOM shows `transform: none` post-animation; matches the existing `RevealHeadingLine` component's documented mechanic, built for this same reference site's heading pattern). `get`/`in` are `italic lowercase` inline spans against an otherwise uppercase line.
- Paragraph: fades in (`opacity: 0 → 1`), sits in a right-aligned narrow column (`flex justify-end` + `w-[70%] sm:w-[60%] md:w-[55%]`) under the centered heading.
- Form fields: bare underline inputs, no full border/background — `border-b-[1.5px]` only.
- Submit button: same hover-invert mechanic as the marquee button (rounded-full outline pill, fills solid on hover, 300ms).
- Below the form: sunburst + social list + question/CTA + credit bar, unchanged from the home page's version of that block, confirmed present via DOM inspection of `/contact` (sibling `<footer>` after `<main>`).
- Form field `name` attributes (`user_name`, `user_email`, `user_message`) match EmailJS's default template variable convention — confirms the reference uses EmailJS for delivery.

## Decisions (confirmed with user)

1. **Marquee becomes a real link + pill button**, `href="/contact"`, hover fills with `bg-em-accent`/`text-em-invert-bg` (our token analog of their rust/cream swap — `em-accent` already renders the same rust hue their `lightText` computes to), `duration-300`. Separator swaps from single `ChevronDown` to `ChevronsDown` (double chevron, matches the reference glyph's rendered shape).
2. **`/contact` becomes a real page**, not a redirect. Same dark-inverted (`bg-em-invert-bg`) treatment as the rest of the Contact section, consistent with this project's established mapping of the reference's rust-on-cream palette onto our invert tokens.
3. **Shared bottom block extracted** into `ContactFooterBlock.tsx` (sunburst + social list + question/CTA) so `ContactSection.tsx` (home) and the new `/contact` page both render it without duplicating markup. `ContactSection.tsx` keeps the marquee-button on top of it; `/contact` puts the heading/form on top of it instead.
4. **Heading reveal reuses `RevealHeadingLine`**, generalized to accept `children: ReactNode` (currently `text: string`) so it can carry the italic-lowercase inline spans. No new reveal component.
5. **Contact form sends via EmailJS** (`@emailjs/browser`, new dependency — no existing email-send capability in this codebase). Wired to `NEXT_PUBLIC_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` env vars, left unset for the user to fill in once they've created an EmailJS account/template. Field names mirror the reference (`user_name`/`user_email`/`user_message`) so a template modeled on the reference's would work unmodified.
6. **Copy stays placeholder** (heading structure/rhythm matches the reference; body copy is Paolo's own placeholder voice), per the roadmap's standing placeholder-copy note.
7. **Navbar's `Contact` link and `#contact` anchor id are unchanged** — home page still scrolls to the Contact section via `#contact`; only the marquee's own click target changes (to `/contact`). Out of scope otherwise.

## Implementation outline

- **`src/components/reactbits/RevealHeadingLine.tsx`:** change `text: string` prop to `children: ReactNode`; update its one existing caller to pass `children` instead of `text`.
- **New `src/components/sections/ContactFooterBlock.tsx`:** extract the sunburst (`Sparkle`, unchanged) + social list + question/CTA `motion.div` out of `ContactSection.tsx` into this component (same `inView` reveal it already has). No visual change from today's home page.
- **`src/components/sections/ContactSection.tsx`:** wrap the `<Marquee>` in `<Link href="/contact" className="block rounded-full py-5 hover:bg-em-accent hover:text-em-invert-bg duration-300">`; swap `ChevronDown` → `ChevronsDown` in the separator; render `<ContactFooterBlock />` in place of the extracted markup.
- **New `src/components/sections/ContactFormSection.tsx`:** two `RevealHeadingLine`s for "Let's `get`" / "`in` touch", fade-in paragraph (placeholder copy), the Name/Email/Message form with underline-input styling, Submit button with the shared hover-invert pill treatment, `emailjs.send()` on submit reading the three `NEXT_PUBLIC_EMAILJS_*` env vars.
- **`src/app/contact/page.tsx`:** replace the `redirect()` with `<Navbar /><main><ContactFormSection /><ContactFooterBlock /></main><Footer />`.
- **`package.json`:** add `@emailjs/browser`.
- **`.env.local.example`** (new): document the 3 `NEXT_PUBLIC_EMAILJS_*` keys, unset.

## Verification (mandatory before marking done)

Compare against jasminemaduafokwa.com's home marquee and `/contact` page at 1440 and 390 widths: marquee pill hover fill/invert timing, heading reveal timing/stagger, paragraph fade, form field layout (row reflow at `xs`/mobile), Submit button hover, and that the shared footer block renders identically on both pages.

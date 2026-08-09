# /contact Page: Shimmer Zoning, Theme-Adaptive Text, Footer Spacing — Design

**Status:** Approved

## Context

The home page's Contact section (`ContactSection.tsx`) is a deliberate, permanently-dark
block: it wraps its marquee + `ContactFooterBlock` + `Footer` in one opaque
`bg-em-invert-bg` div, using the fixed `em-invert-*` tokens throughout, so it
always reads dark regardless of the site's light/dark toggle — this matches the
jasminemaduafokwa.com reference's own contact block and is not being changed.

The rest of the site (Hero, Intro, Work, Skills, etc.) has no opaque background at
all on its section roots — this lets `TileShimmerBackground` (a single canvas
mounted once in `Providers.tsx`, `position: fixed; z-index: -1`, behind
everything) show through, and those sections use the theme-adaptive `em-text`/
`em-bg`/`em-text-muted` tokens (defined in `globals.css`: identity in light mode,
swapped to the `em-invert-*` values under `.dark`) so their text stays legible
against the shimmer in both themes.

`/contact/page.tsx` was built by copying the home Contact section's "always dark"
treatment across the *entire* page — including `ContactFormSection` ("Let's get
in touch"), which should instead behave like a normal page section. Meanwhile
`Footer.tsx` was left with no background at all, so on `/contact` specifically it
sits outside the opaque wrapper and lets the shimmer bleed through underneath it
— the reverse of what's wanted. This spec corrects both: `ContactFormSection`
becomes a normal (transparent, theme-adaptive) section, and `ContactFooterBlock`
+ `Footer` become one continuous always-dark block, matching the home page's
established pattern exactly.

## Fix 1 — Two-zone restructure of `/contact/page.tsx`

Split the current single `<main id="contact" className="... bg-em-invert-bg ...">`
(which wraps both `ContactFormSection` and `ContactFooterBlock`, with `Footer` as
an unstyled sibling outside it) into:

- **Top zone:** `<main>` containing only `<ContactFormSection />`. Drops
  `bg-em-invert-bg` and `min-h-screen` (the latter no longer needs to force full
  viewport height now that it wraps only the form, not the whole page). Keeps
  `pt-[14vh]` (clears the fixed navbar) and the existing `px-6 md:px-16`.
- **Bottom zone:** a `<div className="relative w-full bg-em-invert-bg">` wrapping
  a `<section id="contact" className="relative px-6 py-[10vh] md:px-16">`
  (containing `<ContactFooterBlock />`) followed by `<Footer />` as its sibling —
  this is a direct copy of `ContactSection.tsx`'s existing structure (its own
  `bg-em-invert-bg` div → `<section id="contact" px-6 py-[10vh] md:px-16>` →
  sibling `<Footer />`), just without the marquee `<Link>` that only the home
  page has.

`id="contact"` moves from the old top-level `<main>` to this new inner
`<section>` — i.e. it now marks only the always-dark zone, exactly mirroring
where it lives on the home page. This is deliberate, not incidental: it also
fixes a latent bug in `Navbar.tsx`'s `isDark = active.id === "contact"` check,
which previously forced cream nav text across the *entire* `/contact` page
(including the soon-to-be theme-adaptive top zone). With the id moved,
`useActiveSection`'s default (`sections[0]`, "hero" — never matched on this page)
holds while scrolled over the top zone, so the navbar uses normal adaptive text
there and only forces cream once the always-dark bottom zone is reached —
matching home page behavior exactly, with no changes needed in `Navbar.tsx`
itself.

`Footer.tsx` itself needs no changes — nesting it inside the same
`bg-em-invert-bg` wrapper as `ContactFooterBlock` (rather than as an unstyled
sibling of the old `<main>`) is sufficient; it inherits the opaque background
from its new parent, identical to how it already works on the home page.

## Fix 2 — Theme-adaptive text in `ContactFormSection.tsx`

Since this section's backdrop becomes the theme-adaptive shimmer instead of a
fixed dark fill, every hardcoded `em-invert-*` token in the file swaps to its
adaptive counterpart:

- `HEADING_CLASS`: `text-em-invert-text` → `text-em-text`
- Paragraph: `text-em-invert-muted` → `text-em-text-muted`
- Three field labels ("Name *", "Email *", "Message *"): `text-em-invert-text` → `text-em-text`
- Three inputs/textarea: `border-b-em-invert-text` → `border-b-em-text`; `text-em-invert-text` → `text-em-text`
- Submit button: `border-em-invert-text` → `border-em-text`; base `text-em-invert-text` → `text-em-text`
- "sent" status message: `text-em-invert-muted` → `text-em-text-muted`

**Not changed:**
- Submit button's hover-fill text color (`hover:text-em-invert-bg`) stays as-is
  — it's contrast against the hover fill's fixed accent color
  (`hover:bg-em-accent`), not against the section's own backdrop, so it doesn't
  need to track the section's theme.
- "error"/"not-configured" status messages (`text-em-accent`) stay as-is — the
  accent color is theme-invariant by design and already used this way
  elsewhere in the site.
- `focus-visible:border-b-em-accent` / `focus-visible:outline-em-accent` — same
  reasoning, accent is theme-invariant.

## Fix 3 — Email Me / Footer spacing

Falls out of Fix 1 directly: once `ContactFooterBlock` sits inside the new
`<section id="contact" className="... py-[10vh] ...">` (instead of directly
abutting the old `</main>` with zero bottom padding), the gap between the Email
Me button and `Footer`'s `border-t` divider becomes 10vh — identical to the home
page's spacing, since the structure is now the same. This also resolves a
previously-deferred minor finding from the earlier contact-polish-fixes review
(`src/app/contact/page.tsx` missing bottom padding before `Footer`).

## Files touched

- `src/app/contact/page.tsx` — Fix 1 (restructure into two zones)
- `src/components/sections/ContactFormSection.tsx` — Fix 2 (token swap only, no structural/behavioral changes)

No changes to `Footer.tsx`, `ContactFooterBlock.tsx`, `Navbar.tsx`,
`TileShimmerBackground.tsx`, `ContactSection.tsx` (home page, unaffected — kept
as the reference pattern being copied), or `globals.css`.

## Verification plan

- `npx tsc --noEmit` clean.
- Live Playwright check on `http://localhost:3000/contact` in both light and dark
  theme (via the theme toggle):
  - Shimmer visible behind "Let's get in touch" / the form, text legible in both
    themes.
  - Shimmer NOT visible behind "Got a project in mind?" / Email Me / the
    Available-For-Work footer — solid, continuous dark background matching the
    home page's Contact section, in both site themes.
  - Gap between Email Me button and Footer's border-t measured and compared
    against the home page's equivalent gap (should match, ~10vh).
  - Scroll from top to bottom of `/contact`, confirm the navbar's "Menu" text
    color starts adaptive (theme-following) over the form and switches to
    forced-cream only once the always-dark footer zone is reached — matching
    the home page's `#contact` section behavior.
- Confirm no regressions on the home page (`/`) — unaffected by this plan, but
  worth a quick visual spot-check since `ContactSection.tsx`'s pattern is being
  copied, not modified.

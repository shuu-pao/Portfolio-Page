# /contact Shimmer Zoning, Theme-Adaptive Text, Footer Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix `/contact` so the theme-adaptive pixel/grid shimmer shows through "Let's get in touch" (with theme-correct text), while "Got a project in mind?" / Email Me / the Available-For-Work footer stay a solid always-dark block (matching the home page's Contact section exactly), with correct spacing between them.

**Architecture:** Two small, independent edits. `src/app/contact/page.tsx` gets restructured from one opaque wrapper into two zones (transparent top / opaque bottom), copying the home page's already-working `ContactSection.tsx` nesting pattern verbatim. `ContactFormSection.tsx` gets a pure CSS-token swap (fixed `em-invert-*` → theme-adaptive `em-text`/`em-bg` family) with zero structural or behavioral changes.

**Tech Stack:** Next.js 16 / React 19 / TypeScript / Tailwind v4 (no new dependencies).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-09-contact-page-shimmer-zoning-design.md` — every task's requirements implicitly include it.
- No unit test framework exists in this repo (`package.json` scripts: `dev`, `build`, `start`, `lint` only). Verification is `npx tsc --noEmit` + live Playwright MCP checks against `http://localhost:3000`, per this repo's established convention.
- Touch ONLY the two files named below. Do not modify `Footer.tsx`, `ContactFooterBlock.tsx`, `Navbar.tsx`, `TileShimmerBackground.tsx`, `ContactSection.tsx` (home page — this is the reference pattern being copied, not changed), or `globals.css`.
- Dev server: assume `npm run dev` is already running on `http://localhost:3000` in the background. If `http://localhost:3000/contact` doesn't respond, start it yourself (backgrounded) and wait a few seconds before navigating.
- Theme toggle for visual checks: `button[aria-label="Toggle dark mode"]` in the fixed header — site defaults to light theme (`Providers.tsx`: `defaultTheme="light"`), click it once to switch to dark, click again to switch back.
- Commit after each task; scoped `git add` naming only the file each task touches (never `git add -A`/`git add .`).

---

### Task 1: Restructure `/contact/page.tsx` into two zones

**Files:**
- Modify: `src/app/contact/page.tsx` (full-file rewrite — it's a 21-line file)

**Interfaces:**
- Consumes: `ContactFormSection` (default export from `@/components/sections/ContactFormSection` — Task 2 changes this component's internal styling only, not its export or props, so this task's import is unaffected regardless of task order), `ContactFooterBlock` (named export, unchanged), `Footer` (named export, unchanged), `Navbar` (named export, unchanged).
- Produces: nothing consumed by Task 2 — the two tasks are independent and can be done in either order.

- [ ] **Step 1: Make the change**

Replace the full contents of `src/app/contact/page.tsx` with:

```tsx
import { Navbar } from "@/components/layout/Navbar";
import { ContactFormSection } from "@/components/sections/ContactFormSection";
import { ContactFooterBlock } from "@/components/sections/ContactFooterBlock";
import { Footer } from "@/components/layout/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="relative w-full px-6 pt-[14vh] md:px-16">
        <ContactFormSection />
      </main>
      {/* id="contact" lets useActiveSection (Navbar's dark/light text switch)
          recognize only this always-dark zone as the "contact" section —
          same placement as the home page's ContactSection.tsx, so the
          navbar's forced cream text only kicks in once this zone is
          reached, not over the theme-adaptive form section above. */}
      <div className="relative w-full bg-em-invert-bg">
        <section id="contact" className="relative px-6 py-[10vh] md:px-16">
          <ContactFooterBlock />
        </section>
        <Footer />
      </div>
    </>
  );
}
```

Note what changed from the original: `<main>` lost `id="contact"`, `bg-em-invert-bg`, and
`min-h-screen` (the latter no longer needs to force full viewport height now that
it wraps only the form, not the whole page) — it now wraps only
`<ContactFormSection />`. `<ContactFooterBlock />` moved out of `<main>` into a
new `<section id="contact">` inside a `bg-em-invert-bg` wrapper div, and
`<Footer />` moved from an unstyled sibling of the old `<main>` to a sibling of
that new `<section>`, inside the same `bg-em-invert-bg` div (so its background is
continuous with `ContactFooterBlock`'s, with no gap/seam between them).

- [ ] **Step 2: Verify type safety**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify visually on the live dev build**

Using the Playwright MCP tools, at 1440×900, navigate to `http://localhost:3000/contact`:

1. Screenshot the full page (top to bottom). Confirm: "Let's get in touch" and the
   form show the pixel/grid shimmer texture behind them (not a flat dark fill);
   "Got a project in mind?" / Email Me / the footer's "Unavailable For Work" row
   show a solid, flat dark background with no shimmer texture.
2. Measure the gap between the Email Me button's bottom edge and Footer's
   `border-t` line via `browser_evaluate` (`getBoundingClientRect()` on both),
   and confirm it's non-zero and visually matches the home page's `#contact`
   section gap (roughly 10% of viewport height at this size).
3. Scroll slowly from the top of the page to the bottom while watching the fixed
   header's "Menu" text color: confirm it starts in the normal theme-adaptive
   color (matches whatever the Hero section's nav text color is) while the form
   is in view, and switches to cream once scrolled into the dark footer zone.
4. Click `button[aria-label="Toggle dark mode"]`, confirm nothing else changed
   in the layout (dark theme was already the site's own dark-on-cream-token look
   for the form zone; the always-dark footer zone should look visually identical
   in both site themes since it uses fixed tokens).
5. Navigate to `http://localhost:3000/` (home page), scroll to its `#contact`
   section, screenshot, and confirm it's unaffected (still fully solid dark, no
   shimmer, same as before this change — this section's file wasn't touched, but
   confirm no accidental regression from shared component changes).

- [ ] **Step 4: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "fix: restructure /contact into a theme-adaptive form zone and an always-dark footer zone"
```

---

### Task 2: Swap `ContactFormSection.tsx` to theme-adaptive tokens

**Files:**
- Modify: `src/components/sections/ContactFormSection.tsx`

**Interfaces:**
- Consumes: nothing new — no new imports, no prop changes.
- Produces: nothing new — the component's default export, props (none), and all behavior (EmailJS submit handling, status states) are unchanged. Only Tailwind class names change.

- [ ] **Step 1: Make the change**

In `src/components/sections/ContactFormSection.tsx`, apply these exact string
replacements (every occurrence — there are multiple call sites per token, listed
individually below so none are missed):

1. `HEADING_CLASS` constant:

```tsx
const HEADING_CLASS =
  "text-center text-[18vw] uppercase leading-none text-em-invert-text sm:text-[11vw]";
```
→
```tsx
const HEADING_CLASS =
  "text-center text-[18vw] uppercase leading-none text-em-text sm:text-[11vw]";
```

2. The paragraph (`motion.p`) className — `text-em-invert-muted` → `text-em-text-muted`:

```tsx
          className="w-[70%] text-[13.5px] text-em-invert-muted sm:w-[60%] sm:text-[15px] md:w-[55%] 2xl:text-[24px]"
```
→
```tsx
          className="w-[70%] text-[13.5px] text-em-text-muted sm:w-[60%] sm:text-[15px] md:w-[55%] 2xl:text-[24px]"
```

3. Three field labels — `text-em-invert-text` → `text-em-text` (identical className string, appears 3 times: `htmlFor="name"`, `htmlFor="email"`, `htmlFor="message"`):

```tsx
            <label htmlFor="name" className="text-[14px] text-em-invert-text">
```
→
```tsx
            <label htmlFor="name" className="text-[14px] text-em-text">
```

(repeat identically for the `htmlFor="email"` and `htmlFor="message"` labels — same
`text-[14px] text-em-invert-text` → `text-[14px] text-em-text` swap, all three
currently share this exact className string)

4. Two inputs and the textarea — `border-b-em-invert-text` → `border-b-em-text`,
   `text-em-invert-text` → `text-em-text` (identical className string across
   `#name`, `#email`, and the `#message` textarea):

```tsx
              className="border-b-[1.5px] border-b-em-invert-text bg-transparent px-2 py-2 text-em-invert-text outline-none focus-visible:border-b-em-accent"
```
→
```tsx
              className="border-b-[1.5px] border-b-em-text bg-transparent px-2 py-2 text-em-text outline-none focus-visible:border-b-em-accent"
```

(this exact string appears 3 times — the `#name` input, the `#email` input, and
the `#message` textarea — replace all 3 identically)

5. Submit button — `border-em-invert-text` → `border-em-text`, base
   `text-em-invert-text` → `text-em-text`. **Do not touch**
   `hover:text-em-invert-bg` — it stays exactly as-is (contrast against the fixed
   accent hover-fill, not the section backdrop):

```tsx
            className="w-full rounded-full border border-em-invert-text py-2 text-[16px] text-em-invert-text duration-300 hover:bg-em-accent hover:text-em-invert-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-em-accent focus-visible:outline-offset-2 disabled:opacity-50 sm:w-[45%] 2xl:text-[26px]"
```
→
```tsx
            className="w-full rounded-full border border-em-text py-2 text-[16px] text-em-text duration-300 hover:bg-em-accent hover:text-em-invert-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-em-accent focus-visible:outline-offset-2 disabled:opacity-50 sm:w-[45%] 2xl:text-[26px]"
```

6. "sent" status message — `text-em-invert-muted` → `text-em-text-muted`:

```tsx
              <p className="mt-3 text-[13px] text-em-invert-muted">Message sent — thank you!</p>
```
→
```tsx
              <p className="mt-3 text-[13px] text-em-text-muted">Message sent — thank you!</p>
```

**Leave unchanged:** the "error" and "not-configured" status messages
(`text-em-accent` — theme-invariant accent color, correct as-is), all
`focus-visible:*-em-accent` classes, and every non-color class (layout, sizing,
spacing) anywhere in the file. The EmailJS submit logic (`handleSubmit`) is not
touched at all.

- [ ] **Step 2: Verify type safety**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify visually on the live dev build**

Using the Playwright MCP tools, at 1440×900, navigate to `http://localhost:3000/contact`:

1. In light theme (default), screenshot the form section. Confirm all text
   (heading, paragraph, labels, input values/placeholders, Submit button) reads
   as dark-on-light against the light-toned shimmer, not a light color that
   would wash out.
2. Click `button[aria-label="Toggle dark mode"]`, wait for the transition,
   screenshot again. Confirm all the same text now reads as light-on-dark
   against the dark-toned shimmer.
3. Type into the Name/Email/Message fields and confirm typed text and the
   underline color are visible and legible in both themes.
4. Confirm the Submit button's hover state (`browser_hover`) still fills with
   the rust accent color and shows near-black text in both site themes (this
   part intentionally does NOT change with theme).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ContactFormSection.tsx
git commit -m "fix: swap ContactFormSection to theme-adaptive text/border tokens"
```

---

## Final Verification (after both tasks)

- [ ] Run `npx tsc --noEmit` once more against the full branch — no errors.
- [ ] Run `npm run build` — confirms production build succeeds with both changes together.
- [ ] Full-page Playwright screenshots of `http://localhost:3000/contact` in both
      light and dark theme, and a spot-check of `http://localhost:3000/` (home),
      reviewed against the spec's three fixes.

# Contact Section Polish Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix five measured gaps between the shipped `/contact` page and the jasminemaduafokwa.com reference — a heading descender-clipping bug, the footer text/button's size/position/animation, the Email Me button's hover animation, and a net-new "not available for work" status indicator.

**Architecture:** Five small, independent CSS/JSX edits across three existing files — no new components, no new dependencies. `RevealHeadingLine` (shared) gets one inline-style fix; `ContactFooterBlock` gets a layout fix, its static heading swapped for two `RevealHeadingLine` calls, and its Email Me button's `className` extended; `Footer` gets one conditional status-dot span.

**Tech Stack:** Next.js 16 / React 19 / TypeScript / Tailwind v4 / framer-motion (already in use, no additions).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-09-contact-polish-fixes-design.md` — every task's requirements implicitly include it.
- No unit test framework exists in this repo (`package.json` scripts: `dev`, `build`, `start`, `lint` only — no `test`). Per this repo's established convention (all prior SDD phases in `REDESIGN-ROADMAP.md`), verification is `npx tsc --noEmit` (type safety) + live Playwright MCP screenshot/DOM checks against `http://localhost:3000` (visual correctness) — **not** unit tests. Each task's "test" steps below follow that pattern.
- Touch ONLY the three files named below. Do not modify neighboring pages or components (CLAUDE.md Strict Scope Boundaries).
- `RevealHeadingLine`'s `className` prop is required (not optional) — every call site must pass one.
- Dev server: assume `npm run dev` is already running on `http://localhost:3000` (background process from the design phase). If not running, start it with `npm run dev` in the background before the Playwright steps.
- Commit after each task; use small, scoped `git add` (never `git add -A`/`git add .`) naming only the files each task touches.

---

### Task 1: Fix descender clipping in `RevealHeadingLine`

**Files:**
- Modify: `src/components/reactbits/RevealHeadingLine.tsx:39-46`

**Interfaces:**
- Consumes: nothing new — no prop/signature changes.
- Produces: nothing new — visual-only fix, `RevealHeadingLineProps` unchanged. Tasks 2 relies on this component's existing `children`/`delay`/`className` props (unchanged).

- [ ] **Step 1: Make the change**

In `src/components/reactbits/RevealHeadingLine.tsx`, add an inline `style` to the `<motion.h2>` (do not touch the wrapper `<div>` — its font-size is inherited/small, so an em-based padding there would be tiny and wrong; it must be em-relative to the h2's own large font-size):

```tsx
      <motion.h2
        initial={{ y: "100%" }}
        animate={isInView ? { y: "0%" } : undefined}
        transition={{ duration: 0.8, ease: "easeOut", delay }}
        // leading-none/leading-[1] callers set line-height == font-size, which is
        // shorter than most fonts' natural descent — the overflow-hidden mask
        // above then clips descenders (e.g. "g", "j"). This buffer is em-relative
        // to each caller's own font-size, so it self-scales at every heading size.
        style={{ paddingBottom: "0.15em" }}
        className={className}
      >
        {children}
      </motion.h2>
```

- [ ] **Step 2: Verify type safety**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify visually on the live dev build**

Using the Playwright MCP tools: navigate to `http://localhost:3000/contact`, resize to 1440×900, wait ~2s for the reveal animation to finish, then take a screenshot. Confirm the "g" in "get" now shows its full descender loop (not flattened at the bottom), by visual comparison against the previous clipped screenshot.

Also spot-check one other `RevealHeadingLine` caller didn't regress: navigate to `http://localhost:3000/#work`, screenshot the "Selected Projects" heading, confirm it still reads correctly (no visible new gap or clipping).

- [ ] **Step 4: Commit**

```bash
git add src/components/reactbits/RevealHeadingLine.tsx
git commit -m "fix: add descender-safe padding to RevealHeadingLine's mask-reveal heading"
```

---

### Task 2: Fix ContactFooterBlock text column, heading reveal, and Email Me button

**Files:**
- Modify: `src/components/sections/ContactFooterBlock.tsx`

**Interfaces:**
- Consumes: `RevealHeadingLine` from `@/components/reactbits/RevealHeadingLine` — `{ children: ReactNode; delay?: number; className: string }` (Task 1's fix applies automatically, no import of the fix itself needed). `GradientButton` from `@/components/ui/GradientButton` — existing `{ href, variant, size, className, children }` props, unchanged.
- Produces: nothing new consumed by later tasks — Task 3 is an independent file.

- [ ] **Step 1: Make the change**

In `src/components/sections/ContactFooterBlock.tsx`, add this import near the top with the other imports (after the `Sparkle` import):

```tsx
import { RevealHeadingLine } from "@/components/reactbits/RevealHeadingLine";
```

Then replace:

```tsx
        <div>
          <h3 className="text-[8vw] leading-none text-em-invert-text md:text-[4vw]">
            Got a project in mind? I&apos;d love to hear about it.
          </h3>
          <div className="mt-2">
            <GradientButton href={EMAIL_HREF} variant="outline" size="lg" className="rounded-full">
              Email Me
            </GradientButton>
          </div>
        </div>
```

with:

```tsx
        <div className="flex-1">
          <RevealHeadingLine className="text-[8vw] leading-none text-em-invert-text md:text-[4vw]">
            Got a project in mind?
          </RevealHeadingLine>
          <RevealHeadingLine
            delay={0.1}
            className="text-[8vw] leading-none text-em-invert-text md:text-[4vw]"
          >
            I&apos;d love to hear about it.
          </RevealHeadingLine>
          <div className="mt-2">
            <GradientButton
              href={EMAIL_HREF}
              variant="outline"
              size="lg"
              className="w-full rounded-full duration-500 hover:bg-em-accent hover:text-em-invert-bg sm:w-[45%] lg:w-[12em] h-[2.5em]"
            >
              Email Me
            </GradientButton>
          </div>
        </div>
```

(The `<ul className="flex flex-1 ...">` sibling above this block already has `flex-1` — unchanged.)

- [ ] **Step 2: Verify type safety**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify visually on the live dev build**

Using the Playwright MCP tools, at 1440×900:
1. Navigate to `http://localhost:3000/#contact`, scroll the contact footer block into view, wait ~1.5s for the reveal animations, screenshot. Confirm: the "Got a project in mind? / I'd love to hear about it." text is confined to the right half of the row (not spanning full width), and the Email Me button is a compact ~192×40px pill (not a large padded button).
2. Navigate to `http://localhost:3000/contact`, same check (this block is shared, must match on both pages).
3. Hover the Email Me button (`browser_hover` with a `a:has-text("Email Me")`-style selector) and screenshot again — confirm the button's background fills solid with the rust accent color and its text becomes the dark invert-bg color (crossfade, no layout shift).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ContactFooterBlock.tsx
git commit -m "fix: confine contact CTA text to its column, animate it per-line, resize/re-hover Email Me button"
```

---

### Task 3: Add red "unavailable" status dot to Footer

**Files:**
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing consumed elsewhere — `Footer` remains a zero-prop component.

- [ ] **Step 1: Make the change**

In `src/components/layout/Footer.tsx`, replace the `creditFields.map` block:

```tsx
          {creditFields.map((field) => (
            <div key={field.label}>
              <p className="text-em-invert-muted/60">{field.label}</p>
              <p className="mt-1 text-em-invert-text">{field.value}</p>
            </div>
          ))}
```

with:

```tsx
          {creditFields.map((field) => (
            <div key={field.label}>
              <p className="flex items-center gap-2 text-em-invert-muted/60">
                {field.label === "Available For Work" && (
                  <span
                    aria-hidden="true"
                    className="inline-block size-2 shrink-0 animate-pulse rounded-full bg-red-500 shadow-[0_0_6px_2px_rgba(239,68,68,0.6)]"
                  />
                )}
                {field.label}
              </p>
              <p className="mt-1 text-em-invert-text">{field.value}</p>
            </div>
          ))}
```

- [ ] **Step 2: Verify type safety**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify visually on the live dev build**

Using the Playwright MCP tools, at 1440×900:
1. Navigate to `http://localhost:3000/#contact`, scroll the footer into view, screenshot. Confirm a small pulsing red dot with a soft glow appears to the left of "Available For Work" only — not to the left of "Design & Development" or "Based In".
2. Navigate to `http://localhost:3000/contact`, same check (this `Footer` render is shared between both pages).

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: add red glowing status dot to Footer's Available For Work field"
```

---

## Final Verification (after all tasks)

- [ ] Run `npx tsc --noEmit` once more against the full branch — no errors.
- [ ] Run `npm run build` — confirms production build (Turbopack) succeeds with all three changes together.
- [ ] Full-page Playwright screenshots of both `http://localhost:3000/#contact` and `http://localhost:3000/contact` at 1440×900, reviewed against the spec's five fixes.

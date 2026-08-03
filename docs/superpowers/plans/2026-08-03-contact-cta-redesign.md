# Phase 7 — "Let's Talk" CTA + Contact Section + `/contact` Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `ContactSection.tsx` as a 1:1 match of jasminemaduafokwa.com's bottom footer block ("LET'S TALK" marquee → spinning sunburst → social-link list + question/CTA), remove the now-duplicate social icon row from `Footer.tsx`, and add a `/contact` route that redirects to the in-page anchor.

**Architecture:** Extend the existing `Marquee` component with an optional `separator` prop (used for the down-chevron instead of its default `X`), reuse `GradientButton` for the `mailto:` CTA, and compose everything inside `ContactSection.tsx`. No new dependencies, no new design tokens, no test framework introduced — this codebase has none (no `jest`/`vitest` in `package.json`, no `*.test.*` files outside `node_modules`), so verification follows the convention already used by every prior redesign phase (see `d913b64`, `fa97161`, `5942e16`): `npx tsc --noEmit` for compile correctness + Playwright live-DOM comparison against the reference site for visual fidelity.

**Tech Stack:** Next.js App Router, TypeScript strict, Tailwind CSS v4, Framer Motion (`motion/react`), `lucide-react`.

## Global Constraints

- No new npm dependencies — `framer-motion`, `lucide-react`, and existing `Marquee`/`GradientButton` components cover everything (spec Decisions 5, 6).
- No new design tokens — reuse `em-invert-bg`, `em-invert-text`, `em-invert-muted`, `em-accent`, `em-accent-text` (spec Decision 8).
- No contact form — `mailto:paolo.enrera@gmail.com` only, via `GradientButton`'s existing `href` mode (spec Decision 2).
- Social link order and content: Email, GitHub, LinkedIn, Instagram — Behance is explicitly dropped (spec, Live-DOM measurements; roadmap-confirmed content list).
- `Footer.tsx`'s `creditFields` credit bar is unchanged — only its `socialLinks` icon row is removed (spec Decision 4).
- Copy is placeholder, revised later — do not treat wording as final (spec Decision 7).
- Commit only as each task's own step below — do not batch commits across tasks, do not push, do not touch the roadmap file until Task 5.

---

### Task 1: Extend `Marquee` with an optional separator

**Files:**
- Modify: `src/components/ui/Marquee.tsx`

**Interfaces:**
- Consumes: nothing new — existing `MarqueeProps { items: string[]; className?: string; baseVelocity?: number }`.
- Produces: `MarqueeProps` gains `separator?: ReactNode` (default: the existing `<X size={12} aria-hidden="true" style={{ animation: running ? "marquee-x-spin 4s linear infinite" : "none" }} />` element). Later tasks (Task 2) pass `separator={<ChevronDown size={32} aria-hidden="true" />}`.

- [ ] **Step 1: Add the `separator` prop and use it in `renderItems`**

In `src/components/ui/Marquee.tsx`, update the props interface and destructuring:

```tsx
interface MarqueeProps {
  items: string[];
  className?: string;
  /** Idle crawl speed in pixels/second. */
  baseVelocity?: number;
  /** Element rendered between repeated items. Defaults to the spinning X. */
  separator?: React.ReactNode;
}
```

```tsx
export function Marquee({ items, className, baseVelocity = 40, separator }: MarqueeProps) {
```

Replace the hardcoded `<X .../>` inside `renderItems` with the prop, falling back to today's exact element:

```tsx
  const renderItems = (copy: number) =>
    items.map((item, i) => (
      <span
        key={`${copy}-${i}`}
        className="inline-flex items-center gap-3 whitespace-nowrap px-3 font-sans text-sm text-em-text"
      >
        {item}
        {separator ?? (
          <X
            size={12}
            aria-hidden="true"
            style={{ animation: running ? "marquee-x-spin 4s linear infinite" : "none" }}
          />
        )}
      </span>
    ));
```

No other lines in the file change.

- [ ] **Step 2: Verify the existing usage still compiles unchanged**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors. Since `separator` is optional, the Hero's existing `<Marquee items={...} className={...} />` call (no `separator` passed) still type-checks and renders identically (falls back to the default `X`).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Marquee.tsx
git commit -m "feat: add optional separator prop to Marquee"
```

---

### Task 2: Rewrite `ContactSection.tsx`

**Files:**
- Modify: `src/components/sections/ContactSection.tsx` (currently a bare shell: `<div className="relative w-full bg-em-invert-bg"><section id="contact" className="relative px-6 py-32 md:px-16" /><Footer /></div>`)

**Interfaces:**
- Consumes: `Marquee` from `@/components/ui/Marquee` (with `separator` prop from Task 1), `GradientButton` from `@/components/ui/GradientButton` (`href` mode, `variant="outline"`, `size="lg"`), `Footer` from `@/components/layout/Footer` (unchanged import), `ChevronDown` and `Sparkle` from `lucide-react`, `motion`/`useInView` from `framer-motion` (matching `ProcessTimelineSection.tsx`'s existing fade-in convention).
- Produces: default-exported `ContactSection` component, unchanged call site (`src/app/page.tsx` already imports and renders `<ContactSection />` — no changes needed there).

- [ ] **Step 1: Write the full section**

Replace the entire contents of `src/components/sections/ContactSection.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown, Sparkle } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { GradientButton } from "@/components/ui/GradientButton";
import { Footer } from "@/components/layout/Footer";

interface SocialLink {
  label: string;
  href: string;
}

const socialLinks: SocialLink[] = [
  { label: "Email", href: "mailto:paolo.enrera@gmail.com" },
  { label: "GitHub", href: "https://github.com/shuu-pao" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/paolo-jansen-enrera/" },
  { label: "Instagram", href: "https://www.instagram.com/shuu_paoo/" },
];

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div className="relative w-full bg-em-invert-bg">
      <section id="contact" ref={ref} className="relative px-6 py-[10vh] md:px-16">
        <div className="w-[120%] overflow-hidden">
          <Marquee
            items={["LET'S TALK"]}
            separator={<ChevronDown size={32} aria-hidden="true" className="text-em-invert-text" />}
            baseVelocity={40}
            className="text-[12vw] uppercase leading-none tracking-tighter text-em-invert-text"
          />
        </div>

        <div className="mb-[4vh] flex justify-center md:mb-[8vh]">
          <Sparkle
            aria-hidden="true"
            className="w-[16vw] animate-spin text-em-accent [animation-duration:20s] sm:w-[12vw] lg:w-[8vw]"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col-reverse gap-y-6 md:flex-row md:justify-between"
        >
          <ul className="flex flex-1 flex-row justify-between md:flex-col md:justify-normal md:gap-y-1">
            {socialLinks.map(({ label, href }) => (
              <li
                key={label}
                className="relative w-fit text-[14px] capitalize text-em-invert-text after:absolute after:top-full after:left-0 after:h-[2px] after:w-0 after:bg-em-accent after:duration-300 after:ease-in-out hover:after:w-full md:text-[18px]"
              >
                <a href={href} target={label === "Email" ? undefined : "_blank"} rel={label === "Email" ? undefined : "noopener noreferrer"}>
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div>
            <h3 className="text-[8vw] leading-none text-em-invert-text md:text-[4vw]">
              Got a project in mind? I&apos;d love to hear about it.
            </h3>
            <div className="mt-2">
              <GradientButton href="mailto:paolo.enrera@gmail.com" variant="outline" size="lg">
                Email Me
              </GradientButton>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Compile check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors — no broken imports, no missing props on `Marquee`/`GradientButton`.

- [ ] **Step 3: Visual smoke check in the dev server**

Run: `npm run dev`, open `http://localhost:3000/#contact`.
Expected: marquee crawls with a chevron separator, sunburst spins centered above the row, social list shows Email/GitHub/LinkedIn/Instagram with an underline that grows on hover, question + "Email Me" button render to the right of the list on desktop width and above it (stacked) on a narrow window.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ContactSection.tsx
git commit -m "feat: rebuild Contact section as jasminemaduafokwa.com's Let's Talk block"
```

---

### Task 3: Remove the duplicate social icon row from `Footer`

**Files:**
- Modify: `src/components/layout/Footer.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `Footer` component with `creditFields` credit bar only — no `socialLinks` export or usage remains anywhere in the file.

- [ ] **Step 1: Delete the `socialLinks` array and its rendering block**

In `src/components/layout/Footer.tsx`, remove the `Code2, Link2, Mail` import (no longer used), the `socialLinks` array (lines 3–7 of the current file), and the `<div className="flex items-center gap-4 self-end">...</div>` block that renders it (lines 19–32 of the current file). The result:

```tsx
const creditFields = [
  { label: "Design & Development", value: "Paolo Jansen Enrera" },
  { label: "Based In", value: "Cebu City, Philippines" },
  { label: "Available For Work", value: "Salesforce, Agentforce, Full-time" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-em-invert-text/10 px-6 py-12 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="grid gap-6 border-t border-em-invert-text/10 pt-8 font-mono text-xs uppercase tracking-[0.1em] text-em-invert-muted sm:grid-cols-3">
          {creditFields.map((field) => (
            <div key={field.label}>
              <p className="text-em-invert-muted/60">{field.label}</p>
              <p className="mt-1 text-em-invert-text">{field.value}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-em-invert-muted/60">
          © {new Date().getFullYear()} Paolo Jansen Enrera. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Compile check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors, no unused-import warnings for `Code2`/`Link2`/`Mail`.

- [ ] **Step 3: Visual check — no duplicate social links**

In the dev server (`npm run dev`, already running from Task 2 or restarted), scroll to the bottom of the page.
Expected: exactly one set of social links (the new text list in `ContactSection`) — the credit bar below it has no icons.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "fix: remove duplicate social icon row from Footer"
```

---

### Task 4: Add `/contact` redirect page

**Files:**
- Create: `src/app/contact/page.tsx`

**Interfaces:**
- Consumes: `redirect` from `next/navigation`.
- Produces: a route at `/contact` with no exported props, matching this project's other `src/app/**/page.tsx` server-component conventions.

- [ ] **Step 1: Write the redirect page**

```tsx
import { redirect } from "next/navigation";

export default function ContactPage() {
  redirect("/#contact");
}
```

- [ ] **Step 2: Compile check**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 3: Verify the redirect in the dev server**

Run: `npm run dev`, navigate to `http://localhost:3000/contact`.
Expected: browser lands on `http://localhost:3000/#contact`, scrolled to the Contact section.

- [ ] **Step 4: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "feat: add /contact route redirecting to #contact anchor"
```

---

### Task 5: Reference-fidelity verification and roadmap update

**Files:**
- Modify: `docs/superpowers/REDESIGN-ROADMAP.md` (Phase 7 status only)

**Interfaces:**
- Consumes: the running dev server from Tasks 2–4.
- Produces: no code — this task is verification + a roadmap status edit, matching the pattern of prior phase commits (e.g. `5942e16 docs: mark Phase 6 (Process section) done after reference verification`).

- [ ] **Step 1: Compare against the reference at desktop width (1440×900)**

Using the Playwright MCP tools, `browser_navigate` to `https://jasminemaduafokwa.com`, `browser_resize` to 1440×900, scroll to the bottom footer block, and `browser_take_screenshot`. Then `browser_navigate` to the local dev server's `/#contact` at the same size and screenshot it.
Expected match points (from the spec's Live-DOM measurements): marquee text scale/loop direction, sunburst size (`~8vw` at this width) and continuous slow rotation, two-column `justify-between` split (social list left, question/CTA right), social-list underline grows on hover.

- [ ] **Step 2: Compare against the reference at mobile width (390×844)**

Repeat Step 1's screenshot comparison at 390×844 on both sites.
Expected match points: `flex-col-reverse` order (question + CTA block above the social list), marquee/sunburst/list all full-width and stacked, no horizontal overflow.

- [ ] **Step 3: Confirm no regressions elsewhere**

Run: `npx tsc --noEmit -p tsconfig.json` and `npm run lint`.
Expected: both pass clean (no errors introduced by Tasks 1–4).

- [ ] **Step 4: Update the roadmap**

In `docs/superpowers/REDESIGN-ROADMAP.md`, change Phase 7's status line to "Done" (matching the exact phrasing/format used for Phase 6 in the same file).

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/REDESIGN-ROADMAP.md
git commit -m "docs: mark Phase 7 (Contact/Let's Talk section) done after reference verification"
```

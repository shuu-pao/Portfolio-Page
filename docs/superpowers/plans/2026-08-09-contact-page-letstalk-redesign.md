# "LET'S TALK" CTA button + standalone /contact page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the home Contact section's "LET'S TALK" marquee a real hover-animated button linking to a new standalone `/contact` page that replicates jasminemaduafokwa.com/contact 1:1 (heading reveal, form, shared footer block).

**Architecture:** Extract the sunburst/social-list/question-CTA chunk out of `ContactSection.tsx` into a new `ContactFooterBlock.tsx` so both the home Contact section and the new `/contact` page can render it without duplication. Generalize the existing `RevealHeadingLine` reveal component to accept mixed markup (for the italic-lowercase "get"/"in" words) instead of building a second reveal component. Wire the new page's form to EmailJS via env vars the user will fill in later.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind v4, framer-motion, lucide-react, `@emailjs/browser` (new).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-09-contact-page-letstalk-redesign-design.md` (source of truth for all measurements/decisions below).
- 1:1 fidelity requirement applies: text placement, onLoad animation timing, and onHover button treatment must match the reference (see spec's live-DOM measurements).
- Copy on the new `/contact` page is placeholder, in Paolo's voice, per the roadmap's standing placeholder-copy note — do not treat copy polish as blocking.
- The reference's `xs:` Tailwind breakpoint (Name/Email row reflow) has no equivalent in this project's Tailwind v4 config (only default `sm`/`md`/`lg`/`xl`/`2xl` exist, confirmed via `tailwind.config.js` / `globals.css`) — substitute `sm:` (640px). Do not add a new custom breakpoint for this one row.
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` are left **unset** — the form must fail gracefully (a visible status message, not a crash or a silent no-op) until the user creates an EmailJS account/template and sets them.
- Navbar's `Contact` link and the home page's `#contact` anchor are unchanged — only the marquee's own click target and the `/contact` page content change.
- Do not touch `Navbar.tsx`, `GridDistortion.tsx`, `SlideRevealText.tsx`, `HeroSection.tsx`, `MissionStatementSection.tsx`, `PortfolioGallerySection.tsx` (beyond the one `RevealHeadingLine` call-site update in Task 2), `SkillsStackSection.tsx` (same), or `src/components/ui/Marquee.tsx` — none of them need behavior changes for this feature.
- No test runner exists in this repo (`package.json` has no `test` script). Each task's verification step is `npx tsc --noEmit` (type-check) plus a manual check described in the step — matching this project's existing all-manual-QA convention (see CLAUDE.md's "Pre-Delivery Verification" rule).

---

## File Structure

- **Modify** `src/components/reactbits/RevealHeadingLine.tsx` — `text: string` prop → `children: ReactNode`.
- **Modify** `src/components/sections/PortfolioGallerySection.tsx` — update its 2 `RevealHeadingLine` call sites to the new prop shape.
- **Modify** `src/components/sections/SkillsStackSection.tsx` — update its 1 `RevealHeadingLine` call site.
- **Create** `src/components/sections/ContactFooterBlock.tsx` — sunburst + social list + question/CTA, extracted out of `ContactSection.tsx` verbatim (no visual change).
- **Modify** `src/components/sections/ContactSection.tsx` — render `<ContactFooterBlock />` instead of the inline markup; wrap the marquee in a `next/link` pill button with the hover-invert treatment; swap `ChevronDown` → `ChevronsDown`.
- **Create** `src/components/sections/ContactFormSection.tsx` — the `/contact` page's heading, paragraph, and EmailJS-wired form.
- **Modify** `src/app/contact/page.tsx` — replace the `redirect()` with a real page composing `Navbar` + `ContactFormSection` + `ContactFooterBlock` + `Footer`.
- **Modify** `.gitignore` — un-ignore `.env.local.example` (currently caught by the blanket `.env*` rule).
- **Create** `.env.local.example` — documents the 3 `NEXT_PUBLIC_EMAILJS_*` keys.
- **Modify** `package.json` / `package-lock.json` — add `@emailjs/browser` (via `npm install`).

---

### Task 1: Add `@emailjs/browser` and env var scaffolding

**Files:**
- Modify: `package.json` (via `npm install`, not a manual edit)
- Modify: `.gitignore`
- Create: `.env.local.example`

**Interfaces:**
- Produces: the `@emailjs/browser` package (default export `emailjs`, method `emailjs.sendForm(serviceId: string, templateId: string, form: HTMLFormElement, options: { publicKey: string }): Promise<EmailJSResponseStatus>`) and 3 env var names (`NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`, `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`) that Task 5 reads via `process.env`.

- [ ] **Step 1: Install the dependency**

Run: `npm install @emailjs/browser`
Expected: `package.json` gains `"@emailjs/browser": "^4.x.x"` under `dependencies`, `package-lock.json` updates, install exits 0.

- [ ] **Step 2: Un-ignore the example env file**

`.gitignore` currently has (around line 33-34):
```
# env files (can opt-in for committing if needed)
.env*
```
Add a negation line immediately after it:
```
# env files (can opt-in for committing if needed)
.env*
!.env.local.example
```

- [ ] **Step 3: Create the example env file**

Create `.env.local.example`:
```
# EmailJS (contact form on /contact) — create a free account at emailjs.com,
# add an email service + template, then copy these 3 values into .env.local
# (never commit .env.local itself). Template variables expected:
# user_name, user_email, user_message (see ContactFormSection.tsx's form field names).
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

- [ ] **Step 4: Verify `.env.local.example` is trackable**

Run: `git check-ignore -v .env.local.example`
Expected: no output and a non-zero exit code (meaning the file is NOT ignored). If it prints a match, the `.gitignore` negation ordering is wrong — negation lines must come after the pattern they override.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .gitignore .env.local.example
git commit -m "chore: add @emailjs/browser and contact-form env var scaffolding"
```

---

### Task 2: Generalize `RevealHeadingLine` to accept mixed markup

**Files:**
- Modify: `src/components/reactbits/RevealHeadingLine.tsx`
- Modify: `src/components/sections/PortfolioGallerySection.tsx:165-174`
- Modify: `src/components/sections/SkillsStackSection.tsx:102-105`

**Interfaces:**
- Produces: `RevealHeadingLine({ children: ReactNode, delay?: number, wrapperClassName?: string, className: string })` — replaces the old `text: string` prop. Task 5 (`ContactFormSection.tsx`) consumes this new shape to pass an inline `<span className="italic lowercase">` inside the revealed line.

- [ ] **Step 1: Update the component**

Replace the full contents of `src/components/reactbits/RevealHeadingLine.tsx`:

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";

/**
 * RevealHeadingLine - mask-reveal for a big display heading word/line:
 * slides up from translateY(100%) to its resting position inside an
 * overflow-hidden wrapper. Matches jasminemaduafokwa.com's "Selected
 * Projects" heading entrance (live-DOM measured).
 *
 * The IntersectionObserver ref must live on the stationary wrapper, not the
 * moving heading itself — pre-animation the heading sits translateY(100%)
 * below its own clip box, so a whileInView tied directly to it never
 * registers as visible.
 */
export interface RevealHeadingLineProps {
  /** Content to reveal — plain text or mixed markup (e.g. an italic inline span) */
  children: ReactNode;
  /** Stagger delay (seconds) before this line's reveal starts */
  delay?: number;
  /** className for the overflow-hidden wrapper div (e.g. to center a line) */
  wrapperClassName?: string;
  /** className for the heading itself — sizing/color/tracking, caller-owned */
  className: string;
}

export function RevealHeadingLine({
  children,
  delay = 0,
  wrapperClassName = "overflow-hidden",
  className,
}: RevealHeadingLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className={wrapperClassName}>
      <motion.h2
        initial={{ y: "100%" }}
        animate={isInView ? { y: "0%" } : undefined}
        transition={{ duration: 0.8, ease: "easeOut", delay }}
        className={className}
      >
        {children}
      </motion.h2>
    </div>
  );
}

export default RevealHeadingLine;
```

- [ ] **Step 2: Update `PortfolioGallerySection.tsx`'s call sites**

Find (around line 165-174):
```tsx
          <RevealHeadingLine
            text="Selected"
            className="font-heading text-[17.95cqw] uppercase leading-[1] mb-[-.1em] tracking-tighter text-em-text/90"
          />
          <RevealHeadingLine
            text="Projects"
            delay={0.1}
            wrapperClassName="flex justify-center overflow-hidden"
            className="font-heading text-[17.95cqw] uppercase leading-[1] mb-[-.1em] tracking-tighter text-em-text/90"
          />
```
Replace with:
```tsx
          <RevealHeadingLine className="font-heading text-[17.95cqw] uppercase leading-[1] mb-[-.1em] tracking-tighter text-em-text/90">
            Selected
          </RevealHeadingLine>
          <RevealHeadingLine
            delay={0.1}
            wrapperClassName="flex justify-center overflow-hidden"
            className="font-heading text-[17.95cqw] uppercase leading-[1] mb-[-.1em] tracking-tighter text-em-text/90"
          >
            Projects
          </RevealHeadingLine>
```

- [ ] **Step 3: Update `SkillsStackSection.tsx`'s call site**

Find (around line 102-105):
```tsx
        <RevealHeadingLine
          text="Skills"
          className="font-heading text-[26.2cqw] uppercase leading-[1] tracking-tighter text-em-text/90"
        />
```
Replace with:
```tsx
        <RevealHeadingLine className="font-heading text-[26.2cqw] uppercase leading-[1] tracking-tighter text-em-text/90">
          Skills
        </RevealHeadingLine>
```

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors (specifically, no "Property 'text' does not exist" / "Property 'children' is missing" errors from these 3 files).

- [ ] **Step 5: Manual check**

Run: `npm run dev`, open `/` (localhost), scroll to "Selected Projects" and "Skills" headings.
Expected: both still slide up into place exactly as before (this task is a pure refactor, zero visual change).

- [ ] **Step 6: Commit**

```bash
git add src/components/reactbits/RevealHeadingLine.tsx src/components/sections/PortfolioGallerySection.tsx src/components/sections/SkillsStackSection.tsx
git commit -m "refactor: generalize RevealHeadingLine to accept children instead of text"
```

---

### Task 3: Extract `ContactFooterBlock` out of `ContactSection`

**Files:**
- Create: `src/components/sections/ContactFooterBlock.tsx`
- Modify: `src/components/sections/ContactSection.tsx`

**Interfaces:**
- Produces: `ContactFooterBlock()` — a component with no props, rendering the sunburst + social list + question/CTA. Consumed by `ContactSection.tsx` (this task) and `src/app/contact/page.tsx` (Task 6).
- Consumes: `GradientButton` from `@/components/ui/GradientButton` (existing, unchanged).

- [ ] **Step 1: Create `ContactFooterBlock.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkle } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";

interface SocialLink {
  label: string;
  href: string;
}

const EMAIL_HREF = "mailto:paolo.enrera@gmail.com";

const socialLinks: SocialLink[] = [
  { label: "Email", href: EMAIL_HREF },
  { label: "GitHub", href: "https://github.com/shuu-pao" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/paolo-jansen-enrera/" },
  { label: "Instagram", href: "https://www.instagram.com/shuu_paoo/" },
];

/**
 * ContactFooterBlock - sunburst + social links + question/CTA row shared
 * between the home Contact section and the standalone /contact page.
 * Matches jasminemaduafokwa.com, where this block renders after <main> on
 * every page (only the "LET'S TALK" marquee above it is home-only).
 */
export function ContactFooterBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <>
      <div className="mb-[4vh] flex justify-center md:mb-[8vh]">
        <Sparkle
          aria-hidden="true"
          className="w-[16vw] animate-spin text-em-accent [animation-duration:20s] sm:w-[12vw] lg:w-[8vw]"
        />
      </div>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="flex flex-col-reverse gap-y-6 md:flex-row md:justify-between"
      >
        <ul className="flex flex-1 flex-row justify-between md:flex-col md:justify-normal md:gap-y-1">
          {socialLinks.map(({ label, href }) => {
            const external = !href.startsWith("mailto:");
            return (
              <li
                key={label}
                className="relative w-fit text-[14px] capitalize text-em-invert-text after:absolute after:top-full after:left-0 after:h-[2px] after:w-0 after:bg-em-accent after:duration-300 after:ease-in-out hover:after:w-full md:text-[18px]"
              >
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

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
      </motion.div>
    </>
  );
}

export default ContactFooterBlock;
```

- [ ] **Step 2: Slim down `ContactSection.tsx` to use it**

Replace the full contents of `src/components/sections/ContactSection.tsx`:

```tsx
"use client";

import { ChevronDown } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { ContactFooterBlock } from "@/components/sections/ContactFooterBlock";
import { Footer } from "@/components/layout/Footer";

export default function ContactSection() {
  return (
    <div className="relative w-full bg-em-invert-bg">
      <section id="contact" className="relative overflow-hidden px-6 py-[10vh] md:px-16">
        <div className="w-[120%] overflow-hidden">
          <Marquee
            items={["LET'S TALK"]}
            separator={
              <ChevronDown aria-hidden="true" className="mx-[2.5vw] size-[4vw] text-em-invert-text" />
            }
            baseVelocity={40}
            className="font-heading text-[12vw] uppercase leading-none tracking-tighter text-em-invert-text"
          />
        </div>

        <ContactFooterBlock />
      </section>

      <Footer />
    </div>
  );
}
```

(This step deliberately keeps the marquee non-interactive for now — Task 4 turns it into the pill button. Keeping this task to "extract, don't change behavior" makes it independently reviewable.)

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Manual check**

Run: `npm run dev`, open `/`, scroll to the Contact section.
Expected: pixel-identical to before this task — marquee, sunburst, social list, question/CTA all render exactly as they did prior to the extraction.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ContactFooterBlock.tsx src/components/sections/ContactSection.tsx
git commit -m "refactor: extract ContactFooterBlock out of ContactSection for reuse on /contact"
```

---

### Task 4: Turn the "LET'S TALK" marquee into a hover-animated button linking to `/contact`

**Files:**
- Modify: `src/components/sections/ContactSection.tsx`

**Interfaces:**
- Consumes: `next/link`'s `Link` component (Next.js built-in, first use in this codebase).

- [ ] **Step 1: Wrap the marquee in a `Link` pill button**

In `src/components/sections/ContactSection.tsx`, replace:
```tsx
"use client";

import { ChevronDown } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { ContactFooterBlock } from "@/components/sections/ContactFooterBlock";
import { Footer } from "@/components/layout/Footer";

export default function ContactSection() {
  return (
    <div className="relative w-full bg-em-invert-bg">
      <section id="contact" className="relative overflow-hidden px-6 py-[10vh] md:px-16">
        <div className="w-[120%] overflow-hidden">
          <Marquee
            items={["LET'S TALK"]}
            separator={
              <ChevronDown aria-hidden="true" className="mx-[2.5vw] size-[4vw] text-em-invert-text" />
            }
            baseVelocity={40}
            className="font-heading text-[12vw] uppercase leading-none tracking-tighter text-em-invert-text"
          />
        </div>

        <ContactFooterBlock />
      </section>

      <Footer />
    </div>
  );
}
```
with:
```tsx
"use client";

import Link from "next/link";
import { ChevronsDown } from "lucide-react";
import { Marquee } from "@/components/ui/Marquee";
import { ContactFooterBlock } from "@/components/sections/ContactFooterBlock";
import { Footer } from "@/components/layout/Footer";

export default function ContactSection() {
  return (
    <div className="relative w-full bg-em-invert-bg">
      <section id="contact" className="relative overflow-hidden px-6 py-[10vh] md:px-16">
        <Link
          href="/contact"
          className="block w-[120%] overflow-hidden rounded-full py-5 text-em-invert-text duration-300 hover:bg-em-accent hover:text-em-invert-bg"
        >
          <Marquee
            items={["LET'S TALK"]}
            separator={<ChevronsDown aria-hidden="true" className="mx-[2.5vw] size-[4vw]" />}
            baseVelocity={40}
            className="font-heading text-[12vw] uppercase leading-none tracking-tighter text-current"
          />
        </Link>

        <ContactFooterBlock />
      </section>

      <Footer />
    </div>
  );
}
```

Notes: the separator icon and the `Marquee`'s own text color both switch to `text-current`/no explicit color so they inherit from the wrapping `Link` (lucide icons default to `stroke="currentColor"`) — that's what makes the hover-invert (`hover:bg-em-accent hover:text-em-invert-bg`) recolor the whole row, marquee text and separator icons alike, matching the reference's single-token-swap hover mechanic.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, open `/`, scroll to the Contact section.
Expected:
- Marquee text and separators render in cream (`em-invert-text`), same as before.
- Hovering anywhere over the marquee row (including the gaps between repeated items, since the `Link`/pill spans the full row) smoothly fills the background with rust (`em-accent`) and flips text/icons to near-black (`em-invert-bg`) over ~300ms, then reverses on mouse-leave.
- Clicking anywhere on the marquee navigates to `/contact` (will 404 or show the still-stub page until Task 6 lands — that's expected at this point in the plan).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/ContactSection.tsx
git commit -m "feat: make LET'S TALK marquee a hover-animated button linking to /contact"
```

---

### Task 5: Build `ContactFormSection`

**Files:**
- Create: `src/components/sections/ContactFormSection.tsx`

**Interfaces:**
- Consumes: `RevealHeadingLine` (Task 2's new `children` shape) from `@/components/reactbits/RevealHeadingLine`; `emailjs` default export from `@emailjs/browser` (Task 1); `NEXT_PUBLIC_EMAILJS_SERVICE_ID` / `_TEMPLATE_ID` / `_PUBLIC_KEY` from `process.env` (Task 1).
- Produces: `ContactFormSection()` — a component with no props. Consumed by `src/app/contact/page.tsx` (Task 6).

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
import { RevealHeadingLine } from "@/components/reactbits/RevealHeadingLine";

type SubmitStatus = "idle" | "sending" | "sent" | "error" | "not-configured";

const HEADING_CLASS =
  "text-center text-[20vw] uppercase leading-none text-em-invert-text sm:text-[12vw]";

/**
 * ContactFormSection - heading, paragraph, and EmailJS-wired contact form
 * for the standalone /contact page. Matches jasminemaduafokwa.com/contact's
 * "Let's get in touch" heading (live-DOM measured: two overflow-hidden
 * lines, translateY(100%)->0% reveal, "get"/"in" as italic-lowercase inline
 * spans) and its underline-only form fields.
 */
export function ContactFormSection() {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const paragraphInView = useInView(paragraphRef, { once: true, margin: "-80px" });
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus("not-configured");
      return;
    }

    setStatus("sending");
    try {
      await emailjs.sendForm(serviceId, templateId, event.currentTarget, { publicKey });
      setStatus("sent");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="mx-auto w-full px-6 py-[8vh] sm:w-[75%] md:w-[60%] md:px-0">
      <RevealHeadingLine className={HEADING_CLASS}>
        Let&apos;s <span className="italic lowercase">get</span>
      </RevealHeadingLine>
      <RevealHeadingLine delay={0.1} className={HEADING_CLASS}>
        <span className="italic lowercase">in</span> touch
      </RevealHeadingLine>

      <div className="flex justify-end">
        <motion.p
          ref={paragraphRef}
          initial={{ opacity: 0 }}
          animate={paragraphInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-[70%] text-[13.5px] text-em-invert-muted sm:w-[60%] sm:text-[15px] md:w-[55%] 2xl:text-[24px]"
        >
          Have a project in mind or an opportunity to talk through? Fill out the form below and
          I&apos;ll get back to you shortly.
        </motion.p>
      </div>

      <form onSubmit={handleSubmit} className="mt-14">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex flex-1 flex-col gap-y-2">
            <label htmlFor="name" className="text-[14px] text-em-invert-text">
              Name *
            </label>
            <input
              id="name"
              name="user_name"
              type="text"
              required
              className="border-b-[1.5px] border-b-em-invert-text bg-transparent px-2 py-2 text-em-invert-text outline-none"
            />
          </div>
          <div className="flex flex-1 flex-col gap-y-2">
            <label htmlFor="email" className="text-[14px] text-em-invert-text">
              Email *
            </label>
            <input
              id="email"
              name="user_email"
              type="email"
              required
              className="border-b-[1.5px] border-b-em-invert-text bg-transparent px-2 py-2 text-em-invert-text outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-y-2">
          <label htmlFor="message" className="text-[14px] text-em-invert-text">
            Message *
          </label>
          <textarea
            id="message"
            name="user_message"
            rows={3}
            required
            className="border-b-[1.5px] border-b-em-invert-text bg-transparent px-2 py-2 text-em-invert-text outline-none"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-full border border-em-invert-text py-2 text-[16px] text-em-invert-text duration-300 hover:bg-em-accent hover:text-em-invert-bg disabled:opacity-50 sm:w-[45%] 2xl:text-[26px]"
          >
            {status === "sending" ? "Sending..." : "Submit"}
          </button>
          {status === "sent" && (
            <p className="mt-3 text-[13px] text-em-invert-muted">Message sent — thank you!</p>
          )}
          {status === "error" && (
            <p className="mt-3 text-[13px] text-em-accent">
              Something went wrong sending that — email me directly instead.
            </p>
          )}
          {status === "not-configured" && (
            <p className="mt-3 text-[13px] text-em-accent">
              The contact form isn&apos;t wired up yet — email me directly instead.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

export default ContactFormSection;
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ContactFormSection.tsx
git commit -m "feat: build ContactFormSection with EmailJS-wired form"
```

(No manual browser check yet — this component isn't mounted anywhere until Task 6.)

---

### Task 6: Rewrite `/contact` page

**Files:**
- Modify: `src/app/contact/page.tsx`

**Interfaces:**
- Consumes: `Navbar` from `@/components/layout/Navbar`, `ContactFormSection` (Task 5), `ContactFooterBlock` (Task 3), `Footer` from `@/components/layout/Footer`.

- [ ] **Step 1: Replace the redirect with a real page**

Replace the full contents of `src/app/contact/page.tsx`:

```tsx
import { Navbar } from "@/components/layout/Navbar";
import { ContactFormSection } from "@/components/sections/ContactFormSection";
import { ContactFooterBlock } from "@/components/sections/ContactFooterBlock";
import { Footer } from "@/components/layout/Footer";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      {/* id="contact" lets useActiveSection (Navbar's dark/light text switch)
          recognize this page as the "contact" section, same as the home
          page's #contact anchor — otherwise Navbar defaults to its
          light-mode text color against this page's dark background. */}
      <main id="contact" className="relative min-h-screen w-full bg-em-invert-bg px-6 pt-[14vh] md:px-16">
        <ContactFormSection />
        <ContactFooterBlock />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Manual check**

Run: `npm run dev`, open `/contact` directly.
Expected:
- Navbar's "Menu" text renders in its dark-section color (cream), readable against the page's dark background — not the light-mode color.
- "Let's *get*" / "*in* touch" heading slides up line-by-line on load (`get`/`in` italic + lowercase, rest uppercase).
- Paragraph fades in shortly after.
- Name/Email stack vertically below `sm` width, sit side-by-side above it; Message textarea full width below.
- Hovering Submit fills it with rust and flips its text to near-black over ~300ms.
- Submitting the empty-configured form shows the "isn't wired up yet" message (expected — env vars are unset per Task 1).
- Scrolling past the form shows the same sunburst/social-list/question block as the home Contact section, then the credit-bar Footer.

- [ ] **Step 4: Commit**

```bash
git add src/app/contact/page.tsx
git commit -m "feat: build standalone /contact page matching jasminemaduafokwa.com/contact"
```

---

### Task 7: Full-branch verification against the reference

**Files:** none (verification only).

- [ ] **Step 1: Build check**

Run: `npm run build`
Expected: exits 0, no type or lint errors surfaced during the production build.

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: exits 0.

- [ ] **Step 3: Compare home Contact section against the reference**

With `npm run dev` running, open `/` at 1440×900 and 390×844 (or use the Playwright MCP tools: `browser_resize` then `browser_navigate` to `http://localhost:3000/#contact`), and separately load `https://www.jasminemaduafokwa.com/` at the same widths. Compare:
- Marquee text size/placement, sunburst size, social-list order (Email/GitHub/LinkedIn/Instagram) and underline-on-hover, question/CTA copy block position.
- Marquee-row hover fill color/timing and the double-chevron separator.
- Mobile: two-column row reflows to `flex-col-reverse` (question+CTA above social list).

- [ ] **Step 4: Compare `/contact` against the reference**

Same two widths, `/contact` on both sites. Compare heading line reveal timing/stagger, paragraph fade, form field layout and row-reflow breakpoint, Submit button hover, and that the sunburst/social-list/question block below the form matches the home page's version exactly.

- [ ] **Step 5: Report findings**

If any gap is found, note it (don't fix silently) and confirm with the user whether it's worth a follow-up fix or an acceptable, intentional deviation (e.g. the `xs:`→`sm:` breakpoint substitution documented in Global Constraints).

- [ ] **Step 6: Update the roadmap**

In `docs/superpowers/REDESIGN-ROADMAP.md`, Phase 7's row already says "Done" — add a note (don't change the status) referencing this plan/spec as the correction that fixed the `/contact` page and marquee-button gap left by the original Phase 7 pass. Example diff to the Phase 7 table row's Plan cell:
```
| 7 | ... | jasminemaduafokwa.com | **Done** | `specs/2026-08-03-contact-cta-redesign-design.md` | `plans/2026-08-03-contact-cta-redesign.md` (marquee-button + `/contact` page corrected in `plans/2026-08-09-contact-page-letstalk-redesign.md`) |
```

- [ ] **Step 7: Final commit**

```bash
git add docs/superpowers/REDESIGN-ROADMAP.md
git commit -m "docs: note Phase 7 correction in the redesign roadmap"
```

# Editorial Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Lightfall-anchored ember redesign with an editorial-first site: a Mees Verberne-composed Hero (oversized name, marquee tag-strip, symbolic photo + cursive accent, paragraphs) followed by every other section built in Jasmine Maduafokwa's structural register (persistent section-index tab, sticky-headline occlusion, pill-tag components, manifesto module, spec-sheet credit lines, full-screen nav overlay), unified under one Bodoni Moda / Space Grotesk / Space Mono / Caveat type system and a warm cream/terracotta palette.

**Architecture:** No new routes or data layer — this is a single-page (`src/app/page.tsx`) visual/structural rebuild. Real content (name, bio, 3 real projects, real skills) carries forward from the current codebase; every image slot is a data-driven `imageSrc?: string` placeholder. Sections are independent client components composed in `page.tsx`; a persistent `SectionIndexTab` and `Navbar` render alongside `<main>`.

**Tech Stack:** Next.js 16 / React 19 / Tailwind v4 (CSS-first `@theme`) / Motion (`motion` + `framer-motion`, both already installed) / GSAP + ScrollTrigger (existing, repurposed) / `next-themes` (new) / `lenis` (new) / `next/font/google` (Bodoni Moda, Caveat, existing Space Grotesk/Space Mono).

**Design spec:** `docs/superpowers/specs/2026-08-01-editorial-portfolio-redesign-design.md` — read it before starting; every task below implements a specific section of it.

## Global Constraints

- Color tokens (exact hex, replacing the ember palette in `src/app/globals.css`): `--em-bg: #ede2cd`, `--em-text: #211c16`, `--em-text-muted: #6b6153`, `--em-text-dim: #a89b85`, `--em-accent: #b5502e`, `--em-accent-text: #d97b52`, `--em-invert-bg: #17130f`, `--em-invert-text: #f3ede2`, `--em-invert-muted: #b5aa98`.
- Typography: Bodoni Moda (display serif, bound to the existing `--font-editorial` CSS variable / `font-display` Tailwind utility — do not rename), Space Grotesk (body, unchanged), Space Mono (eyebrow/spec-sheet text, unchanged), Caveat (new, bound to `--font-cursive` / `font-cursive` utility, hero accent word only). Fraunces and Archivo are fully removed, not demoted.
- No unit test framework exists in this repo (confirmed: no Jest/Vitest/RTL config, no `*.test.*` files under `src`). Verification for every task is: `npx tsc --noEmit` (must exit 0), `npm run lint` (must exit 0), and a manual/Playwright visual check of the dev server at `http://localhost:3000` (start with `npm run dev`).
- `prefers-reduced-motion` gates every new animated piece via the existing `usePrefersReducedMotion` hook (`src/hooks/use-prefers-reduced-motion.ts`) — never invent a second reduced-motion check.
- All new/kept GSAP usage stays dynamically imported inside effects (`await import("gsap")` pattern already used in this codebase) — never a static top-level `import gsap from "gsap"` that would pull it into the root bundle.
- Real content stays real: name "Paolo Enrera" / "Paolo Jansen Enrera", role "Computer Engineer", the 3 real projects (PortfolioMon, PIC-Based Futsal Scoreboard, SMARTBIN 3), real skills/tags, real social links (GitHub `shuu-pao`, LinkedIn `paolo-jansen-enrera`, `paolo.enrera@gmail.com`). Never replace with lorem ipsum or fictional placeholders.
- Image slots: every image-bearing prop is `imageSrc?: string`, left `undefined` for now, rendered via the shared `ImagePlaceholder` component (Task 2) so a later real-image swap needs zero component changes.
- Section ids, in final page order: `hero`, `intro`, `work`, `skills`, `mission`, `process`, `contact`. Every task that creates or renames a section must use this exact id.
- Commit after every task with `git add <files touched> && git commit -m "..."` — never `git add -A`.

---

### Task 1: Dependencies, typography & color foundation

**Files:**
- Modify: `package.json` (via npm commands, not hand-edited)
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Modify: `tailwind.config.js`

**Interfaces:**
- Produces: CSS variables `--em-bg`, `--em-text`, `--em-text-muted`, `--em-text-dim`, `--em-accent`, `--em-accent-text`, `--em-invert-bg`, `--em-invert-text`, `--em-invert-muted` (all consumed by every later task via Tailwind utilities `bg-em-*`/`text-em-*`). Tailwind utility `font-cursive` (consumed by Task 6/Hero). `next-themes` and `lenis` packages available for Tasks 3–4.

- [ ] **Step 1: Install and remove dependencies**

Run:
```bash
npm install next-themes lenis
npm uninstall ogl
```
Expected: `package.json` now lists `next-themes` and `lenis` under `dependencies`, `ogl` is gone (it was only used by `Lightfall`, which this redesign removes in Task 12).

- [ ] **Step 2: Swap fonts in `src/app/layout.tsx`**

Replace the whole file with:

```tsx
import type { Metadata } from "next";
import { Bodoni_Moda, Caveat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/layout/Providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const bodoniModa = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-editorial",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-cursive",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Paolo Jansen Enrera — Computer Engineer",
  description:
    "Portfolio of Paolo Jansen Enrera, a Computer Engineering graduate building Salesforce Agentforce agents at Accenture and embedded systems and applied computer vision on the side.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full scroll-smooth antialiased",
        spaceGrotesk.variable,
        bodoniModa.variable,
        caveat.variable
      )}
    >
      <body className="min-h-full bg-em-bg font-sans text-em-text">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

Note: `Providers` doesn't exist yet — that's created in Task 3. This step will not compile until Task 3 lands; that's expected since Task 1 and Task 3 are both foundational. Proceed to Step 3 first, then come back and run the verification in Step 5 only after confirming `Providers` will exist (Task 3 must run before this task's final verification — see Step 5 note).

- [ ] **Step 3: Replace the color palette in `src/app/globals.css`**

Replace lines 104-110 (the `/* Editorial Mono — Hero art direction */` block) with:

```css
  /* Editorial warm palette */
  --em-bg: #ede2cd;
  --em-text: #211c16;
  --em-text-muted: #6b6153;
  --em-text-dim: #a89b85;
  --em-accent: #b5502e;
  --em-accent-text: #d97b52;
  --em-invert-bg: #17130f;
  --em-invert-text: #f3ede2;
  --em-invert-muted: #b5aa98;
```

Add these three lines inside the existing `.dark { ... }` block (the one starting `--background: oklch(0.145 0 0);`), so the toggle (Task 4) has real values to switch to:

```css
  --em-bg: var(--em-invert-bg);
  --em-text: var(--em-invert-text);
  --em-text-muted: var(--em-invert-muted);
```

In the `@theme inline` block, add after the existing `--color-em-accent-text: var(--em-accent-text);` line:

```css
  --color-em-invert-bg: var(--em-invert-bg);
  --color-em-invert-text: var(--em-invert-text);
  --color-em-invert-muted: var(--em-invert-muted);
  --font-cursive: var(--font-cursive);
```

- [ ] **Step 4: Drop Archivo from `tailwind.config.js`**

In the `fontFamily` block, remove the `display: ['Archivo', 'system-ui', 'sans-serif'],` line entirely, leaving only `sans`.

- [ ] **Step 5: Verify (after Task 3 exists)**

This task's `layout.tsx` change references `Providers`, created in Task 3. Do Task 3 immediately after this one, then run:
```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/app/layout.tsx src/app/globals.css tailwind.config.js
git commit -m "feat: swap to editorial warm palette and Bodoni Moda/Caveat type system"
```
(Run this commit after Task 3's files are also staged, or split into two commits — either is fine as long as `tsc`/`lint` pass before each commit. If splitting, commit this task's files with the `Providers` import temporarily reverted to a comment, then restore it in Task 3's commit. Simpler: just do Tasks 1 and 3 back-to-back and commit once both are done.)

---

### Task 2: Shared UI primitives — `ImagePlaceholder` and `PillTag`

**Files:**
- Create: `src/components/ui/ImagePlaceholder.tsx`
- Create: `src/components/ui/PillTag.tsx`

**Interfaces:**
- Produces: `ImagePlaceholder({ imageSrc?: string; alt: string; aspectRatio?: string; label?: string; className?: string })` — renders `next/image` when `imageSrc` is set, otherwise a bordered placeholder frame at the given `aspectRatio` (default `"16 / 10"`). Consumed by Tasks 6, 7, 8, 9.
- Produces: `PillTag({ children: React.ReactNode; className?: string })` — outlined terracotta chip. Consumed by Tasks 8, 9.

- [ ] **Step 1: Create `ImagePlaceholder`**

```tsx
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  imageSrc?: string;
  alt: string;
  aspectRatio?: string;
  label?: string;
  className?: string;
}

export function ImagePlaceholder({
  imageSrc,
  alt,
  aspectRatio = "16 / 10",
  label,
  className,
}: ImagePlaceholderProps) {
  if (imageSrc) {
    return (
      <div className={cn("relative overflow-hidden", className)} style={{ aspectRatio }}>
        <Image src={imageSrc} alt={alt} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden border border-em-text/15 bg-em-text/[0.03]",
        className
      )}
      style={{ aspectRatio }}
      role="img"
      aria-label={alt}
    >
      <ImageIcon size={20} className="text-em-text-dim" aria-hidden="true" />
      {label && (
        <span className="absolute bottom-2 right-2 font-mono text-[10px] uppercase tracking-[0.15em] text-em-text-dim">
          {label}
        </span>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `PillTag`**

```tsx
import { cn } from "@/lib/utils";

interface PillTagProps {
  children: React.ReactNode;
  className?: string;
}

export function PillTag({ children, className }: PillTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-em-accent/40 px-3 py-1 font-mono text-xs text-em-accent",
        className
      )}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0. (No visual consumer yet — that comes in later tasks.)

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/ImagePlaceholder.tsx src/components/ui/PillTag.tsx
git commit -m "feat: add ImagePlaceholder and PillTag shared primitives"
```

---

### Task 3: App providers — Lenis smooth-scroll + theme provider

**Files:**
- Create: `src/hooks/use-lenis.ts`
- Create: `src/components/layout/Providers.tsx`
- Modify: `src/app/layout.tsx` (already wired in Task 1, Step 2 — confirm it matches)

**Interfaces:**
- Produces: `useLenis(): void` — side-effect-only hook, initializes Lenis + GSAP ScrollTrigger integration, no-ops under reduced motion. Consumed only by `Providers`.
- Produces: `Providers({ children: React.ReactNode })` — wraps `children` in `next-themes`' `ThemeProvider` and calls `useLenis()`. Consumed by `layout.tsx`.

- [ ] **Step 1: Create `use-lenis.ts`**

```ts
"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

export function useLenis() {
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let lenisInstance: { destroy: () => void; raf: (time: number) => void; on: (event: string, cb: () => void) => void } | undefined;
    let tickerFn: ((time: number) => void) | undefined;
    let cancelled = false;

    (async () => {
      const [{ default: Lenis }, { default: gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);
      const lenis = new Lenis();
      lenisInstance = lenis;

      lenis.on("scroll", ScrollTrigger.update);
      tickerFn = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    })();

    return () => {
      cancelled = true;
      lenisInstance?.destroy();
      if (tickerFn) {
        import("gsap").then(({ default: gsap }) => gsap.ticker.remove(tickerFn!));
      }
    };
  }, [reducedMotion]);
}
```

- [ ] **Step 2: Create `Providers.tsx`**

```tsx
"use client";

import { ThemeProvider } from "next-themes";
import { useLenis } from "@/hooks/use-lenis";

export function Providers({ children }: { children: React.ReactNode }) {
  useLenis();
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run dev
```
Open `http://localhost:3000`, scroll the page. Expected: no console errors, scroll feels the same as before for now (Lenis is running but nothing yet depends on its smoothing being visible — that becomes apparent once ScrollTrigger-driven sections exist in Task 9). Confirm `tsc`/`lint` exit 0 — this also validates Task 1's `layout.tsx` import of `Providers` now resolves.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/use-lenis.ts src/components/layout/Providers.tsx src/app/layout.tsx src/app/globals.css tailwind.config.js package.json package-lock.json
git commit -m "feat: wire Lenis smooth-scroll and next-themes ThemeProvider at app root"
```

---

### Task 4: Theme toggle

**Files:**
- Create: `src/components/ui/ThemeToggle.tsx`

**Interfaces:**
- Produces: `ThemeToggle({ className?: string })` — sun/moon pill switch using `useTheme()` from `next-themes`. Consumed by Task 5 (`Navbar`).

- [ ] **Step 1: Create `ThemeToggle.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className={cn("h-8 w-16 rounded-full bg-em-text/5", className)} aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-8 w-16 cursor-pointer items-center rounded-full border border-em-text/15 bg-em-text/5 px-1.5 transition-colors",
        className
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full bg-em-bg shadow-sm transition-transform duration-200",
          isDark && "translate-x-7"
        )}
      >
        {isDark ? <Moon size={13} className="text-em-text" /> : <Sun size={13} className="text-em-text" />}
      </span>
    </button>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
```
Expected: both exit 0. (No visual consumer yet — wired into `Navbar` in Task 5.)

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/ThemeToggle.tsx
git commit -m "feat: add ThemeToggle sun/moon pill component"
```

---

### Task 5: Nav shell rewrite — `Navbar` + `NavOverlay`

**Files:**
- Create: `src/components/layout/NavOverlay.tsx`
- Modify: `src/components/layout/Navbar.tsx` (full rewrite)
- Delete: `src/hooks/use-scroll-position.ts` (only consumer was the old `Navbar`)

**Interfaces:**
- Produces: `NavOverlay({ open: boolean; onClose: () => void; links: { label: string; href: string }[] })` — full-screen zig-zag menu, reuses the focus-trap/Escape pattern already in `PortfolioGallerySection.tsx`'s modal. Consumed by `Navbar`.
- Produces: `Navbar()` — corner-anchored wordmark + `ThemeToggle` + "Menu" trigger, no more scroll-triggered frosted background.

- [ ] **Step 1: Create `NavOverlay.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

interface NavOverlayProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
}

export function NavOverlay({ open, onClose, links }: NavOverlayProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex flex-col bg-em-bg"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute right-6 top-5 cursor-pointer text-em-text"
          >
            <X size={26} />
          </button>

          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {links.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                className={cn(
                  "font-display cursor-pointer text-5xl font-bold text-em-text transition-colors hover:text-em-accent md:text-7xl",
                  i % 2 === 1 ? "md:translate-x-10" : "md:-translate-x-10"
                )}
              >
                <span className="mr-4 align-top font-mono text-base text-em-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {link.label}
              </motion.a>
            ))}
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Rewrite `Navbar.tsx`**

```tsx
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { NavOverlay } from "@/components/layout/NavOverlay";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-16">
        <a href="#hero" className="font-display cursor-pointer text-lg font-bold text-em-text">
          PE<span className="text-em-accent">.</span>
        </a>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex cursor-pointer items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-em-text"
        >
          Menu
          <Menu size={16} />
        </button>
      </header>
      <NavOverlay open={menuOpen} onClose={() => setMenuOpen(false)} links={navLinks} />
    </>
  );
}
```

- [ ] **Step 3: Delete the now-unused scroll-position hook**

```bash
git rm src/hooks/use-scroll-position.ts
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run dev
```
Open `http://localhost:3000`. Expected: corner wordmark top-left, theme pill top-center, "Menu" trigger top-right. Click Menu → full-screen overlay opens with 4 zig-zagged links; Escape and the X button both close it; focus returns to the Menu button on close.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/NavOverlay.tsx src/components/layout/Navbar.tsx
git commit -m "feat: rebuild nav as corner-anchored shell with full-screen menu overlay"
```

---

### Task 6: Hero rewrite — Mees composition

**Files:**
- Create: `src/components/ui/Marquee.tsx`
- Modify: `src/app/globals.css` (add marquee keyframes)
- Modify: `src/components/sections/HeroSection.tsx` (full rewrite)
- Modify: `src/app/page.tsx` (drop `<MarqueeTickerSection />`, its import stays only until Task 7 fully reassembles the file — but since Marquee moves into Hero now, remove the import and usage in this step)
- Delete: `src/components/sections/MarqueeTickerSection.tsx`
- Delete: `src/components/reactbits/ScrollVelocity.tsx`, `src/components/reactbits/ScrollVelocity.css`

**Interfaces:**
- Produces: `Marquee({ items: string[]; className?: string })` — constant-speed infinite marquee, alternating `X`/`Plus` lucide-icon separators and text/accent color alternation, pauses off-screen (reuses `useInViewport`) and under reduced motion. Consumed by `HeroSection` only for now.
- Produces: `HeroSection` with id `hero` — no more `name`/`title`/`subtitle`/`ctaText` props; real copy is inlined per the design spec (no CTA button, no Lightfall).

- [ ] **Step 1: Add marquee keyframes to `globals.css`**

Append at the end of the file:

```css
@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
```

- [ ] **Step 2: Create `Marquee.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { X, Plus } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useInViewport } from "@/hooks/use-in-viewport";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
}

export function Marquee({ items, className }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const inViewport = useInViewport(trackRef, { threshold: 0 });
  const reducedMotion = usePrefersReducedMotion();
  const running = inViewport && !reducedMotion;

  const renderItems = (copy: number) =>
    items.map((item, i) => (
      <span
        key={`${copy}-${i}`}
        className={cn(
          "inline-flex items-center gap-3 whitespace-nowrap px-3 font-mono text-sm uppercase tracking-[0.15em]",
          i % 2 === 0 ? "text-em-text" : "text-em-accent"
        )}
      >
        {item}
        {i % 2 === 0 ? <X size={12} aria-hidden="true" /> : <Plus size={12} aria-hidden="true" />}
      </span>
    ));

  return (
    <div ref={trackRef} className={cn("w-full overflow-hidden", className)}>
      <div
        className="flex w-max"
        style={{ animation: running ? "marquee-scroll 18s linear infinite" : "none" }}
      >
        <div className="flex">{renderItems(0)}</div>
        <div className="flex" aria-hidden="true">
          {renderItems(1)}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `HeroSection.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BlurText } from "@/components/reactbits/BlurText";
import { Marquee } from "@/components/ui/Marquee";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

const MARQUEE_ITEMS = ["Computer Engineer", "Salesforce Agentforce", "Embedded Systems", "Computer Vision"];

interface HeroSectionProps {
  name?: string;
  status?: string;
}

export default function HeroSection({
  name = "Paolo Enrera",
  status = "Actively looking for new opportunities",
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const textVisible = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-em-bg px-6 pb-16 pt-32 md:px-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={textVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-4 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-em-accent"
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-em-accent" aria-hidden="true" />
        {status}
      </motion.div>

      <h1 className="font-display -mx-6 overflow-hidden text-[16vw] font-black leading-[0.85] tracking-tight text-em-text md:-mx-16 md:text-[11vw]">
        <BlurText text={name} delay={0.04} duration={0.7} ease="easeOut" className="block px-6 md:px-16" />
      </h1>

      <div className="mt-2">
        <Marquee items={MARQUEE_ITEMS} className="border-y border-em-text/10 py-3" />
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-2 md:items-end">
        <div className="relative">
          <ImagePlaceholder
            alt="A close-up of hardware from one of Paolo's embedded systems projects"
            aspectRatio="4 / 5"
            label="Project photo"
            className="w-full max-w-sm rounded-sm"
          />
          <span className="font-cursive absolute -right-4 top-6 -rotate-6 text-4xl text-em-accent md:text-5xl">
            Debug &amp; Build
          </span>
        </div>

        <div className="space-y-5 text-base leading-relaxed text-em-text-muted md:text-lg">
          <p>
            Computer Engineering graduate who builds at both ends of the stack — enterprise AI
            agents at Accenture and low-level firmware in the lab. At Accenture I spent 540 hours
            developing Salesforce Agentforce agents that create, update, and close support cases
            and automate account-billing workflows.
          </p>
          <p>
            Based in Cebu City, Philippines. Actively looking for new opportunities — especially
            Salesforce, Agentforce, or building smarter customer-experience tooling.
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Remove the old marquee section from `page.tsx`**

In `src/app/page.tsx`, delete the line `import MarqueeTickerSection from "@/components/sections/MarqueeTickerSection";` and the line `<MarqueeTickerSection />`.

- [ ] **Step 5: Delete obsolete files**

```bash
git rm src/components/sections/MarqueeTickerSection.tsx
git rm src/components/reactbits/ScrollVelocity.tsx src/components/reactbits/ScrollVelocity.css
```

- [ ] **Step 6: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run dev
```
Open `http://localhost:3000`. Expected: giant edge-to-edge "Paolo Enrera" name, marquee strip running underneath (alternating near-black/terracotta text with X/Plus separators), a placeholder photo frame with "Debug & Build" in cursive script overlaid, two paragraphs. No Lightfall canvas, no CTA button. Toggle OS-level reduced-motion and confirm the marquee freezes.

- [ ] **Step 7: Commit**

```bash
git add -- src/components/ui/Marquee.tsx src/components/sections/HeroSection.tsx src/app/page.tsx src/app/globals.css
git commit -m "feat: rebuild Hero in Mees Verberne composition with bespoke Marquee"
```

---

### Task 7: Intro/Bio section (new)

**Files:**
- Create: `src/components/sections/IntroBioSection.tsx`
- Modify: `src/app/page.tsx` (swap `AboutMeSection` → `IntroBioSection`, keep its position right after Hero)
- Delete: `src/components/sections/AboutMeSection.tsx`
- Delete: `src/components/reactbits/CountUp.tsx` (only consumer was `AboutMeSection`)

**Interfaces:**
- Produces: `IntroBioSection` with id `intro` — two asymmetric `ImagePlaceholder` slots + two-column personal statement, no headline, no stat-counter row.

- [ ] **Step 1: Create `IntroBioSection.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

export default function IntroBioSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="intro" ref={ref} className="relative w-full bg-em-bg px-6 py-24 md:px-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4"
        >
          <ImagePlaceholder
            alt="Paolo working on Salesforce Agentforce configuration"
            aspectRatio="3 / 4"
            label="Workspace photo"
            className="mt-8 rounded-sm"
          />
          <ImagePlaceholder
            alt="Close-up of embedded hardware Paolo built"
            aspectRatio="3 / 4"
            label="Hardware photo"
            className="rounded-sm"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col justify-center gap-4 text-base leading-relaxed text-em-text-muted md:text-lg"
        >
          <p>
            As an engineer, I prioritize root causes over quick patches — whether that&apos;s an
            Agentforce action that&apos;s misfiring or a computer-vision model that&apos;s stalled
            for two months. I trace the problem, rebuild around the real constraint, then ship.
          </p>
          <p>
            That instinct carries across every layer I work in: enterprise AI agents at Accenture,
            PIC microcontroller firmware in C, and applied computer vision in my thesis work.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update `page.tsx`**

Replace `import AboutMeSection from "@/components/sections/AboutMeSection";` with `import IntroBioSection from "@/components/sections/IntroBioSection";`, and replace `<AboutMeSection />` with `<IntroBioSection />`, keeping it directly after `<HeroSection />`.

- [ ] **Step 3: Delete obsolete files**

```bash
git rm src/components/sections/AboutMeSection.tsx
git rm src/components/reactbits/CountUp.tsx
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run dev
```
Open `http://localhost:3000`, scroll past Hero. Expected: two uneven-height placeholder image frames on the left, two-paragraph personal statement on the right, no headline, no stat-counter numbers.

- [ ] **Step 5: Commit**

```bash
git add -- src/components/sections/IntroBioSection.tsx src/app/page.tsx
git commit -m "feat: replace AboutMeSection stat-card layout with editorial Intro/Bio section"
```

---

### Task 8: Selected Work rewrite — sticky-headline occlusion

**Files:**
- Modify: `src/components/sections/PortfolioGallerySection.tsx` (full rewrite)

**Interfaces:**
- Consumes: `ImagePlaceholder` (Task 2), `PillTag` (Task 2)
- Produces: `PortfolioGallerySection` with id `work`. `Project` interface gains `year: string` and `imageSrc?: string`, drops `gradient`.

- [ ] **Step 1: Rewrite the file**

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Code2, X } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { PillTag } from "@/components/ui/PillTag";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";

interface Project {
  id: number;
  title: string;
  year: string;
  description: string;
  tags: string[];
  imageSrc?: string;
  githubUrl?: string;
  liveUrl?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "PortfolioMon",
    year: "2025",
    description:
      "A full turn-based RPG battle system built from scratch — a game-like developer portfolio with boss battles, dialogue, and a chat-driven AI guide.",
    tags: ["React", "Vite", "JavaScript", "CSS"],
    githubUrl: "https://github.com/shuu-pao",
  },
  {
    id: 2,
    title: "PIC-Based Futsal Scoreboard",
    year: "2024",
    description:
      "A microcontroller scoreboard written in C (XC8) with real-time match timers and 7-segment display integration — a hands-on embedded-systems lab build.",
    tags: ["C", "XC8", "Embedded", "Microcontrollers"],
    githubUrl: "https://github.com/shuu-pao",
  },
  {
    id: 3,
    title: "SMARTBIN 3 (Thesis)",
    year: "2024",
    description:
      "A YOLOv8-powered waste-sorting bin with a motorized platform for auto-segregation. Diagnosed a flawed classification approach that had stalled the team for two months and proposed the object-detection redesign that cleared it — reaching 98.67% accuracy on standard waste.",
    tags: ["YOLOv8", "Computer Vision", "Python", "Deep Learning"],
    githubUrl: "https://github.com/shuu-pao",
  },
];

function ProjectCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(project);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="relative z-10 cursor-pointer bg-em-bg py-8"
      onClick={() => onSelect(project)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <ImagePlaceholder
        imageSrc={project.imageSrc}
        alt={`Screenshot of ${project.title}`}
        aspectRatio="16 / 10"
        label="Project image"
        className="rounded-sm transition-opacity hover:opacity-90"
      />
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="font-display text-2xl font-bold text-em-text md:text-3xl">{project.title}</h3>
        <span className="font-mono text-sm text-em-text-muted">{project.year}</span>
      </div>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-em-text-muted">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <PillTag key={tag}>{tag}</PillTag>
        ))}
      </div>
    </motion.article>
  );
}

export default function PortfolioGallerySection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedProject) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [selectedProject]);

  return (
    <section id="work" className="relative w-full bg-em-bg px-6 py-24 md:px-16">
      <div className="relative mx-auto max-w-4xl">
        <h2
          className="font-display sticky top-28 z-0 text-center text-[13vw] font-black leading-none text-em-text/90 md:text-[7vw]"
          aria-hidden="true"
        >
          SELECTED WORK
        </h2>

        <div className="relative -mt-[12vw] space-y-16 md:-mt-[6vw]">
          <h2 className="sr-only">Selected Work</h2>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelect={setSelectedProject} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-em-invert-bg/90 p-4 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-em-invert-text/10 bg-em-invert-bg p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                aria-label="Close project details"
                className="absolute right-4 top-4 cursor-pointer rounded-lg p-2 text-em-invert-muted transition-colors hover:bg-white/10 hover:text-em-invert-text"
                onClick={() => setSelectedProject(null)}
              >
                <X size={20} />
              </button>

              <h2 id="project-modal-title" className="font-display text-3xl font-bold text-em-invert-text">
                {selectedProject.title}
              </h2>
              <p className="mt-4 leading-relaxed text-em-invert-muted">{selectedProject.description}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {selectedProject.tags.map((tag) => (
                  <PillTag key={tag}>{tag}</PillTag>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {selectedProject.githubUrl && (
                  <GradientButton href={selectedProject.githubUrl} variant="ghost" className="gap-2">
                    <Code2 size={16} />
                    GitHub
                  </GradientButton>
                )}
                {selectedProject.liveUrl && (
                  <GradientButton href={selectedProject.liveUrl} className="gap-2">
                    <ExternalLink size={16} />
                    Live demo
                  </GradientButton>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
```

Note on the `bg-em-invert-bg`/`text-em-invert-text`/`text-em-invert-muted` utilities used in the modal: these were added to `@theme inline` in Task 1, Step 3 — they resolve regardless of the light/dark toggle state (the modal is always dark, independent of site theme, matching the Contact section's structural inversion).

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run dev
```
Open `http://localhost:3000`, scroll to Selected Work. Expected: a giant "SELECTED WORK" headline that stays roughly fixed in place while the 3 project cards (each an opaque `bg-em-bg` block) scroll over it, visibly covering different letters as you scroll. If the overlap isn't visible, adjust the `-mt-[12vw]`/`md:-mt-[6vw]` value on the cards container or the `top-28` value on the sticky headline until cards visibly occlude the headline at at least 2 different scroll positions. Click a card → modal opens with real project details; Escape closes it.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/PortfolioGallerySection.tsx
git commit -m "feat: rebuild Selected Work with sticky-headline occlusion, drop tilted-card"
```

---

### Task 9: Skills/Stack rewrite — drop magic-bento

**Files:**
- Modify: `src/components/sections/SkillsStackSection.tsx` (full rewrite)
- Delete: `src/components/kokonutui/BentoGrid.tsx`

**Interfaces:**
- Consumes: `PillTag`, `ImagePlaceholder` (Task 2)
- Produces: `SkillsStackSection` with id `skills` (unchanged id) — category+paragraph+tag list replaces the bento grid, paired with one large + one inset image slot.

- [ ] **Step 1: Rewrite the file**

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { PillTag } from "@/components/ui/PillTag";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { BlurText } from "@/components/reactbits/BlurText";

interface SkillCategory {
  title: string;
  description: string;
  tags: string[];
}

const categories: SkillCategory[] = [
  {
    title: "Salesforce / Agentforce",
    description:
      "Agentforce Configuration, Agentforce Actions, Flow Builder, Agent Instructions, Lightning Knowledge, Case Management.",
    tags: ["Agentforce", "Flow Builder", "Apex Basics", "Lightning"],
  },
  {
    title: "Languages & Web",
    description: "JavaScript, C / C++ (Embedded), Python, SQL, HTML / CSS, React, Vite, REST APIs.",
    tags: ["JavaScript", "Python", "C / C++", "React"],
  },
  {
    title: "AI / ML & Tooling",
    description: "LLM workflows (Agentforce), computer vision (YOLOv8), Git, Figma, Agile / Scrum.",
    tags: ["YOLOv8", "Git", "Figma", "Agile"],
  },
];

export default function SkillsStackSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" ref={ref} className="relative w-full bg-em-bg px-6 py-24 md:px-16">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
        <div className="space-y-10">
          <h2 className="font-display text-4xl font-bold tracking-tight text-em-text md:text-5xl">
            <BlurText text="What I build with" delay={0.03} duration={0.6} ease="easeOut" />
          </h2>
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3 className="font-display text-xl font-semibold text-em-text">{cat.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-em-text-muted">{cat.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {cat.tags.map((tag) => (
                  <PillTag key={tag}>{tag}</PillTag>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="relative">
          <ImagePlaceholder
            alt="A wide shot of Paolo's development setup"
            aspectRatio="4 / 5"
            label="Workspace photo"
            className="rounded-sm"
          />
          <ImagePlaceholder
            alt="A close-up screenshot of Agentforce Flow Builder"
            aspectRatio="4 / 3"
            label="Screenshot"
            className="absolute -bottom-8 -left-8 w-2/3 rounded-sm shadow-xl md:-left-12"
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete the now-unused BentoGrid**

```bash
git rm src/components/kokonutui/BentoGrid.tsx
```
If `src/components/kokonutui/` is now empty, remove the directory too.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run dev
```
Open `http://localhost:3000`, scroll to Skills. Expected: 3 stacked categories with paragraph + pill tags on the left, one large + one smaller overlapping placeholder image on the right. No 3D tilt-on-hover bento cards.

- [ ] **Step 4: Commit**

```bash
git add -- src/components/sections/SkillsStackSection.tsx
git commit -m "feat: replace magic-bento Skills grid with category/pill-tag layout"
```

---

### Task 10: Mission statement (new)

**Files:**
- Create: `src/components/sections/MissionStatementSection.tsx`
- Modify: `src/app/page.tsx` (mount between Skills and Process)

**Interfaces:**
- Produces: `MissionStatementSection` with id `mission` — centered pull-quote, no imagery.

- [ ] **Step 1: Create the file**

```tsx
"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { BlurText } from "@/components/reactbits/BlurText";

export default function MissionStatementSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="mission" ref={ref} className="relative w-full bg-em-bg px-6 py-32 md:px-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-em-accent">My approach</p>
        <p className="font-display text-3xl font-medium leading-snug text-em-text md:text-4xl">
          {inView && (
            <BlurText
              text="I trace every problem to its root cause before I touch a fix — whether that's a misfiring Agentforce action or a computer-vision model stalled for two months. Systems built that way keep working after I leave the room."
              delay={0.015}
              duration={0.5}
              ease="easeOut"
            />
          )}
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Mount it in `page.tsx`**

Add `import MissionStatementSection from "@/components/sections/MissionStatementSection";` and place `<MissionStatementSection />` between `<SkillsStackSection />` and `<ProcessTimelineSection />`.

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run dev
```
Open `http://localhost:3000`, scroll between Skills and Process. Expected: a centered pull-quote section with no imagery, blur-reveals in on scroll.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/MissionStatementSection.tsx src/app/page.tsx
git commit -m "feat: add Mission statement manifesto section"
```

---

### Task 11: Process rewrite — arch anchor + card grid

**Files:**
- Modify: `src/components/sections/ProcessTimelineSection.tsx` (full rewrite, drops the GSAP line-draw)

**Interfaces:**
- Produces: `ProcessTimelineSection` with id `process` (unchanged id) — solid rust arch anchor beside a 2×2 card grid, no more GSAP-driven scaleY line.

- [ ] **Step 1: Rewrite the file**

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BlurText } from "@/components/reactbits/BlurText";

interface Step {
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    title: "Diagnose",
    description:
      "Trace a problem to its root cause instead of patching symptoms — whether that's a wrong Agentforce action or a stalled model architecture.",
  },
  {
    title: "Redesign",
    description:
      "Rebuild the approach around the real constraint, like the object-detection redesign that cleared a two-month stall on SMARTBIN 3.",
  },
  {
    title: "Build",
    description: "Ship working systems — Agentforce agents in production, firmware on real hardware, code that runs.",
  },
  {
    title: "Verify",
    description:
      "Test against the real target, not assumptions — 98.67% detection accuracy, mandatory case-closure reasons, checks that hold.",
  },
];

export default function ProcessTimelineSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="process" ref={ref} className="relative w-full bg-em-bg px-6 py-24 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 md:flex-row md:items-start">
        <div className="flex h-40 w-40 shrink-0 items-end justify-start rounded-tr-full bg-em-accent p-6 md:h-56 md:w-56">
          <span className="font-display text-2xl font-bold text-em-invert-text md:text-3xl">PROCESS</span>
        </div>

        <div className="grid flex-1 gap-6 sm:grid-cols-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="rounded-sm border border-em-text/15 p-6"
            >
              <span className="font-mono text-xs text-em-accent">0{i + 1}</span>
              <h3 className="font-display mt-2 text-xl font-semibold text-em-text">
                {i === 0 ? <BlurText text={step.title} delay={0.03} duration={0.5} /> : step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-em-text-muted">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run dev
```
Open `http://localhost:3000`, scroll to Process. Expected: a solid rust quarter-circle/arch block with "PROCESS" label, beside a 2×2 grid of the 4 real steps. No vertical line-draw animation.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ProcessTimelineSection.tsx
git commit -m "feat: replace Process line-draw timeline with arch anchor + card grid"
```

---

### Task 12: Contact + Footer rewrite — palette inversion + spec-sheet credit line

**Files:**
- Modify: `src/components/sections/ContactSection.tsx` (full rewrite, removes Lightfall)
- Modify: `src/components/layout/Footer.tsx` (full rewrite)
- Delete: `src/components/reactbits/Lightfall.tsx`, `src/components/reactbits/Lightfall.css`

**Interfaces:**
- Produces: `ContactSection` with id `contact` — near-black `bg-em-invert-bg` panel, form restyled with terracotta focus rings, no Lightfall canvas.
- Produces: `Footer()` — 3-column spec-sheet credit line ("Design & Development" / "Based In" / "Available For Work") + plain-text social list, replacing the single copyright-line footer.

- [ ] **Step 1: Rewrite `ContactSection.tsx`**

```tsx
"use client";

import { useRef, useState, FormEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Send } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { BlurText } from "@/components/reactbits/BlurText";
import { Footer } from "@/components/layout/Footer";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative w-full bg-em-invert-bg">
      <section id="contact" ref={ref} className="relative px-6 py-32 md:px-16">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-em-accent">Contact</p>
            <h2 className="font-display text-4xl font-bold tracking-tight text-em-invert-text md:text-5xl">
              <BlurText text="Let's build something" delay={0.03} duration={0.6} ease="easeOut" />
            </h2>
            <p className="mt-4 text-em-invert-muted">
              Actively looking for new opportunities — happy to talk Salesforce, Agentforce, or the
              engineering behind this site.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-sm border border-em-accent/30 bg-em-accent/5 p-10 text-center"
            >
              <p className="text-lg font-medium text-em-invert-text">Message received.</p>
              <p className="mt-2 text-em-invert-muted">I&apos;ll get back to you soon.</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-em-invert-muted">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-sm border border-em-invert-text/15 bg-em-invert-text/5 px-4 py-3 text-em-invert-text placeholder-em-invert-muted transition-colors focus:border-em-accent focus:outline-none focus:ring-2 focus:ring-em-accent/30"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-em-invert-muted">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-sm border border-em-invert-text/15 bg-em-invert-text/5 px-4 py-3 text-em-invert-text placeholder-em-invert-muted transition-colors focus:border-em-accent focus:outline-none focus:ring-2 focus:ring-em-accent/30"
                    placeholder="you@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-em-invert-muted">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full resize-none rounded-sm border border-em-invert-text/15 bg-em-invert-text/5 px-4 py-3 text-em-invert-text placeholder-em-invert-muted transition-colors focus:border-em-accent focus:outline-none focus:ring-2 focus:ring-em-accent/30"
                  placeholder="Tell me about your project..."
                />
              </div>

              <div className="flex justify-center pt-2">
                <GradientButton type="submit" size="lg" className="gap-2" magnetic>
                  <Send size={16} />
                  Send message
                </GradientButton>
              </div>
            </motion.form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `Footer.tsx`**

```tsx
import { Code2, Link2, Mail } from "lucide-react";

const socialLinks = [
  { href: "https://github.com/shuu-pao", icon: Code2, label: "GitHub" },
  { href: "https://www.linkedin.com/in/paolo-jansen-enrera/", icon: Link2, label: "LinkedIn" },
  { href: "mailto:paolo.enrera@gmail.com", icon: Mail, label: "Email" },
];

const creditFields = [
  { label: "Design & Development", value: "Paolo Jansen Enrera" },
  { label: "Based In", value: "Cebu City, Philippines" },
  { label: "Available For Work", value: "Salesforce, Agentforce, Full-time" },
];

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-em-invert-text/10 px-6 py-12 md:px-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <div className="flex items-center gap-4 self-end">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="cursor-pointer rounded-lg p-2 text-em-invert-muted transition-colors hover:bg-em-accent/10 hover:text-em-accent"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

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

- [ ] **Step 3: Delete Lightfall and its stylesheet, and remove `ogl` (final confirmation)**

```bash
git rm src/components/reactbits/Lightfall.tsx src/components/reactbits/Lightfall.css
```
Confirm `ogl` is absent from `package.json` (it was removed in Task 1, Step 1 — this is the last file that could have referenced it; if `npm ls ogl` still shows it installed, run `npm uninstall ogl` again here).

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run dev
```
Open `http://localhost:3000`, scroll to Contact. Expected: the panel flips to a near-black background with warm off-white text and terracotta focus rings on the form inputs — the one structural palette-inversion beat. No Lightfall canvas anywhere on the page. Footer shows the 3-column credit line and plain-text social icons.

- [ ] **Step 5: Commit**

```bash
git add -- src/components/sections/ContactSection.tsx src/components/layout/Footer.tsx package.json package-lock.json
git commit -m "feat: invert Contact/Footer palette, add spec-sheet credit line, remove Lightfall"
```

---

### Task 13: Persistent section-index side-tab

**Files:**
- Create: `src/hooks/use-active-section.ts`
- Create: `src/components/layout/SectionIndexTab.tsx`
- Modify: `src/app/page.tsx` (mount alongside `Navbar`)

**Interfaces:**
- Produces: `useActiveSection(sections: { id: string; label: string }[]): { id: string; label: string }` — `IntersectionObserver`-driven, returns the section currently closest to viewport center.
- Produces: `SectionIndexTab()` — fixed right-edge index label, hidden below `md`. By this task, all 7 section ids (`hero`, `intro`, `work`, `skills`, `mission`, `process`, `contact`) already exist from Tasks 6–12.

- [ ] **Step 1: Create `use-active-section.ts`**

```ts
"use client";

import { useEffect, useState } from "react";

export interface SectionInfo {
  id: string;
  label: string;
}

export function useActiveSection(sections: SectionInfo[]): SectionInfo {
  const [active, setActive] = useState<SectionInfo>(sections[0]);

  useEffect(() => {
    const elements = sections
      .map((s) => ({ section: s, el: document.getElementById(s.id) }))
      .filter((e): e is { section: SectionInfo; el: HTMLElement } => e.el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const match = elements.find((e) => e.el === visible.target);
          if (match) setActive(match.section);
        }
      },
      { threshold: [0.3, 0.5, 0.7], rootMargin: "-40% 0px -40% 0px" }
    );

    elements.forEach((e) => observer.observe(e.el));
    return () => observer.disconnect();
  }, [sections]);

  return active;
}
```

- [ ] **Step 2: Create `SectionIndexTab.tsx`**

```tsx
"use client";

import { useActiveSection, type SectionInfo } from "@/hooks/use-active-section";

const SECTIONS: SectionInfo[] = [
  { id: "hero", label: "Hero" },
  { id: "intro", label: "Intro" },
  { id: "work", label: "Selected Work" },
  { id: "skills", label: "Skills" },
  { id: "mission", label: "Mission" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

export function SectionIndexTab() {
  const active = useActiveSection(SECTIONS);
  const index = SECTIONS.findIndex((s) => s.id === active.id);

  return (
    <div
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-1 font-mono text-xs uppercase tracking-[0.15em] text-em-text-muted md:flex"
      aria-hidden="true"
    >
      <span className="text-em-accent">{String(index + 1).padStart(2, "0")}</span>
      <span>{active.label}</span>
    </div>
  );
}
```

- [ ] **Step 3: Mount in `page.tsx`**

Add `import { SectionIndexTab } from "@/components/layout/SectionIndexTab";` and render `<SectionIndexTab />` right after `<Navbar />`.

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run dev
```
Open `http://localhost:3000` at a viewport ≥768px wide. Expected: a right-edge label reading "01 — Hero" that updates to "02 — Intro", "03 — Selected Work", etc. as you scroll through every section. Resize below 768px — the tab disappears.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/use-active-section.ts src/components/layout/SectionIndexTab.tsx src/app/page.tsx
git commit -m "feat: add persistent section-index side-tab"
```

---

### Task 14: Final assembly check & full-site verification

**Files:**
- Modify: `src/app/page.tsx` (only if section order doesn't already match)

**Interfaces:**
- None — this task only verifies the accumulated result of Tasks 1–13.

- [ ] **Step 1: Confirm final section order**

Open `src/app/page.tsx` and confirm it reads:

```tsx
import HeroSection from "@/components/sections/HeroSection";
import IntroBioSection from "@/components/sections/IntroBioSection";
import PortfolioGallerySection from "@/components/sections/PortfolioGallerySection";
import SkillsStackSection from "@/components/sections/SkillsStackSection";
import MissionStatementSection from "@/components/sections/MissionStatementSection";
import ProcessTimelineSection from "@/components/sections/ProcessTimelineSection";
import ContactSection from "@/components/sections/ContactSection";
import { Navbar } from "@/components/layout/Navbar";
import { SectionIndexTab } from "@/components/layout/SectionIndexTab";

export default function Home() {
  return (
    <>
      <Navbar />
      <SectionIndexTab />
      <main className="relative min-h-screen w-full bg-em-bg">
        <HeroSection />
        <IntroBioSection />
        <PortfolioGallerySection />
        <SkillsStackSection />
        <MissionStatementSection />
        <ProcessTimelineSection />
        <ContactSection />
      </main>
    </>
  );
}
```

If it doesn't match exactly (order or missing imports), fix it now.

- [ ] **Step 2: Full compile/lint/build pass**

```bash
npx tsc --noEmit
npm run lint
npm run build
```
Expected: all three exit 0. The production build additionally confirms the removed `ogl`/`Lightfall`/`ScrollVelocity`/`CountUp`/`BentoGrid` files left no dangling imports anywhere.

- [ ] **Step 3: Full visual walkthrough (desktop)**

```bash
npm run dev
```
Using the Playwright MCP tools (`browser_navigate` to `http://localhost:3000`, `browser_resize` to 1440×900, `browser_take_screenshot` per section after scrolling), confirm in order: Hero (name/marquee/photo+cursive/paragraphs, no Lightfall), Intro/Bio (two photos + statement), Selected Work (sticky-headline occlusion visible, modal opens/closes), Skills (category/pill-tag list + layered images, no bento tilt), Mission (centered pull-quote), Process (arch + 2×2 grid), Contact/Footer (palette inverts to near-black, spec-sheet credit line, form works). Confirm the section-index tab updates throughout and the Menu overlay opens/closes correctly from any scroll position.

- [ ] **Step 4: Mobile viewport check**

`browser_resize` to 375×812. Confirm: no horizontal scroll on any section, section-index tab is hidden, Hero name/marquee still readable, Menu overlay still works, Contact form still usable.

- [ ] **Step 5: Reduced-motion check**

`browser_evaluate` to set `prefers-reduced-motion: reduce` (or use OS-level emulation if the Playwright tool supports `page.emulateMedia`), reload, and confirm: marquee is frozen, Lenis smooth-scroll is disabled (native scroll feel), BlurText reveals still show content (no animation, but not stuck invisible).

- [ ] **Step 6: Final commit**

```bash
git add -- src/app/page.tsx
git commit -m "chore: confirm final editorial redesign section order and pass full verification"
```
(Skip this commit if Step 1 required no changes — nothing to stage.)

---

## Self-Review Notes

- **Spec coverage:** §1 Vision → Tasks 6–12 (Hero/Jasmine split). §2.1 Typography → Task 1. §2.2 Color → Task 1. §3.1 Navigation → Tasks 4–5, 13. §3.2 Section order → Tasks 6–13, confirmed in Task 14. §4 Component mapping → Tasks 6 (Marquee/Hero), 8 (Work pin→sticky), 9 (Skills), 10 (Mission), 11 (Process), 12 (Contact/Footer). §5 Performance & Accessibility → Task 3 (Lenis, dynamic GSAP import), Task 1 (contrast tokens), Task 12 (invert contrast), reduced-motion checked in every task's verification and Task 14 Step 5. §6 Imagery strategy → Task 2 (`ImagePlaceholder`), consumed everywhere. §7 Out of scope → confirmed nothing in this plan builds testimonials, a custom cursor, or a stat-counter row.
- **Type consistency checked:** `Project` interface (`year`, `imageSrc`) matches between its Task 8 definition and every place it's read. `ImagePlaceholderProps`/`PillTagProps` (Task 2) match every call site in Tasks 6, 7, 8, 9. `SectionInfo` (Task 13) matches between `use-active-section.ts` and `SectionIndexTab.tsx`.
- **One documented deviation from the design spec:** §4 lists "GSAP ScrollTrigger (`pin`)" for Selected Work; Task 8 implements the same sticky-headline occlusion visual effect with pure CSS `position: sticky` instead. Same visual result, no extra JS timeline, no added bundle cost — a deliberate simplification, not a scope cut.
- **Placeholder scan:** no TBD/TODO markers; every step has real, complete code. The one open numeric-tuning note (Task 8, Step 2 — sticky-offset values) is a real, working starting value with explicit visual-check instructions, not an unfinished placeholder.

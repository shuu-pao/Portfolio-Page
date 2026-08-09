# Portfolio Redesign Roadmap — Mees Verberne (Hero) + Jasmine Maduafokwa (everything after)

**Read this file first in any new conversation about "continuing the redesign" or "unfinished tasks."** It is the single source of truth for what's done, what's next, and which older docs in this repo are stale.

## Standing directives (apply to every remaining phase)

- **Do not use the pre-redesign codebase as a design reference.** Every section is rebuilt purely from the two reference sites' screenshots/live DOM, per the user's explicit instruction early in this effort. Shared infrastructure (design tokens, fonts, hooks, `ImagePlaceholder`, `BlurText`) is not "design" and is reused freely.
- **1:1 fidelity requirement:** for every section, design/size/position/animation must match its reference site 1:1 — not approximated. Measure reference layouts programmatically (Python/PIL pixel analysis on screenshots, or better, live-DOM `getBoundingClientRect()`/`getComputedStyle()` via the Playwright MCP tools when the reference site is reachable — DOM measurement proved far more precise than screenshot pixel-guessing during Phase 2 and is now the preferred method). Convert measured values to percentages/responsive units, implement, then verify the built result against the same measurements before calling a task done.
- **Workflow per phase:** brainstorming skill (clarify + measure + design) → spec doc in `docs/superpowers/specs/` → writing-plans skill → plan doc in `docs/superpowers/plans/` → subagent-driven-development (fresh implementer per task, task review, final whole-branch review, one fix wave if needed) → SDD workspace at `.superpowers/sdd/<plan-basename>/` (deleted after final review goes clean — git history is the permanent record after that).
- **Repo convention:** work happens directly on `main`, no worktrees, no PRs — solo project, user has explicitly consented to this for the whole redesign effort. Commit only when the user asks, or as part of an SDD task's own commit step (which the user has pre-approved by choosing Subagent-Driven execution).
- Full reference-image assets (Mees + Jasmine screenshots, `mees-*.png/jpeg`, `jasmine-*.png/jpeg`, `ref-mees-*`) live untracked in the repo root — still there, still usable for future phases.

## Which docs in this repo are CURRENT vs. STALE

This repo has design/plan docs from an earlier, unrelated redesign attempt that predates this Mees/Jasmine effort and was explicitly superseded by it. Do not read or reference these for design decisions:
- `docs/superpowers/specs/2026-07-29-premium-portfolio-design.md` — STALE
- `docs/superpowers/specs/2026-07-31-lightfall-anchored-redesign-design.md` — STALE
- `docs/superpowers/plans/2026-07-31-lightfall-anchored-redesign.md` — STALE
- `docs/superpowers/specs/2026-08-01-editorial-portfolio-redesign-design.md` — STALE
- `docs/superpowers/plans/2026-08-01-editorial-portfolio-redesign.md` — STALE

Current, authoritative docs for this effort (one spec + one plan per phase, listed under each phase below).

## Phase status

| # | Phase | Reference | Status | Spec | Plan |
|---|-------|-----------|--------|------|------|
| 1 | Hero (name lockup, marquee, photo, overlay bio/cursive, subheading) | meesverberne.com | **Done** | `specs/2026-08-02-hero-mees-redesign-design.md` (§1 has a "superseded by Task 4" note — Task 4's plan text is authoritative over that spec's original layout numbers) | `plans/2026-08-02-hero-mees-redesign.md` |
| 2 | Intro tagline (4-line reveal) + two-image staggered bio block | jasminemaduafokwa.com | **Done** | `specs/2026-08-02-intro-tagline-bio-redesign-design.md` | `plans/2026-08-02-intro-tagline-bio-redesign.md` |
| 3 | Selected Work section polish (project cards: year + skills tags, card layout) | jasminemaduafokwa.com | **Done** | `specs/2026-08-03-selected-work-redesign-design.md` | `plans/2026-08-03-selected-work-redesign.md` |
| 4 | Skills/Services section: 4 tabs (Frontend Dev / Backend Dev / UI Design / Brand Identity) with hover-swapped image pair (one large + one smaller inset) | jasminemaduafokwa.com | **Done** | `specs/2026-08-03-skills-services-redesign-design.md` | `plans/2026-08-03-skills-services-redesign.md` |
| 5 | Mission statement section polish | jasminemaduafokwa.com | **Done** | `specs/2026-08-03-mission-statement-redesign-design.md` | `plans/2026-08-03-mission-statement-redesign.md` |
| 6 | Process section: hover-to-reveal-more-info cards | jasminemaduafokwa.com | **Done** | `specs/2026-08-03-process-section-redesign-design.md` | `plans/2026-08-03-process-section-redesign.md` |
| 7 | "Let's Talk" CTA section + Contact section (Email/GitHub/LinkedIn/Instagram, no Behance) + `/contact` page | jasminemaduafokwa.com | **Done** | `specs/2026-08-03-contact-cta-redesign-design.md`, `specs/2026-08-09-contact-page-letstalk-redesign-design.md` | `plans/2026-08-03-contact-cta-redesign.md`; corrected `plans/2026-08-09-contact-page-letstalk-redesign.md` (the original pass left the marquee non-interactive and `/contact` as a bare redirect — reference actually has a real `/contact` page and the marquee is a hover-animated link to it) |
| 8 | Loading screen (evaluate need — reference site has one, to prevent animation-heavy first paint jank) | jasminemaduafokwa.com | Not started | — | — |

Component files already in place for later phases (from the pre-redesign codebase, not yet rebuilt to match Jasmine): `PortfolioGallerySection.tsx` (Phase 3), `SkillsStackSection.tsx` (Phase 4), `MissionStatementSection.tsx` (Phase 5), `ProcessTimelineSection.tsx` (Phase 6), `ContactSection.tsx` (Phase 7). Treat their current contents as scaffolding to replace, not a baseline, per the standing directive above.

## Mobile refinement pass (started 2026-08-10)

New effort, not part of the original 8 phases above: desktop is fully polished (Phases 1–7 Done), now refining the **mobile view** section by section, same references (Mees for Hero, Jasmine for everything after, including `/contact`). User chose section-by-section (brainstorm → spec → implement → user reviews the live result → next section), not one batch phase. No separate plan-doc/SDD ceremony per section — spec doc + direct implementation + live screenshot check is enough for a single-component mobile pass.

**Standing step, added 2026-08-10 after M2/M4/M5 corrections:** after each change, screenshot the local build's changed section *and* the reference site's equivalent section at the same viewport width, and compare them directly — don't just eyeball the local result or measure raw `<img>`/element rects in isolation. That alone still isn't enough: **measure actual pixel dimensions of the load-bearing elements (frame/inset/container sizes, and each text line's rendered height) via `getBoundingClientRect()` on both sites, not just overall layout shape from a screenshot.** Three distinct misses so far, all caught by the user rather than the check: M2 measured a reference `<img>` tag directly and got fooled by an `overflow-hidden` crop frame (the frame div, not the oversized img, was the real visible boundary). M4 screenshotted both sites and judged the layout "matches" by eye, missing that the mobile backdrop image rendered at less than half the reference's height (a missing `aspectRatio` prop). M5 measured horizontal layout (widths/gaps) correctly but not per-line rendered height, missing that two lines were silently wrapping onto 2 rows each, nearly doubling the block's height. The pattern: **measure every dimension that could plausibly be wrong, not just the ones the current hypothesis is checking** — width, height, and per-line wrap state all need a pixel check, every time, not just whichever one seems relevant.

| # | Section | Status | Spec | Outcome |
|---|---------|--------|------|---------|
| M1 | Hero | **Done** | `specs/2026-08-10-hero-mobile-refinement-design.md` | Live-measured Mees's actual mobile hero (photo is a near-invisible background layer behind the text, not a framed image). User rejected true 1:1 (wanted photo visible) and an adapted inset-overlap version (broke the desktop grid when unified into one responsive tree). Reverted to the pre-existing simple-stack layout. Reopened after M5: marquee→image and image→text gaps measured 56px each, too much per user feedback; tightened mobile-only (`mt-16`→`mt-8`, `gap-10`→`gap-6`, removed a redundant `mt-6`) to 28px/21px. User confirmed. |
| M2 | Intro tagline + bio | **Done** | `specs/2026-08-10-intro-tagline-bio-mobile-refinement-design.md` | Tagline lines already matched the reference, no change. Two-image block's gap corrected from 24px to ~8px after a first (wrong) attempt at bleed+overlap was caught by comparing directly against the reference and reverted. User confirmed. |
| M3 | Selected Work | **Done — no change** | `specs/2026-08-10-selected-work-mobile-refinement-design.md` | Compared directly against the reference at 390px (entry + mid-scroll for the sticky-heading overlap); cards, stagger margins, sticky pin, and tag wrapping already matched. User confirmed. |
| M4 | Skills/Services | **Done** | `specs/2026-08-10-skills-services-mobile-refinement-design.md` | First pass (screenshot-only comparison) wrongly concluded no gap. User caught the inset image rendering too small; pixel measurement found the backdrop's missing `aspectRatio` prop was collapsing the mobile frame height (338×211 vs reference's 340×510). Fixed with `aspectRatio="2 / 3"`, re-measured to 338×507/135×101 vs reference's 340×510/136×102. User confirmed. |
| M5 | Mission statement | **Done** | `specs/2026-08-10-mission-statement-mobile-refinement-design.md` | Three rounds of user-caught corrections: (1) lines 1-2 were wrapping onto 2 rows inside their narrow column — shortened to fit, block height 191px→140px. (2) excess space above/below the section — scoped fix tightened Mission's own mobile padding (`py-[6vh] md:py-[15vh]`), gap above 223px→147px, gap below 295px→220px. (3) user gave an exact target: reference's Services-end→next-block-start span measures 357px; matching it required also trimming `ProcessTimelineSection.tsx`'s mobile top padding (`py-[20vh]` → `pt-[13vh] pb-[20vh] md:py-[20vh]`, M6's file, ahead of its own phase) — total Skills-end→Process-start gap 410px→350px. User confirmed. |
| M6 | Process | **Done** | `specs/2026-08-10-process-mobile-refinement-design.md` | Mobile top padding already trimmed as part of M5's cross-section gap-matching (`pt-[13vh]` vs desktop's `20vh`). User caught the closing "bookend" card (mirrors the opening PROCESS card's rounded corner) missing on mobile — it was `hidden` below `sm` with no mobile height even if shown. Fixed: `h-[30vh]`, always visible, matching the reference's own `h-[30vh] sm:h-auto lg:h-[55vh]` pattern exactly. Measured 253×338px vs reference's 253×340px. User confirmed. |
| M7 | Let's Talk CTA + Contact section | Not started | — | — |
| M8 | `/contact` page | Not started | — | — |

Resume by picking the first "Not started" row above and running the same section-by-section brainstorming flow.

## Confirmed user-provided content (reuse, don't re-ask)

- Name: Paolo Jansen Enrera
- Email: paolo.enrera@gmail.com
- GitHub: https://github.com/shuu-pao
- LinkedIn: https://www.linkedin.com/in/paolo-jansen-enrera/
- Instagram: https://www.instagram.com/shuu_paoo/
- No Behance — explicitly excluded from Contact.
- **All body/bio copy across every phase is explicitly placeholder** (user's own words, 2026-08-02) — the user plans to revise portfolio content after all design phases are finished. Don't hesitate to write placeholder copy in the reference's structural rhythm; don't treat copy polish as blocking.

## How to resume in a new conversation

1. Read this file.
2. Run `git log --oneline -15` and `git status --short` to confirm the actual current state (this file can drift stale — trust git over this doc if they disagree).
3. Find the first phase above still "Not started" (or "In progress" if one was left mid-flight — check for a live `.superpowers/sdd/<plan-basename>/progress.md` ledger, which survives until a phase's final review goes clean).
4. Continue the workflow from wherever that phase's spec/plan/SDD-progress docs leave off — invoke `superpowers:brainstorming` if no spec exists yet for that phase.

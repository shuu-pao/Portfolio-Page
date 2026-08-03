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
| 7 | "Let's Talk" CTA section + Contact section (Email/GitHub/LinkedIn/Instagram, no Behance) + `/contact` page | jasminemaduafokwa.com | Not started | — | — |
| 8 | Loading screen (evaluate need — reference site has one, to prevent animation-heavy first paint jank) | jasminemaduafokwa.com | Not started | — | — |

Component files already in place for later phases (from the pre-redesign codebase, not yet rebuilt to match Jasmine): `PortfolioGallerySection.tsx` (Phase 3), `SkillsStackSection.tsx` (Phase 4), `MissionStatementSection.tsx` (Phase 5), `ProcessTimelineSection.tsx` (Phase 6), `ContactSection.tsx` (Phase 7). Treat their current contents as scaffolding to replace, not a baseline, per the standing directive above.

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

# Dynamic Landing Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recompose the landing page into a more dynamic, less text-heavy sequence with a unified hero title and reusable portrait cards.

**Architecture:** Add a focused `PortraitCard` presentation component and reuse it in image-led sections. Convert dense prose into existing campaign-data-driven cards while preserving accessible semantic structure and the current motion loader. Keep behavior CSS-first except for the existing benefit carousel.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Vitest, Testing Library.

---

### Task 1: Lock the new visual contract in tests

**Files:**
- Modify: `components/landing/LandingPage.test.tsx`
- Modify: `components/landing/ClosingSections.test.tsx`

- [ ] Add assertions for one hero visual title wrapper, three recognition cards, and portrait-card markers in method, proof, and about.
- [ ] Run `npm test -- components/landing/LandingPage.test.tsx components/landing/ClosingSections.test.tsx` and confirm the new assertions fail.

### Task 2: Create the shared portrait card

**Files:**
- Create: `components/landing/PortraitCard.tsx`
- Modify: `components/landing/Hero.tsx`
- Modify: `components/landing/Method.tsx`
- Modify: `components/landing/Proof.tsx`
- Modify: `components/landing/About.tsx`
- Modify: `components/landing/landing.module.css`

- [ ] Implement `PortraitCard` with `Image`, optional identity text, optional anchor, section-specific modifier, and `data-portrait-card`.
- [ ] Replace four one-off image wrappers with `PortraitCard` while preserving alt text and intrinsic dimensions.
- [ ] Implement responsive card framing, top overflow, bottom gradient, and focus-visible treatment in the CSS module.
- [ ] Run the focused tests and confirm the portrait-card assertions pass.

### Task 3: Reduce text density and alternate formats

**Files:**
- Modify: `content/landing-pages/forro-do-zero.ts`
- Modify: `components/landing/Recognition.tsx`
- Modify: `components/landing/Method.tsx`
- Modify: `components/landing/ProcessFaq.tsx`
- Modify: `components/landing/landing.module.css`

- [ ] Shorten repeated body copy without changing factual meaning.
- [ ] Render recognition body entries as numbered cards and method pillars as compact interactive cards.
- [ ] Render process steps as a connected visual sequence and preserve semantic ordered lists.
- [ ] Run focused tests and confirm content and structure pass.

### Task 4: Add purposeful motion and responsive polish

**Files:**
- Modify: `components/landing/landing.module.css`
- Modify: `components/motion/*` only if the existing loader lacks the required selectors.

- [ ] Add transform/opacity reveal states through existing `data-reveal` and `data-stagger-group` hooks.
- [ ] Add fine-pointer-only card hover feedback and explicit `prefers-reduced-motion` fallbacks.
- [ ] Validate 430x932 and 1440x1000 in one browser pass, apply one consolidated correction, and confirm once.

### Task 5: Verify and ship locally

**Files:**
- Verify all modified source and asset files.

- [ ] Run `npm test` and require all tests to pass.
- [ ] Run `npm run typecheck` and require exit code 0.
- [ ] Run `npm run build` and require the static routes to build successfully.
- [ ] Run `git diff --check` and require no whitespace errors.
- [ ] Commit the implementation, start `npm run start -- --port 3001`, and verify HTTP 200.

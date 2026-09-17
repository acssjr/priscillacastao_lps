# Priscilla Castão Poster Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the first landing-page section as the approved “Forró do zero, no seu ritmo” central-poster hero, using real responsive HTML/CSS and a transparent Priscilla cutout that never escapes the hero bounds.

**Architecture:** Keep `LandingCampaign` as the single source of copy and WhatsApp data. Refactor only `Hero.tsx` into semantic content, visual title, portrait, and action layers; implement the poster composition in the existing CSS module. Point the campaign hero image at the optimized transparent WebP and verify the new DOM contract, asset budget, responsive containment, accessibility, and production build.

**Tech Stack:** Next.js 16.3.4, React 19, TypeScript, CSS Modules, `next/image`, Vitest, Testing Library, Playwright browser checks.

---

## File map

- Modify `components/landing/Hero.tsx`: semantic poster markup and title segmentation.
- Modify `components/landing/landing.module.css`: poster layers, responsive containment, CTA styling, and reduced-motion rules. Preserve the existing uncommitted header breakpoint work.
- Modify `content/landing-pages/forro-do-zero.ts`: make the optimized transparent cutout the hero image.
- Modify `components/landing/LandingPage.test.tsx`: assert the semantic hero and poster-layer contract.
- Modify `tests/assets.test.ts`: register the production cutout and apply the existing 100 KB hero budget to it.
- Add `public/images/cutouts/priscilla-castao-ensaio-02-cutout.webp`: production portrait already generated and validated at 1086×1449 with alpha.

### Task 1: Lock the poster contract with failing tests

**Files:**
- Modify: `components/landing/LandingPage.test.tsx`
- Modify: `tests/assets.test.ts`

- [ ] **Step 1: Replace the brittle hero paragraph count with poster-layer assertions**

In `components/landing/LandingPage.test.tsx`, update the first test to the following exact contract:

```tsx
it("renders an accessible central-poster hero", () => {
  const { container } = render(<LandingPage campaign={forroDoZeroCampaign} />);

  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1 })).toHaveAccessibleName(
    "Aprenda forró do zero, no seu ritmo.",
  );
  expect(container.querySelector("[data-hero-poster]")).toBeInTheDocument();
  expect(container.querySelector('[data-hero-word="forro"]')).toHaveTextContent("forró");
  expect(container.querySelector("[data-hero-highlight]")).toHaveTextContent("do zero,");
  expect(container.querySelector("[data-hero-portrait]")).toBeInTheDocument();
  expect(container.querySelector("[data-hero-actions]")).toBeInTheDocument();
  expect(screen.queryByText(forroDoZeroCampaign.hero.location)).not.toBeInTheDocument();
  expect(screen.getByText(forroDoZeroCampaign.hero.body[0])).toBeInTheDocument();
  expect(screen.getByRole("link", { name: forroDoZeroCampaign.hero.cta })).toHaveAttribute(
    "href",
    expect.stringContaining("wa.me/5575981234176"),
  );
});
```

- [ ] **Step 2: Register the new asset and move the budget assertion**

In `tests/assets.test.ts`, add the cutout to `assets`:

```ts
"public/images/cutouts/priscilla-castao-ensaio-02-cutout.webp",
```

Replace the hero budget test with:

```ts
it("keeps the transparent hero cutout below the agreed 100 KB budget", async () => {
  expect(
    (await stat("public/images/cutouts/priscilla-castao-ensaio-02-cutout.webp")).size,
  ).toBeLessThan(100_000);
});
```

- [ ] **Step 3: Run the focused tests and verify the DOM contract fails**

Run:

```powershell
npm test -- components/landing/LandingPage.test.tsx tests/assets.test.ts
```

Expected: `tests/assets.test.ts` passes because the file already exists; `LandingPage.test.tsx` fails because `[data-hero-poster]`, `[data-hero-word]`, `[data-hero-portrait]`, and `[data-hero-actions]` do not exist yet.

- [ ] **Step 4: Commit only the test contract**

```powershell
git add -- components/landing/LandingPage.test.tsx tests/assets.test.ts
git commit -m "test: define poster hero contract"
```

Before committing, confirm that `git diff --cached --name-only` lists only those two files. Preserve the existing navigation assertions already present in `tests/assets.test.ts`.

### Task 2: Switch the campaign to the transparent production portrait

**Files:**
- Modify: `content/landing-pages/forro-do-zero.ts:3-8`
- Add: `public/images/cutouts/priscilla-castao-ensaio-02-cutout.webp`

- [ ] **Step 1: Update the hero image metadata**

Replace `heroImage` with:

```ts
const heroImage = {
  src: "/images/cutouts/priscilla-castao-ensaio-02-cutout.webp",
  alt: "Priscilla Castão em pose de forró com os braços elevados",
  width: 1086,
  height: 1449,
};
```

- [ ] **Step 2: Run schema and asset tests**

```powershell
npm test -- content/landing-pages/schema.test.ts tests/assets.test.ts
```

Expected: both test files pass; the asset remains below 100,000 bytes.

- [ ] **Step 3: Commit the production asset contract**

```powershell
git add -- content/landing-pages/forro-do-zero.ts public/images/cutouts/priscilla-castao-ensaio-02-cutout.webp
git commit -m "feat: add transparent hero portrait"
```

### Task 3: Refactor the hero into semantic poster layers

**Files:**
- Modify: `components/landing/Hero.tsx`
- Test: `components/landing/LandingPage.test.tsx`

- [ ] **Step 1: Add reusable title segmentation inside `Hero`**

Keep the existing highlight lookup, then split the words before the highlight so the campaign remains the content source:

```tsx
const highlightStart = hero.title.indexOf(hero.titleHighlight);
const titleBefore = hero.title.slice(0, highlightStart).trim();
const titleAfter = hero.title.slice(highlightStart + hero.titleHighlight.length).trim();
const titleBeforeWords = titleBefore.split(/\s+/);
const titleSubject = titleBeforeWords.pop() ?? "";
const titleLead = titleBeforeWords.join(" ");
```

- [ ] **Step 2: Replace the existing section markup with the poster structure**

Use this JSX inside the component return:

```tsx
<section
  className={styles.hero}
  id="inicio"
  aria-labelledby="hero-title"
  data-hero-poster
  data-motion="hero"
  data-reveal="hero"
>
  <div className={styles.heroBackdrop} aria-hidden="true" />

  <div className={styles.heroStage}>
    <p className={`${styles.eyebrow} ${styles.heroEyebrow}`}>{hero.eyebrow}</p>

    <h1 className={styles.heroTitle} id="hero-title" aria-label={hero.title}>
      <span className={styles.heroTitleVisual} aria-hidden="true">
        <span className={styles.heroLead}>{titleLead}</span>
        <span className={styles.heroSubject} data-hero-word="forro">{titleSubject}</span>
        <span className={styles.heroHighlight} data-hero-highlight>{hero.titleHighlight}</span>
        <span className={styles.heroClose}>{titleAfter}</span>
      </span>
    </h1>

    <div className={styles.heroPortrait} data-hero-portrait>
      <Image
        src={hero.image.src}
        alt={hero.image.alt}
        width={hero.image.width}
        height={hero.image.height}
        sizes="(max-width: 832px) 76vw, (max-width: 1088px) 46vw, 34rem"
        priority
      />
    </div>

    <div className={styles.heroActions} data-hero-actions>
      {hero.body.map((paragraph) => <p className={styles.heroSubheadline} key={paragraph}>{paragraph}</p>)}
      <WhatsAppLink
        id="hero-primary-cta"
        glow
        className={styles.primaryCta}
        phone={whatsapp.phone}
        message={whatsapp.messages.individual}
        placement="hero"
        offer="individual"
      >
        <span className={styles.primaryCtaLabel}>{hero.cta}</span>
        <span className={styles.primaryCtaArrow} aria-hidden="true">→</span>
      </WhatsAppLink>
      <p className={styles.ctaNote} data-cta-note>
        {hero.ctaNote.lead}, {hero.ctaNote.bridge} {hero.ctaNote.details}.
      </p>
    </div>
  </div>
</section>
```

- [ ] **Step 3: Run the hero test**

```powershell
npm test -- components/landing/LandingPage.test.tsx
```

Expected: the central-poster test passes. The motion-contract test continues to pass because the hero still exposes `data-reveal`.

- [ ] **Step 4: Commit the semantic markup**

```powershell
git add -- components/landing/Hero.tsx components/landing/LandingPage.test.tsx
git commit -m "feat: structure poster hero layers"
```

### Task 4: Implement the responsive central-poster composition

**Files:**
- Modify: `components/landing/landing.module.css:276-396`
- Preserve: existing uncommitted header rules at the end of `components/landing/landing.module.css`

- [ ] **Step 1: Replace only the current hero rule block**

Replace the rules from `.hero` through `.heroMedia img` with the following poster rules. Do not rewrite the rest of the CSS file.

```css
.hero {
  position: relative;
  min-height: max(100svh, 52rem);
  padding: calc(var(--header-height) + var(--space-6)) var(--space-4) var(--space-8);
  overflow: clip;
  background: var(--brand-dark);
  color: var(--on-dark);
  isolation: isolate;
}

.heroBackdrop {
  position: absolute;
  z-index: -1;
  inset: 0;
  background:
    radial-gradient(circle at 58% 38%, rgb(215 80 55 / 48%), transparent 34%),
    radial-gradient(circle at 50% 38%, transparent 0 31%, rgb(225 112 75 / 36%) 31.2% 31.45%, transparent 31.7%),
    linear-gradient(145deg, #3b0711 0%, #741326 48%, #2a070d 100%);
}

.heroBackdrop::after {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgb(255 255 255 / 1.5%) 1px, transparent 1px);
  background-size: 100% 4px;
  content: "";
  opacity: 0.3;
  pointer-events: none;
}

.heroStage {
  position: relative;
  display: grid;
  grid-template-rows: auto auto minmax(24rem, 1fr) auto;
  width: min(100%, 40rem);
  min-height: calc(max(100svh, 52rem) - var(--header-height) - var(--space-12));
  margin-inline: auto;
}

.heroEyebrow {
  position: relative;
  z-index: 5;
  width: fit-content;
  margin-bottom: var(--space-3);
  color: var(--surface-cream);
}

.heroEyebrow::after {
  display: block;
  width: 4rem;
  height: 2px;
  margin-top: var(--space-2);
  background: var(--brand-soft);
  content: "";
}

.heroTitle {
  display: contents;
}

.heroTitleVisual {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  color: var(--surface-paper);
  font-weight: 850;
  line-height: 0.82;
  letter-spacing: -0.065em;
  text-transform: uppercase;
}

.heroLead {
  grid-column: 1 / -1;
  margin-bottom: 0.25rem;
  font-size: clamp(0.78rem, 2.6vw, 1rem);
  letter-spacing: 0.18em;
  line-height: 1;
}

.heroSubject {
  grid-column: 1 / -1;
  font-size: clamp(5.7rem, 27vw, 10rem);
  white-space: nowrap;
}

.heroHighlight {
  align-self: start;
  width: fit-content;
  margin-top: -0.08em;
  padding: 0.13em 0.18em 0.17em;
  background: var(--surface-cream);
  color: var(--brand-dark);
  font-size: clamp(2.15rem, 10.5vw, 4rem);
  letter-spacing: -0.045em;
  line-height: 0.9;
  border-radius: 0.18em;
}

.heroClose {
  max-width: 5.4ch;
  margin-left: var(--space-3);
  font-size: clamp(1.65rem, 8vw, 3.1rem);
  line-height: 0.88;
}

.heroPortrait {
  position: absolute;
  z-index: 3;
  top: clamp(12.5rem, 30vw, 16rem);
  right: 2%;
  bottom: 10.5rem;
  left: 21%;
  display: grid;
  place-items: center;
  pointer-events: none;
}

.heroPortrait img {
  width: auto;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center bottom;
  filter: drop-shadow(0 1.5rem 2rem rgb(25 0 5 / 34%));
}

.heroActions {
  position: relative;
  z-index: 6;
  align-self: end;
  width: min(100%, 31rem);
  padding-top: var(--space-4);
}

.heroSubheadline {
  max-width: 33ch;
  margin: 0 0 var(--space-4);
  color: var(--surface-paper);
  font-size: clamp(0.98rem, 3vw, 1.125rem);
  font-weight: 520;
  line-height: 1.45;
}

.primaryCta {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 3.5rem;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: 0.9rem 1.25rem;
  overflow: hidden;
  background: linear-gradient(100deg, #a50c2b, var(--brand-primary));
  color: var(--on-dark);
  font-weight: 800;
  line-height: 1.2;
  text-decoration: none;
  border: 1px solid rgb(250 245 236 / 35%);
  border-radius: 999px;
  box-shadow: 0 0.75rem 2rem rgb(26 0 6 / 34%);
  isolation: isolate;
}

.primaryCtaArrow {
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1;
}

.ctaNote {
  max-width: 46ch;
  margin: var(--space-3) 0 0;
  color: rgb(250 245 236 / 78%);
  font-size: 0.8125rem;
  line-height: 1.45;
}
```

- [ ] **Step 2: Add tablet and desktop adaptations without touching header breakpoints**

Inside the existing `@media (min-width: 52rem)` block, add:

```css
.hero {
  min-height: 54rem;
  padding-inline: max(var(--space-8), calc((100vw - var(--content)) / 2));
}

.heroStage {
  width: min(100%, var(--content));
  min-height: 46rem;
  grid-template-columns: minmax(20rem, 0.9fr) minmax(20rem, 1.1fr);
  grid-template-rows: auto 1fr auto;
}

.heroEyebrow,
.heroTitle {
  grid-column: 1 / -1;
}

.heroTitleVisual {
  grid-template-columns: minmax(23rem, 0.9fr) minmax(18rem, 1.1fr);
}

.heroSubject {
  font-size: clamp(8.5rem, 17vw, 14rem);
}

.heroHighlight {
  grid-column: 1;
  font-size: clamp(3rem, 6vw, 5rem);
}

.heroClose {
  grid-column: 1;
  margin: var(--space-3) 0 0;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
}

.heroPortrait {
  top: 8rem;
  right: 2%;
  bottom: 1rem;
  left: 43%;
}

.heroActions {
  grid-column: 1;
  grid-row: 3;
  padding-bottom: var(--space-4);
}
```

Inside `@media (min-width: 68rem)`, add:

```css
.hero {
  min-height: min(58rem, 100svh);
}

.heroStage {
  min-height: calc(min(58rem, 100svh) - var(--header-height) - var(--space-10));
}

.heroPortrait {
  right: 5%;
  left: 48%;
}
```

- [ ] **Step 3: Add reduced-motion containment**

Append:

```css
@media (prefers-reduced-motion: reduce) {
  .heroPortrait,
  .heroTitleVisual,
  .heroActions {
    transform: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 4: Run tests and typecheck**

```powershell
npm test -- components/landing/LandingPage.test.tsx tests/assets.test.ts
npm run typecheck
```

Expected: all focused tests pass and TypeScript reports no errors.

- [ ] **Step 5: Run the Impeccable mechanical detector once**

```powershell
& 'C:\Users\antonio.santos\.agents\skills\impeccable\scripts\impeccable.cmd' detect --json components/landing/Hero.tsx components/landing/landing.module.css
```

Expected: no blocking findings. Fix valid findings in the same batch and rerun only the focused tests, not the detector.

- [ ] **Step 6: Commit the responsive visual implementation**

```powershell
git add -- components/landing/Hero.tsx components/landing/landing.module.css
git commit -m "feat: build central poster hero"
```

Stage the CSS file intentionally; its pre-existing header breakpoint changes must remain present in the commit rather than being reverted.

### Task 5: Verify the complete page and bounded visual result

**Files:**
- Verify: `components/landing/Hero.tsx`
- Verify: `components/landing/landing.module.css`
- Verify: `content/landing-pages/forro-do-zero.ts`
- Verify: `public/images/cutouts/priscilla-castao-ensaio-02-cutout.webp`

- [ ] **Step 1: Run the full automated checks**

```powershell
npm test
npm run typecheck
npm run build
```

Expected: all Vitest files pass, typecheck exits `0`, and the Next.js production build completes successfully.

- [ ] **Step 2: Start or reuse the development server**

```powershell
npm run dev
```

Expected: Next.js reports a ready URL. Reuse `http://localhost:3000` if the current server is still active; do not start a second server on another port unnecessarily.

- [ ] **Step 3: Perform one combined visual inspection**

Capture and inspect:

- Mobile: 430×932.
- Desktop: 1440×1000.

Check all of these in the same pass:

- hair, fingertips, elbows, skirt, legs, and feet remain inside the hero;
- no horizontal scrollbar;
- headline remains readable behind the portrait;
- CTA is fully visible and at least 52px tall;
- header does not cover the eyebrow or raised hands;
- transition into the recognition section has no unintended gap;
- focus outline is visible on the CTA;
- reduced-motion mode removes nonessential entrance movement.

- [ ] **Step 4: Apply one batched correction if inspection finds defects**

Limit corrections to `Hero.tsx` and `landing.module.css`. Adjust only sizing, grid placement, containment, contrast, or spacing demonstrated by the two screenshots. Re-run the focused hero test and typecheck afterward.

- [ ] **Step 5: Perform one confirmation pass**

Recheck 430×932 and 1440×1000 once. Stop after this confirmation if the acceptance criteria are satisfied.

- [ ] **Step 6: Review the final diff and report evidence**

```powershell
git status --short
git diff --check
git log -4 --oneline
```

Expected: no whitespace errors. Report the test, typecheck, build, viewport results, selected asset path, and exact commits. Do not include unrelated untracked concept images in an implementation commit unless explicitly requested.

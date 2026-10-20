import { expect, test } from "@playwright/test";

test("links show perimeter beams on hover and keep reduced motion static", async ({ page, isMobile }) => {
  await page.goto("/links");
  await expect(page.getByRole("progressbar")).toBeHidden();
  const beams = page.locator('span[class*="hoverBeam"]');
  await expect(beams).toHaveCount(5);
  for (const beam of await beams.all()) {
    await expect(beam).toHaveCSS("pointer-events", "none");
    if (!isMobile) {
      await beam.locator("..").hover();
      await expect(beam).toHaveCSS("opacity", "1");
      expect(await beam.evaluate(node => getComputedStyle(node, "::before").animationPlayState)).toBe("running");
      await page.mouse.move(0,0);
      await expect(beam).toHaveCSS("opacity", "0");
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const beam of await beams.all()) {
    expect(await beam.evaluate(node => getComputedStyle(node, "::before").animationName)).toBe("none");
  }
  await expect(page.locator('[class*="signature"] [class*="logo"]')).toHaveCSS("background-color", "rgb(241, 226, 201)");
});

test("catalogue hero text stays clear of the portrait across responsive boundaries", async ({ page }) => {
  for (const width of [320,393,430,600,767,799,800,834,1024,1440]) {
    await page.setViewportSize({width,height:932});
    await page.goto("/catalogo");
    const overlap = await page.evaluate(() => {
      const photo = document.querySelector('[class*="heroPhoto"]')!.getBoundingClientRect();
      return Array.from(document.querySelectorAll('[class*="intro"] h1,[class*="intro"]>p,[class*="intro"]>nav')).some(node => {
        const range = document.createRange(); range.selectNodeContents(node);
        return Array.from(range.getClientRects()).some(box => Math.min(box.right,photo.right)-Math.max(box.left,photo.left)>1 && Math.min(box.bottom,photo.bottom)-Math.max(box.top,photo.top)>1);
      });
    });
    expect(overlap, `Text overlaps the portrait at ${width}px`).toBe(false);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test("all five catalogue contact buttons have an active viewport-aware border beam", async ({ page }) => {
  await page.goto("/catalogo");
  const buttons = page.locator("[data-catalog-beam]");
  await expect(buttons).toHaveCount(5);
  for (const button of await buttons.all()) {
    await button.scrollIntoViewIfNeeded();
    await expect(button).toHaveAttribute("data-beam-visible", "");
    await expect(button.locator('span[aria-hidden="true"]>span')).toHaveCount(1);
  }
});

test("terracotta price cards retain readable values and a reduced-motion-safe beam", async ({ page }) => {
  await page.goto("/catalogo");
  const card = page.locator("#aula-individual [data-catalog-reveal]");
  await card.scrollIntoViewIfNeeded();
  await expect(card).toHaveAttribute("data-revealed", "true");
  await expect(card).toHaveCSS("backdrop-filter", "blur(20px) saturate(1.2)");
  await expect(card).toContainText("R$ 439,90");
  const cta = page.getByRole("link", { name: "Quero marcar minha aula", exact: true });
  await expect(cta).toHaveCSS("border-radius", "999px");
  await expect(cta).toHaveAttribute("data-beam-visible", "");
  const fill = cta.locator('span[class*="actionFill"]');
  await expect(fill).toHaveCSS("overflow", "hidden");
  await expect(fill).toHaveCSS("border-radius", "999px");
  expect(await fill.evaluate(node => getComputedStyle(node, "::before").transitionDuration)).toBe("0.28s");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--brand-primary").trim())).toBe("#864129");
  const rim = cta.locator('span[aria-hidden="true"]>span');
  expect(await rim.evaluate(node => getComputedStyle(node, "::before").animationPlayState)).toBe("running");
  expect(await rim.evaluate(node => getComputedStyle(node, "::before").animationIterationCount)).toBe("infinite");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await rim.evaluate(node => getComputedStyle(node, "::before").animationName)).toBe("none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("hybrid explanation opens without shifting catalogue content", async ({ page }) => {
  await page.goto("/catalogo");
  const section = page.locator("#como-sao");
  const before = await section.boundingBox();
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const trigger = page.getByRole("button", { name: "dança híbrida*" });
  await trigger.click();
  await expect(page.locator("#hybrid-explanation")).toBeVisible();
  expect((await section.boundingBox())?.y).toBe(before?.y);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(height);
  await page.keyboard.press("Escape");
  await expect(page.locator("#hybrid-explanation")).toBeHidden();
  await trigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#hybrid-explanation")).toBeVisible();
  await page.getByRole("button", { name: "Entendi", exact: true }).click();
  await expect(page.locator("#hybrid-explanation")).toBeHidden();
});

test("catalogue transition preserves the document and does not replay the initial loader", async ({ page }) => {
  await page.goto("/links");
  await expect(page.getByRole("progressbar")).toBeHidden();
  await page.evaluate(() => document.body.dataset.navigationProof = "same-document");
  await page.getByRole("link", { name: "Conheça as aulas", exact: true }).click();
  const overlay = page.locator("[data-catalog-overlay]");
  await expect(overlay).toHaveAttribute("data-phase", "covering");
  await expect(page).toHaveURL(/\/catalogo$/);
  await expect(overlay).toHaveAttribute("data-phase", "idle");
  await expect(page.locator("body")).toHaveAttribute("data-navigation-proof", "same-document");
  await expect(page.locator("main")).toHaveCount(1);
  await page.getByRole("link", { name: "Voltar aos links", exact: true }).click();
  await expect(page).toHaveURL(/\/links$/);
  await expect(overlay).toHaveAttribute("data-phase", "idle");
  await expect(page.getByRole("progressbar")).toBeHidden();
});

test("a slow catalogue stays covered until the route becomes available", async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/catalogo**", async route => { await gate; await route.continue(); });
  await page.goto("/links");
  await expect(page.getByRole("progressbar")).toBeHidden();
  await page.getByRole("link", { name: "Conheça as aulas", exact: true }).click();
  await page.waitForTimeout(1700);
  await expect(page.locator("[data-catalog-overlay]")).toHaveAttribute("data-phase", "covering");
  release();
  await expect(page).toHaveURL(/\/catalogo$/);
  await expect(page.locator("[data-catalog-overlay]")).toHaveAttribute("data-phase", "idle");
});

test("keyboard navigation does not wait for decorative route motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/links");
  const link = page.getByRole("link", { name: "Conheça as aulas", exact: true });
  await link.focus();
  await link.press("Enter");
  await expect(page).toHaveURL(/\/catalogo$/);
  await expect(page.locator("[data-catalog-overlay]")).toHaveAttribute("data-phase", "idle");
});

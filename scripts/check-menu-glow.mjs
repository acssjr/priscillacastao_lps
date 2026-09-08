import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const baseURL = process.argv[2] ?? "http://localhost:3106/";
const browser = await chromium.launch();

try {
  for (const viewport of [{ width: 393, height: 852 }, { width: 430, height: 932 }]) {
    const page = await browser.newPage({ viewport, isMobile: true, hasTouch: true });
    await page.goto(baseURL, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const menu = page.getByRole("dialog");
    await page.waitForTimeout(350);

    // Sample more than one full 4-second loop, not only the initial frame.
    const samples = await menu.evaluate(async (element) => {
      const measurements = [];
      for (let frame = 0; frame <= 42; frame++) {
        measurements.push({
          width: element.clientWidth,
          scrollWidth: element.scrollWidth,
          height: element.clientHeight,
          scrollHeight: element.scrollHeight,
          scrollTop: element.scrollTop,
          scrollLeft: element.scrollLeft,
          light: getComputedStyle(element.querySelector('a [aria-hidden="true"] > span'), "::before").transform,
        });
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return measurements;
    });

    for (const sample of samples) {
      assert.equal(sample.scrollWidth, sample.width, `Horizontal overflow at ${viewport.width}px`);
      assert.equal(sample.scrollHeight, sample.height, `Vertical overflow at ${viewport.width}px`);
      assert.equal(sample.scrollLeft, 0);
      assert.equal(sample.scrollTop, 0);
    }
    assert.ok(new Set(samples.map(({ light }) => light)).size > 1, "The glow must keep animating");
    await page.getByRole("button", { name: "Fechar menu" }).click();
    await menu.waitFor({ state: "hidden" });

    // Short screens must still allow genuine content scrolling and access to the CTA.
    await page.setViewportSize({ width: viewport.width, height: 320 });
    await page.getByRole("button", { name: "Abrir menu" }).click();
    await page.waitForTimeout(350);
    const cta = menu.getByRole("link", { name: "AGENDAR MINHA AULA" });
    await cta.scrollIntoViewIfNeeded();
    const shortMenu = await menu.evaluate((element) => ({
      width: element.clientWidth, scrollWidth: element.scrollWidth, scrollTop: element.scrollTop,
    }));
    assert.equal(shortMenu.scrollWidth, shortMenu.width);
    assert.ok(shortMenu.scrollTop > 0, "Short screens must retain access to the bottom of the menu");
    await page.close();
    console.log(`Menu glow verified at ${viewport.width}px: no false scrollbars; short-screen scrolling preserved.`);
  }
} finally {
  await browser.close();
}

import { expect, test } from "@playwright/test";

test("keeps the proposal in 16:9 and navigates through all screens", async ({ page }) => {
  await page.goto("/proposta-priscilla");
  await page.waitForLoadState("networkidle");
  await page.locator('div[data-phase="idle"]').waitFor({ state: "attached" });

  const stage = page.locator("main > div");
  const box = await stage.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width / box!.height).toBeCloseTo(16 / 9, 2);

  const previous = page.getByRole("button", { name: /Voltar/i });
  const next = page.getByRole("button", { name: /Avançar/i });
  await expect(previous).toBeDisabled();

  await next.click();
  await expect(page.locator("p[aria-live=polite]")).toContainText("Tela 2 de 14");
  await page.keyboard.press("End");
  await expect(next).toBeDisabled();

  await page.keyboard.press("Home");
  await expect(previous).toBeDisabled();
});

import { expect, test } from "@playwright/test";

const versions = [
  { name: "Forró do zero", path: "/" },
  { name: "Evolua no forró", path: "/evolua-no-forro" },
  { name: "Aulas de roots", path: "/forro-roots" },
] as const;

test("transitions from the internal panel to every landing page and back", async ({ page }) => {
  for (const version of versions) {
    await page.goto("/versoes");

    await page.getByRole("link", { name: new RegExp(version.name, "i") }).click();
    await expect(page.locator('div[data-phase="covering"]')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${version.path === "/" ? "/$" : `${version.path}$`}`));
    await expect(page.locator('div[data-phase="idle"]')).toBeAttached();

    await page.getByRole("link", { name: "Painel de versões" }).click();
    await expect(page.locator('div[data-phase="covering"]')).toBeVisible();
    await expect(page).toHaveURL(/\/versoes$/);
    await expect(page.locator('div[data-phase="idle"]')).toBeAttached();
  }
});

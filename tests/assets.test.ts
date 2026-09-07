import { access, stat } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const assets = [
  "public/brand/priscilla-castao-logo.webp",
  "public/brand/priscilla-castao-mark.webp",
  "public/images/priscilla-castao-ensaio-01.webp",
  "public/images/priscilla-castao-ensaio-02.webp",
  "public/images/priscilla-castao-ensaio-03.webp",
  "public/images/priscilla-castao-forro-roots-capa.webp",
];

describe("production assets", () => {
  for (const path of assets) {
    it(`includes ${path}`, async () => {
      await expect(access(path)).resolves.toBeUndefined();
      expect((await stat(path)).size).toBeGreaterThan(1024);
    });
  }

  it("keeps the hero source below the agreed 100 KB budget", async () => {
    expect((await stat("public/images/priscilla-castao-ensaio-01.webp")).size).toBeLessThan(100_000);
  });

  it("keeps each production brand asset below 150 KB", async () => {
    expect((await stat("public/brand/priscilla-castao-logo.webp")).size).toBeLessThan(150_000);
    expect((await stat("public/brand/priscilla-castao-mark.webp")).size).toBeLessThan(150_000);
  });
});

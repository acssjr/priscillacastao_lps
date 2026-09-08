import { access, readFile, stat } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const assets = [
  "public/brand/priscilla-castao-logo.svg",
  "public/brand/priscilla-castao-mark.svg",
  "public/brand/priscilla-castao-mark.webp",
  "public/images/priscilla-castao-ensaio-01.webp",
  "public/images/priscilla-castao-ensaio-02.webp",
  "public/images/priscilla-castao-ensaio-03.webp",
  "public/images/priscilla-castao-forro-roots-capa.webp",
  "public/favicon.svg",
  "public/favicon-96x96.png",
  "public/favicon.ico",
  "public/apple-touch-icon.png",
  "public/web-app-manifest-192x192.png",
  "public/web-app-manifest-512x512.png",
  "public/site.webmanifest",
];

describe("production assets", () => {
  for (const path of assets) {
    it(`includes ${path}`, async () => {
      await expect(access(path)).resolves.toBeUndefined();
      expect((await stat(path)).size).toBeGreaterThan(path.endsWith(".webmanifest") ? 0 : 1024);
    });
  }

  it("keeps the hero source below the agreed 100 KB budget", async () => {
    expect((await stat("public/images/priscilla-castao-ensaio-01.webp")).size).toBeLessThan(100_000);
  });

  it("keeps the optimized SVGs smaller than their supplied originals", async () => {
    expect((await stat("public/brand/priscilla-castao-logo.svg")).size).toBeLessThan(22_344);
    expect((await stat("public/brand/priscilla-castao-mark.svg")).size).toBeLessThan(49_803);
  });

  it("uses the new logos while preserving the monogram in the format cards", async () => {
    const css = await readFile("components/landing/landing.module.css", "utf8");
    expect(css).toContain('/brand/priscilla-castao-logo.svg');
    expect(css).toContain('/brand/priscilla-castao-mark.svg');
    expect(css).toMatch(/\.formatMark\s*\{[\s\S]*?priscilla-castao-mark\.webp/);
    expect(css).not.toContain('/brand/priscilla-castao-logo.webp');
  });

  it("declares the generated web app icons in the favicon manifest", async () => {
    const manifest = JSON.parse(await readFile("public/site.webmanifest", "utf8"));
    expect(manifest.name).toBe("Priscilla Castão");
    expect(manifest.short_name).toBe("Priscilla Castão");
    expect(manifest.icons).toEqual(expect.arrayContaining([
      expect.objectContaining({ src: "/web-app-manifest-192x192.png", sizes: "192x192" }),
      expect.objectContaining({ src: "/web-app-manifest-512x512.png", sizes: "512x512" }),
    ]));
  });
});

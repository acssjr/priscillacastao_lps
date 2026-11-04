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
  "public/images/cutouts/priscilla-castao-ensaio-02-cutout.webp",
  "public/images/cutouts/priscilla-castao-ensaio-03-cutout.webp",
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
      expect((await stat(path)).size).toBeGreaterThan(0);
    });
  }

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

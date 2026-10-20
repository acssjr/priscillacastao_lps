import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

// All icon formats share the approved P extracted from the supplied brand SVG.
const mark = await readFile("public/brand/priscilla-castao-monogram.svg", "utf8");
const paths = mark.replace(/<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" color="#faf5ec"><rect width="512" height="512" rx="112" fill="#864129"/><g transform="translate(76 78) scale(1.09) translate(-45 -65)">${paths}</g></svg>`;
await writeFile("public/favicon.svg", svg);
for (const [name, size] of [["favicon-96x96.png", 96], ["apple-touch-icon.png", 180], ["web-app-manifest-192x192.png", 192], ["web-app-manifest-512x512.png", 512]]) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(`public/${name}`);
}
const sizes = [32, 48];
const pngs = await Promise.all(sizes.map(size => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
for (const [index, png] of pngs.entries()) {
  const entry = 6 + index * 16;
  header[entry] = sizes[index];
  header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(png.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += png.length;
}
await writeFile("public/favicon.ico", Buffer.concat([header, ...pngs]));
console.log("P monogram generated in SVG, ICO, PNG, Apple and web-app formats.");

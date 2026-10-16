"""Update the five approved prices in catalogue v15 without rebuilding its layout.

Usage: python scripts/update-catalog-pdf.py SOURCE.pdf OUTPUT.pdf
Dependencies: pymupdf, fonttools[woff]. Fonts are the existing project assets.
"""
import io
import sys
from pathlib import Path

import pymupdf as fitz
from fontTools.ttLib import TTFont


def update(source: Path, output: Path) -> None:
    root = Path(__file__).resolve().parents[1]
    replacements = {"R$ 440,00": "R$ 439,90", "R$ 150": "R$ 149,90", "R$ 53 de desconto": "R$ 52,70 de desconto"}
    fonts = {}
    for weight in ("Regular", "SemiBold"):
        font = TTFont(root / f"app/links/fonts/Saans-TRIAL-{weight}.woff2")
        font.flavor = None
        buffer = io.BytesIO()
        font.save(buffer)
        fonts[weight] = fitz.Font(fontbuffer=buffer.getvalue())
    document = fitz.open(source)
    updates = []
    for page in document:
        spans = [span for block in page.get_text("dict")["blocks"] for line in block.get("lines", []) for span in line["spans"]]
        changes = [span for span in spans if span["text"] in replacements]
        if not changes:
            continue
        for span in changes:
            page.add_redact_annot(span["bbox"], fill=False, cross_out=False)
        # Erase only the old text: photos, glass panels, lines and links stay intact.
        page.apply_redactions(images=0, graphics=0, text=0)
        for span in changes:
            new = replacements[span["text"]]
            weight = "SemiBold" if "SemiBold" in span["font"] else "Regular"
            writer = fitz.TextWriter(page.rect)
            writer.append(span["origin"], new, font=fonts[weight], fontsize=span["size"])
            color = tuple(((span["color"] >> shift) & 255) / 255 for shift in (16, 8, 0))
            writer.write_text(page, color=color)
            updates.append((page.number + 1, span["text"], new))
    if len(updates) != 5:
        raise ValueError(f"Expected five v15 prices; found {len(updates)}. Source left untouched.")
    output.parent.mkdir(parents=True, exist_ok=True)
    document.save(output, garbage=4, deflate=True)
    document.close()
    for page, old, new in updates:
        print(f"Page {page}: {old} -> {new}")


if __name__ == "__main__":
    update(Path(sys.argv[1]), Path(sys.argv[2]))

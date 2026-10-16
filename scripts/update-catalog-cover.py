"""Replace only the catalogue cover backdrop, retaining its text and vector logo.

Usage: python scripts/update-catalog-cover.py SOURCE.pdf OUTPUT.pdf
Dependencies: pymupdf, Pillow. Photo is the existing catalogue website asset.
"""
import io
import re
import sys
from pathlib import Path

import pymupdf as fitz
from PIL import Image


def update_frosted(source: Path, output: Path) -> None:
    root = Path(__file__).resolve().parents[1]
    photo = Image.open(root / "assets/catalogo/capa-creme-glass.webp").convert("RGB")
    encoded = io.BytesIO()
    photo.save(encoded, format="JPEG", quality=94, subsampling=0)
    document = fitz.open(source)
    cover = document[0]
    images = cover.get_images(full=True)
    if len(images) != 1:
        raise ValueError("Use the original v16, with a single cover backdrop")
    # The supplied restored material contains the creamy photograph and real
    # frosted-glass appearance. PDF clipping maps that panel to the text area.
    material = fitz.open(stream=encoded.getvalue(), filetype="jpeg")
    material_pdf = fitz.open("pdf", material.convert_to_pdf())
    bounds = material_pdf[0].rect
    crop = fitz.Rect(bounds.width * .043, bounds.height * .47, bounds.width * .957, bounds.height * .877)
    panel = fitz.Rect(27, 350, 613, 744)
    backdrop = fitz.open()
    background = backdrop.new_page(width=640, height=800)
    background.insert_image(background.rect, stream=encoded.getvalue())
    background.show_pdf_page(panel, material_pdf, 0, clip=crop, keep_proportion=False)
    cover.delete_image(images[0][0])
    cover.show_pdf_page(cover.rect, backdrop, 0, overlay=False)
    # Keep the existing glyph positions, typography and selectable text.
    # Only recolor vector text/logo/arrow to wine for the lighter glass.
    wine = b".39215686 .070588235 .12156863 "
    color = rb"(?<!\S)(?:[0-9]*\.?[0-9]+\s+){3}(?:rg|RG)\b"
    for xref in cover.get_contents():
        stream = document.xref_stream(xref)
        document.update_stream(xref, re.sub(color, lambda match: wine + match.group()[-2:], stream))
    for xref, _name, _parent, _bounds in cover.get_xobjects():
        # The signature's vector form has no raster assets or background fills.
        stream = document.xref_stream(xref)
        if b" rg " in stream and b" Do" not in stream:
            document.update_stream(xref, re.sub(color, lambda match: wine + match.group()[-2:], stream))
    output.parent.mkdir(parents=True, exist_ok=True)
    document.save(output, garbage=4, deflate=True)
    document.close()


def update(source: Path, output: Path) -> None:
    root = Path(__file__).resolve().parents[1]
    photo = Image.open(root / "public/images/priscilla-catalogo-retrato.webp").convert("RGB")
    encoded = io.BytesIO()
    photo.save(encoded, format="JPEG", quality=94, subsampling=0)
    document = fitz.open(source)
    cover = document[0]
    backdrop = fitz.open()
    page = backdrop.new_page(width=cover.rect.width, height=cover.rect.height)
    scale = max(page.rect.width / photo.width, page.rect.height / photo.height)
    width, height = photo.width * scale, photo.height * scale
    x, y = (page.rect.width - width) / 2, (page.rect.height - height) / 2
    page.insert_image(fitz.Rect(x, y, x + width, y + height), stream=encoded.getvalue())
    wine = (100 / 255, 18 / 255, 31 / 255)
    cream = (250 / 255, 245 / 255, 236 / 255)
    # Local transparency preserves the photograph's natural colors elsewhere.
    page.draw_rect(fitz.Rect(37, 362, 605, 743), color=None, fill=(.12, .04, .04), fill_opacity=.16, radius=.055)
    page.draw_rect(fitz.Rect(32, 356, 608, 738), color=cream, width=.8, stroke_opacity=.65, fill=wine, fill_opacity=.72, radius=.055)
    # A graduated top scrim protects the original white vector signature.
    for top in range(0, 156, 3):
        opacity = .38 * (1 - top / 156) ** 2
        page.draw_rect(fitz.Rect(0, top, 640, top + 3), color=None, fill=(.12, .04, .04), fill_opacity=opacity)
    images = cover.get_images(full=True)
    if len(images) != 1:
        raise ValueError("Expected the original single cover backdrop; source left untouched")
    cover.delete_image(images[0][0])
    cover.show_pdf_page(cover.rect, backdrop, 0, overlay=False)
    output.parent.mkdir(parents=True, exist_ok=True)
    document.save(output, garbage=4, deflate=True)
    document.close()
    backdrop.close()


if __name__ == "__main__":
    if "--frosted" in sys.argv[3:]:
        update_frosted(Path(sys.argv[1]), Path(sys.argv[2]))
    else:
        update(Path(sys.argv[1]), Path(sys.argv[2]))

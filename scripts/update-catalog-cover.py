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
from fontTools.ttLib import TTFont


def update_burgundy(source: Path, output: Path) -> None:
    """Compose the signature inside wine-tinted frosted glass; retain pages 2-7."""
    root = Path(__file__).resolve().parents[1]
    photo = Image.open(root / "assets/catalogo/capa-creme-glass.webp").convert("RGB")
    encoded = io.BytesIO()
    photo.save(encoded, format="JPEG", quality=94, subsampling=0)
    material = fitz.open(stream=encoded.getvalue(), filetype="jpeg")
    material_pdf = fitz.open("pdf", material.convert_to_pdf())
    bounds = material_pdf[0].rect
    crop = fitz.Rect(bounds.width * .043, bounds.height * .47, bounds.width * .957, bounds.height * .877)
    document = fitz.open(source)
    signature = fitz.open(source)
    signature[0].delete_image(signature[0].get_images(full=True)[0][0])
    replacement = fitz.open()
    page = replacement.new_page(width=640, height=800)
    page.insert_image(page.rect, stream=encoded.getvalue())
    wine = (.30, .035, .085)
    cream = (.985, .955, .91)
    # PDF-native tint leaves the photograph intact and the frosted material visible.
    page.draw_rect(page.rect, color=None, fill=wine, fill_opacity=.24)
    panel = fitz.Rect(27, 370, 613, 754)
    page.show_pdf_page(panel, material_pdf, 0, clip=crop, keep_proportion=False)
    # Clip the frosted material itself so its cream corners do not escape glass.
    glass_stream = page.get_contents()[-1]
    rounded_clip = (b"q 49 46 m 591 46 l 603 46 613 56 613 68 c "
                    b"613 408 l 613 420 603 430 591 430 c 49 430 l "
                    b"37 430 27 420 27 408 c 27 68 l 27 56 37 46 49 46 c h W n\n")
    replacement.update_stream(glass_stream, rounded_clip + replacement.xref_stream(glass_stream) + b"\nQ")
    page.draw_rect(panel, color=(.74, .43, .47), stroke_opacity=.60,
                   width=.9, fill=wine, fill_opacity=.78, radius=.055)
    page.show_pdf_page(fitz.Rect(65, 402, 419, 490), signature, 0,
                       clip=fitz.Rect(38, 32.125, 333, 105.875))
    fonts = {}
    for weight in ("Regular", "Bold"):
        font = TTFont(root / f"app/links/fonts/Saans-TRIAL-{weight}.woff2")
        font.flavor = None
        buffer = io.BytesIO()
        font.save(buffer)
        fonts[weight] = fitz.Font(fontbuffer=buffer.getvalue())
    lines = [
        ("Catálogo de aulas", 65, 551, 48, "Bold"),
        ("Forró universitário e roots", 65, 602, 23, "Regular"),
        ("Aulas individuais, em dupla e em grupo", 65, 638, 22, "Regular"),
        ("Entenda o funcionamento das aulas e os valores", 65, 703, 20, "Regular"),
    ]
    for text, x, y, size, weight in lines:
        writer = fitz.TextWriter(page.rect)
        writer.append((x, y), text, font=fonts[weight], fontsize=size)
        writer.write_text(page, color=cream)
    document.delete_page(0)
    document.insert_pdf(replacement, start_at=0)
    output.parent.mkdir(parents=True, exist_ok=True)
    document.save(output, garbage=4, deflate=True)
    document.close()


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
    if "--burgundy" in sys.argv[3:]:
        update_burgundy(Path(sys.argv[1]), Path(sys.argv[2]))
    elif "--frosted" in sys.argv[3:]:
        update_frosted(Path(sys.argv[1]), Path(sys.argv[2]))
    else:
        update(Path(sys.argv[1]), Path(sys.argv[2]))

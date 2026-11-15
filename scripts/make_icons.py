"""Draws the Awal app icons into public/. Run with: python scripts/make_icons.py

The logo is the red yaz (ⵣ) on the blue, green and yellow bands of the
Amazigh flag. public/favicon.svg is the same design as a vector; keep the
two in step. Shapes are drawn at 4x and scaled down for smooth edges.
"""
from pathlib import Path
from PIL import Image, ImageDraw

PUBLIC = Path(__file__).resolve().parent.parent / 'public'
BLUE, GREEN, YELLOW, RED = '#0B72B9', '#3AA935', '#F6D90F', '#E2231A'
SCALE = 4


def quad(p0, p1, p2, steps=200):
    """Points along a quadratic Bezier curve."""
    for i in range(steps + 1):
        t = i / steps
        yield tuple((1 - t) ** 2 * a + 2 * (1 - t) * t * b + t ** 2 * c for a, b, c in zip(p0, p1, p2))


# The yaz in the 512-unit design space, as polylines (same as favicon.svg)
YAZ = [
    [*quad((180, 128), (180, 200), (256, 200)), *quad((256, 200), (332, 200), (332, 128))],
    [(256, 200), (256, 312)],
    [*quad((180, 384), (180, 312), (256, 312)), *quad((256, 312), (332, 312), (332, 384))],
]


def draw(size, rounded=True, stroke=46):
    big = size * SCALE
    k = big / 512
    img = Image.new('RGBA', (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    for y0, y1, colour in ((0, 171, BLUE), (171, 341, GREEN), (341, 512, YELLOW)):
        d.rectangle([0, y0 * k, big, y1 * k], fill=colour)
    # The stroke is stamped as overlapping discs along the path: Pillow's
    # wide lines leave seams inside tight curves, discs give a clean stroke
    # with round ends
    r = stroke * k / 2
    for line in YAZ:
        for (x0, y0), (x1, y1) in zip(line, line[1:]):
            n = max(1, int(max(abs(x1 - x0), abs(y1 - y0)) * k / 2))
            for i in range(n + 1):
                x = (x0 + (x1 - x0) * i / n) * k
                y = (y0 + (y1 - y0) * i / n) * k
                d.ellipse([x - r, y - r, x + r, y + r], fill=RED)
    if rounded:
        mask = Image.new('L', (big, big), 0)
        ImageDraw.Draw(mask).rounded_rectangle([0, 0, big - 1, big - 1], radius=112 * k, fill=255)
        img.putalpha(mask)
    return img.resize((size, size), Image.LANCZOS)


def main():
    # Installable app icon, and the masked version Android crops to its own
    # shape (the yaz sits well inside the 80% safe zone)
    draw(192).save(PUBLIC / 'pwa-192x192.png')
    draw(512).save(PUBLIC / 'pwa-512x512.png')
    draw(512, rounded=False).save(PUBLIC / 'pwa-maskable-512x512.png')
    # iOS rounds the corners itself and shows transparency as black
    draw(180, rounded=False).convert('RGB').save(PUBLIC / 'apple-touch-icon.png')
    # Small sizes get a heavier stroke so the yaz survives at 16 px
    ico = [draw(s, stroke={16: 58, 32: 54}.get(s, 50)) for s in (16, 32, 48)]
    ico[2].save(PUBLIC / 'favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)], append_images=ico[:2])
    print('Icons written to', PUBLIC)


if __name__ == '__main__':
    main()

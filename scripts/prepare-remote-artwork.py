"""Separate the generated 4 x 3 contact sheet and compress artwork for the web.

Usage: python scripts/prepare-remote-artwork.py SHEET.png ADMINISTRATION.png
Only crops grid boundaries and converts format; does not redraw the artwork.
"""
import sys
from pathlib import Path
from PIL import Image

destination = Path(__file__).resolve().parents[1] / 'public' / 'photos'
sheet = Image.open(sys.argv[1]).convert('RGB')
for column, activity in enumerate(('digital', 'sewing', 'electronics', 'business')):
    for row, role in enumerate(('facilitator', 'home-1', 'home-2')):
        # Exclude the contact sheet's fine dividing lines.
        box = (round(column * sheet.width / 4) + 1,
               round(row * sheet.height / 3) + 1,
               round((column + 1) * sheet.width / 4) - 1,
               round((row + 1) * sheet.height / 3) - 1)
        panel = sheet.crop(box)
        panel.save(destination / f'remote-{activity}-{role}-v1.webp', quality=85, method=6)
administration = Image.open(sys.argv[2]).convert('RGB')
administration.thumbnail((800, 400), Image.Resampling.LANCZOS)
administration.save(destination / 'remote-administration-v1.webp', quality=85, method=6)
for asset in sorted(destination.glob('remote-*-v1.webp')):
    print(f'{asset.name}: {Image.open(asset).size}, {asset.stat().st_size:,} bytes')

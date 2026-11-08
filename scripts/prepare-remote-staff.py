"""Prepare a 2 x 2 staff contact sheet and office image as v2 WebP assets.

Usage: python scripts/prepare-remote-staff.py STAFF.png ADMINISTRATION.png
"""
import sys
from pathlib import Path
from PIL import Image

destination = Path(__file__).resolve().parents[1] / 'public' / 'photos'
sheet = Image.open(sys.argv[1]).convert('RGB')
for index, activity in enumerate(('digital', 'sewing', 'electronics', 'business')):
    row, column = divmod(index, 2)
    panel = sheet.crop((round(column * sheet.width / 2) + 1,
                        round(row * sheet.height / 2) + 1,
                        round((column + 1) * sheet.width / 2) - 1,
                        round((row + 1) * sheet.height / 2) - 1))
    panel = panel.resize((360, 360), Image.Resampling.LANCZOS)
    panel.save(destination / f'remote-{activity}-facilitator-v2.webp', quality=85, method=6)
administration = Image.open(sys.argv[2]).convert('RGB')
administration.thumbnail((800, 400), Image.Resampling.LANCZOS)
administration.save(destination / 'remote-administration-v2.webp', quality=85, method=6)

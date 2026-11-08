"""Split a generated two-office sheet into compressed square thumbnails.
Usage: python scripts/prepare-remote-offices.py OFFICES.png
"""
import sys
from pathlib import Path
from PIL import Image
sheet = Image.open(sys.argv[1]).convert('RGB')
destination = Path(__file__).resolve().parents[1] / 'public' / 'photos'
for index in range(2):
    panel = sheet.crop((round(index * sheet.width / 2) + 2, 0,
                        round((index + 1) * sheet.width / 2) - 2, sheet.height))
    panel = panel.resize((360, 360), Image.Resampling.LANCZOS)
    panel.save(destination / f'remote-admin-{index + 1}-office-v3.webp', quality=85, method=6)

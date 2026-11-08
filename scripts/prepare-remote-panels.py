"""Compress the refreshed role panels without upscaling.
Usage: python scripts/prepare-remote-panels.py STAFF_3x2.png LEARNERS_4x2.png [CORRECTED_LEARNERS.png]
"""
import sys
from pathlib import Path
from PIL import Image
destination = Path(__file__).resolve().parents[1] / 'public' / 'photos'
def panel(sheet, column, row, columns, rows, name):
    cell = sheet.crop((round(column * sheet.width / columns) + 2,
                       round(row * sheet.height / rows) + 2,
                       round((column + 1) * sheet.width / columns) - 2,
                       round((row + 1) * sheet.height / rows) - 2))
    cell.thumbnail((720, 720), Image.Resampling.LANCZOS)
    cell.save(destination / name, quality=92, method=6)
    print(f'{name}: {cell.size}')
staff = Image.open(sys.argv[1]).convert('RGB')
staff_names = ['remote-admin-1-office-v4.webp', 'remote-admin-2-office-v4.webp',
               'remote-digital-facilitator-v4.webp', 'remote-sewing-facilitator-v4.webp',
               'remote-electronics-facilitator-v4.webp', 'remote-business-facilitator-v4.webp']
for index, name in enumerate(staff_names):
    row, column = divmod(index, 3)
    panel(staff, column, row, 3, 2, name)
learners = Image.open(sys.argv[2]).convert('RGB')
for column, activity in enumerate(('digital','sewing','electronics','business')):
    for row in range(2):
        panel(learners, column, row, 4, 2, f'remote-{activity}-home-{row + 1}-v4.webp')
if len(sys.argv) > 3:
    corrected = Image.open(sys.argv[3]).convert('RGB')
    panel(corrected, 0, 1, 4, 2, 'remote-digital-home-2-v4.webp')

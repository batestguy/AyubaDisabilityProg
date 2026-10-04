"""Reproduce the ten accepted documentary assets, retaining full photographic frames.
Run node scripts/generate-static-story.mjs first if the source records changed.
Photographic identities/captions are curated in src/showcase.ts, never inferred here.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import io, json
import requests
from PIL import Image, ImageOps

photos=json.loads(Path('docs/documentary-photo-manifest.json').read_text(encoding='utf-8'))
def download(photo):
 response=requests.get(photo['original'],timeout=45)
 response.raise_for_status()
 im=ImageOps.exif_transpose(Image.open(io.BytesIO(response.content))).convert('RGB')
 im.thumbnail((1600,1200))
 if im.size != (photo['width'],photo['height']):
  raise ValueError(f"Dimensions changed for {photo['id']}: {im.size}; review source before replacing")
 target=Path('public') / photo['path'].lstrip('/')
 im.save(target,'WEBP',quality=85 if photo['id'] in ('noa','farm','abia') else 83,method=6)
 return photo['id'],im.size,target.stat().st_size
with ThreadPoolExecutor(max_workers=4) as pool:
 for result in pool.map(download,photos): print(*result)

"""Create an H.264/AAC release download below 30 decimal megabytes."""
from pathlib import Path
import subprocess, shutil, os, json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/playwright/laptop-walkthrough/compression'
OUT.mkdir(exist_ok=True)
SOURCE=ROOT/'output/Impact-Mosaic-Walkthrough-Updated/Impact-Mosaic-Laptop-Walkthrough.mp4'
DELIVERY=ROOT/'output/Impact-Mosaic-Walkthrough-Compact'
DELIVERY.mkdir(exist_ok=True)
VIDEO=DELIVERY/SOURCE.name
FF=Path(shutil.which('ffmpeg')).resolve()
PROBE=FF.with_name('ffprobe.exe' if os.name=='nt' else 'ffprobe')
common=[str(FF),'-y','-hide_banner','-loglevel','warning','-nostats','-i',str(SOURCE),
        '-map','0:v:0','-vf','scale=1280:720:flags=lanczos','-r','30','-c:v','libx264',
        '-preset','medium','-b:v','260k','-maxrate','600k','-bufsize','1200k',
        '-pix_fmt','yuv420p','-passlogfile',str(OUT/'two-pass')]
print('Compression pass 1: analyse the full video.',flush=True)
subprocess.run(common+['-progress',str(OUT/'pass-1-progress.txt'),'-pass','1','-an','-f','null',os.devnull],check=True)
print('Compression pass 2: encode the compact download.',flush=True)
subprocess.run(common+['-progress',str(OUT/'pass-2-progress.txt'),'-map','0:a:0','-pass','2',
                     '-c:a','aac','-b:a','64k','-ar','48000','-ac','2',
                     '-map_chapters','-1','-movflags','+faststart',str(VIDEO)],check=True)
assert VIDEO.stat().st_size<=30_000_000,VIDEO.stat().st_size
for name in ['Impact-Mosaic-Laptop-Walkthrough.en.srt','Chapters.txt']:
    shutil.copyfile(SOURCE.parent/name,DELIVERY/name)
probe=json.loads(subprocess.run([str(PROBE),'-v','error','-show_format','-show_streams','-of','json',str(VIDEO)],capture_output=True,text=True,check=True).stdout)
(OUT/'probe.json').write_text(json.dumps(probe,indent=2))
print('Compact video:',VIDEO.stat().st_size,'bytes',flush=True)

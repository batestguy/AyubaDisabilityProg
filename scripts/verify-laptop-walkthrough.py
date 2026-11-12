"""Inspect the delivered video; retain objective checks and visual review sheets."""
from pathlib import Path
import subprocess, shutil, json, re, struct

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/playwright/laptop-walkthrough'
VIDEO=ROOT/'output/Impact-Mosaic-Walkthrough/Impact-Mosaic-Laptop-Walkthrough.mp4'
FFMPEG=Path(shutil.which('ffmpeg')).resolve()
FFPROBE=FFMPEG.with_name('ffprobe.exe')
def run(args):
    return subprocess.run(args,capture_output=True,text=True,check=True)
probe=json.loads(run([str(FFPROBE),'-v','error','-show_streams','-show_format','-show_chapters','-of','json',str(VIDEO)]).stdout)
video=next(s for s in probe['streams'] if s['codec_type']=='video')
audio=next(s for s in probe['streams'] if s['codec_type']=='audio')
assert (video['width'],video['height'],video['r_frame_rate'],video['codec_name'])==(1920,1080,'30/1','h264')
assert audio['codec_name']=='aac' and audio['channels']==2
assert abs(float(probe['format']['duration'])-600)<0.1
assert not probe.get('chapters')
assert len(probe['streams'])==2
timeline=json.loads((OUT/('aligned-timeline.json' if (OUT/'aligned-timeline.json').exists() else 'timeline.json')).read_text())
assert len(timeline['cues'])>=49
assert timeline['cues'][-1]['start']<=588.5 and timeline['cues'][-1]['end']==600
assert all(c['end']-c['start']>=6 for c in timeline['cues'])
assert all(len(c['text'].split())<=24 for c in timeline['cues'])
# Confirm moov metadata comes before media payload for fast-start playback.
atoms=[]
with VIDEO.open('rb') as f:
    while header:=f.read(8):
        size,kind=struct.unpack('>I4s',header)
        if size==1: size=struct.unpack('>Q',f.read(8))[0];head=16
        else: head=8
        atoms.append(kind.decode('ascii'))
        if not size:break
        f.seek(size-head,1)
assert atoms.index('moov')<atoms.index('mdat')
# Decode the entire video/audio and create review sheets spanning the full route.
review=run([str(FFMPEG),'-hide_banner','-v','error','-y','-i',str(VIDEO),
    '-map','0:v:0','-vf','fps=1/10,scale=480:270,tile=3x4','-fps_mode','vfr',str(OUT/'review-%02d.jpg'),
    '-map','0:a:0','-f','null','-'])
assert not review.stderr.strip(), review.stderr
measure=run([str(FFMPEG),'-hide_banner','-nostats','-i',str(VIDEO),'-vn','-af','loudnorm=I=-24:TP=-2:LRA=7:print_format=json','-f','null','-'])
loudness=json.loads(re.findall(r'\{[^{}]+\}',measure.stderr)[-1])
assert abs(float(loudness['input_i'])+24)<0.5
assert float(loudness['input_tp'])<0
for t in [3,35,125,202,248,278,315,345,380,403,418,460,480,500,530,560,590]:
    run([str(FFMPEG),'-hide_banner','-loglevel','error','-y','-ss',str(t),'-i',str(VIDEO),'-frames:v','1',str(OUT/f'export-{t:03}.jpg')])
result={'passed':True,'duration_seconds':probe['format']['duration'],'resolution':[1920,1080],
        'fps':video['r_frame_rate'],'video_codec':video['codec_name'],'audio_codec':audio['codec_name'],
        'channels':audio['channels'],'loudness':loudness,'faststart':True,'chapters':6,'chapter_storage':'separate timestamp list','captions':len(timeline['cues']),
        'full_decode':'passed','visual_review_sheets':5,
        'human_realtime_watch':'not performed; sampled frame review and full decode used'}
(OUT/'verification.json').write_text(json.dumps(result,indent=2))
print(json.dumps(result,indent=2))

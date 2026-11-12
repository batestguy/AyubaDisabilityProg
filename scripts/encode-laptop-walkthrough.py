"""Encode the private browser recording and supplied 23-second music excerpt."""
from pathlib import Path
import subprocess, json, re, sys, shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/playwright/laptop-walkthrough'
DELIVERY = ROOT / 'output/Impact-Mosaic-Walkthrough'
DELIVERY.mkdir(exist_ok=True)

def run(args, **kwargs):
    return subprocess.run(args, check=True, **kwargs)

ffmpeg = Path(shutil.which('ffmpeg')).resolve()
ffprobe = ffmpeg.with_name('ffprobe.exe' if sys.platform == 'win32' else 'ffprobe')
ff = [str(ffmpeg), '-hide_banner', '-y']
def prepare_audio():
    excerpt = OUT / 'music-excerpt-055-118.wav'
    if not excerpt.exists():
        run(ff+['-loglevel','error','-ss','55','-i',str(ROOT/'Cheer Up Song - Panam Percy Paul.mp3'),'-t','23','-ar','48000','-ac','2','-c:a','pcm_s16le',str(excerpt)])
    tile = OUT / 'music-loop-22s.wav'
    prefix = OUT / 'music-opening-1s.wav'
    # One complete excerpt starts at 0:55. Every following repeat overlaps for one
    # second, using linear crossfades without changing the sample rate or pitch.
    run(ff + ['-loglevel','error','-i',str(excerpt),'-filter_complex',
        '[0:a]asplit=3[h][b][t];[h]atrim=0:1,asetpts=PTS-STARTPTS[head];'
        '[t]atrim=22:23,asetpts=PTS-STARTPTS[tail];'
        '[tail][head]acrossfade=d=1:c1=tri:c2=tri[j];'
        '[b]atrim=1:22,asetpts=PTS-STARTPTS[body];[body][j]concat=n=2:v=0:a=1[a]',
        '-map','[a]','-c:a','pcm_s16le',str(tile)])
    run(ff+['-loglevel','error','-i',str(excerpt),'-t','1','-c:a','pcm_s16le',str(prefix)])
    playlist=OUT/'music-concat.txt'
    playlist.write_text("file 'music-opening-1s.wav'\n" + "file 'music-loop-22s.wav'\n"*50)
    audio_filter='atrim=0:600,asetpts=PTS-STARTPTS,afade=t=in:d=3,afade=t=out:st=595:d=5'
    measure=subprocess.run(ff+['-f','concat','-safe','0','-i',str(playlist),'-af',audio_filter+',loudnorm=I=-24:TP=-2:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
    stats=json.loads(re.findall(r'\{[^{}]+\}',measure.stderr)[-1])
    (OUT/'audio-normalization.json').write_text(json.dumps(stats,indent=2))
    normalise=('loudnorm=I=-24:TP=-2:LRA=7:linear=true:'
     f'measured_I={stats["input_i"]}:measured_TP={stats["input_tp"]}:'
     f'measured_LRA={stats["input_lra"]}:measured_thresh={stats["input_thresh"]}:'
     f'offset={stats["target_offset"]}')
    run(ff+['-loglevel','error','-f','concat','-safe','0','-i',str(playlist),'-af',audio_filter+','+normalise,'-ar','48000','-ac','2','-c:a','pcm_s16le',str(OUT/'music-final.wav')])
    if '--audio-only' in sys.argv:
        print('Music prepared: exact excerpt, one-second overlaps, two-pass loudness normalization.',flush=True)
        return


if '--video-only' not in sys.argv:
    prepare_audio()
if '--audio-only' in sys.argv:
    sys.exit(0)

raw=(ROOT/Path((OUT/'raw-video-path.txt').read_text().strip())).resolve()
# Detect the first captioned frame. Blank startup and the uncaptained stage
# precede it; their band has no bright text on the dark caption background.
def caption_offset(source,filename):
    run(ff+['-loglevel','error','-i',str(source),'-t','10','-vf',
     f'crop=1260:85:170:800,signalstats,metadata=print:file={filename}',
     '-an','-f','null','-'],cwd=OUT)
    pts=0;values={}
    for line in (OUT/filename).read_text().splitlines():
        if line.startswith('frame:'):
            pts=float(re.search(r'pts_time:([\d.]+)',line)[1]);values={}
        elif '=' in line:
            key,val=line.split('=',1);values[key]=float(val)
            if key.endswith('YMAX') and float(val)>200 and values.get('lavfi.signalstats.YAVG',255)<90:
                return pts
    raise RuntimeError('Could not identify captioned opening frame')
offset=caption_offset(raw,'opening-luminance.txt')
(OUT/'encoding-offset.json').write_text(json.dumps({'trim_seconds':offset,'audio_measurement':json.loads((OUT/'audio-normalization.json').read_text())},indent=2))
closing=(ROOT/Path((OUT/'closing-raw-video-path.txt').read_text().strip())).resolve() if (OUT/'closing-raw-video-path.txt').exists() else None
if closing:
    closing_offset=caption_offset(closing,'closing-luminance.txt')
    timeline=json.loads((OUT/'closing-timeline.json').read_text())
    main_cues=[json.loads(s) for s in (OUT/'recording-progress.log').read_text().splitlines() if json.loads(s)['start']<555]
    timeline['cues']=main_cues+[{**c,'start':c['start']+555,'end':c['end']+555} for c in timeline['cues']]
    (OUT/'timeline.json').write_text(json.dumps(timeline,indent=2))
    def ts(t):
        ms=round(t*1000)
        return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
    (OUT/'Impact-Mosaic-Laptop-Walkthrough.en.srt').write_text('\n'.join(f'{i+1}\n{ts(c["start"])} --> {ts(c["end"])}\n{c["text"]}\n' for i,c in enumerate(timeline['cues'])),encoding='utf-8')
else:
    timeline=json.loads((OUT/'timeline.json').read_text())
metadata=[';FFMETADATA1','title=Impact Mosaic — Laptop Walkthrough','comment=Independent proposal; fictional sample records. English captions included.']
for c in timeline['chapters']:
    metadata+=['[CHAPTER]','TIMEBASE=1/1000',f'START={c["start"]*1000}',f'END={c["end"]*1000}',f'title={c["name"]}']
(OUT/'chapters.ffmeta').write_text('\n'.join(metadata),encoding='utf-8')
destination=DELIVERY/'Impact-Mosaic-Laptop-Walkthrough.mp4'
inputs=['-ss',str(offset),'-i',str(raw)]
mapping=['-map','0:v:0','-map','1:a:0','-map','3:s:0','-map_metadata','2','-map_chapters','2']
vf=['-vf','scale=1920:1080:flags=lanczos,fps=30,tpad=stop_mode=clone:stop_duration=1']
if closing:
    inputs=['-ss',str(offset),'-t','555','-i',str(raw),'-ss',str(closing_offset),'-t','45','-i',str(closing)]
    mapping=['-map','[v]','-map','2:a:0','-map','4:s:0','-map_metadata','3','-map_chapters','3']
    vf=['-filter_complex','[0:v]setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,scale=1920:1080:flags=lanczos,fps=30,tpad=stop_mode=clone:stop_duration=1[v]']
# The picture already contains captions. Deliver the matching SRT separately,
# avoiding a second player overlay and unreliable QuickTime chapter tracks.
mapping=['-map','[v]' if closing else '0:v:0','-map','2:a:0' if closing else '1:a:0','-map_metadata','3' if closing else '2','-map_chapters','-1']
run(ff+inputs+['-i',str(OUT/'music-final.wav'),'-i',str(OUT/'chapters.ffmeta'),
    '-i',str(OUT/'Impact-Mosaic-Laptop-Walkthrough.en.srt'),
    *mapping,*vf,
    '-t','600','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p',
    '-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-c:s','mov_text',
    '-metadata:s:s:0','language=eng','-metadata:s:s:0','title=English','-disposition:s:0','0',
    '-movflags','+faststart',str(destination)])
shutil.copyfile(OUT/'Impact-Mosaic-Laptop-Walkthrough.en.srt',DELIVERY/'Impact-Mosaic-Laptop-Walkthrough.en.srt')
chapter_text='Impact Mosaic — Laptop Walkthrough\n\n'+'\n'.join(f'{c["start"]//60:02}:{c["start"]%60:02}  {c["name"]}' for c in timeline['chapters'])+'\n'
(DELIVERY/'Chapters.txt').write_text(chapter_text,encoding='utf-8')
probe=subprocess.run([str(ffprobe),'-v','error','-show_format','-show_streams','-show_chapters','-of','json',str(destination)],capture_output=True,text=True,check=True)
(OUT/'export-probe.json').write_text(probe.stdout)
print('DELIVERED',destination,flush=True)

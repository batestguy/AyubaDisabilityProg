"""Replace only About with the user-approved two-minute side-by-side tour."""
from pathlib import Path
import subprocess, json, shutil, re, io, difflib
import numpy as np
from PIL import Image
import cv2
ROOT=Path(__file__).resolve().parents[1]
BASE=ROOT/'output/playwright/laptop-walkthrough'
OUT=BASE/'profiles'
DELIVERY=ROOT/'output/Impact-Mosaic-Walkthrough-Updated'
DELIVERY.mkdir(exist_ok=True)
FF=Path(shutil.which('ffmpeg')).resolve()
PROBE=FF.with_name('ffprobe.exe')
def run(args,**kw):return subprocess.run(args,check=True,**kw)
def probe(p):return json.loads(run([str(PROBE),'-v','error','-show_format','-show_streams','-of','json',str(p)],capture_output=True,text=True).stdout)
raw=Path((OUT/'closing-raw-video-path.txt').read_text().strip())
run([str(FF),'-y','-v','error','-i',str(raw),'-t','6','-vf','crop=1260:85:170:800,signalstats,metadata=print:file=opening.txt','-an','-f','null','-'],cwd=OUT)
values={};offset=None
for line in (OUT/'opening.txt').read_text().splitlines():
    if line.startswith('frame:'):t=float(re.search(r'pts_time:([\d.]+)',line)[1]);values={}
    elif '=' in line:
        k,v=line.split('=',1);values[k]=float(v)
        if k.endswith('YMAX') and float(v)>200 and values.get('lavfi.signalstats.YAVG',255)<90:offset=t;break
assert offset is not None
tail_duration=float(probe(raw)['format']['duration'])-offset
old=ROOT/'output/Impact-Mosaic-Walkthrough/Impact-Mosaic-Laptop-Walkthrough.mp4'
prefix=OUT/'prefix.mp4'
run([str(FF),'-y','-v','error','-i',str(old),'-t','555','-map','0:v:0','-c:v','copy','-an',str(prefix)])
prefix_duration=float(probe(prefix)['format']['duration'])
tail=OUT/'about.mp4'
run([str(FF),'-y','-hide_banner','-ss',str(offset),'-i',str(raw),'-an','-vf','scale=1920:1080:flags=lanczos,fps=30','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-video_track_timescale','15360',str(tail)])
tail_duration=float(probe(tail)['format']['duration'])
total=prefix_duration+tail_duration
print('Picture duration:',total,'About:',tail_duration,flush=True)
(OUT/'pictures.txt').write_text("file 'prefix.mp4'\nfile 'about.mp4'\n")
# Extend the same excerpt and one-second crossfades for the new running time.
(OUT/'music.txt').write_text("file '../music-opening-1s.wav'\n"+"file '../music-loop-22s.wav'\n"*40)
af=f'atrim=0:{total},asetpts=PTS-STARTPTS,afade=t=in:d=3,afade=t=out:st={total-5}:d=5'
measure=run([str(FF),'-hide_banner','-nostats','-f','concat','-safe','0','-i',str(OUT/'music.txt'),'-af',af+',loudnorm=I=-24:TP=-2:LRA=7:print_format=json','-f','null','-'],capture_output=True,text=True)
stats=json.loads(re.findall(r'\{[^{}]+\}',measure.stderr)[-1])
norm=(f'loudnorm=I=-24:TP=-2:LRA=7:linear=true:measured_I={stats["input_i"]}:measured_TP={stats["input_tp"]}:measured_LRA={stats["input_lra"]}:measured_thresh={stats["input_thresh"]}:offset={stats["target_offset"]}')
video=DELIVERY/'Impact-Mosaic-Laptop-Walkthrough.mp4'
run([str(FF),'-y','-hide_banner','-f','concat','-safe','0','-i',str(OUT/'pictures.txt'),'-f','concat','-safe','0','-i',str(OUT/'music.txt'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-af',af+','+norm,'-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-t',str(total),'-map_chapters','-1','-movflags','+faststart',str(video)])
# A copied cut through an existing GOP can retain a few reordered picture
# timestamps at the join. Normalize presentation times for reliable playback.
normalized=DELIVERY/'validated.mp4'
run([str(FF),'-y','-hide_banner','-i',str(video),'-map','0:v:0','-map','0:a:0','-vf','setpts=N/(30*TB)','-fps_mode','passthrough','-c:v','libx264','-preset','ultrafast','-crf','18','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',str(normalized)])
normalized.replace(video)
# Match captions to the actual recorded frames, allowing for browser timing drift.
raw_frames=run([str(FF),'-v','error','-i',str(tail),'-vf','fps=2,crop=1620:96:150:962,format=gray','-f','rawvideo','-'],capture_output=True).stdout
frames=np.frombuffer(raw_frames,np.uint8).reshape(-1,96,1620)
cues=json.loads((OUT/'closing-timeline.json').read_text())['cues']
clean=lambda s:re.sub(r'[^a-z0-9]','',s.lower())
known=[clean(c['text']) for c in cues];seen=[];last=None
for i,frame in enumerate(frames):
    mask=frame>180
    if last is not None and np.count_nonzero(mask!=last)<1800:continue
    b=io.BytesIO();Image.fromarray(frame).save(b,format='PNG')
    words=clean(run(['tesseract','stdin','stdout','--psm','6'],input=b.getvalue(),capture_output=True).stdout.decode('utf8'))
    scores=[difflib.SequenceMatcher(None,words,k).ratio() for k in known];index=max(range(len(scores)),key=scores.__getitem__)
    assert scores[index]>.85,(i,words,scores)
    last=mask
    if not seen or seen[-1]['index']!=index:seen.append({'index':index,'approx':i/2+.25})
assert [c['index'] for c in seen]==list(range(8)),seen
cap=cv2.VideoCapture(str(tail))
for i,c in enumerate(seen):
    if i==0:c['start']=0;continue
    n=round((c['approx']-.25)*2);new=frames[n]>180;old=frames[max(0,n-1)]>180
    cap.set(cv2.CAP_PROP_POS_MSEC,max(0,c['approx']-.85)*1000)
    for _ in range(45):
        ok,f=cap.read();assert ok
        mask=cv2.cvtColor(f[962:1058,150:1770],cv2.COLOR_BGR2GRAY)>180
        if np.count_nonzero(mask!=new)<np.count_nonzero(mask!=old):c['start']=round(cap.get(cv2.CAP_PROP_POS_MSEC)/1000,3);break
    assert 'start' in c
cap.release()
earlier=json.loads((BASE/'aligned-timeline.json').read_text())
all_cues=[{**c,'end':min(c['end'],prefix_duration)} for c in earlier['cues'] if c['start']<555]
all_cues[-1]['end']=prefix_duration
for i,c in enumerate(seen):all_cues.append({**cues[i],'start':prefix_duration+c['start'],'end':prefix_duration+seen[i+1]['start'] if i+1<len(seen) else total})
def ts(t):
    m=round(t*1000);return f'{m//3600000:02}:{m//60000%60:02}:{m//1000%60:02},{m%1000:03}'
(DELIVERY/'Impact-Mosaic-Laptop-Walkthrough.en.srt').write_text('\n'.join(f'{i+1}\n{ts(c["start"])} --> {ts(c["end"])}\n{c["text"]}\n' for i,c in enumerate(all_cues)),encoding='utf8')
chapters=earlier['chapters'];chapters[-2]['end']=prefix_duration;chapters[-1].update(start=prefix_duration,end=total)
(DELIVERY/'Chapters.txt').write_text('Impact Mosaic — Laptop Walkthrough\n\n'+'\n'.join(f'{int(c["start"])//60:02}:{int(c["start"])%60:02}  {c["name"]}' for c in chapters)+'\n',encoding='utf8')
(OUT/'updated-timeline.json').write_text(json.dumps({'chapters':chapters,'cues':all_cues,'duration':total,'about_duration':tail_duration},indent=2))
(OUT/'export-probe.json').write_text(json.dumps(probe(video),indent=2))
print('UPDATED',video,flush=True)

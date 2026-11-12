"""Align the sidecar/embedded captions to the captions actually captured by Chrome."""
from pathlib import Path
import subprocess, json, re, difflib, io, shutil
import numpy as np
from PIL import Image
import cv2
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/playwright/laptop-walkthrough'
DELIVERY=ROOT/'output/Impact-Mosaic-Walkthrough'
VIDEO=DELIVERY/'Impact-Mosaic-Laptop-Walkthrough.mp4'
timeline=json.loads((OUT/'timeline.json').read_text())
ffmpeg=str(Path(shutil.which('ffmpeg')).resolve())
width,height=1620,96
raw=subprocess.run([ffmpeg,'-v','error','-i',str(VIDEO),'-vf',f'fps=1,crop={width}:{height}:150:962,format=gray','-f','rawvideo','-'],capture_output=True,check=True).stdout
frames=np.frombuffer(raw,np.uint8).reshape(-1,height,width)
clean=lambda s:re.sub(r'[^a-z0-9]','',s.lower())
known=[clean(c['text']) for c in timeline['cues']]
last=None; detected=[]
for second,frame in enumerate(frames):
    mask=frame>180
    if last is not None and np.count_nonzero(mask!=last)<1800:continue
    buf=io.BytesIO();Image.fromarray(frame).save(buf,format='PNG')
    result=subprocess.run(['tesseract','stdin','stdout','--psm','6'],input=buf.getvalue(),capture_output=True,check=True)
    words=clean(result.stdout.decode('utf8'))
    scores=[difflib.SequenceMatcher(None,words,k).ratio() for k in known]
    index=max(range(len(scores)),key=scores.__getitem__)
    if scores[index]<.84:raise RuntimeError(f'Unmatched caption at {second}: {result.stdout!r}, score={scores[index]}')
    last=mask
    if not detected or detected[-1]['index']!=index:
        detected.append({'index':index,'approx':second+.5,'score':scores[index]})
        print('Detected',index,second,round(scores[index],3),flush=True)
assert detected[0]['index']==0 and detected[-1]['index']==49
assert all(a['index']<b['index'] for a,b in zip(detected,detected[1:])),detected
# Refine each first appearance to the nearest output frame, comparing the masks
# of the preceding and following captions rather than interpreting OCR timings.
cap=cv2.VideoCapture(str(VIDEO))
for i,item in enumerate(detected):
    if i==0:item['start']=0;continue
    at=item['approx'];new=frames[min(int(at),len(frames)-1)]>180
    old=frames[max(0,int(at)-1)]>180
    start=max(0,at-1.6)
    cap.set(cv2.CAP_PROP_POS_MSEC,start*1000)
    found=None
    for _ in range(65):
        ok,frame=cap.read()
        if not ok:break
        t=cap.get(cv2.CAP_PROP_POS_MSEC)/1000
        mask=cv2.cvtColor(frame[962:1058,150:1770],cv2.COLOR_BGR2GRAY)>180
        if np.count_nonzero(mask!=new)<np.count_nonzero(mask!=old):found=t;break
    assert found is not None,item
    item['start']=round(found,3)
cap.release()
actual=[]
for i,item in enumerate(detected):
    cue=timeline['cues'][item['index']]
    actual.append({**cue,'start':item['start'],'end':detected[i+1]['start'] if i+1<len(detected) else 600})
assert actual[-1]['start']<588.5
timeline['cues']=actual
for i,c in enumerate(timeline['chapters']):
    c['start']=next(s['start'] for s in actual if s['chapter']==c['name'])
    c['end']=next((s['start'] for s in actual if s['start']>c['start'] and s['chapter']!=c['name']),600)
def ts(t):
    ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
srt=DELIVERY/'Impact-Mosaic-Laptop-Walkthrough.en.srt'
srt.write_text('\n'.join(f'{i+1}\n{ts(c["start"])} --> {ts(c["end"])}\n{c["text"]}\n' for i,c in enumerate(actual)),encoding='utf8')
metadata=[';FFMETADATA1','title=Impact Mosaic — Laptop Walkthrough']
for c in timeline['chapters']:
    metadata+=['[CHAPTER]','TIMEBASE=1/1000',f'START={round(c["start"]*1000)}',f'END={round(c["end"]*1000)}',f'title={c["name"]}']
meta=OUT/'aligned-chapters.ffmeta';meta.write_text('\n'.join(metadata),encoding='utf8')
temp=DELIVERY/'aligned.mp4'
subprocess.run([ffmpeg,'-y','-v','error','-i',str(VIDEO),'-i',str(meta),'-map','0:v:0','-map','0:a:0','-map_metadata','1','-map_chapters','-1','-c:v','copy','-c:a','copy','-movflags','+faststart',str(temp)],check=True)
temp.replace(VIDEO)
(OUT/'aligned-timeline.json').write_text(json.dumps(timeline,indent=2))
(OUT/'caption-alignment.json').write_text(json.dumps(detected,indent=2))
(DELIVERY/'Chapters.txt').write_text('Impact Mosaic — Laptop Walkthrough\n\n'+'\n'.join(f'{int(c["start"])//60:02}:{int(c["start"])%60:02}  {c["name"]}' for c in timeline['chapters'])+'\n',encoding='utf8')
print('Aligned',len(actual),'sidecar captions and chapter timestamps; picture and audio retained.',flush=True)

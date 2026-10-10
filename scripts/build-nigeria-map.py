"""Build a local SVG-path atlas from pinned geoBoundaries/GRID3 CC BY 4.0 data.

Run python scripts/build-nigeria-map.py. No extra Python packages required.
Downloads are pinned, cached in ignored output/geography and hashed in provenance.
"""
import hashlib
import json
import math
from pathlib import Path
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / 'output/geography'
CACHE.mkdir(parents=True, exist_ok=True)
PIN = '9469f09'

def polygons(geometry):
    return [geometry['coordinates']] if geometry['type'] == 'Polygon' else geometry['coordinates']

def rings(geometry):
    return [ring for polygon in polygons(geometry) for ring in polygon]

def bounds(geometry):
    points = [p for ring in rings(geometry) for p in ring]
    return [min(p[0] for p in points), min(p[1] for p in points), max(p[0] for p in points), max(p[1] for p in points)]

def in_ring(point, ring):
    x, y = point
    inside = False
    for a, b in zip(ring, ring[1:] + ring[:1]):
        if (a[1] > y) != (b[1] > y) and x < (b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]:
            inside = not inside
    return inside

def contains(point, geometry):
    return any(in_ring(point, poly[0]) and not any(in_ring(point, hole) for hole in poly[1:]) for poly in polygons(geometry))

def interior_points(geometry):
    # Midpoints of the widest interior scanline interval; excludes holes.
    bbox = bounds(geometry)
    candidates = []
    for fraction in [.5, .35, .65, .2, .8, .45, .55, .1, .9]:
        y = bbox[1] + (bbox[3]-bbox[1])*fraction
        intersections = []
        for ring in rings(geometry):
            for a, b in zip(ring, ring[1:]+ring[:1]):
                if (a[1] > y) != (b[1] > y):
                    intersections.append(a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]))
        intersections.sort()
        intervals = [(b-a, [(a+b)/2,y]) for a,b in zip(intersections,intersections[1:]) if contains([(a+b)/2,y],geometry)]
        if intervals:
            candidates.append(max(intervals, key=lambda x:x[0])[1])
        if len(candidates) == 3:
            break
    if len(candidates) != 3:
        raise ValueError('Three distinct interior points required')
    return candidates

def simplify(points, tolerance=.006):
    if len(points) < 3:
        return points
    a,b=points[0],points[-1]
    dx,dy=b[0]-a[0],b[1]-a[1]
    denom=dx*dx+dy*dy
    def distance(p):
        t=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/denom)) if denom else 0
        return math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)
    distance_max,index=max((distance(p),i) for i,p in enumerate(points))
    if distance_max <= tolerance:
        return [a,b]
    return simplify(points[:index+1],tolerance)[:-1]+simplify(points[index:],tolerance)

def simplified_ring(ring):
    points=ring[:-1] if ring[0] == ring[-1] else ring
    mid=max(range(1,len(points)),key=lambda i:math.dist(points[0],points[i]))
    result=simplify(points[:mid+1])[:-1]+simplify(points[mid:]+[points[0]])
    return result if len(result)>=4 else ring

datasets={}
provenance=[]
for level,expected in [('ADM1',37),('ADM2',774)]:
    url=f'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/{PIN}/releaseData/gbOpen/NGA/{level}/geoBoundaries-NGA-{level}_simplified.geojson'
    target=CACHE/f'{level}.geojson'
    if not target.exists():
        target.write_bytes(urlopen(url,timeout=60).read())
    raw=target.read_bytes()
    data=json.loads(raw)
    assert len(data['features'])==expected
    datasets[level]=data['features']
    provenance.append({'level':level,'units':expected,'download':url,'sha256':hashlib.sha256(raw).hexdigest(),'metadata':f'https://www.geoboundaries.org/api/current/gbOpen/NGA/{level}/'})

all_bounds=[bounds(f['geometry']) for f in datasets['ADM1']]
xmin,ymin,xmax,ymax=min(b[0] for b in all_bounds),min(b[1] for b in all_bounds),max(b[2] for b in all_bounds),max(b[3] for b in all_bounds)
scale=min(700/(xmax-xmin),580/(ymax-ymin))
def project(point):
    return [round(10+(point[0]-xmin)*scale,2),round(10+(ymax-point[1])*scale,2)]
def path(geometry):
    return ''.join('M'+'L'.join(','.join(str(v) for v in project(p)) for p in simplified_ring(ring))+'Z' for ring in rings(geometry))

states=[]
for feature in datasets['ADM1']:
    name=feature['properties']['shapeName']
    name='FCT' if name=='Abuja Federal Capital Territory' else name
    states.append({'id':feature['properties']['shapeISO'],'name':name,'path':path(feature['geometry']),'center':project(interior_points(feature['geometry'])[0]),'lgas':[]})

qa=[]
for feature in datasets['ADM2']:
    points=interior_points(feature['geometry'])
    votes=[]
    for point in points:
        matches=[i for i,f in enumerate(datasets['ADM1']) if contains(point,f['geometry'])]
        if len(matches)!=1:
            raise ValueError(f"Ambiguous state containment: {feature['properties']} {point} {matches}")
        votes.extend(matches)
    if len(set(votes))!=1:
        raise ValueError(f"State disagreement: {feature['properties']} {votes}")
    parent=states[votes[0]]
    parent['lgas'].append({'id':feature['properties']['shapeID'],'name':feature['properties']['shapeName'],'path':path(feature['geometry']),'center':project(points[0])})
    qa.append({'lga':feature['properties']['shapeName'],'state':parent['name'],'interiorChecks':len(points)})
assert len({s['id'] for s in states})==37
assert len({l['id'] for s in states for l in s['lgas']})==774
for s in states:
    s['lgas'].sort(key=lambda x:x['name'])
states.sort(key=lambda x:x['name'])
result={'version':1,'width':round(20+(xmax-xmin)*scale,2),'height':round(20+(ymax-ymin)*scale,2),'states':states}
out=ROOT/'public/nigeria-admin-map.json'
out.write_text(json.dumps(result,separators=(',',':')),encoding='utf-8')
(ROOT/'docs/nigeria-map-provenance.json').write_text(json.dumps({'source':'GRID3 via geoBoundaries gbOpen','yearRepresented':2022,'buildDate':'2023-12-12','license':'CC BY 4.0','licenseURL':'https://creativecommons.org/licenses/by/4.0/','citation':'Administrative boundaries: GRID3, geoBoundaries Database (www.geoboundaries.org). CC BY 4.0.','pinnedCommit':PIN,'retrievedDate':'2026-10-08','derivedAsset':'public/nigeria-admin-map.json','derivedSHA256':hashlib.sha256(out.read_bytes()).hexdigest(),'changes':'State/LGA hierarchy derived from unanimous three interior-point containment checks; SVG paths simplified at 0.006 degrees, projected and rounded for display. Not surveyed home locations.','layers':provenance,'states':[{ 'name':s['name'],'lgaCount':len(s['lgas'])} for s in states]},indent=2)+'\n',encoding='utf-8')
(CACHE/'parent-qa.json').write_text(json.dumps(qa,indent=2),encoding='utf-8')
print(f'Generated {len(states)} state/FCT paths and 774 LGA paths; {out.stat().st_size:,} bytes; unanimous interior containment checks.')

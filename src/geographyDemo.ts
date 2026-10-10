import type { LearnerRow } from './reportingDemo';
export type MapArea = { id: string; name: string; path: string; center: [number, number] };
export type MapState = MapArea & { lgas: MapArea[] };
export type NigeriaAtlas = { version: 1; width: number; height: number; states: MapState[] };
export const normalizedLocation = (v: string) => v.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const stateAliases: Record<string,string> = { 'fct': 'fct', 'abuja': 'fct', 'federal capital territory': 'fct', 'abuja federal capital territory': 'fct', 'fct abuja': 'fct' };
export function stateLocationKey(value: string) { const key = normalizedLocation(value).replace(/ state$/, ''); return stateAliases[key] ?? key; }
function lgaKey(value: string, state: MapState) {
 const key = normalizedLocation(value).replace(/ (lga|local government area|area council)$/, '');
 if (state.name === 'FCT' && ['amac','abuja municipal','abuja municipal area council','municipal area council','municipal'].includes(key)) return 'amac';
 return key;
}
export function locateLearner(atlas: NigeriaAtlas, learner: LearnerRow): { state?: MapState; lga?: MapArea } {
 const state = atlas.states.find(s => stateLocationKey(s.name) === stateLocationKey(learner.state));
 if (!state) return {};
 const key = lgaKey(learner.lga,state);
 return { state, lga: state.lgas.find(l => lgaKey(l.name,state) === key) };
}
export function geographyCounts(atlas: NigeriaAtlas, rows: LearnerRow[]) {
 const states: Record<string,number> = {}, lgas: Record<string,number> = {};
 const unmatched: LearnerRow[] = [];
 for (const row of rows) {
  const location = locateLearner(atlas,row);
  if (location.state) states[location.state.id] = (states[location.state.id] ?? 0)+1;
  if (location.lga) lgas[location.lga.id] = (lgas[location.lga.id] ?? 0)+1;
  else unmatched.push(row);
 }
 return {states,lgas,unmatched};
}
function pathBounds(path: string): [number,number,number,number] | undefined {
 const number='-?\\d+(?:\\.\\d+)?';
 if (!new RegExp(`^(?:M${number},${number}(?:L${number},${number}){3,}Z)+$`).test(path)) return undefined;
 let xmin=Infinity,ymin=Infinity,xmax=-Infinity,ymax=-Infinity;
 for (const ring of path.match(/M[^M]+Z/g) ?? []) {
  const points=Array.from(ring.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g),m=>[Number(m[1]),Number(m[2])]);
  if (points.some(p=>!p.every(Number.isFinite)) || points[0][0]!==points.at(-1)![0] || points[0][1]!==points.at(-1)![1]) return undefined;
  const area=points.slice(1).reduce((sum,p,i)=>sum+points[i][0]*p[1]-p[0]*points[i][1],0);
  if (!Number.isFinite(area) || Math.abs(area)<.000001) return undefined;
  for (const [x,y] of points) {xmin=Math.min(xmin,x);ymin=Math.min(ymin,y);xmax=Math.max(xmax,x);ymax=Math.max(ymax,y);}
 }
 return xmax>xmin&&ymax>ymin?[xmin,ymin,xmax,ymax]:undefined;
}
export function validNigeriaAtlas(value: unknown): value is NigeriaAtlas {
 if (!value || typeof value !== 'object') return false;
 const atlas = value as NigeriaAtlas;
 const finite = (n: unknown) => typeof n === 'number' && Number.isFinite(n);
 const validArea = (v: MapArea) => {
  if (!v || typeof v.id!=='string' || !v.id || typeof v.name!=='string' || !v.name || typeof v.path!=='string' || !Array.isArray(v.center) || v.center.length!==2 || !v.center.every(finite)) return false;
  const bbox=pathBounds(v.path);
  return !!bbox && bbox[0]>=0 && bbox[1]>=0 && bbox[2]<=atlas.width && bbox[3]<=atlas.height && v.center[0]>=bbox[0] && v.center[0]<=bbox[2] && v.center[1]>=bbox[1] && v.center[1]<=bbox[3];
 };
 if (atlas.version !== 1 || !finite(atlas.width) || !finite(atlas.height) || atlas.width <= 0 || atlas.height <= 0 || !Array.isArray(atlas.states) || atlas.states.length !== 37 || !atlas.states.every(s => validArea(s) && Array.isArray(s.lgas) && s.lgas.length > 0 && s.lgas.every(validArea) && new Set(s.lgas.map(l=>normalizedLocation(l.name))).size===s.lgas.length)) return false;
 const ids = atlas.states.flatMap(s => [s.id,...s.lgas.map(l => l.id)]);
 return new Set(ids).size === ids.length && new Set(atlas.states.map(s=>stateLocationKey(s.name))).size===37 && atlas.states.reduce((n,s) => n+s.lgas.length,0) === 774;
}
export function areaViewBox(areas: MapArea[]) {
 const boxes=areas.map(a=>pathBounds(a.path));
 if (!boxes.length || boxes.some(b=>!b)) throw new Error('Map geometry has no valid viewbox');
 const x=Math.min(...boxes.map(b=>b![0])), y=Math.min(...boxes.map(b=>b![1]));
 const width=Math.max(...boxes.map(b=>b![2]))-x, height=Math.max(...boxes.map(b=>b![3]))-y;
 const pad=Math.max(width,height)*.025;
 return `${x-pad} ${y-pad} ${width+2*pad} ${height+2*pad}`;
}

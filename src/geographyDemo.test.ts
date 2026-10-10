import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validNigeriaAtlas, locateLearner, geographyCounts, areaViewBox } from './geographyDemo';
import type { LearnerRow } from './reportingDemo';
const atlas = JSON.parse(readFileSync('public/nigeria-admin-map.json','utf-8'));
const row = (state: string,lga: string,id='sample-test'): LearnerRow => ({id,name:'Fictional',state,lga,onboarded:true,fictional:true,source:'sample'});
test('local Nigeria atlas validates complete uniquely keyed state/LGA hierarchy and viewboxes', () => {
 assert.equal(validNigeriaAtlas(atlas),true);
 assert.equal(atlas.states.find((s: {name:string}) => s.name==='Plateau').lgas.length,17);
 assert.equal(atlas.states.find((s: {name:string}) => s.name==='Lagos').lgas.length,20);
 const bad=structuredClone(atlas); bad.states[0].lgas[0].id=bad.states[0].id; assert.equal(validNigeriaAtlas(bad),false);
 const corrupt=structuredClone(atlas); corrupt.states[0].path='malformed'; assert.equal(validNigeriaAtlas(corrupt),false);
 const emptyState=structuredClone(atlas);emptyState.states[1].lgas.push(...emptyState.states[0].lgas);emptyState.states[0].lgas=[];assert.equal(validNigeriaAtlas(emptyState),false);
 const repeatedName=structuredClone(atlas);repeatedName.states[0].lgas[1].name=repeatedName.states[0].lgas[0].name;assert.equal(validNigeriaAtlas(repeatedName),false);
 for (const invalid of ['Z','M1,1L1,1L1,1L1,1Z','M1,1L2,2L3,3L1,1Z','M1,1L2,1L2,2L3,1Z']) {
  const broken=structuredClone(atlas); broken.states[0].lgas[0].path=invalid;assert.equal(validNigeriaAtlas(broken),false);
  assert.throws(()=>areaViewBox([{...broken.states[0].lgas[0]}]));
 }
 assert.ok(areaViewBox(atlas.states).split(' ').every(v => Number.isFinite(Number(v))));
});
test('geography joins explicit normalized state and LGA, retains unmatched without guessing', () => {
 assert.equal(locateLearner(atlas,row(' plateau STATE ',' JOS-north ')).lga?.name,'Jos North');
 assert.ok(locateLearner(atlas,row('Federal Capital Territory','Abuja Municipal')).lga);
 assert.equal(locateLearner(atlas,row('FCT','AMAC')).state?.name,'FCT');
 assert.equal(locateLearner(atlas,row('Lagos','Jos North')).lga,undefined);
 assert.equal(locateLearner(atlas,row('','Jos North')).state,undefined);
 const counts=geographyCounts(atlas,[row('Plateau','Jos North','1'),row('Plateau','Jos North','2'),row('Plateau','Unknown','3'),row('Unknown','Unknown','4')]);
 const jos=locateLearner(atlas,row('Plateau','Jos North'));
 assert.equal(counts.states[jos.state!.id],3); assert.equal(counts.lgas[jos.lga!.id],2); assert.equal(counts.unmatched.length,2);
});

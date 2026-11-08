import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { connectedLearnerGeography } from './connectedGeography';
import { commandConnected, connectedView, freshPresentation, type Person } from './connectedDemo';
import type { NigeriaAtlas } from './geographyDemo';

const atlas: NigeriaAtlas = JSON.parse(readFileSync('public/nigeria-admin-map.json', 'utf8'));

test('connected map counts only current learners, distinguishes samples and retains unknown locations', () => {
 const seed = connectedView(freshPresentation()).people;
 const learner = seed.find(person => person.id === 'ada')!;
 const registered: Person[] = [
  { ...learner, id: 'new-one', sample: false, homeState: 'Plateau' },
  { ...learner, id: 'new-two', sample: false, homeState: 'Plateau State' },
  { ...learner, id: 'new-fct', sample: false, homeState: 'Abuja' },
  { ...learner, id: 'new-unknown', sample: false, homeState: 'Unknown place' },
 ];
 const people = [...seed, ...registered, { ...seed.find(person => person.id === 'amaka')!, homeState: 'Plateau' }];
 const before = structuredClone(people);
 const all = connectedLearnerGeography(people, atlas);
 assert.equal(all.learners.length, 6);
 assert.deepEqual(all.byState['NG-PL'].map(person => person.id), ['new-one', 'new-two']);
 assert.deepEqual(all.byState['NG-FC'].map(person => person.id), ['new-fct']);
 assert.deepEqual(all.unlocated.map(person => person.id), ['ada', 'sani', 'new-unknown']);
 assert.equal(connectedLearnerGeography(people, atlas, 'registered').learners.length, 4);
 assert.equal(connectedLearnerGeography(people, atlas, 'samples').learners.length, 2);
 assert.deepEqual(people, before);
});

test('new connected registration and home-state changes update the map without changing earlier records', () => {
 let state = freshPresentation();
 const registered = commandConnected(state, { id: 'map-registration', expectedVersion: 0, actorId: null, type: 'register', payload: { name: 'Map learner', username: 'map-learner', role: 'learner', demoCode: 'DEMO-MAP', goal: '', access: '', bio: '', courseIds: [], homeState: 'Plateau' } });
 assert.equal(registered.error, undefined);
 state = registered.state;
 assert.equal(connectedLearnerGeography(connectedView(state).people, atlas).byState['NG-PL'].length, 1);
 const learner = connectedView(state).people.find(person => person.username === 'map-learner')!;
 const changed = commandConnected(state, { id: 'map-state-update', expectedVersion: state.events.length, actorId: learner.id, type: 'set-home-state', payload: { state: 'FCT' } });
 assert.equal(changed.error, undefined);
 const result = connectedLearnerGeography(connectedView(changed.state).people, atlas);
 assert.equal(result.byState['NG-PL'], undefined);
 assert.equal(result.byState['NG-FC'].length, 1);
 assert.deepEqual(changed.state.events[0], state.events[0]);
 assert.equal(changed.state.legacy, undefined);
});

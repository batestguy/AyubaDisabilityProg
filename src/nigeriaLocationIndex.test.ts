import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { canonicalGrantLocation, nigeriaLocationNames } from './nigeriaLocationIndex';

test('grant location names match the pinned local atlas and retain paired FCT aliases', () => {
  const atlas = JSON.parse(readFileSync('public/nigeria-admin-map.json', 'utf8')) as { states: { name: string; lgas: { name: string }[] }[] };
  assert.deepEqual(nigeriaLocationNames, Object.fromEntries(atlas.states.map(s => [s.name, s.lgas.map(l => l.name)])));
  assert.deepEqual(canonicalGrantLocation('Plateau State', 'Jos North LGA'), { state: 'Plateau', lga: 'Jos North' });
  assert.deepEqual(canonicalGrantLocation('Federal Capital Territory', 'Abuja Municipal'), { state: 'FCT', lga: 'Municipal Area Council' });
  assert.deepEqual(canonicalGrantLocation('Lagos', 'Jos North'), { state: 'Lagos', lga: 'Other recorded location' });
  assert.deepEqual(canonicalGrantLocation('PRIVATE_STATE_SENTINEL', 'PRIVATE_LGA_SENTINEL'), { state: 'Other recorded location', lga: 'Other recorded location' });
  assert.deepEqual(canonicalGrantLocation('', ''), { state: 'Not recorded', lga: 'Not recorded' });
});

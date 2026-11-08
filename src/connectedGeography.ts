import type { Person } from './connectedDemo';
import { stateLocationKey, type NigeriaAtlas } from './geographyDemo';

export type ConnectedMapScope = 'all' | 'registered' | 'samples';

export function mapLearners(people: readonly Person[], scope: ConnectedMapScope): Person[] {
 return people.filter(person => person.role === 'learner' && (scope === 'all' || (scope === 'samples' ? person.sample : !person.sample)));
}

export function connectedLearnerGeography(people: readonly Person[], atlas: NigeriaAtlas, scope: ConnectedMapScope = 'all') {
 const learners = mapLearners(people, scope);
 const byState: Record<string, Person[]> = {};
 const unlocated: Person[] = [];
 const stateIds = new Map(atlas.states.map(state => [stateLocationKey(state.name), state.id]));
 for (const person of learners) {
  const stateId = stateIds.get(stateLocationKey(person.homeState ?? ''));
  if (stateId) (byState[stateId] ??= []).push(person);
  else unlocated.push(person);
 }
 return { learners, byState, unlocated };
}

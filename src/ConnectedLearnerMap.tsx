import { useEffect, useRef, useState } from 'react';
import type { Person } from './connectedDemo';
import { connectedLearnerGeography, mapLearners, type ConnectedMapScope } from './connectedGeography';
import { areaViewBox, validNigeriaAtlas, type NigeriaAtlas } from './geographyDemo';
import './connectedLearnerMap.css';

export function ConnectedLearnerMap({ people, onOpenLearner }: { people: readonly Person[]; onOpenLearner: (id: string) => void }) {
 const [atlas, setAtlas] = useState<NigeriaAtlas>();
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState('');
 const [attempt, setAttempt] = useState(0);
 const [scope, setScope] = useState<ConnectedMapScope>('all');
 const [stateId, setStateId] = useState('');
 const [lgaId, setLgaId] = useState('');
 const [missingOnly, setMissingOnly] = useState(false);
 const [search, setSearch] = useState('');
 const [navigation, setNavigation] = useState(0);
 const heading = useRef<HTMLHeadingElement>(null);

 useEffect(() => {
  const controller = new AbortController();
  setLoading(true); setError('');
  fetch('/nigeria-admin-map.json', { signal: controller.signal })
   .then(response => { if (!response.ok) throw new Error('Map unavailable'); return response.json(); })
   .then(data => { if (!validNigeriaAtlas(data)) throw new Error('Map data failed validation'); setAtlas(data); setLoading(false); })
   .catch(reason => { if (!controller.signal.aborted) { setAtlas(undefined); setError(reason instanceof Error ? reason.message : 'Map unavailable'); setLoading(false); } });
  return () => controller.abort();
 }, [attempt]);
 useEffect(() => { if (navigation) heading.current?.focus(); }, [navigation]);

 const geography = atlas ? connectedLearnerGeography(people, atlas, scope) : undefined;
 const state = atlas?.states.find(area => area.id === stateId);
 const lga = state?.lgas.find(area => area.id === lgaId);
 const learners = geography?.learners ?? mapLearners(people, scope);
 const located = missingOnly && geography ? geography.unlocated : state && geography ? geography.byState[state.id] ?? [] : learners;
 const query = search.trim().toLowerCase();
 const shown = located.filter(person => `${person.name} ${person.homeState ?? ''}`.toLowerCase().includes(query));
 const areas = state?.lgas ?? atlas?.states ?? [];
 const viewBox = state ? areaViewBox(state.lgas) : atlas ? `0 0 ${atlas.width} ${atlas.height}` : '';
 function navigate(nextState = '', nextLga = '', missing = false) { setStateId(nextState); setLgaId(nextLga); setMissingOnly(missing); setNavigation(value => value + 1); }
 const title = missingOnly ? 'Learners without a matched home state' : lga ? `${state!.name} · ${lga.name}` : state ? `${state.name} · Learners and LGA boundaries` : 'Nigeria · Learners by home state';

 return <div className="cd-geography">
  <p>Explore learners by their recorded home state. These counts use the current connected workspace, including new registrations.</p>
  <div className="cd-map-filters">
   <label>Map profile scope<select aria-label="Map profile scope" value={scope} onChange={event => setScope(event.target.value as ConnectedMapScope)}><option value="all">All learner profiles</option><option value="registered">Registered learner profiles</option><option value="samples">Sample learner profiles</option></select></label>
   {atlas && <><label>Choose state or FCT<select aria-label="Choose state or FCT" value={stateId} onChange={event => navigate(event.target.value)}><option value="">All Nigeria</option>{atlas.states.map(area => {const count=geography?.byState[area.id]?.length ?? 0;return <option key={area.id} value={area.id}>{area.name} ({count} {count===1?'learner':'learners'})</option>;})}</select></label>
    {state && <label>Choose LGA boundary<select aria-label="Choose LGA boundary" value={lgaId} onChange={event => navigate(state.id, event.target.value)}><option value="">All {state.name} LGAs</option>{state.lgas.map(area => <option key={area.id} value={area.id}>{area.name}</option>)}</select></label>}</>}
  </div>
  <nav className="cd-map-breadcrumbs" aria-label="Learner map navigation"><button onClick={() => navigate()}>Nigeria</button>{state && <button onClick={() => navigate(state.id)}>{state.name}</button>}{lga && <span aria-current="location">{lga.name}</span>}</nav>
  <h3 ref={heading} tabIndex={-1}>{title}</h3>
  {loading && <p role="status">Loading Nigeria learner map…</p>}
  {error && <div className="cd-error"><p role="alert">{error}. Learner records remain available below.</p><button onClick={() => setAttempt(value => value + 1)}>Retry loading map</button></div>}
  {state && <p className="cd-map-note">Learner profiles record a home state, not an LGA. LGA boundaries are shown for reference; the list below includes learners across {state.name}.</p>}
  {atlas && !missingOnly && <div className="cd-map-frame"><svg className="cd-nigeria-map" viewBox={viewBox} role="group" aria-label={state ? `${state.name} LGA boundaries` : 'Nigeria learner state map'}>
   {areas.map(area => {
    const count = geography?.byState[area.id]?.length ?? 0;
    const name = state ? `${area.name}: LGA boundary` : `${area.name}: ${count} learner${count === 1 ? '' : 's'}`;
    return <path key={area.id} d={area.path} fillRule="evenodd" vectorEffect="non-scaling-stroke" fill={state ? '#edf2ec' : count > 1 ? '#396b57' : count ? '#afc8b5' : '#f2f5ef'} className={lgaId === area.id ? 'is-selected' : undefined} role="button" tabIndex={0} aria-label={name} aria-pressed={lgaId === area.id} onClick={() => state ? navigate(state.id, area.id) : navigate(area.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); state ? navigate(state.id, area.id) : navigate(area.id); } }}><title>{name}</title></path>;
   })}
  </svg><p className="cd-map-legend">{state ? 'LGA boundaries only · Select an area to see its name.' : 'Learner profiles: light = 0 · pale green = 1 · dark green = 2 or more. Counts are also available in the state selector.'}</p></div>}
  {atlas && <><p className="cd-map-source">Boundaries: GRID3 via <a href="https://www.geoboundaries.org/api/current/gbOpen/NGA/ADM2/" target="_blank" rel="noreferrer">geoBoundaries</a>, represented year 2022, <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. No home coordinates are shown.</p>
   <button onClick={() => navigate('', '', true)}>Missing or unmatched state ({geography?.unlocated.length ?? 0})</button>{missingOnly && <button onClick={() => navigate()}>Return to Nigeria map</button>}</>}
  <section className="cd-map-learners" aria-label="Mapped learner records"><h3>{state ? `Learners in ${state.name}` : 'Learner records'}</h3>
   <label>Search map learner list<input type="search" value={search} onChange={event => setSearch(event.target.value)} /></label>
   <p role="status">{shown.length} of {located.length} learner profiles shown. Map counts use the selected profile scope; search filters this list.</p>
   {!shown.length && <p>No matching learners. Choose another state or clear the search.</p>}
   {shown.map(person => <article className="cd-map-person" key={person.id}><div><h4>{person.name}</h4><p>{person.homeState || 'Home state not recorded'} · {person.sample ? 'Sample learner' : 'Registered learner'}</p></div><button onClick={() => onOpenLearner(person.id)}>Open learner: {person.name}</button></article>)}
  </section>
 </div>;
}

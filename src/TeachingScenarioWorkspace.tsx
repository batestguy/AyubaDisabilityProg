import { useRef, useState } from 'react';
import { GuidedTeachingDemo } from './GuidedTeachingDemo';
import { commandScenario, freshScenario, loadScenario, resetScenario, saveScenario, type ScenarioCommand, type ScenarioRole } from './teachingScenario';

export function TeachingScenarioWorkspace({ role, onRole }: { role: ScenarioRole; onRole: (role: ScenarioRole) => void }) {
 const [loaded, setLoaded] = useState(loadScenario);
 const [state, setState] = useState(loaded.state);
 const latest = useRef(state);
 const [warning, setWarning] = useState(loaded.warning ?? '');
 const [resetting, setResetting] = useState(false);
 const [resetEpoch, setResetEpoch] = useState(0);
 const [error, setError] = useState('');
 function command(input: Omit<ScenarioCommand, 'id' | 'expectedVersion' | 'role'>) {
  if (loaded.recovery) return 'Recover the guided demo before making changes.';
  const result = commandScenario(latest.current, { ...input, id: crypto.randomUUID(), expectedVersion: state.events.length, role });
  if (result.error) return result.error;
  latest.current = result.state; setState(result.state);
  if (!saveScenario(result.state)) setWarning('The latest changes remain in memory. Saving could not be verified; reloading may lose this guided journey.');
  else setWarning('');
  return undefined;
 }
 function reset() {
  if (!resetScenario()) { setError('Could not clear the guided demo. Retry when session storage is available.'); return; }
  const next = freshScenario(); latest.current = next; setState(next); setLoaded({ state: next }); setWarning(''); setError(''); setResetting(false); setResetEpoch(x => x + 1);
 }
 return <section aria-label="Guided teaching sample">
  <p className="ma-readonly"><strong>FICTIONAL TEACHING DEMO</strong> · Trainer Amaka Obi, Ada Okafor and Sani Musa are examples. Actions update this sample journey only. Existing demo records are kept separately.</p>
  {warning && <p role="status" className="mp-error">{warning}</p>}
  {loaded.recovery ? <section className="mp-card"><h2>Saved guided demo needs attention</h2><p role="alert">{loaded.recovery}</p><button onClick={() => { const next = loadScenario(); setLoaded(next); latest.current = next.state; setState(next.state); setWarning(next.warning ?? ''); }}>Retry loading guided demo</button></section> : <GuidedTeachingDemo key={resetEpoch} state={state} role={role} onRole={onRole} onCommand={command} onReset={() => setResetting(true)} />}
  {loaded.recovery && <button onClick={() => setResetting(true)}>Reset guided demo</button>}
  {resetting && <section className="mp-card" aria-label="Restart guided demo confirmation"><h3>Restart this fictional journey?</h3><p>Clear only Amaka, Ada and Sani’s sample action history and restore their starting examples.</p><button onClick={reset}>Confirm restart guided demo</button><button onClick={() => setResetting(false)}>Keep sample progress</button></section>}
  {error && <p role="alert">{error}</p>}
 </section>;
}

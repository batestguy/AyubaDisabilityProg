import { useEffect, useMemo, useRef, useState } from 'react';
import ConnectedDemo from './ConnectedParticipantDemo';
import { authenticateConnected, commandConnected, connectedView, freshConnected, loadConnected, resetConnected, saveConnected, type ConnectedAction, type Person } from './connectedDemo';
import { loadSharedDemo } from './sharedDemo';

export function ConnectedWorkspace({ onOpenEarlier }: { onOpenEarlier: () => void }) {
 const [loaded, setLoaded] = useState(() => { const earlier = loadSharedDemo(); return loadConnected(earlier.recovery ? undefined : earlier.session); });
 const [state, setState] = useState(loaded.state);
 const latest = useRef(state);
 const [actorId, setActorId] = useState<string | null>(null);
 const [warning, setWarning] = useState(loaded.warning ?? '');
 const [resetting, setResetting] = useState(false);
 const [resetError, setResetError] = useState('');
 const [epoch, setEpoch] = useState(0);
 const view = useMemo(() => connectedView(state), [state]);
 const actor = view.people.find(p => p.id === actorId) ?? null;
 useEffect(() => {
  if (!loaded.recovery && !loaded.warning && !saveConnected(latest.current)) setWarning('Saving could not be verified. Keep this page open; leaving or reloading may lose changes.');
 }, []);
 function command(type: ConnectedAction, payload: Record<string, unknown>, registration = false): string | undefined {
  if (loaded.recovery) return 'Recover the saved workspace before making changes.';
  const result = commandConnected(latest.current, { id: crypto.randomUUID(), expectedVersion: state.events.length, actorId: registration ? null : actorId, type, payload });
  if (result.error) return result.error;
  latest.current = result.state; setState(result.state);
  if (!saveConnected(result.state)) setWarning('The latest changes remain in memory. Saving could not be verified; leaving or reloading may lose them. Another tab may have newer data.');
  else setWarning('');
  return undefined;
 }
 function register(payload: { name: string; username: string; role: 'learner' | 'facilitator'; goal: string; access: string; bio: string; courseIds: string[] }): { error?: string; person?: Person } {
  const username = payload.username.trim().toLowerCase();
  const error = command('register', { ...payload, username, demoCode: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}` }, true);
  return error ? { error } : { person: connectedView(latest.current).people.find(p => p.username === username) };
 }
 function reset() {
  if (!resetConnected()) { setResetError('Could not reset the connected workspace. Its existing records are retained.'); return; }
  const next = freshConnected(state.legacy);
  latest.current = next; setState(next); setLoaded({ state: next }); setActorId(null); setResetting(false); setResetError(''); setEpoch(x => x + 1);
  setWarning(saveConnected(next) ? '' : 'The restored samples are in memory. Saving could not be verified.');
 }
 return <div className="showcase"><section className="section">
  {warning && <p role="status" className="mp-error">{warning}</p>}
  {loaded.recovery ? <section className="mp-card"><h1>Saved workspace needs attention</h1><p role="alert">{loaded.recovery}</p><button onClick={() => { const next = loadConnected(state.legacy); setLoaded(next); latest.current = next.state; setState(next.state); setActorId(null); setWarning(next.warning ?? ''); }}>Retry loading workspace</button><button onClick={() => setResetting(true)}>Reset connected workspace</button><button onClick={onOpenEarlier}>Open earlier detailed demo</button></section> : <ConnectedDemo key={`${actorId ?? 'signed-out'}:${epoch}`} view={view} actor={actor} onSignIn={(username, code) => { const person = authenticateConnected(view, username, code); if (!person) return 'The username or demo access code does not match. Use sample codes only, not a real password.'; setActorId(person.id); return undefined; }} onSignOut={() => { setActorId(null); setEpoch(x => x + 1); }} onCommand={command} onRegister={register} onReset={() => { setResetError(''); setResetting(true); }} onOpenEarlier={onOpenEarlier} />}
  {resetting && <section className="mp-card" aria-label="Reset connected workspace confirmation"><h2>Reset this connected workspace?</h2><p>This removes newly registered participants, new learning progress, teaching reviews, chat messages and support actions. The permanent sample participants return to their starting examples. The originally imported learner/history and earlier detailed demo are preserved.</p><button onClick={reset}>Confirm reset connected workspace</button><button onClick={() => setResetting(false)}>Keep workspace records</button>{resetError && <p role="alert">{resetError}</p>}</section>}
 </section></div>;
}

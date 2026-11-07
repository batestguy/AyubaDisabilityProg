import { CONNECTED_KEY, freshPresentation, validConnected } from './connectedDemo';
import { USER_DEMO_KEY } from './userDemo';
import { USER_DEMO_BACKUP_KEY } from './sharedDemo';
import { SCENARIO_KEY } from './teachingScenario';

type DemoStorage = Pick<Storage, 'getItem'|'setItem'|'removeItem'>;
export const demoSessionKeys = [USER_DEMO_KEY, USER_DEMO_BACKUP_KEY, SCENARIO_KEY, 'mosaic-v1'];

export function startFreshDemo(local: DemoStorage, session: DemoStorage): { error?: string } {
 const snapshot: { storage: DemoStorage; key: string; value: string|null }[] = [];
 let started = false;
 try {
  for (const [storage, keys] of [[local, [CONNECTED_KEY]], [session, demoSessionKeys]] as const) {
   for (const key of keys) snapshot.push({storage,key,value:storage.getItem(key)});
  }
  const clean = freshPresentation();
  if (!validConnected(clean)) return {error:'The fresh demo could not be prepared. Existing records are unchanged.'};
  const encoded = JSON.stringify(clean);
  started = true;
  for (const {storage,key} of snapshot) {
   storage.removeItem(key);
   if (storage.getItem(key) !== null) throw new Error('Removal not verified');
  }
  local.setItem(CONNECTED_KEY,encoded);
  if (local.getItem(CONNECTED_KEY) !== encoded) throw new Error('Save not verified');
  return {};
 } catch {
  let restored = true;
  if (started) for (const {storage,key,value} of snapshot) {
   try {
    if (value === null) storage.removeItem(key); else storage.setItem(key,value);
    if (storage.getItem(key) !== value) restored = false;
   } catch { restored = false; }
  }
  return {error:restored?'The fresh start could not be saved. Existing records are unchanged. Check browser storage and retry.':'Browser storage failed during reset and recovery. Some demo records may have changed; keep this page open and retry when storage is available.'};
 }
}

import { courses, type Course } from './catalogue';

export type ScenarioRole = 'User' | 'Administration' | 'Facilitator';
export type LearnerId = 'ada' | 'sani';
export type ActionType = 'submit-work' | 'request-changes' | 'approve-work' | 'reply-question' | 'refer-support' | 'respond-support' | 'assign-work';
export type ScenarioCommand = { id: string; expectedVersion: number; role: ScenarioRole; learnerId: LearnerId; type: ActionType; text: string };
export type ScenarioEvent = ScenarioCommand & { at: number };
export type ScenarioState = { schemaVersion: 1; events: ScenarioEvent[] };
export type ScenarioLearner = { id: LearnerId; name: string; goal: string; access: string; course: Course; lessonsDone: number; quizBest: number; work?: string; submissionRevision: number; assignmentRevision: number; review?: 'needs-changes' | 'approved'; feedback?: string; question: string; reply?: string; support?: string; supportResponse?: string };
export const SCENARIO_TRAINER = 'Amaka Obi';
export const SCENARIO_KEY = 'mosaic-guided-teaching-v1';
const roles: ScenarioRole[] = ['User', 'Administration', 'Facilitator'];
const owner: Record<ActionType, ScenarioRole> = { 'submit-work': 'User', 'request-changes': 'Facilitator', 'approve-work': 'Facilitator', 'reply-question': 'Facilitator', 'refer-support': 'Facilitator', 'respond-support': 'Administration', 'assign-work': 'Administration' };
const keys = ['id', 'expectedVersion', 'role', 'learnerId', 'type', 'text'];
const textOK = (value: unknown, limit: number) => typeof value === 'string' && value.trim().length > 0 && value.length <= limit;
export const freshScenario = (): ScenarioState => ({ schemaVersion: 1, events: [] });

function startingLearners(): ScenarioLearner[] {
 const course = courses.find(c => c.id === 'digital-essentials')!;
 return [
  { id: 'ada', name: 'Ada Okafor', goal: 'Organise digital work and communicate clearly with customers.', access: 'Written steps and flexible pacing.', course: structuredClone(course), lessonsDone: course.lessons.length, quizBest: 85, work: 'I will create a folder for customer work and send a clear message. I still need to explain safe filenames and my low-connectivity backup.', submissionRevision: 1, assignmentRevision: 1, question: 'How can I choose a useful filename?' },
  { id: 'sani', name: 'Sani Musa', goal: 'Use a phone confidently for learning and work.', access: 'Short text instructions and larger text when helpful.', course: structuredClone(course), lessonsDone: Math.min(3, course.lessons.length), quizBest: 60, submissionRevision: 0, assignmentRevision: 0, question: 'How can I continue learning when my internet connection is weak?' },
 ];
}
function applyEvent(learners: ScenarioLearner[], e: ScenarioCommand) {
 const l = learners.find(x => x.id === e.learnerId)!;
 switch (e.type) {
  case 'submit-work': l.work = e.text; l.submissionRevision++; l.review = undefined; l.feedback = undefined; break;
  case 'assign-work': l.assignmentRevision = l.submissionRevision; break;
  case 'request-changes': l.review = 'needs-changes'; l.feedback = e.text; break;
  case 'approve-work': l.review = 'approved'; l.feedback = e.text; break;
  case 'reply-question': l.reply = e.text; break;
  case 'refer-support': l.support = e.text; break;
  case 'respond-support': l.supportResponse = e.text; break;
 }
}
export function scenarioLearners(state: ScenarioState): ScenarioLearner[] {
 const learners = startingLearners();
 for (const event of state.events) applyEvent(learners, event);
 return learners;
}
export function scenarioComplete(l: ScenarioLearner) {
 return l.lessonsDone === l.course.lessons.length && l.quizBest >= 70 && !!l.work?.trim() && l.review === 'approved';
}
function commandIssue(learners: ScenarioLearner[], c: ScenarioCommand): string | undefined {
 if (!c || Object.keys(c).some(k => !keys.includes(k)) || !textOK(c.id, 100) || !Number.isInteger(c.expectedVersion) || c.expectedVersion < 0 || !roles.includes(c.role) || !['ada', 'sani'].includes(c.learnerId) || !Object.hasOwn(owner, c.type) || !textOK(c.text, 3000) || c.text !== c.text.trim()) return 'Complete the action with a valid, nonblank note of at most 3,000 characters.';
 if (owner[c.type] !== c.role) return 'Switch to the role responsible for this action.';
 const l = learners.find(x => x.id === c.learnerId)!;
 if (c.type === 'assign-work' && (!l.work || l.assignmentRevision === l.submissionRevision)) return 'Assign a new practical submission that is awaiting coordination.';
 if (['request-changes', 'approve-work'].includes(c.type) && (!l.work || l.assignmentRevision !== l.submissionRevision || l.review)) return 'Review only the current assigned submission, before a decision has been recorded. Ask Administration to assign revised work.';
 if (c.type === 'reply-question' && l.reply) return 'This learning question already has a reply.';
 if (c.type === 'refer-support' && l.support) return 'This learner already has a support referral.';
 if (c.type === 'respond-support' && (!l.support || l.supportResponse)) return 'Respond to a pending support referral.';
 return undefined;
}
export function validScenario(value: unknown): value is ScenarioState {
 if (!value || typeof value !== 'object') return false;
 const s = value as ScenarioState;
 if (Object.keys(s).some(k => !['schemaVersion', 'events'].includes(k)) || s.schemaVersion !== 1 || !Array.isArray(s.events) || s.events.length > 500) return false;
 const learners = startingLearners(), ids = new Set<string>();
 let lastTime = 0;
 for (let i = 0; i < s.events.length; i++) {
  const e = s.events[i];
  if (!e || typeof e !== 'object') return false;
  const { at, ...c } = e;
  if (!Number.isSafeInteger(at) || !Number.isFinite(new Date(at).getTime()) || at <= 0 || at < lastTime || c.expectedVersion !== i || ids.has(c.id) || commandIssue(learners, c)) return false;
  ids.add(c.id); lastTime = at; applyEvent(learners, c);
 }
 return true;
}
export function commandScenario(state: ScenarioState, input: ScenarioCommand): { state: ScenarioState; error?: string } {
 if (!validScenario(state)) return { state, error: 'Recover the saved guided demo before making changes.' };
 const issue = commandIssue(scenarioLearners(state), input);
 // Exact retries are allowed even when the action has since changed the record.
 const prior = input && state.events.find(e => e.id === input.id);
 if (prior) {
  const { at: _at, ...command } = prior;
  return keys.every(k => command[k as keyof ScenarioCommand] === input[k as keyof ScenarioCommand]) && Object.keys(input).length === keys.length ? { state } : { state, error: 'This action ID already belongs to another command.' };
 }
 if (issue) return { state, error: issue };
 if (input.expectedVersion !== state.events.length) return { state, error: 'The guided demo changed. Review the latest evidence and try again.' };
 if (state.events.length >= 500) return { state, error: 'This sample journey has reached its history limit. Restart the guided demo to continue.' };
 const event: ScenarioEvent = { ...input, at: Math.max(Date.now(), state.events.at(-1)?.at ?? 0) };
 return { state: { schemaVersion: 1, events: [...state.events, event] } };
}
export function scenarioNextStep(state: ScenarioState): { role: ScenarioRole; learnerId: LearnerId; title: string; detail: string } {
 const [ada, sani] = scenarioLearners(state);
 if (ada.assignmentRevision !== ada.submissionRevision) return { role: 'Administration', learnerId: 'ada', title: 'Assign Ada’s revised submission', detail: 'Administration checks the new submission and assigns it to Amaka. The earlier decision remains in history.' };
 if (ada.review === 'needs-changes') return { role: 'User', learnerId: 'ada', title: 'Revise Ada’s practical work', detail: 'Read Amaka’s feedback, revise the work and resubmit. A resubmission needs a fresh assignment and decision.' };
 if (ada.review !== 'approved') return { role: 'Facilitator', learnerId: 'ada', title: ada.submissionRevision === 1 ? 'Review Ada’s first submission' : 'Review Ada’s revised work', detail: ada.submissionRevision === 1 ? 'Inspect the evidence and request clearer filenames and a low-connectivity backup. Add useful feedback.' : 'Inspect the revised evidence, then explicitly approve it or request further changes.' };
 if (!sani.reply) return { role: 'Facilitator', learnerId: 'sani', title: 'Answer Sani’s learning question', detail: 'Offer short, practical guidance for learning with weak internet. The reply appears in Sani’s User view.' };
 if (!sani.support) return { role: 'Facilitator', learnerId: 'sani', title: 'Refer Sani’s access barrier', detail: 'Describe the learning barrier and support to coordinate. Send it to Administration without promising equipment or funding.' };
 if (!sani.supportResponse) return { role: 'Administration', learnerId: 'sani', title: 'Respond to Sani’s support referral', detail: 'Record a coordination response. Both Sani and Amaka will see it; a plan is not evidence of delivery.' };
 return { role: 'Facilitator', learnerId: 'sani', title: 'Review the completed handoffs', detail: 'Ada has an assessed foundation record. Sani has a reply and support coordination response. Inspect the shared history or explore the normal pages.' };
}

export function loadScenario(): { state: ScenarioState; recovery?: string; warning?: string } {
 try {
  const raw = sessionStorage.getItem(SCENARIO_KEY);
  if (raw === null) return { state: freshScenario() };
  const parsed: unknown = JSON.parse(raw);
  return validScenario(parsed) ? { state: parsed } : { state: freshScenario(), recovery: 'Saved guided-demo data is invalid or from an unsupported version. Its original bytes are preserved.' };
 } catch (error) {
  if (error instanceof SyntaxError) return { state: freshScenario(), recovery: 'Saved guided-demo data could not be read. Its original bytes are preserved.' };
  return { state: freshScenario(), warning: 'Session storage is unavailable. This guided demo runs in memory; reloading may lose its progress.' };
 }
}
export function saveScenario(state: ScenarioState): boolean {
 if (!validScenario(state)) return false;
 try {
  const original = sessionStorage.getItem(SCENARIO_KEY);
  if (original !== null) {
   const previous: unknown = JSON.parse(original);
   if (!validScenario(previous) || previous.events.length > state.events.length || previous.events.some((e, i) => JSON.stringify(e) !== JSON.stringify(state.events[i]))) return false;
  }
  const encoded = JSON.stringify(state);
  sessionStorage.setItem(SCENARIO_KEY, encoded);
  return sessionStorage.getItem(SCENARIO_KEY) === encoded;
 } catch { return false; }
}
export function resetScenario(): boolean {
 try { sessionStorage.removeItem(SCENARIO_KEY); return sessionStorage.getItem(SCENARIO_KEY) === null; } catch { return false; }
}

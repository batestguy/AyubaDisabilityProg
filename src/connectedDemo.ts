import { courses as seedCourses, type Course } from './catalogue';
import { validShared, type SharedDemoSession } from './sharedDemo';
import { validCourseVersion } from './coordinationValidation';

export type PersonRole = 'learner' | 'facilitator' | 'admin';
export type Person = { id: string; username: string; name: string; role: PersonRole; sample: boolean; demoCode: string; status: 'active' | 'pending' | 'changes-requested'; goal: string; access: string; bio: string; teachingCourseIds: string[]; requestedCourseIds: string[]; teachingReviewPending: boolean; reviewNote?: string };
export type ConnectedEnrolment = { id: string; learnerId: string; course: Course; lessons: number[]; scores: number[]; work?: string; workRevision: number; review?: 'approved' | 'needs-changes'; feedback?: string };
export type ConnectedAssignment = { id: string; learnerId: string; facilitatorId: string; courseId: string; workRevision: number; note: string };
export type ChatMessage = { id: string; senderId: string; text: string; at: number };
export type ChatThread = { id: string; participants: [string, string]; kind: 'teaching' | 'administration'; courseId?: string; messages: ChatMessage[]; read: Record<string, number> };
export type ConnectedReferral = { id: string; learnerId: string; facilitatorId?: string; courseId?: string; note: string; response?: string; at: number };
export type TopicRequest = { id: string; facilitatorId: string; title: string; description: string; status: 'pending' | 'approved' | 'changes-requested'; reviewNote?: string };
export type ConnectedAction = 'register' | 'request-teaching' | 'review-facilitator' | 'propose-topic' | 'review-topic' | 'enrol' | 'complete-lesson' | 'submit-quiz' | 'submit-work' | 'assign' | 'review-work' | 'send-message' | 'read-thread' | 'refer-support' | 'respond-support';
export type ConnectedCommand = { id: string; expectedVersion: number; actorId: string | null; type: ConnectedAction; payload: Record<string, unknown> };
export type ConnectedEvent = ConnectedCommand & { at: number };
export type ConnectedState = { schemaVersion: 1; courses: Course[]; legacy?: SharedDemoSession; events: ConnectedEvent[] };
export type ConnectedView = { people: Person[]; courses: Course[]; enrolments: ConnectedEnrolment[]; assignments: ConnectedAssignment[]; threads: ChatThread[]; referrals: ConnectedReferral[]; topics: TopicRequest[]; events: ConnectedEvent[] };

export const CONNECTED_KEY = 'mosaic-connected-v1';
const actions: ConnectedAction[] = ['register', 'request-teaching', 'review-facilitator', 'propose-topic', 'review-topic', 'enrol', 'complete-lesson', 'submit-quiz', 'submit-work', 'assign', 'review-work', 'send-message', 'read-thread', 'refer-support', 'respond-support'];
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const text = (v: unknown, max = 3000): v is string => typeof v === 'string' && !!v.trim() && v.length <= max;
const note = (v: unknown, max = 3000): v is string => typeof v === 'string' && v.length <= max;
const list = (v: unknown): v is string[] => Array.isArray(v) && v.every(x => text(x, 250)) && new Set(v).size === v.length;
const stamp = (v: unknown): v is number => Number.isSafeInteger(v) && (v as number) >= 0 && Number.isFinite(new Date(v as number).getTime());
const sampleAt = Date.UTC(2026, 9, 10, 8);

export function freshConnected(legacy?: SharedDemoSession): ConnectedState {
 const courses = structuredClone(legacy?.user.learning.courses ?? seedCourses);
 courses.push(...structuredClone(seedCourses.filter(c => !courses.some(x => x.id === c.id))));
 for (const course of courses) if (!course.lessons.length || !course.quiz.length) course.status = 'review';
 return { schemaVersion: 1, courses, ...(legacy ? { legacy: structuredClone(legacy) } : {}), events: [] };
}
function seedView(state: ConnectedState): ConnectedView {
 const person = (id: string, name: string, role: PersonRole, teachingCourseIds: string[] = []): Person => ({ id, name, username: id, role, sample: true, demoCode: `DEMO-${id.toUpperCase()}`, status: 'active', goal: role === 'learner' ? 'Build practical skills for learning and work.' : '', access: role === 'learner' ? 'Clear written steps and flexible pacing.' : '', bio: role === 'facilitator' ? 'Sample teaching experience; demonstration only.' : '', teachingCourseIds, requestedCourseIds: [...teachingCourseIds], teachingReviewPending: false });
 const people = [person('ada', 'Ada Okafor', 'learner'), person('sani', 'Sani Musa', 'learner'), person('amaka', 'Amaka Obi', 'facilitator', ['digital-essentials', 'spreadsheet-skills', 'ai-essentials']), person('tunde', 'Tunde Bello', 'facilitator', ['business-foundations', 'retail-customer-service', 'people-workplace']), person('admin', 'Sample administrator', 'admin')];
 // Match curriculum IDs against this retained catalogue rather than inventing a course.
 people[2].teachingCourseIds = state.courses.filter(c => ['digital-essentials', 'spreadsheet-data', 'ai-essentials'].includes(c.id)).map(c => c.id);
 people[2].requestedCourseIds = [...people[2].teachingCourseIds];
 const enrolments: ConnectedEnrolment[] = ['ada', 'sani'].map(id => {
  const courseId = id === 'ada' ? 'digital-essentials' : 'retail-customer-service';
  const candidate = state.courses.find(c => c.id === courseId)!;
  const course = structuredClone(candidate.lessons.length && candidate.quiz.length ? candidate : seedCourses.find(c => c.id === courseId)!);
  return { id: `sample-${id}-enrolment`, learnerId: id, course, lessons: course.lessons.map((_, i) => i).slice(0, id === 'ada' ? course.lessons.length : 3), scores: [id === 'ada' ? 85 : 60], work: id === 'ada' ? 'My initial digital plan includes a Learning folder. I need to explain a clear filename and an offline backup.' : 'My sample customer service plan starts with listening and checking the fictional stock record.', workRevision: 1 };
 });
 const assignments: ConnectedAssignment[] = enrolments.map(e => ({ id: `sample-${e.learnerId}-assignment`, learnerId: e.learnerId, courseId: e.course.id, facilitatorId: e.learnerId === 'ada' ? 'amaka' : 'tunde', workRevision: 1, note: 'Sample initial teaching assignment.' }));
 const threads: ChatThread[] = assignments.map(a => ({ id: teachingThreadId(a.learnerId, a.facilitatorId, a.courseId), participants: [a.learnerId, a.facilitatorId], courseId: a.courseId, kind: 'teaching', messages: [{ id: `welcome-${a.learnerId}`, senderId: a.facilitatorId, text: 'Welcome. Send me a question about your learning or practical work here.', at: sampleAt }, { id: `question-${a.learnerId}`, senderId: a.learnerId, text: a.learnerId === 'ada' ? 'How can I choose a clear filename and keep an offline copy?' : 'How should I explain a stock mismatch to a customer?', at: sampleAt + 1 }], read: { [a.learnerId]: 2, [a.facilitatorId]: 1 } }));
 if (state.legacy?.user.profile.name.trim()) {
  const d = state.legacy.user;
  people.push({ ...person('existing-learner', d.profile.name, 'learner'), username: 'my-profile', sample: false, demoCode: 'DEMO-EXISTING', goal: d.profile.goals.join(' · '), access: d.profile.access.join(' · ') });
  for (const e of d.learning.enrolments.filter(e => e.learnerId === 'user-demo')) {
   const c = e.courseVersion ?? d.learning.courses.find(c => c.id === e.courseId)!;
   enrolments.push({ id: `legacy-${e.id}`, learnerId: 'existing-learner', course: structuredClone(c), lessons: [...e.lessons], scores: [...e.scores], ...(e.submitted ? { work: e.submitted, workRevision: 1 } : { workRevision: 0 }), ...(e.approved ? { review: 'approved' as const } : {}), ...(e.feedback ? { feedback: e.feedback } : {}) });
  }
  if (d.teaching) people.push({ ...person('existing-facilitator', d.profile.name, 'facilitator'), username: 'my-teaching-profile', sample: false, demoCode: 'DEMO-TEACHING', status: 'pending', bio: `${d.teaching.skill}\n${d.teaching.examples}\n${d.teaching.explanation}\n${d.teaching.accessibility}`, teachingCourseIds: [], requestedCourseIds: [], teachingReviewPending: true, reviewNote: 'Earlier teaching application preserved. Select current teaching courses for review.' });
 }
 return { people, courses: structuredClone(state.courses), enrolments, assignments, threads, referrals: [], topics: [], events: [] };
}
const teachingThreadId = (learnerId: string, facilitatorId: string, courseId: string) => `teaching:${learnerId}:${facilitatorId}:${courseId}`;
export function currentConnectedAssignment(view: ConnectedView, learnerId: string, courseId: string) {
 return view.assignments.find(a => a.learnerId === learnerId && a.courseId === courseId);
}
export function connectedComplete(e: ConnectedEnrolment): boolean {
 return e.course.lessons.every((_, i) => e.lessons.includes(i)) && Math.max(0, ...e.scores) >= 70 && !!e.work?.trim() && e.review === 'approved';
}
function teachingPair(view: ConnectedView, a: Person, b: Person, courseId?: string) {
 const l = a.role === 'learner' ? a : b.role === 'learner' ? b : undefined;
 const f = a.role === 'facilitator' ? a : b.role === 'facilitator' ? b : undefined;
 if (!l || !f || l.status !== 'active' || f.status !== 'active') return undefined;
 return view.assignments.find(x => x.learnerId === l.id && x.facilitatorId === f.id && (!courseId || x.courseId === courseId) && f.teachingCourseIds.includes(x.courseId));
}
export function chatRecipients(view: ConnectedView, actorId: string): Person[] {
 const actor = view.people.find(p => p.id === actorId);
 if (!actor) return [];
 return view.people.filter(p => p.id !== actorId && (actor.role === 'admin' || p.role === 'admin' || !!teachingPair(view, actor, p)));
}
export function visibleThreads(view: ConnectedView, actorId: string) { return view.threads.filter(t => t.participants.includes(actorId)); }
export function threadUnread(thread: ChatThread, actorId: string) { return thread.participants.includes(actorId) ? thread.messages.slice(thread.read[actorId] ?? 0).filter(m => m.senderId !== actorId).length : 0; }
export function visiblePeople(view: ConnectedView, actorId: string): Person[] {
 const a = view.people.find(p => p.id === actorId);
 return a ? view.people.filter(p => p.id === actorId || p.role === 'admin' || a.role === 'admin' || !!teachingPair(view, a, p)) : [];
}

function issue(view: ConnectedView, command: ConnectedCommand): string | undefined {
 if (!command || typeof command !== 'object' || !text(command.id, 100) || !Number.isInteger(command.expectedVersion) || command.expectedVersion < 0 || !(command.actorId === null || text(command.actorId, 150)) || !actions.includes(command.type) || !command.payload || typeof command.payload !== 'object' || Array.isArray(command.payload) || Object.keys(command).some(k => !['id', 'expectedVersion', 'actorId', 'type', 'payload'].includes(k))) return 'This action is malformed. Reopen the current record.';
 const p = command.payload;
 if (view.enrolments.some(x => x.id === command.id) || view.assignments.some(x => x.id === command.id) || view.threads.some(x => x.id === command.id)) return 'This action ID conflicts with an existing record.';
 const fields: Record<ConnectedAction, string[]> = { register: ['name','username','role','goal','access','bio','courseIds','demoCode'], 'request-teaching': ['courseIds','bio'], 'review-facilitator': ['personId','outcome','note'], 'propose-topic': ['title','description'], 'review-topic': ['topicId','outcome','note'], enrol: ['courseId'], 'complete-lesson': ['enrolmentId','lesson'], 'submit-quiz': ['enrolmentId','answers'], 'submit-work': ['enrolmentId','text'], assign: ['learnerId','courseId','facilitatorId','note'], 'review-work': ['enrolmentId','revision','outcome','note'], 'send-message': ['recipientId','text','courseId'], 'read-thread': ['threadId','count'], 'refer-support': ['learnerId','courseId','note'], 'respond-support': ['referralId','text'] };
 if (Object.keys(p).some(k => !fields[command.type].includes(k))) return 'This action includes unsupported fields.';
 const validCourses = (ids: unknown) => list(ids) && ids.every(id => view.courses.some(c => c.id === id && c.status === 'published'));
 if (command.type === 'register') {
  if (command.actorId !== null || !text(p.name, 150) || typeof p.username !== 'string' || !/^[a-z][a-z0-9._-]{2,29}$/.test(p.username) || view.people.some(a => a.username === p.username) || !['learner','facilitator'].includes(p.role as string) || !note(p.goal) || !note(p.access) || !note(p.bio) || !validCourses(p.courseIds) || !text(p.demoCode, 80) || (p.role === 'facilitator' && (!text(p.bio) || !(p.courseIds as string[]).length))) return 'Use a unique username (3–30 lowercase letters, numbers, dots, underscores or hyphens), a display name and valid teaching courses. Facilitators need teaching experience and at least one course.';
  return undefined;
 }
 const actor = view.people.find(a => a.id === command.actorId);
 if (!actor) return 'Sign in to your demo profile first.';
 const admin = actor.role === 'admin', fac = actor.role === 'facilitator', learner = actor.role === 'learner';
 const e = view.enrolments.find(e => e.id === p.enrolmentId);
 const assignment = e && currentConnectedAssignment(view, e.learnerId, e.course.id);
 switch (command.type) {
  case 'request-teaching': if (!fac || !validCourses(p.courseIds) || !(p.courseIds as string[]).length || !text(p.bio)) return 'Select at least one available course and explain your teaching experience.'; break;
  case 'review-facilitator': {
   const target = view.people.find(x => x.id === p.personId);
   if (!admin || target?.role !== 'facilitator' || !(target.status !== 'active' || target.teachingReviewPending) || !['approved','needs-changes'].includes(p.outcome as string) || !text(p.note) || (p.outcome === 'approved' && (!target.requestedCourseIds.length || !text(target.bio)))) return 'Review a pending facilitator application or teaching-scope change with a reason.';
   break;
  }
  case 'propose-topic': if (!fac || !text(p.title, 150) || !text(p.description) || view.topics.some(t => t.facilitatorId === actor.id && t.title.toLowerCase() === (p.title as string).trim().toLowerCase() && t.status === 'pending')) return 'Describe a new teaching topic that is not already awaiting review.'; break;
  case 'review-topic': if (!admin || !view.topics.some(t => t.id === p.topicId && t.status === 'pending') || !['approved','needs-changes'].includes(p.outcome as string) || !text(p.note)) return 'Review a pending teaching topic with a reason.'; break;
  case 'enrol': if (!learner || !view.courses.some(c => c.id === p.courseId && c.status === 'published') || view.enrolments.some(e => e.learnerId === actor.id && e.course.id === p.courseId)) return 'Choose an available course you have not already enrolled in.'; break;
  case 'complete-lesson': if (!learner || e?.learnerId !== actor.id || !Number.isInteger(p.lesson) || (p.lesson as number) < 0 || (p.lesson as number) >= e.course.lessons.length) return 'Mark a valid lesson from your own enrolled course.'; break;
  case 'submit-quiz': if (!learner || e?.learnerId !== actor.id || !Array.isArray(p.answers) || p.answers.length !== e.course.quiz.length || !p.answers.every((a, i) => Number.isInteger(a) && a >= 0 && a < e.course.quiz[i].options.length)) return 'Answer every question in your enrolled course quiz.'; break;
  case 'submit-work': if (!learner || e?.learnerId !== actor.id || !text(p.text, 10000)) return 'Submit nonblank practical work for your own enrolled course.'; break;
  case 'assign': {
   const target = view.people.find(a => a.id === p.facilitatorId);
   if (!admin || !view.enrolments.some(e => e.learnerId === p.learnerId && e.course.id === p.courseId) || target?.role !== 'facilitator' || target.status !== 'active' || !target.teachingCourseIds.includes(p.courseId as string) || !text(p.note)) return 'Assign an enrolled learner to an approved facilitator whose reviewed teaching scope includes this course.';
   break;
  }
  case 'review-work': if (!fac || actor.status !== 'active' || !e?.work || assignment?.facilitatorId !== actor.id || assignment.workRevision !== e.workRevision || p.revision !== e.workRevision || !actor.teachingCourseIds.includes(e.course.id) || e.review || !['approved','needs-changes'].includes(p.outcome as string) || !text(p.note)) return 'Review only your current assigned submission. Revised work needs a fresh Administration assignment, and each submission receives one decision.'; break;
  case 'send-message': {
   const recipient = view.people.find(x => x.id === p.recipientId);
   if (!recipient || recipient.id === actor.id || !text(p.text) || (p.courseId !== undefined && !text(p.courseId, 250))) return 'Choose a recipient and write a message of at most 3,000 characters.';
   if (!admin && recipient.role !== 'admin' && !teachingPair(view, actor, recipient, p.courseId as string | undefined)) return 'You can message your current assigned teaching contact or Administration. Earlier conversations stay available to their original participants.';
   if ((admin || recipient.role === 'admin') && p.courseId !== undefined) return 'Administration conversations do not use a teaching-course thread.';
   break;
  }
  case 'read-thread': {
   const thread = view.threads.find(t => t.id === p.threadId);
   if (!thread?.participants.includes(actor.id) || !Number.isInteger(p.count) || (p.count as number) < 0 || (p.count as number) > thread.messages.length) return 'Only participants can read this conversation.';
   break;
  }
  case 'refer-support': {
   const target = view.people.find(x => x.id === p.learnerId && x.role === 'learner');
   if (!target || !text(p.note) || (!admin && !(learner && actor.id === target.id) && !(fac && actor.status === 'active' && view.assignments.some(a => a.learnerId === target.id && a.facilitatorId === actor.id && (!p.courseId || a.courseId === p.courseId))))) return 'Share a support note for yourself or your assigned learner with Administration.';
   if (p.courseId !== undefined && !view.enrolments.some(e => e.learnerId === target.id && e.course.id === p.courseId)) return 'Select a course this learner is enrolled in.';
   break;
  }
  case 'respond-support': if (!admin || !view.referrals.some(r => r.id === p.referralId && !r.response) || !text(p.text)) return 'Respond to a pending support referral.'; break;
 }
 return undefined;
}
function apply(view: ConnectedView, event: ConnectedEvent) {
 const p = event.payload;
 const val = (key: string) => (p[key] as string).trim();
 const actor = view.people.find(a => a.id === event.actorId);
 const e = view.enrolments.find(e => e.id === p.enrolmentId);
 switch (event.type) {
  case 'register': view.people.push({ id: `person-${event.id}`, name: val('name'), username: val('username'), role: p.role as PersonRole, sample: false, demoCode: val('demoCode'), status: p.role === 'facilitator' ? 'pending' : 'active', goal: val('goal'), access: val('access'), bio: val('bio'), teachingCourseIds: [], requestedCourseIds: p.role === 'facilitator' ? [...p.courseIds as string[]] : [], teachingReviewPending: p.role === 'facilitator' }); break;
  case 'request-teaching': actor!.requestedCourseIds = [...p.courseIds as string[]]; actor!.bio = val('bio'); actor!.teachingReviewPending = true; if (actor!.status !== 'active') actor!.status = 'pending'; break;
  case 'review-facilitator': { const target = view.people.find(a => a.id === p.personId)!; target.reviewNote = val('note'); target.teachingReviewPending = false; if (p.outcome === 'approved') { target.status = 'active'; target.teachingCourseIds = [...target.requestedCourseIds]; } else if (target.status !== 'active') target.status = 'changes-requested'; break; }
  case 'propose-topic': view.topics.push({ id: event.id, facilitatorId: actor!.id, title: val('title'), description: val('description'), status: 'pending' }); break;
  case 'review-topic': { const topic = view.topics.find(t => t.id === p.topicId)!; topic.status = p.outcome === 'approved' ? 'approved' : 'changes-requested'; topic.reviewNote = val('note'); break; }
  case 'enrol': view.enrolments.push({ id: event.id, learnerId: actor!.id, course: structuredClone(view.courses.find(c => c.id === p.courseId)!), lessons: [], scores: [], workRevision: 0 }); break;
  case 'complete-lesson': e!.lessons = [...new Set([...e!.lessons, p.lesson as number])]; break;
  case 'submit-quiz': e!.scores.push(Math.round(100 * e!.course.quiz.filter((q, i) => q.answer === (p.answers as number[])[i]).length / e!.course.quiz.length)); break;
  case 'submit-work': e!.work = val('text'); e!.workRevision++; delete e!.review; delete e!.feedback; break;
  case 'assign': {
   const enrolment = view.enrolments.find(e => e.learnerId === p.learnerId && e.course.id === p.courseId)!;
   const next: ConnectedAssignment = { id: event.id, learnerId: val('learnerId'), facilitatorId: val('facilitatorId'), courseId: val('courseId'), workRevision: enrolment.workRevision, note: val('note') };
   view.assignments = view.assignments.filter(a => a.learnerId !== p.learnerId || a.courseId !== p.courseId); view.assignments.push(next); break;
  }
  case 'review-work': e!.review = p.outcome === 'approved' ? 'approved' : 'needs-changes'; e!.feedback = val('note'); break;
  case 'send-message': {
   const recipient = view.people.find(p => p.id === event.payload.recipientId)!;
   const assignment = teachingPair(view, actor!, recipient, p.courseId as string | undefined);
   const isAdmin = actor!.role === 'admin' || recipient.role === 'admin';
   const id = isAdmin ? `admin:${[actor!.id, recipient.id].sort().join(':')}` : teachingThreadId(assignment!.learnerId, assignment!.facilitatorId, assignment!.courseId);
   let thread = view.threads.find(t => t.id === id);
   if (!thread) { thread = { id, participants: [actor!.id, recipient.id], kind: isAdmin ? 'administration' : 'teaching', ...(isAdmin ? {} : { courseId: assignment!.courseId }), messages: [], read: {} }; view.threads.push(thread); }
   thread.messages.push({ id: event.id, senderId: actor!.id, text: val('text'), at: event.at });
   // Reading is explicit: sending must not mark unseen incoming messages as read.
   break;
  }
  case 'read-thread': { const thread = view.threads.find(t => t.id === p.threadId)!; thread.read[actor!.id] = Math.max(thread.read[actor!.id] ?? 0, p.count as number); break; }
  case 'refer-support': view.referrals.push({ id: event.id, learnerId: val('learnerId'), ...(actor!.role === 'facilitator' ? { facilitatorId: actor!.id } : {}), ...(p.courseId ? { courseId: val('courseId') } : {}), note: val('note'), at: event.at }); break;
  case 'respond-support': view.referrals.find(r => r.id === p.referralId)!.response = val('text'); break;
 }
 view.events.push(event);
}
export function connectedView(state: ConnectedState): ConnectedView {
 const view = seedView(state);
 for (const event of state.events) apply(view, event);
 return view;
}
export function validConnected(value: unknown): value is ConnectedState {
 try {
  if (!value || typeof value !== 'object') return false;
  const s = value as ConnectedState;
  if (s.schemaVersion !== 1 || Object.keys(s).some(k => !['schemaVersion','courses','legacy','events'].includes(k)) || !Array.isArray(s.courses) || s.courses.length > 200 || !s.courses.every(c => validCourseVersion(c) && (c.status !== 'published' || (c.lessons.length > 0 && c.quiz.length > 0))) || new Set(s.courses.map(c => c.id)).size !== s.courses.length || !seedCourses.every(c => s.courses.some(x => x.id === c.id)) || (s.legacy !== undefined && !validShared(s.legacy)) || !Array.isArray(s.events) || s.events.length > 2000) return false;
  const view = seedView(s), ids = new Set<string>(); let lastTime = 0;
  for (let i = 0; i < s.events.length; i++) {
   const e = s.events[i]; if (!e || typeof e !== 'object') return false;
   const { at, ...command } = e;
   if (!stamp(at) || at < lastTime || command.expectedVersion !== i || ids.has(command.id) || issue(view, command)) return false;
   ids.add(command.id); lastTime = at; apply(view, e);
  }
  return true;
 } catch { return false; }
}
export function commandConnected(state: ConnectedState, command: ConnectedCommand): { state: ConnectedState; error?: string } {
 if (!validConnected(state)) return { state, error: 'Recover the saved workspace before making changes.' };
 const prior = command && state.events.find(e => e.id === command.id);
 if (prior) { const { at: _at, ...input } = prior; return same(input, command) ? { state } : { state, error: 'This action ID already belongs to another command.' }; }
 const error = issue(connectedView(state), command);
 if (error) return { state, error };
 if (command.expectedVersion !== state.events.length) return { state, error: 'The workspace changed. Reopen the latest record before trying again.' };
 if (state.events.length >= 2000) return { state, error: 'This presentation has reached its history limit. Save your review notes before explicitly resetting the workspace.' };
 return { state: { ...state, events: [...state.events, { ...structuredClone(command), at: Math.max(Date.now(), state.events.at(-1)?.at ?? 0) }] } };
}
export function authenticateConnected(view: ConnectedView, username: string, code: string): Person | undefined {
 return view.people.find(p => p.username === username.trim().toLowerCase() && p.demoCode === code.trim());
}
export function visibleConnectedEvents(view: ConnectedView, actorId: string): { id: string; at: number; actorName: string; summary: string }[] {
 const actor = view.people.find(p => p.id === actorId); if (!actor) return [];
 const people = new Set(visiblePeople(view, actorId).map(p => p.id));
 return view.events.filter(e => {
  if (e.type === 'send-message' || e.type === 'read-thread') return false;
  if (actor.role === 'admin' || e.actorId === actorId) return true;
  const enrolment = view.enrolments.find(x => x.id === e.payload.enrolmentId);
  return !!enrolment && people.has(enrolment.learnerId) && (actor.role !== 'learner' || enrolment.learnerId === actorId);
 }).map(e => ({ id: e.id, at: e.at, actorName: view.people.find(p => p.id === e.actorId)?.name ?? 'New participant', summary: ({ register: 'Participant registered', 'request-teaching': 'Teaching scope submitted for review', 'review-facilitator': 'Facilitator teaching scope reviewed', 'propose-topic': 'Additional topic proposed', 'review-topic': 'Additional topic reviewed', enrol: 'Course enrolment recorded', 'complete-lesson': 'Lesson completed', 'submit-quiz': 'Quiz attempt recorded', 'submit-work': 'Practical work submitted', assign: 'Learning assignment updated', 'review-work': 'Practical decision recorded', 'refer-support': 'Support referral shared with Administration', 'respond-support': 'Support response recorded', 'send-message': '', 'read-thread': '' } as Record<ConnectedAction,string>)[e.type] }));
}
export function loadConnected(legacy?: SharedDemoSession): { state: ConnectedState; warning?: string; recovery?: string; raw?: string } {
 try {
  const raw = localStorage.getItem(CONNECTED_KEY);
  if (raw === null) return { state: freshConnected(legacy) };
  const parsed: unknown = JSON.parse(raw);
  return validConnected(parsed) ? { state: parsed, raw } : { state: freshConnected(legacy), recovery: 'Saved connected workspace data is invalid or from an unsupported version. Its original records have been preserved.', raw };
 } catch (e) { return e instanceof SyntaxError ? { state: freshConnected(legacy), recovery: 'Saved connected workspace data could not be read. Its original records have been preserved.' } : { state: freshConnected(legacy), warning: 'Saving is unavailable. This workspace runs in memory; leaving or reloading may lose new progress.' }; }
}
export function saveConnected(state: ConnectedState): boolean {
 if (!validConnected(state)) return false;
 try {
  const previousRaw = localStorage.getItem(CONNECTED_KEY);
  if (previousRaw !== null) {
   const previous: unknown = JSON.parse(previousRaw);
   if (!validConnected(previous) || !same(previous.courses, state.courses) || !same(previous.legacy, state.legacy) || previous.events.length > state.events.length || previous.events.some((e,i) => !same(e,state.events[i]))) return false;
  }
  const raw = JSON.stringify(state); localStorage.setItem(CONNECTED_KEY, raw);
  return localStorage.getItem(CONNECTED_KEY) === raw;
 } catch { return false; }
}
export function resetConnected(): boolean { try { localStorage.removeItem(CONNECTED_KEY); return localStorage.getItem(CONNECTED_KEY) === null; } catch { return false; } }

import { courses } from './catalogue';
import { USER_LEARNER_ID, type Demo } from './userDemo';

export function administratorCounts(demo: Demo) {
 const enrolments = demo.learning.enrolments.filter(e => e.learnerId === USER_LEARNER_ID);
 return {
  learners: demo.profile.name.trim() ? 1 : 0,
  enrolments: enrolments.length,
  completed: enrolments.filter(e => !!e.completedAt).length,
  practical: enrolments.filter(e => !!e.submitted && !e.approved).length,
  questions: demo.learning.requests.filter(r => r.learnerId === USER_LEARNER_ID && r.kind === 'question' && !r.reply).length,
  support: demo.supportRequest ? 1 : 0,
  teaching: demo.teaching ? 1 : 0,
  availableCourses: demo.learning.courses.filter(c => c.status === 'published' && courses.some(seed => seed.id === c.id)).length,
 };
}

export function matchesLearner(demo: Demo, search: string, filter: 'all' | 'incomplete' | 'ready') {
 if (!demo.profile.name.trim()) return false;
 const text = [demo.profile.name, demo.profile.state, demo.profile.lga].join(' ').toLocaleLowerCase();
 return text.includes(search.trim().toLocaleLowerCase()) && (filter === 'all' || (filter === 'ready' ? demo.onboarded : !demo.onboarded));
}

export function demoDate(timestamp: number | null | undefined) {
 if (timestamp == null) return 'Original submission time not recorded';
 return new Intl.DateTimeFormat('en-NG', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Lagos' }).format(timestamp) + ' (Africa/Lagos, UTC+01:00)';
}

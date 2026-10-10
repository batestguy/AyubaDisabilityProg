import { fresh, updateEnrolment, uid, enrolmentCourse, type State } from "./store";
import type { Course } from "./catalogue";
import { courseCategory, skillCategories } from './skillCategories';

export const USER_DEMO_KEY = "mosaic-user-demo-v1";
export const USER_LEARNER_ID = "user-demo";
export type Profile = {
  name: string; adult: boolean; contact: string; state: string; lga: string;
  gender: string; genderDescription: string; disabilityDescription: string;
  experience: string; certificates: string; portfolioDescription: string;
  device: string; internet: string; language: string; availability: string;
  otherSupport: string; disabilities: string[]; access: string[]; skills: string[];
  goals: string[]; interests: string[]; startingFresh: boolean;
  categories: string[];
};
export type Attachment = { id: string; name: string; type: string; size: number; description: string };
export type SupportItem = { id: string; need: string; available: string; priority: string };
export type TeachingInput = {
  route: "experience" | "progression"; skill: string; examples: string;
  explanation: string; accessibility: string;
};
export type Demo = {
  editingProfile?: boolean;
  schemaVersion: 1; signedIn: boolean; step: number; onboarded: boolean; profile: Profile;
  learning: State; attachments: Attachment[];
  portfolio: { id: string; courseId: string; title: string; text: string; createdAt: number }[];
  support: SupportItem[];
  supportRequest?: { status: "pending"; submittedAt: number; response?: string; items: SupportItem[] };
  teaching?: TeachingInput & { status: "pending"; submittedAt: number; response?: string };
  checklist: string[];
};
export function freshDemo(): Demo {
  return {
    schemaVersion: 1, signedIn: false, step: 0, onboarded: false,
    profile: {
      name: "", adult: false, contact: "", state: "", lga: "", gender: "",
      genderDescription: "", disabilityDescription: "", experience: "", certificates: "",
      portfolioDescription: "", device: "", internet: "", language: "", availability: "",
      otherSupport: "", disabilities: [], access: [], skills: [], goals: [], interests: [], categories: [], startingFresh: false,
    },
    learning: { ...fresh(), learners: [], enrolments: [], requests: [] },
    attachments: [], portfolio: [], support: [], checklist: [],
  };
}
export function validDemo(value: unknown): value is Demo {
  if (!value || typeof value !== "object") return false;
  const d = value as Demo;
  const p = freshDemo().profile;
  return [d.supportRequest?.response, d.teaching?.response].every(v => v === undefined || (typeof v === 'string' && v.length <= 5000)) && d.schemaVersion === 1 && typeof d.signedIn === "boolean" &&
    typeof d.onboarded === "boolean" && Number.isInteger(d.step) && d.step >= 0 && d.step <= 5 &&
    !!d.profile && Object.entries(p).every(([key, defaultValue]) => {
      const v = d.profile[key as keyof Profile];
      return Array.isArray(defaultValue) ? Array.isArray(v) && v.every(x => typeof x === "string") : typeof v === typeof defaultValue;
    }) && !!d.learning && Array.isArray(d.learning.courses) && d.learning.courses.every(c => !!c && typeof c.id === "string" && typeof c.title === "string" && typeof c.description === "string" && Array.isArray(c.skills) && Array.isArray(c.lessons) && Array.isArray(c.quiz)) && Array.isArray(d.learning.learners) && d.learning.learners.every(l => !!l && typeof l.id === "string" && typeof l.name === "string" && Array.isArray(l.skills)) &&
    Array.isArray(d.learning.enrolments) && d.learning.enrolments.every(e => !!e && typeof e.id === "string" && typeof e.learnerId === "string" && d.learning.courses.some(c => c.id === e.courseId) && Array.isArray(e.lessons) && Array.isArray(e.scores) && typeof e.approved === "boolean") && Array.isArray(d.learning.requests) && !!d.learning.consultant &&
    Array.isArray(d.attachments) && d.attachments.every(a => !!a && typeof a.id === "string" && typeof a.name === "string" && typeof a.type === "string" && typeof a.size === "number" && typeof a.description === "string") && Array.isArray(d.portfolio) && d.portfolio.every(p => !!p && typeof p.id === "string" && typeof p.courseId === "string" && typeof p.title === "string" && typeof p.text === "string" && typeof p.createdAt === "number") && Array.isArray(d.support) && d.support.every(s => !!s && typeof s.id === "string" && typeof s.need === "string" && typeof s.available === "string" && typeof s.priority === "string") &&
    Array.isArray(d.checklist) && d.checklist.every(item => typeof item === "string") && (!d.supportRequest || (d.supportRequest.status === "pending" && typeof d.supportRequest.submittedAt === "number" && Array.isArray(d.supportRequest.items))) && (!d.teaching || (d.teaching.status === "pending" && ["experience", "progression"].includes(d.teaching.route) && typeof d.teaching.submittedAt === "number" && [d.teaching.skill, d.teaching.examples, d.teaching.explanation, d.teaching.accessibility].every(v => typeof v === "string")));
}
export function loadDemo(): Demo {
  try {
    const raw = sessionStorage.getItem(USER_DEMO_KEY);
    const value: unknown = raw ? JSON.parse(raw) : null;
    // Existing profiles predate category preferences; keep their recorded answers.
    if (value && typeof value === 'object' && 'profile' in value && value.profile && typeof value.profile === 'object' && !('categories' in value.profile)) {
      Object.assign(value.profile, { categories: [] });
    }
    if (!validDemo(value)) return freshDemo();
    // Add newly published seed courses without discarding saved activity.
    const missing = fresh().courses.filter(c => !value.learning.courses.some(saved => saved.id === c.id));
    return { ...value, learning: { ...value.learning, courses: [...value.learning.courses, ...missing] } };
  } catch { return freshDemo(); }
}
export function saveDemo(demo: Demo): boolean {
  try { sessionStorage.setItem(USER_DEMO_KEY, JSON.stringify(demo)); return true; }
  catch { return false; }
}
export function syncLearner(demo: Demo): Demo {
  const p = demo.profile;
  const demonstrated = demo.learning.enrolments.filter(e => e.learnerId === USER_LEARNER_ID && e.completedAt)
    .flatMap(e => enrolmentCourse(demo.learning, e)?.skills ?? []);
  const learner = {
    id: USER_LEARNER_ID, name: p.name.trim(), skills: [...new Set([...p.skills, ...demonstrated])],
    interests: [...p.interests, ...p.goals].join(", "), needs: p.access.join(", "),
    location: [p.lga, p.state].filter(Boolean).join(", "), qualifications: p.certificates,
    language: p.language, contact: p.contact,
  };
  return { ...demo, learning: { ...demo.learning, learners: demo.learning.learners.some(l => l.id === USER_LEARNER_ID) ? demo.learning.learners.map(l => l.id === USER_LEARNER_ID ? { ...l, ...learner } : l) : [...demo.learning.learners, learner] } };
}
export function recommendationReasons(profile: Profile, course: Course): string[] {
  const haystack = [course.title, course.description, ...course.skills].join(" ").toLowerCase();
  const goalCourses: Record<string, string[]> = {
    Employment: ['digital-essentials', 'spreadsheet-data', 'ai-essentials', 'people-workplace', 'retail-customer-service'],
    Freelancing: ['digital-essentials', 'spreadsheet-data', 'business-foundations', 'ai-essentials', 'people-workplace', 'sewing-textiles'],
    'Starting or improving a business': ['business-foundations', 'spreadsheet-data', 'ai-essentials', 'sewing-textiles', 'small-space-growing', 'retail-customer-service'],
    'Personal development': ['digital-essentials', 'ai-essentials', 'people-workplace', 'sewing-textiles', 'small-space-growing'],
    'Teaching others': ['digital-essentials', 'spreadsheet-data', 'business-foundations', 'ai-essentials', 'people-workplace', 'sewing-textiles', 'small-space-growing', 'retail-customer-service'],
  };
  const categoryReason = (profile.categories || []).includes(courseCategory(course))
    ? [`Chosen skill area: ${skillCategories.find(c => c.id === courseCategory(course))!.title}`] : [];
  return [...categoryReason, ...([['Interest', profile.interests], ['Goal', profile.goals], ['Skill', profile.skills]] as const)
    .flatMap(([label, values]) => values.filter(value => label === 'Goal' && goalCourses[value] ? goalCourses[value].includes(course.id) : value.toLowerCase().split(/\W+/)
      .some(word => word.length > 2 && haystack.includes(word))).map(value => `${label}: ${value}`))];
}
export function addAttachment(demo: Demo, file: Pick<File, "name" | "type" | "size">, description = ""): { demo: Demo; error?: string } {
  if (demo.attachments.length >= 5) return { demo, error: "You can add up to five files." };
  if (!["application/pdf", "image/jpeg", "image/png"].includes(file.type)) return { demo, error: "Choose a PDF, JPEG or PNG file." };
  if (!Number.isFinite(file.size) || file.size <= 0 || file.size > 5 * 1024 * 1024) return { demo, error: "Each file must be nonempty and no larger than 5 MB." };
  return { demo: { ...demo, attachments: [...demo.attachments, { id: uid(), name: file.name, type: file.type, size: file.size, description }] } };
}
export function submitSupport(demo: Demo): Demo {
  const items = demo.support.filter(item => item.need.trim());
  if (!items.length || JSON.stringify(demo.supportRequest?.items) === JSON.stringify(items)) return demo;
  return { ...demo, supportRequest: { status: "pending", submittedAt: Date.now(), items: structuredClone(items) } };
}
export function teachingEligibility(demo: Demo): { experience: boolean; progression: boolean } {
  return {
    experience: true,
    progression: new Set(demo.learning.enrolments.filter(e => e.learnerId === USER_LEARNER_ID && e.completedAt).map(e => e.courseId)).size >= 1,
  };
}
export function submitTeaching(demo: Demo, input: TeachingInput): { demo: Demo; error?: string } {
  if (demo.teaching) return { demo, error: 'Your trainer/mentor application is already pending review.' };
  if (!teachingEligibility(demo)[input.route]) return { demo, error: "Build experience or complete a course before applying through this route." };
  if (![input.skill, input.examples, input.explanation, input.accessibility].every(value => value.trim())) return { demo, error: "Complete your skill, examples, explanation and accessibility plan." };
  if (input.route === 'progression' && !demo.learning.enrolments.filter(e => e.learnerId === USER_LEARNER_ID && e.completedAt).some(e => enrolmentCourse(demo.learning, e)?.skills.includes(input.skill))) return { demo, error: 'Choose a demonstrated skill from a completed course.' };
  return { demo: { ...demo, teaching: { ...input, status: "pending", submittedAt: Date.now() } } };
}
export function submitWork(demo: Demo, enrolId: string, text: string): Demo {
  const e = demo.learning.enrolments.find(e => e.id === enrolId && e.learnerId === USER_LEARNER_ID);
  if (!e || !text.trim()) return demo;
  return syncLearner({
    ...demo,
    learning: updateEnrolment(demo.learning, enrolId, { submitted: text.trim(), approved: false, feedback: undefined, completedAt: undefined }),
    portfolio: demo.portfolio.filter(item => item.courseId !== e.courseId),
  });
}
export function addToPortfolio(demo: Demo, enrolId: string): Demo {
  const e = demo.learning.enrolments.find(e => e.id === enrolId && e.learnerId === USER_LEARNER_ID);
  const c = e && enrolmentCourse(demo.learning, e);
  if (!e?.completedAt || !e.approved || !e.submitted || !c || demo.portfolio.some(item => item.courseId === c.id)) return demo;
  return { ...demo, portfolio: [...demo.portfolio, { id: uid(), courseId: c.id, title: c.title, text: e.submitted, createdAt: Date.now() }] };
}

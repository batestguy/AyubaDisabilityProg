import { courses, type Course } from "./catalogue";
export type Learner = {
  id: string;
  name: string;
  skills: string[];
  interests: string;
  needs: string;
  location: string;
  qualifications: string;
  language: string;
  contact: string;
};
export type Enrolment = {
  id: string;
  learnerId: string;
  courseId: string;
  courseVersion?: Course;
  assisted: boolean;
  lessons: number[];
  scores: number[];
  submitted?: string;
  feedback?: string;
  approved: boolean;
  completedAt?: number;
};
export type RequestRecord = {
  id: string;
  learnerId: string;
  courseId: string;
  kind: "question" | "mentoring" | "message";
  text: string;
  createdAt: number;
  reply?: string;
  repliedAt?: number;
  followup?: string;
};
export type State = {
  learners: Learner[];
  courses: Course[];
  enrolments: Enrolment[];
  requests: RequestRecord[];
  consultant: {
    id: string;
    name: string;
    bio: string;
    approved: boolean;
    liveLink: string;
  };
};
export const fresh = (): State => ({
  learners: [
    {
      id: "learner-demo",
      name: "Amina (fictional)",
      skills: [],
      interests: "digital skills and business",
      needs: "Plain language, text transcripts",
      location: "Bauchi",
      qualifications: "Secondary school",
      language: "en",
      contact: "Sandbox inbox only",
    },
  ],
  courses: structuredClone(courses),
  enrolments: [],
  requests: [],
  consultant: {
    id: "expert-demo",
    name: "Alex (fictional)",
    bio: "Digital skills educator. Text-first lessons and practical feedback.",
    approved: true,
    liveLink: "",
  },
});
export const uid = () => crypto.randomUUID();
export function enrol(
  s: State,
  learnerId: string,
  courseId: string,
  assisted = false,
): State {
  if (
    !s.learners.some((l) => l.id === learnerId) ||
    !s.courses.some((c) => c.id === courseId && c.status === "published") ||
    s.enrolments.some(
      (e) => e.learnerId === learnerId && e.courseId === courseId,
    )
  )
    return s;
  return {
    ...s,
    enrolments: [
      ...s.enrolments,
      {
        id: uid(),
        learnerId,
        courseId,
        courseVersion: structuredClone(s.courses.find(c => c.id === courseId)!),
        assisted,
        lessons: [],
        scores: [],
        approved: false,
      },
    ],
  };
}
export function updateEnrolment(
  s: State,
  id: string,
  patch: Partial<Enrolment>,
): State {
  const target = s.enrolments.find((e) => e.id === id);
  if (!target) return s;
  const e = { ...target, ...patch };
  const c = enrolmentCourse(s, e)!;
  const done =
    c.lessons.every((_, i) => e.lessons.includes(i)) &&
    Math.max(0, ...e.scores) >= 70 &&
    e.approved &&
    !!e.submitted;
  e.completedAt = done ? e.completedAt || Date.now() : undefined;
  return {
    ...s,
    enrolments: s.enrolments.map((x) => (x.id === id ? e : x)),
    learners: s.learners.map((l) =>
      l.id === e.learnerId && done
        ? { ...l, skills: [...new Set([...l.skills, ...c.skills])] }
        : l,
    ),
  };
}
export function enrolmentCourse(s: State, e: Enrolment): Course | undefined {
  return e.courseVersion ?? s.courses.find(c => c.id === e.courseId);
}
export function recommend(s: State, l: Learner) {
  const words = (l.interests + " " + l.skills.join(" "))
    .toLowerCase()
    .split(/\W+/)
    .filter((w) => w.length > 2);
  return s.courses
    .filter((c) => c.status === "published")
    .map((c) => ({
      course: c,
      score: words.filter((w) =>
        (c.title + " " + c.description + " " + c.tag).toLowerCase().includes(w),
      ).length,
    }))
    .sort((a, b) => b.score - a.score);
}
export function grade(c: Course, answers: number[]) {
  return Math.round(
    (c.quiz.filter((q, i) => q.answer === answers[i]).length / c.quiz.length) *
      100,
  );
}
export function loadState(): State {
  try {
    const raw = sessionStorage.getItem("mosaic-v1");
    if (!raw) return fresh();
    const saved: State = JSON.parse(raw);
    const missing = courses.filter(c => !saved.courses.some(existing => existing.id === c.id));
    return { ...saved, courses: [...saved.courses, ...structuredClone(missing)] };
  } catch {
    return fresh();
  }
}

import type { Course } from './catalogue';

export type SkillCategory = 'digital' | 'people' | 'livelihoods' | 'business';
export const skillCategories: { id: SkillCategory; title: string; description: string }[] = [
  { id: 'digital', title: 'Digital & AI Skills', description: 'Use devices, work with data and use AI thoughtfully.' },
  { id: 'people', title: 'People & Workplace Skills', description: 'Build communication, teamwork, confidence and problem-solving skills.' },
  { id: 'livelihoods', title: 'Hands-On & Livelihood Skills', description: 'Explore sewing, small-space growing and practical retail service.' },
  { id: 'business', title: 'Business & Enterprise Skills', description: 'Plan an offer, understand customers and manage simple costs.' },
];
const seedCategories: Record<string, SkillCategory> = {
  'digital-essentials': 'digital', 'spreadsheet-data': 'digital', 'ai-essentials': 'digital',
  'business-foundations': 'business', 'people-workplace': 'people',
  'sewing-textiles': 'livelihoods', 'small-space-growing': 'livelihoods', 'retail-customer-service': 'livelihoods',
};
export const courseCategory = (course: Course): SkillCategory => course.category || seedCategories[course.id] || 'business';
export const categoryTitle = (course: Course) => skillCategories.find(c => c.id === courseCategory(course))!.title;

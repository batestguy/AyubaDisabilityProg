import type { SharedDemoSession } from './sharedDemo';
import type { Profile, SupportItem } from './userDemo';
import { freshDemo, USER_LEARNER_ID } from './userDemo';
import { learnerRows, type LearnerRow, type ReportScope } from './reportingDemo';
import { enrolmentCourse } from './store';
import { learnerScorecard } from './scorecardDemo';
import { canonicalGrantLocation } from './nigeriaLocationIndex';
import { skillCategories } from './skillCategories';

export const NOT_RECORDED = 'Not recorded';
export const SAMPLE_NOT_COLLECTED = 'Not collected for geographic sample';
export type GrantFilters = { scope: ReportScope; state: string };
export type GrantBreakdown = { dimension: string; category: string; count: number; denominator: number };
export type GrantPlanning = { filters: GrantFilters; rows: LearnerRow[]; userCount: number; sampleCount: number; breakdowns: GrantBreakdown[]; enrolled: number; completed: number; supportItems: SupportItem[]; completedSkills: string[]; enrolledCourses: string[] };
const unique = (values: string[]) => [...new Set(values.map(v => v.trim()).filter(Boolean))];
const outcomeKeys = ['supportRecorded','supportProvided','supportReceiptConfirmed','grantsRecorded','grantAppliedNGN','grantAwardedNGN','grantPaidNGN','grantReceiptConfirmed','followUpsRecorded','followUpsOpen'] as const;
export function grantPlanning(session: SharedDemoSession, filters: GrantFilters = { scope: 'all', state: '' }): GrantPlanning {
 const rows = learnerRows(session).filter(r => (filters.scope === 'all' || r.source === (filters.scope === 'user' ? 'user' : 'sample')) && (!filters.state || r.state === filters.state));
 const userCount = rows.filter(r => r.source === 'user').length, sampleCount = rows.length - userCount;
 const enrolments = userCount ? session.user.learning.enrolments.filter(e => e.learnerId === USER_LEARNER_ID) : [];
 const completedSkills = unique(enrolments.filter(e => !!e.completedAt).flatMap(e => enrolmentCourse(session.user.learning,e)?.skills ?? []));
 const enrolledCourses = unique(enrolments.map(e => enrolmentCourse(session.user.learning,e)?.title ?? NOT_RECORDED));
 const latestSupport = userCount ? session.submissions.filter(s => s.kind === 'support').at(-1) : undefined;
 const supportItems = latestSupport ? (latestSupport.payload as { items: SupportItem[] }).items : [];
 const breakdowns: GrantBreakdown[] = [];
 function add(dimension: string, get: (row: LearnerRow) => string[]) {
  const counts = new Map<string, number>();
  rows.forEach(row => unique(get(row)).forEach(value => counts.set(value,(counts.get(value) ?? 0)+1)));
  for (const [category,count] of [...counts].sort(([a],[b])=>a.localeCompare(b))) breakdowns.push({dimension,category,count,denominator:rows.length});
 }
 const p = session.user.profile;
 const safe = (values: string[], allowed: string[], other='Other recorded response') => unique(values).map(v=>allowed.find(a=>a.toLowerCase()===v.toLowerCase()) ?? other);
 const disability = safe(p.disabilities,['Physical or mobility','Visual','Hearing','Intellectual','Psychosocial','Multiple disabilities','Other'],'Other recorded disclosure');
 if(p.disabilityDescription.trim()) disability.push('Self-description recorded');
 const disclosure = (dimension: string, values: string[]) => profile(dimension,values.length?values:['Not disclosed']);
 const profile = (dimension: string, values: string[]) => add(dimension,r=>r.source==='sample'?[SAMPLE_NOT_COLLECTED]:unique(values).length?unique(values):[NOT_RECORDED]);
 add('State',r=>[canonicalGrantLocation(r.state,r.lga).state]); add('LGA',r=>[canonicalGrantLocation(r.state,r.lga).lga]);
 disclosure('Gender disclosure',p.gender.trim()?safe([p.gender],['Woman','Man','Self-description','Prefer not to say'],'Other recorded disclosure'):p.genderDescription.trim()?['Self-description recorded']:[]); disclosure('Disability disclosure',disability);
 profile('Adult eligibility confirmation',[p.adult?'Confirmed adult':'Not confirmed']);
 profile('Self-reported skills (unverified)',p.skills.length?safe(p.skills,['Digital confidence','Communication','Spreadsheets','Budgeting','Customer service','Craft or trade','Teaching']):p.startingFresh?['Starting fresh']:[]);
 profile('Completed course skills (retained evidence)',safe(completedSkills,freshDemo().learning.courses.flatMap(c=>c.skills),'Other demonstrated course skill'));
 profile('Course interests',safe(p.interests,freshDemo().learning.courses.map(c=>c.title),'Other recorded course interest')); profile('Recorded course enrolments',safe(enrolledCourses,freshDemo().learning.courses.map(c=>c.title),'Other authored course'));
 profile('Skill areas',p.categories.map(id=>skillCategories.find(c=>c.id===id)?.title ?? 'Other recorded response'));
 profile('Goals',safe(p.goals,['Employment','Freelancing','Starting or improving a business','Personal development','Teaching others'])); profile('Access preferences',safe(p.access,['Captions and transcripts','Larger text','Keyboard use','Plain language','Flexible pace']));
 profile('Device',safe([p.device],['Smartphone','Phone','Laptop','Desktop','Tablet','Shared device','No device'])); profile('Internet',safe([p.internet],['Mobile data','Wi-Fi','Reliable','Limited','None','No internet'])); profile('Language',safe([p.language],['English','Hausa','Yoruba','Igbo','Nigerian Sign Language'])); profile('Availability',safe([p.availability],['Weekdays','Weekends','Evenings','Flexible']));
 // Submitted checklist text is included only in the consented detailed export. Aggregate counts use priority, not authored need text.
 profile('Submitted support priorities',safe(supportItems.map(item=>item.priority),['High','Medium','Low']));
 return { filters: {...filters,state:filters.state?canonicalGrantLocation(filters.state,'').state:''},rows,userCount,sampleCount,breakdowns,enrolled:enrolments.length,completed:enrolments.filter(e=>!!e.completedAt).length,supportItems,completedSkills,enrolledCourses };
}
export function csvCell(value: unknown): string {
 let text = String(value ?? '');
 if (/^[\s\u0000-\u001f]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
 return '"' + text.replaceAll('"','""') + '"';
}
const csv = (rows: unknown[][]) => rows.map(row=>row.map(csvCell).join(',')).join('\r\n')+'\r\n';
export function aggregateGrantCsv(session: SharedDemoSession, filters: GrantFilters = {scope:'all',state:''}): string {
 const report=grantPlanning(session,filters);
 const rows: unknown[][] = [['Report','Scope','State filter','Dimension','Category','Count','Denominator','Generated at UTC']];
 const add=(dimension:string,category:string,count:number,denominator:number)=>rows.push(['Local demo grant planning',filters.scope,report.filters.state || 'All states',dimension,category,count,denominator,new Date().toISOString()]);
 add('Cohort','Selected profiles',report.rows.length,report.rows.length); add('Cohort','User-created profiles',report.userCount,report.rows.length); add('Cohort','Fictional geographic samples',report.sampleCount,report.rows.length);
 report.breakdowns.forEach(b=>add(b.dimension,b.category,b.count,b.denominator));
 add('Learning','Enrolments',report.enrolled,report.userCount); add('Learning','Completed enrolments',report.completed,report.enrolled); add('Support','Submitted checklist items',report.supportItems.length,report.userCount);
 if(report.userCount){const card=learnerScorecard(session);outcomeKeys.forEach(key=>add('Recorded outcomes',key,card[key],report.userCount));}
 return csv(rows);
}
const profileKeys: (keyof Profile)[] = ['name','adult','contact','state','lga','gender','genderDescription','disabilities','disabilityDescription','experience','certificates','portfolioDescription','device','internet','language','availability','otherSupport','access','skills','goals','interests','startingFresh','categories'];
export function detailedGrantCsv(session: SharedDemoSession, filters: GrantFilters, consent: boolean): string {
 if(!consent) throw new Error('Explicit detailed export consent is required.');
 const report=grantPlanning(session,filters), headers=['Scope','State filter','Source',...profileKeys,'enrolled','completed','completedSkills','enrolledCourses','submittedSupportNeeds',...outcomeKeys];
 const rows: unknown[][]=[headers];
 report.rows.forEach(row=>{
  if(row.source==='sample'){rows.push([filters.scope,filters.state||'All states','Fictional geographic sample',...profileKeys.map(key=>key==='name'?row.name:key==='state'?row.state:key==='lga'?row.lga:SAMPLE_NOT_COLLECTED),0,0,SAMPLE_NOT_COLLECTED,SAMPLE_NOT_COLLECTED,SAMPLE_NOT_COLLECTED,...outcomeKeys.map(()=>SAMPLE_NOT_COLLECTED)]);return;}
  const card=learnerScorecard(session);
  rows.push([filters.scope,filters.state||'All states','User-created profile',...profileKeys.map(key=>Array.isArray(session.user.profile[key])?JSON.stringify(session.user.profile[key]):session.user.profile[key]),report.enrolled,report.completed,JSON.stringify(report.completedSkills),JSON.stringify(report.enrolledCourses),JSON.stringify(report.supportItems.map(({need,available,priority})=>({need,available,priority}))),...outcomeKeys.map(key=>card[key])]);
 });
 return csv(rows);
}

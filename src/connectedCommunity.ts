import { nigeriaLocationNames } from './nigeriaLocationIndex';
import type { ConnectedView, ConnectedCommand, ConnectedEvent, Person } from './connectedDemo';

export const boardStates = Object.keys(nigeriaLocationNames).sort();
export type CommunityAction = 'set-home-state' | 'submit-public-profile' | 'withdraw-public-profile' | 'review-public-profile' | 'request-facilitator' | 'withdraw-request' | 'resolve-request' | 'publish-notice' | 'reply-notice' | 'moderate-board' | 'read-notice' | 'read-board';
export type PublicProfile = { consent: boolean; draft: string; pending: boolean; approved?: string; note?: string };
export type FacilitatorListing = { id: string; name: string; sample: boolean; introduction: string; subjects: { id: string; title: string }[]; homeState?: string };
export type FacilitatorRequest = { id: string; learnerId: string; courseId: string; facilitatorId: string; at: number; status: 'pending' | 'assigned' | 'declined' | 'withdrawn' | 'superseded'; note?: string; assignedFacilitatorId?: string };
export type BoardReply = { id: string; authorId: string; authorName: string; role: Person['role']; text: string; at: number; order: number; hidden: boolean };
export type BoardNotice = { id: string; state: string; title: string; text: string; authorId: string; authorName: string; role: Person['role']; at: number; order: number; hidden: boolean; closed: boolean; pinned: boolean; replies: BoardReply[] };
export type CommunityView = { requests: FacilitatorRequest[]; notices: BoardNotice[]; boardReads: Record<string, Record<string, number>>; moderation: { id: string; targetId: string; action: string; reason: string; actorId: string; at: number }[] };
export const communityFields: Record<CommunityAction, string[]> = {
 'set-home-state': ['state'], 'submit-public-profile': ['introduction','consent'], 'withdraw-public-profile': [], 'review-public-profile': ['personId','outcome','note'],
 'request-facilitator': ['courseId','facilitatorId'], 'withdraw-request': ['requestId'], 'resolve-request': ['requestId','facilitatorId','outcome','note'],
 'publish-notice': ['state','title','text'], 'reply-notice': ['noticeId','text'], 'moderate-board': ['noticeId','replyId','action','reason'], 'read-notice': ['noticeId','through'], 'read-board': ['state','through'],
};
export function initCommunity(view: ConnectedView) {
 view.requests = []; view.notices = []; view.boardReads = {}; view.moderation = [];
 for (const p of view.people) if (p.sample && p.role === 'facilitator') p.publicProfile = { consent: true, draft: 'Fictional facilitator demonstrating course guidance, practical feedback and learner communication.', pending: false, approved: 'Fictional facilitator demonstrating course guidance, practical feedback and learner communication.' };
}
export function publicFacilitators(view: ConnectedView): FacilitatorListing[] {
 return view.people.filter(p => p.role === 'facilitator' && p.status === 'active' && p.teachingCourseIds.length && p.publicProfile?.consent && p.publicProfile.approved).map(p => ({ id: p.id, name: p.name, sample: p.sample, introduction: p.publicProfile!.approved!, subjects: p.teachingCourseIds.flatMap(id => { const c = view.courses.find(c => c.id === id); return c ? [{ id, title: c.title }] : []; }), ...(p.homeState ? { homeState: p.homeState } : {}) }));
}
const nonblank = (x: unknown, max = 3000): x is string => typeof x === 'string' && !!x.trim() && x.length <= max;
const eligible = (v: ConnectedView, id: unknown, course: unknown) => v.people.some(p => p.id === id && p.role === 'facilitator' && p.status === 'active' && p.teachingCourseIds.includes(course as string));
export function communityIssue(v: ConnectedView, c: ConnectedCommand): string | undefined {
 const p = c.payload, actor = v.people.find(x => x.id === c.actorId);
 if (!actor) return 'Sign in to your demo profile first.';
 const admin = actor.role === 'admin';
 const request = v.requests.find(r => r.id === p.requestId);
 const notice = v.notices.find(n => n.id === p.noticeId);
 switch (c.type) {
  case 'set-home-state': if (!boardStates.includes(p.state as string)) return 'Choose a valid home state or FCT.'; break;
  case 'submit-public-profile': if (actor.role !== 'facilitator' || !nonblank(p.introduction) || p.consent !== true) return 'Provide a public introduction and agree to publication.'; break;
  case 'withdraw-public-profile': if (actor.role !== 'facilitator' || !actor.publicProfile?.consent) return 'Only your own published-profile consent can be withdrawn.'; break;
  case 'review-public-profile': if (!admin || !v.people.some(x => x.id === p.personId && x.role === 'facilitator' && x.publicProfile?.pending && x.publicProfile.consent) || !['approved','needs-changes'].includes(p.outcome as string) || !nonblank(p.note)) return 'Review a pending public introduction with a reason.'; break;
  case 'request-facilitator': if (actor.role !== 'learner' || !v.courses.some(x => x.id === p.courseId && x.status === 'published') || !publicFacilitators(v).some(x => x.id === p.facilitatorId && x.subjects.some(s => s.id === p.courseId)) || v.requests.some(r => r.learnerId === actor.id && r.courseId === p.courseId && r.facilitatorId === p.facilitatorId && r.status === 'pending')) return 'Choose an available listed facilitator and published course, without duplicating a pending request.'; break;
  case 'withdraw-request': if (actor.role !== 'learner' || request?.learnerId !== actor.id || request.status !== 'pending') return 'Withdraw only your own pending request.'; break;
  case 'resolve-request': if (!admin || request?.status !== 'pending' || !['assigned','declined'].includes(p.outcome as string) || !nonblank(p.note) || (p.outcome === 'assigned' && !eligible(v,p.facilitatorId,request.courseId)) || (p.outcome === 'declined' && p.facilitatorId !== undefined)) return 'Resolve a pending request with an eligible facilitator or a decline reason.'; break;
  case 'publish-notice': if (!(admin || (actor.role === 'facilitator' && actor.status === 'active' && actor.teachingCourseIds.length)) || !boardStates.includes(p.state as string) || !nonblank(p.title,150) || !nonblank(p.text)) return 'Only Administration and approved facilitators can publish a titled state notice (up to 3,000 characters).'; break;
  case 'reply-notice': if (!notice || notice.hidden || notice.closed || !nonblank(p.text)) return 'Reply to a visible open notice with up to 3,000 characters.'; break;
  case 'moderate-board': {
   const reply = p.replyId === undefined ? undefined : notice?.replies.find(r => r.id === p.replyId);
   if (!admin || !notice || (p.replyId !== undefined && !reply) || !nonblank(p.reason) || !['pin','unpin','close','reopen','hide','restore'].includes(p.action as string) || (reply && !['hide','restore'].includes(p.action as string))) return 'Administration must select a valid moderation action and provide a reason.';
   const target = reply ?? notice;
   if ((p.action === 'hide' && target.hidden) || (p.action === 'restore' && !target.hidden) || (p.action === 'pin' && notice.pinned) || (p.action === 'unpin' && !notice.pinned) || (p.action === 'close' && notice.closed) || (p.action === 'reopen' && !notice.closed)) return 'This moderation change has already been applied.';
   break;
  }
  case 'read-notice': case 'read-board': if (!Number.isInteger(p.through) || (p.through as number) < 0 || (p.through as number) > v.events.length || (c.type === 'read-notice' ? !notice || notice.hidden : !boardStates.includes(p.state as string))) return 'Mark only visible notices through the current history position.'; break;
 }
 return undefined;
}
export function resolveManualRequest(v: ConnectedView, learnerId: string, courseId: string, facilitatorId: string, note: string) {
 for (const r of v.requests) if (r.learnerId === learnerId && r.courseId === courseId && r.status === 'pending') { r.status = 'assigned'; r.assignedFacilitatorId = facilitatorId; r.note = note; }
}
export function communityApply(v: ConnectedView, e: ConnectedEvent) {
 const p=e.payload, actor=v.people.find(x=>x.id===e.actorId)!;
 const val=(key:string)=>(p[key] as string).trim();
 const notice=v.notices.find(n=>n.id===p.noticeId);
 const request=v.requests.find(r=>r.id===p.requestId);
 switch(e.type) {
  case 'set-home-state': actor.homeState=val('state'); break;
  case 'submit-public-profile': actor.publicProfile={...actor.publicProfile,consent:true,draft:val('introduction'),pending:true}; break;
  case 'withdraw-public-profile': actor.publicProfile!.consent=false; actor.publicProfile!.pending=false; break;
  case 'review-public-profile': { const profile=v.people.find(x=>x.id===p.personId)!.publicProfile!; profile.pending=false; profile.note=val('note'); if(p.outcome==='approved')profile.approved=profile.draft; break; }
  case 'request-facilitator': {
   for(const r of v.requests)if(r.learnerId===actor.id&&r.courseId===p.courseId&&r.status==='pending')r.status='superseded';
   if(!v.enrolments.some(x=>x.learnerId===actor.id&&x.course.id===p.courseId))v.enrolments.push({id:e.id,learnerId:actor.id,course:structuredClone(v.courses.find(x=>x.id===p.courseId)!),lessons:[],scores:[],workRevision:0});
   v.requests.push({id:e.id,learnerId:actor.id,courseId:val('courseId'),facilitatorId:val('facilitatorId'),at:e.at,status:'pending'}); break;
  }
  case 'withdraw-request': request!.status='withdrawn'; break;
  case 'resolve-request': {
   request!.note=val('note'); request!.status=p.outcome as 'assigned'|'declined';
   if(p.outcome==='assigned') {
    request!.assignedFacilitatorId=val('facilitatorId');
    const enrolment=v.enrolments.find(x=>x.learnerId===request!.learnerId&&x.course.id===request!.courseId)!;
    v.assignments=v.assignments.filter(a=>a.learnerId!==request!.learnerId||a.courseId!==request!.courseId);
    v.assignments.push({id:e.id,learnerId:request!.learnerId,courseId:request!.courseId,facilitatorId:val('facilitatorId'),workRevision:enrolment.workRevision,note:val('note')});
   } break;
  }
  case 'publish-notice': v.notices.push({id:e.id,state:val('state'),title:val('title'),text:val('text'),authorId:actor.id,authorName:actor.name,role:actor.role,at:e.at,order:v.events.length+1,hidden:false,closed:false,pinned:false,replies:[]}); break;
  case 'reply-notice': notice!.replies.push({id:e.id,authorId:actor.id,authorName:actor.name,role:actor.role,text:val('text'),at:e.at,order:v.events.length+1,hidden:false}); break;
  case 'moderate-board': {
   const target=p.replyId?notice!.replies.find(r=>r.id===p.replyId)!:notice!;
   if(p.action==='hide'||p.action==='restore')target.hidden=p.action==='hide';
   if(p.action==='pin'||p.action==='unpin')notice!.pinned=p.action==='pin';
   if(p.action==='close'||p.action==='reopen')notice!.closed=p.action==='close';
   v.moderation.push({id:e.id,targetId:target.id,action:val('action'),reason:val('reason'),actorId:actor.id,at:e.at}); break;
  }
  case 'read-notice': case 'read-board': {
   const reads=v.boardReads[actor.id]??={};
   for(const n of v.notices.filter(n=>!n.hidden&&(e.type==='read-notice'?n.id===p.noticeId:n.state===p.state)))reads[n.id]=Math.max(reads[n.id]??0,p.through as number); break;
  }
 }
}
export function visibleNotices(v: ConnectedView, actorId: string, state: string) {
 return v.people.some(p=>p.id===actorId)?v.notices.filter(n=>n.state===state&&!n.hidden).map(n=>({...n,replies:n.replies.filter(r=>!r.hidden)})).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||b.order-a.order):[];
}
export function noticeUnread(v: ConnectedView, actorId: string, n: BoardNotice) {
 if(n.hidden||!v.people.some(p=>p.id===actorId))return false;
 const through=v.boardReads[actorId]?.[n.id]??0;
 return (n.authorId!==actorId&&n.order>through)||n.replies.some(r=>!r.hidden&&r.authorId!==actorId&&r.order>through);
}

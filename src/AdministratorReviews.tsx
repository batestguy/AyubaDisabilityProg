import { useEffect, useRef, useState } from 'react';
import type { SharedDemoSession } from './sharedDemo';
import { reviewRecord, reviewStatusLabel, type ReviewDecisionInput, type ReviewKind, type ReviewRecord, type ReviewStatus } from './reviewDemo';
import type { TeachingInput, SupportItem } from './userDemo';
import { demoDate } from './administratorMetrics';

export function ReviewHistory({ record }: { record: ReviewRecord }) {
 return <details><summary>Decision history ({record.history.length})</summary>{!record.history.length && <p>No decision recorded.</p>}{record.history.map(d => <article className="ma-question" key={d.id}><h4>{reviewStatusLabel(d.outcome, d.kind)} · Revision {d.reviewedRevision}</h4><p>{d.reviewer} · {demoDate(d.at)}</p><p className="mp-work">{d.reason}</p>{d.followUpOwner && <p>Follow-up: {d.followUpOwner} · {d.followUpDate}</p>}</article>)}</details>;
}
export function ReviewResult({ record }: { record: ReviewRecord }) {
 return <section className="mp-card"><h3>{reviewStatusLabel(record.status, record.kind)}</h3>{record.decision && <><p className="mp-work">{record.decision.reason}</p><p>Reviewed by {record.decision.reviewer} · {demoDate(record.decision.at)}</p>{record.decision.followUpOwner && <p>Follow-up: {record.decision.followUpOwner} · {record.decision.followUpDate}</p>}</>}<p>{record.kind === 'support' ? 'This simulated review records a plan only. No equipment, funding or other resources have been delivered.' : 'This simulated review does not verify qualifications or trade competence, or grant a real facilitator account.'}</p><ReviewHistory record={record} /></section>;
}
export function AdministratorReviews({ session, kind, onDecide }: { session: SharedDemoSession; kind: ReviewKind; onDecide: (input: ReviewDecisionInput) => string | undefined }) {
 const record = reviewRecord(session, kind);
 const [search, setSearch] = useState('');
 const [filter, setFilter] = useState('all');
 const [opened, setOpened] = useState<ReviewRecord>();
 const [error, setError] = useState('');
 const [notice, setNotice] = useState('');
 const errorRef = useRef<HTMLParagraphElement>(null);
 const heading = useRef<HTMLHeadingElement>(null);
 useEffect(() => { if (!record) { setOpened(undefined); setError(''); setNotice(''); } }, [record?.submission.id]);
 useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);
 useEffect(() => { if (opened) heading.current?.focus(); }, [opened?.submission.id]);
 const outcomes: ReviewStatus[] = kind === 'teaching' ? ['needs-changes', 'approved', 'declined'] : ['needs-clarification', 'plan-reviewed', 'declined', 'closed'];
 const statuses: ReviewStatus[] = ['pending', 'resubmitted', ...outcomes];
 const visible = record && (filter === 'all' || filter === record.status) && [session.user.profile.name, kind === 'teaching' ? (record.submission.payload as TeachingInput).skill : (record.submission.payload as { items: SupportItem[] }).items.map(i => i.need).join(' ')].join(' ').toLowerCase().includes(search.trim().toLowerCase());
 const openedDecision = opened && session.reviews?.decisions.find(d => d.submissionId === opened.submission.id);
 const current = opened && record?.submission.id === opened.submission.id ? record : opened ? { ...opened, decision: openedDecision, status: openedDecision?.outcome ?? opened.status, history: record?.history ?? [] } : undefined;
 return <><p>Review submitted evidence for this tab’s learner. Every outcome needs a reason and reviewer label.</p><p role="status">{notice}</p>{error && <p role="alert" ref={errorRef} tabIndex={-1} className="mp-error">{error}</p>}
 {!opened ? <><div className="ma-filters"><label>Search submitted reviews<input type="search" value={search} onChange={e => setSearch(e.target.value)} /></label><label>Review status<select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">All statuses</option>{statuses.map(s => <option key={s} value={s}>{reviewStatusLabel(s, kind)}</option>)}</select></label></div><p role="status">{visible ? '1 review shown.' : '0 reviews shown.'}</p>{visible && record ? <article className="ma-learner"><h3>{session.user.profile.name}</h3><p>{reviewStatusLabel(record.status, kind)} · Revision {record.submission.revision}</p><p>Submitted {demoDate(record.submission.submittedAt)}</p><button className="primary" onClick={() => { setOpened(record); setError(''); setNotice(''); }}>Open submitted evidence</button></article> : <section className="mp-card"><h3>{record ? 'No matching reviews' : 'No submissions yet'}</h3><p>{record ? 'Change the search or status filter.' : 'Submitted requests from User will appear here.'}</p>{record && <button onClick={() => { setSearch(''); setFilter('all'); }}>Clear review filters</button>}</section>}</> : <>
 <button onClick={() => { setOpened(undefined); setError(''); }}>Back to review queue</button><h3 tabIndex={-1} ref={heading}>Submitted evidence · Revision {opened.submission.revision}</h3><p>{session.user.profile.name} · {demoDate(opened.submission.submittedAt)}</p>
 {record?.submission.id !== opened.submission.id && <section className="mp-error"><p role="alert">A newer submission is available. This evidence cannot receive a decision.</p><button onClick={() => { setOpened(record); setError(''); }}>Open latest evidence</button></section>}
 <Evidence record={opened} /><details><summary>Earlier submission evidence</summary>{session.submissions.filter(s => s.kind === kind && s.id !== opened.submission.id).map(s => <section key={s.id}><h4>Revision {s.revision} · {demoDate(s.submittedAt)}</h4><Evidence record={{ ...opened, submission: s }} /></section>)}</details>
 {current && <ReviewResult record={current} />}
 {current && !current.decision && <form className="mp-card" key={opened.submission.id} onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); const input: ReviewDecisionInput = { kind, submissionId: opened.submission.id, expectedRevision: opened.submission.revision, outcome: String(f.get('outcome')) as ReviewStatus, reason: String(f.get('reason') || ''), reviewer: String(f.get('reviewer') || '') }; if (kind === 'teaching') input.checklist = { skill: f.has('skill'), examples: f.has('examples'), explanation: f.has('explanation'), accessibility: f.has('accessibility') }; else { input.followUpOwner = String(f.get('owner') || ''); input.followUpDate = String(f.get('date') || ''); } const message = onDecide(input); setError(message || ''); if (!message) setNotice('Review decision recorded.'); }}>
 <h3>Record a review decision</h3>{kind === 'teaching' && <fieldset className="mp-choices"><legend>Four-point approval checklist</legend>{([['skill','A clear skill'],['examples','Supporting examples'],['explanation','A clear teaching explanation'],['accessibility','An accessible approach']] as const).map(([name,label]) => <label key={name}><input type="checkbox" name={name} />{label}</label>)}</fieldset>}
 <label className="mp-field">Review outcome<select name="outcome" aria-label="Review outcome">{outcomes.map(s => <option value={s} key={s}>{reviewStatusLabel(s, kind)}</option>)}</select></label><label className="mp-field">Reason and next steps<textarea name="reason" required maxLength={5000} rows={4} /></label><label className="mp-field">Reviewer label<input name="reviewer" required maxLength={250} defaultValue="Demo administrator" /></label>{kind === 'support' && <><label className="mp-field">Follow-up owner (optional, with date)<input name="owner" maxLength={250} /></label><label className="mp-field">Follow-up date (optional, with owner)<input name="date" type="date" /></label></>}<button className="primary">Record decision</button></form>}
 </>}
 </>;
}
function Evidence({ record }: { record: ReviewRecord }) {
 const payload = record.submission.payload as TeachingInput & { items?: SupportItem[]; response?: string };
 return <section className="mp-card">{record.kind === 'teaching' ? <><p>Route: {payload.route === 'experience' ? 'Existing experience' : 'Learning progression'}</p><h4>{payload.skill}</h4><p><strong>Examples · Self-reported</strong></p><p className="mp-work">{payload.examples}</p><p><strong>Teaching explanation</strong></p><p className="mp-work">{payload.explanation}</p><p><strong>Accessible approach</strong></p><p className="mp-work">{payload.accessibility}</p></> : <ul>{payload.items?.map(i => <li key={i.id}>{i.need} · {i.priority} priority · Already available: {i.available || 'Not recorded'}</li>)}</ul>}{payload.response && <><h4>Learner response</h4><p className="mp-work">{payload.response}</p></>}</section>;
}

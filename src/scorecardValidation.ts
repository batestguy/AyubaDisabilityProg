import type { OutcomeInput, OutcomeState, SupportOutcome, GrantOutcome, FollowUpOutcome } from './scorecardDemo';
import type { SharedDemoSession } from './sharedDemo';
import { USER_LEARNER_ID } from './userDemo';
import { validText } from './reviewValidation';
export function validOutcomeDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const at = Date.parse(`${value}T00:00:00.000Z`);
  return Number.isFinite(at) && new Date(at).toISOString().slice(0, 10) === value;
}
export function validNaira(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1e12 && Number.isSafeInteger(Math.round(value * 100)) && Math.round(value * 100) / 100 === value;
}
export function validOutcomeInput(value: OutcomeInput): boolean {
  if (!value || value.learnerId !== USER_LEARNER_ID || !validText(value.recordId, 250) || (value.expectedUpdateId !== undefined && !validText(value.expectedUpdateId, 250)) || !validText(value.reviewer, 250) || !validText(value.reason, 5000) || !value.payload || !validText(value.payload.title, 250)) return false;
  if (value.kind === 'support') {
    const p = value.payload as SupportOutcome;
    return validText(p.submissionId, 250) && validText(p.itemId, 250) && ['not-provided', 'provided'].includes(p.status) && (p.status === 'provided' ? validOutcomeDate(p.providedDate) && validText(p.reference, 250) && validText(p.evidence, 5000) : [p.providedDate, p.reference, p.evidence].every(v => v === undefined));
  }
  if (value.kind === 'grant') {
    const p = value.payload as GrantOutcome;
    if (!['application', 'awarded', 'paid'].includes(p.stage) || ![p.appliedAmount, p.awardedAmount, p.paidAmount].every(validNaira) || p.paidAmount > p.awardedAmount || !validOutcomeDate(p.applicationDate) || !validText(p.reference, 250) || !validText(p.evidence, 5000)) return false;
    if (p.stage === 'application') return p.awardedAmount === 0 && p.paidAmount === 0 && p.awardDate === undefined && p.paymentDate === undefined;
    if (p.awardedAmount <= 0 || !validOutcomeDate(p.awardDate) || p.awardDate < p.applicationDate) return false;
    return p.stage === 'awarded' ? p.paidAmount === 0 && p.paymentDate === undefined : p.paidAmount > 0 && validOutcomeDate(p.paymentDate) && p.paymentDate >= p.awardDate;
  }
  if (value.kind === 'follow-up') {
    const p = value.payload as FollowUpOutcome;
    return validText(p.owner, 250) && validOutcomeDate(p.dueDate) && validText(p.action, 5000) && ['open', 'in-progress', 'closed'].includes(p.status) && (p.status === 'closed' ? validOutcomeDate(p.completedDate) : p.completedDate === undefined);
  }
  return false;
}
export function validOutcomes(value: unknown, session: SharedDemoSession): value is OutcomeState {
  if (value === undefined) return true;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const s = value as OutcomeState, finiteTime = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
  const unique = (items: { id: string }[]) => items.every(i => i && validText(i.id, 250)) && new Set(items.map(i => i.id)).size === items.length;
  if (!Array.isArray(s.updates) || !Array.isArray(s.receipts) || !unique(s.updates) || !unique(s.receipts) || new Set(s.receipts.map(r => r.updateId)).size !== s.receipts.length) return false;
  if (!s.updates.every((u, i) => {
    const prior = s.updates.slice(0, i).filter(p => p.recordId === u.recordId).at(-1), meta = session.recordMetadata[`outcome:${u.recordId}`];
    if (u.kind === 'support') {
      const snapshot = session.submissions.find(s => s.id === u.payload.submissionId);
      if (prior?.kind === 'support' && (prior.payload.submissionId !== u.payload.submissionId || prior.payload.itemId !== u.payload.itemId)) return false;
      if (!snapshot || snapshot.kind !== 'support' || snapshot.recordedAt > u.at || !(snapshot.payload as { items: { id: string }[] }).items.some(item => item.id === u.payload.itemId)) return false;
    }
    return validOutcomeInput(u) && u.expectedUpdateId === prior?.id && (!prior || (u.kind === prior.kind && u.learnerId === prior.learnerId)) && !!session.recordMetadata[`learner:${u.learnerId}`] && !!meta && meta.revision === s.updates.filter(p => p.recordId === u.recordId).length && finiteTime(u.at) && (!i || u.at >= s.updates[i - 1].at) && session.events.filter(e => e.kind === `${u.kind}-outcome-recorded` && e.recordId === u.recordId && e.at === u.at && e.actor === 'administrator').length === s.updates.filter(other => other.kind === u.kind && other.recordId === u.recordId && other.at === u.at).length;
  })) return false;
  return s.receipts.every((r, i) => {
    const u = s.updates.find(u => u.id === r.updateId);
    if (!u || r.learnerId !== USER_LEARNER_ID || r.learnerId !== u.learnerId || !finiteTime(r.at) || r.at < u.at || (i > 0 && r.at < s.receipts[i - 1].at) || !validText(r.note, 5000) || !canAcknowledge(u.kind, u.payload) || s.updates.some(newer => newer.recordId === u.recordId && newer.at < r.at && s.updates.indexOf(newer) > s.updates.indexOf(u))) return false;
    return session.events.filter(e => e.kind === 'outcome-receipt-confirmed' && e.recordId === u.recordId && e.at === r.at && e.actor === 'user').length === s.receipts.filter(other => s.updates.find(x => x.id === other.updateId)?.recordId === u.recordId && other.at === r.at).length;
  });
}
export function canAcknowledge(kind: string, payload: SupportOutcome | GrantOutcome | FollowUpOutcome): boolean {
  return kind === 'support' ? (payload as SupportOutcome).status === 'provided' : kind === 'grant' && (payload as GrantOutcome).stage === 'paid' && (payload as GrantOutcome).paidAmount > 0;
}

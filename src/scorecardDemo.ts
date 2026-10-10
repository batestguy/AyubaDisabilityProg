import type { SharedDemoSession } from './sharedDemo';
import { USER_LEARNER_ID } from './userDemo';
import { uid } from './store';
import { learnerRows } from './reportingDemo';
import { canAcknowledge, validOutcomeInput } from './scorecardValidation';
import { validText } from './reviewValidation';
export type SupportOutcome = { title: string; submissionId: string; itemId: string; status: 'not-provided' | 'provided'; providedDate?: string; reference?: string; evidence?: string };
export type GrantOutcome = { title: string; stage: 'application' | 'awarded' | 'paid'; appliedAmount: number; awardedAmount: number; paidAmount: number; applicationDate: string; awardDate?: string; paymentDate?: string; reference: string; evidence: string };
export type FollowUpOutcome = { title: string; owner: string; dueDate: string; action: string; status: 'open' | 'in-progress' | 'closed'; completedDate?: string };
type InputBase = { recordId: string; learnerId: string; expectedUpdateId?: string; reason: string; reviewer: string };
export type OutcomeInput = InputBase & ({ kind: 'support'; payload: SupportOutcome } | { kind: 'grant'; payload: GrantOutcome } | { kind: 'follow-up'; payload: FollowUpOutcome });
export type OutcomeUpdate = OutcomeInput & { id: string; at: number };
export type OutcomeReceipt = { id: string; updateId: string; learnerId: string; note: string; at: number };
export type OutcomeState = { updates: OutcomeUpdate[]; receipts: OutcomeReceipt[] };
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
export function latestOutcomes(session: SharedDemoSession, learnerId = USER_LEARNER_ID): OutcomeUpdate[] {
  const latest = new Map<string, OutcomeUpdate>();
  for (const u of session.outcomes?.updates ?? []) if (u.learnerId === learnerId) latest.set(u.recordId, u);
  return [...latest.values()];
}
export function recordOutcome(session: SharedDemoSession, input: OutcomeInput): { session: SharedDemoSession; error?: string } {
  if (!validOutcomeInput(input) || !session.user.profile.name.trim() || !session.recordMetadata[`learner:${input?.learnerId}`]) return { session, error: 'Complete a named User learner, valid dates, evidence and actor/reason. NGN amounts must be nonnegative with at most two decimal places, and paid cannot exceed awarded.' };
  const fields = structuredClone(input); fields.reason = fields.reason.trim(); fields.reviewer = fields.reviewer.trim();
  for (const key of Object.keys(fields.payload) as (keyof typeof fields.payload)[]) if (typeof fields.payload[key] === 'string') Object.assign(fields.payload, { [key]: (fields.payload[key] as string).trim() });
  const history = session.outcomes?.updates ?? [];
  if (history.some(u => { const { id: _id, at: _at, ...command } = u; return same(command, fields); })) return { session };
  const current = history.filter(u => u.recordId === input.recordId).at(-1);
  if (fields.expectedUpdateId !== current?.id || (current && (current.kind !== fields.kind || current.learnerId !== fields.learnerId))) return { session, error: 'This outcome record changed. Open its current revision before updating.' };
  if (fields.kind === 'support') {
    const latest = session.submissions.filter(s => s.kind === 'support').at(-1);
    const original = current?.kind === 'support' ? current.payload : undefined;
    const snapshot = session.submissions.find(s => s.id === fields.payload.submissionId);
    if (!snapshot || snapshot.kind !== 'support' || !(snapshot.payload as { items: { id: string }[] }).items.some(item => item.id === fields.payload.itemId) || (original ? fields.payload.submissionId !== original.submissionId || fields.payload.itemId !== original.itemId : latest?.id !== fields.payload.submissionId)) return { session, error: 'An existing support outcome keeps its original submitted checklist and item. Create a new outcome for a newer request; new records must use the latest checklist.' };
  }
  const next = structuredClone(session); next.outcomes ??= { updates: [], receipts: [] };
  const update: OutcomeUpdate = { ...fields, id: uid(), at: Date.now() };
  next.outcomes.updates.push(update);
  const old = next.recordMetadata[`outcome:${input.recordId}`];
  next.recordMetadata[`outcome:${input.recordId}`] = { id: input.recordId, kind: 'outcome', revision: (old?.revision ?? 0) + 1, recordedAt: update.at, assignedReviewerId: fields.reviewer };
  next.events.push({ id: uid(), kind: `${input.kind}-outcome-recorded`, recordId: input.recordId, actor: 'administrator', at: update.at, description: `Recorded simulated ${input.kind}: ${fields.reason}` });
  return { session: next };
}
export function acknowledgeOutcome(session: SharedDemoSession, updateId: string, note: string): { session: SharedDemoSession; error?: string } {
  if (!validText(note, 5000)) return { session, error: 'Enter a short receipt acknowledgement using no more than 5,000 characters.' };
  const u = session.outcomes?.updates.find(u => u.id === updateId), prior = session.outcomes?.receipts.find(r => r.updateId === updateId);
  if (prior) return prior.note === note.trim() ? { session } : { session, error: 'Receipt was already acknowledged for this revision.' };
  if (!u || u.learnerId !== USER_LEARNER_ID || !canAcknowledge(u.kind, u.payload) || latestOutcomes(session).find(current => current.recordId === u.recordId)?.id !== u.id) return { session, error: 'Receipt is available only for the current staff-recorded provision or positive grant payment. Refresh this scorecard.' };
  const next = structuredClone(session); next.outcomes ??= { updates: [], receipts: [] };
  const receipt: OutcomeReceipt = { id: uid(), updateId, learnerId: USER_LEARNER_ID, note: note.trim(), at: Date.now() }; next.outcomes.receipts.push(receipt);
  next.events.push({ id: uid(), kind: 'outcome-receipt-confirmed', recordId: u.recordId, actor: 'user', at: receipt.at, description: 'User explicitly acknowledged receipt for the displayed simulated outcome revision.' });
  return { session: next };
}
export function learnerScorecard(session: SharedDemoSession, learnerId = USER_LEARNER_ID) {
  const enrolments = session.user.learning.enrolments.filter(e => e.learnerId === learnerId), completed = enrolments.filter(e => !!e.completedAt).length;
  const outcomes = latestOutcomes(session, learnerId), support = outcomes.filter(u => u.kind === 'support'), grants = outcomes.filter(u => u.kind === 'grant'), followUps = outcomes.filter(u => u.kind === 'follow-up');
  const receipts = session.outcomes?.receipts ?? [];
  return { learnerId, enrolled: enrolments.length, completed, completionRate: enrolments.length ? completed / enrolments.length * 100 : null,
    practicalApproved: enrolments.filter(e => e.approved && !!e.submitted?.trim()).length, practicalPending: enrolments.filter(e => !e.approved && !!e.submitted?.trim()).length,
    supportRecorded: support.length, supportProvided: support.filter(u => u.payload.status === 'provided').length,
    supportReceiptConfirmed: support.filter(u => receipts.some(r => r.updateId === u.id)).length,
    grantsRecorded: grants.length, grantAppliedNGN: grants.reduce((sum, u) => sum + Math.round(u.payload.appliedAmount * 100), 0) / 100, grantAwardedNGN: grants.reduce((sum, u) => sum + Math.round(u.payload.awardedAmount * 100), 0) / 100, grantPaidNGN: grants.reduce((sum, u) => sum + Math.round(u.payload.paidAmount * 100), 0) / 100,
    grantReceiptConfirmed: grants.filter(u => receipts.some(r => r.updateId === u.id)).length,
    followUpsRecorded: followUps.length, followUpsOpen: followUps.filter(u => u.payload.status !== 'closed').length, outcomes };
}
export function learnerProgress(session: SharedDemoSession, threshold = 50) {
  if (typeof threshold !== 'number' || !Number.isFinite(threshold) || threshold < 0 || threshold > 100) return { rows: [], error: 'Enter a completion threshold from 0 to 100 percent.' };
  return { rows: learnerRows(session).map(row => { const scorecard = learnerScorecard(session, row.id); return { ...row, ...scorecard, classification: scorecard.completionRate === null ? 'no-enrolments' as const : scorecard.completionRate < threshold ? 'below' as const : 'at-or-above' as const }; }), error: undefined };
}

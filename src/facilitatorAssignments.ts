import type { SharedDemoSession } from './sharedDemo';
import { currentAssignment } from './coordinationDemo';

/** Latest assignments only: historical replacements are never active workload. */
export function facilitatorAssignments(session: SharedDemoSession, rosterId: string) {
 if (!session.reviews?.roster.some(r => r.id === rosterId)) return [];
 return (session.coordination?.assignments ?? []).filter(a =>
  a.rosterId === rosterId && currentAssignment(session, a.kind, a.recordId)?.assignment.id === a.id
 ).map(assignment => ({ assignment, stale: currentAssignment(session, assignment.kind, assignment.recordId)!.stale }));
}

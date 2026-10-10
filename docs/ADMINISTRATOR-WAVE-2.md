---
status: complete locally
---

# Administrator wave 2: application and support review

Current continuation (8 October 2026): User, Administrator waves 1–4 and the [learner scorecard/threshold follow-up](LEARNER-SCORECARD.md) are complete locally. Next: wave 5 consolidated Administrator closeout. Read [the current handoff](../SESSION-HANDOFF.md#next-session-brief); earlier milestones in this document retain their historical scope. Changes remain uncommitted and unpublished.

7 October 2026: after hands-on wave 1 checks reported no issues so far, the user requested the next step. Implement locally against the completed eight-course User/shared schema 2 baseline. Preserve existing uncommitted work, verified backup/recovery, sandbox isolation and trainer-owned practical assessment.

## Scope and defaults

- Add Trainer applications and Support requests queues/details to Administration, with search, status filters, empty states, submitted evidence and decision history.
- Trainer outcomes: Needs changes, Approved for demo roster, Declined. Approval requires a clear skill, supporting examples, clear teaching explanation and an accessible approach, all explicitly checked by the reviewer. Both application routes use the same rubric. Qualification/trade competence is not verified by this simulated decision.
- Support outcomes: Needs clarification, Plan reviewed, Declined, Closed. Record optional paired follow-up owner/date. Plan reviewed is a simulated coordination outcome, not funded/provided resources. No live messages or notifications.
- Every decision requires reason, reviewer label and UTC time, tied to the exact immutable submitted snapshot and revision. Pending/resubmitted records can be decided once per submission. Stale or repeated decisions cannot overwrite newer evidence or append duplicates.
- User sees status/reason/reviewer/time; requested changes/clarification permit a response and resubmission. Preserve original/revised snapshots and decision history. Teaching keeps its original entry route on resubmission; progression eligibility remains enforced by existing course gates.
- Only the profile created in User is shown. No new fictional cohort, course publishing, facilitator UI, actual practical approval, reports/exports or live services.

The user explicitly confirmed the four-point trainer checklist and the saved plan’s four support outcomes through the preference questions.

## State and implementation

- Extend schema 2 additively with review decisions and a minimal simulated roster entry for approved teaching. Existing schema 2 values without review state normalize to empty review state; malformed new state is preserved behind recovery. Keep the exact legacy backup untouched.
- Preserve User submission payloads as pending evidence; derive current review status from the latest submitted snapshot and its decision. Administrative decisions never mutate practical-work approval/completion or original submitted evidence.
- Central root callbacks apply review/response commands against the latest shared session, not stale component copies. Expose errors and success via visible status/error focus.
- Snapshot support/teaching responses, including unchanged evidence when a requested response is genuinely new. Duplicate submissions/decisions remain idempotent. Revising a previously reviewed support request returns it to review.
- Add user/admin milestone events, status-aware counters and immutable decision history. Approval creates only simulated roster data; it does not sign a person into Facilitator or grant real verification.

## Work and acceptance

- [x] Inspect completed wave 1 model, saved wave 2 plan and current uncommitted state.
- [x] Implement review state, commands/guards, saved-session compatibility and focused tests.
- [x] Implement Administration queues/detail/decision forms and status-aware overview.
- [x] Implement User-visible decisions, change responses and resubmission for both routes/support.
- [x] Verify stale-review/duplicate protections, snapshot preservation and unchanged learning gates.
- [x] Verify migration/reload, sign-out/reset, editable storage failures and sandbox isolation.
- [x] Browser-check pending/decision/resubmission/history flows, keyboard/error focus, collapsed sensitive evidence, responsive/larger text and axe; assert zero POST requests.
- [x] Independent read-only review of state/decision boundaries; correct and recheck findings.
- [x] Run preflight, relevant/full browser regressions and production CSP smoke.
- [x] Update handoffs, Markdown status and source inventory with actual results and wave 3 next.

## Execution record

Main owns UI integration, documentation and browser verification. One executor owns review model/commands/compatibility/tests; independent read-only review follows integration. Existing baseline verification is 36 tests, seven browser scripts, production CSP smoke and zero User/Admin POST requests. No deployment, commit or production dependency is authorized by this wave.

Final gate: `npm.cmd run preflight` passes 50 automated tests, TypeScript and production build (57 modules). All eight browser scripts pass: the first six in the full suite, then Administration regressions rerun after updating the expected overview support destination from learner detail to the new queue, followed by the expanded wave 2 script. Production CSP smoke includes both review queues and passes.

Independent review and focused UI recheck report no remaining material findings. Corrections cover duplicate responses, optional availability, immutable checklist input, snapshot revision ordering, incomplete legacy evidence approval, retained response evidence, reset cleanup, stale historical decision display and support await-review state. Browser coverage includes both teaching routes, all four support outcomes, rubric rejection/approval, retained evidence, stale warnings, histories, reload, reset and 390px layout. Nine User, eight wave 1 Administration and eight wave 2 axe audits have zero violations; User/Admin journeys record zero POST. Mobile review screenshot was visually inspected.

Relevant handoffs/Markdown documents are synchronized for wave 3 continuation; all 15 local-link checks pass and source inventory is refreshed. No commit, public deployment, added production dependency or live service. Next: user review of wave 2, then wave 3 roster/course coordination.

---
status: complete locally
---
# Administrator wave 3: roster, courses and learning coordination

Current continuation (8 October 2026): User, Administrator waves 1–4 and the [learner scorecard/threshold follow-up](LEARNER-SCORECARD.md) are complete locally. Next: wave 5 consolidated Administrator closeout. Read [the current handoff](../SESSION-HANDOFF.md#next-session-brief); earlier milestones in this document retain their historical scope. Changes remain uncommitted and unpublished.

8 October 2026: user reviewed wave 2 and authorized proceeding. Existing User and Administrator waves 1–2 remain intact. Baseline preflight passes 50 tests, TypeScript and build. Work remains local and uncommitted.

## Scope and decisions

- Show approved simulated trainer roster, application evidence and approval provenance; no automatic facilitator sign-in or verified professional status.
- Assign course reviewers, practical submissions and learning questions to approved roster entries with suitability notes, reasons and revision guards. Administration never approves practical work or replies as a trainer.
- Preview seed and authored courses, prepare explicit demo drafts, request changes, publish or archive with reason/reviewer/time and immutable history. Publishing validates author roster, complete content, quiz, assignment and accessible delivery evidence.
- Retain the course version used by each enrolment; archive blocks new enrolments while existing learning, completion and portfolio remain usable.
- Preserve shared schema 2 additive loading, exact legacy backup/recovery, eight-course gates, single User-created profile, sandbox isolation and zero external writes.
- Facilitator entry and observed specialist trade assessment remain deferred. Foundation records never certify competence to supervise a trade.
- User requested Nigeria map drill-down on 8 October: plan in wave 4, state → LGA → learner list/details, recorded locations and counts, keyboard/list alternative, unknown-location handling. Current one-profile demo is not a nationwide real-user database.

## Ownership

One executor owns coordination model/validation/tests and retained-version helpers. Main owns UI/root integration, browser verification, documentation and final review. Existing user edits must be preserved.

## Acceptance and progress

- [x] Inspect baseline and confirm wave 2 user acceptance.
- [x] Record wave 3 scope and user geographic-view requirement.
- [x] Implement and validate backward-compatible coordination commands and retained course versions.
- [x] Implement roster, course review/editor and learning oversight screens with User-visible coordination.
- [x] Verify stale/duplicate guards, history and publishing prerequisites; preserve trainer-owned assessment.
- [x] Run model/type/build checks and browser flows including mobile, keyboard, axe, save/reload and zero POST.
- [x] Review material changes independently; correct and recheck findings.
- [x] Update handoff/documentation with actual evidence and wave 4 next.

## Closeout evidence

Final `npm.cmd run preflight`: 58 tests pass, TypeScript passes and Vite builds 60 modules. All nine browser scripts pass: the eight existing scripts ran in a sequential regression batch, and the new coordination script passed separately after corrections. `node scripts/browser-production.mjs` passes the published CSP and includes roster, course review and learning oversight as well as existing documentary/sandbox/PDF/no-JavaScript flows.

The dedicated wave 3 journey has nine axe audits with zero violations and zero POST requests. It covers empty/approved roster, current and resubmitted assignments, archived discovery/enrolled access, draft editor, requested changes/revision/publication, newly enrolled course completion/portfolio, retained completion after a second published lesson, reload/reset and sandbox isolation. Mobile course/oversight screenshots were visually inspected. Existing nine User/eight baseline Administrator/eight wave 2 audits remain green.

Independent read-only review found no material migration, publishing or retained-learning issue. Its assignment-retry concern was corrected: an earlier retry cannot undo a later reassignment, and replacements require the current assignment ID. The focused reviewer recheck is clear. Additional regression verifies historical retry, stale replacement, fresh reassignment, save/reload and malformed predecessor-chain recovery.

Browser corrections included stable names for populated course-editor textareas/outcome selection and returning to the list when clicking the same wave 3 sidebar destination. The reset-isolation fixture was corrected to valid sandbox bytes rather than an invalid marker; no sandbox behavior changed. Final model/build and relevant browsers passed after runtime corrections.

No commit, production dependency, public deployment, live messages, real account or shared backend. Next is user review, then wave 4 reports/history/settings and the requested Nigeria state/LGA learner drill-down.

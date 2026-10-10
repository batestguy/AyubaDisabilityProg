---

Current continuation checkpoint (7 October 2026): [Administrator wave 2](ADMINISTRATOR-WAVE-2.md) implements application/support decisions, immutable history and User responses. Next is wave 2 user review, then wave 3 roster/course coordination. [Main handoff](../SESSION-HANDOFF.md) takes precedence over earlier checkpoint descriptions below.
status: done
---

# Administrator wave 1: shared foundation

Current continuation (8 October 2026): User, Administrator waves 1–4 and the [learner scorecard/threshold follow-up](LEARNER-SCORECARD.md) are complete locally. Next: wave 5 consolidated Administrator closeout. Read [the current handoff](../SESSION-HANDOFF.md#next-session-brief); earlier milestones in this document retain their historical scope. Changes remain uncommitted and unpublished.

Approved for local implementation on 7 October 2026. This document is the tracking record for the agreed plan. The eight-course User baseline and the independent sandbox must remain intact.

## Agreed result

Administration provides Overview and Learners, including read-only learner details. It uses the profile created in User only; no additional fictional cohort is loaded. User and Administration share tab-session records immediately. Application/support decisions, coordination notes, course publishing, reports, exports and Facilitator screens remain for later waves. No deployment, commit, live service or production dependency is included.

## State and compatibility

- App-demo shell owns loading, updates and saving. User becomes a controlled view; Administration has no record mutation controls.
- Schema 2 wraps the existing User payload with record metadata, immutable submission snapshots and append-only milestone events. The storage key remains `mosaic-user-demo-v1`; `mosaic-v1` remains separate.
- Back up the exact valid legacy value under `mosaic-user-demo-v1-backup` before replacement. Validate and verify migration, preserving onboarding/editing, categories, authored content, all eight course activities, approvals, portfolio, attachments, support and teaching. Repeat loads cannot multiply records/events.
- Invalid or unsupported data stays untouched and produces recovery controls. Storage failure leaves changes in memory with a warning. Explicit reset clears primary/backup and temporary files only after confirmation.
- File contents remain in memory through role/page navigation, require reselection after reload and are never uploaded. Sign-out preserves records for both perspectives.
- IDs are stable. Metadata includes kind, ID, revision, recorded UTC epoch and nullable reviewer ID. Revisions reflect record changes rather than renders.
- Support, teaching and work snapshots preserve prior submissions. Explicit unchanged practical resubmission also increments its submission revision and invalidates approval/completion/portfolio through existing rules.
- Milestones cover migration, onboarding completion, submissions, sample trainer reviews/replies, completion and invalidation. Profile typing updates revision without recording every keystroke as a milestone. Do not invent pre-migration history or unavailable submission times.

## Interface

- Reuse Mosaic branding, typography, colours, desktop sidebar/mobile menu and accessible text controls. Navigation contains Overview and Learners only.
- Overview derives learner/enrolment/completion/pending work/unanswered question/support/application counts from current data. A nonblank display name counts as a learner, with incomplete onboarding explicitly labelled. Eight available seed courses do not imply workshops or service delivery.
- Prominent next action opens learner details, or switches to User when no profile exists. Pending summaries open the relevant detail section; decisions are clearly deferred to wave 2.
- Learners searches name/state/LGA and filters All/Profile incomplete/Profile ready. Details show goals, skill areas, learning circumstances, access preferences, course progress/best score/review state, achievements, portfolio, submitted support history and teaching application.
- Contact, gender, disability disclosures, certificates and attachment metadata are collapsed by default. Existing claims remain unverified. Foundation completion does not certify observed trade competence.
- Support keyboard navigation, meaningful empty/search-empty/error states, focus management and back navigation. Hidden panels must not steal focus.

## Acceptance and work items

- [x] Establish baseline: 19 automated tests pass.
- [x] Implement shared schema, migration, histories and meaningful model fixtures.
- [x] Integrate shell ownership and preserve User lifecycle/gates.
- [x] Implement Overview and read-only Learners/details.
- [x] Verify migration, repeated loads, storage failure, all eight course gates and sandbox isolation.
- [x] Browser-check cross-role live updates, reload, editing, sign-out/resume/reset and unchanged resubmission.
- [x] Check 1440/768/390px, larger text, keyboard/focus, collapsed fields, axe audits and zero POST requests.
- [x] Run preflight, full browser regressions and production CSP smoke.
- [x] Independent read-only migration/shared-state review; resolve material findings.
- [x] Update validation, architecture, README and handoff with actual evidence and wave 2 starting point.

## Execution record

7 October: preserve existing uncommitted User implementation. One executor owns shared-session model/migration/tests; main owns UI, documentation and browser checks. Separate review follows integration. The agreed document location takes precedence over the tracking skill's default `_dev/todos/` location.


7 October integration gate: 36 automated tests, TypeScript and Vite build pass. Existing User and website/role-tab journeys pass. New Administrator journey passes exact legacy migration, all eight retained completions, live role sharing, histories/unchanged resubmission, private/read-only views, search/filter empty states, keyboard focus, reload/sign-out/reset isolation, responsive/enlarged layouts and editable storage-error recovery/save retries. Eight Administrator axe audits report zero violations and no POST requests. Built-site production CSP smoke passes with Administration included. Full seven-script regression suite passes.

Independent review found malformed optional course rendering fields, blocked valid memory-only sessions, reset backup ordering and missing feedback milestones; all were corrected with focused regressions. Reviewer recheck independently passed all 36 tests and TypeScript and reports no remaining material findings.


Final closeout, 7 October: `npm.cmd run preflight` passes all 36 tests, TypeScript and Vite production build; `npm.cmd run test:ui` passes all seven Chrome scripts; `node scripts/browser-production.mjs` passes rebuilt site under published CSP including User/Administration, documentary/dialog assets, sandbox, PDF and no-JavaScript mobile. Nine User and eight Administrator axe audits have zero violations; both demo journeys produce zero POST requests. Desktop overview and enlarged mobile learner-detail screenshots were visually inspected. Automated checks do not replace participant/screen-reader testing. No commit, deployment or publication was performed.

Next: wave 2 application/support review queues, reasoned decisions and User-visible changes requests/resubmission, using current stable revisions and immutable snapshots. Decisions must guard against stale reviewed revisions and duplicate actions. Practical assessment remains a facilitator action.


## Next-session documentation synchronization

7 October: main handoff/continuation brief, README/index, full Administrator specification, User plan/closeout, practical-skills plan, architecture, appearance guide, deployment reference, walkthrough and historical/validation entry points now identify wave 1 as complete and wave 2 as next. Previous checkpoints remain labelled historical. This continuation changes documentation only; source behavior and wave 1 browser evidence remain unchanged. See [the continuation brief](../SESSION-HANDOFF.md#next-session-brief) before new work.

Documentation-handoff verification: fresh preflight passes all 36 tests, TypeScript and Vite build; all local file links across 14 Markdown files resolve and diff whitespace checks pass. Source inventory hashes refreshed. No application behavior changed and no commit/deployment was performed.

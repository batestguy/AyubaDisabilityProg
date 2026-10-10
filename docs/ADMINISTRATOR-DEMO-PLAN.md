# Mosaic Pathways: full Administrator stage plan

Current continuation (8 October 2026): User, Administrator waves 1–4 and the [learner scorecard/threshold follow-up](LEARNER-SCORECARD.md) are complete locally. Next: wave 5 consolidated Administrator closeout. Read [the current handoff](../SESSION-HANDOFF.md#next-session-brief); earlier milestones in this document retain their historical scope. Changes remain uncommitted and unpublished.

Current continuation checkpoint (8 October 2026): User and Administrator waves 1–4 plus the [learner scorecard and threshold-follow-up extension](LEARNER-SCORECARD.md) are complete locally. Next is wave 5 consolidated Administrator stage closeout. [Main handoff](../SESSION-HANDOFF.md) takes precedence over earlier specifications below.

Status: full-stage specification with completed waves 1–4 and the subsequently authorized scorecard extension. Earlier first-wave recommendations below are historical; continue with wave 5 closeout rather than restarting implementation.

The user subsequently requested planning practical/vocational skills and selected sewing, small-space growing and retail/customer service as the starter mix. Read [the expansion plan](PRACTICAL-SKILLS-EXPANSION-PLAN.md) before implementing course metadata and assessment flows. The three foundation courses, People & Workplace Essentials and category selection are implemented in the eight-course User baseline. The later Administrator stage must preserve these courses and introduce specialist observation separately from foundation completion.

## Purpose and boundaries

The Administrator coordinates learners, trainers/mentors, course availability and support follow-up. Their decisions should be understandable and visible to affected demo users. Facilitators deliver teaching, answer learning questions and assess practical work; Administrator oversight must not silently replace trainer assessment.

Keep the current local demonstration: simulated role selection, fictional data, tab-session persistence, no real accounts/authorization, external registration, messages, uploads, funding, employment placement or financial transactions. A simulated approval never establishes a real qualification, support award or verified professional status. The existing website and separate sandbox remain intact.

The full plan covers all administrative areas below, delivered in reviewable waves. Recommended first implementation is shared records plus Overview and review queues; later waves complete the full scope.

## Screen sequence and navigation

Choose role → Administration → Overview → select a queue or record → inspect evidence → make a reasoned demo decision → confirm changed state → inspect audit history → verify the corresponding User view.

Desktop sidebar/mobile menu: Overview; Learners; Trainers and mentors; Courses; Support requests; Learning oversight; Reports; Activity history; Demo settings. Every list has search/filter, meaningful counts, clear empty states, labelled controls and a keyboard-accessible detail view. Show sample labels consistently and avoid autoplay or time-limited actions.

| Area | Observable behaviour |
|---|---|
| Overview | Counts by status and a prominent next action; queues for trainer applications, support, course review and overdue assigned follow-up. No implied live delivery or impact claims |
| Learners | View profile, chosen goals, access preferences, enrolled courses, achievements, portfolio and support history. Optional sensitive fields collapsed by default; no filtering or ranking by disability/gender. Edit coordination notes rather than changing self-reported identity or earned skills |
| Trainers and mentors | Review both application routes, work examples, explanation and accessibility exercise. Request changes, approve for a simulated trainer roster or decline with reasons. Approval records reviewer/date; it does not automatically sign the person into a new role |
| Courses | Inspect eight seed courses plus later authored drafts; preview lessons, quiz validity, assignment and accessibility. Assign a reviewer, request changes, publish or archive with reasons. Preserve enrolled learners' access to their retained course version |
| Support requests | Inspect the submitted checklist snapshot, priority and already available resources. Request clarification, mark coordination/review outcome, assign a demo follow-up owner/date and record notes. Review approval means an accepted support plan, not funded/provided equipment |
| Learning oversight | Inspect progress and practical-review queues, assign a simulated facilitator, track questions and review status. Trainer feedback/approval is a facilitator action; retain clearly labelled presenter controls while the Facilitator interface is deferred |
| Reports | Counts for learner activity, enrolment, course completion, pending reviews and support coordination. Display definitions, denominators and demo data labels. No causal impact, grant, employment or delivery totals without actual recorded evidence |
| Activity history | Append-only local events for decisions, revisions, assignments, publishing and settings. Show actor label, affected record, timestamp, previous/new status and reason. This is demo history rather than a tamper-proof production audit log |
| Demo settings | Visible demo identity, session version, sample-cohort loading, local export and reset controls. Export excludes sensitive profile fields/attachment metadata by default. Reset requires a concrete scope confirmation and preserves the separate sandbox |

## Review state transitions

| Record | Proposed states and rules |
|---|---|
| Trainer/mentor application | Pending → Needs changes → Resubmitted; or Pending/Resubmitted → Approved for demo roster / Declined. Require a decision reason, reviewer and date. Both entry routes receive the same teaching/access review; existing certificates remain unverified |
| Support request | Pending review → Needs clarification → Resubmitted; or Pending/Resubmitted → Plan reviewed / Declined / Closed. A separate fulfilment note is simulated and cannot claim resources were delivered. Keep original and revised checklist snapshots |
| Authored course | Draft → Submitted → Needs changes → Resubmitted → Published; or Withdrawn/Archived. Publishing requires complete valid lessons/assessment/assignment and an approved simulated trainer profile. Seed courses start published |
| Practical work | Submitted → Assigned/Pending trainer review → Changes requested → Resubmitted → Trainer approved. Every resubmission clears earlier approval and completion. Completion still requires all lessons and best quiz ≥70% |
| Learning question | Pending → Assigned → Replied, with optional follow-up. No real notification/message is sent |

Decisions apply only to the version reviewed. If a user changes or resubmits a record while its detail view is open, prevent applying the old decision and require refreshing/reviewing the new version. Double clicks and repeated submissions must not create duplicate decisions or audit events. Store date/time in UTC; display local date/time with a timezone label.

## Shared records and implementation approach

1. Shared ownership is implemented in wave 1: `AppDemoPage` owns one `SharedDemoSession`; User and Administration share updates. Keep file contents in memory and preserve reselection after reload. The existing sandbox is separate, not the new app's backend.
2. Schema 2 is implemented under `mosaic-user-demo-v1`, wrapping the User payload with record metadata, immutable submission histories and events. Exact schema 1 backup is `mosaic-user-demo-v1-backup`. Preserve current data/verified recovery instead of introducing another migration or resetting progress unnecessarily.
3. Stable IDs/revisions, nullable reviewer assignment and submitted snapshots are implemented. Wave 2 extends them with actual demo decision/status records and reviewed-revision guards. Define any new schema compatibility deliberately and test existing saved sessions.
4. Published course-version retention remains wave 3 work: existing enrolments must retain reviewed content when later publication is added. No Administrator publishing or practical assessment action exists in wave 1.
5. Wave 1 uses only the profile created in User. Additional fictional review examples are deferred to later settings work unless separately requested; examples must be explicitly loaded, labelled, deduplicated and never overwrite the User profile.
6. Reuse catalogue/learning helpers only when behavior genuinely matches. Administrator application/support/publication decisions remain separate from facilitator assessment.
7. Derive future reports from shared records. Exports/settings belong to wave 4; default exports must omit sensitive fields and explain any opt-in fuller fictional data.

## Delivery waves

| Wave | Scope | Verification gate |
|---|---|---|
| 1: shared foundation — complete 7 October | Session migration, IDs/revisions/history, shared tab ownership, Overview and read-only learner detail | Passed: 36 tests, seven browser scripts, production CSP smoke, User/Admin axe audits; details in [wave 1 closeout](ADMINISTRATOR-WAVE-1.md) |
| 2: application/support review | Trainer application and support queues, details, decisions, reasons and User-visible status/changes requests | Both teaching routes, revision snapshots, stale-review prevention, duplicate decision prevention and accurate simulated outcomes |
| 3: trainers/courses/learning | Demo roster, reviewer assignment, course previews/publication/archive, practical/question oversight | No automatic role sign-in; publishing prerequisites; retained course versions; facilitator ownership of learning assessment |
| 4: reports/history/settings/geography — complete locally 8 October | Defined aggregates, filters, append-only event views, safe exports, explicit sample data/reset controls | Counts reconcile with records, export defaults omit sensitive fields, reset scope is clear and sandbox is preserved |
| 5: full-stage closeout | Responsive/accessibility/error states, full cross-role journeys, documentation and handoff | Preflight, all relevant browser regressions, production CSP smoke and fresh independent review of migration/decision boundaries |

## Acceptance criteria

- Administrator and User tabs share updated records; current tab progress survives migration, reload and sign-out/resume.
- Pending queues and filters match records. Fictional examples never overwrite the User profile or multiply on repeated loading.
- Both teaching routes can be reviewed with reasons; simulated approval creates a roster entry, without real verification or automatic role sign-in.
- Support review never claims grants/equipment/funding were approved or delivered; submitted snapshots and follow-up remain distinguishable.
- Users can respond to changes requests and resubmit. A stale review cannot decide a newer revision; repeated clicks cannot duplicate events.
- Disability, gender and unverified certificates never determine course access or automated application eligibility/ranking.
- Authored courses cannot publish until content/assessment/trainer gates pass. Archiving preserves existing learners' progress and retained lessons.
- Only explicit trainer/sample-trainer assessment approves practical work. Resubmission resets approval/completion; Administrator counters cannot override these gates.
- Reports disclose scope, denominator and fictional status, match underlying records and avoid invented economic outcomes.
- Sensitive optional fields remain collapsed in learner views and omitted from default exports; no external network write occurs.
- Keyboard navigation, error focus, status announcements, labels, mobile layouts, enlarged text and empty/error states work.
- User, website, sandbox, authoring and original multilingual journeys continue to pass. Eight-course User browser coverage and production CSP checks remain required.

## Decisions to settle during implementation planning

Practical-skills extension: design course delivery modes, tools/materials, accessibility options, vocational reviewer expertise and task-specific observation rubrics in waves 1/3. Foundation completion and trainer-observed practical competence must have distinct records; an Administrator support decision cannot approve practical work. Preserve unverified uploads versus reviewed evidence, supervised-task prerequisites, pending tools/practice, honest workshop availability and specialist trainer suitability. See [the proposal](PRACTICAL-SKILLS-EXPANSION-PLAN.md) for candidate courses and acceptance criteria.

Recommended defaults are a simulated roster (not real accounts), Administrator ownership of application/support/publication decisions, facilitator ownership of practical assessment, manually assigned follow-up dates with no automatic notifications, and non-destructive course archiving. Before implementing later waves, confirm whether a reviewed trainer should be able to enter the deferred Facilitator demo, the rubric for accepting teaching applications, the terminology for support review outcomes, and the intended reporting/export fields. The shared foundation is complete. Settle wave 2 application criteria and support-outcome wording when planning the next implementation; Facilitator entry, publication and reports/export choices remain for later waves.

## Wave 4 geographic learner view (user request, 8 October 2026)

Add an interactive Nigeria map for Administration: select a state, drill down to an LGA, then inspect the matching learner list and open learner details. Show counts derived from recorded profile locations, clear breadcrumbs/back controls, empty states and an accessible state/LGA list alternative. Keep unknown or unmatched locations visible separately; do not guess locations or show precise home coordinates. Optional disability/gender do not drive geographic ranking. Use a reviewed local boundary dataset with provenance and normalized state/LGA identifiers. The existing demo contains one User-created learner; nationwide real-user records need a separately scoped shared backend. This belongs to wave 4 reports/geographic views, after wave 3 coordination.


## 8 October 2026 — Authorized individual scorecard extension

After wave 4, the user requested documenting and implementing a clear individual dashboard for learning, fulfilled support requests and grant receipt. This extends the earlier review-only support scope: add explicit local demo outcome records, without inferring delivery from a reviewed plan or making payments. See [learner scorecard tracking](LEARNER-SCORECARD.md).

Measures remain separate: completed/enrolled courses and completion percentage (no percentage without enrolments), practical assessments approved/awaiting review, staff-recorded support provision and learner receipt acknowledgement, grant application/award/payment records in NGN, and follow-up action/owner/date/status. Record source, date and evidence descriptions; distinguish recorded payment from learner confirmation. Financial amounts must be nonnegative and recorded payments must not exceed awards. Preserve immutable history, existing learning gates and schema 2 recovery/privacy defaults. Optional sample geographic profiles must not acquire invented outcomes.

This extension precedes wave 5 consolidated stage closeout. Real disbursements, financial integrations, accounts and backend remain separately scoped.


The user additionally requested cohort follow-up by low/high course completion. Administration must provide an editable completion threshold (initially 50%), filters for below / at or above / no enrolments, and learner rows with completed/enrolled counts, percentage, pending assessments and follow-up details. Equality belongs to at-or-above. No enrolments or fictional profiles without learning evidence have no percentage and never enter a low-progress group as 0%. Completion is completed enrolments / all enrolments for that learner; this configurable follow-up threshold does not change learning assessment gates.

# Mosaic Pathways User stage: closeout

Current continuation (8 October 2026): User, Administrator waves 1–4 and the [learner scorecard/threshold follow-up](LEARNER-SCORECARD.md) are complete locally. Next: wave 5 consolidated Administrator closeout. Read [the current handoff](../SESSION-HANDOFF.md#next-session-brief); earlier milestones in this document retain their historical scope. Changes remain uncommitted and unpublished.

Current continuation checkpoint (7 October 2026): [Administrator wave 2](ADMINISTRATOR-WAVE-2.md) implements application/support decisions, immutable history and User responses. Next is wave 2 user review, then wave 3 roster/course coordination. [Main handoff](../SESSION-HANDOFF.md) takes precedence over earlier checkpoint descriptions below.

Date: 4 October 2026. Status: **completed for the agreed local demonstration scope**. This closes the User stage and hands over to [full Administrator planning](ADMINISTRATOR-DEMO-PLAN.md). It does not certify production readiness or participant accessibility validation.

> Subsequent checkpoint, 7 October 2026: [Administrator wave 1](ADMINISTRATOR-WAVE-1.md) introduces shared schema 2, Overview and read-only Learners. This document retains the 4 October User closeout evidence; its deferred-administration statements describe that earlier checkpoint.

## Delivered

Adult simulated profile; optional disability/gender/certificates; independent access preferences; six-step editable onboarding with Back/skip and reload preservation; dashboard/pathway and goal checklists; local matching; learning, portfolio, tools/support, teaching and profile views; mobile navigation; enlarged text; sign out/resume/reset.

Eight courses contain 48 text-first lessons and 39 quiz questions:

| Course | Lessons | Quiz questions |
|---|---:|---:|
| Digital Essentials | 6 | 4 |
| Spreadsheet and Data Skills | 6 | 5 |
| Small-Business Foundations | 6 | 5 |
| AI Essentials | 6 | 5 |
| People & Workplace Essentials | 6 | 5 |
| Sewing and Simple Textile Products | 6 | 5 |
| Small-Space Growing and Nursery Basics | 6 | 5 |
| Retail and Customer Service Practice | 6 | 5 |

Each supports enrolment, lesson completion, best-score quiz retries, practical work, pending questions and explicit sample feedback/approval/replies. Completion requires every lesson, best quiz ≥70%, submitted work and trainer approval. Resubmission clears approval/completion and the related portfolio entry. Completed practical work is added explicitly; printable achievements state demo-only/non-accredited status.

AI Essentials covers capabilities/limits, clear prompts, output checking, privacy/responsible reuse, accessibility/fairness and human-reviewed workflows. Written fictional examples support practice without live AI or a paid account. Original three-course translations remain intact; the new course is English-first. Existing User and sandbox sessions gain the course without losing profiles, progress or authored content.

Support requests and both teaching routes remain accurately pending until later administrative review. File type/count/size limits, local-only contents, stored descriptions/metadata and reselection after reload are implemented. No live accounts, external uploads, real support provision or automatic facilitator status were added.

Users choose Digital & AI Skills, People & Workplace Skills, Hands-On & Livelihood Skills and Business & Enterprise Skills in onboarding. Multiple choices survive Back/reload and remain editable. My learning filters by area or shows every course. Category choices never enrol a learner automatically or restrict access. Existing sessions gain an empty category list without losing progress.

The three livelihood courses assess introductory knowledge and written plans or fictional role-play. Equipment is not required for these foundation tasks. Tools and support are signposted; printable achievements explicitly exclude observed trade competence. Supervised practice belongs to later specialist delivery. New content remains English-first.

## Acceptance evidence

| Acceptance area | Evidence |
|---|---|
| Optional disclosure and independent access choices | Browser onboarding without disability/gender/certificates; separate multiple disability/access selections |
| Persistence and isolation | Back/reload/profile-edit/sign-out/resume/reset checks; saved-session upgrade test preserves progress and authored drafts; sandbox key stays separate |
| Eight-course learning and gates | All-course model tests and full browser journeys with failed/pass quiz retries, pending work/questions, explicit review, unchanged resubmission and explicit portfolio additions |
| Evidence handling | Type/count/5 MB validation tests; invalid/oversized browser errors; metadata preservation/reselection; zero POST requests during User journey |
| Support and teaching | Support snapshots, duplicate prevention/revision/error states; both pending application routes; progression requires a completed course and demonstrated skill |
| Access and layouts | Nine User axe audits without violations; keyboard/error focus and status checks; six User views at 1440/768/390px with enlarged text; mobile overview with global A+ Text |
| Existing journeys | Website/story, sandbox, authoring, original translations and existing accessibility suite pass |
| Build/production | Preflight passes 19 tests, TypeScript and Vite; rebuilt production smoke passes published CSP, eight-course catalogue, User entry and existing website/sandbox assets |

Reproduce with npm.cmd run preflight, then npm.cmd run test:ui against the local development preview; node scripts/browser-production.mjs against the rebuilt production preview. Artifacts are in ignored output/playwright/. See [validation history](validation.md) for the exact closeout record and [handoff](../SESSION-HANDOFF.md) for files and commands.

## Carried forward at User closeout (4 October 2026)

- Administrator and Facilitator screens are not implemented. The [Administrator plan](ADMINISTRATOR-DEMO-PLAN.md) is proposed planning, selected by the user as the next full stage.
- Keep User pending states, original submitted evidence and explicit review gates when adding administration. A support review must not imply resources/funding were delivered.
- A shared cohort/revision model needs a tested migration from the current single-profile tab session. Do not overwrite existing progress or merge the separate sandbox records.
- Real authentication, cloud storage, messages, live AI within User, notifications, transactions, funding/equipment/employment delivery remain outside this demo.
- Participant co-design, actual assistive-technology testing, name availability and reviewed AI course translations remain future work; automated checks alone do not establish those outcomes.

No deployment, commit or remote publication is part of this closeout. The implementation remains locally reviewable.


## Current continuation (7 October 2026)

[Administrator wave 1](ADMINISTRATOR-WAVE-1.md) is now complete with schema 2 migration/backup, shared Overview and read-only Learners/details, revisions and submission histories. The earlier deferred-administration bullets describe the 4 October closeout. Application/support review decisions, changes requests and resubmissions are next in wave 2. Preserve the eight-course User baseline and existing assessment/portfolio gates; the shared-state foundation must not be rebuilt. Current validation and local/uncommitted status are in [the main handoff](../SESSION-HANDOFF.md#next-session-brief).

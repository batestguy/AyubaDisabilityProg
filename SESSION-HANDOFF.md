# Session handoff: Mosaic Pathways and grant-planning reports

## Current checkpoint — 10 October 2026

User authorized documenting all progress, committing and pushing the accumulated project work to `batestguy/AyubaDisabilityProg`, branch `main`. This checkpoint supersedes historical continuation pointers below. Deployment is separate and has not been performed for this revision.

Delivered: eight-course User journey; Administrator waves 1–4; learner progress thresholds and individual support/grant/follow-up scorecards; wave 5 completion-corruption and navigation-contrast corrections; demographic/disability/skills grant-planning dashboard and aggregate PDF/CSV plus separately selected detailed CSV. See [report tracking](docs/GRANT-PLANNING-REPORT.md), [wave 5 gates](docs/ADMINISTRATOR-WAVE-5.md), [validation](docs/validation.md) and [session history](docs/SESSION-HISTORY.md).

The latest PDF has five deliberate sections: executive briefing/KPIs/evidence table; actual Nigeria state polygons with state labels/counts/shares and LGA tables; demographic/access charts and missing-information coverage; skills/support charts and a recorded learning-pathway diagram; additional planning categories. State geometry uses the existing pinned 37-state/FCT, 774-LGA atlas with attribution. PDF failure to load/validate the atlas stops export and offers CSV. Download grant-planning PDF is beside the report heading. PDF profile charts use selected User profiles; geography and appendix tables use the entire selected cohort, with denominators labelled. No age, education or employment statistics are invented. Five geographic sample profiles have gender not collected; the eye fixture has one Woman and zero Prefer not to say answers. This is not refusal by the samples.

Validation: 84 model tests, TypeScript and production build pass. All twelve browser scripts have passing final-source evidence from consolidated/affected reruns; latest grant journey additionally verifies all/User/sample/state/empty PDF exports, atlas failure, filters, privacy/consent resets, mobile and five clean axe audits. Production CSP verifies actual PDF download with same-origin atlas GET 200, zero POST and no page errors. All five populated PDF pages and scope variants were rendered/inspected; final geographic table spacing was corrected and reexported. The main Vite bundle still has its size advisory. No new dependency was added.

User accepted guided visual steps 1–4: overview, progress/scorecard, trainer/support queues and courses, and Nigeria→state→LGA map drill-down. New Reports/PDF revisions were requested and opened; final explicit visual acceptance remains pending. Still review Reports/history/settings, corresponding User screens, mobile and enlarged text, then close wave 5. Do not treat automated verification as visual acceptance.

Local evidence is ignored under `output/pdf/` and `output/playwright/`: final `grant-planning-report.pdf`, five rendered review pages, desktop/mobile screenshots and audit JSON. Reproduce by `npm.cmd run preflight`, then `node scripts/browser-grant-planning.mjs` with dev 5173 and `node scripts/browser-production.mjs` with preview 4173. The isolated headed `grant-review` Chrome session uses fictional records; reload/build may reset its current screen. Keep credentials and machine state outside Git.

GitHub access verified for the exact repository with ADMIN permission. Cloudflare Pages target remains `ncpwd-impact-mosaic`; previous `wrangler whoami` found expired OAuth and noninteractive refresh unavailable. If deployment is subsequently requested, run interactive `npx.cmd wrangler login`, verify the account/project, then deploy and verify. No public URL for this revision is verified.

Operational boundaries: shared schema 2 under `mosaic-user-demo-v1`, exact backup/recovery and separate sandbox `mosaic-v1`; canonical root persistence; immutable decisions/submissions/outcomes; retained enrolment courseVersion; all-lessons/quiz≥70/practical/approval completion gate. Administration coordinates; trainers assess. Outcome/grant records are simulated, not executed transactions. Optional identifiable exports are explicit and reset on cohort change or role/screen exit. Unknown/authored values cannot leak into aggregate labels. Preserve these boundaries and the historical website/source caveats.

## Historical implementation checkpoints

Earlier entries below record the evidence and authorization at their dates. Statements that work was uncommitted refer to those earlier checkpoints.

## Individual scorecard extension checkpoint

The user authorized documenting and implementing individual progress, support receipt, grants and follow-up, then added threshold-based staff follow-up. Administration → Learner progress offers an editable 50% default threshold, below / at-or-above / no-enrolments groups and search. Each named User row opens its individual scorecard; User → My scorecard sees the same records and can acknowledge the current support provision or positive grant payment. Geographic samples have no learning evidence and no percentage. Classification uses the unrounded completed/enrolled ratio; displayed percentages use one decimal place. Assessment gates are unchanged.

`scorecardDemo.ts` and `scorecardValidation.ts` own separate append-only support/grant/follow-up updates and User receipts, immutable request/item links, predecessor guards, exact retries and currency/date validation. `LearnerScorecard.tsx` owns the shared view, admin editor and progress list. Optional schema 2 outcomes normalize additively; malformed histories preserve saved bytes behind recovery. No delivery/payment is inferred from plan review. Grants are simulated recorded NGN amounts, with paid no greater than awarded and positive award/payment stages. Monetary validation/totals use integer cents. Default export omits outcome text/references/history; full fictional export is opt-in. Reset clears outcomes and preserves sandbox. Read [scorecard tracking](docs/LEARNER-SCORECARD.md) before editing.

Final preflight passes 75 model tests, TypeScript and production build. Dedicated scorecard browser passes 8 axe audits with zero violations/POST; five affected User/Admin/review/coordination/reporting regressions pass. Independent review is clear after support provenance and currency precision corrections. Desktop/mobile screenshots inspected. Final production CSP smoke passes, including Administrator scorecard/progress and User My scorecard. Vite main bundle is 525.51 kB (157.30 kB gzip), with its size advisory; scorecard remains eager.

Next: wave 5 consolidated Administrator stage closeout. Changes remain local/uncommitted; no publishing or financial integration was requested.

## Wave 4 current checkpoint

The user authorized proceeding after wave 3. [Wave 4](docs/ADMINISTRATOR-WAVE-4.md) adds Reports, Activity history, Demo settings and Learner map locally. The geographic journey is Nigeria → state/FCT → LGA → matching learner list/details. Keyboard regions, selectors, breadcrumbs, readiness/scope/search filters, missing/unmatched locations and list fallback are available. Read [geography semantics/provenance](docs/NIGERIA-GEOGRAPHY.md) before changing location matching or counts.

Map data is a local, attributed GRID3/geoBoundaries asset: 37 state/FCT and 774 LGA paths, represented year 2022, pinned source commit 9469f09, CC BY 4.0. `scripts/build-nigeria-map.py` reproduces the display asset; three unanimous interior-point checks establish each LGA parent. Simplification is for display, not surveying. Runtime rejects invalid/degenerate/open/empty geometry and duplicate keys/names. Paired state/LGA matching and explicit FCT aliases retain unknowns rather than guessing locations.

Reports define all denominators and distinguish User records from explicitly loaded fictional examples. `reportingDemo.ts` owns aggregate metrics, learner rows, cohort loading, export whitelisting and UTC event filters. Optional schema 2 `settings` normalizes additively. Demo settings can explicitly load five fictional geographic profiles, with no learning/reviews, without overwriting User records or duplicating the cohort event. Default exports omit all identifiers, locations, disclosures, attachments, submitted text and detailed history. Fuller fictional session export requires a labelled opt-in and still excludes in-memory file contents. Scoped confirmed reset clears shared samples/history/backup/files while preserving the separate sandbox.

`AdministratorReports.tsx` and `AdministratorGeography.tsx` load on demand with Suspense and a scoped `AdministratorScreenBoundary`; failed modules preserve the role shell/sidebar and saved session with a reload action. The canonical root remains authoritative for all commands and saves. Existing wave 3 retained courseVersion, immutable decisions/submissions/drafts/assignment predecessor chains and trainer-owned assessment are unchanged.

Verification: 67 model tests and TypeScript pass; all ten browser scripts passed (affected Administrator scripts rerun after dev HMR/build refreshes and the reload assertion updated to await its lazy screen). Wave 4 has 14 axe audits with zero violations and zero POST; earlier User/Admin audits remain green. Dedicated browser verifies map keyboard/drill-down/FCT/scope/unmatched/loading/503/malformed200/empty-state fallback, safe/sensitive export, explicit samples, history filters, reload/reset/sandbox preservation and blocked module recovery. Independent focused rechecks have no remaining material findings. Final build/CSP evidence is in docs/validation.md.

Next is wave 4 user review, then wave 5 full Administrator closeout: consolidated cross-role, responsive/accessibility/recovery and documentation verification. Secure staff accounts, nationwide real-user backend, Facilitator interface and live infrastructure remain separately scoped. No commit/publication/deployment is authorized by this wave.

## Wave 1 result (historical baseline)

The eight-course Mosaic Pathways User stage remains intact. Administrator wave 1 adds a shared-session Overview and read-only Learners/detail. Start at **Projects & Possibilities → Open the app demo → User**, create a profile, then choose **Administration**. Only the profile created in User is shown; the user selected no extra fictional cohort for this wave.

Read [wave 1 specification/progress](docs/ADMINISTRATOR-WAVE-1.md), [full Administrator plan](docs/ADMINISTRATOR-DEMO-PLAN.md), [User closeout](docs/USER-STAGE-CLOSEOUT.md) and [practical-skills expansion](docs/PRACTICAL-SKILLS-EXPANSION-PLAN.md).

## Wave 1 implemented scope (historical baseline)

- App-demo shell owns one canonical shared session. User and Administration reflect edits immediately; role switching, profile editing, sign-out/resume and reload preserve recorded progress.
- Overview derives learner/enrolment/completion counts and pending practical/questions/support/teaching totals. A named unfinished profile is marked incomplete. Pending support/trainer links now open wave 2 review queues; other links open read-only learner sections.
- Learners searches display name/state/LGA and filters profile readiness. Detail shows goals, skill areas, learning circumstances, access preferences, course progress/quiz/review state, achievements, portfolio, support submission history and teaching application.
- Optional personal/evidence details remain collapsed by default. No filtering by disability/gender, no administrator assessment approval, no support delivery or automatic facilitator role.
- Stable record metadata/revisions, immutable submission snapshots and append-only local milestone events support later review waves. Unchanged practical resubmission still invalidates approval/completion/portfolio and records another submission.

## Persistence and recovery

`src/AppDemoPage.tsx` owns loading, saving, updates and reset. `src/sharedDemo.ts` stores schema 2 under **mosaic-user-demo-v1**, wrapping the existing schema 1 User payload as `user` with `recordMetadata`, `submissions` and `events`. Existing **mosaic-v1** sandbox state stays independent.

Valid legacy data is backed up exactly under **mosaic-user-demo-v1-backup** before replacement, preserving profile/onboarding/editing, category choices, all eight activities, authored content, attachments metadata, portfolio, support and teaching. Both backup and saved bytes are verified. Repeated loads cannot duplicate migration history. Invalid/future saved data remains untouched behind explicit retry/reset recovery.

Valid storage failures return usable in-memory data and a warning; automatic saves are suspended when migration storage fails. Retry saving uses current edited memory data and verifies backup before overwriting legacy. Unknown original practical submission dates are null, separate from migration time. Times are UTC epochs and Administration displays Africa/Lagos (UTC+01:00).

PDF/JPEG/PNG sample files remain in memory, maximum five files/5 MB each, preserved through role/page navigation; reload requires reselection. Confirmed User reset clears shared records/history/backup and files after verifying primary removal, leaving sandbox intact. Sign-out preserves everything. Closing a tab may clear records; browser session duplication/restoration may copy session storage. This is simulated role selection, not secure account isolation.

## User baseline to preserve

Eight courses across Digital & AI, People & Workplace, Hands-On & Livelihood and Business & Enterprise: Digital Essentials; Spreadsheet and Data Skills; Small-Business Foundations; AI Essentials; People & Workplace Essentials; Sewing and Simple Textile Products; Small-Space Growing and Nursery Basics; Retail and Customer Service Practice. Total: 48 lessons and 39 quiz questions.

Completion requires every lesson, best quiz >=70%, submitted practical work and explicit sample trainer approval. Every resubmission removes approval, feedback, completion and the related portfolio item. Portfolio additions are explicit. Printable records are demo-only/non-accredited. Livelihood courses assess foundation knowledge/written plans, not observed trade competence. AI Essentials uses fictional offline exercises without a live service or paid account. Original three-course translations remain; newer courses are English-first.

Adult onboarding has optional disability/gender/certificates and independent access preferences. Disclosure does not restrict course access or automated ranking. Existing evidence is unverified. Both teaching application routes and submitted support now have wave 2 review queues and User-visible responses. Explicit support/grant outcomes and receipts are recorded separately in the scorecard extension. Foundation completion does not qualify a learner to supervise specialist trade tasks.

## Files

- `src/sharedDemo.ts` and tests: shared envelope, validation/migration, verified backup/rollback, revisions/snapshots/events/reset.
- `src/AppDemoPage.tsx`: canonical ownership, accessible role tabs, storage warnings/recovery, saving retry and scoped reset.
- `src/MosaicUserDemo.tsx`: controlled User view and memory-only file map; `src/userDemo.ts`: existing profile/learning/support/teaching helpers.
- `src/AdministratorDemo.tsx`, `src/administratorMetrics.ts`, `src/administratorDemo.css`: read-only views/counts/search/date display and responsive styling.
- `scripts/browser-administrator.mjs`: migration/cross-role/storage/recovery/accessibility journey. Existing User browser assertions project the shared envelope's `user`.

## Wave 1 verification (historical baseline)

Wave 1 is complete for the agreed local demo scope. Final `npm.cmd run preflight`: 36 tests, TypeScript and Vite build pass. `npm.cmd run test:ui`: all seven Chrome scripts pass. `node scripts/browser-production.mjs`: rebuilt site passes published CSP with User/Administration and existing site/sandbox/PDF/no-JavaScript flows. Nine User and eight Administrator axe audits report zero violations; both journeys record zero POST requests. Desktop overview and enlarged mobile learner details were visually inspected. See [validation history](docs/validation.md) and [wave 1 execution record](docs/ADMINISTRATOR-WAVE-1.md). Review found and corrected optional course-field validation, editable memory-only storage failures, reset backup ordering and sample-feedback milestones. Focused recheck reports no remaining material findings.

## Run

Dependencies are installed. Node 22.12+ (tested 24.15), npm and installed Google Chrome. `npm.cmd run dev` serves localhost:5173. `npm.cmd run preflight` runs model tests, TypeScript and production build. `npm.cmd run test:ui` runs twelve browser scripts, including grant planning and all four Administrator waves. `npm.cmd run preview -- --port 4173 --strictPort` serves the built site for `node scripts/browser-production.mjs`. Check existing preview processes before starting duplicates. Evidence is in ignored `output/playwright/`.

Sandbox shell setup failed with helper_unknown_error; approved scoped require_escalated commands work. Git ownership needs command-local `git -c safe.directory=D:/AyubaGufwanDisabiliyt`; no global trust changes. Repository: batestguy/AyubaDisabilityProg, main. Existing uncommitted User work is preserved.

## Next milestone: Administrator wave 5

Continue from the completed wave 4 and scorecard extension, then complete the full Administrator closeout gate: cross-role journeys, error/storage/recovery, responsive/accessibility checks, defined metrics/map matching, completion threshold groups, outcome provenance/receipt acknowledgement, grant validation, follow-up and safe exports, plus consolidated documentation. The requested geographic view is implemented locally and does not create a nationwide real-user backend. Preserve all existing User, website, sandbox, course/version/review and migration boundaries.

## Website and evidence boundaries

Preserve Home's eight chapters/ten genuine documentary photographs, twelve-event timeline, source caveats/full-frame dialogs; Projects & Possibilities' five proposals; blank About spaces; separate sandbox/support navigator. The opening carousel continues every four seconds through hover/focus/reduced-motion and has no pause control; wave 1 does not change it.

Historical reports do not establish current opportunities or measured outcomes. Preserve agriculture-date caveats, Abia office-operation uncertainty, representative attribution for enforcement/health and unverified NDMIS deployment. Photo provenance does not establish reuse licence/endorsement. Cloudflare/Groq live configuration remains unverified; credentials stay outside the workspace. Earlier website delivery is recorded in [session history](docs/SESSION-HISTORY.md).


## Next-session brief

Read the current checkpoint above, docs/GRANT-PLANNING-REPORT.md and docs/ADMINISTRATOR-WAVE-5.md first. Continue the remaining guided visual acceptance and wave 5 closeout; technical grant/PDF work is complete. Do not restart completed waves or invent demographic data. The user authorized committing/pushing all progress on 10 October; inspect Git status/log/remote to establish the result. Public deployment remains separate with Cloudflare OAuth requiring renewal.

Run `npm.cmd run preflight` before new implementation or a new handoff. Use existing dev5173/preview4173 processes where available; finish build before browser tests to avoid HMR resets. `npm.cmd run test:ui` runs twelve scripts, ending with grant planning. Evidence artifacts are generated locally and ignored. Use command-local `git -c safe.directory=D:/AyubaGufwanDisabiliyt`; do not change global Git trust. Preserve secrets outside the workspace.

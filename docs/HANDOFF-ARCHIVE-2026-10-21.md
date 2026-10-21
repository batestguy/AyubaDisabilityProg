# Archived handoff: Mosaic Pathways and grant-planning reports

Historical evidence only. [Current handoff](../SESSION-HANDOFF.md) takes precedence.



## Current checkpoint — 21 October 2026, connected participant workspace

After the grill-me clarification rounds, user authorized the connected workspace plus teaching-subject selection/additional topics and privacy research. Delivered [connected workspace](CONNECTED-WORKSPACE.md), now the default app-demo entry: permanent sample learners Ada/Sani, facilitators Amaka/Tunde and Administration; new local profiles and public demo access codes; individual dashboards; facilitator scope/topic review; enrolment/lessons/real quiz grading/practical reassignment/review; participant/course chat, unread indicators, Administration conversations and explicit support referrals. All records persist on the same browser/device. Private teaching chat bodies/snippets are absent from Administration's interface/history.

Earlier learner/progress/application/history is preserved/imported from a validated snapshot. Incomplete drafts and archived enrolled content are retained safely. Earlier detailed reports/screens remain accessible via explicit navigation (?workspace=earlier); their later edits are not automatically merged into an already initialized connected store. The main connected registry has operational counts; original grant/PDF reports remain the earlier workspace's reports.

Verification: 101 tests, TypeScript/final build (main611.74kB/179.80gzip, existing advisory), ten new axe audits on dev and full production-CSP flow, existing User/Facilitator and production smoke pass. Independent findings on draft migration and multi-course chat corrected/rechecked; keyboard-scroll audit corrected. Full fifteen-script UI suite not rerun. Desktop/mobile evidence inspected under ignored output/playwright/connected-*.

Visible teaching-review Chrome at localhost4173 is open to the connected landing page with sample sign-ins expanded. Use a sample sign-in or register a learner/facilitator. Generated codes are demonstration values, not real passwords; local role filtering is not secure private messaging. No deploy/commit/push. User visual acceptance remains pending. This checkpoint supersedes older continuation pointers below. Read the connected tracking document for source contracts, limitations and reproducible commands.

## Earlier checkpoint — 21 October 2026, guided teaching demo

User chose all recommendations for a clear Facilitator demonstration and requested setup and opening. Delivered [guided teaching demo](FACILITATOR-GUIDED-DEMO.md): Amaka Obi with fictional learners Ada Okafor and Sani Musa, full change-request/resubmission/reassignment/approval journey, question replies, support referrals and Administration responses. Seven workspace pages plus a next-action walkthrough run under the existing three role tabs. Explicit sample mode uses `mosaic-guided-teaching-v1`; original shared demo and sandbox records are preserved. The original-record Facilitator remains read-only wave 1; actions are available in the labelled guided sample.

Final evidence: 91 model tests, TypeScript/build, eight new axe audits on both dev and production CSP journeys, existing Facilitator regression and production smoke pass. All seven role actions, reload/reset/corrupt recovery, mobile/200% text and unchanged existing saved bytes verified. Desktop/mobile screenshots inspected. Independent review/recheck clear after invalid-date guard correction. Full fourteen-script suite not rerun. Existing bundle advisory remains. See tracking document for source files, commands and limitations.

Visible Chrome session `teaching-review` is open at localhost4173 in the sample Facilitator overview. The sample is at its initial recommendation: review Ada’s first submission. User visual acceptance is pending. Earlier checkpoints below are historical. No commit/push/deployment in this continuation.

## Earlier checkpoint — 21 October 2026

User accepted the current result and authorized closure and continuation: “It seems okay, we can close and proceed to next”. Administrator wave 5 and grant-planning reports are closed by this acceptance plus the recorded technical evidence. No additional manual device or screen-reader testing is inferred. The next stage is [Facilitator wave 1](FACILITATOR-WAVE-1.md): an approved demo identity selects its current course/practical/question assignments and inspects evidence. First wave is read-only; trainer feedback, assessment decisions and replies belong to wave 2. Real accounts, backend, specialist observations and deployment remain separate scope.

Facilitator wave 1 is implemented and ready for review. Verification: 86 model tests, TypeScript/final build, eight new accessibility audits, affected story/general accessibility/User browser journeys and production CSP pass. Assigned practical snapshots remain distinct from resubmissions; browsing preserves saved bytes. Desktop/mobile screenshots inspected. The full thirteen-script suite was not rerun. New code, test commands and wave 2 boundaries are recorded in the Facilitator tracking document. Current changes remain local and uncommitted.

The 10 October Git checkpoint below remains the last recorded push. Current continuation supersedes its pending visual-acceptance instructions.

## Current checkpoint — 10 October 2026

Accumulated implementation and handoffs committed as `639e1bd` and successfully pushed to `batestguy/AyubaDisabilityProg`, branch `main`, on 10 October 2026. Git push advanced remote main from `b28bead` to the implementation checkpoint. This checkpoint supersedes historical continuation pointers below. Deployment is separate and has not been performed for this revision.

Delivered: eight-course User journey; Administrator waves 1–4; learner progress thresholds and individual support/grant/follow-up scorecards; wave 5 completion-corruption and navigation-contrast corrections; demographic/disability/skills grant-planning dashboard and aggregate PDF/CSV plus separately selected detailed CSV. See [report tracking](GRANT-PLANNING-REPORT.md), [wave 5 gates](ADMINISTRATOR-WAVE-5.md), [validation](validation.md) and [session history](SESSION-HISTORY.md).

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

`scorecardDemo.ts` and `scorecardValidation.ts` own separate append-only support/grant/follow-up updates and User receipts, immutable request/item links, predecessor guards, exact retries and currency/date validation. `LearnerScorecard.tsx` owns the shared view, admin editor and progress list. Optional schema 2 outcomes normalize additively; malformed histories preserve saved bytes behind recovery. No delivery/payment is inferred from plan review. Grants are simulated recorded NGN amounts, with paid no greater than awarded and positive award/payment stages. Monetary validation/totals use integer cents. Default export omits outcome text/references/history; full fictional export is opt-in. Reset clears outcomes and preserves sandbox. Read [scorecard tracking](LEARNER-SCORECARD.md) before editing.

Final preflight passes 75 model tests, TypeScript and production build. Dedicated scorecard browser passes 8 axe audits with zero violations/POST; five affected User/Admin/review/coordination/reporting regressions pass. Independent review is clear after support provenance and currency precision corrections. Desktop/mobile screenshots inspected. Final production CSP smoke passes, including Administrator scorecard/progress and User My scorecard. Vite main bundle is 525.51 kB (157.30 kB gzip), with its size advisory; scorecard remains eager.

Next: wave 5 consolidated Administrator stage closeout. Changes remain local/uncommitted; no publishing or financial integration was requested.

## Wave 4 current checkpoint

The user authorized proceeding after wave 3. [Wave 4](ADMINISTRATOR-WAVE-4.md) adds Reports, Activity history, Demo settings and Learner map locally. The geographic journey is Nigeria → state/FCT → LGA → matching learner list/details. Keyboard regions, selectors, breadcrumbs, readiness/scope/search filters, missing/unmatched locations and list fallback are available. Read [geography semantics/provenance](NIGERIA-GEOGRAPHY.md) before changing location matching or counts.

Map data is a local, attributed GRID3/geoBoundaries asset: 37 state/FCT and 774 LGA paths, represented year 2022, pinned source commit 9469f09, CC BY 4.0. `scripts/build-nigeria-map.py` reproduces the display asset; three unanimous interior-point checks establish each LGA parent. Simplification is for display, not surveying. Runtime rejects invalid/degenerate/open/empty geometry and duplicate keys/names. Paired state/LGA matching and explicit FCT aliases retain unknowns rather than guessing locations.

Reports define all denominators and distinguish User records from explicitly loaded fictional examples. `reportingDemo.ts` owns aggregate metrics, learner rows, cohort loading, export whitelisting and UTC event filters. Optional schema 2 `settings` normalizes additively. Demo settings can explicitly load five fictional geographic profiles, with no learning/reviews, without overwriting User records or duplicating the cohort event. Default exports omit all identifiers, locations, disclosures, attachments, submitted text and detailed history. Fuller fictional session export requires a labelled opt-in and still excludes in-memory file contents. Scoped confirmed reset clears shared samples/history/backup/files while preserving the separate sandbox.

`AdministratorReports.tsx` and `AdministratorGeography.tsx` load on demand with Suspense and a scoped `AdministratorScreenBoundary`; failed modules preserve the role shell/sidebar and saved session with a reload action. The canonical root remains authoritative for all commands and saves. Existing wave 3 retained courseVersion, immutable decisions/submissions/drafts/assignment predecessor chains and trainer-owned assessment are unchanged.

Verification: 67 model tests and TypeScript pass; all ten browser scripts passed (affected Administrator scripts rerun after dev HMR/build refreshes and the reload assertion updated to await its lazy screen). Wave 4 has 14 axe audits with zero violations and zero POST; earlier User/Admin audits remain green. Dedicated browser verifies map keyboard/drill-down/FCT/scope/unmatched/loading/503/malformed200/empty-state fallback, safe/sensitive export, explicit samples, history filters, reload/reset/sandbox preservation and blocked module recovery. Independent focused rechecks have no remaining material findings. Final build/CSP evidence is in docs/validation.md.

Next is wave 4 user review, then wave 5 full Administrator closeout: consolidated cross-role, responsive/accessibility/recovery and documentation verification. Secure staff accounts, nationwide real-user backend, Facilitator interface and live infrastructure remain separately scoped. No commit/publication/deployment is authorized by this wave.

## Wave 1 result (historical baseline)

The eight-course Mosaic Pathways User stage remains intact. Administrator wave 1 adds a shared-session Overview and read-only Learners/detail. Start at **Projects & Possibilities → Open the app demo → User**, create a profile, then choose **Administration**. Only the profile created in User is shown; the user selected no extra fictional cohort for this wave.

Read [wave 1 specification/progress](ADMINISTRATOR-WAVE-1.md), [full Administrator plan](ADMINISTRATOR-DEMO-PLAN.md), [User closeout](USER-STAGE-CLOSEOUT.md) and [practical-skills expansion](PRACTICAL-SKILLS-EXPANSION-PLAN.md).

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

Wave 1 is complete for the agreed local demo scope. Final `npm.cmd run preflight`: 36 tests, TypeScript and Vite build pass. `npm.cmd run test:ui`: all seven Chrome scripts pass. `node scripts/browser-production.mjs`: rebuilt site passes published CSP with User/Administration and existing site/sandbox/PDF/no-JavaScript flows. Nine User and eight Administrator axe audits report zero violations; both journeys record zero POST requests. Desktop overview and enlarged mobile learner details were visually inspected. See [validation history](validation.md) and [wave 1 execution record](ADMINISTRATOR-WAVE-1.md). Review found and corrected optional course-field validation, editable memory-only storage failures, reset backup ordering and sample-feedback milestones. Focused recheck reports no remaining material findings.

## Run

Dependencies are installed. Node 22.12+ (tested 24.15), npm and installed Google Chrome. `npm.cmd run dev` serves localhost:5173. `npm.cmd run preflight` runs model tests, TypeScript and production build. `npm.cmd run test:ui` runs twelve browser scripts, including grant planning and all four Administrator waves. `npm.cmd run preview -- --port 4173 --strictPort` serves the built site for `node scripts/browser-production.mjs`. Check existing preview processes before starting duplicates. Evidence is in ignored `output/playwright/`.

Sandbox shell setup failed with helper_unknown_error; approved scoped require_escalated commands work. Git ownership needs command-local `git -c safe.directory=D:/AyubaGufwanDisabiliyt`; no global trust changes. Repository: batestguy/AyubaDisabilityProg, main. Existing uncommitted User work is preserved.

## Next milestone: Administrator wave 5

Continue from the completed wave 4 and scorecard extension, then complete the full Administrator closeout gate: cross-role journeys, error/storage/recovery, responsive/accessibility checks, defined metrics/map matching, completion threshold groups, outcome provenance/receipt acknowledgement, grant validation, follow-up and safe exports, plus consolidated documentation. The requested geographic view is implemented locally and does not create a nationwide real-user backend. Preserve all existing User, website, sandbox, course/version/review and migration boundaries.

## Website and evidence boundaries

Preserve Home's eight chapters/ten genuine documentary photographs, twelve-event timeline, source caveats/full-frame dialogs; Projects & Possibilities' five proposals; blank About spaces; separate sandbox/support navigator. The opening carousel continues every four seconds through hover/focus/reduced-motion and has no pause control; wave 1 does not change it.

Historical reports do not establish current opportunities or measured outcomes. Preserve agriculture-date caveats, Abia office-operation uncertainty, representative attribution for enforcement/health and unverified NDMIS deployment. Photo provenance does not establish reuse licence/endorsement. Cloudflare/Groq live configuration remains unverified; credentials stay outside the workspace. Earlier website delivery is recorded in [session history](SESSION-HISTORY.md).


## Next-session brief

Read the latest connected-workspace checkpoint above and docs/CONNECTED-WORKSPACE.md first; earlier wave instructions below are historical. Administrator wave 5 is accepted and closed. Continue the Facilitator stage without restarting completed waves or inventing demographic data. The last recorded push is `639e1bd`; subsequent work remains local unless separately recorded. Public deployment remains separate with Cloudflare OAuth requiring renewal.

Run `npm.cmd run preflight` before new implementation or a new handoff. Use existing dev5173/preview4173 processes where available; finish build before browser tests to avoid HMR resets. `npm.cmd run test:ui` runs twelve scripts, ending with grant planning. Evidence artifacts are generated locally and ignored. Use command-local `git -c safe.directory=D:/AyubaGufwanDisabiliyt`; do not change global Git trust. Preserve secrets outside the workspace.

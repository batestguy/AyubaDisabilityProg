# Session handoff: connected Mosaic Pathways workspace

## Latest continuation — 28 October 2026

**Documentation only; do not build yet.** The user planned a public approved-facilitator directory, learner preferences subject to Admin assignment, and signed-in noticeboards for all 36 states and FCT. After initially requesting implementation, the user superseded that instruction: “Dont build anyuthing yet, document thorougly for next timew.” No feature code was changed. Await a renewed instruction before implementation.

Read the [complete next-feature specification](docs/FACILITATOR-DIRECTORY-STATE-BOARDS-PLAN.md) first for agreed choices, role/action connections, public-profile consent/review, request lifecycle, home states, board permissions/moderation/unread behavior, backward compatibility, implementation sequence and acceptance checks. These features are **planned, not delivered**. Existing connected UI visual acceptance remains pending; Administrator wave 5 acceptance remains recorded.

Git was clean at local `43c156d` before these documentation edits. No new remote verification, commit, push or deployment was performed. Last runtime checks below are historical 21 October evidence, not fresh tests of these proposed features. This latest instruction takes precedence over the older next-session brief below. Documentation links/diff are the appropriate checks for this prose-only checkpoint; no build or runtime tests are needed.

## Current state — 21 October 2026

The connected participant workspace is implemented, tested and open for user review. Open **Projects & Possibilities → Open the app demo**. Permanent sample learners: **Ada Okafor and Sani Musa**. Permanent sample facilitators: **Amaka Obi and Tunde Bello**. A sample administrator manages the combined registry. **Show sample sign-ins** lists public demonstration codes and fills the form; a separate Sign in action opens that identity's interface. Registration creates additional learner/facilitator profiles with generated demo codes.

User explicitly authorized proper handoffs, commit and push of all accumulated work. Verified repository/account: `batestguy/AyubaDisabilityProg`, branch `main`, account `batestguy`, ADMIN permission. Starting local/remote checkpoint: `518bfc3` (implementation predecessor `639e1bd`). Implementation and consolidated handoffs committed as `b3f028d` and pushed successfully to verified origin/main; remote SHA matches the local implementation commit. A documentation receipt follows this implementation checkpoint; use `git log -1` for the latest receipt commit. Deployment is separate and was not requested.

Administrator wave 5 and earlier grant Reports/PDF were accepted and closed on 21 October. **The connected workspace has not received explicit visual acceptance.** Documentation/push authorization is not visual acceptance.

## Delivered behavior

- Learners register/sign in, enrol in eight courses, read/mark lessons, take graded quizzes, submit/resubmit work, chat with assigned facilitators and share support notes. Study can begin before assignment.
- Facilitators select teaching courses, submit experience/scope for review and propose additional topics. Pending facilitators can contact Administration but cannot assess learners. Existing approved subjects remain active while added claims await review. Topic approval is planning, not automatic course publication.
- Administration sees all registered learners (including those awaiting a course choice), facilitators, teaching/topic queues, enrolments/progress, assignments, operational counts/history and explicitly shared support notes. Assignments require matching approved teaching scope.
- Practical review requires current assignment and exact submission revision; one decision per submission. Resubmission clears approval and needs fresh assignment. Completion remains every retained lesson + best quiz ≥70 + submitted work + approval. Practical approval cannot complete Sani's unfinished lessons/quiz.
- Participant/course chat has unread indicators, explicit read actions, keyboard-accessible scroll history and separate Administration conversations. Administration's interface/history excludes teaching-chat bodies/snippets. Reassignment starts a different participant conversation; original participants keep earlier history but cannot send without a current matching-course assignment.
- Support notes share only explicitly entered text. Administration's response is visible to the learner/referring facilitator; it does not establish delivery, funding or payment.

## Source map and storage

| Area | Files |
|---|---|
| Default connected / earlier route | `src/AppDemoPage.tsx`; earlier navigation uses `?workspace=earlier` |
| Loading/sign-in/reset/recovery | `src/ConnectedWorkspace.tsx` |
| Role interfaces/chat | `src/ConnectedParticipantDemo.tsx`, `src/connectedDemo.css` |
| Types/replay/commands/storage/privacy selectors | `src/connectedDemo.ts` |
| Connected checks | `src/connectedDemo.test.ts`, `scripts/browser-connected.mjs` |
| Preserved earlier schema/source validator | `src/sharedDemo.ts`, `src/userDemo.ts`; validator export only, no changed behavior |
| Earlier detailed Administration/reports | `src/AdministratorDemo.tsx`, report/geography/grant/scorecard modules |
| Earlier guided sample | `src/teachingScenario.ts`, `src/TeachingScenarioWorkspace.tsx`, `src/GuidedTeachingDemo.tsx` |
| Earlier read-only Facilitator | `src/FacilitatorDemo.tsx`, `src/facilitatorAssignments.ts` |

| Storage | Meaning |
|---|---|
| localStorage `mosaic-connected-v1` | Durable registry, retained source/course snapshot, append-only connected events |
| sessionStorage `mosaic-user-demo-v1` / `mosaic-user-demo-v1-backup` | Earlier shared schema 2 and verified migration backup |
| sessionStorage `mosaic-guided-teaching-v1` | Earlier guided sample history |
| sessionStorage `mosaic-v1` | Separate original sandbox |

First use captures a validated earlier profile/progress/application snapshot and preserves full earlier administrative/history data. Incomplete unpublished drafts are retained; enrolled archived versions remain resumable. **Later earlier-workspace edits are not automatically merged into an initialized connected store.** Use connected screens for new participant work. Earlier grant/PDF reports describe the earlier workspace, not the new registry. Reset affects only its explicitly described connected scope and restores permanent samples/imported baseline.

Commands check actor/role, expected global version, assignment and work revision. Exact retries do not duplicate actions. Saves must extend the existing history prefix; malformed/future data is preserved behind recovery. Denied/quota/conflicting storage produces a memory warning. There is no automatic multi-tab synchronization or atomic simultaneous-writer protocol.

## Validation evidence

Fresh documentation-handoff `npm.cmd run preflight`: **101/101 tests**, TypeScript and production build pass. Build: 84 modules; main611.74kB/179.80gzip, existing size advisory. No new runtime dependency.

Connected browser passes ten WCAG A/AA axe audits on dev and the full final-source production-CSP journey. Checks cover registration/sign-in, unenrolled learner visibility, teaching/topic review, actual lessons/quizzes, practical reassignment, chat privacy/read/keyboard scrolling, support handoffs, second-course chat after reassignment, persistent reload, confirmed/cancelled reset, corrupt storage recovery, mobile/200% text, unchanged earlier shared/sandbox bytes and zero POST/page errors.

Earlier User eight-course, Facilitator and production smoke scripts pass on their explicit earlier route. Independent draft-import and multi-course-chat findings were corrected/rechecked clear. A scrollable-chat keyboard finding was fixed and verified. **The full fifteen-script UI suite was not rerun.** Desktop Administration and mobile chat evidence was visually inspected. Ignored artifacts: `output/playwright/connected-*`; earlier PDFs: `output/pdf/`.

## Resume commands

PowerShell, repository root; dependencies installed, Node24.15 tested. Reuse existing servers where available.

```powershell
npm.cmd run preflight
npm.cmd run dev
# After build finishes, dev on 5173:
npm.cmd run test:connected
node scripts/browser-user-demo.mjs
node scripts/browser-facilitator.mjs
```

Production-CSP verification:

```powershell
npm.cmd run preview -- --port 4173 --strictPort
# In another terminal:
$env:CONNECTED_URL = 'http://127.0.0.1:4173/'
$env:CONNECTED_CSP = '1'
node scripts/browser-connected.mjs
Remove-Item Env:CONNECTED_URL, Env:CONNECTED_CSP -ErrorAction SilentlyContinue
node scripts/browser-production.mjs
```

`npm.cmd run test:ui` runs fifteen scripts, ending with guided teaching and connected workspace. Earlier scripts select `?workspace=earlier`. Finish builds before dev-browser tests: index regeneration triggers Vite reloads and screen resets. Use command-local `git -c safe.directory=D:/AyubaGufwanDisabiliyt`, never global Git trust changes. The earlier shell setup failure ceased after execution permissions changed; no ACL repair was performed.

## Next-session brief

1. Read this handoff, [connected scope/design/evidence](docs/CONNECTED-WORKSPACE.md), then [validation](docs/validation.md). Historical wave instructions do not override this checkpoint.
2. Inspect Git status/log and existing servers before editing. Visible Playwright Chrome session was `teaching-review`, preview4173, connected landing with sample sign-ins expanded. Reopen if needed; that browser session is not a durable prerequisite.
3. Next milestone: **user visual review** of sample identity switching; new registration/course study; facilitator subjects/topics; Administration approval/assignment; revised-work reassignment; teaching/Admin chat and support; mobile/enlarged text. Address concrete feedback. Do not restart completed stages or silently reset browser records.
4. Backend/real accounts, secure messaging, cross-device service, multi-tab concurrency, new published curriculum and deployment remain separately scoped. Do not start them merely because demo sign-in exists.

## Boundaries and history

Public demo codes are **not real passwords or secure authentication**. Participant-filtered local views are **not encrypted or production-confidential messaging**; browser/device owners can inspect storage. Use sample information. Research links are in the connected scope document. Secrets stay outside the workspace.

No deployment/public URL was verified for this revision. Cloudflare target: `ncpwd-impact-mosaic`; last OAuth check (10 October) was expired. Re-verify only for separately requested deployment. GitHub push is not deployment.

Preserve Home's eight chapters/ten documentary photographs, twelve-event timeline/caveats; five Projects proposals; blank About spaces; separate sandbox/support navigator. Historical programme reports are not current opportunities or measured outcomes. Preserve representative attribution, date uncertainties, photo provenance/endorsement limits and unverified NDMIS/live AI claims. See [session history](docs/SESSION-HISTORY.md) and [archived handoff](docs/HANDOFF-ARCHIVE-2026-10-21.md) for dated evidence.


## Verified Git delivery

Implementation and consolidated handoffs: `b3f028d` (`b3f028df16060da7ef96a9452c5fabb309196a99`). Successful push advanced origin/main from `518bfc3` to this commit. `git ls-remote origin refs/heads/main` returned the identical full SHA. Staging contained 46 intended source/document/test files; no generated/private paths or credential-pattern findings. Local Markdown links pass; 153 source/document/asset hashes refreshed from canonical Git index blobs, excluding the inventory itself.

This receipt and its updated source inventory are a follow-up documentation checkpoint. They do not change runtime behavior or require repeating already passing browser journeys. No deployment was performed. Current next milestone remains user visual review of the connected workspace.

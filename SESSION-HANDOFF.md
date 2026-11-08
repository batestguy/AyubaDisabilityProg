# Session handoff: connected Mosaic Pathways workspace

## Current checkpoint: Plateau proposal, unity logo and future presentation — 8 November 2026

**Latest instruction: document and commit for next time.** The user called the Research & Data Collection page bland and wants a captivating **20–25-slide presentation in the style of Quarto**, with pictures of individuals, original artwork, animations and mathematical explanations of what the team hopes to do. Asked whether to implement now or document/commit, the user chose **“Document and commit for next time.”** No slide redesign was built in this checkpoint. Start next session with [the presentation brief and suggested 24-slide story](docs/RESEARCH-PRESENTATION-BRIEF.md).

The independent Plateau proposal is now implemented on Home, Research and About. The team is Jerry Bannister Zachary and Strong, two statisticians with a working prototype; community access, facilitators, funding, secure infrastructure and accommodations remain to be secured. Exact pilot communities, eligibility, numbers and courses are undecided. First-meeting decisions: a technical counterpart, potential community introductions and agreed scoping requirements. The approximately 20-week sequence is readiness-gated; completion reviews require the relevant course cycle, and registration/national expansion remain open-ended. Recruitment adaptation is distinct from formal adaptive cluster sampling; national representativeness is not claimed. Research recruitment is not open.

`src/PilotProposal.tsx` supplies shared proposal wording, proposed measures, review dates and brief components. `scripts/generate-static-story.mjs` generates the no-JavaScript story and `public/downloads/plateau-pilot-discussion-brief.html`; rebuild after shared-content edits. The brief prints as two discussion pages plus a source page. Home links to Research, the brief and Learning Sandbox. Public `?page=research`, `?page=explore` and `?page=about` links work alongside existing demo query behavior. Existing eight-stage sampling table and six-part framework remain expanded, with animations and keyboard scrolling preserved. See [proposal implementation record](docs/RESEARCH-SAMPLING-FRAMEWORK.md).

The header now uses `public/impact-mosaic-unity-nigeria.png` at 56 × 56 CSS pixels: **six African people united as a family, including one person with albinism, a wheelchair user, glasses/white cane, walking stick and hijab, with Nigeria’s vertical green-white-green flag behind them**. Generated with the built-in image editor, transparent outside the emblem. Earlier five-person asset is retained. See [logo provenance and final prompt](docs/UNITY-LOGO.md). No new slide artwork was generated.

Validation of the implemented pages: 120 model tests, TypeScript/build; `browser-story` documentary checks; `browser-learning-navigation` with six clean accessibility audits, role sign-ins and unchanged demo storage; `browser-pilot` with five clean audits, live/no-JavaScript links, phone/200% text, two keyboard-scrollable tables, reduced motion and print PDF; zero page errors/POST. The later logo revision passed typed production build and focused desktop/phone image-loading/reflow checks. Fresh commit-checkpoint `npm.cmd run preflight` passed all 120 tests, TypeScript and production build; local Markdown links across six handoff/proposal/logo documents resolve. Current code retains a non-failing Vite bundle-size advisory. See [validation history](docs/validation.md); ignored visual evidence remains in `output/playwright/`.

Current instruction authorizes a **local commit of the accumulated proposal/logo work and handoff**. It does not request pushing or deployment. Preserve all existing demo records and earlier history. The old sparse-research-only/defer-content entries below are historical and are superseded by the delivered Plateau proposal and this new presentation direction. Explicit acceptance of the complete learning sandbox remains unrecorded; documentation approval is not acceptance or approval for fieldwork.

Next session: read the presentation brief, then develop the 20–25-slide visual treatment when the user resumes that work. Do not present the suggested 24-slide outline as already implemented. Keep the current pages and handout usable during that work.

## Three-room skills artwork — 8 November 2026, latest direction

User requested a cane visible above the table with practical alignment and hands-on skills being taught, then clarified “Several rooms within the artwork” rather than interactive app rooms. Installed `public/photos/sandbox-skills-rooms-v1.webp` (1774 × 887, 453,098 bytes), generated with the built-in image editor: digital/spreadsheet learning, sewing/embroidery and low-voltage electronics in three connected cutaway rooms. Cane stands beside the left desk, grip above the edge and lower section at floor level. Retained cool palette and Nigerian textile motifs. Both entry screens and static equivalents use this asset; alt text and focused browser selectors now describe the three rooms. No new app room, course or storage behavior implemented. Earlier round-table assets retained. Prompt/provenance in [artwork record](docs/SANDBOX-ARTWORK.md).

Focused browser checks pass: five accessibility audits, six role sign-ins, responsive loading on desktop/mobile/200%, sign-in hide/sign-out restore, unchanged storage, static parity and zero page errors/POST. Desktop/mobile screenshots visually inspected. No full preflight rerun for this asset/alt-text revision; previous full preflight remains below. User visual acceptance pending. No commit, push or deployment.

## Cane alignment correction — 8 November 2026

User liked the cooler artwork, requested teaching-prop suggestions and correction of the cane/table alignment. Installed `public/photos/sandbox-round-table-v3.webp` (1774 × 887, 382,534 bytes), using the built-in image editor. Cane no longer crosses the tabletop or foreground arm; it is occluded behind the table and rests beside the chair with the tip on the floor. Both React entry screens and generated static sections reference v3. Existing teaching props otherwise preserved; suggestions remain unimplemented. Full prompt/provenance in [artwork record](docs/SANDBOX-ARTWORK.md). Focused learning-navigation browser checks pass again: five accessibility audits, six role sign-ins, responsive image loading, sign-in hide/sign-out restore, unchanged storage, static parity and zero errors/POST. Generated image visually inspected. Full preflight was not repeated for this image-only correction. Acceptance remains pending; no commit/push/deployment.

## Artwork revision — 8 November 2026

User requested less generic artwork and rejected the orange background. Replaced displayed references with `public/photos/sandbox-round-table-v2.webp` (1774 × 887, 536,250 bytes): indigo/forest-green studio, chalk-white walls, adire panel, louvred windows, grey terrazzo and shared practical/tactile learning materials. Generated with the built-in image editor using the earlier artwork as reference; original retained. Full revision prompt is in [artwork record](docs/SANDBOX-ARTWORK.md). Both React entry screens and generated no-JavaScript sections use the versioned asset to avoid the previous browser-cache URL. Focused learning-navigation checks pass again: five clean accessibility audits, six role sign-ins, image loading/aspect ratio, desktop/mobile/200%, sign-in hide/sign-out restore, unchanged storage, static parity and zero errors/POST. Revised desktop screenshot visually inspected. No functional code changes or full preflight rerun for this image/reference revision; prior implementation preflight below remains the last full run. User visual acceptance remains pending.

## Learning Sandbox artwork — 8 November 2026

User authorized implementation of the agreed warm painted round-table artwork on both sandbox entry screens. Added the shared `SandboxArtwork` component and `public/photos/sandbox-round-table.webp` (1774 × 887, 501,866 bytes), generated with the built-in image tool. The landing page and connected sign-in show the complete image above the title; signing in hides it and signing out restores it. Earlier demo screens remain separate. Static no-JavaScript sandbox sections include the same image and descriptive alt text. No dependencies or storage schema changed; no existing browser records were cleared.

Validation: `npm.cmd run preflight` passes 118/118 tests, TypeScript and production build (existing bundle-size advisory). `node scripts/browser-learning-navigation.mjs` passes five clean accessibility audits, six keyboard role selections/sign-ins, loaded uncropped artwork on desktop/mobile/200%, hide/restore after every role, unchanged connected storage, static image parity and zero page errors/POST. Desktop and mobile-200% screenshots visually inspected; evidence in ignored `output/playwright/sandbox-artwork-*.png` and `learning-navigation-results.json`. Prompt and asset provenance: [artwork record](docs/SANDBOX-ARTWORK.md).

Preview server: `http://127.0.0.1:5173/?demo=connected` while running. Next remains user review of the Learning Sandbox, including the new artwork; explicit acceptance is pending. No commit, push or deployment in this continuation. Terminal sandbox setup still fails before process start; approved command fallbacks completed checks without ACL or Git configuration changes.

## Saved-session delivery instruction — 7 November 2026

The user requested: **“commit and push, we will review sandbox and continue next time.”** Commit/push of the accumulated local work is authorized. Stop feature development at this checkpoint. Next session starts with user review of the Learning Sandbox; explicit acceptance remains pending. Continue detailed research work only after the review and a renewed instruction. The separately authorized Research & Data Collection page currently contains only the sparse planning outline.

Resume at `http://127.0.0.1:5173/?demo=connected` after starting `npm.cmd run dev` if needed. Choose a role, confirm that the page drops to its sample sign-in form, then select Sign in. Review all three interfaces and the checklist in [the research brief](docs/RESEARCH-DATA-COLLECTION-NEXT-PHASE.md#sandbox-verification-and-acceptance-gate). Do not automatically clear browser records or treat this delivery instruction as acceptance. Browser/server processes may need reopening next time.

Delivery preparation verified GitHub account `batestguy`, ADMIN permission on `batestguy/AyubaDisabilityProg`, local branch `main` and matching local/remote predecessor `b737bb9`. The 49 changed/new source, document and static files contain no detected credential patterns or private/generated-output paths; local Markdown targets resolve. Ignored browser profiles/screenshots, caches and private source files remain outside the commit. Latest preflight and focused browser evidence are recorded below; no code changed after those passed. Use `git log -1` and the remote branch SHA for the final delivery commit. No deployment requested.

## Sandbox navigation review fixes — 7 November 2026, latest instruction

User review requested role buttons to drop to the sign-in form, a correctly named Learning Sandbox page, and a separate Research & Data Collection tab with the sampling material removed from the sandbox. This explicitly authorizes the page split now, superseding the earlier prohibition on creating that page **for this structural scope only**. It is not acceptance of the full sandbox or authorization for detailed research methods, recruitment or fieldwork.

Implemented navigation order: **Home → Learning Sandbox → Research & Data Collection → About**. Learning Sandbox replaces Projects & Possibilities, retains the connected-app entry, and labels the app itself. Its tab stays current inside the app. The sparse framework is now on the separate research page; no sampling content remains on the learning landing/app. Research has no collection form. Role buttons fill the selected person's demo credentials and explicitly focus/scroll to the sign-in heading without automatically signing in. Facilitator selects `amaka`, Administration selects `admin`. Existing browser records were not reset.

Validation: `npm.cmd run preflight` passes **118/118 tests**, TypeScript and build (89 modules, existing bundle-size advisory). `node scripts/browser-learning-navigation.mjs` passes five clean accessibility audits, six keyboard role selections/sign-ins, desktop/mobile 200% scroll/reflow, unchanged connected storage, no-JavaScript page parity and zero page errors/POST. Screenshot of Facilitator sign-in visually inspected. Existing browser selectors were updated for the new labels; the full UI suite was not rerun. Artifacts: ignored `output/playwright/learning-navigation-results.json`, `facilitator-signin-desktop.png`, `facilitator-signin-mobile.png`, `research-page-desktop.png`. No commit, push or deployment. User acceptance remains pending; resume review of the updated sandbox.

## Research documentation checkpoint — 7 November 2026, latest instruction

The user requested implementation of the documentation-only research checkpoint. Read [Research & Data Collection: next-phase brief](docs/RESEARCH-DATA-COLLECTION-NEXT-PHASE.md) as the authoritative record of agreed direction, source attribution, evidence register, proposed Nigerian study, mathematics/presentation requirements and sandbox review checklist. It supersedes earlier suggestions to populate the sampling framework after interface setup alone. Execution mode permits saving these documents; the earlier plan-mode saving restriction is historical.

**Sandbox user verification and explicit acceptance remain pending.** The recorded 118 passing tests and browser audits below are historical evidence, not fresh checks or user acceptance. Sequence: verify and accept the sandbox → explicitly open research-page/presentation development → separately design, fund and approve a field protocol. Research-page implementation must not start automatically. Keep Learner, Facilitator and Administration interfaces and preserve the mostly blank Projects placeholder until that phase is opened.

The future direction is a registry plus pilot survey spanning all 36 states and FCT, prioritising feasibility, accessibility, recruitment quality and pooled findings without promising precise state estimates. The independent probability survey, facilitator register and optional Bayesian work remain proposals requiring protocol development. No collection or inference is implemented. Record actual review issues, fixes, evidence and the user's exact acceptance/date/version in the brief's gate log before closing it.

Documentation scope: new brief, this handoff, the skeleton cross-reference and documentation index. Preserve all existing local code changes, earlier documentation history and browser records. Check prose, local links, source attribution and mathematics only. Do not run build/preflight here: it regenerates tracked artifacts. No application/database changes, recruitment, deployment, commit or push are authorized by this checkpoint.

Checkpoint checks: all local Markdown file targets across the four checkpoint documents exist; hypothetical calculations independently recompute to 75% and 58.3%; required table/gate markers and targeted Git whitespace checks pass. Source attribution, dates, quotation lengths and mathematical qualifications reviewed. No runtime checks rerun and no user acceptance recorded. Sandbox process setup failed; approved read/check fallback succeeded without permission/configuration changes.

## Projects page simplification — 7 November latest continuation

User requested removal of the five proposals, older tool/download banner and promotional footer from Projects & Possibilities, replaced by a mostly blank Bayesian snowball sampling framework for future facilitator/student database work. Implemented sparse heading, two blank spaces and a collapsed six-stage outline. Detailed method notes and source links are in [the research skeleton](docs/BAYESIAN-SNOWBALL-FRAMEWORK.md); population definitions, referral protocol, priors and analysis remain undecided and no collection/inference is implemented.

Connected app entry remains above the framework. Original learning sandbox/support navigator links moved to **Earlier demos → Original sandbox tools**. Only the Projects page's footer is suppressed; other pages retain attribution. Generated no-JavaScript Projects section matches the new outline. A mobile200% long-word overflow was corrected locally.

Current checks:118 model tests and production build pass (88 modules, main656.15kB/193.59gzip, existing advisory). Targeted production-CSP page check passes three clean audits, desktop/mobile/200%, expanded/collapsed outline, removed content/footer, three-role app entry, archived sandbox access and no-JavaScript parity, zero page errors/POST. Screenshots: ignored output/playwright/sampling-desktop.png and sampling-mobile.png. Existing production-CSP smoke also passes, including the archived sandbox, PDF and mobile static story. No dataset, recruitment, commit, push or deployment. Next: finish interface setup; populate sampling framework later with the programme team.

## Fresh-demo continuation — 7 November 2026

User requested clearer wording, clearing demo activity and a visible fresh demonstration. Implemented explicit three-role entry cards, labelled archive navigation and a scoped fresh-start control. `?demo=connected` opens directly without side effects. `cleanStart: true` is optional/additive schema-1 state: permanent identities/courses remain, all learner activity begins empty. Existing baselines replay unchanged; ordinary saves cannot switch baseline modes. Full reset clears only the named Mosaic local/session stores, verifies writes and attempts exact rollback; other tabs/profiles are separate.

Current model checks: **118/118 pass**, TypeScript and production build pass (88 modules, main659.14 kB/194.42gzip; existing size advisory). New `node scripts/browser-fresh-demo.mjs` production-CSP check passes **five clean audits**, zero errors/POST, all role entries, cancellation, archive/back navigation, mobile200% text and empty reload. Independent reset review clear. Visible Chrome fresh preview opened at `http://127.0.0.1:4173/?demo=connected`; final screen has zero activity and all three role choices. Screenshot: ignored `output/playwright/fresh-demo-ready.png`. Existing connected production regression also passes ten clean audits, zero POST, with learning/chat/recovery/reset and earlier-source preservation intact. See the latest validation receipt.

Reset affects the displayed preview's browser profile/origin and current tab. If the user continues in a different browser/tab, use its Demo controls to clear that session too. No reset is automatically triggered by visiting a URL. No commit, push or deployment.

## Latest continuation — 7 November 2026

The user explicitly authorized implementation of the agreed funding-demonstration plan, superseding the 28 October build deferral. Directory, facilitator preferences/Admin decisions, all 37 noticeboards, role home/action queues, home-state settings, public-profile consent/review and the funding guide are now implemented locally. Read [the implementation guide](docs/FUNDING-DEMO.md) and [presenter walkthrough](public/downloads/walkthrough.md).

Preflight passes **113/113 tests**, TypeScript and production build (86 modules, main 654.90 kB / 193.17 kB gzip; existing size advisory). Independent read-only review found a hidden-parent moderation-view omission; fixed and rechecked clear. The existing connected dev journey passes ten axe audits and its learning/chat/support/reset/recovery/preservation checks. Final production-CSP community journey passes 11 clean accessibility audits; existing connected production journey passes 10. Both have zero page errors/POST, and the earlier-route production smoke passes. Desktop Administration/mobile board evidence was visually inspected. See [validation receipt](docs/validation.md) for actual commands and coverage. The full sixteen-script UI suite was not rerun.

Source additions: `src/connectedCommunity.ts`, `src/ConnectedCommunityPanels.tsx`, `src/connectedCommunity.test.ts`, `scripts/browser-community.mjs`. `npm.cmd run test:community` runs the new funding journey; the full UI command includes it. Current existing browser script was adapted for required registration state and redesigned role home.

Preserve schema 1, same-browser storage and existing learning/revision/privacy rules. Boards start empty; existing locations remain unknown until chosen. No new dependency, backend, curriculum design, real account, deployment, commit or push. Code changes are local and user visual acceptance remains pending. Next: user review of the connected funding presentation. Do not resume the older deferral below as a current instruction.


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

## Website page cleanup — 8 November 2026

- Learning Sandbox now leads both entry screens, above the diagram, with a short introduction and one primary action.
- Removed the duplicate entry card and repeated signed-out promotional heading. Sign-in, registration, facilitator search and the expandable guide remain.
- Moved the existing collapsible demo controls below the workspace. Reset scope, confirmation and record logic are unchanged.
- Replaced empty Research and About placeholders with concise content; kept research planning details expandable and the no-recruitment status visible.
- Shared page-header styles and a consistent footer now apply across the public pages. Home documentary records and sources are preserved.
- Static About and Research pages are generated from their React components. Static learning headings also precede the artwork.
- Validation: repository preflight passed (118 tests and production build); learning/navigation passed six axe audits, all role sign-ins, mobile/200% text, static parity and preserved storage; fresh-demo browser checks passed five axe audits and scoped reset/cancel behavior.
- Wider story verification passed: documentary chapters/photos, galleries, keyboard/focus behavior, timeline, static fallback, earlier role tabs and concise About content remain intact.
- Fixed tablet header wrapping so enlarged text does not push the language selector beyond the screen edge; verified at five viewport widths.

## Role-first sign-in — 8 November 2026

The top sign-in link now focuses “How would you like to sign in?” with Learner, Facilitator and Administration options. Selecting a role keeps the existing sample-credential selection and focuses the sign-in form; it does not authenticate automatically. A link returns to role selection. Facilitator-choice sign-in also leads to the role question. Authentication and record logic are unchanged.

Validation: preflight passed (118 tests and build); production browser checks passed six accessibility audits, keyboard choices and sign-ins for all roles, phone/200% text, static parity and unchanged saved records. Screenshots: output/playwright/signin-role-choice-desktop.png and signin-role-choice-mobile.png.

## Conditional role panels — 8 November 2026

The signed-out sign-in area initially contains only the three role cards. A selected role reveals its sign-in panel and filters sample/imported sign-ins to that role. Learner and Facilitator show matching registration options; Administration has no registration card. Changing role hides the panel and clears the previous input. Cross-role credentials prompt a role change before authentication.

Removed the signed-out funding guide, facilitator directory and archive link. The directory remains in the signed-in Learner workspace. The app-demo page has no generic footer or fresh-demo controls; advanced reset controls remain available on the earlier-demo route. The signed-in archive link is Administration-only. No authentication model, command permissions or stored-record format changed.

Preflight passed: 118 tests and production build. Learner directory/community checks passed 11 accessibility audits; advanced reset/archive checks passed five audits. Broader sign-in checks cover hidden panels, role-specific registration, switching roles, cross-role input, keyboard/mobile/200% text and preserved records. Fixed the sidebar colour transition and primary-link hover contrast discovered by the broader audits.

## Current Administration map — 8 November 2026

User authorized bringing the map into the current workspace, then committing and pushing the accumulated site changes. Destination verified: batestguy/AyubaDisabilityProg, main; GitHub authentication available; origin/main initially matches HEAD.

- Added Administration → Learner map, loaded on demand and driven only by current connected learner records.
- New registrations and later home-state edits update state counts; scope and missing-location filters keep sample/registered records distinct.
- LGA boundary drill-down is reference-only because current registrations do not collect LGA. No participant locations or counts are invented.
- Map record links focus the correct unenrolled profile or enrolled work card. Learner and Facilitator interfaces do not expose the map.
- Existing atlas validation, state aliases, viewboxes and attribution are reused. No new production dependency, schema migration or record reset.
- Final preflight: 120 tests, TypeScript and build pass. Production browser checks: map seven, connected workflow ten, community eleven clean accessibility audits; zero page errors/POST. Includes mobile/200% text, new registrations, state changes/reload, scopes, keyboard/LGA boundaries, record links and loading/malformed/offline recovery.
- Documentation: docs/CONNECTED-LEARNER-MAP.md. Browser evidence: output/playwright/connected-map-* (ignored).
- Navigation URL and illustration/curriculum alignment suggestions from the final review remain separate follow-up items. No deployment is part of this delivery.

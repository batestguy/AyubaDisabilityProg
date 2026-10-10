# Impact Mosaic

Current checkpoint (10 October 2026): User, Administrator waves 1–4, learner scorecards and grant-planning reports are implemented and verified. The five-section PDF includes Nigeria state mapping, state/LGA tables, KPI/evidence summaries, demographic/skills/support charts and a learning diagram. Guided visual steps 1–4 are accepted; latest Reports/PDF acceptance and remaining wave 5 visual checks are pending. User authorized documentation, commit and push; no deployment performed for this revision. Read [the handoff](SESSION-HANDOFF.md) for current evidence and next steps. Historical checkpoints below retain their dated scope.

Independent React/TypeScript/Vite showcase and fictional learning sandbox by Jerry Bannister Zachary. No NCPWD endorsement is assumed.

Start with [SESSION-HANDOFF.md](SESSION-HANDOFF.md). The **Mosaic Pathways User stage is closed out**, with eight courses across four skill areas. Open Projects & Possibilities → Open the app demo → User. The [user-demo specification](docs/USER-DEMO-PLAN.md) covers onboarding, eight courses, portfolio, support and reviewed teaching applications. The [Administrator wave 1](docs/ADMINISTRATOR-WAVE-1.md) adds a shared-session Overview and read-only Learners. Open Administration to inspect the profile created in User. The [completed wave 2](docs/ADMINISTRATOR-WAVE-2.md) adds application/support decisions and User responses. The [completed wave 3](docs/ADMINISTRATOR-WAVE-3.md) adds trainer roster, course drafts/publication/archive, retained course versions and learning assignments. The [completed wave 4](docs/ADMINISTRATOR-WAVE-4.md) adds reports, activity history, safe exports, explicit fictional examples and Nigeria state/LGA learner drill-down. Next is wave 5 full-stage closeout in the [full Administrator plan](docs/ADMINISTRATOR-DEMO-PLAN.md); Facilitator screens remain deferred. Repository: [batestguy/AyubaDisabilityProg](https://github.com/batestguy/AyubaDisabilityProg). See the [appearance guide](docs/APPEARANCE-GUIDE.md), [architecture reference](docs/ARCHITECTURE.md) and [documentation index](docs/README.md).

## Run

Use Node 22.12+ (tested Node 24.15) and npm:

```powershell
npm.cmd ci --no-audit --no-fund
npm.cmd run dev
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

Open http://127.0.0.1:5173. Vite serves the interface only: /api/assist needs Cloudflare Pages Functions. Missing AI still leaves courses, catalogue guidance and simulated expert workflows available.

## Deliverables

- Documentary homepage: src/HomePage.tsx; reusable slideshow, scroll scenes and photograph dialogs: src/PhotoCarousel.tsx, src/ProgrammeScenes.tsx, src/PhotoGallery.tsx
- Achievement, timeline and photograph records: src/showcase.ts
- Three-role session sandbox: src/App.tsx
- Administrator overview and learner details: src/AdministratorDemo.tsx; shared schema, migration and submission history: src/sharedDemo.ts
- Reports/settings/geography: src/reportingDemo.ts, src/AdministratorReports.tsx, src/geographyDemo.ts, src/AdministratorGeography.tsx; local map provenance in docs/NIGERIA-GEOGRAPHY.md
- Course/learning coordination: src/AdministratorCoordination.tsx, src/coordinationDemo.ts and src/coordinationValidation.ts; courseVersion retains enrolled content
- Mosaic Pathways user demo: src/MosaicUserDemo.tsx, src/userDemo.ts and src/userDemo.css; sessionStorage key `mosaic-user-demo-v1` is separate from the sandbox
- Eight courses, 48 lessons and 39 assessment questions: src/catalogue.ts and src/skillCourses.ts; area selection: src/skillCategories.ts
- Experimental English/Hausa/Yoruba/Igbo journeys for the original three courses: src/i18n.ts and src/courseLanguages.ts; AI Essentials remains English
- Reviewed historical programme sources and five AI pilot cards: src/evidence.ts
- Bounded server-only Groq endpoint: functions/api/assist.ts
- Persistent shared free-budget limiter: worker/limiter.ts
- Downloads: public/downloads/introduction.pdf, partnership-proposal.pdf, walkthrough.md
- PDF generation: python scripts/create-documents.py (reportlab and pymupdf; rebuilds the one-page introduction only)

## Records and boundaries

Mosaic Pathways uses simulated adult profiles without passwords or external registration. User and Administration share schema 2 under `mosaic-user-demo-v1`; migration retains the exact legacy source under `mosaic-user-demo-v1-backup`. Invalid data stays untouched behind explicit recovery controls. Storage failures retain an editable in-memory session with a save-retry action. Learner detail stays read-only; application/support queues record simulated decisions; sign-out preserves its records and confirmed User reset clears shared history/backup while preserving the separate sandbox. Optional disability, gender and certificates do not gate access. Sign out preserves tab progress; Resume demo continues it; Reset demo clears only this user demo. PDF/JPEG/PNG sample attachments (five files, 5 MB each) stay in memory; descriptions and metadata survive reload, with reselection needed to view contents. Explicit Demo controls simulate trainer feedback, approval and replies. Support and trainer reviews record reasons, reviewer/time, immutable evidence and requested responses. Trainer approval requires all four criteria and adds a demo roster entry only; support Plan reviewed records no delivered resources. No user-demo data is posted to a server.

Learners, courses, enrolments, discussion/mentoring/messages, assignment feedback and completion records share one state. sessionStorage isolates normal independent tabs and browser contexts. Closing the tab ends the sandbox. Reload preserves it; Reset restores seeds. Browser duplication/restoration can copy session storage; this is a demonstration, not secure account isolation. All perspectives deliberately see the same fictional records. There are no real accounts, database, video conference, delivered messages or NDMIS link.

Course completion requires every lesson, best quiz score >=70%, a submitted assignment and expert approval. Resubmissions require fresh review. Canonical skills update on completion. AI receives only allowlisted interests, skills, location and support preferences. Free text must remain fictional and non-identifying. It validates source IDs, not the factual entailment of every model sentence; human review remains necessary. AI never calls tools or sends messages.

Translation is experimental pending fluent-speaker review. Read-aloud uses an installed matching device voice; it reports when no voice exists. The homepage has eight sourced programme chapters and ten locally optimised, source-matched documentary photographs published by FMINO and The Qualitative Magazine. Desktop scroll scenes crossfade over 500ms, with 24px maximum parallax. Ten photographs appear within the chapters; there is no separate gallery section. Tablet/mobile use ordinary stacked chapters. App and OS reduced-motion preferences disable decorative chapter motion. The opening slideshow cycles every four seconds and currently continues through hover, focus, manual selection and reduced-motion settings; it has no pause control. Full frames preserve participants and mobility aids. Source URLs, captions and credits are in src/showcase.ts, separate from the AI request context. The Abia frame depicts the partner engagement; it does not show Gufwan.

The build generates a complete static no-JavaScript story in index.html from the presentation records, plus a documentary photo manifest at docs/documentary-photo-manifest.json. Photograph dialogs support Escape, focus trapping and focus restoration. Photograph acquisition can be reproduced with `python scripts/collect-documentary.py` (requests and Pillow); all accepted photographs have been visually inspected.

See docs/deployment.md and docs/validation.md for deployment and evidence.

## Browser validation

Start `npm.cmd run dev` in another terminal, then run `npm.cmd run test:ui`. Tests use an installed Google Chrome through Playwright, without downloading a browser. Screenshots and accessibility results are written under output/playwright. `npm.cmd run preflight` runs the smallest release checks (automated tests and typed production build).


## Next session

User and Administrator waves 1–4 are complete locally. Begin with the [next-session brief](SESSION-HANDOFF.md#next-session-brief); the scorecard extension is also complete, and the next milestone is wave 5 full Administrator closeout. Preserve uncommitted changes and shared schema 2/legacy backup. Wave 4 preflight passes 67 tests, TypeScript/build and production CSP smoke; all ten browser scripts pass, with zero User/Admin POST and zero violations across nine User/eight baseline Administrator/eight wave 2/nine wave 3/fourteen wave 4 audits. See [validation history](docs/validation.md). No public deployment of this revision is verified.

## Nigeria learner drill-down

Open Administration → Learner map to click state/FCT → LGA → learner. Use selectors for the same keyboard-accessible journey. Demo settings can explicitly load five labelled fictional geographic examples without changing your User progress. Reports show defined counts; geographic unknowns stay visible. See [geography source/count semantics](docs/NIGERIA-GEOGRAPHY.md). Full-screen data is local tab state, not a national user database.


## Individual learner scorecard and follow-up

Administration → Learner progress filters learners below or at/above an editable completion threshold (default 50%). No enrolments has no percentage. Open the individual scorecard for completed/enrolled courses, practical-review status, support provision and learner receipt, grant application/award/payment records in NGN, and follow-up owner/date/action/status. User → My scorecard reviews the same records and offers explicit receipt acknowledgement. These local demo records do not execute payments or verify real delivery. See [scorecard specification and verification](docs/LEARNER-SCORECARD.md).


Scorecard verification: 75 tests, TypeScript/build, the dedicated browser journey and five affected regressions pass; eight scorecard axe audits report zero violations/POST. Final production CSP smoke and independent review pass. No public deployment of this revision is verified.

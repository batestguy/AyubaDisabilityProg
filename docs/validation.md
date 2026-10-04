# Validation evidence - 4 October 2026

## Passed locally

- `npm.cmd run preflight`: eight automated tests; TypeScript check and production Vite build.
- Store checks: fictional learner propagation, recommendation availability, assisted enrolment, duplicate rejection, unpublished course rejection, lesson/quiz/submission/approval certificate gates, quiz retries, skills update and resubmission review.
- AI checks with a mocked provider: request bounds, modes/languages, original-catalogue references, same-origin guard, missing configuration, fabricated citation IDs, output URLs, malicious-prompt output rejection, 429/500 states and allowlisted context excluding name/email.
- Persistent limiter: minute cooldown, daily cap and UTC-day reset.
- Translation structure: 54 non-English lesson bodies, 42 quiz questions, nine assignments; same answer indexes, metadata and canonical skills. Experimental translations have not been reviewed by fluent speakers.
- Chrome browser journey: add learner as intermediary -> directly enrol -> complete six lessons -> pass quiz -> submit work -> ask question and request mentoring -> expert approves assignment and replies -> learner earns demo certificate and skills -> intermediary arranges follow-up.
- Chrome authoring journey: pending consultant profile, authored course hidden from learners until admin profile approval and course publication; translated sample course journeys render in Hausa/Yoruba/Igbo.
- AI outage UI, independent browser-session isolation, reset, mobile width 390 without horizontal overflow, keyboard focus.
- axe WCAG 2 A/AA and 2.1 AA audit: zero violations in overview, learner, expert, admin and expanded course views in en/ha/yo/ig. Automated audit does not replace actual screen-reader user testing.
- Cloudflare Pages Function compiled with `wrangler pages functions build`; limiter compiled with `wrangler deploy --config worker/wrangler.toml --dry-run`. No external publish was performed.
- PDFs generated and visually inspected: introduction one page, partnership proposal two pages; no clipping or overlap.
- Independent read-only review: pending consultant live-class link initially bypassed approval; corrected and independently rechecked. No remaining material findings in reviewed scope.

## Artifacts

Screenshots and accessibility results are under output/playwright (ignored). Production files are under dist (ignored). Downloadable materials are under public/downloads. Build uses the locked dependency versions in package-lock.json; Node 24.15.0, npm 11.16.0, Vite 7.3.6, TypeScript in lockfile.

## Pending external/user validation

- Public URL and live AI: Cloudflare login expired. User explicitly requested finishing the local build and deployment instructions. GROQ_API_KEY has not been configured or exercised against the live provider.
- Cloudflare free account/project and secret scope must be confirmed at deploy time. Quotas can also be shared with other projects on the provider account.
- Fluent-speaker translation review, actual screen-reader testing and participant co-design.
- Real accounts, durable records, real messages, video conferencing and NDMIS integration are outside this fictional demo.

Source registries: src/showcase.ts (documentary homepage) and src/evidence.ts (existing AI evidence), reviewed 2026-10-04. Past programme reports are not presented as currently open opportunities. Platform effectiveness, employment and income benefits remain hypotheses for a future authorised pilot.

## Documentary homepage revision - 4 October 2026

- Extracted HomePage and reusable PhotoCarousel; four programme chapters precede a seven-entry timeline, five proposed AI contributions, fictional demonstration and two-sentence closing note.
- Verified the Presidency appointment announcement (6 August 2024), Abia report (19 January 2025), agriculture report publication (7 July 2025), NOA report (10 December 2025), Otukpo mobility partnership report (11 October 2025), and accessible NDMIS source publication (22 May 2026). Agriculture event-date inconsistency is disclosed; facility approval is not presented as an operational office.
- Downloaded, optimised and visually inspected three article-matched FMINO photographs. Full frames, credits, locations and source links remain visible; Abia caption explicitly says Gufwan is not pictured. Original-image URLs are recorded in src/showcase.ts. No photo metadata enters AI request context.
- `node scripts/browser-showcase.mjs`: controlled-clock checks establish no advance before 8 seconds and advance at 8 seconds; hover/focus pause, manual stop, Play/Pause, arrows, indicators, swipe, OS and app reduced-motion settings, 390px full-frame display, no horizontal overflow, and blocked-image fallback all pass.
- `npm.cmd run test:ui`: carousel checks, complete three-role learning journey, authoring/publication gates and expanded multilingual courses pass. axe reports zero violations for eight audited views. Actual assistive-technology user review remains pending.
- One-page introduction PDF regenerated and visually inspected; six source links remain embedded. Walkthrough follows contributions, timeline, proposals, demonstration and closing. Supporting technical proposal text retained; its PDF was regenerated once during document editing with the same source text.
- Local only; no deployment attempted for this revision. Live AI still requires the external configuration described above.

## Immersive eight-chapter revision - 4 October 2026

- Eight source-linked chapters now follow the specified order, with a leadership introduction, twelve milestones and ten distinct locally optimised photographs. Verified Gufwan frames lead the opening slideshow. Source review distinguishes personal participation, named representatives, Commission/partner delivery and proposed work. The enforcement report's keynote attribution and Ikem Ochigbelam representation are both stated. Medical outreach credits Lawrence Idemudia and TLM/CHAI/CBM/Sightsavers. UBEC advocacy, polling barriers, agriculture date inconsistency, Abia operation uncertainty and NDMIS deployment uncertainty are retained.
- src/ProgrammeScenes.tsx implements desktop sticky photographs, IntersectionObserver chapter selection, 500ms crossfades, one-time 24px text reveals and requestAnimationFrame parallax bounded to 24px. Captions remain outside transformed containers. At widths below 1024px, photographs and text stack in normal document flow.
- src/PhotoGallery.tsx provides a ten-photo full-frame gallery: three columns on desktop, two on tablet/mobile, one below 480px. Desktop cards drift by at most 4px over 12 seconds and pause on hover/focus. Native modal dialogs use initial close-button focus, Tab/Shift+Tab wrapping, Escape, focus restoration and body scroll restoration. Portrait frames preserve complete images.
- The app Reduce motion control and operating-system preference stop slideshow autoplay and all decorative motion. No-observer fallback exposes stacked content. A complete no-JavaScript story is generated during build from the same records, with all chapters, photographs, evidence, timeline, proposals, sources and downloads. Lazy images include intrinsic dimensions; failure fallbacks retain captions and sources.
- `npm.cmd run test:ui`: original controlled-clock carousel checks pass; new story checks pass for all eight chapter/photo matches, sticky layout, bounded parallax, dialog keyboard/focus behavior, gallery modal axe audit, app/OS reduced motion, image failures and observer fallback. Layout checks pass at widths 1440, 1024, 768, 480 and 390 with no horizontal overflow. No-JavaScript story checks also pass.
- Complete three-role journey, authoring/profile/publication gates, AI outage and expanded multilingual course flows pass. axe reports zero violations in overview, learner, expert, admin, expanded en/ha/yo/ig courses, and the gallery dialog. Automated checks do not replace assistive-technology participant testing.
- Final `npm.cmd run preflight`: all eight automated tests pass, TypeScript passes and the production build succeeds. No production dependencies were added.
- `node scripts/browser-production.mjs` with `npm.cmd run preview -- --port 4173`: built-site smoke passes with the actual public Content-Security-Policy applied. Confirms chapter selection, full-frame portrait dialog, sandbox access, PDF download, mobile no-JavaScript story and no browser console/page errors.
- Visually inspected the acquired-photograph contact sheet, desktop opening and chapter, tablet gallery, 390px stacked chapter and opening, landscape and portrait dialogs, no-JavaScript mobile opening and regenerated introduction PDF. Full photographic context, readable captions and page content are retained.
- Introduction PDF is exactly one page with eight chapter rows and eleven embedded source links. Walkthrough covers leadership, chapter/gallery evidence and all three sandbox roles. Technical proposal PDF and source branch were preserved.
- Local delivery only. Dev preview: http://127.0.0.1:5173; production preview: http://127.0.0.1:4173. No publication or deployment occurred. Existing live-AI configuration and fluent-speaker/user-validation limitations continue to apply.

## Continuation documentation handoff - 4 October 2026

- User requested comprehensive documentation before returning to appearance modification. No appearance, sandbox behavior, source claim or deployment was changed in this documentation pass.
- Added root SESSION-HANDOFF.md with history, current scope, eight chapter facts, run/validation commands, limitations and reusable next-session brief. Added docs/ARCHITECTURE.md, docs/APPEARANCE-GUIDE.md and docs/README.md. Linked them from the main README and clarified that the existing deployment runbook is deferred reference material.
- Added docs/implementation-snapshot.json with SHA-256 hashes of implementation/configuration/public artifacts. Credentials, private input text files, caches, node_modules and generated output are excluded. The snapshot is a comparison aid, not a backup or Git commit; no .git directory exists in the workspace.
- Reran npm.cmd run preflight in this handoff session: all eight Node tests passed; TypeScript and production Vite build passed. Build regenerated the static story and photo manifest. The previous cinematic browser/production suites remain the last full browser evidence; they were not rerun for documentation-only changes.
- Local markdown links in new guides, README and deployment notes were verified. Read-only artifact check confirms introduction one page, technical proposal two pages and ten accepted photo records.
- Next work is appearance modification in the existing app according to the user's new instructions. No new visual direction has been chosen; no publication, credentials setup or real participant integration is authorised by this handoff alone.


## Interactive timeline and page structure ? 4 October 2026

- Primary navigation is Home ? Explore the App ? About, using the existing state-based page switching with no routing dependency. Home keeps leadership, all eight documentary chapters, the gallery and source register. Its personal closing introduction was removed.
- `src/Timeline.tsx` reuses the twelve milestone records. It initially selects the appointment, filters All years/2024/2025/2026, selects the first event after filtering, disables previous/next at boundaries, and reveals one event with status, evidence caveat and source. Nine events have existing source-matched photographs; three have no matching photograph. Only the date strip scrolls horizontally; selection never scrolls the page vertically.
- Explore the App holds all five expandable proposals with existing evidence and measures, pilot discussion, downloads and separate existing demo entry points. User, Administration and Facilitator tabs support arrows/Home/End and open empty labelled panels. About has blank portraits and biographies for Jerry Bannister Zachary and Strong.
- Opening photographs advance automatically every eight seconds. Pause motion replaces Play/Pause and exposes pressed state. Hover/focus temporarily suspend autoplay; manual selection pauses until the toggle is turned off. Global and OS reduced-motion settings inhibit playback. Existing full frames, captions and image-failure fallbacks remain.
- Palette uses #14532D green, #FFFFFF white and #075985 blue with pale surfaces and dark text. Access-bar separators were corrected. Shared footer retains the small linked Created By Deerflow attribution required by frontend-design.
- Build generates separated no-JavaScript Home/Explore/About sections, twelve native expandable timeline events and five expandable proposals. PDF files/layouts were not changed. Walkthrough and handoff reflect the new structure.
- Final preflight: all eight Node tests, TypeScript and production build pass. Browser checks cover eight-second timing, pause/resume, manual selection, keyboard/swipe, motion preferences, image failure, all twelve events and photo/source matching, filters/boundaries, role tab keyboard behavior, blank profiles, no-JavaScript separation and enlarged-text overflow checks at 390/768/1440px. Existing chapters/gallery remain checked at 1440/1024/768/480/390px; fictional learning, authoring and multilingual journeys pass.
- Accessibility review caught prohibited names on blank generic profile containers and transient navigation contrast during color transitions. Containers now use labelled group roles and primary navigation changes color immediately; affected checks were rerun.
- Desktop timeline and enlarged-text 390px Explore/About screenshots were inspected. Local production smoke applies public CSP and checks chapters, portrait modal, sandbox, PDF availability and mobile no-JavaScript separation. Delivery remains local; live AI configuration, new role workflows, profile content and deployment are deferred.

- Final gate after accessibility corrections: preflight and rebuilt production smoke both pass; twelve axe WCAG A/AA audits report zero violations. Automated accessibility results still require participant/assistive-technology validation before real-world adoption.

## Resumed saved revision and repository checkpoint - 4 October 2026

This checkpoint supersedes earlier slideshow, gallery and page-structure descriptions.

- Repository: [batestguy/AyubaDisabilityProg](https://github.com/batestguy/AyubaDisabilityProg), public, branch `main`. Use `git log -1 --oneline` for the commit ID; a committed handoff cannot contain its own hash.
- Current navigation: Home, Projects & Possibilities, About. Projects & Possibilities links to a separate app-demo page with empty User, Administration and Facilitator panels, and separately to the existing fictional sandbox and support navigator. About keeps blank named profile spaces.
- Ten photographs are grouped within eight chapters and open full-frame dialogs; the separate gallery is removed. Leadership includes additional source-linked reading.
- The slideshow cycles continuously every four seconds with arrows, indicators and swipe. No pause control is rendered. Hover, focus, manual selection and app/OS reduced motion do not stop it. Reduced motion still disables decorative chapter motion. Earlier eight-second/pause/gallery descriptions are historical.
- Fresh `npm.cmd run preflight`: all eight Node tests, TypeScript and Vite production build pass. Fresh `npm.cmd run test:ui`: all five browser scripts pass, including timeline filters/boundaries/photo sources, separate role tabs, blank profiles, learning/authoring gates, AI outage and multilingual flows.
- All thirteen page accessibility audits in `output/playwright/accessibility.json` and the separate photograph-dialog audit in `gallery-accessibility.json` report zero axe violations. Automated audits do not establish full accessibility conformance; the continuous carousel behavior is recorded above and actual assistive-technology participant testing remains deferred.
- Fresh `node scripts/browser-production.mjs`: rebuilt site passes with the public CSP applied, chapter activation, portrait dialog, sandbox entry, PDF HTTP 200, no console/page errors and mobile no-JavaScript navigation/chapter/proposal separation. Story checks cover widths 1440/1024/768/480/390px; enlarged-text page checks cover 390/768/1440px without horizontal overflow.
- Visually inspected fresh `cinematic-opening.png`, `story-chapter-390.png` and `production-portrait-dialog.png`: full photograph context, captions and source links retained. Evidence remains in ignored `output/playwright/` and is reproducible with the documented commands.
- README, handoff, architecture, appearance guide, walkthrough, documentation index and implementation hashes now match saved code. No runtime behavior or PDF layout changed in this continuation.
- Private briefs, credentials, caches, dependencies and generated build/test output are excluded from Git. Repository delivery does not deploy the website; Cloudflare and live AI configuration remain deferred.

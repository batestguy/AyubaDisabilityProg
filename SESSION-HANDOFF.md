# Session handoff: build the demo app next

Checkpoint: 4 October 2026. Workspace: `D:\AyubaGufwanDisabiliyt`.

## Next objective

The user's next task is **building the demo app**. Continue the existing React/TypeScript/Vite project. The website revision, browser validation, documentation and public repository delivery are complete. No new demo workflow was implemented in this handoff session.

Start at **Projects & Possibilities → Open the app demo → Choose your role**. The User, Administration and Facilitator tabs work, but their panels are intentionally empty. Build the next features there after establishing the user's desired first workflow. Detailed feature requirements, role permissions, persistence requirements and whether to adapt the existing sandbox have not yet been agreed. Do not treat the three tab names as a finished specification.

## Repository and delivery

| Item | Verified checkpoint |
|---|---|
| Public repository | [batestguy/AyubaDisabilityProg](https://github.com/batestguy/AyubaDisabilityProg) |
| Branch | `main`, tracking `origin/main` |
| Validated implementation commit | `1332133566599b557831317aa6742fdca719f007` |
| Commit meaning | Saved website revision and completed validation/documentation; the later documentation-only commit contains this handoff |
| Website preview | `http://127.0.0.1:5173/`; production preview `http://127.0.0.1:4173/` |
| Hosting | Local preview only; GitHub publication does not deploy the website |
| Latest user interaction | Opened the current local preview in the user's browser |

Both preview servers were running during this session. Check them next time; processes may not survive a restart. GitHub visibility is public, as explicitly requested by the user. The working tree was clean after implementation delivery; inspect it again before editing.

The initial Git upload timed out twice with HTTP 408. The exact local commit was then transferred through the GitHub API with every blob, tree and commit hash verified. A subsequent `git push -u origin main` succeeded as up to date. No credentials were written to the workspace. This was a completed delivery, not a remaining blocker.

## What is finished

- Primary navigation: Home, Projects & Possibilities, About.
- Home: leadership introduction with additional source-linked reading, eight documentary chapters with ten genuine locally optimized photographs, full-frame dialogs, a twelve-event filtered timeline and source register. There is no separate gallery section.
- Projects & Possibilities: five expandable proposals, pilot discussion, downloads, the app-demo entry and separate links to the existing fictional learning sandbox and support navigator.
- App demo: three empty role panels with accessible tabs, arrow/Home/End keyboard navigation and selected-tab state. This is the next implementation surface.
- About: blank portrait and biography spaces for Jerry Bannister Zachary and Strong. Personal content remains unprovided.
- Existing learning sandbox: connected learner, expert consultant and intermediary/admin perspectives; three courses, eighteen lessons, fourteen assessment questions, assignments, approval/completion gates, questions, mentoring replies, follow-up, authoring and publication review.
- Support navigator: bounded server-side AI endpoint and persistent shared quota code. Mocked-provider tests pass; live Groq/Cloudflare configuration is unverified. Catalogue guidance remains available without AI.
- Downloads: one-page introduction, two-page partnership proposal and aligned three-minute walkthrough. PDF layouts were preserved.
- No-JavaScript story, photo provenance/manifest, architecture and appearance guides, validation history, implementation hashes, binary-safe Git attributes and exclusions for secrets/private briefs/generated output.

## Exact current behavior to preserve or deliberately revise

The opening slideshow cycles continuously every **four seconds**. Arrows, indicators and swipe select photos; there is no pause button. Hover, focus, manual selection and app/OS reduced-motion settings do not stop this carousel. Reduced motion does stop decorative chapter motion. Earlier eight-second/pause descriptions in the history are obsolete. Automated axe results do not certify the carousel's full accessibility.

Desktop chapters use sticky full-frame photographs, 500ms crossfades and parallax bounded to 24px; tablet/mobile chapters stack normally. Photograph dialogs support initial focus, Tab/Shift+Tab wrapping, Escape and focus restoration. The timeline filters All years/2024/2025/2026, selects one event, disables boundary controls and scrolls only its horizontal date strip.

The existing sandbox uses `sessionStorage` key `mosaic-v1`; reload preserves fictional records within the tab. All perspectives share the same records. Role selection is not authentication or authorization. Do not assume the new demo tabs automatically inherit sandbox state: `AppDemoPage` currently owns only tab selection.

Course completion requires every lesson, best quiz score at least 70%, a submitted assignment and expert approval. Resubmission requires fresh approval. Authored courses remain hidden until the consultant/profile and publication gates pass. Reuse these rules if bringing learning flows into the new demo.

## Files to read for demo app work

| File | Use |
|---|---|
| `src/AppDemoPage.tsx` | Empty role tabs/panels; primary new demo surface |
| `src/ExplorePage.tsx` | Open the app demo entry and existing demo links |
| `src/App.tsx` | State-based page switching, shared sandbox state, existing role UI and access controls |
| `src/store.ts`, `src/store.test.ts` | Fictional data model, enrollments, completion gates and recommendations |
| `src/catalogue.ts`, `src/courseLanguages.ts`, `src/i18n.ts` | Courses, localized course content and interface language strings |
| `src/style.css` | Shared green/white/blue presentation, `.role-tabs`, `.empty-role-panel`, forms and workspaces |
| `scripts/browser-story.mjs` | Currently asserts empty app-demo panels; revise those assertions when approved content is added |
| `scripts/browser-journey.mjs`, `scripts/browser-authoring.mjs` | Existing learning and authoring regression journeys |
| `scripts/accessibility.mjs` | App-demo role, About, sandbox and multilingual axe audits |

Read [architecture](docs/ARCHITECTURE.md) for data flow and helpers, [appearance guide](docs/APPEARANCE-GUIDE.md) for styling, [validation](docs/validation.md) for evidence, and [historical session record](docs/SESSION-HISTORY.md) for earlier decisions/content caveats. `src/showcase.ts` and `src/evidence.ts` remain authoritative source records.

## Recommended first session

1. Inspect Git status and current instructions, then open the local demo page. Confirm the existing entry and three tabs.
2. Establish the first useful end-to-end demo journey with the user: what User does, what Administration handles, and what Facilitator does. Clarify whether Facilitator maps to the existing expert consultant or intermediary, or has another purpose. Current role names alone do not settle that mapping.
3. Agree observable acceptance criteria for that first slice. Decide whether to reuse/adapt existing sandbox components/state before introducing a separate model. Keep requirements that are not yet agreed explicitly open.
4. Implement the agreed slice using existing components/dependencies where practical. Preserve website content, source caveats, photo context, existing sandbox gates and user edits.
5. Update the browser assertions that expect empty panels, add meaningful flow coverage, check responsive/loading/empty/error/keyboard states as applicable, and run relevant validation. Document the completed slice and the next step.

This is a proposed continuation sequence, not approval for invented workflows, a new backend, real participant data or deployment. Ordinary in-scope inspection, implementation and testing do not require repeated routine confirmation.

## Run and validate

Use Node 22.12+ and npm (this machine tested Node 24.15.0). Dependencies are already installed. On a fresh checkout, run `npm.cmd ci --no-audit --no-fund`.

```powershell
Set-Location -LiteralPath 'D:\AyubaGufwanDisabiliyt'
git status --short --branch
npm.cmd run dev -- --port 5173 --strictPort
```

In another terminal:

```powershell
npm.cmd run preflight
npm.cmd run test:ui
```

For production checks, build first (preflight includes the build), start the preview in another terminal and run the smoke script:

```powershell
npm.cmd run preview -- --port 4173 --strictPort
# In another terminal:
node scripts/browser-production.mjs
```

Browser scripts require installed Google Chrome and the documented ports. Do not stop unrelated processes if a port is occupied. Screenshots and audits are under ignored `output/playwright/`; `dist/` is generated output.

The sandbox shell could not start in this session (`helper_unknown_error: setup refresh had errors`); approved elevated execution worked. In that shell Git saw different directory ownership. Command-local `git -c safe.directory=D:/AyubaGufwanDisabiliyt ...` worked without changing global trust settings. Use normal commands first in a new session and this targeted override only if needed.

## Validation evidence and remaining boundaries

The validated implementation passed all eight Node tests, TypeScript and Vite build; all five dev browser scripts; and the rebuilt production smoke with the public CSP applied. Thirteen page audits plus the photograph-dialog audit reported zero axe violations. Story widths 1440/1024/768/480/390px and enlarged-text page widths 390/768/1440px had no horizontal overflow. Fresh desktop opening, mobile chapter and portrait-dialog screenshots were visually inspected.

This handoff session changes documentation only. Fresh preflight passed all eight tests, TypeScript and the production build before delivery; full browser evidence above belongs to the immediately preceding implementation-validation session and is not presented as a new browser run.

Still deferred: demo app feature specification and implementation, personal profiles, public website hosting, live AI/limiter configuration, real accounts/database/messages/video/NDMIS integration, fluent-speaker translation review, participant co-design and actual screen-reader testing. The last recorded Cloudflare login was expired. Keep credentials outside the workspace. The public repository must continue excluding private briefs and secrets.

Historical reports do not establish currently open opportunities or measured economic/health outcomes. Preserve the agriculture date caveat, Abia office-operation uncertainty, representative attribution for enforcement/health, and unverified NDMIS deployment. Photographic attribution establishes provenance, not an open reuse license or government endorsement.

## Paste into the next session

> Resume Impact Mosaic in D:\AyubaGufwanDisabiliyt from public repo batestguy/AyubaDisabilityProg. Read SESSION-HANDOFF.md and docs/ARCHITECTURE.md first. The website revision is finished and validated. We are building the demo app next: Projects & Possibilities → Open the app demo opens src/AppDemoPage.tsx with empty User, Administration and Facilitator panels. Inspect the existing sandbox/state for reusable workflows, establish our first end-to-end demo journey and role mapping, then implement and validate the agreed slice. Preserve user changes, source caveats and existing learning/publication gates. Keep fictional demo scope unless we explicitly agree otherwise. Update the empty-panel browser assertions when adding content and leave a clear handoff of completed work and remaining decisions.

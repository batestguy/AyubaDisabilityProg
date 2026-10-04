# Architecture and maintenance reference

Checkpoint: 4 October 2026. Read [the session handoff](../SESSION-HANDOFF.md) for project history, verified content and next-session intent.

## Application structure

The project is a React application with two production dependencies: React and React DOM. TypeScript and Vite handle compilation/building. Browser tests use Playwright and axe. CSS, IntersectionObserver and requestAnimationFrame implement documentary motion without an animation dependency. Pages Functions and a separate Cloudflare Worker implement optional server-side AI assistance.

```mermaid
flowchart TD
    H[index.html] --> R[src/main.tsx and App.tsx]
    R --> HOME[HomePage: documentary story]
    R --> PROJECTS[ExplorePage: Projects & Possibilities]
    R --> DEMO[AppDemoPage: empty role panels]
    R --> ABOUT[AboutPage: profile spaces]
    R --> SBOX[Learning sandbox and support navigator]
    DATA[src/showcase.ts: photos, chapters, milestones] --> HOME
    EV[src/evidence.ts: summaries and proposals] --> PROJECTS
    STORE[src/store.ts: fictional tab-session records] <--> SBOX
    CAT[src/catalogue.ts and courseLanguages.ts] --> SBOX
    SBOX --> API[POST /api/assist: Pages Function]
    EV --> API
    CAT --> API
    API --> LIMIT[Worker Durable Object: global quota]
    API --> GROQ[Groq: optional configured provider]
    DATA --> GEN[generate-static-story.mjs]
    EV --> GEN
    GEN --> STATIC[index.html noscript story and photo manifest]
```

Photo metadata is presentation-only. The AI endpoint imports `evidence.ts` and `catalogue.ts`; it does not import `showcase.ts` or the photo manifest. There is no participant database behind the browser state.

## File map

| File / directory | Responsibility | Editing notes |
|---|---|---|
| `src/main.tsx` | Mounts React and imports the primary stylesheet | Browser entry point |
| `src/App.tsx` | App navigation, access controls, role views, forms, course authoring, support navigator and state persistence | Main sandbox behaviors are still in this larger file; cosmetic homepage work usually needs little change here |
| `src/HomePage.tsx` | Story composition, leadership and further reading, chapters with grouped photographs, timeline and source register | Primary homepage composition surface |
| `src/Timeline.tsx` | Twelve-event, year-filtered timeline with boundary controls and source-matched photographs | Selection scrolls the date strip only |
| `src/ExplorePage.tsx` | Projects & Possibilities: five proposals, pilot discussion, downloads and links to demos | Main navigation label differs from the component filename |
| `src/AppDemoPage.tsx` | Separate empty User, Administration and Facilitator panels | Keyboard tabs support arrows, Home and End |
| `src/AboutPage.tsx` | Blank named portrait and biography spaces | No personal profile content supplied |
| `src/PhotoCaption.tsx` | Shared photograph caption and provenance links | Used by chapter, timeline and dialog presentation |
| `src/showcase.ts` | Documentary sources, photo records, achievement records, hero selection and milestones | Canonical documentary data; stable IDs link navigation, gallery, timeline and tests |
| `src/evidence.ts` | Reviewed AI-compatible source summaries, five proposal records and expiry helper | Used by Projects & Possibilities and server; changing summaries changes AI context |
| `src/PhotoCarousel.tsx` | Opening slideshow and reusable `DocumentaryImage` | Three selected photos; timing, focus/hover/manual pause, swipe and image fallback |
| `src/ProgrammeScenes.tsx` | `ProgrammeScenes` and `PhotoCaption` | Desktop enhancement, chapter activation and text reveals; mobile baseline remains normal content |
| `src/PhotoGallery.tsx` | Shared photograph context, expandable photos and native modal dialogs; standalone gallery component retained but not rendered on Home | Includes focus and scroll restoration |
| `src/useReducedMotion.ts` | Combines app setting with OS media preference | Used by homepage motion; carousel also listens to OS preferences |
| `src/style.css` | Shared app and documentary presentation | Earlier base styles plus later documentary overrides; check cascade before changing selectors |
| `src/store.ts` | State types, seeds, enrolment, completion, recommendations, quiz grading and loading | Logic independently tested |
| `src/catalogue.ts` | English original courses and course types | Reviewed catalogue for AI also comes from this file |
| `src/i18n.ts` | Language options and translated interface strings | Language codes: en, ha, yo, ig |
| `src/courseLanguages.ts` | Sample-course text/assessment translations | Keeps original assessment answer indexes and skill metadata |
| `functions/api/assist.ts` | Validates requests, reserves quota, calls provider and validates responses | Server-only key/binding; local Vite does not execute it |
| `worker/limiter.ts` | Persistent global quota Durable Object | Three counters; no prompt, identity or IP storage |
| `wrangler.toml` | Pages project name, build directory and Worker binding | Deployment configuration, not a credential store |
| `worker/wrangler.toml` | Worker name, SQLite Durable Object migration and disabled workers.dev endpoint | Existing class name and script name must match Pages binding |
| `public/photos/` | Ten accepted WebPs | Served locally; full photographic frames retained |
| `public/_headers` | CSP and other response headers | Production smoke applies this CSP; avoid adding unapproved third-party resources |
| `public/static-story.css` | No-JavaScript presentation | Separate from `src/style.css` |
| `public/downloads/` | Introduction PDF, proposal PDF and walkthrough | Static downloadable assets copied into the build |
| `scripts/generate-static-story.mjs` | Generates static story and photo manifest from TypeScript records | Runs before typecheck/Vite in the build script |
| `scripts/collect-documentary.py` | Re-downloads accepted images from the manifest | Checks dimensions before replacement; no cropping or upscaling |
| `scripts/create-documents.py` | Generates PDF(s) and rendered review images | Default introduction only; `--include-proposal` explicitly also rebuilds proposal |
| `scripts/run-tests.mjs` | Transpiles TypeScript test modules into output and runs Node tests | Does not use the browser |
| `scripts/browser-*.mjs`, `scripts/accessibility.mjs` | Browser checks described below | Installed Chrome, ports 5173/4173 |
| `dist/` | Production output | Generated; never the source of an appearance edit |
| `output/` | Test compilation, screenshots, image research, rendered PDFs and build evidence | Generated/ignored artifacts |

## Documentary records

`DocumentaryPhoto` contains:

| Fields | Meaning |
|---|---|
| `id`, `path`, `original` | Stable photo identity, local asset URL and publisher image URL |
| `source`, `date`, `location` | Source ID, report publication date and location with uncertainty disclosed |
| `caption`, `alt`, `credit` | Visible account, accessible image description and publication credit |
| `programme` | Homepage anchor for the relevant chapter or leadership section |
| `width`, `height` | Actual intrinsic dimensions of the accepted local asset |
| `gufwanPictured`, `identification` | Whether this showcase has a verified individual identification and the basis/limitation |

`gufwanPictured: false` also includes group frames where an individual Gufwan identification is not verified. It is not a face-recognition result. Read `identification` before making a stronger claim.

Achievement records contain a stable `id`, title, location, report date, status, source ID, `photos` array, account, role, partners and evidence explanation. The first photo is displayed in the chapter scene; additional photos appear within the chapter. Institutions groups NOA, CBM and the leadership photograph. The separate gallery section has been removed.

`heroPhotos` selects NOA, leadership and CBM from the master photo array. `sourceRegister` merges documentary sources with the original evidence sources. `sourceFor(id)` assumes the ID exists; adding an invalid reference can break rendering/static generation. Milestones have stable IDs and are sorted by date.

Changing source metadata requires checking every linked record, the static build, related document wording and tests where ordering is assumed. Browser checks assert chapter and timeline photograph matches; update related assertions when changing associations.

## Documentary behavior

### Opening carousel

The carousel advances continuously every 4,000ms. Hover, focus, manual selection and app/OS reduced-motion settings do not stop playback, and no pause button is rendered. Arrows, indicators, keyboard Left/Right and horizontal swipe select manually while the interval continues. The carousel uses `aria-live="off"`; changing a photograph does not request screen-reader announcements.

`DocumentaryImage` accepts a photo and optional `loading` setting (`lazy` by default). The opening and modal request eager images; below-opening content is lazy. It reserves intrinsic dimensions, decodes asynchronously and replaces failed images with a readable fallback while captions remain outside the component. Failure state resets when the image path changes.

### Scroll scenes

At widths of at least 1024px with IntersectionObserver available, a sticky aside displays layered photographs and numbered chapter links. IntersectionObserver uses a viewport activation band defined by `rootMargin: '-25% 0px -55% 0px'`. The selected chapter determines image, number and caption. Inactive layers are hidden from accessibility with `aria-hidden`.

Text is always in the document. Entering chapter copy gets a one-time reveal from 24px below; a completed marker prevents re-observation. Animation cleanup removes active reveal classes. Parallax schedules one requestAnimationFrame per pending scroll/resize update, clamps displacement to -24px through +24px and resets transforms on cleanup/reduced motion.

If the desktop enhancement is unavailable or the viewport is narrower, all chapters expose ordinary photographs and text. Reduced motion stops decoration while keeping readable content and chapter selection.

### Gallery dialogs

Chapter photograph buttons open a selected photograph in `<dialog>` using `showModal()`. The close button receives initial focus. The native modal provides background isolation; explicit Tab/Shift+Tab handling wraps the close button/source-link controls. Escape, Close and a click on the dialog element outside its interior content close it. Cleanup restores the prior body overflow and focuses the original opening button without scrolling.

Portrait and landscape photos use `object-fit: contain`. Captions include location and report publication date rather than assuming the image capture date. Unused gallery-card drift styles remain, but no standalone gallery cards are rendered. Reduced motion disables chapter decoration.

## Sandbox state and APIs

The `State` object contains learners, courses, enrolments, request records and one fictional consultant. It is stored under sessionStorage key `mosaic-v1` by `App.tsx`. Storage failure leaves in-memory state and displays a notice. `loadState` catches parse/storage errors but is not a full production schema validator. Browser duplication/restoration can copy tab state. Role selection deliberately exposes the same fictional records; there is no access-control boundary.

| Export from `store.ts` | Behavior |
|---|---|
| `fresh(): State` | New fictional learner/consultant seeds, cloned sample courses and empty activity |
| `uid(): string` | Browser UUID for new records |
| `enrol(state, learnerId, courseId, assisted=false): State` | Rejects missing learner, unpublished/missing course and duplicate enrolment; otherwise creates activity record |
| `updateEnrolment(state, id, patch): State` | Applies patch, recomputes completion and adds canonical course skills to a completed learner |
| `recommend(state, learner): {course,score}[]` | Ranks published courses by simple interest/skill word matches; remains available without AI |
| `grade(course, answers): number` | Percentage correct, rounded to integer |
| `loadState(): State` | Reads stored session JSON or returns fresh seeds |
| `localizeCourse(course, lang): Course` from courseLanguages | Applies reviewed-structure experimental translation if present; otherwise returns original course |
| `available(deadline?, now=Date.now()): boolean` from evidence | True only for a supplied date not yet expired at its UTC end-of-day; absence is not availability |

An enrolment tracks assisted status, completed lesson indexes, quiz-attempt scores, submission, feedback, approval and optional completion time. Requests track kind (`question`, `mentoring`, `message`), learner/course IDs, text, creation/reply timestamps and follow-up text. Intermediary summary counts and response times describe fictional activity only.

Consultant profile edits return the profile to pending review. New authored courses enter `review`; admin approval/publication gates learner visibility. Resource/video links require HTTPS and a video requires a transcript. Custom authored courses are not automatically added to the server's reviewed original catalogue.

## Optional AI endpoint

The exported server function is `handle(request, env, providerFetch=fetch): Promise<Response>`. `onRequest` adapts it to Pages Functions. Injecting `providerFetch` allows mocked tests. The configured model string is `openai/gpt-oss-120b` through Groq; temperature 0.3, up to 600 completion tokens, JSON-object output. This describes checked-in configuration, not a claim that current provider availability has been reverified.

Example input with fictional data:

```json
{
  "mode": "explain",
  "language": "en",
  "prompt": "Explain the difference between a reported workshop and a deployed database.",
  "context": {
    "interests": "digital skills",
    "skills": [],
    "location": "Bauchi",
    "needs": "Plain language"
  }
}
```

`courseId` is optional and must identify an original published sample course. Success returns `{text, citations}` with duplicate citation IDs removed. References resolve to local allowlisted source records rather than provider-supplied URLs.

| Check / limit | Implemented behavior |
|---|---|
| Method / content type | POST and application/json required |
| Origin | Rejects a present Origin header differing from the endpoint origin; not an authentication mechanism |
| Incoming body | Maximum 4,096 bytes |
| Mode / language | recommend, explain, draft; en, ha, yo, ig |
| Prompt | Nonempty string, at most 800 characters |
| Context strings | interests/location/needs at most 200 characters each |
| Skills | Up to 12 strings, each at most 80 characters |
| Provider context | Only allowlisted learner fields, evidence summaries and at most 3,000 characters of selected original lesson material |
| Upstream JSON | At most 6,500 bytes; shortening input may be necessary |
| Timeout | Server provider request 20s; client request 25s |
| Returned text | At most 7,000 characters; rejects explicit HTTP(S) URLs |
| Citations | At most eight allowed IDs; non-draft responses require at least one |
| Site quota | One global reservation/minute, twenty reservations/UTC day |

Errors return JSON with an `error` field: 400 validation, 403 origin, 405 method, 413 size, 415 content type, 429 shared/provider allowance, 503 missing key/binding, and 502 provider/timeout/verification failure. Errors preserve access to non-AI learning. The system prompt limits tools, decisions and live-opportunity promises, but prompts are not proof that every model sentence is correct or safe.

The Durable Object stores `last`, `day` and `count` in a transaction. It does not store learner identifiers, IPs or prompts. Pages uses the `AI_LIMITER` binding and `impact-mosaic-limiter` script. There is no publicly enabled workers.dev endpoint. Secrets belong in external account/process storage, never the workspace or frontend environment variables.

## Build and generated artifacts

`npm.cmd run build` runs the static-story generator, TypeScript checking and Vite. The generator transpiles trusted local TypeScript records into temporary data-URL modules inside Node, escapes values for static HTML, replaces the marked noscript block in `index.html` and writes the documentary manifest. No data-URL module is served to visitors by that generator.

The generated noscript block and `dist/` are not independent editing surfaces. Static chapter/timeline/proposal data comes from the records, but some static introductory/proposal prose is manually composed in the generator. Keep that prose aligned with `HomePage.tsx` when wording changes. `public/static-story.css` must be revised separately when its appearance should match a new design.

The PDF generator contains its own presentation prose/source links. A homepage wording change does not automatically update the PDFs or walkthrough. Rebuild the introduction, confirm page count and inspect the rendered PNG. Do not use `--include-proposal` merely to change the introduction.

## Tests and artifacts

| Script | Coverage / prerequisite |
|---|---|
| `npm.cmd test` | Eight Node tests: store journeys/gates, localization structure, AI request/response and limiter behavior |
| `npm.cmd run typecheck` | TypeScript, frontend plus Functions/Worker/tests |
| `npm.cmd run preflight` | Node tests and production build; no server needed |
| `scripts/browser-showcase.mjs` | Controlled-clock 4s carousel, continuous hover/focus/manual/reduced-motion cycling, keyboard/swipe and image failure; dev port 5173 |
| `scripts/browser-story.mjs` | Eight chapter/photo matches, sticky/parallax, gallery keyboard/axe, breakpoints, observer/no-JS/failure fallback; dev port 5173 |
| `scripts/browser-journey.mjs` | Complete three-role course journey, requests, follow-up, certificate, outage, isolation, reset and mobile |
| `scripts/browser-authoring.mjs` | Pending consultant/course publication gates and translated sample journeys |
| `scripts/accessibility.mjs` | axe Projects & Possibilities, empty app-demo roles, About, overview, learner/expert/admin and expanded courses in all four languages |
| `npm.cmd run test:ui` | Runs the five dev browser scripts sequentially; installed Google Chrome required |
| `scripts/browser-production.mjs` | CSP-applied built-site smoke, portrait dialog, sandbox, PDF and no-JS mobile; preview port 4173 |

Screenshots: `output/playwright/`. Accessibility JSON: `output/playwright/accessibility.json` and `gallery-accessibility.json`. Rendered PDFs: `output/pdf/`. Initial acquired-source text and contact sheet: `output/documentary/`. Historical Worker/Functions dry-run evidence remains recorded in validation; no live deployment is implied.

## Practical troubleshooting

| Symptom | First check |
|---|---|
| Browser script cannot connect | Start the correct dev/preview server and verify the fixed expected port |
| AI unavailable in Vite | Expected: Vite does not run Pages Functions; use non-AI workflows or authorised Functions setup |
| AI 503 | Missing server key or limiter binding; keep credentials outside project |
| AI 429 | Shared cooldown/day cap or provider quota; learning stays available |
| Photo missing | Confirm local path/manifest dimensions and source; caption/fallback should still work |
| Chapter photo/number mismatch | Check stable IDs, first photo reference, observer callback and CSS fade timing |
| Playwright click waits on drifting card | Focus the card or move the pointer onto it first so movement pauses; user interaction and keyboard behavior remain testable |
| New styling appears ignored | Inspect later `style.css` overrides and breakpoint rules; source CSS is global |
| Static story/PDF wording stale | Regenerate static build and explicitly update/rebuild documents |
| Python text decoding error | Read/write project files explicitly as UTF-8; PowerShell defaults can vary |
| Persisted fictional state unsuitable for a demo | Use Reset; do not put real personal records in the sandbox |

Use [the appearance guide](APPEARANCE-GUIDE.md) for the next visual revision. Use [the deployment guide](deployment.md) only when deployment becomes the user's authorised task.

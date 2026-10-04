# Appearance change guide

Current baseline: 4 October 2026. The saved revision is validated and versioned. Further visual changes require the next user brief. This guide records the current design and where to edit it; it does not choose a new design on the user's behalf.

Read [SESSION-HANDOFF.md](../SESSION-HANDOFF.md) before changing the story or sandbox, and [ARCHITECTURE.md](ARCHITECTURE.md) for implementation detail.

## Current visual direction

The homepage uses an editorial documentary treatment: green (#14532D), white (#FFFFFF), restrained blue (#075985), pale surfaces, large authentic photographs and generous spacing. Serif display headings pair with Trebuchet MS body text. Fonts are local/system fonts rather than remote font services. About reserves blank profile spaces for Jerry Bannister Zachary and Strong.

The sections currently appear in this order:

1. Opening headline and three-photo slideshow.
2. Leadership introduction.
3. Eight programme chapters.
4. Twelve-entry milestone timeline.
5. Source register.

Ten photographs are grouped within the chapters and open full-frame dialogs. Projects & Possibilities holds five proposals, pilot discussion, downloads and demo links. Open the app demo leads to a separate page with empty User, Administration and Facilitator tabs. About reserves two profile spaces. The primary navigation is Home, Projects & Possibilities, About.

The story is independent and source-linked. The photos and evidence account are the foundation to retain during an appearance revision unless the user changes the content brief.

## Where to edit

| Requested visual change | Primary files / selectors |
|---|---|
| Colors and common typography | `src/style.css`: `:root`, `--green`, `--orange`, `--line`, body/headings/link/button rules |
| Site header/navigation/access controls | `src/App.tsx`, `src/style.css`: `header`, `.brand`, `nav`, `.accessbar`, `.language` |
| Hero layout/headline/photo proportions | `src/HomePage.tsx`, `.documentary-hero`, `.hero-copy`, `.hero h1`, `.hero-cta` |
| Slideshow framing/captions/controls | `src/PhotoCarousel.tsx`, `.photo-carousel`, `.photo-frame`, `.carousel-controls`, `.slide-indicators` |
| Leadership introduction | `src/HomePage.tsx`, `.leadership-intro` |
| Chapter layout and copy styling | `src/ProgrammeScenes.tsx`, `.programme-scenes`, `.chapter-stack`, `.programme`, `.programme-copy` |
| Sticky frame/active chapter numbers | `.scene-enhanced`, `.sticky-scene`, `.scene-image`, `.scene-layer`, `.chapter-index`; activation behavior in ProgrammeScenes |
| Chapter photographs and dialogs | `src/ProgrammeScenes.tsx`, `src/PhotoGallery.tsx`, `src/PhotoCaption.tsx`, `.related-photo`, `.gallery-open`, `.gallery-expand` |
| Full-frame photo dialog | `.photo-dialog`, `.dialog-heading`, `::backdrop`; keyboard/focus behavior in PhotoGallery |
| Timeline and proposal cards | `src/Timeline.tsx`, `src/ExplorePage.tsx`, `.timeline-strip`, `.timeline-event`, `.activity-status`, `.opportunity-grid`, `.opportunity` |
| Demo entry/downloads/profiles | `src/ExplorePage.tsx`, `src/AppDemoPage.tsx`, `src/AboutPage.tsx`, `.app-demo-entry`, `.role-tabs`, `.pilot-banner`, `.downloads`, `.profile-spaces` |
| Sandbox appearance | `src/App.tsx`, shared CSS panel/form/workspace/course/study rules |
| Images, captions, dates and source links | `src/showcase.ts`; accepted files in `public/photos/` |
| No-JavaScript styling/copy | `public/static-story.css`, `scripts/generate-static-story.mjs` |
| Printable/download appearance | `scripts/create-documents.py`, `public/downloads/walkthrough.md` |

`src/style.css` has original app styles followed by the documentary and cinematic override blocks. Some selectors are defined more than once. Inspect the computed style and cascade before adding another override. If consolidating CSS, preserve sandbox selectors and all responsive/reduced-motion/print rules; avoid turning a visual request into an unrelated app refactor.

## Current dimensions and motion limits

| Behavior | Baseline |
|---|---|
| Main/header maximum width | 1440px; primary horizontal padding 5% |
| Desktop hero columns | 1fr copy / 2fr photograph, with 36px gap |
| Desktop scene threshold | At least 1024px, with IntersectionObserver available |
| Sticky scene | Top offset 32px; chapter articles normally at least 80vh |
| Crossfade | Opacity transition 500ms |
| Text reveal | One-time 24px entry, 600ms ease-out |
| Parallax | Container translation clamped to +/-24px |
| Standalone gallery | Removed from the rendered story; photographs are grouped within chapters |
| Mobile/tablet scenes | Ordinary stacked images and chapter text |
| Slideshow timing | Four seconds on desktop/mobile; continuous through hover, focus and manual selection; no pause control |
| Reduced motion | App setting plus OS preference disables chapter decoration; opening autoplay currently continues |
| Photo rendering | Full frames using contain; portrait/landscape images preserve original context |

These are implementation defaults from the accepted plan, not restrictions against the user's next explicit appearance instructions. If changing a limit or breakpoint, update both CSS/behavior and the tests/docs that assert it.

## Preserve during styling

- Keep the headline and leadership prominence unless the user requests new wording/composition.
- Keep roles, partners, source links and evidence caveats readable. A proposed activity must not become “delivered” through shorter promotional copy.
- Preserve complete photographic context, especially faces and mobility aids. Animate containers rather than cropping people. The group training photograph is not individually verified to show Gufwan.
- Keep captions outside animated scene containers and avoid automatic live announcements.
- Keep normal scrolling; no wheel/touch interception or required scroll snapping.
- Preserve the saved four-second slideshow, keyboard controls and swipe unless the user requests a behavior change. Hover, focus, manual selection and reduced motion currently do not stop it.
- Preserve modal accessible name, initial focus, Tab/Shift+Tab wrapping, Escape and focus restoration.
- Keep image intrinsic dimensions, lazy loading below the opening and readable image-failure captions.
- Respect Reduce motion and OS preference for new decorative motion. Content must remain visible; the current slideshow exception is documented above.
- Preserve no-observer and no-JavaScript readable stories. Do not hand-edit the generated noscript block in `index.html`.
- Keep the fictional sandbox, course completion/publication gates, language notices and independent-demo wording.
- Keep photograph records outside AI request context. Adding visuals should not expand server prompts or require credentials.
- No production dependency was added for the cinematic revision. Reuse current components/native browser tools where practical. A new dependency or deployment requires an appropriate authorised scope.

## Suggested next-session process

1. Read the handoff and inspect the live local preview. Review the user's new appearance direction, references and constraints. Do not assume the current design must be replaced entirely.
2. Identify the affected presentation areas and preserve current user edits. Inspect Git status and history before editing; the file snapshot is an additional comparison aid.
3. Implement the visual changes in the source files. Keep content, typography/layout and behavioral changes deliberate. Do not edit `dist/`.
4. Inspect desktop, tablet and 390px mobile layouts. Check captions, full frames, header wrapping, dialogue size and normal scrolling. For sticky redesigns, also check shorter viewport heights and enlarged text.
5. Run the smallest meaningful validation for the change. The full suite is appropriate if changing motion, gallery, global CSS or sandbox structure. Rebuild before checking the production preview.
6. If wording or downloads changed, update the static-generator prose and walkthrough/PDF source. Regenerate and visually inspect the introduction; keep it one page unless the user changes that requirement.
7. Update validation and handoff docs with the resulting design and any changed defaults. Delivery remains local until publishing becomes the user's request.

## Commands

Start the development server in one terminal:

```powershell
Set-Location -LiteralPath 'D:\AyubaGufwanDisabiliyt'
npm.cmd run dev
```

Use another terminal for checks:

```powershell
npm.cmd run typecheck
node scripts/browser-showcase.mjs
node scripts/browser-story.mjs
```

For a full visual/behavioral regression:

```powershell
npm.cmd run test:ui
npm.cmd run preflight
```

For a production smoke, build first and leave `npm.cmd run preview -- --port 4173` running in another terminal, then:

```powershell
node scripts/browser-production.mjs
```

For an introduction update:

```powershell
python scripts/create-documents.py
```

## Useful existing previews

| Artifact under `output/playwright/` | What it shows |
|---|---|
| `cinematic-opening.png` | Desktop opening with large NOA photograph |
| `cinematic-chapter.png` | Active education chapter beside its matched sticky photograph |
| `cinematic-dialog.png` | Landscape photograph modal |
| `production-portrait-dialog.png` | Portrait outreach photograph with full-frame context |
| `story-opening-390.png` | Mobile opening |
| `story-chapter-390.png` | Mobile stacked education chapter |
| `story-gallery-768.png` | Tablet chapter photographs |
| `story-1440.png`, `story-1024.png`, `story-768.png`, `story-480.png`, `story-390.png` | Whole-page responsive captures |
| `production-nojs-mobile.png` | Readable static mobile story |
| `learner-completion.png` | Completed fictional learner journey |
| `course-ha.png`, `course-yo.png`, `course-ig.png` | Translated course views |

The introduction review image is `output/pdf/introduction-1.png`. The original acquired-photo contact sheet is `output/documentary/contact-sheet.jpg`; it includes unused candidate frames as well as the accepted ones. The accepted ten-photo manifest is `docs/documentary-photo-manifest.json`.

## Small existing presentation debts

The access-bar separator was corrected in the saved revision. Some files appear garbled when read with an incompatible terminal encoding; use explicit UTF-8 before deciding the source text itself is damaged. The actual browser previews and PDF have been visually checked.

The no-JavaScript page has its own simpler stylesheet. Large full-page screenshots can be too tall to inspect comfortably; use viewport captures of individual sections. Automated checks cover specified widths but do not establish every short-landscape or enlarged-text combination. Keep that practical scope visible when reporting the next design's validation.

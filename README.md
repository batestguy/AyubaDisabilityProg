# Impact Mosaic

Independent React/TypeScript/Vite showcase and fictional learning sandbox by Jerry Bannister Zachary. No NCPWD endorsement is assumed.

For the next session, start with [SESSION-HANDOFF.md](SESSION-HANDOFF.md). The saved website revision is complete and validated; repository: [batestguy/AyubaDisabilityProg](https://github.com/batestguy/AyubaDisabilityProg). See the [appearance guide](docs/APPEARANCE-GUIDE.md), [architecture reference](docs/ARCHITECTURE.md) and [documentation index](docs/README.md).

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
- Three courses, 18 lessons and 14 assessment questions: src/catalogue.ts
- Experimental English/Hausa/Yoruba/Igbo journeys: src/i18n.ts and src/courseLanguages.ts
- Reviewed historical programme sources and five AI pilot cards: src/evidence.ts
- Bounded server-only Groq endpoint: functions/api/assist.ts
- Persistent shared free-budget limiter: worker/limiter.ts
- Downloads: public/downloads/introduction.pdf, partnership-proposal.pdf, walkthrough.md
- PDF generation: python scripts/create-documents.py (reportlab and pymupdf; rebuilds the one-page introduction only)

## Records and boundaries

Learners, courses, enrolments, discussion/mentoring/messages, assignment feedback and completion records share one state. sessionStorage isolates normal independent tabs and browser contexts. Closing the tab ends the sandbox. Reload preserves it; Reset restores seeds. Browser duplication/restoration can copy session storage; this is a demonstration, not secure account isolation. All perspectives deliberately see the same fictional records. There are no real accounts, database, video conference, delivered messages or NDMIS link.

Course completion requires every lesson, best quiz score >=70%, a submitted assignment and expert approval. Resubmissions require fresh review. Canonical skills update on completion. AI receives only allowlisted interests, skills, location and support preferences. Free text must remain fictional and non-identifying. It validates source IDs, not the factual entailment of every model sentence; human review remains necessary. AI never calls tools or sends messages.

Translation is experimental pending fluent-speaker review. Read-aloud uses an installed matching device voice; it reports when no voice exists. The homepage has eight sourced programme chapters and ten locally optimised, source-matched documentary photographs published by FMINO and The Qualitative Magazine. Desktop scroll scenes crossfade over 500ms, with 24px maximum parallax. Ten photographs appear within the chapters; there is no separate gallery section. Tablet/mobile use ordinary stacked chapters. App and OS reduced-motion preferences disable decorative chapter motion. The opening slideshow cycles every four seconds and currently continues through hover, focus, manual selection and reduced-motion settings; it has no pause control. Full frames preserve participants and mobility aids. Source URLs, captions and credits are in src/showcase.ts, separate from the AI request context. The Abia frame depicts the partner engagement; it does not show Gufwan.

The build generates a complete static no-JavaScript story in index.html from the presentation records, plus a documentary photo manifest at docs/documentary-photo-manifest.json. Photograph dialogs support Escape, focus trapping and focus restoration. Photograph acquisition can be reproduced with `python scripts/collect-documentary.py` (requests and Pillow); all accepted photographs have been visually inspected.

See docs/deployment.md and docs/validation.md for deployment and evidence.

## Browser validation

Start `npm.cmd run dev` in another terminal, then run `npm.cmd run test:ui`. Tests use an installed Google Chrome through Playwright, without downloading a browser. Screenshots and accessibility results are written under output/playwright. `npm.cmd run preflight` runs the smallest release checks (automated tests and typed production build).

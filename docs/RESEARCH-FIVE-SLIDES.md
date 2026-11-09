# Current opening: approved pathway and participation requirements — 9 November 2026

Five implemented slides: cover, clickable contents, verified James Ahumbe opportunity/proposal slide, illustrated pathway/database diagram with two documentary foundation photographs, and participation requirements with historical education meeting photo. Slide 4 replaces the biography/leadership portrait; slide 5 reframes the classroom title. Original photographs retained. See current shared source and latest handoff/validation. Historical layout descriptions follow below.

---

# Five Research slides — local owner review

Implemented 9 November 2026 using the approved [immersive redesign brief](RESEARCH-PRESENTATION-BRIEF.md). Slides 1–5 only; owner visual approval is pending. No commit, push, deployment or publishing.

Open `http://127.0.0.1:4175/?page=research` while the local production server runs, or `http://127.0.0.1:5173/?page=research` for development. Research navigation requests full screen from the click and replaces the entire site with a viewport iframe. Direct links and refused full screen remain usable. Exit/Finish return Home. The slide reading edition is `/research/reading.html`; the detailed proposal is `/?page=research-reading`. Both have return links.

The unity cover (updated with the owner’s requested visible crutch), six-part roadmap and three equal text/photo compositions use Segoe UI, #D24726, deep red and warm-gold accents. Photo frames are retained in full. Slide 3 uses the verified James Ahumbe/Beautiful Gate beneficiary photograph and acknowledges mobility support as a foundation for the proposed learning pathway; slide 4 the Gufwan leadership photograph; slide 5 the UBEC education meeting. All report dates, identity caveats and source links remain in the menu and reading editions. Exact copy and provenance are in the brief. Old generated illustrations are retained as unused assets.

`src/researchSlides.ts` is the shared typed cover/contents/split content source. `scripts/build-research-presentation.mjs` creates `presentation/research.qmd`, renders with Quarto, externalizes script/style blocks and copies output to `public/research/`. `deck.css` and `deck.js` supply presentation styling and manual controls. Do not edit generated HTML. Run:

```powershell
npm.cmd run build:research
npm.cmd run preflight
node scripts/serve-production-local.mjs
# Separate terminal:
node scripts/browser-research-presentation.mjs
```

Owner correction added a persistent Back button at bottom left, disabled on slide 1. Next stays at bottom right and becomes Finish on slide 5. The small slide count remains. Menu appears on pointer movement/focus, stays while focused and supplies slide selection, Previous, full screen, reading, proposal, sources/full images, accessibility and Exit. Native dialogs support Escape and focus return. Keyboard arrows/Page Up/Page Down/Home/End and horizontal swipes navigate; vertical gestures scroll. All content enters together in 220ms; reduced motion disables animation. A+ doubles deck text; phone/enlarged content can scroll inside the active slide. Read aloud uses current-slide copy; audible output depends on device voices.

Existing security headers remain: site DENY/frame-ancestors none, research SAMEORIGIN/frame-ancestors self, self-only scripts and external styles, runtime style attributes only under research. The parent exit listener checks both origin and iframe source. No production dependencies or stored-record schemas changed. Demo bytes are checked in the browser regression. The available original PowerPoint hash is recorded in the brief.

## Verification

Final results are recorded in `SESSION-HANDOFF.md` and [validation history](validation.md). Screenshot/PDF/JSON evidence is local and ignored under `output/playwright/research-*`. The focused browser script covers exact slide headlines, photographs, normal desktop fit, phone/200% layouts, dialogs/focus, full-screen entry/refusal/direct loads, menu/Finish/exit, keyboard/touch, reading/no-JavaScript/print, reduced motion, read-aloud text, saved bytes, errors/resources and production CSP. Review ends at five slides; await owner corrections before later content.

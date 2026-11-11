# Learning Sandbox story — 11 November 2026

Owner found the sandbox picture generic and chose two fixes: tell one learner's story, and show one large scene with the community chart smaller underneath. New `src/SandboxStory.tsx` shows a made-up learner, **Hauwa** (at home in Bukuru), and facilitator, **Nanle** (Jos), large and side by side, joined by a phone link (video lessons, voice notes, photos of her seams), then five steps that mirror the Research cycle: Reached, Needs understood, Matched, Practises, Reviewed. It is labelled "A made-up example · painted illustration, not a real participant". It reuses the existing sewing images (`remote-sewing-home-1-v4.webp`, `remote-sewing-facilitator-v4.webp`); no new images were generated, since this session had no image tool. The 14-portrait chart follows at a smaller size (`.sandbox-community` rules in `public/remote-learning.css`). The no-JavaScript story renders the same section. Checked at 1440 and 390 pixels wide with no sideways scrolling. Verified: 120 tests and build; browser-learning-navigation (first-screen check now looks for the story), browser-connected, browser-fresh-demo, browser-production, browser-story and accessibility (zero violations) pass.

---

# Main menu regrouped — 11 November 2026

Owner asked for **Home – Tribute to Gufwan**, then a visible **Possible Projects** heading over two clickable tabs, **Research** first and **Learning Sandbox** second, then **About**. Implemented in the app menu (labelled group for screen readers) and the no-JavaScript menu; styles keep the same order on phones with no sideways scrolling (checked at 1440, 1024 and 390 pixels wide). Menu assertions in the browser checks updated, plus a leftover story check that still expected the removed sandbox intro page. Verified: 120 tests, typecheck, build; browser-production, browser-story, browser-connected and accessibility (zero violations) pass; browser-learning-navigation passes its menu checks and stops only at the known research-article count (expects 5, deck now has 8). Sandbox and menu work committed and pushed; the research-slide edits below remain uncommitted.

---

# Learning Sandbox coherence pass — 11 November 2026

Owner asked whether the sandbox parts were coherent, then authorized all recommended fixes. Done:
- **One entry page.** The Learning Sandbox menu item now opens the sign-in page directly; the duplicate intro page (`src/ExplorePage.tsx`) is removed, and the no-JavaScript story has one sandbox section instead of two (`#static-app-demo` removed).
- **Older layers hidden, not deleted.** The Administration "View earlier demos" button and the recovery-screen link are gone. The earlier screens, guided teaching demo and original sandbox tools still open at `?workspace=earlier` for tests and history.
- **One name.** The current app's banner, recovery and reset wording say "Learning Sandbox"; the older screens no longer say "the separate learning sandbox" (now "the original sandbox tools").
- **Fresh start in Administration.** The Administration view now shows the full "Start a fresh demo" control in place of the partial "Reset connected sample workspace" button. It clears the current app and the older screens' records. The recovery screen keeps its own reset for damaged saved data.
- The menu now also highlights Learning Sandbox on the original tool pages; the footer stays hidden on the sign-in page under both addresses.

Verified: `npm.cmd run preflight` (120 tests, typecheck, build); browser-connected (10 audits), browser-fresh-demo (5 audits, production preview 4173), browser-production and accessibility pass. browser-learning-navigation passes everything up to a research check expecting 5 static research articles (now 8, from the separate deck work); its later sandbox no-JS checks were run separately and pass. Browser scripts were updated to drop the removed "Open the app demo" click. Not run: the other earlier-screen browser scripts. No commit, push or deployment.

---

# Current delivery: contents updated to the real slides — 11 November 2026

Owner found the table of contents out of date. It now lists **only the slides that exist**, i.e. every slide except the contents page itself (seven), in four groups:
- 01 Welcome & Opportunity: slides 1 and 3
- 02 Our Shared Vision: slide 4
- 03 Recruitment & Records: slides 5 and 6
- 04 The Cycle & Thanks: slides 7 and 8

All ten planned placeholders (Understand needs, Match teaching, Support practice, review, prototype, pilot, partnership) were removed, so the earlier 8–17 planned numbering no longer exists. The contents marker now also highlights the cover when you return from it. The retained participation slide object is still in shared source for possible later use. Reading edition and site no-JavaScript contents follow the same data.

Verified: preflight 120/120 tests and build; full browser regression passed 46 accessibility audits with zero errors; all seven contents links were exercised in order with keyboard, focus and return marker. Not committed yet at time of writing; not deployed.

---

# Current delivery: closing slide 8 and Nigeria framing — 11 November 2026

Owner asked for a closing slide with a celebratory photo of Gufwan and the Impact Mosaic mark ("the one on the first page of the slides"), and to remove anything Plateau-focused so the deck is framed for Nigeria. **Eight slides are now built.**

- **Slide 8 "Thank you" / "Success is achieved together."** Left: Ayuba Gufwan in his wheelchair with President Tinubu and Bill Gates, June 2025, when Gates dedicated his CFR national honour to Gufwan. Published by Inclusive News Network on 5 June 2025; the photographer is not named, and the image is used unchanged. The visible caption says it records Gufwan's recognition and is **not an endorsement of this proposal**. Source record: [slide 8 photo provenance](docs/research-slide-8-photo-provenance.json). Right: a short "together" message, three ticks, and the Impact Mosaic mark (cover artwork plus wordmark, tagline and co-creators). The closing slide is left out of the numbered contents, so the planned numbers 8–17 are unchanged.
- **Nigeria framing.** All 11 Plateau mentions in the deck's shared source were reworded (cover, contents section 5, pathway status and note, recruitment note and source label, database intro, status and note, cycle note). Slide 6 status now reads "Proposed participant database for Nigeria · Not the official national database". The site's research section summary reads "A proposed pilot for Nigeria". The deck data, reading edition and print contain no "Plateau". **Not changed:** about 40 Plateau mentions remain elsewhere in the site, mostly fictional sample learners and location tests, plus the pilot proposal page (6) and research data page (1), and older working documents. These are outside the deck and were left for the owner to decide.

Verified: preflight 120/120 tests, TypeScript and build. The full eight-slide browser regression passed 46 accessibility audits with zero page/CSP/resource errors and saved records unchanged. It now also checks that the deck contains no Plateau wording and that slide 8 has its photo source link and limit, and checks fit and control clearance at the short laptop sizes. Slide 8 was screenshot-checked at 1440×900, 1280×720, 1280×600, 1280×535, 1266×505, 1024×600 and phone, and printed. Owner review of slides 5, 7 and 8 is next.

**Git (11 November 2026):** committed as `0ab56d3` (“Add database, cycle-complete and thank-you slides; frame deck for Nigeria”) and pushed to `origin/main` (`dfe006a..0ab56d3`). The working tree was clean after the push. The commit also carries all earlier uncommitted work since `dfe006a`: the database slide 6, the slide 5 revisions, slide 7, slide 8, the Nigeria framing, and their working records and docs. **Not deployed.** Deployment remains a separate manual Cloudflare Pages step (`wrangler pages deploy dist --project-name ncpwd-impact-mosaic --branch main`), and its login was last found expired. Older entries below that say “no commit/push” describe their own time.

**Next steps:**
1. Owner reviews slides 5, 7 and 8 in the browser. Run `node scripts/serve-production-local.mjs` and open `http://127.0.0.1:4175/?page=research`; press End for slide 8.
2. Owner decides whether to keep the slide 8 photo, which includes President Tinubu and Bill Gates, or to look for a photo of Gufwan alone.
3. Owner decides whether to replace the ~40 Plateau mentions outside the deck. These are in the demo sample data, the pilot proposal page (6) and the research data page (1).
4. Publish only on request. Run `npm run build:research` and `npm run build`, then `wrangler pages deploy dist --project-name ncpwd-impact-mosaic --branch main` after a fresh Cloudflare login.

---

# Current delivery: clearer slide 5 and new slide 7 — 11 November 2026

Owner asked what adaptive snowball sampling actually does, wanted slide 5 said better with more visuals, and asked for a brief slide 7 on how the cycle completes and restarts. Slide 6 approved unchanged. **Seven slides are now built.**

- **Slide 5** now shows three rounds of dots instead of four text stages: varied trusted contacts → referrals spread but one group stays "Not reached yet" → a new starting contact inside that group, then "Next round" back to Round 1. Key line: "Each round shows who our networks reach — so we can go looking for who they miss." The snowball/adaptive distinction and the limit ("People with few connections may need other routes.") are visible. The formula is smaller under "How we learn from each round", with the popup unchanged. Sadler 2010 and Magnani 2005 are added as sources. The slide does not claim representativeness or respondent-driven sampling. Record: [recruitment working record](docs/RESEARCH-RECRUITMENT-WORKING.md), final section.
- **Slide 7** "One cycle complete — the next one starts better informed": five stages on a ring around the database, each showing goal → need met, and a bold restart arc fed by progress evidence and participant and facilitator feedback ("What worked continues. What didn't, changes."). Status line: proposed, no results yet, measures agreed during pilot design. Record: [cycle-complete working record](docs/RESEARCH-CYCLE-COMPLETE-WORKING.md).

Current order: 1 cover; 2 contents; 3 opportunity; 4 full cycle; 5 adaptive snowball recruitment; 6 participant database; 7 cycle complete and restarts. Planned: 8 understand needs; 9 match teaching; 10 support practice (retained participation slide); 11–15 review, prototype and pilot; 16–17 partnership. Later numbering stays provisional. Contents has five available destinations, ten planned topics and six groups. Slide counts in the reading edition, the site no-JavaScript page and the deck's no-JavaScript link now follow the data instead of being hard-coded.

Verified: preflight 120/120 tests, TypeScript and production build. The full seven-slide production-CSP browser regression passed 43 accessibility audits with zero page/CSP/resource errors and saved records unchanged. Fit and control clearance were checked for slides 5 and 7 at six window sizes (1440×900, 1280×720, 1280×600, 1280×535, 1266×505, 1024×600). Phone, 200% and A+ layouts were checked. Seven-page print was checked and both new slides were inspected visually. No commit, push or deployment. Owner visual review of slides 5 and 7 is next.

---

# Current delivery: participant database slide 6 — 10 November 2026

Owner authorized an illustrated database slide after recruitment. **Six slides are now built.** Slide6 acknowledges Gufwan’s national data ambition with the exact dated TheCable quote and linked interview (15 November2025), plus a separately credited FMINO leadership photograph. Curved gold arrows carry recruitment records into a native illustrated database cylinder with skills/interests, learning goals, access/support needs and agreed pathway/progress, then branch toward needs, teaching, support and review. Labels and notes distinguish our proposed Plateau participant database from the national database and historical collection work. No real participant records, numerical outcomes, national integration or official partnership is claimed.

Current order:1 cover;2 contents;3 opportunity;4 full cycle;5 adaptive snowball recruitment;6 participant database. Next planned stages:7 understand needs;8 match teaching;9 support practice;10 monitor/review. Later numbering remains provisional. The original participation material is retained in shared source for planned9. Contents now has four available destinations, ten planned topics and six groups. Reading/static/no-JS/read-aloud/print counts and content are synchronised. Owner visual review of slide6 is next. No operational database/data/dependency changes, commit, push or deployment.

Fresh preflight passed120 tests, TypeScript and production build. Desktop/laptop six-window geometry and six-page print text/render checked. Full six-slide production-CSP browser verification passed36 accessibility audits, with zero page/CSP/resource errors and unchanged saved records; enlarged-phone wrapping is corrected. Final receipt: [database working record](docs/RESEARCH-DATABASE-WORKING.md). Brave opened on slide6 using actual1280×535 window dimensions. This supersedes older five-slide limits and previous continuation pointers below.


Latest owner addition: replace “Agree support” with **“Plan support together”**. The database graphic now has separate Learners / Adaptive snowball recruitment and Facilitators / Volunteering or recruitment routes merging into the database. Four concise record groups distinguish learner goals/access needs, facilitator skills/availability and agreed pathways/progress. Supporting text explains that teaching scope is reviewed before matching and that agreed support is a plan, not confirmed delivery. No operational profiles/accounts/data changed.

Facilitator/support update verification: TypeScript/build and full36-audit browser regression passed; six-window layout and six-page print checks passed. Brave refreshed on slide6; owner review next.

Latest owner readability correction: enlarged typography on database slide6, including route roles/descriptions, database labels, outcomes, quote and attribution. At actual1280×535: record labels17.6px, outcomes16px, role labels16.8px, route descriptions13.6px. Tightened arrow/padding space and placed outcome icons beside labels in short windows. Six normal window geometries and focused laptop/phone/200% accessibility checks pass; six-page print keeps wrapped labels. Other slide typography unchanged.

---

# Current visual revision — 10 November 2026

Owner found the first recruitment slide cluttered and authorized a clearer, more engaging diagram. Slide 5 now uses the red canvas, a prominent full-frame credited photograph and acknowledgment, four short vertical stages with native SVG concept icons/gold arrows/return loop, one clickable Bayesian equation, and the question and its answer directly above the diagram. Repeated panel headings, numbering, cream card and visible gap list removed; full distinctions/gap cautions remain in the exact shared popup/reading/read-aloud text. No invented numerical results; diagram is conceptual. Existing five-slide/preservation boundaries remain.

Brave reopened on slide 5 using actual window dimensions (1280×535), correcting the earlier fixed-preview clipping. Current regression passed 29 accessibility audits, no page/CSP/resource errors and unchanged stored bytes. Final targeted checks cover complete-slide/control clearance and popup/focus at 1440×900,1280×720,1280×600,1280×535,1266×505,1024×600. Five-page PDF text and rendered slide checked. Next: owner visual review; no commit/push/deployment. [Working record](docs/RESEARCH-RECRUITMENT-WORKING.md). Earlier layout descriptions below are historical.


Latest owner correction: the question now leads directly into the right-hand recruitment graphic: “Who are we missing—and how can we reach them?” followed by “Adaptive snowball recruitment helps us investigate gaps and adjust outreach.” The detached footer is removed. Shared reading/read-aloud/static/print outputs include both lines.


Popup wording approved and shortened: “How each round helps us learn” now gives four brief plain-language steps. Symbol definitions are collapsed under “What the symbols mean”; proposed-model/team-decision status stays visible. Definitions/status remain in reading, static and read-aloud outputs. Keyboard focus includes the expandable summary and Close; opening another explanation resets/hides the definitions appropriately. Brave opened on slide5 with the shorter equation explanation visible.


Owner follow-up: question and answer above the graphic now have stronger emphasis (750/650 weight). Compact popup/default-collapsed keyboard symbols, all accessible editions and six window-fit checks verified. Final preflight120 tests/typecheck/build and full browser regression29 audits passed with zero errors/CSP/resource failures and unchanged records.

---

# Recruitment slide built for review — 10 November 2026

User authorized implementation after discussing the final layout. **Slide 5 is now Adaptive snowball recruitment**, with the full-frame Otukpo photograph and partner/source credit, short acknowledgment, four-step referral/review/adjustment loop, potential gaps to assess together, and a clickable Bayesian equation opening the existing side thought bubble. The equation is a proposed refinement, not a fitted model. Current method wording is synchronised across opportunity/cycle/contents and reading/static/read-aloud outputs.

Five working slides remain. The original participation slide is preserved unchanged as `retainedParticipationSlide` in shared source for future Support practice (planned position 8), not rendered as an out-of-order sixth slide. Contents now follows the cycle with three available destinations and ten planned topics; later numbering remains provisional. Detailed recruitment/mathematical evidence remains in supporting notes. Needs, teaching, practice and monitoring slides remain planned.

Validation: 120 tests, TypeScript and production build passed; full production-CSP browser regression passed 27 accessibility audits, keyboard/popup/phone/A+/200%, reading/no-JS/read-aloud/print structure and unchanged saved records, with zero page/resource/CSP errors. Final print-only colour/position corrections were checked by a fresh five-page PDF, text extraction and rendered slide-5 visual inspection. Existing non-failing bundle-size advisory remains. Preview opened visibly on slide 5 at http://127.0.0.1:4175/research/index.html; select the equation for the explanation. **Next: owner visual review and corrections before another stage slide.** No commit, push, deployment, new dependency or operational-data change.

[Implementation and verification record](docs/RESEARCH-RECRUITMENT-WORKING.md). This delivery supersedes earlier documentation-only/no-implementation instructions below for this authorized slide.

---

# Agreed method and next discussion — 10 November 2026

Use **adaptive snowball recruitment**: voluntary participant referrals through trusted connections, monitored recruitment evidence and deliberate adjustments to later recruitment. Retain complementary accessible routes. Bayesian modelling is optional; the method does not itself establish population representativeness. Verify existing practices with Gufwan rather than assuming his team lacks records or adaptation.

[Full agreed method, comparison with documented outreach, research examples and limits](docs/RESEARCH-CONTENTS-AND-RECRUITMENT-PLAN.md#agreed-method-adaptive-snowball-recruitment--10-november-2026). Sweden provides an explicit adaptive-snowball precedent; Texas supports snowball engagement and Germany complementary routes. Neither is a direct test against Gufwan's outreach; superiority is unproven. **Next: discuss what appears on the slide.** Previous title/copy suggestions are provisional. Documentation only: current deck/source labels remain unchanged; future implementation must use the agreed term throughout. No slide implementation, generated outputs, operational changes, commit, push or deployment in this checkpoint. This instruction supersedes conflicting continuation statements below; dated implementation evidence remains historical.

---

# Current handoff: cycle-first slide sequence — 10 November 2026

After the complete cycle on slide 4, explain each stage in order: **5 Adaptive snowball recruitment; 6 Understand needs; 7 Match teaching; 8 Support practice; 9 Monitor & review**, then the prototype, Plateau pilot design and partnership. Next discuss the title, visible content and visual treatment of the adaptive snowball recruitment slide.

Keep the cover, approved opportunity slide and cycle overview. Update contents when implemented; move the existing participation slide to Support practice rather than discard it. Reuse recruitment research/mathematics in supporting notes, learning-pathway material in stages 2–4, and monitoring evidence in stage 5 plus later pilot-measure agreement. Every stage explains what happens, what is recorded, which decision it informs and the connection to the next stage. Records support participant/facilitator decisions.

[Full current composition, retained material and implementation boundary](docs/RESEARCH-CONTENTS-AND-RECRUITMENT-PLAN.md#current-continuation-explain-the-cycle-stage-by-stage--10-november-2026). This replaces the old topic-led order, old slide-5 continuation and fixed later-slide numbers (including KPI slide 20). Entries below are dated history where they conflict. Later numbering/total are not fixed. Documentation only: the actual deck still has five slides and its old contents/participation slide. No presentation or operational data changed. Discuss slide content before later implementation of new slide 5 and owner review before building further stages; no commit, push or deployment in this checkpoint.

---

# KPI placement in the planned presentation — 9 November 2026

Owner asked where monitoring KPIs belong and requested updating the handoff and slide documents. Main location is **slide 20, Decide what success means**, in **Designing a Plateau Pilot**. Suggested visible lead: **How we will know it is helping.** Four proposed areas: outreach reach/gaps; suitable teaching and agreed support; learning progress and demonstrated skills; participant experience and feedback. Explain the feedback loop from evidence and participant discussion to agreed changes and another review. Agree definitions, cohorts/denominators, baseline, targets, data sources, review responsibilities and frequency during pilot design. Do not invent figures or imply achieved results.

Slide 13 covers recruitment evaluation; slide 4 introduces the database and feedback cycle; slide 21 uses agreed evidence in readiness decisions; slide 22 covers shared evidence and learning. No renumbering or new slide is required. The current next working slide is still slide 5, Participation needs more than registration. Only five slides are implemented; slide 20 and all slides 6–24 remain Planned. Full brief: docs/RESEARCH-CONTENTS-AND-RECRUITMENT-PLAN.md, KPI placement and monitoring brief. Matching checkpoints added to docs/RESEARCH-PRESENTATION-BRIEF.md and docs/RESEARCH-FIVE-SLIDES.md. This update changes planning documents only.

The completed thought-bubble implementation and preceding handoff were committed and pushed as 64afbbac6effd44c8e27df56c0e7522a33265f99 to batestguy/AyubaDisabilityProg main; remote receipt matched and working tree was clean. Fresh preflight passed 120 tests, TypeScript and build. Prior browser verification passed 22 accessibility audits plus keyboard, phone/200%/A+, print and saved-record checks. No deployment or operational database changes.

---

# Clickable thought explanations and extension heading — 9 November 2026

Implemented six exact shared explanations for the five cycle stages and central participant database. Native buttons open one cream thought bubble with title, explanation and Close. Owner steered from a centred panel to a cartoon thought beside the item: implemented rounded bubble, two thought circles, transparent backdrop and adaptive left/right or above/below placement. Keyboard Enter/Space, contained Tab focus, Close/Escape/outside dismissal and exact focus return work; deck keys, controls and swipes are inactive while open. Phone/A+/200% views stay within viewport with inner scrolling. Enlarged Proposed extension, smaller Designed together and instruction occupy their own heading row; gold arrow connects the unchanged documentary foundation. Database hub, adaptive-sampling emphasis and closed circle preserved. Exact explanations are reused in reading, no-JavaScript and read-aloud; detailed notes retained. Print hides thought and interaction cues while preserving labels/ring.

Existing revisions were committed and pushed FIRST: b17db5659239b935a1d1108b0fe37d4bdb295bca on verified batestguy/AyubaDisabilityProg main; ls-remote matched. Owner has now authorized committing and pushing all completed thought-bubble changes and this updated handoff to the same verified repository and branch. This supersedes earlier local-only delivery notes. The delivery commit contains this entry; its remote receipt is verified after pushing. No deployment, production dependency, operational database or stored-record changes. Working record: docs/RESEARCH-EXPLANATIONS-WORKING.md. Final repository preflight passed 120 tests, TypeScript and build; existing non-failing bundle-size advisory remains. Browser checks passed 22 accessibility audits, six exact explanations, keyboard/focus/close routes/navigation/swipes, desktop/phone/A+/200%, reading/no-JS/read-aloud/print and unchanged saved bytes, with zero page/resource/CSP errors. Final print-arrow positioning check and full 22-audit browser rerun passed. Visible preview left on slide 4 with Adaptive sampling thought open. Screenshot output/playwright/research-thought-preview.png; printed cycle output/playwright/research-thought-print.png.

---

# Slide 4 steering: database informs every subsequent decision — 9 November 2026

Owner requested reduced clutter and clarified that after recruitment/adaptive sampling everything comes from the database. Central hub now explicitly says “Participant database / Records inform every decision”. Adaptive sampling is the highlighted recruitment node, feeding records in and using recorded evidence to guide the next round. Five spokes make the database-to-decision relationship visible; circular ring and updates preserve continuous feedback. Removed numbering, repeated stage descriptions and duplicate feedback panels from the on-slide view. Full detailed records and two evidence uses remain in reading/read-aloud/source notes. Caption: recruitment builds database, records guide decisions, progress updates database. Human decisions remain with learners/facilitators. Documentary collage and large labels preserved. COMPLETE locally: Quarto/static/reading outputs regenerated; fresh preflight passes 120 tests, TypeScript and production build. Production-CSP browser regression passes 15 audits and checks central database, five spokes, closed ring, adaptive-sampling emphasis, source images, desktop/phone/A+/200% text, navigation/exit and saved-record preservation. Zero page errors, failed resources or CSP violations. Five-page PDF text checked for hub, all decisions and repeated feedback; rendered page 4 and desktop screenshot visually inspected. Browser refreshed to slide 4. Existing non-failing Vite bundle advisory remains. No commit, push or deployment requested.

---

# Slide 4 closed adaptive cycle — 9 November 2026

Owner requested a genuinely circular, continuing feedback cycle, with adaptive sampling as the selling point. Replacing linear arrows with a closed circular SVG ring and five clockwise stages around a central “Adaptive sampling / Each recruitment round informs the next” hub and explicit participant database. Final stage is “Review & adapt”; return to the next recruitment round is explicit. Recruitment evidence informs outreach; learning progress adjusts teaching/support. Loop represents programme improvement, not compulsory indefinite participation. Documentary collage, small illustrations, large stage labels and all previous records retained. Desktop radial layout; phone gets a closed-ring overview and readable stage details. Print CSS consolidated with pathway styles to avoid prior override accumulation. Build/checks/visual verification pending. No commit, push or deployment requested.

---

# Slide 4 larger documentary collage and text-first extension — 9 November 2026

Owner requested retaining both foundation photographs as one larger collage using available original resolution, shrinking the extension illustrations and enlarging text/main ideas. They also approved the suggested extension polish. Implementing full-frame contiguous documentary collage, original publisher JPEGs (mobility 1080×720; education 950×633), smaller scene illustrations, larger stage labels and summaries, “Understand skills & needs” / “Match teaching”, prominent database and explicit recruitment-evidence→outreach / learning-progress→support feedback headings. Full stage detail stays in shared source for reading/read-aloud. No new claim of an education agreement: visible caption remains inclusive-education discussion. Provenance: `docs/research-foundation-photo-provenance.json`. No generated enhancement of documentary images. Previous slide 3 wording and slide 5 retained. COMPLETE locally: Quarto/static/reading outputs regenerated; fresh preflight passes 120 tests, TypeScript and production build. Production-CSP browser regression passes 15 accessibility audits, verifies original-photo widths, stage labels at presentation size, secondary illustration size, desktop/phone/200% layouts, sources, navigation/exit and unchanged saved records. Zero page errors, failed resources or CSP violations. Five-page print PDF verified to contain all five stages, explicit database and feedback labels; desktop and printed slide 4 visually inspected. Browser refreshed to slide 4. Existing non-failing Vite bundle advisory remains. No commit, push or deployment requested.

---

# Slide 4 visual revision — 9 November 2026

Owner found the first native diagram too bland, chose an illustrated journey, then requested real photographs specifically in “Building on your work”. Implementing five conceptual SVG scenes (community, needs profile, learning connection, practical tools, progress review) on a connected route; no invented participant or performance records. Foundation band includes two existing verified documentary photographs: Beautiful Gate/Senator Abba Moro partnership mobility devices and Gufwan’s UBEC education discussion. Full original frames retained, labels visible, original source/partner context in Sources and reading edition. Explicit database and two distinct feedback loops preserved. Source slide remains five of planned 24; no new dependency, storage change or publication. COMPLETE locally: Quarto/static/reading outputs regenerated; preflight passes 120 tests, TypeScript and production build. Illustrated presentation regression passes 15 accessibility audits, five stages, two full-frame foundation photos, sources, responsive/200% text, read-aloud, navigation/exit and unchanged saved records. Zero page errors, failed resources or CSP violations. Print engine overrides were inspected after initial fixes were insufficient; final specific overrides verified by a five-page PDF, extracted text containing all stages/database/both loop details/final status, and rendered page-4 visual inspection. Desktop screenshot `output/playwright/research-slide-4.png` visually inspected. Visible browser refreshed to slide 4. Non-failing existing bundle advisory remains. No commit, push or deployment. All earlier approved slide 3 text and records preserved.

---

# Approved opening progression: slides 4–5 — 9 November 2026

Owner authorized the agreed narrative revision. Slide 4 becomes “Building on your work: from outreach to learning”: existing community foundation → five-step proposed pathway → participant database → two distinct feedback loops (recruitment evidence to outreach; learning progress to teaching/support). Diagram replaces the leadership photograph on this slide; original image retained. Use native text/list diagram, existing red/white/gold, numbered stages, database strip and quiet feedback panels; no decorative photograph or new dependency. Slide 5 becomes “Participation needs more than registration.” and covers teaching/facilitator capacity, communication/formats, devices/connectivity where needed and support agreed with participants. Keep historical education meeting image and its context. Contents, read-aloud and reading/static editions must match. Five slides only; preserve slide 3 approved copy and all prior records. No commit, push or deployment requested. Implemented and fresh preflight passed 120 tests/TypeScript/build; initial production presentation regression passed 15 audits. Additional PDF visual check found print CSS overriding the diagram grid and clipping the database/last stages; print-only correction and regression checks added, verification pending. Owner then said slide 4 is too bland and requested stronger visuals. Proposed illustrated journey or documentary blend; preference question pending. Preserve the approved foundation/pathway/database/two-loop content while refining visual expression.

---

# Commit-and-push delivery; next review is slide 4 — 9 November 2026

Owner authorized committing and pushing the accumulated methodological-refinement contents update, verified James Ahumbe photograph/provenance and approved final slide 3 wording. Destination rechecked: `batestguy/AyubaDisabilityProg`, `main`; authenticated as `batestguy`. This supersedes local-only/no-commit notes in the checkpoints below. Latest code already passed fresh preflight (120 tests, TypeScript, build), 15 production-CSP presentation accessibility audits and all documented regression checks. Only delivery notes changed afterward. No deployment requested.

Next: discuss critique and proposed revision of slide 4, currently “Gufwan’s story connects mobility with opportunity.” Its generic community-support wording repeats slide 3 and contains no actual story. Existing leadership photograph is verified but depicts speaking at a table, not beneficiary outreach. Preserve slide 4 until owner agrees revised wording or visual direction. Remote receipt reported after push verification.

---

# Slide 3 approved wording polish — 9 November 2026

Owner approved the exact three-paragraph revision acknowledging Beautiful Gate, proposing adaptive sampling and a participant register of skills/interests/learning needs, and connecting suitable teaching with monitoring progress and adjusting support. Applied in the shared slide source; headline, verified James Ahumbe photograph and source caption preserved. Exact text is at the top of `docs/RESEARCH-PRESENTATION-BRIEF.md`. No extra pathway graphic added; the approved three paragraphs are the slide copy. Complete locally: Quarto/static/reading outputs regenerated; fresh preflight passes 120 tests, TypeScript and production build. Production-CSP browser regression passes 15 accessibility audits, desktop/phone/200% text and all navigation/exit/source/reading/no-JavaScript/print/data-preservation paths. Zero page errors, failed resources or CSP violations. Slide 3 screenshot visually inspected; visible browser refreshed to slide 3. Existing non-failing bundle-size advisory remains. Preserve all pending earlier contents/model/photo updates; no commit, push or deployment requested for this continuation.

---

# Slide 3: verified Beautiful Gate beneficiary — 9 November 2026

Owner agreed replacing the unrelated Shell LiveWIRE image with a verified Gufwan/Beautiful Gate beneficiary and acknowledging his achievements while foreshadowing the learning sandbox. Research identified James Ahumbe, a cobbler and replacement-tricycle recipient, in Wheelchairs for Nigeria’s July 2023 newsletter, page 3. Original embedded JPEG extracted unchanged from image object 53; named portrait and paragraph visually checked. The photograph shows him with the tricycle, not practising shoemaking. This limitation was explained to the owner during work. No claim Beautiful Gate taught his trade. New caption credits the publisher and links the page. Source context, limits and checksums: `docs/research-slide-3-photo-provenance.json`. Earlier image preserved unused. Slide 3 now acknowledges mobility support and proposes accessible learning, supported practice and follow-up. Other slides unchanged. Previous contents/model refinements remain local. COMPLETE locally: Quarto/static/reading outputs regenerated; fresh preflight passes 120 tests, TypeScript and production build. Production-CSP presentation regression passes 15 accessibility audits, desktop/phone/200% text, full-frame photo loading, navigation/exit, sources/reading/no-JavaScript/print and exact saved-record preservation. Zero page errors, failed resources or CSP violations. Slide 3 screenshot visually inspected at `output/playwright/research-slide-3.png`; visible preview opened for owner review. Existing non-failing Vite bundle-size advisory remains. No commit, push or deployment requested for this continuation.

---

# Methodological refinement and contents polish — 9 November 2026

Owner requested documenting the explicit two-slide refinement, updating the contents and showing the full mapping in the terminal before continuing slide polish. Slides 11–12 in Section 3 now read “From community outreach to a measurable recruitment process” and “A model that learns and guides the next round”. Full briefs, comparison table, Bayesian updating principle, proposed workflow and limitations are in `docs/RESEARCH-CONTENTS-AND-RECRUITMENT-PLAN.md`. Total remains 24 planned slides; five working slides remain, with 6–24 Planned. Suggested next polish discussion: slide 3; preserve existing wording and documentary photo until owner requests changes. This update does not author later slides, fit a model, collect data or authorize fieldwork. Previous completed push is `549f952`; this continuation is local pending any further delivery request. Completed locally: Quarto and static/reading editions regenerated; fresh preflight passes 120 tests, TypeScript and production build. Focused presentation regression passes 15 accessibility audits including phone/200% text and all prior navigation/exit/data-preservation paths. Zero page errors, failed resources or CSP violations. Updated mapping checked: each planned slide 3–24 appears exactly once. Existing non-failing Vite bundle-size advisory remains. Local preview refreshed; no commit, push or deployment for this continuation.

---

# Commit-and-push authorization — 9 November 2026

Owner requested committing and pushing the completed clickable Table of Contents, revised hairstyles, visible central exit, generated presentation/static outputs and supporting documentation to the verified origin `batestguy/AyubaDisabilityProg`, branch `main`. This supersedes local-only/no-commit notes in the checkpoint below. No deployment requested. Preflight and browser evidence recorded below remain current; only delivery notes changed after verification. Next discussion: photographs and diagrams for the remaining slides; no new photo acquisition or later-slide implementation requested yet. Push verification is reported in the delivery response.

---

# Clickable contents implementation — 9 November 2026

Owner authorized the contents-first plan: rename slide 2, six single-open sections, exact 3–24 mapping, live slides 3–5, remaining topics Planned, persistent Contents return/highlight, reading parity. Five slides remain; no later-slide authoring, publication, commit or push.

Design intent: partnership audience chooses depth during a presentation. Existing red/deep-red, white and gold; Segoe UI; six numbered native disclosure rows, 8px spacing rhythm, quiet separators, gold number hierarchy, generous readable links. Domain: community relationships, recruitment, accessible learning, pilot and partnership. Signature: section numbers distinct from slide destinations; avoid dashboard cards, tiny navigation and decorative photography on contents.

Implemented shared mapping, native expandable contents, built-slide links, return/current highlight, reading/static parity and responsive controls. Owner then requested a skin cut (wheelchair user), low cut (sunglasses/white-cane user), and visible bottom-centre Exit presentation. Edited artwork is `public/impact-mosaic-unity-haircuts.png`; original retained. Header, favicon, cover and reading/static paths updated. Added visible exit using existing exit flow. COMPLETE locally: Quarto regenerated; fresh repository preflight passes 120 tests, TypeScript and production build. Focused production-CSP browser regression passes 15 accessibility audits, native disclosures, exact 3–24 mapping, live jumps, planned items, return/current focus, phone/200% layouts, keyboard/touch, visible exit/fullscreen and unchanged saved records. Zero page errors, failed resources or CSP violations. Artwork is 1254×1254 RGBA with transparent pixels, visually inspected. Screenshots: `output/playwright/research-contents-collapsed.png`, `research-contents-expanded.png`, `research-slide-1.png`; responsive and PDF evidence also saved there. Browser `mosaic-review`, tab 1, local preview open. Non-failing existing Vite bundle-size advisory remains. No commit, push or deployment. Existing historical notes below remain chronological evidence.

---

# Resume here: caption and recruitment-research planning checkpoint — 9 November 2026

The owner is leaving this task to do other work and explicitly requested **documenting the handoff, committing and pushing all pending updates**. This supersedes the local-only/no-new-commit notes in the historical entries below. Destination: `batestguy/AyubaDisabilityProg`, `main`. No deployment is requested.

## Delivered and ready to resume

- Five working Research slides, immersive full-screen entry, visible Back/Next/Finish, menu, reading/source/accessibility paths and the revised crutch logo were delivered in pushed commit `11ba0a5`.
- The pending follow-up adds a small caption beneath slide 3’s photograph: **Mbuotidem Okorie · Shoemaker, Nigeria**, credit **Shell LiveWIRE / BellaNaija**, with a linked **BellaNaija, 2014** source. Original photo and full source context remain. This is not a Gufwan-project photograph.
- [Researched contents and recruitment plan](docs/RESEARCH-CONTENTS-AND-RECRUITMENT-PLAN.md) records a proposed six-section, 24-slide presentation, method options, evidence, pilot comparisons and measures. The live roadmap is unchanged and slides 6–24 are not implemented.

## Owner decisions to preserve

1. Primary purpose: **secure a Plateau pilot partnership and technical scoping discussion**.
2. Appreciate Gufwan’s existing community outreach and practical experience. Present our work as a complementary academic/statistical extension, with roles agreed jointly.
3. Make the central research contribution concrete: **show how statistical sampling methods could improve recruitment**. Cover planned starting contacts, adaptive referral waves, complementary accessible routes and adaptive allocation of recruitment effort, including a Bayesian option to investigate.
4. Document his actual current procedure with his team before assigning formal sampling labels or choosing additions. Proposed benefits must be evaluated; no recruitment gains or population estimates have been measured here.
5. Keep learner/facilitator matching and accessible teaching connected to the recruitment story. Start with Plateau; national reach is a longer-term ambition.

## Proposed contents awaiting discussion

1. The foundation and shared vision.
2. The community approach we can build on.
3. Statistical methods to strengthen recruitment — the central section.
4. From recruitment to accessible learning.
5. Testing the approach in Plateau.
6. A partnership to take the next step.

When the owner returns, review these titles and the method sequence in the planning document first. Then agree the next slide batch before implementation. Keep ordinary registration distinct from any optional research sample; define measures, frames and comparison designs before claiming improvements or representativeness. No fieldwork, participant recruitment, real data collection or new operational partnership is authorized by this checkpoint.

## Resume and verification

Local review: `http://127.0.0.1:4175/?page=research`. Server: `node scripts/serve-production-local.mjs` after a production build. Development: `npm.cmd run dev`, then `http://127.0.0.1:5173/?page=research`. The headed Chrome session was `mosaic-review`, tab 1, but browser/server processes may need reopening. Screenshots and verification JSON are ignored local artifacts under `output/playwright/research-*`.

Shared content: `src/researchSlides.ts`; generator: `scripts/build-research-presentation.mjs`; source/runtime: `presentation/research.qmd`, `public/research/deck.css`, `public/research/deck.js`. After content edits, run `npm.cmd run build:research`, then `npm.cmd run preflight`. Browser regression: `node scripts/browser-research-presentation.mjs` against the local production server.

The caption revision passed Quarto regeneration, repository preflight (120 tests, TypeScript and build), ten presentation accessibility audits, full presentation/reading/no-JavaScript paths, 200% phone caption placement and zero product errors/resources/CSP violations. Saved demo bytes remain unchanged. Fresh handoff preflight also passed all 120 tests, TypeScript and production build; local document links resolve. The verified push receipt is reported in the delivery response. The existing non-failing Vite bundle-size advisory remains.

Original PowerPoint and original logo assets are preserved. No new production dependency or storage schema change. The next action is owner discussion of the proposed contents and sampling contribution, not automatic construction of the remaining deck.

---

# Historical discussion: contents and statistical recruitment improvements — 9 November 2026

The owner requested a fresh page with all updates and a researched table of contents. A fresh browser tab (`mosaic-review`, tab 1) shows the current local deck, including the visible opportunity-photo caption. They selected **Plateau pilot partnership and technical scoping** as the main outcome and clarified that the research should appreciate Gufwan’s existing work and show how statistical sampling methods can improve recruitment.

Planning artifact: [six-part contents, 24-slide proposal, sampling methods and evidence](docs/RESEARCH-CONTENTS-AND-RECRUITMENT-PLAN.md). Document the existing procedure with his team, then discuss planned starting contacts, adaptive referrals, accessible complementary routes and adaptive allocation. The proposal defines pilot measures/comparisons and distinguishes practical registration from formal probability/network sampling. Local adaptation and evaluation are prospective academic contributions; gains are hypotheses, not measured results.

Planning only: later slides, the live roadmap and runtime are unchanged. Immediately preceding successful preflight/browser checks still apply. No new commit, push or deployment. The visible-caption follow-up remains local after pushed commit `11ba0a5`.

---

## Visible photo caption — 9 November 2026

Owner requested a little name, source and credit beneath the opportunity photograph. Slide 3 now has a small two-line caption naming Mbuotidem Okorie as a Nigerian shoemaker, crediting Shell LiveWIRE / BellaNaija and linking BellaNaija’s 2014 source. `displayCredit` in the shared image record drives the generated figure/figcaption. Full attribution remains in Sources and reading editions. Quarto regenerated; typed build and ten focused presentation accessibility audits pass, with zero product errors, failed resources or CSP violations. Local review browser reloaded to slide 3. This caption follow-up is local and is not included in the previous pushed commit `11ba0a5`.

# Commit-and-push delivery — 9 November 2026

The owner authorized committing and pushing the accumulated five-slide redesign and requested a skill-in-action photograph for “Talent is everywhere”, preferably from Gufwan’s projects. This supersedes earlier no-commit/no-push instructions below; deployment remains outside this request.

Slide 3 now shows **Mbuotidem Okorie practising shoemaking in Nigeria**, using the original 1000 × 667 JPEG published in BellaNaija’s 16 December 2014 Shell LiveWIRE story. His disability, occupation and Nigerian context are documented by the article and independently corroborated by Shell programme adviser Chukwudi Nwanze’s first-person account. The image sits immediately after the paragraphs about his shoemaking. Source: `public/photos/mbuotidem-shoemaking.jpg`; original bytes, checksum, image/context links and identification reasoning are recorded in `docs/documentary-photo-manifest.json`. Captions, credits and the source limit are in Sources and the reading/no-JavaScript edition. No change to the slide headline or supporting copy.

Gufwan/Beautiful Gate sources were prioritised: the official gallery shows distributions/recipients; workshop reports establish employment but did not verify an individual craftsperson’s disability in an appropriate action image. The chosen photograph is a **Shell LiveWIRE** example, with no claimed Gufwan, Beautiful Gate or Impact Mosaic connection. Main-logo crutch and visible Back corrections remain.

Regenerated Quarto and static output. Repository preflight passes 120 tests, TypeScript and production build. The focused production-CSP presentation check covers ten clean accessibility audits, photo loading, exact five slides, Back/Next/Finish, keyboard/touch/full-screen/menu, reading/no-JavaScript/print and unchanged saved records. Earlier broader learning/pilot/story checks are recorded below. No source PowerPoint edits, production dependency or storage changes. A narrow gitignore exception includes the checked-in Reveal runtime’s `dist` directory while leaving the application build ignored, so a fresh checkout contains required presentation assets.

Git destination verified: `batestguy/AyubaDisabilityProg`, branch `main`; GitHub CLI authenticated as `batestguy`. Existing local predecessor commit is preserved. Commit/push receipt is reported after remote verification. No deployment performed. Visual corrections and later slides remain owner-review work.

---

# Current handoff: immersive first-five review — 9 November 2026

**Implemented locally; owner visual corrections are the next step. Stop before later slides. No commit, push, publishing or deployment.** This checkpoint supersedes the embedded presentation descriptions below.

Open `http://127.0.0.1:4175/?page=research` (local production/CSP server), or `http://127.0.0.1:5173/?page=research` (development). Visible Playwright Chrome session `mosaic-review` is left on the title slide. Server helper: `node scripts/serve-production-local.mjs`. Five current screenshots: `output/playwright/research-slide-1.png` through `research-slide-5.png`. Slide print PDF: `output/playwright/research-slides.pdf`; reading PDF and browser JSON share that directory.

Research now replaces the entire site with a dedicated viewport shell. Its navigation click requests browser full screen; direct links and refusal remain usable. Escape leaves full screen without closing the deck; menu Exit and slide-five Finish return to the site. Parent exit messages check origin and the iframe source. Earlier-demo query context is retained when navigating through the presentation to the detailed proposal.

Five exact-copy slides: Impact Mosaic unity cover and co-creators; six-part roadmap; talent/access opportunity; Gufwan’s foundation; participation barriers. Main red #D24726, Segoe UI, white text, deep-red cover/letterboxing, warm-gold roadmap numbers. Cover/contents use the full canvas; slides 3–5 use equal red text and uncropped real-photo halves. Sources/captions and explanations are in the menu and reading editions. Photography: accessibility-training group, leadership portrait, UBEC education meeting. No pilot activity or invented results are implied.

Two owner corrections implemented during this session:

- **Visible Back** at bottom left, disabled on the title. Next/Finish stays bottom right. This supersedes the original Next-only rule. Slide number remains secondary. Enlarged phone controls do not overlap.
- **Visible crutch in the main logo.** The person in green at back right now uses an underarm crutch while remaining connected to the group. Built-in image edit saved as `public/impact-mosaic-unity-crutch.png`; header, favicon, slide cover and reading/static paths use it. Original Nigerian-flag artwork is retained unchanged. Six people, albinism, glasses/white cane, hijab, wheelchair and walking stick are retained. See [logo prompt/provenance](docs/UNITY-LOGO.md).

Menu reveals on pointer movement or keyboard focus, remains visible while focused, and offers Previous, slide selection, full screen, reading/print, detailed proposal, sources/full images, accessibility, current-slide read aloud/Stop and Exit. Arrow/Page Up/Page Down/Home/End and horizontal touch navigation work. Whole compositions enter in 220ms; manual/OS reduced motion suppresses animation. Phone images stack above copy; 200% content scrolls in the keyboard-focusable active slide. No iframe height expansion remains.

Detailed proposal: `/?page=research-reading`; slide reading/no-JavaScript/print: `/research/reading.html`, with return links. Home/brief “Read the research plan” links point to the detailed proposal. Shared source: `src/researchSlides.ts`, with typed cover/contents/split layouts. Generator/QMD/runtime remain actual Quarto/reveal.js. Run `npm.cmd run build:research` after content edits, then `npm.cmd run preflight`. Never patch generated HTML. No production dependency, security-header relaxation, storage schema change or record reset.

Verification: final Quarto render and preflight passed **120 tests, TypeScript and production build**. Focused production-CSP browser checks passed **10 accessibility audits**, full-screen entry/refusal/direct load, five exact headlines and loaded full-frame images, Back/Next/Finish, keyboard/touch/menu/exit, source-dialog Escape/focus, read-aloud text, reduced motion, phone/desktop/200%, reading/detailed proposal/no-JavaScript/print and exact stored-byte preservation; zero product errors, failed resources or CSP violations. Slide PDF checked as exactly **five pages**, with no blank pages. Learning-navigation checks passed six clean audits and six role sign-ins, preserved bytes and zero errors/POST. Pilot checks passed five clean audits and brief/table/static paths. Broader story checks passed documentary chapters/gallery/timeline, image failure, responsive/reduced-motion paths and earlier-demo role tabs. Full UI suite was not rerun. Vite’s existing non-failing large-bundle advisory remains.

PowerPoint source unchanged: `Welcome to PowerPoint.pptx`, SHA-256 `10D27B8B7079314BA1DE7D554420A78BDF5B79E42A2C652525BA3990340C9809`. The separate PhD proposal reference is not present locally; its agreed hierarchy/alignment/image-led layout is implemented from the written plan. [Exact agreed copy, references, provenance and review boundary](docs/RESEARCH-PRESENTATION-BRIEF.md); [implementation guide](docs/RESEARCH-FIVE-SLIDES.md).

**Next:** review these five slides and the revised logo with the owner; incorporate their visual corrections before any later slides. Local screenshots and browser sessions are review evidence, not owner approval.

---

# Earlier handoff history

# Session handoff: connected Mosaic Pathways workspace

## Current checkpoint: five working Research slides for visual review — 8 November 2026

The latest user instruction supersedes the earlier deferral: implement the first five actual Quarto/reveal.js slides locally, keep the expanded research reference below, and stop for owner corrections before slides 6–24. **Five slides are now implemented; visual approval is pending. No publishing or deployment.**

Review `http://127.0.0.1:5173/?page=research` (development), or `http://127.0.0.1:4175/?page=research` while the local production verification server is running. Standalone deck: `/research/index.html`; complete reading/no-JavaScript/print alternative: `/research/reading.html`. [Implementation, assets, build instructions and limitations](docs/RESEARCH-FIVE-SLIDES.md).

The deck uses the five supplied titles, existing proposal wording, the approved unity logo, three newly generated labelled illustrations, and source-linked documentary photographs. Separate mock draft files were unavailable. Slide 2 offers a second documented Gufwan photograph; slide 3 offers Mobility/Education image switching without changing prose. No contributor portraits, new credentials, participant records or results are invented. The independent Plateau scope and recruitment-closed status remain explicit.

Desktop bullets/image columns, phone imagery-first stacking, manual Previous/Next boundaries, live count/progress/title selector, gentle layered-card settling, full-frame image dialogs with Escape/focus restoration, 200% text, site/OS reduced motion and site/deck accessibility controls are implemented. The iframe grows with its content. Site Read aloud selects the current slide; standalone read/stop controls are available. Audible device output depends on installed voices; the browser test verifies speech text with a stub.

Content source: `src/researchSlides.ts`; React embed/linear alternative: `src/ResearchPresentation.tsx`; QMD: `presentation/research.qmd`; renderer: `scripts/build-research-presentation.mjs`; runtime assets: `public/research/`. Quarto 1.9.38 renders the source with `npm run build:research`; regular build uses checked-in local output and requires no Quarto installation. Re-render after slide-content changes, then build for no-JavaScript parity. No production dependency was added.

Only `/research/*` permits same-origin framing. Global DENY and frame-ancestors none remain. Deck scripts stay self-only; script/style blocks are externalized, optional plugins and imported web fonts removed, and only runtime style attributes are allowed under the deck path. A fresh independent security/bridge review found no remaining material issue and confirmed Cloudflare's unset-and-set header semantics.

Verification: final preflight passed 120 tests, TypeScript and production build. The five-slide production-header browser check passed nine accessibility audits, all slide/image/dialog/navigation states, keyboard boundaries, phone and desktop 200%, reduced motion, reading/no-JavaScript paths, print, and exact preservation of stored demo bytes. Zero JavaScript errors, product CSP violations, audit CSP events or failed resources. The deck PDF contains five pages. Original pilot checks passed five additional clean audits, two keyboard-scrollable tables, brief/live/static links and zero errors/POST. Learning navigation passed six audits and preserved stored records; general accessibility passed 13 audits (33 across these four checks). Final no-JavaScript check confirms five expanded slides, no interactive iframe, working reading link and phone reflow. Full command evidence is recorded in [validation history](docs/validation.md); screenshots/PDFs/JSON remain under ignored `output/playwright/research-*`.

Do not continue the remaining slides until the owner reviews these five. Earlier research deferral and commit-only instructions below are historical; this implementation did not publish, deploy, push or reset any records.

## Historical checkpoint: Plateau proposal, unity logo and future presentation — 8 November 2026

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

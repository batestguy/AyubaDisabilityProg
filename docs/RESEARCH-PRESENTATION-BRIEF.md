# Impact Mosaic: immersive first-five presentation review

Agreed direction, 9 November 2026. This section supersedes the older embedded deck and suggested 24-slide outline below. Implement **five slides only** and stop for the owner’s visual corrections before developing later slides. No commit, push, publishing or deployment is authorized.

## Audience and visual direction

Independent project beginning with a proposed Plateau pilot and an ambition to extend across Nigeria. Audience: Gufwan and potential community, technical and funding partners. Use natural, concise copy, one focal message per slide and supporting explanations in the reading edition. Domain: people, mobility, learning, community, evidence and opportunity. Signature: the approved unity artwork and flag on the cover, echoed by a faint geometric Mosaic motif on the roadmap.

Use the clear hierarchy, alignment and image-led structure specified from the owner’s PhD proposal reference. That reference deck is not present in this workspace; the agreed written layout is the implementation reference. `Welcome to PowerPoint.pptx` supplies the approved **#D24726** main red; deep red overlays, white lettering and restrained warm-gold numbers support it. Installed Segoe UI; large, readable text; no new dependency. No source PowerPoint is edited. SHA-256 of the available original: `10D27B8B7079314BA1DE7D554420A78BDF5B79E42A2C652525BA3990340C9809`.

Slides 1–2 use the full canvas. Slides 3–5 divide the desktop equally between red text and a real photograph. Phones put the image above the text. All people and assistive devices in the source frames stay visible through object-fit contain; letterboxing uses the deck’s deep red. The cover is the agreed artwork exception. No new illustrations, identities, credentials, outcomes or statistics are introduced. Enlarged content scrolls within the active slide.

## Exact slide copy

### Slide 1 — Title

> **IMPACT MOSAIC**
>
> Connecting people, evidence and accessible learning
> A proposed Plateau pilot
> Building toward wider reach across Nigeria
> Strong · Jerry Bannister Zachary
> Project Co-Creators

### Slide 2 — Our roadmap

> **Our roadmap**
>
> The vision
> Gufwan’s story and the foundation
> Understanding people and learning needs
> Building the register and research
> Connecting learners and facilitators
> Measuring progress and expanding reach

### Slide 3 — Opportunity

> **Talent is everywhere.<br>
> Access to learning should be too.**
>
> Understand people.
> Connect learning.
> Follow progress.

### Slide 4 — Gufwan’s foundation

> **Gufwan’s story connects mobility with opportunity.**
>
> A foundation in community outreach and practical support.
> Our proposal starts with a conversation about building on that experience.

### Slide 5 — Participation

> **Reaching the classroom is only the beginning.**
>
> Participation also needs:
> Suitable teaching
> Accessible communication
> Devices and connectivity

## Photograph and artwork provenance

Artwork: `/impact-mosaic-unity-crutch.png`, a revision of the approved six-person unity composition and Nigeria flag. Owner correction, 9 November: the person in green now leans on a visible crutch while embracing the group. The original `/impact-mosaic-unity-nigeria.png` is retained unchanged. Its identifying features include albinism, wheelchair, white cane, walking stick, glasses, crutch and hijab. See [unity provenance](UNITY-LOGO.md). It is labelled as artwork in the sources panel and reading edition.

- Slide 3: `/photos/mbuotidem-shoemaking.jpg`. Mbuotidem Okorie practising shoemaking in Nigeria. Published with the Shell LiveWIRE story on BellaNaija, 16 December 2014; the accompanying report identifies him as a shoemaker with a disability from Uyo, Akwa Ibom. [Shell LiveWIRE photograph published by BellaNaija; photographer not named](https://www.bellanaija.com/2014/12/building-lives-shell-livewire-supports-people-with-disabilities-to-achieve-their-dreams/). Corroboration: [first-person Shell programme account](https://businessfightspoverty.org/making-a-better-life-in-business/). Original 1000 × 667 JPEG retained without cropping or retouching. This is a Shell LiveWIRE skills example, not a Gufwan/Beautiful Gate or Impact Mosaic activity. Gufwan-related sources were prioritised, but no suitable skill-in-action image with a verified individual disability identification was established.
- Slide 4: `/photos/leadership.webp`. Chief Ayuba Gufwan, in the photograph published with FMINOâ€™s leadership profile. Report: 2024-10-26. Nigeria; photograph venue not specified. [Photograph published by FMINO](https://fmino.gov.ng/championing-inclusion-chief-ayuba-gufwans-mission-for-persons-with-disabilities-in-nigeria/). WHO’s 2019 profile connects Gufwan’s experience of polio with mobility and education work. Historical sources do not establish a project partnership or endorsement. The photograph’s venue and event date are not inferred.
- Slide 5: `/photos/education-2.webp`. Gufwan during the UBEC partnership discussion on inclusive education. Report: 2024-09-26. UBEC, Abuja. [Photograph published by FMINO](https://fmino.gov.ng/children-with-disabilities-deserve-more-attention-to-attain-their-aspirations-in-life-ayuba-gufwan/). Historical UBEC inclusive-education discussion, not an activity of the proposed pilot. Registration and optional research remain separate; resources and operational arrangements are to be agreed.

Photo identities, dates, locations and original URLs are retained in `docs/documentary-photo-manifest.json`. These are historical activities, not evidence that the proposed pilot has operated. Detailed captions and the WHO link remain in Sources and the reading edition, outside the main slide composition.

## Presentation behavior and review boundary

Research opens a dedicated presentation shell and requests browser full screen directly from the navigation click. Direct `/?page=research` and `/research/index.html` links show the same deck; direct loads do not request full screen automatically. Refusal or unsupported full screen leaves a viewport-filling deck. Escape exits browser full screen without exiting the presentation; native image/source dialog Escape closes the dialog and restores focus. Exit and slide-five Finish return to the site. Finish means the end of the implemented review set only.

Owner correction, 9 November: a visible Back button is also required. Back stays at bottom left and is disabled on the title; Next (Finish on slide five) stays at bottom right, with a small slide number. This supersedes the initial Next-only control rule. Pointer movement or keyboard focus reveals Menu; a focused trigger stays visible. Menu contains Previous, slide selection, full screen, slide reading/print, detailed Research proposal, sources and full images, accessibility options, and Exit. Left/Right, Page Up/Down, Home/End navigate. Horizontal touch swipes navigate; vertical swipes remain available for scrolling enlarged content. All transitions are manual and animate the whole composition together with a 220ms fade and small horizontal movement. OS/manual reduced motion disables transitions.

Shared content: `src/researchSlides.ts`, explicitly typed cover/contents/split layouts. Regenerate with `npm.cmd run build:research`, then `npm.cmd run build` for static/no-JavaScript parity. Never manually patch the generated HTML. React, TypeScript, Quarto/reveal.js and the security headers remain. The iframe uses viewport height and no content-height expansion. Detailed proposal: `/?page=research-reading`; slide reading/print edition: `/research/reading.html`, with return links. Source PPTX and learning records remain unchanged.

Review the five local slide screenshots and the running local presentation, collect owner corrections, and stop. The roadmap describes the intended complete presentation, not delivered later slides. See [current implementation and verification](RESEARCH-FIVE-SLIDES.md) and `SESSION-HANDOFF.md`.

---

## Earlier planning history (superseded where it conflicts above)

# Research presentation: next-session direction

**Current checkpoint, 8 November 2026:** the first five slides are now implemented locally for visual review. See [implementation and verification details](RESEARCH-FIVE-SLIDES.md). The remaining slides 6–24 remain future work. The original direction below is retained as planning history; owner corrections are pending and nothing has been published.

Recorded 8 November 2026. **Planned, not implemented.** The user finds the current Research & Data Collection page bland and wants a captivating presentation of everything the team hopes to do, in the style of a Quarto presentation, with 20–25 slides, pictures of individuals, artwork, animations and mathematical sections.

When asked whether to build now or document and commit for next time, the user selected **“Document and commit for next time.”** This checkpoint records the direction and commits the existing site/logo work. Resume with this brief; do not mistake this document for an implemented slide deck or acceptance of the learning sandbox.

## Presentation intent

The audience is Gufwan and potential technical/community counterparts. Lead with people, his documented foundation and the proposed contribution of two statisticians. Explain how a reliable voluntary register could connect people with disabilities to accessible online teaching. Make the Plateau pilot and first-meeting request concrete while showing the longer-term ambition honestly.

Use a presentation rhythm: one clear idea per slide, large photographs or illustrations, concise visible prose, diagrams and well-explained mathematics. Alternate individual stories/portraits, process scenes, statistical explanations and decision slides. Avoid turning the existing long text into 24 dense pages. Keep source citations and fuller explanations available without overwhelming the main slide.

“Like a Quarto presentation” describes the desired experience. Whether to use actual Quarto/revealjs output or an integrated presentation in the existing React/TypeScript/Vite site remains an implementation choice. Inspect local tooling and the existing build/static generation first. Do not add a production dependency or migrate the whole site without authorization. Preserve navigation, themes, accessibility controls and the completed learning demo.

## Suggested 24-slide story

This is a working outline, not an approved final script. Keep the delivered count within 20–25.

| Slide | Main idea | Visual or mathematical treatment |
|---|---|---|
| 1 | From reliable data to accessible learning | Strong title artwork, people first; independent Plateau proposal |
| 2 | Gufwan’s documented foundation | Sourced portrait and a short historical account |
| 3 | Mobility, education and participation | Documentary photographs and attributed evidence |
| 4 | Why reliable disability data matters | Service-gap diagram; attributed 2026 data/KPI priorities |
| 5 | What two statisticians bring | Jerry Bannister Zachary and Strong; recruitment, quality, coverage, evaluation; no invented credentials |
| 6 | The pathway we hope to build | Registration → interests/access needs → matching → teaching → follow-up |
| 7 | Start with a limited Plateau pilot | Geography illustration; locations, eligibility, numbers and courses still to be agreed |
| 8 | Co-design with people with disabilities | Individual-centred artwork; accessible questions and consent |
| 9 | A useful voluntary register | Minimal fields, verification and correction; registration separate from research |
| 10 | Snowball recruitment, made visible | Fictional seeds and referral waves, including people outside the network |
| 11 | Adapt outreach when people are missed | Weekly coverage reviews, complementary channels and logged changes; operational adaptation, not formal adaptive cluster sampling |
| 12 | Check data quality and coverage | Duplicate-review flow and missingness formula with a defined denominator |
| 13 | Registration is not a representative survey | Contrast a covered register population with a defined research population and frame |
| 14 | Size a justified research sample | Explain n₀ = z²p(1−p)/e², design effect and response allowance; hypothetical inputs only |
| 15 | Selection probabilities and weights | πᵢ and wᵢ = 1/πᵢ; record the actual design, separate response adjustments |
| 16 | Uncertainty and limits | Confidence intervals and clustering; weighting cannot recover people absent from the frame |
| 17 | Optional methods, with assumptions visible | If retained, explain Bayesian prior/likelihood/posterior and network assumptions as exploratory possibilities, not a cure for selection bias |
| 18 | Match learner demand to teaching capacity | Interests, languages, availability and unresolved access needs; no fictional capacity totals |
| 19 | Accessible teaching in practice | Pictures/artwork of individuals learning with facilitators; use the working prototype as a demonstration |
| 20 | Measure participation and demonstrated skills | Cohort denominators, attendance, assessed skills, missing follow-ups and participant feedback |
| 21 | Understand costs before scaling | Cost per verified registration, learner starting and learner demonstrating a skill; no invented budget or target |
| 22 | An illustrative 20-week sequence | Readiness-gated overlapping timeline; full course cycle for completion reviews; registration/expansion open-ended |
| 23 | Resources and possible technical alignment | Community access, facilitators, funding, infrastructure and accommodations to secure; NDMIS alignment is a discussion |
| 24 | Three decisions for the first meeting | Technical counterpart, potential community introductions and pilot-scoping requirements; brief and sandbox links |

## Evidence, mathematics and imagery

- Build from `src/PilotProposal.tsx`, `src/ResearchDataCollectionPage.tsx`, [the sampling record](RESEARCH-SAMPLING-FRAMEWORK.md) and the existing reviewed source register. Keep the website, slides and printable discussion brief consistent.
- Use [the earlier research brief](RESEARCH-DATA-COLLECTION-NEXT-PHASE.md) for its evidence/mathematics register and accessibility requirements. Its older nationwide starting scope and implementation gates are dated history: the current proposal starts with Plateau, and this latest instruction defers the slide redesign to next time.
- Explain every equation in ordinary language, define symbols, show assumptions and provide accessible text. Use design-aware inference only where the actual frame/design supports it. RDS, successive-sampling or Bayesian examples are optional explanatory material, not agreed operational methods or evidence of national representativeness.
- Any numerical demonstration must remain visibly labelled **“Hypothetical illustration”**, including animation frames, screenshots and static/print exports. Do not invent results, participant numbers, performance targets, budgets, degrees or qualifications.
- Use existing source-linked documentary photographs where appropriate, retaining credits, context and uncropped mobility aids. Do not imply that photographed people are enrolled in this pilot or gave this project an endorsement. User requests pictures of individuals; never invent identities or participant testimonials.
- Generate original artwork for proposed activities and label it as illustration. The approved header mark is `public/impact-mosaic-unity-nigeria.png`: six African figures, including a person with albinism, with Nigeria’s green-white-green flag behind them. See [logo provenance and prompt](UNITY-LOGO.md). Artwork may depict disability diversity respectfully without suggesting that all disabilities are visible.

## Delivery and acceptance checks for the future implementation

- 20–25 captivating slides with deliberate visual variety and an accessible contents/slide-navigation system. Provide visible focus, meaningful headings, keyboard controls and a readable linear alternative.
- Preserve the expanded sampling table/framework as technical reference; keep brief/sandbox links working with and without JavaScript. Provide print/export output that includes essential caveats and citations.
- Animate concepts rather than invented live data. Provide static equivalents and pause/step/restart controls where applicable; respect both site and OS reduced-motion preferences. Do not hijack arrow keys needed to scroll tables or operate other controls.
- Check desktop, phone, 200% text, contrast, keyboard use, images/credits, reduced motion and print. Recompute worked examples and review claims against sources. Run repository preflight and the relevant documentary/navigation/accessibility checks; confirm demo records stay unchanged.
- Existing research recruitment is not open. No collection backend, authentication change, government integration, publishing, contact with organisations or financial commitment is authorized by this presentation direction.

## Current checkpoint evidence

Current implemented work is the Plateau proposal on Home/Research/About, shared printable HTML brief, no-JavaScript parity and the six-person Nigerian-flag header logo. The 24-slide redesign and its new artwork/animations remain future work. Current validation and the final local commit are reported in [the handoff](../SESSION-HANDOFF.md) and [validation history](validation.md).

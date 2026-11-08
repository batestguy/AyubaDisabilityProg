# Research presentation: next-session direction

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

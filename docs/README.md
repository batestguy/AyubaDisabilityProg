# Documentation index

Current checkpoint (10 October 2026): User, Administrator waves 1–4, learner scorecards and grant-planning reports are implemented and verified. The five-section PDF includes Nigeria state mapping, state/LGA tables, KPI/evidence summaries, demographic/skills/support charts and a learning diagram. Guided visual steps 1–4 are accepted; latest Reports/PDF acceptance and remaining wave 5 visual checks are pending. Implementation and handoffs committed and pushed to GitHub main (`639e1bd`); no deployment performed for this revision. Read [the handoff](../SESSION-HANDOFF.md) for current evidence and next steps. Historical checkpoints below retain their dated scope.

Start with [SESSION-HANDOFF.md](../SESSION-HANDOFF.md). The eight-course Mosaic Pathways User stage is closed out; Administrator wave 1 adds shared records, Overview and read-only Learners; wave 2 application/support reviews and responses are complete locally; waves 3–4 roster/course/learning and reports/settings/geography are complete locally. The individual scorecard extension adds completion thresholds, explicit outcome records and follow-up; wave 5 closeout is next.

| Document | Purpose |
|---|---|
| [Grant-planning report](GRANT-PLANNING-REPORT.md) | Demographic/disability/skills dashboard, charts, aggregate PDF/CSV and selected detailed learner CSV |
| [Learner scorecard](LEARNER-SCORECARD.md) | Authorized individual progress, support receipt, grant records and follow-up extension |
| [User demo plan](USER-DEMO-PLAN.md) | Agreed Mosaic Pathways user journey, boundaries, profile, learning, support, teaching and acceptance criteria |
| [User-stage closeout](USER-STAGE-CLOSEOUT.md) | Delivered eight-course User scope, acceptance evidence and carried-forward boundaries |
| [Administrator wave 4](ADMINISTRATOR-WAVE-4.md) | Reports, history, safe exports, explicit fictional profiles and Nigeria geographic drill-down |
| [Nigeria learner geography](NIGERIA-GEOGRAPHY.md) | Paired matching/count definitions, boundary source/provenance and reproducible map build |
| [Administrator wave 3](ADMINISTRATOR-WAVE-3.md) | Roster, course drafts/review/publication/archive, retained versions, assignments and verification |
| [Administrator wave 2](ADMINISTRATOR-WAVE-2.md) | Review queues, four-point approvals, support outcomes, resubmissions and verification |
| [Administrator wave 1](ADMINISTRATOR-WAVE-1.md) | Agreed scope, migration/storage behavior, implementation checklist and verification evidence |
| [Administrator demo plan](ADMINISTRATOR-DEMO-PLAN.md) | Full Administrator specification, completed waves 1–4, authorized scorecard extension and wave 5 closeout |
| [Practical-skills expansion](PRACTICAL-SKILLS-EXPANSION-PLAN.md) | Source-checked vocational agenda, implemented foundation courses, future supervised practice/evidence and Administrator implications |
| [Session handoff](../SESSION-HANDOFF.md) | Completed work, current state, chapter facts/caveats, validation, limitations, commands and a reusable next-session brief |
| [Historical session record](SESSION-HISTORY.md) | Archived implementation history and earlier checkpoints; current handoff takes precedence |
| [Architecture](ARCHITECTURE.md) | File map, components, data flow, state/public helpers, AI endpoint/limits, generated artifacts and troubleshooting |
| [Appearance guide](APPEARANCE-GUIDE.md) | Current visual defaults, edit locations, behavior to preserve, design-validation workflow and screenshots |
| [Validation history](validation.md) | Detailed recorded tests, visual checks and external/user checks still pending |
| [Photograph provenance](asset-notes.txt) | Acquisition, optimisation, identity limitations and reuse/provenance notes |
| [Accepted photo manifest](documentary-photo-manifest.json) | Ten accepted photos with original/local URLs, dimensions, captions, credits and source links; generated from showcase records |
| [Implementation snapshot](implementation-snapshot.json) | SHA-256 baseline for code/configuration/public artifacts; comparison aid, not a source backup |
| [Deployment runbook](deployment.md) | Deferred Cloudflare/Groq free-service deployment steps and credential boundaries; no new publishing request implied |
| [Project README](../README.md) | Quick start and concise deliverable overview |
| [Walkthrough](../public/downloads/walkthrough.md) | Three-minute presentation sequence and optional extended demo |
| [Introduction PDF](../public/downloads/introduction.pdf) | Current one-page, eight-chapter introduction |
| [Technical proposal PDF](../public/downloads/partnership-proposal.pdf) | Existing two-page human-led pilot and technical/governance proposal |

## Documentation maintenance

`src/showcase.ts` and `src/evidence.ts` are authoritative content records; markdown explains them. `npm.cmd run build` regenerates the noscript story and photo manifest. Handwritten static introductory prose, PDF prose and walkthrough text still require explicit alignment when content changes.

Update the handoff after material work and record the actual commands/results in validation. Keep historical checks labelled as historical; do not represent a mocked provider test as a live AI result, or a local build as a public deployment. Preserve the original concept file as context, but its speculative claims and alternate stack are not the implemented source of truth.

The snapshot intentionally excludes credentials, private input text files, node_modules, Wrangler cache and generated research/test output. Keep credentials outside the workspace. A hash snapshot cannot restore code; preserve the working project files themselves for continuation.


## Resume next session

Read [the main handoff and continuation brief](../SESSION-HANDOFF.md#next-session-brief), [completed wave 1](ADMINISTRATOR-WAVE-1.md), [full Administrator specification](ADMINISTRATOR-DEMO-PLAN.md) and [practical-skills boundaries](PRACTICAL-SKILLS-EXPANSION-PLAN.md), in that order. Current User baseline has eight courses, 48 lessons and 39 quiz questions; shared schema 2 and its verified backup are already implemented. Wave 5 full Administrator closeout is the next milestone, not a restart of User or wave 1. Historical documents and dated validation entries describe their own checkpoints; the main handoff takes precedence.

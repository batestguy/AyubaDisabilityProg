# Documentation index

Latest continuation (28 October): **implementation deferred by the user**. Read the [facilitator directory and state noticeboards plan](FACILITATOR-DIRECTORY-STATE-BOARDS-PLAN.md) for the fully documented next feature. It is not implemented; await renewed instruction before building. The existing connected workspace remains ready for visual review.

Current milestone: the [connected workspace](CONNECTED-WORKSPACE.md) is implemented and ready for visual review. Begin with [SESSION-HANDOFF.md](../SESSION-HANDOFF.md) for current state, preservation boundaries, validation, commands and next-session brief. Administrator wave 5 and earlier Reports/PDF are accepted/closed. Earlier read-only/guided Facilitator stages are preserved historical implementations, not the current continuation target.

| Document | Purpose |
|---|---|
| [Facilitator directory and state noticeboards plan](FACILITATOR-DIRECTORY-STATE-BOARDS-PLAN.md) | Planned public directory, learner preferences/Admin decisions, 37 community boards, permissions, compatibility and acceptance; implementation explicitly deferred |
| [Connected workspace](CONNECTED-WORKSPACE.md) | Current scope, interview decisions, privacy research, implementation, verification and limits |
| [Earlier guided sample](FACILITATOR-GUIDED-DEMO.md) | Historical standalone teaching journey retained in the earlier workspace |
| [Archived handoff](HANDOFF-ARCHIVE-2026-10-21.md) | Earlier handoff evidence; current handoff takes precedence |
| [Facilitator wave 1](FACILITATOR-WAVE-1.md) | Approved demo identity, assigned courses/practical/questions, retained evidence and stale-assignment awareness |
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

Read [the current handoff](../SESSION-HANDOFF.md#next-session-brief), [connected scope/evidence](CONNECTED-WORKSPACE.md) and [validation](validation.md). Run `npm.cmd run preflight` before implementation/handoff. Next is user visual review of connected interfaces and handoffs. Earlier detailed screens are explicitly accessible and preserved. Do not reset browser records without scoped confirmation.

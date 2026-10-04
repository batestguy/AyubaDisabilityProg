# Documentation index

Start with [SESSION-HANDOFF.md](../SESSION-HANDOFF.md). It records completed website work, the public repository checkpoint and the next objective: building the demo app.

| Document | Purpose |
|---|---|
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

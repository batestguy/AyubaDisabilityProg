---
status: superseded
---

# Facilitator guided teaching demo

Current continuation: this earlier implementation is preserved via `?workspace=earlier`. The [connected workspace](CONNECTED-WORKSPACE.md) and [main handoff](../SESSION-HANDOFF.md) supersede its next-wave instructions. User now authorized documentation, commit and push of all accumulated work.


## Authorized scope — 21 October 2026

User chose all recommendations: a clearly labelled fictional trainer and two fictional learners; working feedback/change request/resubmission/approval, question replies and support handoffs; guided walkthrough plus ordinary pages. User asked to set it up and open it afterward.

Use trainer Amaka Obi, learners Ada Okafor and Sani Musa. One common sample scenario appears under the existing User / Administration / Facilitator role tabs. Explicit sample mode is stored separately from existing shared User/Administrator records and the sandbox. Entering it never populates or resets those records. Leaving it returns to the existing demo.

## Ownership and design

Main owns state model, storage/recovery, root integration, tests, documentation and final review. One executor owns GuidedTeachingDemo.tsx and guidedTeaching.css only. Working-on tracks this document; reuse frontend-design/Playwright guidance and existing design. No new dependency, backend, deployment or Git write.

State is an append-only command history with role ownership, event IDs, expected version, submission revision and assignment revision guards. Exact retries have no additional effect. Corrupt scenario storage is preserved behind recovery; denied storage leaves an in-memory warning. Review cannot change a newer or unassigned submission. Completion requires all retained lessons, best quiz ≥70, submitted work and approval. The seeded course is the existing digital foundation course; sample checkpoints do not establish real competence.

## Acceptance gates

- [x] Working User → Facilitator → Administration interactions and role-specific action ownership.
- [x] Clearly labelled examples, two distinct learners, trainer identity and visible progress/next actions.
- [x] Feedback, immutable submission/review history, resubmission reset and explicit reassignment.
- [x] Learning question reply and support referral/administrative response visible across roles.
- [x] Stale/repeated/invalid commands, corrupt persistence and completion boundaries tested.
- [x] Existing records and sandbox preserved; normal pages and guided sequence both usable.
- [x] Preflight, targeted browser/accessibility/mobile/enlarged text and production CSP checks.
- [x] Handoff updated and a visible browser opened to the Facilitator walkthrough.


## Delivered and verified

The explicit **Open guided teaching demo** button opens the sample in Facilitator. The existing App roles tabs switch all three perspectives over the same sample history. Seven workspace pages cover overview, learners, practical reviews, questions, support, course requirements and activity history. The walkthrough directs users to the next role and learner without automatically recording decisions.

Sequence: Amaka requests changes to Ada’s work → Ada revises → Administration assigns the revised version → Amaka approves → Amaka answers Sani’s question → Amaka refers an access barrier → Administration records a coordination response. User and Facilitator views show the shared replies and support response. Sample lesson/quiz checkpoints are labelled; Sani’s partial lessons and 60% quiz cannot become a course completion through practical approval.

Files: teachingScenario.ts (commands/replay/storage), TeachingScenarioWorkspace.tsx (recovery and confirmed reset), GuidedTeachingDemo.tsx and guidedTeaching.css (workspace), AppDemoPage.tsx (mode/role integration), teachingScenario.test.ts and scripts/browser-guided-teaching.mjs (verification).

Validation:

- Final `npm.cmd run preflight`: all 91 tests, TypeScript and production build pass. Existing size advisory remains; main bundle 559.11 kB / 165.94 kB gzip.
- `node scripts/browser-guided-teaching.mjs`: eight clean axe audits, all seven role handoffs, completion, visible learner replies, immutable history, reload, reset cancellation/confirmation, corrupt-state recovery, mobile and 200% text, unchanged original shared/sandbox bytes, zero POST/page errors.
- Same complete script with `GUIDED_DEMO_URL=http://127.0.0.1:4173/` and `GUIDED_CSP=1`: passes under the production CSP.
- Existing `node scripts/browser-facilitator.mjs` and final `node scripts/browser-production.mjs` pass. Full fourteen-script suite not rerun.
- Independent read-only review found one P2 invalid-date boundary in persisted events. Date-range validation and replay/load-preservation regressions were added; independent recheck passed with no remaining material findings.
- Desktop/mobile screenshots visually inspected. Evidence is ignored under output/playwright/guided-teaching-*. Browser session teaching-review is open visibly on preview4173, Facilitator overview, ready for user review. No scenario actions were automatically recorded in that review session.

Commands: `npm.cmd run test:guided-teaching` after preflight (dev5173). The full test:ui chain includes this fourteenth script. Finish builds before checking dev UI to avoid Vite reloads.

Limits: role switching is simulated, initial course/quiz records are fictional, and support responses record plans rather than delivered services. The original shared-record Facilitator stays at read-only wave 1; these new actions belong to the explicitly labelled guided sample. With denied storage, leaving sample mode or reloading can lose its in-memory progress. No real staff accounts, backend, observed trade assessment, external message delivery, payment, publication, Git commit or push was performed. Current visual acceptance is pending.

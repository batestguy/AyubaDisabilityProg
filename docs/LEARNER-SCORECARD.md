---
status: done
---

# Individual learner scorecard and recorded outcomes

Current continuation (8 October 2026): User, Administrator waves 1–4 and the [learner scorecard/threshold follow-up](LEARNER-SCORECARD.md) are complete locally. Next: wave 5 consolidated Administrator closeout. Read [the current handoff](../SESSION-HANDOFF.md#next-session-brief); earlier milestones in this document retain their historical scope. Changes remain uncommitted and unpublished.

Authorized continuation: 8 October 2026. This extends the local Mosaic Pathways demo with an individual scorecard, separately recorded support provision and learner receipt acknowledgement, grant recording and follow-up. No real delivery, financial transaction, account or external service is performed.

## Scope and decisions

- Learning shows completed/enrolled counts and percentage; no rate when there are no enrolments. Practical approved/pending counts retain existing trainer gates and retained course versions.
- Administrator records support provision with a date, reference and evidence description. A reviewed support plan never creates a provision record. User receipt acknowledgement is a separate explicit action tied to the current provision revision.
- Grants record application, award and cumulative payment amounts in NGN. Nonnegative finite amounts use at most two decimal places; cumulative paid cannot exceed awarded. Award/payment dates, references and evidence descriptions are required when applicable. These are simulated records, not transactions or proof of actual delivery.
- Follow-up records owner, due date, action and open/in-progress/closed status; closure has a recorded completion date. No notifications are sent.
- Every new record/revision and receipt action is append-only, includes actor/time/reason, checks the last record revision, and rejects stale replacements. Exact retries are no-ops.
- Only the named primary User learner can have outcomes initially. Geographic sample profiles remain explicitly fictional with no learning, delivery, grant or follow-up evidence.
- Absent outcome histories mean **not recorded**, not proof that nothing occurred. Staff provision/payment records do not establish learner receipt.
- Schema 2 normalizes absent outcomes additively; malformed saved outcomes use existing preserved recovery. Shared reset clears outcomes and preserves the separate sandbox.
- Anonymous export includes only deidentified counts/status and numeric recorded totals. Outcome titles, descriptions, identities, dates, locations, grant/support references, actor labels and audit descriptions are excluded. Explicit full fictional export includes the outcome records, excluding file contents.

- Administrator Learner progress shows per-learner completed/enrolled percentages with an editable follow-up threshold (default 50%, valid range 0 to 100). Below uses `<`; at/above uses `>=`. No enrolments remains its own category, including geographic samples; it is never classified as 0%. This threshold does not alter assessment or completion gates. Percentages are rounded to one decimal for display; threshold comparison uses the unrounded completed/enrolled ratio.
- Support records refer to an immutable submitted checklist and item. Later request revisions do not silently inherit earlier delivery or receipt evidence.

## Work items

- [x] Model, immutable history, validation, scorecard derivation and tests.
- [x] Administrator editor and User read view/receipt acknowledgement.
- [x] Shared persistence, export privacy and reset scope integration.
- [x] Dedicated browser journey: empty/populated/invalid/stale/reload/receipt/privacy/mobile/accessibility/zero POST.
- [x] Preflight, affected User/Administrator/reporting regressions and production CSP check.
- [x] Record final validation evidence and independent main-agent review.

## Key files

- `src/scorecardDemo.ts`, `src/scorecardValidation.ts`, `src/scorecardDemo.test.ts`: outcomes and scorecard.
- `src/LearnerScorecard.tsx`, `src/scorecard.css`: accessible shared read view and Administrator editing.
- `src/sharedDemo.ts`, `src/AppDemoPage.tsx`: additive persistence and canonical commands.
- `src/AdministratorDemo.tsx`, `src/MosaicUserDemo.tsx`: individual learner integration.
- `src/reportingDemo.ts`, `src/AdministratorReports.tsx`: export privacy and reset wording.
- `scripts/browser-scorecard.mjs`: observable browser acceptance checks.

## Validation evidence

Baseline inspection complete. Existing shared schema 2, immutable application/course/assignment histories, retained enrolled content and sandbox isolation remain requirements. Baseline: 67 model tests pass; existing preflight passed as reported by main agent.


Implementation milestone: 75 model tests pass (67 baseline plus 8 scorecard tests). Dedicated browser journey passes 8 axe audits with zero violations and zero POST requests, including threshold boundaries, explicit staff/User distinctions, changed-checklist provenance, invalid payment, safe/full export, mobile, reload, recovery and reset. Desktop/mobile screenshots: `output/playwright/scorecard-admin-desktop.png`, `output/playwright/scorecard-mobile.png`; audits: `output/playwright/scorecard-axe.json`.

Independent review corrected immutable support checklist/item binding and exact NGN cent validation/aggregation. Existing support outcomes retain their original request item; a newer need requires a new outcome. Positive award/payment amounts are required for those stages. Historical receipt acknowledgements remain visible but do not acknowledge a revised record.

The first integrated preflight (74 tests, TypeScript, production build) passed. Final 75-test preflight, all five affected browser regressions and production CSP smoke pass. Vite reports an advisory for the main bundle above 500 kB (about 525 kB uncompressed); the scorecard remains eager as selected during review.


## Final verification — 8 October 2026

- `npm.cmd run preflight`: 75 tests pass; TypeScript and production build pass. Main JavaScript is 525.51 kB uncompressed / 157.30 kB gzip; Vite gives an advisory above 500 kB.
- `node scripts/browser-scorecard.mjs`: threshold filters/boundaries, no-enrolment classification, empty/populated forms, paid-above-award rejection, explicit User receipt, immutable request binding, anonymous/full export, reload/recovery/reset and mobile all pass; 8 axe audits have zero violations and zero POST requests.
- Affected existing scripts pass: User, Administrator baseline (8 axe audits), application/support reviews (8), course coordination (9), reporting/geography (14). All retain zero POST requests.
- `node scripts/browser-production.mjs`: rebuilt production smoke under the published CSP passes, including Administrator scorecard/progress and User scorecard, existing site/sandbox/PDF/mobile/no-JavaScript checks. Learner progress screenshot: `output/playwright/scorecard-progress-production.png`.
- Main agent and independent reviewer report no remaining material findings; desktop/mobile scorecard and production progress screenshots visually inspected.
- No dependencies, account/backend, deployment, commit or real delivery/payment were added.

Next-session documentation synchronized across all 19 project Markdown files. Fresh handoff preflight: 75 tests, TypeScript and production build (70 modules) pass; continuation is wave 5 consolidated closeout.

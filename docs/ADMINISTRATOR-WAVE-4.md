---
status: complete locally
---
# Administrator wave 4: reports, history, settings and Nigeria geography

Current continuation (8 October 2026): User, Administrator waves 1–4 and the [learner scorecard/threshold follow-up](LEARNER-SCORECARD.md) are complete locally. Next: wave 5 consolidated Administrator closeout. Read [the current handoff](../SESSION-HANDOFF.md#next-session-brief); earlier milestones in this document retain their historical scope. Changes remain uncommitted and unpublished.

8 October 2026: user requested proceeding after completed wave 3. Baseline preflight passes 58 tests, TypeScript and production build. Existing uncommitted User/Admin work is preserved; local implementation only.

## Scope and decisions

- Add scoped reports with explicit denominators, fictional labels and no invented population/impact or support-delivery claims.
- Add append-only activity history views with actor/type/search and inclusive UTC date filters; timestamp display remains Africa/Lagos.
- Demo settings explicitly load five fictional geographic profiles, preserve User data and deduplicate repeats. Samples have no invented enrolments/reviews.
- Default JSON export contains anonymous aggregates/status only; full fictional profile/evidence/history requires a labelled opt-in. In-memory file contents are always excluded.
- Settings reset requires explicit scope confirmation and uses existing verified reset/backup/file cleanup while preserving separate mosaic-v1 sandbox.
- Geographic view: Nigeria state/FCT map → LGA map → matching learner list/detail, scoped counts, keyboard/state/LGA selectors, readiness/search filters, unmatched-location list, loading/retry and recorded-list fallback.
- Source: GRID3 via geoBoundaries gbOpen, represented year 2022/build 12 December 2023, CC BY 4.0. Pinned source commit 9469f09. Local SVG-path asset includes 37 state/FCT and 774 LGA features; every LGA parent has unanimous three interior-point containment checks. Geometry is simplified for display. State/LGA matching uses explicit paired normalized names and documented FCT aliases; no guessed locations or home coordinates.
- No real accounts/shared backend/deployment/cohort loading on startup. Facilitator assessment remains unchanged. Full-stage closeout is wave 5.

## Ownership and acceptance

One executor owns reporting model/tests and additive settings validation. Main owns map build/provenance, geography/model tests, UI/root integration/browser checks/documentation. Independent read-only review follows integration.

- [x] Inspect wave 4 scope and run baseline preflight.
- [x] Research/check boundary provenance/licence and build local map with parent QA.
- [x] Implement scoped reporting, safe export and explicit sample-cohort commands.
- [x] Implement map, reports, activity and settings screens using existing components/styles.
- [x] Verify privacy defaults, sample idempotency, valid malformed-storage recovery, geography matching and filtered denominators.
- [x] Verify browser drill-down/keyboard/map loading/error/filters/exports/reset and mobile/axe/zero POST.
- [x] Independent review and focused corrections/recheck.
- [x] Final preflight, existing regressions/production CSP and documentation/source inventory.

## Review corrections and final gate

Completed locally on 8 October 2026. Final preflight passes 67 model tests, TypeScript and the production build (66 modules). All ten browser scripts pass with affected scripts rerun after runtime edits settled; the final production CSP smoke also passes. The dedicated wave 4 journey records 14 axe audits with zero violations and zero POST requests. Desktop Nigeria and mobile Plateau screenshots were visually inspected.

Independent review and focused rechecks are clear after rejecting coordinate-free/degenerate/open paths and zero-LGA states, enforcing three interior checks for all 774 LGAs, and adding a scoped error boundary for failed on-demand screen downloads. Browser checks cover loading, HTTP failure, malformed geometry, unmatched locations, keyboard drill-down, scoped counts, privacy defaults, explicit sample loading/idempotency, reload, reset, sandbox preservation and blocked screen downloads/recovery. User/recovery reset confirmations explicitly name course drafts, assignments and fictional geographic records.

An initial browser run was interrupted by a production build refreshing the dev page; affected scripts passed when rerun after changes settled. The reporting test now waits for its lazy screen after reload. Run dev browser checks before rebuilding production to avoid that interference.

Existing uncommitted work is preserved. No commit, public deployment or live backend was added. Next: wave 5 Administrator stage closeout.

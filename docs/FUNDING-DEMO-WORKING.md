# Connected funding demonstration — implementation record

## 7 November 2026
- Authorized: implement directory, learner matching requests, 37 boards, role action queues and funding walkthrough in the existing local demo. No curriculum redesign or deployment.
- Baseline: 101 tests pass; production build started. Preserve schema 1, earlier storage, chat boundaries and revision gates.
- Design: learners find teaching/support; facilitators act on assigned work; Administration resolves handoffs. Calm, readable community workspace.
- Domain: course, learner, facilitator, assignment, support referral, state community. Palette: existing forest ink, leaf green, warm paper, pale sage, muted amber. Signature: shared handoff cards showing status, destination and next action.
- Components: role home prioritises an action queue; directory prioritises subject/person selection; boards prioritise state and discussion. Reuse native controls, existing cards, focus treatment and serif headings; 8px spacing rhythm, 24px card padding, thin borders, warm paper surfaces. Avoid decorative dashboards, invented activity and auto-switching identities.
- Implementation: additive extension module for public profiles, preferences and boards; existing commands retain their historical replay semantics. New manual assignments resolve pending preferences consistently.
- Pending: implementation, model/browser checks, production CSP, final review and documentation closeout.

- Implemented additive model, consented public projections, request decisions, 37 boards and role interfaces. Required state in new UI registrations; legacy event omission remains valid.
- Added explicit focus for confirmation and action navigation. Corrected inherited global header flex layout causing 200% mobile heading overflow.
- Independent review: hidden notice previously omitted ordinary child replies from Administration moderation. Corrected and rechecked; normal learner views exclude the whole hidden thread.
- Unread default clarified: per-notice event high-water mark, restoration respects original order; no fabricated unread event.
- Current evidence: preflight113/113 and production build pass; connected dev ten audits pass. Community browser verified matching/feedback/support, mobile/enlarged text and moderation; final public-profile/full production completion pending.

- COMPLETE: final production-CSP community journey11 audits and connected journey10 audits pass, zero page errors/POST. Earlier-route production smoke passes. New consenting teacher registration/publication, replacement/withdrawal, hidden-thread inspection and exact reload persistence verified. Desktop Administration/mobile boards visually inspected.
- Documentation: implementation guide, presenter walkthrough, README/index, scope/historical plan, handoff and validation receipt updated. Local Markdown links and whitespace checks pass. Full UI suite not run. No publishing/commit/push; user visual review remains next.

## Fresh demo request — 7 November continuation
- User authorized clearing demo activity and showing a clean interface. Retain permanent sample identities/courses; no sample learner enrolments/progress/chat remain in clean mode.
- Added optional cleanStart baseline with legacy validation/save guards, exact-key reset with in-memory rollback, explicit confirmation and full-page reload. No URL-triggered deletion. Other tabs/origins/profiles remain separate.
- Renamed confusing archive buttons and added visible Learner/Facilitator/Administration entry cards. Existing draft/code changes preserved.
- Verification:118 model tests, TypeScript/build; five fresh-demo production-CSP audits and all role/cancel/archive/mobile200%/reload checks pass. Independent reset review clear. Visible fresh Chrome preview opened and screenshot inspected. Existing connected production regression passes ten clean audits, zero POST, including prior learning/privacy/reset/recovery flows.

## Projects page cleanup — 7 November latest request
- Replaced five proposals and old tools/download banner with a mostly blank Bayesian snowball sampling heading, facilitator/student spaces and collapsed six-stage skeleton. Removed promotional footer only from Projects. Retained app entry; archived original tools now accessible under Earlier demos.
- Brief primary-source research distinguishes chain-referral recruitment from Bayesian estimation/RDS. Saved sources and open protocol questions in BAYESIAN-SNOWBALL-FRAMEWORK.md; no statistical model, population estimates, recruitment or database collection implemented.
- Updated generated no-JavaScript version and affected existing browser navigation/static-count assertions. Corrected mobile200% long-word overflow. Current targeted production-CSP check passes3 audits, mobile/desktop/reflow, placeholders, archive access and static parity; model118 tests/build pass. Production smoke passes; final handoff preflight follows.

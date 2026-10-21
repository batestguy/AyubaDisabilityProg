---
status: ready for review
---

# Connected participant workspace

## Agreed scope — 21 October 2026

User confirmed three interview rounds and authorized implementation. Permanent sample learners Ada and Sani, sample facilitators Amaka and Tunde; additional learner/facilitator registrations; generated demo access codes, same-browser persistent records and individual interfaces. Administration sees all operational records and manages facilitator approval/learner assignments. Learners can enrol and study before assignment; practical review needs a current assigned facilitator. Preserve existing profile/progress/history. Facilitators select existing teaching courses and propose additional topics for review. Shared learner–facilitator chat and facilitator–Administration communication, unread indicators, explicit support referrals.

## Research and interpretation

- [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html): least privilege, deny-by-default and relationship checks support participant-specific chat visibility and assigned-learner actions.
- [Moodle messaging](https://docs.moodle.org/501/en/Messaging): personal messages and unread messaging affordances support a dedicated chat window rather than embedding communication only in review forms.
- [Moodle course creation](https://docs.moodle.org/501/en/Course_request): teacher versus administrative course permissions support review of additional topics before representing them as available curriculum. Topic approval is not a complete published course.
- [OWASP HTML5 storage](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html): local storage is not appropriate for sensitive data. This authorized local presentation uses public demonstration codes, not real passwords or secure authentication. Participant-only UI visibility is not encrypted/private production messaging. Use sample details only.

Interpretation of “Admins can see everything but learner facilitator chats could be private”: admins see operational profiles/progress/teaching scopes/reviews/referrals/history, not private chat contents or snippets in counts/history. An explicitly submitted support note is shared; teaching conversations are not silently copied. New assignments start participant-specific chat; old participants retain their earlier conversation, and a newly assigned facilitator cannot see its contents.

## Implementation and ownership

Main: model, validated append-only persistence/migration, root integration, tests and final review. Executor: connected workspace UI/CSS. Independent review for identity/role/privacy/migration boundaries. Reuse React/Vite, existing curriculum/design, no production dependency. Earlier detailed screens/reports remain available via explicit navigation and preserved source snapshots.

- [x] Durable sample identities, individual sign-in and learner/facilitator registration.
- [x] Shared directory, reviewed teaching scopes/additional topics, assignment and review gates.
- [x] Course enrolment, lessons/quizzes, submissions and resubmission reset.
- [x] Chat window, participant privacy, unread state, admin communication and support referrals.
- [x] Existing data preserved/imported with recovery and explicit reset scope.
- [x] Model/preflight, independent review, browser/mobile/accessibility/production CSP checks.
- [x] Documentation updated and connected interface opened for review.


## Delivered and validation — 21 October 2026

Connected workspace is now the default app-demo entry. Show sample sign-ins exposes Ada, Sani, Amaka, Tunde and the sample administrator; buttons fill the sign-in fields without bypassing the code step. New learner/facilitator registrations generate public demonstration codes and persist in localStorage under mosaic-connected-v1. Active identity remains in memory and sign-out clears drafts/selections. Only Administration can open the normal full-reset control; corruption recovery also offers explicit scoped reset.

Administration sees all registered learners, including those awaiting a course choice, and all facilitator registrations/scopes. Existing approved subjects remain active while additional claims await review. Additional topics can be proposed and reviewed for curriculum planning; approval does not create a published course without lessons, quiz and assessment content.

Course study uses retained content, real lesson checks and quiz grading. Practical changes clear approval and need a new assignment before a facilitator decision. Archived enrolled courses remain resumable. Participant/course-specific chat has unread indicators, explicit read actions, keyboard-focusable scroll history and separate Administration conversations. A newly assigned facilitator receives a new conversation and cannot inspect the earlier facilitator's messages. Original participants retain their older read-only conversation after reassignment. Support notes share only what the sender explicitly enters.

Source files: connectedDemo.ts (types/replay/model/storage/selectors); ConnectedWorkspace.tsx (loading/recovery/sign-in/confirmed reset); ConnectedParticipantDemo.tsx and connectedDemo.css (interfaces); AppDemoPage.tsx (connected entry and earlier navigation); connectedDemo.test.ts and scripts/browser-connected.mjs (checks). sharedDemo.ts exports its existing validator without changing validation behavior.

Evidence:

- npm.cmd run preflight passes 101 model tests, TypeScript and production build. Final UI refinement build also passes (84 modules; main611.74kB/179.80gzip, existing size advisory). No new runtime dependency.
- Connected browser passes ten WCAG A/AA axe audits: sign-in, learner/facilitator chat, Administration directory, new learner study, pending facilitator/topics, mobile/200% text, second-course conversation after reassignment and recovery. Full flow covers new registrations, unenrolled learner visibility, actual quizzes/lessons, revision reassignment/review, chat privacy and keyboard scrolling, support handoffs, reload, reset confirmation/cancellation, preserved original shared/sandbox bytes and zero POST/page errors.
- Same complete connected flow passes on preview4173 under actual production CSP. Existing Facilitator, User eight-course and production smoke scripts pass in the earlier-workspace route. Full fifteen-script suite was not rerun.
- Independent review found incomplete earlier drafts could block import, and a first-thread shortcut prevented second-course chat. Both corrected; review recheck clear. Added meaningful incomplete-draft import/retained-version regression and browser second-course-after-reassignment check. Browser audit found chat scrolling needed keyboard focus; corrected and verified.
- Desktop Administration and mobile chat screenshots inspected. Artifacts: ignored output/playwright/connected-*. Visible teaching-review browser is open in the connected landing screen with Show sample sign-ins expanded, ready for the user. No sample actions were automatically performed there.

Reproduce: npm.cmd run preflight, dev server5173, npm.cmd run test:connected. Production test: set CONNECTED_URL=http://127.0.0.1:4173/ and CONNECTED_CSP=1, then run node scripts/browser-connected.mjs. Finish builds before dev browser tests. Earlier scripts now explicitly use ?workspace=earlier to preserve their original scope; their fifteen-script chain includes the connected test.

## Preservation and limits

On first use the connected store captures a validated earlier SharedDemoSession snapshot, imports its named learner/progress and preserves full administrative/course/history data. An earlier teaching application also becomes a pending teaching profile with a first-use demo code. Incomplete drafts remain retained/review-only, and enrolled archived course versions stay available. Earlier detailed screens and reports are reached explicitly and remain a separate historical workspace; later edits there are not automatically merged into an already initialized connected store. Use the connected interface for new participant work.

This is a local presentation with public demonstration codes and participant-filtered interface views, not production authentication, encrypted messaging or cross-device service. Browser/device owners can inspect local data. Use sample details only. Denied/quota/conflicting storage leaves an explicit memory warning; prefix checks prevent sequential stale-history overwrite, but there is no real-time multi-tab synchronization or atomic simultaneous-writer protocol. Topic approval is curriculum planning, and support responses do not establish delivery/payment. Existing grant/PDF reports remain preserved in the earlier detailed workspace and are not reports of the new registry.

User subsequently authorized documenting all progress, committing and pushing the accumulated implementation and handoffs. Git delivery evidence is recorded in the main handoff after verification. No deployment, external messages, backend or financial action is part of this checkpoint. Visual acceptance remains pending.

# Connected funding demonstration

Implemented locally, 7 November 2026. Open **Projects & Possibilities → Open the app demo**. The interface connects fictional learner, facilitator and Administration identities through records stored in this browser. No backend, external delivery or deployment was added.

## Fresh presentation and clearer navigation — 7 November continuation

Use `?demo=connected` to open the current workspace directly. This URL only selects the page; it never resets data. The entry screen now presents Learner, Facilitator and Administration choices before the public directory; choosing a role fills a public sample sign-in and retains the explicit Sign in action.

**Demo controls → Start a fresh demo → Clear demo activity and start fresh** removes this origin's connected store and this tab's four named earlier/guided/sandbox/backup stores. It creates a `cleanStart: true` schema-1 baseline with the five permanent sample identities and eight published courses, zero enrolments, assignments, messages or activity, and no imported legacy snapshot. Other tabs/profiles/origins are not remotely cleared. Existing normal baselines remain unchanged unless explicitly reset.

The reset snapshots only the named keys in memory, verifies deletion/new storage, and attempts exact rollback on failure; it reports partial recovery honestly. Unrelated browser data is untouched. Full-page reload discards old in-memory models and temporary attachments. The original sandbox may recreate its default fixture on application startup. Connected scoped reset preserves a clean presentation's empty baseline.

Older screens are labelled as earlier demos; **View earlier demos**, **Back to earlier demo** and **Back to connected demo** identify their destinations. They remain accessible for historical detail.

## What works

- Learners see next steps, learning/feedback status, unread messages and support handoffs. Facilitators see assigned learners and current work; Administration sees pending action queues, with nonzero queues first. Actions link to the relevant work/support record where applicable.
- Visitors and learners browse approved, consenting facilitators by name, subject and optional home state. Public projections exclude account codes, usernames, private biographies, access preferences and review notes. No invented credentials, availability, ratings or locations.
- Optional public introductions are separate from teaching evidence. Administration reviews the text; active teaching approval and reviewed subjects are also required. Pending replacements retain the last approved introduction. Consent withdrawal hides the listing immediately.
- Pre-sign-in facilitator/course choices survive registration and identity changes in page memory. Learners explicitly confirm; enrolment and request are one validated action. Duplicate pending requests are rejected; changing preference supersedes the old pending request. Withdrawal and decision history remain visible.
- Administration confirms the preferred facilitator, assigns another eligible teacher with an explanation, or declines. Decisions use the latest practical-work revision. Manual assignment also resolves a pending preference, preventing contradictory status. A request alone grants no teaching chat or review rights.
- New registrations choose a home state; existing people can choose later. Everyone signed in can browse all 36 states and FCT, regardless of home state. Administration and approved facilitators publish; every signed-in participant can reply to open visible discussions.
- Notices have chronological replies, pinning, explicit read controls and unread counts. Administration hides/restores/closes/reopens with reasons. Hidden originals, including ordinary replies under a hidden parent, remain inspectable in the separate Administration moderation view; they are absent from normal views and activity.

## Demonstration sequence

Use [the presenter walkthrough](../public/downloads/walkthrough.md). The collapsible in-app guide describes the same relationships without creating activity, changing identities or resetting records. Sample codes remain visible through Show sample sign-ins; normal sign-in is retained.

Learner request → Administration decision → assigned facilitator → teaching feedback/message → learner response. Support travels separately to Administration. State boards provide shared community discussion, not private teaching chat.

## Technical boundaries

- Existing React/TypeScript/Vite stack and dependencies. `connectedCommunity.ts` owns additive community types, validation, replay and selectors. `ConnectedCommunityPanels.tsx` contains the role-home/directory/request/board interfaces. Root selection state lives outside identity-keyed participant screens.
- Existing schema 1 and `mosaic-connected-v1` remain in use. Historical registration events without home state/public fields still replay. Earlier sessionStorage, retained courses, assessment gates and recovery/prefix checks remain unchanged.
- Public-profile review applies to the submitted draft under existing global expected-version guards. Previously approved text and subjects are retained while replacements await review.
- Board read positions are per participant/notice global content high-water marks. Explicit read advances through the supplied current event version for visible notices. Hidden content does not count as unread; restoration uses original order and does not invent new activity. A reply restored below a previously advanced read position is treated as read.
- The existing 2,000-event history limit remains. There is no automatic reset, compaction or simultaneous-writer protocol. Storage warnings and explicit reset/recovery remain; reset confirmation names the new community records.
- Public demo codes are not real authentication; participant-specific screens are not production security. Funding would establish the live service, delivery partners, staff and reviewed training provision. No real opportunities, outcomes or delivery are represented by sample activity.

## Verification

Run `npm.cmd run preflight`, `npm.cmd run test:connected` and `npm.cmd run test:community`. `test:ui` now includes the community journey. The community browser script can use `CONNECTED_URL=http://127.0.0.1:4173/` and `CONNECTED_CSP=1` against production preview.

Final command evidence is recorded in [validation](validation.md) and the [current handoff](../SESSION-HANDOFF.md). Automated audits supplement user testing; user visual acceptance remains pending.

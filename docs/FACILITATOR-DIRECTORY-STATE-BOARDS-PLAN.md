# Facilitator directory, learner preferences and state noticeboards

Status: **agreed plan; NOT IMPLEMENTED; implementation deferred by the user**.
Recorded: 28 October 2026. This is the continuation specification for a future session.

## 1. Latest instruction and authorization

The user asked whether learners could browse approved facilitators and their subjects before signing up, and requested a noticeboard/general communication space for every state. A planning interview established the decisions below. The user initially requested implementation, then immediately superseded that instruction with: **“Dont build anyuthing yet, document thorougly for next timew.”**

Only documentation was authorized for this checkpoint. No application code, model, tests, dependencies, browser records or deployment should be changed as part of this documentation task. A future agent must obtain a renewed instruction to implement; this document alone is not authorization to start building, commit, push or deploy.

The existing connected workspace remains implemented and awaiting explicit user visual acceptance. Administrator wave 5 and earlier grant Reports/PDF remain accepted and closed. This proposed extension does not imply acceptance of the existing connected UI.

## 2. Starting point verified in the repository

- React 19 / TypeScript / Vite, with installed dependencies and existing connected model/browser checks.
- The default app-demo entry is the connected participant workspace. Earlier detailed screens remain available through `?workspace=earlier`.
- Permanent fictional samples: learners Ada Okafor and Sani Musa; facilitators Amaka Obi and Tunde Bello; sample Administration.
- New facilitators already register with a private teaching biography and requested courses. They begin pending; Admin approves or requests changes. Approved teaching scope controls assignments and practical review.
- Learners currently see assigned teaching contacts, not a public directory. `visiblePeople` is relationship-based; do not widen it indiscriminately to implement discovery.
- Connected `Person` currently has no home-state or separate public-introduction fields. There are no connected noticeboards or learner facilitator-preference requests.
- Course completion requires every retained lesson, best quiz score at least 70%, submitted practical work and facilitator approval. Resubmission clears review and requires fresh assignment for the new revision.
- Teaching chats are participant-specific. Admin's normal interface excludes teaching-chat contents/snippets. Support notes are explicitly shared separately.
- Connected storage: localStorage `mosaic-connected-v1`, schema 1, retained course/legacy snapshot and append-only validated events. Commands enforce actor, expected global version, assignment and submission revision. Exact retries are idempotent. Save checks preserve the history prefix.
- Earlier sessionStorage records and backups remain separate. Later edits in the earlier workspace are not automatically merged into an initialized connected store.
- Existing save/recovery behavior preserves malformed data and warns on denied/quota/conflicting writes. There is no automatic multi-tab synchronization or atomic simultaneous-writer protocol.
- Git status was clean before this documentation work. Latest local commit: `43c156d` (documentation receipt); implementation checkpoint: `b3f028d`. Previous push verification is recorded in the main handoff; remote state was not rechecked on 28 October.

Source entrypoints: `src/connectedDemo.ts` (types/replay/validation/storage), `src/ConnectedWorkspace.tsx` (loading/identity/commands), `src/ConnectedParticipantDemo.tsx` and `src/connectedDemo.css` (UI), `src/nigeriaLocationIndex.ts` (existing state/LGA index), `src/connectedDemo.test.ts`, `scripts/browser-connected.mjs`.

## 3. Decisions explicitly selected by the user

| Question | Agreed decision |
|---|---|
| Who sees the facilitator directory? | Visitors before registration and signed-in learners. |
| What does a learner do after choosing a facilitator? | Request that facilitator; Admin confirms assignment. No automatic direct joining. |
| Who reads state noticeboards? | Signed-in learners, facilitators and Admin. Not anonymous visitors. |
| Who publishes notices? | Admin and approved facilitators. |
| Who replies? | All signed-in participants; Admin moderates. |
| How does state affect access? | Record a home state and default to its board; allow browsing and participation across all 36 states and FCT. |
| Local or online? | Extend the current same-browser local demo first. |
| Public facilitator information? | Name, approved subjects, a separate reviewed public introduction, and home state if supplied; facilitator agrees to publication. |
| First noticeboard feature set? | Text notices and threaded replies, pinning, unread indicators, Admin hide/close controls. No attachments. |

The remaining detailed behavior below consists of implementation defaults from the completed plan. Keep these unless the user changes them; distinguish them from individually selected interview answers.

## 4. Role connections and permissions

```text
Visitor -> approved facilitator directory -> course + preferred facilitator
        -> learner registration/sign-in -> confirm enrolment and request
        -> Admin decision -> confirmed course assignment
        -> learner <-> assigned facilitator teaching chat/practical review

Facilitator -> registration + teaching subjects + optional public profile
            -> Admin review -> approved subjects and public listing
            -> pending changes -> Admin review again

Admin / approved facilitator -> state notice -> signed-in participants
Signed-in learner / facilitator / Admin -> replies within that notice
Admin -> pin / close / hide / restore, with retained moderation history
```

| Action | Visitor | Learner | Pending facilitator | Approved facilitator | Admin |
|---|---|---|---|---|---|
| Browse approved public directory | Yes | Yes | May browse public listing | May browse public listing | May browse public listing |
| Request facilitator for own course | Select before sign-in only | Yes | No | No | Reviews requests |
| Edit own home state | No | Yes | Yes | Yes | Yes |
| Submit own public introduction/consent | No | No | Yes | Yes | Reviews submission |
| Read any state board | No | Yes | Yes | Yes | Yes |
| Publish a notice in any state | No | No | No | Yes | Yes |
| Reply to visible open notices | No | Yes | Yes | Yes | Yes |
| Pin/close/moderate notices or replies | No | No | No | No | Yes |
| Inspect hidden original board content | No | No | No | No | Yes |

Directory publication, teaching approval and assignment are separate decisions. A preference does not grant chat access, and a public listing does not create an assignment. Home state does not restrict teaching or board participation.

## 5. Public facilitator directory and approval

Add **Find a facilitator** to the connected landing screen and learner navigation. Show name search, approved-course filter and optional home-state filter. Directory cards lead with approved subjects and the learner's course/request action. Label home state as location, not service coverage or eligibility.

Public projection must contain only a stable facilitator identifier, display name, fictional-sample label, reviewed introduction, approved subjects and optional home state. Never pass raw `Person` objects to public directory components. Exclude demo codes, usernames, private teaching biography, access preferences, goals not intended for publication and Admin review notes. This is interface-level data minimization in a local demo, not a production security claim.

Add separate **Public introduction** and publication-consent controls to facilitator registration and Teaching profile. Explain that this text is for prospective learners. Keep private evidence/experience separate. Consent is optional; a facilitator can be approved and assigned without opting into the public directory.

Admin reviews the proposed public introduction alongside the teaching scope. Only active facilitators with approved subjects, explicit consent and an approved introduction are listed. Publishing consent alone is insufficient. Retain the last approved introduction while a replacement awaits review. Keep the last approved teaching subjects while new claims await review; never advertise pending subjects. Withdrawing consent hides the listing immediately. Restoring consent must not publish unreviewed replacement text.

Existing non-sample facilitators must actively submit/consent before being listed. Permanent fictional samples may have clearly labelled reviewed public examples. Do not invent real locations, qualifications, ratings, availability, capacity, endorsements or contact details.

Show requested public text and consent state clearly to Admin. Empty results explain that no matching approved facilitator is listed; do not suggest no teaching exists. Only published courses available for new enrolment offer a request action.

## 6. Learner selection, request and Admin decision

1. A visitor selects **Request this facilitator** for a specific published course.
2. Keep facilitator/course selection in page-level state outside the identity-keyed connected UI so registration/sign-in does not discard it. Display it with a Cancel action. Persistence across reload is not required for this pre-sign-in selection.
3. After learner sign-in, show the choice and require explicit confirmation. Do not silently enrol or submit a request on login. A facilitator/admin identity cannot submit a learner request.
4. Confirmation atomically enrols if needed and records the preference; reuse an existing enrolment. Failure leaves neither a partial new enrolment nor a partial request.
5. Permit one pending request per learner/course. Changing preference supersedes the prior pending request with retained history; withdrawal is explicit. Prevent duplicate click/retry submissions.
6. The learner sees pending/assigned/declined/withdrawn/superseded history and the decision explanation. Existing assignment remains until Admin changes it.
7. Admin's **Facilitator requests** queue shows learner, course, preferred facilitator, current assignment and current eligibility. Admin assigns the requested facilitator, assigns another eligible facilitator with an explanation, or declines with a reason.
8. Resolve request and assignment in one validated decision event. Recheck eligibility at decision time. Read the enrolment's current work revision rather than trusting an old request revision.
9. An ordinary manual assignment must not leave a contradictory pending preference. Resolve an applicable pending request with that assignment and its note, or route Admin through the same decision control.

Eligibility: actor is the learner, course accepts new enrolment/request as appropriate, target remains an active facilitator with approved scope for that course, and new directory requests target a currently published listing. If a selection becomes unavailable, explain why and offer another choice. Directory withdrawal does not itself revoke an existing teaching approval or assignment; Admin may still choose any otherwise eligible facilitator when resolving a request.

No direct learner-to-unassigned-facilitator chat or facilitator acceptance step is added. Once assigned, existing participant/course chat and review guards apply. A revised practical submission continues to need a fresh Admin assignment; a request is not a substitute. None of these actions bypasses lessons, quizzes, practical submission or completion rules.

## 7. Home state and 37 noticeboards

Use canonical state values from the existing Nigeria location index, including FCT; do not create a second inconsistent list or load heavy map geometry just to populate selectors. No new LGA requirement or geolocation.

Require home-state choice for new learner/facilitator registration. Existing records remain valid with no state; show a non-blocking invitation to choose one. Provide an editable Home state setting to all signed-in roles. Existing unlocated samples may remain unlocated rather than receiving guessed state facts.

Add **State noticeboards** to signed-in navigation. Default to the selected home state on entry; if absent, ask the participant to select a board. Home-state changes affect the next default, not the ownership/state of old posts. Board selection never changes the profile automatically.

Everyone signed in can read and participate across states. Admin and active approved facilitators can publish; all signed-in participants, including pending facilitators, can reply. These are shared community messages, clearly distinct from teaching chat and private support handoffs.

### Notice content and ordering

- Required title (maximum 150 characters) and body (maximum 3,000), author identifier, role at publication, canonical state and event timestamp.
- Replies have author, role at publication, timestamp and required text (maximum 3,000); order chronologically under their notice.
- Render plain text safely; preserve readable line breaks. No HTML injection, file attachments, editing or cross-state broadcasts in this phase.
- Pinning is per notice. Pinned visible notices sort first, then newest notices, with deterministic event order for ties.
- Empty boards explain who can publish and invite an eligible author to create a first notice. Never fabricate activity or state-specific real opportunities.

### Moderation and unread behavior

- Only Admin pins/unpins, closes/reopens, hides/restores notices or replies. Require a nonblank reason for moderation changes and retain actor/time/original content in event history.
- Closing blocks new replies for everyone, including Admin; reopening restores reply ability. Existing visible discussion remains readable.
- Hiding a notice excludes the notice and its replies from normal views, search/counts and unread totals. Hiding a reply removes its original contents from ordinary views; show a neutral moderated-reply placeholder if useful, without repeating the text or reason.
- Admin has a separate moderation view for original hidden content and reasons. Closing/hiding does not destroy records. Never leak hidden text through ordinary activity summaries or snippets.
- Track per-person per-notice read positions against stable content-event order. A notice is unread for its visible post/replies after that position from other authors. Own content and moderation events do not create unread counts. Restoration uses original content order, not fabricated fresh activity.
- Show unread activity per notice and a count of notices with unread activity per board. Provide explicit **Mark notice as read** and **Mark board as read**; only mark currently visible content through the current event version. Opening a board alone does not clear unread state.
- Preserve read positions across identity switches/reload. Hidden content contributes no unread activity; restoring content respects prior read positions.

## 8. Model, interfaces and persistence strategy

Keep `ConnectedState` schema 1 and the `mosaic-connected-v1` key compatible. Extend derived person/view types and the action allowlist with additive validated events; old registration/review events must replay exactly as before. New optional payload fields require explicit type/length checks when present. The current UI requires state for new registration; legacy event replay must not be rejected for omitting it.

Derived additions: home state; public-introduction draft/consent and last approved snapshot; facilitator request records/status/decisions; notices/replies/moderation; read positions. Keep application requests and board records separate from teaching `ChatThread` data.

Command families: update own state; submit/withdraw public profile; enrol-and-request/change/withdraw preference; Admin resolve preference; publish/reply notice; moderate notice/reply; mark notice/board read. Extend existing review/register interfaces only where necessary. Reuse existing assignment logic inside request resolution, including role/scope/revision checks.

For public introduction and scope reviews, snapshots must refer to the submitted version Admin actually reviewed. A stale UI must not approve newer unseen text. Use the existing expected-version guard, retaining last approved snapshots. Consent withdrawal must remain immediate even when another review is pending.

All commands validate roles, actor ownership, state keys, subject eligibility, parent notice/reply relationships, pending/closed/hidden transitions, allowed payload keys and read bounds. Do not rely on hidden buttons as authorization. Extend existing retry/version/history checks and conflict warnings. Keep the 2,000-event limit and explain it in docs; do not silently truncate history or reset users to make room.

No destructive migration, automatic reset, new storage backend, real authentication, encryption, network message delivery or concurrency protocol. Preserve earlier sessionStorage/backup/sandbox bytes. Scoped reset must clearly include new requests, board posts/replies, moderation and read state. Saving denied/conflicting/quota writes keeps the existing explicit memory warning.

## 9. UI direction and implementation sequence for next time

Reuse the existing interface-design system, typography, colours and components. This is a practical learning community: subjects, approval, state, learning progress and conversations are the main vocabulary. Keep the directory's focal point on choosing a subject/teacher and the board's on choosing a state/reading a notice. Use existing warm surfaces and status accents; avoid invented KPI cards, busy social feeds and map-heavy navigation. Do not add process narration to product copy.

Suggested future sequence after renewed implementation authorization:

1. Read this spec and current handoff; inspect Git status, local instructions and current sources. Preserve all user edits. Run baseline preflight if starting implementation.
2. Extend model/validation/replay and meaningful tests for compatibility, public projection, preferences and boards before connecting UI.
3. Build public-directory and profile/review controls, retaining pre-login selection outside identity-remounted UI.
4. Build learner request confirmation/history and Admin queue/decision controls; preserve existing assignment pathways coherently.
5. Build state settings and noticeboard navigation, discussions, unread and moderation controls. Use separate components for these additions rather than expanding the existing dense role component indefinitely.
6. Validate the final behavior and obtain independent review of new permission/persistence boundaries. Review findings must be corrected/rechecked.
7. Update implementation/validation docs with actual evidence, then present the completed flows for user visual acceptance. Commit/push/deployment require their own current authorization.

The main agent remains default implementer/reviewer. Delegate only if the repository workflow criteria justify bounded, non-overlapping ownership; do not duplicate discovery or automatically create a planner. Documentation-only work does not justify delegation.

## 10. Acceptance and validation matrix

| Area | Required evidence |
|---|---|
| Directory privacy | Anonymous projection contains only allowed fields; no raw private application/account/support data. Pending/unconsented/unreviewed profiles remain absent. |
| Public approval | Registration -> pending -> Admin approval -> listing; pending replacement retains approved text/subjects; rejected replacement does not publish; withdrawal hides immediately; old profiles are not auto-published. |
| Filters/empty states | Search/course/home-state filters work together; clear filters; state is not implied teaching coverage; no false availability claims. |
| Visitor journey | Select course/facilitator -> register or sign in -> explicit confirmation -> exactly one enrolment and request; cancellation and wrong-role sign-in handled. |
| Request lifecycle | Duplicate/retry, preference change/withdrawal, decision reasons, alternatives, unavailable target, stale decision, manual assignment reconciliation and historical decisions. |
| Learning invariants | Requests cannot open teaching chat or assess work; only current approved assignment/revision can review; resubmission/completion behavior preserved. |
| States | Exactly 37 unique canonical boards, including FCT; new registration state required; legacy no-state load; editable default; read/participate across states. |
| Posting permissions | Anonymous access blocked; learner/pending facilitator cannot publish through direct commands; they can reply to visible open notices; approved facilitator/Admin can publish in any state. |
| Moderation | Non-Admin cannot pin/close/hide/restore; reasons retained; closed blocks reply; hidden parent hides children; normal selectors/counts/activity omit hidden text. |
| Unread | Other-author content only; per-person persistence; explicit notice/board marking; no regression from stale mark-read; hidden/restored and pinned/closed behavior. |
| Persistence | Old schema-1 history replays unchanged; existing bytes and prefixes retained; reload/identity switch; corrupt/future data recovery; denied/quota/conflicting save; reset confirmation and cancellation. |
| Browser/UI | End-to-end registration/public approval/request/assignment and multi-role board flows; loading/empty/error states; mobile and desktop, keyboard/focus, 200% text and WCAG A/AA axe audits. |
| Production | Focused flows pass under actual production CSP; no unexpected POST/network delivery/page errors; earlier routes and support/chat boundaries remain intact. |

Use model tests for command permission and replay invariants, plus browser tests for the actual role journeys. Do not write tests that merely mirror card markup. Independently review new permissions, public projections and persistence compatibility before claiming completion.

Commands for a future implementation session (finish build before browser journeys):

```powershell
git -c safe.directory=D:/AyubaGufwanDisabiliyt status --short
npm.cmd run preflight
npm.cmd run dev
# In another terminal, once dev is ready on 5173:
npm.cmd run test:connected
```

Production-CSP reproduction after build, preview on 4173:

```powershell
npm.cmd run preview -- --port 4173 --strictPort
# In another terminal:
$env:CONNECTED_URL = 'http://127.0.0.1:4173/'
$env:CONNECTED_CSP = '1'
node scripts/browser-connected.mjs
Remove-Item Env:CONNECTED_URL, Env:CONNECTED_CSP -ErrorAction SilentlyContinue
node scripts/browser-production.mjs
```

Extend the existing connected journey or add a focused browser script and include it in the relevant npm verification command. Actual future commands/results belong in the implementation closeout.

## 11. Evidence at this documentation checkpoint

No feature has been built or tested for this extension. The **last recorded implementation baseline** from 21 October is 101 model tests, TypeScript/build, connected dev/production-CSP journeys and earlier targeted regressions passing; the full fifteen-script UI suite was not rerun then. These are historical baseline results, not verification of the proposed directory or boards.

For this documentation change, inspect the final diff and local Markdown links. Runtime preflight is not necessary for prose-only changes; do not run build just to update docs because it regenerates tracked static-story files. Leave the implementation snapshot inventory unchanged until an explicitly intended source checkpoint refresh; its documentation hashes will therefore describe the previous checkpoint.

Current continuation: **documentation complete; implementation deferred; await renewed user instruction**. See [main handoff](../SESSION-HANDOFF.md), [existing connected scope](CONNECTED-WORKSPACE.md) and [session history](SESSION-HISTORY.md).

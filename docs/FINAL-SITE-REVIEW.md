# Final site review — 8 November 2026

The original review below recorded the remaining gaps before map integration. Following the user's instruction, the map integration finding is now resolved: the current Administration workspace has a Learner map driven by connected records. See [connected learner map](CONNECTED-LEARNER-MAP.md) for implementation and verification. The navigation-URL and illustration suggestions remain separate follow-up items.

## Findings, in priority order

### Resolved after review — maps were confined to the earlier workspace

Evidence:
- src/ConnectedParticipantDemo.tsx:34 defines the current Administration menu without a map entry.
- src/AdministratorDemo.tsx:9 imports the earlier geography screen.
- src/AdministratorGeography.tsx:26 reads learnerRows(session), and src/reportingDemo.ts:13 builds those rows from the earlier shared session and explicitly loaded geographic samples.
- src/connectedDemo.ts:7 gives connected participants a homeState field but no LGA field.

Impact: a learner registered through the new flow does not automatically appear in the earlier map. Administrators must leave the current workspace to reach geography, and the two screens do not share a live registry.

Correction: expose a Learner map in the current Administration menu, using connected participant home states as its source of truth. Reuse the existing validated atlas and accessible map controls. Only show LGA-level participant counts after the connected registration/profile model actually collects LGA; do not infer LGA from state or mix earlier sample counts into connected counts.

### Medium — public page navigation does not create normal page URLs

Evidence: src/App.tsx:80 initializes public navigation from the demo query only; src/App.tsx:238 changes page with setPage without updating browser history.

Impact: visitors cannot reliably bookmark/share a specific public page or use browser Back through Home, Learning Sandbox, Research and About. Refresh normally returns to Home except for the explicitly supported demo query.

Correction: give public pages stable paths or a page query, synchronize history/popstate, and use real links for navigation. Preserve existing accessibility and the app-demo/earlier-workspace query handling.

### Suggestion — distinguish illustrated activities from available curriculum

Evidence: src/RemoteLearningArtwork.tsx:5 labels an Electronics teaching panel. The eight published courses in src/catalogue.ts and src/skillCourses.ts do not include an electronics course. Sewing is available as a foundation/planning course, rather than a qualification to operate the pictured machine.

Impact: visitors may interpret every illustrated activity as an immediately available practical course.

Correction: keep the requested illustration but identify the pictured activities as examples, or explicitly mark Electronics as planned. Describe course outcomes and delivery formats accurately before enrolment. Do not create an empty electronics course just to match the image.

## What connects and passed

- Role selection to the matching sign-in panel; the form is absent before selection.
- Matching learner/facilitator registration; Administration has no registration option.
- Learner enrolment, lessons, quizzes, practical submission and resubmission.
- Administration assignment and facilitator review, with completion gates.
- Participant/course-specific messages and explicitly shared Administration support notes.
- Learner-only facilitator directory, requests, Administration matching and publication review.
- State noticeboards, read states, moderation, reload and record-preserving recovery.
- Mobile and enlarged-text behavior exercised by the connected/community checks.

These are browser-local demo connections. Real shared accounts and cross-device message delivery are outside the implemented scope; src/connectedDemo.ts:236 loads the connected store from localStorage. This is a delivery boundary, not a new defect found by the review.

## Maps verified

- Local asset: public/nigeria-admin-map.json, 549,521 bytes.
- 37 state/FCT areas: 36 states plus the FCT.
- 774 LGA boundaries.
- Nigeria → Plateau → Jos North keyboard drill-down worked; Plateau contains 17 LGAs.
- Phone reflow worked without horizontal page overflow.
- Forced asset-load failure preserved the learner list; retry restored the map.
- Connected and earlier stored records remained unchanged by map navigation.
- Route: choose Administration, sign in, View earlier demos, select the Administration tab, then Learner map.

## Verification evidence

- npm.cmd run preflight: 118 tests passed; TypeScript and production build passed.
- Connected workflow script: 10 clean accessibility audits; no page errors or POST requests.
- Community workflow script: 11 clean accessibility audits; no page errors or POST requests.
- Isolated map review: 3 clean accessibility audits; no page errors; successful map responses and fallback/retry.
- The build retains its existing large-JavaScript-chunk advisory; this review did not change dependencies or architecture.
- Evidence: output/playwright/connected-axe.json, community-results.json and final-review-map.json.
- Screenshots: output/playwright/final-review-map-country.png and final-review-map-mobile.png.

The full historical UI test chain was not rerun. The current connected/community journeys and the map checks above were rerun against the production preview.

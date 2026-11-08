# Connected Administration learner map

The current Administration workspace now includes **Learner map**. It uses the current connected participant records, including new learner registrations and later home-state changes. The earlier map remains available in the earlier workspace and keeps its separate records.

## Behavior

- Nigeria state/FCT view with learner counts from the selected connected profile scope.
- All learners, registered learners or sample learners; facilitators and administrators are excluded from the counts.
- State selection, keyboard operation, search and a missing/unmatched-state list.
- State-to-LGA boundary drill-down using the existing local 37-area/774-LGA atlas.
- LGA geometry is reference-only: connected profiles currently collect a home state, not an LGA. No LGA counts or inferred LGA assignments are presented.
- Open learner links navigate to the learner's existing course-work record or unenrolled profile card and focus it.
- Loading, offline and malformed-map states retain the current learner list. Retry reloads the local asset. Navigating the map does not write records.
- Home-state edits, made by the participant through the existing setting, are reflected the next time Administration opens the map and survive reload.
- The menu entry and component are Administration-only; other roles retain their existing interfaces. The screen and CSS load on demand.

## Files

- `src/ConnectedLearnerMap.tsx` and `src/connectedLearnerMap.css`: current map screen.
- `src/connectedGeography.ts`: current learner filtering, location normalization and state grouping.
- `src/ConnectedParticipantDemo.tsx`: guarded menu/screen and learner-record links.
- `src/ConnectedCommunityPanels.tsx`: existing home-state setting, with its map connection explained.
- `public/nigeria-admin-map.json`: existing validated local boundaries and attribution.

No record-schema migration, new production dependency or geographic sample data was added.

## Verification

`npm.cmd run preflight` passes 120 tests, TypeScript and production build. Two new unit tests cover role/sample filtering, state aliases, missing locations, registration and later state changes, and immutable existing events.

With the server running, use `npm run test:connected-map`, or set `CONNECTED_URL=http://127.0.0.1:4173/` and run `node scripts/browser-connected-map.mjs` against the production preview. This checks real registration, role guards, current state counts, sample scopes, Nigeria/Plateau/FCT drill-down, honest LGA labeling, both enrolled and unenrolled learner links, persisted location edits, mobile/200% text, and loading/malformed/offline retry. Its seven accessibility audits pass with zero page errors/POST, and map navigation preserves both connected and earlier records.

Evidence is saved under `output/playwright/connected-map-*` and excluded from Git.

---
status: superseded
---

# Facilitator wave 1: assigned learning workspace

Current continuation: this earlier implementation is preserved via `?workspace=earlier`. The [connected workspace](CONNECTED-WORKSPACE.md) and [main handoff](../SESSION-HANDOFF.md) supersede its next-wave instructions. User now authorized documentation, commit and push of all accumulated work.


## Authorization and scope — 21 October 2026

User accepted Administrator closeout: “It seems okay, we can close and proceed to next”. Administrator wave 5 closes by user acceptance, using previously recorded technical evidence. This statement does not establish additional manual device or screen-reader testing.

Next stage is the previously deferred Facilitator demo. First wave: explicitly select an approved demo roster identity; inspect its latest course, practical and question assignments; search/filter; inspect retained course requirements and submitted evidence; distinguish stale assignments from current evidence. Reuse the existing Mosaic layout, canonical shared session and recovery boundaries. No extra fictional learners or roster entries are created.

This wave is read-only. Feedback, approval, question replies and their immutable actor/evidence histories are wave 2. Real accounts, specialist observations, backend and deployment remain separate work. Simulated identity selection provides no authorization boundary or verified qualification.

## Acceptance gates

- [x] No roster / no identity / no assignments / no search matches have clear next steps.
- [x] Only latest assignments for the selected roster identity appear; superseded assignments cannot inflate counts.
- [x] Changed evidence is flagged; latest practical text is not presented as the originally assigned submission.
- [x] Course requirements use the enrolled learner's retained version for practical work.
- [x] Role exit clears identity and expanded evidence. Optional disclosure and grants are absent.
- [x] Desktop/mobile/enlarged text, keyboard navigation and accessibility checked.
- [x] Preflight and affected browser/CSP checks pass; handoff updated.

## Implementation decisions

- Main agent owns implementation and review. This first wave introduces no persistence schema or mutation commands.
- Reuse the site's green/cream editorial style, serif headings and existing responsive sidebar. Apply frontend-design and Playwright guidance within the existing interface.
- Treat assignments as coordination records, not competence or actual teaching delivery.


## Validation and continuation — 21 October 2026

Implemented in `src/FacilitatorDemo.tsx` and `src/facilitatorAssignments.ts`, integrated into the existing role panel. Identity/evidence unmount on role exit. No new dependency, schema or write command. The first-wave scope is implemented and ready for user review.

- `npm.cmd run preflight`: 86/86 model tests, TypeScript and production build pass; final `npm.cmd run build` also passes after the label refinement. Existing bundle-size advisory remains (main 534.19 kB / 159.24 kB gzip).
- `node scripts/browser-facilitator.mjs`: eight clean WCAG A/AA axe audits, no roster/identity/assignments/search matches, original assigned snapshot after resubmission, stale/current filters, course/question inspection, mobile and 200% text, keyboard navigation, identity reset on role exit/reload, unchanged saved bytes and zero POST/page errors.
- Affected `node scripts/browser-story.mjs`, `node scripts/accessibility.mjs`, `node scripts/browser-user-demo.mjs` and final `node scripts/browser-production.mjs` pass. Story now expects the implemented Facilitator empty state; production CSP checks that state too. Full thirteen-script suite was not rerun.
- Desktop and mobile screenshots visually inspected; artifacts and audit JSON remain ignored under `output/playwright/facilitator-*`.
- Dedicated command: `npm.cmd run test:facilitator` after preflight, with dev server on 5173. The full `test:ui` chain now includes this thirteenth script. Finish builds before dev-browser checks because regenerated index HTML triggers Vite reloads.

Next review: open Projects & Possibilities → Open the app demo → Facilitator. With no approved roster, use User teaching application → Administration approval → Learning oversight assignment. Do not create extra fictional records in the user's existing session automatically.

Next implementation wave: trainer feedback, explicit practical decisions and learning-question replies. Plan actor-labelled append-only decision histories, exact submission/assignment predecessor checks, retries and stale-write rejection before adding controls. Preserve all-lessons / quiz ≥70 / practical / approval completion gates and distinguish foundation completion from observed competence. Current controls remain inspection-only. User visual acceptance of this new wave is pending; Administrator acceptance is already complete.

Changes remain local; no commit, push or deployment in this continuation.

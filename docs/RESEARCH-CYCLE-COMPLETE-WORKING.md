# Slide 7: one cycle complete, the next one starts better informed — 11 November 2026

Owner asked for a brief slide 7 showing how the proposed cycle completes and restarts: each stage reaches a goal that meets a need, and the whole cycle is redone each round based on success and feedback.

Built (shared source `src/researchSlides.ts` → `cycleContent`, new `cycle` layout; render branch in `scripts/build-research-presentation.mjs`; styles in `public/research/deck.css`):
- Five stages on a ring around the participant database, each with its goal and the need it meets: Recruit — reach people often missed; Understand needs — know each person's skills, goals and access needs; Match teaching — the right skill with the right facilitator; Support practice — accessible learning that becomes real skill; Monitor & review — know what is working, and for whom.
- A bold restart arc from stage 5 back to stage 1, with a side panel showing its two inputs, "Progress evidence" and "Participant and facilitator feedback", and the line "What worked continues. What didn't, changes."
- Statement: "Every round meets a need, records what happened, and uses success and feedback to plan the next round."
- Status: "Proposed cycle · No results yet · Measures agreed together during pilot design". No outcomes or numbers are claimed.
- The ring stretches to the window. Card and arrow positions are computed by the browser from the ring's size, so the layout holds from 1440×900 down to 1266×505. On phones and with enlarged text it becomes a numbered vertical list with a restart line. Print keeps the ring.
- Contents: added as slide 7 in section 1. Planned stages renumbered 8–17 and still marked provisional. The kept participation slide is now planned position 10.

What it does not claim: an existing service, an agreed partnership, achieved outcomes, or that participants must stay in the cycle. Success measures, reviewers and review frequency are to be agreed with Gufwan's team during pilot design.

Evidence: same runs as the slide 5 revision (`docs/RESEARCH-RECRUITMENT-WORKING.md`, final section). The browser regression now checks slide 7 text, stage order, the ring's text alternative, no overlapping ring boxes, the restart arc, fit and control clearance at the short-laptop sizes, phone/200%/A+ stacking, read-aloud, reading edition, no-JavaScript page and print.

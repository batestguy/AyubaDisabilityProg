# Mosaic Pathways: agreed user demo specification

Current continuation (8 October 2026): User, Administrator waves 1–4 and the [learner scorecard/threshold follow-up](LEARNER-SCORECARD.md) are complete locally. Next: wave 5 consolidated Administrator closeout. Read [the current handoff](../SESSION-HANDOFF.md#next-session-brief); earlier milestones in this document retain their historical scope. Changes remain uncommitted and unpublished.

Current continuation checkpoint (7 October 2026): [Administrator wave 2](ADMINISTRATOR-WAVE-2.md) implements application/support decisions, immutable history and User responses. Next is wave 2 user review, then wave 3 roster/course coordination. [Main handoff](../SESSION-HANDOFF.md) takes precedence over earlier checkpoint descriptions below.

Current continuation checkpoint, 7 October 2026: the eight-course User stage and [Administrator wave 1](ADMINISTRATOR-WAVE-1.md) are complete locally. This specification records the User requirements; [the main handoff](../SESSION-HANDOFF.md#next-session-brief) governs current state and wave 2 continuation.

Mosaic Pathways helps adults with disabilities identify their abilities, learn useful skills, prepare for work or business, and eventually share their knowledge as trainers or mentors.

Tagline: **Learn skills. Build opportunities. Share what you know.** Three distinct tiles join into an open pathway; green, white and restrained blue, readable wordmark and monochrome SVG. Alternatives retained: SkillBridge, Ability Pathways, Inclusive Futures, Learn, Build, Share. Name availability has not been checked. This is an implemented local demonstration with no assumed Commission endorsement.

## Decisions and boundaries

- Adults 18+, simulated profiles, English first with preferred language recorded.
- No passwords, identity documents, medical records, real authentication, server uploads, live AI, notifications, transactions or real support delivery.
- Separate versioned tab-session model from the existing `mosaic-v1` sandbox. Profile, onboarding answers, course activity, portfolio metadata, requests and applications survive reload within the tab.
- Resume demo and sign out preserve progress; Reset demo clears records and temporary files. Files remain in memory; after reload metadata survives and the file must be reselected to view it.
- User functionality is complete. Administration now provides shared Overview/read-only Learners; review decisions arrive in wave 2. Facilitator screens remain deferred; facilitators mean trainers/mentors.
- All three existing digital/business courses remain functional, with **AI Essentials** added at user-stage closeout. The eight courses contain 48 lessons and 39 quiz questions. People & Workplace Essentials and three Hands-On & Livelihood foundations extend the original catalogue. Users select multiple skill areas before enrolment; all courses remain browsable. Every lesson, best quiz ≥70%, submitted work and explicit trainer approval are required for completion. Resubmission invalidates approval and requires fresh review.
- Recommendations use interests, goals and existing skills; optional disability and gender never restrict courses. Access preferences guide presentation/support.

## Screen sequence and profile

Welcome → Create demo profile → About me → Access preferences → Learning circumstances → Existing skills and evidence → Skill areas, goals, interests and support → Dashboard.

Welcome offers Start my demo journey and Explore a sample profile. Access controls are available before registration. Short onboarding steps have progress, Back/Continue, optional skipping and immediate preservation of answers.

| Area | Fields and behaviour |
|---|---|
| Sign-up | Display name, required adult confirmation, optional sample contact; explain no verification/external registration |
| About me | Nigerian state/FCT, optional LGA and gender/self-description/prefer not to say |
| Access | Optional multiple disability categories and self-description; independent captions/transcripts, larger text, keyboard use, plain language, flexible pace and other support |
| Circumstances | Optional device, internet, preferred language and study availability |
| Skills | Select skills, describe experience or choose starting fresh |
| Evidence | Optional certificates and portfolio descriptions marked unverified, distinct from demonstrated app skills; learning requires no certificates |
| Attachments | PDF/JPEG/PNG only, maximum five files of 5 MB each; metadata/descriptions in session, content only in memory, understandable validation and reselection after reload |
| Goals | Several of employment, freelancing, starting/improving a business, personal development and eventual teaching |
| Interests | Choose one or several of four skill areas and browse all eight courses before enrolment |
| Support | Tools, connectivity, assistive technology and mentoring during/after learning |

## Dashboard and learning

Desktop sidebar/mobile menu: Overview, My learning, My portfolio, Tools and support, Teach others, My profile. Show a prominent next action and pathway: Profile → Choose course → Learn → Practise → Receive feedback → Complete → Apply skills → Explore teaching.

Enrol, resume lessons, retry quizzes, submit practical work and ask questions. Submissions/questions stay pending until an explicit action in a separately labelled **Demo controls** panel provides sample feedback, approval or reply. Add completed practical work to the portfolio only through explicit action. Completion provides an accessible printable **demo achievement record**, not an accredited qualification.

Goal checklists offer choices: employment (skills summary, portfolio, applications, accommodations); freelancing (service, samples, client communication, tools); business (plan, customers, budgeting, startup requirements); personal development (practical goal, continued learning); teaching (reviewed trainer/mentor application). Entrepreneurship is one route among several.

## Support and teaching

Editable support checklist records need, what is available and priority for equipment, connectivity/power, assistive technology/materials, workspace/transport, guidance/preparation/mentoring. Simulated submission displays **Pending review — demo request** and prevents accidental duplicate submission. No equipment, grant, funding or employment is promised.

Teaching has two routes: existing experience (skill, examples, what to teach) or learning progression (at least one completed course, demonstrated skill and practical work). Both require explaining a task and how to make the lesson accessible. Submission displays **Trainer/mentor application: pending review**; no automatic role change. Application review belongs to Administrator wave 2; practical learning assessment remains facilitator-owned.

## Acceptance criteria

- Onboard without disability, gender or certificates; record multiple disabilities separately from access preferences.
- Back and reload preserve entered answers and learning progress; sign out/resume work; reset clears only user-demo records/files.
- All eight courses support lessons, retries, assignments, questions and explicit sample review. Completion/resubmission gates hold.
- Invalid type, oversized and excessive files receive clear errors; no external uploads; after reload metadata persists and reselection is explained.
- Support and both teaching routes have accurate pending states, duplicate prevention and no facilitator role grant.
- Labelled fields, keyboard navigation, error focus, screen-reader status announcements, enlarged text and mobile layouts work; no autoplay or time-limited onboarding.
- Existing website, sandbox and authoring regression journeys pass.

## Research links supplied with the plan

- [Commission priorities reported by FMINO](https://fmino.gov.ng/executive-secretary-national-commission-for-persons-with-disabilities-ncpwd-hon-ayuba-gufwan-has-reeled-out-his-vision-for-the-commission-and-persons-with-disabilities-pwds-community/)
- [W3C accessible multi-page forms](https://www.w3.org/WAI/tutorials/forms/multi-page/)
- [ILO disability inclusion and routes into work](https://www.ilo.org/topics-and-sectors/disability-and-work/pathways-disability-inclusion-world-work)

These links are planning references supplied by the user; this implementation does not independently verify current programme availability.

## User-stage closeout: AI Essentials

Added on 4 October 2026 at the user's request. Six lessons cover AI capabilities/limits, clear prompts, output checking, privacy and responsible reuse, accessibility/fairness, and human-reviewed practical workflows. Five assessment questions and an assignment use the same completion and resubmission gates as the other courses. All exercises can use written prompts and labelled fictional sample outputs; no live AI service, paid account or real personal data is required. English first; existing language choices use the explicit English fallback for this course.

Existing user and sandbox sessions receive the missing course when loaded, preserving profiles, activity and authored courses. This closes implementation of the agreed local User stage. Participant co-design, actual screen-reader testing, name checks and live services remain separate future work.

Course design references: [UNESCO AI competency framework](https://www.unesco.org/en/articles/ai-competency-framework-students) for human-centred judgement; [NIST Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) for inaccurate outputs, privacy and human oversight. These are design references, not accreditation or endorsement.

Next stage: [full Administrator plan](ADMINISTRATOR-DEMO-PLAN.md). Administrator implementation has not begun.

## Skill-area extension implemented

Before enrolling, learners can select several areas: Digital & AI Skills, People & Workplace Skills (soft skills), Hands-On & Livelihood Skills (practical pathways), and Business & Enterprise Skills. Choices are optional, editable and preserved; all courses remain available. Added People & Workplace Essentials, Sewing and Simple Textile Products, Small-Space Growing and Nursery Basics, and Retail and Customer Service Practice. Each has six lessons, five questions and practical written work. The livelihood foundations do not require equipment or assess observed trade competence; materials and support planning lead toward later supervised practice. Existing sessions retain all activity and receive the missing categories/courses.


## Current persistence and continuation

The current app uses schema 2 under `mosaic-user-demo-v1`, owned by `AppDemoPage`/`sharedDemo.ts`, with this User payload in `user`. Stable revisions, submitted snapshots, local milestone events and exact legacy backup are implemented. Administration reads the same records; sign-out preserves them and explicit User reset clears shared history/backup/files while leaving `mosaic-v1` separate. Invalid data remains untouched; storage failure supports editable memory and save retry. See [wave 1](ADMINISTRATOR-WAVE-1.md) and [the next-session brief](../SESSION-HANDOFF.md#next-session-brief). Preserve all eight course gates and User progress when adding wave 2 decisions and changes requests.

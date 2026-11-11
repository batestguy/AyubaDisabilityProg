// Shared source for the Quarto presentation, reading edition and no-JavaScript alternative.
export interface ResearchImage { path: string; alt: string; caption: string; credit: string; source: string; displayCredit?: { name: string; credit: string; sourceLabel: string } }
export interface ResearchSlide { layout: "cover" | "contents" | "split" | "pathway" | "recruitment" | "database" | "cycle" | "closing"; closing?: ResearchClosing; cycle?: ResearchCycle; database?: ResearchDatabase; pathway?: ResearchPathway; recruitment?: ResearchRecruitment; title: string; points: string[]; note: string; images: ResearchImage[]; links?: { label: string; url: string }[] }
export interface ResearchDatabase {
 subtitle: string; quote: string; attribution: string; interviewDate: string; interviewSource: string;
 intro: string; inlets: { title: string; detail: string }[]; records: string[]; outcomes: string[]; status: string;
}
export interface ResearchRecruitment {
 subtitle: string; foundation: string; rounds: { label: string; title: string; detail: string }[]; nextRound: string;
 legend: string[]; distinction: string[]; limit: string; mathsHeading: string;
 gaps: string[]; question: string; answer: string; equation: string; equationLabel: string;
 explanation: { title: string; text: string; symbols: string; status: string };
}
export interface ResearchClosing {
 headline: string; message: string; together: string[]; brand: string; tagline: string; creators: string[]; status: string;
}
export interface ResearchCycle {
 subtitle: string; stages: { title: string; need: string }[]; hub: { title: string; detail: string };
 restart: { title: string; inputs: string[]; result: string }; statement: string; status: string;
}
export interface ResearchPathway {
 foundation: { title: string; detail: string };
 extensionLabel: string;
 extensionSubtitle: string;
 instruction: string;
 steps: { title: string; detail: string; explanation: string; summary?: string }[];
 database: { title: string; explanation: string; records: string[] };
 feedback: { title: string; detail: string }[];
 sellingPoint: { title: string; detail: string };
 status: string;
}
export interface ResearchSubsection { title: string; slideNumber: number; destination?: string }
export interface ResearchSection { id: string; title: string; subsections: ResearchSubsection[] }
export const researchSections: ResearchSection[] = [
 { id: 'section-1', title: 'Welcome & Opportunity', subsections: [
  { title: 'Impact Mosaic: connecting people, evidence and accessible learning', slideNumber: 1, destination: 'research-slide-1' },
  { title: 'Talent is everywhere. Access to learning should be too.', slideNumber: 3, destination: 'research-slide-3' }
 ]},
 { id: 'section-2', title: 'Our Shared Vision', subsections: [
  { title: 'Building on your work: one database, an adaptive cycle', slideNumber: 4, destination: 'research-slide-4' }
 ]},
 { id: 'section-3', title: 'Recruitment & Records', subsections: [
  { title: 'Adaptive snowball recruitment', slideNumber: 5, destination: 'research-slide-5' },
  { title: 'A participant database that guides learning and support', slideNumber: 6, destination: 'research-slide-6' }
 ]},
 { id: 'section-4', title: 'The Cycle & Thanks', subsections: [
  { title: 'One cycle complete — the next one starts better informed', slideNumber: 7, destination: 'research-slide-7' },
  { title: 'Thank you', slideNumber: 8, destination: 'research-slide-8' }
 ]}
];

const researchPathway: ResearchPathway = {
  "foundation": {
    "title": "Your work is the foundation",
    "detail": "Your community relationships, outreach and practical support"
  },
  "extensionLabel": "Proposed extension",
  "extensionSubtitle": "Designed together",
  "instruction": "Select a stage or the database to read more.",
  "steps": [
    {
      "title": "Adaptive snowball recruitment",
      "explanation": "Invite voluntary participant referrals through trusted connections. Use recorded recruitment evidence to adjust the next round, investigate gaps and decide where to focus effort.",
      "detail": "Adaptive recruitment feeds the participant database. Recorded recruitment evidence guides each new sampling round.",
      "summary": "Recruit · register · update"
    },
    {
      "title": "Understand needs",
      "explanation": "Review recorded skills, interests and access needs with participants to understand the learning and support that would suit them.",
      "detail": "Skills, interests and learning needs",
      "summary": "Skills, interests and access needs"
    },
    {
      "title": "Match teaching",
      "explanation": "Use recorded interests and learning needs to identify suitable teaching. The learner and facilitator agree the arrangement.",
      "detail": "Agree suitable teaching with the learner and facilitator",
      "summary": "Learner and facilitator agree a pathway"
    },
    {
      "title": "Support practice",
      "explanation": "Use the agreed learning plan and support needs to guide accessible teaching, practical tasks and feedback.",
      "detail": "Accessible teaching and practical feedback",
      "summary": "Accessible teaching and feedback"
    },
    {
      "title": "Monitor & review",
      "explanation": "Record learning progress and recruitment evidence in the database. Use progress to adjust support and recruitment evidence to refine outreach.",
      "detail": "Monitor recruitment evidence and learning progress, update the participant database, then use the updated records to refine recruitment, teaching and support. The cycle repeats.",
      "summary": "Review recruitment and learning evidence"
    }
  ],
  "database": {
    "title": "Participant database",
    "explanation": "Keep recruitment details, skills, learning needs, agreed support and progress together. These records inform decisions throughout the cycle.",
    "records": [
      "Recruitment routes",
      "Skills and interests",
      "Learning needs",
      "Agreed teaching and support",
      "Learning progress"
    ]
  },
  "feedback": [
    {
      "title": "Recruitment evidence → outreach",
      "detail": "Recruitment evidence informs each new outreach round; the cycle repeats."
    },
    {
      "title": "Learning progress → support",
      "detail": "Learning progress informs teaching and support adjustments."
    }
  ],
  "status": "Proposed pilot for Nigeria · Records inform decisions throughout the cycle",
  "sellingPoint": {
    "title": "Adaptive snowball recruitment",
    "detail": "Recruitment feeds the database; its records guide the next round."
  }
};
const pathwayReadingPoints = [
 researchPathway.foundation.detail,
 `${researchPathway.extensionLabel}: ${researchPathway.extensionSubtitle}`,
 ...researchPathway.steps.map(step => `${step.title}: ${step.explanation}`),
 `${researchPathway.database.title}: ${researchPathway.database.explanation}`,
 `${researchPathway.sellingPoint.title}: ${researchPathway.sellingPoint.detail}`,
 ...researchPathway.steps.map(step => `${step.title}: ${step.detail}`),
 `${researchPathway.database.title}: ${researchPathway.database.records.join('; ')}`,
 ...researchPathway.feedback.map(loop => `${loop.title}: ${loop.detail}`),
 researchPathway.status
];

const recruitmentContent: ResearchRecruitment = {
 subtitle: 'Building on your community connections',
 foundation: 'Your relationships already connect people to support.',
 rounds: [
  { label: 'Round 1', title: 'Start with varied trusted contacts', detail: 'A few starting contacts, spread across different communities.' },
  { label: 'Round 2', title: 'People invite others they know — if they choose', detail: 'Referrals spread through personal networks. Some groups are not reached yet.' },
  { label: 'Round 3', title: "Check who's missing, change where we look", detail: 'Add a new starting contact inside the group not yet reached, or use another route.' }
 ],
 nextRound: 'Next round',
 legend: ['Starting contact', 'Reached through a referral', 'Not reached yet'],
 distinction: ['Referrals make it snowball.', 'Checking and changing course makes it adaptive.'],
 limit: 'People with few connections may need other routes.',
 mathsHeading: 'How we learn from each round',
 gaps: ['People not yet reached', 'Groups reached less often', 'Access barriers'],
 question: 'Who are we missing—and how can we reach them?',
 answer: 'Each round shows who our networks reach — so we can go looking for who they miss.',
 equation: 'p(θ | D) ∝ p(D | θ) p(θ)',
 equationLabel: 'Bayesian updating: updated understanding is proportional to recruitment evidence times starting knowledge',
 explanation: {
  title: 'How each round helps us learn',
  text: "Start with your team's community knowledge.\n\nRecord who joins, through which route, and how much outreach effort was needed.\n\nUpdate what we expect from each route—and how uncertain we are.\n\nUse that evidence to agree the next round, keeping attention on harder-to-reach groups.",
  symbols: 'θ = recruitment rates being estimated.\nD = recruitment records.\np(θ) = starting expectations.\np(D | θ) = how well each possible rate explains the records under the model.\np(θ | D) = updated understanding.\n∝ = “is proportional to”.',
  status: 'Proposed model · Decisions remain with the team'
 }
};

const cycleContent: ResearchCycle = {
 subtitle: 'Each stage reaches a goal that meets a need',
 stages: [
  { title: 'Recruit', need: 'Reach people often missed' },
  { title: 'Understand needs', need: "Know each person's skills, goals and access needs" },
  { title: 'Match teaching', need: 'The right skill with the right facilitator' },
  { title: 'Support practice', need: 'Accessible learning that becomes real skill' },
  { title: 'Monitor & review', need: 'Know what is working, and for whom' }
 ],
 hub: { title: 'Participant database', detail: 'Records what happened at every stage' },
 restart: { title: 'The next round starts here', inputs: ['Progress evidence', 'Participant and facilitator feedback'], result: "What worked continues. What didn't, changes." },
 statement: 'Every round meets a need, records what happened, and uses success and feedback to plan the next round.',
 status: 'Proposed cycle · No results yet · Measures agreed together during pilot design'
};

const closingContent: ResearchClosing = {
 headline: 'Success is achieved together.',
 message: 'Communities, facilitators, partners and people with disabilities — reaching, teaching and learning across Nigeria.',
 together: ['Your trusted community relationships', 'Shared records that guide every decision', 'Learning that becomes real skill'],
 brand: 'IMPACT MOSAIC',
 tagline: 'Connecting people, evidence and accessible learning',
 creators: ['Strong · Jerry Bannister Zachary', 'Project Co-Creators'],
 status: 'Independent proposal · The photograph records a 2025 national honour, not an endorsement of this proposal'
};

const databaseContent: ResearchDatabase = {
 subtitle: 'Building on the need you have already identified',
 quote: 'In the long term, we plan to build a comprehensive, disaggregated database of PWDs in Nigeria.',
 attribution: 'Ayuba Gufwan',
 interviewDate: '15 November 2025',
 interviewSource: 'https://www.thecable.ng/interview-why-we-proposed-allocating-10-of-government-interventions-to-pwds-by-ayuba-gufwan/',
 intro: 'Our proposed contribution for Nigeria',
 inlets: [{ title: 'Learners', detail: 'Adaptive snowball recruitment' }, { title: 'Facilitators', detail: 'Volunteering or recruitment' }],
 records: ['Learner skills, interests & goals', 'Learner access & support needs', 'Facilitator skills & availability', 'Agreed pathways & progress'],
 outcomes: ['Understand needs', 'Match teaching', 'Plan support together', 'Review progress'],
 status: 'Proposed participant database for Nigeria · Not the official national database'
};

export const researchSlides: ResearchSlide[] = [
  {
    "layout": "cover",
    "title": "IMPACT MOSAIC",
    "points": [
      "Connecting people, evidence and accessible learning",
      "A proposed pilot for Nigeria",
      "Building toward reach across the whole country",
      "Strong · Jerry Bannister Zachary",
      "Project Co-Creators"
    ],
    "note": "Approved unity artwork: six African people with Nigeria’s flag, including a person with albinism, a wheelchair user, white cane, walking stick, crutch and hijab. AI-generated artwork; no actual participants depicted.",
    "images": [
      {
        "path": "/impact-mosaic-unity-haircuts.png",
        "alt": "Six African people united with Nigeria’s green-white-green flag, including a wheelchair user and people with a white cane, walking stick, albinism and hijab; the standing person in green leans on a crutch while embracing the team.",
        "caption": "Approved Impact Mosaic unity artwork. Illustration, not a participant photograph.",
        "credit": "AI-generated artwork for Impact Mosaic",
        "source": ""
      }
    ]
  },
  {
    "layout": "contents",
    "title": "Table of Contents",
    "points": researchSections.map(section => section.title),
    "note": "Expand a section to see its slides. Every slide in this presentation is listed; select a title to go to it.",
    "images": []
  },
  {
    "layout": "split",
    "title": "Talent is everywhere.\nAccess to learning should be too.",
    "points": [
      "Through Beautiful Gate, your work has helped remove mobility barriers for people like James Ahumbe.",
      "We propose to build on that foundation through adaptive snowball recruitment and a participant register capturing people’s skills, interests and learning needs.",
      "This would help us connect participants with suitable teaching, monitor their learning progress and adjust support as their needs change."
],
    "note": "Historical Beautiful Gate beneficiary, identified by name and photograph on page 3 of Wheelchairs for Nigeria’s July 2023 newsletter. The source identifies James Ahumbe as a cobbler who received a replacement tricycle. The photograph shows him with that tricycle; it does not show shoemaking or establish that Beautiful Gate taught him his trade. The proposed learning pathway and sandbox are separate prospective work; no partnership, endorsement or learning outcome is implied.",
    "links": [
  {
    "label": "Wheelchairs for Nigeria · newsletter archive",
    "url": "https://www.wheelchairsfornigeria.org/newsletters"
  }
],
    "images": [
  {
    "path": "/photos/james-ahumbe-beautiful-gate.jpg",
    "displayCredit": {
      "name": "James Ahumbe · Cobbler and Beautiful Gate beneficiary",
      "credit": "Photo published by Wheelchairs for Nigeria",
      "sourceLabel": "July 2023, p. 3"
    },
    "alt": "James Ahumbe smiling while seated on a tricycle wheelchair, wearing a navy shirt and resting one hand on its red hand pedal.",
    "caption": "James Ahumbe with a tricycle wheelchair. Wheelchairs for Nigeria’s July 2023 newsletter, page 3, identifies him as a cobbler who received a replacement tricycle through Beautiful Gate. The photograph shows mobility support, not shoemaking or skills training.",
    "credit": "Photograph published by Wheelchairs for Nigeria; photographer not named",
    "source": "https://www.wheelchairsfornigeria.org/_files/ugd/8d854e_ffd0fdd619874f11a285bcacaa816a64.pdf#page=3"
  }
]
  },
  {
    "layout": "pathway",
    "title": "Building on your work: one database, an adaptive cycle",
    "pathway": researchPathway,
    "points": pathwayReadingPoints,
    "note": "Conceptual proposed pilot pathway for Nigeria, not an observation of an existing end-to-end service or an agreed partnership. Build on Gufwan’s community relationships and practical support; confirm the existing process with his team. Adaptive snowball recruitment, the participant database, teaching arrangements and monitoring require joint design. Recruitment evidence informs outreach; learning progress informs teaching/support. Registration and optional research remain separate. Foundation photographs document a Beautiful Gate/Senator Abba Moro mobility partnership and Gufwan’s historical UBEC education discussion. Partner credits remain explicit; photographs are not pilot activity or evidence of delivered learning. Illustrated stages are conceptual. The closed loop represents continuing programme improvement, not a requirement for individual participants to remain indefinitely. Recruitment populates the database. Its records inform all subsequent needs, teaching and support decisions; monitoring updates those records and informs later adaptive recruitment. Decisions remain participant/facilitator-led, not automatic database actions. No model fit, participant records, recruitment outcome or pilot activity is depicted.",
    "images": [
    {
        "path": "/photos/mobility-foundation-original.jpg",
        "alt": "Rows of colourful three-wheeled mobility devices arranged at the Otukpo activity.",
        "caption": "Tricycles pictured in the mobility-support report, delivered through a partnership with Beautiful Gate and Senator Abba Moro. Report: 2025-10-11. Otukpo, Benue State.",
        "credit": "Photograph published by The Qualitative Magazine",
        "source": "https://qualitativemagazine.com/ncpwd-beautiful-gate-foundation-senator-abba-moro-empower-pwds-in-benue-with-thousands-of-tricycles-and-assistive-devices/",
        "displayCredit": {
            "name": "Community mobility support",
            "credit": "Photograph published by The Qualitative Magazine",
            "sourceLabel": "2025-10-11"
        }
    },
    {
        "path": "/photos/education-foundation-original.jpg",
        "alt": "Gufwan, seated on the right, speaking across a meeting table with a UBEC official.",
        "caption": "Gufwan during the UBEC partnership discussion on inclusive education. Report: 2024-09-26. UBEC, Abuja.",
        "credit": "Photograph published by FMINO",
        "source": "https://fmino.gov.ng/children-with-disabilities-deserve-more-attention-to-attain-their-aspirations-in-life-ayuba-gufwan/",
        "displayCredit": {
            "name": "Inclusive-education discussion",
            "credit": "Photograph published by FMINO",
            "sourceLabel": "2024-09-26"
        }
    }
]
  },
  {
    layout: 'recruitment',
    title: 'Adaptive snowball recruitment',
    recruitment: recruitmentContent,
    points: [recruitmentContent.subtitle, recruitmentContent.foundation, recruitmentContent.question, recruitmentContent.answer,
      ...recruitmentContent.rounds.map(round => `${round.label}: ${round.title}. ${round.detail}`),
      recruitmentContent.nextRound + ': start again from Round 1 with what we learned.',
      'Key: ' + recruitmentContent.legend.join('; '),
      ...recruitmentContent.distinction, recruitmentContent.limit,
      recruitmentContent.mathsHeading + ' (proposed Bayesian refinement): ' + recruitmentContent.equation,
      recruitmentContent.explanation.title + ': ' + recruitmentContent.explanation.text,
      'What the symbols mean: ' + recruitmentContent.explanation.symbols, recruitmentContent.explanation.status,
      'Potential gaps to assess together: ' + recruitmentContent.gaps.join('; ')],
    note: 'Proposed pilot method for Nigeria, not an existing fitted model or observed recruitment result. Confirm current referral, recording and adaptation practices with Gufwan and his team; do not assume these are missing. Complementary routes remain important. Bayesian updating is an optional proposed refinement, not a requirement of snowball recruitment. Define the likelihood, priors, route attribution, dependence, effort and safeguards jointly before fitting a model. Review uncertainty, inclusion and access alongside recruitment efficiency. No probability sample or population representativeness is established. Referral-based recruitment over-represents well-connected people and people similar to the starting contacts, and can miss isolated people; changing starting contacts and routes between rounds reduces, but does not remove, this bias. This is not respondent-driven sampling. Referrals and research are voluntary and do not determine access to learning/support. Documentary photograph shows mobility devices at a historical partnership activity, not recruitment or proposed pilot activity.',
    images: [{
      path: '/photos/mobility-foundation-original.jpg',
      alt: 'Rows of colourful three-wheeled mobility devices arranged at the Otukpo activity.',
      caption: 'Mobility devices at the Otukpo partnership activity involving Beautiful Gate and Senator Abba Moro. Report: 2025-10-11. Photograph illustrates mobility support, not recruitment.',
      credit: 'Photograph published by The Qualitative Magazine',
      source: 'https://qualitativemagazine.com/ncpwd-beautiful-gate-foundation-senator-abba-moro-empower-pwds-in-benue-with-thousands-of-tricycles-and-assistive-devices/'
    }],
    links: [
      { label: 'Documented community outreach: reported interviews, July 2026', url: 'https://religionjournalism.org/hope-on-wheels-at-the-beautiful-gate-how-a-polio-survivor-lifts-others/' },
      { label: 'Swedish adaptive snowball sampling precedent: 771 respondents, 35 diagnoses/impairments; feasibility, not proof of representative coverage', url: 'https://link.springer.com/article/10.1007/s10209-020-00714-x' },
      { label: 'Adapting snowball recruitment for hard-to-reach groups: Sadler et al., 2010, Nursing & Health Sciences', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3222300/' },
      { label: 'Limits of referral-based sampling for hidden populations: Magnani et al., 2005, AIDS', url: 'https://doi.org/10.1097/01.aids.0000172879.20628.e1' },
      { label: 'Bayesian recruitment allocation research: proposed modelling context, not Nigerian field evidence', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12099364/' }
    ]
  },
  {
    layout: 'database',
    title: 'A participant database that guides learning and support',
    database: databaseContent,
    points: [databaseContent.subtitle,
      databaseContent.attribution + ', TheCable interview, ' + databaseContent.interviewDate + ': “' + databaseContent.quote + '”',
      databaseContent.intro, ...databaseContent.inlets.map(inlet => inlet.title + ': ' + inlet.detail), 'Recruitment records populate the participant database from the first recruitment round. Record location and recruitment route alongside the participant-agreed profile.',
      'Participant database: ' + databaseContent.records.join('; '),
      'Records inform decisions with participants and facilitators: ' + databaseContent.outcomes.join('; '),
      'Facilitator records describe teaching skills and areas, availability and whether they join through volunteering or recruitment. Agree teaching scope before matching.',
      'Plan support together means participants, facilitators and the team agree what help is needed, who will arrange it and when. A plan is not confirmation that support has been delivered.',
      'Update records as goals, support and progress change.', databaseContent.status],
    note: 'TheCable interview published 15 November 2025 records Gufwan’s national database ambition and describes consultants/data collection already underway at that time. This is dated interview context, not a claim about the current status of national data. Our independent proposed participant database for Nigeria is a scoped learning/support contribution, not the national database, a census, a complete population register or an agreed official integration/partnership. Records begin during recruitment and are updated with learners and facilitators throughout the learning cycle. Facilitators can join through volunteering or recruitment; teaching scope, skills and availability are reviewed before matching. These are proposed profile categories, not new accounts, approved appointments or delivered services. Collect only agreed necessary information, keep optional sensitive/research disclosures separate from access to services, and agree consent, stewardship and role-based access before real collection. Diagram shows proposed categories and human decisions, not real records, numerical outcomes or an automatic decision engine. The FMINO photograph is separate from the interview: it depicts Gufwan speaking in a leadership profile published 26 October 2024; no interview photo, event date or venue is inferred.',
    images: [{
      path: '/photos/leadership.webp',
      alt: 'Chief Ayuba Gufwan seated at a table, speaking into a microphone.',
      caption: 'Ayuba Gufwan in the photograph published with FMINO’s leadership profile, 26 October 2024. Separate from TheCable interview; event date and venue are not inferred.',
      credit: 'Photograph published by FMINO',
      source: 'https://fmino.gov.ng/championing-inclusion-chief-ayuba-gufwans-mission-for-persons-with-disabilities-in-nigeria/'
    }],
    links: [{ label: 'Read the interview · TheCable · 15 November 2025', url: databaseContent.interviewSource }]
  },
  {
    layout: 'cycle',
    title: 'One cycle complete — the next one starts better informed',
    cycle: cycleContent,
    points: [cycleContent.subtitle,
      ...cycleContent.stages.map((stage, i) => `${i + 1}. ${stage.title}: ${stage.need}`),
      `${cycleContent.hub.title}: ${cycleContent.hub.detail}`,
      `${cycleContent.restart.title}: ${cycleContent.restart.inputs.join(' and ')} feed back from stage 5 into stage 1. ${cycleContent.restart.result}`,
      cycleContent.statement, cycleContent.status],
    note: 'Conceptual proposed pilot cycle for Nigeria, not an existing service, an agreed partnership or observed results. Stage goals describe intended needs met, not achieved outcomes. Progress evidence and participant and facilitator feedback inform the next round; how success is measured, who reviews it and how often are to be agreed with Gufwan’s team during pilot design. Repeating the cycle is programme improvement; individual participants are not required to stay. Recruitment changes between rounds follow the adaptive snowball approach on slide 5 and claim no representative coverage.',
    images: []
  },
  {
    layout: 'closing',
    title: 'Thank you',
    closing: closingContent,
    points: [closingContent.headline, closingContent.message, ...closingContent.together,
      'Photograph: Ayuba Gufwan with President Bola Ahmed Tinubu and Bill Gates, June 2025, when Gates dedicated his Commander of the Order of the Federal Republic honour to Gufwan.',
      `${closingContent.brand}: ${closingContent.tagline}`, ...closingContent.creators, closingContent.status],
    note: 'Closing slide. The photograph was published by Inclusive News Network on 5 June 2025 with its report that President Tinubu conferred the CFR on Bill Gates, met Gufwan as NCPWD Executive Secretary, and that Gates dedicated the award to Gufwan. The photographer is not named; the image is shown unchanged. It records Gufwan’s recognition and does not show, imply or establish any endorsement of, involvement in, or partnership with Impact Mosaic or this proposal by Gufwan, President Tinubu or Bill Gates. The Impact Mosaic artwork repeats the AI-generated cover illustration; no actual participants are depicted.',
    images: [{
      path: '/photos/gufwan-cfr-dedication-2025.jpg',
      alt: 'Ayuba Gufwan, smiling in a wheelchair and wearing an End Polio Now cap and T-shirt, between President Bola Ahmed Tinubu, who holds a book, and a smiling Bill Gates wearing a national honour medal, in front of the Nigerian flag.',
      caption: 'Ayuba Gufwan with President Bola Ahmed Tinubu and Bill Gates, June 2025. Inclusive News Network reported that Gates dedicated his CFR national honour to Gufwan. Not an endorsement of this proposal.',
      credit: 'Photograph published by Inclusive News Network, 5 June 2025; photographer not named',
      source: 'https://inclusivenews.com.ng/president-tinubu-honours-bill-gates-as-gates-dedicates-award-to-ayuba-gufwan-es-of-disability-commission/',
      displayCredit: { name: 'Ayuba Gufwan, honoured — June 2025', credit: 'Photo published by Inclusive News Network', sourceLabel: '5 June 2025' }
    }]
  }

];

// Preserved unchanged for a possible future Support practice slide (not in the current contents).
export const retainedParticipationSlide: ResearchSlide = {
    "layout": "split",
    "title": "Participation needs more than registration.",
    "points": [
      "Suitable teaching and facilitator capacity",
      "Accessible communication and learning formats",
      "Devices and connectivity, where needed",
      "Support agreed with participants"
    ],
    "note": "Historical UBEC inclusive-education discussion, not an activity of the proposed pilot. These are practical requirements to assess and agree with participants, not measured deficiencies in Gufwan’s existing work. Registration and optional research remain separate; resources and operational arrangements are to be agreed.",
    "images": [
      {
        "path": "/photos/education-2.webp",
        "alt": "Gufwan, seated on the right, speaking across a meeting table with a UBEC official.",
        "caption": "Gufwan during the UBEC partnership discussion on inclusive education. Report: 2024-09-26. UBEC, Abuja.",
        "credit": "Photograph published by FMINO",
        "source": "https://fmino.gov.ng/children-with-disabilities-deserve-more-attention-to-attain-their-aspirations-in-life-ayuba-gufwan/"
      }
    ]
  };

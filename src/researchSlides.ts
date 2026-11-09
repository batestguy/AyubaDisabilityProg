// Shared source for the Quarto presentation, reading edition and no-JavaScript alternative.
export interface ResearchImage { path: string; alt: string; caption: string; credit: string; source: string; displayCredit?: { name: string; credit: string; sourceLabel: string } }
export interface ResearchSlide { layout: "cover" | "contents" | "split"; title: string; points: string[]; note: string; images: ResearchImage[]; links?: { label: string; url: string }[] }
export interface ResearchSubsection { title: string; slideNumber: number; destination?: string }
export interface ResearchSection { id: string; title: string; subsections: ResearchSubsection[] }
export const researchSections: ResearchSection[] = [
  {
    "id": "section-1",
    "title": "Our Shared Vision",
    "subsections": [
      {
        "title": "Talent is everywhere. Access to learning should be too.",
        "slideNumber": 3,
        "destination": "research-slide-3"
      },
      {
        "title": "Gufwan’s story connects mobility with opportunity.",
        "slideNumber": 4,
        "destination": "research-slide-4"
      },
      {
        "title": "Reaching the classroom is only the beginning.",
        "slideNumber": 5,
        "destination": "research-slide-5"
      }
    ]
  },
  {
    "id": "section-2",
    "title": "Building on Community Experience",
    "subsections": [
      {
        "title": "A community foundation already in motion",
        "slideNumber": 6
      },
      {
        "title": "Practical experience and statistics, together",
        "slideNumber": 7
      }
    ]
  },
  {
    "id": "section-3",
    "title": "Strengthening Recruitment with Statistics",
    "subsections": [
      {
        "title": "Start with varied community contacts",
        "slideNumber": 8
      },
      {
        "title": "Let each recruitment round guide the next",
        "slideNumber": 9
      },
      {
        "title": "Give people several ways to join",
        "slideNumber": 10
      },
      {
        "title": "From community outreach to a measurable recruitment process",
        "slideNumber": 11
      },
      {
        "title": "A model that learns and guides the next round",
        "slideNumber": 12
      },
      {
        "title": "Test whether the additions help",
        "slideNumber": 13
      },
      {
        "title": "Make participation simple and respectful",
        "slideNumber": 14
      }
    ]
  },
  {
    "id": "section-4",
    "title": "Connecting People to Accessible Learning",
    "subsections": [
      {
        "title": "Turn registration into a learning pathway",
        "slideNumber": 15
      },
      {
        "title": "Match people with suitable teaching",
        "slideNumber": 16
      },
      {
        "title": "One learning goal, accessible ways to practise",
        "slideNumber": 17
      },
      {
        "title": "See the working prototype",
        "slideNumber": 18
      }
    ]
  },
  {
    "id": "section-5",
    "title": "Designing a Plateau Pilot",
    "subsections": [
      {
        "title": "Agree a focused Plateau pilot",
        "slideNumber": 19
      },
      {
        "title": "Decide what success means",
        "slideNumber": 20
      },
      {
        "title": "Move forward when each stage is ready",
        "slideNumber": 21
      },
      {
        "title": "Turn experience into shared evidence",
        "slideNumber": 22
      }
    ]
  },
  {
    "id": "section-6",
    "title": "Building the Partnership",
    "subsections": [
      {
        "title": "Build the team around the work",
        "slideNumber": 23
      },
      {
        "title": "Three agreements to begin",
        "slideNumber": 24
      }
    ]
  }
];

export const researchSlides: ResearchSlide[] = [
  {
    "layout": "cover",
    "title": "IMPACT MOSAIC",
    "points": [
      "Connecting people, evidence and accessible learning",
      "A proposed Plateau pilot",
      "Building toward wider reach across Nigeria",
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
    "note": "Expand a section to see its subsections. Slides 3–5 are available; slides 6–24 are planned.",
    "images": []
  },
  {
    "layout": "split",
    "title": "Talent is everywhere.\nAccess to learning should be too.",
    "points": [
      "Through Beautiful Gate, your work has helped remove mobility barriers for people like James Ahumbe.",
      "We propose to build on that foundation through adaptive sampling and a participant register capturing people’s skills, interests and learning needs.",
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
    "layout": "split",
    "title": "Gufwan’s story connects mobility with opportunity.",
    "points": [
      "A foundation in community outreach and practical support.",
      "Our proposal starts with a conversation about building on that experience."
    ],
    "note": "WHO’s 2019 profile connects Gufwan’s experience of polio with mobility and education work. Historical sources do not establish a project partnership or endorsement. The photograph’s venue and event date are not inferred.",
    "links": [
      {
        "label": "WHO · Gufwan’s story (2019)",
        "url": "https://www.afro.who.int/news/neglect-inspiration-ayuba-gufwans-story"
      }
    ],
    "images": [
      {
        "path": "/photos/leadership.webp",
        "alt": "Chief Ayuba Gufwan seated at a table, speaking into a microphone.",
        "caption": "Chief Ayuba Gufwan, in the photograph published with FMINO’s leadership profile. Report: 2024-10-26. Nigeria; photograph venue not specified.",
        "credit": "Photograph published by FMINO",
        "source": "https://fmino.gov.ng/championing-inclusion-chief-ayuba-gufwans-mission-for-persons-with-disabilities-in-nigeria/"
      }
    ]
  },
  {
    "layout": "split",
    "title": "Reaching the classroom is only the beginning.",
    "points": [
      "Participation also needs:",
      "Suitable teaching",
      "Accessible communication",
      "Devices and connectivity"
    ],
    "note": "Historical UBEC inclusive-education discussion, not an activity of the proposed pilot. Registration and optional research remain separate; resources and operational arrangements are to be agreed.",
    "images": [
      {
        "path": "/photos/education-2.webp",
        "alt": "Gufwan, seated on the right, speaking across a meeting table with a UBEC official.",
        "caption": "Gufwan during the UBEC partnership discussion on inclusive education. Report: 2024-09-26. UBEC, Abuja.",
        "credit": "Photograph published by FMINO",
        "source": "https://fmino.gov.ng/children-with-disabilities-deserve-more-attention-to-attain-their-aspirations-in-life-ayuba-gufwan/"
      }
    ]
  }
];

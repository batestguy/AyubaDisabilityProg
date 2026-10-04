export const reviewed = "2026-10-04";
export const sources = [
  {
    id: "partnership",
    title: "NCPWD–Amnesty skills partnership",
    date: "2025-11-07",
    url: "https://fmino.gov.ng/ncpwd-amnesty-international-to-collaborate-on-skills-acquisition-inclusion-programs-for-persons-with-disabilities/",
    summary:
      "Proposed skills acquisition and inclusion collaboration establishes alignment, not measured outcomes.",
  },
  {
    id: "vision",
    title: "Gufwan’s published inclusion agenda",
    date: "2025",
    url: "https://fmino.gov.ng/executive-secretary-national-commission-for-persons-with-disabilities-ncpwd-hon-ayuba-gufwan-has-reeled-out-his-vision-for-the-commission-and-persons-with-disabilities-pwds-community/",
    summary:
      "Accessibility pilots, employment partnerships and 3,000 NDE empowerment slots are described. Individual completion and income outcomes are not established.",
  },
  {
    id: "data",
    title: "NDMIS stakeholder workshop report",
    date: "2026-05-22",
    url: "https://ossaposneo.org/brief-report-of-the-3-day-stakeholders-consultative-workshop-on-the-development-of-the-national-disability-management-information-system-ndmis/",
    summary:
      "The May 18–20 workshop outlined harmonised disability data and proposed integration. Its July target does not verify deployment.",
  },
  {
    id: "outreach",
    title: "NCPWD–NOA inclusion collaboration",
    date: "2025-12-10",
    url: "https://fmino.gov.ng/ncpwd-strengthens-collaboration-with-national-orientation-agency-to-deepen-national-disability-inclusion/",
    summary:
      "A joint technical committee was announced for inclusion outreach. Current coverage and response performance require verification.",
  },
  {
    id: "agriculture",
    title: "Inclusive organic-farming workshop",
    date: "2026-03-14",
    url: "https://ypard.net/posts/we-fit-grow-too-empowering-persons-with-disabilities-through-organic-farming-ypard-nigeria",
    summary:
      "YPARD Nigeria reports 39 participants in an Ekiti workshop. This is a past initiative, not an open application call.",
  },
];
export const opportunities = [
  {
    title: "Accessibility",
    source: "vision",
    system: "Published accessibility pilot agenda",
    result: "Pilot activity described; coverage unverified.",
    gap: "No participant-level access or completion evidence here.",
    ai: "Explain reviewed documents and draft accessibility enquiries.",
    dependencies: "Accessible materials, human review and user testing.",
    metric: "Task success and barriers resolved.",
  },
  {
    title: "Agriculture",
    source: "agriculture",
    system: "Partner-led inclusive farming training",
    result: "39 workshop participants reported.",
    gap: "No independently verified yield or income follow-up.",
    ai: "Explain training and draft questions to extension experts.",
    dependencies: "Local agronomists, dated advice and accessible training.",
    metric: "Training completion and expert response time.",
  },
  {
    title: "Employment",
    source: "vision",
    system: "Employment partnerships and NDE slots",
    result: "3,000 slots reported; individual outcomes unverified.",
    gap: "Current availability, completion and retention unknown.",
    ai: "Match skills and draft accommodation enquiries.",
    dependencies: "Verified employers, expiry dates and eligibility checks.",
    metric: "Enquiries answered and applications completed.",
  },
  {
    title: "NDMIS & data",
    source: "data",
    system: "National information-system design",
    result: "Workshop and proposed architecture documented.",
    gap: "Deployment and interoperability unverified.",
    ai: "Flag incomplete records and explain data-collection questions.",
    dependencies: "Consent, authorised access, security and agreed schema.",
    metric: "Missingness, duplicates and correction turnaround.",
  },
  {
    title: "Zonal coordination",
    source: "outreach",
    system: "NCPWD–NOA outreach coordination",
    result: "Joint technical committee announced.",
    gap: "Local contacts and coverage need confirmation.",
    ai: "Route reviewed enquiries to human support.",
    dependencies: "Maintained directory, local staff and escalation rules.",
    metric: "Unanswered requests and time to first response.",
  },
];
export function available(deadline?: string, now = Date.now()) {
  return !!deadline && new Date(deadline + "T23:59:59Z").getTime() >= now;
}

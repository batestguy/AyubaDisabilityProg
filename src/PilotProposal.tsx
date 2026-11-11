// Shared by the live pages, generated no-JavaScript story and printable brief.
export const pilot = {
 objective: 'Two statisticians helping build a reliable database of people with disabilities and connect participants to accessible online teaching, building on Gufwan’s foundation.',
 team: 'Jerry Bannister Zachary and Yusuf Strong Mashat propose to contribute recruitment design, data quality checks, coverage monitoring and evaluation. We are two statisticians with a working prototype.',
 scope: 'The starting location for a limited pilot will be agreed with partners. Exact communities, eligibility, participant numbers and courses will be agreed during technical scoping.',
 status: 'This is an independent proposal. Community access, facilitators, funding, secure operational infrastructure and accommodation support remain to be secured. No endorsement, delivery partnership or access to existing beneficiary records is assumed.',
 timing: 'An approximately 20-week sequence is illustrative. The clock starts only after agreed readiness conditions: responsibilities, community permissions, consent and data arrangements, staffing, funding, secure collection and access support. Stages overlap and may take longer. Completion reviews depend on a full course cycle; registration and national expansion remain open-ended.',
 outputs: 'Proposed evidence outputs: a checked register with a duplicate-review log; recruitment and coverage summaries with an outreach-change log; learner matching and waiting lists; cohort attendance and skills summaries; and a review of access barriers, participant feedback and costs. Share only agreed aggregate reporting, with small-group disclosure risks reviewed.',
 preparation: [
  'Co-design questions, consent and learning arrangements with people with disabilities.',
  'Review existing data tools and discuss possible NDMIS alignment with the responsible technical team; agree definitions, permissions and stewardship before any data sharing.',
  'Assess facilitator capacity, languages, devices, connectivity and accommodation barriers.',
  'Obtain local cost estimates for outreach, staffing, teaching, infrastructure and access support.',
  'Agree responsibilities, readiness criteria and a limited pilot protocol before recruitment.'
 ],
 decisions: [
  'Nominate a technical counterpart for a scoping discussion.',
  'Identify potential community introductions, subject to their agreement.',
  'Agree pilot-scoping requirements: communities, eligibility, courses, capacity, data governance, costs and readiness.'
 ]
};

export const proposalSources = [
 { id: 'who', title: 'WHO: From neglect to inspiration', date: '23 April 2019', review: '8 November 2026', url: 'https://www.afro.who.int/news/neglect-inspiration-ayuba-gufwans-story', note: 'Historical profile of Gufwan’s mobility advocacy and education pathway.' },
 { id: 'gate', title: 'Beautiful Gate’s own account', date: 'Undated', review: '8 November 2026', url: 'https://www.beautifulgatewheelchairs.org/', note: 'Organisation-reported cumulative reach; the page does not date the totals.' },
 { id: 'renew', title: 'World Renew: Entering through the Beautiful Gate', date: '22 November 2017', review: '8 November 2026', url: 'https://www.crcna.org/news-and-events/news/entering-through-beautiful-gate', note: 'Historical account of wheelchair production and outreach.' },
 { id: 'interview', title: 'TheCable: Interview with Ayuba Gufwan', date: '15 November 2025', review: '8 November 2026', url: 'https://www.thecable.ng/interview-why-we-proposed-allocating-10-of-government-interventions-to-pwds-by-ayuba-gufwan/', note: 'Gufwan’s stated priorities and initiatives, attributed to the interview.' },
 { id: 'ndmis', title: 'Inclusive News Network: Disability data and NDMIS workshop', date: '4 November 2026', review: '8 November 2026', url: 'https://inclusivenews.com.ng/credible-disability-data-key-to-effective-planning-service-delivery-gufwan/', note: 'Reporting on validation of revised KPIs and NDMIS data collection tools; does not verify deployment or this project’s integration.' },
 { id: 'unhcr', title: 'UNHCR: Sampling', date: 'Online guidance', review: '8 November 2026', url: 'https://unhcr.github.io/Integrated-framework-household-survey/Sampling.html', note: 'Probability and non-probability approaches, including referral bias.' },
 { id: 'bank', title: 'World Bank: Sampling, Weighting & Estimation', date: 'Online guidance', review: '8 November 2026', url: 'https://www.worldbank.org/en/programs/lsms/sampling', note: 'Guidance for a justified survey design and inference.' },
 { id: 'dime', title: 'DIME: Acquiring development data', date: 'Online handbook', review: '8 November 2026', url: 'https://worldbank.github.io/dime-data-handbook/acquisition.html', note: 'Data quality, documentation and confidential-data handling.' },
 { id: 'wg', title: 'Washington Group: Implementation guidelines', date: 'Online guidance', review: '8 November 2026', url: 'https://www.washingtongroup-disability.com/implementation/implementation-guidelines/', note: 'Question selection and implementation for disability statistics.' },
];

function Cite({ id }: { id: string }) {
 const source = proposalSources.find(s => s.id === id)!;
 return <a href={source.url}>{source.title}</a>;
}

export function ProposalLinks() {
 return <p className="proposal-links"><a href="/?page=research-reading#static-research">Read the research plan →</a> <a href="/downloads/pilot-discussion-brief.html">Pilot Discussion Brief →</a> <a href="/?page=explore#static-explore">Explore the learning sandbox →</a></p>;
}


export function Foundation() {
 return <section aria-labelledby="sampling-heading"><h2 id="sampling-heading">Building on Gufwan’s foundation.</h2>
  <p className="sampling-intro">WHO’s historical profile connects Gufwan’s experience of polio with his work helping others access mobility and education. <Cite id="who"/>.</p>
  <p className="sampling-intro">Beautiful Gate reports more than 24,000 wheelchairs across 28 states, alongside other mobility and education support. These are its own cumulative figures without a reporting date. <Cite id="gate"/>. A 2017 account describes production in Jos and outreach across 23 states at that time. <Cite id="renew"/>. Historical reach is not a complete current register.</p>
  <p className="sampling-intro">In his 2025 interview, Gufwan discusses disability data, education and access to services. These are attributed priorities and reported initiatives. <Cite id="interview"/>.</p>
  <p className="sampling-intro">November 2026 reporting describes a workshop validating revised KPIs and NDMIS data collection tools, and a call for reliable disability data. <Cite id="ndmis"/>. Possible alignment is a technical discussion; this report does not establish deployment, endorsement or an existing integration with our prototype.</p>
 </section>;
}

export function TeamContribution() {
 return <section><h2>Our contribution as two statisticians.</h2><p className="sampling-intro">{pilot.team}</p><p className="sampling-intro">We propose to design varied recruitment channels, check duplicates and missing information, monitor who is being missed, and evaluate the pathway from registration to teaching and demonstrated skills.</p><p className="sampling-intro">{pilot.objective}</p><p className="research-status">{pilot.status}</p></section>;
}

export function PilotScope({ brief = false }: { brief?: boolean }) {
 return <section className="pilot-scope"><h2>A proposed pilot.</h2><p className="sampling-intro">{pilot.scope}</p><p className="sampling-intro">Proposed activities: accessible voluntary registration, weekly coverage reviews, facilitator readiness checks, learner matching and supported teaching, followed by cohort review.</p><p className="sampling-intro">{pilot.timing}</p><h3>Three decisions for a first meeting</h3><ol>{pilot.decisions.map(item => <li key={item}>{item}</li>)}</ol>{!brief && <p><a href="/downloads/pilot-discussion-brief.html">Open the Pilot Discussion Brief →</a> · Print or save as PDF in your browser.</p>}</section>;
}

export const proposedMeasures = [
 ['Proposed registration quality', 'Count unique registrations meeting agreed verification checks. Report suspected duplicates awaiting review separately; do not count unresolved duplicates as verified.', 'Check daily during collection; summarise weekly.'],
 ['Proposed recruitment coverage', 'Count recruitment by channel and agreed participant group. Show missing location and profile fields as counts and shares of all registrations; retain unknown categories. Multi-channel totals must identify overlaps.', 'Review weekly, with a dated outreach-change log.'],
 ['Proposed teaching pathway', 'Count unique learners requesting teaching, matched, waiting for a suitable match, and starting at least one instructional session. State the observation date and cohort; these stages are not additive.', 'Update at each transition; summarise weekly.'],
 ['Proposed attendance and skills', 'Attendance = sessions attended / sessions scheduled for each starting cohort. Skills = learners demonstrating an agreed assessed skill / all learners starting that cohort. Report numerator, denominator, assessment criteria and unassessed learners; completion review requires a full course cycle.', 'Record each session and assessment; review monthly and at course-cycle end.'],
 ['Proposed follow-up and access', 'Missing follow-ups / all follow-ups due in the period; unresolved access needs / all recorded needs. Summarise voluntary feedback, number invited, number responding and themes, with accessible response routes.', 'Log as received; review weekly and at cohort follow-up.'],
 ['Proposed unit costs', 'Document actual attributable costs and allocation rules for the same period/cohort. Divide by verified registrations, learners starting instruction, and learners demonstrating an agreed skill, respectively. Show each numerator and denominator; a zero denominator means not calculable.', 'Record expenditure when incurred; reconcile monthly and at pilot review.'],
];

export function Measures() {
 return <section className="sampling-statistics"><h2>Proposed measures of success.</h2><p>Every measure below is proposed for agreement during scoping. No results, budget amounts or performance targets are available. These describe delivery and coverage, without establishing causal impact.</p><div className="sampling-table-scroll" role="region" aria-label="Proposed pilot measurements" tabIndex={0}><table className="sampling-methods"><caption>Proposed definitions and collection frequency</caption><thead><tr><th scope="col">Proposed measure</th><th scope="col">Definition</th><th scope="col">Collection and review frequency</th></tr></thead><tbody>{proposedMeasures.map(([name, definition, frequency]) => <tr key={name}><th scope="row">{name}</th><td>{definition}</td><td>{frequency}</td></tr>)}</tbody></table></div><p>{pilot.outputs}</p></section>;
}

export function Readiness() {
 return <section><h2>Resources and preparation before recruitment.</h2><p>{pilot.status}</p><ol>{pilot.preparation.map(item => <li key={item}>{item}</li>)}</ol><p>Agree who provides each resource and who owns collection, safeguarding, teaching and follow-up. A working demonstration does not establish operational readiness.</p></section>;
}

export function ProposalSources() {
 return <section className="proposal-sources"><h2>Sources and review dates.</h2><p>Historical achievements, reported priorities and our proposed activities are distinguished above. Methodological sources inform the proposal; they do not endorse it.</p><ul>{proposalSources.map(source => <li key={source.id}><a href={source.url}>{source.title}</a> · {source.date} · Reviewed {source.review}. <span>{source.note}</span></li>)}</ul></section>;
}

export function PilotBrief() {
 return <><header><p>IMPACT MOSAIC · INDEPENDENT PROPOSAL · 8 NOVEMBER 2026</p><h1>Pilot Discussion Brief</h1><p>Use your browser’s Print command to print or save as PDF.</p><p className="proposal-links"><a href="/?page=research-reading#static-research">Read the research plan →</a><a href="/?page=explore#static-explore">Explore the learning sandbox →</a></p></header><main id="brief-main"><section><h2>Objective</h2><p>{pilot.objective}</p></section><Foundation/><TeamContribution/><PilotScope brief/><section><h2>Evidence outputs for review</h2><p>{pilot.outputs}</p><p>Agree measurement definitions, denominators and review frequency using the research plan. No results or targets are claimed.</p></section><Readiness/><ProposalSources/></main><footer><a href="https://deerflow.tech" target="_blank" rel="noreferrer">Created By Deerflow</a></footer></>;
}

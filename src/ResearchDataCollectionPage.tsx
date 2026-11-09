import { Foundation, TeamContribution, PilotScope, Measures, Readiness, ProposalSources, pilot } from './PilotProposal';
import { ResearchPresentation } from './ResearchPresentation';

const samplingStages = [
 { name: 'Define coverage', symbol: 'groups', method: 'Stratification and frame assessment', statistic: 'Group by geography and relevant participant characteristics; document who the available lists exclude.', plain: 'Plan who we need to reach, so one well-connected community does not stand in for the whole country.', time: 'Weeks 1–3', gate: 'Agree pilot area, eligibility, partners and data arrangements.' },
 { name: 'Build the register', symbol: 'network', method: 'Adaptive snowball recruitment with purposive starting contacts', statistic: 'Monitor referral channels and coverage weekly. Add starting contacts or offline outreach when groups are missing or referrals repeat the same networks. This remains non-probability recruitment; selection chances are unknown.', plain: 'Ask willing people to pass on an invitation. Check who is being missed, then find new community contacts to reach them. People can register without joining the research.', time: 'Weeks 4–8; then ongoing', gate: 'Begin after consent materials and secure registration are ready; agree adaptation rules during the pilot.' },
 { name: 'Test the process', symbol: 'check', method: 'Accessible questionnaire pilot and response diagnostics', statistic: 'Measure interview duration, item non-response and contact-to-completion rates by collection mode.', plain: 'Try the questions and registration with different people. Fix confusing wording and barriers before expanding.', time: 'Weeks 4–6', gate: 'Retest translations, accommodations and changed questions as needed.' },
 { name: 'Plan the study size', symbol: 'size', method: 'Precision, design effect and non-response allowance', statistic: 'For a proportion: n₀ = z²p(1−p)/e²; invitations ≈ n₀ × DEFF / r, rounded up. This is a starting approximation, not a project target.', plain: 'Decide how precise answers need to be, allow for grouped sampling and invite extra people because some will not respond.', time: 'Weeks 7–9', gate: 'Use pilot evidence, budget and reporting needs; revise before drawing the sample.' },
 { name: 'Select and survey', symbol: 'select', method: 'Stratified probability sampling where a usable frame exists', statistic: 'Randomly select within defined groups; retain stratum IDs, inclusion probabilities and response dispositions.', plain: 'For research, draw names fairly from the agreed lists. Keep ordinary registration open and do not substitute convenient volunteers for sampled people.', time: 'Weeks 10–15', gate: 'Requires a checked sampling frame, trained team and agreed study protocol.' },
 { name: 'Check and estimate', symbol: 'weights', method: 'Quality checks, survey weights and confidence intervals', statistic: 'Audit duplicates and missingness. Start with wᵢ = 1/πᵢ; justify response adjustments. Estimate uncertainty using strata and clusters.', plain: 'Check the records, account for unequal selection chances and show how uncertain the research findings are.', time: 'Daily during collection; weeks 16–18 for analysis', gate: 'Weights cannot recover people entirely absent from the frame.' },
 { name: 'Connect online teaching', symbol: 'match', method: 'Demand–capacity cross-tabulation', statistic: 'Compare learner interests, language, access needs and availability with reviewed facilitator capacity; monitor unmatched requests.', plain: 'Find suitable teachers for learners and see where more teaching capacity or connectivity support is needed.', time: 'Recruit facilitators in weeks 4–10; match from week 11', gate: 'Lessons start only when teachers, learners and access support are ready.' },
 { name: 'Learn and expand', symbol: 'trend', method: 'Cohort tracking, completion rates and attrition analysis', statistic: 'Follow each starting cohort; report completion with its denominator, missing follow-ups and differences between groups.', plain: 'See who starts, finishes or needs help. Use that evidence to improve the next intake and reach new areas.', time: 'First review around weeks 19–20; monthly thereafter', gate: 'Allow a full course cycle before judging completion. National expansion remains open.' },
];

function SamplingIllustration({ kind }: { kind: string }) {
 return <svg className={`sampling-mini sampling-mini-${kind}`} viewBox="0 0 132 60" aria-hidden="true" focusable="false">
  <path d="M12 30H120" fill="none" stroke="currentColor" opacity=".25" />
  {kind === 'network' && <path d="M20 30L64 14 108 30 64 46Z" fill="none" stroke="currentColor" strokeWidth="1.5" />}
  {kind === 'groups' && [0,1,2].map(group => <rect key={group} x={9+group*44} y="5" width="22" height="50" rx="6" fill="none" stroke="currentColor" opacity=".5" />)}
  {kind === 'size' && <path d="M8 8V4H124V8M8 52V56H124V52" fill="none" stroke="currentColor" strokeWidth="2" />}
  {[0,1,2].map(group => <g key={group} className="sampling-mini-group" style={{ animationDelay: `${group * .25}s` }}>
   {[0,1,2].map(dot => <circle key={dot} cx={20 + group * 44} cy={14 + dot * 16} r={kind === 'weights' ? 3 + group : 4} fill="currentColor" opacity={kind === 'select' && dot !== group ? .2 : .8} />)}
   {kind === 'check' && <path d={`M${13+group*44} 48l5 4 10-11`} fill="none" stroke="currentColor" strokeWidth="2" />}
   {kind === 'match' && <path d={`M${25+group*44} 14l20 16-20 16`} fill="none" stroke="currentColor" strokeWidth="1.5" />}
  </g>)}
  {kind === 'trend' && <path d="M12 48L48 36 82 40 120 10" fill="none" stroke="currentColor" strokeWidth="3" />}
 </svg>;
}

export function ResearchDataCollectionPage() {
 return <div className="showcase research-page">
  <section className="section public-page sampling-framework" aria-labelledby="sampling-heading">
   <div className="site-page-heading"><div><h1>Research &amp; Data Collection.</h1><p>A proposed Plateau pilot: reliable disability data connected to accessible online teaching.</p></div></div>
   <ResearchPresentation/>
   <Foundation/>
   <TeamContribution/>
   <PilotScope/>
   <h2>Database recruitment and separate research sampling.</h2>
   <div className="sampling-participants">
    <section aria-labelledby="sampling-learners"><h3 id="sampling-learners">People with disabilities</h3><p>Register voluntarily, describe learning interests and access needs, and choose whether to take up online learning. Registration would not require agreeing to research.</p></section>
    <section aria-labelledby="sampling-facilitators"><h3 id="sampling-facilitators">Online facilitators</h3><p>Recruit people with relevant subject skills, review their teaching and accessibility readiness, and match their availability to learners’ needs.</p></section>
   </div>
   <h2>How sampling fits.</h2>
   <p className="sampling-intro">Database enrolment would remain open to eligible people reached through several channels. Our proposed approach is adaptive snowball recruitment: begin with varied community contacts, invite voluntary referrals, review coverage weekly and change outreach where people are being missed. This builds on <a href="https://unhcr.github.io/Integrated-framework-household-survey/Sampling.html">documented snowball sampling</a>; the adaptive coverage reviews are our proposed addition. It is not formal adaptive cluster sampling and does not create a representative national sample. Representative research remains conditional on a defined target population, a suitable sampling frame and a justified design. Register-based findings describe the covered population; we do not promise national estimates from the register.</p>
   <p className="research-status">In planning. Research recruitment and data collection are not open.</p>
   <section className="sampling-statistics" aria-labelledby="sampling-statistics-heading">
    <h2 id="sampling-statistics-heading">The sampling plan, explained side by side.</h2>
    <p id="sampling-timing-note">{pilot.timing}</p>
    <p className="sampling-source-note">The small animations illustrate processes, not participant counts or results. They stop after a few seconds.</p>
    <div className="sampling-table-scroll" role="region" aria-label="Sampling methods and pilot time frames" tabIndex={0}>
     <table className="sampling-methods" aria-describedby="sampling-timing-note">
      <caption>From community outreach to a growing database and online learning</caption>
      <thead><tr><th scope="col">Stage</th><th scope="col">Statistical method</th><th scope="col">In everyday language</th><th scope="col">Practical time frame</th></tr></thead>
      <tbody>{samplingStages.map(stage => <tr key={stage.name}>
       <th scope="row"><SamplingIllustration kind={stage.symbol} /><span>{stage.name}</span></th>
       <td><strong>{stage.method}</strong><p>{stage.statistic}</p></td>
       <td>{stage.plain}</td>
       <td><strong>{stage.time}</strong><p>{stage.gate}</p></td>
      </tr>)}</tbody>
     </table>
    </div>
    <p className="sampling-source-note">Formula key: z = confidence multiplier; p = anticipated proportion; e = desired absolute margin of error; DEFF = design effect; r = anticipated response fraction; πᵢ = a person’s inclusion probability. A known finite population may need a finite-population correction. Subgroup reporting can require a larger sample; there is no fixed national sample size yet.</p>
    <p className="sampling-source-note">Methods draw on <a href="https://www.worldbank.org/en/programs/lsms/sampling">World Bank sampling guidance</a>, <a href="https://unhcr.github.io/Integrated-framework-household-survey/Sampling.html">UNHCR’s explanation of recruitment bias</a> and <a href="https://worldbank.github.io/dime-data-handbook/acquisition.html">the DIME data-collection handbook</a>. The time ranges and delivery sequence are our proposed plan.</p>
   </section>
   <details className="sampling-outline" open><summary>Proposed framework · from outreach to online learning</summary>
    <ol>
     <li><strong>Define who and where to reach.</strong> Agree eligibility, an initial pilot area and expansion across the six geopolitical zones. Monitor state, rural and urban coverage, gender and access needs. Nationwide reach is the goal; coverage must be demonstrated.</li>
     <li><strong>Use adaptive snowball recruitment.</strong> Seek varied starting contacts through disability organisations, community groups and training centres, including Gufwan’s networks where agreed. Referrals should share invitations, not another person’s private details. Review coverage and referral yield weekly; add new contacts and assisted, in-person or accessible remote registration where gaps persist. Agree review triggers during the pilot and log each adaptation. Continue looking beyond referral networks for isolated people.</li>
     <li><strong>Build and maintain the database.</strong> Explain use and consent; collect only necessary contact, location, learning and support information. Separate optional research consent, check duplicates, restrict access and provide correction and withdrawal routes. Pilot accessible questions with people with disabilities; use suitable <a href="https://www.washingtongroup-disability.com/implementation/implementation-guidelines/">Washington Group tools</a> for research on functioning, alongside separate questions about learning support.</li>
     <li><strong>Recruit facilitators and connect learning.</strong> Review subject knowledge, online teaching and accessibility skills. Record availability, languages and capacity, then match learners by goals and support requirements. Identify device, connectivity and accommodation barriers before lessons begin.</li>
     <li><strong>Select a separate research sample.</strong> Define the study question and the population a usable sampling list covers. Where feasible, randomly select within agreed groups. Calculate sample size from required precision, subgroup reporting, design effects, expected non-response and budget. Record selection probabilities and response outcomes for weighting. Registry-based results describe its covered population; national estimates need a suitable national sampling frame. <a href="https://www.worldbank.org/en/programs/lsms/sampling">World Bank sampling guidance</a> informs this design.</li>
     <li><strong>Follow up and improve coverage.</strong> Track registrations, matches, attendance, completion and unresolved support needs. Check who drops out or remains unreached, and adapt outreach. Report missing data and research uncertainty. Referral counts, statistical weights or Bayesian models alone cannot establish national representativeness.</li>
    </ol>
   </details>
   <Measures/>
   <Readiness/>
   <ProposalSources/>
  </section>
 </div>;
}

import { pilot } from './PilotProposal';
export function AboutPage() {
 return <div className="showcase about-page"><section className="section public-page">
  <div className="site-page-heading"><div><h1>About.</h1><p>Two statisticians proposing a pathway from reliable data to accessible teaching.</p></div></div>
  <div className="about-overview">
   <section><h2>About Impact Mosaic</h2><p>Impact Mosaic brings together a source-linked showcase of disability inclusion and a learning sandbox for practical skills.</p><p>{pilot.team}</p><p>{pilot.scope}</p><p>The showcase is independent. The sandbox uses fictional participants and sample records to demonstrate learning, teaching and support.</p></section>
   <section><h2>Learning with support</h2><p>Learners practise new skills, facilitators offer guidance, and Administration connects people with teaching and support.</p><p>Explore the sandbox with sample details to see how the roles work together.</p></section>
  </div>
  <section><h2>Our proposed statistical responsibilities</h2><p>Recruitment design, data quality checks, coverage monitoring and evaluation: agree who to reach, check records, identify missing groups and follow starting cohorts with explicit denominators.</p><p>{pilot.status}</p></section>
  <section className="about-credits"><h2>Project contributors</h2><ul aria-label="Project contributors"><li>Jerry Bannister Zachary</li><li>Strong</li></ul></section>
 </section></div>;
}

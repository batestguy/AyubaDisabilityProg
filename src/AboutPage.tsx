import { pilot } from './PilotProposal';

// Co-creator profiles. Drawn from each person's own CV (October/November 2026);
// contact details, dates of birth and referees are deliberately left out.
const creators = [
 {
  id: 'jerry', name: 'Jerry Bannister Zachary', role: 'Statistician and data scientist · Co-creator',
  photo: '/photos/cocreator-jerry-bannister-zachary.webp', width: 720, height: 1000,
  alt: 'Jerry Bannister Zachary, seated in a wheelchair, wearing a purple kaftan and purple trainers.',
  paragraphs: [
   'Jerry is a statistician, data scientist and wheelchair user. Since 2015 Jerry has led the statistical work of the Directorate of Academic Planning and Quality Assurance at Abubakar Tafawa Balewa University, Bauchi, where Jerry is now Senior Statistician and prepares the university’s returns to the National Universities Commission.',
   'Jerry founded JJMB Datascience Hub, a statistical consultancy for researchers, non-governmental organisations and businesses, and has co-authored seven peer-reviewed articles. Jerry holds a master’s degree in Statistics, finishing best in class, and is studying for a PhD.',
   'Living with disability shapes the work. Jerry builds accessible tools for disability inclusion in Nigeria, and designed and built Impact Mosaic.',
  ],
 },
 {
  id: 'strong', name: 'Yusuf Strong Mashat', role: 'Statistician and lecturer · Co-creator',
  photo: '/photos/cocreator-strong-yusuf-mashat.webp', width: 720, height: 926,
  alt: 'Yusuf Strong Mashat, head and shoulders, in a navy suit and tie.',
  paragraphs: [
   'Strong is a statistician from Bokkos, Plateau State, and lectures in Statistics at Plateau State University, Bokkos. Before that, Strong taught for six years at the Plateau State College of Health Technology, Pankshin, serving as Acting Dean of its School of Health Information Management and Biostatistics.',
   'Strong holds a master’s degree in Statistics from Abubakar Tafawa Balewa University, Bauchi, and is studying for a PhD there. Strong’s teaching covers sampling, survey design and biostatistics, with census fieldwork for the National Population Commission as an enumerator in 2006 and a trainer of census staff in 2023.',
   'For this project, Strong brings sampling design, data quality and evaluation, and deep roots in the Plateau communities where the pilot would begin.',
  ],
 },
];

export function AboutPage() {
 return <div className="showcase about-page"><section className="section public-page">
  <div className="site-page-heading"><div><h1>About.</h1><p>Two statisticians proposing a pathway from reliable data to accessible teaching.</p></div></div>
  <section className="about-creators" aria-labelledby="about-creators-title">
   <h2 id="about-creators-title">The co-creators</h2>
   <p className="about-creators-intro">Jerry and Strong created Impact Mosaic together. They have already worked side by side: both are co-authors of a 2025 study comparing prediction models for body mass index in women’s health, published in the Asian Journal of Probability and Statistics.</p>
   <div className="about-creators-grid">
    {creators.map(person => <article className="about-creator" key={person.id} aria-labelledby={`creator-${person.id}`}>
     <img src={person.photo} alt={person.alt} width={person.width} height={person.height} decoding="async" />
     <div>
      <h3 id={`creator-${person.id}`}>{person.name}</h3>
      <p className="about-creator-role">{person.role}</p>
      {person.paragraphs.map(text => <p key={text}>{text}</p>)}
     </div>
    </article>)}
   </div>
  </section>
  <div className="about-overview">
   <section><h2>About Impact Mosaic</h2><p>Impact Mosaic brings together a source-linked showcase of disability inclusion and a learning sandbox for practical skills.</p><p>{pilot.team}</p><p>{pilot.scope}</p><p>The showcase is independent. The sandbox uses fictional participants and sample records to demonstrate learning, teaching and support.</p></section>
   <section><h2>Learning with support</h2><p>Learners practise new skills, facilitators offer guidance, and Administration connects people with teaching and support.</p><p>Explore the sandbox with sample details to see how the roles work together.</p></section>
  </div>
  <section><h2>Our proposed statistical responsibilities</h2><p>Recruitment design, data quality checks, coverage monitoring and evaluation: agree who to reach, check records, identify missing groups and follow starting cohorts with explicit denominators.</p><p>{pilot.status}</p></section>
 </section></div>;
}

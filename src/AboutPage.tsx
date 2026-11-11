import type { ReactNode } from 'react';
import { pilot } from './PilotProposal';

// Co-creator profiles. Drawn from each person's CV, plus class-ranking, scholarship,
// membership, family, chess and profile-link details supplied by the owner (11 November 2026).
// Emails and phone numbers are published at the owner's request; dates of birth and referees stay out.

function Ext({ href, children }: { href: string; children: ReactNode }) {
 return <a href={href} target="_blank" rel="noreferrer">{children}<span className="sr-only"> (opens in a new tab)</span></a>;
}

const links = {
 scholar: 'https://scholar.google.com/citations?user=oKaejtMAAAAJ',
 // Zenodo has no public username pages; this search lists records under Jerry's name or ORCID iD.
 zenodo: 'https://zenodo.org/search?q=metadata.creators.person_or_org.name%3A%22Zachary%2C%20Jerry%22%20OR%20metadata.creators.person_or_org.name%3A%22Zachary%2C%20Jerry%20Bannister%22%20OR%20metadata.creators.person_or_org.identifiers.identifier%3A%220009-0002-3302-9558%22',
 github: 'https://github.com/batestguy',
 rag: 'https://github.com/batestguy/NGOdisabilityRAG',
 chesscom: 'https://www.chess.com/member/bayesianRules',
 lichess: 'https://lichess.org/@/bayesianRules',
 researchgate: 'https://www.researchgate.net/profile/Strong-Mashat',
};

const contacts = [
 { id: 'jerry', name: 'Jerry Bannister Zachary', emails: ['batesthommie@gmail.com', 'jzbannister@atbu.edu.ng'], phone: '+234 706 167 4831' },
 { id: 'strong', name: 'Yusuf Strong Mashat', emails: ['bwehlak61@gmail.com'], phone: '+234 803 047 8249' },
];

const creators: { id: string; name: string; role: string; photo: string; width: number; height: number; alt: string; paragraphs: ReactNode[] }[] = [
 {
  id: 'jerry', name: 'Jerry Bannister Zachary', role: 'Statistician and data scientist · Co-creator',
  photo: '/photos/cocreator-jerry-bannister-zachary.webp', width: 720, height: 1000,
  alt: 'Jerry Bannister Zachary, seated in a wheelchair, wearing a purple kaftan and purple trainers.',
  paragraphs: [
   <>Jerry is a data scientist and wheelchair user who works as a statistician at the Directorate of Academic Planning and Quality Assurance, Abubakar Tafawa Balewa University (ATBU), Bauchi.</>,
   <>Jerry has consistently finished in the top 2 percent of the class in Statistics, at both bachelor’s and master’s level, won the MTN Foundation (MTNF) Scholarship award as an undergraduate, and is now studying for a PhD. Jerry is a member of the Chartered Institute of Statisticians of Nigeria (CISON).</>,
   <>Jerry has authored papers across health, science and the social sciences, and founded JJMB Datascience Hub, a statistical consultancy for researchers, non-governmental organisations and businesses.</>,
   <>Living with disability shapes the work. Jerry’s disability research includes a <Ext href={links.rag}>disability rights assistant</Ext>: a chatbot that answers questions about Nigeria’s Disability Act 2018 and the Constitution, using retrieval-augmented generation (RAG) so that each answer draws on the legal texts themselves.</>,
   <>To connect with Jerry, read the research on <Ext href={links.scholar}>Google Scholar</Ext> and <Ext href={links.zenodo}>Zenodo</Ext>, browse the code and projects on <Ext href={links.github}>GitHub</Ext>, or challenge Jerry to a game of chess as bayesianRules on <Ext href={links.chesscom}>Chess.com</Ext> or <Ext href={links.lichess}>Lichess</Ext>.</>,
  ],
 },
 {
  id: 'strong', name: 'Yusuf Strong Mashat', role: 'Statistician and lecturer · Co-creator',
  photo: '/photos/cocreator-strong-yusuf-mashat.webp', width: 720, height: 926,
  alt: 'Yusuf Strong Mashat, head and shoulders, in a navy suit and tie.',
  paragraphs: [
   <>Strong is a statistician from Bokkos, Plateau State, and lectures in Statistics at Plateau State University, Bokkos. Before that, Strong taught for six years at the Plateau State College of Health Technology, Pankshin, serving as Acting Dean of its School of Health Information Management and Biostatistics.</>,
   <>Strong finished in the top 2 percent of the MSc Statistics class at Abubakar Tafawa Balewa University (ATBU), Bauchi, and has won the prestigious Petroleum Technology Development Fund (PTDF) PhD scholarship. Strong is a member of the Royal Statistical Society (RSS) and the Chartered Institute of Statisticians of Nigeria (CISON).</>,
   <>Strong’s teaching covers sampling, survey design and biostatistics, with census fieldwork for the National Population Commission as an enumerator in 2006 and a trainer of census staff in 2023. For this project, Strong brings sampling design, data quality and evaluation.</>,
   <>To connect with Strong, follow the research on <Ext href={links.researchgate}>ResearchGate</Ext>.</>,
   <>Strong is happily married with children.</>,
  ],
 },
];

export function AboutPage() {
 return <div className="showcase about-page"><section className="section public-page">
  <div className="site-page-heading"><div><h1>About.</h1><p>Two statisticians proposing a pathway from reliable data to accessible teaching.</p></div></div>
  <section className="about-creators" aria-labelledby="about-creators-title">
   <h2 id="about-creators-title">The co-creators</h2>
   <p className="about-creators-intro">Jerry and Strong created Impact Mosaic together and have co-authored a research paper.</p>
   <div className="about-creators-grid">
    {creators.map(person => <article className="about-creator" key={person.id} aria-labelledby={`creator-${person.id}`}>
     <img src={person.photo} alt={person.alt} width={person.width} height={person.height} decoding="async" />
     <div>
      <h3 id={`creator-${person.id}`}>{person.name}</h3>
      <p className="about-creator-role">{person.role}</p>
      {person.paragraphs.map((text, index) => <p key={index}>{text}</p>)}
     </div>
    </article>)}
   </div>
  </section>
  <div className="about-overview">
   <section><h2>About Impact Mosaic</h2><p>Impact Mosaic brings together a source-linked showcase of disability inclusion and a <a href="/?page=explore">Learning Sandbox</a> that shows how learners, facilitators and Administration would work together.</p><p>{pilot.scope}</p><p>The showcase is independent. The sandbox uses fictional participants and sample records only.</p></section>
   <section><h2>Proposed statistical responsibilities</h2><p>Recruitment design, data quality checks, coverage monitoring and evaluation: agree who to reach, check records, identify missing groups and follow starting cohorts with explicit denominators.</p><p>{pilot.status}</p></section>
  </div>
  <section className="about-contact" aria-labelledby="about-contact-title">
   <h2 id="about-contact-title">Get in touch</h2>
   <p>To discuss the proposal, contact either co-creator directly.</p>
   <div className="about-contact-grid">
    {contacts.map(person => <div key={person.id}>
     <h3>{person.name}</h3>
     <ul>
      {person.emails.map(email => <li key={email}>Email: <a href={`mailto:${email}`}>{email}</a></li>)}
      <li>Phone: <a href={`tel:${person.phone.replaceAll(' ', '')}`}>{person.phone}</a></li>
     </ul>
    </div>)}
   </div>
  </section>
 </section></div>;
}

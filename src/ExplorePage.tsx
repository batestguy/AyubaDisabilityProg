export function ExplorePage({onOpen}: {onOpen:(page:string)=>void}) {
 return <div className="showcase explore-page">
  <section className="section projects-intro">
   <p className="eyebrow">LEARN. PRACTISE. CONNECT.</p>
   <h1>Learning Sandbox.</h1>
   <p>Try the learning journey as a learner, facilitator or administrator.</p>
   <div className="app-demo-entry">
    <h2>Explore the app demo.</h2>
    <p>Choose Learner, Facilitator or Administration to explore the connected workspace.</p>
    <button className="primary" onClick={()=>onOpen('app-demo')}>Open the app demo →</button>
   </div>
  </section>
 </div>;
}

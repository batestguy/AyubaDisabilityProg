import { SandboxArtwork } from './SandboxArtwork';

export function ExplorePage({onOpen}: {onOpen:(page:string)=>void}) {
 return <div className="showcase explore-page">
  <section className="section projects-intro">
   <div className="site-page-heading">
    <div><h1>Learning Sandbox.</h1><p>Build practical skills with guidance and support.</p></div>
    <button className="primary" onClick={()=>onOpen('app-demo')}>Open the app demo →</button>
   </div>
   <SandboxArtwork/>
  </section>
 </div>;
}

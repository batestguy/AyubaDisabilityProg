export function AboutPage() {
 return <div className="showcase"><section className="section"><p className="eyebrow">ABOUT</p><h1>About.</h1><div className="profile-spaces">{['Jerry Bannister Zachary','Strong'].map(name=><section className="profile-space" aria-label={name} key={name}><h2>{name}</h2><div role="group" className="empty-portrait" aria-label={`${name} portrait space`}><span>Photo space</span></div><div role="group" className="empty-biography" aria-label={`${name} biography space`}/></section>)}</div></section></div>;
}

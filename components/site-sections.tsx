import {projects,services,deliverables,formats,steps,homepagePhases,checks,config} from '@/lib/content';
import {ProjectCard,HeroVideoPlayer} from './site-interactive';
import {ArrowUpRight} from 'lucide-react';




export function CTA(){
  return (
    <section className="cta wrap">
      <p className="eyebrow">LET’S REVIEW THE STEELWORK</p>
      <h2>Need reliable detailing capacity for an upcoming steel project?</h2>
      <div className="actions">
        <a className="button" href="/contact">Request a Project Review <ArrowUpRight size={18} aria-hidden="true"/></a>
        <a className="textlink" href="/contact?intent=rfq">Send an RFQ ↗</a>
      </div>
    </section>
  );
}

export function Footer(){
  return (
    <footer className="footer wrap">
      <div className="footer-main">
        <a className="brand" href="/" aria-label="Julkar Naeem Structural Steel Detailer">
          <img 
            src="/jn-logo-mark.png" 
            alt="Julkar Naeem JN Monogram" 
            width={74} 
            height={54} 
            className="brand-mark" 
            decoding="async" 
          />
          <span className="brand-text">
            JULKAR NAEEM
            <span className="brand-sub">STRUCTURAL STEEL DETAILER</span>
          </span>
        </a>
        <p>Steel Detailer for Fabricators<br/> & Engineering Teams<br/><span className="muted">Dhaka, Bangladesh</span></p>
        <nav aria-label="Footer navigation">
          {['Services','Portfolio','Process','About','Credentials','Contact'].map(x=>(
            <a key={x} href={'/'+x.toLowerCase()}>{x}</a>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Julkar Naeem</span>
        <span>Tekla Structures · AutoCAD</span>
        <a href="/privacy">Privacy</a>
      </div>
    </footer>
  );
}

export function ServiceSection(){
  return (
    <section className="section light">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">01 / DETAILING SUPPORT</p>
            <h2>From engineering information<br/>to practical deliverables.</h2>
          </div>
          <p>Focused structural-steel detailing services for fabrication teams, engineering firms and contractors.</p>
        </div>
        <div className="service-grid">
          {services.map((s,i)=>(
            <article className="service-card" key={s.id} id={s.id}>
              <div className="service-art">
                <img 
                  src={'/services/'+s.image+'.webp'} 
                  alt={'Editorial illustration for '+s.title} 
                  width={640} 
                  height={360} 
                  loading="lazy" 
                  decoding="async"
                />
              </div>
              <div className="service-copy">
                <span className="small muted">0{i+1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <a className="textlink" href={'/contact?service='+s.id}>Discuss this service ↗</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Differentiator(){
  return (
    <section className="section differentiator wrap">
      <div>
        <p className="eyebrow">02 / FABRICATION FIRST</p>
        <h2>A model that looks correct is not enough. <em>The steel must also be practical to fabricate and erect.</em></h2>
        <p className="intro">I turn engineering drawings into coordinated Tekla models and clear fabrication-ready drawings that help steel fabricators cut, weld, bolt, assemble and erect steel with fewer questions.</p>
      </div>
      <div className="checks">
        <p className="small">WHAT I CHECK</p>
        {checks.map((c,i)=>(
          <div key={c}><span>{String(i+1).padStart(2,'0')}</span>{c}</div>
        ))}
      </div>
    </section>
  );
}

export function SelectedProjects(){

  return (
    <section className="section light">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / PROJECT EXPERIENCE</p>
            <h2>The work, in detail.</h2>
          </div>
          <a className="textlink" href="/portfolio">Explore all five case studies ↗</a>
        </div>
        <div className="project-grid selected">
          {projects.map((p,i)=>(
            <ProjectCard project={p} key={p.code} index={i}/>
          ))}
        </div>
        <p className="confidential">Selected 3D model views only. Fabrication, connection and erection drawing sheets remain outside the public portfolio.</p>
      </div>
    </section>
  );
}

export function Deliverables(){
  return (
    <section className="section deliverables wrap">
      <div>
        <p className="eyebrow">04 / THE ISSUE PACKAGE</p>
        <h2>Clear information.<br/>Useful production files.</h2>
        <p className="intro">The deliverable package is agreed to match your scope, fabrication workflow and project requirements.</p>
      </div>
      <div>
        <ul className="deliverable-list">
          {deliverables.map(x=><li key={x}>{x}</li>)}
        </ul>
        <p className="format-line">WHEN REQUIRED <span>{formats.join(' · ')}</span></p>
      </div>
    </section>
  );
}

export function ProcessSteps(){
  return (
    <div className="process-steps">
      {steps.map(([title,text],i)=>(
        <article key={title}>
          <span>{String(i+1).padStart(2,'0')}</span>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export function HomepageProcessPhases(){
  return (
    <div className="process-phases-grid">
      {homepagePhases.map((phase)=>(
        <article key={phase.title} className="phase-card">
          <span className="phase-step">{phase.step}</span>
          <h3>{phase.title}</h3>
          <p>{phase.text}</p>
        </article>
      ))}
    </div>
  );
}

export function ProcessSection(){
  return (
    <section className="section light">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">05 / A TRACEABLE PROCESS</p>
            <h2>Resolve the questions.<br/>Coordinate the steel.</h2>
          </div>
          <a className="textlink" href="/process">View full 9-step detailing process ↗</a>
        </div>
        <HomepageProcessPhases/>
      </div>
    </section>
  );
}

export function AboutIntro(){
  return (
    <section className="section wrap about-intro">
      <div className="about-intro-media">
        <figure>
          <img 
            src="/julkar-naeem-dp.webp" 
            alt="Julkar Naeem, Senior Structural Steel Detailer" 
            width={768} 
            height={1024}
            loading="lazy" 
            decoding="async"
          />
          <figcaption>Julkar Naeem · Dhaka, Bangladesh</figcaption>
        </figure>
      </div>
      <div>
        <p className="eyebrow">06 / THE DETAILER BEHIND THE MODEL</p>
        <h2>Julkar Naeem</h2>
        <p className="role">{config.title}</p>
        <p className="intro">Based in Dhaka, Bangladesh, I bring around nine years across steel, construction, production, QA and operations, including more than four years focused on structural-steel detailing.</p>
        <p className="intro">That background informs a practical approach to model coordination and fabrication documentation using Tekla Structures and AutoCAD.</p>
        <div className="credential-strip">
          <span>AISC Detailer Training Series</span>
          <span>Tekla Structures Steel Fundamentals</span>
        </div>
        <div className="actions">
          <a className="textlink" href="/about">About Julkar ↗</a>
          <a className="textlink" href="/credentials">Training & credentials ↗</a>
        </div>
      </div>
    </section>
  );
}

export function Hero(){
  const p=projects[1]; // JN-PRJ-002 Multi-storey Steel Frame
  const videoUrl='https://res.cloudinary.com/julkarnaeem/video/upload/v1789141556/JN-PRJ-002-Multi-storey-Steel-Frame.mp4';
  return (
    <>
      <section className="hero wrap">
        <div>
          <p className="eyebrow">Structural Steel Detailer · Tekla Structures</p>
          <h1>Fabrication-ready steel detailing for teams that need <em>clear, coordinated deliverables.</em></h1>
          <p className="intro">I support steel fabricators, engineering teams and contractors with coordinated Tekla models, shop drawings, erection drawings, connection detailing and material reports.</p>
          <div className="actions">
            <a className="button" href="/contact">Request a Project Review <ArrowUpRight size={18} aria-hidden="true"/></a>
            <a className="textlink" href="/portfolio">View Project Experience ↗</a>
          </div>
          <p className="small hero-note">BASED IN DHAKA · INTERNATIONAL PROJECT SUPPORT</p>
        </div>
        <HeroVideoPlayer
          src={videoUrl}
          poster={p.cover}
          title="Multi-storey Steel Frame"
          slug={p.slug}
        />
      </section>

      <div className="trust wrap">
        {['Tekla Structures','AutoCAD','Fabrication Documentation','Model Coordination','International Project Support'].map(x=>(
          <span key={x}>{x}</span>
        ))}
      </div>
    </>
  );
}

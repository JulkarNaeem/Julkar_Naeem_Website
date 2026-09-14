import {deliverables,formats,steps,homepagePhases,config} from '@/lib/content';
import {getPublishedContent} from '@/lib/managed-content';
import {contactConfig} from '@/lib/cms-model';
import {getPortfolioProjects} from '@/lib/portfolio-feed';
import {ProjectCard,HeroVideoPlayer,ProjectImage} from './site-interactive';
import {ArrowUpRight} from 'lucide-react';
import {FaEnvelope,FaInstagram,FaLinkedin,FaUpwork,FaWhatsapp} from 'react-icons/fa6';




export async function CTA(){
  const {settings}=await getPublishedContent();
  return (
    <section className="cta wrap">
      <p className="eyebrow">LET’S REVIEW THE STEELWORK</p>
      <h2>{settings.ctaTitle}</h2>
      <div className="actions">
        <a className="button" href="/contact">Request a Project Review <ArrowUpRight size={18} aria-hidden="true"/></a>
        <a className="textlink" href="/contact?intent=rfq">Send an RFQ ↗</a>
      </div>
    </section>
  );
}

export async function Footer(){
  const config=contactConfig((await getPublishedContent()).settings);
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
        {(config.professionalEmails.length>0||config.whatsapp||config.linkedInUrl||config.upworkUrl||config.instagramUrl)&&(
          <div className="footer-contact" aria-label="Professional contact links">
            {config.professionalEmails.map((email,index)=><a href={`mailto:${email}`} aria-label={`Email ${email}`} title={email} key={email}><FaEnvelope aria-hidden="true"/><span className="sr-only">{index===0?'Project email':'Direct email'}</span></a>)}
            {config.whatsapp&&<a href={config.whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${config.whatsappNumber}`} title={`WhatsApp ${config.whatsappNumber}`}><FaWhatsapp aria-hidden="true"/></a>}
            {config.linkedInUrl&&<a href={config.linkedInUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" title="LinkedIn"><FaLinkedin aria-hidden="true"/></a>}
            {config.upworkUrl&&<a href={config.upworkUrl} target="_blank" rel="noopener noreferrer" aria-label="Upwork profile" title="Upwork"><FaUpwork aria-hidden="true"/></a>}
            {config.instagramUrl&&<a href={config.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram profile" title="Instagram"><FaInstagram aria-hidden="true"/></a>}
          </div>
        )}
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Julkar Naeem</span>
        <span>Tekla Structures · AutoCAD</span>
        <a href="/privacy">Privacy</a>
      </div>
    </footer>
  );
}

export async function ServiceSection(){
  const {services}=(await getPublishedContent()).settings;
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
  const checkGroups=[
    'Fabrication and welding access',
    'Bolt installation, tightening and tool clearance',
    'Member orientation, dimensions and levels',
    'Clashes and erection feasibility',
    'Drawing clarity and conflicting information'
  ];
  return (
    <section className="section differentiator wrap">
      <div>
        <p className="eyebrow">02 / FABRICATION FIRST</p>
        <h2>A model that looks correct is not enough. <em>The steel must also be practical to fabricate and erect.</em></h2>
        <p className="intro">I turn engineering drawings into coordinated Tekla models and clear fabrication-ready drawings that help steel fabricators cut, weld, bolt, assemble and erect steel with fewer questions.</p>
      </div>
      <div className="checks">
        <p className="small">WHAT I CHECK</p>
        {checkGroups.map((c,i)=>(
          <div key={c}><span>{String(i+1).padStart(2,'0')}</span>{c}</div>
        ))}
        <a className="textlink" href="/services">View detailed services ↗</a>
      </div>
    </section>
  );
}

export async function SelectedProjects(){
  const portfolioProjects=await getPortfolioProjects();
  return (
    <section className="section light">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">03 / PROJECT EXPERIENCE</p>
            <h2>The work, in detail.</h2>
          </div>
          <a className="textlink" href="/portfolio">Explore all case studies ↗</a>
        </div>
        <div className="project-grid selected">
          {portfolioProjects.map((p,i)=>(
            <ProjectCard project={p} key={p.code} index={i}/>
          ))}
        </div>
        <p className="confidential">Selected 3D model views only. Fabrication, connection and erection drawing sheets remain outside the public portfolio.</p>
      </div>
    </section>
  );
}

export function Deliverables({compact=false}:{compact?:boolean}){
  const displayed=compact?[
    '3D Tekla models and GA drawings',
    'Assembly and single-part drawings',
    'Shop and fabrication drawings',
    'Erection and anchor-bolt drawings',
    'Connection details and bolt lists',
    'MTO and BOM reports'
  ]:deliverables;
  return (
    <section className="section deliverables wrap">
      <div>
        <p className="eyebrow">04 / THE ISSUE PACKAGE</p>
        <h2>Clear information.<br/>Useful production files.</h2>
        <p className="intro">The deliverable package is agreed to match your scope, fabrication workflow and project requirements.</p>
      </div>
      <div>
        <ul className="deliverable-list">
          {displayed.map(x=><li key={x}>{x}</li>)}
        </ul>
        <p className="format-line">WHEN REQUIRED <span>{formats.join(' · ')}</span></p>
        {compact&&<a className="textlink" href="/services">Review services and deliverables ↗</a>}
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

export async function AboutIntro(){
  const {settings}=await getPublishedContent();
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
        <p className="intro">{settings.aboutIntro}</p>
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

export async function Hero(){
  const {settings}=await getPublishedContent();
  const portfolioProjects=await getPortfolioProjects();
  const p=portfolioProjects.find(p=>p.code==="002")||portfolioProjects[0];
  const videoUrl='https://res.cloudinary.com/julkarnaeem/video/upload/v1789141556/JN-PRJ-002-Multi-storey-Steel-Frame.mp4';
  return (
    <>
      <section className="hero wrap">
        <div>
          <p className="eyebrow">Structural Steel Detailer · Tekla Structures</p>
          <h1>{settings.heroLead} <em>{settings.heroAccent}</em></h1>
          <p className="intro">{settings.heroIntro}</p>
          <div className="actions">
            <a className="button" href="/contact">Request a Project Review <ArrowUpRight size={18} aria-hidden="true"/></a>
            <a className="textlink" href="/portfolio">View Project Experience ↗</a>
          </div>
          <p className="small hero-note">BASED IN DHAKA · INTERNATIONAL PROJECT SUPPORT</p>
        </div>
        {p?.code==='002'?<HeroVideoPlayer
          src={videoUrl}
          poster={p.cover}
          title={p.title}
          slug={p.slug}
        />:p?<a href={'/portfolio/'+p.slug} className="case-cover"><ProjectImage url={p.cover} alt={p.title+' structural model'} eager fetchPriority="high" sizes="(max-width: 900px) 92vw, 48vw"/></a>:null}
      </section>

      <div className="trust wrap">
        {['Tekla Structures','AutoCAD','Fabrication Documentation','Model Coordination','International Project Support'].map(x=>(
          <span key={x}>{x}</span>
        ))}
      </div>
    </>
  );
}

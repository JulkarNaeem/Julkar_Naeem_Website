import {notFound} from 'next/navigation';
import {config,projects,pageInfo,services,cloud} from '@/lib/content';
import {CTA,ServiceSection,Deliverables,ProcessSteps} from '@/components/site-sections';
import {PortfolioGrid,Gallery,Share,EnquiryForm,ProjectImage,AlternativeContactLinks} from '@/components/site-interactive';
import {ApprovedDrawingCrop} from '@/components/case-study-media';
type Props={params:Promise<{slug:string[]}>};
export function generateStaticParams(){return [...Object.keys(pageInfo).map(x=>({slug:[x]})),...projects.map(x=>({slug:['portfolio',x.slug]}))]}
export async function generateMetadata({params}:Props){const{slug}=await params;const path=slug.join('/');const project=slug[0]==='portfolio'&&slug.length===2?projects.find(x=>x.slug===slug[1]):undefined;const info=slug.length===1?pageInfo[path]:undefined;const title=project?.title||info?.title||'Page not found';const description=project?.summary||info?.description||'Find structural-steel detailing services and project experience.';const url=config.origin+'/'+path;return {title:title+' | Julkar Naeem',description,alternates:{canonical:url},openGraph:{title:title+' | Julkar Naeem',description,url,images:[project?cloud(project.cover,1200):config.origin+'/og.png']},twitter:{card:'summary_large_image' as const,title:title+' | Julkar Naeem',description,images:[project?cloud(project.cover,1200):config.origin+'/og.png']}}}
function Breadcrumb({items}:{items:{label:string,path:string}[]}){return <><nav className="breadcrumbs wrap" aria-label="Breadcrumb"><a href="/">Home</a>{items.map((x,i)=><span key={x.path}> / {i===items.length-1?<span aria-current="page">{x.label}</span>:<a href={x.path}>{x.label}</a>}</span>)}</nav><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[{label:'Home',path:'/'},...items].map((x,i)=>({'@type':'ListItem',position:i+1,name:x.label,item:config.origin+x.path}))})}}/></>}
function PageHead({eyebrow,title,text}:{eyebrow:string,title:string,text:string}){return <section className="page-head wrap"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="intro">{text}</p></section>}

export default async function Page({params}:Props){
  const{slug}=await params;
  const key=slug.join('/');
  const p=slug.length===2&&slug[0]==='portfolio'?projects.find(x=>x.slug===slug[1]):undefined;

  if(p){
    const index=projects.indexOf(p);
    const previous=projects[(index+projects.length-1)%projects.length];
    const next=projects[(index+1)%projects.length];

    return (
      <main>
        <Breadcrumb items={[{label:'Portfolio',path:'/portfolio'},{label:p.title,path:'/portfolio/'+p.slug}]}/>
        <section className="case-head wrap">
          <div>
            <p className="eyebrow">{p.type} / {p.category}</p>
            <h1>{p.title}</h1>
            <p className="intro">{p.summary}</p>
            <Share url={config.origin+'/portfolio/'+p.slug}/>
          </div>
          <figure className="case-cover">
            <ProjectImage url={p.cover} alt={p.title+' overall structural model view'} eager fetchPriority="high" sizes="(max-width: 900px) 92vw, 48vw"/>
            <figcaption>SELECTED MODEL VIEW · {p.category.toUpperCase()}</figcaption>
          </figure>
        </section>

        {/* 7-Section Structured Case Study */}
        <section className="section light">
          <div className="wrap case-body">
            {/* Section 2: Project at a Glance */}
            <aside className="case-glance-sidebar">
              <p className="eyebrow">PROJECT AT A GLANCE</p>
              <dl>
                {p.glance.map(([label,value])=>(
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <div className="confidential-aside-note">
                <strong>Confidentiality notice</strong>
                <p>Client identities and restricted shop, connection and erection drawings are protected. Project files are exchanged only through agreed commercial agreements.</p>
              </div>
            </aside>

            {/* Narrative Sections */}
            <div className="case-narrative">
              {/* Section 1: Project Overview */}
              <article className="case-block">
                <p className="eyebrow">01 / PROJECT OVERVIEW</p>
                <h2>{p.code==='001'?'Confirmed project scope and model context.':'Visible model geometry and detailing considerations.'}</h2>
                <p>{p.overview}</p>
              </article>

              {/* Section 3: Challenge / Constraint */}
              <article className="case-block">
                <p className="eyebrow">02 / CHALLENGE & CONSTRAINTS</p>
                <h3>Geometry, access and interfaces</h3>
                <p>{p.challenge}</p>
              </article>

              {/* Section 4: Detailing Approach */}
              <article className="case-block">
                <p className="eyebrow">03 / DETAILING APPROACH</p>
                <h3>Model coordination approach</h3>
                <p>{p.approach}</p>
                {p.code!=='001'&&(
                  <p className="editorial-note">
                    This is a model-based review of visible geometry and the detailing methodology it calls for. It does not assert an unverified project scope or client outcome.
                  </p>
                )}
              </article>

              {/* Section 5: Fabrication and Constructability Checks */}
              <article className="case-block">
                <p className="eyebrow">04 / FABRICATION & CONSTRUCTABILITY CHECKS</p>
                <h3>Practical checks guided by the model</h3>
                <p>{p.checks}</p>
                <ApprovedDrawingCrop/>
              </article>

              {/* Section 6: Deliverables */}
              <article className="case-block">
                <p className="eyebrow">05 / DELIVERABLES</p>
                <h3>{p.code==='001'?'Agreed Project Issue Package':'Typical Detailing Outputs'}</h3>
                {p.code==='001'?(
                  <ul className="case-deliverables-list">
                    {p.deliverables.map((item)=><li key={item}>{item}</li>)}
                  </ul>
                ):(
                  <p>The exact project deliverables are not publicly confirmed. Depending on an agreed scope, typical outputs for this type of steelwork may include a coordinated Tekla model, relevant drawings and material reports.</p>
                )}
              </article>

              {/* Section 7: Practical Takeaway */}
              <article className="case-block takeaway-block">
                <p className="eyebrow">06 / PRACTICAL TAKEAWAY</p>
                <h3>Fabrication-First Insight</h3>
                <blockquote className="takeaway-quote">
                  <p>{p.takeaway}</p>
                </blockquote>
              </article>
            </div>
          </div>
        </section>

        {/* Authentic Cloudinary Model Gallery */}
        <section className="section light gallery-section">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">MODEL GALLERY</p>
                <h2>Explore the authentic geometry.</h2>
              </div>
              <p>{p.images.length} verified 3D views. Select any image to inspect model details.</p>
            </div>
            <Gallery project={p}/>
            <p className="confidential">
              Only selected 3D screenshots and 3D drawings are shared here. Detailed fabrication, connection and erection drawing sheets remain private. Project files are shared only through agreed, authorised arrangements.
            </p>
          </div>
        </section>

        <section className="related wrap">
          <p className="eyebrow">RELATED DETAILING SUPPORT</p>
          <div>
            {services.filter((s,i)=>p.code==='005'?[0,4,5].includes(i):[0,1,3].includes(i)).map(s=>(
              <a href={'/services#'+s.id} key={s.id}>{s.title} ↗</a>
            ))}
          </div>
        </section>

        <CTA/>

        <nav className="case-nav wrap" aria-label="Other case studies">
          <a href={'/portfolio/'+previous.slug}>
            <span>← PREVIOUS PROJECT</span>
            {previous.title}
          </a>
          <a href={'/portfolio/'+next.slug}>
            <span>NEXT PROJECT →</span>
            {next.title}
          </a>
        </nav>
      </main>
    );
  }

  if(slug.length!==1||!pageInfo[key]) notFound();
  const info=pageInfo[key];

  return (
    <main>
      <Breadcrumb items={[{label:info.title,path:'/'+key}]}/>

      {key==='services' ? (
        <>
          <PageHead 
            eyebrow="STRUCTURAL STEEL DETAILING SERVICES" 
            title="Detailing that understands fabrication." 
            text="Tekla modelling, steel shop drawings and coordinated fabrication documentation for steel fabricators, engineering teams, PEB companies and industrial contractors."
          />
          <ServiceSection/>
          <Deliverables/>
          <section className="section light">
            <div className="wrap prose">
              <h2>Scope agreed. Information coordinated.</h2>
              <p>Support can cover PEB detailing, industrial steel detailing, multi-storey frames, platform and walkway detailing, stair detailing, handrails and grating. We agree the steelwork, deliverable package, required inputs and programme before starting.</p>
              <p>Connection detailing follows the approved engineering information. Missing requirements and conflicting instructions are raised with the responsible project team through RFIs.</p>
            </div>
          </section>
          <CTA/>
        </>
      ) : key==='portfolio' ? (
        <>
          <PageHead 
            eyebrow="SELECTED PROJECT EXPERIENCE" 
            title="Proof in the model." 
            text="Five structural-steel case studies. Explore the framing, interfaces and practical detailing considerations through authentic project views."
          />
          <section className="section light">
            <div className="wrap">
              <PortfolioGrid/>
              <p className="confidential">
                Public views are limited to selected 3D screenshots and 3D drawings. Client names and restricted technical drawing sheets are not displayed.
              </p>
            </div>
          </section>
          <CTA/>
        </>
      ) : key==='process' ? (
        <>
          <PageHead 
            eyebrow="WORKING PROCESS" 
            title="Good detailing starts before modelling." 
            text="A clear scope, a traceable RFI process and practical internal checks keep the model and its deliverables connected to the project information."
          />
          <section className="section light">
            <div className="wrap">
              <ProcessSteps/>
            </div>
          </section>
          <section className="section wrap split">
            <h2>Questions made visible.<br/>Revisions kept clear.</h2>
            <div>
              <p className="intro">Information gaps are recorded and raised with the responsible team. Drawing production follows the agreed requirements and current responses.</p>
              <p className="intro">At each issue, model references, drawing marks and revisions need to tell the same story. Internal checks support that consistency before delivery.</p>
            </div>
          </section>
          <CTA/>
        </>
      ) : key==='about' ? (
        <>
          <PageHead 
            eyebrow="ABOUT JULKAR NAEEM" 
            title="A practical view of the steel." 
            text={config.title}
          />
          <section className="section light">
            <div className="wrap about-page">
              <figure>
                <img 
                  src="/julkar-naeem-dp.webp" 
                  alt="Julkar Naeem, Senior Structural Steel Detailer" 
                  width={768} 
                  height={1024}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                />
                <figcaption>Julkar Naeem · Dhaka, Bangladesh</figcaption>
              </figure>
              <div className="prose">
                <p className="eyebrow">FABRICATION-DRIVEN STRUCTURAL STEEL DETAILER</p>
                <h2>The model is only part of the work.</h2>
                <p>I am Julkar Naeem, based in Dhaka, Bangladesh. I bring around nine years across steel, construction, production, QA and operations, with more than four years specifically focused on structural-steel detailing.</p>
                <p>My primary tools are Tekla Structures and AutoCAD. My experience covers PEB buildings, portal frames, industrial structures, multi-storey steel buildings, platforms, walkways, maintenance-access structures, stairs, handrails and grating.</p>
                <p>I focus on model coordination, connection detailing and fabrication documentation. Clear member orientation, practical access and readable drawings are central to how I approach a detailing package.</p>
                <a className="textlink" href="/credentials">View training & credentials ↗</a>
              </div>
            </div>
          </section>
          <section className="section wrap split">
            <h2>Support for fabricators<br/>& engineering teams.</h2>
            <div>
              <p className="intro">I welcome detailing-support conversations with fabricators, detailing companies, engineering firms, PEB companies and industrial-steel contractors in the USA, Canada, Australia, Europe and the Middle East.</p>
              <p className="intro">Project requirements, communication arrangements and delivery schedules are agreed for each scope.</p>
            </div>
          </section>
          <CTA/>
        </>
      ) : key==='credentials' ? (
        <>
          <PageHead 
            eyebrow="TRAINING & CREDENTIALS" 
            title="A foundation for practical detailing." 
            text="Focused training alongside hands-on experience in steel, fabrication documentation and model coordination."
          />
          <section className="section light">
            <div className="wrap credential-cards">
              <article>
                <span className="small">01 / DETAILER TRAINING</span>
                <h2>AISC Detailer<br/>Training Series</h2>
                <p>Training in structural-steel detailing, supporting a disciplined approach to fabrication information and drawing communication.</p>
              </article>
              <article>
                <span className="small">02 / SOFTWARE FUNDAMENTALS</span>
                <h2>Tekla Structures<br/>Steel Fundamentals</h2>
                <p>Training in Tekla Structures steel fundamentals, supporting practical model development and documentation workflows.</p>
              </article>
            </div>
            <div className="wrap prose credential-note">
              <p>These are training credentials. Project requirements and approved engineering information govern each detailing scope.</p>
              <a className="textlink" href="/portfolio">View Project Experience ↗</a>
            </div>
          </section>
          <CTA/>
        </>
      ) : key==='contact' ? (
        <>
          <PageHead 
            eyebrow="DISCUSS A PROJECT / SEND AN RFQ" 
            title="Let’s talk about your steelwork." 
            text="Share the scope, available information and expected schedule. We can then discuss the detailing support and deliverables your team needs."
          />
          <section className="section light">
            <div className="wrap contact-layout">
              <aside>
                <p className="eyebrow">REQUEST A PROJECT REVIEW</p>
                <h2>A clear brief is<br/>a useful start.</h2>
                <p>For fabricators, engineering firms, detailing companies and industrial-steel contractors.</p>
                <ul>
                  <li>What steelwork is included?</li>
                  <li>Which drawings and models are available?</li>
                  <li>What deliverables do you need?</li>
                  <li>When do you need the issue package?</li>
                </ul>
                <p className="contact-location">Dhaka, Bangladesh<br/>International project support</p>
                <AlternativeContactLinks />
              </aside>
              <EnquiryForm/>
            </div>
          </section>
        </>
      ) : (
        <>
          <PageHead 
            eyebrow="PRIVACY" 
            title="Your project information matters." 
            text="This notice explains how information submitted through the project-enquiry form is handled."
          />
          <section className="section light">
            <div className="wrap prose privacy">
              <h2>Information you provide</h2>
              <p>The enquiry form collects your name, company, business email, country, project details, requested services and any information you choose to include in your message. It also records your consent and the submission time.</p>
              <h2>Purpose and access</h2>
              <p>Information is used to respond to your enquiry, discuss your requirements and assess the proposed detailing scope. Enquiries are stored in the website’s hosted database. Submitted details are not displayed publicly.</p>
              <h2>Hosting and media</h2>
              <p>The website uses Sites hosting infrastructure and Cloudinary for portfolio images. These providers process the technical requests needed to serve the site and its media. Security controls may process limited request information to prevent abusive submissions.</p>
              <h2>Project confidentiality</h2>
              <p>Do not submit confidential drawings or information you are not authorised to share. Use access-controlled links and agree appropriate file-sharing arrangements before providing a detailed project package.</p>
              <h2>Retention and requests</h2>
              <p>Enquiry information should be retained only for the enquiry and any resulting project or necessary business records. To request correction or deletion, use the project-enquiry form with “Privacy request” in your message. Identity may need to be verified before a request is handled.</p>
              <h2>Cookies and analytics</h2>
              <p>No advertising trackers or marketing analytics have been added to this website. The hosting platform may use essential authentication or security mechanisms, including for private-preview access.</p>
              <h2>Contact</h2>
              <p>For questions about this notice, <a href="/contact">contact Julkar Naeem through the enquiry form</a>.</p>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

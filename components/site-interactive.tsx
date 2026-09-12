"use client";
import {useState,useEffect,useRef,useCallback} from 'react';
import {usePathname} from 'next/navigation';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {projects,cloud,services,deliverables,formats,config,type PortfolioProject} from '@/lib/content';
import {ArrowUpRight,Menu,X,ArrowLeft,ArrowRight,Expand,Copy,Check,ChevronDown,Mail,Play,Pause,ArrowUp} from 'lucide-react';
import {FaInstagram,FaLinkedin,FaUpwork,FaWhatsapp} from 'react-icons/fa6';






export function Header(){
  const [open,setOpen]=useState(false);
  const menuButtonRef=useRef<HTMLButtonElement>(null);

  useEffect(()=>{
    if(!open) return;
    const closeOnEscape=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown',closeOnEscape);
    return ()=>document.removeEventListener('keydown',closeOnEscape);
  },[open]);
  return (
      <header className="header wrap">
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
        <nav aria-label="Main navigation">
          <a href="/services">Services</a>
          <a href="/portfolio">Portfolio</a>
          <a href="/process">Process</a>
          <a href="/about">About</a>
          <a className="nav-cta" href="/contact">
            Request a Project Review <ArrowUpRight size={15} aria-hidden="true"/>
          </a>
        </nav>
        <button 
          ref={menuButtonRef}
          className="menu-toggle" 
          aria-label={open?'Close menu':'Open menu'} 
          aria-expanded={open} 
          aria-controls="mobile-nav" 
          onClick={()=>setOpen(!open)}
        >
          {open?<X aria-hidden="true"/>:<Menu aria-hidden="true"/>}
        </button>
        {open&&(
          <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">
            {['Services','Portfolio','Process','About','Credentials','Contact'].map(x=>(
              <a key={x} href={'/'+x.toLowerCase()} onClick={()=>setOpen(false)}>
                {x}<ArrowUpRight size={18} aria-hidden="true"/>
              </a>
            ))}
          </nav>
        )}
      </header>
  );
}

export function ProjectImage({
  url,
  alt,
  eager=false,
  fetchPriority,
  sizes="(max-width: 760px) 92vw, (max-width: 1100px) 48vw, 560px",
  width=1080,
  height=1080,
  className
}:{
  url:string;
  alt:string;
  eager?:boolean;
  fetchPriority?:'high'|'low'|'auto';
  sizes?:string;
  width?:number;
  height?:number;
  className?:string;
}){
  return (
    <img 
      src={cloud(url)} 
      srcSet={[480,800,1080,1400].map(w=>`${cloud(url,w)} ${w}w`).join(', ')} 
      sizes={sizes} 
      alt={alt} 
      loading={eager?'eager':'lazy'} 
      decoding={eager?'sync':'async'}
      fetchPriority={eager ? 'high' : (fetchPriority ?? 'auto')}
      width={width} 
      height={height}
      className={className}
    />
  );
}

export function ProjectCard({project:p,index=0}:{project:PortfolioProject,index?:number}){
  // Build a concise scope summary from project facts
  const scopeTag = [p.type, p.category].filter(Boolean).join(' · ');
  const keyFact = p.glance?.[2]?.[1] || p.glance?.[3]?.[1] || '';
  return (
    <a className="project-card" href={'/portfolio/'+p.slug}>
      <div className="project-image">
        <ProjectImage url={p.cover} alt={p.title+' — overall Tekla model showing '+p.facts[0][1].toLowerCase()}/>
        {/* 3. HOVER OVERLAY */}
        <div className="project-hover-overlay" aria-hidden="true">
          <span className="overlay-scope">{scopeTag}</span>
          <span className="overlay-title">{p.title}</span>
          {keyFact && <span className="overlay-fact">{keyFact}</span>}
          <span className="overlay-cta">View case study ↗</span>
        </div>
        <span className="project-open" aria-hidden="true"><ArrowUpRight size={22}/></span>
      </div>
      <div className="project-info">
        <div>
          <p className="small muted">{p.type} / {p.category}</p>
          <h3>{p.title}</h3>
        </div>
        <span className="project-index" aria-hidden="true">0{index+1}</span>
      </div>
    </a>
  );
}

export function PortfolioGrid({items=projects}:{items?:PortfolioProject[]}){
  const categories = ['All', ...Array.from(new Set(items.map(p => p.category)))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProjects = activeCategory === 'All'
    ? items
    : items.filter(p => p.category === activeCategory);

  return (
    <>
      <div className="category-chips-container" role="toolbar" aria-label="Portfolio category filter">
        <div className="category-chips">
          {categories.map(cat => {
            const count = cat === 'All' ? items.length : items.filter(p => p.category === cat).length;
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`category-chip ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={isSelected}
              >
                <span>{cat}</span>
                <span className="chip-count">({count})</span>
              </button>
            );
          })}
        </div>
        <p aria-live="polite" className="result-count">
          Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'}
        </p>
      </div>

      <div className="project-grid">
        {filteredProjects.map(p => (
          <ProjectCard key={p.code} project={p} index={items.indexOf(p)} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="empty">
          <h3>No projects in this category.</h3>
          <p>Select another category or reset to view all structural steel case studies.</p>
          <button type="button" className="button" onClick={() => setActiveCategory('All')}>
            Show all projects
          </button>
        </div>
      )}
    </>
  );
}

export function Gallery({project:p}:{project:PortfolioProject}){
  const[active,setActive]=useState<number|null>(null);
  const move=(delta:number)=>setActive(n=>n===null?null:(n+delta+p.images.length)%p.images.length);

  return (
    <>
      <div className="gallery-grid">
        {p.images.map((m,i)=>(
          <button 
            className="gallery-thumb" 
            key={m.name} 
            onClick={()=>setActive(i)} 
            aria-label={`Open ${p.title} image ${i+1}`}
          >
            <ProjectImage url={m.url} alt={`${p.title}: ${m.name.includes('3D-DRAWING')?'isometric 3D drawing':'Tekla model view'} ${i+1}`}/>
            <span>
              <span>VIEW {String(i+1).padStart(2,'0')} · {m.name.includes('3D-DRAWING')?'3D DRAWING':'TEKLA MODEL'}</span>
              <Expand size={17} aria-hidden="true"/>
            </span>
          </button>
        ))}
      </div>
      <Dialog open={active!==null} onOpenChange={open=>{if(!open)setActive(null)}}>
        <DialogContent 
          className="lightbox" 
          onKeyDown={e=>{
            if(e.key==='ArrowRight'){e.preventDefault();move(1)}
            if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}
          }}
        >
          <DialogTitle>{p.title}</DialogTitle>
          <DialogDescription>Use the arrow keys to change views. Escape closes the gallery.</DialogDescription>
          {active!==null&&<img src={cloud(p.images[active].url,2000)} alt={`${p.title}, enlarged model view ${active+1}`}/>}
          <div className="lightbox-controls">
            <button aria-label="Previous image" onClick={()=>move(-1)}><ArrowLeft aria-hidden="true"/></button>
            <span aria-live="polite">{(active??0)+1} / {p.images.length}</span>
            <button aria-label="Next image" onClick={()=>move(1)}><ArrowRight aria-hidden="true"/></button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function Share({url}:{url:string}){
  const[state,setState]=useState('Copy project link');
  return (
    <button 
      className="share" 
      onClick={async()=>{
        try{
          await navigator.clipboard.writeText(url);
          setState('Link copied');
        }catch{
          setState('Copy this address: '+url);
        }
      }}
    >
      {state==='Link copied'?<Check size={17} aria-hidden="true"/>:<Copy size={17} aria-hidden="true"/>}
      <span aria-live="polite">{state}</span>
    </button>
  );
}

export function AlternativeContactLinks(){
  const hasEmail = config.professionalEmails.length>0;
  const hasWhatsapp = Boolean(config.whatsapp && config.whatsappNumber);
  const hasSocials = config.socials && config.socials.length > 0;

  if (!hasEmail && !hasWhatsapp && !hasSocials) return null;

  return (
    <div className="alt-contact-links">
      <p className="small muted">DIRECT & ALTERNATIVE CONTACT</p>
      <div className="alt-contact-cards">
        {config.professionalEmails.map((email,index)=>(
          <a href={`mailto:${email}`} className="alt-contact-card" key={email}>
            <Mail size={18} aria-hidden="true" />
            <div>
              <strong>{index===0?'Project Email':'Direct Email'}</strong>
              <span>{email}</span>
            </div>
            <ArrowUpRight size={16} aria-hidden="true" className="alt-contact-icon" />
          </a>
        ))}
        {hasWhatsapp && (
          <a href={config.whatsapp} target="_blank" rel="noopener noreferrer" className="alt-contact-card">
            <FaWhatsapp size={20} aria-hidden="true" className="brand-contact-icon whatsapp-icon" />
            <div>
              <strong>WhatsApp</strong>
              <span>{config.whatsappNumber}</span>
            </div>
            <ArrowUpRight size={16} aria-hidden="true" className="alt-contact-icon" />
          </a>
        )}
        {hasSocials && config.socials.map(s => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="alt-contact-card">
            {s.name==='LinkedIn'?<FaLinkedin size={19} aria-hidden="true" className="brand-contact-icon linkedin-icon"/>:s.name==='Upwork'?<FaUpwork size={21} aria-hidden="true" className="brand-contact-icon upwork-icon"/>:<FaInstagram size={20} aria-hidden="true" className="brand-contact-icon instagram-icon"/>}
            <div>
              <strong>{s.name}</strong>
              <span>View {s.name} profile</span>
            </div>
            <ArrowUpRight size={16} aria-hidden="true" className="alt-contact-icon" />
          </a>
        ))}
      </div>
    </div>
  );
}

export function EnquiryForm(){
  const[status,setStatus]=useState('');
  const[pending,setPending]=useState(false);
  const[done,setDone]=useState(false);
  const[consent,setConsent]=useState(false);
  const[projectType,setProjectType]=useState('');
  const[detailsOpen,setDetailsOpen]=useState(()=>{
    if(typeof window==='undefined') return false;
    const params=new URLSearchParams(window.location.search);
    return params.get('intent')==='rfq' || Boolean(params.get('service'));
  });
  const[selectedServices,setSelectedServices]=useState<string[]>(()=>{
    if(typeof window==='undefined') return [];
    const params=new URLSearchParams(window.location.search);
    const serviceParam=params.get('service');
    if(serviceParam){
      const matched=services.find(s=>s.id===serviceParam);
      return matched ? [matched.title] : [];
    }
    return [];
  });
  const key=useRef('');

  useEffect(()=>{
    key.current=crypto.randomUUID();
  },[]);

  function toggleService(title:string){
    setSelectedServices(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  }

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form=e.currentTarget;

    if(!consent){
      setStatus('Please confirm consent before sending your enquiry.');
      return;
    }

    setPending(true);
    setStatus('');
    const f=new FormData(form);
    const data=Object.fromEntries(f);

    Object.assign(data,{
      services:f.getAll('services'),
      deliverables:f.getAll('deliverables'),
      formats:f.getAll('formats'),
      consent,
      projectType:projectType || (data.projectType as string) || '',
      submissionId:key.current
    });

    try{
      const r=await fetch('/api/enquiries',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
      });
      const result=await r.json() as {error?:string,reference:string};
      if(!r.ok)throw new Error(result.error||'Your enquiry could not be saved. Please try again.');
      setDone(true);
      setStatus('Your project enquiry has been received. Reference: '+result.reference+'. Julkar can use the business email you supplied to discuss the next steps.');
    }catch(error){
      setStatus(error instanceof Error?error.message:'Your enquiry could not be saved. Please try again.');
    }finally{
      setPending(false);
    }
  }

  return done ? (
    <div className="success" role="status">
      <Check size={32} aria-hidden="true"/>
      <h2>Thank you for the project brief.</h2>
      <p>{status}</p>
      <a className="button" href="/portfolio">View Project Experience</a>
    </div>
  ) : (
    <form onSubmit={submit} className="enquiry-form" noValidate={false}>
      <p className="form-note">Fields marked * are required. A concise project overview is enough to start.</p>

      {/* Initial short form fields */}
      <div className="form-grid">
        <label htmlFor="enquiry-name">
          Name *
          <input 
            id="enquiry-name" 
            name="name" 
            type="text" 
            required 
            maxLength={200} 
            autoComplete="name"
          />
        </label>
        <label htmlFor="enquiry-email">
          Business email *
          <input 
            id="enquiry-email" 
            name="email" 
            type="email" 
            required 
            maxLength={200} 
            autoComplete="email"
          />
        </label>
        <label htmlFor="enquiry-company">
          Company *
          <input 
            id="enquiry-company" 
            name="company" 
            type="text" 
            required 
            maxLength={200} 
            autoComplete="organization"
          />
        </label>
        <label htmlFor="enquiry-country">
          Country *
          <input 
            id="enquiry-country" 
            name="country" 
            type="text" 
            required 
            maxLength={200} 
            autoComplete="country-name"
          />
        </label>
        <label htmlFor="enquiry-message" className="full message-label">
          Project Description *
          <textarea 
            id="enquiry-message" 
            name="message" 
            required 
            minLength={20} 
            maxLength={6000} 
            rows={5} 
            placeholder="Tell me about the steelwork, structure type, available drawings, required support and any known coordination challenges (minimum 20 characters)."
          />
        </label>
        <label htmlFor="enquiry-file-link" className="full">
          Secure file-sharing link (optional)
          <input 
            id="enquiry-file-link" 
            name="fileLink" 
            type="url" 
            maxLength={1000} 
            placeholder="e.g. Dropbox, Google Drive, OneDrive or SharePoint link"
          />
        </label>
      </div>

      {/* Optional Collapsible Section: Add project details */}
      <details 
        className="project-details-collapsible" 
        open={detailsOpen} 
        onToggle={e => setDetailsOpen(e.currentTarget.open)}
      >
        <summary className="project-details-summary">
          <span className="summary-title">Add project details</span>
          <span className="summary-subtitle">Optional: Project type, scale, schedule, services, deliverables & formats</span>
          <ChevronDown className="summary-chevron" size={18} aria-hidden="true" />
        </summary>

        <div className="details-drawer">
          <div className="form-grid">
            <label htmlFor="enquiry-project-type" className="full">
              Project type
              <select 
                id="enquiry-project-type" 
                name="projectType" 
                value={projectType} 
                onChange={e => setProjectType(e.target.value)}
                className="native-select"
              >
                <option value="">Select a project type (optional)</option>
                <option value="PEB / portal frame">PEB / portal frame</option>
                <option value="Multi-storey steel">Multi-storey steel</option>
                <option value="Industrial structure">Industrial structure</option>
                <option value="Platform / walkway">Platform / walkway</option>
                <option value="Stairs / handrails">Stairs / handrails</option>
                <option value="Mixed or other steelwork">Mixed or other steelwork</option>
              </select>
            </label>

            <label htmlFor="enquiry-scale">
              Approximate project scale
              <input 
                id="enquiry-scale" 
                name="scale" 
                maxLength={300} 
                placeholder="Known area, steel tonnage or scope"
              />
            </label>

            <label htmlFor="enquiry-schedule">
              Expected schedule
              <input 
                id="enquiry-schedule" 
                name="schedule" 
                maxLength={300} 
                placeholder="Target start, issue dates or programme"
              />
            </label>
          </div>

          <fieldset className="form-fieldset">
            <legend>Required services</legend>
            <div className="check-options">
              {services.map(s => (
                <label key={s.id} htmlFor={`service-${s.id}`} className="touch-check-label">
                  <input 
                    type="checkbox" 
                    id={`service-${s.id}`} 
                    name="services" 
                    value={s.title}
                    checked={selectedServices.includes(s.title)}
                    onChange={() => toggleService(s.title)}
                    className="native-checkbox"
                  />
                  <span>{s.title}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="form-fieldset">
            <legend>Required deliverables</legend>
            <div className="check-options">
              {deliverables.map((item, i) => (
                <label key={item} htmlFor={`deliv-${i}`} className="touch-check-label">
                  <input 
                    type="checkbox" 
                    id={`deliv-${i}`} 
                    name="deliverables" 
                    value={item}
                    className="native-checkbox"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="form-fieldset">
            <legend>Required file formats</legend>
            <div className="check-options">
              {formats.map((fmt, i) => (
                <label key={fmt} htmlFor={`fmt-${i}`} className="touch-check-label">
                  <input 
                    type="checkbox" 
                    id={`fmt-${i}`} 
                    name="formats" 
                    value={fmt}
                    className="native-checkbox"
                  />
                  <span>{fmt}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </details>

      <div className="file-note">
        <strong>Project confidentiality & file exchange</strong>
        <p>Use access-controlled links for drawings and models. Share only materials you are authorised to provide. Full confidential packages can be exchanged after scope alignment.</p>
      </div>

      {/* Fully inaccessible spam honeypot for screen readers and keyboard navigation */}
      <div 
        aria-hidden="true" 
        style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
      >
        <label htmlFor="hp-website-field">
          Website (leave blank)
          <input 
            id="hp-website-field" 
            name="website" 
            tabIndex={-1} 
            autoComplete="off" 
            aria-hidden="true"
          />
        </label>
      </div>

      {/* Accessible semantic consent checkbox */}
      <div className="consent-container">
        <label htmlFor="enquiry-consent" className="consent touch-check-label">
          <input 
            type="checkbox" 
            id="enquiry-consent" 
            name="consent" 
            required 
            checked={consent} 
            onChange={e => setConsent(e.target.checked)}
            className="native-checkbox"
            aria-describedby={status ? 'form-status' : undefined}
          />
          <span>
            I agree that Julkar Naeem may use this information to respond to my project enquiry, as explained in the <a href="/privacy">Privacy notice</a>. *
          </span>
        </label>
      </div>

      {status && (
        <p role="status" aria-live="polite" id="form-status" className="form-status">
          {status}
        </p>
      )}

      <button className="button" type="submit" disabled={pending}>
        {pending ? 'Sending enquiry…' : 'Request a Project Review'}
        <ArrowUpRight size={18} aria-hidden="true"/>
      </button>

      <p className="form-note">
        Submitting this form begins a scope and schedule discussion. Project acceptance and delivery dates are confirmed separately.
      </p>
    </form>
  );
}

/* ─── 4. SVG BLUEPRINT DRAW-IN ─────────────────────────────────── */
export function BlueprintDivider(){
  const ref=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const el=ref.current;
    if(!el) return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      el.classList.add('is-visible');
      return;
    }
    const observer=new IntersectionObserver(([entry])=>{
      if(entry.isIntersecting){
        el.classList.add('is-visible');
        observer.disconnect();
      }
    },{threshold:0.3});
    observer.observe(el);
    return ()=>observer.disconnect();
  },[]);

  return (
    <div className="blueprint-divider wrap" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 900 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Structural cross-brace / truss node SVG — ivory lines on transparent */}
        <line x1="0" y1="40" x2="900" y2="40" stroke="#c8d2d8" strokeWidth="0.75" style={{'--dash-len':'900'} as React.CSSProperties}/>
        <polyline points="80,40 150,10 220,40 150,70 80,40" stroke="#d4af37" strokeWidth="1.2" style={{'--dash-len':'280'} as React.CSSProperties}/>
        <polyline points="340,40 410,10 480,40 410,70 340,40" stroke="#8a9aa4" strokeWidth="0.9" style={{'--dash-len':'280'} as React.CSSProperties}/>
        <polyline points="600,40 670,10 740,40 670,70 600,40" stroke="#d4af37" strokeWidth="1.2" style={{'--dash-len':'280'} as React.CSSProperties}/>
        <line x1="150" y1="10" x2="410" y2="10" stroke="#c8d2d8" strokeWidth="0.75" style={{'--dash-len':'260'} as React.CSSProperties}/>
        <line x1="150" y1="70" x2="410" y2="70" stroke="#c8d2d8" strokeWidth="0.75" style={{'--dash-len':'260'} as React.CSSProperties}/>
        <line x1="410" y1="10" x2="670" y2="10" stroke="#c8d2d8" strokeWidth="0.75" style={{'--dash-len':'260'} as React.CSSProperties}/>
        <line x1="410" y1="70" x2="670" y2="70" stroke="#c8d2d8" strokeWidth="0.75" style={{'--dash-len':'260'} as React.CSSProperties}/>
      </svg>
    </div>
  );
}

/* ─── 2. STICKY MOBILE CTA BAR ─────────────────────────────────── */
export function MobileCTABar(){
  const pathname=usePathname();
  // Hide on contact page — form is already there
  const hidden=pathname==='/contact';
  return (
    <div className={`mobile-cta-bar${hidden?' hidden':''}`} aria-hidden={hidden}>
      <a className="button" href="/contact">
        Request a Project Review <ArrowUpRight size={16} aria-hidden="true"/>
      </a>
    </div>
  );
}

/* ─── 5. NAV SIDE-DRAWER CONTACT PANEL ─────────────────────────── */
export function QuickContactDrawer({open,onClose}:{open:boolean,onClose:()=>void}){
  const [status,setStatus]=useState('');
  const [pending,setPending]=useState(false);
  const [done,setDone]=useState(false);
  const [consent,setConsent]=useState(false);
  const drawerRef=useRef<HTMLElement>(null);
  const key=useRef('');

  useEffect(()=>{ key.current=crypto.randomUUID(); },[]);

  // Focus trap: move focus into drawer when opened
  useEffect(()=>{
    if(open && drawerRef.current){
      const first=drawerRef.current.querySelector<HTMLElement>('button,input,textarea,select,a[href]');
      first?.focus();
    }
  },[open]);

  // Close on Escape
  const onKeyDown=useCallback((e:KeyboardEvent)=>{
    if(e.key==='Escape') onClose();
  },[onClose]);

  useEffect(()=>{
    if(open) document.addEventListener('keydown',onKeyDown);
    else document.removeEventListener('keydown',onKeyDown);
    return ()=>document.removeEventListener('keydown',onKeyDown);
  },[open,onKeyDown]);

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(!consent){ setStatus('Please confirm consent before sending.'); return; }
    setPending(true);
    setStatus('');
    const f=new FormData(e.currentTarget);
    const data=Object.fromEntries(f);
    Object.assign(data,{consent,submissionId:key.current,projectType:'Mixed or other steelwork'});
    try{
      const r=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      const result=await r.json() as {error?:string,reference:string};
      if(!r.ok) throw new Error(result.error||'Could not send enquiry.');
      setDone(true);
      setStatus('Received. Reference: '+result.reference);
    }catch(err){
      setStatus(err instanceof Error?err.message:'Could not send. Please try again.');
    }finally{
      setPending(false);
    }
  }

  if(!open && !done) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`quick-drawer-backdrop${open?' open':''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        className={`quick-drawer${open?' open':''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Quick project enquiry"
      >
        <div className="quick-drawer-header">
          <h2>Request a Project Review</h2>
          <button className="quick-drawer-close" onClick={onClose} aria-label="Close enquiry panel">
            <X size={18} aria-hidden="true"/>
          </button>
        </div>

        <div className="quick-drawer-body">
          {done ? (
            <div className="success" role="status" style={{background:'#172630',border:'1px solid #3a6040',color:'#c8d8cc'}}>
              <Check size={28} aria-hidden="true"/>
              <h2 style={{fontSize:'1.15rem',margin:'16px 0 8px',color:'#f3f1e9'}}>Enquiry received.</h2>
              <p style={{fontSize:'13.5px',color:'#8a9aa4'}}>{status}</p>
              <a className="button" href="/contact" style={{marginTop:'16px',display:'inline-flex'}}>
                Full project brief form ↗
              </a>
            </div>
          ) : (
            <form onSubmit={submit} noValidate={false}>
              <p className="form-note">A concise description is enough to start. For a full brief, use the contact page.</p>
              <div className="form-grid">
                <label htmlFor="qdrawer-name">
                  Name *
                  <input id="qdrawer-name" name="name" type="text" required maxLength={200} autoComplete="name"/>
                </label>
                <label htmlFor="qdrawer-email">
                  Business email *
                  <input id="qdrawer-email" name="email" type="email" required maxLength={200} autoComplete="email"/>
                </label>
                <label htmlFor="qdrawer-company">
                  Company *
                  <input id="qdrawer-company" name="company" type="text" required maxLength={200} autoComplete="organization"/>
                </label>
                <label htmlFor="qdrawer-country">
                  Country *
                  <input id="qdrawer-country" name="country" type="text" required maxLength={200} autoComplete="country-name"/>
                </label>
              </div>
              <label htmlFor="qdrawer-message" className="message-label" style={{fontSize:'14px',display:'block',marginTop:'14px'}}>
                Project description *
                <textarea
                  id="qdrawer-message"
                  name="message"
                  required
                  minLength={20}
                  maxLength={6000}
                  rows={4}
                  placeholder="Briefly describe the steelwork, structure type, and required support (min. 20 characters)."
                />
              </label>
              <div className="consent-container">
                <label htmlFor="qdrawer-consent" className="consent touch-check-label">
                  <input
                    type="checkbox"
                    id="qdrawer-consent"
                    checked={consent}
                    onChange={e=>setConsent(e.target.checked)}
                    className="native-checkbox"
                    required
                  />
                  <span>I agree Julkar Naeem may use this information to respond, per the <a href="/privacy" onClick={onClose}>Privacy notice</a>. *</span>
                </label>
              </div>
              {status&&<p role="status" aria-live="polite" className="form-status">{status}</p>}
              <button className="button" type="submit" disabled={pending}>
                {pending?'Sending…':'Send project brief'} <ArrowUpRight size={16} aria-hidden="true"/>
              </button>
            </form>
          )}
        </div>

        <div className="quick-drawer-footer">
          Need a full brief? <a href="/contact" onClick={onClose}>Use the detailed contact form ↗</a>
        </div>
      </aside>
    </>
  );
}

/* ─── 6. HERO VIDEO PLAYER ─────────────────────────────────────── */
export function HeroVideoPlayer({
  src,
  poster,
  title,
  slug,
}:{
  src:string;
  poster:string;
  title:string;
  slug:string;
}){
  const videoRef=useRef<HTMLVideoElement>(null);
  const [isPlaying,setIsPlaying]=useState(false);
  const [hasStarted,setHasStarted]=useState(false);
  const [flashAction,setFlashAction]=useState<'play'|'pause'|null>(null);
  const [flashKey,setFlashKey]=useState(0);
  const flashTimer=useRef<NodeJS.Timeout|null>(null);

  const togglePlay=()=>{
    if(!videoRef.current) return;

    if(flashTimer.current) clearTimeout(flashTimer.current);

    if(!hasStarted){
      videoRef.current.src=src;
      videoRef.current.load();
      videoRef.current.play().catch(()=>setIsPlaying(false));
      setIsPlaying(true);
      setHasStarted(true);
      setFlashAction('play');
      setFlashKey(k=>k+1);
      flashTimer.current=setTimeout(()=>setFlashAction(null),450);
    } else if(videoRef.current.paused){
      videoRef.current.play().catch(()=>{});
      setIsPlaying(true);
      setHasStarted(true);
      setFlashAction('play');
      setFlashKey(k=>k+1);
      flashTimer.current=setTimeout(()=>setFlashAction(null), 450);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      setFlashAction('pause');
      setFlashKey(k=>k+1);
      flashTimer.current=setTimeout(()=>setFlashAction(null), 450);
    }
  };

  useEffect(()=>{
    return ()=>{
      if(flashTimer.current) clearTimeout(flashTimer.current);
    };
  },[]);

  return (
    <div className="hero-visual">
      <div className="drawing-label">MODEL STUDY / MULTI-STOREY STRUCTURAL STEEL</div>
      <button
        type="button"
        className={`hero-video-container ${isPlaying ? 'is-playing' : 'is-paused'}`}
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause video' : (hasStarted ? 'Resume video' : 'Play 3D model video')}
      >
        {!hasStarted&&(
          <ProjectImage
            url={poster}
            alt={`${title} Tekla model video poster`}
            eager
            fetchPriority="high"
            sizes="(max-width: 900px) 92vw, 48vw"
            width={1080}
            height={1080}
            className="hero-video-poster"
          />
        )}
        <video
          ref={videoRef}
          playsInline
          loop
          preload="metadata"
          onPlay={()=>{setIsPlaying(true); setHasStarted(true);}}
          onPause={()=>setIsPlaying(false)}
          className={`hero-video${hasStarted?' is-loaded':''}`}
          aria-label={`${title} Tekla model animation`}
        />

        {/* Center action badge for Play and Resume */}
        <div className={`video-center-badge ${isPlaying ? 'hidden' : 'visible'}`}>
          <div className="video-badge-content">
            <span className="video-badge-icon">
              <Play size={18} aria-hidden="true" fill="currentColor"/>
            </span>
            <span className="video-badge-text">
              {hasStarted ? 'Resume' : 'Play 3D Model'}
            </span>
          </div>
        </div>

        {/* Transient flash ripple on toggle */}
        {flashAction && (
          <div className={`video-flash-ripple flash-${flashAction}`} key={flashKey}>
            {flashAction==='play' ? (
              <Play size={28} fill="currentColor" aria-hidden="true"/>
            ) : (
              <Pause size={28} fill="currentColor" aria-hidden="true"/>
            )}
          </div>
        )}

      </button>
      <div className="hero-caption">
        <span>{title}</span>
        <a href={'/portfolio/'+slug} className="hero-explore-link">Explore the model ↗</a>
      </div>
    </div>
  );
}

/* ─── Back to Top Button ─────────────────────────────────────── */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <ArrowUp size={20} strokeWidth={2.4} aria-hidden="true" />
    </button>
  );
}

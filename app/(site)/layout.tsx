import {Header, BackToTop} from '@/components/site-interactive';
import {Footer} from '@/components/site-sections';
import {getPublishedContent} from '@/lib/managed-content';
import {contactConfig} from '@/lib/cms-model';

export default async function SiteLayout({children}:{children:React.ReactNode}){
  const config=contactConfig((await getPublishedContent()).settings);
  const structuredData={'@context':'https://schema.org','@type':'ProfessionalService',name:'Julkar Naeem',url:'https://julkarnaeem.com',description:'Structural-steel detailing, Tekla modelling and fabrication documentation.',address:{'@type':'PostalAddress',addressLocality:'Dhaka',addressCountry:'BD'},areaServed:['United States','Canada','Australia','Europe','Middle East'],...(config.professionalEmail?{email:config.professionalEmail}:{}),sameAs:[config.linkedInUrl,config.upworkUrl,config.instagramUrl].filter(Boolean),hasOfferCatalog:{'@type':'OfferCatalog',name:'Structural-steel detailing services',itemListElement:['Tekla 3D modelling','Shop and fabrication drawings','GA and erection drawings','Connection detailing','Stair and handrail detailing','MTO and BOM reports'].map(name=>({'@type':'Offer',itemOffered:{'@type':'Service',name}}))}};
  return <><a className="skip" href="#content">Skip to content</a><Header/><div id="content">{children}</div><Footer/><BackToTop/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structuredData).replace(/</g,'\\u003c')}}/></>;
}

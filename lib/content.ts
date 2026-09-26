import media from './media.json';
const professionalEmails=['contact@julkarnaeem.com','julkarnaeem.me@gmail.com'];
const professionalEmail=professionalEmails[0];
const linkedInUrl=process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim()||'https://www.linkedin.com/in/julkarnaeem/';
const whatsappNumber='+8801739411586';
const upworkUrl='https://www.upwork.com/freelancers/~018c36d510164a2e73';
const instagramUrl='https://www.instagram.com/julkarnaeem.me/';
export const config={
  name:'Julkar Naeem',
  title:'Senior Structural Steel Detailer / Detailing Engineer',
  origin:'https://julkarnaeem.com',
  professionalEmail,
  professionalEmails,
  linkedInUrl,
  whatsappNumber,
  upworkUrl,
  instagramUrl,
  email:professionalEmail,
  phone:'',
  whatsapp:'https://wa.me/8801739411586',
  socials:[{name:'LinkedIn',url:linkedInUrl},{name:'Upwork',url:upworkUrl},{name:'Instagram',url:instagramUrl}] as {name:string,url:string}[]
};
export const services=[
{id:'tekla-modelling',title:'Tekla 3D modelling',text:'Coordinated structural-steel models with clear member orientation, levels and interfaces before drawing production.',image:'tekla'},
{id:'fabrication-drawings',title:'Shop & fabrication drawings',text:'Assembly and single-part drawings that communicate how each piece is cut, welded, bolted and assembled.',image:'shop'},
{id:'erection-drawings',title:'GA & erection drawings',text:'Clear member identification, dimensions and levels to support site coordination and the erection sequence.',image:'ga'},
{id:'connection-detailing',title:'Connection detailing',text:'Translate approved connection requirements into legible model and drawing details, with access and tool clearance in mind.',image:'connection'},
{id:'miscellaneous-steel',title:'Stairs, handrails & miscellaneous steel',text:'Practical stair detailing, platform and walkway detailing, handrails and grating coordinated with surrounding steel.',image:'stairs'},
{id:'material-reports',title:'MTO & BOM reporting',text:'Organised material quantities, bolt lists and agreed production files drawn from the coordinated model.',image:'mto'}];
export {deliverables,formats} from './form-options';
export const checks=['Fabrication access','Welding access','Bolt installation and tightening access','Tool clearance','Member orientation','Clashes','Erection feasibility','Dimensions and levels','Drawing clarity','Missing or conflicting information'];
export const steps=[['Review project information','Read the supplied engineering drawings, specifications and revision history.'],['Confirm scope and deliverables','Agree the steelwork included, drawing requirements, file formats and programme.'],['Identify missing or conflicting information','Check dimensions, levels, member references and interfaces before assumptions become modelled details.'],['Raise RFIs','Record focused questions and track responses from the responsible project team.'],['Build and coordinate the Tekla model','Develop the model against the agreed information and coordinate member geometry and interfaces.'],['Review fabrication and erection practicality','Examine access, orientation, clashes and the practical sequence of assembly.'],['Produce drawings and reports','Prepare agreed fabrication documentation, erection information and material reports.'],['Complete internal checks','Review the model, drawing clarity, dimensions, marks and issue consistency.'],['Issue deliverables and manage revisions','Issue the agreed package and maintain clear revision records as project information changes.']];
export const homepagePhases = [
  {
    step: '01',
    title: 'Review',
    text: 'Examine supplied engineering drawings, specifications and scope. Identify missing dimensions, levels and interfaces before modelling starts.'
  },
  {
    step: '02',
    title: 'Coordinate',
    text: 'Build the 3D Tekla model against agreed information, coordinate member geometry, and raise focused RFIs to confirm unclear requirements.'
  },
  {
    step: '03',
    title: 'Detail and Check',
    text: 'Detail connections with tool clearance and welding access in mind. Perform internal checks across marks, dimensions, member orientation and clashes.'
  },
  {
    step: '04',
    title: 'Issue and Revise',
    text: 'Deliver agreed fabrication drawings, erection plans, MTO reports and CNC/IFC data. Maintain disciplined revision records as changes occur.'
  }
];
const seeds=[
{
  code:'001',
  slug:'poolside-restaurant-shed',
  title:'Poolside Restaurant Shed',
  type:'Commercial',
  category:'PEB & portal frames',
  summary:'A single-storey pre-engineered steel restaurant shed beside a resort swimming pool in Inani, Cox’s Bazar. The recorded scope covers 384.615 m² and 17 t of structural steel.',
  overview:'The main PEB frame for this poolside restaurant shed was modelled in Tekla Structures 2025. The project record confirms steel detailing for fabrication and erection, connection detailing, and coordinated model and drawing outputs.',
  glance:[
    ['Building type','PEB commercial building'],
    ['Location','Inani, Cox’s Bazar, Bangladesh'],
    ['Area','384.615 m² (approximately 4,140 ft²)'],
    ['Steel quantity','17 t'],
    ['Year','2026'],
    ['Software','Tekla Structures 2025'],
    ['Detailer role','Structural-steel detailing'],
    ['Scope','Main structural steelwork'],
    ['Standards recorded','BNBC and AISC']
  ],
  challenge:'The detailing review focused on fabrication access, bolt-tightening access, member orientation and clear erection information around the main structural steelwork.',
  approach:'The main frame geometry was coordinated in Tekla Structures, with practical attention to member orientation, access and how the model information would be communicated in the drawings.',
  checks:'The review considered fabrication access, welding access, bolt installation and tightening access, tool clearance, member orientation, clashes and erection-drawing clarity.',
  deliverables:[
    'Coordinated 3D Tekla model',
    'Erection drawings',
    'Shop drawings',
    'Connection details'
  ],
  takeaway:'A coordinated model needs equally clear fabrication and erection information. Reviewing member orientation, tool clearance and access early helps reduce avoidable fabrication or erection questions.',
  facts:[['Building type','PEB commercial building'],['Location','Inani, Cox’s Bazar, Bangladesh'],['Area','384.615 m²'],['Steel quantity','17 t'],['Software','Tekla Structures 2025']],
  hero:'3D-SCREENSHOT-02'
},
{
  code:'002',
  slug:'multi-storey-steel-frame',
  title:'Multi-storey Office Extension',
  type:'Institutional',
  category:'Multi-storey steel frame',
  summary:'A three-storey government office extension with a stair, mezzanine and shed, coordinated across two building portions in Khilgaon, Dhaka. Recorded scale: 942 m² and 75 t of steel.',
  overview:'The office extension combines a stair, mezzanine floor and shed in a narrow, complex space across two building portions. Its recorded scope includes the main structure, building extension and stair.',
  glance:[
    ['Building type','Government office extension'],
    ['Location','Khilgaon, Dhaka, Bangladesh'],
    ['Floors','3'],
    ['Area','942 m²'],
    ['Steel quantity','75 t'],
    ['Year','2025'],
    ['Software','Tekla Structures 2025'],
    ['Scope','Main structure, extension and stair']
  ],
  challenge:'The narrow site and the relationship between two building portions, stair, mezzanine and shed create several geometry and access interfaces.',
  approach:'The recorded project description identifies a coordinated multi-storey steel frame. The public views show how the extension framing, stair and mezzanine relate within the constrained space.',
  checks:'These interfaces call for careful review of floor levels, stair clearances, member orientation, connections and drawing clarity against approved information.',
  deliverables:[],
  takeaway:'A coordinated model makes the junctions between the extension, mezzanine and stair easier to review before fabrication information is issued.',
  facts:[['Location','Khilgaon, Dhaka, Bangladesh'],['Floors','3'],['Area','942 m²'],['Steel quantity','75 t'],['Software','Tekla Structures 2025']],
  hero:'3D-SCREENSHOT-01'
},
{
  code:'003',
  slug:'braced-multi-storey-building',
  title:'Six-storey Government Head Office',
  type:'Institutional',
  category:'Multi-storey steel frame',
  summary:'A six-storey government head office with a lift core, stair, shear-wall interfaces, bracing and mezzanine in Dhaka. Recorded scale: 1,462 m² and 200 t of steel.',
  overview:'The recorded main-structure scope includes a six-storey steel frame with a lift core, stair, shear-wall interfaces, bracing and mezzanine. The model views show how these systems meet across the building.',
  glance:[
    ['Building type','Government head office'],
    ['Location','Dhaka, Bangladesh'],
    ['Floors','6'],
    ['Area','1,462 m²'],
    ['Steel quantity','200 t'],
    ['Year','2024'],
    ['Software','Tekla Structures 2020'],
    ['Scope','Main structural steelwork']
  ],
  challenge:'The lift core, stair, shear-wall interfaces, bracing and mezzanine create crowded junctions across six storeys.',
  approach:'The public model views establish the relationship between the main frame, bracing and vertical circulation while keeping the recorded scope at the main structure.',
  checks:'These interfaces call for review of brace connections, stair and core clearances, member orientation, levels and drawing coordination.',
  deliverables:[],
  takeaway:'Viewing the stair, core and bracing together helps reveal coordination questions at the interfaces between structural systems.',
  facts:[['Location','Dhaka, Bangladesh'],['Floors','6'],['Area','1,462 m²'],['Steel quantity','200 t'],['Software','Tekla Structures 2020']],
  hero:'3D-SCREENSHOT-01'
},
{
  code:'004',
  slug:'industrial-portal-frame-building',
  title:'Industrial Chemical Storage Building',
  type:'Industrial',
  category:'PEB & portal frames',
  summary:'An industrial chemical storage building in Gazipur with a tapered extension shed, internal mezzanine and canopy. Recorded scale: two floors, 5,000 m² and 300 t of steel.',
  overview:'The recorded project is a PEB industrial chemical storage shed with a tapered extension shed, internal mezzanine floor and canopy. The main structure covers a recorded 5,000 m² and 300 t of steel.',
  glance:[
    ['Building type','Industrial chemical storage'],
    ['Location','Gazipur, Dhaka, Bangladesh'],
    ['Floors','2'],
    ['Area','5,000 m²'],
    ['Steel quantity','300 t'],
    ['Year','2026'],
    ['Software','Tekla Structures 2025'],
    ['Scope','Main structural steelwork']
  ],
  challenge:'The tapered extension, mezzanine and canopy introduce local geometry and support interfaces around the main PEB frame.',
  approach:'The public views show the main structure and its extension, mezzanine and canopy together so their framing relationships can be reviewed in context.',
  checks:'These features call for review of the extension transition, mezzanine supports, canopy connections, member orientation and dimensional clarity.',
  deliverables:[],
  takeaway:'Reviewing the main frame alongside the tapered extension and mezzanine highlights where local support details need coordination.',
  facts:[['Location','Gazipur, Dhaka, Bangladesh'],['Floors','2'],['Area','5,000 m²'],['Steel quantity','300 t'],['Software','Tekla Structures 2025']],
  hero:'3D-SCREENSHOT-02'
},
{
  code:'005',
  slug:'maintenance-walkway-caged-ladders',
  title:'Maintenance Walkway with Caged Ladder',
  type:'Access steel',
  category:'Platforms & walkways',
  summary:'Maintenance-access steelwork in Chattogram comprising a walkway, caged ladder and handrails. Recorded scale: 35 m² and 4.4 t of steel.',
  overview:'The recorded scope covers a maintenance walkway, handrails and stair/access steel, with a caged ladder visible in the public model views. The steelwork covers 35 m² and 4.4 t.',
  glance:[
    ['Building type','Industrial access steel'],
    ['Location','Chattogram, Bangladesh'],
    ['Area','35 m²'],
    ['Steel quantity','4.4 t'],
    ['Year','2023'],
    ['Software','Tekla Structures 2020'],
    ['Scope','Walkway, handrail and stair/access steel']
  ],
  challenge:'Walkway framing, handrails, support steel and the caged-ladder access point create connected access and support interfaces.',
  approach:'The public views follow the maintenance route and show how the walkway, handrails and ladder meet their supporting frame.',
  checks:'These interfaces call for review of access clearances, handrail continuity, support orientation, bolt access and drawing clarity.',
  deliverables:[],
  takeaway:'Tracing the access route through the model helps reveal geometry and coordination questions at ladders, turns and handrail interfaces.',
  facts:[['Location','Chattogram, Bangladesh'],['Area','35 m²'],['Steel quantity','4.4 t'],['Software','Tekla Structures 2020']],
  hero:'3D-SCREENSHOT-01'
},
{
  code:'006',
  slug:'hong-kong-flyover-steel-support',
  title:'Hong Kong Flyover Steel Support Structure',
  type:'Infrastructure',
  category:'Braced support structures',
  summary:'A flyover support structure in Hong Kong, China, with a braced main frame, platform and supporting steelwork. The recorded project covers 110 m² and approximately 70 t of structural steel.',
  overview:'This international steel-detailing project used Tekla Structures 2020 for a flyover support structure. The recorded scope includes the main braced frame, platform and supporting steelwork. All connections were specified as site-welded, requiring close coordination with the structural engineers.',
  glance:[
    ['Facility type','Infrastructure'],
    ['Location','Hong Kong, China'],
    ['Area','110 m²'],
    ['Steel quantity','Approximately 70 t'],
    ['Year','2023'],
    ['Software','Tekla Structures 2020'],
    ['Structural system','Braced frame'],
    ['Scope','Main structure, platform and support structure'],
    ['Connection requirement','Site-welded connections'],
    ['Standard recorded','AISC']
  ],
  challenge:'The site-welded connection requirement made coordination between the supporting frame and the structural engineers central to the detailing work.',
  approach:'The main braced frame, platform and supporting steelwork were detailed in Tekla Structures 2020. Connection requirements were resolved through technical collaboration with the structural engineers.',
  checks:'The recorded coordination focused on the site-welded connections and how the platform and supporting steelwork meet the main braced frame.',
  deliverables:[],
  takeaway:'For a site-welded support structure, connection requirements and frame geometry need to be coordinated together before the detailing is issued.',
  facts:[['Location','Hong Kong, China'],['Area','110 m²'],['Steel quantity','Approximately 70 t'],['Year','2023'],['Software','Tekla Structures 2020']],
  hero:'3D-SCREENSHOT-01'
}
];
export const projects=seeds.map(p=>({...p,images:media.filter(m=>m.name.startsWith('JN-PRJ-'+p.code)).sort((a,b)=>a.name.localeCompare(b.name)),cover:media.find(m=>m.name==='JN-PRJ-'+p.code+'-'+p.hero)!.url}));
export type PortfolioProject=(typeof projects)[number]&{scopeVerified?:boolean;deliverablesVerified?:boolean};
export {cloud,cloudVideoPoster,isCloudinaryImage} from './cloudinary';
export const pageInfo:Record<string,{title:string,description:string}>={services:{title:'Structural Steel Detailing Services',description:'Tekla steel detailing, steel shop drawings, erection drawings, connection detailing and material reporting for fabrication teams.'},portfolio:{title:'Steel Detailing Project Experience',description:'Explore six structural-steel modelling case studies: PEB framing, multi-storey structures, infrastructure, industrial steel and maintenance walkways.'},process:{title:'The Steel Detailing Process',description:'From project review and RFIs to Tekla model coordination, fabrication checks, drawing issue and revision management.'},about:{title:'About Julkar Naeem',description:'Senior Structural Steel Detailer based in Dhaka, with experience across steel, construction, production, QA and operations.'},credentials:{title:'Training & Credentials',description:'AISC Detailer Training Series and Tekla Structures Steel Fundamentals, supporting practical structural-steel detailing.'},contact:{title:'Request a Project Review',description:'Discuss Tekla modelling, fabrication drawings and structural-steel detailing support. Send your scope, deliverables and schedule.'},privacy:{title:'Privacy',description:'How project enquiries and contact information are handled on the Julkar Naeem structural-steel detailing website.'}};

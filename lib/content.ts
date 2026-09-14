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
export const deliverables=['3D Tekla models','GA drawings','Assembly drawings','Single-part drawings','Shop and fabrication drawings','Erection drawings','Anchor-bolt plans','Connection details','Bolt lists','MTO and BOM reports'];
export const formats=['NC','CNC','DXF','DWG','IFC'];
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
  summary:'A single-storey PEB restaurant shed beside a resort swimming pool in Bangladesh. Main structural steelwork was modelled in Tekla Structures 2025, with fabrication and erection documentation.',
  overview:'A single-storey PEB commercial shed beside a resort swimming pool in Bangladesh. The confirmed detailing scope covered the main structural steelwork, modelled in Tekla Structures 2025.',
  glance:[
    ['Building type','PEB commercial building'],
    ['Location','Bangladesh'],
    ['Area','Approximately 385 m²'],
    ['Steel quantity','Approximately 17 tonnes'],
    ['Software','Tekla Structures 2025'],
    ['Detailer role','Structural-steel detailing'],
    ['Scope','Main structural steelwork']
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
  facts:[['Building type','PEB commercial building'],['Location','Bangladesh'],['Area','Approximately 385 m²'],['Steel quantity','Approximately 17 tonnes'],['Software','Tekla Structures 2025']],
  hero:'3D-SCREENSHOT-02'
},
{
  code:'002',
  slug:'multi-storey-steel-frame',
  title:'Multi-storey Steel Frame',
  type:'Multi-storey',
  category:'Beam & column frames',
  summary:'A multi-level beam-and-column model with repeated floor framing and a pitched roof. The open model views make the relationship between primary members and secondary framing easy to examine.',
  overview:'The public model views show a multi-level beam-and-column steel frame with repeated floor framing and a pitched roof. They allow the relationship between the vertical frame, floor members and roof geometry to be reviewed together.',
  glance:[
    ['Visible structure','Multi-level beam-and-column frame'],
    ['Roof form','Pitched steel roof framing'],
    ['Framing system','Repeated floor beam bays'],
    ['Model environment','Tekla Structures']
  ],
  challenge:'Repeated floor bays and the transition to sloping roof framing create visible coordination points across levels, member lines and changes in geometry.',
  approach:'A practical detailing approach would review representative bays and compare repeated conditions while keeping levels, member orientation and roof transitions clear in the model.',
  checks:'The visible geometry calls for attention to floor-to-floor alignment, repeated framing interfaces, member orientation, roof transitions, access and drawing clarity.',
  deliverables:[],
  takeaway:'A bay-by-bay model review supports consistent member references and clear level information before drawings are prepared. The exact project deliverables are not publicly confirmed.',
  facts:[['Visible structure','Multi-level beam-and-column frame'],['Roof form','Pitched steel roof framing']],
  hero:'3D-SCREENSHOT-01'
},
{
  code:'003',
  slug:'braced-multi-storey-building',
  title:'Braced Multi-storey Steel Building',
  type:'Multi-storey',
  category:'Braced frames',
  summary:'A multi-storey steel model with repeated floor framing, diagonal bracing and internal stairs. The overall view brings the vertical circulation and bracing interfaces into the same coordination picture.',
  overview:'The public model views show a multi-storey steel frame with repeated floor framing, diagonal bracing and internal stairs. These visible elements create several interfaces that need to remain clear in the coordinated model.',
  glance:[
    ['Visible structure','Braced multi-storey frame'],
    ['Visible elements','Floor beams, diagonal bracing and stairs'],
    ['Model environment','Tekla Structures']
  ],
  challenge:'The visible intersections between floor framing, diagonal bracing, columns and internal stairs create areas where geometry and access need careful coordination.',
  approach:'Overall model views can establish alignment, while closer model review can help identify crowded interfaces, member orientation issues and information that may need clarification.',
  checks:'The visible model suggests checking brace and floor-frame interfaces, stair clearances, member orientation, clashes, access and consistency of dimensions and levels.',
  deliverables:[],
  takeaway:'Local 3D review of crowded interfaces helps identify coordination questions before fabrication information is prepared. The exact project deliverables are not publicly confirmed.',
  facts:[['Visible structure','Braced multi-storey frame'],['Visible elements','Floor beams, diagonal bracing and stairs']],
  hero:'3D-SCREENSHOT-01'
},
{
  code:'004',
  slug:'industrial-portal-frame-building',
  title:'Industrial Portal-frame Building',
  type:'Industrial',
  category:'PEB & portal frames',
  summary:'A rectangular industrial building model with a pitched roof and smaller entrance canopies. Model views allow the primary steel arrangement and secondary roof and wall members to be explored together.',
  overview:'The public model views show a rectangular industrial steel building with a pitched roof, secondary roof and wall members, and smaller entrance canopies around the perimeter.',
  glance:[
    ['Visible structure','Pitched-roof industrial building'],
    ['Visible interfaces','Main building and entrance canopies'],
    ['Secondary systems','Roof purlins and wall girts'],
    ['Model environment','Tekla Structures']
  ],
  challenge:'The visible primary frame, secondary members and entrance canopies create repeating bays together with local perimeter conditions that need coordinated geometry.',
  approach:'A practical model review can establish the main frame geometry first, then examine secondary framing, canopy interfaces and perimeter member orientation against the supplied project information.',
  checks:'The visible geometry suggests checking main-frame and secondary-member interfaces, canopy access, member orientation, alignment, clashes and dimensional clarity.',
  deliverables:[],
  takeaway:'Separating the review of repeated main frames from local canopy interfaces supports clear coordination. The exact project deliverables are not publicly confirmed.',
  facts:[['Visible structure','Pitched-roof industrial building'],['Visible interfaces','Main building and entrance canopies']],
  hero:'3D-SCREENSHOT-02'
},
{
  code:'005',
  slug:'maintenance-walkway-caged-ladders',
  title:'Maintenance Walkway & Caged Ladders',
  type:'Access steel',
  category:'Platforms & walkways',
  summary:'An elevated access walkway model with a change in direction, handrails, support steel and caged ladders. The views highlight the relationship between the access route and its supporting frame.',
  overview:'The public model views show an elevated maintenance walkway with changes in direction, handrails, support steel and caged ladders. The views make the relationship between the access route and supporting frame visible.',
  glance:[
    ['Visible structure','Elevated maintenance walkway'],
    ['Visible elements','Handrails, support steel and caged ladders'],
    ['Model environment','Tekla Structures']
  ],
  challenge:'Changes in direction and the visible interfaces among walkway framing, handrails, support steel and caged ladders require close geometric coordination.',
  approach:'A practical model review can follow the visible access route through ladders, platforms and corners to examine continuity, support orientation, interfaces and potential clashes.',
  checks:'The visible geometry suggests checking access clearances, handrail continuity, walkway and support interfaces, member orientation, bolt access, clashes and drawing clarity against approved information.',
  deliverables:[],
  takeaway:'Following the access route through the model helps reveal geometric and coordination questions before fabrication information is prepared. The exact project deliverables are not publicly confirmed.',
  facts:[['Visible structure','Elevated maintenance walkway'],['Visible elements','Handrails, support steel and caged ladders']],
  hero:'3D-SCREENSHOT-01'
}
];
export const projects=seeds.map(p=>({...p,images:media.filter(m=>m.name.startsWith('JN-PRJ-'+p.code)).sort((a,b)=>a.name.localeCompare(b.name)),cover:media.find(m=>m.name==='JN-PRJ-'+p.code+'-'+p.hero)!.url}));
export type PortfolioProject=(typeof projects)[number]&{scopeVerified?:boolean;deliverablesVerified?:boolean};
export const cloud=(url:string,width=1200)=>url.replace('f_auto,q_auto',`f_auto,q_auto,c_limit,w_${width}`);
export const pageInfo:Record<string,{title:string,description:string}>={services:{title:'Structural Steel Detailing Services',description:'Tekla steel detailing, steel shop drawings, erection drawings, connection detailing and material reporting for fabrication teams.'},portfolio:{title:'Steel Detailing Project Experience',description:'Explore five structural-steel modelling case studies: PEB framing, multi-storey structures, industrial steel and maintenance walkways.'},process:{title:'The Steel Detailing Process',description:'From project review and RFIs to Tekla model coordination, fabrication checks, drawing issue and revision management.'},about:{title:'About Julkar Naeem',description:'Senior Structural Steel Detailer based in Dhaka, with experience across steel, construction, production, QA and operations.'},credentials:{title:'Training & Credentials',description:'AISC Detailer Training Series and Tekla Structures Steel Fundamentals, supporting practical structural-steel detailing.'},contact:{title:'Request a Project Review',description:'Discuss Tekla modelling, fabrication drawings and structural-steel detailing support. Send your scope, deliverables and schedule.'},privacy:{title:'Privacy',description:'How project enquiries and contact information are handled on the Julkar Naeem structural-steel detailing website.'}};

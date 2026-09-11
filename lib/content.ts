import media from './media.json';
export const config={name:'Julkar Naeem',title:'Senior Structural Steel Detailer / Detailing Engineer',origin:'https://julkarnaeem.com',email:'',phone:'',whatsapp:'',socials:[] as {name:string,url:string}[]};
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
  overview:'A single-storey PEB commercial shed structure situated adjacent to a resort swimming pool in Bangladesh. The detailing scope covered the main structural steel frame, modelled accurately in Tekla Structures 2025 with complete fabrication and erection documentation.',
  glance:[
    ['Building type','PEB commercial building'],
    ['Location','Bangladesh'],
    ['Area','Approximately 385 m²'],
    ['Steel quantity','Approximately 17 tonnes'],
    ['Software','Tekla Structures 2025'],
    ['Detailer role','Structural-steel detailing'],
    ['Scope','Main structural steelwork']
  ],
  challenge:'Ensuring adequate fabrication access, bolt-tightening clearance around tapered portal frame connections, and verifying unambiguous member orientation so site erection teams assemble without confusion.',
  approach:'A practical bay-by-bay review tracing the primary portal frame from foundation anchor interfaces to eaves and ridge joints, verifying connection clearances before translating geometry into clear erection views.',
  checks:'Checked fabrication access, welding access, bolt installation and tightening clearance, tool clearances, member orientation, clash verification between primary frame and secondary elements, anchor-bolt layout, and drawing clarity.',
  deliverables:[
    'Coordinated 3D Tekla model',
    'General arrangement (GA) and erection drawings',
    'Shop assembly and single-part fabrication drawings',
    'Connection detail sheets',
    'Anchor-bolt plans and bolt lists',
    'Material quantity takeoffs (MTO / BOM)'
  ],
  takeaway:'A coordinated model must translate into equally clear erection documentation. Verifying member orientation, tool clearance and joint access early prevents costly site delays during erection.',
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
  overview:'A multi-level beam-and-column steel frame model featuring repetitive floor framing grids topped with a pitched structural roof. Model views allow clear inspection of primary column-to-beam connectivity and secondary framing transitions.',
  glance:[
    ['Visible structure','Multi-level beam-and-column frame'],
    ['Roof form','Pitched steel roof framing'],
    ['Framing system','Repeated floor beam bays'],
    ['Model environment','Tekla Structures']
  ],
  challenge:'Coordinating floor-to-floor member alignment, maintaining repetitive beam interface consistency across levels, and managing the geometric transition between orthogonal floor beams and sloping roof framing.',
  approach:'Review one framing bay in rigorous detail to establish baseline tolerances, then compare repeated conditions across the model to ensure consistent member references and level offsets before drawing production.',
  checks:'Verified column splice alignment, beam-to-column tool clearances, floor level tolerances, bolt tightening access, member orientation, and drawing clarity against design information.',
  deliverables:[
    'Coordinated 3D Tekla structural model views',
    'Floor framing GA drawings',
    'Standardized beam-to-column connection details',
    'Assembly and single-part fabrication drawings',
    'Bolt lists and material summary reports'
  ],
  takeaway:'Bay-by-bay interface review prevents repetitive errors across multiple floors and guarantees consistent member marks and clear level references before shop drawing issue.',
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
  overview:'A multi-storey steel frame structure incorporating vertical diagonal bracing systems for lateral stability alongside integrated internal egress stairs and repeated composite floor framing.',
  glance:[
    ['Visible structure','Braced multi-storey frame'],
    ['Visible elements','Floor beams, diagonal bracing and stairs'],
    ['Lateral system','Vertical diagonal bracing'],
    ['Model environment','Tekla Structures']
  ],
  challenge:'Congested framing nodes where vertical diagonal braces, primary floor beams, columns, and internal stair stringers converge, demanding meticulous tool clearance and erection sequence checks.',
  approach:'Combine overall structural framing views to maintain global alignment with isolated node studies at congested interfaces to track clearances, gusset geometry, and RFI queries with the structural engineering team.',
  checks:'Gusset plate welding and bolting access, brace work point alignment, stair stringer connection clearances, member orientation, clash avoidance, and RFI tracking for conflicting dimensions.',
  deliverables:[
    'Coordinated 3D Tekla model',
    'Bracing elevations and framing GA drawings',
    'Stair layout and stair stringer fabrication details',
    'Bracing connection details and gusset plate drawings',
    'Bill of materials and bolt reports'
  ],
  takeaway:'Congested multi-member joints demand localized 3D verification and proactive RFI documentation early to ensure erection feasibility on site.',
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
  overview:'A large-span industrial building model with pitched portal frames, secondary roof and wall cladding support members, and cantilevered entrance canopies integrated into the building perimeter.',
  glance:[
    ['Visible structure','Pitched-roof industrial building'],
    ['Visible interfaces','Main building and entrance canopies'],
    ['Secondary systems','Roof purlins and wall girts'],
    ['Model environment','Tekla Structures']
  ],
  challenge:'Harmonizing primary clear-span portal frame geometry with secondary purlins, girts, and entrance canopies while maintaining consistent cladding line references and fastener clearances.',
  approach:'Hierarchical detailing approach: coordinate the primary frames and anchor layouts first, followed by secondary framing, canopy tie-backs, and perimeter member orientations to maintain clear repetitive bay spacing.',
  checks:'Portal knee and ridge connection fit-up, purlin/girt cleat clearances, canopy connection access, member orientation, cladding line alignment, and dimensional checks against engineering drawings.',
  deliverables:[
    'Coordinated 3D Tekla model',
    'Roof and wall framing GA plans',
    'Portal frame assembly shop drawings',
    'Canopy framing and connection details',
    'Purlin/girt schedules and MTO reports'
  ],
  takeaway:'Separating primary frame coordination from secondary canopy interfaces ensures repetitive bays remain standardized while local perimeter conditions receive focused detailing attention.',
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
  overview:'An elevated industrial access platform and walkway system featuring directional changes, continuous handrails, kick-plates, structural support framing, and safety-caged vertical access ladders.',
  glance:[
    ['Visible structure','Elevated maintenance walkway'],
    ['Visible elements','Handrails, support steel and caged ladders'],
    ['Safety features','Caged ladders and continuous handrails'],
    ['Model environment','Tekla Structures']
  ],
  challenge:'Maintaining required safety and human-access clearances, handrail continuity around direction changes, safety cage hoops, and ensuring practical bolt access for field assembly onto supporting structures.',
  approach:'Walk-through detailing methodology: follow the operational access path from grade up the caged ladder, across walkway platforms, and through corners to check grating boundaries, support orientation, and splice locations.',
  checks:'Ladder cage climb clearances and hoop spacing, handrail continuity and height, kick-plate fit-up, grating panel spans, bolt installation and tightening clearance, and erection practicality.',
  deliverables:[
    'Coordinated 3D Tekla model',
    'Platform GA plans and elevation views',
    'Caged ladder fabrication assembly drawings',
    'Handrail, kick-plate and walkway shop drawings',
    'Grating layout schedules and bolt lists'
  ],
  takeaway:'Miscellaneous steel detailing succeeds on ergonomic and safety checks: following the actual maintenance path in the model reveals interface issues before fabrication.',
  facts:[['Visible structure','Elevated maintenance walkway'],['Visible elements','Handrails, support steel and caged ladders']],
  hero:'3D-SCREENSHOT-01'
}
];
export const projects=seeds.map(p=>({...p,images:media.filter(m=>m.name.startsWith('JN-PRJ-'+p.code)).sort((a,b)=>a.name.localeCompare(b.name)),cover:media.find(m=>m.name==='JN-PRJ-'+p.code+'-'+p.hero)!.url}));
export const cloud=(url:string,width=1200)=>url.replace('f_auto,q_auto',`f_auto,q_auto,c_limit,w_${width}`);
export const pageInfo:Record<string,{title:string,description:string}>={services:{title:'Structural Steel Detailing Services',description:'Tekla steel detailing, steel shop drawings, erection drawings, connection detailing and material reporting for fabrication teams.'},portfolio:{title:'Steel Detailing Project Experience',description:'Explore five structural-steel modelling case studies: PEB framing, multi-storey structures, industrial steel and maintenance walkways.'},process:{title:'The Steel Detailing Process',description:'From project review and RFIs to Tekla model coordination, fabrication checks, drawing issue and revision management.'},about:{title:'About Julkar Naeem',description:'Senior Structural Steel Detailer based in Dhaka, with experience across steel, construction, production, QA and operations.'},credentials:{title:'Training & Credentials',description:'AISC Detailer Training Series and Tekla Structures Steel Fundamentals, supporting practical structural-steel detailing.'},contact:{title:'Request a Project Review',description:'Discuss Tekla modelling, fabrication drawings and structural-steel detailing support. Send your scope, deliverables and schedule.'},privacy:{title:'Privacy',description:'How project enquiries and contact information are handled on the Julkar Naeem structural-steel detailing website.'}};

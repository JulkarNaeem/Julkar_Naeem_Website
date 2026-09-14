import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const base='http://localhost:5173';
const env=readFileSync('.env.local','utf8');
assert.match(env,/CMS_LOCAL_STORE=1/);
assert.doesNotMatch(env,/^DATABASE_URL=\S/m,'Integration checks require the isolated local store.');
const password=readFileSync('.local-data/admin-access.txt','utf8').match(/^Password: (.+)$/m)[1].trim();
let cookie='';let checks=0;
async function request(path,method='GET',body,origin=base,authenticated=true){
 return fetch(base+path,{method,headers:{Origin:origin,...(authenticated?{Cookie:cookie}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
}
function check(actual,expected,name){assert.equal(actual,expected,name);checks++;console.log('PASS '+name)}
check((await request('/api/admin/content')).status,401,'unauthenticated content is private');
check((await request('/api/admin/enquiries')).status,401,'unauthenticated enquiries are private');
check((await request('/api/admin/session','POST',{password},'https://untrusted.example')).status,403,'cross-origin login rejected');
check((await request('/api/admin/session','POST',{password:'wrong'})).status,401,'incorrect password rejected');
const login=await request('/api/admin/session','POST',{password});
check(login.status,200,'owner login');
const header=login.headers.get('set-cookie');assert.match(header,/HttpOnly/i);assert.match(header,/SameSite=strict/i);cookie=header.split(';')[0];
check((await request('/api/admin/password','POST',{currentPassword:'wrong',newPassword:'new-valid-password-123',confirmPassword:'new-valid-password-123'},base,false)).status,401,'unauthenticated password change rejected');
check((await request('/api/admin/password','POST',{currentPassword:'wrong',newPassword:'new-valid-password-123'},'https://untrusted.example')).status,403,'cross-origin password change rejected');
check((await request('/api/admin/password','POST',{currentPassword:'wrong',newPassword:'new-valid-password-123',confirmPassword:'new-valid-password-123'})).status,400,'wrong current password rejected');
check((await request('/api/admin/password','POST',{currentPassword:password,newPassword:'short',confirmPassword:'short'})).status,400,'short new password rejected');
check((await request('/api/admin/password','POST',{currentPassword:password,newPassword:'new-valid-password-123',confirmPassword:'different'})).status,400,'mismatched new password rejected');
check((await request('/api/admin/password','POST',{currentPassword:password,newPassword:password,confirmPassword:password})).status,400,'identical new password rejected');
const pwdChange=await request('/api/admin/password','POST',{currentPassword:password,newPassword:'temporary-pass-456',confirmPassword:'temporary-pass-456'});
check(pwdChange.status,200,'valid password change');
const newCookie=pwdChange.headers.get('set-cookie')?.split(';')[0];
if(newCookie)cookie=newCookie;
const pwdRestore=await request('/api/admin/password','POST',{currentPassword:'temporary-pass-456',newPassword:password,confirmPassword:password});
check(pwdRestore.status,200,'original password restored');
const restoredCookie=pwdRestore.headers.get('set-cookie')?.split(';')[0];
if(restoredCookie)cookie=restoredCookie;
let state=await (await request('/api/admin/content')).json();const original=structuredClone(state);
const put=(document,publish=false,revision=state.revision)=>request('/api/admin/content','PUT',{document,publish,revision});
try{
 check(state.draft.projects.length,5,'all five repository projects available');
 const anyMedia=structuredClone(state.draft);anyMedia.projects[0].images.push({name:'Video-sample',url:'https://res.cloudinary.com/julkarnaeem/video/upload/sample.mp4'});
 let savedMedia=await put(anyMedia);check(savedMedia.status,200,'any type of image and video allowed');state=await savedMedia.json();
 const invalidMedia=structuredClone(state.draft);invalidMedia.projects[0].images[0].url='javascript:alert(1)';
 check((await put(invalidMedia)).status,400,'invalid media url rejected');
 const unapproved=structuredClone(state.draft);unapproved.projects[0].approved=false;
 check((await put(unapproved,true)).status,400,'publication without permission rejected');
 const changedSlug=structuredClone(state.draft);changedSlug.projects[0].slug='changed-existing-route';
 check((await put(changedSlug)).status,400,'existing project routes protected');
 check((await request('/api/admin/content','PUT',{document:state.draft,revision:state.revision,publish:false},'https://untrusted.example')).status,403,'cross-origin content mutation rejected');
 const edited=structuredClone(state.draft);edited.settings.heroIntro+=' Local verification marker.';
 let saved=await put(edited);check(saved.status,200,'draft save');state=await saved.json();
 check(state.published.settings.heroIntro,original.published.settings.heroIntro,'draft leaves published snapshot unchanged');
 check((await(await fetch(base)).text()).includes('Local verification marker.'),false,'private draft absent from public HTML');
 check((await put(edited,false,state.revision-1)).status,409,'stale edit rejected');
 const draftOnly={...structuredClone(edited.projects[0]),code:'006',slug:'private-verification-draft',title:'',summary:'',overview:'',approved:false,visibility:'draft',images:[],cover:''};
 edited.projects.push(draftOnly);
 saved=await put(edited);check(saved.status,200,'incomplete new project can be saved privately');state=await saved.json();
 check((await fetch(base+'/portfolio/private-verification-draft')).status,404,'draft project route is not public');
 saved=await put(edited,true);check(saved.status,200,'approved snapshot can be published');state=await saved.json();
 check((await(await fetch(base)).text()).includes('Local verification marker.'),true,'published change reaches public page');
 check((await(await fetch(base+'/sitemap.xml')).text()).includes('private-verification-draft'),false,'private draft excluded from sitemap');
 const archived=structuredClone(state.draft);for(const project of archived.projects)if(project.visibility==='published')project.visibility='archived';
 saved=await put(archived,true);check(saved.status,200,'projects can be archived');state=await saved.json();
 const emptyHome=await fetch(base);check(emptyHome.status,200,'homepage works with an empty public portfolio');
 check((await emptyHome.text()).includes('JN-PRJ-002-Multi-storey-Steel-Frame.mp4'),false,'archived hero video is not exposed');
}finally{
 state=await(await request('/api/admin/content')).json();
 const restored=await put(original.published,true);check(restored.status,200,'original public content restored');state=await restored.json();
 if(JSON.stringify(original.draft)!==JSON.stringify(original.published)){const saved=await put(original.draft);check(saved.status,200,'original draft restored');}
}
check((await request('/api/admin/session','DELETE')).status,200,'owner logout');
console.log(`${checks} control-panel integration checks passed. No enquiry was submitted.`);

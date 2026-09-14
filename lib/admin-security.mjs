import { createHmac, timingSafeEqual, scryptSync, randomBytes } from "node:crypto";
export const cookieName = "jn_admin_session";
export function passwordHash(password,salt=randomBytes(16).toString("hex")) {
  return salt+":"+scryptSync(password,salt,64).toString("hex");
}
export function passwordMatches(password,hash) {
  if(typeof password!=="string"||password.length>256||typeof hash!=="string")return false;
  const [salt,expected]=hash.split(":");
  if(!salt||!expected||!/^[a-f0-9]{128}$/i.test(expected))return false;
  const actual=scryptSync(password,salt,64);
  return timingSafeEqual(actual,Buffer.from(expected,"hex"));
}
export function signSession(secret,hash,now=Date.now()){
  const payload=Buffer.from(JSON.stringify({exp:now+8*60*60*1000,nonce:randomBytes(24).toString("hex")})).toString("base64url");
  return payload+"."+createHmac("sha256",secret+hash).update(payload).digest("base64url");
}
export function verifySession(token,secret,hash,now=Date.now()){
  if(!token||!secret||secret.length<32||!hash||token.length>1000)return false;
  try{
    const [payload,signature,...rest]=token.split(".");
    if(rest.length||!payload||!signature)return false;
    const expected=createHmac("sha256",secret+hash).update(payload).digest();
    const actual=Buffer.from(signature,"base64url");
    if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return false;
    const data=JSON.parse(Buffer.from(payload,"base64url").toString());
    return Number.isFinite(data.exp)&&data.exp>now&&data.exp<=now+8*60*60*1000&&typeof data.nonce==="string";
  }catch{return false}
}


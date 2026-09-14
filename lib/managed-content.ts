import { cache } from "react";
import { initialDocument } from "./cms-model";
import { readCMS,storageReady } from "./cms-store";
export const getPublishedContent=cache(async()=>{
  if(!storageReady())return initialDocument;
  try{return (await readCMS()).published}
  catch(error){console.error("Website content unavailable; using repository content.",error instanceof Error?error.name:"Database error");return initialDocument}
});


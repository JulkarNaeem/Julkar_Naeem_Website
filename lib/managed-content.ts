import { cache } from "react";
import { unstable_cache } from "next/cache";
import { initialDocument } from "./cms-model";
import { readCMS,storageReady } from "./cms-store";
export const publishedContentTag="website-published-content";
const readPublishedContent=unstable_cache(async()=> (await readCMS()).published,["website-published-content"],{tags:[publishedContentTag],revalidate:60});
export const getPublishedContent=cache(async()=>{
  if(!storageReady())return initialDocument;
  try{return await readPublishedContent()}
  catch(error){console.error("Website content unavailable; using repository content.",error instanceof Error?error.name:"Database error");return initialDocument}
});


import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.0";
const db=createClient("https://wgmitkwpxfpivwtnfhlg.supabase.co","sb_publishable_FWlyszb9Zqa-t1CUqXBj6w_8jQUQzbl");
const form=document.getElementById("submit-form"),msg=document.getElementById("submit-message");
if(form&&msg){form.addEventListener("submit",async e=>{
 e.preventDefault();
 const button=form.querySelector('button[type="submit"]'),originalLabel=button.textContent;
 const f=new FormData(form);
 const tags=String(f.get("tags")||"").split(",").map(x=>x.trim()).filter(Boolean).slice(0,12);
 const source_urls=String(f.get("source_urls")||"").split(/\r?\n/).map(x=>x.trim()).filter(x=>/^https?:\/\//i.test(x)).slice(0,20);
 const payload={title:String(f.get("title")||"").trim(),author_name:String(f.get("author_name")||"").trim(),author_email:String(f.get("author_email")||"").trim(),excerpt:String(f.get("excerpt")||"").trim(),tags,article_text:String(f.get("article_text")||"").trim(),source_urls,cover_image:String(f.get("cover_image")||"").trim(),cover_video:String(f.get("cover_video")||"").trim(),cover_alt:String(f.get("cover_alt")||"").trim(),status:"pending"};
 button.disabled=true;button.textContent="Sending…";msg.textContent="Submitting your article for editorial review…";
 try{
  const {error}=await db.from("article_submissions").insert(payload);
  if(error){msg.textContent="Could not submit your article: "+error.message;return}
  form.reset();msg.textContent="Thank you for contributing. Your article has been received for editorial review. We will review it before publication.";
 }catch(error){msg.textContent="The submission could not be completed. Check your internet connection and try again."}
 finally{button.disabled=false;button.textContent=originalLabel}
});}

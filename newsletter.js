import {createClient} from "https://esm.sh/@supabase/supabase-js@2.57.0";
const db=createClient("https://wgmitkwpxfpivwtnfhlg.supabase.co","sb_publishable_FWlyszb9Zqa-t1CUqXBj6w_8jQUQzbl");
const form=document.getElementById("newsletter-form");
if(form){form.addEventListener("submit",async e=>{
 e.preventDefault();
 const message=document.getElementById("newsletter-message");
 const email=document.getElementById("newsletter-email").value.trim().toLowerCase();
 const first_name=document.getElementById("newsletter-name").value.trim().replace(/\s+/g," ").slice(0,80);
 const consent=document.getElementById("newsletter-consent").checked;
 if(document.getElementById("newsletter-website").value){message.textContent="Thank you.";return}
 if(!consent){message.textContent="Please confirm your consent.";return}
 message.textContent="Saving your subscription…";
 const {error}=await db.from("newsletter_subscribers").insert({email,first_name:first_name||null,consent:true,source:location.pathname.includes("blog")?"article":"website"});
 if(error){message.textContent=error.code==="23505"?"This email is already on the subscriber list.":"We could not save your subscription. Please try again later.";return}
 form.reset();
 message.textContent="You are subscribed. Thank you for joining the Kastine Augak publication list. New editions will also be available in the free online archive.";
});}

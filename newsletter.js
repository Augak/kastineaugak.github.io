import {createClient} from "https://esm.sh/@supabase/supabase-js@2.57.0";
const db=createClient("https://wgmitkwpxfpivwtnfhlg.supabase.co","sb_publishable_FWlyszb9Zqa-t1CUqXBj6w_8jQUQzbl");
const form=document.getElementById("newsletter-form");
if(form){form.addEventListener("submit",async e=>{
 e.preventDefault();
 const message=document.getElementById("newsletter-message");
 const emailField=document.getElementById("newsletter-email");
 const nameField=document.getElementById("newsletter-name");
 const consentField=document.getElementById("newsletter-consent");
 const trapField=document.getElementById("newsletter-website");
 const button=form.querySelector('button[type="submit"]');
 const email=emailField?.value.trim().toLowerCase()||"";
 const first_name=(nameField?.value||"").trim().replace(/\s+/g," ").slice(0,80);
 if(trapField?.value){message.textContent="Thank you.";return}
 if(!email){message.textContent="Please enter a valid email address.";emailField?.focus();return}
 if(!consentField?.checked){message.textContent="Please confirm that you agree to receive publication updates.";return}
 button.disabled=true;
 const originalLabel=button.textContent;
 button.textContent="Subscribing…";
 message.textContent="Saving your subscription securely…";
 try{
  const {error}=await db.from("newsletter_subscribers").insert({email,first_name:first_name||null,consent:true,source:location.pathname.includes("blog")?"article":"website"});
  if(error){
   message.textContent=error.code==="23505"?"This email is already on the subscriber list.":"We could not save your subscription: "+error.message;
   return;
  }
  form.reset();
  message.textContent="You are subscribed. Thank you for joining the Kastine Augak publication list. New editions will also be available in the free online archive.";
 }catch(error){
  message.textContent="The subscription request could not be completed. Check your internet connection and try again.";
 }finally{
  button.disabled=false;
  button.textContent=originalLabel;
 }
});}

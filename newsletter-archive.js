import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.0/+esm";
const db=createClient("https://wgmitkwpxfpivwtnfhlg.supabase.co","sb_publishable_FWlyszb9Zqa-t1CUqXBj6w_8jQUQzbl");
const root=document.getElementById("newsletter-archive-list");
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const date=v=>{const d=new Date(v);return Number.isNaN(d.getTime())?"":new Intl.DateTimeFormat("en",{day:"numeric",month:"long",year:"numeric"}).format(d)};
const {data,error}=await db.from("newsletter_campaigns").select("title,subject,preheader,html_content,slug,published_at,created_at").in("status",["published","sent"]).order("published_at",{ascending:false}).limit(100);
if(error){root.innerHTML='<p class="blog-empty">The archive is temporarily unavailable. Please refresh in a moment.</p>'}
else if(!data?.length){root.innerHTML='<p class="blog-empty">The first newsletter edition is being prepared. Please check back soon.</p>'}
else{root.innerHTML=data.map(c=>'<article class="newsletter-archive-card" id="'+esc(c.slug)+'"><time>'+esc(date(c.published_at||c.created_at))+'</time><h2>'+esc(c.title)+'</h2><p><strong>'+esc(c.subject)+'</strong></p>'+(c.preheader?'<p>'+esc(c.preheader)+'</p>':'')+'<div class="newsletter-archive-content">'+(c.html_content||"")+'</div></article>').join("");if(location.hash){document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()}}

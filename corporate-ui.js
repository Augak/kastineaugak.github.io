/* Accessible compact navigation for the corporate UI refresh. */
(function(){
"use strict";
var header=document.querySelector("header.navbar");if(!header)return;
var nav=header.querySelector("nav");if(!nav||header.querySelector(".ka-nav-toggle"))return;
if(!nav.id)nav.id="ka-primary-navigation";
var button=document.createElement("button");button.type="button";button.className="ka-nav-toggle";
button.setAttribute("aria-controls",nav.id);button.setAttribute("aria-expanded","false");
button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Menu</span>';
function close(){nav.classList.remove("is-open");button.setAttribute("aria-expanded","false");}
button.addEventListener("click",function(){var open=button.getAttribute("aria-expanded")!=="true";button.setAttribute("aria-expanded",String(open));nav.classList.toggle("is-open",open);});
nav.addEventListener("click",function(event){if(event.target.closest("a"))close();});
document.addEventListener("keydown",function(event){if(event.key==="Escape"&&button.getAttribute("aria-expanded")==="true"){close();button.focus();}});
window.addEventListener("resize",function(){if(window.matchMedia("(min-width: 821px)").matches)close();});
header.insertBefore(button,nav);
})();


/* Site-wide scroll reveals, depth SVGs and an in-page visitor feedback form. */
(function(){
"use strict";
var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var root=document.documentElement;
if(!document.querySelector(".ka-depth-art")){
 var art=document.createElement("div");art.className="ka-depth-art";art.setAttribute("aria-hidden","true");
 art.innerHTML='<svg viewBox="0 0 620 620" focusable="false"><defs><linearGradient id="kaWire" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3b65b" stop-opacity=".85"/><stop offset="1" stop-color="#49a5d6" stop-opacity=".2"/></linearGradient><radialGradient id="kaOrb"><stop offset="0" stop-color="#74b8e0" stop-opacity=".24"/><stop offset="1" stop-color="#74b8e0" stop-opacity="0"/></radialGradient></defs><circle cx="310" cy="310" r="245" fill="url(#kaOrb)"/><g fill="none" stroke="url(#kaWire)" stroke-width="1.4"><path d="M310 48 505 160 505 386 310 500 115 386 115 160Z"/><path d="M310 48 310 276 505 386M310 276 115 386M310 276 505 160M310 276 115 160M115 160 310 500 505 160"/><ellipse cx="310" cy="276" rx="240" ry="92" transform="rotate(-32 310 276)"/><ellipse cx="310" cy="276" rx="240" ry="92" transform="rotate(58 310 276)"/><path d="m310 48 80 115-80 113-80-113zM310 276l195-116M310 276l-195-116M310 276v224"/></g><g fill="#e3b65b"><circle cx="310" cy="48" r="5"/><circle cx="505" cy="160" r="5"/><circle cx="505" cy="386" r="5"/><circle cx="310" cy="500" r="5"/><circle cx="115" cy="386" r="5"/><circle cx="115" cy="160" r="5"/></g></svg><svg class="ka-depth-secondary" viewBox="0 0 430 430" focusable="false"><g fill="none" stroke="#398bbd" stroke-width="1.5"><path d="M215 30 380 125 380 315 215 410 50 315 50 125Z M215 30v190l165 95M215 220 50 315M215 220 380 125M215 220 50 125M50 125l165 285 165-285"/><ellipse cx="215" cy="220" rx="190" ry="72" transform="rotate(45 215 220)"/><ellipse cx="215" cy="220" rx="190" ry="72" transform="rotate(-45 215 220)"/></g></svg>';
 document.body.prepend(art);
}
var revealSelector="main section, main article, main .card, main .venture-card, main .bio-block, main .contact-info, main .contact-form-container, main .profile-header, main .newsletter-panel, main .blog-card, main .article-card";
var revealItems=Array.prototype.slice.call(document.querySelectorAll(revealSelector));
if(!reduce&&"IntersectionObserver" in window){
 var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add("ka-visible");observer.unobserve(entry.target);}});},{threshold:.09,rootMargin:"0px 0px -35px 0px"});
 revealItems.forEach(function(el,i){el.classList.add("ka-reveal");if(i%4)el.classList.add("ka-reveal-delay-"+(i%4));observer.observe(el);});
}else{revealItems.forEach(function(el){el.classList.add("ka-visible");});}
if(!reduce){
 var ticking=false;
 function updateDepth(){var y=window.scrollY||0;root.style.setProperty("--ka-scroll-y",Math.round(y*-.12)+"px");root.style.setProperty("--ka-scroll-y2",Math.round(y*-.075)+"px");root.style.setProperty("--ka-scroll-r",(y*.012).toFixed(2)+"deg");root.style.setProperty("--ka-scroll-r2",(y*-.009).toFixed(2)+"deg");ticking=false;}
 window.addEventListener("scroll",function(){if(!ticking){window.requestAnimationFrame(updateDepth);ticking=true;}},{passive:true});updateDepth();
}
if(document.getElementById("ka-feedback-launch"))return;
var launcher=document.createElement("button");launcher.type="button";launcher.id="ka-feedback-launch";launcher.className="ka-feedback-launch";launcher.setAttribute("aria-haspopup","dialog");launcher.setAttribute("aria-controls","ka-feedback-overlay");launcher.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v11H9l-5 3v-14Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 9h8M8 12.5h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><span>Talk back</span>';
var overlay=document.createElement("div");overlay.id="ka-feedback-overlay";overlay.className="ka-feedback-overlay";overlay.setAttribute("role","presentation");
overlay.innerHTML='<section class="ka-feedback-dialog" role="dialog" aria-modal="true" aria-labelledby="ka-feedback-title" aria-describedby="ka-feedback-intro"><button type="button" class="ka-feedback-close" aria-label="Close feedback form">&times;</button><h2 id="ka-feedback-title">Help improve this website</h2><p id="ka-feedback-intro">Your feedback helps me make this portfolio clearer, faster and more useful. What should I improve?</p><form class="ka-feedback-form" action="https://formspree.io/f/xkjnvbry" method="POST"><input type="hidden" name="_subject" value="Portfolio website feedback"><label>Your name (optional)<input name="name" autocomplete="name" placeholder="How should I address you?"></label><label>Email (optional)<input name="email" type="email" autocomplete="email" placeholder="Only if you would like a reply"></label><label>What is your feedback about?<select name="topic"><option>Design and appearance</option><option>Navigation and usability</option><option>Accessibility</option><option>Performance and loading</option><option>Content and information</option><option>Something else</option></select></label><label>Your suggestion or issue<textarea name="message" required minlength="5" placeholder="Tell me what works, what is confusing, or what you would change..." ></textarea></label><button type="submit">Send feedback</button><p class="ka-feedback-status" role="status" aria-live="polite"></p></form></section>';
document.body.appendChild(launcher);document.body.appendChild(overlay);
var close=overlay.querySelector(".ka-feedback-close"),form=overlay.querySelector("form"),status=overlay.querySelector(".ka-feedback-status"),lastFocus=null;
function open(){lastFocus=document.activeElement;overlay.classList.add("is-open");launcher.setAttribute("aria-expanded","true");close.focus();}
function shut(){overlay.classList.remove("is-open");launcher.setAttribute("aria-expanded","false");if(lastFocus)lastFocus.focus();}
launcher.addEventListener("click",open);close.addEventListener("click",shut);overlay.addEventListener("click",function(e){if(e.target===overlay)shut();});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&overlay.classList.contains("is-open"))shut();});
form.addEventListener("submit",async function(e){e.preventDefault();var submit=form.querySelector('button[type="submit"]');submit.disabled=true;status.textContent="Sending your feedback…";try{var response=await fetch(form.action,{method:"POST",body:new FormData(form),headers:{Accept:"application/json"}});if(!response.ok)throw new Error("Submission failed");form.reset();status.textContent="Thank you — your feedback has been sent.";submit.textContent="Sent";}catch(err){status.textContent="We could not send this just now. Please try again, or use the Contact page."; }finally{submit.disabled=false;}});
})();

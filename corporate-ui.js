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
header.insertBefore(button,header.firstElementChild);
})();


/* Site-wide scroll reveals, depth SVGs and an in-page visitor feedback form. */
(function(){
"use strict";
var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var root=document.documentElement;
if(document.body.classList.contains("theme-home")&&!document.querySelector(".ka-depth-art")){
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


/* Consistent cosmic SVG ambience and page hero treatment. Blog admin /admin/ stays untouched. */
(function(){
"use strict";
if(location.pathname.indexOf("/admin/")!==-1)return;
var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if(document.body.classList.contains("theme-home")&&!document.querySelector(".ka-cosmic-layer")){
 var layer=document.createElement("div");layer.className="ka-cosmic-layer";layer.setAttribute("aria-hidden","true");
 layer.innerHTML='<svg class="ka-starfield" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" focusable="false"><defs><radialGradient id="ka-star-glow"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#e3b65b" stop-opacity="0"/></radialGradient></defs><g fill="#f0c978"><circle class="ka-spark" cx="92" cy="104" r="2.1"/><circle class="ka-spark" cx="248" cy="286" r="1.7"/><circle class="ka-spark" cx="390" cy="112" r="2.2"/><circle class="ka-spark" cx="552" cy="380" r="1.5"/><circle class="ka-spark" cx="708" cy="160" r="2"/><circle class="ka-spark" cx="860" cy="330" r="1.7"/><circle class="ka-spark" cx="1012" cy="104" r="2.2"/><circle class="ka-spark" cx="1188" cy="270" r="1.6"/><circle class="ka-spark" cx="1340" cy="120" r="2"/><circle class="ka-spark" cx="140" cy="620" r="1.6"/><circle class="ka-spark" cx="340" cy="790" r="2"/><circle class="ka-spark" cx="620" cy="650" r="1.5"/><circle class="ka-spark" cx="920" cy="760" r="2.2"/><circle class="ka-spark" cx="1120" cy="590" r="1.7"/><circle class="ka-spark" cx="1300" cy="810" r="2"/></g><g fill="none" stroke="#6eb5df" stroke-width="1.2" opacity=".52"><path class="ka-drift-icon" d="M190 450l13-23 13 23-13 23zM203 440v20m-10-10h20"/><path class="ka-drift-icon" d="M1130 430l17-17 17 17-17 17zM1130 430h34M1147 413v34"/><path class="ka-drift-icon" d="M760 60l12-21 12 21-12 21zM772 48v24m-12-12h24"/></g><g fill="url(#ka-star-glow)"><circle cx="708" cy="160" r="13"/><circle cx="1012" cy="104" r="15"/></g></svg><svg class="ka-orbit-one" viewBox="0 0 560 560" focusable="false"><g fill="none" stroke="#55a7d6" stroke-width="1.2" opacity=".48"><ellipse cx="280" cy="280" rx="245" ry="88" transform="rotate(-34 280 280)"/><ellipse cx="280" cy="280" rx="245" ry="88" transform="rotate(42 280 280)"/><path d="M280 35 475 168 475 392 280 525 85 392 85 168Z M280 35v245l195 112M280 280 85 392M280 280 475 168M280 280 85 168M85 168l195 357 195-357"/></g><g fill="#f0c978"><circle cx="280" cy="35" r="4"/><circle cx="475" cy="168" r="4"/><circle cx="475" cy="392" r="4"/><circle cx="280" cy="525" r="4"/></g></svg><svg class="ka-orbit-two" viewBox="0 0 390 390" focusable="false"><g fill="none" stroke="#e3b65b" stroke-width="1.1" opacity=".4"><circle cx="195" cy="195" r="142"/><ellipse cx="195" cy="195" rx="165" ry="62" transform="rotate(38 195 195)"/><ellipse cx="195" cy="195" rx="165" ry="62" transform="rotate(-38 195 195)"/><path d="M195 53v284M53 195h284"/></g></svg>';
 document.body.prepend(layer);
}
var main=document.querySelector("main");
if(main&&!document.querySelector(".theme-home .hero-section")&&!main.querySelector(".ka-page-hero")){
 var heading=main.querySelector("h1");
 if(heading){
  var candidate=heading.closest("header")||heading.closest(".blog-heading")||heading.closest(".article-header")||heading.parentElement;
  if(candidate&&candidate!==main&&candidate.tagName!=="ARTICLE"){candidate.classList.add("ka-page-hero");}
  else if(candidate&&candidate.tagName==="ARTICLE"){
   var intro=document.createElement("div");intro.className="ka-page-hero";
   var node=heading;var stop=heading.nextElementSibling;
   intro.appendChild(node);if(stop&&stop.tagName==="P")intro.appendChild(stop);
   candidate.insertBefore(intro,candidate.firstChild);
  }else if(candidate===main){var wrap=document.createElement("div");wrap.className="ka-page-hero";main.insertBefore(wrap,heading);wrap.appendChild(heading);if(wrap.nextElementSibling&&wrap.nextElementSibling.tagName==="P")wrap.appendChild(wrap.nextElementSibling);}
 }
}
if(document.body.classList.contains("theme-home")){
 var statement=document.querySelector(".hero-statement");
 if(statement&&!statement.dataset.kaRotating){
  statement.dataset.kaRotating="true";
  var phrases=["bold ideas into useful impact.","local challenges into digital solutions.","ambitious ideas into working products.","technology that works for people and businesses."];
  var span=statement.querySelector("span")||statement;
  var original=span.textContent.trim();if(original)phrases[0]=original;
  span.classList.add("ka-rotating-statement");
  var cursor=document.createElement("i");cursor.className="ka-type-cursor";cursor.setAttribute("aria-hidden","true");span.appendChild(cursor);
  if(!reduce){
   var index=0,typingTimer=null;
   function typePhrase(value){if(typingTimer)clearTimeout(typingTimer);span.textContent="";var caret=cursor.cloneNode(true);span.appendChild(caret);var pos=0;function step(){if(pos<value.length){span.insertBefore(document.createTextNode(value.charAt(pos)),caret);pos++;typingTimer=setTimeout(step,48);}else{typingTimer=setTimeout(nextPhrase,3400);}}step();}
   function nextPhrase(){index=(index+1)%phrases.length;typePhrase(phrases[index]);}
   typingTimer=setTimeout(nextPhrase,4200);
  }
  var hero=document.querySelector(".theme-home .hero-section");
  var marquee=document.createElement("div");marquee.className="ka-hero-marquee";marquee.setAttribute("aria-label","Ways we can help");
  var writing=document.createElement("div");writing.className="ka-marquee-writing";
  var lead=document.createElement("strong");lead.textContent="Let's build something useful together.";
  var typed=document.createElement("span");typed.className="ka-marquee-type";typed.textContent="We can help you build a website.";
  writing.appendChild(lead);writing.appendChild(typed);marquee.appendChild(writing);
  if(hero)hero.appendChild(marquee);
  if(!reduce){
    var words=["We can help you build a website.","Turn your idea into a working app.","Automate repetitive business tasks.","Create a digital presence that gets noticed."];
    var wordIndex=0,charIndex=words[0].length,removing=true;
    function writeMarquee(){
      if(removing){charIndex--;typed.textContent=words[wordIndex].slice(0,Math.max(0,charIndex));if(charIndex<=0){removing=false;wordIndex=(wordIndex+1)%words.length;}}
      else{var next=words[wordIndex];charIndex++;typed.textContent=next.slice(0,charIndex);if(charIndex>=next.length){removing=true;window.setTimeout(writeMarquee,2100);return;}}
      window.setTimeout(writeMarquee,removing?38:58);
    }
    window.setTimeout(writeMarquee,2400);
  }
 }
}
})();

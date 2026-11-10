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

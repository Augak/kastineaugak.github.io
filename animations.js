/* Lightweight portfolio motion enhancement.
   All decorative movement is CSS-based; no animation framework or WebGL engine is downloaded. */
(function(){
 "use strict";
 var root=document.documentElement;
 var reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 var connection=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
 var saveData=Boolean(connection&&connection.saveData);
 if(!reduce&&!saveData)root.classList.add("ka-motion-enabled");
 var canvas=document.getElementById("webgl-bg");
 if(canvas){canvas.hidden=true;canvas.setAttribute("aria-hidden","true");}
})();

/* Lightweight site-wide language selector. Google Translate is loaded only when a visitor chooses a language. */
(function(){
  "use strict";
  var header=document.querySelector(".navbar") || document.querySelector("header");
  if(!header || document.getElementById("kastine-language")) return;
  var wrap=document.createElement("div");
  wrap.id="kastine-language";
  wrap.className="kastine-language";
  wrap.setAttribute("aria-label","Website language");
  wrap.innerHTML='<span class="kastine-language-label">Language</span><div id="google_translate_element"></div>';
  header.appendChild(wrap);
  var style=document.createElement("style");
  style.textContent='.navbar{flex-wrap:wrap;gap:12px}header:not(.navbar) .kastine-language{padding:8px 14px;background:#10251f;justify-content:flex-end}.kastine-language{display:flex;align-items:center;gap:8px;margin-left:auto;color:#e2e8f0;font-size:.84rem}.kastine-language-label{font-weight:600}.kastine-language select{max-width:190px;min-height:36px;padding:6px 28px 6px 9px;border:1px solid #94a3b8;border-radius:4px;background:#fff;color:#17212b;font:inherit}.kastine-language .goog-te-gadget{color:#e2e8f0!important;font-family:inherit!important;font-size:0!important}.kastine-language .goog-te-gadget select{font-size:14px!important}.kastine-language .goog-logo-link,.kastine-language .goog-te-gadget span{font-size:11px!important}.kastine-language .goog-te-gadget img{vertical-align:middle}@media(max-width:700px){.kastine-language{width:100%;margin-left:0}.kastine-language select{max-width:100%;width:min(260px,100%)}}';
  document.head.appendChild(style);
  window.googleTranslateElementInit=function(){
    if(!window.google || !google.translate || !google.translate.TranslateElement) return;
    new google.translate.TranslateElement({
      pageLanguage:"en",
      includedLanguages:"ar,bn,de,es,fr,hi,id,it,ja,ko,nl,pl,pt,ru,sw,tr,uk,ur,vi,zh-CN",
      autoDisplay:false,
      layout:google.translate.TranslateElement.InlineLayout.SIMPLE
    },"google_translate_element");
  };
  var load=function(){
    if(document.getElementById("kastine-google-translate")) return;
    var s=document.createElement("script");
    s.id="kastine-google-translate";
    s.src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    s.async=true;
    document.head.appendChild(s);
  };
  var box=document.getElementById("google_translate_element");
  if(box){
    box.addEventListener("focusin",load,{once:true});
    box.addEventListener("click",load,{once:true});
    box.addEventListener("pointerdown",load,{once:true});
    var hint=document.createElement("button");
    hint.type="button";
    hint.className="kastine-language-load";
    hint.textContent="Choose language";
    hint.setAttribute("aria-label","Load language choices");
    hint.style.cssText="min-height:36px;padding:6px 10px;border:1px solid #94a3b8;border-radius:4px;background:#fff;color:#17212b;font:inherit;cursor:pointer";
    hint.addEventListener("click",function(){load();hint.remove();});
    box.appendChild(hint);
  }
})();
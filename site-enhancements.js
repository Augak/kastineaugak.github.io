/* Lightweight site-wide language selector. Google Translate is loaded only when a visitor chooses a language. */
(function(){
  "use strict";
  var header=document.querySelector(".navbar") || document.querySelector("header");
  if(!header || document.getElementById("kastine-language")) return;
  var wrap=document.createElement("div");
  wrap.id="kastine-language";
  wrap.className="kastine-language";
  wrap.setAttribute("aria-label","Website language");
  wrap.innerHTML='<button type="button" class="ka-language-trigger" aria-label="Choose website language" aria-expanded="false" aria-controls="ka-language-panel" title="Language">文</button><div class="ka-language-panel" id="ka-language-panel"><div id="google_translate_element"></div></div>';
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
  var trigger=wrap.querySelector(".ka-language-trigger");
  trigger.addEventListener("click",function(){var open=wrap.classList.toggle("is-open");trigger.setAttribute("aria-expanded",String(open));if(open)load();});
  document.addEventListener("click",function(event){if(!wrap.contains(event.target)){wrap.classList.remove("is-open");trigger.setAttribute("aria-expanded","false");}});
  var box=document.getElementById("google_translate_element");
  function applyLanguage(code){
    if(!code) return;
    if(code==="en"){document.documentElement.lang="en";document.documentElement.setAttribute("data-language","en");document.documentElement.style.setProperty("--ka-motion-hue","0deg");document.documentElement.style.setProperty("--ka-motion-saturation","1.15");return;}
    var hueMap={ar:150,bn:205,de:34,es:318,fr:278,hi:42,id:18,it:295,ja:215,ko:188,nl:24,pl:52,pt:330,ru:185,sw:12,tr:165,uk:205,ur:145,vi:260,"zh-CN":225};
    document.documentElement.lang=code;
    document.documentElement.setAttribute("data-language",code);
    document.documentElement.style.setProperty("--ka-motion-hue",(hueMap[code]||0)+"deg");
    document.documentElement.style.setProperty("--ka-motion-saturation","1.35");
  }
  function watchTranslateSelect(){
    if(!box || box.dataset.languageObserver) return;
    box.dataset.languageObserver="true";
    var bind=function(){
      var select=box.querySelector("select.goog-te-combo");
      if(select && !select.dataset.kaBound){
        select.dataset.kaBound="true";
        select.addEventListener("change",function(){applyLanguage(select.value);});
        if(select.value) applyLanguage(select.value);
      }
    };
    bind();
    if("MutationObserver" in window){var observer=new MutationObserver(bind);observer.observe(box,{childList:true,subtree:true});}
  }
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
    hint.addEventListener("click",function(){load();hint.remove();watchTranslateSelect();});
    box.appendChild(hint);
    watchTranslateSelect();
  }
})();

/* Persistent, banner-free site translation.
   Google Translate's selection is stored across page navigation and restored on every page. */
(function(){
  "use strict";
  var KEY="kastine-site-language";
  var root=document.documentElement;
  var host=location.hostname;
  function readCookie(name){
    var match=document.cookie.match(new RegExp("(?:^|; )"+name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"=([^;]*)"));
    return match?decodeURIComponent(match[1]):"";
  }
  function writeTranslateCookie(code){
    var value="/en/"+(code==="en"?"en":code);
    document.cookie="googtrans="+encodeURIComponent(value)+"; path=/; SameSite=Lax";
    if(host && host.indexOf(".")!==-1) document.cookie="googtrans="+encodeURIComponent(value)+"; domain="+host+"; path=/; SameSite=Lax";
  }
  function cookieLanguage(){
    var value=readCookie("googtrans");
    var parts=value.split("/");
    return parts.length>2?parts[2]:"";
  }
  var saved="";
  try{saved=localStorage.getItem(KEY)||"";}catch(e){}
  if(!saved) saved=cookieLanguage();
  if(saved){
    root.setAttribute("data-language",saved);
    if(saved!=="en") root.lang=saved;
    writeTranslateCookie(saved);
  }
  var style=document.createElement("style");
  style.id="ka-translate-banner-suppression";
  style.textContent=[
    "iframe.goog-te-banner-frame,.goog-te-banner-frame.skiptranslate{display:none!important;visibility:hidden!important;height:0!important}",
    "body{top:0!important;position:static!important}",
    "html body{top:0!important}",
    ".goog-te-balloon-frame{display:none!important}",
    "#goog-gt-tt,.goog-tooltip,.goog-tooltip:hover{display:none!important}",
    ".goog-text-highlight{background:transparent!important;box-shadow:none!important}"
  ].join("");
  document.head.appendChild(style);
  function remember(code){
    if(!code) return;
    try{localStorage.setItem(KEY,code);}catch(e){}
    writeTranslateCookie(code);
    root.setAttribute("data-language",code);
    root.lang=code==="en"?"en":code;
  }
  function bindSelect(select){
    if(!select || select.dataset.kaPersistentBound) return;
    select.dataset.kaPersistentBound="true";
    select.addEventListener("change",function(){
      var code=select.value||"en";
      remember(code);
      if(code==="en") window.setTimeout(function(){location.reload();},80);
    });
    if(saved && saved!=="en"){
      var option=Array.prototype.find.call(select.options,function(item){return item.value===saved;});
      if(option && select.value!==saved){
        select.value=saved;
        select.dispatchEvent(new Event("change",{bubbles:true}));
      }
    }
  }
  function watch(){
    var box=document.getElementById("google_translate_element");
    if(!box) return;
    var select=box.querySelector("select.goog-te-combo");
    bindSelect(select);
    if(!box.dataset.kaPersistentObserver && "MutationObserver" in window){
      box.dataset.kaPersistentObserver="true";
      new MutationObserver(function(){
        bindSelect(box.querySelector("select.goog-te-combo"));
      }).observe(box,{childList:true,subtree:true});
    }
  }
  watch();
  if(saved && saved!=="en"){
    var trigger=document.querySelector("#kastine-language .ka-language-trigger");
    if(trigger) trigger.click();
    watch();
  }
  if("MutationObserver" in window){
    new MutationObserver(function(){
      document.querySelectorAll("iframe.goog-te-banner-frame,.goog-te-banner-frame").forEach(function(frame){
        frame.style.setProperty("display","none","important");
        frame.style.setProperty("visibility","hidden","important");
      });
      if(document.body && document.body.style.top && document.body.style.top!=="0px") document.body.style.setProperty("top","0px","important");
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["style"]});
  }
})();

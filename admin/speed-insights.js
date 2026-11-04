(function(){
 "use strict";
 var state={lcp:null,inp:null,cls:0,fcp:null,ttfb:null,domReady:null,load:null,longTasks:0,resources:{count:0,bytes:0},device:(navigator.userAgentData&&navigator.userAgentData.mobile)?"Mobile":"Browser",captured:null};
 function observe(type,fn){try{if("PerformanceObserver"in window&&PerformanceObserver.supportedEntryTypes&&PerformanceObserver.supportedEntryTypes.indexOf(type)>-1){var o=new PerformanceObserver(function(list){list.getEntries().forEach(fn)});o.observe({type:type,buffered:true});return o}}catch(e){}return null}
 observe("largest-contentful-paint",function(e){state.lcp=e.startTime});
 observe("layout-shift",function(e){if(!e.hadRecentInput)state.cls+=e.value});
 observe("event",function(e){if(e.interactionId)state.inp=Math.max(state.inp||0,e.duration)});
 observe("longtask",function(){state.longTasks++});
 function capture(){var nav=performance.getEntriesByType("navigation")[0];if(nav){state.ttfb=nav.responseStart;state.domReady=nav.domContentLoadedEventEnd;state.load=nav.loadEventEnd}var paints=performance.getEntriesByType("paint");var f=paints.find(function(x){return x.name==="first-contentful-paint"});if(f)state.fcp=f.startTime;var rs=performance.getEntriesByType("resource");state.resources={count:rs.length,bytes:rs.reduce(function(n,x){return n+(x.transferSize||0)},0)};state.captured=new Date().toLocaleString();return Object.assign({},state,{resources:Object.assign({},state.resources)})}
 window.KastineSpeedInsights={snapshot:capture,refresh:capture};
 window.addEventListener("pagehide",capture,{once:true});
})();
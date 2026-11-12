(function(){
/* One index for every search surface: deliverables/search/search-index.js. */
const IDX=window.FD_IDX||[];
var input=document.querySelector('input[placeholder="Search this site"]');
if(!input||input.__omni)return;input.__omni=1;input.disabled=false;input.readOnly=false;input.setAttribute('autocomplete','off');
var st=document.createElement('style');st.textContent='.omni-dd{position:fixed;background:#fff;color:#00003d;border:1px solid #e6e6ee;border-radius:12px;box-shadow:0 18px 55px rgba(3,8,30,.3);padding:8px;z-index:99995;display:none;max-height:min(70vh,560px);overflow:auto;font-family:"GE Sans",-apple-system,"Helvetica Neue",Arial,sans-serif;text-align:left}\n.omni-dd.on{display:block}\n.omni-dd .rt{display:flex;align-items:center;gap:11px;border:1px solid #e6e6ee;border-radius:9px;padding:11px 13px;text-decoration:none;color:#00003d;margin-bottom:6px}\n.omni-dd .rt.sel{border-color:#2256e6;background:#eef3ff}\n.omni-dd .rt .ic{width:28px;height:28px;border-radius:7px;flex:none;display:grid;place-items:center;font-size:14px;background:#eef2f7}\n.omni-dd .rt .ic.w{background:linear-gradient(135deg,#2256e6,#4181ff);color:#fff}\n.omni-dd .rt .tx{flex:1;min-width:0;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.omni-dd .rt .tx b{font-weight:650}.omni-dd .rt .tx .s{color:#75758f}\n.omni-dd .rt .hint{margin-left:7px;font-size:10px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:#2256e6;background:#fff;border:1px solid #d4e0ff;border-radius:20px;padding:2px 7px}\n.omni-dd .rt .kb{flex:none;display:flex;gap:4px}.omni-dd .rt .kb b{font:600 10.5px/1 ui-monospace,Menlo,monospace;background:#f1f2f7;border:1px solid #e6e6ee;border-bottom-width:2px;border-radius:5px;padding:4px 6px;color:#75758f}\n.omni-dd .sep{height:1px;background:#e6e6ee;margin:8px 4px}\n.omni-dd .gh{font:600 10.5px/1 ui-monospace,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;color:#75758f;margin:11px 4px 6px;display:flex;gap:8px;align-items:center}.omni-dd .gh .l{height:1px;background:#e6e6ee;flex:1}\n.omni-dd .rc{display:flex;gap:11px;align-items:flex-start;border:1px solid #e6e6ee;border-radius:8px;padding:10px 12px;text-decoration:none;color:#00003d;margin-bottom:5px}\n.omni-dd .rc:hover,.omni-dd .rc.cur{border-color:#2256e6}\n.omni-dd .rc .ci{width:30px;height:30px;border-radius:7px;flex:none;display:grid;place-items:center;font-size:14px;background:#eef3ff}\n.omni-dd .rc .ti{font-weight:650;font-size:14px}.omni-dd .rc .de{font-size:12px;color:#75758f;margin-top:2px}\n.omni-dd .rc .bd{font-size:9.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#2256e6;background:#eef3ff;border-radius:20px;padding:2px 7px;margin-top:5px;display:inline-block}\n.omni-dd mark{background:#fde68a;color:inherit;border-radius:2px;padding:0 1px}\n.omni-dd .ft{font:11px/1 ui-monospace,Menlo,monospace;color:#75758f;padding:8px 6px 3px}\n.omni-dd .em{padding:13px 8px;color:#75758f;font-size:13px}';document.head.appendChild(st);
var dd=document.createElement('div');dd.className='omni-dd';document.body.appendChild(dd);
var ICON=window.FD_ICON||{f:"\ud83d\udcd8",b:"\ud83e\udd1d",t:"\ud83d\udcc4",o:"\ud83d\udee0",r:"\u25b6"};
var LBL=window.FD_LBL||{f:"Fundamentals",b:"Behaviors",t:"Templates",o:"Tools",r:"Videos"};
var shown=[],cur=-1,wm=false;
function esc(s){return s.replace(/[&<>]/g,function(m){return({"&":"&amp;","<":"&lt;",">":"&gt;"})[m]})}
function hl(s,ts){var o=esc(s);ts.forEach(function(t){if(t)o=o.replace(new RegExp("("+t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig"),"<mark>$1</mark>")});return o}
function score(x,ts){var s=0,T=(x.t+" "+x.d+" "+x.tags).toLowerCase();for(var i=0;i<ts.length;i++){var t=ts[i];if(!t)continue;if(T.indexOf(t)<0)return -1;if(x.t.toLowerCase().indexOf(t)>=0)s+=10;if(x.t.toLowerCase().indexOf(t)===0)s+=6;s+=1}return s}
function inTitle(x,ts){var t=x.t.toLowerCase();return ts.length>0&&ts.every(function(w){return !w||t.indexOf(w)>=0})}
function intent(s){s=s.toLowerCase().trim();if(!s)return false;if(s.indexOf("?")>=0)return true;if(/(^|\s)(how|why|what|whats|what's|when|where|which|who|should|can|could|would|will|do|does|is|are|explain|help|need|want|best way|not sure|stuck)\b/.test(s))return true;return s.split(/\s+/).length>=5}
function sURL(r){return "/deliverables/search/results.html?q="+encodeURIComponent(r)}
function wURL(r){return "/deliverables/search/wingmate.html?q="+encodeURIComponent(r)}
function routes(r){var h=esc(r);return '<a class="rt'+(wm?'':' sel')+'" href="'+sURL(r)+'"><span class="ic">\ud83d\udd0d</span><span class="tx"><b>'+h+'</b> <span class="s">\u2014 Search Flight Deck</span></span><span class="kb"><b>\u21b5</b></span></a><a class="rt'+(wm?' sel':'')+'" href="'+wURL(r)+'"><span class="ic w">\u2726</span><span class="tx"><b>'+h+'</b> <span class="s">\u2014 Ask Wingmate</span>'+(wm?'<span class="hint">best for this</span>':'')+'</span><span class="kb"><b>\u2318</b><b>\u21b5</b></span></a>'}
function card(x,ts){var i=shown.indexOf(x);return '<a class="rc" data-i="'+i+'" href="'+x.u+'"><span class="ci">'+ICON[x.ty]+'</span><span style="flex:1;min-width:0"><span class="ti">'+hl(x.t,ts)+'</span><div class="de">'+hl(x.d,ts)+'</div><div><span class="bd">'+x.tyl+'</span></div></span></a>'}
function place(){var r=input.getBoundingClientRect();var w=Math.max(r.width,470);dd.style.top=(r.bottom+8)+'px';dd.style.width=w+'px';var left=Math.min(r.left,window.innerWidth-w-14);dd.style.left=Math.max(12,left)+'px'}
function paint(){var els=dd.querySelectorAll('.rc');for(var i=0;i<els.length;i++)els[i].classList.toggle('cur',+els[i].dataset.i===cur)}
function run(){var r=input.value.trim(),ts=r?r.toLowerCase().split(/\s+/):[];if(!r){dd.classList.remove('on');dd.innerHTML='';shown=[];return}
 var list=IDX.map(function(x){return{x:x,s:score(x,ts)}}).filter(function(o){return o.s>=0}).sort(function(a,b){return b.s-a.s}).map(function(o){return o.x});shown=list;cur=-1;wm=intent(r)||list.length===0;
 var html=routes(r);
 if(list.length){var ORD=['f','b','t','o','r'],byT=function(a){var o=[];ORD.forEach(function(k){a.forEach(function(x){if(x.ty===k)o.push(x)})});return o};var nm=byT(list.filter(function(x){return inTitle(x,ts)})),pg=byT(list.filter(function(x){return !inTitle(x,ts)}));list=nm.concat(pg);shown=list;var sec=function(l,a){return a.length?'<div class="gh">'+l+'<span class="l"></span>'+a.length+'</div>'+a.map(function(x){return card(x,ts)}).join(''):''};html+='<div class="sep"></div>'+sec('In the title',nm)+sec('On the page',pg);html+='<div class="ft">'+list.length+' result'+(list.length!==1?'s':'')+' for \u201c'+esc(r)+'\u201d</div>'}
 else html+='<div class="em">No exact match \u2014 hand it to <b>Ask Wingmate</b> above, or try a broader word.</div>';
 dd.innerHTML=html;place();dd.classList.add('on');
 var rcs=dd.querySelectorAll('.rc');for(var i=0;i<rcs.length;i++){(function(e){e.onmouseenter=function(){cur=+e.dataset.i;paint()}})(rcs[i])}}
input.addEventListener('input',run);
input.addEventListener('focus',function(){if(input.value.trim())run()});
input.addEventListener('blur',function(){setTimeout(function(){dd.classList.remove('on')},150)});
dd.addEventListener('mousedown',function(e){if(e.target.closest('a'))return;e.preventDefault()});
window.addEventListener('scroll',function(){if(dd.classList.contains('on'))place()},true);
window.addEventListener('resize',function(){if(dd.classList.contains('on'))place()});
input.addEventListener('keydown',function(e){var r=input.value.trim();
 if(e.key==='Escape'){input.value='';dd.classList.remove('on');dd.innerHTML='';return}
 if(e.key==='Enter'){if(e.metaKey||e.ctrlKey){if(r)location.href=wURL(r);return}
  if(cur>=0){var el=dd.querySelector('.rc[data-i="'+cur+'"]');if(el){location.href=el.getAttribute('href');return}}
  if(r&&wm){location.href=wURL(r);return} if(shown.length){location.href=sURL(r)}return}
 if(!shown.length)return;
 if(e.key==='ArrowDown'){e.preventDefault();cur=Math.min(cur+1,shown.length-1);paint()}
 if(e.key==='ArrowUp'){e.preventDefault();cur=Math.max(cur-1,0);paint()}});
})();
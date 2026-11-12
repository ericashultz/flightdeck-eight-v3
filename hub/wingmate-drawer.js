/* FLIGHT DECK Wingmate drawer: shared by every page that opts in.
 *
 * Moved verbatim out of deliverables/standard-work/sw-wingmate-demo.html (Ken, 29 Oct): the
 * drawer's CSS, markup and script live here once, so no page carries a copy and a kit port
 * lands in _shared. A page opts in with
 *   <script src="/hub/wingmate-chat.js"></script>
 *   <script src="/hub/wingmate-drawer.js"></script>
 * and opens it with wmOpen() / wmAsk(text) from its own buttons.
 *
 * Load order: the CSS goes in at once; the markup is added to the body once the DOM is
 * there, so the file is safe to inline anywhere in a page. The pop out address is a fixed
 * value on the button (data-pop), never assembled, so the SharePoint build can rewrite it.
 */
(function(){
  var CSS="/* ── Drawer (recovered wm-drawer chrome) ── */\n#wm-scrim{position:fixed;inset:0;background:rgba(0,1,15,.4);z-index:219;opacity:0;pointer-events:none;transition:opacity .28s}\n#wm-scrim.open{opacity:1;pointer-events:auto}\n#wm-drawer{position:fixed;top:0;right:0;bottom:0;width:380px;max-width:92vw;background:#fff;color:#00003D;z-index:220;transform:translateX(100%);transition:transform .28s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;box-shadow:-20px 0 60px -20px rgba(11,26,64,.28);font-family:\"GE Sans\",-apple-system,\"Helvetica Neue\",Arial,sans-serif;-webkit-font-smoothing:antialiased}\n#wm-drawer *{box-sizing:border-box}\n#wm-drawer.open{transform:translateX(0)}\n#wm-drawer .wmd-head{display:flex;flex-wrap:wrap;align-items:center;gap:10px;padding:20px 22px;border-bottom:1px solid #e7ebf4;flex:none}\n/* 380px will not hold the name, the two buttons and the close on one line: the name was\n   breaking to one word per line. The close keeps the title's row, the two buttons take\n   the row under it. */\n#wm-drawer .wmd-head::after{content:\"\";order:1;flex-basis:100%;height:0}\n#wm-drawer .wmd-x{order:1;margin-left:auto}\n#wm-drawer .wmd-play,#wm-drawer .wmd-head .wmd-pop{order:2}\n#wm-drawer .wmd-spark{width:30px;height:30px;flex:none;border-radius:8px;background:#ecfdf5;display:flex;align-items:center;justify-content:center;font-size:15px;color:#16b364}\n#wm-drawer .wmd-title{font-size:14px;font-weight:700;min-width:0;flex:1}\n/* The title gives way so Pop out and Close both stay inside the drawer. */\n#wm-drawer .wmd-x{flex:none}\n#wm-drawer .wmd-title small{display:block;font-size:11px;font-weight:500;color:#8f97b3}\n#wm-drawer .wmd-x{background:none;border:0;color:#6b7294;font-size:20px;cursor:pointer;font-family:inherit;line-height:1;padding:4px}\n#wm-drawer .wmd-x:hover{color:#00003D}\n#wm-drawer .wmd-body{flex:1;overflow-y:auto;padding:20px 22px;display:flex;flex-direction:column;gap:14px}\n#wm-drawer #wm-intro{display:flex;flex-direction:column;gap:14px}\n#wm-drawer .wm-msg{font-size:13.5px;line-height:1.55;border-radius:12px;padding:13px 15px;max-width:90%}\n#wm-drawer .wm-msg.bot{background:#f4f7fd;border:1px solid #e1e6f2;align-self:flex-start;color:#44496e}\n#wm-drawer .wm-msg.user{background:#2256e6;align-self:flex-end;color:#fff}\n#wm-drawer .wm-msg b{color:#16b364;font-weight:700}\n#wm-drawer .wm-msg p{margin:0 0 9px}\n#wm-drawer .wm-msg p:last-child{margin-bottom:0}\n#wm-drawer .wm-msg .w{opacity:0;transition:opacity .3s ease}\n#wm-drawer .wm-msg .w.in{opacity:1}\n#wm-drawer .wm-act{display:inline-flex;align-items:center;gap:7px;margin-top:11px;font-size:12px;font-weight:700;color:#2256e6;background:#eef3fd;border:1px solid #cfdffb;border-radius:100px;padding:8px 15px;text-decoration:none;cursor:pointer;font-family:inherit;transition:background .15s}\n#wm-drawer .wm-act:hover{background:#e0ebff}\n#wm-drawer .wm-typing{align-self:flex-start;display:flex;gap:4px;padding:11px 14px;background:#f4f7fd;border:1px solid #e1e6f2;border-radius:12px 12px 12px 3px}\n#wm-drawer .wm-typing i{width:5px;height:5px;border-radius:50%;background:#6b7294;animation:wmtyp 1s ease infinite}\n#wm-drawer .wm-typing i:nth-child(2){animation-delay:.15s}\n#wm-drawer .wm-typing i:nth-child(3){animation-delay:.3s}\n@keyframes wmtyp{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}\n#wm-drawer .wm-sugg{display:flex;flex-direction:column;gap:8px}\n#wm-drawer .wm-sugg button{text-align:left;font-family:inherit;font-size:12.5px;color:#2256e6;background:#eef3fd;border:1px solid #cfdffb;border-radius:10px;padding:10px 13px;cursor:pointer;transition:background .15s}\n#wm-drawer .wm-sugg button:hover{background:#e0ebff}\n#wm-drawer .wm-profiles{display:flex;flex-direction:column;gap:8px;border-top:1px solid #e7ebf4;padding-top:14px}\n#wm-drawer .wm-plabel{font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#8f97b3}\n#wm-drawer .wm-profiles a{display:block;font-size:12.5px;font-weight:600;color:#16b364;background:#f3fdf7;border:1px solid #bbf7d0;border-radius:10px;padding:10px 13px;text-decoration:none;transition:background .15s}\n#wm-drawer .wm-profiles a:hover{background:#dcfce7}\n#wm-drawer .wmd-foot{padding:16px 18px 8px;border-top:1px solid #e7ebf4;display:flex;gap:9px;flex:none}\n#wm-drawer .wmd-foot input{flex:1;min-width:0;background:#f4f7fd;border:1px solid #e1e6f2;border-radius:100px;padding:11px 16px;color:#00003D;font:inherit;font-size:13.5px;outline:0}\n#wm-drawer .wmd-foot input::placeholder{color:#8f97b3}\n#wm-drawer .wmd-foot input:focus{border-color:#4181ff}\n#wm-drawer .wmd-foot button{flex:none;background:#16b364;color:#001b0f;border:0;border-radius:100px;padding:0 18px;height:42px;font-size:11.5px;font-weight:700;letter-spacing:.08em;cursor:pointer;font-family:inherit;transition:background .15s}\n#wm-drawer .wmd-foot button:hover{background:#13a059}\n#wm-drawer .wmd-note{flex:none;padding:0 20px 14px;font-size:10.5px;color:#8f97b3;letter-spacing:.02em}\nbody.wm-lock{overflow:hidden!important}\n/* ── Contextual chips (next best actions, refreshed after each reply) ── */\n#wm-drawer .wm-chips{display:flex;flex-wrap:wrap;gap:8px;align-self:flex-start;max-width:94%}\n#wm-drawer .wm-chips .wm-act{margin-top:0}\n#wm-drawer .wm-act.pulse{box-shadow:0 0 0 3px rgba(22,179,100,.3);border-color:#16b364}\n/* ── Generated draft card (Content · Sequence · Timing) ── */\n#wm-drawer .wm-draft{margin-top:12px;background:#f8fafe;border:1px solid #e1e6f2;border-radius:10px;padding:12px 13px;overflow-x:auto}\n#wm-drawer .wmdft-cap{font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#16b364;margin-bottom:9px}\n#wm-drawer .wm-draft table{width:100%;border-collapse:collapse;font-size:11.5px}\n#wm-drawer .wm-draft th{text-align:left;font-size:9px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#5b6ba8;padding:0 8px 7px 0;border-bottom:1px solid #e1e6f2}\n#wm-drawer .wm-draft td{padding:7px 8px 7px 0;border-bottom:1px solid #eef1f8;color:#44496e;line-height:1.45;vertical-align:top}\n#wm-drawer .wm-draft td:first-child,#wm-drawer .wm-draft td:last-child{font-family:ui-monospace,Menlo,monospace;font-size:10.5px;white-space:nowrap}\n#wm-drawer .wm-draft td:first-child{color:#5b6ba8}\n#wm-drawer .wm-draft td:last-child{color:#2256e6}\n#wm-drawer .wm-draft tbody tr{animation:wmrow .4s ease both}\n@keyframes wmrow{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}\n#wm-drawer .wm-draft tfoot td{border-bottom:0;color:#16b364;font-weight:700;padding-top:9px}\n#wm-drawer .wmdft-swip{margin-top:10px;font-size:11px;color:#6b7294;line-height:1.55;border-top:1px dashed #e1e6f2;padding-top:9px}\n#wm-drawer .wmdft-swip b{color:#16b364}\n/* ── Evaluation scorecard (four confirmation questions) ── */\n#wm-drawer .wm-eval{margin-top:12px;background:#f8fafe;border:1px solid #e1e6f2;border-radius:10px;padding:11px 13px 13px}\n#wm-drawer .wm-eval .wm-evcap{font-size:9.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#16b364;margin-bottom:2px}\n#wm-drawer .wm-evrow{display:flex;gap:9px;margin-top:9px;font-size:12px;line-height:1.5;color:#44496e}\n#wm-drawer .wm-evrow span{flex:none;width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;margin-top:1px}\n#wm-drawer .wm-evrow.ok span{background:#ecfdf5;color:#16b364}\n#wm-drawer .wm-evrow.gap span{background:#fef3c7;color:#b45309}\n#wm-drawer .wm-evrow b{color:#00003D}\n/* ── Hands-free presentation mode ── */\n#wm-drawer .wmd-play{font-family:ui-monospace,Menlo,monospace;font-size:10px;font-weight:600;letter-spacing:.08em;color:#6b7294;background:#f4f7fd;border:1px solid #e1e6f2;border-radius:100px;padding:6px 12px;cursor:pointer;white-space:nowrap;transition:color .15s,border-color .15s}\n#wm-drawer .wmd-play:hover{color:#00003D;border-color:#c9d1e4}\n#wm-drawer .wmd-play~.wmd-x{margin-left:0}\n@media(prefers-reduced-motion:reduce){#wm-drawer,#wm-scrim,#wm-drawer .wm-msg .w{transition:none}#wm-drawer .wm-typing i{animation:none}#wm-drawer .wm-draft tbody tr{animation:none}}\n\n/* Voice and pop out, in the drawer's own foot and head. The mic stays hidden unless the\n   browser actually has speech recognition, so it never offers something it cannot do.\n   Donny, 7 Oct 2026. */\n/* One pill holds the field, the mic and send, the shape every chat box uses now.\n   The input carries no border of its own; the pill carries it. Donny, 7 Oct 2026. */\n#wm-drawer .wmd-foot .wmd-ask{flex:1;min-width:0;display:flex;align-items:center;gap:6px;background:#f4f7fd;border:1px solid #e1e6f2;border-radius:100px;padding:5px 5px 5px 6px;transition:border-color .15s,box-shadow .15s}\n#wm-drawer .wmd-foot .wmd-ask:focus-within{border-color:#4181ff;box-shadow:0 0 0 3px rgba(65,129,255,.14)}\n#wm-drawer .wmd-foot .wmd-ask input{flex:1;min-width:0;width:auto;background:none;border:0;border-radius:0;padding:10px 4px 10px 12px}\n#wm-drawer .wmd-foot .wmd-ask input:focus{border:0}\n/* The mic sits inside the ask box, the way a search field carries one, rather than beside\n   it as a third button. Donny, 7 Oct 2026. */\n#wm-drawer .wmd-foot button.wmd-mic{flex:none;background:none;border:0;border-radius:100px;width:32px;height:32px;padding:0;color:#6b7294;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:color .15s}\n#wm-drawer .wmd-foot button.wmd-mic svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}\n/* Send is the round arrow the pill ends on, not a word beside it. */\n#wm-drawer .wmd-foot .wmd-ask button.wmd-go{flex:none;width:34px;height:34px;padding:0;border-radius:50%;background:#16b364;color:#fff;display:flex;align-items:center;justify-content:center}\n#wm-drawer .wmd-foot .wmd-ask button.wmd-go svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}\n#wm-drawer .wmd-foot button.wmd-mic:hover{color:#00003D}\n#wm-drawer .wmd-foot button.wmd-mic.on{color:#16b364}\n#wm-drawer .wmd-head .wmd-pop{flex:none;background:#f4f7fd;border:1px solid #e1e6f2;border-radius:100px;color:#44496e;font:inherit;font-size:11px;font-weight:600;letter-spacing:.06em;cursor:pointer;padding:6px 11px;white-space:nowrap}\n#wm-drawer .wmd-head .wmd-pop:hover{color:#00003D;border-color:#4181ff}";
  var MARKUP="<div id=\"wm-scrim\" onclick=\"wmClose()\"></div>\n<aside id=\"wm-drawer\" role=\"dialog\" aria-modal=\"true\" aria-label=\"FLIGHT DECK Wingmate\" aria-hidden=\"true\">\n  <div class=\"wmd-head\">\n    <span class=\"wmd-spark\" aria-hidden=\"true\">✦</span>\n    <div class=\"wmd-title\">FLIGHT DECK Wingmate<small>Standard Work assistant &middot; briefed by FLIGHT DECK</small></div>\n    <button class=\"wmd-play\" id=\"wm-play\" type=\"button\" onclick=\"wmAutoDemo()\" aria-label=\"Play the hands-free demo\">&#9654; Play the demo</button>\n    <button type=\"button\" class=\"wmd-pop\" data-pop=\"/deliverables/wingmate/index.html\" onclick=\"wmPop(this)\" title=\"Open Wingmate in its own window\" aria-label=\"Open Wingmate in its own window\">&#8599; Pop out</button>\n    <button class=\"wmd-x\" onclick=\"wmClose()\" aria-label=\"Close Wingmate\">&times;</button>\n  </div>\n  <div class=\"wmd-body\" id=\"wm-body\">\n    <div class=\"wm-msg bot\">You are on <b>Standard Work</b>. I can recommend the right template, draft a first standard from a plain description, or evaluate one you already have. Tell me about the task, or pick one below.</div>\n    <div id=\"wm-intro\">\n      <div class=\"wm-sugg\">\n        <button type=\"button\" onclick=\"wmAsk('Recommend a template for my work')\">Recommend a template for my work</button>\n        <button type=\"button\" onclick=\"wmAsk('Evaluate a standard I already have')\">Evaluate a standard I already have</button>\n        <button type=\"button\" onclick=\"wmAsk('Help me set the takt for my standard')\">Help me set the takt for my standard</button>\n      </div>\n      <div class=\"wm-profiles\">\n        <span class=\"wm-plabel\">Run a Wingmate profile</span>\n        <a href=\"https://wingmate.apps.geaerospace.net/?profile=StandardWorkDraftBuilder\" target=\"_blank\" rel=\"noopener\">✦ Generate a first draft</a>\n        <a href=\"https://wingmate.apps.geaerospace.net/?user_prompt_id=f5ad6e2e-e8c4-455f-88fc-0d90422e6ddc\" target=\"_blank\" rel=\"noopener\">✦ Evaluate Manufacturing Standard Work</a>\n      </div>\n    </div>\n  </div>\n  <div class=\"wmd-foot\">\n    <span class=\"wmd-ask\"><input id=\"wm-input\" placeholder=\"Ask Wingmate&hellip;\" aria-label=\"Ask Wingmate\" onkeydown=\"if(event.key==='Enter')wmSend()\"><button type=\"button\" class=\"wmd-mic\" id=\"wm-mic\" hidden aria-label=\"Search by voice\" onclick=\"wmVoice(this)\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><rect x=\"7\" y=\"2.5\" width=\"6\" height=\"9\" rx=\"3\"/><path d=\"M4.5 9.2a5.5 5.5 0 0 0 11 0\"/><path d=\"M10 14.7V17.5\"/></svg></button><button type=\"button\" class=\"wmd-go\" onclick=\"wmSend()\" aria-label=\"Send\"><svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"M10 16V4.5\"/><path d=\"M5 9.5L10 4.5l5 5\"/></svg></button></span>\n  </div>\n  <div class=\"wmd-note\">Demo &mdash; connects to Wingmate on the GE network.</div>\n</aside>";
  var st=document.createElement('style'); st.setAttribute('data-wm-drawer',''); st.textContent=CSS;
  (document.head||document.documentElement).appendChild(st);
  function mount(){ if(!document.getElementById('wm-drawer')) document.body.insertAdjacentHTML('beforeend',MARKUP); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount); else mount();
})();

(function(){
  var lastFocus=null;
  var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PEND=0; // in-flight replies (busy while > 0)
  var CTX={await:null,last:null}; // multi-turn memory
  function el(id){return document.getElementById(id);}
  function scrollBody(){var b=el('wm-body');if(b)b.scrollTop=b.scrollHeight;}
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

  window.wmOpen=function(){
    var d=el('wm-drawer');if(!d)return;
    if(d.classList.contains('open')){var f=el('wm-input');if(f)f.focus();return;}
    lastFocus=document.activeElement;
    d.classList.add('open');d.setAttribute('aria-hidden','false');
    el('wm-scrim').classList.add('open');
    document.body.classList.add('wm-lock');
    window.setTimeout(function(){var f=el('wm-input');if(f)f.focus();},reduced?0:300);
  };
  window.wmClose=function(){
    var d=el('wm-drawer');if(!d||!d.classList.contains('open'))return;
    d.classList.remove('open');d.setAttribute('aria-hidden','true');
    el('wm-scrim').classList.remove('open');
    document.body.classList.remove('wm-lock');
    if(lastFocus&&lastFocus.focus){try{lastFocus.focus();}catch(e){}}
    lastFocus=null;
  };
  document.addEventListener('keydown',function(e){if(e.key==='Escape')wmClose();});
  // A chip that points into this page closes the drawer first, so the section it reveals is not
  // left under the drawer (Ken, 16 Oct).
  // The click itself is left alone: the page's in-page handler still reveals and scrolls to the section.
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('#wm-drawer a.wm-act[href^="#"]'); if(a) wmClose();
  },true);

  /* ══ Reply helpers ══════════════════════════════════════════════════ */

  var LINKS={
    tmpl:'https://ge.sharepoint.us/sites/flight-deck-activation-hub/SitePages/Templates-Library.aspx?fundamental=standard-work',
    lib:'https://ge.sharepoint.us/sites/flight-deck-activation-hub/SitePages/Templates-Library.aspx?fundamental=standard-work',
    evalGuide:'#lrn-elevate',
    ps:'https://ge.sharepoint.us/sites/flight-deck-activation-hub/SitePages/Problem-Solvingv1.aspx',
    s5page:'https://ge.sharepoint.us/sites/flight-deck-activation-hub/SitePages/5S.aspx',
    wmDraft:'https://wingmate.apps.geaerospace.net/?profile=StandardWorkDraftBuilder',
    wmEval:'https://wingmate.apps.geaerospace.net/?user_prompt_id=f5ad6e2e-e8c4-455f-88fc-0d90422e6ddc'
  };
  var SAMPLE_STD='Torque check, fan case. 1) Get the torque wrench from the shadow board. 2) Check bolts in order A to F. 3) If a bolt is loose, re-torque to spec. 4) Write results on the log sheet. Owner: cell lead. Rev 03/2026.';
  var CHIP_DRAFT={t:'Generate a first draft',q:'Generate a first draft'};
  var CHIP_EVAL={t:'Evaluate a standard',q:'Evaluate my Manufacturing Standard Work'};
  var CHIP_TMPL={t:'Which template should I use?',q:'Which template should I use?'};
  var CHIP_TAKT={t:'Set the takt',q:'Help me set the takt for my standard'};
  var CHIP_LIB={t:'Full template library',href:LINKS.lib};

  function two(n){return n<10?'0'+n:''+n;}
  function fmt(sec){return Math.floor(sec/60)+':'+two(sec%60);}
  function capz(s){s=String(s).trim();return s.charAt(0).toUpperCase()+s.slice(1);}

  /* The wow moment: a plain task description becomes a Content · Sequence · Timing draft */
  function buildDraft(desc){
    var d=desc.replace(/[.!?\s]+$/,'').replace(/^please\s+/i,'').replace(/^(draft|write|create|generate|make)( me)?( a)?( first)?( draft)?( of| for)?\s*/i,'');
    var clauses=d.split(/,|;|\.| then | and then | after that /i).map(function(s){return s.trim();}).filter(function(s){return s.length>2;});
    var mid=clauses.slice(0,4).map(capz);
    if(mid.length<2){mid=['Perform '+d.toLowerCase()+' using the current best-known method','Verify the result against the acceptance criteria before it moves on'];}
    var steps=['Stage tools, parts, and instructions at point of use; confirm the station is set to standard'].concat(mid);
    steps.push(/record|log |log$|document/i.test(d)?'Confirm quality against the standard and reset the station for the next cycle':'Record the result, flag any abnormality, and reset for the next cycle');
    steps=steps.slice(0,6);
    var budget=[95,140,120,105,80],times=[40];
    for(var i=1;i<steps.length;i++)times.push(budget[(i-1)%budget.length]);
    var total=times.reduce(function(a,b){return a+b;},0);
    var title=capz(d.split(/\s+/).slice(0,6).join(' '));
    var rows=steps.map(function(s,i){return '<tr style="animation-delay:'+(i*0.22)+'s"><td>'+((i+1)*10)+'</td><td>'+esc(s)+'</td><td>'+fmt(times[i])+'</td></tr>';}).join('');
    return {
      p:['Here is your first draft, structured the FLIGHT DECK way: <b>Content</b>, <b>Sequence</b>, <b>Timing</b>.'],
      card:'<div class="wm-draft"><div class="wmdft-cap">Draft &middot; '+esc(title)+'</div>'+
        '<table><thead><tr><th>Seq</th><th>Content</th><th>Timing</th></tr></thead><tbody>'+rows+'</tbody>'+
        '<tfoot><tr><td></td><td>Estimated cycle</td><td>'+fmt(total)+'</td></tr></tfoot></table>'+
        '<div class="wmdft-swip">SWIP &middot; carry <b>1 unit</b> in process at this station. Set the real number after your first time observation.</div></div>',
      p2:['This is a starting point, not a finished standard. Walk the process, time each step against reality, then lock it into the template.'],
      chips:[{t:'Open the Standard Work template',href:LINKS.tmpl},{t:'Refine a step',q:'Refine a step in my draft'},{t:'Set the takt for it',q:'Help me set the takt for my standard'}],
      await:null, last:'draft-done'
    };
  }

  /* Score any pasted standard against the four confirmation questions */
  function buildEval(text,nonmfg){
    var hasTiming=/(\d{1,2}:\d{2})|\d+\s*(s|sec|secs|seconds|min|mins|minutes|hr|hours)\b/i.test(text);
    var hasSeq=/(^|\n|\s)\d+[.)]|\bstep\b|first|then|next|finally/i.test(text);
    var hasOwner=/owner|responsible|operator|assigned|lead\b/i.test(text);
    var hasDate=/rev\b|revision|reviewed|updated|version|\d{1,2}\/\d{2,4}/i.test(text);
    var word=nonmfg?'procedure':'standard', place=nonmfg?'in the live workflow':'at the process';
    function row(ok,q,note){return '<div class="wm-evrow '+(ok?'ok':'gap')+'"><span>'+(ok?'✓':'△')+'</span><div><b>'+q+'</b> '+note+'</div></div>';}
    var card='<div class="wm-eval"><div class="wm-evcap">Four confirmation questions</div>'+
      row(true,'Is there a standard?','It is written down. That already beats tribal knowledge.')+
      row(hasDate,'Is it up to date?',hasDate?'A revision marker is visible. Keep it honest at every change.':'No owner or revision date visible. An undated '+word+' is one nobody trusts.')+
      row(hasSeq,'Is it known?',hasSeq?'The sequence reads step by step, so it can train someone.':'The sequence is hard to follow. Number the steps so it teaches itself.')+
      row(false,'Is it followed?','Paper cannot answer this one. Watch a live cycle '+place+' and compare.')+
      '</div>';
    var fixes=[];
    if(!hasTiming)fixes.push('<b>Put a time on every step.</b> Content, Sequence, <b>Timing</b> is the whole standard; without timing you cannot see abnormality.');
    if(!hasOwner)fixes.push('<b>Put one name on the '+word+'.</b> Shared ownership is no ownership.');
    if(!hasDate)fixes.push('<b>Add a revision date and review cadence.</b> A '+word+' unreviewed for six months is out of date.');
    if(fixes.length<2)fixes.push('<b>Tighten each step to day-one clarity.</b> If a new hire would ask a question, the step is missing information.');
    var chips=[{t:'Open the Evaluate guide',href:LINKS.evalGuide},{t:'Draft a cleaner version',q:'Generate a first draft'}];
    if(nonmfg)chips.splice(1,0,{t:'Non-Mfg templates',href:LINKS.lib});
    return {
      p:[nonmfg?'Scored against the same four confirmation questions we use on every SOP, Method Instruction, and Digital Job Instruction:':'Scored against the four confirmation questions we run on every standard:'],
      card:card,
      p2:['Two improvements first: '+fixes[0],fixes[1]],
      chips:chips, await:null, last:'eval-done'
    };
  }

  function tmplBranch(which){
    if(which==='mfg')return {
      p:['That is <b>Manufacturing Standard Work</b>: station-level, with Content, Sequence, Timing and SWIP on one sheet.','If operator and machine time overlap, add the <b>Combination Table</b> so the wait time becomes visible.'],
      chips:[{t:'Open the Mfg Standard Work template',href:LINKS.tmpl},CHIP_LIB,{t:'Draft it from a description',q:'Generate a first draft'}],last:'tmpl-mfg'};
    if(which==='nonmfg')return {
      p:['Use <b>Non-Manufacturing Standard Work</b>: the same discipline, but the flow is information instead of parts.','Capture the sequence, the handoffs, and the target turnaround. Office work hides its abnormalities until you write it down.'],
      chips:[{t:'Open the template library',href:LINKS.lib},{t:'Evaluate my current procedure',q:'Evaluate my Non-Manufacturing Standard Work'}],last:'tmpl-nonmfg'};
    return {
      p:['That is <b>Leader Standard Work</b>: your recurring routines &mdash; tiered huddles, gemba walks, coaching &mdash; on a fixed cadence.','It is the standard that keeps every other standard alive.'],
      chips:[{t:'Open the Leader SW template',href:LINKS.lib},{t:'Review my LSW routine',q:'Review my Leader Standard Work routine'}],last:'tmpl-leader'};
  }

  /* ══ Multi-turn continuations ═══════════════════════════════════════ */

  function strongSwitch(t){return /^(what can you do|who are you|is this real|evaluate my|which template|what template|help me set the takt|generate a first draft|review my leader|recommend a template)/i.test(t);}
  function matchIntent(t){
    for(var i=0;i<INTENTS.length;i++){var it=INTENTS[i];if(it.k.test(t)&&(!it.guard||it.guard(t)))return it;}
    return null;
  }

  var AWAITS={
    'draft':function(t){
      if(strongSwitch(t))return null;
      if(t.length<8||/^(yes|yep|yeah|sure|ok(ay)?|go|please|fine)\b/i.test(t))return {
        p:['Give me the task itself, in one sentence. What happens, and what does &ldquo;done&rdquo; look like?'],
        chips:[{t:'Use the torque check example',q:'Torque check on the fan case bolts, verify each bolt is seated, record the readings'}],await:'draft'};
      return buildDraft(t);
    },
    'eval-mfg':function(t){
      if(strongSwitch(t))return null;
      if(t.length>80)return buildEval(t,false);
      if(matchIntent(t))return null;
      return {p:['Paste the whole thing &mdash; steps, timings, owner, rough is fine. I score what you give me.'],
        chips:[{t:'Use a sample standard',q:SAMPLE_STD}],await:'eval-mfg'};
    },
    'eval-nonmfg':function(t){
      if(strongSwitch(t))return null;
      if(t.length>80)return buildEval(t,true);
      if(matchIntent(t))return null;
      return {p:['Paste the procedure as it exists today &mdash; SOP, Method Instruction, or plain steps. Rough is fine.'],
        chips:[{t:'Use a sample standard',q:SAMPLE_STD}],await:'eval-nonmfg'};
    },
    'tmpl':function(t){
      var low=t.toLowerCase();
      if(/leader|routine|manager|gemba|third|3\b/.test(low))return tmplBranch('leader');
      if(/office|desk|transactional|engineer|service|report|email|admin|second|2\b/.test(low))return tmplBranch('nonmfg');
      if(/station|cell|floor|line|machine|assembly|shop|first|one\b|1\b/.test(low))return tmplBranch('mfg');
      return null;
    },
    'refine':function(t){
      if(strongSwitch(t))return null;
      var m=t.match(/\b(\d{1,2})\b/);var n=m?m[1]:'that';
      return {p:['Rewritten the way a standard should read: lead with the verb, name the tool, and put the check inside the step &mdash; so <i>&ldquo;'+esc(t.split(/\s+/).slice(0,10).join(' '))+'&rdquo;</i> becomes something a new hire can run on day one.',
        'Keep the timing honest for step '+n+': time it three cycles and take the middle value, not the best one.'],
        chips:[{t:'Open the Standard Work template',href:LINKS.tmpl},{t:'Refine another step',q:'Refine a step in my draft'}],last:'refine-done'};
    }
  };

  /* ══ Intent table ═══════════════════════════════════════════════════ */

  var INTENTS=[
    {id:'greet',k:/^(hi|hello|hey|good (morning|afternoon|evening)|yo|howdy)\b/i,guard:function(t){return t.length<28;},r:function(){return {
      p:['Hey &mdash; Wingmate here, briefed by FLIGHT DECK on Standard Work. What are we building today?'],
      chips:[CHIP_DRAFT,CHIP_EVAL,CHIP_TMPL]};}},
    {id:'thanks',k:/^(thanks|thank you|thx|appreciate|perfect|great|awesome|nice|love it)\b/i,guard:function(t){return t.length<32;},r:function(){return {
      p:['Anytime. A standard is only real once it is visible at the process &mdash; go put it where the work happens.'],
      chips:[CHIP_TMPL,{t:'What else can you do?',q:'What can you do?'}]};}},
    {id:'who',k:/who are you|what are you\b|your name|are you a (bot|person|human)/i,r:function(){return {
      p:['<b>FLIGHT DECK Wingmate</b> &mdash; GE Aerospace&rsquo;s assistant, briefed on the fundamentals before you type a word.','On this page I coach Standard Work: recommend the template, draft a first standard from plain language, score one you already have, and set the takt.'],
      chips:[{t:'What can you do?',q:'What can you do?'},CHIP_DRAFT]};}},
    {id:'skeptic',k:/is (this|it) real|actually (work|real)|real ai\b|scripted|canned|fake|what data|which (model|llm)|are you (live|connected|online)|hallucinat|where does .*data|gdpr|secure|security|privacy/i,r:function(){return {
      p:['Straight answer: this preview runs <b>scripted coaching</b> &mdash; nothing you type leaves the page.','The production assistant is <b>Wingmate on the GE network</b>: behind GE SSO, with FLIGHT DECK Standard Work context attached to every ask. What you are testing here is the interaction &mdash; the drawer, the handoff, the coaching voice. The intelligence plugs in on the tenant.'],
      chips:[{t:'✦ Run the real draft builder',href:LINKS.wmDraft,blank:true},{t:'What can you do?',q:'What can you do?'}]};}},
    {id:'help',k:/what can you do|what do you do|capabilit|how can you help|what else|show me what|^help$/i,r:function(){return {
      p:['Four runs, same as the cards on this page: <b>generate a first draft</b> from a plain description, <b>evaluate your Manufacturing standard</b> against the four confirmation questions, <b>evaluate a Non-Manufacturing procedure</b> (SOP, MI, DJI), and <b>review a Leader Standard Work routine</b>.','I also recommend templates and set takt. Ask in your own words &mdash; that is the point.'],
      chips:[CHIP_DRAFT,CHIP_EVAL,CHIP_TAKT]};}},
    {id:'lsw',k:/leader standard work|\blsw\b|leader routine|leaders? (time|calendar)|gemba walk|my routine as a leader/i,r:function(){return {
      p:['Leader Standard Work is where every other standard survives or dies. The pattern that holds: a fixed cadence of tiered huddles, gemba walks, and coaching &mdash; written down, timed, and visible, exactly like a station standard.','Start with your calendar. Mark every recurring commitment, then ask which of them actually checks a standard at the process. Most leaders find the answer is almost none.'],
      chips:[{t:'Analyze my time allocation',q:'Analyze my calendar time allocation'},{t:'Open the Leader SW template',href:LINKS.lib}],last:'lsw'};}},
    {id:'calendar',k:/calendar|time allocation|allocat|how much time should/i,r:function(){return {
      p:['Rough cut that works: <b>a third at the process</b> (huddles, gemba, confirmation), <b>a third coaching</b>, and a third for the business. If meetings eat more than half your week, your standards are running unwatched.','In production, Wingmate reads your calendar export and shows the split against that target. Here, do it with a highlighter: one color per bucket, one week of calendar.'],
      chips:[{t:'Open the Leader SW template',href:LINKS.lib},{t:'Review my LSW routine',q:'Review my Leader Standard Work routine'}],last:'calendar'};}},
    {id:'eval-nonmfg',k:/non.?(manufacturing|mfg)|\bsop\b|method instruction|\bdji\b|digital job instruction|desk procedure|office (standard|procedure)/i,guard:function(t){return /evaluate|assess|update|review|score|improve|check|fix/i.test(t);},r:function(){return {
      p:['Non-manufacturing standards live in <b>SOPs, Method Instructions, and Digital Job Instructions</b> &mdash; the test is exactly the same as the shop floor&rsquo;s.','Paste yours into the chat and I will score it against the four confirmation questions: is there a standard, is it up to date, is it known, is it followed.'],
      chips:[{t:'Use a sample standard',q:SAMPLE_STD}],await:'eval-nonmfg',last:'eval-nonmfg'};}},
    {id:'eval',k:/evaluate|assess|score (my|this)|critique|review (my|this)|update my|already have|existing standard|is my standard|check my/i,r:function(){return {
      p:['Paste your standard into the chat &mdash; rough is fine. I check it against the four confirmation questions we run on every standard: <b>Is there a standard? Is it up to date? Is it known? Is it followed?</b>','Then you get the two improvements that move it most.'],
      chips:[{t:'Use a sample standard',q:SAMPLE_STD}],await:'eval-mfg',last:'eval'};}},
    {id:'refine',k:/refine (a |the )?step|rewrite (a |the )?step|change step|tighten (a |the )?step/i,r:function(){return {
      p:['Which step, and what actually happens on the floor? Give me the step number or paste the line.'],
      chips:[],await:'refine',last:'refine'};}},
    {id:'draft',k:/first draft|generate|draft|write (me )?(a |an )?standard|create (a |an )?standard|build (me )?(a |an )?standard|start a standard|document (a|my|the) (task|process)/i,r:function(){return {
      p:['Good &mdash; that is the fastest way from tribal knowledge to a working standard. <b>Describe the task in a sentence</b>: what happens, where it happens, and what &ldquo;done&rdquo; looks like.','Example: <i>Torque check on the fan case bolts, verify each bolt is seated, record the readings.</i>'],
      chips:[{t:'Use the torque check example',q:'Torque check on the fan case bolts, verify each bolt is seated, record the readings'}],await:'draft',last:'draft'};}},
    {id:'tmpl',k:/which template|what template|recommend|template should|right template|where do i start|which one (do|should)|what form/i,r:function(){return {
      p:['One question first: <b>where does the work happen?</b> That decides the template.'],
      chips:[{t:'At a station or cell',q:'The work happens at a station on the floor'},{t:'Office or transactional',q:'The work is office or transactional'},{t:'A leader routine',q:'It is a leader routine'}],await:'tmpl',last:'tmpl'};}},
    {id:'takt',k:/takt|cycle time|pace|demand rate|how fast (should|do)|target time/i,r:function(){return {
      p:['<b>Takt</b> is the customer&rsquo;s heartbeat: available working time divided by required output. <b>Cycle time</b> is how long your process actually takes. The standard exists to hold the second inside the first.','If cycle beats takt, you have margin. If it does not, that gap is your first improvement target &mdash; and the calculator makes it visible in about a minute.'],
      chips:[{t:'Open the takt calculator',fn:'takt'},{t:'Draft a standard paced to takt',q:'Generate a first draft'}],last:'takt'};}},
    {id:'kaizen',k:/kaizen|recurring|keeps (happening|coming back|breaking)|root cause|problem solving|same (problem|issue|defect)|defect|escape|firefight/i,r:function(){return {
      p:['If the same problem keeps coming back, the standard is not your problem &mdash; <b>the problem is</b>. That is the Problem Solving continuum: contain it, find root cause, then change the standard so it cannot recur.','Standard Work and Problem Solving are one loop. The standard makes the abnormality visible; problem solving removes it; the improved method becomes the new standard.'],
      chips:[{t:'Open Problem Solving',href:LINKS.ps},{t:'Evaluate my current standard',q:'Evaluate my Manufacturing Standard Work'}],last:'kaizen'};}},
    {id:'5s',k:/\b5s\b|\bmess\b|messy|clutter|disorgani[sz]ed|can.?t find|cannot find|looking for (my )?tools|workplace organi[sz]ation/i,r:function(){return {
      p:['Standard Work cannot hold in a workplace that is not set in order &mdash; <b>you cannot standardize a search</b>. Run 5S first: Sort, Set, Shine, Standardize, Sustain.','Once every tool has a home, the standard gets shorter and the timing gets honest on its own.'],
      chips:[{t:'Open the 5S fundamental',href:LINKS.s5page}],last:'5s'};}},
    {id:'swip',k:/\bswip\b|standard (work in|wip)|work in process|how many units/i,r:function(){return {
      p:['<b>SWIP</b> &mdash; standard work in process &mdash; is the count of units that must be in the process for it to flow without waiting. Too little starves the next step; too much hides problems and stretches lead time.','Set it last. Once Content, Sequence, and Timing are stable, SWIP is what the math says it is, not what the shelf happens to hold.'],
      chips:[{t:'Open the takt calculator',fn:'takt'},{t:'Open the Standard Work template',href:LINKS.tmpl}],last:'swip'};}},
    {id:'followed',k:/(won.?t|not|isn.?t|no one|nobody) (be )?(being )?follow|adoption|ignore(s|d)? the standard|sustain|stick to|comply|team (won.?t|doesn.?t)/i,r:function(){return {
      p:['If the standard is not followed, do not laminate it harder. <b>Go watch a cycle</b> and ask which is wrong: the work or the paper. Half the time the standard lost touch with reality, and the operators are quietly running a better method.','Then fix ownership: one name on the standard, confirmed in the leader&rsquo;s routine &mdash; not by audit, by presence.'],
      chips:[{t:'Open the Evaluate guide',href:LINKS.evalGuide},{t:'Review my LSW routine',q:'Review my Leader Standard Work routine'}],last:'followed'};}},
    {id:'detail',k:/how (detailed|long|much detail)|too (long|detailed)|level of detail|granular|every little/i,r:function(){return {
      p:['Detailed enough that someone new could run it on day one without asking a question &mdash; <b>and no more</b>. Most first drafts are too long, not too short.','Keep the steps that protect quality, safety, or timing. Everything else moves to a linked note.'],
      chips:[CHIP_DRAFT,{t:'Open the Standard Work template',href:LINKS.tmpl}],last:'detail'};}},
    {id:'diff',k:/difference between|\bvs\.?\b|versus|mfg or non/i,r:function(){return {
      p:['<b>Manufacturing SW</b> captures physical steps at a station, with cycle times against takt. <b>Non-Manufacturing SW</b> captures information flow &mdash; office, engineering, service. <b>Leader SW</b> captures the routines a leader runs to keep both alive.','Not on the shop floor? Start with Non-Manufacturing.'],
      chips:[CHIP_TMPL,CHIP_LIB],last:'diff'};}},
    {id:'affirm',k:/^(yes|yeah|yep|sure|ok(ay)?|sounds good|do it|go ahead|let.?s go|please)\b/i,guard:function(t){return t.length<22;},r:function(){return {
      p:['Which one shall we run?'],
      chips:[CHIP_DRAFT,CHIP_EVAL,CHIP_TAKT]};}}
  ];

  function fallback(t){
    var snippet=esc(t.replace(/[?!.]+$/,'').split(/\s+/).slice(0,9).join(' '));
    var cands=[
      {c:CHIP_DRAFT,k:/draft|write|creat|start|new|document|capture|record/i},
      {c:CHIP_EVAL,k:/eval|check|score|improve|review|better|audit|good|fix/i},
      {c:CHIP_TMPL,k:/template|form|sheet|file|excel|format|which|kind/i},
      {c:CHIP_TAKT,k:/time|takt|pace|speed|rate|fast|slow|minute/i},
      {c:{t:'Leader Standard Work',q:'Review my Leader Standard Work routine'},k:/lead|manager|routine|calendar|cadence|team/i},
      {c:{t:'What can you do?',q:'What can you do?'},k:/(?:)/}
    ];
    var hits=[],rest=[];
    for(var i=0;i<cands.length;i++){(cands[i].k.test(t)?hits:rest).push(cands[i].c);}
    var chips=hits.concat(rest).slice(0,3);
    return {
      p:['Good question &mdash; &ldquo;'+snippet+'&rdquo; is outside the scripted flight plan of this preview. On the GE network, Wingmate takes it with your FLIGHT DECK Standard Work context already attached.','Closest things I can run for you right now:'],
      chips:chips,last:'fallback'};
  }

  function route(text){
    if(CTX.await&&AWAITS[CTX.await]){
      var r=AWAITS[CTX.await](text);
      if(r)return r;
      CTX.await=null;
    }
    for(var i=0;i<INTENTS.length;i++){
      var it=INTENTS[i];
      if(it.k.test(text)&&(!it.guard||it.guard(text))){var rep=it.r(text);rep.last=rep.last||it.id;return rep;}
    }
    return fallback(text);
  }

  /* ══ Rendering ══════════════════════════════════════════════════════ */

  function chipHtml(c){
    if(c.href)return '<a class="wm-act" href="'+c.href+'"'+(c.blank?' target="_blank" rel="noopener"':'')+'>'+c.t+'</a>';
    if(c.fn==='takt')return '<button class="wm-act" type="button" data-chip="takt">'+c.t+'</button>';
    return '<button class="wm-act" type="button" data-q="'+esc(c.q)+'" data-chip="ask">'+c.t+'</button>';
  }
  function tokens(p){return p.match(/<(b|i)>.*?<\/\1>[^\s<]*|\S+/g)||[];}
  function addUser(text){
    var b=el('wm-body');
    var intro=el('wm-intro');if(intro)intro.remove();
    var olds=b.querySelectorAll('.wm-chips');for(var i=0;i<olds.length;i++)olds[i].remove();
    var d=document.createElement('div');d.className='wm-msg user';d.textContent=text;
    b.appendChild(d);scrollBody();
  }
  function showTyping(){
    if(el('wm-typing'))return;
    var t=document.createElement('div');t.className='wm-typing';t.id='wm-typing';t.setAttribute('aria-hidden','true');t.innerHTML='<i></i><i></i><i></i>';
    el('wm-body').appendChild(t);scrollBody();
  }
  function settle(rep){
    CTX.await=rep.await||null;
    if(rep.last)CTX.last=rep.last;
    PEND=Math.max(0,PEND-1);
  }
  function streamReply(rep){
    var t=el('wm-typing');if(t)t.remove();
    var b=el('wm-body');
    var d=document.createElement('div');d.className='wm-msg bot';
    b.appendChild(d);
    var paras=(rep.p||[]).slice();
    function finish(){
      if(rep.card)d.insertAdjacentHTML('beforeend',rep.card);
      if(rep.p2)for(var i=0;i<rep.p2.length;i++)d.insertAdjacentHTML('beforeend','<p>'+rep.p2[i]+'</p>');
      if(rep.act)d.insertAdjacentHTML('beforeend',rep.act);
      if(rep.chips&&rep.chips.length){
        var c=document.createElement('div');c.className='wm-chips';
        c.innerHTML=rep.chips.map(chipHtml).join('');
        b.appendChild(c);
      }
      settle(rep);scrollBody();
      window.setTimeout(scrollBody,reduced?0:450);
    }
    if(reduced){
      d.innerHTML=paras.map(function(p){return '<p>'+p+'</p>';}).join('');
      finish();return;
    }
    var pi=0,wi=0,cur=null,words=null;
    var iv=setInterval(function(){
      if(pi>=paras.length){clearInterval(iv);finish();return;}
      if(wi===0){cur=document.createElement('p');d.appendChild(cur);words=tokens(paras[pi]);}
      var s=document.createElement('span');s.className='w';s.innerHTML=words[wi]+' ';
      cur.appendChild(s);
      requestAnimationFrame(function(){requestAnimationFrame(function(){s.classList.add('in');});});
      scrollBody();
      wi+=1;if(wi>=words.length){wi=0;pi+=1;}
    },46);
  }
  window.wmAsk=function(text){
    if(!text||!String(text).trim())return;
    wmOpen();
    text=String(text).trim();
    addUser(text);
    PEND+=1;
    /* Live when GE's endpoint is configured (?wmapi=… or WingmateChat.configure),
       the scripted answers otherwise, so the demo never regresses while we wait
       on a key. Same drawer either way. */
    if(window.WingmateChat&&WingmateChat.isReady()){
      showTyping();
      var esc=function(x){return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');};
      var asParas=function(x){return {p:String(x||'').trim().split(/\n{2,}/).filter(Boolean).map(esc)};};
      WingmateChat.ask(text).then(function(reply){
        streamReply(asParas(reply));
      }).catch(function(err){
        streamReply(asParas('Wingmate could not answer that. '+(err&&err.message?err.message:'')));
      });
      return;
    }
    var rep=route(text);
    window.setTimeout(showTyping,reduced?0:380);
    window.setTimeout(function(){streamReply(rep);},reduced?0:1000+Math.min(text.length*3,800));
  };
  window.wmSend=function(){
    var f=el('wm-input');if(!f)return;
    var v=f.value;f.value='';
    wmAsk(v);
  };

  /* ══ Hands-free presentation mode (?autodemo=1 or the Play button) ══ */

  var AUTO={on:false,t:[]};
  var SCRIPT=[
    {say:'Which template should I use?'},
    {chip:/station or cell/i},
    {say:'Generate a first draft'},
    {say:'Torque check on the fan case bolts, verify each bolt is seated, record the readings'},
    {say:'Evaluate my Manufacturing Standard Work'},
    {chip:/sample standard/i},
    {say:'Help me set the takt for my standard'},
    {chip:/takt calculator/i,pause:2000}
  ];
  var stepIdx=0;
  function aClear(){for(var i=0;i<AUTO.t.length;i++)clearTimeout(AUTO.t[i]);AUTO.t=[];}
  function aWait(ms,fn){AUTO.t.push(window.setTimeout(function(){if(AUTO.on)fn();},reduced?Math.min(ms,120):ms));}
  function aIdle(fn){
    var n=0;
    (function poll(){
      if(!AUTO.on)return;
      if(PEND===0&&!el('wm-typing')){fn();return;}
      if(++n>160){autoStop();return;}
      AUTO.t.push(window.setTimeout(poll,150));
    })();
  }
  function aType(text,fn){
    var f=el('wm-input');if(!f){autoStop();return;}
    f.value='';
    if(reduced){f.value=text;aWait(120,fn);return;}
    var i=0;
    (function tick(){
      if(!AUTO.on)return;
      f.value=text.slice(0,++i);
      if(i<text.length){AUTO.t.push(window.setTimeout(tick,30+Math.floor(Math.random()*28)));}
      else{aWait(420,fn);}
    })();
  }
  function runStep(){
    if(!AUTO.on)return;
    var s=SCRIPT[stepIdx++];
    if(!s){autoStop(true);return;}
    aIdle(function(){aWait(s.pause||1400,function(){
      if(!AUTO.on)return;
      if(s.say){aType(s.say,function(){if(!AUTO.on)return;wmSend();runStep();});}
      else if(s.chip){
        var btns=el('wm-body').querySelectorAll('.wm-chips .wm-act');
        var m=null;
        for(var i=0;i<btns.length;i++){if(s.chip.test(btns[i].textContent)){m=btns[i];break;}}
        if(m){m.classList.add('pulse');aWait(650,function(){if(!AUTO.on)return;m.click();runStep();});}
        else{runStep();}
      }else{runStep();}
    });});
  }
  function userInterrupt(e){
    if(!AUTO.on)return;
    if(e&&e.isTrusted===false)return;
    autoStop();
  }
  function autoStop(done){
    if(!AUTO.on)return;
    AUTO.on=false;aClear();
    document.removeEventListener('pointerdown',userInterrupt,true);
    document.removeEventListener('keydown',userInterrupt,true);
    var p=el('wm-play');if(p)p.innerHTML='&#9654; Play the demo';
    if(!done){var f=el('wm-input');if(f)f.value='';}
  }
  function preRoll(done){
    window.scrollTo({top:0,behavior:'auto'});
    aWait(1000,function(){
      var card=document.querySelector('#sw-b .sm-action.sa-wing');
      if(!card){done();return;}
      card.scrollIntoView({behavior:reduced?'auto':'smooth',block:'center'});
      aWait(1600,function(){
        card.classList.add('ad-press');
        aWait(750,function(){
          card.classList.remove('ad-press');
          card.click();
          aWait(1800,function(){
            var pill=document.querySelector('.wingband .wb-open');
            if(pill){pill.classList.add('ad-press');aWait(700,function(){pill.classList.remove('ad-press');done();});}
            else done();
          });
        });
      });
    });
  }
  window.wmAutoDemo=function(){
    if(AUTO.on){autoStop();return;}
    AUTO.on=true;stepIdx=0;
    var p=el('wm-play');if(p)p.innerHTML='&#9632; Stop';
    window.setTimeout(function(){
      document.addEventListener('pointerdown',userInterrupt,true);
      document.addEventListener('keydown',userInterrupt,true);
    },80);
    if(el('wm-drawer').classList.contains('open')){aWait(800,runStep);return;}
    preRoll(function(){if(!AUTO.on)return;wmOpen();aWait(900,runStep);});
  };
  if(/[?&]autodemo=1/.test(location.search)){
    window.setTimeout(function(){wmAutoDemo();},700);
  }


  /* Delegated: a handler attribute inside JS-built markup does not reach the kit
     rewrite and GCC High's CSP refuses it on the tenant, silently. */
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('[data-chip]'):null;
    if(!b)return;
    if(b.getAttribute('data-chip')==='takt'){wmClose();if(window.openTakt)openTakt();return;}
    wmAsk(b.getAttribute('data-q'));
  });

  /* test hooks */
  window.__wm={get busy(){return PEND>0;},get auto(){return AUTO.on;},ctx:CTX};
})();

/* ?wmapi=<base>&wmkey=<key>&wmkb=<knowledge base> points the drawer at a live
   endpoint. Nothing is hardcoded and no key is committed. */
(function(){
  var q=new URLSearchParams(location.search), base=q.get('wmapi');
  if(!base||!window.WingmateChat)return;
  WingmateChat.configure({base:base, key:q.get('wmkey')||'', knowledgeBase:q.get('wmkb')||'flight-deck'});
})();

  /* Dictate into the ask box. The button is hidden unless the browser has the API, so it
     cannot promise a microphone it does not have, and a denied permission turns it off
     again rather than leaving it lit. */
  window.wmVoice=function(btn){
    var SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR) return;
    var f=document.getElementById('wm-input'); if(!f) return;
    if(btn._rec){ btn._rec.stop(); return; }
    var r=new SR(); r.lang='en-US'; r.interimResults=true; r.continuous=false;
    btn._rec=r; btn.classList.add('on');
    r.onresult=function(e){ var t=''; for(var i=0;i<e.results.length;i++) t+=e.results[i][0].transcript; f.value=t; };
    r.onerror=function(){ btn.classList.remove('on'); btn._rec=null; };
    r.onend=function(){ btn.classList.remove('on'); btn._rec=null; f.focus(); };
    try{ r.start(); }catch(e){ btn.classList.remove('on'); btn._rec=null; }
  };
  /* Show the mic only once the DOM is there: this block is appended to a script that can
     run before the drawer's own markup. */
  (function(){ function showMic(){ var m=document.getElementById('wm-mic');
      if(m&&(window.SpeechRecognition||window.webkitSpeechRecognition)) m.hidden=false; }
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',showMic); else showMic(); })();

  /* Open Wingmate in its own window so it can float beside the page. The address is a
     fixed value on the button, never assembled, so the SharePoint build can rewrite it. */
  window.wmPop=function(btn){
    var to=btn.getAttribute('data-pop'); if(!to) return;
    window.open(to,'fdwingmate','width=460,height=760,menubar=no,toolbar=no,location=no,status=no');
  };

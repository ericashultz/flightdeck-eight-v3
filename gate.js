/* Flight Deck OS — branded preview gate (client-side soft gate).
   Added to top-level pages only; concept pages stay open so the deck's
   embedded live previews keep working. */
(function () {
  var PW = 'flightdeck2026';

  /* Gate held open until 2026-09-02 11:17 MDT (17:17 UTC). Set for a six-hour
     window on 2 Sep; it re-arms on its own when the clock passes OPEN_UNTIL, so
     the site is never left unlocked by forgetting to put it back. To close it
     early, set OPEN_UNTIL to 0 and redeploy. */
  var OPEN_UNTIL = 1788369479512;
  if (Date.now() < OPEN_UNTIL) return;

  function unlocked() {
    try { return localStorage.getItem('fd_unlocked') === '1'; } catch (e) { return false; }
  }
  function remember() {
    try { localStorage.setItem('fd_unlocked', '1'); } catch (e) {}
  }

  /* Review contexts open straight to the page. markup.io serves the hub through
     its own proxy origin, so a reviewer's unlock never travels with them and
     they would land on this gate instead of the page they were asked to comment
     on. Recognised: the proxy origin itself, an embed whose parent is markup.io,
     and a ?review=1 link for anyone reviewing outside the tool. */
  function isReview() {
    try {
      if (/(^|\.)markup\.io$/i.test(location.hostname)) return true;
      if (/(^|[?&])review=1(&|$)/.test(location.search)) return true;
      var ao = location.ancestorOrigins;
      if (ao) for (var i = 0; i < ao.length; i++) {
        if (/(^|\.)markup\.io$/i.test(new URL(ao[i]).hostname)) return true;
      }
      if (window.top !== window.self && /^https?:\/\/([^/]*\.)?markup\.io(\/|$)/i.test(document.referrer || '')) return true;
    } catch (e) {}
    return false;
  }

  if (unlocked()) return;
  if (isReview()) { remember(); return; }

  var css = '' +
  '#fdgate{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:32px;overflow:hidden;' +
    'font-family:"GE Sans","Geist",-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;color:#fff;background:#00003D}' +
  '#fdgate *{box-sizing:border-box}' +
  '#fdgate .fdg-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}' +
  '#fdgate::before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,30,.55) 0%,rgba(0,0,34,.74) 55%,rgba(0,0,40,.92) 100%);z-index:1}' +
  '#fdgate .fdg-top{position:absolute;top:34px;left:0;right:0;z-index:2;display:flex;align-items:center;justify-content:center;gap:11px}' +
  '#fdgate .fdg-ge{display:inline-block;height:22px;width:93px;background:#fff;-webkit-mask:url(/assets/brand/ge-aerospace-logo.svg) center/contain no-repeat;mask:url(/assets/brand/ge-aerospace-logo.svg) center/contain no-repeat}' +
  '#fdgate .fdg-bttr{display:inline-block;height:13px;width:31px;background:#fff;-webkit-mask:url(/assets/brand/bttr-logo.svg) center/contain no-repeat;mask:url(/assets/brand/bttr-logo.svg) center/contain no-repeat}' +
  '#fdgate .fdg-x{color:rgba(255,255,255,.5);font-size:13px}' +
  '#fdgate .fdg-card{position:relative;z-index:2;width:100%;max-width:520px;text-align:center}' +
  '#fdgate .fdg-eyebrow{font-family:"Geist Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#9fb4e8;margin-bottom:20px}' +
  '#fdgate h1{font-size:clamp(40px,6vw,64px);font-weight:400;letter-spacing:-.03em;line-height:1;margin:0 0 14px;color:#fff;text-shadow:0 2px 30px rgba(0,0,20,.5)}' +
  '#fdgate .fdg-sub{font-size:16px;color:rgba(255,255,255,.72);margin:0 auto 34px;max-width:38ch;line-height:1.5}' +
  '#fdgate form{display:flex;align-items:center;gap:8px;max-width:420px;margin:0 auto;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);border-radius:100px;padding:6px 6px 6px 22px;transition:border-color .15s,background .15s}' +
  '#fdgate form:focus-within{border-color:rgba(255,255,255,.5);background:rgba(255,255,255,.14)}' +
  '#fdgate input{flex:1;min-width:0;background:transparent;border:0;outline:0;color:#fff;font:inherit;font-size:16px;letter-spacing:.02em}' +
  '#fdgate input::placeholder{color:rgba(255,255,255,.5)}' +
  '#fdgate button{flex:none;width:44px;height:44px;border-radius:50%;border:0;background:#fff;color:#00003D;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .12s}' +
  '#fdgate button:hover{transform:translateX(2px)}' +
  '#fdgate .fdg-err{min-height:18px;margin-top:16px;font-size:13px;color:#ffd2a8;letter-spacing:.01em}' +
  '#fdgate .fdg-foot{position:absolute;bottom:30px;left:0;right:0;z-index:2;text-align:center;font-family:"Geist Mono",ui-monospace,monospace;font-size:11px;letter-spacing:.08em;color:rgba(255,255,255,.5)}' +
  '#fdgate .fdg-foot a{color:rgba(255,255,255,.78);text-decoration:none}' +
  '#fdgate .fdg-foot a:hover{color:#fff}' +
  '#fdgate .shake{animation:fdgshake .4s}' +
  '@keyframes fdgshake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}';

  var style = document.createElement('style');
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  var ov = document.createElement('div');
  ov.id = 'fdgate';
  ov.innerHTML =
    '<video class="fdg-bg" autoplay muted loop playsinline preload="auto" src="/assets/hero/gate-bg.mp4"></video>' +
    '<div class="fdg-top"><span class="fdg-ge" role="img" aria-label="GE Aerospace"></span><span class="fdg-x">&times;</span><span class="fdg-bttr" role="img" aria-label="Bttr."></span></div>' +
    '<div class="fdg-card">' +
      '<div class="fdg-eyebrow">Confidential</div>' +
      '<h1>Flight Deck OS</h1>' +
      '<p class="fdg-sub">Foundation + Intelligence</p>' +
      '<form autocomplete="off"><input type="text" placeholder="Password" aria-label="Password" autocomplete="off" autocapitalize="off" spellcheck="false"><button type="submit" aria-label="Unlock">&rarr;</button></form>' +
      '<div class="fdg-err" role="alert"></div>' +
    '</div>' +
    '<div class="fdg-foot">For access, <a href="mailto:becca@makebttr.com?subject=Flight%20Deck%20OS%20access">contact the team</a></div>';

  document.documentElement.appendChild(ov);
  document.documentElement.style.overflow = 'hidden';

  function wire() {
    var form = ov.querySelector('form'), inp = ov.querySelector('input'), err = ov.querySelector('.fdg-err'), card = ov.querySelector('.fdg-card');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (inp.value.trim().toLowerCase() === PW) {
        remember();
        ov.parentNode && ov.parentNode.removeChild(ov);
        document.documentElement.style.overflow = '';
      } else {
        err.textContent = 'Incorrect password. Try again.';
        inp.value = '';
        card.classList.add('shake');
        setTimeout(function () { card.classList.remove('shake'); }, 420);
        inp.focus();
      }
    });
    inp.focus();
  }
  if (document.readyState !== 'loading') wire();
  else document.addEventListener('DOMContentLoaded', wire);
})();

/* Flight Deck — shared Learn It preview modal.
   Each page sets window.LRN_META (title -> {format,length,audience,use}) before this loads,
   and includes the #lrn-modal markup. Cards call openLearnPreview(cover). */
(function () {
  var META = window.LRN_META || {};
  function $(id){ return document.getElementById(id); }

  window.openLearnPreview = function (el) {
    var card = el.closest('.next-card'); if (!card) return;
    var title = (card.querySelector('.nc-title') || {}).textContent || 'Resource';
    var eyebrow = (card.querySelector('.nc-eyebrow') || {}).textContent || '';
    var desc = (card.querySelector('.nc-desc') || {}).textContent || '';
    var coverEl = card.querySelector('.nc-cover');
    var vid = card.getAttribute('data-video');
    var doc = card.getAttribute('data-doc');
    $('lrn-title').textContent = title;
    $('lrn-eyebrow').textContent = eyebrow;
    $('lrn-desc').textContent = desc;
    // every document-type card opens the full-size preview; only videos keep the player layout (16:9)
    var pages = card.getAttribute('data-doc-pages');
    var pcount = parseInt(card.getAttribute('data-doc-count') || '0', 10);
    $('lrn-modal').classList.toggle('doc', !vid);
    $('lrn-modal').classList.toggle('vid', !!vid);
    if (vid) {
      $('lrn-thumb').innerHTML = '<iframe src="https://player.geaerospace.vimeo.work/video/' + vid + '" style="position:absolute;inset:0;width:100%;height:100%;border:0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
      window.__lrnPager = null;
    } else if (pages && pcount) {
      window.__lrnPager = { base: pages, count: pcount, cur: 1 };
      $('lrn-thumb').innerHTML = '<div class="docpager"><img id="lrn-pg" src="' + pages + '1.jpg" alt="Document page">'
        + '<button class="dp-btn dp-prev" type="button" aria-label="Previous page">&#8592;</button>'
        + '<button class="dp-btn dp-next" type="button" aria-label="Next page">&#8594;</button>'
        + '<div class="dp-count" id="lrn-pgc">1 / ' + pcount + '</div></div>';
      document.querySelector('#lrn-modal .dp-prev').addEventListener('click', function () { window.lrnPage(-1); });
      document.querySelector('#lrn-modal .dp-next').addEventListener('click', function () { window.lrnPage(1); });
      window.lrnPage(0);
    } else if (doc) {
      window.__lrnPager = null;
      $('lrn-thumb').innerHTML = '<iframe class="docframe" src="' + doc + '#view=FitH" title="Document preview"></iframe>';
    } else {
      window.__lrnPager = null;
      $('lrn-thumb').innerHTML = coverEl ? coverEl.innerHTML : '';
    }

    var m = META[title] || {};
    $('lrn-meta').innerHTML = [['Format', m.format], ['Length', m.length], ['For', m.audience]]
      .filter(function (p) { return p[1]; })
      .map(function (p) { return '<span class="chip">' + p[0] + ' <b>' + p[1] + '</b></span>'; }).join('');
    $('lrn-use').textContent = m.use || '';

    var cta = $('lrn-cta'), full = $('lrn-full'), dl = $('lrn-download');
    cta.classList.remove('disabled'); full.style.display = 'none'; dl.style.display = 'inline-flex';
    var mainHref = '#';

    if (card.classList.contains('nc-disabled')) {
      cta.textContent = 'In development'; cta.removeAttribute('href'); cta.classList.add('disabled'); dl.style.display = 'none';
    } else if (card.classList.contains('nc-multi')) {
      var links = card.querySelectorAll('.nc-links a');
      cta.textContent = links[0].textContent.replace('→', '').trim(); cta.setAttribute('href', links[0].getAttribute('href'));
      full.textContent = links[1].textContent.replace('→', '').trim(); full.setAttribute('href', links[1].getAttribute('href')); full.style.display = 'inline-block';
      mainHref = links[0].getAttribute('href'); dl.style.display = 'none';
    } else {
      var main = card.querySelector('.nc-arrow');
      if (main) { cta.textContent = main.textContent.replace('→', '').trim(); cta.setAttribute('href', main.getAttribute('href')); mainHref = main.getAttribute('href'); }
    }
    window.__lrnLink = mainHref; dl.setAttribute('href', mainHref);
    window.__lrnTitle = title.trim();
    // avoid a duplicate button when the primary action already IS a download
    if (cta.textContent && cta.textContent.trim().toLowerCase() === 'download') dl.style.display = 'none';
    // A course or a video is opened, not downloaded, and the Download button was
    // pointing at the same registration or Vimeo link as the primary action. Offer
    // it only when the target really is a file.
    if (!/\.(pdf|docx?|xlsx?|pptx?)(\?|#|$)/i.test(mainHref)) dl.style.display = 'none';
    // nothing sits behind this card yet: a Download button that goes nowhere reads
    // as broken, so drop it and let the primary action say where the card stands
    if (mainHref === '#') {
      dl.style.display = 'none';
      cta.textContent = 'Not ready yet'; cta.removeAttribute('href'); cta.classList.add('disabled');
    }
    $('lrn-modal').classList.add('open');
  };

  window.closeLearnPreview = function () { $('lrn-modal').classList.remove('open'); };

  window.copyLearnLink = function () {
    // A video or a course copies a link back to this page with ?preview=<title>, which reopens this
    // card here, the same deep link the hub's shared pop-up uses (Becca and Anam, 19 Oct: Copy link
    // took people to Vimeo). A real file still copies the file's own address.
    var isFile = /\.(pdf|docx?|xlsx?|pptx?)(\?|#|$)/i.test(window.__lrnLink || '');
    var url = (!isFile && window.__lrnTitle)
      ? location.origin + location.pathname + '?preview=' + encodeURIComponent(window.__lrnTitle)
      : ((window.__lrnLink && window.__lrnLink !== '#') ? window.__lrnLink : location.href);
    var abs = url; try { abs = new URL(url, location.href).href; } catch (e) {}
    var btn = $('lrn-share');
    var flash = function () {
      btn.textContent = '\u2713 Copied'; btn.classList.add('copied');
      setTimeout(function () { btn.innerHTML = '\u2909 Copy link'; btn.classList.remove('copied'); }, 1800);
    };
    // A cross-origin review frame blocks both the async clipboard API and the
    // selection copy, and both fail silently, so the button used to claim success
    // without copying. When neither works, put the link on screen already selected
    // so it can be copied by hand.
    var reveal = function () {
      var host = btn.parentNode, old = host.querySelector('.lrn-copyfall');
      if (old) host.removeChild(old);
      var box = document.createElement('input');
      box.type = 'text'; box.readOnly = true; box.value = abs; box.className = 'lrn-copyfall';
      box.style.cssText = 'flex:1 1 220px;min-width:0;font-size:12px;padding:8px 10px;border:1px solid #2256e6;border-radius:8px;color:#00003d;background:#f6f8ff';
      host.appendChild(box); box.focus(); box.select(); box.setSelectionRange(0, box.value.length);
      btn.textContent = 'Press \u2318C to copy';
      setTimeout(function () { btn.innerHTML = '\u2909 Copy link'; }, 4000);
    };
    var legacy = function () {
      var ta = document.createElement('textarea');
      ta.value = abs; ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, ta.value.length);
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
      if (ok) flash(); else reveal();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(abs).then(flash, legacy);
    } else { legacy(); }
  };

  window.lrnPage = function (d) {
    var p = window.__lrnPager; if (!p) return;
    p.cur = Math.min(p.count, Math.max(1, p.cur + d));
    var img = $('lrn-pg'); if (img) img.setAttribute('src', p.base + p.cur + '.jpg');
    var c = $('lrn-pgc'); if (c) c.textContent = p.cur + ' / ' + p.count;
    var pr = document.querySelector('#lrn-modal .dp-prev'), nx = document.querySelector('#lrn-modal .dp-next');
    if (pr) pr.disabled = (p.cur === 1);
    if (nx) nx.disabled = (p.cur === p.count);
  };

  // Arriving with ?preview=<title> reopens that card.
  function openFromUrl() {
    // Only where this page carries the design's own pop-up. On SharePoint the kit swaps in its shared
    // one, which reads ?preview= itself, and calling into a missing modal threw and stopped the page.
    if (!$('lrn-modal') || !$('lrn-title')) return;
    var m = /[?&]preview=([^&#]+)/.exec(location.search); if (!m) return;
    var want = decodeURIComponent(m[1].replace(/\+/g, ' ')).trim().toLowerCase();
    var cards = document.querySelectorAll('.next-card');
    for (var i = 0; i < cards.length; i++) {
      var t = ((cards[i].querySelector('.nc-title') || {}).textContent || '').trim().toLowerCase();
      if (t === want) { window.openLearnPreview(cards[i].querySelector('.nc-cover') || cards[i]); return; }
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', openFromUrl); else openFromUrl();

  // SharePoint keeps one window and one document across pages, so this listener outlives the page
  // that added it: bind it once, and do nothing on a page with no pop-up (the homepage threw on
  // every key press). Ken, 21 Oct.
  if (!window.__lrnKeysBound) {
    window.__lrnKeysBound = true;
    document.addEventListener('keydown', function (e) {
      var modal = $('lrn-modal');
      if (!modal) return;
      if (e.key === 'Escape') window.closeLearnPreview();
      if (!modal.classList.contains('open')) return;
      if (e.key === 'ArrowRight') window.lrnPage(1);
      if (e.key === 'ArrowLeft') window.lrnPage(-1);
    });
  }
})();

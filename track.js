// Flight Deck visit beacon. Emails Donny via /api/track when a page loads.
// Skips localhost / file:// / preview deploys. Debounces to one ping per
// page per session per hour so refresh-spammers don't flood the inbox.
(function () {
  if (typeof window === 'undefined') return;
  var h = location.hostname;
  if (h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || location.protocol === 'file:') return;

  var KEY = 'fd_track_' + location.pathname;
  var TTL = 60 * 60 * 1000; // 1h
  try {
    var last = parseInt(sessionStorage.getItem(KEY) || '0', 10);
    if (last && Date.now() - last < TTL) return;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch (_) {}

  var data = JSON.stringify({
    page: location.pathname + location.search,
    referrer: document.referrer || null,
  });

  var url = '/api/track';

  function fire() {
    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([data], { type: 'application/json' });
        if (navigator.sendBeacon(url, blob)) return;
      }
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true,
        credentials: 'omit',
      }).catch(function () {});
    } catch (_) {}
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(fire, 50);
  } else {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(fire, 50); });
  }
})();

/* FLIGHT DECK Wingmate chat client.
 *
 * Speaks GE's Chat API v1 exactly as the spec describes it, so the only thing that
 * changes when the real endpoint lands is the base URL and the key:
 *
 *   POST <base>/api/v1/chat   {"prompt": "..."}
 *   X-Knowledge-Base   required
 *   X-Conversation-Id  omitted on the first turn, echoed back after
 *   200 streams raw UTF-8 text/plain, no envelope, no per-chunk framing,
 *       the end of the body IS the completion signal
 *   errors arrive in TWO shapes: {"error":{type,message,param}} from the endpoint's
 *       own validation, {"status","detail"} from the auth middleware
 *
 * Configure before use:
 *   WingmateChat.configure({ base: 'http://localhost:3010', key: '…', knowledgeBase: 'flight-deck' })
 * With no base configured, isReady() is false and the page keeps its scripted demo.
 */
(function (global) {
  var CFG = { base: '', key: '', knowledgeBase: 'flight-deck' };
  var conversationId = null;

  function configure(o) {
    if (!o) return;
    if (o.base !== undefined) CFG.base = String(o.base).replace(/\/+$/, '');
    if (o.key !== undefined) CFG.key = String(o.key);
    if (o.knowledgeBase) CFG.knowledgeBase = String(o.knowledgeBase);
  }
  function isReady() { return !!CFG.base; }
  function reset() { conversationId = null; }

  /* Both error shapes, read into one thing a caller can show. */
  function readError(status, text) {
    var msg = '';
    try {
      var j = JSON.parse(text);
      if (j && j.error && j.error.message) msg = j.error.message;
      else if (j && j.detail) msg = j.detail;
    } catch (e) { /* not JSON; fall through to the status */ }
    var err = new Error(msg || ('Wingmate returned ' + status));
    err.status = status;
    return err;
  }

  /* ask(prompt, onChunk) -> Promise<string>
   * onChunk receives text as it arrives, so the caller can render a live reply.
   * Resolves with the whole reply when the body ends. */
  function ask(prompt, onChunk) {
    if (!isReady()) return Promise.reject(new Error('Wingmate chat is not configured'));
    if (!prompt || !String(prompt).trim()) return Promise.reject(new Error('Prompt is empty'));

    var headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + CFG.key,
      'X-Knowledge-Base': CFG.knowledgeBase
    };
    if (conversationId) headers['X-Conversation-Id'] = conversationId;

    return fetch(CFG.base + '/api/v1/chat', {
      method: 'POST', headers: headers, body: JSON.stringify({ prompt: String(prompt) })
    }).then(function (res) {
      var id = res.headers.get('X-Conversation-Id');
      if (id) conversationId = id;
      if (!res.ok) return res.text().then(function (t) { throw readError(res.status, t); });

      /* No framing to parse. Read the body until it ends. */
      if (!res.body || !res.body.getReader) {
        return res.text().then(function (t) { if (onChunk) onChunk(t); return t; });
      }
      var reader = res.body.getReader();
      var dec = new TextDecoder('utf-8');
      var all = '';
      return (function pump() {
        return reader.read().then(function (r) {
          if (r.done) { all += dec.decode(); return all; }
          var piece = dec.decode(r.value, { stream: true });
          if (piece) { all += piece; if (onChunk) onChunk(piece); }
          return pump();
        });
      })();
    });
  }

  global.WingmateChat = {
    configure: configure,
    isReady: isReady,
    ask: ask,
    reset: reset,
    conversationId: function () { return conversationId; }
  };
})(window);

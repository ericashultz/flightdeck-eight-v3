/* FDPreview: show a template's real contents inside a preview box.

   Excel (xlsx, xlsm, xlsb)  the workbook itself, one tab per sheet, first 60 rows by 16 columns
   Word (docx)               the document, rendered to HTML
   PDF                       the browser's own PDF view
   PowerPoint (pptx)         every slide's text, slide by slide
   anything else, or a file that will not open: the fallback markup the caller passes in

   The three readers load from cdnjs the first time a file of that kind is opened, and only then.

   FDPreview.render(host, {file: '/assets/…/x.xlsx', name: 'Template name', fallback: '<html>'}) */
(function(){
  var LIBS = {
    xlsx: 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    docx: 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
    pptx: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'
  };
  var loaded = {};
  function load(url){
    if (!loaded[url]) loaded[url] = new Promise(function(ok, no){
      var s = document.createElement('script'); s.src = url; s.onload = ok; s.onerror = no;
      document.head.appendChild(s);
    });
    return loaded[url];
  }
  function kind(file){
    var m = /\.([a-z0-9]+)(?:[?#]|$)/i.exec(file || ''); var e = m ? m[1].toLowerCase() : '';
    if (/^xls[xmb]?$/.test(e)) return 'xlsx';
    if (e === 'docx') return 'docx';
    if (e === 'pdf') return 'pdf';
    if (e === 'pptx') return 'pptx';
    return '';
  }
  function url(file){ try { return /%[0-9a-f]{2}/i.test(file) ? file : encodeURI(file); } catch(e){ return file; } }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function bytes(file){
    return fetch(url(file)).then(function(r){ if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); });
  }

  var CSS = '' +
    '.fdp{position:absolute;inset:0;display:flex;flex-direction:column;background:#f4f7fd;font-family:inherit}' +
    '.fdp-bar{flex:none;display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid #e7ebf4;background:#fff;font-size:12px;color:#6b7392;min-width:0}' +
    '.fdp-bar b{font-size:9px;font-weight:800;letter-spacing:.04em;color:#fff;border-radius:3px;padding:2px 5px;flex:none}' +
    '.fdp-bar span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}' +
    '.fdp-bar a{margin-left:auto;flex:none;color:#2256e6;font-weight:600;text-decoration:none}' +
    '.fdp-body{flex:1;min-height:0;overflow:auto;-webkit-overflow-scrolling:touch}' +
    '.fdp-wait{height:100%;display:grid;place-items:center;font-size:13px;color:#8f97b3}' +
    '.fdp-wait i{display:block;width:26px;height:26px;margin:0 auto 10px;border-radius:50%;border:2.5px solid #dbe3f3;border-top-color:#2256e6;animation:fdp-spin .7s linear infinite}' +
    '@keyframes fdp-spin{to{transform:rotate(360deg)}}' +
    '.fdp-tabs{flex:none;display:flex;gap:2px;padding:0 10px;background:#eef1f8;border-top:1px solid #e1e6f2;overflow-x:auto}' +
    '.fdp-tabs button{flex:none;font:inherit;font-size:11.5px;color:#44496e;background:none;border:0;border-bottom:2px solid transparent;padding:7px 10px;cursor:pointer;white-space:nowrap}' +
    '.fdp-tabs button.on{background:#fff;color:#1d6f42;font-weight:600;border-bottom-color:#1d6f42}' +
    '.fdp-sheet table{border-collapse:collapse;font-size:11.5px;color:#1f2433;background:#fff;min-width:100%}' +
    '.fdp-sheet td,.fdp-sheet th{border:1px solid #e3e7ef;padding:4px 7px;white-space:nowrap;max-width:260px;overflow:hidden;text-overflow:ellipsis;vertical-align:top;text-align:left}' +
    '.fdp-sheet th{position:sticky;top:0;background:#f4f6fa;color:#8f97b3;font-weight:500;font-size:10.5px;text-align:center;z-index:1}' +
    '.fdp-sheet td.fdp-rn{position:sticky;left:0;background:#f4f6fa;color:#8f97b3;font-size:10.5px;text-align:center;min-width:28px}' +
    '.fdp-more{font-size:11.5px;color:#8f97b3;padding:10px 14px}' +
    '.fdp-doc{background:#fff;max-width:720px;margin:18px auto;padding:40px 48px;box-shadow:0 10px 30px -18px rgba(11,26,64,.35);border-radius:4px;font-size:13px;line-height:1.55;color:#1f2433}' +
    '.fdp-doc h1,.fdp-doc h2,.fdp-doc h3{color:#00003d;line-height:1.25;margin:1.2em 0 .5em}' +
    '.fdp-doc table{border-collapse:collapse;margin:10px 0}.fdp-doc td,.fdp-doc th{border:1px solid #d8deea;padding:4px 7px;vertical-align:top}' +
    '.fdp-doc img{max-width:100%}' +
    '.fdp-pdf{width:100%;height:100%;border:0;display:block;background:#fff}' +
    '.fdp-slides{display:grid;gap:16px;padding:18px}' +
    '.fdp-slide{position:relative;aspect-ratio:16/9;background:#fff;border-radius:6px;box-shadow:0 10px 26px -16px rgba(11,26,64,.4);padding:6% 7%;overflow:hidden;font-size:12px;color:#44496e;line-height:1.45}' +
    '.fdp-slide h4{font-size:18px;font-weight:600;color:#00003d;margin:0 0 10px;line-height:1.2}' +
    '.fdp-slide p{margin:0 0 4px}' +
    '.fdp-slide .fdp-n{position:absolute;right:12px;bottom:9px;font-size:10px;color:#b3bad0}' +
    '.fdp-note{position:absolute;left:0;right:0;bottom:0;padding:8px 12px;font-size:11.5px;color:#6b7392;background:rgba(255,255,255,.9);border-top:1px solid #e7ebf4}';
  function css(){
    if (document.getElementById('fdp-css')) return;
    var s = document.createElement('style'); s.id = 'fdp-css'; s.textContent = CSS; document.head.appendChild(s);
  }

  var TYPE = { xlsx:['XLS','#1d6f42'], docx:['DOC','#2b579a'], pdf:['PDF','#b7472a'], pptx:['PPT','#c43e1c'] };
  var token = 0;

  function frame(host, k, file, name){
    var t = TYPE[k], base = decodeURIComponent((file.split('/').pop() || '').split('?')[0]);
    host.innerHTML = '<div class="fdp"><div class="fdp-bar"><b style="background:' + t[1] + '">' + t[0] + '</b>' +
      '<span title="' + esc(base) + '">' + esc(base) + '</span><a href="' + esc(url(file)) + '" target="_blank" rel="noopener">Open file &#8599;</a></div>' +
      '<div class="fdp-body"><div class="fdp-wait"><div><i></i>Opening ' + esc(name || base) + '</div></div></div></div>';
    return host.querySelector('.fdp-body');
  }

  function sheet(wb, ws, body){
    var X = window.XLSX, ref = ws['!ref'];
    if (!ref){ body.innerHTML = '<div class="fdp-more">This sheet is empty.</div>'; return; }
    var r = X.utils.decode_range(ref);
    /* start at the first row with anything in it: the rows above hold logos this view cannot draw */
    for (var fy = r.s.r; fy < r.e.r; fy++){ var hit = false; for (var fx = r.s.c; fx <= r.e.c && !hit; fx++){ var fc = ws[X.utils.encode_cell({r:fy, c:fx})]; if (fc && fc.v != null && String(fc.v).trim()) hit = true; } if (hit) break; }
    r.s.r = Math.max(r.s.r, fy - 1);
    var R = Math.min(r.e.r, r.s.r + 59), C = Math.min(r.e.c, r.s.c + 15);
    var head = '<tr><th></th>', rows = '';
    for (var c = r.s.c; c <= C; c++) head += '<th>' + X.utils.encode_col(c) + '</th>';
    head += '</tr>';
    var skip = {};
    (ws['!merges'] || []).forEach(function(m){
      for (var y = m.s.r; y <= m.e.r; y++) for (var x = m.s.c; x <= m.e.c; x++) if (y !== m.s.r || x !== m.s.c) skip[y + ',' + x] = 1;
    });
    var span = {};
    (ws['!merges'] || []).forEach(function(m){ span[m.s.r + ',' + m.s.c] = m; });
    for (var y = r.s.r; y <= R; y++){
      rows += '<tr><td class="fdp-rn">' + (y + 1) + '</td>';
      for (var x = r.s.c; x <= C; x++){
        if (skip[y + ',' + x]) continue;
        var cell = ws[X.utils.encode_cell({r:y, c:x})], v = cell ? (cell.w != null ? cell.w : (cell.v != null ? cell.v : '')) : '';
        var m = span[y + ',' + x], at = '';
        if (m){ var rs = Math.min(m.e.r, R) - m.s.r + 1, cs = Math.min(m.e.c, C) - m.s.c + 1; if (rs > 1) at += ' rowspan="' + rs + '"'; if (cs > 1) at += ' colspan="' + cs + '"'; }
        rows += '<td' + at + '>' + esc(v) + '</td>';
      }
      rows += '</tr>';
    }
    var more = (r.e.r > R || r.e.c > C) ? '<div class="fdp-more">Showing rows ' + (r.s.r + 1) + ' to ' + (R + 1) + ' of ' + (r.e.r + 1) + '. Download the file for the whole sheet.</div>' : '';
    body.innerHTML = '<div class="fdp-sheet"><table>' + head + rows + '</table></div>' + more;
    body.scrollTop = 0; body.scrollLeft = 0;
  }

  function excel(buf, body, fdp){
    return load(LIBS.xlsx).then(function(){
      var wb = window.XLSX.read(buf, {type:'array', cellStyles:false, sheetRows:80});
      var names = wb.SheetNames.filter(function(n){ var w = wb.Sheets[n]; return w && w['!ref']; });
      if (!names.length) names = wb.SheetNames;
      var tabs = document.createElement('div'); tabs.className = 'fdp-tabs';
      /* open on the first working sheet, not the README or the revision log */
      var first = Math.max(0, names.findIndex(function(n){ return !/read ?me|revision|instruction|cover|legal|index|contents/i.test(n); }));
      names.forEach(function(n, i){
        var b = document.createElement('button'); b.type = 'button'; b.textContent = n; if (i === first) b.className = 'on';
        b.addEventListener('click', function(){ [].forEach.call(tabs.children, function(x){ x.classList.remove('on'); }); b.classList.add('on'); sheet(wb, wb.Sheets[n], body); });
        tabs.appendChild(b);
      });
      if (names.length > 1) fdp.appendChild(tabs);
      sheet(wb, wb.Sheets[names[first]], body);
      var on = tabs.children[first]; if (on && on.scrollIntoView) tabs.scrollLeft = on.offsetLeft - 10;
    });
  }

  function word(buf, body){
    return load(LIBS.docx).then(function(){
      return window.mammoth.convertToHtml({arrayBuffer: buf}).then(function(res){
        body.innerHTML = '<div class="fdp-doc">' + (res.value || '<p>This document has no text to show.</p>') + '</div>';
      });
    });
  }

  function slides(buf, body){
    return load(LIBS.pptx).then(function(){
      return window.JSZip.loadAsync(buf).then(function(zip){
        var files = Object.keys(zip.files).filter(function(p){ return /^ppt\/slides\/slide\d+\.xml$/.test(p); })
          .sort(function(a, b){ return (+a.match(/(\d+)\.xml$/)[1]) - (+b.match(/(\d+)\.xml$/)[1]); }).slice(0, 30);
        return Promise.all(files.map(function(p){ return zip.file(p).async('string'); })).then(function(xml){
          var out = xml.map(function(x, i){
            var paras = x.split(/<a:p[ >]/).slice(1).map(function(p){
              return (p.match(/<a:t>([^<]*)<\/a:t>/g) || []).map(function(t){ return t.replace(/<\/?a:t>/g, ''); }).join('');
            }).filter(function(t){ return t.trim(); });
            var h = paras.shift() || '';
            var dec = function(s){ var d = document.createElement('textarea'); d.innerHTML = s; return d.value; };
            return '<div class="fdp-slide"><h4>' + esc(dec(h)) + '</h4>' + paras.slice(0, 12).map(function(p){ return '<p>' + esc(dec(p)) + '</p>'; }).join('') +
              '<span class="fdp-n">' + (i + 1) + '</span></div>';
          });
          body.innerHTML = '<div class="fdp-slides">' + out.join('') + '</div>';
        });
      });
    });
  }

  window.FDPreview = {
    kind: kind,
    render: function(host, o){
      var me = ++token, k = kind(o.file);
      if (!k || !o.file || o.file === '#'){ host.innerHTML = o.fallback || ''; return; }
      css();
      var body = frame(host, k, o.file, o.name), fdp = host.querySelector('.fdp');
      if (k === 'pdf'){
        body.innerHTML = '<iframe class="fdp-pdf" title="' + esc(o.name || 'PDF') + '" src="' + esc(url(o.file)) + '#view=FitH&amp;toolbar=0"></iframe>';
        return;
      }
      bytes(o.file).then(function(buf){
        if (me !== token) return;
        return (k === 'xlsx' ? excel(buf, body, fdp) : k === 'docx' ? word(buf, body) : slides(buf, body));
      }).catch(function(){
        if (me !== token) return;
        host.innerHTML = (o.fallback || '') + '<div class="fdp-note">A preview of this file is not available here. Download it to open it.</div>';
      });
    }
  };
})();

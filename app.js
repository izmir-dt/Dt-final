(function () {
  'use strict';

  var CFG = {
    API_BASE: "https://script.google.com/macros/s/AKfycbz-Td3cnbMkGRVW4kFXvlvD58O6yygQ-U2aJ7vHSkxAFrAsR5j7QhMFt0xrGg4gZQLb/exec",
    SHEET_MAIN: 'BÜTÜN OYUNLAR',
    LIMIT: 200
  };

  function $(id) { return document.getElementById(id); }

  var els = {
    status: $('status'),
    list: $('list'),
    details: $('details'),
    q: $('q'),
    qScope: $('qScope'),
    tabOyunlar: $('tabOyunlar'),
    tabKisiler: $('tabKisiler'),
    clearBtn: $('clearBtn'),
    copyBtn: $('copyBtn'),
    kpiPlays: $('kpiPlays'),
    kpiPeople: $('kpiPeople'),
    kpiRows: $('kpiRows'),
    kpiFiguran: $('kpiFiguran'),
    apiTest: $('apiTest'),
    reloadBtn: $('reloadBtn')
  };

  var STATE = {
    rows: [],
    mode: 'plays',
    selectedKey: null
  };

  function setStatus(text, kind) {
    if (!els.status) return;
    els.status.textContent = text || '';
    els.status.dataset.kind = kind || 'info';
  }

  function safeTrim(x) {
    return (x == null) ? '' : String(x).replace(/\u00A0/g,' ').trim();
  }

  function normalizeRow(r) {
    return {
      play: safeTrim(r['Oyun Adı'] || r['OyunAdi'] || r['Oyun'] || r['play'] || r['oyun'] || ''),
      category: safeTrim(r['Kategori'] || r['kategori'] || ''),
      role: safeTrim(r['Görev'] || r['Gorev'] || r['görev'] || r['gorev'] || ''),
      person: safeTrim(r['Kişi'] || r['Kisi'] || r['kişi'] || r['kisi'] || ''),
      raw: r
    };
  }

  function splitPeople(cell) {
    var s = safeTrim(cell);
    if (!s) return [];
    s = s.replace(/\s*(\r\n|\r|\n)\s*/g, ',');
    s = s.replace(/\s*\/\s*/g, ',');
    s = s.replace(/\s*,\s*/g, ',');
    s = s.replace(/\s+ve\s+/gi, ',');
    return s.split(',').map(function(x){
      return safeTrim(x).replace(/\s*\(\s*Figüran\s*\)\s*$/i,'');
    }).filter(Boolean);
  }

  function uniq(arr) {
    var seen = Object.create(null);
    var out = [];
    for (var i=0;i<arr.length;i++) {
      var v = arr[i];
      if (!v) continue;
      if (seen[v]) continue;
      seen[v] = 1;
      out.push(v);
    }
    return out;
  }

  function groupByPlay(rows) {
    var map = Object.create(null);
    rows.forEach(function(r){
      if (!r.play) return;
      if (!map[r.play]) map[r.play] = [];
      map[r.play].push(r);
    });
    return map;
  }

  function groupByPerson(rows) {
    var map = Object.create(null);
    rows.forEach(function(r){
      splitPeople(r.person).forEach(function(p){
        if (!map[p]) map[p] = [];
        map[p].push(r);
      });
    });
    return map;
  }

  function computeKPIs(rows) {
    var plays = uniq(rows.map(function(r){return r.play;}));
    var people = Object.create(null);
    var figCount = 0;
    rows.forEach(function(r){
      splitPeople(r.person).forEach(function(p){ people[p]=1; });
      if (/figüran/i.test(r.category) || /figüran/i.test(r.role) || /\(\s*figüran\s*\)/i.test(r.person)) figCount += 1;
    });
    if (els.kpiPlays) els.kpiPlays.textContent = plays.length ? String(plays.length) : '-';
    if (els.kpiPeople) els.kpiPeople.textContent = Object.keys(people).length ? String(Object.keys(people).length) : '-';
    if (els.kpiRows) els.kpiRows.textContent = rows.length ? String(rows.length) : '-';
    if (els.kpiFiguran) els.kpiFiguran.textContent = figCount ? String(figCount) : '-';
  }

  function clearNode(node) {
    if (!node) return;
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function renderList(items) {
    clearNode(els.list);
    if (!els.list) return;

    if (!items.length) {
      var empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = 'Kayıt bulunamadı.';
      els.list.appendChild(empty);
      return;
    }

    items.forEach(function(name){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'list-item' + (name === STATE.selectedKey ? ' active' : '');
      btn.textContent = name;
      btn.onclick = function(){
        STATE.selectedKey = name;
        applyFiltersAndRender();
      };
      els.list.appendChild(btn);
    });
  }

  function buildExcelTextForPlay(play, rows) {
    var lines = [];
    lines.push(['Oyun Adı','Kategori','Görev','Kişi'].join('\t'));
    rows.forEach(function(r){ lines.push([play, r.category, r.role, r.person].join('\t')); });
    return lines.join('\n');
  }

  function buildExcelTextForPerson(person, rows) {
    var lines = [];
    lines.push(['Kişi','Oyun Adı','Kategori','Görev'].join('\t'));
    rows.forEach(function(r){ lines.push([person, r.play, r.category, r.role].join('\t')); });
    return lines.join('\n');
  }

  function copyText(text) {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){
        setStatus('Kopyalandı (Excel)', 'ok');
        setTimeout(function(){ setStatus('Canlı', 'ok'); }, 1200);
      }, function() {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setStatus('Kopyalandı (Excel)', 'ok');
      setTimeout(function(){ setStatus('Canlı', 'ok'); }, 1200);
    } catch(e) {
      console.error(e);
      setStatus('Kopyalama başarısız', 'bad');
    }
  }

  function renderDetails() {
    clearNode(els.details);
    if (!els.details) return;

    if (!STATE.selectedKey) {
      var hint = document.createElement('div');
      hint.className = 'hint';
      hint.textContent = 'Soldan bir oyun veya kişi seç.';
      els.details.appendChild(hint);
      if (els.copyBtn) els.copyBtn.disabled = true;
      return;
    }

    if (STATE.mode === 'plays') {
      var play = STATE.selectedKey;
      var rowsByPlay = groupByPlay(STATE.rows);
      var rows = rowsByPlay[play] || [];

      var title = document.createElement('div');
      title.className = 'details-title';
      title.textContent = play;
      els.details.appendChild(title);

      var byCat = Object.create(null);
      rows.forEach(function(r){
        var c = r.category || 'Diğer';
        if (!byCat[c]) byCat[c] = [];
        byCat[c].push(r);
      });

      Object.keys(byCat).sort().forEach(function(cat){
        var sec = document.createElement('div');
        sec.className = 'details-section';

        var ch = document.createElement('div');
        ch.className = 'details-section-title';
        ch.textContent = cat;
        sec.appendChild(ch);

        var ul = document.createElement('ul');
        ul.className = 'details-ul';
        byCat[cat].forEach(function(r){
          var li = document.createElement('li');
          li.innerHTML = '<b>' + escapeHtml(r.role || '-') + '</b> — ' + escapeHtml(r.person || '-');
          ul.appendChild(li);
        });
        sec.appendChild(ul);
        els.details.appendChild(sec);
      });

      if (els.copyBtn) {
        els.copyBtn.disabled = false;
        els.copyBtn.onclick = function(){ copyText(buildExcelTextForPlay(play, rows)); };
      }
    } else {
      var person = STATE.selectedKey;
      var rowsByPerson = groupByPerson(STATE.rows);
      var rel = rowsByPerson[person] || [];

      var title2 = document.createElement('div');
      title2.className = 'details-title';
      title2.textContent = person;
      els.details.appendChild(title2);

      var byPlay = Object.create(null);
      rel.forEach(function(r){
        if (!byPlay[r.play]) byPlay[r.play] = [];
        byPlay[r.play].push(r);
      });

      Object.keys(byPlay).sort().forEach(function(playName){
        var sec2 = document.createElement('div');
        sec2.className = 'details-section';

        var ph = document.createElement('div');
        ph.className = 'details-section-title';
        ph.textContent = playName;
        sec2.appendChild(ph);

        var ul2 = document.createElement('ul');
        ul2.className = 'details-ul';
        byPlay[playName].forEach(function(r){
          var li2 = document.createElement('li');
          li2.innerHTML = '<b>' + escapeHtml(r.role || '-') + '</b> — ' + escapeHtml(r.category || '-');
          ul2.appendChild(li2);
        });
        sec2.appendChild(ul2);
        els.details.appendChild(sec2);
      });

      if (els.copyBtn) {
        els.copyBtn.disabled = false;
        els.copyBtn.onclick = function(){ copyText(buildExcelTextForPerson(person, rel)); };
      }
    }
  }

  function applyFiltersAndRender() {
    var q = els.q ? safeTrim(els.q.value).toLowerCase() : '';
    var rows = STATE.rows;

    if (STATE.mode === 'plays') {
      var plays = uniq(rows.map(function(r){return r.play;})).sort();
      if (q) plays = plays.filter(function(p){ return p.toLowerCase().indexOf(q) !== -1; });
      renderList(plays);
    } else {
      var people = Object.create(null);
      rows.forEach(function(r){ splitPeople(r.person).forEach(function(p){ people[p]=1; }); });
      var ppl = Object.keys(people).sort();
      if (q) ppl = ppl.filter(function(p){ return p.toLowerCase().indexOf(q) !== -1; });
      renderList(ppl);
    }

    renderDetails();
  }

  function setMode(mode) {
    STATE.mode = mode;
    STATE.selectedKey = null;
    if (els.tabOyunlar) els.tabOyunlar.classList.toggle('active', mode==='plays');
    if (els.tabKisiler) els.tabKisiler.classList.toggle('active', mode==='people');
    applyFiltersAndRender();
  }

  function buildUrl() {
    return CFG.API_BASE + '?sheet=' + encodeURIComponent(CFG.SHEET_MAIN) + '&limit=' + encodeURIComponent(String(CFG.LIMIT));
  }

  function loadData() {
    setStatus('Yükleniyor…', 'loading');

    fetch(buildUrl())
      .then(function(resp){ if(!resp.ok) throw new Error('HTTP ' + resp.status); return resp.json(); })
      .then(function(json){
        if (!json || !json.ok || !Array.isArray(json.rows)) throw new Error('JSON formatı beklenmedik');
        STATE.rows = json.rows.map(normalizeRow).filter(function(r){ return r.play || r.person || r.role || r.category; });
        computeKPIs(STATE.rows);
        setStatus('Canlı', 'ok');
        applyFiltersAndRender();
      })
      .catch(function(err){
        console.error(err);
        STATE.rows = [];
        computeKPIs([]);
        setStatus('Veri çekilemedi', 'bad');
        applyFiltersAndRender();
      });
  }

  function wireUI() {
    if (els.tabOyunlar) els.tabOyunlar.addEventListener('click', function(){ setMode('plays'); });
    if (els.tabKisiler) els.tabKisiler.addEventListener('click', function(){ setMode('people'); });
    if (els.q) els.q.addEventListener('input', applyFiltersAndRender);
    if (els.clearBtn) els.clearBtn.addEventListener('click', function(){ if (els.q) els.q.value=''; applyFiltersAndRender(); });
    if (els.reloadBtn) els.reloadBtn.addEventListener('click', loadData);
    if (els.apiTest) els.apiTest.addEventListener('click', function(){ window.open(buildUrl(), '_blank'); });
  }

  wireUI();
  setMode('plays');
  loadData();
})();

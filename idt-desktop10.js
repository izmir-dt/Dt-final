(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);

  // ---------- Global Loading ----------
  function setupLoading(){
    const root = $('globalLoading');
    const close = $('glClose');
    const msg = $('glMsg');
    if(!root || !close || !msg) return;

    const hide = () => {
      root.classList.add('hidden');
      root.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    };
    const show = (text) => {
      if(text) msg.textContent = String(text);
      root.classList.remove('hidden');
      root.setAttribute('aria-hidden','false');
      /* non-blocking loading */
      document.body.style.overflow = '';
      if(window.__IDT_LOADING_AUTOT){ clearTimeout(window.__IDT_LOADING_AUTOT); }
      window.__IDT_LOADING_AUTOT = setTimeout(()=>{ try{ hide(); }catch(_e){} }, 1400);
    };

    window.IDTLoading = {
      show: (text) => show(text || 'Lütfen bekleyin…'),
      hide
    };

    close.addEventListener('click', hide);
    document.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && !root.classList.contains('hidden')) hide();
    });
  }

  // Monkeypatch setStatus (non-invasive) to standardize "Yükleniyor" moments
  function patchSetStatus(){
    const fn = window.setStatus;
    if(typeof fn !== 'function') return;
    if(fn.__idtPatched) return;
    function wrapped(text, tone){
      try{
        const t = String(text||'');
        if(/yükleniyor/i.test(t) || /güncelleniyor/i.test(t)){
          // avoid flash: show only if still loading after 450ms
          if(!window.__IDT_LOADING_TIMER){
            window.__IDT_LOADING_TIMER = setTimeout(()=>{
              try{ window.IDTLoading && window.IDTLoading.show(t.replace(/^⏳\s*/,'')); }catch(_e){}
            }, 450);
          }
        }else{
          if(window.__IDT_LOADING_TIMER){ clearTimeout(window.__IDT_LOADING_TIMER); window.__IDT_LOADING_TIMER = null; }
          window.IDTLoading && window.IDTLoading.hide();
        }
      }catch(_e){}
      return fn.call(this, text, tone);
    }
    wrapped.__idtPatched = true;
    window.setStatus = wrapped;
  }

  // ---------- Help ----------
  function show(el){ el.classList.remove('hidden'); }
  function hide(el){ el.classList.add('hidden'); }

  function setupHelp(){
    const btn = $('helpBtn');
    const overlay = $('helpOverlay');
    const modal = $('helpModal');
    const close = $('helpClose');
    if(!btn || !overlay || !modal || !close) return;

    const open = () => {
      show(overlay); show(modal);
      overlay.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    };
    const shut = () => {
      hide(overlay); hide(modal);
      overlay.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    };

    btn.addEventListener('click', open);
    close.addEventListener('click', shut);
    overlay.addEventListener('click', shut);
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape' && !overlay.classList.contains('hidden')) shut();
    });
  }

  // ---------- State ----------
  const state = window.IDT_STATE = {
    sekme: 'Panel',
    oyun: '',
    kisi: '',
    gorev: '',
    figuran: false
  };

  function setState(patch){
    let changed = false;
    for(const k of Object.keys(patch)){
      if(state[k] !== patch[k]){
        state[k] = patch[k];
        changed = true;
      }
    }
    if(changed){
      updateActiveFilters();
      // cross-module flow hooks
      try{
        if(state.sekme === 'Heatmap'){
          window.IDTHeatmap && window.IDTHeatmap.render && window.IDTHeatmap.render();
        }
      }catch(_e){}
    }
  }

  // ---------- Active Filters (real-state driven) ----------
  function buildChip(key, value){
    const chip = document.createElement('span');
    chip.className = 'afChip';
    chip.innerHTML = `<b>${key}:</b> <span class="v"></span> <span class="x" title="Kaldır">✕</span>`;
    chip.querySelector('.v').textContent = value;
    return chip;
  }

  function clearPanelSelection(){
    try{
      window.activeId = null;
      window.selectedItem = null;
      if(typeof window.renderList === 'function') window.renderList({preserveScroll:true});
      if(typeof window.renderDetails === 'function') window.renderDetails(null);
    }catch(_e){}
  }

  function clearAssignFilters(){
    const btn = $('assignFilterClear');
    if(btn) btn.click();
  }

  function clearSearch(){
    const btn = $('qClear');
    if(btn) btn.click();
    const q = $('q');
    if(q) q.value = '';
  }

  function updateActiveFilters(){
    const bar = $('activeFilters');
    const chips = $('afChips');
    if(!bar || !chips) return;

    const active = [];
    if(state.oyun) active.push(['Oyun', state.oyun]);
    if(state.kisi) active.push(['Kişi', state.kisi]);
    if(state.gorev) active.push(['Görev', state.gorev]);
    if(state.figuran) active.push(['Figüran', 'Açık']);

    chips.innerHTML = '';
    if(active.length === 0){
      hide(bar);
      return;
    }
    show(bar);

    for(const [k,v] of active){
      const c = buildChip(k,v);
      c.querySelector('.x').addEventListener('click', ()=>{
        if(k === 'Oyun'){ setState({oyun:''}); clearPanelSelection(); }
        if(k === 'Kişi'){ setState({kisi:''}); clearPanelSelection(); }
        if(k === 'Görev'){ setState({gorev:''}); clearAssignFilters(); }
        if(k === 'Figüran'){ setState({figuran:false}); document.body.classList.remove('scope-figuran','fig-only'); }
      });
      chips.appendChild(c);
    }
  }

  function setupActiveFilters(){
    const clearAll = $('afClear');
    if(clearAll){
      clearAll.addEventListener('click', ()=>{
        setState({oyun:'', kisi:'', gorev:'', figuran:false});
        clearPanelSelection();
        clearAssignFilters();
        clearSearch();
      });
    }
    updateActiveFilters();
  }

  // ---------- Observe selections from existing UI ----------
  function setupObservers(){
    const msPlaysTxt = $('msPlaysTxt');
    const msPeopleTxt = $('msPeopleTxt');
    const msRolesTxt = $('msRolesTxt');

    const normalize = (t)=> String(t||'').trim().replace(/\s+/g,' ');
    const isPlaceholder = (t)=> !t || /seç/i.test(t);

    const read = ()=>{
      const play = msPlaysTxt ? normalize(msPlaysTxt.textContent) : '';
      const person = msPeopleTxt ? normalize(msPeopleTxt.textContent) : '';
      const role = msRolesTxt ? normalize(msRolesTxt.textContent) : '';
      setState({
        oyun: isPlaceholder(play) ? state.oyun : play,
        kisi: isPlaceholder(person) ? state.kisi : person,
        gorev: isPlaceholder(role) ? state.gorev : role
      });
    };

    const obs = new MutationObserver(()=>read());
    [msPlaysTxt, msPeopleTxt, msRolesTxt].forEach(el=>{
      if(el) obs.observe(el, {childList:true, subtree:true, characterData:true});
    });

    // Panel list click capture (plays/people selections)
    const list = $('list');
    if(list){
      list.addEventListener('click', (e)=>{
        const item = e.target && e.target.closest ? e.target.closest('.item') : null;
        if(!item) return;
        const nameEl = item.querySelector('.name');
        const name = nameEl ? normalize(nameEl.textContent) : '';
        if(!name) return;
        try{
          if(window.activeMode === 'plays') setState({oyun:name, kisi:''});
          else if(window.activeMode === 'people') setState({kisi:name, oyun:''});
        }catch(_e){}
      }, true);
    }

    // Track active tab via tab buttons (desktop)
    const tabMap = [
      ['tabPanel','Panel'],
      ['tabDistribution','Distribution'],
      ['tabHeatmap','Heatmap'],
      ['tabIntersection','Intersection'],
      ['tabFiguran','Figuran'],
      ['tabCharts','Charts'],
      ['tabAssign','Assign'],
    ];
    for(const [id,val] of tabMap){
      const b = $(id);
      if(b) b.addEventListener('click', ()=>setState({sekme:val, figuran: val==='Figuran'}), true);
    }

    // Initial
    read();
  }

  // ---------- Heatmap ----------
  function buildHeatIndex(rows){
    const idx = new Map(); // key person||play -> count
    for(const r of rows){
      if(!r || !r.person || !r.play) continue;
      const k = r.person + '||' + r.play;
      idx.set(k, (idx.get(k)||0) + 1);
    }
    return idx;
  }

  
  // ===== Yoğunluk & Çakışma Merkezi (1 + 4) =====
  function escHtml(s){
    return String(s||'').replace(/[&<>"']/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }
  function norm(s){ return String(s||'').toLocaleUpperCase('tr-TR'); }
  function isFiguranRow(r){
    const t = norm((r.role||'')+' '+(r.category||'')+' '+(r.person||''));
    return /FİGÜRAN|FIGÜRAN|KURUMDAN EMEKL/.test(t) || /\(\s*FİGÜRAN\s*\)/.test(t);
  }
  function getAllPlays(){
    const plays = Array.isArray(window.plays) ? window.plays.map(p=>p.title) : [];
    return plays.filter(Boolean);
  }
  function getRows(){
    return Array.isArray(window.rows) ? window.rows : [];
  }
  function buildPlayTotals(rows){
    const totals = new Map();
    for(const r of rows){
      const p = r && r.play ? r.play : '';
      if(!p) continue;
      totals.set(p, (totals.get(p)||0) + 1);
    }
    return totals;
  }
  function getTopPlays(limit){
    const rows = getRows();
    const plays = getAllPlays();
    const totals = buildPlayTotals(rows);
    return plays.slice().sort((a,b)=>{
      const da = totals.get(a)||0, db = totals.get(b)||0;
      if(db!==da) return db-da;
      return String(a).localeCompare(String(b),'tr');
    }).slice(0, limit);
  }
  function rowsForPlay(play){
    const rows = getRows();
    return rows.filter(r=>r && r.play === play && (r.person||r.role||r.category));
  }

  // --- UI State (local to Center) ---
  let centerSelectedPlay = '';
  let lastCommon = []; // [{person, a, b}]

  function setDetail(play){
    centerSelectedPlay = play || '';
    const title = $('ccDetailTitle');
    const sub = $('ccDetailSub');
    if(title) title.textContent = play ? play : 'Bir oyun seç';
    if(sub){
      sub.textContent = play ? 'Kişiler listesi hazır. İstersen ara / figüran filtresi uygula / Excel’e kopyala.' : 'Seçince kişiler listesi burada görünür.';
    }
    renderDetailList();
  }

  function renderTopGames(){
    const box = $('ccTopGames');
    if(!box) return;
    const rows = getRows();
    if(!rows.length){
      box.innerHTML = `<div class="empty">Veri yok.</div>`;
      return;
    }
    const top = getTopPlays(15);
    const totals = buildPlayTotals(rows);
    const max = Math.max(1, ...top.map(p=>totals.get(p)||0));
    box.innerHTML = top.map(p=>{
      const n = totals.get(p)||0;
      const w = Math.round((n/max)*100);
      return `<div class="cc-game" data-play="${escHtml(p)}" title="${escHtml(p)}">
        <div class="t">${escHtml(p)}</div>
        <div class="m"><span>${n} kişi</span><span>Seç</span></div>
        <div class="bar"><i style="width:${w}%"></i></div>
      </div>`;
    }).join('');

    box.querySelectorAll('.cc-game').forEach(el=>{
      el.addEventListener('click', ()=>{
        const p = el.getAttribute('data-play') || '';
        setState({oyun:p}); // reflect in active chips
        setDetail(p);
      });
    });
  }

  function renderDetailList(){
    const list = $('ccList');
    if(!list) return;
    if(!centerSelectedPlay){
      list.innerHTML = `<div class="empty">Bir oyun seçince burada liste oluşur.</div>`;
      return;
    }
    const q = $('ccSearch') ? String($('ccSearch').value||'').trim() : '';
    const figOnly = $('ccFigOnly') ? $('ccFigOnly').checked : false;

    let rows = rowsForPlay(centerSelectedPlay);
    if(figOnly) rows = rows.filter(isFiguranRow);
    if(q){
      const nq = norm(q);
      rows = rows.filter(r => norm((r.person||'')+' '+(r.role||'')+' '+(r.category||'')).includes(nq));
    }

    // simple stable sort: category -> role -> person
    rows.sort((a,b)=>{
      const ca = String(a.category||'').localeCompare(String(b.category||''),'tr');
      if(ca) return ca;
      const ra = String(a.role||'').localeCompare(String(b.role||''),'tr');
      if(ra) return ra;
      return String(a.person||'').localeCompare(String(b.person||''),'tr');
    });

    let html = `<table><thead><tr>
      <th style="width:26%">Kategori</th>
      <th style="width:32%">Görev</th>
      <th style="width:42%">Kişi</th>
    </tr></thead><tbody>`;

    for(const r of rows){
      html += `<tr class="ccRow" data-person="${escHtml(r.person)}" data-play="${escHtml(centerSelectedPlay)}">
        <td>${escHtml(r.category||'')}</td>
        <td>${escHtml(r.role||'')}</td>
        <td>${escHtml(r.person||'')}</td>
      </tr>`;
    }
    html += `</tbody></table>`;
    list.innerHTML = html;

    // row click: go to panel with focus on that person
    list.querySelectorAll('.ccRow').forEach(tr=>{
      tr.addEventListener('click', ()=>{
        const person = tr.getAttribute('data-person') || '';
        const play = tr.getAttribute('data-play') || '';
        setState({kisi:person, oyun:play});
        try{ window.__idtHeatmapFocusPerson = person; }catch(_e){}
        const tabPanel = $('tabPanel'); if(tabPanel) tabPanel.click();
        // best-effort open play
        try{
          if(typeof window.renderList === 'function' && typeof window.renderDetails === 'function'){
            if(window.activeMode !== 'plays' && $('btnPlays')) $('btnPlays').click();
            const target = Array.isArray(window.plays) ? window.plays.find(x=>x.title===play) : null;
            if(target){
              window.activeId = target.id;
              window.selectedItem = target;
              window.renderList({preserveScroll:false});
              window.renderDetails(target);
            }
          }
        }catch(_e){}
      });
    });
  }

  function buildCommon(playA, playB){
    const ra = rowsForPlay(playA);
    const rb = rowsForPlay(playB);
    const aMap = new Map(); // person -> Set('Kategori — Görev')
    for(const r of ra){
      const person = r.person||'';
      if(!person) continue;
      const s = `${r.category||''} — ${r.role||''}`.replace(/\s+—\s+$/,'').trim();
      if(!aMap.has(person)) aMap.set(person, new Set());
      if(s) aMap.get(person).add(s);
    }
    const bMap = new Map();
    for(const r of rb){
      const person = r.person||'';
      if(!person) continue;
      const s = `${r.category||''} — ${r.role||''}`.replace(/\s+—\s+$/,'').trim();
      if(!bMap.has(person)) bMap.set(person, new Set());
      if(s) bMap.get(person).add(s);
    }
    const common = [];
    for(const person of aMap.keys()){
      if(!bMap.has(person)) continue;
      const a = Array.from(aMap.get(person)).join(' | ');
      const b = Array.from(bMap.get(person)).join(' | ');
      common.push({person, a, b});
    }
    common.sort((x,y)=> String(x.person).localeCompare(String(y.person),'tr'));
    return common;
  }

  function updateCommonCount(){
    const selA = $('ccPlayA');
    const selB = $('ccPlayB');
    const a = selA ? selA.value : '';
    const b = selB ? selB.value : '';
    const out = $('ccCommonCount');
    if(!out) return;

    // If selects are empty but data exists, repopulate once
    try{
      if(selA && selB && selA.options && selA.options.length <= 1 && getRows().length){
        const plays = getAllPlays().slice().sort((x,y)=>String(x).localeCompare(String(y),'tr'));
        const opt = (p)=> `<option value="${escHtml(p)}">${escHtml(p)}</option>`;
        const htmlOpt = `<option value="">Seç…</option>` + plays.map(opt).join('');
        selA.innerHTML = htmlOpt;
        selB.innerHTML = htmlOpt;
      }
    }catch(_e){}

    const topHd = document.querySelector('#viewHeatmap .cc-hd2');
    const topGames = $('ccTopGames');
    const sum = $('ccSelSummary');
    const clearBtn = $('ccClearSel');

    // counts per play
    const countPeople = (play)=>{
      const rows = rowsForPlay(play);
      const set = new Set();
      rows.forEach(r=>{ if(r && r.person) set.add(r.person); });
      return set.size;
    };

    // Toggle UI
    const hasSel = !!(a || b);
    if(sum && topHd && topGames){
      if(hasSel){
        sum.style.display = '';
        topHd.style.display = 'none';
        topGames.style.display = 'none';
      }else{
        sum.style.display = 'none';
        topHd.style.display = '';
        topGames.style.display = '';
      }
    }

    // Clear selections
    if(clearBtn && !clearBtn.__wired){
      clearBtn.__wired = true;
      clearBtn.addEventListener('click', ()=>{
        if(selA) selA.value = '';
        if(selB) selB.value = '';
        lastCommon = [];
        out.textContent = '0';
        // restore top15
        if(sum && topHd && topGames){
          sum.style.display = 'none';
          topHd.style.display = '';
          topGames.style.display = '';
        }
        // reset detail
        setDetail('');
      });
    }

    // Update summary texts
    const aName = $('ccSumAName'); const bName = $('ccSumBName');
    const aCnt = $('ccSumACnt'); const bCnt = $('ccSumBCnt');
    const oCnt = $('ccSumOCnt');
    if(aName) aName.textContent = a ? a : '—';
    if(bName) bName.textContent = b ? b : '—';
    if(aCnt) aCnt.textContent = a ? (countPeople(a) + ' kişi') : '0 kişi';
    if(bCnt) bCnt.textContent = b ? (countPeople(b) + ' kişi') : '0 kişi';

    // Common compute
    if(!a || !b || a===b){
      out.textContent = '0';
      if(oCnt) oCnt.textContent = '0';
      lastCommon = [];
      return;
    }
    lastCommon = buildCommon(a,b);
    out.textContent = String(lastCommon.length);
    if(oCnt) oCnt.textContent = String(lastCommon.length);
  }

  function showCommonAsDetail(){
    const a = $('ccPlayA') ? $('ccPlayA').value : '';
    const b = $('ccPlayB') ? $('ccPlayB').value : '';
    if(!a || !b || a===b){
      setDetail('');
      const list = $('ccList');
      if(list) list.innerHTML = `<div class="empty">İki farklı oyun seç.</div>`;
      return;
    }
    const list = $('ccList');
    if(!list) return;

    const common = lastCommon && lastCommon.length ? lastCommon : buildCommon(a,b);
    const title = $('ccDetailTitle');
    const sub = $('ccDetailSub');
    centerSelectedPlay = ''; // detail is common view (not single play)
    if(title) title.textContent = `Ortak Personel (${a} ∩ ${b})`;
    if(sub) sub.textContent = `${common.length} kişi. Satıra tıklayınca Panel’de ilgili oyunu açar (önce Oyun A).`;

    let html = `<table><thead><tr>
      <th style="width:30%">Kişi</th>
      <th style="width:35%">Oyun A Görev</th>
      <th style="width:35%">Oyun B Görev</th>
    </tr></thead><tbody>`;
    for(const r of common){
      html += `<tr class="ccCommonRow" data-person="${escHtml(r.person)}" data-a="${escHtml(a)}" data-b="${escHtml(b)}">
        <td>${escHtml(r.person)}</td>
        <td>${escHtml(r.a)}</td>
        <td>${escHtml(r.b)}</td>
      </tr>`;
    }
    html += `</tbody></table>`;
    list.innerHTML = html;

    list.querySelectorAll('.ccCommonRow').forEach(tr=>{
      tr.addEventListener('click', ()=>{
        const person = tr.getAttribute('data-person') || '';
        const play = tr.getAttribute('data-a') || '';
        setState({kisi:person, oyun:play});
        try{ window.__idtHeatmapFocusPerson = person; }catch(_e){}
        const tabPanel = $('tabPanel'); if(tabPanel) tabPanel.click();
        try{
          if(typeof window.renderList === 'function' && typeof window.renderDetails === 'function'){
            if(window.activeMode !== 'plays' && $('btnPlays')) $('btnPlays').click();
            const target = Array.isArray(window.plays) ? window.plays.find(x=>x.title===play) : null;
            if(target){
              window.activeId = target.id;
              window.selectedItem = target;
              window.renderList({preserveScroll:false});
              window.renderDetails(target);
            }
          }
        }catch(_e){}
      });
    });
  }

  function copyCurrentList(){
    const list = $('ccList');
    if(!list) return;
    const table = list.querySelector('table');
    if(!table) return;
    const rows = [];
    const trs = table.querySelectorAll('tbody tr');
    const ths = Array.from(table.querySelectorAll('thead th')).map(th=>th.textContent.trim());
    rows.push(ths.join('\t'));
    trs.forEach(tr=>{
      const tds = Array.from(tr.querySelectorAll('td')).map(td=>td.textContent.trim());
      rows.push(tds.join('\t'));
    });
    const text = rows.join('\n');
    if(typeof window.copyText === 'function') window.copyText(text);
  }

  function setupCenter(){
    // populate selects
    const selA = $('ccPlayA');
    const selB = $('ccPlayB');
    if(selA && selB){
      const plays = getAllPlays().slice().sort((a,b)=>String(a).localeCompare(String(b),'tr'));
      const opt = (p)=> `<option value="${escHtml(p)}">${escHtml(p)}</option>`;
      selA.innerHTML = `<option value="">Seç…</option>` + plays.map(opt).join('');
      selB.innerHTML = `<option value="">Seç…</option>` + plays.map(opt).join('');
      selA.addEventListener('change', updateCommonCount);
      selB.addEventListener('change', updateCommonCount);
    }

    const btnShow = $('ccShowCommon');
    const btnCopy = $('ccCopyCommon');
    if(btnShow) btnShow.addEventListener('click', showCommonAsDetail);
    if(btnCopy) btnCopy.addEventListener('click', async ()=>{
      try{
        btnCopy.disabled = true;
        btnCopy.classList.add('is-busy');
        if(typeof window.setStatus === 'function') window.setStatus('⏳ Ortaklar Excel için hazırlanıyor…','info');

        updateCommonCount();
        const common = lastCommon || [];

        // yield to UI (prevents freeze)
        await new Promise(res=>setTimeout(res, 0));

        const lines = new Array(common.length + 1);
        lines[0] = 'Kişi	Oyun A Görev	Oyun B Görev';
        for(let i=0;i<common.length;i++){
          const r = common[i];
          lines[i+1] = [r.person, r.a, r.b].join('	');
        }
        const tsv = lines.join('
');

        if(navigator.clipboard && navigator.clipboard.writeText){
          await navigator.clipboard.writeText(tsv);
        }else if(typeof window.copyText === 'function'){
          window.copyText(tsv);
        }

        if(typeof window.setStatus === 'function') window.setStatus('✅ Ortaklar Excel’e kopyalandı','ok');
      }catch(err){
        console.error(err);
        if(typeof window.setStatus === 'function') window.setStatus('⚠️ Kopyalama başarısız','warn');
        try{
          if(typeof window.copyText === 'function'){
            updateCommonCount();
            const common = lastCommon || [];
            const lines = ['Kişi	Oyun A Görev	Oyun B Görev'];
            for(const r of common) lines.push([r.person,r.a,r.b].join('	'));
            window.copyText(lines.join('
'));
          }
        }catch(_e){}
      }finally{
        btnCopy.disabled = false;
        btnCopy.classList.remove('is-busy');
      }
    });

    
    let __ccRenderT = null;
    function scheduleRenderDetailList(){
      if(__ccRenderT) cancelAnimationFrame(__ccRenderT);
      __ccRenderT = requestAnimationFrame(()=>{ 
        // small timeout to let checkbox UI settle
        setTimeout(()=>{ try{ renderDetailList(); }catch(e){} }, 0);
      });
    }

    const q = $('ccSearch');
    if(q) q.addEventListener('input', ()=>{ scheduleRenderDetailList(); });

    const fig = $('ccFigOnly');
    if(fig) fig.addEventListener('change', ()=>{ scheduleRenderDetailList(); });

    const copyList = $('ccCopyList');
    if(copyList) copyList.addEventListener('click', copyCurrentList);

    const toPanel = $('ccToPanel');
    if(toPanel) toPanel.addEventListener('click', ()=>{ const t=$('tabPanel'); if(t) t.click(); });

    try{ setupCenter(); }catch(_e){}
    renderTopGames();
    updateCommonCount();
    setDetail(state.oyun || '');
  }

  function renderHeatmap(){
    // compatibility: called when Heatmap tab is opened
    if(!getRows().length){
      const box = $('ccTopGames');
      if(box) box.innerHTML = `<div class="empty">Veri yok.</div>`;
      return;
    }
    renderTopGames();
    updateCommonCount();
    if(state.oyun) setDetail(state.oyun);
    else if(centerSelectedPlay) setDetail(centerSelectedPlay);
  }

  function setupHeatmapOld(){
    window.IDTHeatmap = {
      render: ()=>{
        try{ window.IDTLoading && window.IDTLoading.show('Yoğunluk & Çakışma Merkezi hazırlanıyor…'); }catch(_e){}
        setTimeout(()=>{
          try{ renderHeatmap(); }finally{ window.IDTLoading && window.IDTLoading.hide(); }
        }, 0);
      }
    };
    setupCenter();
  }
function setupHeatmap(){
    // ensure center events/selects wired
    try{ setupCenter(); }catch(_e){}

    const btn = $('hmRefresh');
    const toPanel = $('hmToPanel');
    const limit = $('hmColLimit');
    if(btn) btn.addEventListener('click', ()=>{ window.IDTHeatmap.render(); });
    if(limit) limit.addEventListener('change', ()=>{ window.IDTHeatmap.render(); });
    if(toPanel) toPanel.addEventListener('click', ()=>{ const t=$('tabPanel'); if(t) t.click(); });

    window.IDTHeatmap = {
      render: ()=>{
        try{ window.IDTLoading && window.IDTLoading.show('Yoğunluk Matrisi hazırlanıyor…'); }catch(_e){}
        // render after paint
        setTimeout(()=>{
          try{ renderHeatmap(); }finally{ window.IDTLoading && window.IDTLoading.hide(); }
        }, 0);
      }
    };
  }

  // Sol menü yönlendirmesi (masaüstü 1.0 kabuk)
  function setupSidebarNav(){
    const map = {
      sidePlays:   { hash:'#panel',   tab:'tabPanel',       modeBtn:'btnPlays' },
      sidePeople:  { hash:'#panel',   tab:'tabPanel',       modeBtn:'btnPeople' },
      sideRows:    { hash:'#gorev',   tab:'tabAssign' },
      sideDist:    { hash:'#analiz',  tab:'tabDistribution' },
      sideHeatmap: { hash:'#matris',  tab:'tabHeatmap' },
      sideCharts:  { hash:'#grafikler', tab:'tabCharts' },
      sideIntersect:{ hash:'#kesisim', tab:'tabIntersection' },
      sideFiguran: { hash:'#figuran', tab:'tabFiguran' },
    };

    const setActive = (activeId)=>{
      document.querySelectorAll('.idt-sidebar .idt-item').forEach(el=>el.classList.remove('active'));
      const a = $(activeId);
      if(a) a.classList.add('active');
    };

    Object.keys(map).forEach(id=>{
      const cfg = map[id];
      const el = $(id);
      if(!el) return;
      el.addEventListener('click', (e)=>{
        e.preventDefault();
        try{ if(cfg.hash) location.hash = cfg.hash; }catch(_e){}
        try{ const t = $(cfg.tab); if(t) t.click(); }catch(_e){}
        try{ if(cfg.modeBtn){ const mb = $(cfg.modeBtn); if(mb) mb.click(); } }catch(_e){}
        setActive(id);
      });
    });

    // hash ile gelindiyse aktif menüyü yakala
    const syncFromHash = ()=>{
      const h = String(location.hash||'').toLowerCase();
      if(h==='#analiz') return setActive('sideDist');
      if(h==='#matris') return setActive('sideHeatmap');
      if(h==='#grafikler') return setActive('sideCharts');
      if(h==='#kesisim') return setActive('sideIntersect');
      if(h==='#figuran') return setActive('sideFiguran');
      if(h==='#gorev') return setActive('sideRows');
      // panel default
      return setActive('sidePlays');
    };
    window.addEventListener('hashchange', syncFromHash);
    syncFromHash();
  }

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    setupLoading();
    patchSetStatus();
    setupHelp();
    setupActiveFilters();
    setupHeatmap();
    setupSidebarNav();
    setupObservers();

    // initial render heatmap if hash is matris
    try{
      if(String(location.hash||'').toLowerCase() === '#matris'){
        const t = $('tabHeatmap'); if(t) t.click();
      }
    }catch(_e){}
  });

})();

// __IDT_TOPCOUNTS__
(function() {
  function byId(id) { return document.getElementById(id); }

  function safeInt(x) {
    const n = Number(x);
    return Number.isFinite(n) ? n : null;
  }

  function computeCounts() {
    const playsN = safeInt(window.plays && window.plays.length);
    const peopleN = safeInt(window.people && window.people.length);

    let figN = null;
    if (Array.isArray(window.figuranDataRaw)) figN = safeInt(window.figuranDataRaw.length);
    else if (window.figuranSet && typeof window.figuranSet.size === "number") figN = safeInt(window.figuranSet.size);

    const elPlays = byId("cnt-plays");
    if (elPlays && playsN !== null) elPlays.textContent = String(playsN);

    const elPeople = byId("cnt-people");
    if (elPeople && peopleN !== null) elPeople.textContent = String(peopleN);

    const elFig = byId("cnt-figuran");
    if (elFig && figN !== null) elFig.textContent = String(figN);
  }

  // Expose for manual trigger (debug / future hooks)
  window.IDT_refreshTopCounts = computeCounts;

  // Single timer only
  try {
    if (window.__idtTopCountsTimer) clearInterval(window.__idtTopCountsTimer);
  } catch (e) {}

  window.__idtTopCountsTimer = setInterval(computeCounts, 1000);
  document.addEventListener("visibilitychange", function() {
    if (!document.hidden) computeCounts();
  });

  // First paint
  computeCounts();
})();

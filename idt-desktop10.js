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
      document.body.style.overflow = 'hidden';
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
          window.IDTLoading && window.IDTLoading.show(t.replace(/^⏳\s*/,''));
        }else{
          // don't hide aggressively, some screens may still compute
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

  function renderHeatmap(){
    const box = $('heatmapBox');
    if(!box) return;
    if(!Array.isArray(window.rows) || !window.rows.length){
      box.innerHTML = `<div class="empty">Veri yok.</div>`;
      return;
    }

    const limitSel = $('hmColLimit');
    const colLimit = limitSel ? Number(limitSel.value||35) : 35;

    // plays: window.plays is [{title,...}]
    const plays = Array.isArray(window.plays) ? window.plays.map(p=>p.title) : [];
    const people = Array.isArray(window.people) ? window.people.map(p=>p.title) : [];

    // limit columns by alphabetic order (already sorted in groupByPlay)
    const cols = plays.slice(0, Math.max(10, colLimit));
    const idx = buildHeatIndex(window.rows);

    const esc = (s)=> String(s||'').replace(/[&<>"']/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
    let html = `<table class="heatmapTable"><thead><tr><th class="stickyLeft">Kişi</th>`;
    for(const p of cols){
      html += `<th title="${esc(p)}">${esc(p)}</th>`;
    }
    html += `</tr></thead><tbody>`;

    // Show at most 180 people for performance, prioritize selected
    const maxPeople = 180;
    let rowsPeople = people.slice(0, maxPeople);

    if(state.kisi && !rowsPeople.includes(state.kisi) && people.includes(state.kisi)){
      rowsPeople = [state.kisi, ...rowsPeople.filter(x=>x!==state.kisi)].slice(0, maxPeople);
    }

    for(const person of rowsPeople){
      html += `<tr><td class="stickyLeft">${esc(person)}</td>`;
      for(const play of cols){
        const c = idx.get(person+'||'+play) || 0;
        if(c){
          const lvl = c>=4 ? 4 : c; // cap
          const cls = `heatCell isOn heat${lvl}` + ((state.kisi===person && state.oyun===play) ? ' isSelected' : '');
          html += `<td class="${cls}" data-person="${esc(person)}" data-play="${esc(play)}" title="${esc(person)} • ${esc(play)}">${c}</td>`;
        }else{
          html += `<td class="heatCell" data-person="${esc(person)}" data-play="${esc(play)}" title="${esc(person)} • ${esc(play)}"></td>`;
        }
      }
      html += `</tr>`;
    }
    html += `</tbody></table>`;
    box.innerHTML = html;

    // click handling
    box.querySelectorAll('.heatCell').forEach(td=>{
      td.addEventListener('click', ()=>{
        const person = td.getAttribute('data-person') || '';
        const play = td.getAttribute('data-play') || '';
        setState({kisi: person, oyun: play});
        // go to Panel
        const tabPanel = $('tabPanel');
        if(tabPanel) tabPanel.click();
        // try to open play in list (best-effort)
        try{
          if(typeof window.renderList === 'function' && typeof window.renderDetails === 'function'){
            // set to plays mode and find play item
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

  function setupHeatmap(){
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

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', () => {
    setupLoading();
    patchSetStatus();
    setupHelp();
    setupActiveFilters();
    setupHeatmap();
    setupObservers();

    // initial render heatmap if hash is matris
    try{
      if(String(location.hash||'').toLowerCase() === '#matris'){
        const t = $('tabHeatmap'); if(t) t.click();
      }
    }catch(_e){}
  });

})();
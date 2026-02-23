if (window.__idt_desktop1_inited) { console.warn('idt-desktop1: init skipped'); } else { window.__idt_desktop1_inited = true; }
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
    };
    const show = (text) => {
      if(text) msg.textContent = String(text);
      root.classList.remove('hidden');
      root.setAttribute('aria-hidden','false');
      
      if(window.__IDT_LOADING_AUTOT){ clearTimeout(window.__IDT_LOADING_AUTOT); }
      window.__IDT_LOADING_AUTOT = setTimeout(() => { 
        requestAnimationFrame(() => {
          try { hide(); } catch(_e){} 
        });
      }, 1400);
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

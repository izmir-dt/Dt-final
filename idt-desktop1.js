(() => {
  const $ = (id) => document.getElementById(id);

  function textOf(id){
    const el = $(id);
    if(!el) return '';
    return (el.textContent || '').trim();
  }

  function show(el){ el.classList.remove('hidden'); }
  function hide(el){ el.classList.add('hidden'); }

  // --- Yardım ---
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

  // --- Aktif Seçimler (UI seviyesinde, app.js'e dokunmadan) ---
  function buildChip(key, value){
    const chip = document.createElement('span');
    chip.className = 'afChip';
    chip.innerHTML = `<b>${key}:</b> <span class="v"></span> <span class="x" title="Kaldır">✕</span>`;
    chip.querySelector('.v').textContent = value;
    return chip;
  }

  function setupActiveFilters(){
    const bar = $('activeFilters');
    const chips = $('afChips');
    const clearAll = $('afClear');
    if(!bar || !chips || !clearAll) return;

    const update = () => {
      // Kaynaklar: Görev Ataması çoklu seçim kutuları (varsa)
      // Not: Burada “seçili” metinlerini DOM'dan okuyoruz. Tam state entegrasyonu bir sonraki büyük uygulamada.
      const play = textOf('msPlaysTxt');
      const person = textOf('msPeopleTxt');
      const role = textOf('msRolesTxt');

      const active = [];
      if(play && !/seç/i.test(play)) active.push(['Oyun', play]);
      if(person && !/seç/i.test(person)) active.push(['Kişi', person]);
      if(role && !/seç/i.test(role)) active.push(['Görev', role]);

      // Figüran görünürlüğünü bazı sürümlerde body sınıfından yakalayabiliyoruz
      if(document.body.classList.contains('fig-only') || document.body.classList.contains('scope-figuran')){
        active.push(['Figüran', 'Açık']);
      }

      chips.innerHTML = '';
      if(active.length === 0){
        hide(bar);
        return;
      }

      show(bar);
      for(const [k,v] of active){
        const c = buildChip(k,v);
        c.querySelector('.x').addEventListener('click', () => {
          // “Kaldır” davranışı: mümkün olan en güvenli şekilde ilgili UI alanını temizlemeye çalış.
          // (Veri/bloklara dokunmuyoruz)
          if(k === 'Oyun') {
            const btn = $('msPlays'); if(btn) btn.click();
            // Seçim UI'nı sıfırlamak her sürümde farklı olabildiği için, en güvenlisi “Temizle” akışına bırakmak.
          }
          if(k === 'Kişi') {
            const btn = $('msPeople'); if(btn) btn.click();
          }
          if(k === 'Görev') {
            const btn = $('msRoles'); if(btn) btn.click();
          }
          // Genel temizleme
          if($('assignFilterClear')) $('assignFilterClear').click();
          setTimeout(update, 0);
        });
        chips.appendChild(c);
      }
    };

    // Tüm seçimleri temizle
    clearAll.addEventListener('click', () => {
      if($('clearBtn')) $('clearBtn').click();
      if($('assignFilterClear')) $('assignFilterClear').click();
      // Arama temizle
      if($('qClear')) $('qClear').click();
      setTimeout(update, 0);
    });

    // Olaylarla güncelle
    const schedule = (() => {
      let t = 0;
      return () => {
        if(t) return;
        t = window.setTimeout(() => { t = 0; update(); }, 80);
      };
    })();

    document.addEventListener('click', schedule, true);
    document.addEventListener('input', schedule, true);
    window.addEventListener('load', update);
    update();
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupHelp();
    setupActiveFilters();
  });
})();

/* === IDT v1.0: Topbar nav glue + active highlight === */
(function(){
  function h(){ return (location.hash || "#panel").toLowerCase(); }

  document.addEventListener("click", function(e){
    const b = e.target && e.target.closest ? e.target.closest(".topNav2Btn") : null;
    if(!b) return;
    const id = b.getAttribute("data-go");
    const el = id ? document.getElementById(id) : null;
    if(el && el.click){
      e.preventDefault(); e.stopPropagation();
      el.click();
    }
  }, true);

  function setActive(){
    const hash = h();
    document.querySelectorAll(".topNav2Btn").forEach(b=>{
      const id = (b.getAttribute("data-go")||"").toLowerCase();
      const on =
        (hash.startsWith("#plays") && id==="sideplays") ||
        (hash.startsWith("#people") && id==="sidepeople") ||
        (hash.startsWith("#rows") && id==="siderows") ||
        (hash.startsWith("#dist") && id==="sidedist") ||
        (hash.startsWith("#matris") && id==="sideheatmap") ||
        (hash.startsWith("#charts") && id==="sidecharts") ||
        (hash.startsWith("#kesisim") && id==="sideintersect") ||
        (hash.startsWith("#figuran") && id==="sidefiguran");
      b.classList.toggle("is-active", !!on);
    });
  }
  window.addEventListener("hashchange", ()=>setTimeout(setActive,0));
  window.addEventListener("DOMContentLoaded", ()=>setTimeout(setActive,0));
  setTimeout(setActive,60);
})();

(() => {
  'use strict';
  
  // === YOĞUNLUK & ÇAKIŞMA MERKEZİ (SİSTEMATİK FİNAL) ===
  window.renderYoğunlukTablosu = async function() {
    const container = document.getElementById('ccList'); // Senin zipindeki tablo alanı
    if (!container) return;

    // Altın Kural: Veri gelmediyse bekle, hata basma
    const rawData = window.allDataRaw || [];
    if (rawData.length === 0) {
      container.innerHTML = `<div class="status-msg info">Veriler Google Sheets üzerinden yükleniyor, lütfen bekleyin...</div>`;
      return;
    }

    // --- "DEFAULT A" MANTIĞI ---
    // Bir personel aynı oyunda sadece bir kez sayılır (Görev setine göre gruplama)
    const data = rawData.filter((v, i, a) => 
      a.findIndex(t => (t.isim === v.isim && t.oyunAd === v.oyunAd)) === i
    );

    const plays = [...new Set(data.map(d => d.oyunAd))].sort();
    const people = [...new Set(data.map(d => d.isim))].sort();

    let html = `
    <div class="heatmap-container">
      <table class="heatmap-table" id="yoğunlukTableMain">
        <thead>
          <tr>
            <th class="sticky-col">PERSONEL / OYUN</th>
            ${plays.map(p => `<th class="rotate-text"><div><span>${p}</span></div></th>`).join('')}
          </tr>
        </thead>
        <tbody>`;

    people.forEach(person => {
      html += `<tr><td class="sticky-col"><b>${person}</b></td>`;
      plays.forEach(play => {
        const match = data.find(d => d.isim === person && d.oyunAd === play);
        const cellClass = match ? 'lvl-active' : '';
        html += `<td class="heatmap-cell ${cellClass}">${match ? '1' : ''}</td>`;
      });
      html += `</tr>`;
    });

    container.innerHTML = html + `</tbody></table></div>`;
  };

  // === EXCEL KOPYALAMA (TAB SEPARATED - HATASIZ) ===
  window.copyTableToExcel = function() {
    const table = document.getElementById("yoğunlukTableMain");
    if(!table) return;

    const rows = Array.from(table.querySelectorAll("tr"));
    const tsv = rows.map(tr => 
      Array.from(tr.querySelectorAll("th, td")).map(c => c.innerText.trim()).join("\t")
    ).join("\n");

    if(window.idtCopyToClipboard) {
      window.idtCopyToClipboard(tsv);
      if(window.setStatus) window.setStatus("✅ Excel için kopyalandı!", "ok");
    }
  };

  // Veri her değiştiğinde veya sekme açıldığında çalışması için köprü
  document.addEventListener('click', (e) => {
    if(e.target.closest('[data-go="sideintersect"]')) {
      setTimeout(window.renderYoğunlukTablosu, 100);
    }
  });

})();
/* === SİSTEMATİK YAMA: YOĞUNLUK TABLOSU DÜZELTME === */
window.renderYoğunlukTablosu = function() {
  const container = document.getElementById('ccList');
  const rawData = window.allDataRaw || [];
  if (!container || rawData.length === 0) return;

  // Altın Kural 3: Default A Mantığı (Mükerrerleri görselde temizler)
  const data = rawData.filter((v, i, a) => 
    a.findIndex(t => (t.isim === v.isim && t.oyunAd === v.oyunAd)) === i
  );

  const plays = [...new Set(data.map(d => d.oyunAd))].sort();
  const people = [...new Set(data.map(d => d.isim))].sort();

  let html = `<div class="heatmap-container"><table class="heatmap-table">
    <thead><tr><th class="sticky-col">PERSONEL</th>`;
  plays.forEach(p => html += `<th class="rotate-text"><div><span>${p}</span></div></th>`);
  html += `</tr></thead><tbody>`;

  people.forEach(person => {
    html += `<tr><td class="sticky-col">${person}</td>`;
    plays.forEach(play => {
      const m = data.find(d => d.isim === person && d.oyunAd === play);
      html += `<td class="heatmap-cell ${m ? 'lvl-active' : ''}">${m ? '1' : ''}</td>`;
    });
    html += `</tr>`;
  });
  container.innerHTML = html + `</tbody></table></div>`;
};
/* === İDT FİNAL TABLO & EXCEL DÜZELTME === */
window.renderYoğunlukTablosu = function() {
    const target = document.getElementById('ccList');
    if (!target || !window.allDataRaw) return;

    // Altın Kural 3: Default A Mantığı (Mükerrerleri görselde temizler)
    const cleanData = window.allDataRaw.filter((v, i, a) => 
        a.findIndex(t => (t.isim === v.isim && t.oyunAd === v.oyunAd)) === i
    );

    const plays = [...new Set(cleanData.map(d => d.oyunAd))].sort();
    const people = [...new Set(cleanData.map(d => d.isim))].sort();

    let h = `<div class="heatmap-wrapper"><table class="heatmap-table"><thead><tr><th class="sticky-col">PERSONEL / OYUN</th>`;
    plays.forEach(p => h += `<th class="rotate-text"><div><span>${p}</span></div></th>`);
    h += `</tr></thead><tbody>`;

    people.forEach(per => {
        h += `<tr><td class="sticky-col">${per}</td>`;
        plays.forEach(pl => {
            const m = cleanData.find(d => d.isim === per && d.oyunAd === pl);
            h += `<td class="heatmap-cell ${m ? 'lvl-active' : ''}">${m ? '1' : ''}</td>`;
        });
        h += `</tr>`;
    });
    target.innerHTML = h + `</tbody></table></div>`;
};
/* ============================================================
   İZMİR DT - SİSTEMATİK FİNAL RESTORASYON (HİÇBİR ŞEYİ SİLMEZ)
   ============================================================ */
window.renderYoğunlukTablosu = function() {
  const target = document.getElementById('ccList');
  if(!target || !window.allDataRaw) return;

  // Altın Kural 3: Default A (Mükerrerleri görselde temizler)
  const cleanData = window.allDataRaw.filter((v,i,a)=>a.findIndex(t=>(t.isim===v.isim && t.oyunAd===v.oyunAd))===i);
  
  const plays = [...new Set(cleanData.map(d => d.oyunAd))].sort();
  const people = [...new Set(cleanData.map(d => d.isim))].sort();

  let h = `<div class="heatmap-wrapper"><table class="heatmap-table"><thead><tr><th class="sticky-col">Personel</th>`;
  plays.forEach(p => h += `<th class="rotate-text"><div><span>${p}</span></div></th>`);
  h += `</tr></thead><tbody>`;

  people.forEach(per => {
    h += `<tr><td class="sticky-col">${per}</td>`;
    plays.forEach(pl => {
      const m = cleanData.find(d => d.isim === per && d.oyunAd === pl);
      h += `<td class="heatmap-cell ${m?'lvl-active':''}">${m?'1':''}</td>`;
    });
    h += `</tr>`;
  });
  target.innerHTML = h + `</tbody></table></div>`;
};

// app.js ile haberleşmeyi sağlar (Otomatik Tetikleme)
const originalStatsFn = window.idtUpdateStats;
window.idtUpdateStats = function() {
    if(originalStatsFn) originalStatsFn();
    if(window.renderYoğunlukTablosu) window.renderYoğunlukTablosu();
};
/* === SİSTEMATİK ALTIN KURAL: DEFAULT A & GÖRSEL HİZALAMA === */
window.setupHeatmap = function() {
  const container = document.getElementById('ccList'); // Senin index.html'deki yerin
  if(!container || !window.allDataRaw || window.allDataRaw.length === 0) return;

  // Altın Kural: Default A (Bir isim, aynı oyunda sadece bir kez sayılır)
  const data = window.allDataRaw.filter((v, i, a) => 
    a.findIndex(t => (t.isim === v.isim && t.oyunAd === v.oyunAd)) === i
  );

  const plays = [...new Set(data.map(d => d.oyunAd))].sort();
  const people = [...new Set(data.map(d => d.isim))].sort();

  let html = `
  <div class="heatmap-scroll-area">
    <table class="idt-heatmap-main" id="heatmapTable">
      <thead>
        <tr>
          <th class="sticky-col-name">PERSONEL / OYUN</th>
          ${plays.map(p => `<th class="rotate-header"><div><span>${p}</span></div></th>`).join('')}
        </tr>
      </thead>
      <tbody>`;

  people.forEach(person => {
    html += `<tr><td class="sticky-col-name"><b>${person}</b></td>`;
    plays.forEach(play => {
      const match = data.find(d => d.isim === person && d.oyunAd === play);
      html += `<td class="h-cell ${match ? 'h-active' : ''}">${match ? '1' : ''}</td>`;
    });
    html += `</tr>`;
  });

  container.innerHTML = html + `</tbody></table></div>`;
};

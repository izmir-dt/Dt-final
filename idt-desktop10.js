/* === IDT V9 FINAL: YOĞUNLUK TABLOSU === */
window.setupHeatmap = function() {
  const container = document.getElementById('ccList');
  if(!container || !window.allDataRaw || window.allDataRaw.length === 0) return;

  // Altın Kural 3: Default A (Aynı kişi & oyun teke düşer)
  const data = window.allDataRaw.filter((v, i, a) => 
    a.findIndex(t => (t.isim === v.isim && t.oyunAd === v.oyunAd)) === i
  );

  const plays = [...new Set(data.map(d => d.oyunAd))].sort();
  const people = [...new Set(data.map(d => d.isim))].sort();

  let html = `
  <div class="idt-h-wrapper">
    <table class="idt-h-table">
      <thead>
        <tr>
          <th class="idt-sticky-x">PERSONEL / OYUN</th>
          ${plays.map(p => `<th class="idt-v-text"><div><span>${p}</span></div></th>`).join('')}
        </tr>
      </thead>
      <tbody>`;

  people.forEach(person => {
    html += `<tr><td class="idt-sticky-x"><b>${person}</b></td>`;
    plays.forEach(play => {
      const match = data.find(d => d.isim === person && d.oyunAd === play);
      html += `<td class="idt-cell ${match ? 'idt-active' : ''}">${match ? '1' : ''}</td>`;
    });
    html += `</tr>`;
  });

  container.innerHTML = html + `</tbody></table></div>`;
};

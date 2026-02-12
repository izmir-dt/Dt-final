window.setupHeatmap = function() {
  const container = document.getElementById('ccList'); // index.html'deki hedef alan
  if(!container || !window.allDataRaw || window.allDataRaw.length === 0) return;

  // ALTIN KURAL 3: DEFAULT A (Aynı kişi aynı oyunda sadece 1 kez görünür)
  const data = window.allDataRaw.filter((v, i, a) => 
    a.findIndex(t => (t.isim === v.isim && t.oyunAd === v.oyunAd)) === i
  );

  const plays = [...new Set(data.map(d => d.oyunAd))].sort();
  const people = [...new Set(data.map(d => d.isim))].sort();

  let html = `
  <div class="idt-final-wrapper">
    <table class="idt-final-table">
      <thead>
        <tr>
          <th class="idt-sticky-col">PERSONEL / OYUN</th>
          ${plays.map(p => `<th class="idt-rotate"><div><span>${p}</span></div></th>`).join('')}
        </tr>
      </thead>
      <tbody>`;

  people.forEach(person => {
    html += `<tr><td class="idt-sticky-col"><b>${person}</b></td>`;
    plays.forEach(play => {
      const match = data.find(d => d.isim === person && d.oyunAd === play);
      html += `<td class="idt-cell ${match ? 'idt-active' : ''}">${match ? '1' : ''}</td>`;
    });
    html += `</tr>`;
  });

  container.innerHTML = html + `</tbody></table></div>`;
};

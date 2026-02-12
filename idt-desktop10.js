window.setupHeatmap = function() {
  const container = document.getElementById('ccList');
  if(!container || !window.allDataRaw || window.allDataRaw.length === 0) return;

  // DEFAULT A: Aynı personel aynı oyunda 1 kez görünür
  const data = window.allDataRaw.filter((v, i, a) => 
    a.findIndex(t => (t.isim === v.isim && t.oyunAd === v.oyunAd)) === i
  );

  const plays = [...new Set(data.map(d => d.oyunAd))].sort();
  const people = [...new Set(data.map(d => d.isim))].sort();

  let html = `<div class="idt-final-wrap"><table class="idt-final-table"><thead><tr><th class="idt-sticky">PERSONEL / OYUN</th>`;
  plays.forEach(p => html += `<th class="idt-rotate"><div><span>${p}</span></div></th>`);
  html += `</tr></thead><tbody>`;

  people.forEach(person => {
    html += `<tr><td class="idt-sticky"><b>${person}</b></td>`;
    plays.forEach(play => {
      const match = data.find(d => d.isim === person && d.oyunAd === play);
      html += `<td class="idt-cell ${match ? 'idt-active' : ''}">${match ? '1' : ''}</td>`;
    });
    html += `</tr>`;
  });

  container.innerHTML = html + `</tbody></table></div>`;
};

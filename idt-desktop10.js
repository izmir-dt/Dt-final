window.setupHeatmap = function() {
  const container = document.getElementById('ccList');
  if(!container || !window.allDataRaw || window.allDataRaw.length === 0) return;

  // Altın Kural 3: Default A (Mükerrer Temizliği)
  const data = window.allDataRaw.filter((v, i, a) => 
    a.findIndex(t => (t.isim === v.isim && t.oyunAd === v.oyunAd)) === i
  );

  const plays = [...new Set(data.map(d => d.oyunAd))].sort();
  const people = [...new Set(data.map(d => d.isim))].sort();

  let html = `<div class="h-wrap"><table class="h-table"><thead><tr><th class="sticky-x">PERSONEL</th>`;
  plays.forEach(p => html += `<th class="v-text"><div><span>${p}</span></div></th>`);
  html += `</tr></thead><tbody>`;

  people.forEach(person => {
    html += `<tr><td class="sticky-x">${person}</td>`;
    plays.forEach(play => {
      const match = data.find(d => d.isim === person && d.oyunAd === play);
      html += `<td class="cell ${match ? 'active' : ''}">${match ? '1' : ''}</td>`;
    });
    html += `</tr>`;
  });
  container.innerHTML = html + `</tbody></table></div>`;
};

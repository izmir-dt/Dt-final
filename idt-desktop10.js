window.setupHeatmap = function() {
  const target = document.getElementById('ccList');
  if(!target || !window.allDataRaw || window.allDataRaw.length === 0) return;

  // Default A: Mükerrerleri temizle
  const clean = window.allDataRaw.filter((v, i, a) => 
    a.findIndex(t => (t.isim === v.isim && t.oyunAd === v.oyunAd)) === i
  );

  const plays = [...new Set(clean.map(d => d.oyunAd))].sort();
  const people = [...new Set(clean.map(d => d.isim))].sort();

  let html = `<div class="final-container"><table class="final-table"><thead><tr><th class="f-sticky">AD SOYAD / OYUN</th>`;
  plays.forEach(p => html += `<th class="f-rotate"><div><span>${p}</span></div></th>`);
  html += `</tr></thead><tbody>`;

  people.forEach(per => {
    html += `<tr><td class="f-sticky"><b>${per}</b></td>`;
    plays.forEach(pl => {
      const match = clean.find(d => d.isim === per && d.oyunAd === pl);
      html += `<td class="f-cell ${match ? 'f-active' : ''}">${match ? '1' : ''}</td>`;
    });
    html += `</tr>`;
  });

  target.innerHTML = html + `</tbody></table></div>`;
};

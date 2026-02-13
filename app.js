const CONFIG = {
  SPREADSHEET_ID: "1sIzswZnMkyRPJejAsE_ylSKzAF0RmFiACP4jYtz-AE0",
  GID: "1233566992",
  gvizUrl() { return `https://docs.google.com/spreadsheets/d/${this.SPREADSHEET_ID}/gviz/tq?gid=${this.GID}&tqx=out:json&_=${Date.now()}`; }
};

let allDataRaw = [];

async function fetchData() {
  try {
    const res = await fetch(CONFIG.gvizUrl());
    const text = await res.text();
    const json = JSON.parse(text.substr(47).slice(0, -2)); // GViz JSONP temizle

    const rows = json.table.rows;
    allDataRaw = rows.map(row => {
      const obj = {};
      row.c.forEach((cell, i) => {
        const label = json.table.cols[i].label.toLowerCase();
        obj[label] = cell?.v ?? '';
      });
      return obj;
    });

    renderData();
    updateMetrics();
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('dataList').style.display = 'block';
  } catch (err) {
    console.error('Veri çekme hatası:', err);
    document.getElementById('emptyState').innerHTML = '<h2>Veri çekilemedi</h2><p>Google Sheet erişim sorunu olabilir. <button onclick="location.reload()">Yenile</button></p>';
  }
}

function renderData() {
  const container = document.getElementById('dataList');
  container.innerHTML = '<h2>Veri Listesi</h2><table border="1"><thead><tr><th>Oyun</th><th>Kişi</th><th>Görev</th></tr></thead><tbody></tbody></table>';

  const tbody = container.querySelector('tbody');
  allDataRaw.slice(0, 50).forEach(row => {  // ilk 50'yi göster, performans için
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.oyun || row.oyunadı || '—'}</td>
                    <td>${row.kişi || row.isim || '—'}</td>
                    <td>${row.görev || '—'}</td>`;
    tbody.appendChild(tr);
  });
}

function updateMetrics() {
  const totalGames = new Set(allDataRaw.map(r => r.oyun || r.oyunadı || '')).size;
  const totalPeople = new Set(allDataRaw.map(r => r.kişi || r.isim || '')).size;

  document.getElementById('stat-total-games').textContent = totalGames || '—';
  document.getElementById('stat-total-personel').textContent = totalPeople || '—';
  document.getElementById('stat-active-view').textContent = 'Tümü';

  document.getElementById('view-stats-current').textContent = `Bu görünümde ${allDataRaw.length} kayıt`;
  document.getElementById('view-stats-total').textContent = `Toplam ${totalPeople} kişi`;
}

window.addEventListener('DOMContentLoaded', () => {
  fetchData();
});

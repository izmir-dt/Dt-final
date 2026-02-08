// app.js içindeki renderList fonksiyonunda ilgili kısmı şu yapıyla güncelleyebilirsiniz:
function renderList(data) {
  const container = document.getElementById("list");
  container.innerHTML = data.map(item => `
    <div class="item-card" onclick="showDetail('${item.id}')">
      <div class="item-info">
        <h3>${item.ad}</h3>
        <p>${item.rol || 'Görev Belirtilmedi'}</p>
      </div>
      <div class="item-action">
        <span style="color: var(--accent); font-weight: bold;">→</span>
      </div>
    </div>
  `).join('');
}

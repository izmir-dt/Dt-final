// --- CONFIG (KAYNAK DOSYALARINDAN ALINAN SABİTLER) ---
const CONFIG = {
  SPREADSHEET_ID: "1sIzswZnMkyRPJejAsE_ylSKzAF0RmFiACP4jYtz-AE0",
  GID: "1233566992", // BÜTÜN OYUNLAR
  NOTIF_API: "https://script.google.com/macros/s/AKfycbx-Q5P-dF5EB3GGCSHMUFV3din4OEYHhvSeGSZZjmSj7fN4_XtEL4h9E55XFy0-tL8V/exec",
  SHEET_MAIN: "BÜTÜN OYUNLAR",
  SHEET_FIGURAN: "FİGÜRAN LİSTESİ"
};

let RAW_DATA = [];

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    loadMainData();
    setupSearch();
});

// --- VERİ ÇEKME (ASLA BOZULMAYAN KISIM) ---
async function loadMainData() {
    setStatus("Veriler senkronize ediliyor...", "ok");
    const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${CONFIG.GID}`;
    
    try {
        const resp = await fetch(url);
        const text = await resp.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        processData(json);
    } catch (e) {
        setStatus("Bağlantı Hatası!", "err");
    }
}

function processData(json) {
    const rows = json.table.rows;
    RAW_DATA = rows.map(r => ({
        oyun: r.c[0] ? String(r.c[0].v) : "",
        kategori: r.c[1] ? String(r.c[1].v) : "",
        gorev: r.c[2] ? String(r.c[2].v) : "",
        kisi: r.c[3] ? String(r.c[3].v) : ""
    }));

    renderPanel(RAW_DATA);
    document.getElementById('statOyun').innerText = [...new Set(RAW_DATA.map(d => d.oyun))].length;
}

// --- UI RENDER (MODERN KART SİSTEMİ) ---
function renderPanel(data) {
    const list = document.getElementById('mainList');
    list.innerHTML = data.map(item => `
        <div class="data-card">
            <h4>${item.oyun}</h4>
            <div class="meta">
                <span>👤 ${item.kisi}</span>
                <span>🎭 ${item.gorev}</span>
            </div>
            <div style="font-size:0.7rem; color:var(--muted); margin-top:5px;">${item.kategori}</div>
        </div>
    `).join('');
}

// --- TAB YÖNETİMİ ---
function switchTab(tabId, btn) {
    // UI Güncelleme
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view${tabId}`).classList.add('active');

    // Tab'a özel veri yükleme (Eski fonksiyonlarını buradan çağırabilirsin)
    if(tabId === 'Figuran') loadFiguranData();
    if(tabId === 'Analiz') checkConflicts();
}

// --- ARAMA MOTORU ---
function setupSearch() {
    document.getElementById('q').oninput = (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = RAW_DATA.filter(d => 
            d.oyun.toLowerCase().includes(term) || 
            d.kisi.toLowerCase().includes(term) ||
            d.gorev.toLowerCase().includes(term)
        );
        renderPanel(filtered);
    };
}

function setStatus(msg, type) {
    const s = document.getElementById('status');
    s.innerText = msg;
    s.className = type === 'ok' ? 'st-ok' : 'st-err';
    s.style.display = 'block';
    setTimeout(() => s.style.display = 'none', 3000);
}

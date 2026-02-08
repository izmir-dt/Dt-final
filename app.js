// --- CONFIG (SENİN ORİJİNAL VERİLERİN - DEĞİŞTİRİLMEDİ) ---
const CONFIG = {
  SPREADSHEET_ID: "1sIzswZnMkyRPJejAsE_ylSKzAF0RmFiACP4jYtz-AE0",
  GID: "1233566992",
  SHEET_MAIN: "BÜTÜN OYUNLAR",
  SHEET_FIGURAN: "FİGÜRAN LİSTESİ",
  SHEET_NOTIFS: "BİLDİRİMLER",
  // Google Sheet URL'si (Aç butonu için)
  get sheetUrl() { return `https://docs.google.com/spreadsheets/d/${this.SPREADSHEET_ID}/edit#gid=${this.GID}`; }
};

// --- GLOBAL STATE ---
let RAW_DATA = [];

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
    // Sheet'i Aç butonunu bağla
    document.getElementById('sheetLink').href = CONFIG.sheetUrl;
    
    // Veriyi çek
    loadInitialData();

    // Arama motoru
    document.getElementById('q').addEventListener('input', (e) => {
        filterTable(e.target.value);
    });

    document.getElementById('refreshBtn').onclick = () => loadInitialData();
});

// --- VERİ ÇEKME ÇEKİRDEĞİ (ASLA BOZULMAYACAK) ---
async function loadInitialData() {
    setStatus("Veriler çekiliyor...", "info");
    const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${CONFIG.GID}`;
    
    try {
        const resp = await fetch(url);
        const text = await resp.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        processGviz(json);
        setStatus("Veriler güncellendi", "ok");
    } catch (e) {
        setStatus("Veri çekme hatası!", "err");
        console.error(e);
    }
}

function processGviz(json) {
    const rows = json.table.rows;
    const cols = json.table.cols;
    
    // Tablo Başlıkları
    const headHtml = cols.map(c => `<th>${c.label || ''}</th>`).join('');
    document.getElementById('mainHead').innerHTML = `<tr>${headHtml}</tr>`;
    
    // Tablo Verisi
    RAW_DATA = rows.map(r => r.c.map(cell => cell ? (cell.v || '') : ''));
    renderTable(RAW_DATA);
    
    // KPI Güncelle
    document.getElementById('countOyun').innerText = [...new Set(RAW_DATA.map(r => r[0]))].length;
}

// --- UI YARDIMCILARI ---
function renderTable(data) {
    const body = document.getElementById('mainBody');
    body.innerHTML = data.map(row => `
        <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
    `).join('');
}

function filterTable(term) {
    const filtered = RAW_DATA.filter(row => 
        row.some(cell => String(cell).toLowerCase().includes(term.toLowerCase()))
    );
    renderTable(filtered);
}

function showTab(target, btn) {
    // Tab butonlarını güncelle
    document.querySelectorAll('.tab-item').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Seksiyonları güncelle
    document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`section-${target}`).classList.add('active');
}

function setStatus(msg, type) {
    const s = document.getElementById('status');
    s.innerText = msg;
    s.className = `status-${type}`;
    s.style.display = 'block';
    setTimeout(() => s.style.display = 'none', 3000);
}

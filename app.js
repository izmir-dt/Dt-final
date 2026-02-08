/**
 * APP CONFIGURATION
 * Apps Script URL'ni buraya yapıştır.
 */
const APP_CONFIG = {
    // SİZE AİT Apps Script Web App URL (doGet içeren)
    SCRIPT_URL: "https://script.google.com/macros/s/AKfycbz-Td3cnbMkGRVW4kFXvlvD58O6yygQ-U2aJ7vHSkxAFrAsR5j7QhMFt0xrGg4gZQLb/exec",
    // Google Sheets Ana Veri GID (BÜTÜN OYUNLAR sayfası için gviz kullanımı)
    GID_MAIN: "1233566992",
    SPREADSHEET_ID: "1sIzswZnMkyRPJejAsE_ylSKzAF0RmFiACP4jYtz-AE0"
};

let STATE = {
    allData: [],
    figuranData: [],
    notifications: [],
    activeTab: 'all'
};

// 1. DATA FETCHING (Senin doGet Yapına Uygun)
async function fetchFromScript(sheetName, limit = 100) {
    const url = `${APP_CONFIG.SCRIPT_URL}?sheet=${encodeURIComponent(sheetName)}&limit=${limit}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.ok ? data.rows : [];
    } catch (err) {
        console.error("Veri çekilemedi:", err);
        return [];
    }
}

// 2. GVİZ FETCHING (Hızlı Tablo Verisi İçin)
async function fetchMainData() {
    const url = `https://docs.google.com/spreadsheets/d/${APP_CONFIG.SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${APP_CONFIG.GID_MAIN}`;
    try {
        const resp = await fetch(url);
        const text = await resp.text();
        const json = JSON.parse(text.substring(47, text.length - 2));
        
        // Gviz verisini düz objelere çevir
        return json.table.rows.map(r => ({
            oyun: r.c[0] ? r.c[0].v : "",
            kategori: r.c[1] ? r.c[1].v : "",
            gorev: r.c[2] ? r.c[2].v : "",
            kisi: r.c[3] ? r.c[3].v : ""
        }));
    } catch (e) {
        return [];
    }
}

// 3. RENDER ENGINE
function renderData() {
    const container = document.getElementById('mainView');
    const term = document.getElementById('searchInput').value.toLowerCase();
    
    let targetData = STATE.activeTab === 'all' ? STATE.allData : STATE.allData.filter(d => d.kategori.toLowerCase().includes('figüran'));
    
    // Filtreleme
    const filtered = targetData.filter(item => 
        item.oyun.toLowerCase().includes(term) || 
        item.kisi.toLowerCase().includes(term) ||
        item.gorev.toLowerCase().includes(term)
    );

    container.innerHTML = filtered.map(item => `
        <div class="data-item">
            <h3>${item.oyun}</h3>
            <div class="meta">
                <span class="badge badge-kisi">👤 ${item.kisi}</span>
                <span class="badge">🎭 ${item.gorev}</span>
            </div>
            <div style="font-size: 0.7rem; color: #aaa;">${item.kategori}</div>
        </div>
    `).join('');

    // İstatistikleri güncelle
    document.getElementById('statOyun').innerText = [...new Set(STATE.allData.map(d => d.oyun))].length;
    document.getElementById('statFiguran').innerText = STATE.allData.filter(d => d.kategori.toLowerCase().includes('figüran')).length;
}

// 4. BİLDİRİM PANELİ
async function loadNotifications() {
    const notifs = await fetchFromScript("BİLDİRİMLER", 20);
    const list = document.getElementById('notifList');
    list.innerHTML = notifs.reverse().map(n => `
        <div class="notif-item">
            <div style="font-weight:700; color:var(--primary);">${n.İşlem}</div>
            <div>${n.Açıklama}</div>
            <div style="font-size:0.7rem; color:#888; margin-top:5px;">${n.Tarih}</div>
        </div>
    `).join('');
}

// 5. EVENTS & NAVIGATION
function switchTab(tab) {
    STATE.activeTab = tab;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderData();
}

function toggleNotifs() {
    const panel = document.getElementById('notifPanel');
    panel.classList.toggle('open');
    if(panel.classList.contains('open')) loadNotifications();
}

// INITIALIZE
document.addEventListener('DOMContentLoaded', async () => {
    // Arama dinleyici
    document.getElementById('searchInput').oninput = renderData;
    
    // Verileri çek
    STATE.allData = await fetchMainData();
    renderData();
    
    // Arka planda bildirimleri kontrol et
    loadNotifications();
});

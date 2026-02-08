/**
 * İzmir DT - Repertuvar Takip Sistemi v2.0
 * UX/UI ve Bildirim Yönetimi
 */

// 1. SELECTORS
const els = {
    notifTrigger: document.getElementById('notifTrigger'),
    notifPanel: document.getElementById('notifSidePanel'),
    closeNotif: document.getElementById('closeNotif'),
    notifList: document.getElementById('notifList'),
    notifBadge: document.getElementById('notifBadge'),
    themeToggle: document.getElementById('themeToggle'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    tableBody: document.getElementById('tableBody'),
    tableHead: document.getElementById('tableHead'),
    globalSearch: document.getElementById('globalSearch')
};

// 2. STATE MANAGEMENT
let appState = {
    currentTab: 'panel',
    data: [],
    notifications: [],
    isDark: false
};

// 3. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Bildirim Paneli Aç/Kapat
    els.notifTrigger.onclick = () => els.notifPanel.classList.toggle('open');
    els.closeNotif.onclick = () => els.notifPanel.classList.remove('open');

    // Tema Değiştirici
    els.themeToggle.onclick = () => {
        appState.isDark = !appState.isDark;
        document.documentElement.setAttribute('data-theme', appState.isDark ? 'dark' : 'light');
    };

    // Tab Yönetimi
    els.tabBtns.forEach(btn => {
        btn.onclick = (e) => {
            if(!btn.dataset.tab) return;
            els.tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            appState.currentTab = btn.dataset.tab;
            renderView();
        };
    });

    // Arama Fonksiyonu
    els.globalSearch.oninput = (e) => {
        const term = e.target.value.toLowerCase();
        filterData(term);
    };

    // Mevcut veri çekme fonksiyonunu çağır (Bozulmayacak dediğiniz kısım)
    if (typeof loadAllData === 'function') loadAllData();
}

// 4. UI RENDERING (Yeni Görünüm Motoru)
function renderNotifications(notifs) {
    els.notifList.innerHTML = '';
    if (notifs.length > 0) {
        els.notifBadge.style.display = 'block';
        els.notifBadge.innerText = notifs.length;
        
        notifs.forEach(n => {
            const div = document.createElement('div');
            div.className = 'card';
            div.style.marginBottom = '0.75rem';
            div.style.padding = '0.8rem';
            div.style.fontSize = '0.85rem';
            div.innerHTML = `
                <div style="color:var(--primary); font-weight:600; margin-bottom:4px;">${n.type || 'BİLGİ'}</div>
                <div>${n.message}</div>
                <div style="color:var(--muted); font-size:0.7rem; margin-top:5px;">${n.time || ''}</div>
            `;
            els.notifList.appendChild(div);
        });
    }
}

// 5. DATA BRIDGE (Mevcut veriyi yeni tabloya basar)
function updateTableUI(headers, rows) {
    els.tableHead.innerHTML = headers.map(h => `<th>${h}</th>`).join('');
    els.tableBody.innerHTML = rows.map(row => `
        <tr>
            ${row.map(cell => `<td>${cell}</td>`).join('')}
        </tr>
    `).join('');
}

// NOT: Veri çekme (fetchGviz) ve processGviz kısımları 
// sizin mevcut kodunuzdan aynen devam edeceği için buraya eklemedim.
// Sadece UI'yı bu fonksiyonlarla beslemeniz yeterli olacaktır.

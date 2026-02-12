// Çakışmayı önlemek için değişken ismini IDT_CONFIG yaptım
const IDT_CONFIG = {
  SPREADSHEET_ID: "1sIzswZnMkyRPJejAsE_ylSKzAF0RmFiACP4jYtz-AE0",
  GID: "1233566992"
};

window.allDataRaw = [];

async function idtFetchAll() {
  const url = `https://docs.google.com/spreadsheets/d/${IDT_CONFIG.SPREADSHEET_ID}/gviz/tq?tqx=out:json&gid=${IDT_CONFIG.GID}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    const json = JSON.parse(text.substring(47, text.length - 2));
    
    // Veri kolonlarını senin sistemine göre (1:İsim, 2:Oyun) çekiyoruz
    window.allDataRaw = json.table.rows.map(row => ({
      isim: (row.c[1] && row.c[1].v) ? String(row.c[1].v).trim() : "",
      oyunAd: (row.c[2] && row.c[2].v) ? String(row.c[2].v).trim() : ""
    })).filter(item => item.isim !== "" && item.oyunAd !== "");

    // Veri bittiğinde her şeyi tetikle
    if(window.idtUpdateStats) window.idtUpdateStats();
    if(window.setupHeatmap) window.setupHeatmap(); 
    
  } catch (err) {
    console.error("Veri hatası:", err);
  }
}

function idtUpdateStats() {
  const pEl = document.getElementById("stat-total-personel");
  if(pEl) pEl.textContent = String(window.allDataRaw.length);
}

document.addEventListener('DOMContentLoaded', idtFetchAll);

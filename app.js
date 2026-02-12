const IZMIR_DT_CONFIG_FINAL = {
  id: "1sIzswZnMkyRPJejAsE_ylSKzAF0RmFiACP4jYtz-AE0",
  gid: "1233566992"
};

window.allDataRaw = [];

async function idtFetchAll() {
  const url = `https://docs.google.com/spreadsheets/d/${IZMIR_DT_CONFIG_FINAL.id}/gviz/tq?tqx=out:json&gid=${IZMIR_DT_CONFIG_FINAL.gid}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    const data = JSON.parse(text.substring(47, text.length - 2));
    
    window.allDataRaw = data.table.rows.map(r => ({
      isim: (r.c[1] && r.c[1].v) ? String(r.c[1].v).trim() : "",
      oyunAd: (r.c[2] && r.c[2].v) ? String(r.c[2].v).trim() : ""
    })).filter(i => i.isim && i.oyunAd);

    console.log("⚓ Veri Çekildi:", window.allDataRaw.length);
    
    if(window.setupHeatmap) window.setupHeatmap(); 
    if(window.idtUpdateStats) window.idtUpdateStats();
  } catch (e) { console.error("Bağlantı Hatası:", e); }
}

document.addEventListener('DOMContentLoaded', idtFetchAll);

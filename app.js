const API =
"https://script.google.com/macros/s/AKfycbxkmxnDtSlfXa008qh_cS2dneTVweaQtMVTIUmOWR1PkAWlHX2EQkd86HwN5X9vZrCp/exec?sheet=BÜTÜN%20OYUNLAR&limit=5000";

const status = document.getElementById("status");
const list   = document.getElementById("list");

load();

async function load(){
  try{
    status.textContent = "Google Sheet okunuyor...";

    const res = await fetch(API + "&_=" + Date.now());
    const json = await res.json();

    if(!json.ok) throw "API error";

    render(json.rows);
  }
  catch(err){
    status.textContent = "❌ Veri alınamadı";
    console.error(err);
  }
}

function render(rows){

  status.textContent = rows.length + " kayıt yüklendi";
  list.innerHTML = "";

  rows.forEach(r=>{

    const oyun = r["Oyun Adı"] || r["Oyun"] || "";
    const kisi = r["Kişi"] || "";
    const gorev = r["Görev"] || "";
    const kategori = r["Kategori"] || "";

    if(!kisi) return;

    const div = document.createElement("div");
    div.className="card";

    div.innerHTML = `
      <div class="title">${kisi}</div>
      <div class="meta">${oyun}</div>
      <div class="meta">${kategori} • ${gorev}</div>
    `;

    list.appendChild(div);
  });

}

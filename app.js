
const CONFIG = {
  SPREADSHEET_ID: "1sIzswZnMkyRPJejAsE_ylSKzAF0RmFiACP4jYtz-AE0",
  API_BASE: "https://script.google.com/macros/s/AKfycbx-Q5P-dF5EB3GGCSHMUFV3din4OEYHhvSeGSZZjmSj7fN4_XtEL4h9E55XFy0-tL8V/exec",
  SHEET_MAIN: "BÜTÜN OYUNLAR",
  SHEET_FIGURAN: "FİGÜRAN LİSTESİ",
  SHEET_NOTIFS: "BİLDİRİMLER",


  // Ana veri (genelde: "BÜTÜN OYUNLAR")
  GID: "1233566992",

  // Apps Script'in oluşturduğu LOG sayfasının gid'sini buraya yaz (URL'den kopyala: ...?gid=XXXX)
  LOG_GID: "",

  sheetUrl(gid=this.GID){ return `https://docs.google.com/spreadsheets/d/${this.SPREADSHEET_ID}/edit?gid=${gid}`; },
  gvizUrl(gid=this.GID){ return `https://docs.google.com/spreadsheets/d/${this.SPREADSHEET_ID}/gviz/tq?gid=${gid}&tqx=out:json&_=${Date.now()}`; },
  csvUrl(gid=this.GID){  return `https://docs.google.com/spreadsheets/d/${this.SPREADSHEET_ID}/export?format=csv&gid=${gid}&_=${Date.now()}`; },
};

function isMobile(){
  return window.matchMedia && window.matchMedia("(max-width: 980px)").matches;
}

// Filtre eşleşmeleri: boşluk / büyük-küçük harf / görünmez karakter farklarını tolere et
function normKey(s){
  return String(s||"")
    .trim()
    .toLowerCase()
    .normalize("NFKC")
    .replace(/\s+/g, " ");
}

function openMobileModal(html){
  if(!isMobile()) return;
  els.mobileContent.innerHTML = html;
  els.mobileOverlay.classList.remove("hidden");
  els.mobileModal.classList.remove("hidden");
  els.mobileOverlay.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}
function closeMobileModal(){
  els.mobileOverlay.classList.add("hidden");
  els.mobileModal.classList.add("hidden");
  els.mobileOverlay.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}

const el = (id)=>document.getElementById(id);
const els = {
  themeBtn: el("themeBtn"),
  status: el("status"),
  apiTestLink: el("apiTestLink"),
  sheetBtn: el("sheetBtn"),
  reloadBtn: el("reloadBtn"),
  notifBtn: el("notifBtn"),
  notifPanel: el("notifPanel"),
  notifCount: el("notifCount"),
  notifList: el("notifList"),
  notifRefresh: el("notifRefresh"),
  notifClose: el("notifClose"),

  tabPanel: el("tabPanel"),
  tabDistribution: el("tabDistribution"),
  tabIntersection: el("tabIntersection"),
  tabFiguran: el("tabFiguran"),
  tabCharts: el("tabCharts"),

  viewPanel: el("viewPanel"),
  viewDistribution: el("viewDistribution"),
  viewIntersection: el("viewIntersection"),
  viewFiguran: el("viewFiguran"),
  viewCharts: el("viewCharts"),

  q: el("q"),
  category: el("category"),
  clearBtn: el("clearBtn"),
  list: el("list"),
  hint: el("hint"),
  details: el("details"),
  copyBtn: el("copyBtn"),

  btnPlays: el("btnPlays"),
  btnPeople: el("btnPeople"),

  dq: el("dq"),
  dClear: el("dClear"),
  distributionBox: el("distributionBox"),

  p1: el("p1"),
  p2: el("p2"),
  swapBtn: el("swapBtn"),
  intersectionBox: el("intersectionBox"),

  fq: el("fq"),
  fClear: el("fClear"),
  figuranBox: el("figuranBox"),
  figDownloadAllBtn: el("figDownloadAllBtn"),
  figDownloadFilteredBtn: el("figDownloadFilteredBtn"),

  chartTabRoles: el("chartTabRoles"),
  chartTabCats: el("chartTabCats"),
  chartTitle: el("chartTitle"),
  chartMain: el("chartMain"),

  drawer: el("chartDrawer"),
  drawerTitle: el("drawerTitle"),
  drawerSub: el("drawerSub"),
  drawerClose: el("drawerClose"),
  drawerSearch: el("drawerSearch"),
  drawerList: el("drawerList"),

  kpiPlays: el("kpiPlays"),
  kpiPeople: el("kpiPeople"),
  kpiRows: el("kpiRows"),
  kpiFiguran: el("kpiFiguran"),
};

// ✅ Fail-safe: Google Sheet'i Aç linki her durumda çalışsın
try{ if(els.sheetBtn) els.sheetBtn.href = CONFIG.sheetUrl();
if(els.apiTestLink){ els.apiTestLink.href = `${CONFIG.API_BASE}?sheet=${encodeURIComponent(CONFIG.SHEET_MAIN)}`; } }catch(e){}

els.sheetBtn.href = CONFIG.sheetUrl();
if(els.apiTestLink){ els.apiTestLink.href = `${CONFIG.API_BASE}?sheet=${encodeURIComponent(CONFIG.SHEET_MAIN)}`; }

let rawRows = [];
let rows = [];
let plays = [];
let people = [];
let playsList = [];
let activeMode = "plays";
let activeId = null;
let selectedItem = null;

let distribution = [];
let figuran = [];
let retiredSet = new Set();
let activePlayFilter = null; // mobilde: oyundan kişilere geçince filtre

let chartMode = "roles"; // roles | cats
let chartHits = []; // clickable regions
let drawerData = [];

/* ---------- Theme toggle ---------- */
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("idt_theme", theme);
}
(function initTheme(){
  const saved = localStorage.getItem("idt_theme");
  if(saved === "dark" || saved === "light") applyTheme(saved);
  else applyTheme(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
})();
els.themeBtn.addEventListener("click", ()=>{
  const cur = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(cur === "dark" ? "light" : "dark");
  if(rows.length && els.viewCharts.style.display!=="none"){ drawChart(); }
});

/* ---------- helpers ---------- */
function setStatus(text, tone="") {
  els.status.textContent = text;
  els.status.style.borderColor = "";
  els.status.style.background = "";
  els.status.style.color = "var(--muted)";
  if (tone === "ok") {
    els.status.style.borderColor = "color-mix(in srgb, var(--good) 25%, var(--line) 75%)";
    els.status.style.background = "color-mix(in srgb, var(--good) 10%, var(--card) 90%)";
    els.status.style.color = "var(--good)";
  } else if (tone === "bad") {
    els.status.style.borderColor = "color-mix(in srgb, var(--bad) 25%, var(--line) 75%)";
    els.status.style.background = "color-mix(in srgb, var(--bad) 10%, var(--card) 90%)";
    els.status.style.color = "var(--bad)";
  } else if (tone === "warn") {
    els.status.style.borderColor = "color-mix(in srgb, var(--warn) 25%, var(--line) 75%)";
    els.status.style.background = "color-mix(in srgb, var(--warn) 10%, var(--card) 90%)";
    els.status.style.color = "var(--warn)";
  } else {
    els.status.style.borderColor = "var(--line)";
    els.status.style.background = "var(--card)";
  }
}
function escapeHtml(s) {
  return (s ?? "").toString()
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function personTag(name){
  const n=(name||"").toString().trim();
  return (n && retiredSet && retiredSet.has(n)) ? `<span class="tag retired">Kurumdan Emekli Sanatçı</span>` : "";
}

function normalizeHeader(h){ return (h||"").trim().toLowerCase().replace(/\s+/g," "); }
function cssVar(name){ return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

/* ---------- load from Google ---------- */
function parseGviz(text){
  const m = text.match(/setResponse\((.*)\);?\s*$/s);
  if(!m) throw new Error("GViz formatı okunamadı.");
  return JSON.parse(m[1]);
}
function buildFromGviz(obj){
  const table = obj?.table;
  const cols = (table?.cols||[]).map(c=>(c.label||"").trim());
  const dataRows = (table?.rows||[]).map(r=>(r.c||[]).map(cell => (cell?.v ?? "")));

  const hn = cols.map(normalizeHeader);
  const need = ["oyun adı","kategori","görev","kişi"];
  if(!need.every(n=>hn.includes(n))) throw new Error("Başlıklar farklı: Oyun Adı / Kategori / Görev / Kişi");

  const idx = { play: hn.indexOf("oyun adı"), cat: hn.indexOf("kategori"), role: hn.indexOf("görev"), person: hn.indexOf("kişi") };
  const out=[];
  for(const r of dataRows){
    const play=(r[idx.play]??"").toString().trim();
    const category=(r[idx.cat]??"").toString().trim();
    const role=(r[idx.role]??"").toString().trim();
    const person=(r[idx.person]??"").toString().trim();
    if(!play && !person && !role && !category) continue;
    if(!play) continue;
    out.push({play, category, role, person});
  }
  return out;
}
function csvToRows(csvText){
  const rows=[]; let cur="", inQ=false; let row=[];
  for(let i=0;i<csvText.length;i++){
    const ch=csvText[i], next=csvText[i+1];
    if(ch === '"' && inQ && next === '"'){ cur+='"'; i++; }
    else if(ch === '"'){ inQ=!inQ; }
    else if(ch === ',' && !inQ){ row.push(cur); cur=""; }
    else if((ch === '\n' || ch === '\r') && !inQ){
      if(ch === '\r' && next === '\n') i++;
      row.push(cur); cur="";
      if(row.some(v=>v!=="")) rows.push(row);
      row=[];
    } else cur+=ch;
  }
  row.push(cur);
  if(row.some(v=>v!=="")) rows.push(row);
  return rows;
}
function buildFromCsv(raw){
  const need=["oyun adı","kategori","görev","kişi"];
  let headerIdx=-1;
  for(let i=0;i<Math.min(raw.length,30);i++){
    const hdr=raw[i].map(normalizeHeader);
    if(need.every(n=>hdr.includes(n))){ headerIdx=i; break; }
  }
  if(headerIdx===-1) throw new Error("Başlık satırı bulunamadı. (CSV)");
  const header=raw[headerIdx].map(x=>(x||"").trim());
  const hn=header.map(normalizeHeader);
  const idx={ play: hn.indexOf("oyun adı"), cat: hn.indexOf("kategori"), role: hn.indexOf("görev"), person: hn.indexOf("kişi") };

  const out=[];
  for(let i=headerIdx+1;i<raw.length;i++){
    const r=raw[i];
    const play=(r[idx.play]||"").trim();
    const category=(r[idx.cat]||"").trim();
    const role=(r[idx.role]||"").trim();
    const person=(r[idx.person]||"").trim();
    if(!play && !person && !role && !category) continue;
    if(!play) continue;
    out.push({play, category, role, person});
  }
  return out;
}

function jsonp(url, timeoutMs=20000){
  return new Promise((resolve, reject)=>{
    const cb = "idt_cb_" + Math.random().toString(36).slice(2);
    const s = document.createElement("script");
    let done=false;
    const t = setTimeout(()=>{
      if(done) return;
      done=true;
      cleanup();
      reject(new Error("JSONP zaman aşımı"));
    }, timeoutMs);

    function cleanup(){
      clearTimeout(t);
      try{ delete window[cb]; }catch{}
      if(s && s.parentNode) s.parentNode.removeChild(s);
    }

    window[cb] = (data)=>{
      if(done) return;
      done=true;
      cleanup();
      resolve(data);
    };

    const sep = url.includes("?") ? "&" : "?";
    s.src = url + sep + "callback=" + cb + "&_=" + Date.now();
    s.onerror = ()=>{
      if(done) return;
      done=true;
      cleanup();
      reject(new Error("JSONP yüklenemedi"));
    };
    document.body.appendChild(s);
  });
}

async function tryLoadApiJsonp(){
  if(!CONFIG.API_BASE) throw new Error("API_BASE tanımlı değil");
  const url = `${CONFIG.API_BASE}?sheet=${encodeURIComponent(CONFIG.SHEET_MAIN)}`;
  const data = await jsonp(url);
  if(!data || data.ok !== true || !Array.isArray(data.rows)) throw new Error("API veri formatı beklenmedik");
  // API -> ham satırlar
  return data.rows.map(r=>({
    play: String(r["Oyun Adı"] ?? r["Oyun Adi"] ?? r["Oyun"] ?? "").trim(),
    category: String(r["Kategori"] ?? "").trim(),
    role: String(r["Görev"] ?? r["Gorev"] ?? "").trim(),
    person: String(r["Kişi"] ?? r["Kisi"] ?? "").trim(),
  })).filter(x=>x.play && x.person);
}

async function tryLoadGviz(){
  const res = await fetch(CONFIG.gvizUrl(), {cache:"no-store"});
  if(!res.ok) throw new Error(`GViz indirilemedi (${res.status}).`);
  const txt = await res.text();
  return buildFromGviz(parseGviz(txt));
}
async function tryLoadCsv(){
  const res = await fetch(CONFIG.csvUrl(), {cache:"no-store"});
  if(!res.ok) throw new Error(`CSV indirilemedi (${res.status}).`);
  const csv = await res.text();
  return buildFromCsv(csvToRows(csv));
}

/* ---------- split general ---------- */
function splitPeopleGeneral(cell){
  const s = (cell||"").toString().trim();
  if(!s) return [];
  const normalized = s
    .replace(/\r?\n/g, " | ")
    .replace(/;/g, " | ")
    .replace(/\s*\/\s*/g, " | ")
    .replace(/\s*,\s*/g, " | ")
    .replace(/\s+\bve\b\s+/gi, " | ");
  const parts = normalized.split("|").map(x=>x.trim()).filter(Boolean);
  const uniq=[]; const seen=new Set();
  for(const p of parts){
    const key=p.toLowerCase();
    if(!seen.has(key)){ seen.add(key); uniq.push(p); }
  }
  return uniq.length ? uniq : [s];
}
function expandRowsByPeople(data){
  const out=[];
  for(const r of data){
    const people = splitPeopleGeneral(r.person);
    if(!people.length){ out.push({...r, person:""}); continue; }
    for(const p of people){ out.push({...r, person:p}); }
  }
  return out;
}

/* ---------- Apps Script compatible figuran extraction ---------- */
function splitPeopleTokensApps(text){
  const cleaned = (text||"").toString().replace(/\r/g, "\n").trim();
  return cleaned.split(/[\n,;]+/g).map(s=>s.trim()).filter(Boolean);
}
function hasFiguranTag(token){
  return /\(\s*fig[üu]ran\s*\)/i.test((token||"").toString());
}
function stripFiguranTag(token){
  return (token||"").toString().replace(/\(\s*fig[üu]ran\s*\)/ig, "").replace(/^"+|"+$/g, "").trim();
}
function computeRetiredSetFromRaw(){
  const set = new Set();
  for(const r of rawRows){
    const kategoriRaw = (r.category||"").trim().toLowerCase();
    if(/kurumdan\s*emekl/i.test(kategoriRaw) && r.person){
      const tokens = splitPeopleTokensApps((r.person||"").trim());
      for(const t of tokens){
        const name = stripFiguranTag(t);
        if(name) set.add(name);
      }
    }
  }
  return set;
}

function computeFiguranFromRaw(){
  // Apps Script ile aynı mantık:
  // - Kategori "Kurumdan Emekli Sanatçı" ise: kişi(ler)i direkt al
  // - Kategori figüran ise:
  //   - tek kişi: al
  //   - çok kişi: sadece (Figüran) etiketlileri al
  const map = new Map();

  for(const r of rawRows){
    const oyun = (r.play||"").trim();
    const kategoriRaw = (r.category||"").trim();
    const gorevRaw = (r.role||"").trim();
    const kisiRaw = (r.person||"").trim();
    if(!kisiRaw) continue;

    const kategoriLower = kategoriRaw.toLowerCase();
    const isRetiredArtist = /kurumdan\s*emekl/i.test(kategoriLower);
    const isFiguranCategory = /fig[üu]ran/i.test(kategoriLower);
    if(!isRetiredArtist && !isFiguranCategory) continue;

    const tokens = splitPeopleTokensApps(kisiRaw);
    if(!tokens.length) continue;

    let selectedPeople = [];
    if(isRetiredArtist){
      selectedPeople = tokens.map(stripFiguranTag).filter(Boolean);
    }else{
      if(tokens.length === 1){
        selectedPeople = [stripFiguranTag(tokens[0])].filter(Boolean);
      }else{
        selectedPeople = tokens.filter(hasFiguranTag).map(stripFiguranTag).filter(Boolean);
      }
    }
    if(!selectedPeople.length) continue;

    for(const kisi of selectedPeople){
      if(!map.has(kisi)) map.set(kisi, {games:new Set(), roles:new Set(), cats:new Set(), rows:0});
      const obj = map.get(kisi);
      obj.cats.add(isRetiredArtist ? "Kurumdan Emekli Sanatçı" : "Figüran");
      if(oyun) obj.games.add(oyun);
      if(gorevRaw) obj.roles.add(gorevRaw);
      obj.rows += 1;
    }
  }

  const out = [...map.entries()].map(([person, obj])=>({
    person,
    cats:[...obj.cats].sort((a,b)=>a.localeCompare(b,"tr")),
    plays:[...obj.games].sort((a,b)=>a.localeCompare(b,"tr")),
    roles:[...obj.roles].sort((a,b)=>a.localeCompare(b,"tr")),
    rows: obj.rows
  }));
  out.sort((a,b)=>a.person.localeCompare(b.person,"tr"));
  return out;
}


/* ---------- notifications (LOG) ---------- */
function parseLogFromGviz(obj){
  const table = obj?.table;
  const cols = (table?.cols||[]).map(c=>(c.label||"").trim());
  const dataRows = (table?.rows||[]).map(r=>(r.c||[]).map(cell => (cell?.v ?? "")));
  // Beklenen başlıklar (Apps Script): Tarih/Saat, İşlem, Kişi, ...
  // Farklılık olursa yine de ilk 3 sütunu baz alırız.
  const out = [];
  for(const r of dataRows){
    const when = (r[0] ?? "").toString();
    const action = (r[1] ?? "").toString();
    const person = (r[2] ?? "").toString();
    const beforeCat = (r[3] ?? "").toString();
    const afterCat  = (r[4] ?? "").toString();
    const beforeRole= (r[5] ?? "").toString();
    const afterRole = (r[6] ?? "").toString();
    const beforePlay= (r[7] ?? "").toString();
    const afterPlay = (r[8] ?? "").toString();
    if(!when && !action && !person) continue;
    out.push({when, action, person, beforeCat, afterCat, beforeRole, afterRole, beforePlay, afterPlay});
  }
  // yeni -> eski
  return out.reverse();
}


async function loadNotifications(){
  // 1) Önce Apps Script Web App JSON endpoint (BİLDİRİMLER) dene
  try{
    const url = `${CONFIG.API_BASE}?sheet=${encodeURIComponent(CONFIG.SHEET_NOTIFS)}&limit=120`;
    const res = await fetch(url, { method:"GET" });
    if(res.ok){
      const j = await res.json();
      if(j && j.ok && Array.isArray(j.rows)){
        const items = j.rows.map(r => ({
          time: r["Tarih"] || r["Tarih/Saat"] || "",
          type: r["İşlem"] || r["Tür"] || "BİLGİ",
          title: r["Kişi"] || "",
          desc: r["Açıklama"] || r["Mesaj"] || "",
          oyun: r["Oyun"] || "",
          gorev: r["Görev"] || ""
        }));
        showNotifItems(items);
        setNotifBadge(items.length);
        return;
      }
    }
  }catch(e){
    // JSON endpoint erişilemezse sessizce alt yola düş
  }

  // 2) Fallback: JSONP (eğer endpoint callback destekliyorsa)
  try{
    const cbName = `__notif_cb_${Date.now()}`;
    await new Promise((resolve, reject) => {
      window[cbName] = (json) => {
        try{
          delete window[cbName];
          script.remove();
          if(json && json.ok && Array.isArray(json.rows)){
            const items = json.rows.map(r => ({
              time: r["Tarih"] || r["Tarih/Saat"] || "",
              type: r["İşlem"] || r["Tür"] || "BİLGİ",
              title: r["Kişi"] || "",
              desc: r["Açıklama"] || r["Mesaj"] || "",
              oyun: r["Oyun"] || "",
              gorev: r["Görev"] || ""
            }));
            showNotifItems(items);
            setNotifBadge(items.length);
            resolve();
          } else {
            reject(new Error(json?.error || "JSONP başarısız"));
          }
        }catch(err){ reject(err); }
      };
      const url = `${CONFIG.API_BASE}?sheet=${encodeURIComponent(CONFIG.SHEET_NOTIFS)}&limit=120&callback=${cbName}`;
      const script = document.createElement("script");
      script.src = url;
      script.onerror = () => {
        delete window[cbName];
        script.remove();
        reject(new Error("JSONP yüklenemedi"));
      };
      document.body.appendChild(script);
    });
  }catch(e){
    // En son çare: LOG üzerinden GViz (eğer hâlâ kullanıyorsan)
    try{
      const items = await loadLogSheetAsNotifs();
      showNotifItems(items);
      setNotifBadge(items.length);
    }catch(_){}
  }
}
async function load(isAuto=false){
  if(!isAuto) setStatus("⏳ Yükleniyor…");
  activeId=null; selectedItem=null;
  try{
    try{ rawRows = await tryLoadApiJsonp(); }
    catch(e1){
      try{ rawRows = await tryLoadGviz(); }
      catch(e2){ rawRows = await tryLoadCsv(); }
    }

    rows = expandRowsByPeople(rawRows);
    plays = groupByPlay(rows);
    people = groupByPerson(rows);
    playsList = plays.map(p=>p.title);


    renderList();
    renderDetails(null);

    distribution = computeDistribution();
    renderDistribution();

    retiredSet = computeRetiredSetFromRaw();
    retiredSet = computeRetiredSetFromRaw();
    figuran = computeFiguranFromRaw();
    renderFiguran();

    renderPlayOptions();
    renderIntersection();

    renderKpis();

    const when = new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});
    setStatus(`✅ Hazır • ${when}`, "ok");
    if(els.apiTestLink) els.apiTestLink.classList.add("hidden");

    // Bildirimleri (BİLDİRİMLER) yükle
    loadNotifications();
  }catch(err){
    console.error(err);
    setStatus("⛔ Veri çekilemedi", "bad");
    if(els.apiTestLink){ els.apiTestLink.classList.remove("hidden"); els.apiTestLink.href = `${CONFIG.API_BASE}?sheet=${encodeURIComponent(CONFIG.SHEET_MAIN)}`; }
    els.list.innerHTML = `<div class="empty" style="text-align:left;white-space:pre-wrap">
<b>Veri çekilemedi.</b>

1) Sheet paylaşımı: Paylaş → “Bağlantıya sahip herkes: Görüntüleyebilir”
2) Apps Script Web App: Deploy → Web app → Execute as: Me, Who has access: Anyone
3) API Test butonuna basıp JSON geliyor mu kontrol et
2) Netlify / GitHub Pages’da genelde sorunsuz çalışır.

Hata: ${escapeHtml(err.message || String(err))}
</div>`;
    els.details.innerHTML = `<div class="empty">Önce veri gelsin 🙂</div>`;
    els.distributionBox.innerHTML = `<div class="empty">Veri yok.</div>`;
    els.figuranBox.innerHTML = `<div class="empty">Veri yok.</div>`;
    els.intersectionBox.innerHTML = `<div class="empty">Veri yok.</div>`;
  }
}

load(false);

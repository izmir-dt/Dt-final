const CONFIG = {
  SPREADSHEET_ID: "1sIzswZnMkyRPJejAsE_ylSKzAF0RmFiACP4jYtz-AE0",
  API_BASE: "https://script.google.com/macros/s/AKfycbz-Td3cnbMkGRVW4kFXvlvD58O6yygQ-U2aJ7vHSkxAFrAsR5j7QhMFt0xrGg4gZQLb/exec",
  SHEET_MAIN: "BÜTÜN OYUNLAR",
  SHEET_FIGURAN: "FİGÜRAN LİSTESİ",
  // Bildirimler için en stabil kaynak: Apps Script'in otomatik oluşturduğu LOG sayfası
  // (Eğer sende BİLDİRİMLER diye ayrı sayfa varsa, aşağıda fallback var.)
  SHEET_NOTIFS: "LOG",


    NOTIF_SHEET_NAME: "BİLDİRİMLER",
  NOTIF_GVIZ_URL: "", // boş bırak (aşağıda otomatik oluşturulacak)
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
  tabAssign: el("tabAssign"),
  viewAssign: el("viewAssign"),
  // Assign tool (new)
  assignModeFilter: el("assignModeFilter"),
  assignModeCompare: el("assignModeCompare"),
  assignPaneFilter: el("assignPaneFilter"),
  assignPaneCompare: el("assignPaneCompare"),
  msRoles: el("msRoles"),
  msRolesList: el("msRolesList"),
  msRolesTxt: el("msRolesTxt"),
  msRolesBadge: el("msRolesBadge"),
  msPlays: el("msPlays"),
  msPlaysList: el("msPlaysList"),
  msPlaysTxt: el("msPlaysTxt"),
  msPlaysBadge: el("msPlaysBadge"),
  msPeople: el("msPeople"),
  msPeopleList: el("msPeopleList"),
  msPeopleTxt: el("msPeopleTxt"),
  msPeopleBadge: el("msPeopleBadge"),
  assignFilterMeta: el("assignFilterMeta"),
  assignFilterTbody: el("assignFilterTbody"),
  assignFilterCopy: el("assignFilterCopy"),
  assignFilterClear: el("assignFilterClear"),
  assignPersonA: el("assignPersonA"),
  assignPersonB: el("assignPersonB"),
  assignCompareSwap: el("assignCompareSwap"),
  assignCompareCopy: el("assignCompareCopy"),
  cmpCommon: el("cmpCommon"),
  cmpOnlyA: el("cmpOnlyA"),
  cmpOnlyB: el("cmpOnlyB"),

  themeBtn: el("themeBtn"),
  status: el("status"),
  sheetBtn: el("sheetBtn"),
  reloadBtn: el("reloadBtn"),
  advBtn: el("advBtn"),
  advMenu: el("advMenu"),
  advDist: el("advDist"),
  advInter: el("advInter"),
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
  qScope: el("qScope"),
  qClear: el("qClear"),
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
  figDownloadAllBtn: el("figDownloadAllBtn"),
  fClear: el("fClear"),
  figuranBox: el("figuranBox"),

  chartTabRoles: el("chartTabRoles"),
  chartTabCats: el("chartTabCats"),
  chartTitle: el("chartTitle"),
  chartMain: el("chartMain"),
  chartMobileList: el("chartMobileList"),

  drawer: el("chartDrawer"),
  drawerTitle: el("drawerTitle"),
  drawerSub: el("drawerSub"),
  drawerClose: el("drawerClose"),
  drawerBack: el("drawerBack"),
  drawerCopyAll: el("drawerCopyAll"),
  drawerCopyVisible: el("drawerCopyVisible"),
  drawerCopyExpanded: el("drawerCopyExpanded"),
  drawerSearch: el("drawerSearch"),
  drawerList: el("drawerList"),

  kpiPlays: el("kpiPlays"),
  kpiPeople: el("kpiPeople"),
  kpiRows: el("kpiRows"),
  kpiFiguran: el("kpiFiguran"),
};
els.sheetBtn.href = CONFIG.sheetUrl();

// --- Chart canvas interactions (desktop) ---
if(els.chartMain){
  els.chartMain.addEventListener('click', onChartCanvasClick);
  els.chartMain.addEventListener('mousemove', (ev)=>{
    const hit = chartHitKeyFromEvent(ev);
    els.chartMain.style.cursor = hit ? 'pointer' : 'default';
  });
}


let rawRows = [];
let rows = [];
let ACTIVE_TAB = 'Panel';
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
let drawerStack = []; // for drill-down navigation
let drawerMode = "items"; // 'items' or 'labels'

/* ---------- Theme toggle ---------- */
function applyTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("idt_theme", theme);
}
(function initTheme(){
  const saved = localStorage.getItem("idt_theme");
  if(saved === "dark" || saved === "light") applyTheme(saved);
  else applyTheme("light");
})();
/* ---------- UI state (search/mode) ---------- */
(function initUiState(){
  try{
    const savedQ = localStorage.getItem("idt_q") || "";
    const savedScope = localStorage.getItem("idt_qscope") || "all";
    const savedMode = localStorage.getItem("idt_mode") || "plays";
    if(els.q) els.q.value = savedQ;
    if(els.qScope) els.qScope.value = savedScope;
    if(savedMode==="people" || savedMode==="plays"){
      activeMode = savedMode;
      if(activeMode==="plays"){ els.btnPlays.classList.add("active"); els.btnPeople.classList.remove("active"); }
      else { els.btnPeople.classList.add("active"); els.btnPlays.classList.remove("active"); }
    }
  }catch(_e){}
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

/* ---------- chart colors (canlı + kategori sabit renk) ---------- */
// ---------- Grafik renkleri: her grafikte benzersiz / canlı ----------
function currentTheme(){
  return (document.documentElement.getAttribute("data-theme") || "light") === "dark" ? "dark" : "light";
}
// Golden-angle ile birbirinden uzak renkler
function makeUniqueColors(n){
  const N = Math.max(1, n|0);
  const theme = currentTheme();
  const L = theme === "dark" ? 62 : 50;

  // First use a hand-picked distinct palette (good separation)
  const base = [
    "#e11d48","#f97316","#f59e0b","#84cc16","#22c55e","#10b981",
    "#06b6d4","#0ea5e9","#3b82f6","#6366f1","#8b5cf6","#a855f7",
    "#d946ef","#ec4899","#fb7185","#fda4af","#fdba74","#fde047",
    "#bef264","#86efac","#67e8f9","#93c5fd","#a5b4fc","#c4b5fd"
  ];
  const out = [];
  for(let i=0;i<N;i++){
    if(i < base.length){ out.push(base[i]); continue; }
    // Golden-angle fallback for large counts
    const hue = (i * 137.508) % 360;
    out.push(`hsl(${hue} 88% ${L}%)`);
  }
  return out;
}
function makeChartColorGetter(keys){
  const uniq = [...new Set((keys||[]).map(k=>String(k)))];
  const cols = makeUniqueColors(uniq.length);
  const map = new Map();
  uniq.forEach((k,i)=> map.set(k, cols[i]));
  // "Diğer" ayrı ve tıklanabilir bir toplamdır
  const otherCol = cssVar("--accent2") || "#c07a2a";
  return (key)=> (String(key)==="Diğer" ? otherCol : (map.get(String(key)) || otherCol));
}


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
      if(!map.has(kisi)) map.set(kisi, {games:new Set(), roles:new Set(), cats:new Set()});
      const obj = map.get(kisi);
      obj.cats.add(isRetiredArtist ? "Kurumdan Emekli Sanatçı" : "Figüran");
      if(oyun) obj.games.add(oyun);
      if(gorevRaw) obj.roles.add(gorevRaw);
    }
  }

  const out = [...map.entries()].map(([person, obj])=>({
    person,
    cats:[...obj.cats].sort((a,b)=>a.localeCompare(b,"tr")),
    plays:[...obj.games].sort((a,b)=>a.localeCompare(b,"tr")),
    roles:[...obj.roles].sort((a,b)=>a.localeCompare(b,"tr"))}));
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

// UI: avoid "0 + boş kutu" – always show a clear state
if(els.notifList){
  els.notifList.innerHTML = `<div class="notifState"><span class="spinnerSm"></span>Bildirimler yükleniyor…</div>`;
}
if(els.notifCount){
  // keep current count while loading; we'll update after parse
  els.notifCount.classList.add("isLoading");
}

  if(!els.notifPanel) return;

  try{
    // GVIZ (no JSONP) → BİLDİRİMLER sayfasını okur
    const sheetName = CONFIG.NOTIF_SHEET_NAME || "BİLDİRİMLER";
    const gvizUrl = CONFIG.NOTIF_GVIZ_URL && CONFIG.NOTIF_GVIZ_URL.trim()
      ? CONFIG.NOTIF_GVIZ_URL.trim()
      : `https://docs.google.com/spreadsheets/d/${encodeURIComponent(CONFIG.SPREADSHEET_ID)}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&tqx=out:json`;

    const res = await fetch(gvizUrl, { cache: "no-store" });
    const txt = await res.text();

    // gviz response: google.visualization.Query.setResponse({...});
    const match = txt.match(/setResponse\((.*)\);\s*$/s);
    if(!match) throw new Error("GVIZ parse failed");
    const obj = JSON.parse(match[1]);

    const table = obj?.table;
    const cols = (table?.cols||[]).map(c=>(c.label||"").trim());
    const rawRows = (table?.rows||[]);

    const rows = rawRows.map(r=>{
      const c = r.c || [];
      const get = (name)=>{
        const idx = cols.indexOf(name);
        if(idx === -1) return "";
        const cell = c[idx];
        return cell ? (cell.f ?? cell.v ?? "") : "";
      };
      return {
        ts: String(get("Tarih") || get("Tarih/Saat") || "").trim(),
        action: String(get("İşlem") || get("Islem") || "").trim(),
        play: String(get("Oyun") || "").trim(),
        person: String(get("Kişi") || get("Kisi") || "").trim(),
        role: String(get("Görev") || get("Gorev") || "").trim(),
        msg: String(get("Açıklama") || get("Aciklama") || "").trim()
      };
    }).filter(x=>x.ts || x.action || x.msg || x.play || x.person);

    // newest first
    rows.reverse();

    // local okundu (site tarafı): imza üzerinden
    const seen = JSON.parse(localStorage.getItem("idt_seen_notifs") || "{}");
    const norm = (x)=> (x||"").toString().slice(0,140);
    rows.forEach(n=>{
      const key = `${norm(n.ts)}|${norm(n.action)}|${norm(n.play)}|${norm(n.person)}|${norm(n.role)}|${norm(n.msg)}`;
      n._key = key;
      n._seen = !!seen[key];
    });

    const unread = rows.filter(n=>!n._seen).length;
    if(unread){
      els.notifCount.classList.remove("hidden");
      els.notifCount.textContent = String(unread);
    } else {
      els.notifCount.textContent = "";
      els.notifCount.classList.add("hidden");
    }

    if(!rows.length){
      els.notifList.innerHTML = `<div class="empty">🔔 Bildirim yok.</div>`;
      return;
    }

    const iconBy = (a)=>{
      const s = (a||"").toString().toLowerCase();
      if(s.includes("ekl")) return "✅";
      if(s.includes("çıkar") || s.includes("cikar") || s.includes("sil")) return "🗑️";
      if(s.includes("güncel") || s.includes("guncel")) return "✏️";
      return "🔔";
    };

    const show = rows.slice(0, 60);

    els.notifList.innerHTML = show.map(n=>{
      const meta = [n.play, n.person, n.role].filter(Boolean).join(" • ");
      const who = meta ? `<div class="notif-meta">${escapeHtml(meta)}</div>` : "";
      const msg = n.msg ? `<div class="notif-msg">${escapeHtml(n.msg)}</div>` : "";
      const ts  = n.ts ? `<div class="notif-ts">${escapeHtml(n.ts)}</div>` : "";
      const title = n.action ? `<div class="notif-title">${escapeHtml(n.action)}</div>` : "";
      const cls = n._seen ? "notif-bubble seen" : "notif-bubble";
      const type = iconBy(n.action);
      return `<div class="${cls}" data-key="${escapeHtml(n._key)}">
        <div class="notif-type">${escapeHtml(type)}</div>
        <div class="notif-body">
          ${title}${msg}${who}${ts}
        </div>
      </div>`;
    }).join("");

    // tıkla → okundu yap
    els.notifList.querySelectorAll(".notif-bubble").forEach(el=>{
      el.addEventListener("click", ()=>{
        const key = el.getAttribute("data-key");
        if(!key) return;
        const seen2 = JSON.parse(localStorage.getItem("idt_seen_notifs") || "{}");
        seen2[key]=true;
        localStorage.setItem("idt_seen_notifs", JSON.stringify(seen2));
        el.classList.add("seen");
        const left = Array.from(els.notifList.querySelectorAll(".notif-bubble"))
          .filter(x=>!x.classList.contains("seen")).length;
        if(left){
          els.notifCount.classList.remove("hidden");
          els.notifCount.textContent=String(left);
        } else {
          els.notifCount.textContent="";
          els.notifCount.classList.add("hidden");
        }
      });
    });

  }catch(err){

if(els.notifList){
  els.notifList.innerHTML = `<div class="notifState">Bildirimler alınamadı. <span class="muted">(Bağlantı / yetki / servis)</span></div>`;
}
if(els.notifCount) els.notifCount.textContent = "0";

    console.error(err);
    els.notifList.innerHTML = `<div class="empty">🔔 Bildirimler okunamadı.<br><span class="small muted">Kontrol: Sheet "Bağlantıya sahip herkes görüntüleyebilir" olmalı.</span></div>`;
    els.notifCount.textContent = "";
    els.notifCount.classList.add("hidden");
  }
}

/* ---------- transforms ---------- */

function groupByPlay(data){
  const map=new Map();
  for(const r of data){ if(!map.has(r.play)) map.set(r.play,[]); map.get(r.play).push(r); }
  const out=[...map.entries()].map(([playName, items])=>{
    const cats=[...new Set(items.map(x=>x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"tr"));
    const persons=[...new Set(items.map(x=>x.person).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"tr"));
    return { id:`play:${playName}`, title: playName, cats, count: persons.length, rows: items };
  });
  out.sort((a,b)=>a.title.localeCompare(b.title,"tr"));
  return out;
}
function groupByPerson(data){
  const map=new Map();
  for(const r of data){
    if(!r.person) continue;
    if(!map.has(r.person)) map.set(r.person,[]);
    map.get(r.person).push(r);
  }
  const out=[...map.entries()].map(([personName, items])=>{
    const cats=[...new Set(items.map(x=>x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"tr"));
    const roles=[...new Set(items.map(x=>x.role).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"tr"));
    const plays=[...new Set(items.map(x=>x.play).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"tr"));
    return { id:`person:${personName}`, title: personName, cats, roles, plays, count: plays.length, rows: items };
  });
  out.sort((a,b)=>a.title.localeCompare(b.title,"tr"));
  return out;
}
function uniqCategories(data){
  const cats=[...new Set(data.map(x=>x.category).filter(Boolean))];
  cats.sort((a,b)=>a.localeCompare(b,"tr"));
  return cats;
}
function chipTone(cat){
  const t=(cat||"").toLowerCase();
  if(t.includes("figüran") || t.includes("figuran")) return "warn";
  if(t.includes("yönetim") || t.includes("yonetim")) return "good";
  if(t.includes("oyuncu")) return "bad";
  return "";
}
function applyFilters(list){
  const q=foldTr_((els.q.value||"").trim());
  const scope = (els.qScope && els.qScope.value) ? els.qScope.value : "all";
  const cat="";
  return list.filter(it=>{
    let hay = "";
    if(activeMode==="plays"){
      if(scope==="play") hay = it.title;
      else if(scope==="person") hay = it.rows.map(r=>r.person).join(" ");
      else if(scope==="role") hay = it.rows.map(r=>r.role).join(" ");
      else hay = it.title+" "+it.cats.join(" ")+" "+it.rows.map(r=>`${r.person} ${r.role}`).join(" ");
    }else{
      if(scope==="play") hay = (it.plays||[]).join(" ");
      else if(scope==="person") hay = it.title;
      else if(scope==="role") hay = (it.roles||[]).join(" ");
      else hay = it.title+" "+it.cats.join(" ")+" "+(it.roles||[]).join(" ")+" "+(it.plays||[]).join(" ");
    }
    hay = foldTr_(hay||"");

    if(activeMode==="people" && activePlayFilter){
      if(!((it.plays||[]).includes(activePlayFilter))) return false;
    }
    if(q && !hay.includes(q)) return false;
    if(cat){
      const cats=(it.cats||[]).map(x=>x.toLowerCase());
      if(!cats.some(x=>x.includes(cat))) return false;
    }
    return true;
  });
}

/* ---------- UI render ---------- */
function renderList(){
  const source = (activeMode==="plays") ? plays : people;
  const filtered = applyFilters(source);

  els.list.innerHTML="";
  if(!filtered.length){
    els.list.innerHTML = `<div class="empty">Sonuç yok 😅</div>`;
    els.hint.textContent = "";
    return;
  }

  for(const it of filtered){
    const isActive = it.id===activeId;
    const meta = (activeMode==="plays")
      ? `${it.count} kişi • ${it.rows.length} satır`
      : `${it.count} oyun • ${it.rows.length} satır`;

    const chips = (it.cats||[]).slice(0,6).map(c=>`<span class="chip ${chipTone(c)}">${escapeHtml(c)}</span>`).join("");
    const more = (it.cats||[]).length>6 ? `<span class="chip">+${it.cats.length-6}</span>` : "";
    const retiredTag = (activeMode==="people" && retiredSet.has(it.title)) ? `<span class="tag retired">Kurumdan Emekli Sanatçı</span>` : "";

    const div=document.createElement("div");
    div.className="item";
    if(isActive) div.style.borderColor="color-mix(in srgb, var(--accent) 35%, var(--line) 65%)";
    div.innerHTML = `
      <div class="t">
        <div>
          <div class="name">${escapeHtml(it.title)}${retiredTag}</div>
          <div class="meta">${escapeHtml(meta)}</div>
        </div>
        <div style="color:var(--muted);font-size:12px">▶</div>
      </div>
      <div class="chips">${chips}${more}</div>
    `;
    div.addEventListener("click", ()=>{
      activeId=it.id;
      selectedItem = it;
      renderList();
      renderDetails(it);

      if(isMobile() && activeMode==="plays"){
        // ✅ İstenen: Mobilde oyun tıkla → modal ekip aç (liste Oyunlar olarak kalsın)
        activePlayFilter = it.title;
        setStatus(`📌 Oyun: ${activePlayFilter} • Ekip`, "ok");

        // Alttaki detay panelini güncelliyoruz ama kullanıcıyı aşağı kaydırmıyoruz
        // Modal içine aynı içeriği basıyoruz
        openMobileModal(els.details.innerHTML);

        // Geri tuşu: modal kapansın
        history.pushState({mode:"plays", modal:"team", play:activePlayFilter}, "");
      }

    });
    els.list.appendChild(div);
  }

  els.hint.textContent = `Gösterilen: ${filtered.length} / ${source.length}`;
}
function renderDetails(it){
  if(!it){ els.details.innerHTML = `<div class="empty">Soldan bir oyun veya kişi seç.</div>`; return; }

  if(activeMode==="plays"){
    const rowsSorted=[...it.rows].sort((a,b)=>
      (a.category||"").localeCompare(b.category||"","tr") ||
      (a.role||"").localeCompare(b.role||"","tr") ||
      (a.person||"").localeCompare(b.person||"","tr")
    );
    els.details.innerHTML = `
      <h3 class="title">${escapeHtml(it.title)}${personTag(it.title)}</h3>
      <p class="subtitle">${it.count} kişi • ${it.rows.length} satır</p>
      <table class="table" id="detailTable">
        <thead><tr><th>Kategori</th><th>Görev</th><th>Kişi</th></tr></thead>
        <tbody>
          ${rowsSorted.map(r=>`<tr><td>${escapeHtml(r.category)}</td><td>${escapeHtml(r.role)}</td><td>${escapeHtml(r.person)}${personTag(r.person)}</td></tr>`).join("")}
        </tbody>
      </table>
    `;
  } else {
    const byPlay=new Map();
    for(const r of it.rows){ if(!byPlay.has(r.play)) byPlay.set(r.play,[]); byPlay.get(r.play).push(r); }
    const blocks=[...byPlay.entries()].sort((a,b)=>a[0].localeCompare(b[0],"tr"));
    els.details.innerHTML = `
      <h3 class="title">${escapeHtml(it.title)}${personTag(it.title)}</h3>
      <p class="subtitle">${it.count} oyun • ${it.rows.length} satır</p>
      <div id="detailTable">
      ${blocks.map(([p, rs])=>{
        const rs2=[...rs].sort((a,b)=>(a.category||"").localeCompare(b.category||"","tr") || (a.role||"").localeCompare(b.role||"","tr"));
        return `
          <div style="margin:12px 0 10px">
            <div style="font-weight:850;margin:0 0 8px">${escapeHtml(p)}</div>
            <table class="table">
              <thead><tr><th>Kategori</th><th>Görev</th></tr></thead>
              <tbody>${rs2.map(r=>`<tr><td>${escapeHtml(r.category)}</td><td>${escapeHtml(r.role)}</td></tr>`).join("")}</tbody>
            </table>
          </div>
        `;
      }).join("")}
      </div>
    `;
  }
}

/* ---------- Copy as Excel-friendly (TSV) ---------- */
function toTSVFromSelected(){
  if(!selectedItem) return "";
  if(activeMode==="plays"){
    const rowsSorted=[...selectedItem.rows].sort((a,b)=>
      (a.category||"").localeCompare(b.category||"","tr") ||
      (a.role||"").localeCompare(b.role||"","tr") ||
      (a.person||"").localeCompare(b.person||"","tr")
    );
    const playTitle = selectedItem.title || "";
    const lines=[["Oyun","Kategori","Görev","Kişi"].join("\t")];
    for(let i=0;i<rowsSorted.length;i++){
      const r = rowsSorted[i];
      lines.push([i===0?playTitle:"", r.category||"", r.role||"", r.person||""].join("	"));
    }
    return lines.join("\n");
  } else {
    const rs=[...selectedItem.rows].sort((a,b)=>
      (a.play||"").localeCompare(b.play||"","tr") ||
      (a.category||"").localeCompare(b.category||"","tr") ||
      (a.role||"").localeCompare(b.role||"","tr")
    );
    const lines=[["Oyun","Kategori","Görev"].join("\t")];
    for(const r of rs){
      lines.push([r.play||"", r.category||"", r.role||""].join("\t"));
    }
    return lines.join("\n");
  }
}

/* ---------- charts ---------- */
function roundRect(ctx, x, y, w, h, r){
  const rr = Math.min(r, w/2, h/2);
  ctx.beginPath();
  ctx.moveTo(x+rr, y);
  ctx.arcTo(x+w, y, x+w, y+h, rr);
  ctx.arcTo(x+w, y+h, x, y+h, rr);
  ctx.arcTo(x, y+h, x, y, rr);
  ctx.arcTo(x, y, x+w, y, rr);
  ctx.closePath();
}
function drawBars(canvas, items, topN){
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 900;
  const cssH = canvas.clientHeight || 340;
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);

  const data = items.slice(0, topN);

  const card = cssVar("--card");
  const grid = cssVar("--line");
  const text = cssVar("--text");
  const muted = cssVar("--muted");
  const accent = cssVar("--accent");

  chartHits = [];

  ctx.clearRect(0,0,cssW,cssH);
  ctx.fillStyle = card;
  roundRect(ctx, 0, 0, cssW, cssH, 14);
  ctx.fill();

  ctx.strokeStyle = grid;
  ctx.lineWidth = 1;
  const padL=18, padR=14, padT=16, padB=74;
  const w=cssW-padL-padR;
  const h=cssH-padT-padB;

  for(let i=0;i<=4;i++){
    const y=padT + (h*(i/4));
    ctx.beginPath(); ctx.moveTo(padL,y); ctx.lineTo(padL+w,y); ctx.stroke();
  }

  const maxV = Math.max(...data.map(d=>d.v), 1);
  const barW = w / Math.max(data.length,1);

  for(let i=0;i<data.length;i++){
    const d=data[i];
    const bh = (d.v/maxV)*h;
    const x = padL + i*barW + 6;
    const y = padT + (h-bh);
    const bw = Math.max(barW-12, 14);

    ctx.fillStyle = (window.__chartColorOf ? window.__chartColorOf(d.k) : accent);
    ctx.globalAlpha = 0.90;
    roundRect(ctx, x, y, bw, bh, 12);
    ctx.fill();
    ctx.globalAlpha = 1;
    // slice separator
    ctx.strokeStyle = card;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = text;
    ctx.font = "12px system-ui";
    ctx.fillText(String(d.v), x+2, y-6);

    ctx.save();
    ctx.fillStyle = muted;
    ctx.font = "12px system-ui";
    const label = d.k.length>26 ? d.k.slice(0,26)+"…" : d.k;
    // etiketleri yatay yaz (mobilde okunur)
    const yLabel = padT + h + 18;
    ctx.textAlign = "center";
    ctx.fillText(label, x + barW/2, yLabel);
    ctx.restore();

    chartHits.push({type:"bar", key:d.k, x, y, w:bw, h:bh});
  }
}
function drawDoughnut(canvas, items, topN, legendTitle){
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth || 900;
  const cssH = canvas.clientHeight || 340;
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
  ctx.setTransform(dpr,0,0,dpr,0,0);

  // Top N + Diğer (okunabilirlik)
  const sorted = items.slice().sort((a,b)=>b.v-a.v);
  const top = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  if(rest.length){
    window.__chartOtherItems = rest.slice();
    const other = rest.reduce((s,x)=>s+x.v,0);
    top.push({k:"Diğer", v:other});
  }
  const data = top;
  const total = data.reduce((s,x)=>s+x.v,0) || 1;

  const card = cssVar("--card");
  const line = cssVar("--line");
  const text = cssVar("--text");
  const muted = cssVar("--muted");

  const colorOf = (label)=> (window.__chartColorOf ? window.__chartColorOf(label) : "#8e8e93");

  chartHits = [];

  ctx.clearRect(0,0,cssW,cssH);
  ctx.fillStyle = card;
  roundRect(ctx, 0, 0, cssW, cssH, 14);
  ctx.fill();

  const isM = isMobile();
  // Legend’i alta taşımak için alan ayır
  const legendH = isM ? 120 : 96;
  const plotH = Math.max(220, cssH - legendH);
  const cx = cssW * 0.50;
  const cy = plotH * 0.55;
  const rOuter = Math.min(cssW, plotH) * (isM ? 0.34 : 0.42);
  const rInner = rOuter * 0.60;

  let start = -Math.PI/2;
  for(let i=0;i<data.length;i++){
    const d=data[i];
    const ang = (d.v/total) * Math.PI*2;
    const end = start + ang;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, rOuter, start, end);
    ctx.closePath();
    ctx.fillStyle = colorOf(d.k);
    ctx.globalAlpha = 0.92;
    ctx.fill();
    ctx.globalAlpha = 1;

    chartHits.push({type:"wedge", key:d.k, cx, cy, rOuter, rInner, start, end});
    start = end;
  }

  // inner hole
  ctx.beginPath();
  ctx.arc(cx, cy, rInner, 0, Math.PI*2);
  ctx.fillStyle = card;
  ctx.fill();

  // center total
  ctx.fillStyle = muted;
  ctx.font = "12px system-ui";
  ctx.textAlign="center";
  ctx.fillText("Toplam", cx, cy-6);
  ctx.fillStyle = text;
  ctx.font = "18px system-ui";
  ctx.fillText(String(total), cx, cy+18);
  ctx.textAlign="left";

  // legend (alta)
  const pad = 16;
  const legendY0 = plotH + 18;
  ctx.fillStyle = text;
  ctx.font = "13px system-ui";
  ctx.textAlign = "left";
  ctx.fillText(legendTitle || "Dağılım", pad, legendY0);

  // öğeleri altta çok sütunlu göster
  ctx.font = "12px system-ui";
  // "items" is already a function parameter in drawDonut; avoid redeclaring.
  const legendItems = data.slice(0, data.length);
  const cols = isM ? 2 : 3;
  const colW = (cssW - pad*2) / cols;
  const rowH = 18;
  let x = pad, y = legendY0 + 16;
  for (let i=0;i<legendItems.length;i++){
    const d = legendItems[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    x = pad + col * colW;
    y = legendY0 + 16 + row * rowH;
    // renk noktası
    ctx.fillStyle = colorOf(d.k || d.key || d.name || d.label);
    ctx.beginPath(); ctx.arc(x+6, y-4, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = text;
    const label = `${String(d.k || d.key || d.name || d.label)} (${d.v})`;
    ctx.fillText(label, x+16, y);
    // fazla uzunsa kes
    const maxW = colW - 22;
    if (ctx.measureText(label).width > maxW){
      let s = label;
      while (s.length>6 && ctx.measureText(s+"…").width > maxW) s = s.slice(0,-1);
      ctx.clearRect(x+16, y-14, maxW, 16);
      ctx.fillStyle = text;
      ctx.fillText(s+"…", x+16, y);
    }
  }

ctx.strokeStyle = line;
  ctx.strokeRect(0.5,0.5,cssW-1,cssH-1);
}

// --- Chart hit test (desktop) ---
function chartHitKeyFromEvent(ev){
  if(!chartHits || !chartHits.length) return null;
  const canvas = ev.currentTarget || els.chartMain;
  const rect = canvas.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;

  for(const h of chartHits){
    if(h.type !== 'wedge') continue;
    const dx = x - h.cx;
    const dy = y - h.cy;
    const r = Math.sqrt(dx*dx + dy*dy);
    if(r < h.rInner || r > h.rOuter) continue;

    // angle in [-PI, PI] -> normalize to [0, 2PI)
    let a = Math.atan2(dy, dx);
    if(a < -Math.PI/2) a += Math.PI*2;

    // wedge angles are drawn starting at -PI/2 and increasing
    // Normalize wedge start/end into [0, 2PI) relative to -PI/2
    const norm = (t)=>{
      let v = t;
      while(v < -Math.PI/2) v += Math.PI*2;
      while(v >= -Math.PI/2 + Math.PI*2) v -= Math.PI*2;
      return v;
    };
    const s = norm(h.start);
    const e = norm(h.end);
    const aa = norm(a);

    const inside = (s <= e) ? (aa >= s && aa <= e) : (aa >= s || aa <= e);
    if(inside) return h.key;
  }
  return null;
}

function buildDrawerItemsForKey(key){
  // returns [{person, role/roles, plays:[...]}]
  const map = new Map();

  for(const r of rows){
    const rk = (chartMode === 'roles') ? ((r.role||'').trim() || 'Bilinmiyor') : ((r.category||'').trim() || 'Bilinmiyor');
    if(rk !== key) continue;
    const p = (r.person||'').trim();
    if(!p) continue;
    if(!map.has(p)) map.set(p, {plays:new Set(), roles:new Set()});
    map.get(p).plays.add((r.play||'').trim());
    if(r.role) map.get(p).roles.add((r.role||'').trim());
  }

  const out = [];
  for(const [person, v] of map.entries()){
    const plays = [...v.plays].filter(Boolean).sort((a,b)=>a.localeCompare(b,'tr'));
    const roles = [...v.roles].filter(Boolean).sort((a,b)=>a.localeCompare(b,'tr'));
    out.push({ person, plays, role: (chartMode==='roles' ? key : roles.join(' / ')) });
  }
  out.sort((a,b)=>a.person.localeCompare(b.person,'tr'));
  return out;
}

function onChartCanvasClick(ev){
  const key = chartHitKeyFromEvent(ev);
  if(!key) return;

  // "Diğer" -> drill-down into labels
  if(String(key) === 'Diğer' && Array.isArray(window.__chartOtherItems) && window.__chartOtherItems.length){
    drawerStack.push({
      title: els.drawerTitle.textContent || (chartMode==='roles' ? 'Görevler' : 'Kategoriler'),
      subtitle: els.drawerSub.textContent || '',
      items: drawerData.slice(),
      mode: drawerMode
    });
    const labels = window.__chartOtherItems
      .slice()
      .sort((a,b)=>b.v-a.v)
      .map(x=>({label:x.k, value:x.v}));
    openDrawer('Diğer', `${labels.length} kategori`, labels, {mode:'labels'});
    return;
  }

  const items = buildDrawerItemsForKey(String(key));
  const title = `${chartMode === 'roles' ? 'Görev' : 'Kategori'}: ${key}`;
  openDrawer(title, `${items.length} kişi`, items, {mode:'items'});
}

/* ---------- mobile chart list ---------- */
function buildPeopleListForKey(key){
  const map=new Map();
  for(const r of rows){
    const match = (chartMode==="roles") ? ((r.role||"").trim()===key) : ((r.category||"").trim()===key);
    if(match && r.person){
      if(!map.has(r.person)) map.set(r.person, new Set());
      map.get(r.person).add(r.play);
    }
  }
  const items=[...map.entries()].map(([person, s])=>({person, plays:[...s].sort((a,b)=>a.localeCompare(b,"tr"))}));
  items.sort((a,b)=>b.plays.length-a.plays.length || a.person.localeCompare(b.person,"tr"));
  return items;
}

function openMobilePeopleModal(title, subtitle, items){
  const id = "chartMobileSearch";
  const listId = "chartMobilePeopleList";
  openMobileModal(`
    <div class="modalTitle" style="font-weight:900">${escapeHtml(title)}</div>
    <div class="small" style="margin:4px 0 10px">${escapeHtml(subtitle||"")}</div>
    <div class="input" style="min-width:unset" title="Ara">🔎 <input id="${id}" type="search" placeholder="İsim / oyun ara…" autocomplete="off"/></div>
    <div class="miniList" id="${listId}" style="margin-top:10px"></div>
  `);
  const render = ()=>{
    const q = (document.getElementById(id)?.value||"").trim().toLowerCase();
    const filtered = items.filter(x=>{
      if(!q) return true;
      return foldTr_(x.person+" "+(x.plays||[]).join(" ")).includes(q);
    });
    const box = document.getElementById(listId);
    if(!box) return;
    box.innerHTML = filtered.length ? filtered.slice(0,250).map(x=>`
      <div class="miniItem">
        <b>${escapeHtml(x.person)}</b>
        <div class="small">${escapeHtml((x.plays||[]).slice(0,10).join(" • "))}${(x.plays||[]).length>10 ? " • …" : ""}</div>
      </div>
    `).join("") : `<div class="empty">Sonuç yok.</div>`;
  };
  // DOM hazır olunca bağla
  setTimeout(()=>{
    const inp = document.getElementById(id);
    if(inp) inp.addEventListener("input", render);
    render();
  }, 0);
}

function renderMobileChartList(items){
  if(!els.chartMobileList) return;
  // Tam liste: büyükten küçüğe (mobilde seçilebilir)
  const rows2 = items.slice().sort((a,b)=>b.v-a.v);
  els.chartMobileList.innerHTML = rows2.map(d=>{
    const c = (window.__chartColorOf ? window.__chartColorOf(d.k) : "#8e8e93");
    return `
      <div class="chipRow" data-key="${escapeHtml(d.k)}" style="background:linear-gradient(135deg, ${c}22, ${c}55)">
        <div class="chipLeft">
          <div class="dot" style="background:${c}"></div>
          <div class="chipTitle" title="${escapeHtml(d.k)}">${escapeHtml(d.k)}</div>
        </div>
        <div class="chipCount">${Number(d.v||0)}</div>
      </div>
    `;
  }).join("");

  els.chartMobileList.querySelectorAll(".chipRow").forEach(elm=>{
    elm.addEventListener("click", ()=>{
      const key = elm.getAttribute("data-key");
      if(!key || key==="Diğer") return;
      const people = buildPeopleListForKey(key);
      const title = `${chartMode==="roles" ? "Görev" : "Kategori"}: ${key}`;
      openMobilePeopleModal(title, `${people.length} kişi`, people);
    });
  });
}
function drawChart(){
  if(!rows.length) return;
  if(chartMode==="roles"){
    const counts=new Map();
    for(const r of rows){
      const k=((r.role||"Bilinmiyor").trim() || "Bilinmiyor");
      if(!counts.has(k)) counts.set(k, new Set());
      counts.get(k).add((r.person||"").trim());
    }
    const items=[...counts.entries()].map(([k,set])=>({k,v:set.size})).sort((a,b)=>b.v-a.v);
    window.__chartColorOf = makeChartColorGetter(items.map(x=>x.k));
    els.chartTitle.textContent = "Görevlere Göre Dağılım";
    if(isMobile()){ closeDrawer(); renderMobileChartList(items); return; }
    drawDoughnut(els.chartMain, items, 14, "Top Görevler");
  }else{
    const counts=new Map();
    for(const r of rows){
      const k=((r.category||"Bilinmiyor").trim() || "Bilinmiyor");
      if(!counts.has(k)) counts.set(k, new Set());
      counts.get(k).add((r.person||"").trim());
    }
    const items=[...counts.entries()].map(([k,set])=>({k,v:set.size})).sort((a,b)=>b.v-a.v);
    window.__chartColorOf = makeChartColorGetter(items.map(x=>x.k));
    els.chartTitle.textContent = "Kategori Dağılımı";
    if(isMobile()){ closeDrawer(); renderMobileChartList(items); return; }
    drawDoughnut(els.chartMain, items, 14, "Top Kategoriler");
  }
}

/* ---------- chart drawer ---------- */
function openDrawer(title, subtitle, items, opts={}){
  els.drawerTitle.textContent = title;
  els.drawerSub.textContent = subtitle;
  drawerData = items.slice();
  drawerMode = opts.mode || ((drawerData[0] && ("label" in (drawerData[0]||{}))) ? "labels" : "items");
  els.drawerSearch.value = "";
  // copy buttons only make sense in item-list mode
  const showCopy = (drawerMode === "items" && drawerData.length);
  els.drawerCopyAll.style.display = showCopy ? "inline-flex" : "none";
  els.drawerCopyVisible.style.display = showCopy ? "inline-flex" : "none";
  els.drawerCopyExpanded.style.display = showCopy ? "inline-flex" : "none";
  renderDrawerList();
  els.drawer.classList.remove("hidden");
  // back button
  els.drawerBack.style.display = drawerStack.length ? "inline-flex" : "none";
}
function closeDrawer(){
  els.drawer.classList.add("hidden");
  drawerData = [];
  drawerStack = [];
  els.drawerBack.style.display = "none";
  els.drawerCopyAll.style.display = "none";
  els.drawerCopyVisible.style.display = "none";
  els.drawerCopyExpanded.style.display = "none";
  els.drawerList.innerHTML = "";
}
function getDrawerFilteredItems(){
  const q = foldTr_(els.drawerSearch.value.trim());
  const labelMode = !!(drawerData[0] && typeof drawerData[0]==="object" && ("label" in drawerData[0]));
  if(labelMode) return drawerData.slice(); // copy only for items anyway
  if(!q) return drawerData.slice();
  return drawerData.filter(x=>{
    const hay = foldTr_(String(x.person||"") + " " + (Array.isArray(x.plays)?x.plays.join(" "):String(x.plays||"")));
    return hay.includes(q);
  });
}

function drawerItemsToTSVSummary(items, labelForRole=""){
  const lines = [];
  lines.push(["Kişi","Görev","Oyunlar"].join("\t"));
  const fixedRole = (labelForRole||"").toString().trim();
  for(const it of items){
    const plays = Array.isArray(it.plays) ? it.plays.join(" • ") : (it.plays || "");
    const role = (it.role || it.gorev || fixedRole || "");
    lines.push([it.person || "", role, plays].join("\t"));
  }
  return lines.join("\n");
}

function drawerItemsToTSVExpanded(items, labelForRole=""){
  const lines = [];
  lines.push(["Kişi","Görev","Oyun"].join("\t"));
  const fixedRole = (labelForRole||"").toString().trim();
  for(const it of items){
    const role = (it.role || it.gorev || fixedRole || "");
    const playsArr = Array.isArray(it.plays) ? it.plays : (it.plays ? [String(it.plays)] : [""]);
    for(const p of playsArr){
      lines.push([it.person || "", role, p || ""].join("\t"));
    }
  }
  return lines.join("\n");
}
els.drawerClose.addEventListener("click", closeDrawer);
els.drawerCopyAll.addEventListener("click", ()=>{
  if(drawerMode !== "items" || !drawerData.length) return;
  const items = getDrawerFilteredItems();
  openCopyModal(drawerItemsToTSVSummary(items, els.drawerTitle.textContent), "Excel");
});
els.drawerCopyVisible.addEventListener("click", ()=>{
  if(drawerMode !== "items" || !drawerData.length) return;
  const items = getDrawerFilteredItems();
  openCopyModal(drawerItemsToTSVSummary(items, els.drawerTitle.textContent), "Excel");
});
els.drawerCopyExpanded.addEventListener("click", ()=>{
  if(drawerMode !== "items" || !drawerData.length) return;
  const items = getDrawerFilteredItems();
  openCopyModal(drawerItemsToTSVExpanded(items, els.drawerTitle.textContent), "Excel");
});
els.drawerBack.addEventListener("click", ()=>{
  const prev = drawerStack.pop();
  if(!prev){
    els.drawerBack.style.display = "none";
    return;
  }
  openDrawer(prev.title, prev.subtitle, prev.items, {mode: prev.mode});
});
els.drawerSearch.addEventListener("input", renderDrawerList);
// label list tıkla -> ilgili label için kişi listesi aç (drill-down)
els.drawerList.addEventListener("click", (e)=>{
  const item = e.target.closest(".miniItem[data-label]");
  if(!item) return;
  const label = item.getAttribute("data-label");
  if(!label) return;

  // mevcut state'i stack'e it
  drawerStack.push({
    title: els.drawerTitle.textContent,
    subtitle: els.drawerSub.textContent,
    items: drawerData.slice(),
    mode: drawerMode
  });

  // label -> kişiler
  const key = String(label);
  const items = (key === "Diğer" && Array.isArray(window.__chartOtherItems))
    ? []
    : buildDrawerItemsForKey(key);

  const title = `${chartMode === "roles" ? "Görev" : "Kategori"}: ${key}`;
  openDrawer(title, `${items.length} kişi`, items, {mode:"items"});
});


function renderDrawerList(){
  const q = foldTr_(els.drawerSearch.value.trim());
  const labelMode = !!(drawerData[0] && typeof drawerData[0]==="object" && ("label" in drawerData[0]));

  const filtered = drawerData.filter(x=>{
    if(!q) return true;
    if(labelMode){
      return foldTr_(String(x.label||"")).includes(q);
    }
    return foldTr_(x.person+" "+(x.plays||[]).join(" ")).includes(q);
  });

  if(!filtered.length){
    els.drawerList.innerHTML = `<div class="empty">Sonuç yok.</div>`;
    return;
  }

  if(labelMode){
    els.drawerList.innerHTML = filtered.slice(0,400).map(x=>`
      <div class="miniItem" role="button" tabindex="0" data-label="${escapeHtml(String(x.label||""))}">
        <b>${escapeHtml(String(x.label||""))}</b>
        <div class="small">${escapeHtml(String(x.value ?? ""))} kişi</div>
      </div>
    `).join("");
    return;
  }

  els.drawerList.innerHTML = filtered.slice(0,250).map(x=>`
    <div class="miniItem">
      <b>${escapeHtml(x.person)}</b>
      ${x.role ? `<div class="small muted">Görev: ${escapeHtml(String(x.role))}</div>` : ""}
      <div class="small">${escapeHtml((x.plays||[]).slice(0,10).join(" • "))}${(x.plays||[]).length>10 ? " • …" : ""}</div>
    </div>
  `).join("");
}


/* ---------- distribution ---------- */
function computeDistribution(){
  const map=new Map();
  for(const r of rows){
    if(!r.person) continue;
    const p=r.person.trim(); if(!p) continue;
    if(!map.has(p)) map.set(p, {plays:new Set(), roles:new Set()});
    map.get(p).plays.add(r.play);
    if(r.role) map.get(p).roles.add(r.role);
  }
  const out=[];
  for(const [person, v] of map.entries()){
    const plays=[...v.plays].sort((a,b)=>a.localeCompare(b,"tr"));
    if(plays.length<=1) continue;
    out.push({person, plays, roles:[...v.roles].sort((a,b)=>a.localeCompare(b,"tr"))});
  }
  out.sort((a,b)=>b.plays.length-a.plays.length || a.person.localeCompare(b.person,"tr"));
  return out;
}
function renderDistribution(){
  const q=foldTr_(els.dq.value.trim());
  const filtered = distribution.filter(d=>{
    if(!q) return true;
    const hay=foldTr_(d.person+" "+d.plays.join(" ")+" "+d.roles.join(" "));
    return hay.includes(q);
  });

  if(!filtered.length){
    els.distributionBox.innerHTML = `<div class="empty">Kayıt yok (veya filtre çok dar).</div>`;
    return;
  }
  els.distributionBox.innerHTML = `
    <table class="table">
      <thead><tr><th>Kişi</th><th>Oyun Sayısı</th><th>Oyunlar</th><th>Görevler</th></tr></thead>
      <tbody>
        ${filtered.map(d=>`
          <tr>
            <td><b>${escapeHtml(d.person)}</b></td>
            <td>${d.plays.length}</td>
            <td><div class="cellClamp gamesCell" title="${escapeHtml(d.plays.join(" • "))}">${escapeHtml(d.plays.join(" • "))}</div></td>
            <td><div class="cellClamp rolesCell" title="${escapeHtml(d.roles.join(", "))}">${escapeHtml(d.roles.join(", "))}</div></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
    <div class="small" style="margin-top:10px">Toplam: ${filtered.length} kişi</div>
  `;

  // UI: uzun oyun/rol listelerini 3 satırda kısalt, tıklayınca aç/kapat
  try{
    els.distributionBox.querySelectorAll(".cellClamp").forEach(el=>{
      el.addEventListener("click", ()=> el.classList.toggle("is-expanded"));
    });
  }catch(e){}
}

/* ---------- figuran render ---------- */
function renderFiguran(){
  const q=foldTr_(els.fq.value.trim());
  const filtered = figuran.filter(f=>{
    if(!q) return true;
    const hay=foldTr_(f.person+" "+(f.cats||[]).join(" ")+" "+f.plays.join(" ")+" "+f.roles.join(" "));
    return hay.includes(q);
  });

  if(!filtered.length){
    els.figuranBox.innerHTML = `<div class="empty">Figüran / Kurumdan Emekli Sanatçı bulunamadı.</div>`;
    return;
  }

  els.figuranBox.innerHTML = `
    <table class="table">
      <thead><tr><th>S.N</th><th>Kişi</th><th>Kategori</th><th>Oyunlar</th><th>Görevler</th></tr></thead>
      <tbody>
        ${filtered.map((f, idx)=>`
          <tr>
            <td>${idx+1}</td>
            <td><b>${escapeHtml(f.person)}</b></td>
            <td>${escapeHtml((f.cats||[]).join(", "))}</td>
            <td>${escapeHtml(f.plays.join(" • "))}</td>
            <td>${escapeHtml(f.roles.join(", "))}</td>
            
          </tr>
        `).join("")}
      </tbody>
    </table>
    <div class="small" style="margin-top:10px">Toplam: ${filtered.length} kişi</div>
  `;
}

/* ---------- intersection ---------- */
function renderPlayOptions(){
  const opts = playsList.map(p=>`<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join("");
  els.p1.innerHTML = opts;
  els.p2.innerHTML = opts;
  if(playsList.length){
    els.p1.value = playsList[0];
    els.p2.value = playsList.length>1 ? playsList[1] : playsList[0];
  }
}
function computeIntersection(playA, playB){
  const mapA=new Map();
  const mapB=new Map();
  for(const r of rows){
    if(!r.person) continue;
    if(r.play===playA){
      if(!mapA.has(r.person)) mapA.set(r.person, []);
      mapA.get(r.person).push(r);
    } else if(r.play===playB){
      if(!mapB.has(r.person)) mapB.set(r.person, []);
      mapB.get(r.person).push(r);
    }
  }
  const common=[];
  for(const [person, ra] of mapA.entries()){
    if(!mapB.has(person)) continue;
    const rb = mapB.get(person);
    const rolesA=[...new Set(ra.map(x=>x.role).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"tr"));
    const rolesB=[...new Set(rb.map(x=>x.role).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"tr"));
    const catsA=[...new Set(ra.map(x=>x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"tr"));
    const catsB=[...new Set(rb.map(x=>x.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"tr"));
    common.push({person, rolesA, rolesB, catsA, catsB});
  }
  common.sort((a,b)=>a.person.localeCompare(b.person,"tr"));
  return common;
}
function renderIntersection(){
  const a = els.p1.value;
  const b = els.p2.value;
  if(!a || !b){
    els.intersectionBox.innerHTML = `<div class="empty">Oyun seç.</div>`;
    return;
  }
  if(a===b){
    els.intersectionBox.innerHTML = `<div class="empty">İki farklı oyun seçersen ortak personeli gösterebilirim 🙂</div>`;
    return;
  }
  const common = computeIntersection(a,b);
  if(!common.length){
    els.intersectionBox.innerHTML = `<div class="empty"><b>${escapeHtml(a)}</b> ile <b>${escapeHtml(b)}</b> arasında ortak personel yok.</div>`;
    return;
  }
  els.intersectionBox.innerHTML = `
    <div class="small" style="margin-bottom:10px"><b>${escapeHtml(a)}</b> ∩ <b>${escapeHtml(b)}</b> → <b>${common.length}</b> kişi</div>
    <table class="table">
      <thead><tr><th>Kişi</th><th>${escapeHtml(a)} (Kategori / Görev)</th><th>${escapeHtml(b)} (Kategori / Görev)</th></tr></thead>
      <tbody>
        ${common.map(c=>`
          <tr>
            <td><b>${escapeHtml(c.person)}</b></td>
            <td>${escapeHtml(c.catsA.join(", "))}<br><span class="small">${escapeHtml(c.rolesA.join(", "))}</span></td>
            <td>${escapeHtml(c.catsB.join(", "))}<br><span class="small">${escapeHtml(c.rolesB.join(", "))}</span></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

/* ---------- navigation ---------- */
function setActiveTab(which){
  // Track active tab so we can safely re-render after data load
  try{ window.__idtActiveTab = which; }catch(_e){}
  const tabs=[["tabPanel","viewPanel"],["tabDistribution","viewDistribution"],["tabIntersection","viewIntersection"],["tabFiguran","viewFiguran"],["tabCharts","viewCharts"],["tabAssign","viewAssign"]];
  for(const [t,v] of tabs){
    el(t).classList.remove("active");
    el(v).style.display="none";
  }
  el("tab"+which).classList.add("active");
  el("view"+which).style.display="block";

  // URL hash (geri/ileri ve yenilemede aynı sekme)
  const slugMap = { Panel:"panel", Distribution:"analiz", Intersection:"kesisim", Figuran:"figuran", Charts:"grafikler",
    Assign:"gorev"
  };
  const slug = slugMap[which] || "panel";
  if (location.hash !== "#"+slug) {
    history.replaceState(null, "", "#" + slug);
  }
  if(which==="Charts" && rows.length){
    closeDrawer();
    // Sekme görünür olduktan sonra çiz (mobilde listeyi garanti eder)
    setTimeout(()=>{ try{ drawChart(); }catch(e){ console.error(e); } }, 0);
  }
  if(which==="Assign"){
    try{ initAssignToolOnce(); renderAssignTool(); }catch(e){ console.error(e); }
  }
}

els.tabPanel.addEventListener("click", ()=>setActiveTab("Panel"));
els.tabDistribution.addEventListener("click", ()=>setActiveTab("Distribution"));
els.tabIntersection.addEventListener("click", ()=>setActiveTab("Intersection"));
els.tabFiguran.addEventListener("click", ()=>setActiveTab("Figuran"));
els.tabCharts.addEventListener("click", ()=>setActiveTab("Charts"));
els.tabAssign && els.tabAssign.addEventListener("click", ()=>setActiveTab("Assign"));

function tabFromHash_(){
  const h = String(location.hash||"").replace(/^#/,"").toLowerCase();
  if(h==="panel") return "Panel";
  if(h==="analiz" || h==="analysis" || h==="distribution") return "Distribution";
  if(h==="kesisim" || h==="intersection") return "Intersection";
  if(h==="figuran" || h==="figüran") return "Figuran";
  if(h==="grafikler" || h==="charts") return "Charts";
  if(h==="gorev" || h==="görev" || h==="assign") return "Assign";
  return null;
}

// KPI kartları: hızlı sekme geçişi
document.querySelectorAll(".kpi[data-go]").forEach(card=>{
  const target = String(card.getAttribute("data-go")||"").trim();
  if(!target) return;
  card.addEventListener("click", ()=>setActiveTab(target));
  card.addEventListener("keydown", (e)=>{
    if(e.key==="Enter" || e.key===" "){
      e.preventDefault();
      setActiveTab(target);
    }
  });
});

// Browser geri/ileri
window.addEventListener("hashchange", ()=>{
  const t = tabFromHash_();
  if(t) setActiveTab(t);
});

// İlk açılışta hash varsa onu aç
const initTab = tabFromHash_();
if(initTab) setActiveTab(initTab);
/* ---------- events ---------- */
els.reloadBtn.addEventListener("click", ()=>load(false));
// Gelişmiş menü (Dağılım / Kesişim)
if(els.advBtn && els.advMenu){
  els.advBtn.addEventListener("click", (e)=>{
    e.stopPropagation();
    els.advMenu.classList.toggle("hidden");
  });
  const closeAdv = ()=> els.advMenu.classList.add("hidden");
  document.addEventListener("click", closeAdv);
  els.advMenu.addEventListener("click", (e)=> e.stopPropagation());

  els.advDist && els.advDist.addEventListener("click", ()=>{ closeAdv(); setActiveTab("Distribution"); });
  els.advInter && els.advInter.addEventListener("click", ()=>{ closeAdv(); setActiveTab("Intersection"); });
}


function positionNotifPanel(){
  if(!els.notifBtn || !els.notifPanel) return;
  const btn = els.notifBtn.getBoundingClientRect();
  const panel = els.notifPanel;

  const margin = 12;
  const top = Math.round(btn.bottom + 8);
  // Prefer aligning panel's right edge with button's right edge
  const desiredLeft = Math.round(btn.right - panel.offsetWidth);
  const maxLeft = window.innerWidth - margin - panel.offsetWidth;
  const left = Math.max(margin, Math.min(desiredLeft, maxLeft));

  // Apply via CSS vars to avoid layout thrash
  document.documentElement.style.setProperty('--npTop', top + 'px');
  document.documentElement.style.setProperty('--npLeft', left + 'px');
  document.documentElement.style.setProperty('--npRight', 'auto');

  // Ensure body scroll area fits
  const maxH = Math.min(window.innerHeight - top - margin, 560);
  panel.style.maxHeight = maxH + 'px';
  const bd = panel.querySelector('.notifBd');
  if(bd){
    const hd = panel.querySelector('.notifHd');
    const hdH = hd ? hd.getBoundingClientRect().height : 70;
    bd.style.maxHeight = Math.max(180, maxH - hdH - 10) + 'px';
  }
}

// Bildirimler (LOG)
els.notifBtn && els.notifBtn.addEventListener("click", async ()=>{
  const willOpen = els.notifPanel.classList.contains("hidden");
  els.notifPanel.classList.toggle("hidden");
  if(willOpen){
    // Position first so it never feels like "opened but invisible"
    positionNotifPanel();
    // Reposition on scroll/resize while open
    const onMove = () => { if(!els.notifPanel.classList.contains("hidden")) positionNotifPanel(); };
    window.addEventListener("resize", onMove, { passive:true });
    window.addEventListener("scroll", onMove, { passive:true });
    els.notifPanel.__idtOnMove = onMove;

    await loadNotifications();
    positionNotifPanel();
  }else{
    // cleanup listeners
    const onMove = els.notifPanel.__idtOnMove;
    if(onMove){
      window.removeEventListener("resize", onMove);
      window.removeEventListener("scroll", onMove);
      els.notifPanel.__idtOnMove = null;
    }
  }
});
els.notifClose && els.notifClose.addEventListener("click", ()=>els.notifPanel.classList.add("hidden"));
els.notifRefresh && els.notifRefresh.addEventListener("click", loadNotifications);

els.clearBtn.addEventListener("click", ()=>{ els.q.value=""; localStorage.setItem("idt_q",""); renderList(); });
els.q.addEventListener("input", ()=>{ localStorage.setItem("idt_q", els.q.value||""); renderList(); });
els.qScope && els.qScope.addEventListener("change", ()=>{ localStorage.setItem("idt_qscope", els.qScope.value); renderList(); });
els.qClear && els.qClear.addEventListener("click", ()=>{ els.q.value=""; localStorage.setItem("idt_q",""); renderList(); els.q.focus(); });
els.btnPlays.addEventListener("click", ()=>{
  activeMode="plays";
  try{ localStorage.setItem("idt_mode","plays"); }catch(_e){}

  activePlayFilter = null;
  els.btnPlays.classList.add("active"); els.btnPeople.classList.remove("active");
  activeId=null; selectedItem=null;
  renderList(); renderDetails(null);
});
els.btnPeople.addEventListener("click", ()=>{
  activeMode="people";
  try{ localStorage.setItem("idt_mode","people"); }catch(_e){}

  activePlayFilter = null;
  els.btnPeople.classList.add("active"); els.btnPlays.classList.remove("active");
  activeId=null; selectedItem=null;
  renderList(); renderDetails(null);
});


// Mobil: oyundan kişilere geçişte geri tuşu Oyunlar'a döndürsün
window.addEventListener("popstate", ()=>{
  if(activePlayFilter){
    activePlayFilter = null;
    activeMode = "plays";
    els.btnPlays.classList.add("active"); 
    els.btnPeople.classList.remove("active");
    activeId=null; selectedItem=null;
    renderList(); 
    renderDetails(null);
    setStatus("↩️ Oyunlar listesine dönüldü", "ok");
  }
});
els.copyBtn.addEventListener("click", async ()=>{
  const tsv = toTSVFromSelected();
  if(!tsv){ setStatus("⚠️ Önce bir öğe seç", "warn"); return; }
  openCopyModal(tsv, "Excel");
});

function showManualCopy(text){
  // Minimal modal with textarea (manual copy)
  let modal = document.getElementById("copyModal");
  if(!modal){
    modal = document.createElement("div");
    modal.id = "copyModal";
    modal.innerHTML = `
      <div class="overlay" style="position:fixed;inset:0;background:rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;margin-left:auto;margin-right:auto;z-index:9999;">
        <div class="card" style="max-width:720px;width:min(92vw,720px);padding:14px 14px 12px;">
          <div style="display:flex;align-items:center;justify-content:flex-start;gap:10px;margin-bottom:8px">
            <div><div class="small" style="line-height:1.25;margin-bottom:6px">İzmir Devlet Tiyatrosu Müdürlüğü<br>Repertuvar Kişi Takip Sistemi<br>Sanat Teknik Bürosu</div><b>📋 Kopyala</b><div class="small">Ctrl+C / Kopyala → Excel’de Ctrl+V</div></div>
            <button class="btn" id="copyModalClose">✕</button>
          </div>
          <textarea id="copyModalTa" style="width:100%;height:260px;font:12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;border:1px solid var(--line);border-radius:12px;padding:10px;background:var(--card);color:var(--text)"></textarea>
        </div>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector("#copyModalClose").addEventListener("click", ()=> modal.remove());
    modal.addEventListener("click", (e)=>{ if(e.target.classList.contains("overlay")) modal.remove(); });
  }
  const ta = modal.querySelector("#copyModalTa");
  ta.value = String(text ?? "");
  ta.focus();
  ta.select();
  ta.setSelectionRange(0, ta.value.length);
}


function openCopyModal(text, title){
  // Use existing manual copy modal (reliable on GitHub Pages)
  // Title is optional; we keep the UI minimal.
  showManualCopy(text);
  setStatus("📋 Kopyalamak için Ctrl+C (veya sağ tık > Kopyala)", "ok");
}
function copyText(text){
  const value = String(text ?? "");
  // 1) Synchronous execCommand first (keeps user gesture; works more reliably)
  try{
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly","readonly");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    ta.style.left = "-1000px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand("copy");
    ta.remove();
    if(ok){
      toast("📋 Excel için kopyalandı (Ctrl+V / Yapıştır)");
      setStatus("📋 Kopyalandı", "ok");
      return Promise.resolve(true);
    }
  }catch(e){}

  // 2) Async clipboard as fallback
  if(navigator.clipboard && window.isSecureContext){
    return navigator.clipboard.writeText(value).then(()=>{
      toast("📋 Excel için kopyalandı (Ctrl+V / Yapıştır)");
      setStatus("📋 Kopyalandı", "ok");
      return true;
    }).catch(()=>{
      showManualCopy(value);
      setStatus("⚠️ Kopyalama için manuel ekran açıldı.", "warn");
      return false;
    });
  }

  // 3) Manual fallback
  showManualCopy(value);
  setStatus("⚠️ Kopyalama için manuel ekran açıldı.", "warn");
  return Promise.resolve(false);
}


function downloadText(filename, text){
  const blob = new Blob([text], {type:"text/tab-separated-values;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 0);
}
function safeFileName(s){
  return String(s||"").trim().replace(/[\\\/:*?"<>|]+/g,"-").slice(0,80) || "liste";
}
function toFiguranTSVFromSelected(){
  if(!selectedItem) return "";
  const rows = selectedItem.rows || [];
  const isFig = (r)=>{
    const cat = norm(r.category);
    const role = norm(r.role);
    return cat.includes("figuran") || role.includes("figuran");
  };
  const out = [["Oyun","Kişi","Görev","Kategori"]];
  rows.filter(isFig).forEach(r=>{
    out.push([r.play, r.person, r.role, r.category]);
  });
  // Excel için TSV
  return out.map(line=>line.map(v=>String(v??"").replace(/\t/g," ")).join("\t")).join("\n");
}

els.downloadBtn && els.downloadBtn.addEventListener("click", ()=>{
  const tsv = toTSVFromSelected();
  if(!tsv){ setStatus("⚠️ Önce bir öğe seç", "warn"); return; }
  downloadText(`${safeFileName(selectedItem.title||"liste")}.tsv`, tsv);
  toast("İndiriliyor…");
});

els.figuranBtn && els.figuranBtn.addEventListener("click", ()=>{
  const tsv = toFiguranTSVFromSelected();
  if(!tsv || tsv.split("\n").length<=1){
    setStatus("⚠️ Bu seçimde figüran bulunamadı.", "warn");
    return;
  }
  downloadText(`${safeFileName(selectedItem.title||"figuran")}-figuran.tsv`, tsv);
  toast("Figüran listesi indiriliyor…");
});

els.dq.addEventListener("input", renderDistribution);
els.dClear.addEventListener("click", ()=>{ els.dq.value=""; renderDistribution(); });

els.fq.addEventListener("input", renderFiguran);

// Figüran sekmesi: Excel’e Kopyala
if(els.figDownloadAllBtn){
  els.figDownloadAllBtn.addEventListener("click", async ()=>{
    if(!figuran || !figuran.length){ setStatus("⚠️ Figüran verisi yok.", "warn"); return; }
    const rows = [["S.N","Kişi","Kategori","Oyunlar","Görevler"]];
    figuran.forEach((f,i)=>rows.push([i+1, f.person, (f.cats||[]).join(", "), (f.plays||[]).join(" • "), (f.roles||[]).join(", ")]));
    const tsv = rows
      .map(r => r
        .map(v => String(v ?? "")
          .replace(/\t/g, " ")
          .replace(/\r?\n/g, " ")
        ).join("\t")
      ).join("\n");
    openCopyModal(tsv, "Excel");
  });
}
els.fClear.addEventListener("click", ()=>{ els.fq.value=""; renderFiguran(); });

els.p1.addEventListener("change", renderIntersection);
els.p2.addEventListener("change", renderIntersection);
els.swapBtn.addEventListener("click", ()=>{
  const a=els.p1.value; els.p1.value=els.p2.value; els.p2.value=a;
  renderIntersection();
});

els.chartTabRoles.addEventListener("click", ()=>{
  chartMode="roles";
  els.chartTabRoles.classList.add("active");
  els.chartTabCats.classList.remove("active");
  closeDrawer();
  drawChart();
});
els.chartTabCats.addEventListener("click", ()=>{
  chartMode="cats";
  els.chartTabCats.classList.add("active");
  els.chartTabRoles.classList.remove("active");
  closeDrawer();
  drawChart();
});

window.addEventListener("resize", ()=>{
  if(rows.length && els.viewCharts.style.display!=="none"){ drawChart(); }
});

/* ---------- KPIs ---------- */
function renderKpis(){
  els.kpiPlays.textContent = String(plays.length || 0);
  const uniqPeople = new Set(rows.map(r=>r.person).filter(Boolean));
  els.kpiPeople.textContent = String(uniqPeople.size);
  els.kpiRows.textContent = String(rawRows.length);
  els.kpiFiguran.textContent = String(figuran.length || 0);
}

/* ---------- main load ---------- */
async function load(isAuto=false){
  if(!isAuto) setStatus("⏳ Yükleniyor…");
  activeId=null; selectedItem=null;
  try{
    // 🚀 Hızlı açılış: varsa cache'ten anında çiz (arkada güncelle)
    if(!isAuto){
      try{
        const cached = localStorage.getItem("idt_cache_v1");
        const cachedAt = Number(localStorage.getItem("idt_cache_v1_at")||0);
        if(cached){
          const ageMin = (Date.now()-cachedAt)/60000;
          rawRows = JSON.parse(cached);
          rows = expandRowsByPeople(rawRows);
          plays = groupByPlay(rows);
          people = groupByPerson(rows);
          playsList = plays.map(p=>p.title);
          renderList();
          renderDetails(null);
          distribution = computeDistribution();
          renderDistribution();
          retiredSet = computeRetiredSetFromRaw();
          figuran = computeFiguranFromRaw();
          renderFiguran();
          renderPlayOptions();
          renderIntersection();
          renderKpis();
          setStatus(`⏳ Güncelleniyor… (cache${ageMin?` • ${Math.round(ageMin)}dk`:""})`);
        }
      }catch(_){/* cache bozuksa görmezden gel */}
    }

    try{ rawRows = await tryLoadApiJsonp(); }
    catch(e1){
      try{ rawRows = await tryLoadGviz(); }
      catch(e2){ rawRows = await tryLoadCsv(); }
    }

    // Cache (bir sonraki açılışta hızlı render için)
    try{
      localStorage.setItem("idt_cache_v1", JSON.stringify(rawRows));
      localStorage.setItem("idt_cache_v1_at", String(Date.now()));
    }catch(_){/* localStorage doluysa sorun değil */}

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

    // If the page was opened directly on #gorev (Assign tab), the tool UI
    // may have been rendered before rows were loaded. Re-render now with data.
    try{
      const active = (window.__idtActiveTab || "") === "Assign" || (el("tabAssign") && el("tabAssign").classList.contains("active"));
      if(active){ initAssignToolOnce(); renderAssignTool(); }
    }catch(e){ console.error(e); }

    // cache'e yaz
    try{
      localStorage.setItem("idt_cache_v1", JSON.stringify(rawRows));
      localStorage.setItem("idt_cache_v1_at", String(Date.now()));
    }catch(_){/* storage dolu olabilir */}

    const when = new Date().toLocaleTimeString("tr-TR",{hour:"2-digit",minute:"2-digit"});
    setStatus(`✅ Hazır • ${when}`, "ok");
    // Bildirimleri (BİLDİRİMLER) yükle
    loadNotifications();
  }catch(err){
    console.error(err);
    setStatus("⛔ Veri çekilemedi", "bad");
    els.list.innerHTML = `<div class="empty" style="text-align:left;white-space:pre-wrap">
<b>Veri çekilemedi.</b>

1) Sheet paylaşımı: Paylaş → “Bağlantıya sahip herkes: Görüntüleyebilir”
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
/* --- Fallback init: ensure data load runs --- */
document.addEventListener("DOMContentLoaded", ()=>{
  try{
    if(typeof boot === "function") boot();
    else if(typeof loadAll === "function") loadAll();
    else if(typeof load === "function") load();
    else if(typeof init === "function") init();
  }catch(e){ console.error(e); }
});

/* --- Nav polish: Ek Araçlar sekmeye taşınır + ikonlar --- */
document.addEventListener("DOMContentLoaded", ()=>{
  try{
    const nav = document.querySelector(".nav");
    const advBtn = document.getElementById("advBtn");
    if(nav && advBtn){
      advBtn.classList.add("tab");
      advBtn.classList.remove("btn");
      nav.appendChild(advBtn);
    }
    const iconMap = [
      ["tabPanel","🏠 "],
      ["tabDistribution","🎭 "],
      ["tabIntersection","🔁 "],
      ["tabFiguran","👥 "],
      ["tabCharts","📊 "],
      ["advBtn","🧰 "],
    ];
    iconMap.forEach(([id,ico])=>{
      const el = document.getElementById(id);
      if(el && !el.dataset.iconed){
        el.dataset.iconed="1";
        el.textContent = ico + el.textContent.replace(/^(🧰|📊|👥|🔁|🎭|🏠)\s+/,"");
      }
    });
  }catch(e){ console.error(e); }
});

/* v26: Intersection badge replace (emoji -> span) */
document.addEventListener("DOMContentLoaded", ()=>{
  try{
    const makeBadge = (n)=>{
      const s=document.createElement("span");
      s.className="numBadge";
      s.textContent=String(n);
      return s;
    };
    const fix = (title,n)=>{
      const box = document.querySelector(`#viewIntersection .input[title="${title}"]`);
      if(!box) return;
      // Remove leading emoji text nodes (1️⃣/2️⃣) if present
      for(const node of Array.from(box.childNodes)){
        if(node.nodeType===Node.TEXT_NODE && node.textContent.includes("️⃣")){
          node.textContent = node.textContent.replace(/\s*\d️⃣\s*/g,"");
        }
      }
      if(!box.querySelector(".numBadge")){
        box.insertBefore(makeBadge(n), box.firstChild);
      }
    };
    fix("1. Oyun",1);
    fix("2. Oyun",2);
  }catch(e){ console.error(e); }
});


/* ===== UI HOTFIX: Config overrides (does not change CONFIG shape) ===== */
try {
  CONFIG.SPREADSHEET_ID = "1sIzswZnMkyRPJejAsE_ylSKzAF0RmFiACP4jYtz-AE0";
  CONFIG.API_BASE = "https://script.google.com/macros/s/AKfycbxkmxnDtSlfXa008qh_cS2dneTVweaQtMVTIUmOWR1PkAWlHX2EQkd86HwN5X9vZrCp/exec";
  CONFIG.NOTIF_API_BASE = "https://script.google.com/macros/s/AKfycbxkmxnDtSlfXa008qh_cS2dneTVweaQtMVTIUmOWR1PkAWlHX2EQkd86HwN5X9vZrCp/exec";
} catch (e) {
  console.warn("CONFIG override skipped:", e);
}

/* ===== Görev Ataması: Araç ekranı (Filtrele & Listele / Karşılaştır) ===== */
const assignState = {
  inited: false,
  mode: "filter",
  roles: new Set(),
  plays: new Set(),
  people: new Set(),
  personA: "",
  personB: "",
  qRole: "",
  qPlay: "",
  qPerson: "",
  _cmpOpen: "",
};

function normTxt_(s){ return String(s||"").trim(); }
function foldTr_(s){
  // case-insensitive + TR-friendly normalize (İ/ı etc.)
  return String(s||"")
    .toLocaleLowerCase("tr")
    .replace(/İ/g,"i").replace(/I/g,"ı")
    .normalize("NFD").replace(/\p{Diacritic}/gu,"");
}
function uniqSorted_(arr){
  const s = new Set(arr.filter(Boolean).map(x=>normTxt_(x)).filter(Boolean));
  return Array.from(s).sort((a,b)=>a.localeCompare(b,"tr"));
}

function renderMsSummary_(txtEl, badgeEl, set){
  if(badgeEl) badgeEl.textContent = String(set.size||0);
  if(!txtEl) return;
  if(!set.size){ txtEl.textContent = "Seç…"; return; }
  const sample = Array.from(set).slice(0,2).join(", ");
  txtEl.textContent = set.size<=2 ? sample : `${sample} +${set.size-2}`;
}

function buildMsList_(listEl, values, selectedSet, onChange, query){
  if(!listEl) return;
  const q = foldTr_(query||"");
  const filtered = !q ? values : values.filter(v=>foldTr_(v).includes(q));
  listEl.innerHTML = filtered.map(v=>{
    const id = `ms_${listEl.id}_${Math.random().toString(36).slice(2)}`;
    const checked = selectedSet.has(v) ? "checked" : "";
    const enc = encodeURIComponent(v);
    return `<label class="msItem" for="${id}"><input id="${id}" type="checkbox" ${checked} data-v="${enc}"/><span>${escapeHtml(v)}</span></label>`;
  }).join("");
  listEl.querySelectorAll("input[type=checkbox]").forEach(cb=>{
    cb.addEventListener("change", ()=>{
      const v = cb.getAttribute("data-v") || "";
      const val = decodeURIComponent(v);
      if(cb.checked) selectedSet.add(val); else selectedSet.delete(val);
      onChange && onChange();
    });
  });
}

function initAssignToolOnce(){
  if(assignState.inited) return;
  assignState.inited = true;

  // Mode switching
  if(els.assignModeFilter) els.assignModeFilter.addEventListener("click", ()=>{ assignState.mode="filter"; renderAssignTool(); });
  if(els.assignModeCompare) els.assignModeCompare.addEventListener("click", ()=>{ assignState.mode="compare"; renderAssignTool(); });

  // Clear & copy
  if(els.assignFilterClear) els.assignFilterClear.addEventListener("click", ()=>{
    assignState.roles.clear(); assignState.plays.clear(); assignState.people.clear();
    renderAssignTool();
  });
  if(els.assignFilterCopy) els.assignFilterCopy.addEventListener("click", ()=>{
    const out = getAssignFilterRows_();
    const tsv = out.map(r=>[r.play,r.category||"",r.role,r.person].join("\t")).join("\n");
    openCopyModal(tsv, "Sorgu – Filtre");
  });

  if(els.assignCompareSwap) els.assignCompareSwap.addEventListener("click", ()=>{
    const a = els.assignPersonA?.value || "";
    const b = els.assignPersonB?.value || "";
    if(els.assignPersonA) els.assignPersonA.value = b;
    if(els.assignPersonB) els.assignPersonB.value = a;
    renderAssignTool();
  });
  if(els.assignCompareCopy) els.assignCompareCopy.addEventListener("click", ()=>{
    const tsv = buildCompareTsv_();
    openCopyModal(tsv, "Sorgu – Karşılaştır");
  });

  if(els.assignPersonA){
    els.assignPersonA.addEventListener("input", ()=>renderAssignTool());
    els.assignPersonA.addEventListener("change", ()=>renderAssignTool());
    els.assignPersonA.addEventListener("focus", ()=>{ assignState._cmpOpen="A"; renderAssignTool(); });
    els.assignPersonA.addEventListener("click", ()=>{ assignState._cmpOpen="A"; renderAssignTool(); });
    els.assignPersonA.addEventListener("blur", ()=>setTimeout(()=>{ assignState._cmpOpen=""; renderAssignTool(); }, 0));
  }
  if(els.assignPersonB){
    els.assignPersonB.addEventListener("input", ()=>renderAssignTool());
    els.assignPersonB.addEventListener("change", ()=>renderAssignTool());
    els.assignPersonB.addEventListener("focus", ()=>{ assignState._cmpOpen="B"; renderAssignTool(); });
    els.assignPersonB.addEventListener("click", ()=>{ assignState._cmpOpen="B"; renderAssignTool(); });
    els.assignPersonB.addEventListener("blur", ()=>setTimeout(()=>{ assignState._cmpOpen=""; renderAssignTool(); }, 0));
  }

  // Search inside multi-selects (case-insensitive)
  const rS = document.getElementById("msRolesSearch");
  const pS = document.getElementById("msPlaysSearch");
  const kS = document.getElementById("msPeopleSearch");
  if(rS) rS.addEventListener("input", ()=>{ assignState.qRole = rS.value || ""; renderAssignTool(); });
  if(pS) pS.addEventListener("input", ()=>{ assignState.qPlay = pS.value || ""; renderAssignTool(); });
  if(kS) kS.addEventListener("input", ()=>{ assignState.qPerson = kS.value || ""; renderAssignTool(); });
}

function getAllAssignValues_(){
  const src = rows || [];
  return {
    roles: uniqSorted_(src.map(r=>r.role)),
    plays: uniqSorted_(src.map(r=>r.play)),
    people: uniqSorted_(src.map(r=>r.person)),
  };
}

function getAssignFilterRows_(){
  const src = rows || [];
  const hasR = assignState.roles.size>0;
  const hasP = assignState.plays.size>0;
  const hasK = assignState.people.size>0;
  return src.filter(r=>{
    if(hasR && !assignState.roles.has(r.role)) return false;
    if(hasP && !assignState.plays.has(r.play)) return false;
    if(hasK && !assignState.people.has(r.person)) return false;
    return true;
  });
}

function renderAssignFilter_(){
  const vals = getAllAssignValues_();

  buildMsList_(els.msRolesList, vals.roles, assignState.roles, ()=>renderAssignTool(), assignState.qRole);
  buildMsList_(els.msPlaysList, vals.plays, assignState.plays, ()=>renderAssignTool(), assignState.qPlay);
  buildMsList_(els.msPeopleList, vals.people, assignState.people, ()=>renderAssignTool(), assignState.qPerson);

  renderMsSummary_(els.msRolesTxt, els.msRolesBadge, assignState.roles);
  renderMsSummary_(els.msPlaysTxt, els.msPlaysBadge, assignState.plays);
  renderMsSummary_(els.msPeopleTxt, els.msPeopleBadge, assignState.people);

  const out = getAssignFilterRows_();
  const limited = out.slice(0, 500);
  const srcCount = (rawRows||[]).length;
  const expandedCount = (rows||[]).length;
  if(els.assignRowCount){
    els.assignRowCount.textContent = `Kaynak satır: ${srcCount} • Ayrıştırılmış kayıt: ${expandedCount}`;
  }
  if(els.assignFilterMeta){
    els.assignFilterMeta.textContent = `Sonuç (ayrıştırılmış): ${out.length} satır • Kaynak: ${srcCount}`;
  }
  if(els.assignFilterTbody){
    if(!assignState.roles.size && !assignState.plays.size && !assignState.people.size){
      els.assignFilterTbody.innerHTML = `<tr><td colspan="4"><div class="emptyHint">Filtre seçerek başlayabilirsin.</div></td></tr>`;
    }else if(!out.length){
      els.assignFilterTbody.innerHTML = `<tr><td colspan="4"><div class="emptyHint">Sonuç yok.</div></td></tr>`;
    }else{
      els.assignFilterTbody.innerHTML = limited.map(r=>`<tr><td>${escapeHtml(r.play)}</td><td>${escapeHtml(r.category||"")}</td><td>${escapeHtml(r.role)}</td><td><b>${escapeHtml(r.person)}</b></td></tr>`).join("");
    }
  }
}

function personPlayMap_(){
  const mp = new Map(); // person -> Map(play -> Set(role))
  for(const r of rows||[]){
    if(!r.person || !r.play || !r.role) continue;
    if(!mp.has(r.person)) mp.set(r.person, new Map());
    const pm = mp.get(r.person);
    if(!pm.has(r.play)) pm.set(r.play, new Set());
    pm.get(r.play).add(r.role);
  }
  return mp;
}

function fmtRoles_(set){
  return Array.from(set||[]).sort((a,b)=>a.localeCompare(b,"tr")).join(", ");
}

function renderCompare_(){
  const vals = getAllAssignValues_();
  // Custom suggestion dropdowns (click-to-select)
  const renderSuggest = (which)=>{
    const input = which === "A" ? els.assignPersonA : els.assignPersonB;
    const box = document.getElementById(which === "A" ? "cmpSuggestA" : "cmpSuggestB");
    if(!input || !box) return;

    const q = foldTr_(input.value || "");
    const list = !q ? vals.people : vals.people.filter(p=>foldTr_(p).includes(q));
    const limited = list.slice(0, 60);

    // show when focused or when there is a query
    const shouldShow = (assignState._cmpOpen===which || document.activeElement===input) && (limited.length > 0);
    box.hidden = !shouldShow;
    if(!shouldShow){ box.innerHTML = ""; return; }

    box.innerHTML = limited.map(p=>`<div class="cmpOpt" data-v="${encodeURIComponent(p)}">${escapeHtml(p)}</div>`).join("")
      || `<div class="cmpOpt" style="opacity:.7">Sonuç yok</div>`;

    box.querySelectorAll(".cmpOpt[data-v]").forEach(el=>{
      el.addEventListener("mousedown", (e)=>{
        // mousedown so blur doesn't close before we select
        e.preventDefault();
        const val = decodeURIComponent(el.getAttribute("data-v")||"");
        input.value = val;
        box.hidden = true;
        renderAssignTool();
      });
    });
  };

  renderSuggest("A");
  renderSuggest("B");

  const resolve = (v)=>{
    const t = (v||"").toString().trim();
    if(!t) return "";
    const ft = foldTr_(t);
    const hit = vals.people.find(p=>foldTr_(p)===ft);
    return hit || "";
  };

  const a = resolve(els.assignPersonA?.value || "");
  const b = resolve(els.assignPersonB?.value || "");
  if(!a || !b){
    if(els.cmpCommon) els.cmpCommon.innerHTML = `<div class="emptyHint">İki kişi seç.</div>`;
    if(els.cmpOnlyA) els.cmpOnlyA.innerHTML = `<div class="emptyHint">—</div>`;
    if(els.cmpOnlyB) els.cmpOnlyB.innerHTML = `<div class="emptyHint">—</div>`;
    return;
  }

  const mp = personPlayMap_();
  const mA = mp.get(a) || new Map();
  const mB = mp.get(b) || new Map();

  const playsA = new Set(mA.keys());
  const playsB = new Set(mB.keys());
  const common = Array.from(playsA).filter(x=>playsB.has(x)).sort((x,y)=>x.localeCompare(y,"tr"));
  const onlyA = Array.from(playsA).filter(x=>!playsB.has(x)).sort((x,y)=>x.localeCompare(y,"tr"));
  const onlyB = Array.from(playsB).filter(x=>!playsA.has(x)).sort((x,y)=>x.localeCompare(y,"tr"));

  const renderList = (list, mapLeft, mapRight)=>{
    if(!list.length) return `<div class="emptyHint">—</div>`;
    return list.map(play=>{
      const rolesL = fmtRoles_(mapLeft.get(play));
      const rolesR = mapRight ? fmtRoles_(mapRight.get(play)) : "";
      return `<div class="cmpRow"><div class="cmpPlay"><b>${escapeHtml(play)}</b></div>`
        + (mapRight ? `<div class="cmpRoles"><span class="muted small">A:</span> ${escapeHtml(rolesL)}<br><span class="muted small">B:</span> ${escapeHtml(rolesR)}</div>`
                    : `<div class="cmpRoles">${escapeHtml(rolesL)}</div>`)
        + `</div>`;
    }).join("");
  };

  if(els.cmpCommon) els.cmpCommon.innerHTML = renderList(common, mA, mB);
  if(els.cmpOnlyA) els.cmpOnlyA.innerHTML = renderList(onlyA, mA, null);
  if(els.cmpOnlyB) els.cmpOnlyB.innerHTML = renderList(onlyB, mB, null);
}

function buildCompareTsv_(){
  const vals = getAllAssignValues_();
  const resolve = (v)=>{
    const t = (v||"").toString().trim();
    if(!t) return "";
    const ft = foldTr_(t);
    const hit = vals.people.find(p=>foldTr_(p)===ft);
    return hit || "";
  };
  const a = resolve(els.assignPersonA?.value || "");
  const b = resolve(els.assignPersonB?.value || "");
  if(!a || !b) return "";
  const mp = personPlayMap_();
  const mA = mp.get(a) || new Map();
  const mB = mp.get(b) || new Map();
  const playsA = new Set(mA.keys());
  const playsB = new Set(mB.keys());
  const common = Array.from(playsA).filter(x=>playsB.has(x)).sort((x,y)=>x.localeCompare(y,"tr"));
  const onlyA = Array.from(playsA).filter(x=>!playsB.has(x)).sort((x,y)=>x.localeCompare(y,"tr"));
  const onlyB = Array.from(playsB).filter(x=>!playsA.has(x)).sort((x,y)=>x.localeCompare(y,"tr"));
  const lines = [];
  // Header includes selected person names (more human-readable in Excel)
  lines.push(["BÖLÜM","OYUN", `${a} (Görevler)`, `${b} (Görevler)`].join("\t"));
  for(const p of common) lines.push(["ORTAK OYUN", p, fmtRoles_(mA.get(p)), fmtRoles_(mB.get(p))].join("\t"));
  for(const p of onlyA) lines.push(["SADECE A", p, fmtRoles_(mA.get(p)), ""].join("\t"));
  for(const p of onlyB) lines.push(["SADECE B", p, "", fmtRoles_(mB.get(p))].join("\t"));
  return lines.join("\n");
}

function renderAssignTool(){
  if(!els.viewAssign) return;
  // segmented state
  const isFilter = assignState.mode === "filter";
  if(els.assignModeFilter){ els.assignModeFilter.classList.toggle("active", isFilter); els.assignModeFilter.setAttribute("aria-selected", String(isFilter)); }
  if(els.assignModeCompare){ els.assignModeCompare.classList.toggle("active", !isFilter); els.assignModeCompare.setAttribute("aria-selected", String(!isFilter)); }
  if(els.assignPaneFilter) els.assignPaneFilter.hidden = !isFilter;
  if(els.assignPaneCompare) els.assignPaneCompare.hidden = isFilter;

  if(isFilter) renderAssignFilter_();
  else renderCompare_();
}



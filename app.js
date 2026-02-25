/* ===== IDT HARD BOOT LOCK ===== */
(function(){

  if (window.__IDT_APP_STARTED__) {
    console.warn("IDT blocked duplicate start");
    return;
  }
/* ===== IDT GLOBAL DATA SINGLETON ===== */
(function(){

  const cache = new Map();
  const originalFetch = window.fetch;

  window.fetch = function(url, options){

    if (typeof url === "string" && url.includes("script.google.com")) {

      if (cache.has(url)) {
        return cache.get(url).then(r => r.clone());
      }

      const p = originalFetch(url, options).then(r => {
        cache.set(url, Promise.resolve(r.clone()));
        return r.clone();
      });

      cache.set(url, p);
      return p;
    }

    return originalFetch(url, options);
  };

})();

  window.__IDT_APP_STARTED__ = true;

})();
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
  // Mobil listelerde modalı her koşulda aç (bazı cihazlarda media query yanlış yakalanabiliyor)
  if(!els.mobileContent || !els.mobileOverlay || !els.mobileModal) return;
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


function debounce(fn, wait=120){
  let t = null;
  return function(...args){
    const ctx = this;
    if(t) clearTimeout(t);
    t = setTimeout(()=>{ t=null; fn.apply(ctx, args); }, wait);
  };
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
      els.not

/* ===========================
   DT NEW DATA CORE (SAFE)
   =========================== */

const DATA = {
  rows: [],
  ready: false,
  listeners: []
};

function onDataReady(fn){
  if(DATA.ready) fn(DATA.rows);
  else DATA.listeners.push(fn);
}

function setData(rows){
  if(!Array.isArray(rows) || rows.length === 0) return;

  DATA.rows = rows;
  DATA.ready = true;

  console.log("DT: data loaded →", rows.length);

  DATA.listeners.forEach(fn => fn(rows));
  DATA.listeners = [];
}

/* -------- FETCH -------- */

async function fetchSheet(){
  const url =
    "https://docs.google.com/spreadsheets/d/1sIzswZnMkyRPJejAsE_ylSKzAF0RmFiACP4jYtz-AE0/gviz/tq?tqx=out:json";

  const res = await fetch(url, {cache:"no-store"});
  const txt = await res.text();

  const json = JSON.parse(txt.substr(47).slice(0,-2));
  const rows = json.table.rows;

  const parsed = rows.map(r =>
    r.c.map(c => c ? c.v : "")
  );

  setData(parsed);
}

/* -------- CACHE (SPEED ONLY) -------- */

function loadCache(){
  try{
    const c = localStorage.getItem("dt_cache_v2");
    if(!c) return;
    const parsed = JSON.parse(c);
    if(parsed.length>20){
      console.log("DT: cache warm start");
      setData(parsed);
    }
  }catch{}
}

function saveCache(rows){
  try{
    localStorage.setItem("dt_cache_v2", JSON.stringify(rows));
  }catch{}
}

/* -------- START -------- */

async function startApp(){
  loadCache();

  try{
    await fetchSheet();
    saveCache(DATA.rows);
  }catch(e){
    console.warn("DT: network failed, using cache");
  }
}

startApp();

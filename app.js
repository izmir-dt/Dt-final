/* =========================
DT STABLE CORE ENGINE (NO TIMEOUT FAIL)
Google Apps Script cold-start tolerant loader
========================= */

const API_URL = "https://script.google.com/macros/s/AKfycbxkmxnDtSlfXa008qh_cS2dneTVweaQtMVTIUmOWR1PkAWlHX2EQkd86HwN5X9vZrCp/exec";

let RAW = [];
let PLAYS = {};
let PEOPLE = {};

const statusEl = document.getElementById("status") || { innerText:"" };
function setStatus(msg){
  if(statusEl) statusEl.innerText = msg;
  console.log("STATUS:",msg);
}

/* -------------------------
   WAIT HELPERS
------------------------- */
const wait = ms => new Promise(r=>setTimeout(r,ms));

async function progressiveMessageTimer(){
  await wait(4000); setStatus("Sunucu hazırlanıyor…");
  await wait(4000); setStatus("Google uyanıyor…");
  await wait(7000); setStatus("Veri büyük, yükleniyor…");
}

/* -------------------------
   SAFE FETCH (NO CANCEL)
------------------------- */
async function fetchData(){
  const timer = progressiveMessageTimer();

  while(true){
    try{
      const res = await fetch(API_URL + "?t=" + Date.now(),{cache:"no-store"});
      if(!res.ok) throw new Error("HTTP "+res.status);

      const data = await res.json();
      return data;
    }
    catch(err){
      console.warn("Fetch retry",err);
      setStatus("Bağlantı kuruluyor… tekrar deneniyor");
      await wait(2500);
    }
  }
}

/* -------------------------
   INDEX BUILD
------------------------- */
function buildIndex(rows){
  PLAYS = {};
  PEOPLE = {};

  rows.forEach(r=>{
    if(!r.oyun || !r.kisi) return;

    if(!PLAYS[r.oyun]) PLAYS[r.oyun]=[];
    PLAYS[r.oyun].push(r);

    if(!PEOPLE[r.kisi]) PEOPLE[r.kisi]=[];
    PEOPLE[r.kisi].push(r);
  });

  window.DT = { RAW:rows, PLAYS, PEOPLE };
}

/* -------------------------
   BOOT
------------------------- */
async function boot(){
  try{
    setStatus("Veriler alınıyor…");

    const json = await fetchData();

    RAW = Array.isArray(json)?json:json.data||[];

    buildIndex(RAW);

    setStatus("Hazır");
    window.dispatchEvent(new Event("dt-ready"));
    console.log("DATA READY",RAW.length);

  }catch(err){
    console.error("UNEXPECTED FAIL",err);
    setStatus("Beklenmeyen hata oluştu");
  }
}

boot();

/* =========================
DT NEW CORE ENGINE v2 (STABLE)
Gerçek CSV parser + stabil veri
========================= */

const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vStIO74mPPf_rhjRa-K8pk4ZCA-lCVAaFGg4ZVnE6DxbEwIGXjpICy8uAIa5hhAmyHq6Psyy-wqHUsL/pub?output=csv";

let RAW = [];
let PLAYS = {};
let PEOPLE = {};

async function boot(){
  try{
    console.log("CORE: starting");

    const res = await fetch(DATA_URL + "&t=" + Date.now());
    const text = await res.text();

    RAW = parseCSV(text);
    buildIndex();

    window.dispatchEvent(new Event("dt-ready"));
    console.log("CORE: ready", RAW.length);

  }catch(err){
    console.error("CORE FAILED", err);
  }
}


/* ======================================
GERÇEK CSV PARSER (Google Sheets uyumlu)
virgül içeren isimleri bozmaz
====================================== */
function parseCSV(text) {

  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {

    const c = text[i];

    if (c === '"') {
      if (insideQuotes && text[i + 1] === '"') {
        value += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (c === ',' && !insideQuotes) {
      row.push(value.trim());
      value = "";
      continue;
    }

    if ((c === '\n' || c === '\r') && !insideQuotes) {
      if (value || row.length) {
        row.push(value.trim());
        rows.push(row);
        row = [];
        value = "";
      }
      continue;
    }

    value += c;
  }

  if (value || row.length) {
    row.push(value.trim());
    rows.push(row);
  }

  rows.shift(); // header sil

  return rows
    .filter(r => r.length >= 4)
    .map(r => ({
      oyun: r[0],
      kategori: r[1],
      gorev: r[2],
      kisi: r[3]
    }));
}


/* ======================================
INDEX OLUŞTURMA
====================================== */
function buildIndex(){

  PLAYS = {};
  PEOPLE = {};

  RAW.forEach(r=>{

    if(!r.oyun || !r.kisi) return;

    if(!PLAYS[r.oyun]) PLAYS[r.oyun]=[];
    PLAYS[r.oyun].push(r);

    if(!PEOPLE[r.kisi]) PEOPLE[r.kisi]=[];
    PEOPLE[r.kisi].push(r);

  });

  window.DT = { RAW, PLAYS, PEOPLE };
}

boot();

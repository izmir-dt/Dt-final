/* =========================
DT CLEAN LOADER (FINAL)
Eksik veri korumalı Google Sheets CSV yükleyici
========================= */

const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vStIO74mPPf_rhjRa-K8pk4ZCA-lCVAaFGg4ZVnE6DxbEwIGXjpICy8uAIa5hhAmyHq6Psyy-wqHUsL/pub?output=csv";
const MAX_TRIES = 6;

let RAW = [];
let PLAYS = {};
let PEOPLE = {};

/* ---------------- CSV PARSER (quoted comma destekli) ---------------- */
function parseCSV(text){
  const lines = text.replace(/\r/g,'').split('\n');
  if(lines.length < 2) return [];

  const out = [];
  for(let i=1;i<lines.length;i++){
    const row = [];
    let cur = '';
    let quote = false;

    for(let c of lines[i]){
      if(c === '"') quote = !quote;
      else if(c === ',' && !quote){ row.push(cur); cur=''; }
      else cur += c;
    }
    row.push(cur);

    if(row.length >= 4){
      out.push({
        oyun: row[0]?.trim(),
        kategori: row[1]?.trim(),
        gorev: row[2]?.trim(),
        kisi: row[3]?.trim()
      });
    }
  }
  return out;
}

/* -------- veri bütünlüğü kontrolü -------- */
function isComplete(rows){
  if(!rows || rows.length < 50) return false; // bariz eksik
  return rows.every(r => r.oyun && r.gorev && r.kisi);
}

/* -------- index oluştur -------- */
function buildIndex(){
  PLAYS = {};
  PEOPLE = {};

  RAW.forEach(r=>{
    if(!PLAYS[r.oyun]) PLAYS[r.oyun]=[];
    PLAYS[r.oyun].push(r);

    if(!PEOPLE[r.kisi]) PEOPLE[r.kisi]=[];
    PEOPLE[r.kisi].push(r);
  });

  window.DT = { RAW, PLAYS, PEOPLE };
}

/* -------- güvenli yükleme -------- */
async function loadWithRetry(){
  for(let i=1;i<=MAX_TRIES;i++){
    try{
      console.log("DT load attempt", i);

      const res = await fetch(DATA_URL+"&t="+Date.now(),{cache:"no-store"});
      const text = await res.text();
      const rows = parseCSV(text);

      console.log("rows:", rows.length);

      if(isComplete(rows)){
        RAW = rows;
        buildIndex();
        window.dispatchEvent(new Event("dt-ready"));
        console.log("DT READY ✔", rows.length);
        return;
      }

      console.warn("Eksik veri geldi, tekrar deneniyor...");
    }
    catch(e){
      console.error("yükleme hatası", e);
    }

    await new Promise(r=>setTimeout(r,700));
  }

  document.body.innerHTML = "<h2 style='font-family:sans-serif;text-align:center;margin-top:40px'>Veriler yüklenemedi.<br>Google Sheets geç cevap veriyor.<br>Sayfayı yenileyin.</h2>";
}

loadWithRetry();

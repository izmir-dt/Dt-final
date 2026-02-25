/* =========================
DT FINAL STABLE LOADER
Only Apps Script JSON endpoint
No fallbacks, no retry loops
========================= */

const API_URL = "https://script.google.com/macros/s/AKfycbxkmxnDtSlfXa008qh_cS2dneTVweaQtMVTIUmOWR1PkAWlHX2EQkd86HwN5X9vZrCp/exec";

let RAW = [];
let PLAYS = {};
let PEOPLE = {};

// ---- small safe fetch (timeout but NO retry spam) ----
async function fetchJSON(url, timeout = 15000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeout);
  try {
    const res = await fetch(url + "?t=" + Date.now(), {
      method: "GET",
      cache: "no-store",
      signal: ctrl.signal
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

// ---- index builder ----
function buildIndex() {
  PLAYS = {};
  PEOPLE = {};

  for (const r of RAW) {
    if (!r || !r.oyun || !r.kisi) continue;

    if (!PLAYS[r.oyun]) PLAYS[r.oyun] = [];
    PLAYS[r.oyun].push(r);

    if (!PEOPLE[r.kisi]) PEOPLE[r.kisi] = [];
    PEOPLE[r.kisi].push(r);
  }

  window.DT = { RAW, PLAYS, PEOPLE };
}

// ---- main boot ----
async function boot() {
  console.log("DT: loading from Apps Script...");
  try {
    const data = await fetchJSON(API_URL);

    if (!Array.isArray(data) || data.length === 0)
      throw new Error("Empty dataset returned");

    RAW = data.map(r => ({
      oyun: String(r.oyun || r.Oyun || "").trim(),
      kategori: String(r.kategori || r.Kategori || "").trim(),
      gorev: String(r.gorev || r.Görev || r.Gorev || "").trim(),
      kisi: String(r.kisi || r.Kişi || r.Kisi || "").trim()
    })).filter(r => r.oyun && r.kisi);

    buildIndex();

    console.log("DT READY:", RAW.length, "records");
    window.dispatchEvent(new Event("dt-ready"));

  } catch (err) {
    console.error("DT LOAD FAILED", err);
    document.body.innerHTML = `
      <div style="font-family:sans-serif;text-align:center;margin-top:80px">
        <h2>Veriler yüklenemedi</h2>
        <p>Sunucu geç cevap veriyor. Lütfen sayfayı yenileyin.</p>
      </div>`;
  }
}

boot();

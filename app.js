/* =========================
DT NEW CORE ENGINE v2 (STABLE)
CSV doğrulamalı veri motoru
========================= */

const DATA_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vStIO74mPPf_rhjRa-K8pk4ZCA-lCVAaFGg4ZVnE6DxbEwIGXjpICy8uAIa5hhAmyHq6Psyy-wqHUsL/pub?output=csv";

let RAW = [];
let PLAYS = {};
let PEOPLE = {};

async function boot(){
try{
console.log("CORE: starting");

const res = await fetch(DATA_URL + "&t=" + Date.now(), {cache:"no-store"});
const text = await res.text();

/* ---- EN KRİTİK DÜZELTME ----
Google bazen CSV yerine HTML döndürür.
Bunu yakalıyoruz.
*/
if(
  !text ||
  text.startsWith("<!DOCTYPE") ||
  text.includes("<html") ||
  !text.includes(",")
){
  throw new Error("GOOGLE CSV GÖNDERMEDİ");
}

RAW = parseCSV(text);
buildIndex();

window.dispatchEvent(new Event("dt-ready"));
console.log("CORE: ready rows =", RAW.length);

}catch(err){
console.error("CORE FAILED:", err);

showFatalWarning();
}
}

/* CSV PARSER */
function parseCSV(csv){
return csv
.split(/\r?\n/)
.map(r=>r.split(","))
.filter(r=>r.length>=4)
.map(r=>({
  oyun: r[0]?.trim(),
  kategori: r[1]?.trim(),
  gorev: r[2]?.trim(),
  kisi: r[3]?.trim()
}));
}

/* INDEX OLUŞTUR */
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

/* HATA MESAJI */
function showFatalWarning(){

const old = document.getElementById("dtFatal");
if(old) old.remove();

const div = document.createElement("div");
div.id="dtFatal";
div.style.cssText=`
position:fixed;
bottom:20px;
left:20px;
background:#b00020;
color:#fff;
padding:14px 18px;
border-radius:14px;
font-weight:700;
box-shadow:0 10px 30px rgba(0,0,0,.25);
z-index:999999;
font-family:system-ui;
`;

div.innerHTML = `
Google Sheets şu anda veri göndermedi.<br>
Sayfayı 2-3 saniye sonra yenile.
`;

document.body.appendChild(div);
}

/* BOOT */
boot();

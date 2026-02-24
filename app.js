/* =========================
DT CLEAN DATA ENGINE — FINAL
Google Sheets CSV ile %100 uyumlu
========================= */

const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vStIO74mPPf_rhjRa-K8pk4ZCA-lCVAaFGg4ZVnE6DxbEwIGXjpICy8uAIa5hhAmyHq6Psyy-wqHUsL/pub?output=csv";

let RAW = [];
let PLAYS = {};
let PEOPLE = {};

async function boot(){
try{
console.log("DT Engine: loading");

const res = await fetch(DATA_URL + "&cache=" + Date.now());
const text = await res.text();

RAW = parseCSV(text);
buildIndex();

window.dispatchEvent(new Event("dt-ready"));

console.log("DT Engine: READY →", RAW.length, "kayıt yüklendi");

}catch(err){
console.error("DT ENGINE FAILED:", err);
}
}

/* ===== GERÇEK CSV PARSER ===== */
function parseCSV(text){

const rows = [];
let row = [];
let cell = "";
let insideQuotes = false;

for(let i=0;i<text.length;i++){
const c = text[i];
const next = text[i+1];

if(c === '"' && insideQuotes && next === '"'){
cell += '"';
i++;
continue;
}

if(c === '"'){
insideQuotes = !insideQuotes;
continue;
}

if(c === ',' && !insideQuotes){
row.push(cell.trim());
cell="";
continue;
}

if((c === '\n' || c === '\r') && !insideQuotes){
if(cell.length || row.length){
row.push(cell.trim());
rows.push(row);
}
row=[];
cell="";
continue;
}

cell+=c;
}

rows.shift();

return rows
.filter(r=>r.length>=4 && r[0] && r[3])
.map(r=>({
oyun:r,
kategori:r,
gorev:r,
kisi:r
}));
}

/* ===== INDEX OLUŞTUR ===== */
function buildIndex(){
PLAYS={};
PEOPLE={};

RAW.forEach(r=>{

if(!PLAYS[r.oyun]) PLAYS[r.oyun]=[];
PLAYS[r.oyun].push(r);

if(!PEOPLE[r.kisi]) PEOPLE[r.kisi]=[];
PEOPLE[r.kisi].push(r);

});

window.DT={RAW,PLAYS,PEOPLE};
}

boot();

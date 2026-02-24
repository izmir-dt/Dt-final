/* =========================
DT NEW CORE ENGINE v1
DOM'dan bağımsız veri motoru
========================= */

const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vStIO74mPPf_rhjRa-K8pk4ZCA-lCVAaFGg4ZVnE6DxbEwIGXjpICy8uAIa5hhAmyHq6Psyy-wqHUsL/pub?output=csv";

let RAW = [];
let PLAYS = {};
let PEOPLE = {};

async function boot(){
try{
console.log("CORE: starting");

```
const res = await fetch(DATA_URL + "&t=" + Date.now());
const text = await res.text();

RAW = parseCSV(text);
buildIndex();

window.dispatchEvent(new Event("dt-ready"));
console.log("CORE: ready", RAW.length);
```

}catch(err){
console.error("CORE FAILED", err);
}
}

function parseCSV(csv){
const rows = csv.split("\n").map(r=>r.split(","));
const header = rows.shift();

return rows
.filter(r=>r.length>=4)
.map(r=>({
oyun: r[0]?.trim(),
kategori: r[1]?.trim(),
gorev: r[2]?.trim(),
kisi: r[3]?.trim()
}));
}

function buildIndex(){
PLAYS = {};
PEOPLE = {};

RAW.forEach(r=>{
if(!PLAYS[r.oyun]) PLAYS[r.oyun]=[];
PLAYS[r.oyun].push(r);

```
if(!PEOPLE[r.kisi]) PEOPLE[r.kisi]=[];
PEOPLE[r.kisi].push(r);
```

});

window.DT = { RAW, PLAYS, PEOPLE };
}

boot();

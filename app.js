
const DATA_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vStIO74mPPf_rhjRa-K8pk4ZCA-lCVAaFGg4ZVnE6DxbEwIGXjpICy8uAIa5hhAmyHq6Psyy-wqHUsL/pub?gid=1233566992&single=true&output=csv";

function parseCSV(text){
  const rows=[];
  let cur='',row=[],q=false;
  for(let i=0;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(c=='"' && q && n=='"'){cur+='"';i++;continue;}
    if(c=='"'){q=!q;continue;}
    if(c==',' && !q){row.push(cur);cur='';continue;}
    if((c=='\n'||c=='\r') && !q){
      if(cur||row.length){row.push(cur);rows.push(row);}
      cur='';row=[];continue;
    }
    cur+=c;
  }
  return rows.slice(1).map(r=>({
    oyun:r[0]?.trim(),
    kategori:r[1]?.trim(),
    gorev:r[2]?.trim(),
    kisi:r[3]?.trim()
  })).filter(x=>x.oyun&&x.kisi);
}

async function boot(){
  const status=document.getElementById('status');
  try{
    const res=await fetch(DATA_URL+"#"+Date.now(),{cache:"no-store"});
    const text=await res.text();
    const data=parseCSV(text);
    status.textContent="Kayıt: "+data.length;
    render(data);
  }catch(e){
    status.textContent="Veri alınamadı";
    console.error(e);
  }
}

function render(data){
  const map={};
  data.forEach(r=>{
    if(!map[r.oyun]) map[r.oyun]=[];
    map[r.oyun].push(r);
  });
  const box=document.getElementById('plays');
  box.innerHTML="";
  Object.keys(map).sort().forEach(play=>{
    const div=document.createElement('div');
    div.className="card";
    div.innerHTML="<h3>"+play+"</h3><div class='small'>"+map[play].length+" kişi</div>";
    box.appendChild(div);
  });
}

boot();

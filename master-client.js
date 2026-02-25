
// MASTER client cache layer
(async function(){
const MASTER_URL="https://script.google.com/macros/s/AKfycbxkjToAu7jHkNabphwLT8B1PmjsBc8-cXohz8ZUUwim-11Xfg6n-d8KYbaZfN9tej0b/exec?action=master";
let cache=null;

async function loadMaster(){
 if(cache) return cache;
 const r=await window.__realFetch(MASTER_URL);
 cache=await r.json(); if(window.__resolveMaster)window.__resolveMaster();
 return cache;
}

window.__realFetch=window.fetch.bind(window);
window.fetch=async function(url,opt){
 try{
   if(typeof url==="string" && url.includes("/exec")){
     const data=await loadMaster();
     if(url.includes("BİLDİRİMLER"))
       return new Response(JSON.stringify({ok:true,rows:data.data.bildirim}),{headers:{'Content-Type':'application/json'}});
     if(url.includes("FİGÜRAN"))
       return new Response(JSON.stringify({ok:true,rows:data.data.figuran}),{headers:{'Content-Type':'application/json'}});
     if(url.includes("BÜTÜN"))
       return new Response(JSON.stringify({ok:true,rows:data.data.butunOyunlar}),{headers:{'Content-Type':'application/json'}});
   }
 }catch(e){}
 return window.__realFetch(url,opt);
};
})();
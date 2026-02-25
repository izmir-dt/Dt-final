
// bootstrap barrier
(function(){
let ready=false;
window.__MASTER_READY=new Promise(res=>window.__resolveMaster=res);

const origAdd=document.addEventListener.bind(document);
document.addEventListener=function(type,cb,opt){
 if(type==="DOMContentLoaded"){
   origAdd(type,async function(e){
     await window.__MASTER_READY;
     cb(e);
   },opt);
 }else origAdd(type,cb,opt);
};
})();
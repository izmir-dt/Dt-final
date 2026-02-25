
// SSOT DATA STORE
window.IDT_STORE = {
  raw:null,
  ready:false,
  listeners:[],
  set(data){
    this.raw=data;
    this.ready=true;
    this.listeners.forEach(f=>f(data));
  },
  onReady(fn){
    if(this.ready) fn(this.raw);
    else this.listeners.push(fn);
  }
};

(async function(){
  const URL="https://script.google.com/macros/s/AKfycbxkjToAu7jHkNabphwLT8B1PmjsBc8-cXohz8ZUUwim-11Xfg6n-d8KYbaZfN9tej0b/exec?action=master";
  try{
    const r=await fetch(URL);
    const j=await r.json();
    IDT_STORE.set(j);
  }catch(e){
    console.error("DATA LOAD FAIL",e);
  }
})();

// prevent modules reading before ready
const _addEvent=document.addEventListener.bind(document);
document.addEventListener=function(t,cb,opt){
  if(t==="DOMContentLoaded"){
    _addEvent(t,()=>IDT_STORE.onReady(cb),opt);
  } else _addEvent(t,cb,opt);
};

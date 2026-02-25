
// Module Sleep System
(function(){
let active=true;
function sleep(){active=false}
function wake(){active=true}

document.addEventListener("visibilitychange",()=>{
  if(document.hidden)sleep(); else wake();
});

// patch timers
const _setInterval=window.setInterval;
window.setInterval=function(fn,t){
  return _setInterval(()=>{ if(active) fn(); },t);
};

const _raf=window.requestAnimationFrame;
window.requestAnimationFrame=function(fn){
  return _raf((t)=>{ if(active) fn(t); });
};

// nav click wake only
document.addEventListener("click",e=>{
  const a=e.target.closest("a,button");
  if(!a)return;
  wake();
  setTimeout(sleep,1500);
});
})();
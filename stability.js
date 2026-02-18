
/* IDT stability gate */
(function(){
 if(window.__idt_started) return;
 window.__idt_started=true;

 const origAdd=EventTarget.prototype.addEventListener;
 EventTarget.prototype.addEventListener=function(type,fn,opt){
   if(type==="hashchange"){
     if(this.__idt_hash_bound) return;
     this.__idt_hash_bound=true;
   }
   return origAdd.call(this,type,fn,opt);
 };

 const origFetch=window.fetch;
 const inflight=new Map();
 window.fetch=function(url,init){
   const key=String(url);
   if(inflight.has(key)) return inflight.get(key);
   const p=origFetch(url,init).finally(()=>inflight.delete(key));
   inflight.set(key,p);
   return p;
 };
})();

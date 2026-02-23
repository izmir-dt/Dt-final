/* IDT stability gate - Optimize Edilmiş Versiyon */
(function(){
 if(window.__idt_started) return;
 window.__idt_started = true;

 const origAdd = EventTarget.prototype.addEventListener;
 EventTarget.prototype.addEventListener = function(type, fn, opt) {
   if(type === "hashchange" && this === window){
     if(this.__idt_hash_bound) return;
     this.__idt_hash_bound = true;
   }
   return origAdd.call(this, type, fn, opt);
 };

 const origFetch = window.fetch;
 const inflight = new Map();
 window.fetch = function(url, init){
   // Yalnızca GET (Veri çekme) isteklerini yakala, POST (Bildirim) isteklerine dokunma.
   const isGet = !init || !init.method || init.method.toUpperCase() === 'GET';
   const key = String(url);
   
   if(isGet && inflight.has(key)) {
       return inflight.get(key).then(r => r.clone());
   }
   
   const p = origFetch(url, init).then(res => {
       if(isGet) inflight.delete(key);
       return res;
   }).catch(err => {
       if(isGet) inflight.delete(key);
       throw err;
   });

   if(isGet) inflight.set(key, p);
   return p;
 };
})();

/* IDT ULTRA STABİL VERİ KATMANI - FİNAL */
(function(){
  if(window.__idt_stability_inited) return;
  window.__idt_stability_inited = true;

  console.log("🛡️ Stability module active");

  const originalFetch = window.fetch;
  const activeFetches = new Map();
  const CACHE_TTL = 5 * 60 * 1000;

  window.fetch = function(url, options) {
    const isGet = !options || !options.method || options.method.toUpperCase() === 'GET';
    const key = String(url);
    
    const isDataUrl = url.includes('script.google.com') || 
                      url.includes('docs.google.com') ||
                      url.includes('googleapis.com') ||
                      (window.CONFIG && (
                        (CONFIG.API_BASE && url.includes(CONFIG.API_BASE)) ||
                        (CONFIG.SPREADSHEET_ID && url.includes(CONFIG.SPREADSHEET_ID))
                      ));
    
    if(isGet && isDataUrl) {
      const cached = activeFetches.get(key);
      if(cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        console.log('📦 Cache hit:', url.substring(0, 60));
        return cached.promise.then(r => r.clone());
      }
      
      console.log('🌐 Fetching:', url.substring(0, 60));
      
      const promise = originalFetch(url, options).then(res => {
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.clone();
      }).catch(err => {
        console.error('❌ Fetch error:', url.substring(0, 60), err);
        throw err;
      });
      
      activeFetches.set(key, {
        promise,
        timestamp: Date.now()
      });
      
      promise.finally(() => {
        setTimeout(() => activeFetches.delete(key), CACHE_TTL);
      });
      
      return promise.then(r => r.clone());
    }
    
    return originalFetch(url, options);
  };

  let lastDataHash = '';
  
  function checkDataConsistency() {
    if(!window.rawRows || !Array.isArray(window.rawRows)) return;
    if(window.rawRows.length === 0) return;
    
    const currentHash = JSON.stringify(window.rawRows.map(r => 
      `${r.play || ''}|${r.person || ''}|${r.role || ''}|${r.category || ''}`
    ).sort().join('||'));
    
    if(lastDataHash && lastDataHash !== currentHash) {
      console.log('⚠️ Veri değişti, UI yenileniyor...');
      if(typeof window.processData === 'function') {
        window.processData(window.rawRows);
      }
    }
    
    lastDataHash = currentHash;
  }
  
  setInterval(checkDataConsistency, 3000);
  
  window.__idt_stability = {
    check: checkDataConsistency,
    cacheSize: () => activeFetches.size
  };
  
})();

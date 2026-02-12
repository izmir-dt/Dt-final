/**
 * IDT v8.0 Overlay – Performance helpers (non-invasive)
 * - Debounce helper
 * - Batch DOM append helper
 * - Lazy init hooks for charts/panels (optional)
 *
 * IMPORTANT: This file does NOT touch Google Sheets fetching logic or notification endpoints.
 * It only provides helpers and light event wiring when safe.
 */

(function () {
  'use strict';

  // ---------- helpers ----------
  function debounce(fn, wait) {
    let t = null;
    return function debounced(...args) {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  function normalizeTR(s) {
    // Case-insensitive search with TR-friendly normalization
    return String(s ?? '')
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/İ/g, 'I')
      .replace(/ı/g, 'i')
      .toLowerCase();
  }

  function batchAppend(parent, nodes) {
    const frag = document.createDocumentFragment();
    for (const n of nodes) frag.appendChild(n);
    parent.appendChild(frag);
  }

  // Expose helpers for app.js if it wants them (non-breaking)
  window.__IDT = window.__IDT || {};
  window.__IDT.debounce = window.__IDT.debounce || debounce;
  window.__IDT.normalizeTR = window.__IDT.normalizeTR || normalizeTR;
  window.__IDT.batchAppend = window.__IDT.batchAppend || batchAppend;

  // ---------- safe wiring (optional) ----------
  // If there are inputs with data-idt-debounce, debounce their input events.
  function wireDebouncedInputs() {
    const inputs = document.querySelectorAll('input[data-idt-debounce="1"], input[data-idt-search="1"]');
    inputs.forEach((inp) => {
      if (inp.__idtWired) return;
      inp.__idtWired = true;

      const handlerName = inp.getAttribute('data-idt-handler');
      const wait = Number(inp.getAttribute('data-idt-wait') || 300);

      // If app.js provides a global handler function, call it. Otherwise, do nothing.
      const handler = handlerName && typeof window[handlerName] === 'function' ? window[handlerName] : null;
      if (!handler) return;

      const debounced = debounce(() => handler(inp.value), wait);
      inp.addEventListener('input', debounced, { passive: true });
    });
  }

  // Lazy init: if app.js exposes window.renderCharts or similar, call when chart view becomes visible
  function wireLazyCharts() {
    const maybeFns = ['renderCharts', 'renderGrafikler', 'drawCharts'];
    const fn = maybeFns.map((k) => window[k]).find((f) => typeof f === 'function');
    if (!fn) return;

    // Observe visibility of a common chart container id if exists
    const chartRoot = document.getElementById('view-grafikler') || document.getElementById('chartsRoot') || null;
    if (!chartRoot) return;

    let did = false;
    const io = new IntersectionObserver((entries) => {
      const vis = entries.some((e) => e.isIntersecting);
      if (vis && !did) {
        did = true;
        try { fn(); } catch (_) {}
        io.disconnect();
      }
    }, { root: null, threshold: 0.05 });

    io.observe(chartRoot);
  }

  function init() {
    wireDebouncedInputs();
    wireLazyCharts();
  }

  // run after DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Also re-check on hash changes (single-page navigation)
  window.addEventListener('hashchange', () => {
    wireDebouncedInputs();
    wireLazyCharts();
  }, { passive: true });

})();

/* === Smart Queue: chunked render (donma azaltır) === */
window.__IDT = window.__IDT || {};
window.__IDT.renderInChunks = function(container, items, renderFn) {
  let index = 0;
  const chunkSize = 50;
  function doBatch(){
    const end = Math.min(index + chunkSize, items.length);
    const fragment = document.createDocumentFragment();
    for(let i=index;i<end;i++){
      const el = renderFn(items[i]);
      if(el) fragment.appendChild(el);
    }
    container.appendChild(fragment);
    index = end;
    if(index < items.length) requestAnimationFrame(doBatch);
  }
  doBatch();
};

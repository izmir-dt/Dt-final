/* UI-only patch: QuickStart buttons + prevent word-splitting issues.
   Altın kural: veri çekme / bildirim / global state yok. */
(() => {
  const goTo = (key) => {
    const btn = document.querySelector(`.topNav2Btn[data-go="${key}"]`);
    if (btn) btn.click();
  };

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-qs-go]");
    if (!t) return;
    e.preventDefault();
    const key = t.getAttribute("data-qs-go");
    goTo(key);
    // scroll to top of content after switch
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, { passive: false });
})();

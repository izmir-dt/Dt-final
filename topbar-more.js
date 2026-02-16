(() => {
  const TOPBAR_SEL = '.idt-topbar2';
  const BTN_SEL = '.topNav2Btn';

  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function wrapEmojiIcons(btn) {
    if (!btn || btn.dataset.idtIconWrapped === '1') return;
    const raw = (btn.textContent || '').trim();
    if (!raw) return;

    // Match: first char is non-letter (emoji/symbol) followed by spaces then rest
    const m = raw.match(/^([^\p{L}\p{N}])\s*(.+)$/u);
    if (!m) {
      btn.dataset.idtIconWrapped = '1';
      return;
    }

    const icon = m[1];
    const label = m[2];

    // Rebuild button contents
    btn.textContent = '';
    const iconSpan = document.createElement('span');
    iconSpan.className = 'idt-ico';
    iconSpan.textContent = icon;

    const textSpan = document.createElement('span');
    textSpan.className = 'idt-label';
    textSpan.textContent = label;

    btn.append(iconSpan, textSpan);
    btn.dataset.idtIconWrapped = '1';
  }

  function ensureMoreButton(topbar) {
    let more = qs('#idtMoreBtn', topbar);
    let menu = qs('#idtMoreMenu', topbar);

    if (!more) {
      more = document.createElement('button');
      more.id = 'idtMoreBtn';
      more.className = 'topNav2Btn idt-more-btn';
      more.type = 'button';
      more.setAttribute('aria-haspopup', 'menu');
      more.setAttribute('aria-expanded', 'false');
      more.textContent = '⋯  DAHA FAZLA';
      topbar.appendChild(more);
      wrapEmojiIcons(more);
    }

    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'idtMoreMenu';
      menu.className = 'idt-more-menu';
      menu.setAttribute('role', 'menu');
      menu.hidden = true;
      topbar.appendChild(menu);
    }

    const close = () => {
      menu.hidden = true;
      more.setAttribute('aria-expanded', 'false');
    };

    const open = () => {
      menu.hidden = false;
      more.setAttribute('aria-expanded', 'true');
      // Place menu under the more button
      const r = more.getBoundingClientRect();
      const topbarR = topbar.getBoundingClientRect();
      menu.style.left = `${Math.max(12, r.left - topbarR.left)}px`;
      menu.style.top = `${r.bottom - topbarR.top + 8}px`;
    };

    more.onclick = (e) => {
      e.stopPropagation();
      menu.hidden ? open() : close();
    };

    document.addEventListener('click', close);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    return { more, menu };
  }

  function moveOverflowToMenu(topbar) {
    const { more, menu } = ensureMoreButton(topbar);

    // Restore any previous moved items back before measuring
    qsa('.idt-moved', menu).forEach((btn) => {
      btn.classList.remove('idt-moved');
      btn.removeAttribute('role');
      topbar.insertBefore(btn, more);
    });
    menu.innerHTML = '';

    const buttons = qsa(BTN_SEL, topbar).filter((b) => b !== more);
    buttons.forEach(wrapEmojiIcons);

    // Temporarily ensure more is visible while measuring
    more.style.display = '';

    // If everything fits, hide "more"
    const fitsNow = () => topbar.scrollWidth <= topbar.clientWidth + 1;
    if (fitsNow()) {
      more.style.display = 'none';
      menu.hidden = true;
      more.setAttribute('aria-expanded', 'false');
      return;
    }

    // Otherwise keep more visible and move items from the end until it fits
    let i = buttons.length - 1;
    while (i >= 0 && !fitsNow()) {
      const btn = buttons[i];
      // Never move the currently active tab if it has aria-current or .active
      const isActive = btn.getAttribute('aria-current') === 'page' || btn.classList.contains('active');
      if (!isActive) {
        btn.classList.add('idt-moved');
        btn.setAttribute('role', 'menuitem');
        menu.prepend(btn);
      }
      i--;
    }

    // If nothing moved (all active?), still keep more shown
    more.style.display = '';

    // Clicking a menu item should close the menu
    qsa('.idt-moved', menu).forEach((btn) => {
      btn.addEventListener('click', () => {
        menu.hidden = true;
        more.setAttribute('aria-expanded', 'false');
      }, { once: true });
    });
  }

  function init() {
    const topbar = qs(TOPBAR_SEL);
    if (!topbar) return;

    // Make sure topbar is flex and single-line; CSS also reinforces this.
    topbar.classList.add('idt-topbar-ready');

    // Defer measurement to allow fonts/layout
    const run = () => moveOverflowToMenu(topbar);
    run();

    // Recalculate on resize / font load
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(run, 120);
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => setTimeout(run, 50)).catch(() => {});
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
// topbar-more.js
// Sadece UI davranışı: Daha Fazla açılırını aşağı doğru kontrol eder.
// Güvenli: veri çekme / global state ile oynamaz.

(function(){
  document.addEventListener('click', (ev) => {
    const summary = ev.target.closest('.topNav2More > summary, .topNav2More summary *');
    if (summary) {
      // toggle open durumu, native details element ile uyumlu
      const details = summary.closest('.topNav2More');
      if (!details) return;
      // allow native toggle to happen then force menu to be positioned
      setTimeout(()=> {
        if (details.hasAttribute('open')) {
          details.classList.add('open');
          // ensure menu stays below topbar and aligns right
          const menu = details.querySelector('.moreMenu');
          if (menu) {
            menu.style.top = (details.getBoundingClientRect().height + 8) + 'px';
          }
        } else {
          details.classList.remove('open');
        }
      }, 20);
      ev.preventDefault();
    }
  }, {passive:false});
})();

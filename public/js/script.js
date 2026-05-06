/* ════════════════════════════════════════════
   TRAVELNEST — HOME PAGE SCRIPTS
   home.js
════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll('.property-card').forEach((card) => {
    revealObserver.observe(card);
  });

  /* ── SEARCH POPUP (mobile + click trigger) ── */
  const overlay   = document.getElementById('searchOverlay');
  const popup     = document.getElementById('searchPopup');
  const trigger   = document.getElementById('searchTrigger');
  const closeBtn  = document.getElementById('popupClose');
  const popupWhere = document.getElementById('popupWhere');

  function openPopup() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (popupWhere) setTimeout(() => popupWhere.focus(), 100);
  }

  function closePopup() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (trigger)  trigger.addEventListener('click', openPopup);
  if (closeBtn) closeBtn.addEventListener('click', closePopup);

  // Close on backdrop click
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePopup();
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });

  /* ── SAVE / WISHLIST ── */
  function toggleSave(e, btn) {
    e.preventDefault();
    e.stopPropagation();
    const saved = btn.classList.toggle('saved');
    btn.innerHTML = saved
      ? '<i class="fa-solid fa-heart"></i>'
      : '<i class="fa-regular fa-heart"></i>';
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => (btn.style.transform = ''), 250);
  }
  // expose globally for inline onclick
  window.toggleSave = toggleSave;

  /* ── TAX TOGGLE ── */
  const taxSwitch = document.getElementById('switchCheckDefault');
  if (taxSwitch) {
    taxSwitch.addEventListener('change', function () {
      document.querySelectorAll('.price-tax').forEach((el) => {
        el.style.display = this.checked ? 'block' : 'none';
      });
    });
  }

  /* ── FILTER PILLS ── */
  document.querySelectorAll('.filter-pill').forEach((pill) => {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.filter-pill').forEach((p) =>
        p.classList.remove('active')
      );
      this.classList.add('active');
    });
  });

  /* ── SORT (client-side reorder) ── */
  const sortSelect = document.getElementById('sortSelect');
  const cardGrid   = document.getElementById('cardGrid');

  if (sortSelect && cardGrid) {
    sortSelect.addEventListener('change', function () {
      const cards = Array.from(cardGrid.querySelectorAll('.property-card'));
      cards.sort((a, b) => {
        const pa = parseInt(a.dataset.price) || 0;
        const pb = parseInt(b.dataset.price) || 0;
        if (this.value === 'price-low')  return pa - pb;
        if (this.value === 'price-high') return pb - pa;
        return 0;
      });
      cards.forEach((c) => {
        c.classList.remove('revealed');
        cardGrid.appendChild(c);
      });
      setTimeout(() => cards.forEach((c) => revealObserver.observe(c)), 50);
    });
  }

  /* ── GRID / LIST VIEW TOGGLE ── */
  const gridBtn = document.getElementById('gridViewBtn');
  const listBtn = document.getElementById('listViewBtn');

  if (gridBtn && listBtn && cardGrid) {
    gridBtn.addEventListener('click', () => {
      cardGrid.classList.remove('list-view');
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
    });
    listBtn.addEventListener('click', () => {
      cardGrid.classList.add('list-view');
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
    });
  }

  /* ── DESKTOP NAVBAR SEARCH ── */
  const desktopSearchBtn = document.querySelector('.search-btn');
  const searchWhereInput = document.getElementById('search-where');

  if (desktopSearchBtn && searchWhereInput) {
    desktopSearchBtn.addEventListener('click', () => {
      const where = searchWhereInput.value.trim();
      if (where) {
        window.location.href = `/search?q=${encodeURIComponent(where)}`;
      }
    });
    // Also submit on Enter in any segment input
    document.querySelectorAll('.search-seg input').forEach((inp) => {
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const where = searchWhereInput.value.trim();
          if (where) window.location.href = `/search?q=${encodeURIComponent(where)}`;
        }
      });
    });
  }

  /* ── POPUP SEARCH SUBMIT ── */
  const popupSearchBtn = document.getElementById('popupSearchBtn');
  if (popupSearchBtn && popupWhere) {
    popupSearchBtn.addEventListener('click', () => {
      const q = popupWhere.value.trim();
      if (q) {
        closePopup();
        window.location.href = `/search?q=${encodeURIComponent(q)}`;
      }
    });
    popupWhere.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') popupSearchBtn.click();
    });
  }

})();
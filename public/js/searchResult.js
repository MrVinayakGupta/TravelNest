/* ════════════════════════════════════════════
   TRAVELNEST — SEARCH RESULTS PAGE SCRIPTS
   searchResults.js
════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── SEARCH POPUP (mobile trigger) ── */
  var overlay    = document.getElementById('searchOverlay');
  var trigger    = document.getElementById('searchTrigger');
  var closeBtn   = document.getElementById('popupClose');
  var popupWhere = document.getElementById('popupWhere');
  var popupBtn   = document.getElementById('popupSearchBtn');

  function openPopup() {
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (popupWhere) setTimeout(function () { popupWhere.focus(); }, 100);
  }
  function closePopup() {
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (trigger)  trigger.addEventListener('click', openPopup);
  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });

  /* Popup search submit */
  if (popupBtn && popupWhere) {
    popupBtn.addEventListener('click', function () {
      var q = popupWhere.value.trim();
      if (q) { closePopup(); window.location.href = '/api/search?q=' + encodeURIComponent(q); }
    });
    popupWhere.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') popupBtn.click();
    });
  }

  /* ── SCROLL REVEAL ── */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.property-card').forEach(function (c) {
    revealIO.observe(c);
  });

  /* ── SAVE / WISHLIST ── */
  function toggleSave(e, btn) {
    e.preventDefault();
    e.stopPropagation();
    var saved = btn.classList.toggle('saved');
    btn.innerHTML = saved
      ? '<i class="fa-solid fa-heart"></i>'
      : '<i class="fa-regular fa-heart"></i>';
    btn.style.transform = 'scale(1.35)';
    setTimeout(function () { btn.style.transform = ''; }, 220);
  }
  window.toggleSave = toggleSave;

  /* ── SORT (client-side) ── */
  var sortSelect = document.getElementById('sortSelect');
  var grid       = document.getElementById('searchGrid');

  if (sortSelect && grid) {
    sortSelect.addEventListener('change', function () {
      var cards = Array.from(grid.querySelectorAll('.property-card'));
      cards.sort(function (a, b) {
        var pa = parseInt(a.dataset.price) || 0;
        var pb = parseInt(b.dataset.price) || 0;
        if (sortSelect.value === 'price-low')  return pa - pb;
        if (sortSelect.value === 'price-high') return pb - pa;
        return 0;
      });
      cards.forEach(function (c) {
        c.classList.remove('revealed');
        grid.appendChild(c);
      });
      setTimeout(function () {
        cards.forEach(function (c) { revealIO.observe(c); });
      }, 50);
    });
  }

  /* ── FILTER PILLS ── */
  document.querySelectorAll('.fpill').forEach(function (pill) {
    pill.addEventListener('click', function () {
      document.querySelectorAll('.fpill').forEach(function (p) {
        p.classList.remove('active');
      });
      pill.classList.add('active');
      var f = pill.dataset.filter;
      if (sortSelect) {
        if (f === 'low')  { sortSelect.value = 'price-low';  sortSelect.dispatchEvent(new Event('change')); }
        if (f === 'high') { sortSelect.value = 'price-high'; sortSelect.dispatchEvent(new Event('change')); }
        if (f === 'all')  { sortSelect.value = '';           sortSelect.dispatchEvent(new Event('change')); }
      }
    });
  });

  /* ── GRID / LIST TOGGLE ── */
  var gridBtn = document.getElementById('gridViewBtn');
  var listBtn = document.getElementById('listViewBtn');
  if (gridBtn && listBtn && grid) {
    gridBtn.addEventListener('click', function () {
      grid.classList.remove('list-view');
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
    });
    listBtn.addEventListener('click', function () {
      grid.classList.add('list-view');
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
    });
  }

})();
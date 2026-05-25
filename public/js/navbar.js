/* ════════════════════════════════════════════
   TRAVELNEST — SHARED NAVBAR & SEARCH SCRIPTS
   navbar.js  (included in boilerplate.ejs)
════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── SEARCH POPUP ── */
  var overlay    = document.getElementById('searchOverlay');
  var trigger    = document.getElementById('searchTrigger');
  var closeBtn   = document.getElementById('popupClose');
  var popupWhere = document.getElementById('popupWhere');
  var popupBtn   = document.getElementById('popupSearchBtn');

  function openPopup() {
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (popupWhere) setTimeout(function () { popupWhere.focus(); }, 100);
  }

  function closePopup() {
    if (!overlay) return;
    overlay.classList.remove('open');
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

  /* ── DESKTOP SEARCH BUTTON ── */
  var desktopBtn = document.getElementById('navDesktopSearchBtn');
  var whereInput = document.getElementById('navSearchWhere');

  function doSearch() {
    var q = whereInput ? whereInput.value.trim() : '';
    if (q) window.location.href = '/api/search?q=' + encodeURIComponent(q);
  }

  if (desktopBtn) desktopBtn.addEventListener('click', doSearch);
  if (whereInput) {
    whereInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') doSearch();
    });
  }

  /* ── POPUP SEARCH BUTTON ── */
  if (popupBtn && popupWhere) {
    popupBtn.addEventListener('click', function () {
      var q = popupWhere.value.trim();
      if (q) {
        closePopup();
        window.location.href = '/api/search?q=' + encodeURIComponent(q);
      }
    });
    popupWhere.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') popupBtn.click();
    });
  }

})();
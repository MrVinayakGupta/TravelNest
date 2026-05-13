/* ════════════════════════════════════════════
   TRAVELNEST — LOGIN PAGE SCRIPTS
   login.js
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

  /* Desktop search submit */
  var desktopBtn   = document.getElementById('desktopSearchBtn');
  var desktopWhere = document.getElementById('searchWhere');
  if (desktopBtn && desktopWhere) {
    desktopBtn.addEventListener('click', function () {
      var q = desktopWhere.value.trim();
      if (q) window.location.href = '/api/search?q=' + encodeURIComponent(q);
    });
    desktopWhere.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var q = desktopWhere.value.trim();
        if (q) window.location.href = '/api/search?q=' + encodeURIComponent(q);
      }
    });
  }

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

  /* ── FORM VALIDATION (original behaviour) ── */
  var form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  }

})();
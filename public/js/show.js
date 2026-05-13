/* ════════════════════════════════════════════
   TRAVELNEST — SHOW PAGE SCRIPTS
   show.js
════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── HERO ENTRY ANIMATION ── */
  window.addEventListener('load', function () {
    var hero = document.getElementById('mainHero');
    if (hero) hero.classList.add('active');
  });

  /* ── SCROLL REVEAL (review cards + related cards) ── */
  var revealIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.review-card, .rel-card').forEach(function (el) {
    revealIO.observe(el);
  });

  /* ── STAR RATING ── */
  var stars      = document.querySelectorAll('.star-btn');
  var starInput  = document.getElementById('starInput');
  var currentRating = 1;

  function highlightStars(val) {
    stars.forEach(function (s) {
      s.classList.toggle('active', +s.dataset.val <= val);
    });
  }
  highlightStars(1);

  stars.forEach(function (btn) {
    btn.addEventListener('mouseenter', function () { highlightStars(+btn.dataset.val); });
    btn.addEventListener('mouseleave', function () { highlightStars(currentRating); });
    btn.addEventListener('click', function () {
      currentRating = +btn.dataset.val;
      if (starInput) starInput.value = currentRating;
      highlightStars(currentRating);
    });
  });

  /* ── HERO SAVE / WISHLIST ── */
  var heroSaved = false;

  function toggleHeroSave() {
    heroSaved = !heroSaved;
    var btn  = document.getElementById('heroSaveBtn');
    var icon = document.getElementById('saveIconBtn');
    if (btn) {
      btn.classList.toggle('saved', heroSaved);
      btn.innerHTML = heroSaved
        ? '<i class="fa-solid fa-heart"></i>'
        : '<i class="fa-regular fa-heart"></i>';
    }
    if (icon) {
      icon.className = heroSaved ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    }
    /* sync mobile bar save too */
    var mobileIcon = document.getElementById('mobileSaveIcon');
    if (mobileIcon) {
      mobileIcon.className = heroSaved ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
      mobileIcon.style.color = heroSaved ? '#e85c5c' : '';
    }
  }
  window.toggleHeroSave = toggleHeroSave; /* expose for inline onclick */

  /* ── RELATED CARD WISHLIST ── */
  function toggleWish(e, btn) {
    e.preventDefault();
    e.stopPropagation();
    var saved = btn.classList.toggle('saved');
    btn.innerHTML = saved
      ? '<i class="fa-solid fa-heart"></i>'
      : '<i class="fa-regular fa-heart"></i>';
    btn.style.transform = 'scale(1.35)';
    setTimeout(function () { btn.style.transform = ''; }, 220);
  }
  window.toggleWish = toggleWish;

  /* ── MOBILE BOOK BAR — scroll-to-review ── */
  var mobileBookBtn = document.getElementById('mobileBookBtn');
  if (mobileBookBtn) {
    mobileBookBtn.addEventListener('click', function () {
      var form = document.getElementById('reviewForm');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* ── SEARCH POPUP ── */
  var overlay     = document.getElementById('searchOverlay');
  var trigger     = document.getElementById('searchTrigger');
  var closeBtn    = document.getElementById('popupClose');
  var popupWhere  = document.getElementById('popupWhere');
  var popupBtn    = document.getElementById('popupSearchBtn');

  function openPopup() {
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (popupWhere) setTimeout(function () { popupWhere.focus(); }, 100);
  }
  function closePopup() {
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (trigger) trigger.addEventListener('click', openPopup);
  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePopup();
  });

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

  /* ── FORM VALIDATION ── */
  document.querySelectorAll('.needs-validation').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

})();
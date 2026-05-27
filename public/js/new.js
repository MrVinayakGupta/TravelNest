/* ════════════════════════════════════════════
   TRAVELNEST — NEW LISTING PAGE SCRIPTS
   new.js
════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── IMAGE PREVIEW + DRAG & DROP ── */
  var uploadZone   = document.getElementById('uploadZone');
  var fileInput    = document.getElementById('image');
  var previewBox   = document.getElementById('imagePreviewBox');
  var previewImg   = document.getElementById('imagePreview');
  var previewBadge = document.getElementById('previewBadge');
  var removeBtn    = document.getElementById('previewRemove');
  var fileChip     = document.getElementById('fileChip');
  var chipName     = document.getElementById('chipName');

  function showPreview(file) {
    if (!file || !file.type.startsWith('image/')) return;
    var reader = new FileReader();
    reader.onload = function () {
      previewImg.src = reader.result;
      previewBox.classList.add('visible');
      if (fileChip)  { fileChip.classList.add('visible'); }
      if (chipName)  { chipName.textContent = file.name; }
      if (previewBadge) {
        previewBadge.innerHTML =
          '<i class="fa-solid fa-check" style="font-size:9px"></i> Ready to upload';
      }
    };
    reader.readAsDataURL(file);
  }

  function clearPreview() {
    if (previewImg)  previewImg.src = '#';
    if (previewBox)  previewBox.classList.remove('visible');
    if (fileChip)    fileChip.classList.remove('visible');
    if (fileInput)   fileInput.value = '';
  }

  /* File input change */
  window.runPreview = function (event) {
    var file = event.target.files[0];
    if (file) showPreview(file);
    else clearPreview();
  };

  /* Remove preview */
  if (removeBtn) {
    removeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      clearPreview();
    });
  }

  /* Drag & drop on upload zone */
  if (uploadZone) {
    uploadZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      uploadZone.classList.add('drag-over');
    });
    uploadZone.addEventListener('dragleave', function () {
      uploadZone.classList.remove('drag-over');
    });
    uploadZone.addEventListener('drop', function (e) {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      var file = e.dataTransfer.files[0];
      if (file && fileInput) {
        /* assign to the real input via DataTransfer so form submits it */
        var dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        showPreview(file);
      }
    });
  }

  /* ── FORM VALIDATION (original) ── */
  var forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(function (form) {
    form.addEventListener('submit', function (event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });

})();
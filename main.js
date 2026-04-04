/* main.js — Iconic Prints Upload Flow */
'use strict';

/* ──────────────────────────────────────────────────────────
   CONFIGURATION
   Replace UPLOAD_ENDPOINT with your deployed Google Apps Script URL.
────────────────────────────────────────────────────────── */
const CONFIG = {
  UPLOAD_ENDPOINT: 'YOUR_GOOGLE_APPS_SCRIPT_URL',
  WHATSAPP_NUMBER: 'YOUR_WHATSAPP_NUMBER',   // e.g. "919876543210" (with country code, no +)
  MAX_PHOTO_DIM:   1500,                      // px — max dimension after compression
  JPEG_QUALITY:    0.90,
  MIN_GOOD_DIM:    800,                       // below this → show quality warning
};

const PACK_SIZES = [9, 16, 18, 25, 36, 48, 50, 54];

/* ──────────────────────────────────────────────────────────
   STATE
────────────────────────────────────────────────────────── */
const state = {
  step:       1,
  totalSteps: 6,
  phone:      '',
  orderId:    '',
  packSize:   null,
  quantity:   1,
  photos:     [],   // [{ file, blob, url, name, goodQuality }]
  polaroidOn: false,
  polaroidIdx:0,
  folderId:   null,
};

/* ──────────────────────────────────────────────────────────
   STEP NAVIGATION
────────────────────────────────────────────────────────── */
function goToStep(n, skipValidation = false) {
  if (n < 1 || n > state.totalSteps) return;
  if (n > state.step && !skipValidation && !validateCurrentStep()) return;

  state.step = n;

  /* show/hide panels */
  document.querySelectorAll('.step-panel').forEach((el, i) => {
    el.classList.toggle('active', i + 1 === n);
  });

  /* update progress dots */
  document.querySelectorAll('.step-item').forEach((el, i) => {
    const s = i + 1;
    el.classList.toggle('active',    s === n);
    el.classList.toggle('completed', s < n);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  /* step-specific hooks */
  if (n === 5) initPolaroidStep();
  if (n === 6) populateSummary();
}

function validateCurrentStep() {
  switch (state.step) {
    case 1: return validatePhone();
    case 2: return validateOrderId();
    case 3: return validatePack();
    case 4: return validatePhotos();
    default: return true;
  }
}

function validatePhone() {
  const val = document.getElementById('phoneInput')?.value.trim() ?? '';
  if (!/^[6-9]\d{9}$/.test(val)) {
    showError('phoneErr', t('err_phone'));
    document.getElementById('phoneInput')?.focus();
    return false;
  }
  clearError('phoneErr');
  state.phone = val;
  return true;
}

function validateOrderId() {
  const val = document.getElementById('orderIdInput')?.value.trim() ?? '';
  if (val.length < 6) {
    showError('orderIdErr', t('err_orderId'));
    document.getElementById('orderIdInput')?.focus();
    return false;
  }
  clearError('orderIdErr');
  state.orderId = val;
  return true;
}

function validatePack() {
  if (!state.packSize) {
    showToast(t('err_pack'), 'warning');
    return false;
  }
  return true;
}

function validatePhotos() {
  if (state.photos.length === 0) {
    showToast(t('err_photos'), 'warning');
    return false;
  }
  return true;
}

/* ──────────────────────────────────────────────────────────
   STEP 1 — PHONE
────────────────────────────────────────────────────────── */
function initStep1() {
  const input = document.getElementById('phoneInput');
  input?.addEventListener('input', () => clearError('phoneErr'));
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') goToStep(2);
  });
}

/* ──────────────────────────────────────────────────────────
   STEP 2 — ORDER ID + OCR
────────────────────────────────────────────────────────── */
function initStep2() {
  const input = document.getElementById('orderIdInput');
  input?.addEventListener('input', () => clearError('orderIdErr'));
  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') goToStep(3);
  });

  document.getElementById('ocrFileInput')
    ?.addEventListener('change', e => {
      const file = e.target.files?.[0];
      if (file) handleOCR(file);
    });
}

async function handleOCR(file) {
  const status  = document.getElementById('ocrStatus');
  const result  = document.getElementById('ocrResult');
  const detText = document.getElementById('ocrDetected');

  if (!status) return;

  status.classList.add('show');
  status.querySelector('.ocr-msg').textContent = t('step2_detecting');
  result.classList.remove('show');

  try {
    // Check Tesseract is available
    if (typeof Tesseract === 'undefined') {
      throw new Error('Tesseract not loaded');
    }
    const { data: { text } } = await Tesseract.recognize(file, 'eng', {
      logger: () => {},
    });

    // Normalise: uppercase and remove spaces for pattern matching
    const norm = text.toUpperCase().replace(/\s+/g, '');

    // Extract Meesho Order ID patterns:
    // - Dash-separated like 405-1234567-9876543 (be lenient with digit counts)
    // - Alphanumeric like NB123456789
    // - Pure numeric 10–13 digits
    const patterns = [
      /\d{2,4}-\d{6,9}-\d{6,9}/g,       // dash-separated (lenient)
      /[A-Z]{0,3}\d{9,13}/g,             // alphanumeric starting with digits
      /\d{10,13}/g,                      // pure numeric 10-13 digits
    ];

    let found = null;
    for (const rx of patterns) {
      const matches = norm.match(rx);
      if (matches?.length) { found = matches[0]; break; }
    }

    status.classList.remove('show');

    if (found) {
      document.getElementById('orderIdInput').value = found;
      state.orderId = found;
      detText.textContent = found;
      result.classList.add('show');
      showToast(t('step2_detected'), 'success');
    } else {
      showToast(t('step2_not_found'), 'warning');
    }
  } catch (err) {
    status.classList.remove('show');
    showToast(t('step2_not_found'), 'warning');
    console.warn('OCR error', err);
  }

  // reset file input
  document.getElementById('ocrFileInput').value = '';
}

/* ──────────────────────────────────────────────────────────
   STEP 3 — PACK + QUANTITY
────────────────────────────────────────────────────────── */
function initStep3() {
  /* Render pack grid */
  const grid = document.getElementById('packGrid');
  if (grid) {
    PACK_SIZES.forEach(n => {
      const div = document.createElement('div');
      div.className = 'pack-option' + (state.packSize === n ? ' selected' : '');
      div.dataset.val = n;
      div.innerHTML = `<span>${n}</span><span class="pack-sub" data-t="pack_label">${t('pack_label')}</span>`;
      div.addEventListener('click', () => selectPack(n));
      grid.appendChild(div);
    });
  }

  updateQtyDisplay();
  document.getElementById('qtyMinus')?.addEventListener('click', () => changeQty(-1));
  document.getElementById('qtyPlus')?.addEventListener('click',  () => changeQty(+1));
}

function selectPack(n) {
  state.packSize = n;
  document.querySelectorAll('.pack-option').forEach(el => {
    el.classList.toggle('selected', +el.dataset.val === n);
  });
}

function changeQty(delta) {
  state.quantity = Math.max(1, Math.min(20, state.quantity + delta));
  updateQtyDisplay();
}

function updateQtyDisplay() {
  const el = document.getElementById('qtyVal');
  if (el) el.textContent = state.quantity;
}

/* ──────────────────────────────────────────────────────────
   STEP 4 — PHOTO UPLOAD
────────────────────────────────────────────────────────── */
function initStep4() {
  const zone  = document.getElementById('uploadZone');
  const input = document.getElementById('photoInput');

  zone?.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });
  zone?.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone?.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length) addPhotos(files);
  });
  input?.addEventListener('change', e => {
    const files = Array.from(e.target.files || []);
    if (files.length) addPhotos(files);
    input.value = '';   // allow re-selecting same files
  });
}

async function addPhotos(files) {
  for (const file of files) {
    if (state.photos.find(p => p.name === file.name && p.file.size === file.size)) continue;
    const goodQuality = await checkPhotoQuality(file);
    const url = URL.createObjectURL(file);
    state.photos.push({ file, url, name: file.name, goodQuality });
  }
  renderPhotoGrid();
}

function checkPhotoQuality(file) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      resolve(Math.min(img.naturalWidth, img.naturalHeight) >= CONFIG.MIN_GOOD_DIM);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => resolve(true);
    img.src = URL.createObjectURL(file);
  });
}

function removePhoto(idx) {
  URL.revokeObjectURL(state.photos[idx]?.url);
  state.photos.splice(idx, 1);
  renderPhotoGrid();
}

function renderPhotoGrid() {
  const grid  = document.getElementById('photoGrid');
  const badge = document.getElementById('photoBadge');
  if (!grid) return;

  grid.innerHTML = '';
  state.photos.forEach((p, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'photo-thumb';
    thumb.innerHTML = `
      <img src="${p.url}" alt="${p.name}" loading="lazy">
      <button class="pt-remove" title="Remove" onclick="removePhoto(${i})">✕</button>
      ${!p.goodQuality ? `<span class="pt-warn" data-t="step4_warn_quality">${t('step4_warn_quality')}</span>` : ''}
    `;
    grid.appendChild(thumb);
  });

  if (badge) {
    const n = state.photos.length;
    badge.textContent = `${n} ${t('step4_photos_label')}`;
    badge.style.display = n > 0 ? 'inline-flex' : 'none';
  }
}

/* ──────────────────────────────────────────────────────────
   STEP 5 — POLAROID PREVIEW (optional)
────────────────────────────────────────────────────────── */
let _polaroidListenersAdded = false;

function initPolaroidStep() {
  if (!_polaroidListenersAdded) {
    _polaroidListenersAdded = true;

    const row  = document.getElementById('polaroidToggleRow');
    const area = document.getElementById('polaroidArea');
    const sw   = document.getElementById('polaroidSwitch');

    row?.addEventListener('click', () => {
      state.polaroidOn = !state.polaroidOn;
      sw?.classList.toggle('on', state.polaroidOn);
      area?.classList.toggle('show', state.polaroidOn);
      if (state.polaroidOn) renderPolaroid(state.polaroidIdx);
    });

    document.getElementById('polaroidPrev')?.addEventListener('click', () => {
      if (state.polaroidIdx > 0) {
        state.polaroidIdx--;
        renderPolaroid(state.polaroidIdx);
      }
    });
    document.getElementById('polaroidNext')?.addEventListener('click', () => {
      if (state.polaroidIdx < state.photos.length - 1) {
        state.polaroidIdx++;
        renderPolaroid(state.polaroidIdx);
      }
    });
  }

  // Re-render if toggle is already on (user went back and came again)
  if (state.polaroidOn && state.photos.length > 0) {
    renderPolaroid(state.polaroidIdx);
  }
}

function renderPolaroid(idx) {
  if (!state.photos[idx]) return;

  const wrap  = document.getElementById('polaroidImgWrap');
  const counter = document.getElementById('polaroidCounter');

  if (counter) counter.textContent = `${idx + 1} / ${state.photos.length}`;

  // update prev/next buttons
  document.getElementById('polaroidPrev')?.toggleAttribute('disabled', idx === 0);
  document.getElementById('polaroidNext')?.toggleAttribute('disabled', idx === state.photos.length - 1);

  if (!wrap) return;
  wrap.innerHTML = '';

  const img = new Image();
  img.className = 'polaroid-img';
  img.draggable = false;
  img.src = state.photos[idx].url;

  img.onload = () => {
    const ww = wrap.clientWidth  || 200;
    const wh = wrap.clientHeight || 200;
    const scale = Math.max(ww / img.naturalWidth, wh / img.naturalHeight) * 1.0;
    const sw = Math.round(img.naturalWidth * scale);
    const sh = Math.round(img.naturalHeight * scale);
    img.style.width  = sw + 'px';
    img.style.height = sh + 'px';
    img.style.left   = Math.round((ww - sw) / 2) + 'px';
    img.style.top    = Math.round((wh - sh) / 2) + 'px';
    wrap.appendChild(img);
    enablePolaroidDrag(wrap, img);
  };
}

function enablePolaroidDrag(wrap, img) {
  let dragging = false, startX = 0, startY = 0, imgX = 0, imgY = 0;

  const getXY = e => e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
                                : { x: e.clientX, y: e.clientY };

  wrap.addEventListener('pointerdown', e => {
    dragging = true;
    const pt = getXY(e);
    startX = pt.x;
    startY = pt.y;
    imgX = parseInt(img.style.left) || 0;
    imgY = parseInt(img.style.top)  || 0;
    wrap.setPointerCapture?.(e.pointerId);
  });
  wrap.addEventListener('pointermove', e => {
    if (!dragging) return;
    const pt = getXY(e);
    const nx = imgX + (pt.x - startX);
    const ny = imgY + (pt.y - startY);
    img.style.left = nx + 'px';
    img.style.top  = ny + 'px';
  });
  wrap.addEventListener('pointerup',   () => { dragging = false; });
  wrap.addEventListener('pointerleave',() => { dragging = false; });
}

/* ──────────────────────────────────────────────────────────
   STEP 6 — SUMMARY
────────────────────────────────────────────────────────── */
function populateSummary() {
  setText('sumPhone',   state.phone);
  setText('sumOrderId', state.orderId);
  setText('sumPack',    state.packSize ? `${state.packSize} ${t('pack_label')}` : '—');
  setText('sumQty',     state.quantity);
  setText('sumPhotos',  `${state.photos.length} ${t('sum_photos_unit')}`);

  /* Mini photo strip */
  const strip = document.getElementById('summaryStrip');
  if (strip) {
    strip.innerHTML = '';
    const maxShow = 8;
    state.photos.slice(0, maxShow).forEach(p => {
      const img = document.createElement('img');
      img.className = 'summary-photo-thumb';
      img.src = p.url;
      img.alt = p.name;
      strip.appendChild(img);
    });
    if (state.photos.length > maxShow) {
      const more = document.createElement('div');
      more.className = 'summary-more';
      more.textContent = `+${state.photos.length - maxShow}`;
      strip.appendChild(more);
    }
  }
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val ?? '—';
}

/* ──────────────────────────────────────────────────────────
   SUBMIT — UPLOAD TO GOOGLE DRIVE
────────────────────────────────────────────────────────── */
async function submitOrder() {
  const btn = document.getElementById('submitBtn');
  if (btn) { btn.disabled = true; btn.textContent = t('btn_submitting'); }

  const progressWrap = document.getElementById('uploadProgress');
  const overallFill  = document.getElementById('overallFill');
  const overallLabel = document.getElementById('overallLabel');
  if (progressWrap) progressWrap.style.display = 'block';

  try {
    /* 1. Check endpoint is configured */
    if (CONFIG.UPLOAD_ENDPOINT === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      // Demo mode — skip actual upload, proceed to WhatsApp popup
      await simulateUpload(overallFill, overallLabel);
      showWhatsAppPopup();
      return;
    }

    /* 2. Init order on Google Drive */
    const initResp = await fetchJSON(CONFIG.UPLOAD_ENDPOINT, {
      action:    'init',
      phone:     state.phone,
      orderId:   state.orderId,
      packSize:  state.packSize,
      quantity:  state.quantity,
      timestamp: new Date().toISOString(),
    });

    if (!initResp.success) throw new Error(initResp.error || 'Init failed');
    state.folderId = initResp.folderId;

    /* 3. Upload photos one by one */
    const total = state.photos.length;
    for (let i = 0; i < total; i++) {
      const p = state.photos[i];

      if (overallLabel) overallLabel.textContent = `Uploading photo ${i + 1} of ${total}…`;
      const pct = Math.round(((i) / total) * 90);
      if (overallFill) overallFill.style.width = pct + '%';

      const compressed = await compressPhoto(p.file);
      const base64     = await blobToBase64(compressed);

      await fetchJSON(CONFIG.UPLOAD_ENDPOINT, {
        action:   'upload',
        folderId: state.folderId,
        filename: `photo_${String(i + 1).padStart(2, '0')}_${p.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`,
        mimeType: 'image/jpeg',
        data:     base64,
      });
    }

    if (overallFill)  overallFill.style.width = '100%';
    if (overallLabel) overallLabel.textContent = 'Upload complete! ✓';

    setTimeout(() => showWhatsAppPopup(), 600);

  } catch (err) {
    console.error('Upload error:', err);
    showToast('Upload failed. Please try again.', 'error', 5000);
    if (btn) { btn.disabled = false; btn.textContent = t('btn_submit'); }
    if (progressWrap) progressWrap.style.display = 'none';
  }
}

async function simulateUpload(fill, label) {
  const total = Math.max(state.photos.length, 1);
  for (let i = 0; i <= total; i++) {
    await sleep(200);
    const pct = Math.round((i / total) * 100);
    if (fill)  fill.style.width = pct + '%';
    if (label) label.textContent = i < total
      ? `Uploading photo ${i + 1} of ${total}…`
      : 'Upload complete! ✓';
  }
}

/* ──────────────────────────────────────────────────────────
   WHATSAPP POPUP
────────────────────────────────────────────────────────── */
function showWhatsAppPopup() {
  const modal   = document.getElementById('waModal');
  const msgBox  = document.getElementById('waMessage');
  const openBtn = document.getElementById('waOpenBtn');

  if (!modal) return;

  const msg = buildWhatsAppMessage();
  if (msgBox) msgBox.textContent = msg;
  if (openBtn) {
    openBtn.onclick = () => {
      const encoded = encodeURIComponent(msg);
      const num = CONFIG.WHATSAPP_NUMBER;
      const url = num !== 'YOUR_WHATSAPP_NUMBER'
        ? `https://wa.me/${num}?text=${encoded}`
        : `https://wa.me/?text=${encoded}`;
      window.open(url, '_blank');
    };
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function buildWhatsAppMessage() {
  return (
    `🖼️ *Iconic Prints — New Order*\n\n` +
    `📱 Phone: ${state.phone}\n` +
    `🛒 Meesho Order ID: ${state.orderId}\n` +
    `📦 Pack: ${state.packSize} photos\n` +
    `🔢 Quantity: ${state.quantity}\n` +
    `📸 Photos uploaded: ${state.photos.length}\n\n` +
    `Please confirm my order. Thank you! 🙏`
  );
}

function closeWaModal() {
  document.getElementById('waModal')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ──────────────────────────────────────────────────────────
   IMAGE UTILITIES
────────────────────────────────────────────────────────── */
function compressPhoto(file) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const MAX = CONFIG.MAX_PHOTO_DIM;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      if (Math.max(w, h) > MAX) {
        const ratio = MAX / Math.max(w, h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => {
        URL.revokeObjectURL(img.src);
        resolve(blob || file);
      }, 'image/jpeg', CONFIG.JPEG_QUALITY);
    };
    img.onerror = () => resolve(file);
    img.src = URL.createObjectURL(file);
  });
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/* ──────────────────────────────────────────────────────────
   NETWORK
────────────────────────────────────────────────────────── */
async function fetchJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    mode: 'cors',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* ──────────────────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────────────────── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function refreshDynamicText() {
  /* Re-render pack grid labels after language switch */
  document.querySelectorAll('.pack-option .pack-sub').forEach(el => {
    el.textContent = t('pack_label');
  });
  /* Re-render photo count badge */
  const badge = document.getElementById('photoBadge');
  if (badge && state.photos.length > 0) {
    badge.textContent = `${state.photos.length} ${t('step4_photos_label')}`;
  }
}

/* ──────────────────────────────────────────────────────────
   INIT
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  /* Init each step */
  initStep1();
  initStep2();
  initStep3();
  initStep4();

  /* Step navigation buttons */
  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => goToStep(+btn.dataset.next));
  });
  document.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', () => goToStep(+btn.dataset.prev, true));
  });

  /* Submit button */
  document.getElementById('submitBtn')
    ?.addEventListener('click', submitOrder);

  /* WhatsApp modal close */
  document.getElementById('waClose')
    ?.addEventListener('click', closeWaModal);
  document.getElementById('waLater')
    ?.addEventListener('click', closeWaModal);

  /* Close modal on backdrop click */
  document.getElementById('waModal')
    ?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeWaModal();
    });
});

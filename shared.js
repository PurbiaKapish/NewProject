/* shared.js — Iconic Prints shared utilities */
'use strict';

/* ──────────────────────────────────────────────────────────
   TRANSLATIONS
────────────────────────────────────────────────────────── */
const TRANSLATIONS = {
  en: {
    /* Nav */
    nav_home:     'Upload Photos',
    nav_tutorial: 'How to Use',
    nav_contact:  'Contact Us',
    nav_legal:    'Legal & Policy',
    nav_pages:    'Pages',

    /* Steps */
    step1_title: 'Your Phone Number',
    step1_desc:  'We'll use this to contact you about your order.',
    step1_lbl:   'WhatsApp Number',
    step1_ph:    'e.g. 9876543210',
    step1_hint:  'Enter 10-digit number without country code',
    err_phone:   'Please enter a valid 10-digit mobile number.',

    step2_title: 'Your Meesho Order ID',
    step2_desc:  'Type your Order ID, or upload a screenshot and we'll detect it automatically.',
    step2_lbl:   'Order ID',
    step2_ph:    'e.g. 40512345678',
    step2_hint:  'Find it in Meesho app → My Orders → Order Details',
    step2_tooltip: 'Open Meesho → tap "My Orders" → select your order → copy the Order ID shown at the top.',
    step2_or:    'OR',
    step2_scan_title: 'Upload Order Screenshot',
    step2_scan_desc:  'Take a screenshot of your Meesho order page',
    step2_detecting: 'Reading your screenshot…',
    step2_detected:  'Order ID detected!',
    step2_not_found: 'Could not detect Order ID. Please type it above.',
    err_orderId: 'Please enter your Meesho Order ID.',

    step3_title:    'Choose Your Pack',
    step3_desc:     'Select how many Polaroid photos you want printed.',
    step3_pack_lbl: 'Number of Photos',
    step3_qty_lbl:  'Quantity Ordered on Meesho',
    step3_qty_hint: 'How many units did you order?',
    err_pack:       'Please select a pack size.',

    step4_title: 'Upload Your Photos',
    step4_desc:  'Upload original photos (not screenshots) for best print quality.',
    step4_zone_title: 'Tap to select or drag photos here',
    step4_zone_desc:  'JPG, PNG, HEIC — multiple photos supported',
    step4_warn_quality: '⚠️ Low resolution',
    step4_photos_label: 'photos selected',
    err_photos:   'Please upload at least one photo.',

    step5_title:   'Polaroid Frame Preview',
    step5_desc:    'Optional — see how your photo will look when printed.',
    step5_toggle:  'Preview photos in Polaroid frame',
    step5_subtitle:'Drag to reposition your photo inside the frame.',
    step5_prev:    '← Prev',
    step5_next:    'Next →',

    step6_title:  'Order Summary',
    step6_desc:   'Please review your details before submitting.',
    sum_phone:    'WhatsApp Number',
    sum_orderid:  'Meesho Order ID',
    sum_pack:     'Pack Size',
    sum_qty:      'Quantity',
    sum_photos:   'Photos',
    sum_photos_unit: 'uploaded',

    btn_next:   'Continue →',
    btn_back:   '← Back',
    btn_submit: 'Submit Photos',
    btn_submitting: 'Uploading…',

    /* WhatsApp popup */
    wa_title:    'Share on WhatsApp to Confirm',
    wa_subtitle: 'Send this message to confirm your order. Your photos are being saved.',
    wa_btn:      '📲 Open WhatsApp',
    wa_later:    'I\'ll share later',

    /* Misc */
    photos: 'Photos',
    pack_label: 'photos',
  },

  hi: {
    /* Nav */
    nav_home:     'फ़ोटो अपलोड करें',
    nav_tutorial: 'उपयोग कैसे करें',
    nav_contact:  'संपर्क करें',
    nav_legal:    'नियम एवं नीति',
    nav_pages:    'पेज',

    /* Steps */
    step1_title: 'आपका फ़ोन नंबर',
    step1_desc:  'आपके ऑर्डर के बारे में संपर्क करने के लिए।',
    step1_lbl:   'WhatsApp नंबर',
    step1_ph:    'जैसे 9876543210',
    step1_hint:  'बिना कोड के 10 अंकों का नंबर दर्ज करें',
    step1_tooltip:'',
    err_phone:   'कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।',

    step2_title: 'Meesho Order ID',
    step2_desc:  'Order ID टाइप करें, या स्क्रीनशॉट अपलोड करें — हम ID खुद ढूंढ लेंगे।',
    step2_lbl:   'Order ID',
    step2_ph:    'जैसे 40512345678',
    step2_hint:  'Meesho → My Orders → Order Details में मिलेगी',
    step2_tooltip:'Meesho खोलें → "My Orders" टैप करें → ऑर्डर चुनें → Order ID कॉपी करें।',
    step2_or:    'या',
    step2_scan_title: 'Order Screenshot अपलोड करें',
    step2_scan_desc:  'Meesho Order पेज का स्क्रीनशॉट लें',
    step2_detecting: 'स्क्रीनशॉट पढ़ रहे हैं…',
    step2_detected:  'Order ID मिल गई!',
    step2_not_found: 'Order ID नहीं मिली। कृपया ऊपर टाइप करें।',
    err_orderId: 'कृपया अपनी Meesho Order ID दर्ज करें।',

    step3_title:    'अपना पैक चुनें',
    step3_desc:     'कितनी Polaroid फ़ोटो प्रिंट करवानी हैं?',
    step3_pack_lbl: 'फ़ोटो की संख्या',
    step3_qty_lbl:  'Meesho पर कितनी Quantity ऑर्डर की',
    step3_qty_hint: 'आपने कितने piece ऑर्डर किए?',
    err_pack:       'कृपया एक पैक चुनें।',

    step4_title: 'फ़ोटो अपलोड करें',
    step4_desc:  'सर्वोत्तम प्रिंट के लिए ओरिजिनल फ़ोटो अपलोड करें (स्क्रीनशॉट नहीं)।',
    step4_zone_title: 'यहाँ टैप करें या फ़ोटो खींचें',
    step4_zone_desc:  'JPG, PNG, HEIC — एक से ज़्यादा फ़ोटो',
    step4_warn_quality: '⚠️ कम गुणवत्ता',
    step4_photos_label: 'फ़ोटो चुनी गई',
    err_photos:   'कृपया कम से कम एक फ़ोटो अपलोड करें।',

    step5_title:   'Polaroid Frame Preview',
    step5_desc:    'वैकल्पिक — देखें कि प्रिंट में कैसा दिखेगा।',
    step5_toggle:  'Polaroid frame में preview देखें',
    step5_subtitle:'फ्रेम में फ़ोटो को खींचकर सेट करें।',
    step5_prev:    '← पिछला',
    step5_next:    'अगला →',

    step6_title:  'ऑर्डर सारांश',
    step6_desc:   'सबमिट करने से पहले जानकारी जाँचें।',
    sum_phone:    'WhatsApp नंबर',
    sum_orderid:  'Meesho Order ID',
    sum_pack:     'पैक साइज़',
    sum_qty:      'Quantity',
    sum_photos:   'फ़ोटो',
    sum_photos_unit: 'अपलोड की गई',

    btn_next:   'आगे बढ़ें →',
    btn_back:   '← वापस',
    btn_submit: 'फ़ोटो सबमिट करें',
    btn_submitting: 'अपलोड हो रहा है…',

    /* WhatsApp popup */
    wa_title:    'WhatsApp पर share करके confirm करें',
    wa_subtitle: 'ऑर्डर confirm करने के लिए यह message भेजें।',
    wa_btn:      '📲 WhatsApp खोलें',
    wa_later:    'बाद में share करूँगा/गी',

    /* Misc */
    photos: 'फ़ोटो',
    pack_label: 'फ़ोटो',
  }
};

/* Active language (persisted in localStorage) */
let currentLang = localStorage.getItem('ip_lang') || 'en';

function t(key) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  return dict[key] !== undefined ? dict[key] : (TRANSLATIONS.en[key] || key);
}

function applyTranslations() {
  document.querySelectorAll('[data-t]').forEach(el => {
    const key = el.dataset.t;
    el.textContent = t(key);
  });
  document.querySelectorAll('[data-t-ph]').forEach(el => {
    el.placeholder = t(el.dataset.tPh);
  });
  document.querySelectorAll('[data-t-title]').forEach(el => {
    el.title = t(el.dataset.tTitle);
  });
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('ip_lang', lang);
  document.documentElement.lang = lang === 'hi' ? 'hi' : 'en';
  applyTranslations();

  // update lang toggle button appearance
  const btn = document.getElementById('langToggleBtn');
  if (btn) btn.textContent = lang === 'hi' ? 'EN' : 'हि';

  // re-render dynamic content if on main page
  if (typeof refreshDynamicText === 'function') refreshDynamicText();
}

/* ──────────────────────────────────────────────────────────
   THEME
────────────────────────────────────────────────────────── */
let currentTheme = localStorage.getItem('ip_theme') || 'light';

function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('ip_theme', theme);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

/* ──────────────────────────────────────────────────────────
   SIDE NAV
────────────────────────────────────────────────────────── */
function openNav() {
  document.getElementById('sideNav')?.classList.add('open');
  document.getElementById('navBackdrop')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNav() {
  document.getElementById('sideNav')?.classList.remove('open');
  document.getElementById('navBackdrop')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ──────────────────────────────────────────────────────────
   TOAST
────────────────────────────────────────────────────────── */
function showToast(msg, type = 'info', duration = 3000) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(() => toast.remove(), 320);
  }, duration);
}

/* ──────────────────────────────────────────────────────────
   FIELD ERROR HELPERS
────────────────────────────────────────────────────────── */
function showError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = '⚠ ' + msg;
  el.classList.add('show');
  el.closest?.('.form-group')?.querySelector('.input')?.classList.add('error');
}
function clearError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('show');
  el.closest?.('.form-group')?.querySelector('.input')?.classList.remove('error');
}

/* ──────────────────────────────────────────────────────────
   INIT (runs on every page)
────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  /* Apply persisted theme + language */
  applyTheme(currentTheme);
  applyTranslations();

  /* Theme toggle button */
  document.getElementById('themeToggleBtn')
    ?.addEventListener('click', toggleTheme);

  /* Language toggle button */
  document.getElementById('langToggleBtn')?.addEventListener('click', () => {
    setLanguage(currentLang === 'hi' ? 'en' : 'hi');
  });

  /* Hamburger / nav open */
  document.getElementById('hamburgerBtn')
    ?.addEventListener('click', openNav);
  document.getElementById('sideNavClose')
    ?.addEventListener('click', closeNav);
  document.getElementById('navBackdrop')
    ?.addEventListener('click', closeNav);

  /* Mark active nav link */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === path) link.classList.add('active');
    else link.classList.remove('active');
  });
});

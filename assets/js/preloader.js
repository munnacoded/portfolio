// HUD-style preloader: shows once per tab (session), supports ?nohud=1 & prefers-reduced-motion.
// Uses avatar: /assets/img/avatar/munna-avatar.webp
// Gate support: if HEAD-এ <style id="hud-gate-css"> + <html class="hud-gate"> দেওয়া থাকে,
// এই স্ক্রিপ্ট finish/skip হলে গেট খুলে দেয়, তাই কনটেন্ট ফ্ল্যাশ হবে না।

(() => {
  'use strict';

  // ====== Config
  var KEY = 'hudShown';
  var MIN_TIME = 900;     // minimally visible time (ms)
  var FORCE_HIDE = 4000;  // safety timeout (ms)
  var IMG = '/assets/img/avatar/munna-avatar.webp';
  var ALT = 'Mohiuddin Munna'; // TODO: যদি ব্র্যান্ডিং ইউনিফর্ম করতে চাও → 'Munna Coded'

  // ====== Helpers
  function now() {
    try { return (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now(); }
    catch (_) { return Date.now(); }
  }
  function safeSetSession(key, val) { try { sessionStorage.setItem(key, val); } catch (_) {} }
  function safeGetSession(key) { try { return sessionStorage.getItem(key); } catch (_) { return null; } }
  function unlockScroll() { try { if (document.body) document.body.classList.remove('hud-noscroll'); } catch (_) {} }
  function removeGate() {
    try { document.documentElement.classList.remove('hud-gate'); } catch (_) {}
    try {
      var s = document.getElementById('hud-gate-css');
      if (s && s.parentNode) s.parentNode.removeChild(s);
    } catch (_) {}
    // extra retry next tick
    setTimeout(function() {
      try { document.documentElement.classList.remove('hud-gate'); } catch (_) {}
      try {
        var s2 = document.getElementById('hud-gate-css');
        if (s2 && s2.parentNode) s2.parentNode.removeChild(s2);
      } catch (_) {}
    }, 0);
  }

  // ====== Early exits: ?nohud=1 or prefers-reduced-motion
  var qs; try { qs = new URLSearchParams(location.search); } catch (_) {}
  if (qs && qs.has('nohud')) {
    safeSetSession(KEY, '1'); removeGate(); return;
  }
  var prefersReduced = false;
  try { prefersReduced = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (_) {}
  if (prefersReduced) {
    safeSetSession(KEY, '1'); removeGate(); return;
  }

  // ====== Preload avatar <link rel="preload">
  (function preloadAvatar() {
    try {
      var l = document.createElement('link');
      l.rel = 'preload'; l.as = 'image'; l.href = IMG; l.setAttribute('fetchpriority', 'high');
      document.head && document.head.appendChild(l);
    } catch (_) {}
  })();

  try {
    // Already shown in this tab?
    if (safeGetSession(KEY) === '1') { removeGate(); return; }

    // ====== Build overlay markup
    var overlay = document.createElement('div');
    overlay.id = 'hud-preloader';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<div class="hud-wrap" role="status" aria-live="polite">' +
      '  <div class="hud-core">' +
      '    <div class="hud-ring-dashed"></div>' +
      '    <div class="hud-ring"></div>' +
      '    <div class="hud-hex">' +
      '      <div class="hud-hex-inner">' +
      '        <img class="hud-avatar" src="' + IMG + '" alt="' + ALT + '" fetchpriority="high" decoding="async" />' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '  <p class="hud-text">Calibrating interface</p>' +
      '  <div class="hud-progress" aria-label="Loading progress"><span class="hud-progress-fill"></span></div>' +
      '  <div class="hud-percent"><span>0</span>%</div>' +
      '  <div class="hud-scan"></div>' +
      '</div>';

    // ====== Mount + gate handling
    function mount() {
      if (!document.body) return;
      document.body.appendChild(overlay);
      document.body.classList.add('hud-noscroll');
      // Gate খুলে দেই, যাতে overlay ফেড হলেই কনটেন্ট দেখা যায় (mobile black screen fix)
      removeGate();
    }
    if (document.body) mount();
    else document.addEventListener('DOMContentLoaded', mount, { once: true });

    // Mark as shown (avoid multiple shows per tab)
    safeSetSession(KEY, '1');

    // ====== Simulated progress
    var fill = overlay.querySelector('.hud-progress-fill');
    var pct  = overlay.querySelector('.hud-percent span');
    var progress = 0;

    function setProgress(p) {
      progress = Math.max(0, Math.min(100, p));
      if (fill) fill.style.width = progress + '%';
      if (pct)  pct.textContent = Math.round(progress);
    }

    var sim = setInterval(function () {
      if (progress < 88) {
        setProgress(progress + Math.max(1, (88 - progress) * 0.08));
      } else if (progress < 96) {
        setProgress(progress + 0.5);
      }
    }, 70);

    var t0 = now();
    var done = false;

    function finish() {
      if (done) return;
      done = true;
      clearInterval(sim);

      // Ensure gate is definitely removed (mobile safety)
      removeGate();

      var elapsed = now() - t0;
      var wait = Math.max(0, MIN_TIME - elapsed);

      setTimeout(function () {
        var t = setInterval(function () {
          if (progress >= 100) {
            clearInterval(t);
            try { overlay.classList.add('hud-fade'); } catch (_) {}
            removeGate(); // double safety
            setTimeout(function () {
              try { if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay); } catch (_) {}
              unlockScroll();
            }, 350);
          } else {
            setProgress(progress + Math.max(2, (100 - progress) * 0.2));
          }
        }, 28);
      }, wait);
    }

    // Finish on DOM ready (no need to wait full window load)
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', finish, { once: true });
    } else {
      finish();
    }

    // ====== Safety timeout: never get stuck
    setTimeout(function () {
      try { overlay.classList.add('hud-fade'); } catch (_) {}
      removeGate();
      setTimeout(function () {
        try { if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay); } catch (_) {}
        unlockScroll();
      }, 350);
    }, FORCE_HIDE);

    // Extra safety: on window load and after 1s ensure gate is gone
    window.addEventListener('load', removeGate);
    setTimeout(removeGate, 1000);

    // Debug/manual escape
    window.__hideHUD = finish;
    window.addEventListener('keydown', function (e) { if (e && e.key === 'Escape') finish(); });
  } catch (e) {
    try { console.error('HUD preloader error:', e); } catch (_) {}
    try {
      var hud = document.getElementById('hud-preloader');
      if (hud && hud.parentNode) hud.parentNode.removeChild(hud);
    } catch (_) {}
    unlockScroll();
    removeGate();
  }
})();
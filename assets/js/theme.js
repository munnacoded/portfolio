// Dark/Light theme handling with localStorage + toggle button binding.
// Works even when header loads via partials (listens for 'partials:loaded').

(() => {
  'use strict';

  const STORAGE_KEY = 'portfolioTheme'; // keep same key as old project
  const COLOR_DARK = '#0d0d1a';
  const COLOR_LIGHT = '#e8e8f5';

  function setMetaThemeColor(mode) {
    try {
      const meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) return;
      // Prefer computed CSS var so it always matches actual theme token
      const cssBg = getComputedStyle(document.documentElement)
        .getPropertyValue('--bg-color')
        .trim();
      const fallback = mode === 'light' ? COLOR_LIGHT : COLOR_DARK;
      meta.setAttribute('content', cssBg || fallback);
    } catch (_) {}
  }

  function applyTheme(mode) {
    const body = document.body;
    if (!body) return;

    // Normalize
    mode = (mode === 'light') ? 'light' : 'dark';

    body.classList.toggle('light-mode', mode === 'light');
    body.classList.toggle('dark-mode', mode === 'dark');

    try { localStorage.setItem(STORAGE_KEY, mode); } catch (_) {}

    setMetaThemeColor(mode);

    // Update toggle button a11y (non-visual)
    const btn = document.getElementById('darkModeToggle');
    if (btn) {
      btn.setAttribute('aria-pressed', String(mode === 'light'));
      btn.setAttribute('aria-label', mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }

    // Notify listeners
    try { document.dispatchEvent(new CustomEvent('theme:change', { detail: { mode } })); } catch (_) {}
  }

  function detectPreferredTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (_) {}
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    return prefersLight ? 'light' : 'dark';
  }

  function bindToggle() {
    const btn = document.getElementById('darkModeToggle');
    if (!btn) return false;
    btn.addEventListener('click', () => {
      const isLight = document.body.classList.contains('light-mode');
      applyTheme(isLight ? 'dark' : 'light');
    });
    return true;
  }

  // Initialize as soon as DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const mode = detectPreferredTheme();
    applyTheme(mode);

    // Bind toggle now or when header arrives via partials
    if (!bindToggle()) {
      document.addEventListener('partials:loaded', () => { bindToggle(); }, { once: true });
    }
  });
})();
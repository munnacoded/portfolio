// assets/js/include-partials.js
/*
  Partials include (header/footer) + active nav + clean-URL dev fallback.
  Usage in pages:
    <div data-include="/partials/header.html"></div>
    ...
    <div data-include="/partials/footer.html"></div>
*/
(() => {
  'use strict';

  // Normalize a path: remove trailing slash (except root), collapse /index.html → /
  function normalizePath(p) {
    if (!p) return '/';
    const u = new URL(p, location.origin);
    let path = u.pathname || '/';
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
    if (path === '/index.html') path = '/';
    return path || '/';
  }

  // Clean route → aliases (clean + file paths for dev)
  const aliasMap = {
    '/': ['/', '/index.html'],
    '/about': ['/about', '/pages/about.html'],
    '/projects': ['/projects', '/pages/projects.html'],
    '/skills': ['/skills', '/pages/skills.html'],
    '/testimonials': ['/testimonials', '/pages/testimonials.html'],
    '/contact': ['/contact', '/pages/contact.html'],
    '/projects/alokchhaya-high-school': [
      '/projects/alokchhaya-high-school',
      '/pages/projects/alokchhaya-high-school.html'
    ],
    '/thanks': ['/thanks', '/pages/thanks.html']
  };

  // Build dev clean-url rewrite map from aliasMap (clean → file.html)
  function buildDevMap() {
    const map = { '/': '/index.html' };
    for (const [clean, aliases] of Object.entries(aliasMap)) {
      if (!Array.isArray(aliases)) continue;
      const file = aliases.find(a => a.endsWith('.html'));
      if (file) map[clean] = file;
    }
    return map;
  }

  async function includeNode(node) {
    const src = node.getAttribute('data-include');
    if (!src) return;
    try {
      const res = await fetch(src, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      node.outerHTML = html;
    } catch (err) {
      console.error('Partial include failed:', src, err);
      node.outerHTML = `
        <div role="alert" style="padding:12px;border:1px dashed #888;color:#888;background:#111;">
          Failed to load: ${src}
        </div>`;
    }
  }

  function isMatch(current, linkPath) {
    if (current === linkPath) return true;
    const aliases = aliasMap[linkPath];
    return Array.isArray(aliases) ? aliases.includes(current) : false;
  }

  // Highlight current nav item
  function setActiveNav() {
    const current = normalizePath(location.pathname);
    document.querySelectorAll('.nav-links a').forEach(a => {
      const hrefAttr = a.getAttribute('href') || '/';
      const hrefPath = normalizePath(hrefAttr);
      const active = isMatch(current, hrefPath);
      a.classList.toggle('active', active);
      if (active) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  // DEV fallback: rewrite clean URLs → file paths on localhost/127.0.0.1/file:
  function enableDevCleanUrlFallback() {
    const DEV = location.protocol === 'file:' ||
                location.hostname === '127.0.0.1' ||
                location.hostname === 'localhost';
    if (!DEV) return;

    const map = buildDevMap();

    // Rewrite absolute-site links only (keep http:, mailto:, tel:, #)
    document.querySelectorAll('a[href^="/"]').forEach(a => {
      try {
        const raw = a.getAttribute('href');
        const u = new URL(raw, location.origin);
        let path = u.pathname;
        if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
        const hash = u.hash || '';
        const mapped = map[path || '/'];
        if (mapped) {
          a.setAttribute('data-clean-href', raw);
          a.setAttribute('href', mapped + hash);
        }
      } catch (_) { /* ignore */ }
    });
  }

  document.addEventListener('DOMContentLoaded', async () => {
    const targets = Array.from(document.querySelectorAll('[data-include]'));
    if (targets.length) await Promise.all(targets.map(includeNode));

    // Ensure DOM updated (header/footer injected) before running helpers
    requestAnimationFrame(() => {
      try { enableDevCleanUrlFallback(); } catch (e) { console.warn(e); }
      try { setActiveNav(); } catch (e) { console.warn(e); }
      document.dispatchEvent(new CustomEvent('partials:loaded'));
    });
  });
})();
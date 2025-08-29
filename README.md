# Munna Coded — Portfolio (v2)

Modern, fast, and accessible personal portfolio. Built with vanilla HTML/CSS/JS and deployed on Netlify. Dark/Light theme, responsive grids, HUD preloader, clean URLs, and solid SEO.

Live: https://munnacoded.netlify.app/

---

## Features

- ⚡ Fast + responsive (mobile‑first, fluid grids, aspect‑ratio media)
- 🌓 Theme toggle (dark/light) with localStorage + meta theme-color update
- 🛰️ HUD‑style preloader (skippable with `?nohud=1`, shows once per tab)
- 🧩 Header/Footer partials (client‑side include with active nav highlighting)
- 🔎 SEO‑ready: canonical, Open Graph/Twitter, JSON‑LD (Person, WebSite, Breadcrumb, etc.)
- 🔐 Netlify headers: security + caching (netlify.toml)
- 🕸️ Sitemap + robots
- ♿ Accessibility: skip link, focus‑visible styles, semantic structure
- 🧰 Dev clean‑URL fallback for localhost/file://
- 📱 PWA manifest with scope + shortcuts (long‑press to open Projects/Contact/About)

---

## Tech Stack

- HTML5, CSS3 (custom), JavaScript (ES6+)
- Netlify (deploy, redirects, headers)
- Font Awesome, Google Fonts

---

## Project Structure

```
├─ index.html
├─ pages/
│ ├─ about.html
│ ├─ projects.html
│ ├─ skills.html
│ ├─ testimonials.html
│ ├─ contact.html
│ └─ thanks.html
├─ pages/projects/alokchhaya-high-school.html
├─ partials/
│ ├─ header.html
│ └─ footer.html
├─ assets/
│ ├─ css/ (theme.css, base.css, components.css, pages.css)
│ ├─ js/ (theme.js, include-partials.js, preloader.js, main.js)
│ ├─ img/ ...
│ ├─ favicons/ (favicon, site.webmanifest, apple-touch-icon, etc.)
│ └─ docs/ (resume.pdf)
├─ _redirects (optional if netlify.toml used)
├─ netlify.toml
├─ sitemap.xml
├─ robots.txt
└─ 404.html
```


---

## Customization Checklist

- Brand
  - `partials/header.html` → logo text
  - `partials/footer.html` → social links (replace USERNAME placeholders)
- Content
  - `assets/docs/resume.pdf` + “Download CV” link text/file name
  - Replace USERNAME and placeholder links in JSON‑LD/socials
  - Update contact email/phone/address in `pages/contact.html`
- SEO / Metadata
  - Canonical URLs, OG/Twitter images (own assets)
  - JSON‑LD (Person/WebSite/Breadcrumbs) per page
- Favicons / Manifest
  - Replace icons in `assets/favicons/*`
  - Edit `assets/favicons/site.webmanifest` (name, theme_color, icons)
  - Optional: keep `scope` and `shortcuts` (Projects/Contact/About)
- Images
  - Prefer `.webp`; keep width/height to reduce CLS
  - Card placeholders auto‑handle missing images
- Netlify
  - Managed via `netlify.toml` (pretty URLs, headers, 404) or `_redirects`

---

## Local Development

Use any static server:
- VS Code Live Server, or
- `npx serve .`

Notes:
- Clean URLs (`/about`, `/projects`) are auto‑rewritten to `/pages/*.html` in DEV by `include-partials.js`.
- On Netlify, clean URLs are served via redirects (200 rewrites).

---

## Deployment (Netlify)

1) Connect Git repo to Netlify  
2) Build settings:
   - Build command: (none)
   - Publish directory: `.`
3) `netlify.toml` includes:
   - Pretty URLs (200 rewrites)
   - Canonical redirects (301)
   - Security & caching headers
   - 404 fallback
4) Netlify Forms:
   - `pages/contact.html` uses `data-netlify="true"` + hidden `form-name`
   - Optional: enable reCAPTCHA

---

## Accessibility

- Skip link to main content
- Focus‑visible styles, sufficient contrast, ARIA labels
- Respects `prefers-reduced-motion`

---

## Performance Notes

- No heavy frameworks; minimal JS
- `aspect-ratio` for media wrappers (stable card grids)
- Lazy‑loaded images; long‑term cache for assets
- HTML `no-cache` for freshness

---

## Known Tips & Flags

- Mobile safe‑area handled (`env(safe-area-inset-*)`)
- Mobile header uses `position: sticky` to avoid jump with dynamic address bar
- Preloader bypass: `?nohud=1`
- Dev clean URLs handled by `assets/js/include-partials.js`

---

## Roadmap

- Build‑time partials (11ty/Astro)
- Automated image pipeline (webp/avif + srcset)
- More case studies / blog
- i18n (bn/en toggle)

---

## Credits

- Icons: Font Awesome
- Fonts: Google Fonts (Orbitron, Roboto Mono)
- Deploy: Netlify

---

## License

MIT © 2025 Munna Coded

---

## Contact

- Portfolio: https://munnacoded.netlify.app/
- Email: munnacoded@gmail.com
- Socials: see footer on the live site
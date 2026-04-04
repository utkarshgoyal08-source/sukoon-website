# Sukoon Website — Image Audit Report
**Date:** 2026-04-03

## Summary
All product images are correctly aligned and fully visible. No broken references found.

---

## CSS Fix Applied (2026-04-03)
Changed `object-fit: cover` → `object-fit: contain` on all product image containers across 15 HTML files so full products are visible without cropping.

| Container | Before | After |
|-----------|--------|-------|
| `.card-carousel img` | `cover` | `contain` |
| `.category-card-img img` | `cover` | `contain` |
| `.event-card-img img` | `cover` | `contain` |
| `.gallery-item img` | `cover` | `contain` |
| `.cat-hero-bg img` (hero banners) | `cover` | unchanged (intentional) |

---

## object-fit Status by Page

| File | `.card-carousel img` | `.category-card-img img` | `.gallery-item img` | `.cat-hero-bg img` |
|------|:-:|:-:|:-:|:-:|
| candles.html | contain | contain | — | cover |
| container-candles.html | contain | — | — | cover |
| pillar-candles.html | contain | — | — | cover |
| fragrance-bars-wax-melts.html | contain | — | — | cover |
| flower-bouquet.html | contain | — | — | cover |
| rakhis.html | contain | — | — | cover |
| diwali.html | contain | — | — | cover |
| customization.html | contain | — | — | cover |
| festive-collection.html | contain | contain | — | cover |
| index.html | — | contain | contain | — |
| gallery.html | — | — | contain | cover |
| events.html | — | — | — | cover |

---

## Image File Audit

- **Total unique image src paths in HTML:** 36
- **Missing images:** 0
- **Broken paths/typos:** 0
- **Product images on disk:** 169 (under `images/products/`)

### Empty Directories (harmless)
- `images/diwali/`
- `images/events/kaizen-x-sukoon/`
- `images/events/novotel/`
- `images/events/popcorn-parade/`

### Unreferenced files (exist on disk, not in HTML src — kept for future use)
- `images/hero-elephant2.jpg`
- `images/hero-extra3.jpg`
- `images/hero-extra4.jpg`
- `images/logo-letter-transparent.png`
- `images/logo-letter-wide.jpeg`
- `images/logo-letter.jpeg`
- `images/logo-round.jpeg`
- `images/icons/eco-friendly.png`
- `images/icons/handmade.png`
- `images/icons/natural-wick.png`
- `images/icons/soy-wax.png`
- `images/icons/toxin-free.png`

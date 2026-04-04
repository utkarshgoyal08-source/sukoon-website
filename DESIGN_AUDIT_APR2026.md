# Sukoon Website — Design & UX Audit (April 2026)

## Changes Implemented

### Instagram Update
- Updated from `@__s.u.k.o.o.n` to `@sukoon_studio__` across all 15 pages
- All URLs and display text updated

### Desktop UX Fixes
- Product grid widened: max-width 1100px -> 1280px (uses full container)
- Candles category grid widened: 800px -> 1100px
- Enquire buttons enlarged: padding 14px 28px, min-height 44px
- Product card hover: deeper shadow (12px 48px), stronger lift (-8px)
- Card body padding increased: 22px 24px (more breathing room)
- Product title font: 1.15rem -> 1.25rem
- Button transitions: cubic-bezier easing for premium feel
- Removed dead CSS (duplicate .services declaration in index.html)
- Copyright updated: 2025 -> 2025-2026 across all 15 pages

### Mobile UX Fixes
- Carousel arrows: 30px -> 44px at mobile breakpoint (WCAG compliant)
- Lightbox nav buttons: 36px -> 44px at mobile breakpoint
- Hero arrows: 40px -> 44px at 600px breakpoint
- WhatsApp float: 60px -> 52px at 480px, repositioned to bottom:20px right:16px
- Back-to-top button: repositioned to avoid overlap at 480px

---

## Remaining Suggestions (Future)

### High Priority
- Extract shared CSS into external styles.css (currently inline in all 15 files)
- Add 480px comprehensive breakpoints for section padding, container padding
- Flower bouquet page: single card layout could be wider (horizontal card)

### Medium Priority
- Add product descriptions/price ranges to cards
- Sticky "Order Now" bar on long product pages
- Gallery hero: use a different image than homepage hero
- Dynamic copyright year via JavaScript

### Low Priority
- Breadcrumb separator: em-dash -> chevron
- Mobile menu: display:none on desktop for accessibility
- Nav "Products" dropdown: larger chevron indicator
- Contact form: add :invalid CSS styling for validation feedback

# Sukoon Website — Mobile UI/UX Audit
**Date:** 2026-04-04

## Summary
Comprehensive mobile audit across all 15+ pages. Key findings and fixes needed.

---

## Critical Issues

### 1. Touch Targets Below 44px (WCAG 2.5.5)
- `.btn-enquire` padding 10px 24px = ~32px height
- `.carousel-arrow` 30px at 768px breakpoint
- `.lb-nav` reduced to 36px at 600px
- `.hamburger` padding 8px = ~42px

### 2. Missing 480px Breakpoints
Most pages jump from 768px to no further mobile optimization. Need:
- Section padding: 70px -> 50px
- Container padding: 18px -> 14px
- Hero min-height: 250px -> 180px
- Footer gap: 32px -> 16px

### 3. WhatsApp Button Overlap
60px button at bottom:28px may overlap content on small phones.

---

## Fixes Applied (2026-04-04)

### Product Cards (All 9 product pages)
- Grid: `repeat(2,1fr)` max-width 1100px (was auto-fill 300px, 3+ cols)
- Aspect ratio: 4/5 portrait (was 1/1 square)
- Border-radius: 24px, shadow: medium
- Background: cream

### Category Cards (candles, festive, index)
- Height: 420px (was 260-300px)
- Responsive: 320px tablet, 240px mobile

### Hero Carousel (index.html)
- Added left/right navigation arrows
- Added 5th slide
- Replaced duplicate slide 4

---

## Remaining Mobile Fixes Needed

| Issue | Priority | Pages |
|-------|----------|-------|
| Add 480px breakpoints | HIGH | All |
| Increase touch targets to 44px | HIGH | All |
| Reduce hero min-height on mobile | MEDIUM | All product pages |
| Gallery: collapse to 1 col at 480px | MEDIUM | gallery.html, index.html |
| Contact form: mobile input sizing | MEDIUM | contact.html |
| Footer gap reduction at 480px | LOW | All |
| Navbar logo size at 480px | LOW | All |

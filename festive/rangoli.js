/* SUKOON - Self-Drawing Rangoli chapter ornaments (Diwali'26 page)
   Injects a gold line-art half-mandala above each `section.cat-block .cat-head` h2.
   Draws itself on scroll-in (IntersectionObserver, once), dots pop, one faint glint sweep.
   Self-contained IIFE. No external requests. Class prefix: rg- */
(function () {
  'use strict';

  function init() {
    var heads = document.querySelectorAll('section.cat-block .cat-head');
    if (!heads.length) return;
    var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    /* ---------- injected styles ---------- */
    var style = document.createElement('style');
    style.textContent = [
      '.rg-svg{display:block;margin:0 auto 12px;overflow:visible}',
      '.rg-svg .rg-s{fill:none;stroke:#C9A84C;stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;',
      'transition:stroke-dashoffset 1.6s cubic-bezier(.45,.05,.35,1);transition-delay:var(--d,0ms)}',
      '.rg-svg .rg-dot{fill:#E8D5A3;stroke:#C9A84C;stroke-width:.6;transform:scale(0);',
      'transform-box:fill-box;transform-origin:center;transition:transform .45s cubic-bezier(.34,1.56,.64,1);transition-delay:var(--d,0ms)}',
      '.rg-svg .rg-bindu{fill:#C9A84C;stroke:none}',
      '.rg-svg.rg-on .rg-s{stroke-dashoffset:0!important;animation:rgGlint .9s ease var(--g,2.9s) 1}',
      '.rg-svg.rg-on .rg-dot{transform:scale(1)}',
      '@keyframes rgGlint{0%,100%{stroke:#C9A84C;filter:none}',
      '45%{stroke:#EFE0AE;filter:drop-shadow(0 0 2.5px rgba(201,168,76,.75))}}',
      /* static fallback (reduced motion / old browsers): fully drawn, no animation */
      '.rg-svg.rg-static .rg-s{transition:none;animation:none!important}',
      '.rg-svg.rg-static .rg-dot{transform:none;transition:none}'
    ].join('\n');
    document.head.appendChild(style);

    /* ---------- geometry helpers (half-mandala, center bottom-middle) ---------- */
    var CX = 60, CY = 52;
    function P(r, a) { /* polar -> "x y" (angle in deg, 0=right, 90=up) */
      var t = a * Math.PI / 180;
      return (CX + r * Math.cos(t)).toFixed(2) + ' ' + (CY - r * Math.sin(t)).toFixed(2);
    }
    function XY(r, a) {
      var t = a * Math.PI / 180;
      return [(CX + r * Math.cos(t)).toFixed(2), (CY - r * Math.sin(t)).toFixed(2)];
    }
    function petal(r0, r1, a, w, round) { /* single-line petal, pointed or dome tip */
      var m = r0 + (r1 - r0) * 0.55;
      var s = 'M' + P(r0, a - w) + ' Q' + P(m, a - w * 1.3) + ' ';
      if (round) s += P(r1, a - 3) + ' Q' + P(r1 + 2.5, a) + ' ' + P(r1, a + 3);
      else s += P(r1, a);
      return s + ' Q' + P(m, a + w * 1.3) + ' ' + P(r0, a + w);
    }
    function arc(r, a0, a1) { /* arc over the top, a0 > a1 */
      return 'M' + P(r, a0) + ' A' + r + ' ' + r + ' 0 0 1 ' + P(r, a1);
    }

    /* ---------- 5 variants, one per chapter (Baithak, Rangreez, Aangan, Utsav, Mukta) ---------- */
    var variants = [
      { n: 7, r0: 13, r1: 42, w: 11,  inner: 19, tip: 'gap' },                    /* 7-petal lotus, dots between petals */
      { n: 9, r0: 14, r1: 41, w: 8.5, inner: 20, outer: 47, tip: 'tip' },         /* 9 slim petals inside an outer ring */
      { n: 5, r0: 13, r1: 41, w: 16,  inner: 19, echo: true, tip: 'gap' },        /* 5 broad petals with inner echo line */
      { n: 8, r0: 14, r1: 37, w: 7.5, inner: 20, rayR: 45, tip: 'ray' },          /* 8 petals + firework rays (Utsav) */
      { n: 6, r0: 13, r1: 38, w: 12,  inner: 19, round: true, pearls: 45 }        /* 6 dome petals + pearl string (Mukta) */
    ];

    function build(v) {
      var S = [], D = [], k, a, step = 180 / v.n;         /* S: [d, drawOrder, midAngle] */
      S.push([arc(7, 180, 0), 0, 90]);                    /* base arc around bindu */
      if (v.inner) S.push([arc(v.inner, 168, 12), 1, 90]);
      for (k = 0; k < v.n; k++) {
        a = 180 - (k + 0.5) * step;                       /* left-to-right */
        S.push([petal(v.r0, v.r1, a, v.w, v.round), 2 + k, a]);
        if (v.echo) S.push([petal(v.r0 + 3.5, v.r1 - 7, a, v.w * 0.55), 2 + k, a]);
      }
      if (v.rayR) for (k = 1; k < v.n; k++) {
        a = 180 - k * step;
        S.push(['M' + P(v.r1 - 2, a) + ' L' + P(v.rayR, a), 2 + k, a]);
      }
      if (v.outer) S.push([arc(v.outer, 174, 6), 2 + v.n, 90]);
      if (v.tip === 'tip') for (k = 0; k < v.n; k++) D.push(XY(v.r1 + 3.5, 180 - (k + 0.5) * step).concat(1.4));
      if (v.tip === 'gap') for (k = 1; k < v.n; k++) D.push(XY(v.r1 - 1, 180 - k * step).concat(1.4));
      if (v.tip === 'ray') for (k = 1; k < v.n; k++) D.push(XY(v.rayR + 3, 180 - k * step).concat(1.3));
      if (v.pearls) for (k = 0; k < 12; k++) D.push(XY(v.pearls, 180 - (k + 0.5) * 15).concat(1.2));

      var out = ['<svg class="rg-svg" viewBox="0 0 120 56" width="120" height="56" aria-hidden="true" focusable="false">'];
      S.forEach(function (s) {
        /* draw delay staggers petals ~120ms; glint delay sweeps left->right after drawing */
        var g = (2.9 + ((180 - s[2]) / 180) * 0.55).toFixed(2);
        out.push('<path class="rg-s" d="' + s[0] + '" style="--d:' + (s[1] * 120) + 'ms;--g:' + g + 's"/>');
      });
      D.forEach(function (d, i) {
        out.push('<circle class="rg-dot" cx="' + d[0] + '" cy="' + d[1] + '" r="' + d[2] + '" style="--d:' + (1750 + i * 70) + 'ms"/>');
      });
      out.push('<circle class="rg-dot rg-bindu" cx="60" cy="49" r="2.1" style="--d:1650ms"/></svg>');
      return out.join('');
    }

    /* ---------- inject + prime (strokes hidden via dashoffset before any paint) ---------- */
    var svgs = [];
    heads.forEach(function (head, i) {
      head.insertAdjacentHTML('afterbegin', build(variants[i % variants.length]));
      var svg = head.firstElementChild;
      if (!svg || !svg.classList.contains('rg-svg')) return;
      svgs.push(svg);
      if (reduced) { svg.classList.add('rg-static'); return; }
      try {
        svg.querySelectorAll('.rg-s').forEach(function (p) {
          var L = Math.ceil(p.getTotalLength()) + 2;
          p.style.strokeDasharray = L + '';
          p.style.strokeDashoffset = L + '';
        });
      } catch (e) { svg.classList.add('rg-static'); }
    });
    if (reduced || !svgs.length) return;

    /* ---------- trigger on scroll-in (own observer; does not touch the page's .reveal one) ---------- */
    if (!('IntersectionObserver' in window)) {
      svgs.forEach(function (s) { s.classList.add('rg-on'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var svg = en.target.firstElementChild;
        if (svg && svg.classList.contains('rg-svg')) svg.classList.add('rg-on');
        io.unobserve(en.target);
      });
    }, { threshold: 0.3 });
    heads.forEach(function (h) { io.observe(h); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

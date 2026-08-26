/* SUKOON - Anar Back-to-Top (Diwali'26 page)
   Restyles #backToTop into a tiny terracotta anar (firework fountain cone).
   Click: existing smooth scroll + a restrained gold spark fountain, then a short
   trail of tiny sparks while the page scrolls up. Prefix: an-  No external requests. */
(function () {
  'use strict';

  function init() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    /* ---------- injected styles ---------- */
    var style = document.createElement('style');
    style.textContent = [
      '.back-to-top.an-anar{background:#FAF7F2;border:1.5px solid rgba(201,168,76,.55)}',
      '.back-to-top.an-anar:hover{background:#FFFDF6;border-color:#C9A84C}',
      '.back-to-top.an-anar.visible:hover{transform:translateY(-2px)}',
      '.back-to-top.an-anar svg{width:22px;height:24px;stroke:none;fill:none}',
      '.an-spark{transform-box:fill-box;transform-origin:center;animation:anGlint 3.2s ease-in-out infinite}',
      '@keyframes anGlint{0%,80%,100%{opacity:.5;transform:scale(.85)}',
      '90%{opacity:1;transform:scale(1.3);filter:drop-shadow(0 0 3px rgba(232,213,163,.9))}}',
      '.an-sp{position:fixed;left:0;top:0;border-radius:50%;pointer-events:none;z-index:899;will-change:transform,opacity}',
      '@media (prefers-reduced-motion:reduce){.an-spark{animation:none;opacity:.65}}'
    ].join('\n');
    document.head.appendChild(style);

    /* ---------- swap chevron for a terracotta anar cone ---------- */
    btn.classList.add('an-anar');
    if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML =
      '<svg viewBox="0 0 24 26" aria-hidden="true" focusable="false">' +
      '<path d="M12 3.2 V5.6" stroke="#8B7355" stroke-width="1.2" stroke-linecap="round"/>' +           /* wick */
      '<path class="an-spark" d="M12 .6 L12.8 2.2 L12 3.8 L11.2 2.2 Z" fill="#E8D5A3" stroke="#C9A84C" stroke-width=".5"/>' +
      '<path d="M9.1 7 L5.7 20.2 Q12 23.4 18.3 20.2 L14.9 7 Z" fill="#8B5A3C"/>' +                      /* cone */
      '<path d="M7.9 12.2 Q12 13.8 16.1 12.2" stroke="#C9A84C" stroke-width=".9" fill="none" opacity=".55" stroke-linecap="round"/>' +
      '<path d="M6.9 16.4 Q12 18.3 17.1 16.4" stroke="#C9A84C" stroke-width=".9" fill="none" opacity=".55" stroke-linecap="round"/>' +
      '<ellipse cx="12" cy="7" rx="3" ry="1.25" fill="#C9A84C"/>' +                                     /* gold rim */
      '</svg>';

    /* ---------- spark fountain (single rAF loop, gravity arcs) ---------- */
    var COLORS = ['#C9A84C', '#E8D5A3', '#DFAF4A', '#F0E2B6'];
    var sparks = [], raf = null, lastT = 0;

    function origin() {
      var r = btn.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + 6 };
    }
    function spawn(n, tiny) {
      if (sparks.length > 90) return;                       /* safety cap */
      var c = origin();
      for (var i = 0; i < n; i++) {
        var el = document.createElement('span');
        var size = tiny ? 2 + Math.random() * 1.5 : 3 + Math.random() * 2.5;
        var col = COLORS[(Math.random() * COLORS.length) | 0];
        el.className = 'an-sp';
        el.style.width = el.style.height = size.toFixed(1) + 'px';
        el.style.background = col;
        el.style.boxShadow = '0 0 ' + (tiny ? 4 : 7) + 'px ' + col;
        document.body.appendChild(el);
        var a = (Math.random() * 60 - 30) * Math.PI / 180;  /* -30deg..+30deg from vertical */
        var v = tiny ? 90 + Math.random() * 90 : 260 + Math.random() * 200;
        sparks.push({
          el: el, x: c.x + (Math.random() * 10 - 5), y: c.y,
          vx: Math.sin(a) * v, vy: -Math.cos(a) * v,
          t: 0, life: tiny ? 420 + Math.random() * 220 : 520 + Math.random() * 380
        });
      }
      if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(step); }
    }
    function step(now) {
      var dt = Math.min(40, now - lastT) / 1000; lastT = now;
      for (var i = sparks.length - 1; i >= 0; i--) {
        var s = sparks[i];
        s.t += dt * 1000;
        if (s.t >= s.life) { s.el.remove(); sparks.splice(i, 1); continue; }
        s.vy += 950 * dt;                                   /* gravity */
        s.x += s.vx * dt; s.y += s.vy * dt;
        var k = 1 - s.t / s.life;
        s.el.style.opacity = (k * k).toFixed(3);
        s.el.style.transform = 'translate3d(' + s.x.toFixed(1) + 'px,' + s.y.toFixed(1) + 'px,0)';
      }
      raf = sparks.length ? requestAnimationFrame(step) : null;
    }

    /* ---------- click: keep existing smooth scroll, add restrained eruption + trail ---------- */
    var trailTimer = null;
    btn.addEventListener('click', function () {
      if (!btn.getAttribute('onclick')) window.scrollTo({ top: 0, behavior: 'smooth' }); /* re-add if inline handler was removed */
      if (reduced) return;                                  /* no particles, just scroll */
      spawn(14 + ((Math.random() * 9) | 0));                /* 14-22 sparks */
      if (trailTimer) clearInterval(trailTimer);
      var ticks = 0;
      trailTimer = setInterval(function () {                /* 2-3 tiny sparks / 200ms, max 1.2s */
        ticks++;
        if (ticks > 6 || window.scrollY < 40) { clearInterval(trailTimer); trailTimer = null; return; }
        spawn(2 + ((Math.random() * 2) | 0), true);
      }, 200);
    });

    /* if the tab is hidden mid-burst, rAF pauses: clear leftovers instead of freezing them */
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) return;
      if (trailTimer) { clearInterval(trailTimer); trailTimer = null; }
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      for (var i = sparks.length - 1; i >= 0; i--) sparks[i].el.remove();
      sparks.length = 0;
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

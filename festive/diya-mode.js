/* ============================================================
   SUKOON - "Diya Mode" | Diwali'26 collection page
   Self-contained. Integrate with:  <script defer src="festive/diya-mode.js"></script>
   Turns the page into a candle-lit dark room: a warm halo of
   light follows the cursor / finger; product photos glow.
   No dependencies, no external requests. Class prefix: dm-
   ============================================================ */
(function () {
  'use strict';

  var LS_KEY = 'sukoon_diya_mode';
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var mqCoarse = window.matchMedia ? window.matchMedia('(hover: none), (pointer: coarse)') : null;
  function reduced() { return !!(mqReduce && mqReduce.matches); }
  function coarse() { return !!(mqCoarse && mqCoarse.matches); }
  function readPref() { try { return localStorage.getItem(LS_KEY); } catch (e) { return null; } }
  function savePref(v) { try { localStorage.setItem(LS_KEY, v); } catch (e) { /* private mode: ignore */ } }
  function elc(tag, cls) { var n = document.createElement(tag); n.className = cls; return n; }

  var CSS = [
    /* toggle button: stacks above the Diya Basket FAB (bottom:24px) */
    '.dm-toggle{position:fixed;left:20px;bottom:24px;z-index:991;width:44px;height:44px;border-radius:50%;',
    '  background:#2C3E50;border:1.5px solid #C9A84C;display:flex;align-items:center;justify-content:center;',
    '  cursor:pointer;padding:0;box-shadow:0 4px 14px rgba(0,0,0,.28);',
    '  transition:box-shadow .4s ease,border-color .4s ease,transform .25s ease}',
    '.dm-toggle:hover{transform:translateY(-2px)}',
    '.dm-toggle:focus-visible{outline:2px solid #E8D5A3;outline-offset:3px}',
    '.dm-toggle svg{display:block}',
    '.dm-toggle.dm-active{border-color:#E8D5A3;box-shadow:0 0 16px rgba(201,168,76,.7),0 0 36px rgba(201,168,76,.32);',
    '  animation:dm-pulse 2.8s ease-in-out infinite}',
    '@keyframes dm-pulse{0%,100%{box-shadow:0 0 14px rgba(201,168,76,.55),0 0 30px rgba(201,168,76,.22)}',
    '  50%{box-shadow:0 0 24px rgba(201,168,76,.9),0 0 48px rgba(201,168,76,.4)}}',
    '@media(max-width:480px){.dm-toggle{left:16px;bottom:24px}}',
    /* darkness overlay: below navbar(1000) and lightbox(2000); never intercepts input */
    '.dm-overlay{position:fixed;inset:0;z-index:990;pointer-events:none!important;opacity:0;transition:opacity .5s ease;',
    '  background:radial-gradient(circle at var(--dm-x,50%) var(--dm-y,42%),',
    '    rgba(255,180,80,0) 0,rgba(255,180,80,0) 150px,rgba(255,180,80,.08) 220px,',
    '    rgba(13,18,27,.55) 330px,rgba(10,16,24,.93) 420px)}',
    '.dm-overlay.dm-visible{opacity:1}',
    '.dm-overlay.dm-suspended{opacity:0}',
    /* while the room is dark, the candles do the talking */
    'body.dm-on .card-carousel img.active{filter:brightness(1.08) saturate(1.05)}',
    'body.dm-on .product-card{box-shadow:0 0 40px rgba(201,168,76,.15)}',
    'body.dm-on .navbar{opacity:.25}',
    'body.dm-on .navbar:focus-within{opacity:1}',
    '@media(hover:hover){body.dm-on .navbar:hover{opacity:1}}',
    /* first-time hint chip */
    '.dm-hint{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(.95);z-index:995;',
    '  pointer-events:none;background:rgba(44,62,80,.96);color:#E8D5A3;border:1px solid rgba(201,168,76,.45);',
    '  border-radius:50px;padding:13px 28px;font-family:\'Cormorant Garamond\',Georgia,serif;font-style:italic;',
    '  font-size:1.15rem;letter-spacing:.4px;text-align:center;max-width:88vw;',
    '  box-shadow:0 10px 36px rgba(0,0,0,.5);opacity:0;transition:opacity .45s ease,transform .45s ease}',
    '.dm-hint.dm-hint-in{opacity:1;transform:translate(-50%,-50%) scale(1)}',
    '@media(prefers-reduced-motion:reduce){.dm-toggle.dm-active{animation:none}}',
    /* ---- the Roshni dock: ladi + moon + label, bottom-left ---------------
       The toggle keeps its own fixed position; the ladi hangs directly above
       it and the label sits beside it, so the three read as one control. */
    '.dm-ladi{position:fixed;left:42px;bottom:72px;z-index:991;transform:translateX(-50%) translateY(-14px);',
    '  border:0;background:none;padding:6px 8px 0;cursor:pointer;display:flex;flex-direction:column;',
    '  align-items:center;opacity:0;transition:opacity .55s ease,transform .6s cubic-bezier(.34,1.28,.64,1)}',
    '.dm-ladi.dm-in{opacity:1;transform:translateX(-50%)}',
    '.dm-ladi:focus-visible{outline:2px solid #E8D5A3;outline-offset:4px;border-radius:8px}',
    '.dm-rope{position:relative;display:flex;flex-direction:column;align-items:center;gap:0;',
    '  padding:3px 0;transform-origin:top center;animation:dm-sway 3.6s ease-in-out infinite;',
    '  background:linear-gradient(#6b5942,#6b5942) center/1.5px 100% no-repeat}',
    '@media(hover:hover){.dm-ladi:hover .dm-rope{animation-duration:1.5s}}',
    '@keyframes dm-sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}',
    /* one cracker: a thin cylinder lashed crosswise to the string */
    '.dm-cr{position:relative;width:17px;height:4px;border-radius:1.5px;',
    '  background:linear-gradient(180deg,#e2604e 0%,#cc3a2f 32%,#a21f26 72%,#7d161b 100%);',
    '  box-shadow:0 1px 0 rgba(110,18,22,.55),inset 0 0 0 .5px rgba(125,22,27,.4)}',
    /* hand-tied strings are never perfectly even */
    '.dm-cr:nth-child(3n){width:15px}.dm-cr:nth-child(4n){width:18px}.dm-cr:nth-child(7n){width:16px}',
    '.dm-fuse{width:1.5px;height:9px;background:linear-gradient(#6b5942,#C9A84C)}',
    /* label beside the moon - the control is never unexplained */
    '.dm-label{position:fixed;left:74px;bottom:33px;z-index:991;pointer-events:none;',
    '  display:flex;align-items:center;gap:7px;padding:6px 13px;border-radius:50px;',
    '  background:rgba(44,62,80,.94);border:1px solid rgba(201,168,76,.42);color:#E8D5A3;',
    '  font-family:"Outfit","Segoe UI",sans-serif;font-size:.68rem;font-weight:600;letter-spacing:1.3px;',
    '  text-transform:uppercase;white-space:nowrap;box-shadow:0 4px 14px rgba(0,0,0,.24);',
    '  opacity:0;transform:translateX(-8px);transition:opacity .5s ease .25s,transform .5s ease .25s}',
    '.dm-label.dm-in{opacity:1;transform:none}',
    '.dm-label b{color:#C9A84C;font-weight:600}',
    '.dm-label.dm-calm{background:rgba(44,62,80,.72);font-size:.62rem;letter-spacing:1.1px;padding:5px 11px}',
    /* firing */
    '.dm-ladi-firing{pointer-events:none}',
    '.dm-ladi-firing .dm-rope{animation:dm-shake .1s linear infinite}',
    '@keyframes dm-shake{0%,100%{transform:translateX(-1.5px) rotate(-1deg)}',
    '  50%{transform:translateX(1.5px) rotate(1deg)}}',
    '.dm-cr-pop{animation:dm-pop .34s ease both}',
    '@keyframes dm-pop{0%{transform:scaleX(1)}30%{transform:scaleX(2.1);filter:brightness(3.4) saturate(.15)}',
    '  100%{transform:scaleX(.3);opacity:0}}',
    '.dm-spark{position:absolute;left:50%;top:50%;width:4px;height:4px;border-radius:50%;background:#FFDC95;',
    '  box-shadow:0 0 7px #FFC24D;pointer-events:none;animation:dm-spark .55s ease-out both}',
    '@keyframes dm-spark{0%{transform:translate(-50%,-50%) scale(1);opacity:1}',
    '  100%{transform:translate(calc(-50% + var(--sx)),calc(-50% + var(--sy))) scale(.2);opacity:0}}',
    '.dm-flash{position:fixed;inset:0;z-index:989;pointer-events:none;',
    '  background:radial-gradient(circle at 6% 88%,rgba(255,216,145,.85),rgba(255,170,60,.3) 30%,transparent 58%);',
    '  animation:dm-flash .6s ease-out both}',
    '@keyframes dm-flash{0%{opacity:0}16%{opacity:1}100%{opacity:0}}',
    '@media(max-width:480px){.dm-ladi{left:38px;bottom:74px}.dm-label{left:68px;bottom:33px;font-size:.62rem}',
    '  .dm-cr:nth-of-type(n+10){display:none}}',
    '@media(prefers-reduced-motion:reduce){.dm-toggle.dm-active{animation:none}',
    '  .dm-rope{animation:none}.dm-ladi{transition:opacity .4s ease}}'
  ].join('\n');

  var GLYPH =
    '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">' +
    '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#E8D5A3"/>' +
    '<path d="M17.4 2.6c1.1 1.4 1.7 2.5 1.7 3.4a1.7 1.7 0 0 1-3.4 0c0-.9.6-2 1.7-3.4z" fill="#C9A84C"/>' +
    '</svg>';

  function boot() {
    /* Scoped to the collection page: no product cards, no Diya Mode. */
    if (!document.body || !document.querySelector('.product-card')) return;
    if (document.getElementById('dm-toggle')) return; /* already booted */

    var style = document.createElement('style');
    style.id = 'dm-style';
    style.textContent = CSS;
    document.head.appendChild(style);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'dm-toggle';
    btn.className = 'dm-toggle';
    btn.setAttribute('aria-label', 'Diya Mode');
    btn.setAttribute('aria-pressed', 'false');
    btn.title = 'Diya Mode';
    btn.innerHTML = GLYPH;
    document.body.appendChild(btn);

    var overlay = document.createElement('div');
    overlay.className = 'dm-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    var on = false, suspended = false, rafId = null, removeTimer = null;
    var hintShown = false, snapQueued = false, touchActive = false;
    var tx = window.innerWidth / 2, ty = window.innerHeight * 0.42; /* target */
    var cx = tx, cy = ty;                                           /* eased position */
    var lastInput = 0, driftT0 = 0;

    function apply() {
      overlay.style.setProperty('--dm-x', cx.toFixed(1) + 'px');
      overlay.style.setProperty('--dm-y', cy.toFixed(1) + 'px');
    }

    function frame(now) {
      if (!on || suspended) { rafId = null; return; } /* loop fully stops when mode is off */
      /* idle lissajous drift: touch devices only, when no finger is down */
      if (coarse() && !touchActive && now - lastInput > 3000) {
        var t = (now - driftT0) / 1000;
        tx = window.innerWidth * (0.5 + 0.30 * Math.sin(t * 0.23));
        ty = window.innerHeight * (0.45 + 0.26 * Math.sin(t * 0.37 + 1.3));
      }
      cx += (tx - cx) * 0.15; /* flame-light easing */
      cy += (ty - cy) * 0.15;
      apply();
      rafId = requestAnimationFrame(frame);
    }

    function startLoop() {
      if (!on || suspended) return;
      if (reduced()) { cx = tx; cy = ty; apply(); return; } /* snap; no continuous loop */
      if (rafId === null) rafId = requestAnimationFrame(frame);
    }
    function stopLoop() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }

    /* pointer / finger tracking (rAF-throttled: loop reads latest target once per frame) */
    function setTarget(x, y) {
      tx = x; ty = y; lastInput = performance.now();
      if (on && !suspended && reduced() && !snapQueued) { /* reduced motion: snap, one write per frame */
        snapQueued = true;
        requestAnimationFrame(function () {
          snapQueued = false;
          if (on && !suspended) { cx = tx; cy = ty; apply(); }
        });
      }
    }
    window.addEventListener('pointermove', function (e) { setTarget(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (e.touches && e.touches[0]) setTarget(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchstart', function (e) {
      touchActive = true;
      if (e.touches && e.touches[0]) setTarget(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener('touchend', function () { touchActive = false; lastInput = performance.now(); }, { passive: true });
    window.addEventListener('touchcancel', function () { touchActive = false; lastInput = performance.now(); }, { passive: true });

    function showHint(text) {
      var chip = document.createElement('div');
      chip.className = 'dm-hint';
      chip.setAttribute('aria-hidden', 'true');
      chip.textContent = text || 'Raat ho gayi… apni roshni le aao 🕯️';
      document.body.appendChild(chip);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { chip.classList.add('dm-hint-in'); });
      });
      setTimeout(function () {
        chip.classList.remove('dm-hint-in');
        setTimeout(function () { if (chip.parentNode) chip.parentNode.removeChild(chip); }, 500);
      }, 2500);
    }

    function activate(quiet) {
      if (on) return;
      on = true;
      if (removeTimer) { clearTimeout(removeTimer); removeTimer = null; }
      document.body.classList.add('dm-on');
      btn.classList.add('dm-active');
      btn.setAttribute('aria-pressed', 'true');
      setLabel();
      suspended = false;
      overlay.classList.remove('dm-suspended');
      if (!overlay.parentNode) document.body.appendChild(overlay);
      cx = tx; cy = ty; apply();
      driftT0 = performance.now(); lastInput = driftT0;
      void overlay.offsetWidth; /* commit opacity:0 so the fade-in transition runs */
      overlay.classList.add('dm-visible');
      var lb = document.getElementById('lightbox');
      if (lb && lb.classList.contains('active')) suspend(); else startLoop();
      savePref('on');
      if (!quiet && !hintShown) showHint();
      hintShown = true;
    }

    function deactivate() {
      if (!on) return;
      on = false;
      document.body.classList.remove('dm-on');
      btn.classList.remove('dm-active');
      btn.setAttribute('aria-pressed', 'false');
      setLabel();
      overlay.classList.remove('dm-visible');
      stopLoop();
      removeTimer = setTimeout(function () { /* fade 500ms, then remove from DOM */
        removeTimer = null;
        if (!on && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }, 520);
      savePref('off');
    }

    btn.addEventListener('click', function () { if (on) deactivate(); else activate(false); });

    /* Lightbox truce: hide the darkness while the lightbox (z2000) is open. */
    function suspend() {
      if (!on || suspended) return;
      suspended = true;
      overlay.classList.add('dm-suspended');
      stopLoop();
    }
    function resume() {
      if (!suspended) return;
      suspended = false;
      overlay.classList.remove('dm-suspended');
      if (on) startLoop();
    }
    var lightbox = document.getElementById('lightbox');
    if (lightbox && window.MutationObserver) {
      new MutationObserver(function () {
        if (lightbox.classList.contains('active')) suspend(); else resume();
      }).observe(lightbox, { attributes: true, attributeFilter: ['class'] });
    }
    /* eager hide on the click that opens the lightbox
       (carousel arrows/dots stopPropagation, so they never reach this) */
    document.addEventListener('click', function (e) {
      if (!on || !e.target || !e.target.closest) return;
      if (e.target.closest('.card-carousel')) {
        suspend();
        setTimeout(function () { /* safety: restore if no lightbox actually opened */
          var el = document.getElementById('lightbox');
          if (!el || !el.classList.contains('active')) resume();
        }, 400);
      }
    });

    /* Escape exits Diya Mode - unless the lightbox owns the key right now */
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !on) return;
      var el = document.getElementById('lightbox');
      if (el && el.classList.contains('active')) return; /* lightbox closes; darkness resumes */
      if (document.querySelector('.db-root.db-open')) return; /* basket owns this Escape */
      deactivate();
    }, true); /* capture: run before lightbox/basket handlers consume state */

    /* ---- the Roshni dock -----------------------------------------------
       Diya Mode used to be an unlabelled moon in the corner. Now a short
       ladi hangs just above it with its fuse pointing down into it, and a
       label sits alongside. Light the ladi and the crackers run up the
       string, the corner flares, and the room goes dark around the candles.
       The ladi retires after one use; the label stays for good, so the
       moon is never a mystery button again. */
    var ladi = null, label = null, ladiFired = false;

    function setLabel() {
      if (!label) return;
      if (ladi && !ladiFired) return;              /* invitation still standing */
      label.classList.add('dm-calm');
      label.textContent = on ? 'Roshni on' : 'Roshni';
    }

    function buildLabel() {
      label = elc('div', 'dm-label');
      label.setAttribute('aria-hidden', 'true');   /* the button carries the real name */
      document.body.appendChild(label);
      if (on) {
        setLabel();
      } else {
        label.appendChild(document.createTextNode('Click for '));
        label.appendChild(elc('b', '')).textContent = 'Roshni';
      }
    }

    function retireLadi() {
      if (!ladi) return;
      var node = ladi;
      ladi = null;
      node.classList.remove('dm-in');
      setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 600);
      setLabel();
    }

    function burstAt(cracker) {
      for (var k = 0; k < 3; k++) {
        var sp = elc('span', 'dm-spark');
        var a = (Math.PI * 2 * k) / 3 + Math.random();
        var d = 14 + Math.random() * 18;
        sp.style.setProperty('--sx', (Math.cos(a) * d).toFixed(1) + 'px');
        sp.style.setProperty('--sy', (Math.sin(a) * d).toFixed(1) + 'px');
        sp.style.animationDelay = (Math.random() * 0.06).toFixed(2) + 's';
        cracker.appendChild(sp);
      }
    }

    function fireLadi() {
      if (ladiFired || !ladi) return;
      ladiFired = true;

      if (reduced()) { retireLadi(); activate(true); return; }

      ladi.classList.add('dm-ladi-firing');
      /* the fuse hangs at the bottom, so the string burns upward from it */
      var crackers = [].slice.call(ladi.querySelectorAll('.dm-cr')).reverse();
      crackers.forEach(function (c, i) {
        setTimeout(function () { c.classList.add('dm-cr-pop'); burstAt(c); }, i * 34);
      });

      setTimeout(function () {
        var flash = elc('div', 'dm-flash');
        flash.setAttribute('aria-hidden', 'true');
        document.body.appendChild(flash);
        setTimeout(function () { if (flash.parentNode) flash.parentNode.removeChild(flash); }, 700);
        activate(true);
        retireLadi();
      }, crackers.length * 34);
    }

    function buildLadi() {
      if (ladi || on) return;
      ladi = document.createElement('button');
      ladi.type = 'button';
      ladi.className = 'dm-ladi';
      ladi.setAttribute('aria-label', 'Light the ladi and turn on Diya Mode');

      var rope = elc('div', 'dm-rope');
      for (var i = 0; i < 13; i++) rope.appendChild(elc('span', 'dm-cr'));
      rope.appendChild(elc('span', 'dm-fuse'));   /* fuse points down at the moon */
      ladi.appendChild(rope);
      ladi.addEventListener('click', fireLadi);
      document.body.appendChild(ladi);

      function show() { if (ladi) ladi.classList.add('dm-in'); }
      requestAnimationFrame(function () { requestAnimationFrame(show); });
      setTimeout(show, 120);   /* rAF is throttled in a background tab */
    }

    buildLabel();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { if (label) label.classList.add('dm-in'); });
    });
    setTimeout(function () { if (label) label.classList.add('dm-in'); }, 140);

    /* found the moon on their own: the ladi has done its job */
    btn.addEventListener('click', function () { ladiFired = true; retireLadi(); });

    /* Every visit opens with the room unlit and the ladi waiting - the draw
       is the lighting of it, so restoring a saved "on" would spend the
       moment before anyone saw it. */
    setTimeout(buildLadi, 900);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

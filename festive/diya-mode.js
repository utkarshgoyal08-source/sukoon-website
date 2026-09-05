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
  var LADI_KEY = 'sukoon_diya_ladi';
  var mqReduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var mqCoarse = window.matchMedia ? window.matchMedia('(hover: none), (pointer: coarse)') : null;
  function reduced() { return !!(mqReduce && mqReduce.matches); }
  function coarse() { return !!(mqCoarse && mqCoarse.matches); }
  function readPref() { try { return localStorage.getItem(LS_KEY); } catch (e) { return null; } }
  function savePref(v) { try { localStorage.setItem(LS_KEY, v); } catch (e) { /* private mode: ignore */ } }
  function readLadi() { try { return localStorage.getItem(LADI_KEY); } catch (e) { return null; } }
  function saveLadi(v) { try { localStorage.setItem(LADI_KEY, v); } catch (e) { /* private mode: ignore */ } }
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
    /* ---- the "ladi": a hanging string of crackers that lights the room ---- */
    '.dm-ladi{position:fixed;top:86px;right:26px;z-index:995;border:0;background:none;padding:0;cursor:pointer;',
    '  display:flex;flex-direction:column;align-items:center;opacity:0;transform:translateY(-18px);',
    '  transition:opacity .6s ease,transform .7s cubic-bezier(.34,1.28,.64,1)}',
    '.dm-ladi.dm-ladi-in{opacity:1;transform:none}',
    '.dm-ladi:focus-visible{outline:2px solid #E8D5A3;outline-offset:6px;border-radius:10px}',
    '.dm-ladi-rope{display:flex;flex-direction:column;align-items:center;gap:3px;transform-origin:top center;',
    '  animation:dm-sway 3.8s ease-in-out infinite}',
    '@media(hover:hover){.dm-ladi:hover .dm-ladi-rope{animation-duration:1.6s}}',
    '@keyframes dm-sway{0%,100%{transform:rotate(-2.4deg)}50%{transform:rotate(2.4deg)}}',
    '.dm-ladi-str{width:2px;height:22px;background:linear-gradient(#8B7355,#6b5942)}',
    '.dm-cr{position:relative;width:13px;height:25px;border-radius:3px;',
    '  background:linear-gradient(90deg,#8d1c21 0%,#d3372e 45%,#a91f26 100%);',
    '  box-shadow:inset -2px 0 3px rgba(0,0,0,.32)}',
    '.dm-cr::after{content:"";position:absolute;left:0;right:0;top:9px;height:5px;',
    '  background:linear-gradient(#e8d5a3,#c9a84c)}',
    '.dm-ladi-fuse{width:2px;height:15px;background:linear-gradient(#6b5942,#C9A84C)}',
    /* caption + curved arrow, sitting to the left of the string */
    '.dm-ladi-tag{position:fixed;top:112px;right:74px;z-index:995;pointer-events:none;display:flex;',
    '  align-items:center;gap:2px;color:#C9A84C;font-family:"Cormorant Garamond",Georgia,serif;',
    '  font-style:italic;font-size:1.12rem;letter-spacing:.3px;white-space:nowrap;opacity:0;',
    '  transform:translateX(10px);transition:opacity .6s ease .3s,transform .6s ease .3s}',
    '.dm-ladi-tag.dm-ladi-in{opacity:1;transform:none}',
    '.dm-ladi-tag svg{display:block;flex:none}',
    /* firing */
    '.dm-ladi-firing{pointer-events:none}',
    '.dm-ladi-firing .dm-ladi-rope{animation:dm-shake .11s linear infinite}',
    '@keyframes dm-shake{0%,100%{transform:translateX(-1.6px) rotate(-1deg)}',
    '  50%{transform:translateX(1.6px) rotate(1deg)}}',
    '.dm-cr-pop{animation:dm-pop .42s ease both}',
    '@keyframes dm-pop{0%{transform:scale(1)}22%{transform:scale(1.55);filter:brightness(3.2) saturate(.2)}',
    '  100%{transform:scale(.2);opacity:0}}',
    '.dm-spark{position:absolute;left:50%;top:50%;width:4px;height:4px;border-radius:50%;background:#FFDC95;',
    '  box-shadow:0 0 7px #FFC24D;pointer-events:none;animation:dm-spark .6s ease-out both}',
    '@keyframes dm-spark{0%{transform:translate(-50%,-50%) scale(1);opacity:1}',
    '  100%{transform:translate(calc(-50% + var(--sx)),calc(-50% + var(--sy))) scale(.2);opacity:0}}',
    '.dm-flash{position:fixed;inset:0;z-index:994;pointer-events:none;',
    '  background:radial-gradient(circle at 90% 20%,rgba(255,216,145,.8),rgba(255,170,60,.28) 32%,transparent 60%);',
    '  animation:dm-flash .6s ease-out both}',
    '@keyframes dm-flash{0%{opacity:0}16%{opacity:1}100%{opacity:0}}',
    '@media(max-width:600px){.dm-ladi{top:74px;right:14px}.dm-cr{width:11px;height:21px}',
    '  .dm-ladi-tag{top:96px;right:56px;font-size:.98rem}}',
    '@media(prefers-reduced-motion:reduce){.dm-ladi-rope{animation:none}.dm-ladi{transition:opacity .4s ease}}'
  ].join('\n');

  var ARROW =
    '<svg viewBox="0 0 44 30" width="44" height="30" aria-hidden="true" focusable="false">' +
    '<path d="M2 24C10 26 26 24 33 9" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-dasharray="3 3.5"/>' +
    '<path d="M27 10.5 33.5 7 35 14" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round"/>' +
    '</svg>';

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

    /* ---- the ladi: an invitation nobody can miss ----------------------
       A string of crackers hangs into the top-right corner behind a curved
       arrow reading "Click for Roshni". Clicking it pops the crackers
       bottom-to-top and drops the page into Diya Mode. Shown once per
       visitor - after that, the moon toggle is the control. */
    var ladi = null, ladiTag = null, ladiFired = false;

    function removeLadi() {
      [ladi, ladiTag].forEach(function (n) {
        if (!n) return;
        n.classList.remove('dm-ladi-in');
        setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, 650);
      });
      ladi = ladiTag = null;
    }

    function burstAt(cracker) {
      for (var k = 0; k < 5; k++) {
        var sp = elc('span', 'dm-spark');
        var a = (Math.PI * 2 * k) / 5 + Math.random();
        var d = 16 + Math.random() * 20;
        sp.style.setProperty('--sx', (Math.cos(a) * d).toFixed(1) + 'px');
        sp.style.setProperty('--sy', (Math.sin(a) * d).toFixed(1) + 'px');
        sp.style.animationDelay = (Math.random() * 0.06).toFixed(2) + 's';
        cracker.appendChild(sp);
      }
    }

    function lightTheRoom() {
      activate(true);
      showHint('Roshni on 🪔 — chaand se kabhi bhi band karein');
      removeLadi();
    }

    function fireLadi() {
      if (ladiFired) return;
      ladiFired = true;
      saveLadi('done');
      if (ladiTag) ladiTag.classList.remove('dm-ladi-in');

      if (reduced()) { lightTheRoom(); return; } /* no bangs: just light the room */

      ladi.classList.add('dm-ladi-firing');
      var crackers = [].slice.call(ladi.querySelectorAll('.dm-cr')).reverse(); /* fuse end first */
      crackers.forEach(function (c, i) {
        setTimeout(function () { c.classList.add('dm-cr-pop'); burstAt(c); }, i * 95);
      });

      setTimeout(function () { /* the bang that lights the room */
        var flash = elc('div', 'dm-flash');
        flash.setAttribute('aria-hidden', 'true');
        document.body.appendChild(flash);
        setTimeout(function () { if (flash.parentNode) flash.parentNode.removeChild(flash); }, 700);
        lightTheRoom();
      }, crackers.length * 95);
    }

    function buildLadi() {
      if (ladi || on) return;

      ladi = document.createElement('button');
      ladi.type = 'button';
      ladi.className = 'dm-ladi';
      ladi.setAttribute('aria-label', 'Light the ladi and turn on Diya Mode');

      var rope = elc('div', 'dm-ladi-rope');
      rope.appendChild(elc('span', 'dm-ladi-str'));
      for (var i = 0; i < 9; i++) rope.appendChild(elc('span', 'dm-cr'));
      rope.appendChild(elc('span', 'dm-ladi-fuse'));
      ladi.appendChild(rope);
      ladi.addEventListener('click', fireLadi);

      ladiTag = elc('div', 'dm-ladi-tag');
      ladiTag.setAttribute('aria-hidden', 'true');
      ladiTag.appendChild(document.createTextNode('Click for Roshni'));
      ladiTag.insertAdjacentHTML('beforeend', ARROW);

      document.body.appendChild(ladi);
      document.body.appendChild(ladiTag);

      function showLadi() { /* rAF can be throttled in a background tab; the timer is the backstop */
        if (!ladi) return;
        ladi.classList.add('dm-ladi-in');
        ladiTag.classList.add('dm-ladi-in');
      }
      requestAnimationFrame(function () { requestAnimationFrame(showLadi); });
      setTimeout(showLadi, 120);
    }

    /* found the moon on their own: the ladi has done its job */
    btn.addEventListener('click', function () { saveLadi('done'); removeLadi(); });

    /* restore saved preference, quietly (no hint) */
    if (readPref() === 'on') activate(true);
    else if (readLadi() !== 'done') setTimeout(buildLadi, 1100);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

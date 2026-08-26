/* ============================================================
   SUKOON · Paanch Diye — hidden diya treasure hunt (Diwali'26)
   ------------------------------------------------------------
   The five chapter dividers (section.cat-block .cat-head .rule span)
   become tappable diyas. Light all five to unlock a hidden
   "Chapter Six — Sukoon" founders' note (code word: PANCHDEEP).
   Progress persists in localStorage("sukoon_paanch_diye").
   Self-contained IIFE: injects its own <style>; the only global is
   window.sukoonPaanchDiye (debug: .lit, .total, .reset()).
   Does nothing, silently, on pages without these selectors.
   Usage: <script defer src="festive/paanch-diye.js"></script>
   ============================================================ */
(function () {
  'use strict';

  var KEY = 'sukoon_paanch_diye';
  var DIYA = '🪔'; /* diya lamp emoji U+1FA94 */
  var SPARKLE = '✨';
  var STAR = '✦';
  var reduced = false;
  try { reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var WA = 'https://wa.me/917264011700?text=' +
    encodeURIComponent('Hi! I found all Paanch Diye ' + DIYA + ' — code PANCHDEEP');

  var CSS = [
    '/* Paanch Diye (injected) */',
    '.cat-head .rule span.pd-diya{display:inline-block;cursor:pointer;padding:11px 16px;margin:-11px -16px;-webkit-tap-highlight-color:transparent;touch-action:manipulation;user-select:none;-webkit-user-select:none;filter:grayscale(1) brightness(.95);opacity:.5;transition:filter .5s ease,opacity .5s ease,transform .25s ease}',
    '.cat-head .rule span.pd-diya:not(.pd-lit):active{transform:scale(.88)}',
    '.cat-head .rule span.pd-diya:focus-visible{outline:2px solid #C9A84C;outline-offset:2px;border-radius:10px}',
    '.cat-head .rule span.pd-diya.pd-lit{cursor:default;opacity:1;filter:drop-shadow(0 0 5px rgba(201,168,76,.95)) drop-shadow(0 0 16px rgba(201,168,76,.5))}',
    '@media (prefers-reduced-motion:no-preference){',
    '.cat-head .rule span.pd-diya:not(.pd-lit){animation:pdPulse 2.8s ease-in-out infinite}',
    '.cat-head .rule span.pd-diya.pd-flare{animation:pdFlare .75s cubic-bezier(.34,1.56,.44,1)}',
    '}',
    '@keyframes pdPulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:.75;transform:scale(1.08)}}',
    '@keyframes pdFlare{0%{transform:scale(1)}38%{transform:scale(1.45)}100%{transform:scale(1)}}',
    '.pd-spark{position:fixed;z-index:950;pointer-events:none;color:#C9A84C;text-shadow:0 0 8px rgba(201,168,76,.55);animation:pdFloat .95s ease-out forwards}',
    '@keyframes pdFloat{0%{opacity:1;transform:translate(-50%,-50%) scale(.55)}100%{opacity:0;transform:translate(calc(-50% + var(--pd-dx,0px)),calc(-50% + var(--pd-dy,-52px))) scale(1.2)}}',
    '.pd-chip{position:fixed;left:50%;bottom:20px;z-index:905;transform:translate(-50%,12px);opacity:0;pointer-events:none;display:flex;align-items:center;gap:9px;background:#2C3E50;border:1px solid rgba(201,168,76,.55);border-radius:50px;padding:8px 16px;box-shadow:0 6px 24px rgba(44,62,80,.3);font-family:\'Outfit\',\'Segoe UI\',sans-serif;font-size:.7rem;letter-spacing:1.1px;color:rgba(250,247,242,.92);white-space:nowrap;transition:opacity .45s ease,transform .45s ease}',
    '.pd-chip.pd-on{opacity:1;transform:translate(-50%,0)}',
    '.pd-chip .pd-dots{display:flex;gap:5px;line-height:1}',
    '.pd-chip .pd-dots span{font-size:.8rem;filter:grayscale(1);opacity:.35;transition:filter .4s ease,opacity .4s ease}',
    '.pd-chip .pd-dots span.pd-lit{filter:drop-shadow(0 0 4px rgba(232,213,163,.95));opacity:1}',
    '.pd-chip b{color:#E8D5A3;font-weight:600}',
    '.pd-ch6{padding:92px 24px;text-align:center;border-top:1px solid rgba(201,168,76,.25);background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(232,213,163,.3),rgba(232,213,163,0) 70%) #FAF7F2;opacity:0;transform:translateY(28px);transition:opacity .9s cubic-bezier(.25,.46,.45,.94),transform .9s cubic-bezier(.25,.46,.45,.94)}',
    '.pd-ch6.pd-show{opacity:1;transform:none}',
    '.pd-ch6-inner{max-width:620px;margin:0 auto}',
    '.pd-ch6 .pd-kicker{font-family:\'Outfit\',\'Segoe UI\',sans-serif;font-size:.68rem;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;font-weight:600;margin-bottom:10px}',
    '.pd-ch6 h2{font-family:\'Cormorant Garamond\',Georgia,serif;font-size:clamp(1.6rem,3.5vw,2.3rem);color:#2C3E50;font-weight:500;line-height:1.25}',
    '.pd-ch6 .pd-rule{display:flex;align-items:center;justify-content:center;gap:12px;margin:16px auto 22px}',
    '.pd-ch6 .pd-rule::before,.pd-ch6 .pd-rule::after{content:\'\';width:44px;height:1.5px;background:#C9A84C}',
    '.pd-ch6 .pd-rule span{font-size:1.1rem;filter:drop-shadow(0 0 6px rgba(201,168,76,.75))}',
    '.pd-ch6 .pd-note{font-family:\'Cormorant Garamond\',Georgia,serif;font-style:italic;font-size:1.22rem;line-height:1.7;color:#8B7355;margin:0 0 14px}',
    '.pd-ch6 .pd-note b{color:#2C3E50;font-weight:600;letter-spacing:1px}',
    '.pd-ch6 .pd-sign{font-family:\'Cormorant Garamond\',Georgia,serif;font-style:italic;font-size:1.08rem;color:#2C3E50;margin-bottom:30px}',
    '.pd-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;min-height:44px;border-radius:50px;font-family:\'Outfit\',\'Segoe UI\',sans-serif;font-size:.72rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#C9A84C;border:1.5px solid #C9A84C;background:transparent;transition:background .3s,color .3s;text-decoration:none}',
    '.pd-btn:hover{background:#C9A84C;color:#fff}',
    '@media(max-width:480px){.pd-ch6{padding:70px 18px}}'
  ].join('\n');

  function loadState() {
    try {
      var arr = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (!Array.isArray(arr)) return [];
      var out = [];
      arr.forEach(function (n) { if (typeof n === 'number' && n >= 0 && out.indexOf(n) < 0) out.push(n); });
      return out;
    } catch (e) { return []; }
  }
  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
  }

  function init() {
    if (window.sukoonPaanchDiye) return; /* never double-init */
    var blocks = document.querySelectorAll('section.cat-block');
    var diyas = [];
    for (var i = 0; i < blocks.length; i++) {
      var span = blocks[i].querySelector('.cat-head .rule span');
      if (span) {
        var h = blocks[i].querySelector('.cat-head h2');
        diyas.push({ span: span, name: (h && h.textContent) ? h.textContent.trim() : 'Chapter ' + (diyas.length + 1) });
      }
    }
    var total = diyas.length;
    if (!total) return; /* not the collection page — stay silent */

    try {
      var st = document.createElement('style');
      st.textContent = CSS;
      (document.head || document.documentElement).appendChild(st);
    } catch (e) { return; }

    var lit = loadState().filter(function (n) { return n < total; });
    var chip = null, dots = [], countEl = null, completed = false;

    function sparks(x, y, n, spread, chars) {
      if (reduced || !document.body) return;
      for (var k = 0; k < n; k++) {
        var s = document.createElement('span');
        s.className = 'pd-spark';
        s.textContent = chars[k % chars.length];
        s.style.left = x + 'px';
        s.style.top = y + 'px';
        s.style.fontSize = (0.65 + Math.random() * 0.5) + 'rem';
        s.style.setProperty('--pd-dx', ((Math.random() - 0.5) * spread).toFixed(0) + 'px');
        s.style.setProperty('--pd-dy', (-30 - Math.random() * spread * 0.7).toFixed(0) + 'px');
        s.style.animationDelay = (Math.random() * 0.12).toFixed(2) + 's';
        document.body.appendChild(s);
        (function (el) { setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 1400); })(s);
      }
    }

    function ensureChip() {
      if (chip) return;
      chip = document.createElement('div');
      chip.className = 'pd-chip';
      chip.setAttribute('aria-live', 'polite');
      var dwrap = document.createElement('span');
      dwrap.className = 'pd-dots';
      dwrap.setAttribute('aria-hidden', 'true');
      for (var k = 0; k < total; k++) {
        var dd = document.createElement('span');
        dd.textContent = DIYA;
        dwrap.appendChild(dd);
        dots.push(dd);
      }
      var txt = document.createElement('span');
      countEl = document.createElement('b');
      txt.appendChild(countEl);
      txt.appendChild(document.createTextNode(' / ' + total + ' diye jale'));
      chip.appendChild(dwrap);
      chip.appendChild(txt);
      document.body.appendChild(chip);
      void chip.offsetWidth; /* reflow so the entrance transition runs */
      chip.classList.add('pd-on');
    }
    function updateChip() {
      if (!lit.length) return;
      ensureChip();
      countEl.textContent = String(lit.length);
      dots.forEach(function (dd, k) { dd.classList.toggle('pd-lit', lit.indexOf(k) > -1); });
    }

    function setLabel(idx, isLit) {
      var s = diyas[idx].span;
      s.setAttribute('aria-pressed', isLit ? 'true' : 'false');
      s.setAttribute('aria-label', isLit ? diyas[idx].name + ' diya is lit' : 'Hidden diya of ' + diyas[idx].name + ' — tap to light');
    }
    function applyLit(idx, animate) {
      var s = diyas[idx].span;
      s.classList.add('pd-lit');
      setLabel(idx, true);
      if (animate && !reduced) {
        s.classList.add('pd-flare');
        setTimeout(function () { s.classList.remove('pd-flare'); }, 800);
        var r = s.getBoundingClientRect();
        sparks(r.left + r.width / 2, r.top + r.height / 2, 4, 60, [SPARKLE, STAR, SPARKLE]);
      }
    }
    function tap(idx) {
      if (lit.indexOf(idx) > -1) return;
      lit.push(idx);
      save(lit);
      applyLit(idx, true);
      updateChip();
      if (lit.length === total) complete(true);
    }

    function buildChapter(shown) {
      var ex = document.querySelector('.pd-ch6');
      if (ex) return ex;
      var sec = document.createElement('section');
      sec.className = 'pd-ch6' + (shown ? ' pd-show' : '');
      sec.id = 'pd-chapter-six';
      sec.innerHTML =
        '<div class="pd-ch6-inner">' +
        '<p class="pd-kicker">The Hidden Chapter</p>' +
        '<h2>Chapter Six &mdash; Sukoon</h2>' +
        '<div class="pd-rule" aria-hidden="true"><span>' + DIYA + '</span></div>' +
        '<p class="pd-note">Paanch ke paanch diye dhoondh liye &mdash; kamaal ho aap! Somewhere between Baithak and Mukta, aapne wahi kiya jo humein sabse pyaara hai: ruk kar roshni dhoondhna. WhatsApp us the word <b>PANCHDEEP</b> and we’ll tuck a chhota sa shagun into your next order &mdash; hamari taraf se, pyaar ke saath.</p>' +
        '<p class="pd-sign">&mdash; Pallak &amp; Sakshi</p>' +
        '<a class="pd-btn" href="' + WA + '" target="_blank" rel="noopener">WhatsApp &ldquo;PANCHDEEP&rdquo;</a>' +
        '</div>';
      var cta = document.querySelector('section.cta-banner');
      if (cta && cta.parentNode) { cta.parentNode.insertBefore(sec, cta); }
      else {
        var f = document.querySelector('footer');
        if (f && f.parentNode) { f.parentNode.insertBefore(sec, f); } else { document.body.appendChild(sec); }
      }
      return sec;
    }
    function complete(celebrate) {
      if (completed) return;
      completed = true;
      var sec = buildChapter(!celebrate);
      if (!celebrate) return; /* restored from storage: no fanfare, no scroll */
      if (chip) {
        setTimeout(function () {
          var r = chip.getBoundingClientRect();
          sparks(r.left + r.width / 2, r.top + r.height / 2, 12, 180, [STAR, SPARKLE, DIYA]);
        }, 300);
      }
      void sec.offsetWidth;
      requestAnimationFrame(function () { sec.classList.add('pd-show'); });
      setTimeout(function () {
        try { sec.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); }
        catch (e) { try { sec.scrollIntoView(); } catch (e2) {} }
      }, 1000);
    }

    diyas.forEach(function (d, idx) {
      var s = d.span;
      s.classList.add('pd-diya');
      s.setAttribute('role', 'button');
      s.setAttribute('tabindex', '0');
      setLabel(idx, false);
      s.addEventListener('click', function () { tap(idx); });
      s.addEventListener('keydown', function (ev) {
        if (ev.key === 'Enter' || ev.key === ' ' || ev.key === 'Spacebar') { ev.preventDefault(); tap(idx); }
      });
    });

    /* restore persisted progress */
    if (lit.length) {
      lit.forEach(function (idx) { applyLit(idx, false); });
      updateChip();
      if (lit.length === total) complete(false);
    }

    window.sukoonPaanchDiye = {
      get lit() { return lit.slice(); },
      total: total,
      reset: function () { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); }
    };
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }
})();

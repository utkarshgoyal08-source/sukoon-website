/* ============================================================
   SUKOON — "The Sukoon Moment"
   Hidden brand easter egg. Type s-u-k-o-o-n (desktop) or tap the
   navbar logo 5x within 3s (mobile). Also: window.sukoonMoment()
   Self-contained IIFE. Injects its own CSS (prefix: sm-).
   ============================================================ */
(function () {
  'use strict';
  if (window.sukoonMoment) return; // double-include guard

  var LS_KEY = 'sukoon_moment_count';
  var active = false, coolUntil = 0, veil = null, endT = 0, prevOverflow = '';

  var CSS = [
    '.sm-veil{position:fixed;inset:0;z-index:2600;display:flex;align-items:center;justify-content:center;',
    'background:radial-gradient(120% 120% at 50% 40%,#1b2a38 0%,#16222e 55%,#101a24 100%);',
    'opacity:0;transition:opacity .8s ease;cursor:default}',
    '.sm-veil,.sm-veil *{cursor:default}',
    '.sm-veil.sm-in{opacity:1}',
    '.sm-veil.sm-out{opacity:0;transition:opacity .6s ease}',
    'body.sm-active .d26-trail{display:none!important}',
    '.sm-scene{display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 24px;max-width:92vw}',
    '.sm-candle{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:118px}',
    '.sm-halo{position:absolute;left:50%;bottom:-34px;width:230px;height:230px;transform:translateX(-50%);border-radius:50%;pointer-events:none;',
    'background:radial-gradient(circle,rgba(201,168,76,.30) 0%,rgba(201,168,76,.12) 40%,rgba(201,168,76,0) 68%);',
    'opacity:0;animation:sm-appear 1.6s ease .35s forwards,sm-breathe 3.4s ease-in-out 2.2s infinite}',
    '.sm-flame-wrap{position:relative;width:30px;height:56px;transform-origin:50% 100%;',
    'animation:sm-grow 1.1s cubic-bezier(.22,1,.36,1) .25s both,sm-flicker 2.6s ease-in-out 1.45s infinite}',
    '.sm-flame{position:absolute;inset:0;border-radius:50% 50% 50% 50%/70% 70% 30% 30%;',
    'background:radial-gradient(62% 58% at 50% 66%,#FFF7E0 0%,#F3D98E 36%,#C9A84C 70%,rgba(201,168,76,.14) 100%);',
    'box-shadow:0 0 18px rgba(232,213,163,.55),0 0 48px rgba(201,168,76,.35)}',
    '.sm-core{position:absolute;left:50%;bottom:5px;width:12px;height:25px;transform:translateX(-50%);',
    'border-radius:50% 50% 50% 50%/64% 64% 36% 36%;filter:blur(.4px);',
    'background:radial-gradient(58% 62% at 50% 60%,#fff 0%,#FFF3D0 55%,rgba(255,243,208,0) 100%)}',
    '.sm-wick{width:2px;height:11px;margin-top:2px;border-radius:2px;background:linear-gradient(180deg,#f4efe6,#8b8377)}',
    '.sm-line{margin:36px 0 0;font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-weight:500;',
    'font-size:clamp(1.7rem,5.5vw,2.5rem);line-height:1.3;color:#E8D5A3;letter-spacing:.02em;',
    'opacity:0;animation:sm-rise 1.2s ease 1.2s forwards}',
    '.sm-sub{margin:14px 0 0;font-family:"Outfit","Segoe UI",sans-serif;font-weight:300;font-size:.68rem;',
    'letter-spacing:.34em;text-transform:uppercase;color:rgba(250,247,242,.6);',
    'opacity:0;animation:sm-rise 1.2s ease 1.7s forwards}',
    '@keyframes sm-appear{to{opacity:1}}',
    '@keyframes sm-breathe{0%,100%{opacity:1}50%{opacity:.72}}',
    '@keyframes sm-grow{from{opacity:0;transform:scaleY(.2) scaleX(.7)}55%{opacity:1}to{opacity:1;transform:scale(1)}}',
    '@keyframes sm-flicker{0%,100%{transform:scale(1) skewX(0)}',
    '30%{transform:scale(1.03,.97) skewX(1.6deg)}',
    '55%{transform:scale(.97,1.04) skewX(-1.8deg)}',
    '80%{transform:scale(1.02,.99) skewX(.8deg)}}',
    '@keyframes sm-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}',
    '@media (prefers-reduced-motion:reduce){',
    '.sm-flame-wrap,.sm-halo{animation:none;opacity:1;transform:none}',
    '.sm-halo{transform:translateX(-50%)}',
    '.sm-line{animation:sm-appear 1s ease 1.2s forwards}',
    '.sm-sub{animation:sm-appear 1s ease 1.6s forwards}}'
  ].join('');

  function injectCSS() {
    if (document.getElementById('sm-style')) return;
    var s = document.createElement('style');
    s.id = 'sm-style';
    s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function bumpCount() {
    var n = 1;
    try {
      n = (parseInt(localStorage.getItem(LS_KEY), 10) || 0) + 1;
      localStorage.setItem(LS_KEY, String(n));
    } catch (e) { /* private mode etc. — moment still plays */ }
    return n;
  }

  function start() {
    if (active || Date.now() < coolUntil || !document.body) return;
    active = true;
    injectCSS();
    var line = bumpCount() >= 3 ? 'Aap sukoon dhoondhna jaante hain.' : 'Yehi hai sukoon.';

    veil = document.createElement('div');
    veil.className = 'sm-veil';
    veil.innerHTML =
      '<div class="sm-scene">' +
        '<div class="sm-candle"><div class="sm-halo"></div>' +
          '<div class="sm-flame-wrap"><div class="sm-flame"></div><div class="sm-core"></div></div>' +
          '<div class="sm-wick"></div></div>' +
        '<p class="sm-line"></p>' +
        '<p class="sm-sub">Take a breath. Happy Diwali.</p>' +
      '</div>';
    veil.querySelector('.sm-line').textContent = line;

    prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('sm-active');
    document.body.appendChild(veil);
    void veil.offsetHeight; // reflow so the fade-in transition runs
    veil.classList.add('sm-in');
    veil.addEventListener('click', end);
    endT = setTimeout(end, 6000); // auto-dissolve
  }

  function end() {
    var v = veil;
    if (!v) return;
    veil = null;
    clearTimeout(endT);
    coolUntil = Date.now() + 2600; // 600ms fade + 2s cooldown
    v.classList.remove('sm-in');
    v.classList.add('sm-out');
    setTimeout(function () {
      if (v.parentNode) v.parentNode.removeChild(v);
      document.body.classList.remove('sm-active');
      var lb = document.getElementById('lightbox');
      var mm = document.getElementById('mobileMenu');
      var stillLocked = (lb && lb.classList.contains('active')) || (mm && mm.classList.contains('active'));
      document.body.style.overflow = stillLocked ? 'hidden' : '';
      active = false;
    }, 620);
  }

  /* --- trigger 1: typing s-u-k-o-o-n (ring buffer) --- */
  var buf = '';
  document.addEventListener('keydown', function (e) {
    if (active) { if (e.key === 'Escape') end(); return; }
    var t = e.target;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || ''))) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (!e.key || e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-6);
    if (buf === 'sukoon') { buf = ''; start(); }
  });

  /* --- trigger 2: 5 logo taps within 3s (mobile) --- */
  function wireLogo() {
    var logo = document.querySelector('.nav-logo-link') || document.querySelector('.nav-logo');
    if (!logo) return; // typing trigger still works
    var link = logo.closest ? logo.closest('a') : null;
    var taps = [], navT = 0, lastTouch = 0;
    logo.addEventListener('touchstart', function () { lastTouch = Date.now(); }, { passive: true });
    logo.addEventListener('click', function (e) {
      if (active) { e.preventDefault(); return; }
      var isTouch = e.pointerType === 'touch' || (Date.now() - lastTouch) < 900;
      if (!isTouch) return; // desktop clicks navigate untouched
      var now = Date.now();
      taps = taps.filter(function (t) { return now - t < 3000; });
      taps.push(now);
      e.preventDefault(); // hold navigation while a tap sequence may continue
      if (navT) clearTimeout(navT);
      if (taps.length >= 5) { taps = []; start(); return; }
      var href = link && link.getAttribute('href');
      navT = setTimeout(function () { // lone tap -> behave like a normal logo tap
        if (taps.length >= 1 && taps.length < 5 && href && !active) window.location.href = href;
      }, 600);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireLogo);
  } else {
    wireLogo();
  }

  /* --- manual trigger --- */
  window.sukoonMoment = start;
})();

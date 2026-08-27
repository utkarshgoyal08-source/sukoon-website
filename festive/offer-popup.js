/* SUKOON — first-order offer, as a gentle one-time popup.
   Shows once per visitor after a short dwell, never on top of another modal,
   and never again once dismissed or used. */
(function () {
  'use strict';
  if (window.__sukoonOffer) return;
  window.__sukoonOffer = true;

  var KEY = 'sukoon_offer_seen';
  var CODE = 'SUKOON10';
  var WA = 'https://wa.me/917264011700?text=' +
    encodeURIComponent("Hi Sukoon! 🪔 I'd like to use " + CODE + " (10% off first order above ₹999).");
  var DELAY = 9000;   // let them look around first
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function seen() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return true; } }
  function markSeen() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  var CSS = [
    '.of-ov{position:fixed;inset:0;z-index:1200;background:rgba(22,34,46,.55);opacity:0;transition:opacity .35s ease;',
      '-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}',
    '.of-ov.of-in{opacity:1}',
    '.of-card{position:fixed;z-index:1201;left:50%;top:50%;transform:translate(-50%,-44%) scale(.97);',
      'width:calc(100vw - 40px);max-width:370px;background:#FAF7F2;border:1px solid rgba(201,168,76,.55);',
      'border-radius:20px;box-shadow:0 26px 70px rgba(22,34,46,.42);padding:30px 26px 24px;text-align:center;',
      'opacity:0;transition:opacity .35s ease,transform .35s cubic-bezier(.25,.46,.45,.94)}',
    '.of-card.of-in{opacity:1;transform:translate(-50%,-50%) scale(1)}',
    '.of-x{position:absolute;top:12px;right:12px;width:38px;height:38px;border:none;background:none;color:#8B7355;',
      'font-size:1.25rem;line-height:1;cursor:pointer;border-radius:50%}',
    '.of-x:hover{background:rgba(201,168,76,.15);color:#2C3E50}',
    '.of-diya{font-size:2rem;line-height:1;margin-bottom:6px;filter:drop-shadow(0 0 12px rgba(201,168,76,.6))}',
    '.of-k{font-family:Outfit,sans-serif;font-size:.6rem;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;font-weight:600}',
    '.of-card h3{font-family:"Cormorant Garamond",Georgia,serif;font-size:2rem;font-weight:500;color:#2C3E50;margin:6px 0 2px;line-height:1.15}',
    '.of-card h3 em{font-style:italic;color:#C9A84C}',
    '.of-sub{font-family:Outfit,sans-serif;font-size:.8rem;color:#8B7355;line-height:1.6;margin-bottom:16px}',
    '.of-code{display:inline-flex;align-items:center;gap:10px;background:#fff;border:1px dashed #C9A84C;border-radius:10px;',
      'padding:10px 16px;margin-bottom:16px;cursor:pointer}',
    '.of-code b{font-family:Outfit,sans-serif;font-size:1rem;font-weight:700;letter-spacing:3px;color:#2C3E50}',
    '.of-code span{font-family:Outfit,sans-serif;font-size:.6rem;letter-spacing:1.2px;text-transform:uppercase;color:#C9A84C;font-weight:600}',
    '.of-go{display:block;width:100%;background:#C9A84C;color:#fff;border:none;border-radius:50px;padding:15px 20px;',
      'min-height:50px;font-family:Outfit,sans-serif;font-size:.76rem;font-weight:600;letter-spacing:1.4px;',
      'text-transform:uppercase;text-decoration:none;cursor:pointer;box-shadow:0 6px 20px rgba(201,168,76,.3)}',
    '.of-go:hover{background:#8B7355}',
    '.of-no{display:block;width:100%;margin-top:9px;border:none;background:none;font-family:Outfit,sans-serif;',
      'font-size:.68rem;letter-spacing:.6px;color:#8B7355;text-decoration:underline;cursor:pointer;padding:8px}',
    '@media(max-width:480px){.of-card{max-width:none;left:0;right:0;top:auto;bottom:0;width:100%;',
      'transform:translateY(16px);border-radius:20px 20px 0 0;padding:28px 22px calc(20px + env(safe-area-inset-bottom,0px))}',
      '.of-card.of-in{transform:translateY(0)}}',
    reduce ? '.of-ov,.of-card{transition:none!important}' : ''
  ].join('');

  var ov, card;

  function close() {
    markSeen();
    if (!card) return;
    ov.classList.remove('of-in');
    card.classList.remove('of-in');
    var o = ov, c = card;
    ov = card = null;
    document.removeEventListener('keydown', onKey, true);
    setTimeout(function () {
      if (o && o.parentNode) o.parentNode.removeChild(o);
      if (c && c.parentNode) c.parentNode.removeChild(c);
    }, reduce ? 0 : 360);
  }

  function onKey(e) { if (e.key === 'Escape' && card) { e.stopPropagation(); close(); } }

  /* don't interrupt: another modal open, or they're already deep in ordering */
  function busy() {
    if (document.querySelector('.ck-sheet')) return true;              // checkout open
    if (document.querySelector('.sm-veil')) return true;               // sukoon moment
    if (document.querySelector('.db-root.db-open')) return true;       // basket panel
    var lb = document.getElementById('lightbox');
    if (lb && lb.classList.contains('active')) return true;
    var mm = document.getElementById('mobileMenu');
    if (mm && mm.classList.contains('active')) return true;
    return false;
  }

  function show() {
    if (seen() || card || busy()) return;
    var s = document.createElement('style');
    s.id = 'of-style';
    s.textContent = CSS;
    if (!document.getElementById('of-style')) document.head.appendChild(s);

    ov = document.createElement('div');
    ov.className = 'of-ov';
    card = document.createElement('div');
    card.className = 'of-card';
    card.setAttribute('role', 'dialog');
    card.setAttribute('aria-modal', 'true');
    card.setAttribute('aria-label', 'First order offer');
    card.innerHTML =
      '<button type="button" class="of-x" aria-label="Close">&#10005;</button>' +
      '<div class="of-diya" aria-hidden="true">🪔</div>' +
      '<p class="of-k">A little shagun</p>' +
      '<h3>10% off your <em>first order</em></h3>' +
      '<p class="of-sub">On orders above &#8377;999. Mention the code on WhatsApp and we\'ll take it off your total.</p>' +
      '<div class="of-code" role="button" tabindex="0" title="Tap to copy"><b>' + CODE + '</b><span class="of-cp">Tap to copy</span></div>' +
      '<a class="of-go" href="' + WA + '" target="_blank" rel="noopener">Claim on WhatsApp</a>' +
      '<button type="button" class="of-no">Maybe later</button>';

    document.body.appendChild(ov);
    document.body.appendChild(card);
    void card.offsetWidth;              // reflow, then transition in
    ov.classList.add('of-in');
    card.classList.add('of-in');

    ov.addEventListener('click', close);
    card.querySelector('.of-x').addEventListener('click', close);
    card.querySelector('.of-no').addEventListener('click', close);
    card.querySelector('.of-go').addEventListener('click', function () { setTimeout(close, 400); });
    document.addEventListener('keydown', onKey, true);

    var codeEl = card.querySelector('.of-code');
    function copy() {
      var done = function () {
        var t = codeEl.querySelector('.of-cp');
        if (t) { t.textContent = 'Copied!'; setTimeout(function () { if (t) t.textContent = 'Tap to copy'; }, 1800); }
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(CODE).then(done, function () {});
          return;
        }
      } catch (e) {}
      try {
        var ta = document.createElement('textarea');
        ta.value = CODE; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy');
        document.body.removeChild(ta); done();
      } catch (e) {}
    }
    codeEl.addEventListener('click', copy);
    codeEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(); }
    });

    try { card.querySelector('.of-x').focus(); } catch (e) {}
  }

  function arm() {
    if (seen()) return;
    setTimeout(function () {
      if (busy()) { setTimeout(arm, 6000); return; }   // try again once they're free
      show();
    }, DELAY);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arm);
  else arm();

  window.sukoonOffer = { show: function () { try { localStorage.removeItem(KEY); } catch (e) {} show(); } };
})();

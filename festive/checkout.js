/* SUKOON — Order Checkout (Phase 1)
   Turns the Diya Basket into a real order flow:
   basket -> details form -> generated order ID -> structured WhatsApp order.
   No backend: the order ID is minted on-device, the WhatsApp thread is the ledger,
   and a copy is kept in localStorage("sukoon_orders") for the customer's reference.
   Reads the basket written by diya-basket.js ("sukoon_diya_basket"). */
(function () {
  'use strict';
  if (window.__sukoonCheckout) return;
  window.__sukoonCheckout = true;

  var WA = 'https://wa.me/917264011700?text=';
  var BASKET_KEY = 'sukoon_diya_basket';
  var ORDERS_KEY = 'sukoon_orders';
  var DRAFT_KEY = 'sukoon_checkout_draft';
  var reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ---------------- styles ---------------- */
  var CSS = [
    '.ck-ov{position:fixed;inset:0;z-index:1100;background:rgba(22,34,46,.55);opacity:0;',
      'transition:opacity .3s ease;-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px)}',
    '.ck-ov.ck-in{opacity:1}',
    '.ck-sheet{position:fixed;z-index:1101;left:50%;top:50%;transform:translate(-50%,-46%);width:calc(100vw - 32px);',
      'max-width:440px;max-height:86vh;overflow-y:auto;-webkit-overflow-scrolling:touch;background:#FAF7F2;',
      'border:1px solid rgba(201,168,76,.5);border-radius:20px;box-shadow:0 24px 70px rgba(22,34,46,.4);',
      'padding:26px 22px 22px;opacity:0;transition:opacity .3s ease,transform .3s ease}',
    '.ck-sheet.ck-in{opacity:1;transform:translate(-50%,-50%)}',
    '@media(max-width:520px){.ck-sheet{left:0;top:auto;bottom:0;transform:translateY(14px);width:100%;max-width:none;',
      'border-radius:20px 20px 0 0;max-height:92vh;padding-bottom:calc(22px + env(safe-area-inset-bottom,0px))}',
      '.ck-sheet.ck-in{transform:translateY(0)}}',
    '.ck-kicker{font-family:Outfit,sans-serif;font-size:.6rem;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;font-weight:600}',
    '.ck-sheet h3{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.6rem;color:#2C3E50;font-weight:500;margin:4px 0 2px}',
    '.ck-sub{font-family:Outfit,sans-serif;font-size:.76rem;color:#8B7355;line-height:1.55;margin-bottom:16px}',
    '.ck-x{position:absolute;top:14px;right:14px;width:38px;height:38px;border:none;background:none;color:#8B7355;',
      'font-size:1.3rem;line-height:1;cursor:pointer;border-radius:50%}',
    '.ck-x:hover{background:rgba(201,168,76,.14);color:#2C3E50}',
    '.ck-items{list-style:none;margin:0 0 16px;padding:12px 14px;background:#fff;border:1px solid #E8D5A3;border-radius:12px;max-height:132px;overflow-y:auto}',
    '.ck-items li{font-family:Outfit,sans-serif;font-size:.78rem;color:#2C3E50;padding:4px 0;display:flex;justify-content:space-between;gap:10px}',
    '.ck-items li span{color:#8B7355;font-size:.66rem;letter-spacing:.6px;white-space:nowrap}',
    '.ck-por{font-family:Outfit,sans-serif;font-size:.68rem;color:#8B7355;margin:-8px 0 16px;text-align:center;font-style:italic}',
    '.ck-f{margin-bottom:12px}',
    '.ck-f label{display:block;font-family:Outfit,sans-serif;font-size:.66rem;letter-spacing:1.4px;text-transform:uppercase;',
      'color:#2C3E50;font-weight:600;margin-bottom:5px}',
    '.ck-f input,.ck-f textarea{width:100%;font-family:Outfit,sans-serif;font-size:.9rem;color:#2C3E50;background:#fff;',
      'border:1px solid #E8D5A3;border-radius:10px;padding:11px 12px;min-height:46px;outline:none;transition:border-color .2s}',
    '.ck-f textarea{min-height:70px;resize:vertical;line-height:1.5}',
    /* hint text must never be mistaken for a filled-in value */
    '.ck-f input::placeholder,.ck-f textarea::placeholder{color:#B9AC99;font-style:italic;opacity:1}',
    '.ck-f input:focus,.ck-f textarea:focus{border-color:#C9A84C;box-shadow:0 0 0 3px rgba(201,168,76,.16)}',
    '.ck-f.ck-bad input,.ck-f.ck-bad textarea{border-color:#C0563F}',
    '.ck-err{display:none;font-family:Outfit,sans-serif;font-size:.66rem;color:#C0563F;margin-top:4px}',
    '.ck-f.ck-bad .ck-err{display:block}',
    '.ck-row{display:flex;gap:10px}.ck-row .ck-f{flex:1}',
    '.ck-chips{display:flex;flex-wrap:wrap;gap:7px}',
    '.ck-chip{font-family:Outfit,sans-serif;font-size:.7rem;letter-spacing:.4px;color:#8B7355;background:#fff;',
      'border:1px solid #E8D5A3;border-radius:50px;padding:8px 14px;min-height:36px;cursor:pointer;transition:all .2s}',
    '.ck-chip[aria-pressed="true"]{background:#C9A84C;border-color:#C9A84C;color:#fff;font-weight:600}',
    '.ck-go{width:100%;margin-top:6px;border:none;border-radius:50px;background:#C9A84C;color:#fff;font-family:Outfit,sans-serif;',
      'font-size:.8rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;padding:16px 20px;min-height:52px;',
      'cursor:pointer;transition:background .3s,transform .3s;box-shadow:0 6px 20px rgba(201,168,76,.3)}',
    '.ck-go:hover{background:#8B7355}',
    '.ck-note{font-family:Outfit,sans-serif;font-size:.64rem;color:#8B7355;text-align:center;margin-top:10px;line-height:1.5}',
    /* success */
    '.ck-ok{text-align:center;padding:6px 0 2px}',
    '.ck-ok .ck-diya{font-size:2.2rem;line-height:1;margin-bottom:10px}',
    '.ck-id{display:inline-block;font-family:Outfit,sans-serif;font-size:1rem;font-weight:700;letter-spacing:2px;color:#2C3E50;',
      'background:#fff;border:1px dashed #C9A84C;border-radius:10px;padding:10px 18px;margin:8px 0 4px}',
    '.ck-ok p{font-family:Outfit,sans-serif;font-size:.78rem;color:#8B7355;line-height:1.6;margin:8px 0}',
    '.ck-wa{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;margin-top:12px;',
      'background:#25D366;color:#fff;border-radius:50px;padding:15px 20px;min-height:50px;font-family:Outfit,sans-serif;',
      'font-size:.78rem;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;text-decoration:none}',
    '.ck-again{display:block;margin:12px auto 0;border:none;background:none;font-family:Outfit,sans-serif;font-size:.7rem;',
      'letter-spacing:1px;color:#8B7355;text-decoration:underline;cursor:pointer}',
    reduce ? '.ck-ov,.ck-sheet{transition:none!important}' : ''
  ].join('');

  function injectCSS() {
    if (document.getElementById('ck-style')) return;
    var s = document.createElement('style');
    s.id = 'ck-style';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ---------------- storage helpers ---------------- */
  function readBasket() {
    try {
      var a = JSON.parse(localStorage.getItem(BASKET_KEY) || '[]');
      return Object.prototype.toString.call(a) === '[object Array]' ? a : [];
    } catch (e) { return []; }
  }
  function readDraft() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}') || {}; } catch (e) { return {}; }
  }
  function saveDraft(d) { try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch (e) {} }
  function saveOrder(o) {
    try {
      var all = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
      if (Object.prototype.toString.call(all) !== '[object Array]') all = [];
      all.push(o);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(all.slice(-20)));
    } catch (e) {}
  }

  /* SUK-YYMMDD-XXXX — readable, roughly sortable, collision-safe enough at this volume */
  function makeOrderId() {
    var d = new Date();
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    var stamp = String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate());
    var abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 — easier to read aloud
    var tail = '';
    for (var i = 0; i < 4; i++) tail += abc.charAt(Math.floor(Math.random() * abc.length));
    return 'SUK-' + stamp + '-' + tail;
  }

  /* ---------------- validation ---------------- */
  function digits(s) { return (s || '').replace(/\D/g, ''); }
  function validPhone(s) {
    var d = digits(s);
    if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
    if (d.length === 11 && d.charAt(0) === '0') d = d.slice(1);
    return d.length === 10 && '6789'.indexOf(d.charAt(0)) !== -1 ? d : '';
  }
  function validPin(s) { var d = digits(s); return d.length === 6 && d.charAt(0) !== '0' ? d : ''; }

  /* ---------------- message ---------------- */
  function buildMessage(order) {
    var L = [];
    L.push('Namaste SUKOON! 🪔');
    L.push('');
    L.push('*NEW ORDER — ' + order.id + '*');
    L.push('');
    L.push('*Items*');
    order.items.forEach(function (it, i) {
      L.push((i + 1) + '. ' + it.name + (it.chapter ? ' (' + it.chapter + ')' : ''));
    });
    L.push('');
    L.push('*Deliver to*');
    L.push(order.name);
    L.push('+91 ' + order.phone);
    L.push(order.address);
    L.push(order.city + ' - ' + order.pincode);
    if (order.occasion) { L.push(''); L.push('*Occasion*: ' + order.occasion); }
    if (order.note) { L.push('*Gift note*: "' + order.note + '"'); }
    L.push('');
    L.push('Please confirm the total and share the UPI payment link. Dhanyavaad!');
    return L.join('\n');
  }

  /* ---------------- UI ---------------- */
  var ov, sheet, lastFocus;

  function close() {
    if (!sheet) return;
    ov.classList.remove('ck-in');
    sheet.classList.remove('ck-in');
    var o = ov, s = sheet;
    ov = sheet = null;
    document.removeEventListener('keydown', onKey, true);
    setTimeout(function () {
      if (o && o.parentNode) o.parentNode.removeChild(o);
      if (s && s.parentNode) s.parentNode.removeChild(s);
    }, reduce ? 0 : 320);
    try { if (lastFocus && lastFocus.focus) lastFocus.focus(); } catch (e) {}
  }

  function onKey(e) {
    if (!sheet) return;
    if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
    if (e.key !== 'Tab') return;
    var f = sheet.querySelectorAll('button,input,textarea,a[href]');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function field(id, label, type, ph, extra) {
    return '<div class="ck-f" data-f="' + id + '">' +
      '<label for="ck-' + id + '">' + label + '</label>' +
      (type === 'textarea'
        ? '<textarea id="ck-' + id + '" placeholder="' + ph + '"></textarea>'
        : '<input id="ck-' + id + '" type="' + type + '" placeholder="' + ph + '" ' + (extra || '') + '>') +
      '<span class="ck-err"></span></div>';
  }

  function open() {
    var items = readBasket();
    if (!items.length) return;
    injectCSS();
    lastFocus = document.activeElement;

    ov = document.createElement('div');
    ov.className = 'ck-ov';
    sheet = document.createElement('div');
    sheet.className = 'ck-sheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'Place your order');

    var d = readDraft();
    sheet.innerHTML =
      '<button type="button" class="ck-x" aria-label="Close">&#10005;</button>' +
      '<p class="ck-kicker">Almost there</p>' +
      '<h3>Place Your Order</h3>' +
      '<p class="ck-sub">Tell us where it should go. We\'ll confirm your total on WhatsApp and send a UPI link — nothing is charged here.</p>' +
      '<ul class="ck-items">' + items.map(function (it) {
        return '<li>' + esc(it.name) + '<span>' + esc(it.chapter || '') + '</span></li>';
      }).join('') + '</ul>' +
      '<p class="ck-por">Prices on request — we\'ll quote each piece when we confirm.</p>' +
      field('name', 'Your name', 'text', '', 'autocomplete="name"') +
      field('phone', 'WhatsApp number', 'tel', '', 'inputmode="numeric" autocomplete="tel"') +
      field('address', 'Delivery address', 'textarea', 'Flat / house, street, area, landmark') +
      '<div class="ck-row">' +
        field('city', 'City', 'text', '', 'autocomplete="address-level2"') +
        field('pincode', 'Pincode', 'text', '', 'inputmode="numeric" autocomplete="postal-code" maxlength="6"') +
      '</div>' +
      '<div class="ck-f"><label>Occasion (optional)</label><div class="ck-chips">' +
        ['Diwali gift', 'For my home', 'Corporate gifting', 'Wedding / shagun'].map(function (o) {
          return '<button type="button" class="ck-chip" aria-pressed="false">' + o + '</button>';
        }).join('') + '</div></div>' +
      field('note', 'Gift note (optional)', 'textarea', 'We\'ll handwrite this on the card') +
      '<button type="button" class="ck-go">Review &amp; Send on WhatsApp</button>' +
      '<p class="ck-note">You\'ll get an order number instantly. Payment happens on WhatsApp via UPI once Pallak confirms your total.</p>';

    document.body.appendChild(ov);
    document.body.appendChild(sheet);

    // restore draft
    ['name', 'phone', 'address', 'city', 'pincode', 'note'].forEach(function (k) {
      var el = sheet.querySelector('#ck-' + k);
      if (el && d[k]) el.value = d[k];
    });
    if (d.occasion) {
      [].forEach.call(sheet.querySelectorAll('.ck-chip'), function (c) {
        if (c.textContent === d.occasion) c.setAttribute('aria-pressed', 'true');
      });
    }

    /* force a reflow, then transition in — synchronous, so a throttled or
       backgrounded tab can never leave the sheet stuck invisible */
    void sheet.offsetWidth;
    ov.classList.add('ck-in');
    sheet.classList.add('ck-in');

    ov.addEventListener('click', close);
    sheet.querySelector('.ck-x').addEventListener('click', close);
    document.addEventListener('keydown', onKey, true);

    [].forEach.call(sheet.querySelectorAll('.ck-chip'), function (c) {
      c.addEventListener('click', function () {
        var on = c.getAttribute('aria-pressed') === 'true';
        [].forEach.call(sheet.querySelectorAll('.ck-chip'), function (o) { o.setAttribute('aria-pressed', 'false'); });
        c.setAttribute('aria-pressed', on ? 'false' : 'true');
      });
    });

    sheet.querySelector('.ck-go').addEventListener('click', function () { submit(items); });
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function bad(id, msg) {
    var f = sheet.querySelector('[data-f="' + id + '"]');
    if (!f) return null;
    f.classList.add('ck-bad');
    f.querySelector('.ck-err').textContent = msg;
    return f;
  }

  function submit(items) {
    [].forEach.call(sheet.querySelectorAll('.ck-f'), function (f) { f.classList.remove('ck-bad'); });
    var v = function (k) { var el = sheet.querySelector('#ck-' + k); return el ? el.value.trim() : ''; };
    var name = v('name'), phoneRaw = v('phone'), address = v('address'),
        city = v('city'), pinRaw = v('pincode'), note = v('note');
    var chip = sheet.querySelector('.ck-chip[aria-pressed="true"]');
    var occasion = chip ? chip.textContent : '';

    var firstBad = null, f;
    if (name.length < 2) { f = bad('name', 'Please tell us your name'); firstBad = firstBad || f; }
    var phone = validPhone(phoneRaw);
    if (!phone) { f = bad('phone', 'Enter a 10-digit Indian mobile number'); firstBad = firstBad || f; }
    if (address.length < 10) { f = bad('address', 'A full address helps us deliver'); firstBad = firstBad || f; }
    if (city.length < 2) { f = bad('city', 'Required'); firstBad = firstBad || f; }
    var pincode = validPin(pinRaw);
    if (!pincode) { f = bad('pincode', '6 digits'); firstBad = firstBad || f; }

    if (firstBad) {
      var inp = firstBad.querySelector('input,textarea');
      if (inp) { try { inp.focus(); } catch (e) {} }
      return;
    }

    saveDraft({ name: name, phone: phone, address: address, city: city, pincode: pincode, note: note, occasion: occasion });

    var order = {
      id: makeOrderId(), at: new Date().toISOString(), items: items,
      name: name, phone: phone, address: address, city: city,
      pincode: pincode, note: note, occasion: occasion
    };
    saveOrder(order);
    showSuccess(order);
  }

  function showSuccess(order) {
    var link = WA + encodeURIComponent(buildMessage(order));
    sheet.innerHTML =
      '<button type="button" class="ck-x" aria-label="Close">&#10005;</button>' +
      '<div class="ck-ok">' +
        '<div class="ck-diya">🪔</div>' +
        '<p class="ck-kicker">Order created</p>' +
        '<div class="ck-id">' + order.id + '</div>' +
        '<p>Send it across on WhatsApp and Pallak will confirm your total and share a UPI link. Aapka order number save kar liya hai.</p>' +
        '<a class="ck-wa" href="' + link + '" target="_blank" rel="noopener">Send order on WhatsApp</a>' +
        '<button type="button" class="ck-again">Keep browsing</button>' +
      '</div>';
    sheet.querySelector('.ck-x').addEventListener('click', close);
    sheet.querySelector('.ck-again').addEventListener('click', close);
    var wa = sheet.querySelector('.ck-wa');
    try { wa.focus(); } catch (e) {}
    wa.addEventListener('click', function () {
      // order is on its way to WhatsApp — empty the basket via the basket's own control
      var clr = document.querySelector('.db-clear');
      if (clr) clr.click();
      setTimeout(close, 700);
    });
  }

  /* ---------------- hook into the basket panel ---------------- */
  function init() {
    var waBtn = document.querySelector('.db-wa');
    if (!waBtn) return; // basket not on this page
    waBtn.textContent = 'Place Order →';
    waBtn.setAttribute('href', '#');
    waBtn.removeAttribute('target');
    waBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (!readBasket().length) return;
      var panel = document.querySelector('.db-root');
      if (panel) panel.classList.remove('db-open');
      open();
    }, true);

    // quiet reassurance inside the basket panel
    var panel = document.querySelector('.db-panel');
    if (panel && !panel.querySelector('.ck-panel-note')) {
      var p = document.createElement('p');
      p.className = 'ck-panel-note';
      p.style.cssText = 'font-family:Outfit,sans-serif;font-size:.64rem;color:#8B7355;text-align:center;margin:8px 0 0;line-height:1.5';
      p.textContent = 'Prices on request — we quote on WhatsApp before anything is paid.';
      panel.appendChild(p);
    }
    injectCSS();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.sukoonCheckout = { open: open, lastOrders: function () { try { return JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch (e) { return []; } } };
})();

/* SUKOON - "Pick a Patta" | Diwali'26 Baithak ritual
   Self-contained vanilla JS (load with <script defer>). Injects a once-daily
   card-draw panel right after the Baithak products grid on diwali-2026.html.
   Class prefix: pp- | localStorage key: sukoon_pick_a_patta */
(function () {
  'use strict';

  var KEY = 'sukoon_pick_a_patta';
  var WA = 'https://wa.me/917264011700?text=';

  /* rank+suit, red?, blessing (Hinglish), matched product */
  var FORTUNES = [
    { n: 'Queen of Hearts',   r: 'Q', s: '♥', red: true,  b: 'Jahan aap baithte hain, wahin baithak sajti hai. Har kona pyaar se roshan rahe.', p: 'Floral Urli Tray' },
    { n: 'King of Hearts',    r: 'K', s: '♥', red: true,  b: 'Dil ke raja wahi, jo har mehmaan ko apna bana le. Aapki chai, aapki dua — dono khaas.', p: 'Hand-Painted Kulhad' },
    { n: 'Ace of Hearts',     r: 'A', s: '♥', red: true,  b: 'Ek dil, ek dua — mithaas aapke ghar ki pehli mehmaan bane.', p: 'Motichoor Laddoo' },
    { n: 'Ace of Diamonds',   r: 'A', s: '♦', red: true,  b: 'Pehla diya aapke naam. Laxmi ji wahin rukti hain jahan roshni saaf dil se jalti hai.', p: 'Brass Diya Candle' },
    { n: 'Queen of Diamonds', r: 'Q', s: '♦', red: true,  b: 'Kamal par Laxmi virajti hain — aur is saal unki kripa-drishti aap par hai.', p: 'Kamal Tin Candle' },
    { n: 'King of Diamonds',  r: 'K', s: '♦', red: true,  b: 'Asli sona wahi jo mehnat se khilta hai. Is Diwali genda bhi sona lagega.', p: 'Marigold Goblet Candle' },
    { n: 'Jack of Clubs',     r: 'J', s: '♣', red: false, b: 'Yaaron ki mehfil ki jaan aap hi hain — patte bhi aapki taraf muskurayenge.', p: 'Taash Card Candle' },
    { n: 'Queen of Clubs',    r: 'Q', s: '♣', red: false, b: 'Dosti wahi jo har baazi mein saath de. Aapki baithak is saal sabse roshan hogi.', p: 'Marigold Coaster Candle' },
    { n: 'King of Clubs',     r: 'K', s: '♣', red: false, b: 'Mehfil ke raja aap — jab tak aap table par hain, har baazi ek jashn hai.', p: 'Taash Suit Candle' },
    { n: 'Ace of Spades',     r: 'A', s: '♠', red: false, b: 'Sabse ooncha patta aapke haath — naye faisle, nayi himmat, ghungroo si khanak.', p: 'Brass Dabba Candle' },
    { n: 'Queen of Spades',   r: 'Q', s: '♠', red: false, b: 'Aapki shaanti hi aapki taaqat hai. Purana pighlne dijiye, naya rang khud chadhega.', p: 'Hobnail Jar Candle' },
    { n: 'King of Spades',    r: 'K', s: '♠', red: false, b: 'Chand ki tarah shaant chamakte rahiye — halki roshni bhi andhere par bhaari hai. Shubh aarambh.', p: 'Gol Tealight Holder' }
  ];

  /* Ornamental card back: gold frame, corner curls, diya + paisley motif */
  var BACK_SVG =
    '<svg viewBox="0 0 110 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
    '<rect x="5.5" y="5.5" width="99" height="149" rx="7.5" fill="none" stroke="#C9A84C" stroke-width="1.4"/>' +
    '<rect x="11" y="11" width="88" height="138" rx="4.5" fill="none" stroke="#C9A84C" stroke-width=".6" opacity=".55"/>' +
    '<g stroke="#C9A84C" fill="none" stroke-width=".8" opacity=".6" stroke-linecap="round">' +
    '<path d="M17 28q0-11 11-11"/><path d="M93 28q0-11-11-11"/>' +
    '<path d="M17 132q0 11 11 11"/><path d="M93 132q0 11-11 11"/></g>' +
    '<g fill="#C9A84C"><circle cx="55" cy="26" r="1.6" opacity=".85"/><circle cx="48" cy="27.5" r=".9" opacity=".5"/><circle cx="62" cy="27.5" r=".9" opacity=".5"/>' +
    '<circle cx="55" cy="134" r="1.6" opacity=".85"/><circle cx="48" cy="132.5" r=".9" opacity=".5"/><circle cx="62" cy="132.5" r=".9" opacity=".5"/></g>' +
    '<path d="M55 55c4.6 6.6 6.8 10.8 0 17.2-6.8-6.4-4.6-10.6 0-17.2z" fill="#E8D5A3"/>' +
    '<path d="M55 61.5c2 3 3 4.9 0 7.8-3-2.9-2-4.8 0-7.8z" fill="#C9A84C" opacity=".8"/>' +
    '<path d="M39 79h32c0 7.6-7.2 12-16 12s-16-4.4-16-12z" fill="#C9A84C"/>' +
    '<path d="M47 93.5h16l3.5 4.5h-23z" fill="#C9A84C" opacity=".85"/>' +
    '<g stroke="#C9A84C" fill="none" stroke-width=".9" opacity=".65" stroke-linecap="round">' +
    '<path d="M35 63c-5.5 4.5-5.5 12.5 1 16"/><path d="M75 63c5.5 4.5 5.5 12.5-1 16"/></g></svg>';

  var CSS = '' +
    '.pp-panel{position:relative;margin:44px 0 8px;padding:40px 24px 44px;text-align:center;overflow:hidden;border-radius:24px;border:1px solid rgba(201,168,76,.38);background:linear-gradient(155deg,#33475e 0%,#2C3E50 45%,#1f2c3a 100%);animation:ppIn .7s ease .05s both}' +
    '.pp-panel::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 70% 45% at 50% 40%,rgba(201,168,76,.12),transparent 70%);pointer-events:none}' +
    '.pp-panel>*{position:relative}' +
    '.pp-title{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:clamp(1.75rem,4.5vw,2.3rem);color:#FAF7F2;letter-spacing:.5px;margin:0 0 8px}' +
    '.pp-sub{font-family:"Outfit","Segoe UI",sans-serif;font-size:.84rem;font-weight:300;color:rgba(250,247,242,.7);letter-spacing:.3px;line-height:1.6;max-width:420px;margin:0 auto}' +
    '.pp-fan{display:flex;justify-content:center;align-items:center;padding:30px 0 14px;min-height:150px}' +
    '.pp-card{position:relative;width:88px;height:128px;margin:0 -9px;background:none;border:0;padding:0;cursor:pointer;perspective:900px;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none;transform:rotate(var(--pp-r,0deg)) translateY(var(--pp-y,0px));transition:transform .45s cubic-bezier(.25,.46,.45,.94),opacity .45s ease}' +
    '.pp-card:nth-child(1){--pp-r:-8deg;--pp-y:7px}' +
    '.pp-card:nth-child(2){--pp-y:-3px;z-index:2}' +
    '.pp-card:nth-child(3){--pp-r:8deg;--pp-y:7px}' +
    '@media(hover:hover){.pp-card:not(:disabled):hover{transform:rotate(var(--pp-r,0deg)) translateY(calc(var(--pp-y,0px) - 8px))}}' +
    '.pp-card:focus-visible{outline:2px solid #E8D5A3;outline-offset:5px;border-radius:12px}' +
    '.pp-card:disabled{cursor:default}' +
    '.pp-inner{position:relative;width:100%;height:100%;transform-style:preserve-3d;transition:transform .6s cubic-bezier(.35,.1,.25,1)}' +
    '.pp-card.pp-flipped{--pp-r:0deg;--pp-y:0px;transform:rotate(0deg) scale(1.22);z-index:3}' +
    '.pp-card.pp-flipped .pp-inner{transform:rotateY(180deg)}' +
    '.pp-card.pp-dim{opacity:.38;transform:rotate(var(--pp-r,0deg)) translateY(12px) scale(.86)}' +
    '.pp-back,.pp-face{position:absolute;inset:0;border-radius:10px;backface-visibility:hidden;-webkit-backface-visibility:hidden;box-shadow:0 10px 22px rgba(0,0,0,.35)}' +
    '.pp-back{background:linear-gradient(150deg,#3b5068 0%,#2C3E50 55%,#1d2937 100%)}' +
    '.pp-back svg{position:absolute;inset:0;width:100%;height:100%;display:block}' +
    '.pp-face{transform:rotateY(180deg);background:#FAF7F2;box-shadow:inset 0 0 0 1px rgba(201,168,76,.5),0 10px 22px rgba(0,0,0,.3);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:16px 10px;overflow:hidden}' +
    '.pp-pip{position:absolute;top:6px;left:7px;display:flex;flex-direction:column;align-items:center;line-height:1}' +
    '.pp-pip b{font-family:"Cormorant Garamond",Georgia,serif;font-size:13px;font-weight:700}' +
    '.pp-pip i{font-style:normal;font-size:9px;margin-top:1px}' +
    '.pp-pip--br{top:auto;left:auto;bottom:6px;right:7px;transform:rotate(180deg)}' +
    '.pp-red{color:#B23A48}.pp-blk{color:#3D4650}' +
    '.pp-suit{display:none;font-size:13px;line-height:1}' +
    '.pp-cname{font-family:"Outfit","Segoe UI",sans-serif;font-size:7.5px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:#8B7355}' +
    '.pp-bless{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-size:9.5px;line-height:1.32;color:#2C3E50;margin:2px 0 0}' +
    '.pp-result{max-width:460px;margin:6px auto 0}' +
    '.pp-result[hidden]{display:none}' +
    '.pp-revealed .pp-result{animation:ppRise .55s ease .3s both}' +
    '.pp-prod{font-family:"Outfit","Segoe UI",sans-serif;font-size:.7rem;letter-spacing:2px;text-transform:uppercase;color:#E8D5A3;margin:14px 0 0}' +
    '.pp-prod b{color:#C9A84C;font-weight:600}' +
    '.pp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;margin-top:16px;padding:13px 26px;min-height:44px;border:1.5px solid #C9A84C;border-radius:50px;color:#C9A84C;font-family:"Outfit","Segoe UI",sans-serif;font-size:.72rem;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;transition:background .3s,color .3s,transform .3s}' +
    '.pp-btn:hover{background:#C9A84C;color:#2C3E50;transform:translateY(-2px)}' +
    '.pp-note{font-family:"Cormorant Garamond",Georgia,serif;font-style:italic;font-size:.95rem;color:rgba(250,247,242,.55);margin:16px 0 0}' +
    '@media(min-width:560px){.pp-panel{padding:48px 32px 52px}.pp-card{width:110px;height:160px;margin:0 -12px}.pp-fan{padding:36px 0 18px;min-height:190px}.pp-pip b{font-size:15px}.pp-pip i{font-size:10px}.pp-suit{display:inline;font-size:15px}.pp-cname{font-size:8px}.pp-bless{font-size:11.5px}}' +
    '@keyframes ppIn{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:none}}' +
    '@keyframes ppRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}' +
    '@media(prefers-reduced-motion:reduce){.pp-panel,.pp-revealed .pp-result{animation:none}.pp-card,.pp-inner{transition:none!important}}' +
    '.pp-instant,.pp-instant *{animation:none!important;transition:none!important}';

  function todayStr() {
    var d = new Date(), m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
  }
  function hashStr(s) {
    var h = 5381, i;
    for (i = 0; i < s.length; i++) { h = ((h << 5) + h + s.charCodeAt(i)) | 0; }
    return h < 0 ? -h : h;
  }
  function loadState() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      return (o && typeof o === 'object') ? o : null;
    } catch (e) { return null; }
  }
  function saveState(o) {
    try { window.localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { /* private mode etc. */ }
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function buildFace(f) {
    var face = el('div', 'pp-face');
    var col = f.red ? 'pp-red' : 'pp-blk';
    ['pp-pip', 'pp-pip pp-pip--br'].forEach(function (c) {
      var pip = el('span', c + ' ' + col);
      pip.appendChild(el('b', null, f.r));
      pip.appendChild(el('i', null, f.s));
      face.appendChild(pip);
    });
    face.appendChild(el('span', 'pp-suit ' + col, f.s));
    face.appendChild(el('span', 'pp-cname', f.n));
    face.appendChild(el('p', 'pp-bless', f.b));
    return face;
  }

  function build() {
    var block = document.querySelector('section.cat-block'); /* Baithak = first chapter */
    if (!block) return;
    var grid = block.querySelector('.products-grid');
    if (!grid || !grid.parentElement) return;
    if (document.querySelector('.pp-panel')) return; /* never double-inject */

    var today = todayStr();
    var f = FORTUNES[hashStr(today + '|sukoon') % FORTUNES.length]; /* same daily card in all 3 */
    var st = loadState();
    var done = !!(st && st.drawn && st.date === today);
    var pos = done ? ((typeof st.pos === 'number' && st.pos >= 0 && st.pos < 3) ? st.pos : 1) : -1;

    if (!document.getElementById('pp-style')) {
      var style = document.createElement('style');
      style.id = 'pp-style';
      style.textContent = CSS;
      (document.head || document.documentElement).appendChild(style);
    }

    var panel = el('div', 'pp-panel');
    panel.appendChild(el('h3', 'pp-title', 'Pick a Patta'));
    panel.appendChild(el('p', 'pp-sub', 'Baithak ki rasam — ek patta, ek dua. Draw your card of the day.'));

    var fan = el('div', 'pp-fan');
    fan.setAttribute('role', 'group');
    fan.setAttribute('aria-label', 'Pick a Patta — once-daily card draw');
    var cards = [];
    for (var i = 0; i < 3; i++) {
      var card = document.createElement('button');
      card.type = 'button';
      card.className = 'pp-card';
      card.setAttribute('aria-label', 'Face-down patta — tap to draw your card of the day');
      var inner = el('div', 'pp-inner');
      var back = el('div', 'pp-back');
      back.innerHTML = BACK_SVG;
      inner.appendChild(back);
      inner.appendChild(buildFace(f));
      card.appendChild(inner);
      fan.appendChild(card);
      cards.push(card);
    }
    panel.appendChild(fan);

    var result = el('div', 'pp-result');
    result.setAttribute('role', 'status');
    result.hidden = true;
    var prod = el('p', 'pp-prod', 'Aapke liye: ');
    prod.appendChild(el('b', null, f.p));
    var btn = el('a', 'pp-btn', 'Send me my card’s candle →');
    btn.href = WA + encodeURIComponent('Hi! My Pick-a-Patta card was the ' + f.n + ' 🪔 — tell me about the ' + f.p + '!');
    btn.target = '_blank';
    btn.rel = 'noopener';
    result.appendChild(prod);
    result.appendChild(btn);
    result.appendChild(el('p', 'pp-note', 'Naya patta kal milega 🌙'));
    panel.appendChild(result);

    var revealed = false;
    function reveal(idx, persist) {
      if (revealed) return;
      revealed = true;
      cards.forEach(function (c, j) {
        c.disabled = true;
        if (j === idx) {
          c.classList.add('pp-flipped');
          c.setAttribute('aria-label', 'Aapka patta: ' + f.n);
        } else {
          c.classList.add('pp-dim'); /* stay face-down forever */
        }
      });
      result.hidden = false;
      panel.classList.add('pp-revealed');
      if (persist) saveState({ date: today, drawn: true, pos: idx });
    }

    cards.forEach(function (c, idx) {
      c.addEventListener('click', function () { reveal(idx, true); });
    });

    if (done) { /* same-day return: already flipped, no animations */
      panel.classList.add('pp-instant');
      reveal(pos, false);
    }

    grid.insertAdjacentElement('afterend', panel); /* stays inside the same .container */
  }

  function init() {
    try { build(); } catch (e) { /* fail silently, never break the page */ }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

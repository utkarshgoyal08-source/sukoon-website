/* SUKOON — Basket for the Diwali'26 collection page.
   Recognisable commerce first, brand charm second:
   - a labelled "Add to Basket" button inside every product card (not a corner glyph)
   - a sticky bottom bar the moment anything is in the basket
   - a desktop nav entry, so the cart lives where people look for it
   checkout.js hooks .db-wa / .db-clear / .db-root.db-open — keep those names. */
(function(){
  'use strict';
  var LS_KEY='sukoon_diya_basket', HINT_KEY='sukoon_basket_hint', WA='https://wa.me/917264011700?text=';

  function init(){
    var cards=document.querySelectorAll('.product-card');
    if(!cards.length) return; // not the collection page — do nothing

    /* ---------- styles ---------- */
    var css=''+
    /* --- add button, inside the card body --- */
    '.db-actions{display:flex;gap:8px;width:100%;margin-top:12px}'+
    '.db-actions .btn-enquire{flex:1;justify-content:center}'+
    '.db-add{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:44px;'+
      'padding:12px 14px;border-radius:50px;border:1.5px solid #C9A84C;background:#C9A84C;color:#fff;'+
      'font-family:Outfit,sans-serif;font-size:.72rem;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;'+
      'cursor:pointer;transition:background .25s ease,color .25s ease,border-color .25s ease;white-space:nowrap}'+
    '.db-add:hover{background:#8B7355;border-color:#8B7355}'+
    '.db-add .db-ic{font-size:.95rem;line-height:1}'+
    '.db-add.db-lit{background:#fff;color:#2C3E50;border-color:#2C3E50}'+
    '.db-add.db-lit .db-ic{filter:drop-shadow(0 0 5px rgba(201,168,76,.85))}'+
    /* card body must stack so the action row can sit full width */
    '.d26-grid .product-card .card-body{flex-direction:column;align-items:flex-start;gap:0}'+
    '.d26-grid .product-card .card-body>div{width:100%}'+
    /* --- sticky basket bar --- */
    '.db-bar{position:fixed;left:0;right:0;bottom:0;z-index:940;display:none;align-items:center;gap:12px;'+
      'background:#2C3E50;border-top:1.5px solid #C9A84C;box-shadow:0 -6px 26px rgba(44,62,80,.32);'+
      'padding:12px 18px calc(12px + env(safe-area-inset-bottom,0px));cursor:pointer}'+
    '.db-bar-on .db-bar{display:flex}'+
    '.db-bar-ic{font-size:1.3rem;line-height:1;filter:drop-shadow(0 0 8px rgba(201,168,76,.8))}'+
    '.db-bar-txt{flex:1;min-width:0;font-family:Outfit,sans-serif;font-size:.82rem;color:#FAF7F2;line-height:1.3}'+
    '.db-bar-txt b{display:block;font-weight:600}'+
    '.db-bar-txt em{font-style:normal;font-size:.66rem;letter-spacing:.4px;color:rgba(250,247,242,.6)}'+
    '.db-bar-go{flex-shrink:0;background:#C9A84C;color:#fff;border:none;border-radius:50px;padding:12px 20px;'+
      'min-height:44px;font-family:Outfit,sans-serif;font-size:.72rem;font-weight:600;letter-spacing:1.2px;'+
      'text-transform:uppercase;cursor:pointer;white-space:nowrap}'+
    /* lift the other floating bits so the bar never buries them */
    'body.db-bar-on .whatsapp-float{bottom:96px!important}'+
    'body.db-bar-on .back-to-top{bottom:168px!important}'+
    'body.db-bar-on .dm-toggle{bottom:92px!important}'+
    'body.db-bar-on .pd-chip{bottom:88px!important}'+
    /* --- desktop nav entry --- */
    '.db-nav{display:inline-flex;align-items:center;gap:7px;cursor:pointer;background:none;border:none;padding:0;'+
      'font-family:Outfit,sans-serif;font-size:.85rem;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;'+
      'color:inherit}'+
    '.db-nav .db-nav-n{display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;'+
      'padding:0 6px;border-radius:10px;background:#C9A84C;color:#fff;font-size:.68rem;font-weight:700;letter-spacing:0}'+
    '.db-nav .db-nav-n.db-hide{display:none}'+
    /* --- overlay + panel --- */
    '.db-overlay{position:fixed;inset:0;z-index:992;background:rgba(44,62,80,.45);display:none}'+
    '.db-panel{position:fixed;z-index:993;left:50%;bottom:auto;top:50%;transform:translate(-50%,-50%);'+
      'width:calc(100vw - 36px);max-width:380px;background:#FAF7F2;border:1px solid rgba(201,168,76,.5);'+
      'border-radius:18px;box-shadow:0 20px 60px rgba(44,62,80,.35);padding:22px 20px 18px;display:none;box-sizing:border-box}'+
    '.db-open .db-overlay,.db-open .db-panel{display:block}'+
    '.db-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px}'+
    '.db-head h4{font-family:"Cormorant Garamond",serif;font-size:1.45rem;font-weight:500;color:#2C3E50;margin:0}'+
    '.db-head em{display:block;font-family:"Cormorant Garamond",serif;font-style:italic;font-size:.85rem;color:#8B7355;margin-top:1px}'+
    '.db-close{width:40px;height:40px;border:none;background:none;color:#8B7355;font-size:1.2rem;cursor:pointer;'+
      'display:flex;align-items:center;justify-content:center;margin:-8px -10px 0 0}'+
    '.db-list{list-style:none;margin:0;padding:0;max-height:44vh;overflow-y:auto}'+
    '.db-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;'+
      'border-bottom:1px solid #E8D5A3}'+
    '.db-row:last-child{border-bottom:none}'+
    '.db-name{font-family:Outfit,sans-serif;font-size:.85rem;color:#2C3E50;font-weight:400}'+
    '.db-chap{display:block;font-family:Outfit,sans-serif;font-size:.6rem;letter-spacing:1.5px;'+
      'text-transform:uppercase;color:#C9A84C;font-weight:600;margin-top:2px}'+
    '.db-remove{width:40px;height:40px;flex-shrink:0;border:none;background:none;color:#8B7355;font-size:1rem;'+
      'cursor:pointer;display:flex;align-items:center;justify-content:center}'+
    '.db-empty{font-family:"Cormorant Garamond",serif;font-style:italic;font-size:1rem;color:#8B7355;'+
      'line-height:1.55;margin:6px 0 4px}'+
    '.db-wa{display:flex;align-items:center;justify-content:center;width:100%;min-height:50px;margin-top:16px;'+
      'border-radius:50px;background:#C9A84C;color:#fff;font-family:Outfit,sans-serif;font-size:.78rem;'+
      'font-weight:600;letter-spacing:1.2px;text-transform:uppercase;text-decoration:none;border:none;cursor:pointer}'+
    '.db-clear{display:block;margin:10px auto 0;border:none;background:none;font-family:Outfit,sans-serif;'+
      'font-size:.72rem;color:#8B7355;text-decoration:underline;cursor:pointer;padding:8px 12px}'+
    /* --- one-time nudge --- */
    '.db-hint{position:absolute;z-index:6;left:50%;transform:translateX(-50%);bottom:calc(100% + 10px);'+
      'background:#2C3E50;color:#FAF7F2;font-family:Outfit,sans-serif;font-size:.68rem;letter-spacing:.4px;'+
      'padding:8px 13px;border-radius:50px;white-space:nowrap;box-shadow:0 6px 20px rgba(44,62,80,.35);pointer-events:none}'+
    '.db-hint::after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);border:6px solid transparent;'+
      'border-top-color:#2C3E50}'+
    '@media(prefers-reduced-motion:no-preference){'+
      '.db-add.db-pop{animation:dbPop .35s ease}'+
      '@keyframes dbPop{0%{transform:scale(1)}50%{transform:scale(1.06)}100%{transform:scale(1)}}'+
      '.db-hint{animation:dbHint .4s ease both}'+
      '@keyframes dbHint{from{opacity:0;transform:translateX(-50%) translateY(6px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}}'+
    '@media(max-width:480px){'+
      '.db-actions{flex-direction:column;gap:7px}'+
      '.db-add,.db-actions .btn-enquire{width:100%}'+
      '.db-bar-txt{font-size:.76rem}'+
      '.db-bar-go{padding:11px 16px}'+
      'body.db-bar-on .whatsapp-float{bottom:88px!important}'+
      'body.db-bar-on .back-to-top{bottom:150px!important}'+
      'body.db-bar-on .dm-toggle{bottom:150px!important}'+
      'body.db-bar-on .pd-chip{bottom:82px!important}'+
      '.db-panel{left:0;right:0;top:auto;bottom:0;transform:none;width:100%;max-width:none;'+
        'border-radius:18px 18px 0 0;padding:22px 20px calc(18px + env(safe-area-inset-bottom,0px))}}';
    var style=document.createElement('style');
    style.textContent=css;
    document.head.appendChild(style);

    /* ---------- state ---------- */
    var basket=[]; // [{name, chapter}]
    try{
      var raw=localStorage.getItem(LS_KEY);
      var parsed=raw?JSON.parse(raw):[];
      if(Array.isArray(parsed)) basket=parsed.filter(function(it){return it&&typeof it.name==='string';});
    }catch(e){ basket=[]; }
    function persist(){ try{ localStorage.setItem(LS_KEY,JSON.stringify(basket)); }catch(e){} }
    function inBasket(name){ return basket.some(function(it){return it.name===name;}); }

    var reduceMotion=false;
    try{ reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){}

    /* ---------- per-card Add button ---------- */
    var toggles={}; // name -> button
    var firstBtn=null;
    Array.prototype.forEach.call(cards,function(card){
      var body=card.querySelector('.card-body');
      var h3=card.querySelector('.card-body h3');
      if(!body||!h3) return;
      var name=(h3.textContent||'').trim();
      if(!name) return;
      var section=card.closest('section.cat-block');
      var h2=section?section.querySelector('.cat-head h2'):null;
      var chapter=h2?(h2.textContent||'').trim():"Diwali'26";

      var actions=document.createElement('div');
      actions.className='db-actions';
      var enq=body.querySelector('.btn-enquire');
      if(enq) actions.appendChild(enq); // move the existing Enquire link in beside Add
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='db-add';
      btn.setAttribute('aria-pressed','false');
      btn.innerHTML='<span class="db-ic" aria-hidden="true">🪔</span><span class="db-lbl">Add to Basket</span>';
      actions.appendChild(btn);
      body.appendChild(actions);
      if(!firstBtn) firstBtn=btn;

      btn.addEventListener('click',function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        if(inBasket(name)){
          basket=basket.filter(function(it){return it.name!==name;});
        }else{
          basket.push({name:name,chapter:chapter});
          if(!reduceMotion){
            btn.classList.remove('db-pop');
            void btn.offsetWidth;
            btn.classList.add('db-pop');
          }
          dismissHint();
        }
        persist();
        render();
      });
      toggles[name]=btn;
    });

    /* ---------- bar + panel ---------- */
    var root=document.createElement('div');
    root.className='db-root';
    root.innerHTML=
      '<div class="db-bar" role="button" tabindex="0" aria-label="View your basket">'+
        '<span class="db-bar-ic" aria-hidden="true">🪔</span>'+
        '<span class="db-bar-txt"><b class="db-bar-n">0 pieces in your basket</b><em>Prices on request &mdash; we quote on WhatsApp</em></span>'+
        '<span class="db-bar-go">View &amp; Order</span>'+
      '</div>'+
      '<div class="db-overlay"></div>'+
      '<div class="db-panel" role="dialog" aria-label="Your basket">'+
        '<div class="db-head"><div><h4>Your Basket</h4><em>aapki diya basket</em></div>'+
        '<button type="button" class="db-close" aria-label="Close basket">&#10005;</button></div>'+
        '<ul class="db-list"></ul>'+
        '<p class="db-empty" hidden>Abhi khaali hai &mdash; tap <b>Add to Basket</b> on any piece you love.</p>'+
        '<a class="db-wa" href="#" target="_blank" rel="noopener">Enquire on WhatsApp &rarr;</a>'+
        '<button type="button" class="db-clear">Clear all</button>'+
      '</div>';
    document.body.appendChild(root);

    var bar=root.querySelector('.db-bar'), barN=root.querySelector('.db-bar-n'),
        overlay=root.querySelector('.db-overlay'), panel=root.querySelector('.db-panel'),
        list=root.querySelector('.db-list'), empty=root.querySelector('.db-empty'),
        waBtn=root.querySelector('.db-wa'), clearBtn=root.querySelector('.db-clear'),
        closeBtn=root.querySelector('.db-close');

    /* desktop nav entry — the place people actually look for a cart */
    var navN=null;
    var navLinks=document.querySelector('.nav-links');
    if(navLinks){
      var navBtn=document.createElement('button');
      navBtn.type='button';
      navBtn.className='db-nav';
      navBtn.setAttribute('aria-label','View your basket');
      navBtn.innerHTML='Basket <span class="db-nav-n db-hide">0</span>';
      var cta=navLinks.querySelector('.nav-cta');
      if(cta) navLinks.insertBefore(navBtn,cta); else navLinks.appendChild(navBtn);
      navN=navBtn.querySelector('.db-nav-n');
      navBtn.addEventListener('click',function(){ openPanel(); });
    }

    function waLink(){
      var lines=basket.map(function(it){
        return '• '+it.name+(it.chapter?' ('+it.chapter+')':'');
      });
      return WA+encodeURIComponent(
        "Namaste Sukoon! 🪔 I'd love to enquire about these from the Diwali'26 Collection:\n"+
        lines.join('\n')+'\nThank you!');
    }

    function render(){
      var n=basket.length, isEmpty=n===0;
      barN.textContent=n+(n===1?' piece':' pieces')+' in your basket';
      document.body.classList.toggle('db-bar-on',!isEmpty);
      if(navN){ navN.textContent=String(n); navN.classList.toggle('db-hide',isEmpty); }

      Object.keys(toggles).forEach(function(name){
        var lit=inBasket(name), b=toggles[name];
        b.classList.toggle('db-lit',lit);
        b.setAttribute('aria-pressed',lit?'true':'false');
        b.querySelector('.db-lbl').textContent=lit?'In Basket':'Add to Basket';
        b.querySelector('.db-ic').textContent=lit?'✓':'🪔';
        b.setAttribute('aria-label',(lit?'Remove ':'Add ')+name+(lit?' from':' to')+' your basket');
      });

      list.innerHTML='';
      basket.forEach(function(it,i){
        var li=document.createElement('li');
        li.className='db-row';
        var info=document.createElement('div');
        var nm=document.createElement('span'); nm.className='db-name'; nm.textContent=it.name;
        var ch=document.createElement('span'); ch.className='db-chap'; ch.textContent=it.chapter||'';
        info.appendChild(nm); info.appendChild(ch);
        var rm=document.createElement('button');
        rm.type='button'; rm.className='db-remove'; rm.textContent='✕';
        rm.setAttribute('aria-label','Remove '+it.name);
        rm.addEventListener('click',function(){ basket.splice(i,1); persist(); render(); });
        li.appendChild(info); li.appendChild(rm);
        list.appendChild(li);
      });
      empty.hidden=!isEmpty;
      waBtn.style.display=isEmpty?'none':'flex';
      clearBtn.style.display=isEmpty?'none':'block';
      if(!isEmpty) waBtn.href=waLink();
    }

    function openPanel(){ render(); root.classList.add('db-open'); }
    function closePanel(){ root.classList.remove('db-open'); }

    bar.addEventListener('click',openPanel);
    bar.addEventListener('keydown',function(ev){
      if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); openPanel(); }
    });
    overlay.addEventListener('click',closePanel);
    closeBtn.addEventListener('click',closePanel);
    document.addEventListener('keydown',function(ev){
      if(ev.key==='Escape'&&root.classList.contains('db-open')) closePanel();
    });
    clearBtn.addEventListener('click',function(){ basket=[]; persist(); render(); });

    /* ---------- one-time nudge on the first Add button ---------- */
    var hintEl=null;
    function dismissHint(){
      if(hintEl&&hintEl.parentNode) hintEl.parentNode.removeChild(hintEl);
      hintEl=null;
      try{ localStorage.setItem(HINT_KEY,'1'); }catch(e){}
    }
    function maybeHint(){
      var seen=true;
      try{ seen=localStorage.getItem(HINT_KEY)==='1'; }catch(e){}
      if(seen||!firstBtn||basket.length) return;
      if(!('IntersectionObserver' in window)) return;
      var io=new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(!en.isIntersecting||hintEl) return;
          io.disconnect();
          var host=firstBtn.parentNode;
          if(getComputedStyle(host).position==='static') host.style.position='relative';
          hintEl=document.createElement('span');
          hintEl.className='db-hint';
          hintEl.textContent='Tap to add — we quote on WhatsApp';
          host.appendChild(hintEl);
          setTimeout(dismissHint,6000);
        });
      },{threshold:0.9});
      io.observe(firstBtn);
    }

    render(); // restore state from storage
    maybeHint();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

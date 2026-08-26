/* SUKOON — Diya Basket: wishlist-to-WhatsApp for the Diwali'26 collection page. Self-contained. */
(function(){
  'use strict';
  var LS_KEY='sukoon_diya_basket', WA='https://wa.me/917264011700?text=';

  function init(){
    var cards=document.querySelectorAll('.product-card');
    if(!cards.length) return; // not the collection page — do nothing

    /* ---------- styles ---------- */
    var css=''+
    '.db-toggle{position:absolute;top:10px;right:10px;z-index:5;width:40px;height:40px;border-radius:50%;border:none;'+
      'background:rgba(255,255,255,.9);box-shadow:0 2px 10px rgba(0,0,0,.18);display:flex;align-items:center;'+
      'justify-content:center;cursor:pointer;padding:0;transition:transform .2s ease,box-shadow .3s ease}'+
    '.db-toggle span{font-size:1.25rem;line-height:1;filter:grayscale(1) opacity(.55);transition:filter .25s ease}'+
    '.db-toggle.db-lit span{filter:none;text-shadow:0 0 10px rgba(201,168,76,.9)}'+
    '.db-toggle.db-lit{background:#fff;box-shadow:0 0 0 1.5px #C9A84C,0 2px 14px rgba(201,168,76,.55)}'+
    '.db-fab{position:fixed;bottom:24px;left:20px;z-index:910;width:56px;height:56px;border-radius:50%;border:none;'+
      'background:#2C3E50;display:flex;align-items:center;justify-content:center;cursor:pointer;'+
      'box-shadow:0 4px 18px rgba(44,62,80,.4)}'+
    '.db-badge{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;border-radius:10px;background:#C9A84C;'+
      'color:#2C3E50;font-family:Outfit,sans-serif;font-size:.68rem;font-weight:600;display:flex;align-items:center;'+
      'justify-content:center;padding:0 5px;box-sizing:border-box}'+
    '.db-badge.db-hide{display:none}'+
    '.db-overlay{position:fixed;inset:0;z-index:949;background:rgba(44,62,80,.35);display:none}'+
    '.db-panel{position:fixed;bottom:92px;left:20px;z-index:950;width:calc(100vw - 40px);max-width:340px;'+
      'background:#FAF7F2;border-radius:14px;box-shadow:0 12px 40px rgba(44,62,80,.28);padding:18px 18px 16px;'+
      'display:none;box-sizing:border-box}'+
    '.db-open .db-overlay,.db-open .db-panel{display:block}'+
    '.db-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}'+
    '.db-head h4{font-family:"Cormorant Garamond",serif;font-size:1.3rem;font-weight:500;color:#2C3E50;margin:0}'+
    '.db-close{width:40px;height:40px;border:none;background:none;color:#8B7355;font-size:1.2rem;cursor:pointer;'+
      'display:flex;align-items:center;justify-content:center;margin:-8px -10px 0 0}'+
    '.db-list{list-style:none;margin:0;padding:0;max-height:44vh;overflow-y:auto}'+
    '.db-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 0;'+
      'border-bottom:1px solid #E8D5A3}'+
    '.db-row:last-child{border-bottom:none}'+
    '.db-name{font-family:Outfit,sans-serif;font-size:.85rem;color:#2C3E50;font-weight:400}'+
    '.db-chap{display:block;font-family:Outfit,sans-serif;font-size:.6rem;letter-spacing:1.5px;'+
      'text-transform:uppercase;color:#C9A84C;font-weight:600;margin-top:2px}'+
    '.db-remove{width:40px;height:40px;flex-shrink:0;border:none;background:none;color:#8B7355;font-size:1rem;'+
      'cursor:pointer;display:flex;align-items:center;justify-content:center}'+
    '.db-empty{font-family:"Cormorant Garamond",serif;font-style:italic;font-size:1rem;color:#8B7355;'+
      'line-height:1.55;margin:6px 0 4px}'+
    '.db-wa{display:flex;align-items:center;justify-content:center;width:100%;min-height:44px;margin-top:14px;'+
      'border-radius:50px;background:#C9A84C;color:#2C3E50;font-family:Outfit,sans-serif;font-size:.78rem;'+
      'font-weight:600;letter-spacing:1px;text-transform:uppercase;text-decoration:none;border:none;cursor:pointer}'+
    '.db-clear{display:block;margin:10px auto 0;border:none;background:none;font-family:Outfit,sans-serif;'+
      'font-size:.72rem;color:#8B7355;text-decoration:underline;cursor:pointer;padding:8px 12px}'+
    '@media(prefers-reduced-motion:no-preference){'+
      '.db-toggle.db-pop span{animation:dbPop .35s ease}'+
      '@keyframes dbPop{0%{transform:scale(1)}50%{transform:scale(1.35)}100%{transform:scale(1)}}'+
      '.db-fab.db-live{animation:dbGlow 2.4s ease-in-out infinite}'+
      '@keyframes dbGlow{0%,100%{box-shadow:0 4px 18px rgba(44,62,80,.4)}'+
        '50%{box-shadow:0 4px 22px rgba(201,168,76,.65)}}}'+
    '@media(max-width:480px){'+
      '.db-fab{bottom:84px;left:16px}'+
      '.db-panel{left:0;right:0;bottom:0;width:100%;max-width:none;border-radius:16px 16px 0 0;'+
        'padding:20px 20px calc(18px + env(safe-area-inset-bottom, 0px))}}';
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

    /* ---------- card toggles ---------- */
    var toggles={}; // name -> button
    Array.prototype.forEach.call(cards,function(card){
      var carousel=card.querySelector('.card-carousel');
      var h3=card.querySelector('.card-body h3');
      if(!carousel||!h3) return;
      var name=(h3.textContent||'').trim();
      if(!name) return;
      var section=card.closest('section.cat-block');
      var h2=section?section.querySelector('.cat-head h2'):null;
      var chapter=h2?(h2.textContent||'').trim():"Diwali'26";
      if(getComputedStyle(carousel).position==='static') carousel.style.position='relative';
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='db-toggle';
      btn.setAttribute('aria-pressed','false');
      btn.setAttribute('aria-label','Add '+name+' to Diya Basket');
      btn.innerHTML='<span aria-hidden="true">🪔</span>';
      btn.addEventListener('click',function(ev){
        ev.stopPropagation();
        ev.preventDefault();
        if(inBasket(name)){
          basket=basket.filter(function(it){return it.name!==name;});
        }else{
          basket.push({name:name,chapter:chapter});
          if(!reduceMotion){
            btn.classList.remove('db-pop');
            void btn.offsetWidth; // restart animation
            btn.classList.add('db-pop');
          }
        }
        persist();
        render();
      });
      carousel.appendChild(btn);
      toggles[name]=btn;
    });

    /* ---------- FAB + panel ---------- */
    var root=document.createElement('div');
    root.className='db-root';
    root.innerHTML=
      '<button type="button" class="db-fab" aria-label="Open Diya Basket" aria-expanded="false">'+
        '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">'+
          '<path fill="#C9A84C" d="M12 2.6c1.9 2.1 2.7 3.6 2.7 5A2.7 2.7 0 0 1 12 10.3a2.7 2.7 0 0 1-2.7-2.7c0-1.4.8-2.9 2.7-5z"/>'+
          '<path fill="#C9A84C" d="M3.2 13.2c2.7 1.3 5.7 1.9 8.8 1.9s6.1-.6 8.8-1.9c-.6 4.1-4.3 6.9-8.8 6.9s-8.2-2.8-8.8-6.9z"/>'+
        '</svg>'+
        '<span class="db-badge db-hide" aria-hidden="true">0</span>'+
      '</button>'+
      '<div class="db-overlay"></div>'+
      '<div class="db-panel" role="dialog" aria-label="Diya Basket">'+
        '<div class="db-head"><h4>Aapki Diya Basket</h4>'+
        '<button type="button" class="db-close" aria-label="Close basket">&#10005;</button></div>'+
        '<ul class="db-list"></ul>'+
        '<p class="db-empty" hidden>Abhi khaali hai &mdash; tap the diya on any candle to light it into your basket.</p>'+
        '<a class="db-wa" href="#" target="_blank" rel="noopener">Enquire on WhatsApp &rarr;</a>'+
        '<button type="button" class="db-clear">Clear all</button>'+
      '</div>';
    document.body.appendChild(root);

    var fab=root.querySelector('.db-fab'), badge=root.querySelector('.db-badge'),
        overlay=root.querySelector('.db-overlay'), panel=root.querySelector('.db-panel'),
        list=root.querySelector('.db-list'), empty=root.querySelector('.db-empty'),
        waBtn=root.querySelector('.db-wa'), clearBtn=root.querySelector('.db-clear'),
        closeBtn=root.querySelector('.db-close');

    function waLink(){
      var lines=basket.map(function(it){
        return '• '+it.name+(it.chapter?' ('+it.chapter+')':'');
      });
      var msg="Namaste Sukoon! 🪔 I'd love to enquire about these from the Diwali'26 Collection:\n"+
        lines.join('\n')+'\nThank you!';
      return WA+encodeURIComponent(msg);
    }

    function render(){
      // badge + fab
      badge.textContent=String(basket.length);
      badge.classList.toggle('db-hide',basket.length===0);
      fab.classList.toggle('db-live',basket.length>0);
      // card buttons
      Object.keys(toggles).forEach(function(name){
        var lit=inBasket(name);
        toggles[name].classList.toggle('db-lit',lit);
        toggles[name].setAttribute('aria-pressed',lit?'true':'false');
        toggles[name].setAttribute('aria-label',(lit?'Remove ':'Add ')+name+(lit?' from':' to')+' Diya Basket');
      });
      // panel list
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
      var isEmpty=basket.length===0;
      empty.hidden=!isEmpty;
      waBtn.style.display=isEmpty?'none':'flex';
      clearBtn.style.display=isEmpty?'none':'block';
      if(!isEmpty) waBtn.href=waLink();
    }

    function openPanel(){ render(); root.classList.add('db-open'); fab.setAttribute('aria-expanded','true'); }
    function closePanel(){ root.classList.remove('db-open'); fab.setAttribute('aria-expanded','false'); }

    fab.addEventListener('click',function(){
      if(root.classList.contains('db-open')) closePanel(); else openPanel();
    });
    overlay.addEventListener('click',closePanel);
    closeBtn.addEventListener('click',closePanel);
    document.addEventListener('keydown',function(ev){
      if(ev.key==='Escape'&&root.classList.contains('db-open')) closePanel();
    });
    clearBtn.addEventListener('click',function(){ basket=[]; persist(); render(); });

    render(); // restore lit diyas + count from storage
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();

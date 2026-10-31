
(function(){
var DATA = window.VERLUNE_PRODUCTS || [];
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function fmt(n){return n.toFixed(2).replace('.',',')+' €'}
function bySlug(s){for(var i=0;i<DATA.length;i++){if(DATA[i].slug===s)return DATA[i]}return null}
function getCart(){try{return JSON.parse(LS.getItem('panier')||'[]')}catch(e){return []}}
function setCart(c){try{LS.setItem('panier',JSON.stringify(c))}catch(e){} cartCount()}
function cartCount(){var n=getCart().reduce(function(a,l){return a+l.qty},0);var e=$('#cart-count');if(e)e.textContent=n;var s=$('#cart-sr');if(s)s.textContent='Panier, '+n+' article'+(n>1?'s':'')}
var BASE=location.pathname.replace(/(\/v[0-9]+\/).*$/,'$1');
var NS=BASE.replace(/\W/g,'_');
var LS={getItem:function(k){return localStorage.getItem(NS+k)},setItem:function(k,v){localStorage.setItem(NS+k,v)},removeItem:function(k){localStorage.removeItem(NS+k)}};
var SS={getItem:function(k){return sessionStorage.getItem(NS+k)},setItem:function(k,v){sessionStorage.setItem(NS+k,v)}};
function setCookie(k,v,days){var d=new Date();d.setTime(d.getTime()+days*864e5);document.cookie=k+'='+v+';expires='+d.toUTCString()+';path='+BASE+';SameSite=Lax'}
function getCookie(k){var m=document.cookie.match('(?:^|; )'+k+'=([^;]*)');return m?m[1]:null}
function rid(){return Math.random().toString(36).slice(2,12)}
window.dataLayer = window.dataLayer || [];
function push(o){window.dataLayer.push(o)}
function gtag(){window.dataLayer.push(arguments)}
if(!getCookie('panier_session')) setCookie('panier_session', rid(), 1);
if(!getCookie('audimetre_id')) setCookie('audimetre_id', rid(), 395);
setCookie('audimetre_privacy','exempt',395);
cartCount();
setTimeout(function(){$$('img.blur').forEach(function(i){i.classList.remove('blur')})},2000);

function readChoice(){try{return JSON.parse(LS.getItem('choix_cookies'))}catch(e){return null}}
function statlite(){var id=LS.getItem('statlite_id'); if(!id){id=rid();LS.setItem('statlite_id',id)}
  try{navigator.sendBeacon && navigator.sendBeacon('https://statlite.example/collect?id='+id+'&p='+encodeURIComponent(location.pathname))}catch(e){}}
function applyChoice(c, fresh){
  gtag('consent','update',{analytics_storage:c.analytics?'granted':'denied',ad_storage:c.ads?'granted':'denied',ad_user_data:c.ads?'granted':'denied',ad_personalization:c.ads?'granted':'denied'});
  if(c.analytics){statlite(); if(fresh) push({event:'page_view_virtuelle', page_path:location.pathname});}
  else {try{LS.removeItem('statlite_id')}catch(e){}}
}
function saveChoice(c){LS.setItem('choix_cookies',JSON.stringify(c));setCookie('choix_cookies',c.analytics?'1':'0',180);var b=$('#cmp');if(b)b.remove();applyChoice(c,true);var m=$('main');if(m)m.focus()}
function cmp(){
  var c=readChoice(); if(c){applyChoice(c,false);return}
  var d=document.createElement('section'); d.id='cmp'; d.className='cmp'; d.setAttribute('aria-labelledby','cmp-t');
  d.innerHTML='<h2 id="cmp-t" style="margin:0 0 6px;font-size:18px">Cookies</h2><p>Nous mesurons l\'audience du site et, si vous l\'acceptez, nous utilisons des cookies publicitaires. Vous pouvez refuser aussi facilement qu\'accepter.</p>'+
   '<div class="row"><button type="button" id="cmp-refuse" class="btn">Tout refuser</button><button type="button" id="cmp-accept" class="btn">Tout accepter</button><button type="button" id="cmp-settings" class="btn secondary" aria-expanded="false" aria-controls="cmp-panel">Paramétrer</button></div>'+
   '<div id="cmp-panel" hidden style="margin-top:10px"><label style="font-weight:400"><input type="checkbox" id="c-an" style="width:auto"> Mesure d\'audience</label>'+
   '<label style="font-weight:400"><input type="checkbox" id="c-ads" style="width:auto"> Publicité</label><button type="button" id="cmp-save" class="btn" style="margin-top:8px">Enregistrer mes choix</button></div>';
  document.body.insertBefore(d, document.body.firstChild);
  $('#cmp-accept').onclick=function(){saveChoice({analytics:true,ads:true})};
  $('#cmp-refuse').onclick=function(){saveChoice({analytics:false,ads:false})};
  $('#cmp-settings').onclick=function(){var p=$('#cmp-panel');p.hidden=!p.hidden;this.setAttribute('aria-expanded',String(!p.hidden))};
  $('#cmp-save').onclick=function(){saveChoice({analytics:$('#c-an').checked,ads:$('#c-ads').checked})};
}
cmp();

function item(p,size,qty){return {item_id:p.slug,item_name:p.name,item_brand:'Verlune',item_category:p.rayon,item_variant:size||undefined,price:p.price,quantity:qty||1}}
function evViewItem(p){push({ecommerce:null});push({event:'view_item',ecommerce:{currency:'EUR',value:p.price,items:[item(p)]}})}
function evAdd(p,size){push({ecommerce:null});push({event:'add_to_cart',ecommerce:{currency:'EUR',value:p.price,items:[item(p,size,1)]}})}
function evList(name,items){push({ecommerce:null});push({event:'view_item_list',ecommerce:{item_list_id:name,item_list_name:name,items:items.map(function(p,i){var o=item(p);o.index=i;return o})}})}

function pdp(){
  var p=bySlug(document.body.dataset.slug); if(!p)return; var chosen=null;
  evViewItem(p);
  $$('.size:not([disabled])').forEach(function(b){b.onclick=function(){$$('.size').forEach(function(x){x.setAttribute('aria-pressed','false')});b.setAttribute('aria-pressed','true');chosen=b.dataset.size;$('#size-chosen').textContent='Taille choisie : '+chosen}});
  var sizes=$$('.size:not([disabled])'); if(sizes.length===1&&sizes[0].dataset.size==='Unique'){sizes[0].click()}
  $('#add').onclick=function(){
    if(!chosen){$('#msg').textContent='Choisissez une taille avant d’ajouter au panier.';return}
    var c=getCart(),f=null;c.forEach(function(l){if(l.slug===p.slug&&l.size===chosen)f=l});
    if(f)f.qty++;else c.push({slug:p.slug,size:chosen,qty:1}); setCart(c); evAdd(p,chosen);
    $('#msg').textContent=p.name+' (taille '+chosen+') a été ajouté au panier.';
  };
  var g=$('#guide-open'), m=$('#guide');
  if(g&&m){
    var close=function(){m.style.display='none';g.focus()};
    g.onclick=function(){m.style.display='flex';$('#guide-close').focus()};
    $('#guide-close').onclick=close;
    m.addEventListener('keydown',function(e){if(e.key==='Escape')close();if(e.key==='Tab'){e.preventDefault();$('#guide-close').focus()}});
  }
}

function plp(){
  var name=document.body.dataset.list; var cards=$$('.card'); var shown=cards.map(function(c){return bySlug(c.dataset.slug)});
  evList(name,shown);
  var q=new URLSearchParams(location.search), size=q.get('taille')||'', tri=q.get('tri')||'';
  var f=$('#f-size'), s=$('#f-sort'); if(f)f.value=size; if(s)s.value=tri;
  function apply(){
    var g=$('#grid'), list=cards.slice();
    if(tri==='prix-asc')list.sort(function(a,b){return bySlug(a.dataset.slug).price-bySlug(b.dataset.slug).price});
    if(tri==='prix-desc')list.sort(function(a,b){return bySlug(b.dataset.slug).price-bySlug(a.dataset.slug).price});
    var n=0; list.forEach(function(c){var p=bySlug(c.dataset.slug);var ok=!size||(p.stock[size]>0);c.hidden=!ok;if(ok)n++;g.appendChild(c)});
    var r=$('#count'); if(r)r.textContent=n+' produit'+(n>1?'s':'');
  }
  apply();
  function go(){var u=new URLSearchParams();if(f&&f.value)u.set('taille',f.value);if(s&&s.value)u.set('tri',s.value);location.search=u.toString()}
  if(f)f.onchange=go; if(s)s.onchange=go;
}

function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
function lev(a,b){var m=[],i,j;for(i=0;i<=b.length;i++)m[i]=[i];for(j=0;j<=a.length;j++)m[0][j]=j;for(i=1;i<=b.length;i++)for(j=1;j<=a.length;j++)m[i][j]=b[i-1]===a[j-1]?m[i-1][j-1]:Math.min(m[i-1][j-1]+1,m[i][j-1]+1,m[i-1][j]+1);return m[b.length][a.length]}
function wordMatch(t,w){if(w.indexOf(t)===0)return true;var tol=t.length>6?2:(t.length>3?1:0);return lev(t,w)<=tol||lev(t,w.slice(0,t.length))<=tol}
function search(){
  var q=new URLSearchParams(location.search).get('q')||''; var i=$('#q'); if(i)i.value=q; if(!q)return;
  var out=$('#results'); out.setAttribute('aria-busy','true'); out.innerHTML='<p>Recherche en cours…</p>';
  setTimeout(function(){
    var toks=norm(q).split(/\s+/).filter(Boolean);
    var res=DATA.filter(function(p){var words=norm(p.name+' '+p.desc+' '+p.color+' '+p.matiere).split(/[^a-z0-9]+/).filter(Boolean);
      return toks.every(function(t){return words.some(function(w){return wordMatch(t,w)})})});
    out.removeAttribute('aria-busy');
    if(!res.length){out.innerHTML='<h2>Aucun résultat pour « '+q.replace(/</g,'&lt;')+' »</h2><p>Vérifiez l’orthographe ou essayez : <a href="recherche.html?q=pull">pull</a>, <a href="recherche.html?q=chemise">chemise</a>, <a href="recherche.html?q=lin">lin</a>.</p><p>Ou parcourez nos rayons : <a href="rayon/vetements.html">Vêtements</a>, <a href="rayon/maison.html">Maison</a>.</p>';return}
    out.innerHTML='<p>'+res.length+' résultat'+(res.length>1?'s':'')+' pour « '+q.replace(/</g,'&lt;')+' »</p><div class="grid">'+res.map(function(p){return '<a class="card" href="produit/'+p.slug+'.html"><img src="img/'+p.slug+'.svg" alt="" width="450" height="450"><div class="t">'+p.name+'</div><div class="p">'+fmt(p.price)+'</div></a>'}).join('')+'</div>';
  },3000);
}

function cart(){
  var c=getCart(), body=$('#lines'), total=0;
  if(!c.length){$('#cart-zone').innerHTML='<p>Votre panier est vide. <a href="index.html">Continuer mes achats</a></p>';return}
  body.innerHTML=c.map(function(l,i){var p=bySlug(l.slug);var lt=p.price*l.qty;total+=lt;
    return '<tr><td>'+p.name+'<br><span class="info">Taille '+l.size+'</span></td><td>'+l.qty+'</td><td>'+fmt(lt)+'</td><td><button type="button" class="btn secondary rm" data-i="'+i+'">Retirer<span class="sr-only"> '+p.name+'</span></button></td></tr>'}).join('');
  var ship=total>=60?0:4.9; $('#ship').textContent=ship?fmt(ship):'Offerte'; $('#total').textContent=fmt(total+ship);
  $$('.rm').forEach(function(b){b.onclick=function(){var c=getCart();c.splice(+b.dataset.i,1);setCart(c);cart();$('#live').textContent='Article retiré du panier.'}});
  push({ecommerce:null});push({event:'view_cart',ecommerce:{currency:'EUR',value:total,items:c.map(function(l){return item(bySlug(l.slug),l.size,l.qty)})}});
  var t=$('#promo-toggle'); if(t)t.onclick=function(){var z=$('#promo-zone');z.hidden=!z.hidden;t.setAttribute('aria-expanded',String(!z.hidden))};
  $('#checkout').onclick=function(){location.href='commande.html'};
}
function checkout(){
  var c=getCart(); if(!c.length){location.href='panier.html';return}
  var total=c.reduce(function(a,l){return a+bySlug(l.slug).price*l.qty},0);
  push({ecommerce:null});push({event:'begin_checkout',ecommerce:{currency:'EUR',value:total,items:c.map(function(l){return item(bySlug(l.slug),l.size,l.qty)})}});
  $('#form').onsubmit=function(e){e.preventDefault();var first=null;
    $$('#form input[required]').forEach(function(i){var er=$('#'+i.id+'-err');if(!i.value.trim()){i.setAttribute('aria-invalid','true');if(er)er.textContent='Ce champ est obligatoire.';if(!first)first=i}else{i.removeAttribute('aria-invalid');if(er)er.textContent=''}});
    if(first){first.focus();return}
    var id='VL-'+Date.now().toString(36).toUpperCase(); SS.setItem('commande',JSON.stringify({id:id,lines:c}));
    location.href='confirmation.html'};
}
function confirm(){
  var o=null;try{o=JSON.parse(SS.getItem('commande'))}catch(e){}
  if(!o){$('#conf').textContent='Aucune commande en cours.';return}
  $('#order-id').textContent=o.id;
  var sent=JSON.parse(LS.getItem('achats_envoyes')||'[]');
  if(sent.indexOf(o.id)===-1){
    var total=o.lines.reduce(function(a,l){return a+bySlug(l.slug).price*l.qty},0);
    var ship=total>=60?0:4.9;
    push({ecommerce:null});push({event:'purchase',ecommerce:{transaction_id:o.id,currency:'EUR',value:total,shipping:ship,items:o.lines.map(function(l){return item(bySlug(l.slug),l.size,l.qty)})}});
    sent.push(o.id);LS.setItem('achats_envoyes',JSON.stringify(sent));
  }
  setCart([]);
}

function home(){
  var slides=$$('.slide'),k=0,timer=null,btn=$('#pause');
  function show(){slides.forEach(function(s,i){s.hidden=i!==k})}
  function start(){timer=setInterval(function(){k=(k+1)%slides.length;show()},6000);btn.textContent='Mettre en pause le diaporama';btn.setAttribute('aria-pressed','false')}
  function stop(){clearInterval(timer);timer=null;btn.textContent='Relancer le diaporama';btn.setAttribute('aria-pressed','true')}
  show(); if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)start(); else stop();
  btn.onclick=function(){timer?stop():start()};
}

var pg=document.body.dataset.page;
({pdp:pdp,plp:plp,search:search,cart:cart,checkout:checkout,confirm:confirm,home:home}[pg]||function(){})();
window.__push = push;
})();

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
setTimeout(function(){var b=document.createElement('p');b.className='notice';b.style.padding='22px 12px';b.textContent='Nouveautés d’automne : découvrez la collection et nos essentiels en lin et en laine.';var slot=document.getElementById('promo-slot');if(slot){slot.appendChild(b)}else{var m=document.querySelector('main');if(m)m.insertBefore(b,m.firstChild)}},1200);
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

function beacon(u){try{navigator.sendBeacon&&navigator.sendBeacon(u)}catch(e){}}
function idCookie(k){var id=getCookie(k);if(!id){id=rid();setCookie(k,id,395)}return id}
function idLS(k){var id=LS.getItem(k);if(!id){id=rid();LS.setItem(k,id)}return id}
function tools(){
  var c=readChoice(), pg=encodeURIComponent(location.pathname);
  if(c&&c.analytics){beacon('https://replaylab.example/rec?sid='+idCookie('_rpl')+'&p='+pg);beacon(BASE+'cdp/collect?anon='+idLS('cdp_anon_id')+'&e=page&p='+pg+'&consent=analytics')}
  if(c&&c.ads){beacon('https://recoplus.example/events?uid='+idLS('recoplus_uid')+'&p='+pg);beacon('https://publink.example/px?id='+idCookie('_plk')+'&ev=PageView&p='+pg)}
  beacon('https://perfwatch.example/rum?lcp=1&p='+pg);
}
tools();
var _saveChoice=saveChoice; saveChoice=function(c){_saveChoice(c);tools()};

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
  var qty=c.reduce(function(a,l){return a+l.qty},0), duo=qty>=2?Math.round(total*10)/100:0, net=total-duo;
  var ship=net>=60?0:4.9; $('#ship').textContent=ship?fmt(ship):'Offerte'; $('#duo').textContent=duo?'- '+fmt(duo):'—';
  function tot(){var g=$('#gift')&&$('#gift').checked?2.9:0;SS.setItem('cadeau',g?'1':'0');$('#total').textContent=fmt(net+ship+g)} tot(); var gf=$('#gift'); if(gf)gf.onchange=tot;
  $$('.rm').forEach(function(b){b.onclick=function(){var c=getCart();c.splice(+b.dataset.i,1);setCart(c);cart();$('#live').textContent='Article retiré du panier.'}});
  push({ecommerce:null});push({event:'view_cart',ecommerce:{currency:'EUR',value:net,coupon:duo?'DUO':undefined,discount:duo||undefined,items:c.map(function(l){return item(bySlug(l.slug),l.size,l.qty)})}});
  var t=$('#promo-toggle'); if(t)t.onclick=function(){var z=$('#promo-zone');z.hidden=!z.hidden;t.setAttribute('aria-expanded',String(!z.hidden))};
  $('#checkout').onclick=function(){location.href='commande.html'};
}
function checkout(){
  var c=getCart(); if(!c.length){location.href='panier.html';return}
  var t=calc(c);
  push({ecommerce:null});push({event:'begin_checkout',ecommerce:{currency:'EUR',value:t.net,coupon:t.duo?'DUO':undefined,items:c.map(function(l){return item(bySlug(l.slug),l.size,l.qty)})}});
  recap();
  var m=moi();
  if(m){$('#id-guest').hidden=true;$('#id-known').hidden=false;$('#known-name').textContent=m.prenom;
    $('#go-known').onclick=function(){var o=tget();o.mode='compte';o.email='';tset(o);location.href='livraison.html'};return}
  $('#form').onsubmit=function(e){e.preventDefault();var i=$('#email'),v=i.value.trim();
    if(!mailOk(v)){fieldErr(i,v?'Saisissez une adresse e-mail valide, par exemple nom@exemple.fr.':'Ce champ est obligatoire.');i.focus();return}
    fieldErr(i,'');var o=tget();o.mode='invite';o.email=v;tset(o);location.href='livraison.html'};
}
function confirm(){
  var o=null;try{o=JSON.parse(SS.getItem('commande'))}catch(e){}
  if(!o){$('#conf').textContent='Aucune commande en cours.';return}
  $('#order-id').textContent=o.id; confirmExtras(o);
  var sent=JSON.parse(LS.getItem('achats_envoyes')||'[]');
  if(sent.indexOf(o.id)===-1){
    var t=calc(o.lines), ship=shipFor(o.livraison||'domicile',t.net);
    var ec={transaction_id:o.id,currency:'EUR',value:t.net,tax:r2(t.net-t.net/1.2),shipping:ship,coupon:t.duo?'DUO':undefined,items:o.lines.map(function(l){return item(bySlug(l.slug),l.size,l.qty)})};
    if(typeof o.new_customer==='boolean')ec.new_customer=o.new_customer;
    push({ecommerce:null});push({event:'purchase',ecommerce:ec});
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

function tget(){try{return JSON.parse(SS.getItem('tunnel')||'{}')||{}}catch(e){return {}}}
function tset(o){SS.setItem('tunnel',JSON.stringify(o))}
function comptes(){try{return JSON.parse(LS.getItem('comptes')||'{}')||{}}catch(e){return {}}}
function setComptes(c){LS.setItem('comptes',JSON.stringify(c))}
function r2(n){return Math.round(n*100)/100}
function calc(lines){var sub=lines.reduce(function(a,l){return a+bySlug(l.slug).price*l.qty},0),q=lines.reduce(function(a,l){return a+l.qty},0),duo=q>=2?Math.round(sub*10)/100:0;return {sub:r2(sub),duo:duo,net:r2(sub-duo),gift:SS.getItem('cadeau')==='1'?2.9:0}}
function shipFor(mode,net){return mode==='relais'?2.9:(net>=60?0:4.9)}
function getQ(k){return new URLSearchParams(location.search).get(k)}
function lineList(c){return '<ul>'+c.map(function(l){var p=bySlug(l.slug);return '<li>'+p.name+' ('+l.size+') × '+l.qty+' : '+fmt(p.price*l.qty)+'</li>'}).join('')+'</ul>'}

function moi(){var id=LS.getItem('session');if(!id)return null;var c=comptes();for(var k in c){if(c[k].id===id)return c[k]}return null}
function header(){var a=$('#account-link'),m=moi();if(a&&m)a.textContent='Bonjour, '+m.prenom}
header();
var ME=moi(); if(ME)push({user_id:ME.id});
function fieldErr(i,msg){var er=$('#'+i.id+'-err');if(msg){i.setAttribute('aria-invalid','true');if(er)er.textContent=msg}else{i.removeAttribute('aria-invalid');if(er)er.textContent=''}}
function pwdOk(p){return p.length>=8&&/[A-Z]/.test(p)&&/[0-9]/.test(p)}
function mailOk(m){return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(m)}
function sha(s){return crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)).then(function(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return ('0'+x.toString(16)).slice(-2)}).join('')})}
function toggles(){$$('.show-pwd').forEach(function(b){b.onclick=function(){var i=$('#'+b.getAttribute('aria-controls')),v=i.type==='password';i.type=v?'text':'password';b.textContent=v?'Masquer':'Afficher'}})}
function signupForm(f,done,orders){if(!f)return;toggles();
  f.onsubmit=function(e){e.preventDefault();var first=null,p=$('#su-prenom'),m=$('#su-email'),w=$('#su-pwd'),em=m.value.trim().toLowerCase();
    function bad(i,msg){fieldErr(i,msg);if(msg&&!first)first=i}
    bad(p,p.value.trim()?'':'Ce champ est obligatoire.');
    bad(m,!em?'Ce champ est obligatoire.':(!mailOk(em)?'Saisissez une adresse e-mail valide, par exemple nom@exemple.fr.':(comptes()[em]?'Un compte existe déjà avec cet e-mail. Connectez-vous.':'')));
    bad(w,!w.value?'Ce champ est obligatoire.':(pwdOk(w.value)?'':'Le mot de passe ne respecte pas les règles indiquées.'));
    if(first){first.focus();return}
    var sel=rid()+rid();
    sha(sel+w.value).then(function(h){var c=comptes(),a={id:'VLC-'+rid().toUpperCase(),prenom:p.value.trim(),email:em,sel:sel,empreinte:h,commandes:orders||[]};c[em]=a;setComptes(c);
      push({ecommerce:null});push({event:'sign_up',method:'email'});done(a)})
    .catch(function(){fieldErr(w,'Création du compte impossible dans ce navigateur.');w.focus()})}}
function loginForm(f){if(!f)return;
  f.onsubmit=function(e){e.preventDefault();var m=$('#li-email'),w=$('#li-pwd'),g=$('#li-err'),em=m.value.trim().toLowerCase();g.textContent='';
    fieldErr(m,em?'':'Ce champ est obligatoire.');fieldErr(w,w.value?'':'Ce champ est obligatoire.');
    if(!em){m.focus();return} if(!w.value){w.focus();return}
    var a=comptes()[em];function fail(){g.textContent='E-mail ou mot de passe incorrect.';w.value='';w.focus()}
    if(!a){fail();return}
    sha(a.sel+w.value).then(function(h){if(h!==a.empreinte){fail();return}
      LS.setItem('session',a.id);push({ecommerce:null});push({event:'login',method:'email',user_id:a.id});
      location.href=getQ('retour')==='commande'?'commande.html':'compte.html'})}}
function account(){var m=moi();
  if(m){$('#acc-out').hidden=true;$('#acc-in').hidden=false;$('#acc-name').textContent=m.prenom;var n=m.commandes.length;
    $('#acc-orders').textContent=n+' commande'+(n>1?'s':'')+' passée'+(n>1?'s':'')+' depuis ce navigateur.';
    $('#logout').onclick=function(){LS.setItem('session','');location.href='compte.html'};return}
  toggles();loginForm($('#login'));
  signupForm($('#signup'),function(a){$('#signup').reset();$('#su-ok').textContent='Votre compte est créé. Connectez-vous avec votre e-mail et votre mot de passe.';$('#li-email').value=a.email;$('#li-pwd').focus()})}

function ecoItems(c){return c.map(function(l){return item(bySlug(l.slug),l.size,l.qty)})}
function recap(){var z=$('#recap');if(!z)return 0;var c=getCart(),t=calc(c),mode=tget().livraison||'domicile',s=shipFor(mode,t.net),tot=r2(t.net+s+t.gift);
  z.innerHTML='<h2 style="margin-top:0">Récapitulatif</h2>'+lineList(c)+'<p>Sous-total : '+fmt(t.sub)+'</p>'+(t.duo?'<p>Remise DUO : - '+fmt(t.duo)+'</p>':'')+
    '<p>Livraison '+(mode==='relais'?'en point relais':'à domicile')+' : '+(s?fmt(s):'offerte')+'</p>'+(t.gift?'<p>Emballage cadeau : '+fmt(t.gift)+'</p>':'')+'<p class="price">Total : '+fmt(tot)+'</p>';
  return tot}
function shipping(){var c=getCart();if(!c.length){location.href='panier.html';return}var o=tget();if(!o.mode){location.href='commande.html';return}
  var F=['prenom','nom','adresse','cp','ville'],m=moi();
  F.forEach(function(k){if(o[k])$('#'+k).value=o[k]}); if(!o.prenom&&m)$('#prenom').value=m.prenom;
  if(o.livraison){var r=$('#m-'+o.livraison);if(r)r.checked=true}else{o.livraison='domicile';tset(o)}
  $$('input[name=mode]').forEach(function(r){r.onchange=function(){var x=tget();x.livraison=r.value;tset(x);recap()}});
  recap();
  $('#form').onsubmit=function(e){e.preventDefault();var first=null;
    F.forEach(function(k){var i=$('#'+k);if(!i.value.trim()){fieldErr(i,'Ce champ est obligatoire.');if(!first)first=i}else fieldErr(i,'')});
    if(first){first.focus();return}
    var md=$('input[name=mode]:checked').value,x=tget();F.forEach(function(k){x[k]=$('#'+k).value.trim()});x.livraison=md;tset(x);
    var t=calc(c);push({ecommerce:null});push({event:'add_shipping_info',ecommerce:{currency:'EUR',value:t.net,coupon:t.duo?'DUO':undefined,shipping_tier:md==='relais'?'point_relais':'domicile',items:ecoItems(c)}});
    location.href='paiement.html'}}
function payment(){var c=getCart();if(!c.length){location.href='panier.html';return}var o=tget();if(!o.adresse){location.href='livraison.html';return}
  recap();
  $('#form').onsubmit=function(e){e.preventDefault();var md=$('input[name=pay]:checked'),me=$('#pay-err');
    if(!md){me.textContent='Choisissez un moyen de paiement.';$('#p-carte').focus();return}me.textContent='';
    var t=calc(c),m=moi();push({ecommerce:null});push({event:'add_payment_info',ecommerce:{currency:'EUR',value:t.net,coupon:t.duo?'DUO':undefined,payment_type:md.value==='paypal'?'PayPal':'Carte',items:ecoItems(c)}});
    SS.setItem('commande_a_payer',JSON.stringify({id:'VL-'+Date.now().toString(36).toUpperCase(),lines:c,livraison:o.livraison||'domicile',paiement:md.value,cadeau:t.gift>0,compte:m?m.id:null,lettre:$('#news').checked}));
    location.href='banque.html'}}
function bank(){var o=null;try{o=JSON.parse(SS.getItem('commande_a_payer')||'null')}catch(e){}
  if(!o){$('#bank-zone').innerHTML='<p>Aucun paiement en attente.</p>';return}
  var t=calc(o.lines),s=shipFor(o.livraison,t.net);$('#amount').textContent=fmt(r2(t.net+s+(o.cadeau?2.9:0)));
  $('#validate').onclick=function(){
    if(o.compte){var c=comptes();for(var k in c){var a=c[k];if(a.id===o.compte&&a.commandes.indexOf(o.id)===-1){o.new_customer=a.commandes.length===0;a.commandes.push(o.id)}}setComptes(c)}
    SS.setItem('commande',JSON.stringify(o));SS.setItem('commande_a_payer','');location.href='confirmation.html'}}
function confirmExtras(o){var t=calc(o.lines),s=shipFor(o.livraison||'domicile',t.net),g=o.cadeau?2.9:0,pd=$('#paid');if(pd)pd.textContent=fmt(r2(t.net+s+g));SS.setItem('cadeau','0');
  var z=$('#after-signup'),em=tget().email||'';
  if(z&&!o.compte&&!moi()&&em&&!comptes()[em.toLowerCase()]){z.hidden=false;$('#su-email').value=em;
    signupForm($('#signup'),function(){$('#signup').hidden=true;$('#su-ok').textContent='Votre compte est créé et votre commande y est rattachée. Connectez-vous depuis « Mon compte ».'},[o.id])}}

function lead(){
  var f=$('#lead'); if(!f)return; var started=false;
  f.addEventListener('input',function(){if(!started){started=true;push({event:'form_start',form_name:'rappel'})}});
  f.onsubmit=function(e){e.preventDefault();var first=null;
    $$('#lead input[required],#lead select[required]').forEach(function(i){var er=$('#'+i.id+'-err');if(!i.value.trim()){i.setAttribute('aria-invalid','true');if(er)er.textContent='Ce champ est obligatoire.';if(!first)first=i}else{i.removeAttribute('aria-invalid');if(er)er.textContent=''}});
    if(first){first.focus();return}
    push({event:'generate_lead',form_name:'rappel',besoin:$('#l-besoin').value,optin_partenaires:false});
    f.outerHTML='<p class="notice" role="status">Merci, une styliste vous rappelle sous 48 h (démonstration : aucun appel ne sera passé).</p>'};
}

var pg=document.body.dataset.page;
({lead:lead,pdp:pdp,plp:plp,search:search,cart:cart,checkout:checkout,confirm:confirm,home:home,account:account,shipping:shipping,payment:payment,bank:bank}[pg]||function(){})();
window.__push = push;
})();
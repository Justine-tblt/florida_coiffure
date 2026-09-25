import{looks}from'./lookbook-data.js';

const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

function productCard(p){return `<a class="look-product" href="${esc(p.url)}"><span class="look-product-img"><img src="${esc(p.image)}" alt="" loading="lazy"></span><span>${esc(p.name)}</span></a>`}
function serviceLink(s){return `<a class="look-service" href="${esc(s.url)}">${esc(s.name)} <span aria-hidden="true">→</span></a>`}

function renderLook(look){return `<article class="look-card" data-look-card data-look-category="${esc(look.category.toLowerCase())}" id="${esc(look.id)}">
  <div class="look-image"><img src="${esc(look.image)}" alt="${esc(look.alt)}" loading="lazy"></div>
  <div class="look-copy">
    <p class="surtitre">${esc(look.trend)}</p>
    <h2>${esc(look.title)}</h2>
    <p>${esc(look.description)}</p>
    <details class="shop-look">
      <summary>Adopter le look <span aria-hidden="true">+</span></summary>
      <div class="shop-look-panel">
        <div><h3>Pour obtenir ce résultat</h3><div class="look-services">${look.services.map(serviceLink).join('')}</div></div>
        ${look.products.length?`<div><h3>Pour l’entretenir</h3><div class="look-products">${look.products.map(productCard).join('')}</div></div>`:''}
        <p class="look-care"><strong>Conseil entretien.</strong> ${esc(look.care)}</p>
      </div>
    </details>
  </div>
</article>`}

const root=document.querySelector('[data-lookbook-grid]');
if(root){
  root.innerHTML=looks.map(renderLook).join('');
  const filters=[...document.querySelectorAll('[data-look-filter]')];
  filters.forEach(btn=>btn.addEventListener('click',()=>{
    const filter=btn.dataset.lookFilter;
    filters.forEach(x=>x.setAttribute('aria-pressed',String(x===btn)));
    root.querySelectorAll('[data-look-category]').forEach(card=>{card.hidden=filter!=='all'&&card.dataset.lookCategory!==filter});
  }));
  const hash=decodeURIComponent(location.hash.slice(1));
  if(hash){requestAnimationFrame(()=>document.getElementById(hash)?.scrollIntoView({block:'center'}))}
}

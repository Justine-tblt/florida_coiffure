/* ========================================
   ACCESSIBLE GALLERY + LIGHTBOX + SHOP THE LOOK
======================================== */
const lb=document.querySelector('#lightbox');
let items=[],activeIndex=0,lastFocus=null;
const visibleItems=()=>items.filter(x=>!x.hidden);

function getTrigger(item){return item.matches('[data-gallery-open]')?item:item.querySelector('button')}
function getSrc(item){return item.dataset.full||item.dataset.src||item.querySelector('img')?.src||''}
function getAlt(item){return item.querySelector('img')?.alt||''}
function getCaption(item){return item.dataset.caption||item.querySelector('figcaption')?.textContent||''}
function getLookLink(){return lb?.querySelector('[data-lightbox-look]')}
function updateLookLink(lookId){
  const link=getLookLink();if(!link)return;
  if(lookId){link.href=`/lookbook/#${encodeURIComponent(lookId)}`;link.hidden=false}
  else{link.removeAttribute('href');link.hidden=true}
}
function show(item){
  if(!lb)return;
  const list=visibleItems();activeIndex=Math.max(0,list.indexOf(item));
  const img=lb.querySelector('img'),cap=lb.querySelector('.lightbox-caption');
  img.src=getSrc(item);img.alt=getAlt(item);const caption=getCaption(item);cap.textContent=caption;cap.hidden=!caption;
  updateLookLink(item.dataset.lookId||'');
  lb.hidden=false;document.body.style.overflow='hidden';lastFocus=getTrigger(item)||document.activeElement;
  lb.querySelector('.lightbox-close')?.focus();
}
function close(){if(!lb)return;lb.hidden=true;document.body.style.overflow='';lastFocus?.focus?.()}
function move(step){const list=visibleItems();if(!list.length)return;activeIndex=(activeIndex+step+list.length)%list.length;show(list[activeIndex])}
function bind(){
  items=[...document.querySelectorAll('[data-gallery-item],[data-gallery-open]')];
  items.forEach(item=>{const trigger=getTrigger(item);if(trigger&&!trigger.dataset.bound){trigger.dataset.bound='1';trigger.addEventListener('click',()=>show(item))}});
  const navs=lb?.querySelectorAll('.lightbox-nav');
  navs?.forEach(nav=>nav.hidden=items.length<2);
}

document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{
  const f=btn.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
  document.querySelectorAll('[data-gallery-item]').forEach(item=>item.hidden=f!=='all'&&!item.dataset.category.split(' ').includes(f));
}));

lb?.querySelector('.lightbox-close')?.addEventListener('click',close);
lb?.querySelector('.lightbox-prev')?.addEventListener('click',()=>move(-1));
lb?.querySelector('.lightbox-next')?.addEventListener('click',()=>move(1));
lb?.addEventListener('click',e=>{if(e.target===lb)close()});
document.addEventListener('keydown',e=>{
  if(!lb||lb.hidden)return;
  if(e.key==='Escape')close();
  if(e.key==='ArrowLeft')move(-1);
  if(e.key==='ArrowRight')move(1);
  if(e.key==='Tab'){
    const fs=[...lb.querySelectorAll('button:not([hidden]),a[href]:not([hidden])')].filter(x=>!x.disabled);
    if(!fs.length)return;
    const first=fs[0],last=fs.at(-1);
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
  }
});
document.addEventListener('florida:gallery-updated',bind);
bind();

export function initNavigation(){
  const b=document.querySelector('.menu-toggle');const n=document.querySelector('#main-nav');if(!b||!n)return;
  const label=b.querySelector('.sr-only');
  const setState=open=>{b.setAttribute('aria-expanded',String(open));n.classList.toggle('is-open',open);if(label)label.textContent=open?'Fermer le menu':'Ouvrir le menu';};
  const close=(restore=false)=>{setState(false);if(restore)b.focus();};
  b.addEventListener('click',()=>{const open=b.getAttribute('aria-expanded')!=='true';setState(open);if(open)n.querySelector('a')?.focus();});
  n.addEventListener('click',e=>{if(e.target.closest('a'))close(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&b.getAttribute('aria-expanded')==='true')close(true)});
  addEventListener('resize',()=>{if(innerWidth>1050)close(false)});
}

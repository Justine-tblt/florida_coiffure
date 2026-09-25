/* ========================================
   BEFORE / AFTER COMPARISON
   Accessible with pointer, touch, keyboard and explicit controls.
======================================== */
function clamp(value){return Math.max(0,Math.min(100,Number(value)||0))}

function apply(root,value,{announce=false}={}){
  const v=clamp(value);
  const comparison=root.querySelector('.comparison');
  const input=root.querySelector('[data-comparison-range]');
  const output=root.querySelector('[data-comparison-output]');

  // The CSS variable is defined on .comparison, so it must be updated there.
  // Setting it only on the outer shell was the reason the old control stayed at 50%.
  comparison?.style.setProperty('--pos',`${v}%`);

  if(input){
    input.value=String(v);
    input.setAttribute('aria-valuenow',String(v));
    input.setAttribute('aria-valuetext',v===0?'Vue avant':v===100?'Vue après':`${v}% de la photo après visible`);
  }

  if(output){
    output.textContent=v===0?'Vue avant':v===100?'Vue après':`Comparaison : ${v}% après`;
    if(announce){
      output.setAttribute('aria-live','polite');
      window.setTimeout(()=>output.removeAttribute('aria-live'),700);
    }
  }
}

function initComparison(root){
  if(root.dataset.beforeAprèsReady==='true') return;
  const input=root.querySelector('[data-comparison-range]');
  if(!input) return;

  root.dataset.beforeAprèsReady='true';
  apply(root,input.value||50);

  input.addEventListener('input',event=>apply(root,event.currentTarget.value));
  input.addEventListener('change',event=>apply(root,event.currentTarget.value,{announce:true}));

  root.querySelector('[data-show-before]')?.addEventListener('click',()=>{
    apply(root,0,{announce:true});
    input.focus();
  });
  root.querySelector('[data-show-after]')?.addEventListener('click',()=>{
    apply(root,100,{announce:true});
    input.focus();
  });
  root.querySelector('[data-show-middle]')?.addEventListener('click',()=>{
    apply(root,50,{announce:true});
    input.focus();
  });
}

export function initAvantAprès(scope=document){
  scope.querySelectorAll('[data-before-after]').forEach(initComparison);
}

initAvantAprès();
document.addEventListener('florida:before-after-updated',event=>initAvantAprès(event.target||document));

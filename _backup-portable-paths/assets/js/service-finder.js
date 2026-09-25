/* ========================================
   SERVICE FINDER
   Small decision aid: no medical/technical diagnosis and no booking automation.
======================================== */
const root=document.querySelector('[data-service-finder]');
if(root){
  const form=root.querySelector('form');
  const stage=root.querySelector('[data-finder-stage]');
  const progress=root.querySelector('[data-finder-progress]');
  const status=root.querySelector('[data-finder-status]');
  const back=root.querySelector('[data-finder-back]');
  const restart=root.querySelector('[data-finder-restart]');
  const continueBtn=root.querySelector('[data-finder-next]');
  const finderError=root.querySelector('[data-finder-error]');
  const state={};
  let index=0;

  const questions={
    universe:{
      legend:'Vous cherchez plutôt une prestation…',
      help:'Choisissez l’univers qui correspond à votre besoin.',
      options:[['hair','Coiffure','Coupe, couleur, balayage, boucles, soins…'],['nails','Onglerie','Mains, pieds, gainage, semi-permanent…']]
    },
    hairGoal:{
      legend:'Quel résultat recherchez-vous principalement ?',
      options:[
        ['cut','Changer ou entretenir ma coupe','Coupe sur mesure, forme, mouvement'],
        ['curls','Mieux couper et définir mes boucles','Texture ondulée, bouclée, frisée'],
        ['balayage','Éclaircir / créer un balayage','Lumière, blond, contouring'],
        ['color','Changer ou raviver ma couleur','Coloration, reflets, couverture'],
        ['care','Réparer ou prendre soin de mes cheveux','Soin profond, détox, discipline'],
        ['smooth','Discipliner / lisser / réduire les frisottis','Coiffage facilité et texture maîtrisée'],
        ['extensions','Ajouter longueur ou densité','Projet extensions sur mesure']
      ]
    },
    hairContext:{
      legend:'Est-ce une première visite ou un changement important ?',
      help:'Cette information permet de savoir si la consultation doit passer avant la prestation.',
      options:[['yes','Oui','Première visite, transformation ou historique technique récent'],['no','Non','Entretien habituel sans changement majeur']]
    },
    hairTexture:{
      legend:'Votre texture naturelle est plutôt…',
      options:[['straight','Lisse',''],['wavy','Ondulée',''],['curly','Bouclée / frisée',''],['unknown','Je ne sais pas','']]
    },
    nailZone:{
      legend:'Quelle zone souhaitez-vous travailler ?',
      options:[['hands','Mains',''],['feet','Pieds',''],['both','Mains + pieds','Formule combinée']]
    },
    nailGoal:{
      legend:'Quel est votre besoin principal ?',
      options:[
        ['semi','Une couleur durable sur ongle naturel','Semi-permanent / renforcement'],
        ['gainage','Renforcer mes ongles naturels','Gainage gel'],
        ['length','Ajouter de la longueur','Rallongement / pose complète'],
        ['art','Ajouter une finition créative','French, détails, nail art'],
        ['remove','Retirer une ancienne pose','Dépose']
      ]
    }
  };

  const path=()=>state.universe==='hair'?['universe','hairGoal','hairContext','hairTexture']:state.universe==='nails'?['universe','nailZone','nailGoal']:['universe'];

  function card(value,title,desc,name){
    return `<label class="finder-choice"><input type="radio" name="${name}" value="${value}" required ${state[name]===value?'checked':''}><span><strong>${title}</strong>${desc?`<small>${desc}</small>`:''}</span></label>`;
  }

  function renderQuestion(moveFocus=false){
    const steps=path();
    if(index>=steps.length){renderResult();return}
    const key=steps[index],q=questions[key];
    const total=steps.length;
    progress.style.width=`${((index+1)/total)*100}%`;
    status.textContent=`Étape ${index+1} sur ${total}`;progress.parentElement.setAttribute('aria-valuenow',String(index+1));progress.parentElement.setAttribute('aria-valuemax',String(total));
    stage.innerHTML=`<fieldset class="finder-question"><legend>${q.legend}<span class="question-required">Réponse obligatoire</span></legend>${q.help?`<p class="finder-help">${q.help}</p>`:''}<div class="finder-choices">${q.options.map(o=>card(o[0],o[1],o[2],key)).join('')}</div></fieldset>`;
    back.hidden=index===0;
    restart.hidden=true;
    continueBtn.hidden=false;
    continueBtn.textContent=index===steps.length-1?'Voir ma recommandation':'Continuer';
    if(finderError)finderError.textContent='';
    if(moveFocus)stage.querySelector('input:checked,input')?.focus();
  }

  function resultData(){
    if(state.universe==='nails'){
      if(state.nailZone==='both') return {title:'Formule mains + pieds',url:'/ongles/#formules',why:'Vous souhaitez coordonner les deux zones : les formules combinées permettent de prévoir mains et pieds dans un même parcours.',alts:[['Voir les prestations mains','/ongles/#mains'],['Voir les prestations pieds','/ongles/pieds/']]};
      if(state.nailZone==='feet') return {title:'Prestations pieds',url:'/ongles/pieds/',why:'Votre besoin concerne les pieds : la page onglerie regroupe désormais les options dédiées dans une section séparée.',alts:[['Voir l’onglerie','/ongles/']]};
      const map={
        semi:['Semi-permanent renforcé','/ongles/semi-permanent/','Pour une finition durable sur ongle naturel avec renforcement.'],
        gainage:['Gainage gel','/ongles/gainage/','Pour renforcer la plaque naturelle tout en gardant votre longueur.'],
        length:['Rallongement gel','/ongles/rallongement-gel/','Pour créer de la longueur et structurer la forme.'],
        art:['Nail art','/ongles/nail-art/','Pour compléter une pose avec une finition ou un design personnalisé.'],
        remove:['Dépose','/ongles/depose/','Pour retirer une ancienne matière dans un temps prévu à cet effet.']
      };
      const r=map[state.nailGoal]||map.semi;return{title:r[0],url:r[1],why:r[2],alts:[['Voir toutes les prestations ongles','/ongles/']]};
    }

    const technical=['balayage','color','extensions','smooth'];
    const consultation=state.hairContext==='yes'&&technical.includes(state.hairGoal);
    if(consultation)return{title:'Commencer par la consultation premium',url:'/coiffure/consultation/',why:'Comme il s’agit d’une première visite ou d’un changement important sur un projet technique, la consultation est l’étape la plus sûre avant de réserver la transformation.',alts:[['Voir la prestation envisagée',goalUrl(state.hairGoal)],['Découvrir la coiffure','/coiffure/']]};
    if(state.hairGoal==='cut'&&state.hairTexture==='curly')return{title:'Curly Cut',url:'/coiffure/curly-cut/',why:'Votre priorité est la coupe et votre texture est bouclée ou frisée : la Curly Cut est pensée spécifiquement autour de la forme naturelle.',alts:[['Coupe Signature','/coiffure/coupe-signature/']]};
    const map={
      cut:['Coupe Signature','/coiffure/coupe-signature/','Pour une coupe construite selon votre morphologie, votre texture et vos habitudes.'],
      curls:['Curly Cut','/coiffure/curly-cut/','Pour travailler la coupe, le ressort et la définition de votre texture naturelle.'],
      balayage:['Balayage & éclaircissement','/coiffure/balayage/','Pour apporter de la lumière ou transformer progressivement la couleur.'],
      color:['Coloration sur mesure','/coiffure/coloration/','Pour modifier, raviver ou enrichir votre couleur.'],
      care:['Soins experts','/coiffure/soins/','Pour choisir un protocole selon l’état de la fibre et le besoin principal.'],
      smooth:['Lissage & discipline','/coiffure/lissage/','Pour faciliter le coiffage et maîtriser frisottis ou texture selon le protocole retenu.'],
      extensions:['Extensions','/coiffure/extensions/','Pour construire un projet de longueur, densité ou les deux.']
    };
    const r=map[state.hairGoal]||map.cut;return{title:r[0],url:r[1],why:r[2],alts:[['Voir toutes les prestations coiffure','/coiffure/']]};
  }
  function goalUrl(goal){return({balayage:'/coiffure/balayage/',color:'/coiffure/coloration/',extensions:'/coiffure/extensions/',smooth:'/coiffure/lissage/'})[goal]||'/coiffure/'}

  function renderResult(){
    const r=resultData();
    progress.style.width='100%';status.textContent='Votre recommandation';progress.parentElement.setAttribute('aria-valuenow',progress.parentElement.getAttribute('aria-valuemax')||'1');
    stage.innerHTML=`<div class="finder-result" aria-live="polite"><p class="surtitre">Notre recommandation</p><h2>${r.title}</h2><p class="texte-intro">${r.why}</p><div class="actions"><a class="btn btn-dark" href="${r.url}">Découvrir cette prestation</a><a class="btn btn-light" href="https://www.planity.com/florida-coiffure-30240-le-grau-du-roi" target="_blank" rel="noopener" aria-label="Voir les disponibilités (s’ouvre dans un nouvel onglet)">Voir les disponibilités</a></div>${r.alts?.length?`<div class="finder-alts"><strong>Autres pistes</strong>${r.alts.map(a=>`<a href="${a[1]}">${a[0]} →</a>`).join('')}</div>`:''}<p class="texte-secondaire">Cette recommandation vous donne un point de départ. Pour un projet technique ou une transformation, la consultation avec Agnès permet de confirmer le choix le plus adapté.</p></div>`;
    back.hidden=true;restart.hidden=false;continueBtn.hidden=true;
    stage.querySelector('h2')?.setAttribute('tabindex','-1');stage.querySelector('h2')?.focus();
  }

  form.addEventListener('change',event=>{
    const input=event.target.closest('input[type="radio"]');if(!input)return;
    state[input.name]=input.value;
    // Changing the universe invalidates answers from the other branch.
    if(input.name==='universe'){
      for(const key of ['hairGoal','hairContext','hairTexture','nailZone','nailGoal'])delete state[key];
    }
  });
  continueBtn.addEventListener('click',()=>{const selected=stage.querySelector('input[type="radio"]:checked');if(!selected){if(finderError)finderError.textContent='Choisissez une réponse pour continuer.';stage.querySelector('input[type="radio"]')?.focus();return}if(finderError)finderError.textContent='';index+=1;renderQuestion(true)});
  back.addEventListener('click',()=>{index=Math.max(0,index-1);renderQuestion(true)});
  restart.addEventListener('click',()=>{Object.keys(state).forEach(k=>delete state[k]);index=0;renderQuestion(true)});
  renderQuestion();
}

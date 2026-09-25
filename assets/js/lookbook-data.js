export const looks=[
const __floridaUrl = (path) => {
  const marker = document.querySelector('meta[name="site-root"]');
  const root = marker ? new URL(marker.content, document.baseURI) : new URL('./', document.baseURI);
  return new URL(String(path).replace(/^\//, ''), root).href;
};

  {
    id:'balayage-beige-lumineux',category:'Blonds',trend:'Balayage beige',title:'Blond beige lumineux',
    image:__floridaUrl('/assets/images/coiffure/balayage/balayage-caramel.jpg'),alt:'Balayage blond beige lumineux réalisé chez Florida Coiffure',
    description:'Un éclaircissement lumineux et fondu, pensé pour garder de la profondeur et une repousse douce.',
    services:[{name:'Balayage & éclaircissement',url:__floridaUrl('/coiffure/balayage/')},{name:'Consultation premium',url:__floridaUrl('/coiffure/consultation/')}],
    products:[
      {name:'ColorMotion+ Shampoo',url:__floridaUrl('/produits/colormotion-shampoo/'),image:__floridaUrl('/assets/images/produits/wella/color-motion/shampooing.jpg')},
      {name:'ColorMotion+ Mask',url:__floridaUrl('/produits/colormotion-mask/'),image:__floridaUrl('/assets/images/produits/wella/color-motion/masque.jpg')},
      {name:'Ultimate Repair Miracle Hair',url:__floridaUrl('/produits/ultimate-repair-miracle-hair/'),image:__floridaUrl('/assets/images/produits/wella/ultimate-repair/miracle-hair-rescue.jpg')}
    ],
    care:'À la maison : protéger la couleur, limiter la casse et alterner soin profond et protection sans rinçage.'
  },
  {
    id:'curly-definition',category:'Boucles',trend:'Curly',title:'Boucles définies & souples',
    image:__floridaUrl('/assets/images/coiffure/boucles/curly-cut-boucles.jpg'),alt:'Cheveux bouclés définis après une prestation Florida Coiffure',
    description:'Une coupe pensée autour du ressort naturel de la boucle, avec une routine qui privilégie définition et souplesse.',
    services:[{name:'Curly Cut',url:__floridaUrl('/coiffure/curly-cut/')},{name:'Soins experts',url:__floridaUrl('/coiffure/soins/')}],
    products:[
      {name:'NutriCurls Shampoo',url:__floridaUrl('/produits/nutricurls-shampoo/'),image:__floridaUrl('/assets/images/produits/wella/nutricurls/shampooing.jpg')},
      {name:'NutriCurls Mask',url:__floridaUrl('/produits/nutricurls-mask/'),image:__floridaUrl('/assets/images/produits/wella/nutricurls/masque.jpg')},
      {name:'NutriCurls Curlixir Balm',url:__floridaUrl('/produits/nutricurls-curlixir/'),image:__floridaUrl('/assets/images/produits/wella/nutricurls/curlixir-balm.jpg')}
    ],
    care:'À la maison : démêler avec douceur, préserver l’hydratation et appliquer les coiffants sur cheveux suffisamment humides.'
  },
  {
    id:'brunette-glossy',category:'Brunettes',trend:'Glossy brunette',title:'Brunette glossy',
    image:__floridaUrl('/assets/images/coiffure/coiffage/cheveux-chatains-cuivres.png'),alt:'Cheveux bruns brillants réalisés chez Florida Coiffure',
    description:'Une couleur riche et brillante qui mise sur la profondeur, les reflets et la qualité visuelle de la fibre.',
    services:[{name:'Coloration sur mesure',url:__floridaUrl('/coiffure/coloration/')},{name:'Soins experts',url:__floridaUrl('/coiffure/soins/')}],
    products:[
      {name:'ColorMotion+ Conditioner',url:__floridaUrl('/produits/colormotion-conditioner/'),image:__floridaUrl('/assets/images/produits/wella/color-motion/apres-shampooing.jpg')},
      {name:'ColorMotion+ Mask',url:__floridaUrl('/produits/colormotion-mask/'),image:__floridaUrl('/assets/images/produits/wella/color-motion/masque.jpg')},
      {name:'LuxeOil Elixir',url:__floridaUrl('/produits/luxeoil-elixir/'),image:__floridaUrl('/assets/images/produits/system-professional/luxeoil/huile.png')}
    ],
    care:'À la maison : protéger l’éclat, espacer les agressions thermiques et finir par un soin léger pour la brillance.'
  },
  {
    id:'nails-french-detail',category:'Ongles',trend:'French revisitée',title:'French graphique',
    image:__floridaUrl('/assets/images/ongles/nail-art/semi-permanent-lilas.jpg'),alt:'Nail art french graphique réalisé par Lucy',
    description:'Une base naturelle rehaussée d’un détail graphique : propre, précis et suffisamment fort pour signer le look.',
    services:[{name:'Gainage gel',url:__floridaUrl('/ongles/gainage/')},{name:'Nail art',url:__floridaUrl('/ongles/nail-art/')}],
    products:[],
    care:'Pour préserver le résultat : respecter le rythme de remplissage conseillé et éviter d’arracher ou de décoller la matière.'
  },
  {
    id:'soft-blonde',category:'Blonds',trend:'Soft blonde',title:'Blond doux & fondu',
    image:__floridaUrl('/assets/images/coiffure/balayage/balayage-reflets-chauds.webp'),alt:'Balayage blond doux et fondu réalisé chez Florida Coiffure',
    description:'Un blond plus discret, avec des transitions fondues et une lumière concentrée autour du visage.',
    services:[{name:'Balayage & éclaircissement',url:__floridaUrl('/coiffure/balayage/')}],
    products:[
      {name:'Ultimate Repair Shampoo',url:__floridaUrl('/produits/ultimate-repair-shampoo/'),image:__floridaUrl('/assets/images/produits/wella/ultimate-repair/shampooing.jpg')},
      {name:'Ultimate Repair Conditioner',url:__floridaUrl('/produits/ultimate-repair-conditioner/'),image:__floridaUrl('/assets/images/produits/wella/ultimate-repair/apres-shampooing.jpg')},
      {name:'Ultimate Repair Leave-in',url:__floridaUrl('/produits/ultimate-repair-leavein/'),image:__floridaUrl('/assets/images/produits/wella/ultimate-repair/soin-sans-rincage.jpg')}
    ],
    care:'À la maison : priorité à la réparation et à la protection thermique pour entretenir un éclaircissement sans surcharger la fibre.'
  },
  {
    id:'clean-manicure',category:'Ongles',trend:'Clean manicure',title:'Manucure nude nette',
    image:__floridaUrl('/assets/images/ongles/semi-permanent/semi-permanent-multicolore.jpg'),alt:'Manucure nude semi-permanente réalisée par Lucy',
    description:'Une finition naturelle, lumineuse et très propre pour un rendu discret et sophistiqué.',
    services:[{name:'Semi-permanent renforcé',url:__floridaUrl('/ongles/semi-permanent/')}],
    products:[],
    care:'Prévoir la dépose avec Lucy si nécessaire plutôt que de retirer la matière soi-même.'
  }
];

export const getLook=id=>looks.find(look=>look.id===id);

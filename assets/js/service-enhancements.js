import { serviceContent } from './service-content.js';
import { initReviews } from './reviews.js';
const __floridaUrl = (path) => {
  const marker = document.querySelector('meta[name="site-root"]');
  const root = marker ? new URL(marker.content, document.baseURI) : new URL('./', document.baseURI);
  return new URL(String(path).replace(/^\//, ''), root).href;
};


const main = document.querySelector('main[data-service-slug]');
const slug = main?.dataset.serviceSlug;
const config = slug ? serviceContent[slug] : null;

if (main && config) {
  const looks = config.looks || [];
  const hasLooks = looks.length > 0;
  const lookHref = looks.length === 1 ? `/lookbook/#${looks[0]}` : __floridaUrl('/lookbook/');
  const lookLabel = looks.length === 1 ? 'Voir ce look' : 'Voir les looks';

  const enhancements = document.createElement('div');
  enhancements.className = 'service-enhancements';
  enhancements.innerHTML = `
    <section class="section compact service-review-section">
      <div class="container">
        <div class="section-header">
          <div>
            <p class="surtitre">Avis clients</p>
            <h2>Leur expérience chez Florida.</h2>
          </div>
          <p>Des retours partagés après leur rendez-vous au salon.</p>
        </div>
        <div class="review-grid" data-reviews-for="${config.reviewTag}" data-reviews-limit="3"></div>
      </div>
    </section>

    ${hasLooks ? `
      <section class="section compact dark look-cta-section">
        <div class="container split">
          <div>
            <p class="surtitre">Adopter le look</p>
            <h2>Du résultat à la prestation qui le rend possible.</h2>
            <p>Découvrez les prestations et produits associés à cette inspiration.</p>
          </div>
          <div class="actions">
            <a class="btn btn-light" href="${lookHref}">
              ${lookLabel}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>
    ` : ''}
  `;

  const relatedSection = [...main.querySelectorAll('section')].find((section) =>
    section.querySelector('.liste-prestations') &&
    section.textContent.includes('À découvrir aussi')
  );

  if (relatedSection) {
    main.insertBefore(enhancements, relatedSection);
  } else {
    main.append(enhancements);
  }

  initReviews();
}

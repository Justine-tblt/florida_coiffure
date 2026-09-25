import { looks } from './lookbook-data.js';

const esc = value => String(value ?? '').replace(
  /[&<>"']/g,
  char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char])
);

function productCard(product) {
  return `
    <a class="look-product" href="${esc(product.url)}">
      <span class="look-product-img">
        <img src="${esc(product.image)}" alt="" loading="lazy">
      </span>
      <span>${esc(product.name)}</span>
    </a>
  `;
}

function serviceLink(service) {
  return `
    <a class="look-service" href="${esc(service.url)}">
      ${esc(service.name)}
      <span aria-hidden="true">→</span>
    </a>
  `;
}

function renderLook(look) {
  return `
    <article
      class="look-card"
      data-look-card
      data-look-category="${esc(look.category.toLowerCase())}"
      id="${esc(look.id)}"
    >
      <div class="look-image">
        <img src="${esc(look.image)}" alt="${esc(look.alt)}" loading="lazy">
      </div>

      <div class="look-copy">
        <p class="surtitre">${esc(look.trend)}</p>
        <h2>${esc(look.title)}</h2>
        <p>${esc(look.description)}</p>

        <details class="shop-look">
          <summary>
            Adopter le look
            <span aria-hidden="true">+</span>
          </summary>

          <div class="shop-look-panel">
            <div>
              <h3>Pour obtenir ce résultat</h3>
              <div class="look-services">
                ${look.services.map(serviceLink).join('')}
              </div>
            </div>

            ${look.products.length ? `
              <div>
                <h3>Pour l’entretenir</h3>
                <div class="look-products">
                  ${look.products.map(productCard).join('')}
                </div>
              </div>
            ` : ''}

            <p class="look-care">
              <strong>Conseil entretien.</strong>
              ${esc(look.care)}
            </p>
          </div>
        </details>
      </div>
    </article>
  `;
}

const root = document.querySelector('[data-lookbook-grid]');

if (root) {
  root.innerHTML = looks.map(renderLook).join('');

  const filters = [...document.querySelectorAll('[data-look-filter]')];

  filters.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.lookFilter;

      filters.forEach(item => {
        item.setAttribute('aria-pressed', String(item === button));
      });

      root.querySelectorAll('[data-look-category]').forEach(card => {
        card.hidden =
          filter !== 'all' &&
          card.dataset.lookCategory !== filter;
      });
    });
  });

  const hash = decodeURIComponent(location.hash.slice(1));

  if (hash) {
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({
        block: 'center'
      });
    });
  }
}

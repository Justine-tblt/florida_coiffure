import { localReviews } from './reviews-data.js';

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;',
}[char]));

const fmtDate = (value) => {
  try {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(`${value}T12:00:00`));
  } catch {
    return value || '';
  }
};

const ratingLabel = (rating) => String(rating).replace('.', ',');
const ratingMarkup = (rating) =>
  `<span class="review-rating" aria-label="Note ${esc(ratingLabel(rating))} sur 5"><span aria-hidden="true">★</span> ${esc(ratingLabel(rating))}/5</span>`;

const hairTags = new Set([
  'coiffure', 'consultation', 'coupe-signature', 'curly-cut', 'coloration',
  'balayage', 'extensions', 'soins', 'lissage', 'mise-en-forme',
]);
const nailTags = new Set([
  'ongles', 'semi-permanent', 'gainage', 'rallongement-gel', 'nail-art', 'depose',
]);

function hasTag(review, tag) {
  return (review.tags || []).map((item) => String(item).toLowerCase()).includes(tag);
}

function familyFor(tag) {
  if (hairTags.has(tag)) return 'coiffure';
  if (nailTags.has(tag)) return 'ongles';
  return null;
}

function selectReviews(reviews, tag, max) {
  if (tag === 'all') return reviews.slice(0, max);

  const selected = [];
  const add = (items) => items.forEach((review) => {
    if (!selected.includes(review) && selected.length < max) selected.push(review);
  });

  add(reviews.filter((review) => hasTag(review, tag)));

  const family = familyFor(tag);
  if (selected.length < max && family) add(reviews.filter((review) => hasTag(review, family)));
  if (selected.length < max) {
    add(reviews.filter((review) => hasTag(review, 'all') && (review.tags || []).length === 1));
  }

  return selected.slice(0, max);
}

function render(root, reviews) {
  const tag = (root.dataset.reviewsFor || 'all').toLowerCase();
  const max = Number(root.dataset.reviewsLimit || 3);
  const selected = selectReviews(reviews, tag, max);

  if (!selected.length) {
    root.hidden = true;
    return;
  }

  root.hidden = false;
  root.innerHTML = selected.map((review) => `
    <article class="review-card">
      <div class="review-top">
        ${ratingMarkup(review.rating)}
        <span>${esc(review.source || 'Avis client')}</span>
      </div>
      <blockquote>“${esc(review.text)}”</blockquote>
      <p class="review-meta">${esc(fmtDate(review.date))}</p>
    </article>
  `).join('');
}

export function initReviews() {
  document.querySelectorAll('[data-reviews-for]').forEach((root) => render(root, localReviews));
}

initReviews();

import { initNavigation } from './navigation.js'; import { initFaq } from './faq.js'; initNavigation(); initFaq();
document.querySelectorAll('[data-year]').forEach(x => x.textContent = String(new Date().getFullYear()));


/* ========================================
   CURRENT DAY — OPENING HOURS
======================================== */

document.addEventListener('DOMContentLoaded', () => {
    const currentDay = new Date().getDay();

    document.querySelectorAll('.opening-hours li').forEach((item) => {
        const day = Number(item.dataset.day);

        if (day === currentDay) {
            item.classList.add('is-today');
            item.setAttribute('aria-current', 'date');
        }

        if (item.lastElementChild?.textContent.trim() === 'Fermé') {
            item.classList.add('is-closed');
        }
    });
});
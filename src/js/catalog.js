import { searchMovies } from './api.js';
import { renderMovieList, createEmptyState, showLoader, hideLoader } from './ui.js';
import { generateYears } from './utils.js';

let currentPage = 1;
let currentQuery = '';
let currentYear = '';
let totalPages = 1;

const renderPagination = () => {
  const container = document.getElementById('pagination');
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  let html = '';

  // Prev
  html += `<button class="pagination__btn" ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}">←</button>`;

  // Pages
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  if (start > 1) html += `<button class="pagination__btn" data-page="1">1</button>${start > 2 ? '<span>...</span>' : ''}`;

  for (let i = start; i <= end; i++) {
    html += `<button class="pagination__btn ${i === currentPage ? 'pagination__btn--active' : ''}" data-page="${i}">${i}</button>`;
  }

  if (end < totalPages) html += `${end < totalPages - 1 ? '<span>...</span>' : ''}<button class="pagination__btn" data-page="${totalPages}">${totalPages}</button>`;

  // Next
  html += `<button class="pagination__btn" ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}">→</button>`;

  container.innerHTML = html;

  container.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      const page = Number(btn.dataset.page);
      if (page !== currentPage) {
        loadCatalog(currentQuery, currentYear, page);
      }
    });
  });
};

const loadCatalog = async (query = '', year = '', page = 1) => {
  const results = document.getElementById('catalogResults');
  if (!results) return;

  currentPage = page;
  currentQuery = query;
  currentYear = year;

  showLoader();
  try {
    const data = await searchMovies(query || 'a', year, page);
    totalPages = data.total_pages > 500 ? 500 : data.total_pages;

    results.innerHTML = '';
    if (!data.results || data.results.length === 0) {
      results.appendChild(createEmptyState('Aramanızla eşleşen film bulunamadı.'));
    } else {
      renderMovieList(data.results, results);
    }
    renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error('Katalog yüklenirken hata:', err);
    results.innerHTML = '';
    results.appendChild(createEmptyState('Filmler yüklenirken bir hata oluştu.'));
  } finally {
    hideLoader();
  }
};

export const initCatalog = () => {
  const form = document.getElementById('searchForm');
  const input = document.getElementById('searchInput');
  const yearSelect = document.getElementById('yearSelect');

  if (yearSelect) {
    const years = generateYears();
    yearSelect.innerHTML = '<option value="">Tüm Yıllar</option>' +
      years.map(y => `<option value="${y}">${y}</option>`).join('');
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      loadCatalog(input?.value.trim() || '', yearSelect?.value || '', 1);
    });
  }

  // Initial load
  loadCatalog();
};
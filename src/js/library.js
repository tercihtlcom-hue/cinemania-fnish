import { getLibrary, getLibraryByGenre, removeFromLibrary } from './storage.js';
import { getGenres } from './api.js';
import { renderMovieList, createEmptyState, showLoader, hideLoader } from './ui.js';

let allGenres = [];
let currentGenre = null;
let displayedCount = 0;
const LOAD_STEP = 9;

const renderFilters = () => {
  const container = document.getElementById('libraryFilters');
  if (!container) return;

  const library = getLibrary();
  const usedGenreIds = new Set();
  library.forEach(m => {
    if (m.genre_ids) m.genre_ids.forEach(id => usedGenreIds.add(id));
  });

  const usedGenres = allGenres.filter(g => usedGenreIds.has(g.id));

  container.innerHTML = `
    <button class="library__filter ${!currentGenre ? 'library__filter--active' : ''}" data-genre="">Tümü</button>
    ${usedGenres.map(g => `
      <button class="library__filter ${currentGenre === g.id ? 'library__filter--active' : ''}" data-genre="${g.id}">${g.name}</button>
    `).join('')}
  `;

  container.querySelectorAll('[data-genre]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentGenre = btn.dataset.genre ? Number(btn.dataset.genre) : null;
      displayedCount = 0;
      renderLibrary();
      renderFilters();
    });
  });
};

const renderLibrary = () => {
  const results = document.getElementById('libraryResults');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (!results) return;

  const library = currentGenre ? getLibraryByGenre(currentGenre) : getLibrary();

  if (library.length === 0) {
    results.innerHTML = '';
    results.appendChild(createEmptyState('Kütüphanenizde film bulunmuyor.'));
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
    return;
  }

  const toShow = library.slice(0, displayedCount + LOAD_STEP);
  displayedCount = toShow.length;

  renderMovieList(toShow, results, true);

  if (loadMoreBtn) {
    loadMoreBtn.style.display = displayedCount < library.length ? 'block' : 'none';
  }
};

export const initLibrary = async () => {
  showLoader();
  try {
    allGenres = await getGenres();
    renderFilters();
    renderLibrary();
  } catch (err) {
    console.error('Kütüphane yüklenirken hata:', err);
  } finally {
    hideLoader();
  }

  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      renderLibrary();
    });
  }
};
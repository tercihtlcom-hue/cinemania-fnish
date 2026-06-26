import { getUpcoming } from './api.js';
import { renderMovieList, showLoader, hideLoader } from './ui.js';

export const initUpcoming = async () => {
  const list = document.getElementById('upcomingList');
  if (!list) return;

  showLoader();
  try {
    const data = await getUpcoming();
    renderMovieList(data.results.slice(0, 10), list);
  } catch (err) {
    console.error('Yakında vizyonda yüklenirken hata:', err);
    list.innerHTML = '<li class="empty-state">Yakında vizyonda bilgisi yüklenemedi.</li>';
  } finally {
    hideLoader();
  }
};
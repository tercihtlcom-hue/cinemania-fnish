import { getTrending } from './api.js';
import { renderMovieList, showLoader, hideLoader } from './ui.js';

export const initTrends = async () => {
  const list = document.getElementById('trendsList');
  if (!list) return;

  showLoader();
  try {
    const data = await getTrending('week');
    renderMovieList(data.results.slice(0, 10), list);
  } catch (err) {
    console.error('Trendler yüklenirken hata:', err);
    list.innerHTML = '<li class="empty-state">Trendler yüklenemedi.</li>';
  } finally {
    hideLoader();
  }
};
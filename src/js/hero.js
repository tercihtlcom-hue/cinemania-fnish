import { getTrending } from './api.js';
import { renderHero, showLoader, hideLoader } from './ui.js';

export const initHero = async () => {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;

  showLoader();
  try {
    const data = await getTrending('day');
    const movie = data.results[0];
    if (movie) {
      renderHero(movie, heroSection);
    }
  } catch (err) {
    console.error('Hero yüklenirken hata:', err);
  } finally {
    hideLoader();
  }
};
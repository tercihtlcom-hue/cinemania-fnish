import { initTheme, initScrollTop, initTeamModal } from './ui.js';
import { initHero } from './hero.js';
import { initTrends } from './trends.js';
import { initUpcoming } from './upcoming.js';
import { initCatalog } from './catalog.js';
import { initLibrary } from './library.js';

const path = window.location.pathname;

// Her sayfada çalışanlar
initTheme();
initScrollTop();
initTeamModal();

// Sayfa bazlı init
if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
  initHero();
  initTrends();
  initUpcoming();
}

if (path.includes('catalog.html')) {
  initCatalog();
}

if (path.includes('library.html')) {
  initLibrary();
}
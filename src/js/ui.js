import { getImageUrl, getHeroImageUrl } from './api.js';
import { isInLibrary, addToLibrary, removeFromLibrary } from './storage.js';
import { formatDate } from './utils.js';

// Movie Card
export const createMovieCard = (movie, showRemoveBtn = false) => {
  const saved = isInLibrary(movie.id);
  const btnAction = saved ? 'remove' : 'add';
  const btnIcon = saved ? '✓' : '+';
  const btnClass = saved ? 'movie-card__btn--saved' : '';

  const card = document.createElement('li');
  card.className = 'movie-card';
  card.dataset.id = movie.id;

  card.innerHTML = `
    <button class="movie-card__btn ${btnClass}" data-action="${btnAction}" data-id="${movie.id}">
      ${btnIcon}
    </button>
    <img 
      class="movie-card__poster" 
      src="${getImageUrl(movie.poster_path)}" 
      alt="${movie.title}" 
      loading="lazy"
    >
    <div class="movie-card__info">
      <h3 class="movie-card__title">${movie.title}</h3>
      <div class="movie-card__meta">
        <span>${movie.release_date ? movie.release_date.slice(0, 4) : 'Bilinmiyor'}</span>
        <span class="movie-card__rating">${movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}</span>
      </div>
    </div>
  `;

  // Click card to open modal
  card.addEventListener('click', (e) => {
    if (e.target.closest('.movie-card__btn')) return;
    import('./modal.js').then(({ openMovieModal }) => {
      openMovieModal(movie.id);
    });
  });

  // Add/Remove button
  const btn = card.querySelector('.movie-card__btn');
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (btnAction === 'add') {
      addToLibrary(movie);
      btn.textContent = '✓';
      btn.classList.add('movie-card__btn--saved');
      btn.dataset.action = 'remove';
    } else {
      removeFromLibrary(movie.id);
      if (showRemoveBtn) {
        card.remove();
      } else {
        btn.textContent = '+';
        btn.classList.remove('movie-card__btn--saved');
        btn.dataset.action = 'add';
      }
    }
  });

  return card;
};

// Empty State
export const createEmptyState = (message = 'Sonuç bulunamadı.') => {
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.innerHTML = `
    <div class="empty-state__icon">🎬</div>
    <h3 class="empty-state__title">${message}</h3>
  `;
  return div;
};

// Hero Section
export const renderHero = (movie, container) => {
  const bg = container.querySelector('#heroBg');
  const title = container.querySelector('#heroTitle');
  const overview = container.querySelector('#heroOverview');
  const trailerBtn = container.querySelector('#heroTrailerBtn');

  if (bg) bg.style.backgroundImage = `url(${getHeroImageUrl(movie.backdrop_path)})`;
  if (title) title.textContent = movie.title;
  if (overview) overview.textContent = movie.overview || 'Açıklama bulunmuyor.';

  if (trailerBtn) {
    trailerBtn.onclick = () => {
      import('./modal.js').then(({ openMovieModal }) => {
        openMovieModal(movie.id);
      });
    };
  }
};

// Movie List
export const renderMovieList = (movies, container, showRemoveBtn = false) => {
  container.innerHTML = '';
  if (!movies || movies.length === 0) {
    container.appendChild(createEmptyState());
    return;
  }
  movies.forEach((movie) => {
    container.appendChild(createMovieCard(movie, showRemoveBtn));
  });
};

// Loader
export const showLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('loader--active');
};

export const hideLoader = () => {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.remove('loader--active');
};

// Scroll Top
export const initScrollTop = () => {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('scroll-top--visible');
    } else {
      btn.classList.remove('scroll-top--visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
};

// Theme
export const initTheme = () => {
  const toggle = document.getElementById('themeToggle');
  const icon = toggle?.querySelector('.theme-toggle__icon');
  const saved = localStorage.getItem('cinemania-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved === 'light' || (!saved && !prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'light');
    if (icon) icon.textContent = '☀️';
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('cinemania-theme', 'dark');
        if (icon) icon.textContent = '🌙';
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('cinemania-theme', 'light');
        if (icon) icon.textContent = '☀️';
      }
    });
  }
};

// Team Modal
export const initTeamModal = () => {
  const btn = document.getElementById('teamBtn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    import('./modal.js').then(({ openModal }) => {
      openModal(`
        <h2 style="margin-bottom:24px;text-align:center;">Ekibimiz</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px;">
          ${['Ahmet Yılmaz', 'Mehmet Kaya', 'Ayşe Demir', 'Fatma Şahin', 'Ali Can']
            .map(name => `
              <div style="text-align:center;padding:20px;background:var(--color-bg);border-radius:var(--radius-lg);">
                <div style="width:80px;height:80px;border-radius:50%;background:var(--color-accent);margin:0 auto 12px;display:flex;align-items:center;justify-content:center;font-size:32px;">👤</div>
                <h4 style="font-size:var(--font-size-base);">${name}</h4>
                <p style="font-size:var(--font-size-sm);color:var(--color-text-muted);">Frontend Developer</p>
              </div>
            `).join('')}
        </div>
      `);
    });
  });
};
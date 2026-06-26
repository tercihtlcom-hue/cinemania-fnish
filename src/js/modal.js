import { getMovieDetails, getMovieVideos, getImageUrl } from './api.js';
import { addToLibrary, removeFromLibrary, isInLibrary } from './storage.js';
import { formatDate } from './utils.js';

const modal = document.getElementById('modal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');

export const openModal = (content) => {
  if (!modal || !modalBody) return;
  modalBody.innerHTML = content;
  modal.classList.add('modal--open');
  document.body.style.overflow = 'hidden';
};

export const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('modal--open');
  document.body.style.overflow = '';
};

export const openMovieModal = async (movieId) => {
  const { showLoader, hideLoader } = await import('./ui.js');
  showLoader();

  try {
    const [movie, videos] = await Promise.all([
      getMovieDetails(movieId),
      getMovieVideos(movieId),
    ]);

    const trailer = videos.find((v) => v.type === 'Trailer' && v.site === 'YouTube');
    const saved = isInLibrary(movie.id);

    const genres = movie.genres?.map((g) => g.name).join(', ') || 'Bilinmiyor';
    const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}s ${movie.runtime % 60}dk` : 'Bilinmiyor';

    const content = `
      <div style="display:flex;gap:32px;flex-wrap:wrap;">
        <div style="flex:0 0 300px;max-width:100%;">
          <img src="${getImageUrl(movie.poster_path, 'w500')}" alt="${movie.title}" style="width:100%;border-radius:var(--radius-lg);">
        </div>
        <div style="flex:1;min-width:280px;">
          <h2 style="font-size:var(--font-size-2xl);margin-bottom:12px;">${movie.title}</h2>
          <p style="color:var(--color-text-muted);margin-bottom:20px;">${movie.tagline || ''}</p>

          <div style="display:flex;gap:16px;flex-wrap:wrap;margin-bottom:20px;">
            <span style="background:var(--color-accent);color:#fff;padding:4px 12px;border-radius:var(--radius-sm);font-size:var(--font-size-sm);">★ ${movie.vote_average?.toFixed(1) || '0.0'}</span>
            <span style="color:var(--color-text-muted);font-size:var(--font-size-sm);">${formatDate(movie.release_date)}</span>
            <span style="color:var(--color-text-muted);font-size:var(--font-size-sm);">${runtime}</span>
          </div>

          <p style="margin-bottom:20px;line-height:1.7;">${movie.overview || 'Açıklama bulunmuyor.'}</p>

          <p style="color:var(--color-text-muted);font-size:var(--font-size-sm);margin-bottom:20px;"><strong>Türler:</strong> ${genres}</p>

          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            ${trailer ? `<a href="https://youtube.com/watch?v=${trailer.key}" target="_blank" class="btn btn--primary">Fragman İzle</a>` : ''}
            <button class="btn btn--secondary" id="modalLibBtn" data-id="${movie.id}">
              ${saved ? 'Kütüphaneden Çıkar' : 'Kütüphaneye Ekle'}
            </button>
          </div>
        </div>
      </div>
      ${trailer ? `
        <div style="margin-top:32px;">
          <iframe 
            width="100%" 
            height="400" 
            src="https://www.youtube.com/embed/${trailer.key}" 
            frameborder="0" 
            allowfullscreen
            style="border-radius:var(--radius-lg);"
          ></iframe>
        </div>
      ` : ''}
    `;

    openModal(content);

    // Library button in modal
    const libBtn = document.getElementById('modalLibBtn');
    if (libBtn) {
      libBtn.addEventListener('click', () => {
        const id = Number(libBtn.dataset.id);
        if (isInLibrary(id)) {
          removeFromLibrary(id);
          libBtn.textContent = 'Kütüphaneye Ekle';
        } else {
          addToLibrary(movie);
          libBtn.textContent = 'Kütüphaneden Çıkar';
        }
      });
    }
  } catch (err) {
    openModal(`<p style="text-align:center;color:var(--color-error);">Film detayları yüklenirken hata oluştu.</p>`);
  } finally {
    hideLoader();
  }
};

// Close events
if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal__backdrop')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
      closeModal();
    }
  });
}
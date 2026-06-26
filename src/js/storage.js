const LIBRARY_KEY = 'cinemania_library';

export const getLibrary = () => {
  try {
    return JSON.parse(localStorage.getItem(LIBRARY_KEY)) || [];
  } catch {
    return [];
  }
};

export const addToLibrary = (movie) => {
  const library = getLibrary();
  if (!library.find((m) => m.id === movie.id)) {
    library.push(movie);
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  }
};

export const removeFromLibrary = (movieId) => {
  const library = getLibrary().filter((m) => m.id !== movieId);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
};

export const isInLibrary = (movieId) => {
  return getLibrary().some((m) => m.id === movieId);
};

export const getLibraryByGenre = (genreId) => {
  const library = getLibrary();
  if (!genreId) return library;
  return library.filter((m) => m.genre_ids && m.genre_ids.includes(genreId));
};
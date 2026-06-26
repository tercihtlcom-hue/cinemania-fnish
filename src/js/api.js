import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'tr-TR',
  },
});

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${IMG_BASE}/${size}${path}`;
};

export const getHeroImageUrl = (path) => {
  if (!path) return '';
  return `${IMG_BASE}/original${path}`;
};

export const getTrending = async (timeWindow = 'week', page = 1) => {
  const { data } = await api.get(`/trending/movie/${timeWindow}`, { params: { page } });
  return data;
};

export const getUpcoming = async (page = 1) => {
  const { data } = await api.get('/movie/upcoming', { params: { page } });
  return data;
};

export const searchMovies = async (query, year = '', page = 1) => {
  const params = { query, page };
  if (year) params.primary_release_year = year;
  const { data } = await api.get('/search/movie', { params });
  return data;
};

export const getMovieDetails = async (id) => {
  const { data } = await api.get(`/movie/${id}`);
  return data;
};

export const getMovieVideos = async (id) => {
  const { data } = await api.get(`/movie/${id}/videos`);
  return data.results;
};

export const getGenres = async () => {
  const { data } = await api.get('/genre/movie/list');
  return data.genres;
};

export default api;
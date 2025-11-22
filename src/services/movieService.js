import { getStoredToken } from './authService';
import Constants from 'expo-constants';

const API_BASE =
  (Constants?.manifest?.extra && Constants.manifest.extra.API_BASE) ||
  (Constants?.expoConfig?.extra && Constants.expoConfig.extra.API_BASE) ||
  process.env.API_BASE ||
  'https://api.example.com';

async function request(path, options = {}) {
  const token = await getStoredToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch(e) { json = text; }

  if (!res.ok) {
    const err = new Error(json && json.message ? json.message : 'Request failed');
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json;
}

export async function getNowPlaying(page = 1) {
  return await request(`/movies/now_playing?page=${page}`, { method: 'GET' });
}

export async function getPopular(page = 1) {
  return await request(`/movies/popular?page=${page}`, { method: 'GET' });
}

export async function searchMovies(query, page = 1) {
  return await request(`/movies/search?q=${encodeURIComponent(query)}&page=${page}`, { method: 'GET' });
}

export async function getMovieDetails(id) {
  return await request(`/movies/${id}`, { method: 'GET' });
}

export async function getFavorites() {
  return await request('/users/me/favorites', { method: 'GET' });
}

export async function addFavorite(movieId) {
  return await request('/users/me/favorites', { method: 'POST', body: JSON.stringify({ movieId }) });
}

export async function removeFavorite(movieId) {
  return await request(`/users/me/favorites/${movieId}`, { method: 'DELETE' });
}

const movieService = {
  getNowPlaying,
  getPopular,
  searchMovies,
  getMovieDetails,
  getFavorites,
  addFavorite,
  removeFavorite,
};

export default movieService;

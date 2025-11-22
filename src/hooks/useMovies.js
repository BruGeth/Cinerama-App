import { useState, useCallback } from 'react';
import movieService from '../services/movieService';

export default function useMovies() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadNowPlaying = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const data = await movieService.getNowPlaying(p);
      setList(data.results || data.items || []);
      setPage(p);
      return data;
    } finally { setLoading(false); }
  }, []);

  const search = useCallback(async (query, p = 1) => {
    setLoading(true);
    try {
      const data = await movieService.searchMovies(query, p);
      setList(data.results || data.items || []);
      setPage(p);
      return data;
    } finally { setLoading(false); }
  }, []);

  const getDetails = useCallback(async (id) => {
    setLoading(true);
    try {
      return await movieService.getMovieDetails(id);
    } finally { setLoading(false); }
  }, []);

  const getFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const data = await movieService.getFavorites();
      return data;
    } finally { setLoading(false); }
  }, []);

  const addFavorite = useCallback(async (movieId) => {
    return await movieService.addFavorite(movieId);
  }, []);

  const removeFavorite = useCallback(async (movieId) => {
    return await movieService.removeFavorite(movieId);
  }, []);

  return {
    list,
    page,
    loading,
    loadNowPlaying,
    search,
    getDetails,
    getFavorites,
    addFavorite,
    removeFavorite,
  };
}

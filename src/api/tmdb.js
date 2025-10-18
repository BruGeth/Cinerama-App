import { TMDB_API_KEY } from '@env';

const BASE_URL = 'https://api.themoviedb.org/3';

export const getNowPlayingMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=es-ES`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error al obtener películas:", error);
    return [];
  }
};
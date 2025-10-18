import { TMDB_API_KEY } from '@env';

const BASE_URL = 'https://api.themoviedb.org/3';

//  Función auxiliar para obtener detalles por ID
const fetchDetailedMovies = async (movies) => {
  return await Promise.all(
    movies.map(async (movie) => {
      try {
        const detailRes = await fetch(
          `${BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=es-ES`
        );
        const detailData = await detailRes.json();

        return {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          runtime: detailData.runtime,
          genres: detailData.genres.map((g) => g.name),
          overview: detailData.overview, // ✅ Agregado
        };
      } catch (error) {
        console.error(`Error al obtener detalles de la película ${movie.id}:`, error);
        return null;
      }
    })
  ).then((results) => results.filter((movie) => movie !== null));
};

//  Cartelera 
export const getNowPlayingMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=es-ES`
    );
    const data = await response.json();
    return await fetchDetailedMovies(data.results);
  } catch (error) {
    console.error("Error al obtener películas en cartelera:", error);
    return [];
  }
};

// Preventa 
export const getUpcomingMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=es-ES`
    );
    const data = await response.json();
    return await fetchDetailedMovies(data.results);
  } catch (error) {
    console.error("Error al obtener películas en preventa:", error);
    return [];
  }
};

// Estrenos (Popular)
export const getPopularMovies = async () => {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES`
    );
    const data = await response.json();
    return await fetchDetailedMovies(data.results);
  } catch (error) {
    console.error("Error al obtener películas populares:", error);
    return [];
  }
};
   
import { TMDB_API_KEY } from '@env';

const BASE_URL = 'https://api.themoviedb.org/3';

//  Función auxiliar para obtener detalles por ID
const fetchDetailedMovies = async (movies = []) => {
  if (!Array.isArray(movies) || movies.length === 0) {
    return [];
  }

  const results = await Promise.all(
    movies.map(async (movie) => {
      if (!movie || !movie.id) return null;
      try {
        const detailRes = await fetch(
          `${BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=es-ES`
        );

        if (!detailRes.ok) {
          const text = await detailRes.text();
          console.warn(`TMDB detail non-ok for ${movie.id}:`, detailRes.status, text);
          return null;
        }

        const detailData = await detailRes.json();

        // Asegurar que los campos numéricos siempre sean numbers (evita .toFixed on undefined)
        const runtime = Number(detailData?.runtime ?? movie.runtime ?? 0);
        const vote_average = Number(movie.vote_average ?? detailData?.vote_average ?? 0);

        return {
          // conservar propiedades útiles del objeto original
          ...movie,
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          runtime,
          vote_average,
          genres: Array.isArray(detailData?.genres) ? detailData.genres.map((g) => g.name) : [],
          overview: detailData?.overview ?? movie.overview ?? '',
        };
      } catch (error) {
        console.error(`Error al obtener detalles de la película ${movie.id}:`, error);
        return null;
      }
    })
  );

  return results.filter((m) => m !== null);
};

//  Cartelera 
export const getNowPlayingMovies = async () => {
  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY no definida. Revisa tu .env y la configuración de @env.');
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=es-ES&page=1`
    );

    if (!response.ok) {
      const text = await response.text();
      console.warn('TMDB now_playing non-ok response:', response.status, text);
      return [];
    }

    const data = await response.json();
    const movies = Array.isArray(data?.results) ? data.results : [];
    if (movies.length === 0) {
      console.warn('TMDB: no results en now_playing:', data);
      return [];
    }
    return await fetchDetailedMovies(movies);
  } catch (error) {
    console.error("Error al obtener películas en cartelera:", error);
    return [];
  }
};

// Preventa 
export const getUpcomingMovies = async () => {
  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY no definida. Revisa tu .env y la configuración de @env.');
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=es-ES&page=1`
    );

    if (!response.ok) {
      const text = await response.text();
      console.warn('TMDB upcoming non-ok response:', response.status, text);
      return [];
    }

    const data = await response.json();
    const movies = Array.isArray(data?.results) ? data.results : [];
    if (movies.length === 0) {
      console.warn('TMDB: no results en upcoming:', data);
      return [];
    }
    return await fetchDetailedMovies(movies);
  } catch (error) {
    console.error("Error al obtener películas en preventa:", error);
    return [];
  }
};

// Estrenos (Popular)
export const getPopularMovies = async () => {
  if (!TMDB_API_KEY) {
    console.error('TMDB_API_KEY no definida. Revisa tu .env y la configuración de @env.');
    return [];
  }

  try {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=1`
    );

    if (!response.ok) {
      const text = await response.text();
      console.warn('TMDB popular non-ok response:', response.status, text);
      return [];
    }

    const data = await response.json();
    const movies = Array.isArray(data?.results) ? data.results : [];
    if (movies.length === 0) {
      console.warn('TMDB: no results en popular:', data);
      return [];
    }
    return await fetchDetailedMovies(movies);
  } catch (error) {
    console.error("Error al obtener películas populares:", error);
    return [];
  }
};
// ...existing code...
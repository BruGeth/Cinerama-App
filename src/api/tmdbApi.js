
import axios from "axios";

const tmdbApiKey = '7e46a85427b8ddb50215736449157b6f';
const tmdbBaseUrl = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: tmdbBaseUrl,
  params: { 
    api_key: tmdbApiKey,
    language: 'es-ES' 
}
});

export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: {
        page
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo peliculas:', error);
    throw error;
  }
};


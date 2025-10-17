
import axios from "axios";
import { API_KEY } from "@env";

const tmdbApiKey = API_KEY;
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
    console.error('Error obteniendo películas:', error);
    throw error;
  }
};


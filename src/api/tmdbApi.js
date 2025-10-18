
import axios from "axios";
<<<<<<< HEAD
import { API_KEY } from "@env";

const tmdbApiKey = API_KEY;
=======

const tmdbApiKey = '7e46a85427b8ddb50215736449157b6f';
>>>>>>> 7335b404f7de68ece96cecf7c525800045465128
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
<<<<<<< HEAD
    console.error('Error obteniendo películas:', error);
=======
    console.error('Error obteniendo peliculas:', error);
>>>>>>> 7335b404f7de68ece96cecf7c525800045465128
    throw error;
  }
};


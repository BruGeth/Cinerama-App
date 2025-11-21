import axios from 'axios';
import { API_BASE_URL } from '@env';

// Configuración base de axios
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token de autenticación (cuando esté implementado)
api.interceptors.request.use(
  async (config) => {
    // TODO: Obtener token del contexto de autenticación o AsyncStorage
    // const token = await AsyncStorage.getItem('userToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Error de respuesta:', error.response.data);
      throw new Error(error.response.data.error || 'Error en la petición');
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('Error de red:', error.request);
      throw new Error('No se pudo conectar con el servidor');
    } else {
      // Algo pasó al configurar la petición
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
);

/**
 * Obtener lista de todas las promociones activas
 * @returns {Promise<Object>} Lista de promociones
 */
export const getPromociones = async () => {
  try {
    const response = await api.get('/promociones');
    return response;
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    throw error;
  }
};

/**
 * Obtener detalle completo de una promoción
 * @param {string} id - ID de la promoción
 * @returns {Promise<Object>} Detalle de la promoción
 */
export const getPromocionDetalle = async (id) => {
  try {
    const response = await api.get(`/promociones/${id}`);
    return response;
  } catch (error) {
    console.error(`Error al obtener detalle de promoción ${id}:`, error);
    throw error;
  }
};

/**
 * Generar código único para usar una promoción
 * @param {string} promocionId - ID de la promoción
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object>} Datos del código generado (QR, expiración, etc)
 */
export const generarCodigoPromocion = async (promocionId, userId) => {
  try {
    const response = await api.post(`/promociones/${promocionId}/generar-codigo`, {
      userId,
    });
    return response;
  } catch (error) {
    console.error(`Error al generar código para promoción ${promocionId}:`, error);
    throw error;
  }
};

/**
 * Validar si un código de promoción es válido
 * (Opcional - puede usarse para verificar antes de mostrar)
 * @param {string} code - Código a validar
 * @returns {Promise<Object>} Estado de validez del código
 */
export const validarCodigo = async (code) => {
  try {
    const response = await api.get(`/promociones/codigo/${code}/validar`);
    return response;
  } catch (error) {
    console.error(`Error al validar código ${code}:`, error);
    throw error;
  }
};

/**
 * Obtener promociones filtradas por categoría
 * @param {string} category - Categoría: 'entradas', 'dulceria', 'combo', 'especial'
 * @returns {Promise<Object>} Lista de promociones filtradas
 */
export const getPromocionesPorCategoria = async (category) => {
  try {
    const response = await api.get('/promociones', {
      params: { category },
    });
    return response;
  } catch (error) {
    console.error(`Error al obtener promociones de categoría ${category}:`, error);
    throw error;
  }
};

export default {
  getPromociones,
  getPromocionDetalle,
  generarCodigoPromocion,
  validarCodigo,
  getPromocionesPorCategoria,
};

import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  // Claves de almacenamiento
  KEYS = {
    USER: 'user',
    FAVORITES: 'favorite_movies',
    VIEWING_HISTORY: 'viewing_history',
    PREFERENCES: 'user_preferences',
    CART: 'shopping_cart',
    REMINDERS: 'movie_reminders',
    LAST_SEEN_MOVIES: 'last_seen_movies',
  };

  // ========== PELÍCULAS FAVORITAS ==========
  async getFavorites() {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      return [];
    }
  }

  async addFavorite(movie) {
    try {
      const favorites = await this.getFavorites();
      const exists = favorites.some(fav => fav.id === movie.id);
      
      if (!exists) {
        const newFavorite = {
          ...movie,
          addedAt: new Date().toISOString(),
        };
        favorites.push(newFavorite);
        await AsyncStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(favorites));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al agregar favorito:', error);
      return false;
    }
  }

  async removeFavorite(movieId) {
    try {
      const favorites = await this.getFavorites();
      const filtered = favorites.filter(fav => fav.id !== movieId);
      await AsyncStorage.setItem(this.KEYS.FAVORITES, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      return false;
    }
  }

  async isFavorite(movieId) {
    try {
      const favorites = await this.getFavorites();
      return favorites.some(fav => fav.id === movieId);
    } catch (error) {
      console.error('Error al verificar favorito:', error);
      return false;
    }
  }

  // ========== HISTORIAL DE VISUALIZACIÓN ==========
  async getViewingHistory() {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.VIEWING_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return [];
    }
  }

  async addToHistory(movie) {
    try {
      const history = await this.getViewingHistory();
      const entry = {
        ...movie,
        viewedAt: new Date().toISOString(),
      };
      
      // Evitar duplicados recientes (mantener solo la vista más reciente)
      const filtered = history.filter(item => item.id !== movie.id);
      filtered.unshift(entry); // Agregar al inicio
      
      // Limitar historial a 50 películas
      const limited = filtered.slice(0, 50);
      await AsyncStorage.setItem(this.KEYS.VIEWING_HISTORY, JSON.stringify(limited));
      return true;
    } catch (error) {
      console.error('Error al agregar al historial:', error);
      return false;
    }
  }

  async clearHistory() {
    try {
      await AsyncStorage.setItem(this.KEYS.VIEWING_HISTORY, JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error al limpiar historial:', error);
      return false;
    }
  }

  // ========== PREFERENCIAS DE USUARIO ==========
  async getPreferences() {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.PREFERENCES);
      return data ? JSON.parse(data) : {
        notificationsEnabled: true,
        promotionsEnabled: true,
        remindersEnabled: true,
        language: 'es',
        theme: 'light',
      };
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      return null;
    }
  }

  async updatePreferences(preferences) {
    try {
      const current = await this.getPreferences();
      const updated = { ...current, ...preferences };
      await AsyncStorage.setItem(this.KEYS.PREFERENCES, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      return null;
    }
  }

  // ========== CARRITO DE COMPRAS ==========
  async getCart() {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      return [];
    }
  }

  async addToCart(item) {
    try {
      const cart = await this.getCart();
      const newItem = {
        ...item,
        addedAt: new Date().toISOString(),
        quantity: 1,
      };
      cart.push(newItem);
      await AsyncStorage.setItem(this.KEYS.CART, JSON.stringify(cart));
      return true;
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      return false;
    }
  }

  async removeFromCart(itemId) {
    try {
      const cart = await this.getCart();
      const filtered = cart.filter(item => item.id !== itemId);
      await AsyncStorage.setItem(this.KEYS.CART, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
      return false;
    }
  }

  async clearCart() {
    try {
      await AsyncStorage.setItem(this.KEYS.CART, JSON.stringify([]));
      return true;
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      return false;
    }
  }

  // ========== ÚLTIMAS PELÍCULAS VISTAS ==========
  async updateLastSeenMovies(movieIds) {
    try {
      await AsyncStorage.setItem(this.KEYS.LAST_SEEN_MOVIES, JSON.stringify(movieIds));
      return true;
    } catch (error) {
      console.error('Error al actualizar últimas vistas:', error);
      return false;
    }
  }

  async getLastSeenMovies() {
    try {
      const data = await AsyncStorage.getItem(this.KEYS.LAST_SEEN_MOVIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error al obtener últimas vistas:', error);
      return [];
    }
  }

  // ========== UTILIDADES GENERALES ==========
  async clearAll() {
    try {
      const keys = Object.values(this.KEYS);
      await AsyncStorage.multiRemove(keys);
      return true;
    } catch (error) {
      console.error('Error al limpiar almacenamiento:', error);
      return false;
    }
  }

  async getStorageInfo() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);
      const info = {};
      
      stores.forEach(([key, value]) => {
        info[key] = {
          size: new Blob([value]).size,
          items: value ? JSON.parse(value).length : 0,
        };
      });
      
      return info;
    } catch (error) {
      console.error('Error al obtener info de almacenamiento:', error);
      return null;
    }
  }
}

export default new StorageService();
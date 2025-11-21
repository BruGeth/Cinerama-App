import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Bell, Heart, Star, Ticket, Popcorn, CreditCard } from 'lucide-react-native';
import { getNowPlayingMovies } from '../api/tmdb';
import NotificationService from '../services/NotificationService';
import StorageService from '../services/storageService';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const user = authContext?.user; // Hacer opcional
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastSeenMovies, setLastSeenMovies] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    initializeApp();
    
    return () => {
      NotificationService.removeListeners();
    };
  }, []);

  const initializeApp = async () => {
    setLoading(true);
    
    // 1️⃣ Solicitar permisos
    const granted = await NotificationService.requestPermissions();
    
    if (granted) {
      setupNotificationListeners();
      
      // 2️⃣ Enviar notificación de promoción diaria
      await sendDailyPromo();
    }

    // 3️⃣ Cargar películas
    await fetchMovies();
    
    // 4️⃣ Verificar nuevas películas
    await checkForNewMovies();
    
    // 5️⃣ Verificar carrito abandonado
    await checkAbandonedCart();
    
    // 6️⃣ Cargar historial
    await loadLastSeen();
    
    setLoading(false);
  };

  const fetchMovies = async () => {
    try {
      const data = await getNowPlayingMovies();
      console.log('✅ Películas cargadas:', data.length);
      setMovies(data);
    } catch (error) {
      console.error('❌ Error al cargar películas:', error);
      Alert.alert('Error', 'No se pudieron cargar las películas');
    }
  };

  const loadLastSeen = async () => {
    const ids = await StorageService.getLastSeenMovies();
    setLastSeenMovies(ids);
  };

  // 🔔 Configurar listeners de notificaciones
  const setupNotificationListeners = () => {
    NotificationService.setupListeners(
      (notification) => {
        // Cuando se recibe una notificación mientras la app está abierta
        console.log('📩 Notificación recibida:', notification.request.content.title);
        
        // Limpiar badge
        NotificationService.clearBadge();
      },
      (response) => {
        // Cuando el usuario toca la notificación
        const { movieId, type, promoId } = response.notification.request.content.data;
        
        console.log('👆 Usuario tocó notificación:', type);
        
        // Navegar según el tipo
        switch (type) {
          case 'new_movie':
          case 'reminder':
          case 'release':
            navigation.navigate('Cartelera');
            break;
          case 'daily_promo':
          case 'promotion':
            navigation.navigate('Promociones');
            break;
          case 'cart_reminder':
            navigation.navigate('Cart');
            break;
          case 'purchase_success':
            navigation.navigate('Perfil');
            break;
          case 'favorite_added':
            // Opcional: navegar a favoritos
            break;
        }
      }
    );
  };

  // 🔥 Enviar promoción diaria
  const sendDailyPromo = async () => {
    const prefs = await StorageService.getPreferences();
    if (!prefs.promotionsEnabled) return;

    const lastPromoDate = await AsyncStorage.getItem('last_promo_date');
    const today = new Date().toDateString();
    
    // Solo enviar una vez al día
    if (lastPromoDate !== today) {
      await NotificationService.notifyDailyPromo({
        id: 'daily-promo',
        title: '🍿 2x1 en entradas todos los miércoles'
      });
      await AsyncStorage.setItem('last_promo_date', today);
    }
  };

  // 🎬 Verificar nuevas películas
  const checkForNewMovies = async () => {
    try {
      const data = await getNowPlayingMovies();
      const lastSeen = await StorageService.getLastSeenMovies();
      
      const newMovies = data.filter(movie => !lastSeen.includes(movie.id));
      
      if (newMovies.length > 0) {
        const prefs = await StorageService.getPreferences();
        if (prefs.notificationsEnabled) {
          // Notificar sobre la primera película nueva
          await NotificationService.notifyNewMovie(newMovies[0]);
        }
        
        // Actualizar lista
        const allIds = data.map(m => m.id);
        await StorageService.updateLastSeenMovies(allIds);
      }
    } catch (error) {
      console.error('Error al verificar nuevas películas:', error);
    }
  };

  // 🛒 Verificar carrito abandonado
  const checkAbandonedCart = async () => {
    try {
      const cart = await StorageService.getCart();
      setCartItemCount(cart.length);
      
      if (cart.length > 0) {
        const prefs = await StorageService.getPreferences();
        if (prefs.notificationsEnabled) {
          // Enviar recordatorio de carrito (se envía 1 hora después)
          await NotificationService.notifyCartReminder(cart.length);
        }
      }
    } catch (error) {
      console.error('Error al verificar carrito:', error);
    }
  };

  // 🔔 Programar recordatorio de película
  const scheduleMovieReminder = async (movie) => {
    const prefs = await StorageService.getPreferences();
    if (!prefs.remindersEnabled) {
      Alert.alert(
        'Recordatorios desactivados',
        'Activa los recordatorios en Perfil > Configuración de Notificaciones',
        [{ text: 'Entendido' }]
      );
      return;
    }

    // Simular fecha de función (en producción vendría del backend)
    const showtime = new Date();
    showtime.setHours(showtime.getHours() + 2);

    Alert.alert(
      '🔔 Programar recordatorio',
      `¿Quieres recibir un recordatorio 30 minutos antes de "${movie.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, recordarme',
          onPress: async () => {
            const notificationId = await NotificationService.scheduleMovieReminder(
              movie,
              showtime
            );
            
            if (notificationId) {
              Alert.alert(
                '✅ Recordatorio programado',
                `Te avisaremos 30 minutos antes de la función`,
                [{ text: 'Perfecto' }]
              );
            }
          },
        },
      ]
    );
  };

  // ❤️ Agregar a favoritos con notificación
  const addToFavorites = async (movie) => {
    const added = await StorageService.addFavorite(movie);
    if (added) {
      await NotificationService.notifyFavoriteAdded(movie.title);
      Alert.alert('❤️ Agregado', `"${movie.title}" fue añadida a favoritos`);
    } else {
      Alert.alert('Ya está en favoritos', 'Esta película ya está en tu lista');
    }
  };

  // 🎨 Renderizado
  const renderBanner = ({ item }) => (
    <Image
      source={{ uri: `https://image.tmdb.org/t/p/w500${item.backdrop_path}` }}
      style={styles.bannerImage}
    />
  );

  const renderPromo = ({ item }) => (
    <TouchableOpacity
      style={styles.promoCard}
      onPress={() => navigation.navigate('Promociones')}
    >
      <View style={styles.promoPlaceholder}>
        <Text style={styles.promoEmoji}>{item.emoji}</Text>
        <Text style={styles.promoTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>
        Bienvenido a Cinerama
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A91B3C" />
          <Text style={styles.loadingText}>Cargando películas...</Text>
        </View>
      ) : movies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>😔 No hay películas disponibles</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchMovies}
          >
            <Text style={styles.retryButtonText}>🔄 Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Banner Carrusel */}
          <FlatList
            data={movies.slice(0, 5)}
            renderItem={renderBanner}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            style={styles.carousel}
          />

          {/* Estrenos recientes */}
          <Text style={styles.sectionTitle}>🎬 Estrenos recientes</Text>
          <FlatList
            data={movies.slice(0, 6)}
            renderItem={({ item }) => (
              <View style={styles.movieCard}>
                <Image
                  source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                  style={styles.movieImage}
                />
                <Text style={styles.movieTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.movieSubtitle}>
                  ⭐ {item.vote_average?.toFixed(1) || 'N/A'}
                </Text>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => navigation.navigate('DetallesPelicula', { movie: item })}
                  >
                    <Text style={styles.detailsButtonText}>Ver más</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.reminderButton}
                    onPress={() => scheduleMovieReminder(item)}
                  >
                    <Text style={styles.reminderIcon}>🔔</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => addToFavorites(item)}
                  >
                    <Text style={styles.favoriteIcon}>❤️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          {/* Promociones destacadas */}
          <Text style={styles.sectionTitle}>🔥 Promociones destacadas</Text>
          <FlatList
            data={[
              { id: 'promo1', emoji: '🎟️', title: '2x1 Miércoles' },
              { id: 'promo2', emoji: '🍿', title: 'Combo Familiar' },
              { id: 'promo3', emoji: '💳', title: '20% OFF con Visa' },
            ]}
            renderItem={renderPromo}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          {/* Botón Cartelera */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Cartelera')}
          >
            <Text style={styles.buttonText}>Ver Cartelera completa</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
    padding: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#A91B3C',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#A91B3C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  carousel: {
    marginBottom: 20,
  },
  bannerImage: {
    width: width - 32,
    height: 180,
    borderRadius: 12,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 12,
  },
  movieCard: {
    marginRight: 12,
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  movieImage: {
    width: 130,
    height: 190,
    borderRadius: 8,
    alignSelf: 'center',
  },
  movieTitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 18,
    height: 36,
  },
  movieSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 4,
    justifyContent: 'space-between',
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#A91B3C',
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  reminderButton: {
    backgroundColor: '#FFD700',
    width: 32,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderIcon: {
    fontSize: 14,
  },
  favoriteButton: {
    backgroundColor: '#FFE5EC',
    width: 32,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 14,
  },
  promoCard: {
    marginRight: 12,
  },
  promoPlaceholder: {
    width: 140,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#A91B3C',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  promoEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  promoTitle: {
    fontSize: 13,
    color: '#A91B3C',
    textAlign: 'center',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#A91B3C',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
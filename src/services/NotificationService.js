import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//  Configuración optimizada de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
    this.permissionsGranted = false;
  }

  // ========== GESTIÓN DE PERMISOS ==========
  
  async requestPermissions() {
    if (!Device.isDevice) {
      console.warn('⚠️ Notificaciones solo en dispositivos físicos');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Para recibir notificaciones sobre estrenos y recordatorios, habilita los permisos en Configuración.',
          [{ text: 'Entendido' }]
        );
        return false;
      }

      this.permissionsGranted = true;

      // Configurar canal de Android (REQUERIDO)
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('cinerama-default', {
          name: 'Notificaciones Cinerama',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#A91B3C',
          sound: 'default',
          enableVibrate: true,
        });

        await Notifications.setNotificationChannelAsync('cinerama-promo', {
          name: 'Promociones',
          importance: Notifications.AndroidImportance.DEFAULT,
          vibrationPattern: [0, 150, 150, 150],
          lightColor: '#FFD700',
          sound: 'default',
        });
      }

      console.log('✅ Permisos de notificaciones otorgados');
      return true;
    } catch (error) {
      console.error('❌ Error al solicitar permisos:', error);
      return false;
    }
  }

  async checkPermissionStatus() {
    const { status } = await Notifications.getPermissionsAsync();
    this.permissionsGranted = status === 'granted';
    return this.permissionsGranted;
  }

  // ========== NOTIFICACIONES INMEDIATAS ==========

  //  Bienvenida al iniciar sesión
  async sendWelcomeNotification(userName) {
    if (!this.permissionsGranted) return;
    
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `🎬 ¡Bienvenido${userName ? ', ' + userName : ''}!`,
          body: 'Disfruta de los mejores estrenos y promociones exclusivas',
          data: { type: 'welcome' },
          sound: 'default',
          priority: 'high',
        },
        trigger: { seconds: 2 },
      });
    } catch (error) {
      console.error('Error en notificación de bienvenida:', error);
    }
  }

  //  Nueva película disponible
  async notifyNewMovie(movie) {
    if (!this.permissionsGranted) return;
    
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎉 ¡Nuevo estreno disponible!',
          body: `"${movie.title}" ya está en cartelera. ¡No te lo pierdas!`,
          data: { movieId: movie.id, type: 'new_movie' },
          sound: 'default',
          badge: 1,
        },
        trigger: null, // Inmediato
      });
    } catch (error) {
      console.error('Error al notificar nueva película:', error);
    }
  }

  //  Confirmación de compra
  async notifyPurchaseSuccess(movieTitle, ticketCount) {
    if (!this.permissionsGranted) return;
    
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✅ ¡Compra exitosa!',
          body: `Tienes ${ticketCount} entrada${ticketCount > 1 ? 's' : ''} para "${movieTitle}". ¡Disfruta la función!`,
          data: { type: 'purchase_success' },
          sound: 'default',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error en notificación de compra:', error);
    }
  }

  //  Recordatorio de carrito abandonado
  async notifyCartReminder(itemCount) {
    if (!this.permissionsGranted) return;
    
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🛒 Tienes películas en tu carrito',
          body: `${itemCount} película${itemCount > 1 ? 's' : ''} esperando por ti. ¡Completa tu compra ahora!`,
          data: { type: 'cart_reminder' },
          sound: 'default',
        },
        trigger: { seconds: 3600 }, // 1 hora después
      });
    } catch (error) {
      console.error('Error en notificación de carrito:', error);
    }
  }

  //  Promociones diarias
  async notifyDailyPromo(promo) {
    if (!this.permissionsGranted) return;
    
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🔥 ¡Oferta del día!',
          body: promo.title || '2x1 en entradas todos los miércoles',
          data: { promoId: promo.id, type: 'daily_promo' },
          sound: 'default',
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error en notificación de promo:', error);
    }
  }

  //  Película agregada a favoritos
  async notifyFavoriteAdded(movieTitle) {
    if (!this.permissionsGranted) return;
    
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '❤️ Agregado a favoritos',
          body: `"${movieTitle}" fue añadida a tus favoritos`,
          data: { type: 'favorite_added' },
          sound: 'default',
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      console.error('Error en notificación de favoritos:', error);
    }
  }

  // ========== NOTIFICACIONES PROGRAMADAS ==========

  //  Recordatorio de función (30 min antes)
  async scheduleMovieReminder(movie, showtime) {
    if (!this.permissionsGranted) return null;
    
    try {
      const trigger = new Date(showtime);
      trigger.setMinutes(trigger.getMinutes() - 30);

      // Validar que la fecha sea futura
      if (trigger <= new Date()) {
        console.warn('⚠️ La fecha del recordatorio ya pasó');
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎬 Tu función está por comenzar',
          body: `"${movie.title}" empieza en 30 minutos. ¡No llegues tarde!`,
          data: { movieId: movie.id, type: 'reminder' },
          sound: 'default',
          badge: 1,
        },
        trigger,
      });

      await this.saveReminder(notificationId, movie, showtime);
      return notificationId;
    } catch (error) {
      console.error('Error al programar recordatorio:', error);
      return null;
    }
  }

  // Notificación de estreno próximo
  async scheduleUpcomingRelease(movie, releaseDate) {
    if (!this.permissionsGranted) return null;
    
    try {
      const trigger = new Date(releaseDate);
      trigger.setHours(9, 0, 0, 0); // 9 AM del día de estreno

      if (trigger <= new Date()) return null;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎊 ¡Hoy se estrena!',
          body: `"${movie.title}" ya está disponible en cartelera`,
          data: { movieId: movie.id, type: 'release' },
          sound: 'default',
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Error al programar notificación de estreno:', error);
      return null;
    }
  }

  // ========== GESTIÓN DE RECORDATORIOS ==========

  async saveReminder(notificationId, movie, showtime) {
    try {
      const reminders = await this.getReminders();
      reminders.push({
        id: notificationId,
        movieId: movie.id,
        movieTitle: movie.title,
        showtime: showtime.toISOString(),
        createdAt: new Date().toISOString(),
      });
      await AsyncStorage.setItem('movie_reminders', JSON.stringify(reminders));
    } catch (error) {
      console.error('Error al guardar recordatorio:', error);
    }
  }

  async getReminders() {
    try {
      const data = await AsyncStorage.getItem('movie_reminders');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  }

  async cancelReminder(notificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      const reminders = await this.getReminders();
      const filtered = reminders.filter(r => r.id !== notificationId);
      await AsyncStorage.setItem('movie_reminders', JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error al cancelar recordatorio:', error);
      return false;
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.setItem('movie_reminders', JSON.stringify([]));
      console.log('✅ Todas las notificaciones canceladas');
      return true;
    } catch (error) {
      console.error('Error al cancelar notificaciones:', error);
      return false;
    }
  }

  // ========== LISTENERS ==========

  setupListeners(onNotificationReceived, onNotificationResponse) {
    // Cuando se recibe una notificación
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('📩 Notificación recibida:', notification.request.content.title);
        if (onNotificationReceived) {
          onNotificationReceived(notification);
        }
      }
    );

    // Cuando el usuario toca la notificación
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('👆 Usuario tocó notificación');
        if (onNotificationResponse) {
          onNotificationResponse(response);
        }
      }
    );
  }

  removeListeners() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  // ========== UTILIDADES ==========

  async getScheduledNotifications() {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error al obtener notificaciones programadas:', error);
      return [];
    }
  }

  async getBadgeCount() {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      return 0;
    }
  }

  async setBadgeCount(count) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error al establecer badge:', error);
    }
  }

  async clearBadge() {
    await this.setBadgeCount(0);
  }
}

export default new NotificationService();
import React, { useState, useEffect, useContext } from 'react';
import {View,Text,StyleSheet,ScrollView,Switch,TouchableOpacity,Alert, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import NotificationService from '../services/NotificationService';
import StorageService from '../services/storageService';

export default function PerfilScreen() {
  const navigation = useNavigation();
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const signOut = authContext?.signOut;

  const [preferences, setPreferences] = useState({
    notificationsEnabled: true,
    promotionsEnabled: true,
    remindersEnabled: true,
  });
  const [scheduledCount, setScheduledCount] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState(false);

  useEffect(() => {
    if (user) {
      loadPreferences();
      checkNotificationStatus();
    }
  }, [user]);

  // ============ SI NO HAY USUARIO, MOSTRAR PANTALLA DE LOGIN ============
  if (!user) {
    return (
      <View style={styles.guestContainer}>
        <View style={styles.guestContent}>
          <View style={styles.profileIconContainer}>
            <View style={styles.profileIcon}>
              <Text style={styles.profileIconText}>👤</Text>
            </View>
          </View>

          <Text style={styles.guestTitle}>Mi Perfil</Text>
          <Text style={styles.guestSubtitle}>
            Inicia sesión para guardar tus películas favoritas{'\n'}
            y recibir notificaciones personalizadas
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.loginButtonText}>Iniciar sesión / Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ============ FUNCIONES PARA USUARIO LOGUEADO ============

  const loadPreferences = async () => {
    const prefs = await StorageService.getPreferences();
    setPreferences(prefs);
  };

  const checkNotificationStatus = async () => {
    const hasPermissions = await NotificationService.checkPermissionStatus();
    setPermissionStatus(hasPermissions);
    
    if (hasPermissions) {
      const scheduled = await NotificationService.getScheduledNotifications();
      setScheduledCount(scheduled.length);
    }
  };

  const updatePreference = async (key, value) => {
    const updated = { ...preferences, [key]: value };
    setPreferences(updated);
    await StorageService.updatePreferences(updated);
    
    if (!value && key === 'remindersEnabled') {
      Alert.alert(
        'Recordatorios desactivados',
        '¿Deseas cancelar todos los recordatorios programados?',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Sí, cancelar',
            onPress: async () => {
              await NotificationService.cancelAllNotifications();
              setScheduledCount(0);
              Alert.alert('✅ Recordatorios cancelados');
            },
          },
        ]
      );
    }
  };

  const requestPermissions = async () => {
    const granted = await NotificationService.requestPermissions();
    setPermissionStatus(granted);
    
    if (granted) {
      Alert.alert('✅ Permisos otorgados', 'Ya puedes recibir notificaciones');
    }
  };

  const viewScheduledNotifications = async () => {
    const reminders = await NotificationService.getReminders();
    
    if (reminders.length === 0) {
      Alert.alert('Sin recordatorios', 'No tienes recordatorios programados');
      return;
    }

    const message = reminders.map((r, index) => 
      `${index + 1}. ${r.movieTitle}\n   Función: ${new Date(r.showtime).toLocaleString('es-ES')}`
    ).join('\n\n');

    Alert.alert('🔔 Recordatorios programados', message);
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Cancelar recordatorios',
      '¿Estás seguro de cancelar todos los recordatorios?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar todo',
          style: 'destructive',
          onPress: async () => {
            await NotificationService.cancelAllNotifications();
            setScheduledCount(0);
            Alert.alert('✅ Recordatorios cancelados');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  // ============ PANTALLA DE PERFIL CON SESIÓN ============
  return (
    <ScrollView style={styles.container}>
      {/* Información del usuario */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👤 Perfil</Text>
        <View style={styles.card}>
          <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'correo@ejemplo.com'}</Text>
        </View>
      </View>

      {/* Estado de permisos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔔 Estado de Notificaciones</Text>
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Permisos del sistema:</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: permissionStatus ? '#4CAF50' : '#FF5252' }
            ]}>
              <Text style={styles.statusText}>
                {permissionStatus ? '✓ Activos' : '✗ Inactivos'}
              </Text>
            </View>
          </View>
          
          {!permissionStatus && (
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermissions}
            >
              <Text style={styles.permissionButtonText}>
                Activar permisos de notificaciones
              </Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Recordatorios programados:</Text>
            <Text style={styles.statusValue}>{scheduledCount}</Text>
          </View>
        </View>
      </View>

      {/* Preferencias de notificaciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Configuración de Notificaciones</Text>
        
        <View style={styles.card}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>🔔 Notificaciones generales</Text>
              <Text style={styles.preferenceSubtitle}>
                Estrenos, promociones y actualizaciones
              </Text>
            </View>
            <Switch
              value={preferences.notificationsEnabled}
              onValueChange={(value) => updatePreference('notificationsEnabled', value)}
              trackColor={{ false: '#D0D0D0', true: '#A91B3C' }}
              thumbColor={preferences.notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>🔥 Promociones</Text>
              <Text style={styles.preferenceSubtitle}>
                Ofertas especiales y descuentos
              </Text>
            </View>
            <Switch
              value={preferences.promotionsEnabled}
              onValueChange={(value) => updatePreference('promotionsEnabled', value)}
              trackColor={{ false: '#D0D0D0', true: '#FFD700' }}
              thumbColor={preferences.promotionsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.preferenceRow}>
            <View style={styles.preferenceInfo}>
              <Text style={styles.preferenceTitle}>⏰ Recordatorios de funciones</Text>
              <Text style={styles.preferenceSubtitle}>
                Avisos 30 min antes de tu función
              </Text>
            </View>
            <Switch
              value={preferences.remindersEnabled}
              onValueChange={(value) => updatePreference('remindersEnabled', value)}
              trackColor={{ false: '#D0D0D0', true: '#4CAF50' }}
              thumbColor={preferences.remindersEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </View>

      {/* Acciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🛠️ Acciones</Text>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={viewScheduledNotifications}
        >
          <Text style={styles.actionButtonText}>📅 Ver recordatorios programados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={clearAllNotifications}
        >
          <Text style={styles.actionButtonText}>🗑️ Cancelar todos los recordatorios</Text>
        </TouchableOpacity>
      </View>

      {/* Cerrar sesión */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ===== ESTILOS PARA USUARIO SIN SESIÓN =====
  guestContainer: {
    flex: 1,
    backgroundColor: '#F5E6D3',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  guestContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  profileIconContainer: {
    marginBottom: 30,
  },
  profileIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#A91B3C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#8A1530',
  },
  profileIconText: {
    fontSize: 60,
    color: '#F5E6D3',
  },
  guestTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#A91B3C',
    marginBottom: 16,
    fontFamily: 'ComicNeue-Bold',
  },
  guestSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: '#A91B3C',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  // ===== ESTILOS PARA USUARIO CON SESIÓN =====
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A91B3C',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A91B3C',
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  preferenceSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  actionButton: {
    backgroundColor: '#A91B3C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: '#FF5252',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#A91B3C',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 40,
  },
  logoutButtonText: {
    color: '#A91B3C',
    fontSize: 16,
    fontWeight: '600',
  },
});
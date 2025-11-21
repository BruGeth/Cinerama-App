import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, FlatList, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationService from '../services/NotificationService';
import StorageService from '../services/storageService';

export default function NotificationsScreen() {
  const [preferences, setPreferences] = useState({
    notificationsEnabled: true,
    promotionsEnabled: true,
    remindersEnabled: true,
  });
  const [reminders, setReminders] = useState([]);
  const [scheduledNotifications, setScheduledNotifications] = useState([]);

  useEffect(() => {
    loadPreferences();
    loadReminders();
    loadScheduledNotifications();
  }, []);

  const loadPreferences = async () => {
    const prefs = await StorageService.getPreferences();
    if (prefs) {
      setPreferences(prefs);
    }
  };

  const loadReminders = async () => {
    const data = await NotificationService.getReminders();
    setReminders(data);
  };

  const loadScheduledNotifications = async () => {
    const scheduled = await NotificationService.getScheduledNotifications();
    setScheduledNotifications(scheduled);
  };

  const togglePreference = async (key) => {
    const newValue = !preferences[key];
    const updated = { ...preferences, [key]: newValue };
    setPreferences(updated);
    await StorageService.updatePreferences(updated);

    if (key === 'notificationsEnabled' && !newValue) {
      Alert.alert(
        'Notificaciones desactivadas',
        'No recibirás notificaciones de Cinerama'
      );
    }
  };

  const requestPermissions = async () => {
    const granted = await NotificationService.requestPermissions();
    if (granted) {
      Alert.alert('✅ Permisos otorgados', 'Ahora recibirás notificaciones de Cinerama');
      const updated = { ...preferences, notificationsEnabled: true };
      setPreferences(updated);
      await StorageService.updatePreferences(updated);
    } else {
      Alert.alert(
        '⚠️ Permisos denegados',
        'Ve a Configuración para activar las notificaciones'
      );
    }
  };

  const testNotification = async () => {
    await NotificationService.notifyPromotion({
      id: 'test',
      title: '¡Esta es una notificación de prueba! 🎬',
    });
    Alert.alert('✅ Enviado', 'Deberías ver una notificación ahora');
  };

  const cancelReminder = async (notificationId) => {
    Alert.alert(
      'Cancelar recordatorio',
      '¿Estás seguro de que quieres cancelar este recordatorio?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            await NotificationService.cancelReminder(notificationId);
            loadReminders();
            loadScheduledNotifications();
            Alert.alert('✅ Cancelado', 'Recordatorio eliminado');
          },
        },
      ]
    );
  };

  const clearAllReminders = async () => {
    Alert.alert(
      'Cancelar todos',
      '¿Quieres cancelar todos los recordatorios?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          onPress: async () => {
            await NotificationService.cancelAllNotifications();
            loadReminders();
            loadScheduledNotifications();
            Alert.alert('✅ Limpio', 'Todos los recordatorios eliminados');
          },
        },
      ]
    );
  };

  const renderReminder = ({ item }) => (
    <View style={styles.reminderCard}>
      <View style={styles.reminderInfo}>
        <Text style={styles.reminderTitle}>{item.movieTitle}</Text>
        <Text style={styles.reminderDate}>
          📅 {new Date(item.showtime).toLocaleString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => cancelReminder(item.id)}
        style={styles.cancelButton}
      >
        <Ionicons name="trash-outline" size={20} color="#A91B3C" />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications" size={40} color="#A91B3C" />
        <Text style={styles.headerTitle}>Notificaciones</Text>
        <Text style={styles.headerSubtitle}>
          Configura cómo quieres recibir actualizaciones
        </Text>
      </View>

      {/* Configuración de preferencias */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ Preferencias</Text>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Notificaciones generales</Text>
            <Text style={styles.preferenceDesc}>
              Recibe todas las notificaciones de Cinerama
            </Text>
          </View>
          <Switch
            value={preferences.notificationsEnabled}
            onValueChange={() => togglePreference('notificationsEnabled')}
            trackColor={{ false: '#ccc', true: '#FFD700' }}
            thumbColor={preferences.notificationsEnabled ? '#A91B3C' : '#f4f3f4'}
          />
        </View>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Promociones</Text>
            <Text style={styles.preferenceDesc}>
              Ofertas especiales y descuentos
            </Text>
          </View>
          <Switch
            value={preferences.promotionsEnabled}
            onValueChange={() => togglePreference('promotionsEnabled')}
            trackColor={{ false: '#ccc', true: '#FFD700' }}
            thumbColor={preferences.promotionsEnabled ? '#A91B3C' : '#f4f3f4'}
            disabled={!preferences.notificationsEnabled}
          />
        </View>

        <View style={styles.preferenceRow}>
          <View style={styles.preferenceInfo}>
            <Text style={styles.preferenceTitle}>Recordatorios de funciones</Text>
            <Text style={styles.preferenceDesc}>
              Avisos 30 min antes de tu función
            </Text>
          </View>
          <Switch
            value={preferences.remindersEnabled}
            onValueChange={() => togglePreference('remindersEnabled')}
            trackColor={{ false: '#ccc', true: '#FFD700' }}
            thumbColor={preferences.remindersEnabled ? '#A91B3C' : '#f4f3f4'}
            disabled={!preferences.notificationsEnabled}
          />
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Acciones</Text>

        <TouchableOpacity style={styles.actionButton} onPress={requestPermissions}>
          <Ionicons name="lock-open-outline" size={24} color="#A91B3C" />
          <Text style={styles.actionButtonText}>Solicitar permisos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={testNotification}>
          <Ionicons name="paper-plane-outline" size={24} color="#A91B3C" />
          <Text style={styles.actionButtonText}>Enviar notificación de prueba</Text>
        </TouchableOpacity>
      </View>

      {/* Recordatorios activos */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⏰ Recordatorios activos</Text>
          {reminders.length > 0 && (
            <TouchableOpacity onPress={clearAllReminders}>
              <Text style={styles.clearAllText}>Cancelar todos</Text>
            </TouchableOpacity>
          )}
        </View>

        {reminders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No tienes recordatorios programados</Text>
          </View>
        ) : (
          <FlatList
            data={reminders}
            renderItem={renderReminder}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        )}
      </View>

      {/* Información */}
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#666" />
        <Text style={styles.infoText}>
          Las notificaciones te ayudan a estar al día con estrenos, promociones y tus
          funciones reservadas. Puedes desactivarlas en cualquier momento.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  header: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#A91B3C',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  preferenceDesc: {
    fontSize: 13,
    color: '#666',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#A91B3C',
    fontWeight: '600',
    marginLeft: 12,
  },
  reminderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reminderDate: {
    fontSize: 14,
    color: '#666',
  },
  cancelButton: {
    padding: 8,
  },
  clearAllText: {
    fontSize: 14,
    color: '#A91B3C',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    marginLeft: 12,
    lineHeight: 20,
  },
});
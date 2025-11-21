import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import StorageService from '../services/storageService';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    setLoading(true);
    const data = await StorageService.getViewingHistory();
    setHistory(data);
    setLoading(false);
  };

  const clearHistory = () => {
    Alert.alert(
      'Limpiar historial',
      '¿Estás seguro de que quieres eliminar todo tu historial?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar todo',
          style: 'destructive',
          onPress: async () => {
            await StorageService.clearHistory();
            loadHistory();
            Alert.alert('✅ Historial limpio', 'Se eliminó todo el historial');
          },
        },
      ]
    );
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const viewed = new Date(date);
    const diffMs = now - viewed;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return viewed.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  const renderMovie = ({ item }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() =>
        navigation.navigate('Cartelera', {
          screen: 'Detalles',
          params: { movie: item },
        })
      }
    >
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.genre}>🎬 {item.genre || 'Sin género'}</Text>
        <View style={styles.timeContainer}>
          <MaterialIcons name="access-time" size={16} color="#999" />
          <Text style={styles.time}>{getTimeAgo(item.viewedAt)}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" />
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="history" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Sin historial</Text>
      <Text style={styles.emptyText}>
        Aquí verás las películas que has consultado recientemente
      </Text>
      <TouchableOpacity
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Cartelera')}
      >
        <Text style={styles.exploreButtonText}>Explorar cartelera</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#A91B3C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📜 Mi Historial</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory}>
            <Ionicons name="trash-outline" size={24} color="#A91B3C" />
          </TouchableOpacity>
        )}
        {history.length === 0 && <View style={{ width: 24 }} />}
      </View>

      {!loading && history.length > 0 && (
        <Text style={styles.count}>{history.length} películas vistas</Text>
      )}

      <FlatList
        data={history}
        renderItem={renderMovie}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.list}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A91B3C',
  },
  count: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 16,
  },
  list: {
    padding: 16,
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center',
  },
  poster: {
    width: 80,
    height: 120,
  },
  info: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A91B3C',
    marginBottom: 6,
  },
  genre: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#A91B3C',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  exploreButton: {
    backgroundColor: '#A91B3C',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
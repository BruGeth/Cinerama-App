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
import { Ionicons } from '@expo/vector-icons';
import StorageService from '../services/storageService';

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    setLoading(true);
    const data = await StorageService.getFavorites();
    setFavorites(data);
    setLoading(false);
  };

  const removeFavorite = async (movieId, movieTitle) => {
    Alert.alert(
      'Eliminar favorito',
      `¿Quieres eliminar "${movieTitle}" de tus favoritos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            await StorageService.removeFavorite(movieId);
            loadFavorites();
          },
        },
      ]
    );
  };

  const renderMovie = ({ item }) => (
    <View style={styles.movieCard}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.genre}>🎬 {item.genre || 'Sin género'}</Text>
        <Text style={styles.date}>
          ⭐ Agregada el{' '}
          {new Date(item.addedAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
          })}
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() =>
              navigation.navigate('Cartelera', {
                screen: 'Detalles',
                params: { movie: item },
              })
            }
          >
            <Text style={styles.detailsButtonText}>Ver detalles</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeFavorite(item.id, item.title)}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-dislike-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>No tienes favoritos</Text>
      <Text style={styles.emptyText}>
        Explora la cartelera y marca tus películas favoritas con ❤️
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
        <Text style={styles.headerTitle}>❤️ Mis Favoritos</Text>
        <View style={{ width: 24 }} />
      </View>

      {!loading && favorites.length > 0 && (
        <Text style={styles.count}>{favorites.length} películas guardadas</Text>
      )}

      <FlatList
        data={favorites}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id.toString()}
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
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  poster: {
    width: 100,
    height: 150,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A91B3C',
    marginBottom: 8,
  },
  genre: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginBottom: 12,
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#A91B3C',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
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
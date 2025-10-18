import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getNowPlayingMovies } from '../api/tmdb';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const data = await getNowPlayingMovies();
      setMovies(data);
    };
    fetchMovies();
  }, []);

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
        <Text style={styles.promoTitle}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text style={styles.header}>Bienvenido a Cinerama</Text>

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
              ⭐ {item.vote_average.toFixed(1)} | {item.release_date}
            </Text>
            <View style={styles.detailsButtonContainer}>
              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() => navigation.navigate('Cartelera')}
              >
                <Text style={styles.detailsButtonText}>Ver detalles</Text>
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
          { id: 'promo1', title: '2x1 en entradas' },
          { id: 'promo2', title: 'Combo Nachos + Bebida' },
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
  },
  carousel: {
    marginBottom: 16,
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
    height: 260,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'space-between',
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    alignSelf: 'center',
  },
  movieTitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
  },
  movieSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  detailsButtonContainer: {
    alignItems: 'center',
  },
  detailsButton: {
    backgroundColor: '#A91B3C',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  promoCard: {
    marginRight: 12,
    alignItems: 'center',
    width: 140,
  },
  promoPlaceholder: {
    width: 140,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#A91B3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 14,
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
    marginBottom: 32,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

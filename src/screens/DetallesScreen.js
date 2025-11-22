import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from "react-native";

export default function DetallesScreen({ route }) {
  const { movie } = route.params;

  // Función para renderizar las estrellas
  const renderStars = (rating) => {
    const stars = Math.round((rating / 10) * 5);
    return '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Poster centrado y completo */}
        <View style={styles.posterWrapper}>
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
            style={styles.poster}
            resizeMode="contain"
          />
        </View>

        {/* Card con información */}
        <View style={styles.card}>
          <Text style={styles.title}>{movie.title}</Text>

          {/* Rating */}
          {movie.vote_average > 0 && (
            <View style={styles.ratingContainer}>
              <Text style={styles.stars}>{renderStars(movie.vote_average)}</Text>
              <Text style={styles.ratingText}>{movie.vote_average.toFixed(1)}/10</Text>
            </View>
          )}

          {/* Info básica */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>⏱ Duración</Text>
              <Text style={styles.infoValue}>{movie.runtime} min</Text>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>🎭 Género</Text>
              <Text style={styles.infoValue}>
                {movie.genres && movie.genres.length > 0 
                  ? movie.genres[0] 
                  : 'Drama'}
              </Text>
            </View>
          </View>

          {/* Géneros completos en chips */}
          {movie.genres && movie.genres.length > 0 && (
            <View style={styles.tagContainer}>
              {movie.genres.slice(0, 3).map((genre, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{genre}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Sinopsis */}
          <View style={styles.synopsisSection}>
            <Text style={styles.synopsisTitle}>Sinopsis</Text>
            <Text style={styles.synopsis}>
              {movie.overview || 'Disfruta de este increíble estreno disponible ahora en cartelera. Vive la experiencia del cine con emoción, sonido envolvente y grandes historias.'}
            </Text>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Comprar entradas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },

  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },

  scrollContent: {
    paddingBottom: 40, 
  },

  posterWrapper: {
    width: '100%',
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5E6D3',
    paddingTop: 10,
  },

  poster: {
    width: '100%',
    height: '100%',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    padding: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#A91B3C',
    textAlign: 'center',
    marginBottom: 12,
  },

  // Rating con estrellas
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },

  stars: {
    fontSize: 16,
    letterSpacing: 2,
  },

  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A91B3C',
  },

  // Info reorganizada
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    marginBottom: 16,
  },

  infoItem: {
    flex: 1,
    alignItems: 'center',
  },

  infoDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0D0C0',
  },

  infoLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  tagContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },

  tag: {
    backgroundColor: '#A91B3C',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
  },

  tagText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },

  // Sinopsis
  synopsisSection: {
    marginBottom: 20,
  },

  synopsisTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#A91B3C',
    marginBottom: 10,
  },

  synopsis: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
    textAlign: 'justify',
  },

  button: {
    backgroundColor: '#A91B3C',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#A91B3C',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import StorageService from "../services/storageService";

const CARD_WIDTH = Dimensions.get("window").width * 0.45;

export default function MovieCard({
  title,
  poster,
  genre,
  duration,
  sectionColor = "#B00020",
  ...movie
}) {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    checkFavoriteStatus();
  }, [movie.id]);

  const checkFavoriteStatus = async () => {
    const status = await StorageService.isFavorite(movie.id);
    setIsFavorite(status);
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await StorageService.removeFavorite(movie.id);
        setIsFavorite(false);
        Alert.alert("❌ Eliminado", "Película eliminada de favoritos");
      } else {
        const movieData = {
          id: movie.id,
          title,
          poster_path: poster,
          genre,
          runtime: duration,
          ...movie,
        };
        await StorageService.addFavorite(movieData);
        setIsFavorite(true);
        Alert.alert("⭐ Agregado", "Película agregada a favoritos");
      }
    } catch (error) {
      console.error("Error al cambiar favorito:", error);
      Alert.alert("Error", "No se pudo actualizar favoritos");
    }
  };

  const handleViewDetails = () => {
    // Agregar al historial cuando se ven detalles
    StorageService.addToHistory({
      id: movie.id,
      title,
      poster_path: poster,
      genre,
      runtime: duration,
    });
    navigation.navigate("Detalles", { movie: { ...movie, title, poster_path: poster, genre, runtime: duration } });
  };

  return (
    <View style={[styles.card, { borderColor: sectionColor }]}>
      {/* Botón de favorito en la esquina superior derecha */}
      <TouchableOpacity style={styles.favoriteButton} onPress={toggleFavorite}>
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={24}
          color={isFavorite ? "#A91B3C" : "#fff"}
        />
      </TouchableOpacity>

      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${poster}` }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: sectionColor }]} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.details} numberOfLines={1}>
            🎞️ {genre} • ⏱️ {duration} min
          </Text>
        </View>
        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.button, { backgroundColor: sectionColor }]}>
            <Text style={styles.buttonText}>Comprar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#333" }]}
            onPress={handleViewDetails}
          >
            <Text style={styles.buttonText}>Detalles</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginRight: 12,
    overflow: "hidden",
    elevation: 3,
    borderWidth: 1.2,
    position: "relative",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },
  image: {
    width: "100%",
    aspectRatio: 2 / 3,
  },
  info: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "space-between",
    height: 110,
  },
  textBlock: {
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  details: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    lineHeight: 16,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
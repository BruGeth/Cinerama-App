import React from "react";
import {  View,  Text,  Image,  StyleSheet,  TouchableOpacity,  Dimensions,} from "react-native";
import { useNavigation } from "@react-navigation/native";

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

  return (
    <View style={[styles.card, { borderColor: sectionColor }]}>
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
            onPress={() => navigation.navigate("Detalles", { movie })}
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

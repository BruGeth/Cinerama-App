import React, { useEffect, useState } from "react";
import {  View,  Text,  StyleSheet,  FlatList,  ActivityIndicator,  ScrollView,} from "react-native";
import {  getNowPlayingMovies,  getUpcomingMovies,  getPopularMovies,} from "../api/tmdb";
import MovieCard from "../components/MovieCard";

export default function CarteleraScreen() {
  const [cartelera, setCartelera] = useState([]);
  const [preventa, setPreventa] = useState([]);
  const [estrenos, setEstrenos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      const [now, upcoming, popular] = await Promise.all([
        getNowPlayingMovies(),
        getUpcomingMovies(),
        getPopularMovies(),
      ]);
      setCartelera(now);
      setPreventa(upcoming);
      setEstrenos(popular);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const renderSection = (title, data, color) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard
            title={item.title}
            poster={item.poster_path}
            genre={item.genres?.[0] || "Sin género"}
            duration={item.runtime}
            sectionColor={color}
          />
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 Cartelera Cinerama</Text>
        <Text style={styles.headerSubtitle}>Explora lo mejor del cine hoy</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#B00020" />
      ) : (
        <>
          {renderSection("En cartelera", cartelera, "#B00020")}
          {renderSection("Preventa", preventa, "#0077CC")}
          {renderSection("Próximos estrenos", estrenos, "#009688")}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBEFE1",
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 24,
    marginBottom: 12,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#B00020",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
});

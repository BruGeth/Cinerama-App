import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CarteleraScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎬 Cartelera</Text>
      <Text style={styles.text}>Listado de películas y horarios.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  text: { fontSize: 16, color: "#555" },
});
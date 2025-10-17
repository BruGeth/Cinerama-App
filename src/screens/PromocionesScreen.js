import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PromocionesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎟️ Promociones</Text>
      <Text style={styles.text}>Ofertas y descuentos vigentes.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  text: { fontSize: 16, color: "#555" },
});
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Perfil</Text>
      <Text style={styles.text}>Información del usuario y ajustes.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  text: { fontSize: 16, color: "#555" },
});
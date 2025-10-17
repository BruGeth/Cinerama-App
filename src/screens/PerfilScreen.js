import React from "react";
import { View, Text, StyleSheet, Button, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

export default function PerfilScreen() {
  const navigation = useNavigation();
  const { user, loading, signOut } = React.useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    // opción: mostrar botón para abrir AuthScreen
    return (
      <View style={styles.container}>
        <Text style={styles.title}>👤 Perfil</Text>
        <Text style={styles.text}>Aún no has iniciado sesión.</Text>
        <Button title="Iniciar sesión / Registrarse" onPress={() => navigation.navigate("Auth")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Perfil</Text>
      <Text style={styles.text}>Bienvenido, {user.name || "usuario"}.</Text>
      <Button title="Cerrar sesión" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  text: { fontSize: 16, color: "#555", marginBottom: 12 },
});
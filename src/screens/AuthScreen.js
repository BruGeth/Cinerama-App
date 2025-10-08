import { useState } from "react";
import { View, Button, StyleSheet, StatusBar, ScrollView, Text, Image } from "react-native";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthScreen() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#A91B3C" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          {/* Si encontramos un logo como imagen, reemplaza el source por la ruta */}
          {/* <Image source={require('../assets/logo.png')} style={styles.logo} /> */}
          <Text style={styles.logoText}>CINERAMA</Text>
        </View>
        <View style={styles.switchContainer}>
          <Button
            title="Login"
            color={showLogin ? "#A91B3C" : "#ccc"}
            onPress={() => setShowLogin(true)}
          />
          <Button
            title="Register"
            color={!showLogin ? "#A91B3C" : "#ccc"}
            onPress={() => setShowLogin(false)}
          />
        </View>
        {showLogin ? <LoginForm /> : <RegisterForm />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A91B3C",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    letterSpacing: 2,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
});
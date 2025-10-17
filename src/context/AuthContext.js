import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // intenta cargar usuario/token guardado
    (async () => {
      try {
        const json = await AsyncStorage.getItem("user");
        if (json) setUser(JSON.parse(json));
      } catch (e) {
        console.warn("Failed to load user", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
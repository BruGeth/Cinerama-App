import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationService from "../services/NotificationService";

export const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const json = await AsyncStorage.getItem("user");
      if (json) {
        setUser(JSON.parse(json));
      }
    } catch (e) {
      console.warn("Failed to load user", e);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (userData) => {
    try {
      // Guardar usuario
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      
      // 🔔 Enviar notificación de bienvenida
      const hasPermissions = await NotificationService.checkPermissionStatus();
      if (hasPermissions) {
        await NotificationService.sendWelcomeNotification(userData.name || userData.email);
      }
      
      console.log('✅ Usuario autenticado:', userData.email);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem("user");
      
      // Opcional: Cancelar todas las notificaciones al cerrar sesión
      // await NotificationService.cancelAllNotifications();
      
      console.log('✅ Sesión cerrada');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../screens/AuthScreen";
import MainTabs from "./MainTabs";
import NotificationsScreen from "../screens/NotificationsScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import HistoryScreen from "../screens/HistoryScreen";
import { AuthProvider } from "../context/AuthContext";
import DetallesScreen from "../screens/DetallesScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Inicio"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Auth" component={AuthScreen} options={{
            headerShown: true, title: "Autenticación", headerStyle: { backgroundColor: '#A91B3C' },
            headerTintColor: '#fff', headerTitleStyle: { fontWeight: 'bold' }
          }}
          />
          <Stack.Screen name="Inicio" component={MainTabs} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: false }}
          />
          <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ headerShown: false }}
          />
          <Stack.Screen name="History" component={HistoryScreen} options={{ headerShown: false }}
          />
          <Stack.Screen name="Detalles" component={DetallesScreen} options={{ headerShown: true, title: "Detalles de la Película" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
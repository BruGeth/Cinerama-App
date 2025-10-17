import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../screens/AuthScreen";
import MainTabs from "./MainTabs";
import { AuthProvider } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Inicio" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: true, title: "Autenticación" }} />
          <Stack.Screen name="Inicio" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
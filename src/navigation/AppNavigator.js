import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "../screens/AuthScreen";
import MainTabs from "./MainTabs";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{ headerShown: false }}
      >
         <Stack.Screen name="Auth" component={AuthScreen} />
         <Stack.Screen name="Main" component={MainTabs} />
        {/* agrega más pantallas aquí */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

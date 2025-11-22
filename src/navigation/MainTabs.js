import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import CarteleraScreen from "../screens/CarteleraScreen";
import PromocionesScreen from "../screens/PromocionesScreen";
import PromocionDetalleScreen from "../screens/PromocionDetalleScreen";
import PromocionQRScreen from "../screens/PromocionQRScreen";
import PerfilScreen from "../screens/PerfilScreen";
import CinesCercaScreen from "../screens/CinesCercaScreen";

const Tab = createBottomTabNavigator();
const PromocionesStack = createNativeStackNavigator();

function PromocionesStackScreen() {
  return (
    <PromocionesStack.Navigator screenOptions={{ headerShown: false }}>
      <PromocionesStack.Screen name="PromocionesLista" component={PromocionesScreen} />
      <PromocionesStack.Screen name="PromocionDetalle" component={PromocionDetalleScreen} />
      <PromocionesStack.Screen name="PromocionQR" component={PromocionQRScreen} />
    </PromocionesStack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#ff5a5f",
        tabBarInactiveTintColor: "#666",
        tabBarIcon: ({ color, size, focused }) => {
          switch (route.name) {
            case "Home":
              return <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />;
            case "Cartelera":
              return <MaterialIcons name="local-movies" size={size} color={color} />;
            case "Promociones":
              return <FontAwesome5 name="ticket-alt" size={size} color={color} />;
            case "Cines":
              return <MaterialIcons name="location-on" size={size} color={color} />;
            case "Perfil":
              return <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
      <Tab.Screen name="Cartelera" component={CarteleraScreen} options={{ title: "Cartelera" }} />
      <Tab.Screen name="Cines" component={CinesCercaScreen} options={{ title: "Cines" }} />
      <Tab.Screen name="Promociones" component={PromocionesStackScreen} options={{ title: "Promociones" }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ title: "Perfil" }} />
    </Tab.Navigator>
  );
}
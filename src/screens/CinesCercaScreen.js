import React, { useEffect, useState, useRef } from "react";
import { View, Text, ActivityIndicator, Button, Linking, Platform, TouchableOpacity, FlatList, Image } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import styles from "../styles/CinesCercaScreen.styles";

const CINEMAS = [
  { id: 1, name: "Cinerama Pacífico", lat: -12.119421689443314, lng: -77.02976373855152, address: "Av. Jose Pardo 121 - Miraflores", googleAddress: "https://maps.google.com/?q=Cinerama+Pacífico", image: "https://www.cinerama.com.pe/_admin/assets/images/cines/pacifico.jpg" }, 
  { id: 2, name: "Cinerama Minka", lat: -12.048215961647074, lng: -77.11144377243852, address: "Av. Argentina 3093 - CC Minka 2do Nivel", googleAddress: "https://maps.google.com/?q=Cinerama+Minka", image: "https://www.cinerama.com.pe/_admin/assets/images/cines/minka.jpg" },
];

function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function CinesCercaScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [nearest, setNearest] = useState(null);
  const [region, setRegion] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  const findNearest = (coords) => {
    if (!coords) return;
    let best = null;
    CINEMAS.forEach((c) => {
      const d = haversine(coords.latitude, coords.longitude, c.lat, c.lng);
      if (best == null || d < best.distance) {
        best = { ...c, distance: d };
      }
    });
    setNearest(best);
  };

  const requestAndFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError("Permiso para acceder a la ubicación denegado.");
        setLoading(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const coords = pos.coords;
      setLocation(coords);
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      findNearest(coords);
    } catch (err) {
      setError("Error al obtener la ubicación: " + (err.message || err.toString()));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestAndFetch();
  }, []);

  useEffect(() => {
    if (nearest && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: nearest.lat,
          longitude: nearest.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        400
      );

      const ref = markersRef.current[nearest.id];
      if (ref && typeof ref.showCallout === "function") {
        try {
          ref.showCallout();
        } catch (e) {
        }
      }
    }
  }, [nearest]);

  const openMaps = (lat, lng, label) => {
    const encodedLabel = encodeURIComponent(label || "Cine");
    if (Platform.OS === "ios") {
      const url = `http://maps.apple.com/?ll=${lat},${lng}&q=${encodedLabel}`;
      Linking.openURL(url);
    } else {
      const url = `geo:${lat},${lng}?q=${lat},${lng}(${encodedLabel})`;
      Linking.openURL(url).catch(() => {
        const web = CINEMAS.googleAddress;
        Linking.openURL(web);
      });
    }
  };

  const renderTitle = (content) => (
    <Text style={styles.title}>{content}</Text>
  );

  const renderLoading = () => (
    <ActivityIndicator size="large" color="#ff5a5f" />
  );

  const renderMap = () => (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {CINEMAS.map((c) => (
          <Marker
            key={c.id}
            coordinate={{ latitude: c.lat, longitude: c.lng }}
            title={c.name}
            description={c.address}
            pinColor="#2b86f0"
            onPress={() => {
              if (location) {
                setNearest({ ...c, distance: haversine(location.latitude, location.longitude, c.lat, c.lng) });
              } else {
                setNearest({ ...c, distance: null });
              }
              mapRef.current?.animateToRegion({ latitude: c.lat, longitude: c.lng, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 350);
            }}
          />
        ))}
      </MapView>
    </View>
  );

  const renderError = (errorMsg) => (
    <View style={styles.block}>
      <Text style={styles.error}>{errorMsg}</Text>
      <Button title="Reintentar" onPress={requestAndFetch} />
      <View style={{ height: 8 }} />
      <Button title="Abrir ajustes" onPress={() => Linking.openSettings()} />
    </View>
  );

  const renderNearest = () => (
    <View style={styles.block}>
      <Text style={styles.name}>{nearest.name}</Text>
      <Text style={styles.address}>{nearest.address}</Text>
      <Text style={styles.distance}>{nearest.distance.toFixed(2)} km</Text>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => openMaps(nearest.lat, nearest.lng, nearest.name)}
        >
        <Text style={styles.cardButtonText}>Abrir en Maps</Text>
        </TouchableOpacity>
      <TouchableOpacity
          style={styles.mapButton}
          onPress={requestAndFetch}
        >
        <Text style={styles.cardButtonText}>Actualizar ubicación</Text>
        </TouchableOpacity>
        <View style={{ height: 12 }} />
    </View> 
  );

  const renderNoNearest = () => (
    <View style={styles.block}>
      <Text>No se encontraron cines.</Text>
      <Button title="Reintentar" onPress={requestAndFetch} />
    </View>
  );

  const renderSedesTitle = (content) => (
    <Text style={styles.sectionTitle}>{content}</Text>
  );

  const renderCard = (cinema) => (
    <View style={styles.card}>
      <Image source={{ uri: cinema.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{cinema.name}</Text>
        <Text style={styles.cardAddr}>{cinema.address}</Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => Linking.openURL(cinema.googleAddress)}
        >
          <Text style={styles.cardButtonText}>Abrir en Google Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    switch (item.type) {
      case 'title':
        return renderTitle(item.content);
      case 'loading':
        return renderLoading();
      case 'map':
        return renderMap();
      case 'error':
        return renderError(item.content);
      case 'nearest':
        return renderNearest();
      case 'noNearest':
        return renderNoNearest();
      case 'sedesTitle':
        return renderSedesTitle(item.content);
      case 'card':
        return renderCard(item.data);
      default:
        return null;
    }
  };

  const getSections = () => {
    const sections = [];
    sections.push({ id: 'title', type: 'title', content: 'Cines Cercanos' });
    
    if (loading) {
      sections.push({ id: 'loading', type: 'loading' });
    }
    
    if (!loading && !error && region) {
      sections.push({ id: 'map', type: 'map' });
    }
    
    if (!loading && error) {
      sections.push({ id: 'error', type: 'error', content: error });
    }
    
    if (!loading && !error && nearest) {
      sections.push({ id: 'nearest', type: 'nearest' });
    }
    
    if (!loading && !error && !nearest) {
      sections.push({ id: 'noNearest', type: 'noNearest' });
    }
    
    sections.push({ id: 'sedesTitle', type: 'sedesTitle', content: 'Nuestras sedes' });
    CINEMAS.slice(0, 2).forEach((c) => {
      sections.push({ id: `card-${c.id}`, type: 'card', data: c });
    });
    
    return sections;
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={getSections()}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}
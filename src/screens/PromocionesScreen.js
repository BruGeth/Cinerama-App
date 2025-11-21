import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';

const { width } = Dimensions.get('window');

const promociones = [
  {
    id: 'promo1',
    title: '🎬 2x1 en entradas',
    description: 'Compra una entrada y llévate otra totalmente gratis. Válido de lunes a jueves.',
    image: 'https://files.merca20.com/uploads/2023/11/BOLETOS-DE-CINE-2X1-MEXICO-.jpg',
  },
  {
    id: 'promo2',
    title: '🍿 Combo Nachos + Bebida',
    description: 'Disfruta de nachos con queso y una bebida grande a precio especial.',
    image: 'https://pbs.twimg.com/media/EDLAPLBXUAEuhrp.jpg:large',
  },
  {
    id: 'promo3',
    title: '🎉 Descuento por cumpleaños',
    description: 'Celebra tu día con un 30% de descuento en cualquier función. Presenta tu DNI.',
    image: 'https://cumples.cinemadevoto.com.ar/assets/images/banner-cumple.jpg',
  },
];

export default function PromocionesScreen({ navigation }) {
  const handleVerMas = (promo) => {
    navigation.navigate('PromocionDetalle', { promocionId: promo.id });
  };

  const renderPromo = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleVerMas(item)}
        >
          <Text style={styles.buttonText}>Ver más</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>🎁 Promociones especiales para ti</Text>
      </View>
      <FlatList
        data={promociones}
        renderItem={renderPromo}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
    paddingHorizontal: 16,
    paddingTop: 40, 
  },
  headerContainer: {
    marginBottom: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#A91B3C',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 180,
  },
  textContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A91B3C',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#333',
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#A91B3C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
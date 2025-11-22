import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function PromocionDetalleScreen({ route, navigation }) {
  const { promocionId } = route.params;

  // Datos de ejemplo - luego conectaremos con el backend
  const promocionesData = {
    'promo1': {
      id: 'promo1',
      title: '🎬 2x1 en entradas',
      description: 'Aprovecha esta increíble promoción donde al comprar una entrada, obtienes otra completamente gratis. Válida para todas las películas en cartelera de lunes a jueves en cualquier horario. No aplica en días festivos ni estrenos especiales. Esta promoción es perfecta para disfrutar del cine con tu acompañante favorito sin gastar de más.',
      imageUrl: 'https://files.merca20.com/uploads/2023/11/BOLETOS-DE-CINE-2X1-MEXICO-.jpg',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      terms: [
        'Válido de lunes a jueves',
        'No aplica en días festivos',
        'No acumulable con otras promociones',
        'Presentar código QR en taquilla',
        'Sujeto a disponibilidad de sala',
        'No válido para estrenos de fin de semana'
      ],
    },
    'promo2': {
      id: 'promo2',
      title: '🍿 Combo Nachos + Bebida',
      description: 'Disfruta de una deliciosa porción de nachos con queso cheddar fundido acompañados de una bebida grande de tu elección. Perfecto para compartir o disfrutar solo durante tu película favorita. El combo incluye nachos tamaño grande, salsa de queso premium y bebida de 32oz. Disponible en dulcería todos los días de la semana.',
      imageUrl: 'https://pbs.twimg.com/media/EDLAPLBXUAEuhrp.jpg:large',
      validFrom: '2024-01-15',
      validTo: '2024-11-30',
      terms: [
        'Válido todos los días',
        'Disponible solo en dulcería',
        'Bebida a elección del cliente',
        'No incluye extras adicionales',
        'Un combo por persona',
        'Precio especial no aplicable con otros descuentos'
      ],
    },
    'promo3': {
      id: 'promo3',
      title: '🎉 Descuento por cumpleaños',
      description: 'Celebra tu día especial con nosotros y obtén un 30% de descuento en cualquier función. Válido el día de tu cumpleaños y 3 días antes o después. Incluye descuento en entrada y dulcería. Trae a tus amigos y familiares para celebrar en grande. Presenta tu DNI o documento oficial que acredite tu fecha de nacimiento.',
      imageUrl: 'https://cumples.cinemadevoto.com.ar/assets/images/banner-cumple.jpg',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      terms: [
        'Presentar DNI o documento oficial vigente',
        'Válido 3 días antes y 3 días después de tu cumpleaños',
        'Aplica para entradas y dulcería',
        'Descuento del 30% en total de compra',
        'Máximo 4 entradas con descuento',
        'No acumulable con otras promociones'
      ],
    }
  };

  const promocion = promocionesData[promocionId] || promocionesData['promo1'];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Banner/Imagen principal */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: promocion.imageUrl }} 
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido principal */}
      <View style={styles.content}>
        {/* Título */}
        <Text style={styles.title}>{promocion.title}</Text>

        {/* Fechas de vigencia */}
        <View style={styles.validityContainer}>
          <View style={styles.validityBadge}>
            <Text style={styles.validityLabel}>📅 Válido desde</Text>
            <Text style={styles.validityDate}>{formatDate(promocion.validFrom)}</Text>
          </View>
          <View style={styles.validityBadge}>
            <Text style={styles.validityLabel}>📅 Válido hasta</Text>
            <Text style={styles.validityDate}>{formatDate(promocion.validTo)}</Text>
          </View>
        </View>

        {/* Descripción completa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Descripción</Text>
          <Text style={styles.description}>{promocion.description}</Text>
        </View>

        {/* Términos y condiciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Términos y Condiciones</Text>
          <View style={styles.termsList}>
            {promocion.terms.map((term, index) => (
              <View key={index} style={styles.termItem}>
                <Text style={styles.termBullet}>•</Text>
                <Text style={styles.termText}>{term}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Botón de acción */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('PromocionQR', { promocion })}
          >
            <Text style={styles.primaryButtonText}>🎟️ Usar Promoción</Text>
          </TouchableOpacity>
        </View>

        {/* Nota informativa */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Presenta esta promoción en taquilla o registra el código en la app antes de realizar tu compra.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 280,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#A91B3C',
    marginBottom: 20,
    textAlign: 'center',
  },
  validityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  validityBadge: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  validityLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  validityDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#A91B3C',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A91B3C',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  termsList: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  termItem: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  termBullet: {
    fontSize: 18,
    color: '#A91B3C',
    marginRight: 8,
    fontWeight: 'bold',
  },
  termText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  actionButtons: {
    marginTop: 8,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#A91B3C',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#A91B3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
  },
});

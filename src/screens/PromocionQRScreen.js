import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const { width } = Dimensions.get('window');

export default function PromocionQRScreen({ route, navigation }) {
  const { promocion } = route.params;
  const [qrData, setQrData] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutos en segundos

  useEffect(() => {
    // Generar código único para el QR
    // En producción, esto vendría del backend con el ID del usuario
    const codigoUnico = `CINERAMA-${promocion.id.toUpperCase()}-${Date.now()}`;
    setQrData(codigoUnico);

    // Temporizador para la validez del código
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tu Código QR</Text>
      </View>

      {/* Información de la promoción */}
      <View style={styles.promoInfo}>
        <Text style={styles.promoTitle}>{promocion.title}</Text>
        <Text style={styles.promoSubtitle}>Presenta este código en taquilla</Text>
      </View>

      {/* Código QR */}
      <View style={styles.qrContainer}>
        {qrData ? (
          <View style={styles.qrWrapper}>
            <QRCode
              value={qrData}
              size={width * 0.7}
              backgroundColor="white"
              color="#A91B3C"
            />
          </View>
        ) : (
          <ActivityIndicator size="large" color="#A91B3C" />
        )}
      </View>

      {/* Código alfanumérico */}
      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Código:</Text>
        <Text style={styles.codeText}>{qrData}</Text>
      </View>

      {/* Temporizador */}
      <View style={styles.timerContainer}>
        <Text style={styles.timerLabel}>⏱️ Tiempo restante</Text>
        <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        {timeRemaining === 0 && (
          <Text style={styles.expiredText}>Código expirado</Text>
        )}
      </View>

      {/* Instrucciones */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>📱 Instrucciones de uso</Text>
        <View style={styles.instructionsList}>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>
              Presenta este código QR en la taquilla o dulcería
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>
              El personal escaneará el código para validar tu promoción
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>
              El código es válido por 5 minutos desde su generación
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Text style={styles.instructionNumber}>4</Text>
            <Text style={styles.instructionText}>
              Solo puede usarse una vez
            </Text>
          </View>
        </View>
      </View>

      {/* Botón para regenerar código */}
      {timeRemaining === 0 && (
        <TouchableOpacity 
          style={styles.regenerateButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.regenerateButtonText}>Generar nuevo código</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5E6D3',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#A91B3C',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  promoInfo: {
    padding: 20,
    alignItems: 'center',
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A91B3C',
    textAlign: 'center',
    marginBottom: 8,
  },
  promoSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  qrWrapper: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  codeContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  codeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  codeText: {
    fontSize: 12,
    color: '#A91B3C',
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  timerContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#A91B3C',
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#A91B3C',
  },
  expiredText: {
    fontSize: 16,
    color: '#d32f2f',
    fontWeight: 'bold',
    marginTop: 8,
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A91B3C',
    marginBottom: 16,
  },
  instructionsList: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#A91B3C',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: 'bold',
    marginRight: 12,
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  regenerateButton: {
    backgroundColor: '#A91B3C',
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#A91B3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  regenerateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

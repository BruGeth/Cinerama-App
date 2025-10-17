import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
   const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

const validateEmail = (value) => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(value);
  };

const isFormValid =
    acceptTerms &&
    fullName.trim() !== '' &&
    email.trim() !== '' &&
    password !== '' &&
    confirmPassword !== '' &&
    !errors.email &&
    !errors.password &&
    !errors.confirmPassword;

  const validateField = (field, value) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (field === 'email') {
        next.email = value ? (validateEmail(value) ? '' : 'Formato de email inválido') : 'El email es obligatorio';
      }
      if (field === 'password') {
        next.password = value ? (value.length >= 6 ? '' : 'La contraseña debe tener mínimo 6 caracteres') : 'La contraseña es obligatoria';
      }
      if (field === 'confirmPassword') {
        next.confirmPassword = value ? (value === password ? '' : 'Las contraseñas no coinciden') : 'Confirma la contraseña';
      }
      return next;
    });
  };

  const handleRegister = () => {
    // validar todos los campos antes de enviar
    validateField('email', email);
    validateField('password', password);
    validateField('confirmPassword', confirmPassword);

    // Pequeña espera para que setErrors se aplique o comprobar directamente:
    const hasErrors =
      !validateEmail(email) ||
      password.length < 6 ||
      password !== confirmPassword ||
      fullName.trim() === '' ||
      !acceptTerms;

    if (hasErrors) {
      return;
    }

    // simulación de registro exitoso
    Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente.');
    console.log('Register attempt:', {
      fullName,
      email,
      password,
      confirmPassword,
      acceptTerms,
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Crear Cuenta</Text>
      <Text style={styles.subtitle}>
        Crea tu cuenta y disfruta de la mejor experiencia cinematográfica
      </Text>
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder=""
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            onBlur={() => validateField('email', email)}
            placeholder=""
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              onBlur={() => validateField('password', password)}
              placeholder=""
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onBlur={() => validateField('confirmPassword', confirmPassword)}
              placeholder=""
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.termsContainer}
          onPress={() => setAcceptTerms(!acceptTerms)}
        >
          <View style={styles.checkbox}>
            {acceptTerms && (
              <Ionicons name="checkmark" size={16} color="#A91B3C" />
            )}
          </View>
          <Text style={styles.termsText}>
            Acepto los términos y condiciones
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.registerButton,
            !isFormValid && styles.registerButtonDisabled,
          ]}
          onPress={handleRegister}
          disabled={!isFormValid}
        >
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5E6D3',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#A91B3C',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#333',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingRight: 55,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 18,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 3,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  termsText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  registerButton: {
    backgroundColor: '#A91B3C',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 6,
  },
  registerButtonDisabled: {
    backgroundColor: '#ccc',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    marginTop: 6,
    marginLeft: 6,
  },
});
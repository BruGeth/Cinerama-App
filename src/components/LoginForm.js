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
import { validateEmail, validatePassword } from '../utils/validators';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    validateField('email', email);
    validateField('password', password);

    const hasErrors = !validateEmail(email) || !validatePassword(password) || email.trim() === '' || password === '';
    if (hasErrors) return;

    Alert.alert('Login exitoso', 'Has iniciado sesión correctamente (simulado).');
    console.log('Login attempt:', { email, password, rememberMe });
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
  };

  const validateField = (field, value) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (field === 'email') {
        next.email = value ? (validateEmail(value) ? '' : 'Formato de email inválido') : 'El email es obligatorio';
      }
      if (field === 'password') {
        next.password = value ? (validatePassword(value) ? '' : 'La contraseña debe tener mínimo 6 caracteres') : 'La contraseña es obligatoria';
      }
      return next;
    });
  };

  const isFormValid =
    email.trim() !== '' &&
    password !== '' &&
    !errors.email &&
    !errors.password;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <Text style={styles.subtitle}>
        Ingresa a tu cuenta para acceder a todas las funciones
      </Text>
      <View style={styles.form}>
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
        <TouchableOpacity style={[styles.loginButton,
          !isFormValid && styles.loginButtonDisabled,
        ]} onPress={handleLogin} disabled={!isFormValid}>
          <Text style={styles.loginButtonText}>Iniciar sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rememberContainer}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View style={styles.checkbox}>
            {rememberMe && (
              <Ionicons name="checkmark" size={16} color="#A91B3C" />
            )}
          </View>
          <Text style={styles.rememberText}>Recordarme</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>
            ¿OLVIDASTE TU CONTRASEÑA?
          </Text>
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
    marginBottom: 4,
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
    paddingHorizontal: 20,
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
  loginButton: {
    backgroundColor: '#A91B3C',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
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
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
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
  rememberText: {
    fontSize: 14,
    color: '#333',
  },
  forgotPassword: {
    fontSize: 14,
    color: '#A91B3C',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
});
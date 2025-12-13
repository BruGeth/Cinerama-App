# Cinerama-App

Aplicación móvil creada con Expo/React Native para gestión de autenticación (login / registro) y futuras pantallas de cine.

## Estructura principal
- [App.js](App.js) — Punto de entrada de navegación (Stack) y registro de la pantalla inicial.
- [index.js](index.js) — Registro del componente raíz con Expo.
- [package.json](package.json) — Dependencias y scripts.
- [app.json](app.json) — Configuración de Expo.
- [.gitignore](.gitignore) — Archivos ignorados por Git.
- [src/screens/AuthScreen.js](src/screens/AuthScreen.js) — Pantalla de autenticación que alterna entre login y registro. Componente: [`AuthScreen`](src/screens/AuthScreen.js)
- [src/components/LoginForm.js](src/components/LoginForm.js) — Formulario de inicio de sesión. Componente: [`LoginForm`](src/components/LoginForm.js)
- [src/components/RegisterForm.js](src/components/RegisterForm.js) — Formulario de registro. Componente: [`RegisterForm`](src/components/RegisterForm.js)

## Requisitos
- Node.js (LTS recomendado)
- Expo CLI (opcionalmente instalado globalmente)

## Instalación y ejecución
Instalar dependencias:
```sh
npm install
```

Iniciar en modo desarrollo:
```sh
npm run start
```

Abrir directamente en Android / iOS / Web:
```sh
npm run android
npm run ios
npm run web
```

## Notas de desarrollo
- La navegación está definida en [App.js](App.js) usando `@react-navigation/native` / `createNativeStackNavigator`.
- La pantalla de autenticación principal es [src/screens/AuthScreen.js](src/screens/AuthScreen.js) y alterna entre los componentes [`LoginForm`](src/components/LoginForm.js) y [`RegisterForm`](src/components/RegisterForm.js).
- Iconos provienen de `@expo/vector-icons` (ver [`LoginForm`](src/components/LoginForm.js), [`RegisterForm`](src/components/RegisterForm.js)).

## Variables de entorno (.env)

- Crea un archivo `.env` en la raíz del proyecto con tu clave de TMDB:
```env
TMDB_API_KEY=TU_TMDB_API_KEY_AQUI
```
- Reemplaza TU_TMDB_API_KEY_AQUI por tu clave real.
- Mantén este archivo local y no lo subas al repositorio.

## 🚀 PUBLICACIÓN EN GOOGLE PLAY STORE

Esta app está configurada para publicar en Google Play Store usando **EAS Build**.

### Documentación Importante
- **[README_PUBLICATION.md](README_PUBLICATION.md)** ← **COMIENZA AQUÍ** - Guía completa de publicación
- [BUILD_AND_PUBLISH_GUIDE.md](BUILD_AND_PUBLISH_GUIDE.md) - Guía detallada
- [BUILD_MANUAL_INSTRUCTIONS.md](BUILD_MANUAL_INSTRUCTIONS.md) - Instrucciones manuales
- [PRIVACY_POLICY.md](PRIVACY_POLICY.md) - Política de privacidad
- [TECHNICAL_CONFIG.md](TECHNICAL_CONFIG.md) - Configuración técnica

### Generar Builds

**APK (Para Teléfono)**:
```bash
eas build --platform android --profile preview
```

**AAB (Para Play Store)**:
```bash
eas build --platform android --profile production
```

### Información del Proyecto
- **Package**: `com.cinerama.app`
- **Version**: `1.0.0`
- **Min SDK**: 23 (Android 6.0)
- **Target SDK**: 34 (Android 14)
- **EAS Project**: https://expo.dev/accounts/leeashh/projects/cinerama


# 🚀 INSTRUCCIONES MANUALES PARA GENERAR BUILD

## Si el comando `eas build` no funciona completamente interactivo:

### OPCIÓN 1: Via Expo Web Dashboard (Más Fácil)

1. **Ve a tu proyecto en Expo**:
   https://expo.dev/accounts/leeashh/projects/cinerama

2. **Haz click en "New Build"**

3. **Selecciona**:
   - Platform: Android
   - Build type: APK (para preview)
   - Profile: preview

4. **Inicia el build** y espera 5-15 minutos

5. **Descarga el APK** cuando esté listo

---

### OPCIÓN 2: Via CLI (Línea de comandos)

Abre PowerShell y ejecuta paso a paso:

```powershell
# Navega a tu proyecto
cd "c:\Users\hugog\Desktop\CURSOS\Desarrollo de Aplicaciones Moviles\Cinerama-App"

# Intenta el build
eas build --platform android --profile preview
```

**Si EAS pregunta "Configure this project?"**:
- Presiona **Y** (sí) y ENTER

**Espera a que termine** (5-15 minutos)

---

### OPCIÓN 3: Build Production (AAB para Play Store)

Una vez el APK funciona, generar el AAB:

```powershell
cd "c:\Users\hugog\Desktop\CURSOS\Desarrollo de Aplicaciones Moviles\Cinerama-App"
eas build --platform android --profile production
```

---

## 📥 CÓMO DESCARGAR TUS BUILDS

1. Ve a: https://expo.dev/accounts/leeashh/projects/cinerama
2. Verás un historial de builds
3. Busca el que dice "FINISHED"
4. Haz click y descarga:
   - APK para teléfono
   - AAB para Play Store

---

## 📱 CÓMO INSTALAR APK EN TU TELÉFONO

### Opción A: USB
1. Conecta tu teléfono por USB
2. Copia el APK descargado a la carpeta Downloads
3. En el teléfono:
   - Settings > Security > Unknown Sources (Allow)
   - Abre Files app
   - Busca el APK
   - Toca para instalar

### Opción B: Sin USB
1. Descarga el APK directamente en tu teléfono desde:
   https://expo.dev/accounts/leeashh/projects/cinerama
2. En el teléfono:
   - Settings > Security > Unknown Sources (Allow)
   - Toca el APK descargado
   - Instala

### Opción C: Compartir por WhatsApp/Email
1. Descarga en PC
2. Comparte el APK a tu teléfono
3. Abre y instala

---

## ✅ DESPUÉS DE INSTALAR

1. **Abre la app** Cinerama
2. **Prueba todo**:
   - ✓ Login/Register
   - ✓ Cartelera de películas
   - ✓ Detalles de película
   - ✓ Cines cercanos (permite ubicación)
   - ✓ Promociones y QR
   - ✓ Perfil del usuario
   - ✓ Historial
   - ✓ Favoritos

3. **Verifica que no haya crashes**

4. **Si todo funciona**: ¡Continúa al siguiente paso!

---

## 🎯 SIGUIENTE: GENERAR AAB

Una vez que el APK esté probado y funcionando:

```powershell
eas build --platform android --profile production
```

Esto generará un AAB (Android App Bundle) para Google Play Store.

---

## 💡 COMANDOS ÚTILES

```powershell
# Ver estado de tus builds
eas build:list --platform android

# Ver detalles de un build específico
eas build:view <BUILD_ID>

# Info del proyecto
eas project:info

# Ver logs del build
eas build:logs <BUILD_ID>
```

---

## 🆘 SI ALGO FALLA

1. **Intenta nuevamente el build**
   - EAS a veces tiene picos de carga

2. **Verifica app.json**
   - Asegúrate que sea JSON válido
   - Verifica que icon.png existe

3. **Limpia caché**
   ```powershell
   npm install
   npm start -- --clear
   ```

4. **Revisa los logs en Expo**
   - Haz click en el build fallido
   - Lee el mensaje de error completo

---

**Documento creado**: Diciembre 12, 2025
**Para**: Publicación en Google Play Store

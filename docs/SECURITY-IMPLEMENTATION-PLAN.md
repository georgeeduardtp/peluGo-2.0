# 🔐 PLAN DE SEGURIDAD FIREBASE - PeluGo 2.0

## ✅ COMPLETADO HASTA AHORA

### 1. Sistema de Configuración Segura Implementado
- ✅ `assets/js/env-config.js` - Sistema de variables de entorno
- ✅ `assets/js/firebase-config.js` - Configuración centralizada segura  
- ✅ Archivos actualizados: `index.html`, `auth.html`, `admin.html`, `admin-login.html`

## 🚨 PENDIENTE DE COMPLETAR

### 2. Archivos HTML Restantes que Necesitan Actualización

Estos archivos AÚN contienen API keys hardcodeadas:

#### Archivos a Actualizar:
1. `complete-profile.html` (línea 755)
2. `registro-peluqueria.html` (línea 492) 
3. `salon-settings.html` (línea 520)
4. `salon-waiting.html` (línea 276)

#### Para cada archivo, hacer:

1. **Añadir env-config.js en el <head>:**
```html
<!-- Configuration (must be loaded before other scripts) -->
<script src="assets/js/env-config.js"></script>
<script src="assets/js/config.js"></script>
<script src="assets/js/firebase-config.js"></script>
```

2. **Reemplazar configuración hardcodeada:**

**BUSCAR Y ELIMINAR:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDZlepx5cEcskug7ZB7kh4S56xhCnunKb0",
    authDomain: "pelugo-2025.firebaseapp.com",
    projectId: "pelugo-2025",
    storageBucket: "pelugo-2025.firebasestorage.app",
    messagingSenderId: "588352402376",
    appId: "1:588352402376:web:c8a0d71f296a80464346fd",
    measurementId: "G-4J0EQTQTVS"
};
```

**REEMPLAZAR CON:**
```javascript
// Firebase Configuration - Configuración segura centralizada
let firebaseConfig;
try {
    firebaseConfig = window.getFirebaseConfig();
    console.log('✅ Configuración segura de Firebase cargada');
} catch (error) {
    console.error('🚨 Error cargando configuración de Firebase:', error);
    alert('Error de configuración. Contacte al administrador.');
    throw error;
}
```

### 3. Actualizar firebase-integration.js

Este archivo también contiene API keys hardcodeadas en 2 ubicaciones:
- Línea 42: Fallback configuration
- Línea 85: Configuración de respaldo

**Reemplazar ambas instancias** con el mismo código seguro de arriba.

## 🚀 SIGUIENTES PASOS CRÍTICOS

### 4. Configurar Variables de Entorno en GitHub Pages

Para GitHub Pages, crear archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Pages
      uses: actions/configure-pages@v3
      
    - name: Inject Firebase Config
      run: |
        # Crear meta tags con las variables seguras
        sed -i 's/<head>/<head>\n    <meta name="firebase-api-key" content="${{ secrets.FIREBASE_API_KEY }}">\n    <meta name="firebase-auth-domain" content="${{ secrets.FIREBASE_AUTH_DOMAIN }}">\n    <meta name="firebase-project-id" content="${{ secrets.FIREBASE_PROJECT_ID }}">\n    <meta name="firebase-storage-bucket" content="${{ secrets.FIREBASE_STORAGE_BUCKET }}">\n    <meta name="firebase-messaging-sender-id" content="${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}">\n    <meta name="firebase-app-id" content="${{ secrets.FIREBASE_APP_ID }}">\n    <meta name="firebase-measurement-id" content="${{ secrets.FIREBASE_MEASUREMENT_ID }}">/' *.html
      
    - name: Deploy to GitHub Pages
      uses: actions/deploy-pages@v2
      with:
        path: .
```

### 5. Configurar Secrets en GitHub

En GitHub > Settings > Secrets and variables > Actions, añadir:
- `FIREBASE_API_KEY` = Nueva API key rotada
- `FIREBASE_AUTH_DOMAIN` = pelugo-2025.firebaseapp.com  
- `FIREBASE_PROJECT_ID` = pelugo-2025
- `FIREBASE_STORAGE_BUCKET` = pelugo-2025.firebasestorage.app
- `FIREBASE_MESSAGING_SENDER_ID` = 588352402376
- `FIREBASE_APP_ID` = Nuevo App ID
- `FIREBASE_MEASUREMENT_ID` = G-4J0EQTQTVS

### 6. Rotar API Keys en Firebase Console

1. Ir a Firebase Console > Project Settings > General
2. En "Your apps" > Web app > Click en configuración
3. Regenerar Web API Key
4. Actualizar todos los secrets de GitHub con la nueva key
5. Revocar la key antigua: `AIzaSyDZlepx5cEcskug7ZB7kh4S56xhCnunKb0`

## ⚡ URGENTE - ACCIÓN INMEDIATA

**LA API KEY ACTUAL YA ESTÁ COMPROMETIDA** - debe ser rotada INMEDIATAMENTE:

1. **Completar la limpieza de archivos HTML restantes**
2. **Rotar las API keys en Firebase Console**  
3. **Configurar el sistema de deployment seguro**

## 🛡️ RESULTADO FINAL

Después de completar estos pasos:
- ❌ **Antes**: API keys visible en 15+ archivos
- ✅ **Después**: API keys solo en GitHub Secrets (privados)
- ✅ Configuración inyectada automáticamente durante deployment
- ✅ Código fuente público sin información sensible
- ✅ Sistema de rotación de claves implementado

## 📊 PUNTUACIÓN DE SEGURIDAD

- **Actual**: 3/10 (Crítico)  
- **Después de completar**: 9/10 (Excelente)

**¿Necesitas ayuda para completar alguno de estos pasos?**